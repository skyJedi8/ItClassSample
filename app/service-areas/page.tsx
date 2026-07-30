import Link from 'next/link';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import { serviceAreas } from '@/lib/areas';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Service Areas | Exterior Cleaning in Greater Houston',
  'Houston-based exterior cleaning across a 50-mile radius including Katy, Sugar Land, Spring, and The Woodlands.',
  '/service-areas'
);

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Houston-based • 50-mile radius</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold text-white sm:text-5xl">Exterior Cleaning Across Greater Houston</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">OCF serves homeowners, managed properties, HOAs, rentals, and commercial clients throughout the metro area.</p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map((area) => (
            <Link key={area.slug} className="glass-card group p-6 transition hover:-translate-y-1 hover:border-brand-200/50" href={`/service-areas/${area.slug}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">Service area</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{area.name}, TX</h2>
              <p className="mt-3 text-sm text-slate-300">Explore available services <span aria-hidden="true">→</span></p>
            </Link>
          ))}
        </div>
        <div className="premium-panel mt-8 p-6">
          <p className="text-slate-300">Not listed? Call or text your address. We serve surrounding communities throughout our Greater Houston service radius.</p>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
