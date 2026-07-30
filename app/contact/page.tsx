import Section from '@/components/Section';
import QuoteForm from '@/components/QuoteForm';
import { CallButton, TextButton } from '@/components/CTAButtons';
import { getMetadata } from '@/lib/seo';
import { localBusinessSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site';

export const metadata = getMetadata(
  'Contact Operation Clean Freedom | Get a Fast Quote',
  'Call, text, or request a quote for exterior cleaning services in Houston and surrounding communities.',
  '/contact'
);

export default function Page() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Section>
        <div className="grid gap-9 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Call • Text • Quote Request</p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Get a Fast Quote</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">For the fastest response, call or text. Include photos, the service address, what needs cleaning, and your preferred timeframe.</p>
            <div className="mt-7 flex flex-wrap gap-3"><CallButton /><TextButton /></div>
            <div className="premium-panel mt-8 p-6 text-sm">
              <p className="font-semibold text-white">{siteConfig.phoneDisplay}</p>
              <p className="mt-2 text-slate-300">{siteConfig.email}</p>
              <p className="mt-2 text-slate-300">{siteConfig.hours}</p>
              <p className="mt-4 text-brand-200">{siteConfig.serviceRadius}</p>
            </div>
          </div>
          <div className="premium-panel p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Tell us about the property</h2>
            <p className="mt-2 text-sm text-slate-300">Required fields help us verify the service, location, timeframe, and best way to call you back.</p>
            <div className="mt-6"><QuoteForm /></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
