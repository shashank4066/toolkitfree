import { useEffect, useState } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import type { Tool } from '../../config/tools';
import { Button } from '../../components/ui/button';
import { CopyButton, Progress } from '../../components/ResultCard';
import { Field, SelectField, NumberField } from '../../components/Fields';
import { useTask } from '../../lib/hooks';
import { base64Encode, base64Decode } from '../../lib/text';
import { downloadBlob } from '../../lib/utils';
import { textJob } from '../../lib/worker';
import { hexColors } from '../../lib/calculations';
type Match={index:number;text:string;groups:string[]};
export default function DeveloperTools({tool}:{tool:Tool}) {
  const slug=tool.slug,[input,setInput]=useState(slug==='color-converter'?'#4f46e5':''),[output,setOutput]=useState(''),[mode,setMode]=useState(slug==='json-csv'?'JSON to CSV':slug==='xml-yaml'?'Format XML':'Encode'),[language,setLanguage]=useState('javascript'),[action,setAction]=useState('beautify'),[pattern,setPattern]=useState('\\b\\w+\\b'),[flags,setFlags]=useState('g'),[matches,setMatches]=useState<Match[]>([]),[count,setCount]=useState(1),[algorithm,setAlgorithm]=useState('SHA-256'),[timeUnit,setTimeUnit]=useState('seconds');
  const task=useTask();
  useEffect(()=>{if(slug!=='regex-tester')return;const ctrl=new AbortController();const timer=setTimeout(()=>{if(!pattern){setMatches([]);return;}textJob<Match[]>({operation:'regex',input,options:{pattern,flags}},()=>{},ctrl.signal).then(result=>{setMatches(result);task.setError('');}).catch(err=>{if(!ctrl.signal.aborted){setMatches([]);task.setError(err.message);}});},250);return()=>{clearTimeout(timer);ctrl.abort();};},[slug,input,pattern,flags]);
  async function process(){
    const result=await task.run(async(report,signal)=>{
      if(slug==='json-csv'){
        const {default:Papa}=await import('papaparse');
        if(mode==='JSON to CSV'){const value=JSON.parse(input);if(!Array.isArray(value)||value.some(v=>typeof v!=='object'||v===null||Array.isArray(v)))throw new Error('Use an array of flat JSON objects, for example [{"name":"Alex","age":25}].');return Papa.unparse(value,{escapeFormulae:true});}
        const parsed=Papa.parse(input,{header:true,skipEmptyLines:'greedy'});if(parsed.errors.length)throw new Error(parsed.errors.map(e=>'Row '+((e.row??0)+1)+': '+e.message).join('\n'));return JSON.stringify(parsed.data,null,2);
      }
      if(slug==='base64')return mode==='Encode'?base64Encode(input):base64Decode(input);
      if(slug==='url-encoder')return mode==='Encode'?encodeURIComponent(input):decodeURIComponent(input);
      if(slug==='code-formatter'){
        if(action==='beautify')return textJob<string>({operation:'beautify',input,options:{language}},report,signal,15000);
        if(language==='javascript')return textJob<string>({operation:'js-minify',input},report,signal,15000);
        if(language==='css'){const css=await import('css-tree');return css.generate(css.parse(input));}
        return minifyHtml(input);
      }
      if(slug==='uuid-generator'){if(!Number.isInteger(count)||count<1||count>1000)throw new Error('Choose between 1 and 1,000 UUIDs per batch.');return Array.from({length:count},()=>crypto.randomUUID()).join('\n');}
      if(slug==='hash-generator'){
        if(algorithm==='MD5'){const {md5}=await import('hash-wasm');return md5(input);}
        const bytes=await crypto.subtle.digest(algorithm,new TextEncoder().encode(input));return Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,'0')).join('');
      }
      if(slug==='jwt-decoder'){
        const parts=input.trim().split('.');if(parts.length!==3)throw new Error('A signed JWT has three dot-separated parts.');
        const decode=(part:string)=>JSON.parse(base64Decode(part.replace(/-/g,'+').replace(/_/g,'/')));
        return JSON.stringify({header:decode(parts[0]),payload:decode(parts[1]),signatureVerified:false},null,2);
      }
      if(slug==='timestamp-converter'){
        const trimmed=input.trim();let date:Date;
        if(/^-?\d+(?:\.\d+)?$/.test(trimmed))date=new Date(Number(trimmed)*(timeUnit==='seconds'?1000:1));else{if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(trimmed))throw new Error('Use a Unix number or an ISO date with timezone, such as 2026-01-01T00:00:00Z.');date=new Date(trimmed);}
        if(!Number.isFinite(date.getTime()))throw new Error('Enter a valid timestamp or ISO date.');
        return 'UTC: '+date.toISOString()+'\nLocal: '+date.toString()+'\nUnix seconds: '+Math.floor(date.getTime()/1000)+'\nUnix milliseconds: '+date.getTime();
      }
      if(slug==='color-converter'){const value=parseColor(input);const colors=hexColors(value);return colors.hex+'\n'+colors.rgb+'\n'+colors.hsl;}
      if(slug==='xml-yaml'){
        if(mode==='YAML to JSON'){const {parse}=await import('yaml');return JSON.stringify(parse(input,{maxAliasCount:100}),null,2);}
        if(mode==='JSON to YAML'){const {stringify}=await import('yaml');return stringify(JSON.parse(input));}
        const xml=new DOMParser().parseFromString(input,'application/xml');if(xml.querySelector('parsererror'))throw new Error(xml.querySelector('parsererror')!.textContent||'Invalid XML.');
        return textJob<string>({operation:'beautify',input:new XMLSerializer().serializeToString(xml),options:{language:'html'}},report,signal);
      }
      return '';
    });if(result!==undefined)setOutput(result);
  }
  const noInput=slug==='uuid-generator',isRegex=slug==='regex-tester';
  return <><div className="editor-toolbar">
    {['json-csv','base64','url-encoder','xml-yaml'].includes(slug)&&<SelectField label="Operation" value={mode} onChange={e=>setMode(e.target.value)} options={slug==='json-csv'?['JSON to CSV','CSV to JSON']:slug==='xml-yaml'?['Format XML','YAML to JSON','JSON to YAML']:['Encode','Decode']}/>}
    {slug==='code-formatter'&&<><SelectField label="Language" value={language} onChange={e=>setLanguage(e.target.value)} options={[['javascript','JavaScript'],['html','HTML'],['css','CSS']]}/><SelectField label="Action" value={action} onChange={e=>setAction(e.target.value)} options={[['beautify','Beautify'],['minify','Minify']]}/></>}
    {slug==='hash-generator'&&<SelectField label="Algorithm" value={algorithm} onChange={e=>setAlgorithm(e.target.value)} options={['SHA-256','SHA-1','MD5']}/>}
    {noInput&&<NumberField label="Number of UUIDs" min={1} max={1000} value={count} onChange={e=>setCount(Number(e.target.value))}/>}
    {slug==='timestamp-converter'&&<><SelectField label="Timestamp input unit" value={timeUnit} onChange={e=>setTimeUnit(e.target.value)} options={['seconds','milliseconds']}/><Button variant="secondary" onClick={()=>setInput(String(timeUnit==='seconds'?Math.floor(Date.now()/1000):Date.now()))}>Use current time</Button></>}
    {!isRegex&&<Button disabled={task.busy||(!noInput&&!input)} onClick={process}>{noInput?'Generate UUIDs':slug==='hash-generator'?'Generate hash':slug==='jwt-decoder'?'Decode token':'Convert'}<ArrowRight size={15}/></Button>}<Button variant="ghost" onClick={()=>{setInput('');setOutput('');task.setError('');}}>Clear</Button></div>
    {slug==='code-formatter'&&language==='html'&&action==='minify'&&<p className="notice">HTML minification removes comments and safely redundant document whitespace. Text, scripts and preformatted whitespace are preserved.</p>}
    {slug==='json-csv'&&<p className="help-text" style={{marginBottom:15}}>Use flat objects with matching keys. CSV is RFC-style quoted; formula-like values are escaped to help prevent spreadsheet formula injection.</p>}
    {isRegex&&<div className="field-row"><Field label="Regular expression"><input value={pattern} onChange={e=>setPattern(e.target.value)} spellCheck={false}/></Field><Field label="Flags" help="g, i, m, s, u, y or d"><input value={flags} onChange={e=>setFlags(e.target.value)} spellCheck={false}/></Field></div>}
    {slug==='color-converter'&&<Field label="Pick a color"><input type="color" value={/^#[a-f0-9]{6}$/i.test(input)?input:'#4f46e5'} onChange={e=>setInput(e.target.value)}/></Field>}
    <div className={noInput?'':'editor-grid'}>{!noInput&&<div className="editor-pane"><label htmlFor="dev-input" className="editor-label">Input</label><textarea id="dev-input" className="code-area" spellCheck={false} value={input} onChange={e=>setInput(e.target.value)} placeholder={slug==='timestamp-converter'?'Unix timestamp or 2026-01-01T00:00:00Z':slug==='color-converter'?'#4f46e5, rgb(79, 70, 229), or hsl(243, 75%, 59%)':'Paste or type your input…'}/></div>}<div className="editor-pane"><p className="editor-label">{isRegex?matches.length+' matches (maximum 10,000 shown)':'Result'}</p>{isRegex?<pre className="output-pre" aria-live="polite">{renderMatches(input,matches)}</pre>:<textarea className="code-area" aria-label="Result" readOnly value={output} placeholder="Your result will appear here…"/>}{!isRegex&&<div className="output-actions"><CopyButton text={output}/><Button variant="secondary" size="sm" disabled={!output} onClick={()=>downloadBlob(new Blob([output],{type:'text/plain;charset=utf-8'}),slug+(slug==='json-csv'?(mode==='JSON to CSV'?'.csv':'.json'):'.txt'))}><Download size={14}/>Download</Button></div>}</div></div>
    {task.busy&&<Progress value={task.progress} status={task.status} onCancel={task.cancel}/>}
    {task.error&&<p role="alert" className="error-message">{task.error}</p>}<p className="privacy-note">Everything stays in your browser. Your input is never uploaded.</p>
  </>;
}
function renderMatches(input:string,matches:Match[]){let at=0;const parts=[];for(let i=0;i<matches.length;i++){const match=matches[i];parts.push(<span key={'t'+i}>{input.slice(at,match.index)}</span>);parts.push(<mark key={'m'+i} title={'Match '+(i+1)}>{match.text||'▏'}</mark>);at=match.index+match.text.length;}parts.push(<span key="end">{input.slice(at)}</span>);return parts;}
function minifyHtml(input:string){
  const full=/<(?:!doctype|html|head|body)[\s>]/i.test(input),doc=new DOMParser().parseFromString(input,'text/html');
  const walker=doc.createTreeWalker(doc,NodeFilter.SHOW_COMMENT);const remove:Node[]=[];while(walker.nextNode()){if(!/^\[if|<!\[endif/.test(walker.currentNode.textContent||''))remove.push(walker.currentNode);}remove.forEach(node=>node.parentNode?.removeChild(node));
  for(const parent of [doc.documentElement,doc.head])for(const child of Array.from(parent.childNodes))if(child.nodeType===3&&!child.textContent?.trim())parent.removeChild(child);
  return full?(doc.doctype?'<!DOCTYPE html>':'')+doc.documentElement.outerHTML:doc.body.innerHTML;
}
function parseColor(input:string){if(/^#[a-f0-9]{6}$/i.test(input))return input;if(/^#[a-f0-9]{3}$/i.test(input))return '#'+input.slice(1).split('').map(c=>c+c).join('');if(!/^(rgb|hsl)a?\(/i.test(input)||!CSS.supports('color',input))throw new Error('Enter a valid HEX, RGB or HSL color.');const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d')!;ctx.fillStyle=input;ctx.fillRect(0,0,1,1);const [r,g,b]=ctx.getImageData(0,0,1,1).data;return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');}
