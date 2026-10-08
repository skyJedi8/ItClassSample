'use client';
import { FormEvent, useEffect, useState } from 'react';
export default function PasswordSetup() {
  const [token, setToken] = useState('');
  const [info, setInfo] = useState<{ email: string; name: string; purpose: string } | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(true); const [done, setDone] = useState(false);
  useEffect(() => {
    const t = window.location.hash.slice(1); setToken(t);
    if (!/^[a-f0-9]{64}$/.test(t)) { setError('Open the private setup or reset link provided to you.'); setBusy(false); return; }
    fetch('/api/staff/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'inspect', token: t }), cache: 'no-store' }).then(async r => { const body = await r.json(); if (!r.ok) throw new Error(body.error); setInfo(body); }).catch(e => setError(e.message || 'Setup is unavailable.')).finally(() => setBusy(false));
  }, []);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = new FormData(e.currentTarget); const password = String(form.get('password') || '');
    if (password !== form.get('confirm')) { setError('The two passwords do not match.'); return; }
    setBusy(true); setError('');
    try { const r = await fetch('/api/staff/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'redeem', token, password }), cache: 'no-store' }); const body = await r.json(); if (!r.ok) throw new Error(body.error); setToken(''); window.history.replaceState(null, '', '/staff/setup'); setDone(true); }
    catch (e) { setError(e instanceof Error ? e.message : 'Password could not be saved.'); } finally { setBusy(false); }
  }
  return <main className="staff-login"><a href="/" className="staff-brand">OPERATION CLEAN FREEDOM</a><section className="staff-login-card"><span className="staff-eyebrow">PRIVATE ACCOUNT SETUP</span><h1>{done ? 'You’re ready to sign in.' : info?.purpose === 'reset' ? 'Reset your password.' : 'Choose your password.'}</h1>
    {error && <div className="staff-alert" role="alert">{error}</div>}
    {busy && !info && <p>Checking your private link…</p>}
    {done ? <><p>Your password has been saved securely. Sign in with your email and the password you just chose.</p><a className="staff-primary" href="/staff/login">Sign in</a></> : info && <><p>{info.name}<br />{info.email}</p><form onSubmit={save}><label htmlFor="new-password">New password</label><input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><p className="staff-small">At least 12 characters. A phrase of several words is easier to remember. Spaces are allowed.</p><label htmlFor="confirm">Repeat your password</label><input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><button type="submit" className="staff-primary" disabled={busy}>{busy ? 'Saving…' : 'Save my password'}</button></form></>}
  </section><p className="staff-login-note">Only people with a private invitation can create an account.</p></main>;
}
