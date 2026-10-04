export const HOME_CARE_VERSION = '2026-10-04.1';
export const TERMS_VERSION = '2026-10-04.1';
export const REQUEST_URL = 'https://clienthub.getjobber.com/hubs/79f18a49-0ca1-4d8f-85db-fa0804c8f6ce/public/requests/1774207/new?utm_source=website';
export type ServiceId = 'gutters' | 'concrete' | 'house' | 'walls' | 'windows' | 'solar' | 'drainage';
export type PaymentChoice = 'monthly' | 'quarterly' | 'annual';
export type Selection = { id: ServiceId; visits: number; answers: Record<string, string> };
export type Plan = { id: string; version: string; selections: Selection[]; payment: PaymentChoice; property: Record<string, string> };
export const SERVICES: { id: ServiceId; name: string; description: string; frequencies: number[]; questions: { key: string; label: string; options?: string[] }[] }[] = [
  { id: 'gutters', name: 'Gutter cleaning', description: 'Remove accessible gutter debris and check downspout flow. Guards, height, roof access and condition help determine the scope.', frequencies: [1, 2, 4], questions: [{ key: 'length', label: 'Approximate gutter length in feet, if known' }, { key: 'guards', label: 'Gutter guards', options: ['Not sure', 'No guards', 'Guards installed'] }, { key: 'condition', label: 'Debris, blocked downspouts or other concerns' }] },
  { id: 'concrete', name: 'Driveway, sidewalks & walkways', description: 'Clean the concrete areas you choose using methods appropriate to the surface. Embedded oil, rust and mineral stains may need separate treatment.', frequencies: [1, 2], questions: [{ key: 'surfaces', label: 'Areas to include (driveway, front sidewalk, walkways, patio)' }, { key: 'area', label: 'Approximate cleaning area in square feet, if known' }, { key: 'material', label: 'Surface material and stain concerns' }] },
  { id: 'house', name: 'House & exterior washing', description: 'Wash agreed exterior surfaces to remove dirt and organic buildup. The method depends on siding, materials and condition.', frequencies: [1, 2], questions: [{ key: 'surfaces', label: 'Whole exterior or particular sides?' }, { key: 'material', label: 'Siding and exterior materials' }, { key: 'condition', label: 'Visible buildup, delicate areas or damage' }] },
  { id: 'walls', name: 'Selected walls & HOA cleaning', description: 'Include selected walls, entrance monuments, columns and HOA-related exterior areas in this same plan. Measurements and access are reviewed before pricing.', frequencies: [1, 2, 4], questions: [{ key: 'surfaces', label: 'Walls, monuments, columns or areas to include' }, { key: 'dimensions', label: 'Length, height and number of faces, if known' }, { key: 'material', label: 'Materials, ownership/HOA permission and access' }] },
  { id: 'windows', name: 'Window cleaning', description: 'Choose exterior glass or a larger window scope. Window count, reach and requested screens or tracks determine your quote.', frequencies: [1, 2, 4], questions: [{ key: 'count', label: 'Number of windows, if known' }, { key: 'scope', label: 'Window scope', options: ['Exterior glass', 'Interior and exterior', 'Exterior plus screens/tracks', 'Wash and rinse only'] }, { key: 'access', label: 'Window access and condition', options: ['Not sure / needs review', 'Standard readily accessible windows, normal maintenance soil', 'High, obstructed or restoration needed'] }] },
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
// This is a review estimate, never a payable quote. The approved window entry
// scope is in Maintenance Pilot B26; initial work still requires a separate quote.
// The handoff driveway/gutter examples have unresolved eligibility and remain pending.
export function quotePlan(value: unknown) {
  const plan = normalizePlan(value);
  const lines = plan.selections.map(s => {
    const count = Number(s.answers.count);
    const supported = s.id === 'windows' && s.visits === 1 && Number.isInteger(count) && count > 0 && count <= 20 && s.answers.scope === 'Exterior glass' && s.answers.access === 'Standard readily accessible windows, normal maintenance soil';
    return { id: s.id, name: SERVICES.find(x => x.id === s.id)!.name, visits: s.visits, annualCents: supported ? 24000 : null, initialCents: null, status: supported ? 'Scope confirmation required' : 'Custom quote required' };
  });
  const knownAnnualCents = lines.reduce((n, l) => n + (l.annualCents ?? 0), 0);
  return { version: HOME_CARE_VERSION, termsVersion: TERMS_VERSION, plan, lines, knownAnnualCents, pending: lines.filter(l => l.annualCents === null).length, billing: installments(knownAnnualCents, plan.payment), checkoutEnabled: false, maintenanceActivated: false, taxCents: null };
}
export const formatMoney = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export function planSummary(value: unknown) {
  const q = quotePlan(value); const p = q.plan;
  return [`OCF HOME CARE PLAN ${p.id}`, `Review request only. Version ${q.version}; terms ${q.termsVersion}.`, ...Object.entries(p.property).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), `Payment choice: ${p.payment}. Quarterly 2% savings; annual prepay 5% savings.`, ...p.selections.flatMap(s => {
    const l = q.lines.find(x => x.id === s.id)!;
    return [`${l.name}: ${s.visits} visit(s)/year; ${l.annualCents === null ? 'PRICE PENDING' : formatMoney(l.annualCents) + '/year before payment savings, subject to scope confirmation'}.`, ...Object.entries(s.answers).filter(([, v]) => v).map(([k, v]) => `  ${k}: ${v}`)];
  }), 'Initial cleaning: separate quote, paid in full upfront. No payment authorized by this request.', 'Maintenance: 12-month fixed-price term; billing starts about 30 days after completed initial work, finalized scope and separate recurring authorization. Renewal needs agreement.', 'Voluntary cancellation: no refunds; exceptions reviewed case by case, subject to rights required by law. No automatic first-cleaning surcharge.', 'Please reply about this plan using my stated contact preference.'].join('\n');
}
