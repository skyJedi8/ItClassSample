import Link from 'next/link';
import Section from './Section';
import CTASection from './CTASection';
import FAQAccordion from './FAQAccordion';
import { services } from '@/lib/services';
import { serviceAreas } from '@/lib/areas';
import { siteConfig } from '@/lib/site';

type AreaProfile = {
  intro: string;
  localContext: string;
  priorities: string[];
  serviceHighlights: { title: string; body: string }[];
  nearbyCommunities: string[];
  quoteNote: string;
};

const areaProfiles: Record<string, AreaProfile> = {
  Houston: {
    intro: 'Houston heat, humidity, storms, shade, and heavy property use can accelerate buildup on concrete, roofs, gutters, and drainage systems. OCF provides veteran-owned exterior cleaning with clear scopes and professional cleanup throughout the city.',
    localContext: 'Frequent storms and long humid seasons make routine exterior maintenance especially valuable for Houston homes, rentals, and managed properties.',
    priorities: ['Driveways, sidewalks, and exterior surfaces', 'Storm-ready gutter and drainage maintenance', 'Roof soft washing for organic staining'],
    serviceHighlights: [
      { title: 'Concrete and exterior washing', body: 'Remove surface buildup from driveways, walkways, patios, and other eligible exterior areas.' },
      { title: 'Gutter and drainage care', body: 'Clear accessible debris and help water move away from the property before the next heavy rain.' },
      { title: 'Managed-property service', body: 'Clear scopes and scheduling for rentals, HOAs, storefronts, and commercial accounts.' }
    ],
    nearbyCommunities: ['Houston', 'Greater Houston', 'North Houston'],
    quoteNote: 'Send the Houston property address, service needed, timeframe, and photos for the fastest estimate.'
  },
  Katy: {
    intro: 'Katy homes and managed properties contend with seasonal pollen, storm debris, shaded concrete, and recurring gutter buildup. OCF provides reliable pressure washing and exterior maintenance across the Katy area.',
    localContext: 'Routine cleaning helps prevent shaded surfaces and storm debris from turning into larger curb-appeal and drainage problems.',
    priorities: ['Residential pressure washing and curb appeal', 'Seasonal gutter clearing', 'Bundled maintenance for homes and rentals'],
    serviceHighlights: [
      { title: 'Pressure washing', body: 'Clean eligible concrete and exterior surfaces with a scope matched to the material and condition.' },
      { title: 'Gutter maintenance', body: 'Remove debris, check accessible downspout flow, and clean up the work area.' },
      { title: 'Bundled exterior visits', body: 'Group eligible services into one practical maintenance appointment.' }
    ],
    nearbyCommunities: ['Katy', 'Cinco Ranch', 'West Houston'],
    quoteNote: 'Send the Katy property address and a few clear photos so OCF can confirm scope and timing quickly.'
  },
  'Sugar Land': {
    intro: 'Sugar Land humidity, mature landscaping, and shaded surfaces can leave concrete, roofs, and drainage areas looking worn. OCF uses surface-appropriate methods to restore curb appeal without sacrificing careful property protection.',
    localContext: 'Mature landscaping and moisture can create recurring buildup around walkways, patios, rooflines, gutters, and surface drains.',
    priorities: ['Concrete and walkway pressure washing', 'Roof soft washing', 'Exterior maintenance for HOAs and managed properties'],
    serviceHighlights: [
      { title: 'Concrete cleaning', body: 'Refresh driveways, walkways, patios, and other eligible flatwork.' },
      { title: 'Roof and gutter service', body: 'Use the appropriate low-pressure or debris-removal approach for the requested scope.' },
      { title: 'Property-manager support', body: 'Coordinate access, timing, scope, and invoicing requirements before work begins.' }
    ],
    nearbyCommunities: ['Sugar Land', 'Stafford', 'Southwest Houston'],
    quoteNote: 'Share the Sugar Land address, requested service, timeframe, and photos for a fast scope review.'
  },
  Spring: {
    intro: 'Operation Clean Freedom provides pressure washing, gutter cleaning, roof soft washing, and accessible drainage cleaning for homes and managed properties throughout Spring, Texas. Every visit starts with a clear scope and ends with professional cleanup.',
    localContext: 'Spring properties often face heavy tree cover, leaf debris, pine pollen, shaded concrete, and moisture-driven buildup. Seasonal exterior maintenance helps preserve curb appeal and keeps gutters and accessible drainage areas ready for heavy rain.',
    priorities: ['Leaf and debris removal from gutters', 'Pressure washing for shaded concrete', 'Landscape drainage clean-outs where accessible'],
    serviceHighlights: [
      { title: 'Pressure washing in Spring', body: 'Clean driveways, sidewalks, patios, and other eligible exterior surfaces affected by shade, pollen, traffic, and organic buildup.' },
      { title: 'Gutter cleaning in Spring', body: 'Remove roofline debris, check accessible downspout flow, and clean up material removed from the system.' },
      { title: 'Roof and drainage maintenance', body: 'Use surface-appropriate soft washing for eligible roofs and clear accessible landscape drainage trouble spots.' }
    ],
    nearbyCommunities: ['Spring', 'Klein', 'Rayford', 'Harmony', 'Imperial Oaks'],
    quoteNote: 'For the fastest Spring estimate, text the address, number of stories, requested service, timeframe, and clear photos of the work area.'
  },
  'The Woodlands': {
    intro: 'Operation Clean Freedom provides pressure washing and exterior cleaning across The Woodlands, Texas, with careful property protection, straightforward quoting, and veteran-owned service. Residential, rental, HOA, and managed-property scopes are available.',
    localContext: 'The Woodlands tree canopy creates recurring leaf, pine needle, pollen, shade, and moisture concerns for gutters, concrete, roofs, and surface drains. A practical maintenance schedule can keep buildup from compounding between storms and seasonal changes.',
    priorities: ['Tree-debris gutter maintenance', 'Surface-safe concrete cleaning', 'Roof soft washing and drainage support'],
    serviceHighlights: [
      { title: 'Pressure washing in The Woodlands', body: 'Refresh eligible driveways, walkways, patios, and exterior surfaces while protecting nearby landscaping and finishes.' },
      { title: 'Gutter cleaning in The Woodlands', body: 'Clear leaves, needles, and debris from accessible gutter systems and confirm accessible downspout flow.' },
      { title: 'Exterior maintenance for managed properties', body: 'Coordinate defined scopes for homes, rentals, HOAs, storefronts, and community property needs.' }
    ],
    nearbyCommunities: ["The Woodlands", "Grogan's Mill", 'Panther Creek', "Cochran's Crossing", 'Sterling Ridge', 'Creekside Park'],
    quoteNote: 'Text the Woodlands property address, service, timeframe, number of stories, and photos for the fastest estimate.'
  },
  Conroe: {
    intro: 'Operation Clean Freedom provides pressure washing, gutter cleaning, roof soft washing, and accessible drainage cleaning for Conroe, Texas homeowners, rentals, HOAs, and commercial properties. OCF is veteran-owned, fully insured, and focused on clear communication from quote through cleanup.',
    localContext: 'Conroe properties deal with humid weather, fast-growing organic buildup, storm debris, mature trees, and heavy use of driveways and walkways. Regular exterior maintenance can improve curb appeal while keeping gutters and accessible drainage areas ready for Texas weather.',
    priorities: ['Driveway and concrete pressure washing', 'Gutter and downspout debris removal', 'Exterior maintenance for homes and managed properties'],
    serviceHighlights: [
      { title: 'Pressure washing in Conroe', body: 'Clean eligible driveways, sidewalks, patios, and exterior surfaces using a method matched to the material and condition.' },
      { title: 'Gutter cleaning in Conroe', body: 'Remove debris, inspect accessible trouble spots, check accessible downspout flow, and clean up after service.' },
      { title: 'Roof, drainage, and bundled service', body: 'Combine eligible exterior scopes into one visit, including roof soft washing and accessible landscape drainage cleaning.' }
    ],
    nearbyCommunities: ['Conroe', 'Lake Conroe', 'Montgomery', 'Woodforest', 'Grand Central Park', 'River Plantation'],
    quoteNote: 'For the fastest Conroe estimate, text the property address, service needed, timeframe, number of stories, and a few clear photos.'
  }
};

