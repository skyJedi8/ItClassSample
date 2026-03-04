import Link from 'next/link';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import FAQAccordion from '@/components/FAQAccordion';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata('Exterior Cleaning in Spring, TX | Operation Clean Freedom','Professional gutter, window, roof soft wash, pressure washing, and drainage cleaning in Spring, TX.','/service-areas/spring');

const faqs=[
{q:'How does Spring weather affect exteriors?',a:'Humidity, pollen, and algae buildup can quickly impact curb appeal and drainage performance.'},
{q:'Do you service neighborhoods and HOAs?',a:'Yes, we service homes, managed communities, and select commercial properties.'},
{q:'What bundle is most popular?',a:'Gutters + Windows is a common maintenance bundle for visible results.'},
{q:'How far in advance should we book?',a:'Texting photos helps us quote and schedule quickly.'},
{q:'Do you offer recurring cleaning?',a:'Yes, recurring schedules are available for homeowners and managers.'},
{q:'What areas near Spring do you cover?',a:'We cover nearby communities within our 50-mile Houston service radius.'}
];

export default function Page(){return <main><Section><h1 className="text-4xl font-bold">Exterior Cleaning in Spring, TX</h1><p className="mt-3 max-w-3xl">In Spring, moisture, heat, and seasonal pollen can accelerate algae and dirt buildup. Operation Clean Freedom delivers reliable service with clear communication and careful cleanup.</p><h2 className="mt-8 text-2xl font-semibold">Services Offered</h2><ul className="mt-3 list-disc pl-5"><li><Link href="/services/gutter-cleaning">Gutter cleaning</Link></li><li><Link href="/services/window-cleaning">Window cleaning</Link></li><li><Link href="/services/pressure-washing">Pressure/power washing</Link></li><li><Link href="/services/roof-cleaning">Roof cleaning (soft wash)</Link></li><li><Link href="/services/drainage-cleaning">Landscape drainage cleaning</Link></li></ul><h2 className="mt-8 text-2xl font-semibold">Popular Bundles</h2><p className="mt-3">Bundle Gutters + Windows to keep the whole exterior looking sharp with fewer appointments.</p><h2 className="mt-8 text-2xl font-semibold">Local FAQs</h2><div className="mt-4"><FAQAccordion items={faqs}/></div></Section><CTASection/></main>}
