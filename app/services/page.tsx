import Section from '@/components/Section';
import ServiceCards from '@/components/ServiceCards';
import CTASection from '@/components/CTASection';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata('Exterior Cleaning Services in Houston | OCF','Explore gutter, window, pressure washing, roof soft wash, and drainage cleaning services with maintenance plans in Greater Houston.','/services');

export default function ServicesPage(){return <main><Section><h1 className="text-4xl font-bold">Exterior Cleaning Services</h1><p className="mt-3 max-w-3xl">Straightforward scope, careful execution, and cleanup you can see. Choose one service or bundle for fewer visits.</p><div className="mt-8"><ServiceCards/></div></Section><<Section className="bg-slate-50">><h2 className="text-3xl font-bold">Maintenance Cycles</h2><ul className="mt-4 list-disc pl-5 space-y-2"><li>Quarterly gutter cleaning (seasonal)</li><li>Window cleaning schedule (2–4x/year)</li><li>Exterior wash as needed</li><li>Property manager recurring schedules (custom)</li></ul></Section><CTASection/></main>}
