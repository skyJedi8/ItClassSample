import AreaPage from '@/components/AreaPage';
import { getMetadata } from '@/lib/seo';
export const metadata = getMetadata('Exterior Cleaning in Houston, TX | Operation Clean Freedom','Gutter, window, roof, pressure washing, and drainage cleaning in Houston, TX.','/service-areas/houston');
export default function Page(){ return <AreaPage city="Houston" />; }
