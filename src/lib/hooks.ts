import { useEffect, useRef, useState } from 'react';
import { friendlyError } from './utils';
export function useObjectUrl(blob?: Blob) {
  const [url,setUrl]=useState('');
  useEffect(()=>{if(!blob){setUrl('');return;}const value=URL.createObjectURL(blob);setUrl(value);return ()=>URL.revokeObjectURL(value);},[blob]);
  return url;
}
export function useTask() {
  const [busy,setBusy]=useState(false),[progress,setProgress]=useState(0),[status,setStatus]=useState(''),[error,setError]=useState('');
  const controller=useRef<AbortController | null>(null), mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;controller.current?.abort();};},[]);
  async function run<T>(work:(report:(percent:number,message?:string)=>void,signal:AbortSignal)=>Promise<T>):Promise<T|undefined> {
    controller.current?.abort(); const ctrl=new AbortController();controller.current=ctrl;setBusy(true);setProgress(1);setStatus('Getting things ready…');setError('');
    try { const result=await work((percent,message)=>{if(mounted.current&&!ctrl.signal.aborted){setProgress(Math.min(100,Math.max(0,percent)));if(message)setStatus(message);}},ctrl.signal);if(ctrl.signal.aborted)return;return result; }
    catch(err){if(mounted.current&&!ctrl.signal.aborted)setError(friendlyError(err));}
    finally {if(mounted.current && controller.current===ctrl)setBusy(false);}
  }
  return {busy,progress,status,error,setError,run,cancel:()=>{controller.current?.abort();setBusy(false);setStatus('Cancelled. Your original files are unchanged.');}};
}
