import Section from '@/components/Section';
import GalleryGrid from '@/components/GalleryGrid';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Exterior Cleaning Gallery | Operation Clean Freedom Houston',
  'See completed pressure washing and exterior cleaning projects from Operation Clean Freedom across Greater Houston.',
  '/gallery'
);

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Real OCF field work</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Project Gallery</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Completed pressure-washing and exterior-cleaning projects from Operation Clean Freedom across the Greater Houston area.</p>
        <div className="mt-8"><GalleryGrid variant="pressure" /></div>
      </Section>
      <CTASection title="Ready to restore your property’s exterior?" />
    </main>
  );
}
