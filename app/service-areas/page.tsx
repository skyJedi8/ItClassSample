import Link from 'next/link';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import { serviceAreas } from '@/lib/areas';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Pressure Washing Service Areas | Conroe, Spring & The Woodlands',
  'Veteran-owned pressure washing, gutter cleaning, roof soft washing, and exterior cleaning in Conroe, Spring, The Woodlands, and Greater Houston.',
  '/service-areas'
);

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Conroe-based service • Greater Houston radius</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold text-white sm:text-5xl">Pressure Washing &amp; Exterior Cleaning Service Areas</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Operation Clean Freedom serves homeowners, rentals, HOAs, managed properties, and eligible commercial clients across Conroe, Spring, The Woodlands, and surrounding Greater Houston communities.</p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map((area) => (
            <Link key={area.slug} className="glass-card group p-6 transition hover:-translate-y-1 hover:border-brand-200/50" href={'/service-areas/' + area.slug}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">Local service area</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{area.name}, TX</h2>
              <p className="mt-3 text-sm text-slate-300">View pressure washing, gutter cleaning, roof soft washing, and exterior maintenance details <span aria-hidden="true">→</span></p>
            </Link>
          ))}
        </div>
        <div className="premium-panel mt-8 p-6">
          <h2 className="text-xl font-semibold text-white">Need service outside the listed cities?</h2>
          <p className="mt-3 text-slate-300">Call or text the property address and requested service. OCF reviews nearby jobs throughout its Greater Houston service radius.</p>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
