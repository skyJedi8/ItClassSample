import Link from 'next/link';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ServiceCards from '@/components/ServiceCards';
import Section from '@/components/Section';
import ProcessSteps from '@/components/ProcessSteps';
import GalleryGrid from '@/components/GalleryGrid';
import ReviewCarousel from '@/components/ReviewCarousel';
import CTASection from '@/components/CTASection';
import QuoteForm from '@/components/QuoteForm';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import { getMetadata } from '@/lib/seo';
import { localBusinessSchema } from '@/lib/schema';

export const metadata = getMetadata(
  'Exterior Cleaning in Houston, TX | Operation Clean Freedom',
  'Veteran-owned exterior cleaning for gutters, windows, roof soft wash, pressure washing, and drainage cleaning across Greater Houston.',
  '/'
);

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Hero />
      <TrustBar />

      <Section>
        <h2 className="section-heading mb-3">Precision Exterior Services</h2>
        <p className="muted-copy mb-8 max-w-3xl">
          Structured service protocols designed for property protection, visible results, and reliable communication.
        </p>
        <ServiceCards />
      </Section>

      <Section>
        <div className="glass-card p-7 md:p-10">
          <h2 className="section-heading">Bundle Gutters + Windows</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            A premium maintenance flow for homeowners who value consistent curb appeal without managing multiple appointments.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-heading mb-6">How It Works</h2>
        <ProcessSteps />
      </Section>

      <BeforeAfterSection />

      <Section>
        <h2 className="section-heading mb-3">Quality You Can See</h2>
        <p className="muted-copy mb-6 max-w-3xl">Browse proof shots from field work across gutters, windows, roof, and drainage cleaning.</p>
        <GalleryGrid />
        <Link href="/gallery" className="mt-5 inline-block font-semibold text-sky-300">
          View Full Gallery →
        </Link>
      </Section>

      <Section>
        <h2 className="section-heading mb-3">Customer Proof Built on Reliability</h2>
        <p className="muted-copy mb-6 max-w-3xl">
          Clients consistently highlight thoroughness, cleanup standards, communication, and repeat-worthy follow-through.
        </p>
        <ReviewCarousel limit={6} />
        <Link href="/reviews" className="mt-5 inline-block font-semibold text-sky-300">
          Read All Reviews →
        </Link>
      </Section>

      <Section>
        <div className="glass-card p-8 md:p-10">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-sky-300">Commercial / HOA / Property Management</p>
          <h2 className="section-heading">Professional Exterior Maintenance for Managed Properties</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Recurring maintenance options, clear communication, and disciplined service execution for commercial sites,
            HOAs, and property management portfolios.
          </p>
          <Link href="/commercial-hoa" className="mt-5 inline-block rounded-lg bg-sky-500 px-4 py-2 font-semibold text-slate-950">
            Talk to Us About Recurring Service
          </Link>
        </div>
      </Section>

      <Section>
        <h2 className="section-heading mb-4">Request a Fast Quote</h2>
        <QuoteForm compact />
      </Section>

      <CTASection title="Call or Text for a Fast Quote from a Veteran-Owned Team" />
    </main>
  );
}
