export function words(value:string){return value.trim().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)||[];}
export function textStats(value:string){return {words:words(value).length,characters:[...value].length,sentences:(value.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).filter(s=>s.trim()).length,paragraphs:value.trim()?value.trim().split(/\n\s*\n/).length:0,readingMinutes:words(value).length/200};}
export function convertCase(value:string,mode:string){
  const parts=words(value.replace(/([a-z\d])([A-Z])/g,'$1 $2'));
  const title=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();
  switch(mode){
    case 'UPPERCASE':return value.toUpperCase();
    case 'lowercase':return value.toLowerCase();
    case 'Title Case':return value.toLowerCase().replace(/\b\p{L}/gu,c=>c.toUpperCase());
    case 'Sentence case':return value.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu,c=>c.toUpperCase());
    case 'camelCase':return parts.map((w,i)=>i?title(w):w.toLowerCase()).join('');
    case 'PascalCase':return parts.map(title).join('');
    case 'snake_case':return parts.join('_').toLowerCase();
    case 'kebab-case':return parts.join('-').toLowerCase();
    default:return value;
  }
}
export function slugify(text:string){return text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/[\s_-]+/g,'-').replace(/^-|-$/g,'');}
export function base64Encode(text:string){const bytes=new TextEncoder().encode(text);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary);}
export function base64Decode(text:string){const raw=text.replace(/\s/g,'');if(!/^[A-Za-z0-9+/]*={0,2}$/.test(raw)||raw.length%4===1)throw new Error('This is not valid Base64.');return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(raw),c=>c.charCodeAt(0)));}
export function jsonError(input:string,error:unknown){const message=error instanceof Error?error.message:String(error),position=message.match(/position (\d+)/i);if(position){const before=input.slice(0,Number(position[1])),line=before.split('\n').length,column=(before.split('\n').pop()?.length||0)+1;return 'Line '+line+', column '+column+': '+message;}return message;}
export function randomInt(max:number){if(!Number.isInteger(max)||max<=0)throw new Error('Invalid random range.');const limit=Math.floor(0x100000000/max)*max;const array=new Uint32Array(1);do{crypto.getRandomValues(array);}while(array[0]>=limit);return array[0]%max;}
export function shuffle<T>(values:T[]):T[]{const list=[...values];for(let i=list.length-1;i>0;i--){const j=randomInt(i+1);[list[i],list[j]]=[list[j],list[i]];}return list;}
