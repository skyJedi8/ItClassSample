import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';

export const metadata = getMetadata(
  'Window Cleaning Add-On in Houston, TX | Operation Clean Freedom',
  'Add exterior window cleaning to an eligible gutter or exterior-cleaning visit in Greater Houston. Not offered as a standalone service.',
  '/services/window-cleaning'
);

const faqs = [
  { q: 'Can I book window cleaning by itself?', a: 'No. Window cleaning is currently available only as an add-on to an eligible gutter or exterior-cleaning visit.' },
  { q: 'Which services can include the window add-on?', a: 'Ask about adding exterior windows to gutter cleaning or another qualifying exterior-maintenance visit.' },
  { q: 'Do you clean exterior windows?', a: 'Yes. The bundled add-on focuses on exterior glass.' },
  { q: 'Can you remove algae and buildup?', a: 'We remove common exterior buildup where it is safely treatable.' },
  { q: 'Do you clean frames and sills?', a: 'The add-on includes a basic frame and sill wipe-down.' },
  { q: 'Do you work around delicate glass?', a: 'We adapt the process for scratch-prone glass and flag concerns before work begins.' },
  { q: 'How do I request the add-on?', a: 'Select “Window cleaning add-on” on the quote form along with your primary exterior service.' },
  { q: 'Is bundled pricing available?', a: 'Yes. The window scope is quoted as part of the complete service visit.' }
];

export default function Page() {
  return (
    <ServiceDetailPage
      title="Window Cleaning Add-On"
      intro="Exterior window cleaning is available as a bundled add-on to an eligible gutter or exterior-cleaning visit. It is not currently offered as a standalone service."
      includes={['Available only with another exterior service', 'Exterior glass cleaning', 'Frame and sill wipe-down', 'Spot-treatment for buildup where appropriate']}
      faqs={faqs}
      animation="window"
      schema={serviceSchema('Window Cleaning Add-On', 'Exterior window cleaning available only as an add-on to an eligible exterior-cleaning visit.', '/services/window-cleaning')}
    />
  );
}
