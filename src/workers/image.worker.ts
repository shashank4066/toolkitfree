import type { ImageOptions } from '../lib/image';
type Payload={blob:Blob;options:ImageOptions};
self.onmessage=async(e:MessageEvent<Payload>)=>{try{self.postMessage({type:'done',result:await processImage(e.data)});}catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});}};
const report=(percent:number)=>self.postMessage({type:'progress',percent,message:'Finding the best balance of size and quality…'});
async function processImage({blob,options:o}:Payload){
  let bitmap:ImageBitmap;try{bitmap=await createImageBitmap(blob);}catch{throw new Error('This image is damaged or its format is not supported by your browser. Try JPG, PNG or WebP.');}
  try{
    const crop=o.crop||{x:0,y:0,width:bitmap.width,height:bitmap.height};
    const width=Math.max(1,Math.round(o.width||crop.width)),height=Math.max(1,Math.round(o.height||crop.height));
    const rotated=Math.abs(o.rotation)%180===90;
    if(width>16384||height>16384||width*height>64000000)throw new Error('These dimensions are too large for a reliable browser canvas. Keep each side under 16,384 pixels and the total under 64 megapixels.');
    const source=new OffscreenCanvas(rotated?height:width,rotated?width:height),ctx=source.getContext('2d')!;
    const type='image/'+(o.format==='jpg'?'jpeg':o.format);
    if(type==='image/jpeg'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,source.width,source.height);}
    ctx.translate(source.width/2,source.height/2);ctx.rotate(o.rotation*Math.PI/180);ctx.scale(o.flipX?-1:1,o.flipY?-1:1);ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,crop.x,crop.y,crop.width,crop.height,-width/2,-height/2,width,height);
    let current=source,smallest:Blob|undefined,chosen:Blob|undefined;
    async function encode(canvas:OffscreenCanvas,quality:number){
      const result=await canvas.convertToBlob({type,quality});
      if(result.type!==type)throw new Error('Your browser cannot export '+o.format.toUpperCase()+'. Choose JPG, PNG or WebP instead.');
      if(!smallest||result.size<smallest.size)smallest=result;
      return result;
    }
    if(!o.target){chosen=await encode(source,o.quality/100);report(100);}
    else {
      if(!Number.isFinite(o.target)||o.target<1)throw new Error('Enter a target file size greater than zero.');
      for(let pass=0;pass<16;pass++){
        report(Math.min(96,6+pass*6));
        let low=.01,high=Math.min(1,o.quality/100),best:Blob|undefined;
        const top=await encode(current,high);
        if(top.size<=o.target){best=top;}else if(type!=='image/png'){
          const bottom=await encode(current,low);
          if(bottom.size<=o.target){best=bottom;for(let i=0;i<9;i++){const middle=(low+high)/2;const candidate=await encode(current,middle);if(candidate.size<=o.target){best=candidate;low=middle;}else high=middle;}}
        }
        if(best){chosen=best;break;}
        if(o.keepDimensions||(current.width===1&&current.height===1))break;
        const ratio=Math.min(.85,Math.max(.25,Math.sqrt(o.target/Math.max(1,smallest!.size))*.9));
        const next=new OffscreenCanvas(Math.max(1,Math.floor(current.width*ratio)),Math.max(1,Math.floor(current.height*ratio)));
        const nextCtx=next.getContext('2d')!;nextCtx.imageSmoothingQuality='high';nextCtx.drawImage(source,0,0,next.width,next.height);current=next;
      }
      chosen ||= smallest!;
    }
    return {blob:chosen,width:current.width,height:current.height,met:!o.target||chosen!.size<=o.target};
  }finally{bitmap.close();}
}
