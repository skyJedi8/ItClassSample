'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export default function StickyContactBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 gap-2 border-t border-white/10 bg-slate-950/95 p-2 backdrop-blur md:hidden">
      <Link
        aria-label="Call"
        onClick={() => trackEvent('click_call')}
        className="rounded bg-sky-500 py-2 text-center font-semibold text-slate-950"
        href={siteConfig.phoneLink}
      >
        Call
      </Link>
      <Link
        aria-label="Text"
        onClick={() => trackEvent('click_text')}
        className="rounded border border-sky-400 py-2 text-center font-semibold text-sky-200"
        href={siteConfig.textLink}
      >
        Text
      </Link>
      <Link aria-label="Get Quote" className="rounded bg-white py-2 text-center font-semibold text-slate-900" href="/contact">
        Get Quote
      </Link>
    </div>
  );
}
