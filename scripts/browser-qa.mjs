import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const fixtureDir = process.env.QA_DIST_DIR ? path.resolve(process.env.QA_DIST_DIR) : null;
const base = process.env.QA_BASE_URL || (fixtureDir ? 'https://toolkitfree.test' : 'http://127.0.0.1:4173');
const out=path.resolve('.qa');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.QA_BROWSER_PATH?{executablePath:process.env.QA_BROWSER_PATH}:{})});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
  acceptDownloads: true,
  serviceWorkers: fixtureDir ? 'block' : 'allow',
});
if (fixtureDir) {
  // Serve build fixtures through Playwright on hosts that cannot open a port.
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.woff2': 'font/woff2' };
  await context.route(base + '/**', async route => {
    const requested = decodeURIComponent(new URL(route.request().url()).pathname);
    let file = path.resolve(fixtureDir, '.' + requested);
    if (file !== fixtureDir && !file.startsWith(fixtureDir + path.sep)) {
      await route.abort();
      return;
    }
    if ((await fs.stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html');
    if (!path.extname(file)) file = path.join(fixtureDir, '404.html');
    await route.fulfill({ path: file, contentType: types[path.extname(file)] || 'application/octet-stream' })
      .catch(() => route.fulfill({ status: 404, body: 'Fixture not found' }));
  });
  // Inspect the generated Blob without an operating-system download in fixture mode.
  await context.addInitScript(() => {
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download && this.href.startsWith('blob:')) {
        window.fixtureDownload = { name: this.download, bytes: fetch(this.href).then(response => response.arrayBuffer()) };
        return;
      }
      click.call(this);
    };
  });
}
const page=await context.newPage(),errors=[],checks=[];
page.setDefaultTimeout(9000);
page.on('pageerror',error=>errors.push({url:page.url(),message:error.message}));
const test=async(name,fn)=>{try{await fn();checks.push({name,pass:true});console.log('PASS '+name);}catch(error){checks.push({name,pass:false,error:error.message});console.log('FAIL '+name+': '+error.message);}};
const goto=async(slug)=>{await page.goto(base+'/'+slug);await page.locator('h1').waitFor();};
const upload=async(files)=>{await page.locator('input[type=file]').first().setInputFiles(files);};
const result=async()=>{await page.getByRole('heading',{name:'Downloads',exact:true}).waitFor({timeout:15000});};
async function downloadArtifact(button) {
  if (fixtureDir) {
    await page.evaluate(() => { window.fixtureDownload = null; });
    await button.click();
    await page.waitForFunction(() => window.fixtureDownload !== null);
    const output = await page.evaluate(async () => {
      const download = window.fixtureDownload;
      const bytes = new Uint8Array(await download.bytes);
      let binary = '';
      for (let offset = 0; offset < bytes.length; offset += 8192) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
      }
      return { name: download.name, base64: btoa(binary) };
    });
    const dest = path.join(out, output.name);
    const bytes = Buffer.from(output.base64, 'base64');
    await fs.writeFile(dest, bytes);
    return { dest, bytes };
  }

  const pending = page.waitForEvent('download');
  await button.click();
  const file = await pending;
  const dest = path.join(out, file.suggestedFilename());
  await file.saveAs(dest);
  return { dest, bytes: await fs.readFile(dest) };
}
const download = (index = 0) => downloadArtifact(page.getByRole('button', { name: 'Download', exact: true }).nth(index));
const countPdf=async bytes=>(await PDFDocument.load(bytes)).getPageCount();
await goto('');
const image=await page.evaluate(async()=>{const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;const ctx=canvas.getContext('2d');const gradient=ctx.createLinearGradient(0,0,1200,800);gradient.addColorStop(0,'#4f46e5');gradient.addColorStop(1,'#14b889');ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,800);ctx.font='bold 72px sans-serif';ctx.fillStyle='white';ctx.fillText('ToolKitFree sample',80,380);return canvas.toDataURL('image/png').split(',')[1];});
const imagePath=path.join(out,'sample.png');await fs.writeFile(imagePath,Buffer.from(image,'base64'));
const pdf=await PDFDocument.create();for(let i=1;i<=3;i++){const p=pdf.addPage([400,500]);p.drawText('Sample page '+i,{x:60,y:250,size:24});}
const pdfPath=path.join(out,'three-pages.pdf');await fs.writeFile(pdfPath,await pdf.save());
const pdf2=await PDFDocument.create();pdf2.addPage([200,300]).drawText('Extra page');const pdfPath2=path.join(out,'one-page.pdf');await fs.writeFile(pdfPath2,await pdf2.save());

