import { NextRequest, NextResponse } from 'next/server';
import { handlers, staffAuthConfigured } from '@/lib/staff/auth';
import { allowedStaffOrigin } from '@/lib/staff/owner';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  if (!staffAuthConfigured()) return NextResponse.json({ error: 'staff_login_unavailable' }, { status: 503 });
  return handlers.GET(request);
}
export async function POST(request: NextRequest) {
  if (!allowedStaffOrigin(request.headers.get('origin'))) return NextResponse.json({ error: 'origin_not_allowed' }, { status: 403 });
  if (!staffAuthConfigured()) return NextResponse.json({ error: 'staff_login_unavailable' }, { status: 503 });
  if (Number(request.headers.get('content-length') || 0) > 16384) return NextResponse.json({ error: 'request_too_large' }, { status: 413 });
  return handlers.POST(request);
}
