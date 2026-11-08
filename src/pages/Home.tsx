import { ArrowRight, Check, Download, ShieldCheck, SlidersHorizontal, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, commonFaq, popularSlugs, tools } from '../config/tools';
import { FAQ } from '../components/FAQ';
import { Icon } from '../components/Icon';
import { SearchBar } from '../components/SearchBar';
import { AdSlot } from '../components/SiteShell';
import { ToolCard } from '../components/ToolCard';

const quickTasks = [
  { title: 'Compress an image to 50 KB', path: '/image-target-size?target=50&unit=KB', category: 'image', icon: 'Target' },
  { title: 'Combine multiple PDFs', path: '/pdf-merge', category: 'pdf', icon: 'Files' },
  { title: 'Make a QR code for a link', path: '/qr-generator', category: 'utility', icon: 'QrCode' },
];

const steps = [
  { icon: Upload, title: 'Add your input', text: 'Choose, drop, or paste a file. Text tools accept typed or pasted text.' },
  { icon: SlidersHorizontal, title: 'Set your options', text: 'Choose the pages, dimensions, or output format you need.' },
  { icon: Download, title: 'Save the result', text: 'Download your file or copy the result from the workspace.' },
];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="container hero-content">
          <div className="hero-intro">
            <h1 id="home-title">Free online tools</h1>
            <p className="hero-subtitle">
              Merge PDFs, resize images, format JSON, and handle everyday file tasks in your browser.
            </p>
            <SearchBar />
            <ul className="trust-row" aria-label="Tool features">
              <li><ShieldCheck />Files stay on your device</li>
              <li><Check />No signup</li>
              <li><Check />No watermark</li>
            </ul>
          </div>
          <aside className="quick-tasks" aria-labelledby="quick-tasks-title">
            <h2 id="quick-tasks-title">Quick tasks</h2>
            <ul>
              {quickTasks.map(task => (
                <li key={task.path}>
                  <Link to={task.path} className={'category-' + task.category}>
                    <Icon name={task.icon} className="quick-task-icon" size={18} aria-hidden="true" />
                    <span>{task.title}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <div className="container">
        <AdSlot placement="banner" />
        <section className="section popular-section" aria-labelledby="popular-title">
          <div className="section-heading">
            <h2 id="popular-title">Popular tools</h2>
            <Link to="/all-tools" className="text-link">
              All {tools.length} tools <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="tool-grid">
            {popularSlugs.map(slug => (
              <ToolCard key={slug} tool={tools.find(tool => tool.slug === slug)!} />
            ))}
          </div>
        </section>

        <section className="section category-section" aria-labelledby="categories-title">
          <div className="section-heading">
            <h2 id="categories-title">Browse by category</h2>
          </div>
          <div className="category-directory">
            {categories.map(category => {
              const categoryTools = tools.filter(tool => tool.category === category.id);
              return (
                <section className={'category-group category-' + category.id} id={category.id} key={category.id}>
                  <div className="category-heading">
                    <span className="tool-icon"><Icon name={category.icon} size={19} aria-hidden="true" /></span>
                    <div>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  </div>
                  <ul className="category-tool-links">
                    {categoryTools.slice(0, 3).map(tool => (
                      <li key={tool.slug}><Link to={'/' + tool.slug}>{tool.name}</Link></li>
                    ))}
                  </ul>
                  <Link
                    className="text-link category-all"
                    to={'/all-tools?category=' + category.id}
                    aria-label={'View all ' + categoryTools.length + ' ' + category.name}
                  >
                    View all {categoryTools.length} <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </section>
              );
            })}
          </div>
        </section>

        <section className="privacy-strip" aria-labelledby="privacy-title">
          <div className="privacy-strip-icon"><ShieldCheck size={22} aria-hidden="true" /></div>
          <div>
            <h2 id="privacy-title">Files are processed on your device</h2>
            <p>Use the tools for free on your phone or computer. Your browser handles the work without uploading your files.</p>
          </div>
          <Link to="/privacy">Privacy policy <ArrowRight size={15} aria-hidden="true" /></Link>
        </section>

        <section className="section how-section" aria-labelledby="how-title">
          <div className="section-heading"><h2 id="how-title">How it works</h2></div>
          <ol className="steps">
            {steps.map(step => (
              <li className="step" key={step.title}>
                <step.icon size={19} aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div>
            <h2 id="faq-title">Frequently asked questions</h2>
            <Link className="text-link" to="/contact">Contact us <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <FAQ items={commonFaq} />
        </section>
      </div>
    </>
  );
}
