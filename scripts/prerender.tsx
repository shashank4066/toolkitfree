import React from 'react';
import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { tools } from '../src/config/tools';
import { site } from '../src/config/site';
import { metadata, schemas } from '../src/lib/seo';
// Statically render discoverable content without browser-only workspace imports.
import Home from '../src/pages/Home';
import AllTools from '../src/pages/AllTools';
import Info from '../src/pages/Info';
import { Header, Footer } from '../src/components/SiteShell';
import { ToolPage } from '../src/components/ToolPage';

const root = process.cwd();
const dist = path.join(root, 'dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const routes = ['/', '/all-tools', '/about', '/privacy', '/terms', '/contact', ...tools.map(tool => '/' + tool.slug), '/404'];
const publicUrls: string[] = [];
for (const route of routes) {
  const { title, description, url, tool } = metadata(route);
  if (url) publicUrls.push(url);
  const content = tool ? (
    <ToolPage tool={tool}>
      <p>Enable JavaScript to use this tool. Your inputs are processed in your browser.</p>
    </ToolPage>
  ) : route === '/' ? <Home /> : route === '/all-tools' ? <AllTools /> : <Info page={route.slice(1)} />;
  const html = renderToString(
    <MemoryRouter initialEntries={[route]}>
      <Header />
      <main id="main">{content}</main>
      <Footer />
    </MemoryRouter>
  );
  const structuredData = schemas(route);
  const head = [
    url ? '<link rel="canonical" href="' + escape(url) + '"/>' : '<meta id="page-robots" name="robots" content="noindex"/>',
    '<meta property="og:type" content="website"/>',
    '<meta property="og:title" content="' + escape(title) + '"/>',
    '<meta property="og:description" content="' + escape(description) + '"/>',
    url ? '<meta property="og:url" content="' + escape(url) + '"/>' : '',
    '<meta property="og:site_name" content="' + escape(site.name) + '"/>',
    '<meta name="twitter:card" content="summary"/>',
    structuredData.length
      ? '<script id="structured-data" type="application/ld+json">' + JSON.stringify(structuredData).replace(/</g, '\\u003c') + '</script>'
      : '',
  ].join('');
  const page = template
    .replace(/<title>.*?<\/title>/, () => '<title>' + escape(title) + '</title>')
    .replace(/<meta name="description"[^>]*>/, () => '<meta name="description" content="' + escape(description) + '"/>')
    .replace('</head>', () => head + '</head>')
    .replace('<!--app-html-->', () => html);
  const destination = route === '/404'
    ? path.join(dist, '404.html')
    : path.join(dist, route.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, page);
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  + publicUrls.map(url => '<url><loc>' + escape(url) + '</loc></url>').join('') + '</urlset>';
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + new URL('/sitemap.xml', site.origin).href + '\n');
await writeFile(path.join(dist,'manifest.webmanifest'),JSON.stringify({name:site.name,short_name:site.name,description:site.tagline,start_url:'/',scope:'/',display:'standalone',background_color:'#ffffff',theme_color:'#4f46e5',icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]}));
for(const folder of ['cmaps','standard_fonts','wasm'])await cp(path.join(root,'node_modules/pdfjs-dist',folder),path.join(dist,'pdfjs',folder),{recursive:true});
// Offline shell is precached; large, optional libraries are cached only when used.
const files=await readdir(path.join(dist,'assets')),entry=files.filter(f=>/^index-.*\.(js|css)$/.test(f)),version=Date.now().toString(36);
const precache=['/','/all-tools','/icon.svg','/manifest.webmanifest',...entry.map(f=>'/assets/'+f)];
const worker="const CACHE='tkf-"+version+"';const PRE="+JSON.stringify(precache)+";self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRE)));self.skipWaiting();});self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('tkf-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;}).catch(async()=>await caches.match(request)||await caches.match('/')));return;}if(!/^\\/(assets|pdfjs)\\//.test(url.pathname)&&!PRE.includes(url.pathname))return;event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;})));});";
await writeFile(path.join(dist,'sw.js'),worker);
// Static routes and the custom 404 page let the host return accurate HTTP statuses.
await writeFile(path.join(dist,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: DENY\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/sw.js\n  Cache-Control: no-cache\n');
console.log('Prerendered '+routes.length+' routes with unique metadata, structured data, sitemap and offline shell.');
