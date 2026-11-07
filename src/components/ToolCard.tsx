import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tool } from '../config/tools';
import { Icon } from './Icon';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link to={'/' + tool.slug} className={'tool-card category-' + tool.category} aria-label={tool.name}>
      <div className="card-top">
        <span className="tool-icon"><Icon name={tool.icon} size={19} strokeWidth={1.6} /></span>
        <ArrowUpRight className="card-arrow" size={15} />
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <span className="card-bottom"><span className="free-dot" />Free to use</span>
    </Link>
  );
}
