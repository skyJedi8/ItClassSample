'use client';
import { useEffect, useRef, useState } from 'react';
import { HOME_CARE_VERSION, SERVICES, Plan, ServiceId, Selection, quotePlan, planSummary, formatMoney, REQUEST_URL } from '@/lib/home-care';

const DRAFT_KEY = 'ocf-home-care-draft-v1';
const blank = (): Plan => ({ id: '', version: HOME_CARE_VERSION, selections: [], payment: 'monthly', property: {} });
const fieldClass = 'hc-input';
export default function HomeCareBuilder() {
  const [plan, setPlan] = useState<Plan>(blank);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<ServiceId>('gutters');
  const [leaving, setLeaving] = useState<ServiceId | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [notice, setNotice] = useState('');
  const [summary, setSummary] = useState('');
  const [serverVerified, setServerVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) { const restored = quotePlan(JSON.parse(saved)).plan; setPlan(restored); setNotice('Your draft was restored on this device.'); }
      else setPlan({ ...blank(), id: crypto.randomUUID() });
    } catch { setPlan({ ...blank(), id: crypto.randomUUID() }); setNotice('We could not restore a draft. You can still build and send your plan.'); }
    setReady(true);
  }, []);
  const quote = plan.id ? quotePlan(plan) : null;
  const service = SERVICES.find(x => x.id === active)!;
  const selected = plan.selections.find(x => x.id === active);
  function change(next: Plan) { setPlan(next); setShowRequest(false); setServerVerified(false); setCopied(false); }
  function choose(id: ServiceId, add: boolean) {
    setLeaving(null);
    const exists = plan.selections.some(x => x.id === id);
    change({ ...plan, selections: add ? exists ? plan.selections : [...plan.selections, { id, visits: 1, answers: {} }] : plan.selections.filter(x => x.id !== id) });
  }
  function beginAdd() {
    if (reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) choose(active, true);
    else setLeaving(active);
  }
  function updateSelection(patch: Partial<Selection>) {
    change({ ...plan, selections: plan.selections.map(x => x.id === active ? { ...x, ...patch } : x) });
  }
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(plan)); setNotice('Draft saved on this device. It has not been sent to OCF.'); }
    catch { setNotice('Device storage is unavailable. Copy your plan below to keep it.'); }
  }
  async function prepare(e: React.FormEvent) {
    e.preventDefault(); if (!plan.selections.length) { setNotice('Add at least one service.'); return; }
    setSaving(true); setNotice('');
    try {
      const response = await fetch('/api/home-care/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan) });
      if (!response.ok) throw new Error('Review unavailable');
      const reviewed = await response.json(); setPlan(reviewed.plan); setSummary(planSummary(reviewed.plan)); setServerVerified(true); setShowRequest(true);
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(reviewed.plan)); } catch { /* Copy still available. */ }
      requestAnimationFrame(() => reviewRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
    } catch { setNotice('Your draft is intact. Plan review is temporarily unavailable; call or text (346) 623-6767 for help.'); }
    finally { setSaving(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setNotice('Plan copied. Paste the full plan into the details field of the secure Jobber form.'); }
    catch { setNotice('Select and copy the full plan from the box below.'); }
  }
  function next() { setLeaving(null); const i = SERVICES.findIndex(x => x.id === active); setActive(SERVICES[(i + 1) % SERVICES.length].id); }
  return <div className={`hc-wrap ${reduceMotion ? 'hc-reduced' : ''}`}>
    <div className="hc-heading"><p className="hc-eyebrow">OCF Home Exterior Care Plan</p><h1>Build your home care plan</h1><p>Choose the services and visit schedule that fit your property. Your first cleaning and future maintenance are quoted separately.</p><div className="hc-tools"><button type="button" onClick={saveDraft} disabled={!ready}>Save draft on this device</button><label><input type="checkbox" checked={reduceMotion} onChange={e => { setReduceMotion(e.target.checked); if (e.target.checked && leaving) choose(leaving, true); }} /> Reduce motion / skip animation</label></div></div>
    <p className="hc-status" role="status" aria-live="polite">{notice}</p>
    <div className="hc-layout"><div>
      <nav className="hc-service-nav" aria-label="All plan services">{SERVICES.map(s => <button type="button" key={s.id} aria-current={active === s.id ? 'step' : undefined} onClick={() => { setLeaving(null); setActive(s.id); }}><span>{s.name}</span><small>{plan.selections.some(x => x.id === s.id) ? 'Added · edit' : 'Choose or skip'}</small></button>)}</nav>
      <section className="hc-service-panel" aria-labelledby="hc-service-title">
        {!selected ? <div className={`hc-intro ${leaving === service.id ? 'hc-leaving' : ''}`} key={service.id} onAnimationEnd={e => { if (e.animationName === 'hc-fade-out') choose(service.id, true); }}><div className="hc-diamond" aria-hidden="true"><span>OCF</span></div><h2 id="hc-service-title">{service.name}</h2><p>{service.description}</p><div className="hc-actions"><button type="button" className="hc-primary" disabled={!ready || leaving !== null} onClick={beginAdd}>Yes, add this service</button><button type="button" onClick={next}>No, skip for now</button></div><p className="hc-note">You can return to every service and change your choices.</p></div> : <div className="hc-config" key={service.id + '-config'}><div className="hc-section-title"><h2 id="hc-service-title">{service.name}</h2><button type="button" onClick={() => choose(active, false)}>Remove</button></div><p>{service.description}</p><fieldset><legend>How often would you like service?</legend><div className="hc-frequency">{service.frequencies.map(visits => <label key={visits} className={selected.visits === visits ? 'hc-chosen' : ''}><input type="radio" name={'visits-' + active} value={visits} checked={selected.visits === visits} onChange={() => updateSelection({ visits })} /><strong>{visits === 1 ? 'Annual' : visits === 2 ? 'Twice a year' : 'Quarterly'}</strong><span>{visits} visit{visits > 1 ? 's' : ''} per year</span></label>)}</div></fieldset><div className="hc-fields">{service.questions.map(q => <label key={q.key}>{q.label}{q.options ? <select className={fieldClass} value={selected.answers[q.key] || ''} onChange={e => updateSelection({ answers: { ...selected.answers, [q.key]: e.target.value } })}><option value="">Select</option>{q.options.map(o => <option key={o}>{o}</option>)}</select> : <input className={fieldClass} value={selected.answers[q.key] || ''} maxLength={1000} onChange={e => updateSelection({ answers: { ...selected.answers, [q.key]: e.target.value } })} />}</label>)}</div><p className="hc-note">Price per visit and initial cleaning price require scope review. All selected services stay in this plan.</p><button type="button" className="hc-primary" onClick={next}>Continue to next service</button></div>}
      </section>
      <form ref={formRef} onSubmit={prepare} className="hc-customer"><h2>Your property & request</h2><p>Use your own measurements where available. We’ll confirm anything uncertain before final pricing.</p><div className="hc-fields">{[{ key: 'name', label: 'Full name', required: true, autocomplete: 'name' }, { key: 'phone', label: 'Mobile / callback number', required: true, autocomplete: 'tel' }, { key: 'email', label: 'Email (optional)', autocomplete: 'email' }, { key: 'address', label: 'Service street address', required: true, autocomplete: 'street-address' }, { key: 'city', label: 'City', required: true, autocomplete: 'address-level2' }, { key: 'zip', label: 'ZIP code', required: true, autocomplete: 'postal-code' }, { key: 'homeSize', label: 'Approximate home size (optional)' }, { key: 'timeframe', label: 'When do you want the first cleaning?', required: true }].map(f => <label key={f.key}>{f.label}<input className={fieldClass} required={f.required} autoComplete={f.autocomplete} type={f.key === 'email' ? 'email' : f.key === 'phone' ? 'tel' : 'text'} pattern={f.key === 'zip' ? '[0-9]{5}(-[0-9]{4})?' : undefined} maxLength={f.key === 'zip' ? 10 : 200} value={plan.property[f.key] || ''} onChange={e => change({ ...plan, property: { ...plan.property, [f.key]: e.target.value } })} /></label>)}<label>Stories<select className={fieldClass} value={plan.property.stories || ''} onChange={e => change({ ...plan, property: { ...plan.property, stories: e.target.value } })}><option value="">Select / not sure</option><option>One</option><option>Two</option><option>Three or more</option></select></label><label>What would you like next?<select className={fieldClass} required value={plan.property.intent || ''} onChange={e => change({ ...plan, property: { ...plan.property, intent: e.target.value } })}><option value="">Select</option><option>Estimate first</option><option>Schedule after scope and price are confirmed</option></select></label><label>How should we reply?<select className={fieldClass} required value={plan.property.contactPreference || ''} onChange={e => change({ ...plan, property: { ...plan.property, contactPreference: e.target.value } })}><option value="">Select</option><option>Text</option><option>Call</option><option>Email</option></select></label><label>Preferred callback time (optional)<input className={fieldClass} maxLength={200} value={plan.property.callbackTime || ''} onChange={e => change({ ...plan, property: { ...plan.property, callbackTime: e.target.value } })} /></label></div><label className="hc-wide-label">Access, condition, photo links or other details (optional)<textarea className={fieldClass} rows={3} maxLength={1000} value={plan.property.notes || ''} onChange={e => change({ ...plan, property: { ...plan.property, notes: e.target.value } })} /></label><fieldset><legend>Future payment preference</legend><div className="hc-frequency">{(['monthly', 'quarterly', 'annual'] as const).map(p => <label key={p} className={plan.payment === p ? 'hc-chosen' : ''}><input type="radio" name="payment" checked={plan.payment === p} onChange={() => change({ ...plan, payment: p })} /><strong>{p === 'monthly' ? 'Monthly' : p === 'quarterly' ? 'Quarterly' : 'Annual prepayment'}</strong><span>{p === 'monthly' ? 'Standard pricing' : p === 'quarterly' ? 'Save 2%' : 'Save 5%'}</span></label>)}</div></fieldset><p className="hc-note">Payment frequency is separate from visit frequency. No additional bundle or frequency discount is assumed.</p><div className="hc-terms"><h3>Before you request a quote</h3><p>The initial cleaning is paid in full upfront as a separate job. Maintenance begins about 30 days after that work is completed, with finalized scope and your separate recurring-payment authorization.</p><p>Your accepted maintenance price stays fixed for the 12-month term. Renewal requires agreement. Normal extra first-visit effort is absorbed by OCF. For genuinely severe or materially misrepresented conditions, we stop before work and obtain approval for any change.</p><p>Voluntary cancellation: no refunds. Exceptions are reviewed case by case, subject to refund rights required by law. Any early-termination settlement is reviewed before agreement; this request does not authorize a penalty or future charges.</p></div><button className="hc-primary" type="submit" disabled={!ready || saving || !plan.selections.length}>{saving ? 'Preparing your plan…' : 'Review & send my plan'}</button><p className="hc-note">This is a quote request, not a signed contract, booking or payment authorization.</p></form>
      {showRequest && serverVerified && <div ref={reviewRef} className="hc-request"><h2>Send your complete plan</h2><p>Your selections are saved as a draft on this device. OCF receives them when you send the text or submit the secure Jobber form below.</p><p className="hc-note">Reference {plan.id}. Reuse this reference for updates so we can keep one plan.</p><div className="hc-actions"><a className="hc-primary" href={'sms:+13466236767?body=' + encodeURIComponent(summary)}>Open text with my full plan</a><button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy plan for Jobber'}</button></div><p>For the Jobber option, copy your plan, open the secure form, paste it into the request details and submit once.</p><a className="hc-secondary-link" href={REQUEST_URL} target="_blank" rel="noreferrer">Open secure Jobber request form</a><details><summary>Full plan text / manual copy</summary><textarea className={fieldClass} aria-label="Full plan text to copy" readOnly rows={16} value={summary} /></details><p className="hc-note">Sending a request does not reserve an appointment. We’ll confirm scope, price and availability with you. No card details are collected here.</p></div>}
    </div><aside className="hc-summary" aria-label="Running plan total"><h2>Your plan</h2><p className="hc-note">{plan.selections.length} service{plan.selections.length === 1 ? '' : 's'} selected · {plan.payment} payments</p>{!plan.selections.length && <p>Choose any of the seven services to begin.</p>}{quote?.lines.map(l => <div className="hc-line" key={l.id}><button type="button" onClick={() => { setLeaving(null); setActive(l.id); }}>{l.name}</button><span>{l.visits} visit{l.visits === 1 ? '' : 's'}/year</span><strong>{l.annualCents === null ? 'Quote pending' : formatMoney(l.annualCents) + '/year*'}</strong><small>{l.status}</small></div>)}<div className="hc-total"><p>Initial cleaning</p><strong>Separate quote pending</strong><p>Future maintenance</p><strong>{quote?.knownAnnualCents ? formatMoney(quote.billing.total) + '/year*' : 'Quote pending'}</strong>{!!quote?.knownAnnualCents && <p>{quote.billing.amounts.every(x => x === quote.billing.amounts[0]) ? formatMoney(quote.billing.amounts[0]) : quote.billing.amounts.map(formatMoney).join(', ')} per {plan.payment === 'monthly' ? 'month' : plan.payment === 'quarterly' ? 'quarter' : 'year'}*</p>}{!!quote?.pending && <p>Plus {quote.pending} service{quote.pending === 1 ? '' : 's'} awaiting pricing. This is not a final total.</p>}<p>Taxes: confirmed with final quote</p><p>Due today: no charge</p></div><p className="hc-note">*Review estimate for eligible scope. Pending services are included and have no final price yet; they are never treated as free.</p><p className="hc-note">A qualifying driveway/front-access example is $180 initial cleaning and $15/month for future annual maintenance. Qualifying annual gutter maintenance is $240/year or $20/month, plus a separately priced initial service. Eligibility and your final quote must be confirmed.</p><a href="#" onClick={e => { e.preventDefault(); formRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }}>Complete property details</a></aside></div>
  </div>;
}
