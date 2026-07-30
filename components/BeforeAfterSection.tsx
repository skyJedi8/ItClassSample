import Image from 'next/image';

const results = [
  {
    src: '/images/projects/pwr1%20-%20Copy.png',
    label: 'Concrete surface cleaning',
    alt: 'Concrete driveway pressure washing in Houston TX by Operation Clean Freedom'
  },
  {
    src: '/images/projects/pwr5%20-%20Copy.png',
    label: 'Driveway and flatwork refresh',
    alt: 'Houston TX driveway and flatwork after professional pressure washing'
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
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand-200">Completed Project</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{result.label}</h3>
          <p className="mt-2 text-sm text-slate-300">Real OCF field work with controlled cleaning, property protection, and final cleanup.</p>
        </article>
      ))}
    </div>
  );
}
