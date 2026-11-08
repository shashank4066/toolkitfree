import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { categories, searchTools, tools } from '../config/tools';
import { ToolCard } from '../components/ToolCard';

export default function AllTools() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = categories.find(item => item.id === params.get('category'));
  const filtered = searchTools(query).filter(tool => !category || tool.category === category.id);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <div className="container page-section">
      <div className="directory-heading">
        <h1>{category?.name || 'All tools'}</h1>
        <p>{category?.description || 'Browse free tools for PDFs, images, text, code, and more.'}</p>
      </div>
      <div className="directory-search">
        <Search size={20} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search all tools"
          placeholder="Search by name or task"
          value={query}
          onChange={e => update('q', e.target.value)}
        />
      </div>
      <div className="filter-tabs" role="group" aria-label="Filter by category">
        <button type="button" className={!category ? 'active' : ''} aria-pressed={!category} onClick={() => update('category', '')}>
          All tools <span>{tools.length}</span>
        </button>
        {categories.map(item => (
          <button
            type="button"
            className={category?.id === item.id ? 'active' : ''}
            aria-pressed={category?.id === item.id}
            key={item.id}
            onClick={() => update('category', item.id)}
          >
            {item.name}<span>{tools.filter(tool => tool.category === item.id).length}</span>
          </button>
        ))}
      </div>
      <p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}</p>
      {filtered.length ? (
        <div className="tool-grid">{filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div>
      ) : (
        <div className="empty-state">
          <Search size={27} aria-hidden="true" />
          <h2>No matching tools</h2>
          <p>Try a different search or clear the filters.</p>
          <button type="button" className="text-link" onClick={() => setParams({})}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
