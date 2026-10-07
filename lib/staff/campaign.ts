export const TRACKER_URL = 'https://docs.google.com/spreadsheets/d/1KtQqkrkc2GCEBrW6erHGlxWomIYb-qXAXXvtQTR9oTo/edit';
export const INBOUND_URL = 'https://chatgpt.com/c/6ac2e0ad-3340-83e9-bb40-11a2369117e2';
export const FOOTER = 'Reply STOP to unsubscribe.';
const QA_TOKEN = '0c9102c5884a9bd8d365fd8c18904f6e';
export const QA_PLAN = '07fdb287-a699-4825-a184-1e168bfb5f03';
export const CAMPAIGN = 'hc-oct-2026';

export type StaffRecipient = {
  key: string; name: string; service: string; priority: string; evidence: string;
  clientIds: string[]; token: string; url: string; signupCount: number;
  lastViewAt: string | null; lastStartAt: string | null;
};
export type StaffMetric = { campaign: string; pageViews: number; estimatedVisitors: number; planStarters: number; signupSubmissions: number };
export type StaffSnapshot = {
  checkedAt: string; recipients: StaffRecipient[]; metrics: StaffMetric[]; recipientsComplete: boolean;
  health: { tracking: boolean; intake: boolean; pricing: boolean };
  communications: { sent: number | null; replied: number | null; signed: number | null; paid: number | null; active: number | null };
  sender: { enabled: false; owner: string; reason: string };
};

export function registeredLink(value: unknown, token: unknown): value is string {
  if (typeof value !== 'string' || typeof token !== 'string' || !/^[a-f0-9]{32}$/.test(token) || token === QA_TOKEN) return false;
  try {
    const url = new URL(value);
    return url.origin === 'https://www.operationcleanfreedom.com' && url.pathname === '/home-care-plan' &&
      url.searchParams.get('c') === CAMPAIGN && url.searchParams.get('r') === token &&
      [...url.searchParams.keys()].length === 2 && !url.hash && !url.username && !url.password;
  } catch { return false; }
}

export function sanitizeSummary(body: Record<string, unknown>) {
  if (body.available !== true || body.campaign !== CAMPAIGN || !Array.isArray(body.recipients) || !Array.isArray(body.metrics)) throw new Error('campaign_unavailable');
  const identities = new Set<string>();
  const recipients: StaffRecipient[] = [];
  for (const item of body.recipients) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    if (r.internalTest === true || r.token === QA_TOKEN) continue;
    if (!registeredLink(r.url, r.token) || typeof r.key !== 'string' || typeof r.name !== 'string' || identities.has(r.key)) throw new Error('invalid_recipient_registry');
    identities.add(r.key);
    recipients.push({ key: r.key, name: r.name, service: String(r.service || ''), priority: String(r.priority || ''), evidence: String(r.evidence || ''),
      clientIds: Array.isArray(r.clientIds) ? r.clientIds.filter((id): id is string => typeof id === 'string') : [],
      token: String(r.token), url: r.url, signupCount: safeCount(r.signupCount), lastViewAt: validStamp(r.lastViewAt), lastStartAt: validStamp(r.lastStartAt) });
  }
  const metrics = body.metrics.filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .filter(r => r.campaign === CAMPAIGN || r.campaign === 'direct').map(r => ({ campaign: String(r.campaign), pageViews: safeCount(r.pageViews), estimatedVisitors: safeCount(r.estimatedVisitors), planStarters: safeCount(r.planStarters), signupSubmissions: safeCount(r.signupSubmissions) }));
  if (!metrics.some(m => m.campaign === CAMPAIGN)) throw new Error('campaign_metrics_missing');
  return { recipients, metrics, recipientsComplete: body.recipientsTruncated === false && recipients.length === 25 };
}
function safeCount(value: unknown) { if (!Number.isSafeInteger(value) || Number(value) < 0) throw new Error('invalid_count'); return Number(value); }
function validStamp(value: unknown) { return typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : null; }

const GSM = new Set(Array.from('@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'));
const GSM_EXT = new Set(Array.from('\f^{}\\[~]|€'));
export function smsSegments(message: string) {
  let units = 0;
  for (const char of message) {
    if (GSM.has(char)) units += 1;
    else if (GSM_EXT.has(char)) units += 2;
    else return { encoding: 'UCS-2' as const, units: message.length, segments: message.length === 0 ? 0 : message.length <= 70 ? 1 : Math.ceil(message.length / 67) };
  }
  return { encoding: 'GSM-7' as const, units, segments: units === 0 ? 0 : units <= 160 ? 1 : Math.ceil(units / 153) };
}
export function preparationDraft(draft: string, recipient: StaffRecipient) {
  const text = draft.trim();
  const final = text.endsWith(FOOTER) ? text : `${text}\n${FOOTER}`;
  const links = final.match(/https?:\/\/[^\s]+/g) || [];
  if (!text || links.length !== 1 || links[0] !== recipient.url || !registeredLink(recipient.url, recipient.token)) throw new Error('Use the exact existing registered customer link.');
  return { content: final, ...smsSegments(final) };
}
export function campaignWindow(now: Date) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', minute: '2-digit' }).formatToParts(now);
  const v = Object.fromEntries(p.map(x => [x.type, x.value]));
  const day = `${v.year}-${v.month}-${v.day}`, minutes = Number(v.hour) * 60 + Number(v.minute);
  if (day < '2026-10-07') return { open: false, reason: 'Preparation only until October 7 at 9 AM Central.' };
  if (day > '2026-10-09') return { open: false, reason: 'Campaign sending ended October 9. Reporting continues through October 11.' };
  return minutes >= 540 && minutes < 1080 ? { open: true, reason: 'Authorized window: 9 AM–6 PM Central, October 7–9.' } : { open: false, reason: 'Preparation only outside 9 AM–6 PM Central.' };
}
