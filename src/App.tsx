import { Component, useEffect, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/SiteShell';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import Info from './pages/Info';
import { tools } from './config/tools';
import { site } from './config/site';
import { metadata, schemas } from './lib/seo';
import { ToolLayout } from './components/ToolLayout';
export function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const meta = metadata(pathname);
    document.title = meta.title;
    const set = (selector: string, tag: string, attributes: Record<string, string>) => {
      const existing = document.querySelector(selector);
      const element = existing ?? document.createElement(tag);
      for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
      if (!existing) document.head.append(element);
      return element;
    };
    set('meta[name="description"]', 'meta', { name: 'description', content: meta.description });
    set('meta[property="og:title"]', 'meta', { property: 'og:title', content: meta.title });
    set('meta[property="og:description"]', 'meta', { property: 'og:description', content: meta.description });
    if (meta.url) {
      set('link[rel="canonical"]', 'link', { rel: 'canonical', href: meta.url });
      set('meta[property="og:url"]', 'meta', { property: 'og:url', content: meta.url });
      document.getElementById('page-robots')?.remove();
    } else {
      document.querySelector('link[rel="canonical"]')?.remove();
      document.querySelector('meta[property="og:url"]')?.remove();
      set('#page-robots', 'meta', { id: 'page-robots', name: 'robots', content: 'noindex' });
    }
    const structuredData = schemas(pathname);
    if (structuredData.length) {
      const script = set('#structured-data', 'script', { id: 'structured-data', type: 'application/ld+json' });
      script.textContent = JSON.stringify(structuredData);
    } else {
      document.getElementById('structured-data')?.remove();
    }
    if(!hash)window.scrollTo({top:0});else setTimeout(()=>document.getElementById(hash.slice(1))?.scrollIntoView(),30);
    if(site.analyticsDomain && (window as unknown as {plausible?:(event:string,options:object)=>void}).plausible)(window as unknown as {plausible:(event:string,options:object)=>void}).plausible('pageview',{u:site.origin+pathname});
  },[pathname,hash]);
  return (
    <>
      <Header />
      <main id="main">
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-tools" element={<AllTools />} />
            {tools.map(tool => <Route key={tool.slug} path={'/' + tool.slug} element={<ToolLayout tool={tool} />} />)}
            {['about', 'privacy', 'terms', 'contact'].map(page => (
              <Route key={page} path={'/' + page} element={<Info page={page} />} />
            ))}
            <Route path="*" element={<Info page="404" />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<div className="container empty-state"><h1>This tool needs a fresh start.</h1><p>Your original files are unchanged. Please reload the page.</p><button className="btn btn-primary" onClick={()=>location.reload()}>Reload tool</button></div>:this.props.children;}}
