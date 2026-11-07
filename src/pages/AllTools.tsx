import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { categories, searchTools, tools } from '../config/tools';
import { ToolCard } from '../components/ToolCard';
export default function AllTools() {
  const [params, setParams] = useSearchParams(); const query = params.get('q') || '', category = params.get('category') || 'all';
  const filtered = searchTools(query).filter(tool => category === 'all' || tool.category === category);
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); value ? next.set(key, value) : next.delete(key); setParams(next, { replace: true }); };
  return <div className="container page-section"><div className="center-heading"><span className="section-kicker">YOUR EVERYDAY TOOLKIT</span><h1>One place. {tools.length} possibilities.</h1><p>Find a tool. Finish a task. Get on with your day.</p></div><div className="directory-search"><Search size={21}/><input type="search" aria-label="Search all tools" placeholder="What would you like to do?" value={query} onChange={e => update('q',e.target.value)}/></div><div className="filter-tabs"><button className={category==='all'?'active':''} onClick={() => update('category','')}>All tools <span>{tools.length}</span></button>{categories.map(cat => <button className={category===cat.id?'active':''} key={cat.id} onClick={() => update('category',cat.id)}>{cat.name}<span>{tools.filter(t=>t.category===cat.id).length}</span></button>)}</div><p className="results-count" aria-live="polite">{filtered.length} tools ready to help</p><div className="tool-grid">{filtered.map(tool => <ToolCard key={tool.slug} tool={tool}/>)}</div>{!filtered.length && <div className="empty-state"><Search size={32}/><h2>No tools found</h2><p>Try a broader search, or choose another category.</p><button className="text-link" onClick={()=>setParams({})}>Show all tools</button></div>}</div>;
}
