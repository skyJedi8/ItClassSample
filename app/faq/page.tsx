import Section from '@/components/Section';
import FAQAccordion from '@/components/FAQAccordion';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'FAQ | Operation Clean Freedom Houston',
  'Answers to common questions about quoting, scheduling, insurance, service scope, bundling, and recurring exterior cleaning.',
  '/faq'
);

const items = [
  { q: 'What areas do you serve?', a: 'Greater Houston and surrounding communities within about 50 miles.' },
  { q: 'Are you insured?', a: 'Yes. Operation Clean Freedom is fully insured with $2M aggregate general liability.' },
  { q: 'How do I get the fastest quote?', a: 'Call or text 346-306-7622 with the service address, requested services, preferred timeframe, and photos when possible.' },
  { q: 'Can I bundle services?', a: 'Yes. Gutters + Windows is a common bundle, and other scopes can be combined into one visit.' },
  { q: 'Do you offer commercial and HOA service?', a: 'Yes. OCF works with commercial properties, HOAs, property managers, rentals, and smaller multi-unit properties.' },
  { q: 'What are your hours?', a: 'Regular hours are 8:00 AM–5:00 PM. After-hours calls are accepted for urgent scheduling and quoting.' },
  { q: 'Do you clean up after service?', a: 'Yes. Professional cleanup and a final confirmation are part of the OCF process.' },
  { q: 'Can recurring service be set up?', a: 'Yes. Monthly, quarterly, semiannual, seasonal, and custom schedules are available depending on the property.' }
];

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Answers before you schedule</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">Need a faster answer? Call or text OCF and include the property address and service you need.</p>
        <div className="mt-8"><FAQAccordion items={items} /></div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />
      </Section>
      <CTASection />
    </main>
  );
}
