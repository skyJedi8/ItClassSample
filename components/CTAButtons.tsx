'use client';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

export function CallButton() { return <Link href={siteConfig.phoneLink} onClick={()=>trackEvent('click_call')} className="rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700">Call Now</Link>; }
export function TextButton() { return <Link href={siteConfig.textLink} onClick={()=>trackEvent('click_text')} className="rounded-md border border-brand-600 px-5 py-3 font-semibold text-brand-700">Text for a Fast Quote</Link>; }
