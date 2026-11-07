import { useEffect, useState } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import type { Tool } from '../../config/tools';
import { Button } from '../../components/ui/button';
import { CopyButton, Progress } from '../../components/ResultCard';
import { Field, SelectField, NumberField, Checkbox } from '../../components/Fields';
import { downloadBlob } from '../../lib/utils';
import { textStats } from '../../lib/text';
import { textJob } from '../../lib/worker';
import { useTask } from '../../lib/hooks';
type DiffPart={value:string;added?:boolean;removed?:boolean};
const lorem='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
export default function TextTools({tool}:{tool:Tool}) {
  const slug=tool.slug,[input,setInput]=useState(''),[output,setOutput]=useState(''),[other,setOther]=useState(''),[mode,setMode]=useState(slug==='case-converter'?'UPPERCASE':slug==='sort-lines'?'A–Z':'Remove extra spaces'),[trim,setTrim]=useState(false),[ignoreCase,setIgnoreCase]=useState(false),[find,setFind]=useState(''),[replace,setReplace]=useState(''),[regex,setRegex]=useState(false),[paragraphs,setParagraphs]=useState(3),[diff,setDiff]=useState<DiffPart[]>([]),[stats,setStats]=useState(textStats(''));
  const task=useTask();
  useEffect(()=>{if(slug!=='word-counter')return;const ctrl=new AbortController();const timer=setTimeout(()=>{textJob<ReturnType<typeof textStats>>({operation:'word-counter',input},()=>{},ctrl.signal).then(setStats).catch(()=>{});},120);return()=>{clearTimeout(timer);ctrl.abort();};},[input,slug]);
  async function process(){
    if(slug==='lorem-ipsum'){if(paragraphs<1||paragraphs>200){task.setError('Choose between 1 and 200 paragraphs per batch.');return;}setOutput(Array.from({length:Math.floor(paragraphs)},()=>lorem).join('\n\n'));return;}
    const result=await task.run((report,signal)=>textJob<string|DiffPart[]>({operation:slug==='text-diff'?'diff':slug,input,options:{mode,trim,ignoreCase,find,replace,regex,other}},report,signal));
    if(result!==undefined){if(Array.isArray(result)){setDiff(result);setOutput(result.map(part=>part.value).join(''));}else setOutput(result);}
  }
  return <><div className="editor-toolbar">
    {slug==='case-converter'&&<SelectField label="Case style" value={mode} onChange={e=>setMode(e.target.value)} options={['UPPERCASE','lowercase','Title Case','Sentence case','camelCase','snake_case','kebab-case','PascalCase']}/>}
    {slug==='sort-lines'&&<SelectField label="Sort order" value={mode} onChange={e=>setMode(e.target.value)} options={['A–Z','Z–A','By length','Random']}/>}
    {slug==='clean-text'&&<SelectField label="Clean up" value={mode} onChange={e=>setMode(e.target.value)} options={['Remove extra spaces','Remove line breaks','Trim each line']}/>}
    {slug==='lorem-ipsum'&&<NumberField label="Paragraphs" min={1} max={200} value={paragraphs} onChange={e=>setParagraphs(Number(e.target.value))}/>}
    {slug==='remove-duplicate-lines'&&<><Checkbox label="Ignore case" checked={ignoreCase} onChange={e=>setIgnoreCase(e.target.checked)}/><Checkbox label="Ignore edge spaces" checked={trim} onChange={e=>setTrim(e.target.checked)}/></>}
    {slug!=='word-counter'&&<Button disabled={task.busy||(slug!=='lorem-ipsum'&&!input)} onClick={process}>{tool.name}<ArrowRight size={15}/></Button>}<Button variant="secondary" onClick={()=>{setInput('');setOther('');setOutput('');setDiff([]);task.setError('');}}>Clear</Button>
    </div>
    {slug==='find-replace'&&<><div className="field-row"><Field label="Find"><input value={find} onChange={e=>setFind(e.target.value)}/></Field><Field label="Replace with"><input value={replace} onChange={e=>setReplace(e.target.value)}/></Field></div><div className="editor-toolbar"><Checkbox label="Regular expression" checked={regex} onChange={e=>setRegex(e.target.checked)}/><Checkbox label="Ignore case" checked={ignoreCase} onChange={e=>setIgnoreCase(e.target.checked)}/></div></>}
    {slug==='word-counter'&&<div className="stat-grid">{[[stats.words,'Words'],[stats.characters,'Characters'],[stats.sentences,'Sentences'],[stats.paragraphs,'Paragraphs'],[Math.ceil(stats.readingMinutes*60)+'s','Reading time · 200 wpm']].map(([number,label])=><div className="stat-card" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>}
    <div className={slug==='word-counter'||slug==='lorem-ipsum'?'':'editor-grid'}>{slug!=='lorem-ipsum'&&<div className="editor-pane"><label htmlFor="text-input" className="editor-label">{slug==='text-diff'?'Original text':'Your text'}</label><textarea id="text-input" className="code-area" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste or type your text here…"/></div>}{slug==='text-diff'?<div className="editor-pane"><label htmlFor="other-text" className="editor-label">Updated text</label><textarea id="other-text" className="code-area" value={other} onChange={e=>setOther(e.target.value)} placeholder="Paste the second version…"/></div>:slug!=='word-counter'&&<div className="editor-pane"><label htmlFor="text-output" className="editor-label">Your result</label><textarea id="text-output" className="code-area" value={output} readOnly placeholder="Your result will appear here…"/><div className="output-actions"><CopyButton text={output}/><Button variant="secondary" size="sm" disabled={!output} onClick={()=>downloadBlob(new Blob([output],{type:'text/plain;charset=utf-8'}),tool.slug+'.txt')}><Download size={14}/>Download</Button></div></div>}</div>
    {slug==='text-diff'&&!!diff.length&&<div className="editor-grid" style={{marginTop:18}}><div><p className="editor-label">Original · removed text</p><pre className="output-pre">{diff.filter(part=>!part.added).map((part,i)=><span className={part.removed?'diff-removed':''} key={i}>{part.value}</span>)}</pre></div><div><p className="editor-label">Updated · added text</p><pre className="output-pre">{diff.filter(part=>!part.removed).map((part,i)=><span className={part.added?'diff-added':''} key={i}>{part.value}</span>)}</pre></div></div>}
    {task.busy&&<Progress value={task.progress} status={task.status} onCancel={task.cancel}/>}
    {task.error&&<p role="alert" className="error-message">{task.error}</p>}<p className="privacy-note">Your text stays in this browser. Nothing is uploaded.</p>
  </>;
}
