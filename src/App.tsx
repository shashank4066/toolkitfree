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
export function App({prerender=false}:{prerender?:boolean}) {
  const {pathname,hash}=useLocation();
  useEffect(()=>{
    const meta=metadata(pathname);document.title=meta.title;
    const set=(selector:string,tag:string,attrs:Record<string,string>)=>{let el=document.querySelector(selector);if(!el){el=document.createElement(tag);document.head.append(el);}Object.entries(attrs).forEach(([key,value])=>el!.setAttribute(key,value));};
    set('meta[name="description"]','meta',{name:'description',content:meta.description});
    set('meta[name="keywords"]','meta',{name:'keywords',content:meta.keywords});
    set('link[rel="canonical"]','link',{rel:'canonical',href:meta.url});
    ['title','description','url'].forEach(key=>set('meta[property="og:'+key+'"]','meta',{property:'og:'+key,content:meta[key as 'title'|'description'|'url']}));
    let script=document.getElementById('structured-data');if(!script){script=document.createElement('script');script.id='structured-data';script.setAttribute('type','application/ld+json');document.head.append(script);}script.textContent=JSON.stringify(schemas(pathname));
    if(!hash)window.scrollTo({top:0});else setTimeout(()=>document.getElementById(hash.slice(1))?.scrollIntoView(),30);
    if(site.analyticsDomain && (window as unknown as {plausible?:(event:string,options:object)=>void}).plausible)(window as unknown as {plausible:(event:string,options:object)=>void}).plausible('pageview',{u:site.origin+pathname});
  },[pathname,hash]);
  return <><Header/><main id="main"><ErrorBoundary key={pathname}><Routes><Route path="/" element={<Home/>}/><Route path="/all-tools" element={<AllTools/>}/>{tools.map(tool=><Route key={tool.slug} path={'/'+tool.slug} element={<ToolLayout tool={tool} prerender={prerender}/>}/>)}{['about','privacy','terms','contact'].map(page=><Route key={page} path={'/'+page} element={<Info page={page}/>}/>)}<Route path="*" element={<Info page="404"/>}/></Routes></ErrorBoundary></main><Footer/></>;
}
class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<div className="container empty-state"><h1>This tool needs a fresh start.</h1><p>Your original files are unchanged. Please reload the page.</p><button className="btn btn-primary" onClick={()=>location.reload()}>Reload tool</button></div>:this.props.children;}}
