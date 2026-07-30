export default function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} className="group glass-card p-5 open:border-brand-500/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
            {item.q}
            <span className="text-xl text-brand-200 transition group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-300">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
