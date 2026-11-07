import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tool } from '../config/tools';
import { Icon } from './Icon';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link to={'/' + tool.slug} className={'tool-card category-' + tool.category} aria-label={tool.name}>
      <div className="card-top">
        <span className="tool-icon">
          <Icon name={tool.icon} size={20} strokeWidth={1.75} />
        </span>
        <ArrowUpRight className="card-arrow" size={16} />
      </div>
      <div className="card-content">
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
      <div className="card-bottom">
        <span className="free-dot" />
        <span>Free · Browser-only</span>
      </div>
    </Link>
  );
}
