import Link from 'next/link';
import Section from './Section';
import CTASection from './CTASection';
import FAQAccordion from './FAQAccordion';
import { services } from '@/lib/services';

const commonFaqs = (city: string) => [
  { q: `What services are available in ${city}?`, a: 'OCF offers gutter cleaning, window cleaning, pressure washing, roof soft washing, and landscape drainage cleaning.' },
  { q: 'How do I get the fastest quote?', a: 'Call or text the property address, requested service, timeframe, and a few photos when possible.' },
  { q: 'Do you offer bundled services?', a: 'Yes. Gutters + Windows is a common combination, and other scopes can be grouped into one visit.' },
  { q: 'Are recurring schedules available?', a: 'Yes. OCF offers practical maintenance cycles for homeowners, rentals, HOAs, and commercial properties.' },
  { q: 'Are you insured?', a: 'Yes. Operation Clean Freedom is fully insured with $2M aggregate general liability.' }
];

export default function AreaPage({ city }: { city: string }) {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Greater Houston service area</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Exterior Cleaning in {city}, TX</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Houston-area heat, humidity, pollen, storms, and shade can accelerate buildup on glass, roofs, gutters, concrete, and drainage systems. OCF provides careful exterior cleaning with clear communication and professional cleanup.</p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="glass-card group p-5 transition hover:-translate-y-1 hover:border-brand-200/50">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-200">Available in {city}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{service.name}</h2>
              <p className="mt-3 text-sm text-slate-300">View service scope and common questions <span aria-hidden="true">→</span></p>
            </Link>
          ))}
        </div>
      </Section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="premium-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">Popular maintenance option</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Gutters + Windows</h2>
            <p className="mt-3 text-slate-300">Handle two visible, recurring exterior needs in one scheduled visit. Ask about bundling during your quote.</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Local Service FAQs</h2>
            <div className="mt-5"><FAQAccordion items={commonFaqs(city)} /></div>
          </div>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
