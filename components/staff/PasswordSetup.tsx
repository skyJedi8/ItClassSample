'use client';
import { FormEvent, useEffect, useState } from 'react';
export default function PasswordSetup() {
  const [token, setToken] = useState('');
  const [info, setInfo] = useState<{ email: string; name: string; purpose: string } | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(true); const [done, setDone] = useState(false);
  async function inspect(t: string) {
    if (!/^[a-f0-9]{64}$/.test(t)) { setError('Use your complete private setup, invitation or reset link.'); setBusy(false); return; }
    setToken(t); setBusy(true); setError('');
    try { const r = await fetch('/api/staff/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'inspect', token: t }), cache: 'no-store' }); const body = await r.json(); if (!r.ok) throw new Error(body.error); setInfo(body); }
    catch (e) { setError(e instanceof Error ? e.message : 'Setup is unavailable.'); } finally { setBusy(false); }
  }
  useEffect(() => {
    const t = window.location.hash.slice(1);
    if (!t) { setBusy(false); return; }
    void inspect(t);
  }, []);
  async function openInvitation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const value = String(new FormData(e.currentTarget).get('link') || '').trim();
    let t = value;
    try { const url = new URL(value); if (url.origin !== 'https://www.operationcleanfreedom.com' || url.pathname !== '/staff/setup') throw new Error(); t = url.hash.slice(1); }
    catch { if (!/^[a-f0-9]{64}$/.test(value)) { setError('Use your complete private setup, invitation or reset link.'); return; } }
    await inspect(t);
  }
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
    {!info && !busy && !done && <><p>Already invited? Open your private link, or paste it below to continue.</p><form onSubmit={openInvitation}><label htmlFor="setup-link">Private setup or invitation link</label><input id="setup-link" name="link" type="password" autoComplete="off" required maxLength={220} /><button type="submit" className="staff-primary">Continue to create password</button></form><p className="staff-small">Eric: your owner setup link is in this OCF setup chat. New staff: ask Eric for an invitation. An email address alone cannot create access.</p><a className="staff-text-button" href="/staff/login">Back to sign in</a></>}
    {done ? <><p>Your password has been saved securely. Sign in with your email and the password you just chose.</p><a className="staff-primary" href="/staff/login">Sign in</a></> : info && <><p>{info.name}<br />{info.email}</p><form onSubmit={save}><label htmlFor="new-password">New password</label><input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><p className="staff-small">At least 12 characters. A phrase of several words is easier to remember. Spaces are allowed.</p><label htmlFor="confirm">Repeat your password</label><input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><button type="submit" className="staff-primary" disabled={busy}>{busy ? 'Saving…' : 'Save my password'}</button></form></>}
  </section><p className="staff-login-note">Only people with a private invitation can create an account.</p></main>;
}
