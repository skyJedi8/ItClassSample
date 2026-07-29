import Section from '@/components/Section';
import GalleryGrid from '@/components/GalleryGrid';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Exterior Cleaning Gallery | Operation Clean Freedom Houston',
  'See examples of gutter, window, pressure washing, roof soft wash, and drainage cleaning work across Greater Houston.',
  '/gallery'
);

export default function Page() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-bold text-white">Project Gallery</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Real Operation Clean Freedom pressure washing project photos. Additional gutter, window, roof, and drainage photos will be added as the final image library is selected.</p>
        <div className="mt-6"><GalleryGrid variant="pressure" /></div>
      </Section>
      <CTASection />
    </main>
  );
}
