import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { normalizePlan } from '@/lib/home-care';
import { intakeSignature } from '@/lib/home-care-intake-auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const ORIGIN = 'https://www.operationcleanfreedom.com';
const BACKEND = 'https://ocf-jobber-service.vercel.app/api/homecare';
const response = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin !== ORIGIN && origin !== 'https://operationcleanfreedom.com') return response({ error: 'origin_not_allowed' }, 403);
  const secret = process.env.HOME_CARE_INTAKE_SHARED_KEY;
  if (!secret || secret.length < 64) return response({ error: 'intake_unavailable', saved: false }, 503);
  if (Number(request.headers.get('content-length') || 0) > 32768) return response({ error: 'request_too_large' }, 413);
  let raw;
  try {
    const text = await request.text(); if (Buffer.byteLength(text) > 32768) return response({ error: 'request_too_large' }, 413);
    raw = JSON.parse(text);
    if (!/^[0-9a-f]{64}$/.test(raw.intakeToken || '') || !Number.isSafeInteger(raw.expectedRevision) || raw.expectedRevision < 0) throw new Error('Invalid intake');
    raw.plan = normalizePlan(raw.plan);
  } catch { return response({ error: 'invalid_intake' }, 400); }
  // Drop client-supplied internal-test, rate, task-ID and price fields.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateKey = createHmac('sha256', secret).update('homecare-rate:' + ip).digest('hex');
  const payload: { plan: typeof raw.plan; intakeToken: string; expectedRevision: number; rateKey: string; internalTest?: boolean } = { plan: raw.plan, intakeToken: raw.intakeToken, expectedRevision: raw.expectedRevision, rateKey };
  // Privileged internal QA must prove possession of the server key. Its writes
  // reuse the existing internal audit task; public clients cannot select it.
  const testSignature = request.headers.get('x-ocf-internal-test-signature');
  if (testSignature) {
    const testStamp = request.headers.get('x-ocf-internal-test-time') || '';
    const expected = intakeSignature({ plan: raw.plan, intakeToken: raw.intakeToken, expectedRevision: raw.expectedRevision }, testStamp, secret);
    if (!/^\d{13}$/.test(testStamp) || Math.abs(Date.now() - Number(testStamp)) > 180000 || !/^[0-9a-f]{64}$/.test(testSignature) || !timingSafeEqual(Buffer.from(expected), Buffer.from(testSignature))) return response({ error: 'test_access_denied' }, 403);
    payload.internalTest = true;
  }
  const stamp = String(Date.now());
  try {
    const result = await fetch(BACKEND, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ocf-time': stamp, 'x-ocf-signature': intakeSignature(payload, stamp, secret) }, body: JSON.stringify(payload), cache: 'no-store', signal: AbortSignal.timeout(25000), redirect: 'error' });
    const receipt = await result.json();
    if ([200, 202, 400, 403, 409, 429].includes(result.status)) return response(receipt, result.status);
    return response({ error: 'intake_unavailable', saved: false }, 503);
  } catch { return response({ error: 'save_outcome_unknown', saved: false, message: 'Keep this plan reference. Check or retry the same request before creating another plan.' }, 503); }
}
