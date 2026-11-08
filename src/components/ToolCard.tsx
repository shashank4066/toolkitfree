import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tool } from '../config/tools';
import { Icon } from './Icon';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link to={'/' + tool.slug + '/'} className={'tool-card category-' + tool.category}>
      <span className="tool-icon">
        <Icon name={tool.icon} size={20} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="card-content">
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
      <ArrowRight className="card-arrow" size={16} aria-hidden="true" />
    </Link>
  );
}
