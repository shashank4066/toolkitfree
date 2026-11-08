import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Info, ShieldCheck } from 'lucide-react';
import { categories, tools, type Tool } from '../config/tools';
import { toolGuides } from '../config/tool-guides';
import { categoryPath, toolFaq } from '../lib/seo';
import { FAQ } from './FAQ';
import { Icon } from './Icon';
import { AdSlot } from './SiteShell';
import { ToolCard } from './ToolCard';

export function ToolPage({ tool, children }: { tool: Tool; children: ReactNode }) {
  const category = categories.find(category => category.id === tool.category)!;
  const guide = toolGuides[tool.slug];
  const fileTool = tool.category === 'pdf' || tool.category === 'image';
  const steps = guide?.steps ?? [
    fileTool ? 'Choose your file, drag it into the workspace, or paste it.' : 'Enter or paste your input in the workspace.',
    'Choose the settings that fit your task.',
    fileTool ? 'Process your file and check the result.' : 'Generate your result and review it.',
    fileTool ? 'Download your file, or save multiple results as a ZIP.' : 'Copy or download your finished result.',
  ];
  const related = guide
    ? guide.relatedSlugs.flatMap(slug => tools.filter(candidate => candidate.slug === slug))
    : tools.filter(candidate => candidate.category === tool.category && candidate.slug !== tool.slug).slice(0, 4);

  return (
    <div className={'container tool-page category-' + tool.category}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <Link to={categoryPath(tool.category)}>{category.name}</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">{tool.name}</span>
      </nav>
      <header className="tool-title">
        <span className="tool-icon"><Icon name={tool.icon} size={24} /></span>
        <div className="tool-heading">
          <h1>{guide?.heading ?? tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <span className="tool-local"><ShieldCheck size={15} aria-hidden="true" />Runs in your browser</span>
      </header>
      <AdSlot placement="banner" />
      {tool.note && <aside className="tool-note"><Info size={15} /><span>{tool.note}</span></aside>}
      <section className="workspace" aria-label={tool.name + ' workspace'}>
        {children}
      </section>
      <section className="tool-info">
        <div className="info-columns">
          <div>
            <h2>How to use {tool.name}</h2>
            <ol>{steps.map(step => <li key={step}>{step}</li>)}</ol>
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
        {guide && (
          <div className="tool-example">
            <h2>{guide.exampleHeading}</h2>
            <p>{guide.example}</p>
          </div>
        )}
        <h2>Frequently asked questions</h2>
        <FAQ items={toolFaq(tool)} />
      </section>
      <section className="related-section">
        <h2>Related tools</h2>
        <div className="tool-grid">
          {related.map(candidate => <ToolCard key={candidate.slug} tool={candidate} />)}
        </div>
      </section>
    </div>
  );
}
