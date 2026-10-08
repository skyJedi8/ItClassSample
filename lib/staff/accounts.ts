import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { OWNER_EMAIL, OWNER_ID } from './owner';

export type StaffAccount = { id: string; email: string; name: string; role: 'owner' | 'staff'; passwordHash: string; version: number; enabled: boolean; createdAt: string };
type Grant = { hash: string; email: string; name: string; accountId?: string; purpose: 'invite' | 'reset'; expires: number };
type State = { schema: 1; accounts: StaffAccount[]; grants: Grant[]; limits: Record<string, { count: number; until: number }>; audit: { at: string; actor: string; action: string; subject: string }[] };
export type Store = { read(): Promise<{ state: State; etag?: string }>; write(state: State, etag?: string): Promise<void> };
const PATH = 'staff/accounts-v1.json';
const KDF = (value: string, salt: string) => new Promise<Buffer>((resolve, reject) => scrypt(value, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const fresh = (): State => ({ schema: 1, accounts: [], grants: [], limits: {}, audit: [] });
export const accountStore: Store = {
  async read() {
    const result = await get(PATH, { access: 'private', useCache: false, token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!result) return { state: fresh() };
    if (result.statusCode !== 200) throw new Error('Account store unavailable.');
    const state: State = await new Response(result.stream).json();
    if (state.schema !== 1 || !Array.isArray(state.accounts) || !Array.isArray(state.grants) || !state.limits || !Array.isArray(state.audit)) throw new Error('Account store unavailable.');
    return { state, etag: result.blob.etag };
  },
  async write(state, etag) {
    await put(PATH, JSON.stringify(state), { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 60, ...(etag ? { ifMatch: etag, allowOverwrite: true } : { allowOverwrite: false }) });
  }
};
export function accountsConfigured() { return Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.STAFF_BOOTSTRAP_TOKEN_HASH?.match(/^[a-f0-9]{64}$/)); }
export async function transaction<T>(fn: (s: State) => T | Promise<T>, store: Store = accountStore): Promise<T> {
  for (let i = 0; i < 4; i++) {
    const { state, etag } = await store.read();
    const now = Date.now();
    state.grants = state.grants.filter(g => g.expires > now);
    state.limits = Object.fromEntries(Object.entries(state.limits).filter(([, v]) => v.until > now));
    const value = await fn(state);
    try { await store.write(state, etag); return value; }
    catch (error) { if (!(error instanceof BlobPreconditionFailedError) && !(error instanceof Error && /already exists/i.test(error.message))) throw error; }
  }
  throw new Error('Another account update is in progress. Try again.');
}
function audit(s: State, actor: string, action: string, subject: string) { s.audit.push({ at: new Date().toISOString(), actor, action, subject }); s.audit = s.audit.slice(-100); }
function email(value: unknown) { if (typeof value !== 'string' || value.length > 254) throw new Error('Enter a valid email address.'); const e = value.trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('Enter a valid email address.'); return e; }
function name(value: unknown) { if (typeof value !== 'string' || !value.trim() || value.trim().length > 80) throw new Error('Enter a name of up to 80 characters.'); return value.trim(); }
function password(value: unknown): string { if (typeof value !== 'string' || value.length < 12 || value.length > 128) throw new Error('Use a password or phrase of 12–128 characters.'); return value; }
export async function hashPassword(value: unknown) { const p = password(value), salt = randomBytes(16).toString('hex'); const key = await KDF(p, salt); return `scrypt-v1:${salt}:${key.toString('hex')}`; }
export async function checkPassword(value: unknown, encoded: string) { if (typeof value !== 'string' || value.length > 128) return false; const [version, salt, key] = encoded.split(':'); if (version !== 'scrypt-v1' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(key)) return false; const actual = await KDF(value, salt); return timingSafeEqual(actual, Buffer.from(key, 'hex')); }
async function throttle(key: string, maximum: number, store: Store) {
  const allowed = await transaction(s => { const now = Date.now(); const keys = [digest(key), 'global']; if (keys.some(k => (s.limits[k]?.count || 0) >= (k === 'global' ? 100 : maximum))) return false; for (const k of keys) { const l = s.limits[k] || { count: 0, until: now + 15 * 60 * 1000 }; l.count++; s.limits[k] = l; } return true; }, store);
  if (!allowed) throw new Error('Too many attempts. Wait 15 minutes and try again.');
}
export async function authenticate(value: unknown, pass: unknown, store: Store = accountStore) {
  let e: string; try { e = value === 'eric' ? OWNER_EMAIL : email(value); } catch { return null; }
  await throttle('login:' + e, 8, store);
  const { state } = await store.read(); const a = state.accounts.find(a => a.email === e && a.enabled);
  if (!a || !await checkPassword(pass, a.passwordHash)) return null;
  const current = (await store.read()).state.accounts.find(u => u.id === a.id && u.enabled && u.version === a.version);
  return current ? { id: current.id, email: current.email, name: current.name, role: current.role, version: current.version } : null;
}
export async function validAccount(id: string, version: number, store: Store = accountStore) { const { state } = await store.read(); return state.accounts.find(a => a.id === id && a.version === version && a.enabled) || null; }
function bootstrap(token: string) { const expected = process.env.STAFF_BOOTSTRAP_TOKEN_HASH || ''; return Date.now() < Number(process.env.STAFF_BOOTSTRAP_EXPIRES || 0) && /^[a-f0-9]{64}$/.test(expected) && timingSafeEqual(Buffer.from(digest(token)), Buffer.from(expected)); }
export async function inspectGrant(raw: unknown, store: Store = accountStore) {
  if (typeof raw !== 'string' || !/^[a-f0-9]{64}$/.test(raw)) throw new Error('This setup link is invalid or expired.');
  await throttle('setup:' + digest(raw), 10, store);
  const { state } = await store.read();
  if (!state.accounts.some(a => a.id === OWNER_ID) && bootstrap(raw)) return { email: OWNER_EMAIL, name: 'Eric Evans', purpose: 'owner' };
  const g = state.grants.find(g => g.hash === digest(raw) && g.expires > Date.now());
  if (!g) throw new Error('This setup link is invalid or expired.');
  return { email: g.email, name: g.name, purpose: g.purpose };
}
export async function redeemGrant(raw: unknown, pass: unknown, store: Store = accountStore) {
  const info = await inspectGrant(raw, store); const token = raw as string; const ph = await hashPassword(pass);
  return transaction(s => {
    if (info.purpose === 'owner') {
      if (s.accounts.some(a => a.id === OWNER_ID) || !bootstrap(token)) throw new Error('This setup link has already been used.');
      s.accounts.push({ id: OWNER_ID, email: OWNER_EMAIL, name: 'Eric Evans', role: 'owner', passwordHash: ph, version: 1, enabled: true, createdAt: new Date().toISOString() }); audit(s, OWNER_ID, 'owner_setup', OWNER_ID); return OWNER_EMAIL;
    }
    const g = s.grants.find(g => g.hash === digest(token) && g.expires > Date.now()); if (!g) throw new Error('This setup link has already been used or expired.');
    if (g.purpose === 'reset') { const a = s.accounts.find(a => a.id === g.accountId); if (!a || !a.enabled) throw new Error('This account is unavailable.'); a.passwordHash = ph; a.version++; audit(s, a.id, 'password_reset', a.id); }
    else { if (s.accounts.some(a => a.email === g.email)) throw new Error('This account already exists.'); s.accounts.push({ id: randomBytes(16).toString('hex'), email: g.email, name: g.name, role: 'staff', passwordHash: ph, version: 1, enabled: true, createdAt: new Date().toISOString() }); audit(s, g.email, 'invite_accepted', g.email); }
    s.grants = s.grants.filter(x => x.email !== g.email); return g.email;
  }, store);
}
export async function manageAccount(actorId: string, actorVersion: number, action: string, input: { email?: unknown; name?: unknown; id?: unknown }, store: Store = accountStore) {
  const token = randomBytes(32).toString('hex');
  return transaction(s => {
    const owner = s.accounts.find(a => a.id === actorId && a.version === actorVersion && a.enabled && a.role === 'owner'); if (!owner || owner.id !== OWNER_ID) throw new Error('Owner access required.');
    if (action === 'cancel') { const e = email(input.email); s.grants = s.grants.filter(g => g.email !== e || g.purpose !== 'invite'); audit(s, owner.id, 'invite_cancelled', e); return { message: 'Invitation cancelled.' }; }
    if (action === 'invite') { if (s.accounts.length + s.grants.length >= 30) throw new Error('Account limit reached.'); const e = email(input.email), n = name(input.name); if (s.accounts.some(a => a.email === e)) throw new Error('Account already exists. Use its reset option.'); s.grants = s.grants.filter(g => g.email !== e); s.grants.push({ hash: digest(token), email: e, name: n, purpose: 'invite', expires: Date.now() + 86400000 }); audit(s, owner.id, 'invite_created', e); return { token, message: 'Invite link expires in 24 hours.' }; }
    const a = s.accounts.find(a => a.id === input.id); if (!a) throw new Error('Account not found.');
    if (action === 'reset') { if (!a.enabled) throw new Error('Enable the account before resetting it.'); s.grants = s.grants.filter(g => g.email !== a.email); s.grants.push({ hash: digest(token), email: a.email, name: a.name, accountId: a.id, purpose: 'reset', expires: Date.now() + 3600000 }); audit(s, owner.id, 'reset_link_created', a.id); return { token, message: 'Reset link expires in one hour.' }; }
    if (!['disable', 'enable'].includes(action) || a.role === 'owner') throw new Error('The owner account cannot be disabled.'); a.enabled = action === 'enable'; a.version++; s.grants = s.grants.filter(g => g.email !== a.email); audit(s, owner.id, action, a.id); return { message: a.enabled ? 'Account enabled.' : 'Access removed and sessions revoked.' };
  }, store);
}
export async function listAccounts(store: Store = accountStore) { const { state } = await store.read(); return { accounts: state.accounts.map(({ passwordHash, version, ...a }) => a), pending: state.grants.filter(g => g.purpose === 'invite' && g.expires > Date.now()).map(({ hash, ...g }) => g), audit: state.audit.slice(-20).reverse() }; }
export async function changePassword(id: string, version: number, current: unknown, next: unknown, store: Store = accountStore) { await throttle('change:' + id, 8, store); const a = await validAccount(id, version, store); if (!a || !await checkPassword(current, a.passwordHash)) throw new Error('Current password is incorrect.'); const ph = await hashPassword(next); await transaction(s => { const latest = s.accounts.find(u => u.id === id && u.version === version && u.enabled); if (!latest) throw new Error('Sign in again before changing your password.'); latest.passwordHash = ph; latest.version++; s.grants = s.grants.filter(g => g.email !== latest.email); audit(s, id, 'password_changed', id); }, store); }
