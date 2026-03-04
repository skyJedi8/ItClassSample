'use client';
import { FormEvent, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

const options=['Gutter cleaning','Window cleaning','Pressure/power washing','Roof cleaning (soft wash)','Landscape drainage cleaning'];

export default function QuoteForm({ compact=false }:{ compact?: boolean }){
  const [status,setStatus]=useState('');
  async function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const payload=Object.fromEntries(fd.entries());
    payload.servicesNeeded = fd.getAll('servicesNeeded').join(', ');
    const res=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(res.ok){setStatus('Thanks—your request was sent. If you need the fastest response, text photos to 346-306-7622.');trackEvent('submit_quote_form');e.currentTarget.reset();}
    else setStatus('Please call or text us directly at 346-306-7622.');
  }
  return <form onSubmit={onSubmit} className="space-y-3 rounded-xl border p-5" aria-label="Quote request form">
    <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
    <div className={`grid gap-3 ${compact?'':'md:grid-cols-2'}`}>
      <input required name="fullName" placeholder="Full name*" className="rounded border p-2" />
      <input required name="phone" placeholder="Phone*" className="rounded border p-2" />
      <input name="email" type="email" placeholder="Email" className="rounded border p-2" />
      <input required name="cityZip" placeholder="City / ZIP*" className="rounded border p-2" />
      <select name="propertyType" className="rounded border p-2"><option>Home</option><option>Commercial</option><option>HOA</option></select>
      <select name="stories" className="rounded border p-2"><option>1</option><option>2</option><option>Other</option></select>
    </div>
    <fieldset><legend className="text-sm font-medium">Services needed</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{options.map(o=><label key={o} className="text-sm"><input type="checkbox" name="servicesNeeded" value={o} className="mr-2"/>{o}</label>)}</div></fieldset>
    <textarea name="message" placeholder="Tell us about access, timing, or concerns" className="w-full rounded border p-2" rows={4} />
    <button className="rounded bg-brand-600 px-4 py-2 font-semibold text-white" type="submit">Send Quote Request</button>
    {status && <p className="text-sm">{status}</p>}
  </form>
}
