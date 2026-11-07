import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { parsePages, splitGroups } from '../lib/pages';
type Job={slug:string;files:File[];options:Record<string,any>};
const report=(percent:number,message:string)=>self.postMessage({type:'progress',percent,message});
self.onmessage=async(e:MessageEvent<Job>)=>{
  try { const result=await process(e.data);self.postMessage({type:'done',result}); }
  catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});}
};
async function process({slug,files,options:o}:Job){
  if(slug==='pdf-protect'||slug==='pdf-unlock'){
    const {default:createModule}=await import('@neslinesli93/qpdf-wasm');
    const {default:wasmUrl}=await import('@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url');
    const messages:string[]=[];
    const module=await createModule({locateFile:()=>wasmUrl,noInitialRun:true,print:()=>{},printErr:(message:string)=>messages.push(message)});
    module.FS.writeFile('/input.pdf',new Uint8Array(await files[0].arrayBuffer()));
    if(!o.password)throw new Error('Enter a password first.');
    report(35,slug==='pdf-protect'?'Encrypting locally…':'Opening with your password…');
    const owner=crypto.randomUUID()+crypto.randomUUID();
    const args=slug==='pdf-protect'?['/input.pdf','--encrypt',o.password,owner,'256','--','/output.pdf']:['--password='+o.password,'--decrypt','/input.pdf','/output.pdf'];
    let code=0;try{code=module.callMain(args) as unknown as number;}catch(err){if((err as {status?:number}).status!==0)throw new Error(messages.join('\n')||'Could not process this PDF. Check the password and file.');}
    if(code!==0&&code!==3)throw new Error(messages.join('\n')||'Unable to process this PDF.');
    const data=module.FS.readFile('/output.pdf');report(100,'Ready to download');
    return [{name:slug==='pdf-protect'?'protected.pdf':'unlocked.pdf',blob:new Blob([data as Uint8Array<ArrayBuffer>],{type:'application/pdf'}),originalSize:files[0].size}];
  }
  if(slug==='pdf-merge'){
    const result=await PDFDocument.create();
    for(let i=0;i<files.length;i++){const doc=await PDFDocument.load(await files[i].arrayBuffer());const copied=await result.copyPages(doc,doc.getPageIndices());copied.forEach(page=>result.addPage(page));report((i+1)/files.length*90,'Adding file '+(i+1)+' of '+files.length);}
    return [await save(result,'merged.pdf',files.reduce((sum,f)=>sum+f.size,0))];
  }
  const source=await PDFDocument.load(await files[0].arrayBuffer()),count=source.getPageCount();
  if(slug==='pdf-split'){
    const groups=splitGroups(o.splitMode,o.range,count,o.every),results=[];
    for(let i=0;i<groups.length;i++){const doc=await PDFDocument.create();(await doc.copyPages(source,groups[i])).forEach(page=>doc.addPage(page));results.push(await save(doc,'pages-'+groups[i].map(x=>x+1).join('-').slice(0,65)+'.pdf'));report((i+1)/groups.length*100,'Creating part '+(i+1)+' of '+groups.length);}
    return results;
  }
  if(['pdf-delete-pages','pdf-extract-pages','pdf-reorder'].includes(slug)){
    let indices=slug==='pdf-reorder'?o.order as number[]:parsePages(o.range,count);
    if(slug==='pdf-delete-pages')indices=source.getPageIndices().filter(i=>!indices.includes(i));
    if(!indices.length)throw new Error('Keep at least one page in your PDF.');
    const doc=await PDFDocument.create();(await doc.copyPages(source,indices)).forEach(page=>doc.addPage(page));return [await save(doc,'edited-pages.pdf',files[0].size)];
  }
  const selected=parsePages(o.range,count),font=await source.embedFont(StandardFonts.Helvetica);
  for(let i=0;i<selected.length;i++){
    const page=source.getPage(selected[i]),{width,height}=page.getSize();
    if(slug==='pdf-rotate')page.setRotation(degrees((page.getRotation().angle+o.rotation)%360));
    if(slug==='pdf-page-numbers'){
      const label=String((Number(o.start)||1)+selected[i])+(o.total?' / '+count:'');const size=12,tw=font.widthOfTextAtSize(label,size);page.drawText(label,{x:(width-tw)/2,y:o.position==='top'?height-25:20,size,font,color:rgb(.25,.25,.3)});
    }
    if(slug==='pdf-watermark'){
      if(!o.watermark?.trim())throw new Error('Enter your watermark text.');
      const size=Math.min(Number(o.fontSize)||36,width*.8/Math.max(font.widthOfTextAtSize(o.watermark,1),1));
      page.drawText(o.watermark,{x:width*.15,y:height*.45,size,font,rotate:degrees(Number(o.angle)||0),opacity:Number(o.opacity)/100,color:rgb(.35,.35,.4)});
    }
    report((i+1)/selected.length*95,'Processing page '+(selected[i]+1));
  }
  return [await save(source,slug.replace('pdf-','')+'.pdf',files[0].size)];
}
async function save(doc:PDFDocument,name:string,originalSize?:number){const bytes=await doc.save();return {name,blob:new Blob([bytes as Uint8Array<ArrayBuffer>],{type:'application/pdf'}),originalSize};}
