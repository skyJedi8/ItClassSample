import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';
export const metadata = getMetadata('Pressure Washing & Exterior Cleaning in Sugar Land, TX | OCF','Concrete pressure washing, gutter cleaning, roof soft washing, and exterior maintenance for Sugar Land properties.','/service-areas/sugar-land');
export default function Page(){ return <AreaPage city="Sugar Land" />; }
