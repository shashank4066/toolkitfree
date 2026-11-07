import { useId, useState } from 'react';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchTools, getDirectToolUrl, parseSearchIntent } from '../config/tools';
import { Icon } from './Icon';

export function SearchBar() {
  const [query, setQuery] = useState(''), [open, setOpen] = useState(false), [active, setActive] = useState(-1);
  const id = useId(), navigate = useNavigate(), results = searchTools(query).slice(0, 7);

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
      <Search size={23}/>
      <input
        aria-label="Search tools"
        role="combobox"
        aria-expanded={open && !!query}
        aria-controls={id}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? id + '-' + active : undefined}
        value={query}
        placeholder="Search tools… e.g. compress image to 10kb, merge PDF"
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={e => {
          if (e.key === 'Escape') setOpen(false);
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(results.length - 1, active + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(0, active - 1)); }
        }}
      />
      <button aria-label="Find tools" type="submit"><ArrowRight size={21}/></button>
    </form>
    {open && query && (
      <div className="search-results" id={id} role="listbox" aria-label="Matching tools">
        {results.length ? results.map((tool, i) => (
          <button
            id={id + '-' + i}
            role="option"
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
        )) : <p className="empty">No tools found. Try “PDF”, “resize” or “compress”.</p>}
      </div>
    )}
  </div>;
}
