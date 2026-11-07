import { randomInt, shuffle } from './text';
export function emi(principal:number,annualRate:number,months:number){
  if(!Number.isFinite(principal+annualRate+months)||principal<0||annualRate<0||!Number.isInteger(months)||months<=0)throw new Error('Enter a positive term, a non-negative loan amount and a non-negative rate.');
  const r=annualRate/1200,payment=r?principal*r/(1-(1+r)**(-months)):principal/months,total=payment*months;
  return {payment,total,interest:total-principal};
}
export function calendarAge(birth:string,asOf:string){
  const parse=(text:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(text))throw new Error('Choose two valid dates.');const [y,m,d]=text.split('-').map(Number),date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)throw new Error('Choose a valid calendar date.');return date;};
  const born=parse(birth),end=parse(asOf);if(end<born)throw new Error('The calculation date must be on or after the birth date.');
  // Anniversaries clamp to the last day of a shorter month (Feb 29 -> Feb 28).
  const anniversary=(monthOffset:number)=>{const year=born.getUTCFullYear()+Math.floor((born.getUTCMonth()+monthOffset)/12),month=(born.getUTCMonth()+monthOffset)%12,day=Math.min(born.getUTCDate(),new Date(Date.UTC(year,month+1,0)).getUTCDate());return new Date(Date.UTC(year,month,day));};
  let wholeMonths=(end.getUTCFullYear()-born.getUTCFullYear())*12+end.getUTCMonth()-born.getUTCMonth();
  if(anniversary(wholeMonths)>end)wholeMonths--;
  const years=Math.floor(wholeMonths/12),months=wholeMonths%12,days=Math.round((end.getTime()-anniversary(wholeMonths).getTime())/86400000);
  return {years,months,days,totalDays:Math.round((end.getTime()-born.getTime())/86400000)};
}
export const unitGroups:Record<string,Record<string,number>>={
  Length:{Meters:1,Kilometers:1000,Centimeters:.01,Millimeters:.001,Inches:.0254,Feet:.3048,Yards:.9144,Miles:1609.344},
  Weight:{Kilograms:1,Grams:.001,Milligrams:.000001,Pounds:.45359237,Ounces:.028349523125,Tonnes:1000},
  'Data size':{Bytes:1,KB:1000,MB:1e6,GB:1e9,TB:1e12,KiB:1024,MiB:1024**2,GiB:1024**3,TiB:1024**4,Bits:.125},
  Temperature:{Celsius:1,Fahrenheit:1,Kelvin:1},
};
export function convertUnit(value:number,group:string,from:string,to:string){if(!Number.isFinite(value))throw new Error('Enter a valid number.');if(group==='Temperature'){const c=from==='Fahrenheit'?(value-32)*5/9:from==='Kelvin'?value-273.15:value;return to==='Fahrenheit'?c*9/5+32:to==='Kelvin'?c+273.15:c;}return value*unitGroups[group][from]/unitGroups[group][to];}
export function generatePassword(length:number,options:{upper:boolean;lower:boolean;digits:boolean;symbols:boolean}){
  const sets=[options.upper?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'',options.lower?'abcdefghijklmnopqrstuvwxyz':'',options.digits?'0123456789':'',options.symbols?'!@#$%^&*()-_=+[]{};:,.?':''].filter(Boolean);
  if(!sets.length)throw new Error('Select at least one character type.');if(!Number.isInteger(length)||length<4||length>256)throw new Error('Choose a password length from 4 to 256.');
  const pool=sets.join(''),chars=sets.map(set=>set[randomInt(set.length)]);while(chars.length<length)chars.push(pool[randomInt(pool.length)]);
  return {password:shuffle(chars).join(''),bits:Math.floor(length*Math.log2(pool.length))};
}
export function hexColors(hex:string){if(!/^#[0-9a-f]{6}$/i.test(hex))throw new Error('Use a six-digit HEX color such as #4f46e5.');const values=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),[r,g,b]=values.map(v=>v/255),max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;let h=0;const l=(max+min)/2,s=delta===0?0:delta/(1-Math.abs(2*l-1));if(delta){h=max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;h=(h*60+360)%360;}return {hex:hex.toUpperCase(),rgb:'rgb('+values.join(', ')+')',hsl:'hsl('+Math.round(h)+', '+Math.round(s*100)+'%, '+Math.round(l*100)+'%)'};}
