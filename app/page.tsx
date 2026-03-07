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
        <h2 className="text-3xl font-semibold tracking-tight text-white">Premium Exterior Cleaning Services</h2>
        <p className="mt-3 max-w-3xl text-slate-300">Veteran-owned quality control and clear communication from first text to final walkthrough.</p>
        <div className="mt-7">
          <ServiceCards />
        </div>
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Real Results: Before + After</h2>
          <p className="mt-3 max-w-2xl text-slate-300">We document visible outcomes so you know exactly what changed and what value you received.</p>
          <div className="mt-6">
            <BeforeAfterSection />
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold tracking-tight text-white">How It Works</h2>
        <p className="mt-3 text-slate-300">Fast, veteran-owned process focused on reliability and detail.</p>
        <div className="mt-6">
          <ProcessSteps />
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Additional Supporting Proof</h2>
        <p className="mt-3 text-slate-300">Recent field photos from projects across Greater Houston.</p>
        <div className="mt-6">
          <GalleryGrid />
        </div>
        <Link href="/gallery" className="mt-5 inline-block font-semibold text-cyan-200">View Full Gallery →</Link>
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Client Testimonials</h2>
          <p className="mt-3 text-slate-300">Trust is earned. Veteran-owned consistency keeps our reviews strong.</p>
          <div className="mt-6">
            <ReviewCarousel limit={6} />
          </div>
          <Link href="/reviews" className="mt-5 inline-block font-semibold text-cyan-200">Read All Reviews →</Link>
        </div>
      </Section>

      <Section>
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Commercial, HOA & Property Management</h2>
          <p className="mt-3 max-w-3xl text-slate-300">Reliable recurring exterior cleaning for portfolios that need predictable communication, scheduling, and standards.</p>
          <Link href="/commercial-hoa" className="mt-5 inline-block rounded-md bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            Talk to Us About Recurring Service
          </Link>
        </div>
      </Section>

      <Section>
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Quick Quote Request</h2>
          <p className="mt-3 max-w-2xl text-slate-300">Call, text, or submit the quick form—same conversion flow, faster premium presentation.</p>
          <div className="mt-6">
            <QuoteForm compact />
          </div>
        </div>
      </Section>

      <CTASection title="Get the veteran-owned clean your property deserves." />
    </main>
  );
}
