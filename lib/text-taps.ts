import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { createHash, timingSafeEqual } from 'node:crypto';

// Tap counter for the tracked "Text us" link (/text, /fb). Stores counts only: no IPs, names or numbers.
const PATH = 'tracking/text-taps-v1.json';
export const TEXT_NUMBER = '+13466236767';
export const TEXT_BODY = 'Hi, I saw your ad for Operation Clean Freedom.';
export const SMS_HREF = 'sms:' + TEXT_NUMBER + '?&body=' + encodeURIComponent(TEXT_BODY);
// sha256 of the owner's stats token (token itself is not in the repo).
const STATS_TOKEN_SHA256 = 'baf0e60cc323d6b1961785ddde56afa2ad7023d52c6425ad0841f071460a4075';

type Tap = { at: string; src: string; campaign?: string; device: string; bot: boolean };
type State = { schema: 1; total: number; humans: number; bots: number; bySource: Record<string, number>; byDay: Record<string, Record<string, number>>; recent: Tap[] };
const fresh = (): State => ({ schema: 1, total: 0, humans: 0, bots: 0, bySource: {}, byDay: {}, recent: [] });
const token = () => process.env.BLOB_READ_WRITE_TOKEN;

export function cleanSrc(value: string | null | undefined, fallback: string) {
  const v = (value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
  return v || fallback;
}
export function isBot(ua: string) { return !ua || /facebookexternalhit|facebot|meta-externalagent|bot\b|crawler|spider|preview|whatsapp|slackbot|twitterbot|discordbot|curl|wget|python|headless/i.test(ua); }
function device(ua: string) { return /iphone|ipad|ipod/i.test(ua) ? 'ios' : /android/i.test(ua) ? 'android' : /mobile/i.test(ua) ? 'mobile' : 'desktop'; }
function day(now: Date) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now); }

export async function readTaps(): Promise<{ state: State; etag?: string }> {
  const result = await get(PATH, { access: 'private', useCache: false, token: token() });
  if (!result) return { state: fresh() };
  if (result.statusCode !== 200) throw new Error('tap store unavailable');
  const state: State = await new Response(result.stream).json();
  return { state: state && state.schema === 1 ? state : fresh(), etag: result.blob.etag };
}

export async function recordTap(src: string, campaign: string | undefined, ua: string) {
  if (!token()) return false;
  const bot = isBot(ua), now = new Date(), d = day(now), key = bot ? 'bot' : src;
  for (let i = 0; i < 4; i++) {
    try {
      const { state, etag } = await readTaps();
      state.total++; if (bot) state.bots++; else state.humans++;
      state.bySource[key] = (state.bySource[key] || 0) + 1;
      state.byDay[d] = state.byDay[d] || {}; state.byDay[d][key] = (state.byDay[d][key] || 0) + 1;
      state.recent.push({ at: now.toISOString(), src, ...(campaign ? { campaign } : {}), device: device(ua), bot });
      state.recent = state.recent.slice(-300);
      await put(PATH, JSON.stringify(state), { access: 'private', token: token(), addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 60, ...(etag ? { ifMatch: etag, allowOverwrite: true } : { allowOverwrite: false }) });
      return true;
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError) && !(error instanceof Error && /already exists|precondition/i.test(error.message))) { console.error('text-tap record failed', error); return false; }
    }
  }
  return false;
}

export function statsTokenOk(given: string | null) {
  if (!given) return false;
  const a = Buffer.from(createHash('sha256').update(given).digest('hex')), b = Buffer.from(STATS_TOKEN_SHA256);
  return a.length === b.length && timingSafeEqual(a, b);
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
export function textPage(autoOpen: boolean) {
  const href = esc(SMS_HREF);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Text Operation Clean Freedom</title>
<meta property="og:title" content="Text Operation Clean Freedom"><meta property="og:description" content="Text a photo of your house for a fast Christmas light price. 346-623-6767">
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1a33;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center}main{padding:28px;max-width:420px}h1{font-size:1.5rem;margin:0 0 8px}p{color:#cbd5e1;line-height:1.5}a.btn{display:block;margin:22px 0 12px;padding:18px;border-radius:12px;background:#f5c76b;color:#0b1a33;font-weight:800;font-size:1.25rem;text-decoration:none}a.call{color:#f5c76b;font-weight:700}small{color:#94a3b8}</style>
</head><body><main><h1>Operation Clean Freedom</h1><p>Opening your text app&hellip; If it doesn&rsquo;t open, tap the button.</p>
<a class="btn" id="go" href="${href}">Text us</a>
<p>Or text or call <a class="call" href="tel:${TEXT_NUMBER}">346-623-6767</a></p>
<small>Send a front-of-house photo and your address for a fast price.</small></main>
${autoOpen ? `<script>setTimeout(function(){location.href=document.getElementById('go').href},250)</script>` : ''}</body></html>`;
}
