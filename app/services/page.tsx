import Section from '@/components/Section';
import ServiceCards from '@/components/ServiceCards';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Exterior Cleaning Services in Houston | OCF',
  'Explore gutter cleaning, pressure washing, roof soft washing, drainage cleaning, and eligible bundled add-ons in Greater Houston.',
  '/services'
);

const maintenanceOptions = [
  ['Seasonal gutter care', 'Plan service around heavy leaf fall, storms, and recurring drainage needs.'],
  ['Window cleaning add-on', 'Add exterior glass cleaning to an eligible exterior-maintenance visit; standalone window cleaning is not offered.'],
  ['Exterior wash cycles', 'Schedule surface cleaning based on use, shade, moisture, and visible buildup.'],
  ['Managed-property programs', 'Build a custom recurring scope for rentals, commercial sites, and HOAs.']
];

export default function ServicesPage() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Precision exterior care</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold text-white sm:text-5xl">Exterior Cleaning Services for Houston Homes and Properties</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Choose one service or combine several into a practical maintenance visit. Every job starts with a clear scope and ends with professional cleanup.</p>
        <div className="mt-9"><ServiceCards /></div>
      </Section>
      <Section>
        <div id="bundles" className="premium-panel p-6 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Maintenance made simpler</p>
          <h2 className="mt-3 text-3xl font-bold text-white">One visit. Fewer loose ends.</h2>
          <p className="mt-3 max-w-3xl text-slate-300">Ask about adding exterior window cleaning to an eligible service visit or building a recurring schedule around the needs of your property.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {maintenanceOptions.map(([title, copy]) => (
              <article key={title} className="glass-card p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
