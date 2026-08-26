import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata(
  'Pressure Washing in Spring, TX | Operation Clean Freedom',
  'Veteran-owned pressure washing, gutter cleaning, roof soft washing, and accessible drainage cleaning for homes and managed properties in Spring, Texas.',
  '/service-areas/spring'
);

export default function Page() {
  return <AreaPage city="Spring" />;
}
