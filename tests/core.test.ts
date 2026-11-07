import { describe,it,expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { parsePages, splitGroups } from '../src/lib/pages';
import { base64Decode,base64Encode,convertCase,jsonError,slugify,textStats } from '../src/lib/text';
import { calendarAge,convertUnit,emi,generatePassword,hexColors } from '../src/lib/calculations';
import { qrPayload } from '../src/lib/qr';
import { categories,tools,popularSlugs,searchTools,getDirectToolUrl,parseSearchIntent } from '../src/config/tools';
import { metadata,schemas } from '../src/lib/seo';
describe('PDF page selection',()=>{
  it('supports ordered ranges, singleton pages and deduplication',()=>expect(parsePages('1-3, 5, 2, 8-10',10)).toEqual([0,1,2,4,7,8,9]));
  it('rejects inverted, malformed, fractional and out-of-range pages',()=>{for(const input of ['0','4-2','1,','2.5','1-8','abc'])expect(()=>parsePages(input,6)).toThrow();});
  it('handles all pages and grouped output files',()=>{expect(parsePages('',3)).toEqual([0,1,2]);expect(splitGroups('range','1-2; 5',5,1)).toEqual([[0,1],[4]]);expect(splitGroups('every','',5,2)).toEqual([[0,1],[2,3],[4]]);});
  it('round-trips copied pages without losing page dimensions',async()=>{const doc=await PDFDocument.create();doc.addPage([200,300]);doc.addPage([400,500]);const result=await PDFDocument.create();(await result.copyPages(doc,parsePages('2,1',2))).forEach(page=>result.addPage(page));const restored=await PDFDocument.load(await result.save());expect(restored.getPage(0).getSize()).toEqual({width:400,height:500});expect(restored.getPageCount()).toBe(2);});
});
describe('text and encoding',()=>{
  it('round-trips Unicode in Base64',()=>{const text='Hello 👋 नमस्ते café';expect(base64Decode(base64Encode(text))).toBe(text);expect(()=>base64Decode('%%%')).toThrow();});
  it('handles case, slugs and word counts',()=>{expect(convertCase('hello World','camelCase')).toBe('helloWorld');expect(convertCase('helloWorld today','snake_case')).toBe('hello_world_today');expect(slugify(' Café & More! ')).toBe('cafe-more');expect(textStats('One two.\n\nThree!')).toMatchObject({words:3,sentences:2,paragraphs:2});expect(textStats('').words).toBe(0);});
  it('reports JSON error line and column',()=>expect(jsonError('{\n"x": }',new Error('Unexpected token at position 7'))).toContain('Line 2, column 6'));
});
describe('calculations and randomness',()=>{
  it('handles zero interest and an amortizing loan',()=>{expect(emi(12000,0,12).payment).toBe(1000);expect(emi(500000,8.5,60).payment).toBeCloseTo(10258.26,1);expect(()=>emi(1,1,0)).toThrow();});
  it('converts absolute temperature and binary data sizes',()=>{expect(convertUnit(32,'Temperature','Fahrenheit','Celsius')).toBe(0);expect(convertUnit(1,'Data size','MiB','Bytes')).toBe(1048576);expect(convertUnit(1,'Length','Inches','Centimeters')).toBeCloseTo(2.54);});
  it('counts calendar ages and rejects reversed dates',()=>{expect(calendarAge('2000-01-15','2026-11-08')).toMatchObject({years:26,months:9,days:24});expect(calendarAge('2024-02-29','2025-03-01')).toMatchObject({years:1,months:0,days:1});expect(()=>calendarAge('2026-12-01','2026-11-01')).toThrow();});
  it('passwords include all requested sets and vary',()=>{const args={upper:true,lower:true,digits:true,symbols:true},a=generatePassword(32,args).password,b=generatePassword(32,args).password;expect(a).toHaveLength(32);for(const pattern of [/[A-Z]/,/[a-z]/,/\d/,/[!@#$%^&*()_+[\]{};:,.?=-]/])expect(a).toMatch(pattern);expect(a).not.toBe(b);expect(()=>generatePassword(16,{upper:false,lower:false,digits:false,symbols:false})).toThrow();});
  it('converts exact HEX colors',()=>expect(hexColors('#ff0000')).toMatchObject({rgb:'rgb(255, 0, 0)',hsl:'hsl(0, 100%, 50%)'}));
});
describe('QR payloads',()=>{
  it('escapes Wi-Fi delimiters and creates UPI payments',()=>{expect(qrPayload('WiFi',{value:'a;b',password:'a:b',security:'WPA'})).toBe('WIFI:T:WPA;S:a\\;b;P:a\\:b;H:false;;');expect(qrPayload('UPI payment',{value:'test@bank',name:'A B',amount:'10'})).toContain('am=10.00');});
  it('rejects non-web URLs and malformed phone values',()=>{expect(()=>qrPayload('URL',{value:'javascript:alert(1)'})).toThrow();expect(()=>qrPayload('Phone',{value:'abc'})).toThrow();});
});
describe('catalog and search metadata',()=>{
  it('has unique slugs and valid categories',()=>{expect(new Set(tools.map(t=>t.slug)).size).toBe(tools.length);for(const tool of tools){expect(categories.some(c=>c.id===tool.category)).toBe(true);expect(tool.component).toBeTruthy();expect(metadata('/'+tool.slug).title).toContain(tool.seoTitle||tool.name);}});
  it('makes popular tools, aliases and structured data discoverable',()=>{expect(popularSlugs.every(slug=>tools.some(t=>t.slug===slug))).toBe(true);expect(searchTools('50kb').some(t=>t.slug==='image-target-size')).toBe(true);expect(schemas('/pdf-merge').length).toBe(2);});
  it('correctly maps user search queries to direct tools and parameters',()=>{
    expect(getDirectToolUrl('online image compressor to 10 kb')).toBe('/image-target-size?target=10&unit=KB');
    expect(getDirectToolUrl('online pdf merger')).toBe('/pdf-merge');
    expect(getDirectToolUrl('image resize to 20 kb')).toBe('/image-dimensions-size?target=20&unit=KB');
    expect(getDirectToolUrl('compress image to 50kb')).toBe('/image-target-size?target=50&unit=KB');
    expect(getDirectToolUrl('jpg to pdf')).toBe('/image-to-pdf');
    expect(parseSearchIntent('compress to 10kb')).toEqual({target:10,unit:'KB'});
  });
});
