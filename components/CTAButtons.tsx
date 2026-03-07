'use client';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export function CallButton() {
  return (
    <Link
      href={siteConfig.phoneLink}
      onClick={() => trackEvent('click_call')}
      className="rounded-md bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
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
      className="rounded-md border border-sky-300/80 bg-sky-400/10 px-5 py-3 font-semibold text-sky-100 transition hover:bg-sky-400/20"
    >
      Text for a Fast Quote
    </Link>
  );
}
