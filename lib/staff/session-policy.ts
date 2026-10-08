export const NORMAL_SESSION_SECONDS = 60 * 60;
export const REMEMBER_SESSION_SECONDS = 30 * 24 * 60 * 60;
export function sessionDeadline(token: { staffExpiresAt?: unknown; iat?: unknown }, now = Date.now()) {
  if (typeof token.staffExpiresAt === 'number' && Number.isFinite(token.staffExpiresAt)) return token.staffExpiresAt;
  // Existing sessions keep their original one-hour lifetime.
  return typeof token.iat === 'number' ? token.iat * 1000 + NORMAL_SESSION_SECONDS * 1000 : now;
}
export function newSessionDeadline(remember: unknown, now = Date.now()) {
  return now + (remember === true ? REMEMBER_SESSION_SECONDS : NORMAL_SESSION_SECONDS) * 1000;
}
