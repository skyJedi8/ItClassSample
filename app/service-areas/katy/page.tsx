import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';
export const metadata = getMetadata('Pressure Washing & Exterior Cleaning in Katy, TX | OCF','Veteran-owned pressure washing, gutter cleaning, roof soft washing, and exterior maintenance for Katy homes and properties.','/service-areas/katy');
export default function Page(){ return <AreaPage city="Katy" />; }
