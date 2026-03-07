'use client';

import { FormEvent, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

const options = [
  'Gutter cleaning',
  'Window cleaning',
  'Pressure/power washing',
  'Roof cleaning (soft wash)',
  'Landscape drainage cleaning'
];

export default function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, FormDataEntryValue | string> = Object.fromEntries(fd.entries());
    payload.servicesNeeded = fd.getAll('servicesNeeded').join(', ');
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setStatus('Thanks—your request was sent. If you need the fastest response, text photos to 346-306-7622.');
      trackEvent('submit_quote_form');
      e.currentTarget.reset();
    } else {
      setStatus('Please call or text us directly at 346-306-7622.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-4 p-5 md:p-6" aria-label="Quote request form">
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
        <input required name="fullName" placeholder="Full name*" className="rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white" />
        <input required name="phone" placeholder="Phone*" className="rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white" />
        <input name="email" type="email" placeholder="Email" className="rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white" />
        <input required name="cityZip" placeholder="City / ZIP*" className="rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white" />
        <select name="propertyType" className="rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white">
          <option>Home</option>
          <option>Commercial</option>
          <option>HOA</option>
        </select>
        <select name="stories" className="rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white">
          <option>1</option>
          <option>2</option>
          <option>Other</option>
        </select>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-slate-200">Services needed</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {options.map((o) => (
            <label key={o} className="text-sm text-slate-300">
              <input type="checkbox" name="servicesNeeded" value={o} className="mr-2" />
              {o}
            </label>
          ))}
        </div>
      </fieldset>
      <textarea
        name="message"
        placeholder="Tell us about access, timing, or concerns"
        className="w-full rounded-lg border border-white/20 bg-slate-900/70 p-2 text-white"
        rows={4}
      />
      <button className="rounded-lg bg-sky-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-400" type="submit">
        Send Quote Request
      </button>
      {status && <p className="text-sm text-slate-200">{status}</p>}
    </form>
  );
}
