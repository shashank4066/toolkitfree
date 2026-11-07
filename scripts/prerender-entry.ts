import { loadEnv } from 'vite';
Object.assign(process.env, loadEnv('production', process.cwd(), 'VITE_'));
await import('./prerender');
