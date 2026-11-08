import { useId, useState } from 'react';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchTools, getDirectToolUrl, parseSearchIntent } from '../config/tools';
import { Icon } from './Icon';

export function SearchBar() {
  const [query, setQuery] = useState(''), [open, setOpen] = useState(false), [active, setActive] = useState(-1);
  const id = useId(), navigate = useNavigate(), results = searchTools(query).slice(0, 7);
  const showResults = open && Boolean(query.trim());
  const listOpen = showResults && results.length > 0;

  const choose = (slug: string) => {
    setOpen(false);
    const intent = parseSearchIntent(query);
    const params = new URLSearchParams();
    if (intent.target && ['image-target-size', 'image-compressor', 'image-dimensions-size', 'pdf-compress'].includes(slug)) {
      params.set('target', String(intent.target));
      if (intent.unit) params.set('unit', intent.unit);
    }
    const q = params.toString();
    navigate('/' + slug + (q ? '?' + q : ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    if (active >= 0 && results[active]) {
      choose(results[active].slug);
      return;
    }
    const directUrl = getDirectToolUrl(query);
    if (directUrl) {
      navigate(directUrl);
    } else {
      navigate('/all-tools?q=' + encodeURIComponent(query));
    }
  };

  return <div className="search-wrap" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
    <form className="hero-search" onSubmit={handleSubmit}>
      <Search size={20} aria-hidden="true" />
      <input
        aria-label="Search tools"
        role="combobox"
        aria-expanded={listOpen}
        aria-controls={listOpen ? id : undefined}
        aria-autocomplete="list"
        aria-activedescendant={listOpen && results[active] ? id + '-' + active : undefined}
        value={query}
        placeholder="Search by task, e.g. merge PDF"
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={e => {
          if (e.key === 'Escape') { setOpen(false); setActive(-1); }
          if (!query.trim() || !results.length) return;
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            setActive(e.key === 'ArrowDown' ? Math.min(results.length - 1, active + 1) : Math.max(0, active - 1));
          }
        }}
      />
      <button aria-label="Find tools" type="submit"><ArrowRight size={19} aria-hidden="true" /></button>
    </form>
    {listOpen && (
      <div className="search-results" id={id} role="listbox" aria-label="Matching tools">
        {results.map((tool, i) => (
          <button
            id={id + '-' + i}
            role="option"
            tabIndex={-1}
            aria-selected={active === i}
            className={'search-result category-' + tool.category + (active === i ? ' selected' : '')}
            key={tool.slug}
            onClick={() => choose(tool.slug)}
          >
            <span className="tool-icon"><Icon name={tool.icon} size={18}/></span>
            <span>
              <strong>{tool.name}</strong>
              <small>{tool.description}</small>
            </span>
            <CornerDownLeft size={16}/>
          </button>
        ))}
      </div>
    )}
    {showResults && !results.length && <p role="status" className="search-results empty">No matching tools. Try a shorter search.</p>}
  </div>;
}
