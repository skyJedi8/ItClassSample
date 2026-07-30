'use client';

import { FormEvent, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

const options = ['Gutter cleaning', 'Window cleaning', 'Pressure/power washing', 'Roof cleaning (soft wash)', 'Landscape drainage cleaning'];

export default function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus('');

    try {
      const fd = new FormData(e.currentTarget);
      const payload = Object.fromEntries(fd.entries());
      const selectedServices = fd.getAll('servicesNeeded');
      if (selectedServices.length === 0) {
        setStatus('Please select at least one service.');
        setSending(false);
        return;
      }
      payload.servicesNeeded = selectedServices.join(', ');
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('Thanks—your request was delivered. We will follow up using your preferred contact method.');
        trackEvent('submit_quote_form');
        e.currentTarget.reset();
      } else {
        setStatus(result.error || 'The form could not deliver your request. Please call or text 346-306-7622.');
      }
    } catch {
      setStatus('The form could not deliver your request. Please call or text 346-306-7622.');
    } finally {
      setSending(false);
    }
  }

  const inputClass = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30';
  const labelClass = 'text-sm font-medium text-slate-200';

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-5" aria-label="Quote request form">
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
        <label className={labelClass}>Full name*
          <input required name="fullName" autoComplete="name" placeholder="Your name" className={inputClass} />
        </label>
        <label className={labelClass}>Phone*
          <input required name="phone" type="tel" autoComplete="tel" placeholder="Best callback number" className={inputClass} />
        </label>
        <label className={labelClass}>Email
          <input name="email" type="email" autoComplete="email" placeholder="Optional" className={inputClass} />
        </label>
        <label className={labelClass}>Service address or ZIP*
          <input required name="serviceAddress" autoComplete="street-address" placeholder="Property location" className={inputClass} />
        </label>
        <label className={labelClass}>Property type*
          <select required name="propertyType" className={inputClass} defaultValue="">
            <option value="" disabled>Select one</option>
            <option>Home</option><option>Commercial</option><option>HOA</option><option>Rental / real estate</option><option>Apartment / multi-unit</option>
          </select>
        </label>
        <label className={labelClass}>Stories or height
          <select name="stories" className={inputClass} defaultValue="">
            <option value="">Select if relevant</option><option>1</option><option>2</option><option>3+</option><option>Not applicable</option>
          </select>
        </label>
        <label className={labelClass}>Preferred timeframe*
          <select required name="timeframe" className={inputClass} defaultValue="">
            <option value="" disabled>Select one</option><option>As soon as possible</option><option>This week</option><option>Next week</option><option>Specific date</option><option>Planning / estimate only</option>
          </select>
        </label>
        <label className={labelClass}>Preferred contact*
          <select required name="contactPreference" className={inputClass} defaultValue="">
            <option value="" disabled>Select one</option><option>Text</option><option>Phone call</option><option>Email</option>
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-200">Services needed</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <label key={option} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
              <input type="checkbox" name="servicesNeeded" value={option} className="mr-2 accent-sky-400" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={`block ${labelClass}`}>Project notes
        <textarea name="message" placeholder="Scope, access, timing, gutter guards, or concerns" className={inputClass} rows={4} />
      </label>
      <button disabled={sending} className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-200 disabled:cursor-wait disabled:opacity-60" type="submit">
        {sending ? 'Sending…' : 'Send Quote Request'}
      </button>
      <p className="text-xs text-slate-400">For urgent scheduling or the fastest response, call or text 346-306-7622.</p>
      {status && <p className="text-sm text-slate-200" role="status">{status}</p>}
    </form>
  );
}
