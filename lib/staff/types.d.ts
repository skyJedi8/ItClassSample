import 'next-auth';
declare module 'next-auth' {
  interface User { rememberBrowser?: boolean; role?: 'owner' | 'staff'; version?: number }
  interface Session { user?: { id: string; name?: string | null; email?: string | null; role: 'owner' | 'staff'; version: number } }
}