function getFaqs(city: string, profile: AreaProfile) {
  return [
    {
      q: 'Do you provide pressure washing throughout ' + city + '?',
      a: 'Yes. OCF serves residential and eligible commercial properties in ' + city + ' and nearby communities within the Greater Houston service radius.'
    },
    {
      q: 'What exterior cleaning services are available in ' + city + '?',
      a: 'OCF offers pressure washing, gutter cleaning, roof soft washing, and accessible landscape drainage cleaning. Exterior window cleaning may be added to an eligible bundled visit.'
    },
    {
      q: 'How do I get the fastest quote?',
      a: profile.quoteNote
    },
    {
      q: 'Can you clean gutters on a two-story property?',
      a: 'Two-story gutter work may be available when access and roofline conditions are safe. Share photos so OCF can confirm the scope before scheduling.'
    },
    {
      q: 'Do you serve HOAs, rentals, and commercial properties?',
      a: 'Yes. OCF works with homeowners, rentals, property managers, HOAs, storefronts, and other commercial accounts when the requested scope is a fit.'
    },
    {
      q: 'Is Operation Clean Freedom insured?',
      a: 'Yes. Operation Clean Freedom is fully insured with $2M aggregate general liability coverage.'
    }
  ];
}

export default function AreaPage({ city }: { city: string }) {
  const profile = areaProfiles[city] || areaProfiles.Houston;
  const faqs = getFaqs(city, profile);
  const slug = city.toLowerCase().replaceAll(' ', '-');
  const pageUrl = siteConfig.baseUrl + '/service-areas/' + slug;
  const nearbyPages = serviceAreas.filter((area) => area.name !== city && ['Conroe', 'Spring', 'The Woodlands'].includes(area.name));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Pressure Washing and Exterior Cleaning in ' + city + ', TX',
        serviceType: ['Pressure Washing', 'Gutter Cleaning', 'Roof Soft Washing', 'Exterior Cleaning'],
        url: pageUrl,
        areaServed: { '@type': 'City', name: city + ', Texas' },
        provider: {
          '@type': 'LocalBusiness',
          '@id': siteConfig.baseUrl + '/#business',
          name: siteConfig.name,
          url: siteConfig.baseUrl,
          telephone: siteConfig.phoneDisplay
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Service Areas', item: siteConfig.baseUrl + '/service-areas' },
          { '@type': 'ListItem', position: 3, name: city + ', TX', item: pageUrl }
        ]
      }
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Veteran-owned local exterior cleaning</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Pressure Washing &amp; Exterior Cleaning in {city}, TX</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{profile.intro}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {profile.priorities.map((priority) => (
            <div key={priority} className="glass-card p-4 text-sm font-medium text-slate-200">{priority}</div>
          ))}
        </div>
        <div className="premium-panel mt-8 p-6">
          <h2 className="text-2xl font-bold text-white">Exterior cleaning designed for {city} properties</h2>
          <p className="mt-3 max-w-4xl leading-relaxed text-slate-300">{profile.localContext}</p>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold text-white">Popular exterior cleaning services in {city}</h2>
        <p className="mt-3 max-w-3xl text-slate-300">Choose one service or ask about grouping eligible scopes into a single appointment.</p>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {profile.serviceHighlights.map((item) => (
            <div key={item.title} className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={'/services/' + service.slug} className="glass-card group p-5 transition hover:-translate-y-1 hover:border-brand-200/50">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-200">Available in {city}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{service.name}</h3>
              <p className="mt-3 text-sm text-slate-300">View service scope and common questions <span aria-hidden="true">→</span></p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-6">
            <div className="premium-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">Local coverage</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Serving {city} and nearby communities</h2>
              <p className="mt-3 text-slate-300">{profile.nearbyCommunities.join(' • ')}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{profile.quoteNote}</p>
            </div>
            {nearbyPages.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white">Nearby service-area pages</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {nearbyPages.map((area) => (
                    <Link key={area.slug} href={'/service-areas/' + area.slug} className="rounded-md border border-brand-500/60 px-4 py-2 text-sm font-semibold text-brand-100 hover:bg-brand-500/10">
                      {area.name}, TX
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{city} Exterior Cleaning FAQs</h2>
            <div className="mt-5"><FAQAccordion items={faqs} /></div>
          </div>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
