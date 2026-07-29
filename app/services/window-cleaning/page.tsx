import ServiceDetailPage from '@/components/ServiceDetailPage';
import { getMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';

export const metadata = getMetadata(
  'Window Cleaning in Houston, TX | Operation Clean Freedom',
  'Exterior window cleaning with detail-focused techniques and optional interior service on request.',
  '/services/window-cleaning'
);

const faqs = Array.from({ length: 8 }, (_, i) => ({
  q: ['Do you clean exterior windows only?', 'Is interior window cleaning available?', 'Can you remove algae and buildup?', 'Do you clean frames and sills?', 'Do you work around delicate glass?', 'How often should windows be cleaned?', 'Do you service commercial storefronts?', 'Do you offer bundled pricing?'][i],
  a: ['Exterior is standard service.', 'Yes—interior cleaning is available on request.', 'We remove common exterior buildup where safely treatable.', 'Yes, we include basic frame/sill wipe-downs.', 'Yes, we adapt our process for scratch-prone glass types.', 'Many clients schedule 2–4 times per year.', 'Yes, we support commercial and HOA needs.', 'Yes, ask about Gutters + Windows bundles.'][i]
}));

export default function Page() {
  return (
    <ServiceDetailPage
      title="Window Cleaning"
      intro="Clean windows improve curb appeal and natural light. We use careful techniques for streak-minimized results and attention to surface type."
      includes={['Exterior glass cleaning', 'Frame and sill wipe-down', 'Spot-treatment for buildup where appropriate', 'Interior window cleaning available on request']}
      faqs={faqs}
      animation="window"
      schema={serviceSchema('Window Cleaning', 'Detail-focused exterior window cleaning with optional interior add-on.', '/services/window-cleaning')}
    />
  );
}
