'use client';
import { useEffect, useRef, useState } from 'react';
import { HOME_CARE_VERSION, SERVICES, Plan, ServiceId, Selection, quotePlan, planSummary, formatMoney, REQUEST_URL, HOME_SIZE_BANDS, BASE_PRICES, TERMS_VERSION, PRICE_DISCLAIMER, chicagoToday, signupReady } from '@/lib/home-care';

const DRAFT_KEY = 'ocf-home-care-draft-v1';
const INTAKE_KEY = 'ocf-home-care-intake-v1';
const blank = (): Plan => ({ id: '', version: HOME_CARE_VERSION, selections: [], payment: 'monthly', property: { intent: 'Sign up and choose first service', contactPreference: 'Text' } });
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
  const [intakeAvailable, setIntakeAvailable] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const intakeRef = useRef({ reference: '', token: '', revision: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) { const restored = quotePlan(JSON.parse(saved)).plan; restored.property.intent = 'Sign up and choose first service'; if (restored.property.signupAcknowledgment !== TERMS_VERSION) restored.property.signupAcknowledgment = '';  setPlan(restored); setNotice('Your draft was restored on this device.'); }
      else setPlan({ ...blank(), id: crypto.randomUUID() });
    } catch { setPlan({ ...blank(), id: crypto.randomUUID() }); setNotice('We could not restore a draft. You can still build and send your plan.'); }
    setReady(true);
  }, []);
  const quote = plan.id ? quotePlan(plan) : null;
  const service = SERVICES.find(x => x.id === active)!;
  const selected = plan.selections.find(x => x.id === active);
  function change(next: Plan) { if (saving) return; setPlan(next); setShowRequest(false); setServerVerified(false); setCopied(false); setSubmitted(false); }
  function choose(id: ServiceId, add: boolean) {
    setLeaving(null);
    const exists = plan.selections.some(x => x.id === id);
    change({ ...plan, selections: add ? exists ? plan.selections : [...plan.selections, { id, visits: 1, answers: id === 'concrete' ? { areas: 'driveway' } : id === 'windows' ? { scope: 'Interior, exterior and screens' } : {} }] : plan.selections.filter(x => x.id !== id) });
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
    e.preventDefault(); if (!signupReady(plan)) { setNotice('Choose your home size, stories and first-service date, then acknowledge the signup details.'); return; } if (!plan.selections.length) { setNotice('Add at least one service.'); return; }
    setSaving(true); setNotice('');
    try {
      const response = await fetch('/api/home-care/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan) });
      if (!response.ok) throw new Error('Review unavailable');
      const reviewed = await response.json(); setPlan(reviewed.plan); setSummary(planSummary(reviewed.plan)); setServerVerified(true); setShowRequest(true); setIntakeAvailable(reviewed.intakeAvailable === true); setSubmitted(false);
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(reviewed.plan)); } catch { /* Copy still available. */ }
      requestAnimationFrame(() => reviewRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
    } catch { setNotice('Your draft is intact. Plan review is temporarily unavailable; call or text (346) 623-6767 for help.'); }
    finally { setSaving(false); }
  }
  async function sendPlan() {
    setSaving(true); setNotice('');
    try {
      if (intakeRef.current.reference !== plan.id) {
        let saved;
        try { saved = JSON.parse(localStorage.getItem(INTAKE_KEY) || 'null'); } catch { /* This device may block storage. */ }
        if (saved?.reference === plan.id && /^[0-9a-f]{64}$/.test(saved.token) && Number.isSafeInteger(saved.revision)) intakeRef.current = saved;
        else intakeRef.current = { reference: plan.id, token: Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join(''), revision: 0 };
      }
      try { localStorage.setItem(INTAKE_KEY, JSON.stringify(intakeRef.current)); localStorage.setItem(DRAFT_KEY, JSON.stringify(plan)); } catch { /* The in-memory key protects retries in this tab. */ }
      const result = await fetch('/api/home-care/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, intakeToken: intakeRef.current.token, expectedRevision: intakeRef.current.revision }) });
      const receipt = await result.json();
      if (![200, 202].includes(result.status) || receipt.reference !== plan.id || !receipt.saved || !Number.isSafeInteger(receipt.revision)) throw new Error(receipt.error || 'intake_unavailable');
      intakeRef.current.revision = receipt.revision;
      let keySaved = true;
      try { localStorage.setItem(INTAKE_KEY, JSON.stringify(intakeRef.current)); } catch { keySaved = false; }
      setSubmitted(true);
      setNotice((receipt.jobberReadBack ? 'Your full plan was received and its Jobber record was verified. Your preferred first-service date and estimates were saved with your signup. Scope verification and appointment confirmation follow.' : 'Your plan was received by OCF. Its Jobber receipt is awaiting verification; please keep this reference.') + (!keySaved ? ' Device storage is unavailable. Keep your reference and contact OCF for updates.' : '') + ' Your preferred date is requested, not a confirmed appointment. No payment was charged.');
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      setNotice(code === 'email_required' ? 'Add an email address when choosing an email reply, then review your plan again.' : code === 'revision_conflict' || code === 'reconciliation_required' || code === 'plan_access_denied' ? 'This reference needs reconciliation before another edit. Keep your draft and contact OCF using this reference; do not start a second plan.' : code === 'rate_limited' ? 'Too many updates were sent. Your draft is intact; contact OCF using this reference.' : 'We could not verify the save outcome. Keep this plan reference and retry the same request, or send the full plan below. Do not create another plan.');
    } finally { setSaving(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setNotice('Plan copied. Paste the full plan into the details field of the secure Jobber form.'); }
    catch { setNotice('Select and copy the full plan from the box below.'); }
  }
  function next() { setLeaving(null); const i = SERVICES.findIndex(x => x.id === active); setActive(SERVICES[(i + 1) % SERVICES.length].id); }
  function property(key: string, value: string) {
    change({ ...plan, property: { ...plan.property, [key]: value, ...(key === 'firstServiceDate' ? { timeframe: value } : {}) } });
  }
  const initialKnown = quote?.initialCents || 0;
  const bill = quote?.billing;
  const amountLabel = bill ? (bill.amounts.every(x => x === bill.amounts[0]) ? formatMoney(bill.amounts[0]) : bill.amounts.map(formatMoney).join(', ')) : '';
  const sizeReady = !!plan.property.homeSize && !!plan.property.stories;
  const currentLine = quote?.lines.find(l => l.id === active);
  return <div className={`hc-wrap ${reduceMotion ? 'hc-reduced' : ''}`}>
    <div className="hc-heading"><p className="hc-eyebrow">OCF Home Exterior Care Plan</p><h1>Your home. Your plan.</h1><p>Start with your home size, choose your services and see your estimate update. Choose a first-service date when you sign up.</p><div className="hc-tools"><button type="button" onClick={saveDraft} disabled={!ready}>Save draft on this device</button><label><input type="checkbox" checked={reduceMotion} onChange={e => { setReduceMotion(e.target.checked); if (e.target.checked && leaving) choose(leaving, true); }} /> Reduce motion / skip animation</label></div></div>
    <p className="hc-status" role="status" aria-live="polite">{notice}</p>
    <section className="hc-property-start" aria-labelledby="hc-property-title"><div><p className="hc-eyebrow">1 · Your home</p><h2 id="hc-property-title">Choose your home size first</h2><p>These details set your gutter and house-washing base estimate.</p></div><div className="hc-fields"><label>Home size<select className={fieldClass} value={plan.property.homeSize || ''} onChange={e => property('homeSize', e.target.value)}><option value="">Choose home size</option>{HOME_SIZE_BANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}</select></label><label>Number of stories<select className={fieldClass} value={plan.property.stories || ''} onChange={e => property('stories',e.target.value)}><option value="">Choose stories</option><option value="One">One story</option><option value="Two">Two stories</option><option value="Three or more">Three or more / needs verification</option></select></label></div><p className="hc-note">Home size provides a base estimate. Actual exterior washing area, access and scope are verified. It is not used as your driveway or walkway area.</p></section>
    <div className="hc-mobile-total" aria-live="polite"><span>Initial estimate <strong>{formatMoney(initialKnown)}</strong></span><span>Future {plan.payment === 'monthly' ? 'monthly' : plan.payment === 'quarterly' ? 'quarterly' : 'annual'} <strong>{amountLabel || '$0.00'}</strong></span>{!!quote?.pending && <small>+ {quote.pending} separately priced / incomplete scope</small>}</div>
    <div className="hc-layout"><div>
      <p className="hc-eyebrow">2 · Your services</p>
      <nav className="hc-service-nav" aria-label="All plan services">{SERVICES.map(s => <button type="button" key={s.id} aria-current={active === s.id ? 'step' : undefined} onClick={() => { setLeaving(null); setActive(s.id); }}><span>{s.name}</span><small>{plan.selections.some(x => x.id === s.id) ? 'Added · edit' : 'Choose or skip'}</small></button>)}</nav>
      <section className="hc-service-panel" aria-labelledby="hc-service-title">
        {!selected ? <div className={`hc-intro ${leaving === service.id ? 'hc-leaving' : ''}`} key={service.id} onAnimationEnd={e => { if (e.animationName === 'hc-fade-out') choose(service.id, true); }}><div className="hc-diamond" aria-hidden="true"><span>OCF</span></div><h2 id="hc-service-title">{service.name}</h2><p>{service.description}</p><div className="hc-actions"><button type="button" className="hc-primary" disabled={!ready || leaving !== null || !sizeReady} onClick={beginAdd}>Yes, add this service</button><button type="button" onClick={next}>Skip for now</button></div>{!sizeReady && <p className="hc-note">Choose your home size and stories above to start.</p>}<p className="hc-note">Every service stays available. Edit your choices anytime.</p></div> : <div className="hc-config" key={service.id + '-config'}><div className="hc-section-title"><h2 id="hc-service-title">{service.name}</h2><button type="button" onClick={() => choose(active, false)}>Remove</button></div><p>{service.description}</p>
          {active === 'concrete' && <fieldset><legend>Choose the areas to clean</legend><div className="hc-concrete-options">{[{id:'driveway',name:'Driveway / garage floor',amount:BASE_PRICES.concrete.driveway},{id:'sidewalk',name:'Sidewalk / front walkway',amount:BASE_PRICES.concrete.sidewalk},{id:'patio',name:'Deck / patio / porch',amount:BASE_PRICES.concrete.patio}].map(a => <label key={a.id}><input type="checkbox" checked={(selected.answers.areas || '').split(',').includes(a.id)} onChange={e => { const areas = (selected.answers.areas || '').split(',').filter(Boolean).filter(x => x !== a.id); if (e.target.checked) areas.push(a.id); updateSelection({ answers: {...selected.answers, areas: areas.join(',')} }); }} /><span>{a.name}</span><strong>{formatMoney(a.amount)} base / visit*</strong></label>)}</div></fieldset>}
          <div className="hc-fields">{service.questions.map(q => <label key={q.key}>{q.label}{q.options ? <select className={fieldClass} value={selected.answers[q.key] || ''} onChange={e => updateSelection({ answers: { ...selected.answers, [q.key]: e.target.value } })}><option value="">Select</option>{q.options.map(o => <option key={o}>{o}</option>)}</select> : <input className={fieldClass} type={q.key === 'count' ? 'number' : 'text'} min={q.key === 'count' ? 1 : undefined} step={q.key === 'count' ? 1 : undefined} value={selected.answers[q.key] || ''} maxLength={1000} onChange={e => updateSelection({ answers: { ...selected.answers, [q.key]: e.target.value } })} />}</label>)}</div>
          <fieldset><legend>Future visit frequency</legend><div className="hc-frequency">{service.frequencies.map(visits => <label key={visits} className={selected.visits === visits ? 'hc-chosen' : ''}><input type="radio" name={'visits-' + active} value={visits} checked={selected.visits === visits} onChange={() => updateSelection({ visits })} /><strong>{visits === 1 ? 'Annual' : visits === 2 ? 'Twice a year' : 'Quarterly'}</strong><span>{visits} future visit{visits > 1 ? 's' : ''} per year</span></label>)}</div></fieldset>
          <div className="hc-service-price" aria-live="polite">{currentLine?.perVisitCents !== null && currentLine?.perVisitCents !== undefined ? <><strong>{formatMoney(currentLine.perVisitCents)} / visit*</strong><span>Initial {formatMoney(currentLine.initialCents!)} · Future {formatMoney(currentLine.annualCents!)} / year before payment savings</span></> : <strong>{currentLine?.status}</strong>}</div><p className="hc-note">*Subject to verification. Wall/HOA and drainage prices are separate and remain in your plan.</p><button type="button" className="hc-primary" onClick={next}>Continue to next service</button></div>}
      </section>
      <form ref={formRef} onSubmit={prepare} className="hc-customer"><p className="hc-eyebrow">3 · Sign up & choose your first service</p><h2>Choose your preferred first-cleaning date</h2><p>Your selections, running estimate and requested date stay together in one signup.</p><div className="hc-fields"><label>Preferred first-service date<input className={fieldClass} type="date" required min={chicagoToday()} value={plan.property.firstServiceDate || ''} onChange={e => property('firstServiceDate',e.target.value)} /></label><label>Preferred arrival<select className={fieldClass} value={plan.property.arrivalPreference || 'Flexible'} onChange={e => property('arrivalPreference',e.target.value)}><option>Flexible</option><option>Morning</option><option>Afternoon</option></select></label></div><p className="hc-note">We confirm your appointment after checking the schedule and final scope. Selecting a date does not reserve it.</p><div className="hc-fields">{[{ key: 'name', label: 'Full name', required: true, autocomplete: 'name' }, { key: 'phone', label: 'Mobile / callback number', required: true, autocomplete: 'tel' }, { key: 'email', label: 'Email', required: true, autocomplete: 'email' }, { key: 'address', label: 'Service street address', required: true, autocomplete: 'street-address' }, { key: 'city', label: 'City', required: true, autocomplete: 'address-level2' }, { key: 'zip', label: 'ZIP code', required: true, autocomplete: 'postal-code' }].map(f => <label key={f.key}>{f.label}<input className={fieldClass} required={f.required} autoComplete={f.autocomplete} type={f.key === 'email' ? 'email' : f.key === 'phone' ? 'tel' : 'text'} pattern={f.key === 'zip' ? '[0-9]{5}(-[0-9]{4})?' : undefined} maxLength={f.key === 'zip' ? 10 : 200} value={plan.property[f.key] || ''} onChange={e => property(f.key,e.target.value)} /></label>)}<label>How should we reply?<select className={fieldClass} required value={plan.property.contactPreference || 'Text'} onChange={e => property('contactPreference',e.target.value)}><option>Text</option><option>Call</option><option>Email</option></select></label><label>Preferred callback time (optional)<input className={fieldClass} maxLength={200} value={plan.property.callbackTime || ''} onChange={e => property('callbackTime',e.target.value)} /></label></div><label className="hc-wide-label">Access, condition, photo links or other details (optional)<textarea className={fieldClass} rows={3} maxLength={1000} value={plan.property.notes || ''} onChange={e => property('notes',e.target.value)} /></label><fieldset><legend>Future maintenance payment choice</legend><div className="hc-frequency">{(['monthly', 'quarterly', 'annual'] as const).map(p => <label key={p} className={plan.payment === p ? 'hc-chosen' : ''}><input type="radio" name="payment" checked={plan.payment === p} onChange={() => change({ ...plan, payment: p })} /><strong>{p === 'monthly' ? 'Monthly' : p === 'quarterly' ? 'Quarterly' : 'Annual prepayment'}</strong><span>{p === 'monthly' ? 'Standard pricing' : p === 'quarterly' ? 'Save 2%' : 'Save 5%'}</span></label>)}</div></fieldset><p className="hc-note">Visit frequency and payment frequency are separate. Your initial cleaning is paid separately.</p><div className="hc-terms"><h3>Your plan details</h3><p>{PRICE_DISCLAIMER}</p><p>Your initial cleaning is a separate job paid in full upfront. Future maintenance billing begins about 30 days after completion, finalized scope and your separate recurring-payment authorization.</p><p>Your accepted price stays fixed for the 12-month term. Normal extra first-visit work is absorbed by OCF. For genuinely severe or materially misrepresented conditions, we stop before work and obtain approval.</p><p>Voluntary cancellation: no refunds. Exceptions are reviewed case by case, subject to rights required by law. No automatic cancellation penalty or future charges are authorized by this signup.</p><label className="hc-ack"><input type="checkbox" required checked={plan.property.signupAcknowledgment === TERMS_VERSION} onChange={e => property('signupAcknowledgment',e.target.checked ? TERMS_VERSION : '')} /><span>I want to sign up for this plan and request the date above. I understand these are estimates subject to verification, wall/HOA and drainage are priced separately, and my final agreement and payment authorization must be completed before activation.</span></label></div><button className="hc-primary" type="submit" disabled={!ready || saving || !plan.selections.length}>{saving ? 'Preparing your signup…' : 'Review my signup & date'}</button><p className="hc-note">No card details collected here. This signup is not a completed contract or confirmed appointment.</p></form>
      {showRequest && serverVerified && <div ref={reviewRef} className="hc-request"><h2>{submitted ? 'Signup received' : 'Your signup & first-service request'}</h2><p>Preferred date: <strong>{plan.property.firstServiceDate}</strong> · {plan.property.arrivalPreference || 'Flexible'} arrival · awaiting schedule confirmation.</p><p>Initial estimate <strong>{formatMoney(initialKnown)}</strong> · Future <strong>{amountLabel} / {plan.payment === 'monthly' ? 'month' : plan.payment === 'quarterly' ? 'quarter' : 'year'}</strong>{!!quote?.pending && ' + separately priced / incomplete scopes'}.</p>{intakeAvailable && <div className="hc-actions"><button type="button" className="hc-primary" disabled={saving || submitted} onClick={sendPlan}>{saving ? 'Submitting your signup…' : submitted ? 'Signup received' : 'Submit my signup & date'}</button></div>}<p className="hc-note">Reference {plan.id}. Reuse this reference for updates. No booking, signed contract or payment is inferred from submission.</p><details><summary>Text or secure-form backup</summary><div className="hc-actions"><a className="hc-primary" href={'sms:+13466236767?body=' + encodeURIComponent(summary)}>Open text with my full plan</a><button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy full plan'}</button></div><a className="hc-secondary-link" href={REQUEST_URL} target="_blank" rel="noreferrer">Open secure Jobber request form</a><textarea className={fieldClass} aria-label="Full plan text to copy" readOnly rows={16} value={summary} /></details></div>}
    </div><aside className="hc-summary" aria-label="Running plan total"><p className="hc-eyebrow">Your running estimate</p><h2>Your plan</h2><p className="hc-note">{plan.selections.length} services selected · {plan.payment} payments</p>{!plan.selections.length && <p>Choose your home size, then add services.</p>}{quote?.lines.map(l => <div className="hc-line" key={l.id}><button type="button" onClick={() => { setLeaving(null); setActive(l.id); }}>{l.name}</button><span>{l.visits} future visits/year</span><strong>{l.perVisitCents === null ? 'Separate price / scope needed' : formatMoney(l.perVisitCents) + ' / visit*'}</strong>{l.annualCents !== null && <span>{formatMoney(l.annualCents)} / year before savings</span>}<small>{l.status}</small></div>)}<div className="hc-total" aria-live="polite"><p>Initial cleaning estimate</p><strong>{formatMoney(initialKnown)}*</strong><p>Future maintenance</p><strong>{amountLabel || '$0.00'} / {plan.payment === 'monthly' ? 'month' : plan.payment === 'quarterly' ? 'quarter' : 'year'}*</strong><p>{formatMoney(bill?.total || 0)} total / year*</p>{!!quote?.pending && <p className="hc-separate">Plus {quote.pending} separately priced / incomplete scopes. These stay in your plan and are not free.</p>}<p>Initial cleaning is additional to future maintenance.</p><p>Taxes confirmed with final agreement.</p><p>No payment charged on this page.</p></div><p className="hc-note">*{PRICE_DISCLAIMER}</p><a href="#hc-property-title" onClick={e => { e.preventDefault(); formRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }}>Choose my first-service date</a></aside></div>
  </div>;
}
