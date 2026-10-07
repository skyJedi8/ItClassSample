export const OWNER_EMAIL = 'eric.evans@operationcleanfreedom.com';
export const OWNER_ID = 'ocf-owner';
export const BACKEND_ORIGIN = 'https://ocf-jobber-service.vercel.app';

export function isOwner(session: { user?: { email?: string | null } } | null) {
  return session?.user?.email === OWNER_EMAIL;
}

// Password verification stays with the existing OCF service. No password,
// Basic header or Jobber token is stored in the website session.
export async function verifyOwnerLogin(username: unknown, password: unknown, transport: typeof fetch = fetch) {
  if (username !== 'eric' || typeof password !== 'string' || password.length < 32 || password.length > 4096) return false;
  try {
    const result = await transport(`${BACKEND_ORIGIN}/api/account`, {
      headers: { Authorization: `Basic ${Buffer.from(`eric:${password}`).toString('base64')}` },
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(12000)
    });
    if (!result.ok) return false;
    const body = await result.json();
    return body.connected === true && typeof body.account?.id === 'string' &&
      typeof body.account?.name === 'string' && /operation\s+clean\s+freedom/i.test(body.account.name);
  } catch { return false; }
}

export function allowedStaffOrigin(value: string | null) {
  if (!value) return false;
  const origins = ['https://www.operationcleanfreedom.com', 'https://operationcleanfreedom.com'];
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV === 'development') origins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  return origins.includes(value);
}
