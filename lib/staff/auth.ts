import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createHmac } from 'node:crypto';
import { accountsConfigured, authenticate, validAccount } from './accounts';

export function staffAuthConfigured() {
  return (process.env.HOME_CARE_INTAKE_SHARED_KEY?.length || 0) >= 64 && accountsConfigured();
}

export const { auth, handlers, signIn, signOut } = NextAuth(() => ({
  // A domain-separated session key reuses existing secure configuration without
  // exposing or copying its value or introducing a second owner password.
  secret: staffAuthConfigured() ? createHmac('sha256', process.env.HOME_CARE_INTAKE_SHARED_KEY!)
    .update('ocf-staff-session-v1').digest('hex') : undefined,
  basePath: '/api/staff/auth',
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 3600 },
  pages: { signIn: '/staff/login', error: '/staff/login' },
  providers: [Credentials({
    credentials: { username: { label: 'Email' }, password: { label: 'Password', type: 'password' } },
    async authorize(credentials) {
      if (!staffAuthConfigured()) return null;
      try { return await authenticate(credentials.username, credentials.password); } catch { return null; }
    }
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.sub = user.id; token.email = user.email; token.name = user.name; token.version = user.version; }
      return token;
    },
    async session({ session, token }) {
      try {
        const account = typeof token.sub === 'string' && typeof token.version === 'number' ? await validAccount(token.sub, token.version) : null;
        if (!account) return { ...session, user: undefined };
        return { ...session, user: { id: account.id, name: account.name, email: account.email, role: account.role, version: account.version } };
      } catch { return { ...session, user: undefined }; }
    },
    async redirect({ url, baseUrl }) {
      if (url === '/staff' || url === '/staff/login') return baseUrl + url;
      try { const parsed = new URL(url); if (parsed.origin === baseUrl && ['/staff', '/staff/login'].includes(parsed.pathname)) return url; } catch { /* reject external redirect */ }
      return baseUrl + '/staff';
    }
  },
  logger: { error() { console.warn('OCF staff authentication could not complete.'); }, warn() {}, debug() {} }
}));
