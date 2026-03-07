'use client';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export function CallButton() {
  return (
    <Link
      href={siteConfig.phoneLink}
      onClick={() => trackEvent('click_call')}
      className="rounded-md bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-200"
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
      className="rounded-md border border-brand-500/70 bg-brand-500/10 px-5 py-3 font-semibold text-brand-100 transition hover:bg-brand-500/20"
    >
      Text for a Fast Quote
    </Link>
  );
}
