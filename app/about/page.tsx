import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'About Operation Clean Freedom | Veteran-Owned Exterior Cleaning',
  'Veteran-owned and operated exterior cleaning built on reliability, communication, property protection, and cleanup.',
  '/about'
);

const standards = [
  'Clear scope before work begins',
  'Respect for your property and access points',
  'Professional communication and invoicing',
  'Cleanup and final confirmation'
];

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">About Operation Clean Freedom</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold text-white sm:text-5xl">Veteran-Owned. Detail-Driven. Built on Reliability.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Operation Clean Freedom was built on simple standards: show up prepared, communicate clearly, protect the property, and leave each site cleaner than we found it. Our military background shapes how we plan, execute, and follow through for every client.</p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {standards.map((standard) => <div key={standard} className="glass-card p-5 text-slate-200">{standard}</div>)}
        </div>
        <div className="premium-panel mt-8 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">Protection you can verify</p>
          <p className="mt-2 text-xl font-semibold text-white">Fully insured — $2M aggregate general liability.</p>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
