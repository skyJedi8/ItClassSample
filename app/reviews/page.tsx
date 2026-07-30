import Link from 'next/link';
import Section from '@/components/Section';
import ReviewCarousel from '@/components/ReviewCarousel';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata = getMetadata(
  'Customer Reviews | Operation Clean Freedom',
  'Read verified Thumbtack customer feedback for gutter cleaning, window cleaning, and exterior cleaning.',
  '/reviews'
);

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Verified customer feedback</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">What Customers Say About OCF</h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">These reviews are from Thumbtack customers and are shown using the reviewer’s original comments.</p>
        <div className="mt-8"><ReviewCarousel limit={10} /></div>
        <Link href={siteConfig.thumbtackUrl} className="mt-7 inline-flex rounded-lg bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-200" target="_blank" rel="noreferrer">
          Read More on Thumbtack <span className="ml-2" aria-hidden="true">↗</span>
        </Link>
      </Section>
      <CTASection title="Ready to see the OCF standard at your property?" />
    </main>
  );
}
