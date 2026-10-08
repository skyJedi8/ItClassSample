import 'next-auth';
declare module 'next-auth' {
  interface User { role?: 'owner' | 'staff'; version?: number }
  interface Session { user?: { id: string; name?: string | null; email?: string | null; role: 'owner' | 'staff'; version: number } }
}
