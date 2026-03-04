import Link from 'next/link';
import Section from './Section';
import { CallButton, TextButton } from './CTAButtons';
export default function CTASection({title='Ready for a fast quote?'}:{title?:string}){return <Section className="bg-brand-900 text-white"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><h2 className="text-2xl font-bold">{title}</h2><div className="flex flex-wrap gap-3"><CallButton/><TextButton/><Link href="/contact" className="rounded bg-white px-5 py-3 font-semibold text-brand-900">Get Quote</Link></div></div></Section>}
