// Parse 1-based user page ranges into ordered, unique 0-based indices.
export function parsePages(value: string, count: number): number[] {
  if (!Number.isInteger(count) || count < 1) throw new Error('This PDF has no pages.');
  if (!value.trim() || value.trim().toLowerCase() === 'all') return Array.from({length:count},(_,i)=>i);
  const pages:number[]=[];
  for(const part of value.split(',')){
    const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if(!match)throw new Error('Use page numbers or ranges, for example 1-3, 5, 8-10.');
    const start=Number(match[1]),end=Number(match[2]||match[1]);
    if(start<1||end<start||end>count)throw new Error('Choose pages between 1 and '+count+' with ranges in ascending order.');
    for(let page=start;page<=end;page++)if(!pages.includes(page-1))pages.push(page-1);
  }
  return pages;
}
export function splitGroups(mode:string,range:string,count:number,every:number):number[][] {
  if(mode==='each')return Array.from({length:count},(_,i)=>[i]);
  if(mode==='every'){if(!Number.isInteger(every)||every<1)throw new Error('Enter a whole number of pages greater than zero.');return Array.from({length:Math.ceil(count/every)},(_,i)=>Array.from({length:Math.min(every,count-i*every)},(_,j)=>i*every+j));}
  return range.split(';').map(group=>parsePages(group,count));
}
