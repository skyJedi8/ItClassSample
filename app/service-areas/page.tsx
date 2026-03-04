import Link from 'next/link';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import { areas } from '@/lib/areas';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata('Service Areas | Exterior Cleaning in Greater Houston','Houston-based exterior cleaning across a 50-mile radius including Katy, Sugar Land, Spring, and The Woodlands.','/service-areas');

export default function Page(){return <main><Section><h1 className="text-4xl font-bold">Service Areas</h1><p className="mt-3">Houston-based exterior cleaning across a 50-mile radius.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{areas.map(a=><Link key={a} className="rounded border p-4" href={`/service-areas/${a.toLowerCase().replace(' ','-')}`}>{a}, TX</Link>)}</div><p className="mt-4">And surrounding communities throughout Greater Houston.</p></Section><CTASection/></main>}
