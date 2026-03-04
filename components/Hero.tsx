import { CallButton, TextButton } from './CTAButtons';
import Link from 'next/link';

export default function Hero(){return <section className="bg-slate-50 py-20"><div className="mx-auto max-w-6xl px-4"><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Exterior Cleaning in Houston You Can Trust</h1><p className="mt-5 max-w-3xl text-lg text-slate-700">Veteran-owned and operated. Fast response. Clear communication. Spotless cleanup. Gutters, windows, pressure washing, roof soft wash, and drainage clean-outs across Greater Houston.</p><div className="mt-8 flex flex-wrap gap-3"><CallButton/><TextButton/><Link href="/contact" className="rounded-md bg-slate-900 px-5 py-3 font-semibold text-white">Request a Quote</Link></div></div></section>}
