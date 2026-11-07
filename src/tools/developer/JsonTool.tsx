import { useState, type ReactNode } from 'react';
import { Download, Braces, CheckCircle2 } from 'lucide-react';
import type { Tool } from '../../config/tools';
import { Button } from '../../components/ui/button';
import { CopyButton, Progress } from '../../components/ResultCard';
import { SelectField } from '../../components/Fields';
import { useTask } from '../../lib/hooks';
import { downloadBlob } from '../../lib/utils';
import { jsonError } from '../../lib/text';
import { textJob } from '../../lib/worker';
const example={name:'ToolKitFree',free:true,features:['Private','Fast','No signup'],tools:53};
export default function JsonTool({tool}:{tool:Tool}) {
  const [input,setInput]=useState(''),[output,setOutput]=useState(''),[value,setValue]=useState<unknown>(),[indent,setIndent]=useState('2'),[view,setView]=useState('code'),[valid,setValid]=useState(false),task=useTask();
  async function format(minify=false){setValid(false);const result=await task.run((report,signal)=>textJob<{text:string;value:unknown}>({operation:'json',input,options:{indent,minify}},report,signal,15000));if(result){setOutput(result.text);setValue(result.value);setValid(true);}}
  return <><div className="editor-toolbar"><Button onClick={()=>format()} disabled={!input||task.busy}><Braces size={16}/>Format & validate</Button><Button variant="secondary" onClick={()=>format(true)} disabled={!input||task.busy}>Minify</Button><SelectField label="Indentation" value={indent} onChange={e=>setIndent(e.target.value)} options={[['2','2 spaces'],['4','4 spaces']]}/><Button variant="ghost" onClick={()=>{setInput(JSON.stringify(example));setValid(false);}}>Load example</Button><Button variant="ghost" onClick={()=>{setInput('');setOutput('');setValue(undefined);setValid(false);task.setError('');}}>Clear</Button></div><div className="editor-grid"><div><label htmlFor="json-input" className="editor-label">Your JSON<span>Paste or type below</span></label><textarea id="json-input" className="code-area" spellCheck={false} placeholder={'{\n  "hello": "world"\n}'} value={input} onChange={e=>{setInput(e.target.value);setValid(false);}}/></div><div><div className="editor-label"><span style={{color:'var(--text)',fontSize:12,fontWeight:600}}>Formatted result</span><div className="chip-group" style={{marginBottom:0}}><button className={'chip'+(view==='code'?' active':'')} onClick={()=>setView('code')}>Code</button><button className={'chip'+(view==='tree'?' active':'')} onClick={()=>setView('tree')}>Tree</button></div></div>{view==='tree'?<div className="json-tree">{value!==undefined?<JsonTree value={value} name="root"/>:'Format your JSON to explore its structure.'}</div>:<pre className="output-pre" aria-label="Formatted JSON">{output.length>200000?output:highlight(output)}</pre>}<div className="output-actions"><CopyButton text={output}/><Button variant="secondary" size="sm" disabled={!output} onClick={()=>downloadBlob(new Blob([output],{type:'application/json'}),'formatted.json')}><Download size={14}/>Download JSON</Button></div></div></div>{valid&&<p className="privacy-note" style={{justifyContent:'flex-start',color:'var(--green)'}}><CheckCircle2 size={14}/>Valid JSON · ready to use</p>}{task.busy&&<Progress value={task.progress} status={task.status} onCancel={task.cancel}/>}<p className="privacy-note">JSON is processed on your device. No API keys or data are uploaded.</p>{task.error&&<p className="error-message" role="alert">{jsonError(input,task.error)}</p>}</>;
}
function highlight(text:string):ReactNode[]{return text.split(/("(?:\\.|[^"\\])*"\s*:|"(?:\\.|[^"\\])*"|\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\btrue\b|\bfalse\b|\bnull\b)/g).map((part,i)=><span key={i} className={/^"/.test(part)?/:$/.test(part)?'json-key':'json-string':/^-?\d/.test(part)?'json-number':/^(true|false|null)$/.test(part)?'json-literal':''}>{part}</span>);}
function JsonTree({value,name,depth=0}:{value:unknown;name:string;depth?:number}){
  const [expanded,setExpanded]=useState(depth===0),[limit,setLimit]=useState(100);
  if(typeof value!=='object'||value===null)return <div className="json-leaf"><span className="json-key">{name}: </span>{JSON.stringify(value)}</div>;
  if(depth>30)return <div className="json-leaf">Deeply nested content. Use the code view to inspect this value.</div>;
  const entries=Object.entries(value);
  return <details open={expanded} onToggle={e=>setExpanded(e.currentTarget.open)}><summary><span className="json-key">{name}</span> {Array.isArray(value)?'['+entries.length+' items]':'{'+entries.length+' keys}'}</summary>{expanded&&entries.slice(0,limit).map(([key,v])=><JsonTree key={key} name={key} value={v} depth={depth+1}/>)}{expanded&&entries.length>limit&&<button className="chip" onClick={()=>setLimit(n=>n+100)}>Show 100 more</button>}</details>;
}
