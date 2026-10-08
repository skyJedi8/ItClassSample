import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { auth, signIn, staffAuthConfigured } from '@/lib/staff/auth';
import { allowedStaffOrigin, isStaff } from '@/lib/staff/owner';

async function login(form: FormData) {
  'use server';
  if (!allowedStaffOrigin(headers().get('origin')) || !staffAuthConfigured()) redirect('/staff/login?error=unavailable');
  try { await signIn('credentials', { username: form.get('username'), password: form.get('password'), redirectTo: '/staff' }); }
  catch (error) { if (error instanceof AuthError) redirect('/staff/login?error=credentials'); throw error; }
}
export default async function StaffLogin({ searchParams }: { searchParams: { error?: string } }) {
  const configured = staffAuthConfigured();
  if (configured && isStaff(await auth())) redirect('/staff');
  return <main className="staff-login">
    <a href="/" className="staff-brand">OPERATION CLEAN FREEDOM</a>
    <section className="staff-login-card">
      <span className="staff-eyebrow">APPROVED STAFF ACCESS</span><h1>Your OCF workspace.</h1>
      <p>Campaign preparation, customer links and live Home Care tracking in one private place.</p>
      {!configured ? <div className="staff-alert" role="status">Staff login is temporarily unavailable. Customer information remains protected.</div> : <>
        {searchParams.error && <div role="alert" className="staff-alert">Sign-in could not be completed. Check your email and password. After repeated attempts, wait 15 minutes.</div>}
        <form action={login}>
          <label htmlFor="username">Email address</label><input id="username" name="username" type="email" autoComplete="username" defaultValue="eric.evans@operationcleanfreedom.com" required maxLength={254} />
          <label htmlFor="password">Your staff password</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={128} />
          <button className="staff-primary" type="submit">Open staff dashboard</button>
        </form><p className="staff-small">First time? Open your private setup or invitation link to create a password. Need a reset? Eric can create a private reset link in Access management. If the owner is locked out, use this OCF implementation chat for a verified recovery. There is no public registration.</p>
      </>}
    </section><p className="staff-login-note">Private access · No customer messages are sent when you sign in.</p>
  </main>;
}
