'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export function CallButton() {
  return (
    <Link
      href={siteConfig.phoneLink}
      onClick={() => trackEvent('click_call')}
      className="rounded-lg bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
    >
      Call Now
    </Link>
  );
}

export function TextButton() {
  return (
    <Link
      href={siteConfig.textLink}
      onClick={() => trackEvent('click_text')}
      className="rounded-lg border border-sky-400/60 bg-sky-500/10 px-5 py-3 font-semibold text-sky-200 transition hover:bg-sky-500/20"
    >
      Text for a Fast Quote
    </Link>
  );
}
