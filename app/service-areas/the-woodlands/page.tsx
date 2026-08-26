import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Pressure Washing in The Woodlands, TX | OCF',
  'Veteran-owned pressure washing, gutter cleaning, roof soft washing, and exterior maintenance across The Woodlands, Texas.',
  '/service-areas/the-woodlands'
);

export default function Page() {
  return <AreaPage city="The Woodlands" />;
}