await test('Desktop homepage and accessibility',async()=>{await page.screenshot({path:path.join(out,'home-desktop.png'),fullPage:true});const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();await fs.writeFile(path.join(out,'axe-home.json'),JSON.stringify(scan.violations,null,2));assert.equal(scan.violations.length,0,scan.violations.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(' ')).join(',')).join('\n'));});
await test('Global search and dedicated route', async () => {
  const search = page.getByRole('combobox', { name: 'Search tools' });
  await search.fill('merge');
  await search.press('ArrowDown');
  await search.press('Enter');
  await page.waitForURL('**/pdf-merge');
  await page.waitForFunction(() => document.title.includes('Merge PDF'));
});
await test('Directory marks only the selected category', async () => {
  await goto('all-tools?category=image');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'Image', exact: true }).waitFor();
  assert.equal(await nav.locator('[aria-current="page"]').count(), 1);
  assert.equal(await nav.locator('[aria-current="page"]').innerText(), 'Image');
  assert.equal(await page.locator('.tool-grid .tool-card:not(.category-image)').count(), 0);
});
await test('Clipboard paste adds to the current PDF batch once', async () => {
  await goto('pdf-merge');
  await upload(pdfPath);
  await page.locator('.file-row').first().waitFor();
  const bytes = Buffer.from(await fs.readFile(pdfPath2)).toString('base64');
  const paste = (selector, name) => page.evaluate(({ selector, name, bytes }) => {
    const data = new DataTransfer();
    const contents = Uint8Array.from(atob(bytes), char => char.charCodeAt(0));
    data.items.add(new File([contents], name, { type: 'application/pdf' }));
    document.querySelector(selector).dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: data,
    }));
  }, { selector, name, bytes });
  await paste('body', 'first-paste.pdf');
  await page.getByText('first-paste.pdf', { exact: true }).waitFor();
  await paste('.upload-zone', 'second-paste.pdf');
  await page.getByText('second-paste.pdf', { exact: true }).waitFor();
  assert.equal(await page.locator('.file-row').count(), 3);
});
await test('Quick task presets stay set after reading the image', async () => {
  await goto('');
  await page.getByRole('link', { name: 'Compress an image to 50 KB', exact: true }).click();
  await page.waitForURL('**/image-target-size/?target=50&unit=KB');
  await upload(imagePath);
  await page.getByAltText('Original image preview').waitFor();
  assert.equal(await page.getByLabel('Target file size', { exact: true }).inputValue(), '50');
  await goto('image-dimensions-size?width=413&height=531&mb=0.05');
  await upload(imagePath);
  await page.getByAltText('Original image preview').waitFor();
  assert.equal(await page.getByLabel('Width (px)', { exact: true }).inputValue(), '413');
  assert.equal(await page.getByLabel('Height (px)', { exact: true }).inputValue(), '531');
  assert.equal(await page.getByLabel('Target file size', { exact: true }).inputValue(), '0.05');
  assert.equal(await page.getByLabel('Unit', { exact: true }).inputValue(), 'MB');
});
await test('Merge PDF outputs four pages',async()=>{await goto('pdf-merge');await upload([pdfPath,pdfPath2]);await page.getByRole('button',{name:'Merge PDF',exact:true}).click();await result();const file=await download();assert.equal(await countPdf(file.bytes),4);});
await test('Split PDF selected range',async()=>{await goto('pdf-split');await upload(pdfPath);await page.getByLabel('Page selection',{exact:true}).fill('1,3');await page.getByRole('button',{name:'Split PDF',exact:true}).click();await result();assert.equal(await countPdf((await download()).bytes),2);});
await test('Split PDF every page and ZIP', async () => {
  await page.getByLabel('Split mode').selectOption('each');
  await page.getByRole('button', { name: 'Split PDF', exact: true }).click();
  await result();
  assert.equal(await page.locator('.result-card').count(), 3);
  const { bytes } = await downloadArtifact(page.getByRole('button', { name: 'Download all as ZIP' }));
  const { default: JSZip } = await import('jszip');
  assert.equal(Object.keys((await JSZip.loadAsync(bytes)).files).length, 3);
});
await test('Image compression meets exact 50 KB target',async()=>{await goto('image-target-size');await upload(imagePath);await page.getByRole('button',{name:'50 KB',exact:true}).click();await page.getByRole('button',{name:'Compress to KB / MB',exact:true}).click();await result();const file=await download();assert.ok(file.bytes.length<=50000);});
await test('Dedicated image compressor enforces the 100 KB limit', async () => {
  await goto('');
  await page.getByRole('link', { name: 'Compress an image to 100 KB', exact: true }).click();
  await page.waitForURL('**/compress-image-to-100kb/');
  await page.waitForFunction(() => document.querySelector('link[rel="canonical"]')?.href.endsWith('/compress-image-to-100kb/'));

  await goto('compress-image-to-100kb/?target=0.001&unit=KB');
  await upload(imagePath);
  await page.getByRole('button', { name: 'Compress to 100 KB', exact: true }).click();
  await result();
  const file = await download();
  assert.ok(file.bytes.length > 1 && file.bytes.length <= 100000);
  await page.getByText('Within your size target.', { exact: false }).waitFor();
});
await test('Image resize produces exact dimensions',async()=>{await goto('image-resizer');await upload(imagePath);await page.getByLabel('Width (px)',{exact:true}).fill('600');await page.getByRole('button',{name:'Resize Image',exact:true}).click();await result();const file=await download();const dims=await page.evaluate(async base64=>{const raw=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const image=await createImageBitmap(new Blob([raw]));const result={w:image.width,h:image.height};image.close();return result;},file.bytes.toString('base64'));assert.deepEqual(dims,{w:600,h:400});});
await test('Image to PDF page creation',async()=>{await goto('image-to-pdf');await upload(imagePath);await page.getByRole('button',{name:'Image to PDF',exact:true}).click();await result();assert.equal(await countPdf((await download()).bytes),1);});
await test('JSON formatter validates, formats, flags errors',async()=>{await goto('json-formatter');await page.getByLabel('Your JSON').fill('{"hello":true,"n":1}');await page.getByRole('button',{name:'Format & validate'}).click();await page.getByText('Valid JSON · ready to use').waitFor();assert.equal(JSON.parse(await page.getByLabel('Formatted JSON').innerText()).hello,true);await page.getByLabel('Your JSON').fill('{"hello":}');await page.getByRole('button',{name:'Format & validate'}).click();await page.getByRole('alert').waitFor();});
await test('PDF rendering and compression',async()=>{await goto('pdf-to-image');await upload(pdfPath);await page.getByLabel('Page selection',{exact:true}).fill('2');await page.getByRole('button',{name:'PDF to Image',exact:true}).click();await result();assert.ok((await download()).bytes.length>1000);await goto('pdf-compress');await upload(pdfPath);await page.getByRole('button',{name:'Compress PDF',exact:true}).click();await result();assert.equal(await countPdf((await download()).bytes),3);});
await test('PDF page rotation, deletion and order',async()=>{await goto('pdf-rotate');await upload(pdfPath);await page.getByLabel('Page selection',{exact:true}).fill('2');await page.getByRole('button',{name:'Rotate PDF',exact:true}).click();await result();const rotated=await PDFDocument.load((await download()).bytes);assert.equal(rotated.getPage(1).getRotation().angle,90);await goto('pdf-delete-pages');await upload(pdfPath);await page.getByRole('button',{name:'Delete PDF Pages',exact:true}).click();await result();assert.equal(await countPdf((await download()).bytes),2);await goto('pdf-reorder');await upload(pdfPath);await page.getByRole('button',{name:'Move page 2 earlier'}).waitFor();await page.getByRole('button',{name:'Move page 2 earlier'}).click();await page.getByRole('button',{name:'Reorder PDF Pages',exact:true}).click();await result();assert.equal(await countPdf((await download()).bytes),3);});
let protectedPath;
await test('Password protection and unlock preserve pages',async()=>{await goto('pdf-protect');await upload(pdfPath);await page.getByLabel('New password',{exact:true}).fill('test-Only-4Q!');await page.getByLabel('Confirm password',{exact:true}).fill('test-Only-4Q!');await page.getByRole('button',{name:'Protect PDF',exact:true}).click();await result();const saved=await download();protectedPath=saved.dest;assert.ok(saved.bytes.includes(Buffer.from('/Encrypt')));await goto('pdf-unlock');await upload(protectedPath);await page.getByLabel('Existing password',{exact:true}).fill('test-Only-4Q!');await page.getByRole('button',{name:'Unlock PDF',exact:true}).click();await result();assert.equal(await countPdf((await download()).bytes),3);});
await test('QR code PNG and SVG generation',async()=>{await goto('qr-generator');await page.getByLabel('Website address',{exact:true}).fill('https://example.com');await page.getByRole('button',{name:'Generate QR code'}).click();await result();assert.equal(await page.locator('.result-card').count(),2);assert.equal((await download(0)).bytes.subarray(1,4).toString(),'PNG');assert.match((await download(1)).bytes.toString(),/<svg/);});
await test('Barcode and secure password tools',async()=>{await goto('barcode-generator');await page.getByRole('button',{name:'Generate',exact:true}).click();await result();assert.match((await download()).bytes.toString(),/<svg/);await goto('password-generator');await page.getByRole('button',{name:'Generate',exact:true}).click();assert.equal((await page.locator('.password-output').innerText()).length,20);});
await test('Developer encoding and formatting',async()=>{await goto('base64');await page.getByLabel('Input',{exact:true}).fill('Hello 🌍');await page.getByRole('button',{name:'Convert',exact:true}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Result"]').value==='SGVsbG8g8J+MjQ==');await goto('code-formatter');await page.getByLabel('Input',{exact:true}).fill('function hello(){return 42;}');await page.getByRole('button',{name:'Convert',exact:true}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Result"]').value.includes('return 42'));await goto('hash-generator');await page.getByLabel('Input',{exact:true}).fill('abc');await page.getByRole('button',{name:'Generate hash'}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Result"]').value.startsWith('ba7816bf'));});
await test('Text tools and unit calculator',async()=>{await goto('case-converter');await page.getByLabel('Your text',{exact:true}).fill('Hello World');await page.getByRole('button',{name:'Case Converter',exact:true}).click();await page.waitForFunction(()=>document.getElementById('text-output').value==='HELLO WORLD');await goto('unit-converter');await page.getByLabel('Measurement',{exact:true}).selectOption('Temperature');await page.getByLabel('Value',{exact:true}).fill('0');await page.getByRole('button',{name:'Calculate',exact:true}).click();await page.getByText('32 Fahrenheit',{exact:true}).waitFor();});
await test('Mobile layout and dark mode',async()=>{await page.setViewportSize({width:390,height:844});await goto('');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:path.join(out,'home-mobile.png'),fullPage:true});await page.getByRole('button',{name:'Switch to dark mode'}).click();assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));await page.screenshot({path:path.join(out,'home-dark.png')});await page.reload();assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));await goto('image-target-size');await upload(imagePath);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:path.join(out,'tool-mobile.png'),fullPage:true});});
if (!fixtureDir) {
  await test('Offline JSON tool after first use',async()=>{await page.setViewportSize({width:1280,height:900});await goto('json-formatter');await page.getByLabel('Your JSON').fill('{"offline":true}');await page.getByRole('button',{name:'Format & validate'}).click();await page.getByText('Valid JSON · ready to use').waitFor();await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload();await page.getByLabel('Your JSON').fill('{"stillWorks":true}');await page.getByRole('button',{name:'Format & validate'}).click();await page.getByText('Valid JSON · ready to use').waitFor();await context.setOffline(false);});
}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
await browser.close();
console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,errors},null,2));
if(checks.some(c=>!c.pass)||errors.length)process.exitCode=1;
