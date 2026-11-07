import { FileText, GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { formatBytes } from '../lib/utils';
import { useObjectUrl } from '../lib/hooks';
export function FileList({ files, onChange, disabled, thumbnails = {}, counts = {} }: { files: File[]; onChange: (files: File[])=>void; disabled?: boolean; thumbnails?: Record<string,string>; counts?: Record<string,number> }) {
  function move(from:number,to:number){if(to<0||to>=files.length||disabled)return;const next=[...files];const [file]=next.splice(from,1);next.splice(to,0,file);onChange(next);}
  return <div className="file-list">{files.map((file,i)=><div className="file-row" key={file.name+file.lastModified+i} draggable={!disabled&&files.length>1} onDragStart={e=>e.dataTransfer.setData('text/plain',String(i))} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from)&&from>=0&&from<files.length)move(from,i);}}>
    {files.length>1&&<GripVertical className="file-grip" size={15}/>}<Thumbnail file={file} src={thumbnails[file.name+file.size]}/><div className="file-detail"><strong>{file.name}</strong><small>{formatBytes(file.size)}{counts[file.name+file.size] ? ' · ' + counts[file.name+file.size] + ' pages' : ''}</small></div>{files.length>1&&<div className="file-order"><button aria-label={'Move '+file.name+' up'} disabled={disabled||i===0} onClick={()=>move(i,i-1)}><ChevronUp size={13}/></button><button aria-label={'Move '+file.name+' down'} disabled={disabled||i===files.length-1} onClick={()=>move(i,i+1)}><ChevronDown size={13}/></button></div>}<Button variant="ghost" size="icon" aria-label={'Remove '+file.name} disabled={disabled} onClick={()=>onChange(files.filter((_,n)=>n!==i))}><X size={16}/></Button>
  </div>)}</div>;
}
function Thumbnail({file,src}:{file:File;src?:string}){const url=useObjectUrl(file.type.startsWith('image/')?file:undefined);return <span className="file-thumb">{src||url?<img src={src||url} alt="" loading="lazy"/>:<FileText size={22}/>}</span>;}
