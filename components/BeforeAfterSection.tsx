import Image from 'next/image';

const results = [
  {
    src: '/images/curated/pressure-washing-in-progress.webp',
    label: 'Controlled cleaning in progress',
    alt: 'Pressure washing in progress with a visible dirty-to-clean transition on Houston concrete'
  },
  {
    src: '/images/curated/pressure-washing-clean-driveway.webp',
    label: 'Completed driveway cleaning',
    alt: 'Clean residential concrete driveway after professional pressure washing in Houston TX'
  }
];

export default function BeforeAfterSection() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {results.map((result) => (
        <article key={result.src} className="premium-panel overflow-hidden p-4">
          <Image
            src={result.src}
            alt={result.alt}
            width={1200}
            height={900}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-64 w-full rounded-xl border border-slate-700 object-cover"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand-200">Real OCF Project</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{result.label}</h3>
          <p className="mt-2 text-sm text-slate-300">Real OCF field work with controlled cleaning, property protection, and final cleanup.</p>
        </article>
      ))}
    </div>
  );
}
