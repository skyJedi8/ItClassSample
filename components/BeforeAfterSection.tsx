import Image from 'next/image';

const pairs = [
  { before: 'gallery-2.svg', after: 'gallery-3.svg', label: 'Driveway + walkways refresh' },
  { before: 'gallery-5.svg', after: 'gallery-6.svg', label: 'Exterior siding brightened' }
];

export default function BeforeAfterSection() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {pairs.map((pair) => (
        <article key={pair.label} className="premium-panel p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200">Real Results</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{pair.label}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-300">Before</p>
              <Image src={`/placeholders/${pair.before}`} alt="Before cleaning" width={800} height={600} className="h-36 w-full rounded-lg border border-slate-700 object-cover" />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-slate-300">After</p>
              <Image src={`/placeholders/${pair.after}`} alt="After cleaning" width={800} height={600} className="h-36 w-full rounded-lg border border-cyan-500/50 object-cover" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
