import Link from 'next/link';
import Section from './Section';
import CTASection from './CTASection';
import FAQAccordion from './FAQAccordion';
import { services } from '@/lib/services';

const areaProfiles: Record<string, { intro: string; priorities: string[] }> = {
  Houston: {
    intro: 'Houston heat, humidity, storms, shade, and heavy property use can accelerate buildup on concrete, roofs, gutters, and drainage systems. OCF provides veteran-owned exterior cleaning with clear scopes and professional cleanup throughout the city.',
    priorities: ['Driveways, sidewalks, and exterior surfaces', 'Storm-ready gutter and drainage maintenance', 'Roof soft washing for organic staining']
  },
  Katy: {
    intro: 'Katy homes and managed properties contend with seasonal pollen, storm debris, shaded concrete, and recurring gutter buildup. OCF provides reliable pressure washing and exterior maintenance across the Katy area.',
    priorities: ['Residential pressure washing and curb appeal', 'Seasonal gutter clearing', 'Bundled maintenance for homes and rentals']
  },
  'Sugar Land': {
    intro: 'Sugar Land humidity, mature landscaping, and shaded surfaces can leave concrete, roofs, and drainage areas looking worn. OCF uses surface-appropriate methods to restore curb appeal without sacrificing careful property protection.',
    priorities: ['Concrete and walkway pressure washing', 'Roof soft washing', 'Exterior maintenance for HOAs and managed properties']
  },
  Spring: {
    intro: 'Spring properties often face heavy tree cover, leaf debris, pollen, and moisture-driven buildup. OCF helps homeowners and property managers keep gutters flowing and exterior surfaces clean through practical maintenance visits.',
    priorities: ['Leaf and debris removal from gutters', 'Pressure washing for shaded surfaces', 'Landscape drainage clean-outs where accessible']
  },
  'The Woodlands': {
    intro: 'The Woodlands’ dense tree canopy creates recurring leaf, pollen, shade, and moisture concerns for gutters, concrete, roofs, and surface drains. OCF delivers disciplined exterior care for homes and managed communities.',
    priorities: ['Tree-debris gutter maintenance', 'Surface-safe concrete cleaning', 'Roof soft washing and drainage support']
  }
};

const commonFaqs = (city: string) => [
  { q: `What services are available in ${city}?`, a: 'OCF offers gutter cleaning, pressure washing, roof soft washing, and landscape drainage cleaning. Exterior window cleaning may be added to an eligible bundled visit.' },
  { q: 'How do I get the fastest quote?', a: 'Call or text the property address, requested service, timeframe, and a few photos when possible.' },
  { q: 'Do you offer bundled services?', a: 'Yes. Window cleaning is available as an add-on to eligible exterior-service visits, and other scopes can be grouped into one appointment.' },
  { q: 'Are recurring schedules available?', a: 'Yes. OCF offers practical maintenance cycles for homeowners, rentals, HOAs, and commercial properties.' },
  { q: 'Are you insured?', a: 'Yes. Operation Clean Freedom is fully insured with $2M aggregate general liability.' }
];

export default function AreaPage({ city }: { city: string }) {
  const profile = areaProfiles[city] || areaProfiles.Houston;

  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Greater Houston service area</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Pressure Washing &amp; Exterior Cleaning in {city}, TX</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{profile.intro}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {profile.priorities.map((priority) => (
            <div key={priority} className="glass-card p-4 text-sm font-medium text-slate-200">{priority}</div>
          ))}
        </div>
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
            <h2 className="mt-3 text-2xl font-bold text-white">Gutter Service + Window Add-On</h2>
            <p className="mt-3 text-slate-300">Window cleaning is not offered by itself, but it may be added to an eligible gutter or exterior-maintenance visit.</p>
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
