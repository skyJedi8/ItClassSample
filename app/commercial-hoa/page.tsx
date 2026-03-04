import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import QuoteForm from '@/components/QuoteForm';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata('Commercial & HOA Exterior Cleaning | OCF Houston','Exterior cleaning partner for commercial properties, HOAs, and property managers with recurring maintenance options.','/commercial-hoa');

export default function Page(){return <main><Section><h1 className="text-4xl font-bold">Exterior Cleaning Partner for Commercial Properties, HOAs & Property Managers</h1><ul className="mt-5 list-disc pl-5 space-y-2"><li>Fast communication and scheduling updates</li><li>Clear service scope and site notes</li><li>Reliable follow-through and quality control</li><li>Consistent cleanup standards</li></ul><h2 className="mt-8 text-2xl font-semibold">Recurring Maintenance</h2><p className="mt-2">Monthly, quarterly, and semiannual service options tailored to property needs.</p><h2 className="mt-8 text-2xl font-semibold">Admin-ready support</h2><p className="mt-2">Invoicing and COI available upon request.</p></Section><Section className="bg-slate-50"><h2 className="text-3xl font-bold mb-4">Request a Walkthrough Quote</h2><QuoteForm/></Section><CTASection/></main>}
