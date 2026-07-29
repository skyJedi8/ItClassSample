import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';

export const metadata = getMetadata(
  'Pressure Washing in Houston, TX | Operation Clean Freedom',
  'Surface-safe pressure and power washing for concrete, patios, sidewalks, and selected siding areas.',
  '/services/pressure-washing'
);

const faqs = Array.from({ length: 8 }, (_, i) => ({
  q: ['What surfaces do you clean?', 'Do you use different pressure levels?', 'Can pressure washing damage surfaces?', 'Do you clean siding?', 'Do you pretreat algae?', 'How long does service take?', 'Can you clean commercial walks?', 'Do you bundle with gutter cleaning?'][i],
  a: ['Driveways, sidewalks, patios, and other approved exterior surfaces.', 'Yes, we adjust method by surface condition.', 'Improper method can cause damage; we use a controlled, surface-safe approach.', 'Yes, for suitable siding and contamination levels.', 'Yes, where needed and appropriate.', 'Most projects are completed in a single scheduled visit.', 'Yes, recurring plans are available for commercial properties.', 'Yes, bundling is available.'][i]
}));

export default function Page() {
  return (
    <ServiceDetailPage
      title="Pressure / Power Washing"
      intro="Restore walkways, driveways, and exterior surfaces with controlled pressure and proper technique designed to clean effectively while avoiding avoidable damage."
      includes={['Driveway, sidewalk, and patio cleaning', 'Surface-safe pressure selection', 'Targeted treatment for organic buildup', 'Post-clean rinse and site cleanup']}
      faqs={faqs}
      animation="pressure"
      galleryVariant="pressure"
      schema={serviceSchema('Pressure Washing', 'Surface-safe power washing for exterior hardscapes and select siding.', '/services/pressure-washing')}
    />
  );
}
