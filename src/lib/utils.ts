import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const unit = bytes < 1000 ? 0 : bytes < 1e6 ? 1 : bytes < 1e9 ? 2 : 3;
  return (bytes / 1000 ** unit).toLocaleString(undefined, { maximumFractionDigits: unit ? 2 : 0 }) + ' ' + ['B', 'KB', 'MB', 'GB'][unit];
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export async function copyText(value: string) { await navigator.clipboard.writeText(value); }
export const baseName = (name: string) => name.replace(/\.[^.]+$/, '');
export const nextFrame = () => new Promise<void>(resolve => setTimeout(resolve, 0));
export function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/encrypted|password/i.test(message)) return 'This PDF needs a password. Use Unlock PDF first with the password you already know.';
  if (/invalid pdf|pdf header|parse pdf|corrupt/i.test(message)) return 'This file looks corrupted or is not a valid PDF. Try another file.';
  if (/memory|allocation|canvas.*size/i.test(message)) return 'Your browser ran out of working memory. Try a smaller file, lower resolution or a desktop browser.';
  if (/dynamically imported|fetch|network/i.test(message)) return 'This tool needs to load a processing library. Reconnect to the internet, open it once, and try again.';
  return message || 'Something went wrong. Please try another file.';
}
export type OutputFile = { name: string; blob: Blob; originalSize?: number; preview?: boolean; note?: string };
export function uniqueNames<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.map(item => {
    let name = item.name, n = 2;
    while (seen.has(name)) { const dot = item.name.lastIndexOf('.'); name = dot < 0 ? item.name + '-' + n++ : item.name.slice(0, dot) + '-' + n++ + item.name.slice(dot); }
    seen.add(name); return { ...item, name };
  });
}
