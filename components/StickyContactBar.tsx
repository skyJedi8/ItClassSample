'use client';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export default function StickyContactBar(){return <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 gap-2 border-t bg-white p-2 md:hidden"><Link aria-label="Call" onClick={()=>trackEvent('click_call')} className="rounded bg-brand-600 py-2 text-center text-white" href={siteConfig.phoneLink}>Call</Link><Link aria-label="Text" onClick={()=>trackEvent('click_text')} className="rounded border border-brand-600 py-2 text-center text-brand-700" href={siteConfig.textLink}>Text</Link><Link aria-label="Get Quote" className="rounded bg-slate-900 py-2 text-center text-white" href="/contact">Get Quote</Link></div>}
