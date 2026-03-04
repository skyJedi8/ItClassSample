import Link from 'next/link';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ServiceCards from '@/components/ServiceCards';
import Section from '@/components/Section';
import ProcessSteps from '@/components/ProcessSteps';
import GalleryGrid from '@/components/GalleryGrid';
import ReviewCarousel from '@/components/ReviewCarousel';
import CTASection from '@/components/CTASection';
import QuoteForm from '@/components/QuoteForm';
import { getMetadata } from '@/lib/seo';
import { localBusinessSchema } from '@/lib/schema';

export const metadata = getMetadata('Exterior Cleaning in Houston, TX | Operation Clean Freedom','Veteran-owned exterior cleaning for gutters, windows, roof soft wash, pressure washing, and drainage cleaning across Greater Houston.','/');

export default function Home(){return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(localBusinessSchema)}}/><Hero/><TrustBar/><Section><h2 className="text-3xl font-bold mb-6">Our Services</h2><ServiceCards/></Section><Section className="bg-slate-50" ><h2 className="text-3xl font-bold">Bundle Gutters + Windows</h2><p className="mt-3 max-w-2xl">A simple way to keep the whole exterior looking sharp—without juggling multiple appointments. Ask about bundling during your quote.</p></Section><Section><h2 className="text-3xl font-bold mb-6">How It Works</h2><ProcessSteps/></Section><Section><h2 className="text-3xl font-bold mb-6">Quality You Can See</h2><GalleryGrid/><Link href="/gallery" className="mt-5 inline-block font-semibold text-brand-700">View Full Gallery →</Link></Section><Section className="bg-slate-50"><h2 className="text-3xl font-bold mb-6">Recent Customer Feedback</h2><ReviewCarousel limit={6}/><Link href="/reviews" className="mt-5 inline-block font-semibold text-brand-700">Read All Reviews →</Link></Section><Section><h2 className="text-3xl font-bold">Commercial, HOA & Property Management</h2><p className="mt-3 max-w-2xl">Reliable exterior cleaning with clear communication, consistent standards, and recurring maintenance options.</p><Link href="/commercial-hoa" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white">Talk to Us About Recurring Service</Link></Section><Section className="bg-slate-50"><h2 className="text-3xl font-bold mb-4">Quick Quote Request</h2><QuoteForm compact/></Section><CTASection/></main>}
