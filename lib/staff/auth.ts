import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createHmac } from 'node:crypto';
import { OWNER_EMAIL, OWNER_ID, verifyOwnerLogin } from './owner';

export function staffAuthConfigured() {
  return (process.env.HOME_CARE_INTAKE_SHARED_KEY?.length || 0) >= 64;
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
    credentials: { username: { label: 'Username' }, password: { label: 'OCF service password', type: 'password' } },
    async authorize(credentials) {
      if (!staffAuthConfigured() || !await verifyOwnerLogin(credentials.username, credentials.password)) return null;
      return { id: OWNER_ID, email: OWNER_EMAIL, name: 'Eric Evans' };
    }
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.sub = user.id; token.email = user.email; token.name = user.name; }
      return token;
    },
    async session({ session, token }) {
      if (token.sub !== OWNER_ID || token.email !== OWNER_EMAIL) return { ...session, user: undefined };
      return { ...session, user: { name: 'Eric Evans', email: OWNER_EMAIL } };
    },
    async redirect({ url, baseUrl }) {
      if (url === '/staff' || url === '/staff/login') return baseUrl + url;
      try { const parsed = new URL(url); if (parsed.origin === baseUrl && ['/staff', '/staff/login'].includes(parsed.pathname)) return url; } catch { /* reject external redirect */ }
      return baseUrl + '/staff';
    }
  },
  logger: { error() { console.warn('OCF staff authentication could not complete.'); }, warn() {}, debug() {} }
}));
