import Section from './Section';
import FAQAccordion from './FAQAccordion';
import GalleryGrid from './GalleryGrid';
import CTASection from './CTASection';
import ServiceAnimation from './ServiceAnimation';

const commonWhy = [
  'Veteran-owned and operated',
  'Fully insured – $2M aggregate general liability',
  'Careful property protection and surface-safe methods',
  'Clear communication and professional cleanup'
];

const process = [
  'Answer your questions and confirm scope',
  'Schedule a convenient service window',
  'Protect nearby landscaping and access points',
  'Complete cleaning with the right method',
  'Final walk-through and cleanup confirmation'
];

type AnimationType = 'window' | 'gutter' | 'pressure';
type GalleryVariant = 'placeholder' | 'pressure';

export default function ServiceDetailPage({
  title,
  intro,
  includes,
  faqs,
  schema,
  animation,
  galleryVariant = 'placeholder'
}: {
  title: string;
  intro: string;
  includes: string[];
  faqs: { q: string; a: string }[];
  schema: object;
  animation?: AnimationType;
  galleryVariant?: GalleryVariant;
}) {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Veteran-owned service protocol</p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{title} in Houston & Surrounding Areas</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-300">{intro}</p>
          </div>
          {animation && <ServiceAnimation type={animation} />}
        </div>
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-white">What’s Included</h2>
          <ul className="mt-4 grid gap-3 text-slate-300 sm:grid-cols-2">
            {includes.map((item) => <li key={item} className="glass-card p-4">{item}</li>)}
          </ul>
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold text-white">Why OCF</h2>
        <ul className="mt-4 grid gap-3 text-slate-300 sm:grid-cols-2">
          {commonWhy.map((item) => <li key={item} className="glass-card p-4">{item}</li>)}
        </ul>
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-white">Our Process</h2>
          <ol className="mt-5 grid gap-4 text-slate-300 md:grid-cols-5">
            {process.map((item, index) => (
              <li key={item} className="glass-card p-4">
                <span className="text-xs font-semibold tracking-[0.18em] text-brand-200">STEP {index + 1}</span>
                <p className="mt-2">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <h2 className="mb-5 text-3xl font-bold text-white">FAQs</h2>
        <FAQAccordion items={faqs} />
      </Section>

      <Section>
        <div className="premium-panel p-6 sm:p-8">
          <h2 className="mb-5 text-3xl font-bold text-white">Recent Work</h2>
          <GalleryGrid variant={galleryVariant} />
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
