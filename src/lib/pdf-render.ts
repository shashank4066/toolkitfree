import type { PDFDocumentProxy } from 'pdfjs-dist';
import { parsePages } from './pages';
import { baseName, nextFrame, type OutputFile } from './utils';
import type { Report } from './worker';
export async function openPdf(file:File,password?:string){
  const pdfjs=await import('pdfjs-dist');const {default:worker}=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc=worker;
  return pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),password,cMapUrl:'/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'/pdfjs/standard_fonts/',wasmUrl:'/pdfjs/wasm/'}).promise;
}
export async function renderPage(doc:PDFDocumentProxy,index:number,scale:number,maxPixels=24000000){
  const page=await doc.getPage(index+1);let viewport=page.getViewport({scale});
  if(viewport.width*viewport.height>maxPixels){scale*=Math.sqrt(maxPixels/(viewport.width*viewport.height));viewport=page.getViewport({scale});}
  const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
  const ctx=canvas.getContext('2d')!;await page.render({canvas,canvasContext:ctx,viewport,background:'#ffffff'}).promise;page.cleanup();return canvas;
}
export function canvasBlob(canvas:HTMLCanvasElement,type:string,quality:number){return new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Unable to encode this image. Try a lower resolution.')),type,quality));}
export async function pdfImages(file:File,options:{range:string;format:string;quality:number;scale:number},report:Report,signal:AbortSignal):Promise<OutputFile[]>{
  const doc=await openPdf(file);const results:OutputFile[]=[];
  try{const indices=parsePages(options.range,doc.numPages);for(let i=0;i<indices.length;i++){signal.throwIfAborted();const canvas=await renderPage(doc,indices[i],options.scale);const blob=await canvasBlob(canvas,'image/'+options.format,options.quality/100);results.push({name:baseName(file.name)+'-page-'+(indices[i]+1)+(options.format==='jpeg'?'.jpg':'.png'),blob,preview:true});canvas.width=canvas.height=0;report((i+1)/indices.length*100,'Rendering page '+(indices[i]+1));await nextFrame();}return results;}finally{await doc.loadingTask.destroy();}
}
export async function compressPdf(file:File,options:{level:string;target:number},report:Report,signal:AbortSignal):Promise<OutputFile[]>{
  const {PDFDocument}=await import('pdf-lib'),doc=await openPdf(file);
  let best:Blob=file;
  const base=options.level==='low'?{scale:1.8,quality:.78}:options.level==='high'?{scale:.85,quality:.38}:{scale:1.3,quality:.58};
  const attempts=options.target?8:1;
  try{for(let attempt=0;attempt<attempts;attempt++){signal.throwIfAborted();const result=await PDFDocument.create();
    for(let i=0;i<doc.numPages;i++){signal.throwIfAborted();const page=await doc.getPage(i+1),size=page.getViewport({scale:1});const canvas=await renderPage(doc,i,Math.max(.15,base.scale*.76**attempt));const blob=await canvasBlob(canvas,'image/jpeg',Math.max(.12,base.quality*.8**attempt));const image=await result.embedJpg(await blob.arrayBuffer());result.addPage([size.width,size.height]).drawImage(image,{x:0,y:0,width:size.width,height:size.height});canvas.width=canvas.height=0;report((attempt+(i+1)/doc.numPages)/attempts*95,'Compressing page '+(i+1)+(attempts>1?' · pass '+(attempt+1):''));await nextFrame();}
    const output=new Blob([await result.save() as Uint8Array<ArrayBuffer>],{type:'application/pdf'});if(output.size<best.size)best=output;if(!options.target||best.size<=options.target)break;
  }return [{name:baseName(file.name)+'-compressed.pdf',blob:best,originalSize:file.size,note:best===file?'The original is already smaller than the compressed versions. Your original file is offered unchanged.':options.target&&best.size>options.target?'Target not reached. This is the smallest output found. Try fewer pages or a larger target.':'Pages were rebuilt as images. Keep your original for editable text and forms.'}];}finally{await doc.loadingTask.destroy();}
}
