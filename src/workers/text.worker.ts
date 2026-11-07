import { convertCase, slugify, shuffle, textStats } from '../lib/text';
self.onmessage=async(e:MessageEvent)=>{try{const {operation,input,options:o={}}=e.data;let result:unknown;
  switch(operation){
    case 'case-converter':result=convertCase(input,o.mode);break;
    case 'word-counter':result=textStats(input);break;
    case 'remove-duplicate-lines':{const seen=new Set<string>();result=input.split(/\r?\n/).filter((line:string)=>{const key=o.trim?line.trim():line,normalized=o.ignoreCase?key.toLowerCase():key;if(seen.has(normalized))return false;seen.add(normalized);return true;}).join('\n');break;}
    case 'sort-lines':{const lines=input.split(/\r?\n/);result=(o.mode==='Random'?shuffle(lines):lines.sort((a:string,b:string)=>o.mode==='By length'?a.length-b.length:o.mode==='Z–A'?b.localeCompare(a):a.localeCompare(b))).join('\n');break;}
    case 'clean-text':result=o.mode==='Remove line breaks'?input.replace(/\s*\r?\n\s*/g,' ').replace(/[ \t]+/g,' ').trim():o.mode==='Trim each line'?input.split(/\r?\n/).map((s:string)=>s.trim()).join('\n'):input.replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').trim();break;
    case 'slug-generator':result=slugify(input);break;
    case 'find-replace':{if(!o.find)throw new Error('Enter something to find.');if(o.regex){const regex=new RegExp(o.find,o.ignoreCase?'gi':'g');result=input.replace(regex,o.replace);}else if(o.ignoreCase){const escaped=o.find.replace(/[.*+?^$()|[\]\\]/g,'\\$&');result=input.replace(new RegExp(escaped,'gi'),()=>o.replace);}else result=input.split(o.find).join(o.replace);break;}
    case 'regex':{const regex=new RegExp(o.pattern,o.flags.includes('g')?o.flags:o.flags+'g');const matches=[];let match;while((match=regex.exec(input))!==null){matches.push({index:match.index,text:match[0],groups:Array.from(match).slice(1)});if(!match[0])regex.lastIndex++;if(matches.length>=10000)break;}result=matches;break;}
    case 'diff':{const {diffWordsWithSpace}=await import('diff');result=diffWordsWithSpace(input,o.other);break;}
    case 'json':{const parsed=JSON.parse(input);result={text:JSON.stringify(parsed,null,o.minify?0:Number(o.indent)||2),value:parsed};break;}
    case 'js-minify':{const {minify}=await import('terser');result=(await minify(input,{compress:true,mangle:false})).code||'';break;}
    case 'beautify':{const {format}=await import('prettier/standalone');if(o.language==='html'){const plugin=await import('prettier/plugins/html');result=await format(input,{parser:'html',plugins:[plugin],tabWidth:2});}else if(o.language==='css'){const plugin=await import('prettier/plugins/postcss');result=await format(input,{parser:'css',plugins:[plugin],tabWidth:2});}else{const [babel,estree]=await Promise.all([import('prettier/plugins/babel'),import('prettier/plugins/estree')]);result=await format(input,{parser:'babel',plugins:[babel,estree],tabWidth:2});}break;}
    default:throw new Error('Unknown text operation.');
  }
  self.postMessage({type:'done',result});
}catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});}};
