import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, ArrowUpRight, Heart, Search } from 'lucide-react';
import { categories, tools } from '../config/tools';
import { site } from '../config/site';
import { Button } from './ui/button';

export function Logo() {
  const hasFreeSuffix = site.name.endsWith('Free') && site.name !== 'Free';
  return (
    <Link className="logo" to="/" aria-label={site.name + ' home'}>
      <span className="logo-mark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="7" height="7" x="3" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="14" rx="1.5" />
          <rect width="7" height="7" x="3" y="14" rx="1.5" />
        </svg>
      </span>
      <span className="logo-text">
        {hasFreeSuffix ? <>{site.name.slice(0, -4)}<span className="brand-free">Free</span></> : site.name}
      </span>
    </Link>
  );
}

export function Header() {
  const [dark, setDark] = useState(false);
  const [mobile, setMobile] = useState(false);
  const location = useLocation();
  const isDirectory = location.pathname === '/all-tools';
  const selectedCategory = isDirectory
    ? new URLSearchParams(location.search).get('category')
    : tools.find(tool => '/' + tool.slug === location.pathname)?.category;

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMobile(false);
  }, [location.pathname, location.search]);

  function toggle() {
    const value = !dark;
    setDark(value);
    document.documentElement.classList.toggle('dark', value);
    try { localStorage.setItem('tkf-theme', value ? 'dark' : 'light'); } catch {}
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav id="primary-navigation" className={mobile ? 'primary-nav mobile-open' : 'primary-nav'} aria-label="Main navigation">
            <Link
              to="/all-tools"
              className={isDirectory && !selectedCategory ? 'nav-item active' : 'nav-item'}
              aria-current={isDirectory && !selectedCategory ? 'page' : undefined}
              onClick={() => setMobile(false)}
            >
              All tools
            </Link>
            {categories.map(category => (
              <Link
                onClick={() => setMobile(false)}
                key={category.id}
                to={'/all-tools?category=' + category.id}
                className={selectedCategory === category.id ? 'nav-item active' : 'nav-item'}
                aria-current={isDirectory && selectedCategory === category.id ? 'page' : undefined}
              >
                {category.short}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link to="/all-tools" className="icon-link" aria-label="Search all tools">
              <Search size={18} />
            </Link>
            <Button variant="ghost" size="icon" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" className="mobile-menu" aria-label={mobile ? 'Close navigation' : 'Open navigation'} aria-expanded={mobile} aria-controls="primary-navigation" onClick={() => setMobile(!mobile)}>
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo />
          <p>Free tools for PDFs, images, text, and code.</p>
        </div>
        {categories.map(category => (
          <div className="footer-column" key={category.id}>
            <h3>{category.name}</h3>
            {tools.filter(tool => tool.category === category.id).slice(0, 4).map(tool => (
              <Link key={tool.slug} to={'/' + tool.slug}>{tool.name}</Link>
            ))}
            <Link to={'/all-tools?category=' + category.id} className="view-all-link">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          {site.supportUrl ? (
            <a href={site.supportUrl} target="_blank" rel="noopener noreferrer"><Heart size={12} /> Support us</a>
          ) : <Link to="/about#support">Support us</Link>}
        </div>
      </div>
    </footer>
  );
}

export function AdSlot({ placement }: { placement: 'banner' | 'sidebar' | 'result' }) {
  return site.adsEnabled ? (
    <aside className={'ad-slot ad-' + placement} aria-label="Advertisement">
      <small>Advertisement</small>
      <div data-ad-slot={placement} />
    </aside>
  ) : null;
}
