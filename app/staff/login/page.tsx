import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { auth, signIn, staffAuthConfigured } from '@/lib/staff/auth';
import { allowedStaffOrigin, isOwner } from '@/lib/staff/owner';

async function login(form: FormData) {
  'use server';
  if (!allowedStaffOrigin(headers().get('origin')) || !staffAuthConfigured()) redirect('/staff/login?error=unavailable');
  try { await signIn('credentials', { username: form.get('username'), password: form.get('password'), redirectTo: '/staff' }); }
  catch (error) { if (error instanceof AuthError) redirect('/staff/login?error=credentials'); throw error; }
}
export default async function StaffLogin({ searchParams }: { searchParams: { error?: string } }) {
  const configured = staffAuthConfigured();
  if (configured && isOwner(await auth())) redirect('/staff');
  return <main className="staff-login">
    <a href="/" className="staff-brand">OPERATION CLEAN FREEDOM</a>
    <section className="staff-login-card">
      <span className="staff-eyebrow">OWNER ACCESS</span><h1>Your OCF workspace.</h1>
      <p>Campaign preparation, customer links and live Home Care tracking in one private place.</p>
      {!configured ? <div className="staff-alert" role="status">Staff login is temporarily unavailable. Customer information remains protected.</div> : <>
        {searchParams.error && <div role="alert" className="staff-alert">Sign-in could not be completed. Check your OCF service login and try again.</div>}
        <form action={login}>
          <label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" defaultValue="eric" required maxLength={20} />
          <label htmlFor="password">OCF service password</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={32} maxLength={4096} />
          <button className="staff-primary" type="submit">Open staff dashboard <span aria-hidden="true">→</span></button>
        </form><p className="staff-small">Use the existing owner password for your OCF Jobber service. Your Google, Quo and Jobber account passwords are not used here.</p>
      </>}
    </section><p className="staff-login-note">Private access · No customer messages are sent when you sign in.</p>
  </main>;
}
