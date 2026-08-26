import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Pressure Washing in Conroe, TX | Operation Clean Freedom',
  'Veteran-owned pressure washing, gutter cleaning, roof soft washing, and accessible drainage cleaning for homes and managed properties in Conroe, Texas.',
  '/service-areas/conroe'
);

export default function Page() {
  return <AreaPage city="Conroe" />;
}
