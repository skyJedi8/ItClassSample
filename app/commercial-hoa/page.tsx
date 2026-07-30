import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import QuoteForm from '@/components/QuoteForm';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Commercial & HOA Exterior Cleaning | OCF Houston',
  'Exterior cleaning for commercial properties, HOAs, and property managers with clear scopes and recurring maintenance options.',
  '/commercial-hoa'
);

const benefits = [
  ['Clear scope', 'Know what is included before service begins.'],
  ['Reliable communication', 'Receive practical scheduling and access updates.'],
  ['Professional standards', 'Property protection and cleanup are built into the process.'],
  ['Flexible maintenance', 'Monthly, quarterly, semiannual, and custom service cycles.']
];

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Commercial • HOA • Property Management</p>
        <h1 className="mt-3 max-w-5xl text-4xl font-bold text-white sm:text-5xl">A Reliable Exterior-Cleaning Partner for Properties That Need Consistency</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">OCF helps owners and managers maintain walkways, common areas, gutters, roofs, drainage systems, and exterior surfaces with fewer follow-up headaches. Exterior window cleaning may be included as a bundled add-on.</p>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([title, copy]) => (
            <article key={title} className="glass-card p-5">
              <h2 className="font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm text-slate-300">{copy}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Vendor-ready support</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Built for repeatable service</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              <li className="glass-card p-4">Fully insured — $2M aggregate general liability</li>
              <li className="glass-card p-4">Clear invoicing and service documentation</li>
              <li className="glass-card p-4">COI available upon request</li>
              <li className="glass-card p-4">Recurring and multi-service scopes available</li>
            </ul>
          </div>
          <div className="premium-panel p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-white">Request a Walkthrough Quote</h2>
            <p className="mt-3 text-slate-300">Share the address, property type, services, and preferred timeframe. We will follow up using your selected contact method.</p>
            <div className="mt-6"><QuoteForm /></div>
          </div>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
