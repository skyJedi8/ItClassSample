import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/staff/auth';
import { allowedStaffOrigin, isOwner } from '@/lib/staff/owner';
import { campaignRequest } from '@/lib/staff/christmas';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' } });
export async function GET() {
  if (!isOwner(await auth())) return reply({ error: 'Owner access required.' }, 403);
  try { return reply(await campaignRequest({ operation: 'snapshot' })); } catch { return reply({ error: 'Campaign service unavailable. No texts were sent by this read.' }, 503); }
}
export async function POST(request: NextRequest) {
  if (!allowedStaffOrigin(request.headers.get('origin'))) return reply({ error: 'Request origin rejected.' }, 403);
  if (!isOwner(await auth())) return reply({ error: 'Owner access required.' }, 403);
  try {
    const raw = await request.text(); if (raw.length > 12000) return reply({ error: 'Request too large.' }, 413);
    const body = JSON.parse(raw);
    if (!['run_start','retry_held','budget','connect', 'connect_tracker', 'offer', 'quick_review', 'permission_read', 'permission_customer', 'permission_save', 'clients', 'client', 'approve', 'remove', 'prepare', 'start', 'pause', 'advance', 'reconcile'].includes(body.operation)) return reply({ error: 'Unsupported operation.' }, 400);
    return reply(await campaignRequest(body));
  } catch (error) {
    // Never log API keys, message contents, recipient details, or request bodies.
    const code = error instanceof Error && /^[a-z_0-9]{3,100}$/.test(error.message) ? error.message : 'campaign_service_unavailable';
    return reply({ error: code }, 409);
  }
}
