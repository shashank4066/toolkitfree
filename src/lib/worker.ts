export type Report=(percent:number,message?:string)=>void;
// Each job owns a worker. Cancellation immediately releases its memory.
export function runWorker<T>(worker:Worker,payload:unknown,report:Report,signal:AbortSignal):Promise<T>{
  return new Promise((resolve,reject)=>{
    let done=false;
    const finish=(error?:unknown,value?:T)=>{if(done)return;done=true;worker.terminate();signal.removeEventListener('abort',abort);error?reject(error):resolve(value!);};
    const abort=()=>finish(new DOMException('Cancelled','AbortError'));
    if(signal.aborted){abort();return;}
    signal.addEventListener('abort',abort,{once:true});
    worker.onmessage=e=>{if(e.data.type==='progress')report(e.data.percent,e.data.message);else if(e.data.type==='error')finish(new Error(e.data.message));else finish(undefined,e.data.result);};
    worker.onerror=e=>finish(new Error(e.message||'This task could not be processed in your browser.'));
    worker.postMessage(payload);
  });
}
export function pdfJob<T>(payload:unknown,report:Report,signal:AbortSignal){return runWorker<T>(new Worker(new URL('../workers/pdf.worker.ts',import.meta.url),{type:'module'}),payload,report,signal);}
export function imageJob<T>(payload:unknown,report:Report,signal:AbortSignal){return runWorker<T>(new Worker(new URL('../workers/image.worker.ts',import.meta.url),{type:'module'}),payload,report,signal);}
export function textJob<T>(payload:unknown,report:Report,signal:AbortSignal,timeout=4000){
  const worker=new Worker(new URL('../workers/text.worker.ts',import.meta.url),{type:'module'});
  const ctrl=new AbortController();
  const abort=()=>ctrl.abort();signal.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(()=>ctrl.abort(),timeout);
  return runWorker<T>(worker,payload,report,ctrl.signal).catch(error=>{if(ctrl.signal.aborted&&!signal.aborted)throw new Error('This pattern took too long. Try a simpler expression or a smaller input.');throw error;}).finally(()=>{clearTimeout(timer);signal.removeEventListener('abort',abort);});
}
