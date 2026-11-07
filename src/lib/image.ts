export type ImageOptions={mode:string;format:string;quality:number;target:number;width:number;height:number;keepDimensions:boolean;rotation:number;flipX:boolean;flipY:boolean;crop?:{x:number;y:number;width:number;height:number};dpi?:number};
export async function prepareImage(file:File):Promise<Blob>{
  if(/\.(heic|heif)$/i.test(file.name)||/heic|heif/.test(file.type)){
    try{const {default:convert}=await import('heic2any');const result=await convert({blob:file,toType:'image/png'});return Array.isArray(result)?result[0]:result;}catch{throw new Error('This HEIC file could not be decoded. Try exporting it as JPG from your photo app.');}
  }
  return file;
}
export function imageType(format:string){return 'image/'+(format==='jpg'?'jpeg':format);}
export function detectFormat(file:File){return file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';}
export async function imageDimensions(file:Blob){const bitmap=await createImageBitmap(file);const size={width:bitmap.width,height:bitmap.height};bitmap.close();return size;}
export const imageAccept='.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif';
