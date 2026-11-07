import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Zap, Heart, MousePointer2, Upload, SlidersHorizontal, Download, Smartphone, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, commonFaq, popularSlugs, tools } from '../config/tools';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { Icon } from '../components/Icon';
import { FAQ } from '../components/FAQ';
import { Button } from '../components/ui/button';
import { AdSlot } from '../components/SiteShell';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="free-dot" />Built for the little jobs.<Heart size={11} />
          </div>
          <h1>Free tools that<br/><span>just work.</span></h1>
          <p className="hero-subtitle">PDF, image, text and developer tools.<br className="mobile-break" />
            Fast, private, and completely free. No signup, no watermark, no uploads.</p>
          <SearchBar />
          <div className="popular-searches">
            <span>People are using:</span>
            <Link to="/image-target-size">Compress to 50 KB</Link>
            <Link to="/pdf-merge">Merge PDF</Link>
            <Link to="/qr-generator">Create a QR code</Link>
          </div>
          <div className="trust-row">
            <span><Check />100% Free</span>
            <span><Check />No signup</span>
            <span><ShieldCheck />Files stay on your device</span>
            <span><Check />No watermark</span>
          </div>
        </div>
      </section>

      <div className="container">
        <AdSlot placement="banner" />
        <section className="section popular-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker"><Zap size={14} />The everyday ones</span>
              <h2>Small tools. Big time savers.</h2>
              <p>The tools you reach for most, one click away.</p>
            </div>
            <Link to="/all-tools" className="text-link">
              Browse all {tools.length} tools<ArrowRight size={15} />
            </Link>
          </div>
          <div className="tool-grid">
            {popularSlugs.map(slug => (
              <ToolCard key={slug} tool={tools.find(t => t.slug === slug)!} />
            ))}
          </div>
        </section>

        <section className="privacy-strip">
          <div className="privacy-strip-icon"><ShieldCheck size={26} /></div>
          <div>
            <h3>Your files. Your device. Your peace of mind.</h3>
            <p>Everything is processed right in your browser. Your files never take a trip to a server.</p>
          </div>
          <Link to="/privacy">Read our privacy promise<ArrowUpRight size={15} /></Link>
        </section>

        <section className="section category-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Find your shortcut</span>
              <h2>A tool for every little task.</h2>
            </div>
            <p className="section-aside">Less busywork.<br />More time for what matters.</p>
          </div>
          <div className="category-tabs">
            {categories.map(category => (
              <a key={category.id} href={'#' + category.id} className={'category-tab category-' + category.id}>
                <Icon name={category.icon} size={16} />
                {category.name}<span>{tools.filter(t => t.category === category.id).length}</span>
              </a>
            ))}
          </div>
          {categories.map(category => (
            <div className={'category-group category-' + category.id} id={category.id} key={category.id}>
              <div className="category-heading">
                <span className="tool-icon"><Icon name={category.icon} size={20} /></span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <Link to={'/all-tools?category=' + category.id}>View all<ArrowRight size={14} /></Link>
              </div>
              <div className="tool-grid compact">
                {tools.filter(tool => tool.category === category.id).slice(0, 4).map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="why-section">
          <div className="container">
            <div className="center-heading">
              <span className="section-kicker">Less friction. More done.</span>
              <h2>Good tools should just work.</h2>
              <p>No accounts to create. No software to install. No hoops to jump through.</p>
            </div>
            <div className="benefit-grid">
              {[
                { icon: Heart, title: 'Free. As it should be.', text: 'Every feature, for everyone. No subscriptions or surprise paywalls.' },
                { icon: ShieldCheck, title: 'Private by default.', text: 'Your files stay on your device. Processing happens locally in your browser.' },
                { icon: Zap, title: 'Ready when you are.', text: 'No uploading to a server. Just open a tool and get straight to it.' },
                { icon: Smartphone, title: 'At home on any screen.', text: 'Phone, tablet or desktop. Your toolkit goes wherever your work does.' },
              ].map(item => (
                <div key={item.title} className="benefit">
                  <span><item.icon size={20} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section container how-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">From to-do to done</span>
              <h2>Three steps. That’s it.</h2>
            </div>
            <span className="how-note"><MousePointer2 size={15} />Made to be easy.</span>
          </div>
          <div className="steps">
            {[
              { icon: Upload, title: 'Choose your file', text: 'Drop it in, paste it, or pick it from your device.' },
              { icon: SlidersHorizontal, title: 'Make it yours', text: 'Choose the options you need. We keep it simple.' },
              { icon: Download, title: 'Download. Done.', text: 'Your file is ready. No signup or watermark attached.' },
            ].map((step, i) => (
              <div className="step" key={step.title}>
                <div className="step-number">0{i + 1}</div>
                <step.icon size={20} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section container faq-section">
          <div>
            <span className="section-kicker">A few good questions</span>
            <h2>Wondering about something?</h2>
            <p>Here’s the short version. We like keeping things simple.</p>
            <Link className="text-link" to="/contact">Get in touch<ArrowRight size={14} /></Link>
          </div>
          <FAQ items={commonFaq} />
        </section>

        <section className="container">
          <div className="bottom-cta">
            <span className="cta-icon"><Wrench size={22} /></span>
            <div>
              <h2>Everything you need for everyday digital tasks.</h2>
              <p>Free forever, zero signup, and completely private.</p>
            </div>
            <Button asChild size="lg">
              <Link to="/all-tools">Explore all {tools.length} tools<ArrowRight size={16} /></Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
