import Image from 'next/image';
import Link from 'next/link';
import Section from './Section';

export default function BeforeAfterSection() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-sky-300">Real Results</p>
          <h2 className="section-heading">Proof of Precision, Not Promises</h2>
          <p className="mt-4 muted-copy max-w-2xl">
            This section is structured for an interactive before/after slider upgrade. For launch, we feature side-by-side
            proof slots that highlight visible cleaning results and disciplined cleanup standards.
          </p>
          <Link href="/gallery" className="mt-5 inline-block font-semibold text-sky-300 transition hover:text-sky-200">
            Explore Full Gallery →
          </Link>
        </div>
        <div className="glass-card grid gap-4 p-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">Before</p>
            <Image src="/placeholders/gallery-1.svg" alt="Before cleaning placeholder" width={900} height={600} className="h-48 w-full rounded object-cover" />
          </div>
          <div className="rounded-xl border border-sky-400/30 bg-slate-900/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-sky-300">After</p>
            <Image src="/placeholders/gallery-2.svg" alt="After cleaning placeholder" width={900} height={600} className="h-48 w-full rounded object-cover" />
          </div>
        </div>
      </div>
    </Section>
  );
}
