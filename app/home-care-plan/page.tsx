import { getMetadata } from '@/lib/seo';
import HomeCareBuilder from '@/components/HomeCareBuilder';
import HomeCareTracking from '@/components/HomeCareTracking';
import './home-care.css';
export const metadata = getMetadata('Build Your Home Care Plan | Operation Clean Freedom', 'Choose gutters, concrete, exterior washing, walls, windows, solar panels and drainage in one editable maintenance plan.', '/home-care-plan');
export default function Page() { return <main><HomeCareTracking /><HomeCareBuilder /></main>; }
