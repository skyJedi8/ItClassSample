'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CAMPAIGN, campaignWindow, FOOTER, INBOUND_URL, preparationDraft, StaffRecipient, StaffSnapshot, TRACKER_URL } from '@/lib/staff/campaign';

const stamp = (value: string | null) => value ? new Date(value).toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' CT' : 'None recorded';
export default function StaffDashboard({ initial }: { initial: StaffSnapshot | null }) {
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState<'overview' | 'households' | 'prepare'>('overview');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<StaffRecipient | null>(null);
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const metric = data?.metrics.find(x => x.campaign === CAMPAIGN);
  const direct = data?.metrics.find(x => x.campaign === 'direct');
  const window = campaignWindow(new Date());
  const rows = data?.recipients.filter(r => `${r.name} ${r.service} ${r.priority}`.toLowerCase().includes(filter.toLowerCase())) || [];
  let prepared: ReturnType<typeof preparationDraft> | null = null;
  let draftError = '';
  if (selected && draft) { try { prepared = preparationDraft(draft, selected); } catch (e) { draftError = e instanceof Error ? e.message : 'Check the draft.'; } }
  async function refresh() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/staff/dashboard', { cache: 'no-store', credentials: 'same-origin' });
      if (response.status === 401) { location.assign('/staff/login'); return; }
      if (!response.ok) throw new Error();
      const fresh: StaffSnapshot = await response.json(); setData(fresh);
      if (selected) setSelected(fresh.recipients.find(r => r.key === selected.key) || null);
    } catch { setError('Live data could not be refreshed. The previous snapshot remains dated. No customer action was taken.'); }
    finally { setBusy(false); }
  }
  async function copy(value: string, description: string) {
    try { await navigator.clipboard.writeText(value); setFeedback(`${description} copied. Nothing sent or logged.`); }
    catch { setFeedback('Clipboard access was unavailable. Select and copy the text manually.'); }
  }
  function prepare(r: StaffRecipient) { setSelected(r); setDraft(''); setFeedback(''); setTab('prepare'); }
  return <div className="staff-app">
    <aside className="staff-sidebar">
      <a href="/staff" className="staff-sidebar-brand"><Image src="/icon.svg" alt="" width={36} height={36} /><span>OCF<span className="staff-brand-sub">STAFF WORKSPACE</span></span></a>
      <nav aria-label="Staff dashboard">
        {([['overview', 'Campaign overview', '01'], ['households', 'Existing households', '02'], ['prepare', 'Message preparation', '03']] as const).map(([key, name, number]) => <button key={key} aria-current={tab === key ? 'page' : undefined} onClick={() => setTab(key)}><span>{number}</span>{name}</button>)}
      </nav>
      <div className="staff-sidebar-links"><span className="staff-eyebrow">EXISTING WORKSPACES</span><a href={TRACKER_URL} target="_blank" rel="noreferrer">Outreach tracker ↗</a><a href={INBOUND_URL} target="_blank" rel="noreferrer">Incoming customer replies ↗</a><a href="https://chatgpt.com/space/page_0e213e73e6b0819185cf85c41c0dd09d" target="_blank" rel="noreferrer">OCF Operations Status ↗</a></div>
      <div className="staff-owner"><span className="staff-avatar">EE</span><div><strong>Eric Evans</strong><span>Owner access</span></div><form action="/api/staff/auth/signout" method="get"><button aria-label="Sign out">↗</button></form></div>
    </aside>
    <main className="staff-main">
      <header className="staff-topbar"><span>HOME CARE PLAN / OCTOBER CAMPAIGN</span><span className="staff-private"><span aria-hidden="true">●</span> Private staff area</span></header>
      <div className="staff-heading"><div><span className="staff-eyebrow">OPERATION CLEAN FREEDOM</span><h1>{tab === 'overview' ? 'Keep the next step clear.' : tab === 'households' ? 'Your existing households.' : 'Prepare the right message.'}</h1><p>{tab === 'overview' ? 'Live website activity. Separate evidence for every step of enrollment.' : tab === 'households' ? 'Only the existing registered pilot list. Source records and customer links stay together.' : 'Review the saved draft, exact customer link and final text length before any sending handoff.'}</p></div><button className="staff-secondary" onClick={refresh} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh live data'} <span aria-hidden="true">↻</span></button></div>
      <div className="staff-status-row"><span>Last checked: {data ? stamp(data.checkedAt) : 'No live snapshot yet'}</span><span className={window.open ? 'staff-window-open' : ''}>{window.reason}</span></div>
      {error && <div role="alert" className="staff-alert">{error}</div>}
      {!data && <section className="staff-panel staff-empty"><h2>Live tracking is unavailable.</h2><p>Refresh to try again, or open the existing tracker. Customer sending remains with its current owner.</p><a className="staff-secondary" href={TRACKER_URL} target="_blank" rel="noreferrer">Open existing tracker ↗</a></section>}
      {data && tab === 'overview' && <>
        <section className="staff-goal"><div><span className="staff-eyebrow">THIS WEEK’S GOAL</span><h2>10 signed household plans</h2><p>By Sunday, October 11. One service counts.</p></div><div className="staff-goal-evidence"><strong>{data.communications.signed === null ? 'Awaiting evidence' : `${data.communications.signed} / 10`}</strong><span>Signature counts require verified agreement records.</span></div></section>
        <div className="staff-metrics">
          <Metric label="Texts sent" value={data.communications.sent} note="Verified outgoing Quo records" />
          <Metric label="Customer replies" value={data.communications.replied} note="Existing inbox and outreach log" />
          <Metric label="Estimated site visitors" value={metric?.estimatedVisitors ?? null} note="Campaign link activity; identity unverified" />
          <Metric label="Saved signup requests" value={metric?.signupSubmissions ?? null} note="Submission is separate from signature" />
          <Metric label="Signed agreements" value={data.communications.signed} note="Independent signature evidence" />
          <Metric label="Paid plans" value={data.communications.paid} note="Verified customer payment evidence" />
          <Metric label="Active plans" value={data.communications.active} note="Separate recurring authorization and activation" />
        </div>
        <div className="staff-overview-grid"><section className="staff-panel"><div className="staff-panel-title"><h2>Campaign readiness</h2><span className="staff-pill">Preparation mode</span></div><div className="staff-readiness"><Status good={data.health.tracking} title="Private campaign tracking" detail="Live summary from the existing backend" /><Status good={data.health.intake} title="Website signup intake" detail="Existing durable signup service" /><Status good={data.health.pricing} title="Website program status" detail="All seven services; checkout and automatic activation disabled" /><Status good={data.recipientsComplete} title={`${data.recipients.length} registered households`} detail="QA link excluded; registration alone does not establish sending eligibility" /><Status good={false} title="Quo sender handoff" detail="Current campaign owner continues sending. Dashboard sender is locked." /></div></section>
          <section className="staff-panel"><h2>Next useful action</h2><p>Review the household’s exact source evidence and approved draft in the existing tracker. Resolve individual holds before sending.</p><button className="staff-primary" onClick={() => setTab('households')}>Review existing households →</button><div className="staff-rule-summary"><strong>Sending rules retained</strong><p>100 total SMS segments across both the rolling 24 hours and Central calendar day. 40 promotional segments. Reserve replies and honor any lower provider cap.</p><p>One unanswered follow-up after at least 48 hours. Any reply, refusal, signup or owner takeover stops promotional follow-ups.</p></div></section></div>
        <section className="staff-panel staff-activity"><div><span className="staff-eyebrow">WEBSITE ACTIVITY</span><h2>Views are signals, not sales.</h2></div><div><strong>{metric?.pageViews ?? '—'}</strong><span>Campaign page views</span></div><div><strong>{metric?.planStarters ?? '—'}</strong><span>Estimated plan starters</span></div><div><strong>{direct?.estimatedVisitors ?? '—'}</strong><span>Direct / unattributed visitors</span></div><p>QA activity is excluded. Forwarded links, shared devices and scanners can affect visitor estimates. A visit or start never establishes Friday reminder eligibility.</p></section>
      </>}
      {data && tab === 'households' && <section className="staff-panel"><div className="staff-panel-title"><div><h2>Registered pilot list</h2><p>{rows.length} of {data.recipients.length} households shown</p></div><label className="staff-search"><span className="sr-only">Search existing households</span><input type="search" placeholder="Search name or service" value={filter} onChange={e => setFilter(e.target.value)} /></label></div>
        <div className="staff-table-wrap"><table className="staff-table"><thead><tr><th>Household</th><th>Recorded service / priority</th><th>Saved requests</th><th>Action</th></tr></thead><tbody>{rows.map(r => <tr key={r.key}><td><strong>{r.name}</strong><details><summary>Source evidence</summary><p>{r.evidence}</p><p>Retained Jobber IDs: {r.clientIds.join(', ') || 'Review source record'}</p><p>Last view: {stamp(r.lastViewAt)} · Last start: {stamp(r.lastStartAt)}</p><p>These events do not identify the visitor.</p></details></td><td>{r.service || 'Review exact source'}<span className="staff-table-note">{r.priority || 'Fresh eligibility check required'}</span></td><td>{r.signupCount}<span className="staff-table-note">{r.signupCount ? 'Route to existing inbound owner' : 'Not proof of an unfinished draft'}</span></td><td><button className="staff-secondary" onClick={() => prepare(r)} disabled={r.signupCount > 0}>Review message</button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="staff-empty">No matching household in the existing list.</p>}</div>
      </section>}
      {data && tab === 'prepare' && <div className="staff-prepare-grid"><section className="staff-panel"><h2>Message preparation</h2><label htmlFor="staff-recipient">Existing household</label><select id="staff-recipient" value={selected?.key || ''} onChange={e => { setSelected(data.recipients.find(r => r.key === e.target.value) || null); setDraft(''); setFeedback(''); }}><option value="">Choose a registered household</option>{data.recipients.filter(r => r.signupCount === 0).map(r => <option key={r.key} value={r.key}>{r.name} — {r.service}</option>)}</select>
        {selected && <><div className="staff-source"><strong>{selected.name}</strong><p>{selected.evidence}</p><label htmlFor="staff-link">Existing registered link</label><input id="staff-link" value={selected.url} readOnly /><button className="staff-text-button" onClick={() => copy(selected.url, 'Registered link')}>Copy link</button></div><label htmlFor="staff-draft">Paste the approved draft from the existing tracker</label><textarea id="staff-draft" rows={8} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Use this household’s recorded draft. Sending approval and source checks remain in the tracker." /><p className="staff-small">Required footer: {FOOTER}</p>{draftError && <p role="alert" className="staff-form-error">{draftError}</p>}{prepared && <><div className="staff-segment-info"><strong>{prepared.segments} SMS segments</strong><span>{prepared.encoding} · {prepared.units} encoding units · footer included</span></div><label htmlFor="staff-final">Exact final text</label><textarea id="staff-final" rows={7} readOnly value={prepared.content} /><button className="staff-secondary" onClick={() => copy(prepared!.content, 'Final draft')}>Copy prepared text</button></>}</>}
        {!selected && <p className="staff-empty">Choose a household to inspect its existing link and source evidence.</p>}{feedback && <p role="status" className="staff-copy-feedback">{feedback}</p>}
      </section><section className="staff-panel"><span className="staff-eyebrow">BEFORE A SEND</span><h2>Every check stays attached.</h2><ol className="staff-checklist"><li>Fresh exact customer, service, property and customer-provided SMS number.</li><li>Current signup queue, complete Quo thread and all suppression or takeover signals.</li><li>Complete shared segment counters and the authorized local sending window.</li><li>Existing tracker owner and preparation lock, including final draft, link and segments.</li><li>Quo acceptance ID plus exact outgoing readback, followed by supported Jobber logging.</li></ol><div className="staff-alert"><strong>Send through Quo is locked</strong><p>{data.sender.reason}</p></div><button className="staff-primary" disabled>Send through Quo — not activated</button><p className="staff-small">Preparation creates no send, log, signature, booking or payment. Unknown outcomes must be reconciled before any retry.</p><a href={TRACKER_URL} target="_blank" rel="noreferrer" className="staff-text-button">Open approved drafts and holds ↗</a></section></div>}
      <footer className="staff-dashboard-footer">Source of truth: Jobber for operations · Quo for communications · Existing tracker for workflow checkpoints</footer>
    </main>
  </div>;
}
function Metric({ label, value, note }: { label: string; value: number | null; note: string }) { return <section className="staff-metric"><h2>{label}</h2><strong className={value === null ? 'staff-unverified' : ''}>{value === null ? 'Unverified' : value}</strong><p>{note}</p></section>; }
function Status({ good, title, detail }: { good: boolean; title: string; detail: string }) { return <div className="staff-readiness-row"><span className={good ? 'staff-check-good' : 'staff-check-pending'} aria-label={good ? 'Verified' : 'Pending'}>{good ? '✓' : '—'}</span><div><strong>{title}</strong><p>{detail}</p></div></div>; }
