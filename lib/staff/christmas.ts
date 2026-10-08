import { intakeSignature } from '@/lib/home-care-intake-auth';
import { BACKEND_ORIGIN } from './owner';
export async function campaignRequest(body: Record<string, unknown>) {
  const key = process.env.HOME_CARE_INTAKE_SHARED_KEY;
  if (!key || key.length < 64) throw new Error('campaign_service_unavailable');
  const payload = { ...body, actor: 'ocf-owner' }, stamp = String(Date.now());
  const response = await fetch(`${BACKEND_ORIGIN}/api/staff-campaign`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ocf-time': stamp, 'x-ocf-signature': intakeSignature(payload, stamp, key) }, body: JSON.stringify(payload), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(240000) });
  const result = await response.json();
  if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : 'campaign_service_unavailable');
  return result;
}
