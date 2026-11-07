import { Plus } from 'lucide-react';
export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return <div className="faq-list">{items.map(item => <details key={item.question}><summary>{item.question}<Plus size={18}/></summary><p>{item.answer}</p></details>)}</div>;
}
