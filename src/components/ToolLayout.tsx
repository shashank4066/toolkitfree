import { lazy, Suspense, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Info, LoaderCircle, ShieldCheck } from 'lucide-react';
import { categories, tools, type Tool } from '../config/tools';
import { Icon } from './Icon';
import { ToolCard } from './ToolCard';
import { FAQ } from './FAQ';
import { toolFaq } from '../lib/seo';
import { AdSlot } from './SiteShell';
// Vite's glob makes adding a component automatic while preserving lazy route chunks.
const modules=import.meta.glob<{default:ComponentType<{tool:Tool}>}>('../tools/**/*.tsx');
const components = new Map<string, ReturnType<typeof lazy<ComponentType<{ tool: Tool }>>>>();
function ToolWorkspace({ tool }: { tool: Tool }) {
  if (!components.has(tool.component)) {
    const loader = modules['../tools/' + tool.component + '.tsx'];
    if (!loader) return <div className="notice">This workspace could not load. Please refresh the page.</div>;
    components.set(tool.component, lazy(loader));
  }
  const Component = components.get(tool.component)!;
  return (
    <Suspense fallback={<Loading />}>
      <Component key={tool.slug} tool={tool} />
    </Suspense>
  );
}
function Loading() {
  return (
    <div className="workspace-loading">
      <LoaderCircle className="spinner" size={26} />
      <p>Loading tool…</p>
    </div>
  );
}
export function ToolLayout({ tool, prerender = false }: { tool: Tool; prerender?: boolean }) {
  const category = categories.find(c => c.id === tool.category)!;
  const fileTool = tool.category === 'pdf' || tool.category === 'image';
  return (
    <div className={'container tool-page category-' + tool.category}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <Link to={'/all-tools?category=' + tool.category}>{category.name}</Link>
        <ChevronRight size={13} />
        <span aria-current="page">{tool.name}</span>
      </nav>
      <header className="tool-title">
        <span className="tool-icon"><Icon name={tool.icon} size={24} /></span>
        <div className="tool-heading">
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <span className="tool-local"><ShieldCheck size={15} aria-hidden="true" />Runs in your browser</span>
      </header>
      <AdSlot placement="banner" />
      {tool.note && <aside className="tool-note"><Info size={15} /><span>{tool.note}</span></aside>}
      <section className="workspace" aria-label={tool.name + ' workspace'}>
        {prerender ? <Loading /> : <ToolWorkspace tool={tool} />}
      </section>
      <section className="tool-info">
        <div className="info-columns">
          <div>
            <h2>How to use {tool.name}</h2>
            <ol>
              <li>{fileTool ? 'Choose your file, drag it into the workspace, or paste it.' : 'Enter or paste your input in the workspace.'}</li>
              <li>Choose the settings that fit your task.</li>
              <li>{fileTool ? 'Process your file and check the result.' : 'Generate your result and review it.'}</li>
              <li>{fileTool ? 'Download your file, or save multiple results as a ZIP.' : 'Copy or download your finished result.'}</li>
            </ol>
          </div>
          <div>
            <h2>What to expect</h2>
            <ul className="feature-list">
              <li><Check size={13} />No registration or subscription</li>
              <li><Check size={13} />Local processing keeps your inputs private</li>
              <li><Check size={13} />Works on phones, tablets and desktops</li>
              <li><Check size={13} />No watermarks added by this website</li>
              <li><Check size={13} />Start over and use it as often as you need</li>
            </ul>
          </div>
        </div>
        <h2>Frequently asked questions</h2>
        <FAQ items={toolFaq(tool)} />
      </section>
      <section className="related-section">
        <h2>Related tools</h2>
        <div className="tool-grid">
          {tools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, 4).map(t => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
