import { useState } from 'react';
import type { Tool } from '../../config/tools';
import { UploadZone } from '../../components/UploadZone';
import { Button } from '../../components/ui/button';
import { CopyButton, Results } from '../../components/ResultCard';
import { imageAccept } from '../../lib/image';
import { downloadBlob, type OutputFile } from '../../lib/utils';
export default function Base64Image({tool}:{tool:Tool}){
  const [text,setText]=useState(''),[error,setError]=useState(''),[outputs,setOutputs]=useState<OutputFile[]>([]);
  const encode=tool.slug==='image-to-base64';
  async function read(files:File[]){setError('');const reader=new FileReader();reader.onload=()=>setText(String(reader.result));reader.onerror=()=>setError('This image could not be read.');reader.readAsDataURL(files[0]);}
  async function decode(){setError('');try{const cleaned=text.trim(),match=cleaned.match(/^data:(image\/(?:png|jpeg|webp|gif|avif));base64,([a-zA-Z0-9+/=\s]+)$/);let data:string,type:string;if(match){type=match[1];data=match[2];}else if(/^[A-Za-z0-9+/=\s]+$/.test(cleaned)){type='image/png';data=cleaned;}else throw new Error('Paste a valid Base64 image or an image data URL. SVG and HTML are not accepted.');const binary=atob(data.replace(/\s/g,'')),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));if(!match){if(bytes[0]===255&&bytes[1]===216)type='image/jpeg';else if(String.fromCharCode(...bytes.slice(0,4))==='RIFF')type='image/webp';else if(String.fromCharCode(...bytes.slice(0,3))==='GIF')type='image/gif';}const blob=new Blob([bytes],{type});const bitmap=await createImageBitmap(blob);bitmap.close();setOutputs([{name:'decoded-image.'+(type==='image/jpeg'?'jpg':type.split('/')[1]),blob,preview:true}]);}catch(err){setError(err instanceof Error?err.message:'The Base64 image could not be decoded.');}}
  return <>{encode&&<UploadZone accept={imageAccept} label="Image files" onFiles={read}/>}<label className="editor-label" style={{marginTop:20}} htmlFor="base64-image-text">{encode?'Image data URL':'Base64 image input'}</label><textarea id="base64-image-text" className="code-area" value={text} onChange={e=>{setText(e.target.value);setOutputs([]);}} placeholder="data:image/png;base64,..." readOnly={encode}/><div className="output-actions">{encode?<><CopyButton text={text}/><Button size="sm" disabled={!text} onClick={()=>downloadBlob(new Blob([text],{type:'text/plain'}),'image-base64.txt')}>Download text</Button></>:<Button disabled={!text.trim()} onClick={decode}>Decode image</Button>}<Button variant="secondary" size="sm" onClick={()=>{setText('');setOutputs([]);setError('');}}>Clear</Button></div>{error&&<p className="error-message" role="alert">{error}</p>}<Results outputs={outputs} onReset={()=>{setText('');setOutputs([]);}}/></>;
}
