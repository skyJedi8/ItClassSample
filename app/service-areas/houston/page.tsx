import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';
export const metadata = getMetadata('Pressure Washing & Exterior Cleaning in Houston, TX | OCF','Veteran-owned pressure washing, gutter cleaning, roof soft washing, and drainage cleaning for Houston homes and properties.','/service-areas/houston');
export default function Page(){ return <AreaPage city="Houston" />; }
