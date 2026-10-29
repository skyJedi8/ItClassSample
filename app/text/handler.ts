import { NextRequest } from 'next/server';
import { cleanSrc, isBot, recordTap, textPage } from '@/lib/text-taps';

export async function handleTextTap(request: NextRequest, defaultSrc: string) {
  const q = request.nextUrl.searchParams;
  const src = cleanSrc(q.get('src') || q.get('utm_source'), defaultSrc);
  const campaign = q.get('utm_campaign') ? cleanSrc(q.get('utm_campaign'), '') : undefined;
  const ua = request.headers.get('user-agent') || '';
  await recordTap(src, campaign, ua);
  return new Response(textPage(!isBot(ua)), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, max-age=0', 'X-Robots-Tag': 'noindex' } });
}
