'use client';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export default function StickyContactBar(){return <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 gap-2 border-t border-slate-700 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-lg md:hidden"><Link aria-label="Call Operation Clean Freedom" onClick={()=>trackEvent('click_call')} className="rounded-lg bg-brand-500 py-3 text-center text-sm font-bold text-slate-950" href={siteConfig.phoneLink}>Call</Link><Link aria-label="Text Operation Clean Freedom" onClick={()=>trackEvent('click_text')} className="rounded-lg border border-brand-400 py-3 text-center text-sm font-bold text-brand-100" href={siteConfig.textLink}>Text</Link><Link aria-label="Get a quote" className="rounded-lg bg-white py-3 text-center text-sm font-bold text-slate-950" href="/contact">Get Quote</Link></div>}
