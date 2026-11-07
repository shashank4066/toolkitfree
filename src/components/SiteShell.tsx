import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, ArrowUpRight, Heart, Search, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { categories, tools } from '../config/tools';
import { site } from '../config/site';
import { Button } from './ui/button';

export function Logo() {
  return (
    <Link className="logo" to="/" aria-label={site.name + ' home'}>
      <span className="logo-mark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="14" rx="1.5" />
          <rect width="7" height="7" x="3" y="14" rx="1.5" />
        </svg>
      </span>
      <span className="logo-text">
        ToolKit<span className="brand-free">Free</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [dark, setDark] = useState(false);
  const [mobile, setMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMobile(false);
  }, [location.pathname]);

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
          <nav className={mobile ? 'primary-nav mobile-open' : 'primary-nav'} aria-label="Main navigation">
            {categories.map(category => (
              <NavLink
                onClick={() => setMobile(false)}
                key={category.id}
                to={'/all-tools?category=' + category.id}
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                {category.short}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="header-free">
              <span className="free-dot" />100% Free
            </span>
            <Link to="/all-tools" className="icon-link" aria-label="Search all tools">
              <Search size={18} />
            </Link>
            <Button variant="ghost" size="icon" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" className="mobile-menu" aria-label={mobile ? 'Close navigation' : 'Open navigation'} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
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
          <p>Every tool you need for PDF, image, text, and code tasks. Fast, private, and 100% free with no server uploads.</p>
          <span className="privacy-mini">
            <ShieldCheck size={14} /> Your files never leave your device
          </span>
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
        <p>© {new Date().getFullYear()} {site.name}. All tools run locally in your browser.</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          {site.supportUrl && (
            <a href={site.supportUrl} target="_blank" rel="noopener noreferrer">
              <Heart size={12} /> Support us
            </a>
          )}
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
