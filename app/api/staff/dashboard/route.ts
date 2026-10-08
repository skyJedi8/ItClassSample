import { NextResponse } from 'next/server';
import { auth, staffAuthConfigured } from '@/lib/staff/auth';
import { isStaff } from '@/lib/staff/owner';
import { loadStaffSnapshot } from '@/lib/staff/data';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const respond = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' } });
export async function GET() {
  if (!staffAuthConfigured() || !isStaff(await auth())) return respond({ error: 'staff_login_required' }, 401);
  try { return respond(await loadStaffSnapshot()); } catch { return respond({ error: 'Live campaign data could not be loaded. No customer action was taken.' }, 503); }
}
export function POST() { return respond({ error: 'This release does not send customer messages or change campaign records.' }, 405); }
