export function qrPayload(type:string,o:{value:string;name?:string;password?:string;security?:string;hidden?:boolean;subject?:string;body?:string;amount?:string}){
  if(!o.value.trim())throw new Error('Enter the content for your QR code.');
  const esc=(s:string)=>s.replace(/([\\;,:"])/g,'\\$1');
  if(type==='WiFi')return 'WIFI:T:'+(o.security||'WPA')+';S:'+esc(o.value)+';P:'+esc(o.password||'')+';H:'+(o.hidden?'true':'false')+';;';
  if(type==='URL'){let url:URL;try{url=new URL(o.value);}catch{throw new Error('Enter a full URL starting with https:// or http://.');}if(!['https:','http:'].includes(url.protocol))throw new Error('Use a website URL starting with https:// or http://.');return url.href;}
  if(type==='WhatsApp'||type==='Phone'){const number=o.value.replace(/[+\s()-]/g,'');if(!/^\d{7,15}$/.test(number))throw new Error('Enter a phone number with country code and 7–15 digits.');return type==='Phone'?'tel:+'+number:'https://wa.me/'+number+(o.body?'?text='+encodeURIComponent(o.body):'');}
  if(type==='Email'){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.value))throw new Error('Enter a valid email address.');return 'mailto:'+o.value+'?subject='+encodeURIComponent(o.subject||'')+'&body='+encodeURIComponent(o.body||'');}
  if(type==='UPI payment'){if(!/^[\w.-]+@[\w.-]+$/.test(o.value))throw new Error('Enter a UPI ID such as name@bank.');if(o.amount&&(!Number.isFinite(Number(o.amount))||Number(o.amount)<=0))throw new Error('Enter a positive payment amount.');const params=new URLSearchParams({pa:o.value,pn:o.name||'',cu:'INR'});if(o.amount)params.set('am',Number(o.amount).toFixed(2));return 'upi://pay?'+params.toString();}
  return o.value;
}
