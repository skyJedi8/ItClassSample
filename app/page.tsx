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
import MissionAnimation from '@/components/MissionAnimation';
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
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Mission-driven property care</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A disciplined process from first contact to final walkthrough.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">OCF combines veteran-owned accountability, surface-appropriate methods, and clear communication so homeowners and property managers know what to expect.</p>
          </div>
          <MissionAnimation />
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Exterior Cleaning Services</h2>
        <p className="mt-3 max-w-3xl text-slate-300">Straightforward quoting, careful property protection, and professional cleanup across every service.</p>
        <div className="mt-7"><ServiceCards /></div>
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Completed Project Results</h2>
          <p className="mt-3 max-w-2xl text-slate-300">Real pressure-washing work completed by Operation Clean Freedom in the Greater Houston area.</p>
          <div className="mt-6"><BeforeAfterSection /></div>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold tracking-tight text-white">How It Works</h2>
        <p className="mt-3 text-slate-300">A simple process focused on speed, reliability, and clear expectations.</p>
        <div className="mt-6"><ProcessSteps /></div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Recent OCF Work</h2>
        <p className="mt-3 text-slate-300">Project photos from completed exterior-cleaning jobs.</p>
        <div className="mt-6"><GalleryGrid variant="pressure" /></div>
        <Link href="/gallery" className="mt-5 inline-block font-semibold text-brand-200">View Full Gallery →</Link>
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Client Testimonials</h2>
          <p className="mt-3 text-slate-300">Customers consistently highlight our work quality, professionalism, and responsiveness.</p>
          <div className="mt-6"><ReviewCarousel limit={6} /></div>
          <Link href="/reviews" className="mt-5 inline-block font-semibold text-brand-200">Read All Reviews →</Link>
        </div>
      </Section>

      <Section>
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Commercial, HOA & Property Management</h2>
          <p className="mt-3 max-w-3xl text-slate-300">Reliable recurring exterior cleaning for properties that need predictable communication, scheduling, and standards.</p>
          <Link href="/commercial-hoa" className="mt-5 inline-block rounded-md bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-200">Discuss Recurring Service</Link>
        </div>
      </Section>

      <Section>
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Request a Quote</h2>
          <p className="mt-3 max-w-2xl text-slate-300">For the fastest quote, include the service address or ZIP, service needed, preferred timeframe, and callback preference.</p>
          <div className="mt-6"><QuoteForm compact /></div>
        </div>
      </Section>

      <CTASection title="Get the veteran-owned clean your property deserves." />
    </main>
  );
}
