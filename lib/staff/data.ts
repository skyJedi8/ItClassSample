import { intakeSignature } from '@/lib/home-care-intake-auth';
import { BACKEND_ORIGIN } from './owner';
import { sanitizeSummary, StaffSnapshot } from './campaign';

export async function loadStaffSnapshot(): Promise<StaffSnapshot> {
  const key = process.env.HOME_CARE_INTAKE_SHARED_KEY;
  if (!key || key.length < 64) throw new Error('staff_data_unavailable');
  // Only the existing read operation is allowed. No registration, event,
  // customer submission or provider send is performed by this dashboard.
  const payload = { operation: 'summary' }, stamp = String(Date.now());
  const result = await fetch(`${BACKEND_ORIGIN}/api/campaign`, { method: 'POST', headers: {
    'Content-Type': 'application/json', 'x-ocf-time': stamp, 'x-ocf-signature': intakeSignature(payload, stamp, key)
  }, body: JSON.stringify(payload), redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(12000) });
  if (!result.ok) throw new Error('staff_data_unavailable');
  const summary = sanitizeSummary(await result.json());
  const health = await Promise.allSettled([
    fetch(`${BACKEND_ORIGIN}/api/campaign`, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000) }).then(async r => r.ok && (await r.json()).ready === true),
    fetch(`${BACKEND_ORIGIN}/api/homecare`, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000) }).then(async r => r.ok && (await r.json()).ready === true),
    fetch('https://www.operationcleanfreedom.com/api/home-care/status', { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000) }).then(async r => {
      if (!r.ok) return false; const body = await r.json();
      return body.version === '2026-10-04.3' && body.termsVersion === '2026-10-04.2' && body.catalog?.length === 7 && body.checkoutEnabled === false && body.automaticMaintenanceActivation === false;
    })
  ]);
  return { ...summary, checkedAt: new Date().toISOString(),
    health: { tracking: health[0].status === 'fulfilled' && health[0].value === true, intake: health[1].status === 'fulfilled' && health[1].value === true, pricing: health[2].status === 'fulfilled' && health[2].value === true },
    communications: { sent: null, replied: null, signed: null, paid: null, active: null },
    sender: { enabled: false, owner: 'Home Care promotions paused by Eric', reason: 'Home Care promotions are paused. Christmas lights campaign controls are available in the staff campaign page. Existing inbound ownership is unchanged.' }
  };
}
