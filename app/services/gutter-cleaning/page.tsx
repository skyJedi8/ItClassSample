import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';

export const metadata = getMetadata(
  'Gutter Cleaning in Houston, TX | Operation Clean Freedom',
  'Debris removal, downspout flow checks, and complete cleanup for residential and commercial gutters in Greater Houston.',
  '/services/gutter-cleaning'
);

const faqs = [
  ['How often should gutters be cleaned?', 'Most homes benefit from seasonal service, often quarterly in leaf-heavy areas.'],
  ['Do you flush downspouts?', 'Yes, we check downspout flow where accessible (non-plumbing scope).'],
  ['Do you haul debris away?', 'Yes, we bag and remove debris from your property.'],
  ['Can you clean two-story homes?', 'Yes, we service one-story, two-story, and many multi-structure properties.'],
  ['Will you protect landscaping?', 'Yes, we work to protect beds, pool areas, and hardscape during service.'],
  ['Do you repair gutters?', 'We focus on cleaning; we can note visible concerns for your contractor.'],
  ['What if weather changes?', 'We communicate quickly and reschedule safely when needed.'],
  ['Do you offer recurring plans?', 'Yes, seasonal and recurring schedules are available.']
].map(([q, a]) => ({ q, a }));

export default function Page() {
  return (
    <ServiceDetailPage
      title="Gutter Cleaning"
      intro="Clogged gutters can overflow into fascia, foundations, and landscaping. Our gutter cleaning service removes buildup, restores flow, and leaves your property tidy."
      includes={['Debris removal from gutter runs', 'Downspout check and basic flow clearing where accessible', 'Bag and haul debris from site', 'Cleanup around walkways, patios, and entry points', 'Service notes with visible issue callouts']}
      faqs={faqs}
      animation="gutter"
      schema={serviceSchema('Gutter Cleaning', 'Prevent overflow, pest harboring, and water damage with routine gutter cleaning.', '/services/gutter-cleaning')}
    />
  );
}
