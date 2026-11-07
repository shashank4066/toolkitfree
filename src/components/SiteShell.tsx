import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, ArrowUpRight, Heart, Search } from 'lucide-react';
import { categories, tools } from '../config/tools';
import { site } from '../config/site';
import { Button } from './ui/button';

export function Logo() {
  return (
    <Link className="logo" to="/" aria-label={site.name + ' home'}>
      <span className="logo-mark">TK</span>
      <span>{site.name.replace(/Free$/, '')}<span className="brand-free">{site.name.endsWith('Free') ? 'Free' : ''}</span><span className="logo-dot">·</span></span>
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
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {category.short}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="header-free"><span className="free-dot" />100% Free</span>
            <Link to="/all-tools" className="icon-link" aria-label="Search all tools">
              <Search size={18} />
            </Link>
            <Button variant="ghost" size="icon" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" className="mobile-menu" aria-label={mobile ? 'Close navigation' : 'Open navigation'} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
              {mobile ? <X /> : <Menu />}
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
          <p>Tools for the little jobs that slow your day down. Everything runs right in your browser.</p>
          <span className="privacy-mini"><Heart size={13} /> Your files stay yours.</span>
        </div>
        {categories.map(category => (
          <div className="footer-column" key={category.id}>
            <h3>{category.name}</h3>
            {tools.filter(tool => tool.category === category.id).slice(0, 4).map(tool => (
              <Link key={tool.slug} to={'/' + tool.slug}>{tool.name}</Link>
            ))}
            <Link to={'/all-tools?category=' + category.id}>View all <ArrowUpRight size={12} /></Link>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <p>Made to make your work easier. Always free.</p>
        <div>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          <a href={site.supportUrl || '/about#support'} {...(site.supportUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <Heart size={12} /> Support us
          </a>
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
