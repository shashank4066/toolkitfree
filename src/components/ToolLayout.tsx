import { lazy, Suspense, type ComponentType } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { Tool } from '../config/tools';
import { ToolPage } from './ToolPage';

// Vite's glob makes adding a component automatic while preserving lazy route chunks.
const modules = import.meta.glob<{ default: ComponentType<{ tool: Tool }> }>('../tools/**/*.tsx');
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
export function ToolLayout({ tool }: { tool: Tool }) {
  return (
    <ToolPage tool={tool}>
      <ToolWorkspace tool={tool} />
    </ToolPage>
  );
}
