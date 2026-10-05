export const HOME_CARE_VERSION = '2026-10-04.3';
export const TERMS_VERSION = '2026-10-04.2';
export const HOME_SIZE_BANDS = [
  { value: 'under-1000', label: 'Less than 1,000 sq ft' },
  { value: '1000-2000', label: '1,000–2,000 sq ft' },
  { value: '2000-3000', label: '2,000–3,000 sq ft' },
  { value: '3000-4000', label: '3,000–4,000 sq ft' },
  { value: '4000-5000', label: '4,000–5,000 sq ft' },
  { value: 'over-5000', label: 'More than 5,000 sq ft / not sure' }
];
// Owner authorized these live Thumbtack base prices on October 4, 2026.
// The same per-visit base is used for future visits; only payment savings apply.
export const BASE_PRICES = {
  guttersOne: [16900,21900,26900,31900,36900],
  guttersTwo: [19500,25500,31900,37900,42900],
  house: [15000,22500,32000,42000,52000],
  windows: [6000,10000,15000,18000,23000,29200,32800,38500,42800,47500],
  solar: [15900,24900,29600,39200,48900,78200],
  solarMax: [10,20,30,40,50,100],
  concrete: { driveway: 14500, sidewalk: 7500, patio: 13500 }
};
export const PRICE_DISCLAIMER = 'Estimates are subject to verification of size, counts, access and scope. Wall/HOA and drainage work are priced separately. Your accepted price stays fixed for the 12-month term; changes require your agreement before work.';
export const REQUEST_URL = 'https://clienthub.getjobber.com/hubs/79f18a49-0ca1-4d8f-85db-fa0804c8f6ce/public/requests/1774207/new?utm_source=website';
export type ServiceId = 'gutters' | 'concrete' | 'house' | 'walls' | 'windows' | 'solar' | 'drainage';
export type PaymentChoice = 'monthly' | 'quarterly' | 'annual';
export type Selection = { id: ServiceId; visits: number; answers: Record<string, string> };
export type Plan = { id: string; version: string; selections: Selection[]; payment: PaymentChoice; property: Record<string, string> };
export const SERVICES: { id: ServiceId; name: string; description: string; frequencies: number[]; questions: { key: string; label: string; options?: string[] }[] }[] = [
  { id: 'gutters', name: 'Gutter cleaning', description: 'Remove accessible gutter debris and check downspout flow. Guards, height, roof access and condition help determine the scope.', frequencies: [1, 2, 4], questions: [{ key: 'length', label: 'Approximate gutter length in feet, if known' }, { key: 'guards', label: 'Gutter guards', options: ['Not sure', 'No guards', 'Guards installed'] }, { key: 'condition', label: 'Debris, blocked downspouts or other concerns' }] },
  { id: 'concrete', name: 'Driveway, sidewalks & walkways', description: 'Choose driveway, sidewalk/front walkway and patio cleaning. Your total updates for each selected area. Embedded oil, rust and mineral stains need scope verification.', frequencies: [1, 2], questions: [{ key: 'area', label: 'Approximate concrete cleaning area in square feet (optional)' }, { key: 'material', label: 'Surface material and stain concerns (optional)' }] },
  { id: 'house', name: 'House & exterior washing', description: 'Wash agreed exterior surfaces to remove dirt and organic buildup. The method depends on siding, materials and condition.', frequencies: [1, 2], questions: [{ key: 'surfaces', label: 'Whole exterior or particular sides?' }, { key: 'material', label: 'Siding and exterior materials' }, { key: 'condition', label: 'Visible buildup, delicate areas or damage' }] },
  { id: 'walls', name: 'Selected walls & HOA cleaning', description: 'Include selected walls, entrance monuments, columns and HOA-related exterior areas in this same plan. Measurements and access are reviewed before pricing.', frequencies: [1, 2, 4], questions: [{ key: 'surfaces', label: 'Walls, monuments, columns or areas to include' }, { key: 'dimensions', label: 'Length, height and number of faces, if known' }, { key: 'material', label: 'Materials, ownership/HOA permission and access' }] },
  { id: 'windows', name: 'Window cleaning', description: 'Base prices include standard exterior and interior window cleaning and screens, using the saved window-count tiers. Access, condition and specialty glass are verified before work.', frequencies: [1, 2, 4], questions: [{ key: 'count', label: 'Number of windows' }, { key: 'scope', label: 'Window scope', options: ['Interior, exterior and screens', 'Exterior glass', 'Wash and rinse only', 'Specialty glass / restoration'] }, { key: 'access', label: 'Window access and condition', options: ['Standard readily accessible windows, normal maintenance soil', 'High, obstructed or restoration needed', 'Not sure / needs review'] }] },
  { id: 'solar', name: 'Solar panel cleaning', description: 'Request panel cleaning suited to the system and manufacturer requirements. Panel count and safe access must be confirmed; performance gains are not guaranteed.', frequencies: [1, 2, 4], questions: [{ key: 'count', label: 'Panel count, if known' }, { key: 'location', label: 'Roof-mounted or ground-mounted; access details' }, { key: 'system', label: 'Manufacturer or special cleaning requirements, if known' }] },
  { id: 'drainage', name: 'Drainage cleaning', description: 'Clear agreed accessible landscape drainage areas. Buried damage, repairs and system redesign need separate assessment.', frequencies: [1, 2, 4], questions: [{ key: 'type', label: 'Drain type, location and number of accessible openings' }, { key: 'problem', label: 'Debris, slow flow or recurring issues' }, { key: 'access', label: 'Access, known damage and approximate length' }] }
];
export function splitCents(total: number, count: number) {
  if (!Number.isSafeInteger(total) || total < 0 || !Number.isInteger(count) || count < 1) throw new Error('Invalid total');
  const base = Math.floor(total / count); return Array.from({ length: count }, (_, i) => base + (i < total % count ? 1 : 0));
}
export function installments(annualCents: number, payment: PaymentChoice) {
  const discount = payment === 'annual' ? 5 : payment === 'quarterly' ? 2 : 0;
  const total = Math.round(annualCents * (100 - discount) / 100);
  return { total, amounts: splitCents(total, payment === 'annual' ? 1 : payment === 'quarterly' ? 4 : 12), discount };
}
export function normalizePlan(value: unknown): Plan {
  if (!value || typeof value !== 'object') throw new Error('Invalid plan');
  const p = value as Plan;
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(p.id) || !['monthly', 'quarterly', 'annual'].includes(p.payment) || !Array.isArray(p.selections) || p.selections.length > 7) throw new Error('Invalid plan');
  const clean = (v: unknown) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Invalid answers');
    const entries = Object.entries(v); if (entries.length > 20 || entries.some(([k, x]) => k.length > 40 || typeof x !== 'string' || x.length > 1000)) throw new Error('Invalid answers');
    return Object.fromEntries(entries) as Record<string, string>;
  };
  const seen = new Set<string>();
  return { id: p.id, version: HOME_CARE_VERSION, payment: p.payment, property: clean(p.property), selections: p.selections.map(s => {
    const service = SERVICES.find(x => x.id === s.id); if (!service || seen.has(s.id) || !service.frequencies.includes(s.visits)) throw new Error('Invalid service');
    seen.add(s.id); return { id: s.id, visits: s.visits, answers: clean(s.answers) };
  }) };
}
export function homeSizeIndex(size: string) {
  const selected = HOME_SIZE_BANDS.findIndex(b => b.value === size);
  if (selected >= 0) return selected < 5 ? selected : -1;
  const n = Number((size || '').replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 && n <= 5000 ? Math.min(4, Math.floor(n / 1000)) : -1;
}
export function chicagoToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
}
export function validFirstDate(value: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const parsed = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === value && value >= chicagoToday(now);
}
export function signupReady(plan: Plan, now = new Date()) {
  return plan.property.intent === 'Sign up and choose first service' && validFirstDate(plan.property.firstServiceDate, now) && plan.property.signupAcknowledgment === TERMS_VERSION && (HOME_SIZE_BANDS.some(b => b.value === plan.property.homeSize) || homeSizeIndex(plan.property.homeSize) >= 0) && ['One','Two','Three or more'].includes(plan.property.stories);
}
export function quotePlan(value: unknown) {
  const plan = normalizePlan(value);
  const size = homeSizeIndex(plan.property.homeSize);
  const lines = plan.selections.map(s => {
    const count = Number(s.answers.count);
    let perVisitCents: number | null = null;
    let reason = 'Choose the size or quantity to see your estimate';
    if (s.id === 'gutters' && size >= 0 && ['One','Two'].includes(plan.property.stories)) perVisitCents = (plan.property.stories === 'One' ? BASE_PRICES.guttersOne : BASE_PRICES.guttersTwo)[size];
    if (s.id === 'house' && size >= 0) perVisitCents = BASE_PRICES.house[size];
    if (s.id === 'windows' && Number.isInteger(count) && count > 0 && count <= 50 && s.answers.scope !== 'Specialty glass / restoration') perVisitCents = BASE_PRICES.windows[Math.ceil(count / 5)-1];
    if (s.id === 'solar' && Number.isInteger(count) && count > 0 && count <= 100) perVisitCents = BASE_PRICES.solar[BASE_PRICES.solarMax.findIndex(max => count <= max)];
    if (s.id === 'concrete') {
      const areas = [...new Set((s.answers.areas || '').split(',').filter(Boolean))];
      if (areas.length && areas.every(a => Object.prototype.hasOwnProperty.call(BASE_PRICES.concrete, a))) perVisitCents = areas.reduce((total,a) => total + BASE_PRICES.concrete[a as keyof typeof BASE_PRICES.concrete],0);
      reason = 'Choose the concrete areas to see your estimate';
    }
    if (s.id === 'walls' || s.id === 'drainage') reason = 'Priced separately · included in your saved plan';
    else if (perVisitCents === null && ((s.id === 'gutters' || s.id === 'house') && plan.property.homeSize || count > (s.id === 'solar' ? 100 : 50))) reason = 'Outside saved base tiers · scope verification needed';
    return { id: s.id, name: SERVICES.find(x => x.id === s.id)!.name, visits: s.visits, perVisitCents, annualCents: perVisitCents === null ? null : perVisitCents * s.visits, initialCents: perVisitCents, status: perVisitCents === null ? reason : 'Base estimate · subject to verification' };
  });
  const knownAnnualCents = lines.reduce((n, l) => n + (l.annualCents ?? 0), 0);
  const initialCents = lines.reduce((n,l) => n + (l.initialCents ?? 0),0);
  return { version: HOME_CARE_VERSION, termsVersion: TERMS_VERSION, plan, lines, knownAnnualCents, initialCents, pending: lines.filter(l => l.annualCents === null).length, separate: lines.filter(l => ['walls','drainage'].includes(l.id)).length, billing: installments(knownAnnualCents, plan.payment), checkoutEnabled: false, maintenanceActivated: false, taxCents: null, disclaimer: PRICE_DISCLAIMER, preferredDate: plan.property.firstServiceDate || null, dateConfirmed: false };
}
export const formatMoney = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export function planSummary(value: unknown) {
  const q = quotePlan(value); const p = q.plan;
  return [`OCF HOME CARE PLAN ${p.id}`, `Signup / preferred first-service date request. Version ${q.version}; terms ${q.termsVersion}. No booking, signature or charge inferred.`, ...Object.entries(p.property).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), `Payment choice: ${p.payment}. Quarterly 2% savings; annual prepay 5% savings.`, ...p.selections.flatMap(s => {
    const l = q.lines.find(x => x.id === s.id)!;
    return [`${l.name}: ${s.visits} visit(s)/year; ${l.annualCents === null ? 'PRICED SEPARATELY / SCOPE NEEDED' : formatMoney(l.perVisitCents!) + '/visit; initial ' + formatMoney(l.initialCents!) + '; future ' + formatMoney(l.annualCents) + '/year before payment savings, subject to verification'}.`, ...Object.entries(s.answers).filter(([, v]) => v).map(([k, v]) => `  ${k}: ${v}`)];
  }), `Initial base estimate: ${formatMoney(q.initialCents)}${q.pending ? ' plus separately priced / incomplete scope' : ''}. Separate job paid in full upfront; no payment authorized by this submission.`, `Future base estimate: ${formatMoney(q.billing.total)}/year; ${p.payment} installments ${q.billing.amounts.map(formatMoney).join(', ')}${q.pending ? ' plus separately priced / incomplete scope' : ''}.`, PRICE_DISCLAIMER, 'Maintenance: 12-month fixed-price term; billing starts about 30 days after completed initial work, finalized scope and separate recurring authorization. Renewal needs agreement.', 'Voluntary cancellation: no refunds; exceptions reviewed case by case, subject to rights required by law. No automatic first-cleaning surcharge.', 'Preferred date is requested, not confirmed. Please reply using my stated contact preference.'].join('\n');
}
