import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Tool } from '../../config/tools';
import { UploadZone } from '../../components/UploadZone';
import { FileList } from '../../components/FileList';
import { Results, Progress } from '../../components/ResultCard';
import { Button } from '../../components/ui/button';
import { Field, NumberField, SelectField, RangeField, Checkbox } from '../../components/Fields';
import { useTask } from '../../lib/hooks';
import { baseName, nextFrame, type OutputFile } from '../../lib/utils';
import { pdfJob } from '../../lib/worker';
import { openPdf, renderPage, pdfImages, compressPdf } from '../../lib/pdf-render';
import { parsePages } from '../../lib/pages';
import { prepareImage, imageAccept } from '../../lib/image';
export default function PdfTools({tool}:{tool:Tool}) {
  const [searchParams] = useSearchParams();
  const slug=tool.slug,isImages=slug==='image-to-pdf',multiple=slug==='pdf-merge'||isImages;
  const paramTarget = Number(searchParams.get('target') || searchParams.get('kb') || searchParams.get('size'));
  const paramUnit = (searchParams.get('unit') || (searchParams.get('mb') ? 'MB' : 'KB')).toUpperCase() === 'MB' ? 'MB' : 'KB';
  const paramRange = searchParams.get('range') || (slug==='pdf-delete-pages'?'1':'');
  const [files,setFiles]=useState<File[]>([]),[outputs,setOutputs]=useState<OutputFile[]>([]),[counts,setCounts]=useState<Record<string,number>>({}),[thumbs,setThumbs]=useState<Record<string,string>>({}),[pages,setPages]=useState<{index:number;src:string}[]>([]),[order,setOrder]=useState<number[]>([]),[previewLimit,setPreviewLimit]=useState(60),[previewBusy,setPreviewBusy]=useState(false);
  const [range,setRange]=useState(paramRange),[splitMode,setSplitMode]=useState(searchParams.get('splitMode')||'range'),[every,setEvery]=useState(Number(searchParams.get('every'))||1),[rotation,setRotation]=useState(90),[level,setLevel]=useState('medium'),[target,setTarget]=useState(paramTarget > 0 ? paramTarget : 0),[unit,setUnit]=useState(paramUnit),[format,setFormat]=useState('jpeg'),[quality,setQuality]=useState(90),[scale,setScale]=useState(1.5),[watermark,setWatermark]=useState('CONFIDENTIAL'),[opacity,setOpacity]=useState(25),[fontSize,setFontSize]=useState(36),[angle,setAngle]=useState(35),[start,setStart]=useState(1),[position,setPosition]=useState('bottom'),[total,setTotal]=useState(true),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[pageSize,setPageSize]=useState('a4'),[orientation,setOrientation]=useState('portrait'),[margin,setMargin]=useState(10);
  const task=useTask(),visual=['pdf-rotate','pdf-delete-pages','pdf-extract-pages','pdf-reorder'].includes(slug);
  const count=files[0]?counts[files[0].name+files[0].size]||0:0;
  useEffect(()=>{let cancelled=false;setThumbs({});setCounts({});setPages([]);setOrder([]);if(isImages||!files.length)return;setPreviewBusy(true);
    (async()=>{for(const file of files){if(cancelled)break;let doc;try{doc=await openPdf(file);if(cancelled)break;const num=doc.numPages,key=file.name+file.size;setCounts(old=>({...old,[key]:num}));if(visual){setOrder(Array.from({length:num},(_,i)=>i));const list=[];for(let i=0;i<Math.min(num,previewLimit);i++){if(cancelled)break;const canvas=await renderPage(doc,i,.26,100000);list.push({index:i,src:canvas.toDataURL('image/jpeg',.6)});canvas.width=canvas.height=0;if(i%8===0&&!cancelled)setPages([...list]);await nextFrame();}if(!cancelled)setPages(list);}else{const canvas=await renderPage(doc,0,.25,100000);const src=canvas.toDataURL('image/jpeg',.6);canvas.width=canvas.height=0;if(!cancelled)setThumbs(old=>({...old,[key]:src}));}}catch{/* The processing action supplies a friendly error, including password failures. */}finally{await doc?.loadingTask.destroy();}}
    if(!cancelled)setPreviewBusy(false);})();return()=>{cancelled=true;};
  },[files,isImages,visual,previewLimit]);
  function updateFiles(next:File[]){setFiles(next);setOutputs([]);task.setError('');}
  function addFiles(next:File[]){if(isImages&&files.length+next.length>20){task.setError('Choose up to 20 images per batch.');return;}updateFiles(multiple?[...files,...next]:next);}
  function selected(index:number){try{return parsePages(range,count).includes(index);}catch{return false;}}
  function togglePage(index:number){let indices:number[];try{indices=range?parsePages(range,count):[];}catch{indices=[];}setRange((indices.includes(index)?indices.filter(i=>i!==index):[...indices,index]).map(i=>i+1).join(', '));setOutputs([]);}
  function movePage(from:number,to:number){if(from<0||to<0||from>=order.length||to>=order.length)return;const next=[...order];const [value]=next.splice(from,1);next.splice(to,0,value);setOrder(next);}
  async function process(){
    if(!files.length)return;
    if(slug==='pdf-merge'&&files.length<2){task.setError('Choose at least two PDFs to merge.');return;}
    if(slug==='pdf-protect'&&(password.length<8||password!==confirm)){task.setError('Use a password of at least 8 characters and enter the same password twice.');return;}
    const result=await task.run(async(report,signal)=>{
      if(isImages){
        const {jsPDF}=await import('jspdf');let doc:InstanceType<typeof jsPDF>|undefined;
        for(let i=0;i<files.length;i++){
          signal.throwIfAborted();const blob=await prepareImage(files[i]),bitmap=await createImageBitmap(blob);const ratio=Math.min(1,Math.sqrt(24000000/(bitmap.width*bitmap.height)));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);const ctx=canvas.getContext('2d')!;ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
          let w=pageSize==='fit'?canvas.width*.75:pageSize==='a4'?595.28:612,h=pageSize==='fit'?canvas.height*.75:pageSize==='a4'?841.89:792;
          if(pageSize!=='fit'&&orientation==='landscape')[w,h]=[h,w];
          const m=pageSize==='fit'?0:Math.max(0,margin)*72/25.4;if(m*2>=Math.min(w,h))throw new Error('The margin is too large for this page size.');
          if(!doc)doc=new jsPDF({unit:'pt',format:[w,h],orientation:w>h?'landscape':'portrait',compress:true});else doc.addPage([w,h],w>h?'landscape':'portrait');
          const fit=Math.min((w-m*2)/canvas.width,(h-m*2)/canvas.height),iw=canvas.width*fit,ih=canvas.height*fit;
          doc.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',(w-iw)/2,(h-ih)/2,iw,ih);canvas.width=canvas.height=0;report((i+1)/files.length*100,'Adding image '+(i+1));await nextFrame();
        }return [{name:'images.pdf',blob:doc!.output('blob'),originalSize:files.reduce((sum,file)=>sum+file.size,0)}];
      }
      if(slug==='pdf-to-image')return pdfImages(files[0],{range,format,quality,scale},report,signal);
      if(slug==='pdf-compress')return compressPdf(files[0],{level,target:target*(unit==='MB'?1000000:1000)},report,signal);
      return pdfJob<OutputFile[]>({slug,files,options:{range,splitMode,every,rotation,order,watermark,opacity,fontSize,angle,start,position,total,password}},report,signal);
    });
    if(result)setOutputs(result);
  }
  function reset(){setFiles([]);setOutputs([]);setPassword('');setConfirm('');task.setError('');}
  return <><div className={files.length?'workspace-split':''}><div><UploadZone accept={isImages?imageAccept:'.pdf,application/pdf'} label={isImages?'JPG, PNG, WebP, AVIF or HEIC':'PDF files'} multiple={multiple} maxFiles={isImages?20:undefined} compact={files.length>0} onFiles={addFiles} disabled={task.busy}/>
    {files.length>0&&<FileList files={files} onChange={updateFiles} disabled={task.busy} counts={counts} thumbnails={thumbs}/>}
    {visual&&files.length>0&&<><p className="help-text">{slug==='pdf-reorder'?'Drag thumbnails or use arrow buttons to reorder pages.':'Click pages to select them, or type a page range.'}{previewBusy?' Loading previews…':''}</p><div className="page-grid">{order.map((index,i)=>{const page=pages.find(p=>p.index===index);if(!page)return null;return <div key={index} className={'page-tile'+(selected(index)?' selected':'')} draggable={slug==='pdf-reorder'&&!task.busy} onDragStart={e=>e.dataTransfer.setData('application/x-page',String(i))} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const data=e.dataTransfer.getData('application/x-page');if(data)movePage(Number(data),i);}}><img src={page.src} alt={'Page '+(index+1)} loading="lazy"/><button className="page-select" disabled={task.busy} aria-pressed={selected(index)} onClick={()=>togglePage(index)}>Page {index+1}{selected(index)&&slug!=='pdf-reorder'?' ✓':''}</button>{slug==='pdf-reorder'&&<div className="page-arrows"><button aria-label={'Move page '+(index+1)+' earlier'} disabled={task.busy||i===0} onClick={()=>movePage(i,i-1)}><ArrowLeft size={12}/></button><button aria-label={'Move page '+(index+1)+' later'} disabled={task.busy||i===order.length-1} onClick={()=>movePage(i,i+1)}><ArrowRight size={12}/></button></div>}</div>;})}</div>{count>pages.length&&!previewBusy&&<Button size="sm" variant="secondary" onClick={()=>setPreviewLimit(n=>n+60)}>Load more page previews</Button>}</>}
    </div>{files.length>0&&<div className="options-panel"><h3><SlidersHorizontal size={16}/>Make it yours</h3><fieldset disabled={task.busy} style={{border:0,padding:0,margin:0}}>
      {slug==='pdf-merge'&&<p className="help-text" style={{marginBottom:18}}>Drag files to set their order. Every page is included. Use the arrows for keyboard or touch ordering.</p>}
      {slug==='pdf-split'&&<><SelectField label="Split mode" value={splitMode} onChange={e=>setSplitMode(e.target.value)} options={[['range','Page ranges'],['each','Every page separately'],['every','Every N pages']]}/>{splitMode==='every'&&<NumberField label="Pages per file" min={1} step={1} value={every} onChange={e=>setEvery(Number(e.target.value))}/>}</>}
      {(['pdf-rotate','pdf-delete-pages','pdf-extract-pages','pdf-to-image','pdf-page-numbers','pdf-watermark'].includes(slug)||(slug==='pdf-split'&&splitMode==='range'))&&<Field label={slug==='pdf-delete-pages'?'Pages to delete':'Page selection'} help={slug==='pdf-split'?'Use 1-3, 5 for one file. Separate output groups with semicolons: 1-3; 4-6.':'Leave blank for all pages. Example: 1-3, 5, 8-10.'}><input value={range} onChange={e=>setRange(e.target.value)} placeholder="All pages"/></Field>}
      {slug==='pdf-rotate'&&<SelectField label="Rotate selected pages" value={rotation} onChange={e=>setRotation(Number(e.target.value))} options={[['90','90° clockwise'],['180','180°'],['270','90° counterclockwise']]}/>}
      {slug==='pdf-compress'&&<><SelectField label="Compression level" value={level} onChange={e=>setLevel(e.target.value)} options={[['low','Low · best image quality'],['medium','Medium · balanced'],['high','High · smallest file']]}/><div className="field-row"><NumberField label="Target size (optional)" min={0} value={target} onChange={e=>setTarget(Number(e.target.value))}/><SelectField label="Unit" value={unit} onChange={e=>setUnit(e.target.value)} options={['KB','MB']}/></div><div className="chip-group">{[200,500,1000].map(n=><button key={n} className="chip" onClick={()=>{setTarget(n);setUnit('KB');}}>{n===1000?'1 MB':n+' KB'}</button>)}</div><p className="help-text">0 means no size target. Smaller targets reduce image detail. The smallest result is offered if the target cannot be reached.</p></>}
      {isImages&&<><SelectField label="Page size" value={pageSize} onChange={e=>setPageSize(e.target.value)} options={[['a4','A4'],['letter','Letter'],['fit','Fit to image']]}/><SelectField label="Orientation" value={orientation} onChange={e=>setOrientation(e.target.value)} options={[['portrait','Portrait'],['landscape','Landscape']]}/><NumberField label="Margin (mm)" min={0} max={80} value={margin} onChange={e=>setMargin(Number(e.target.value))}/></>}
      {slug==='pdf-to-image'&&<><SelectField label="Image format" value={format} onChange={e=>setFormat(e.target.value)} options={[['jpeg','JPG'],['png','PNG']]}/><SelectField label="Resolution" value={scale} onChange={e=>setScale(Number(e.target.value))} options={[['1','72 DPI'],['1.5','108 DPI'],['2','144 DPI'],['3','216 DPI']]}/>{format==='jpeg'&&<RangeField label="JPG quality" min={10} max={100} value={quality} onChange={e=>setQuality(Number(e.target.value))}/>}</>}
      {slug==='pdf-page-numbers'&&<><NumberField label="Start numbering from" min={1} value={start} onChange={e=>setStart(Number(e.target.value))}/><SelectField label="Position" value={position} onChange={e=>setPosition(e.target.value)} options={[['bottom','Bottom center'],['top','Top center']]}/><Checkbox label="Include total page count" checked={total} onChange={e=>setTotal(e.target.checked)}/></>}
      {slug==='pdf-watermark'&&<><Field label="Your watermark text"><input maxLength={150} value={watermark} onChange={e=>setWatermark(e.target.value)}/></Field><RangeField label="Opacity (%)" min={5} max={100} value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/><NumberField label="Font size" min={8} max={150} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))}/><RangeField label="Angle" min={-90} max={90} value={angle} onChange={e=>setAngle(Number(e.target.value))}/><p className="help-text">Latin text is supported. This adds only the watermark you request.</p></>}
      {['pdf-protect','pdf-unlock'].includes(slug)&&<><Field label={slug==='pdf-unlock'?'Existing password':'New password'}><input type="password" autoComplete="off" value={password} onChange={e=>setPassword(e.target.value)}/></Field>{slug==='pdf-protect'&&<Field label="Confirm password"><input type="password" autoComplete="off" value={confirm} onChange={e=>setConfirm(e.target.value)}/></Field>}</>}
      <Button style={{marginTop:18}} onClick={process} disabled={task.busy||(slug==='pdf-merge'&&files.length<2)}>{task.busy?'Working…':tool.name}<ArrowRight size={15}/></Button></fieldset></div>}</div>
    {task.busy&&<Progress value={task.progress} status={task.status} onCancel={task.cancel}/>}
    {task.error&&<p className="error-message" role="alert">{task.error}</p>}<Results outputs={outputs} onReset={reset}/>
  </>;
}
