import { NextRequest, NextResponse } from 'next/server';
import { auth, staffAuthConfigured } from '@/lib/staff/auth';
import { allowedStaffOrigin, isOwner, isStaff } from '@/lib/staff/owner';
import { changePassword, inspectGrant, listAccounts, manageAccount, redeemGrant } from '@/lib/staff/accounts';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' } });
export async function GET() {
  if (!staffAuthConfigured()) return reply({ error: 'Account service unavailable.' }, 503);
  if (!isOwner(await auth())) return reply({ error: 'Owner access required.' }, 403);
  try { return reply(await listAccounts()); } catch { return reply({ error: 'Account service unavailable. Try again.' }, 503); }
}
export async function POST(request: NextRequest) {
  if (!allowedStaffOrigin(request.headers.get('origin'))) return reply({ error: 'Request origin rejected.' }, 403);
  if (!staffAuthConfigured()) return reply({ error: 'Account service unavailable.' }, 503);
  try {
    const raw = await request.text(); if (raw.length > 4096) return reply({ error: 'Request too large.' }, 413);
    const body = JSON.parse(raw);
    if (body.action === 'inspect') return reply(await inspectGrant(body.token));
    if (body.action === 'redeem') return reply({ email: await redeemGrant(body.token, body.password), message: 'Password saved. You can now sign in.' });
    const session = await auth();
    if (!isStaff(session) || !session?.user) return reply({ error: 'Sign in required.' }, 401);
    if (body.action === 'change') { await changePassword(session.user.id, session.user.version, body.currentPassword, body.password); return reply({ message: 'Password changed. Sign in again with your new password.' }); }
    if (!isOwner(session)) return reply({ error: 'Owner access required.' }, 403);
    if (!['invite', 'reset', 'disable', 'enable', 'cancel'].includes(body.action)) return reply({ error: 'Unsupported action.' }, 400);
    const result = await manageAccount(session.user.id, session.user.version, body.action, body);
    return reply({ message: result.message, ...('token' in result ? { link: `https://www.operationcleanfreedom.com/staff/setup#${result.token}` } : {}) });
  } catch (error) {
    // Never log request bodies, passwords, grant tokens, or storage credentials.
    const message = error instanceof Error ? error.message : '';
    const safe = /^(This setup link|Enter a|Use a password|Too many attempts|Another account|Account already|Account not|Account limit|Enable the account|The owner account|Current password|Sign in again|This account|Owner access)/.test(message);
    return reply({ error: safe ? message : 'The account update could not complete. Try again.' }, safe && message.startsWith('Too many') ? 429 : safe ? 400 : 503);
  }
}
