import { NextRequest, NextResponse } from 'next/server';
import { readTaps, statsTokenOk } from '@/lib/text-taps';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  if (!statsTokenOk(request.nextUrl.searchParams.get('key'))) return NextResponse.json({ error: 'not_found' }, { status: 404, headers });
  try { const { state } = await readTaps(); return NextResponse.json(state, { headers }); }
  catch { return NextResponse.json({ error: 'unavailable' }, { status: 503, headers }); }
}
