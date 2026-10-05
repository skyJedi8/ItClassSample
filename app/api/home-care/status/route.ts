import { NextResponse } from 'next/server';
import { HOME_CARE_VERSION, TERMS_VERSION, SERVICES } from '@/lib/home-care';
import { TRACKING_VERSION } from '@/lib/home-care-tracking';
export const dynamic = 'force-dynamic';
export function GET() {
  const directPlanSave = (process.env.HOME_CARE_INTAKE_SHARED_KEY?.length || 0) >= 64;
  return NextResponse.json({ trackingVersion: TRACKING_VERSION, campaignTracking: directPlanSave, privateMetrics: true, version: HOME_CARE_VERSION, termsVersion: TERMS_VERSION, intakeVersion: '2026-10-04.3', catalog: SERVICES.map(x => ({ id: x.id, frequencies: x.frequencies })), mode: 'priced-signup-request', runningEstimates: true, preferredDateSelection: true, confirmedDateBooking: false, checkoutEnabled: false, automaticMaintenanceActivation: false, submission: directPlanSave ? 'authenticated server-to-Jobber signup and preferred-date intake' : 'customer-sent Quo text or secure native Jobber request with pasted plan', draftStorage: 'device-local', directPlanSave, directPlanSaveConfiguration: directPlanSave ? 'configured; verify actual receipt and Jobber readback' : 'unconfigured' }, { headers: { 'Cache-Control': 'no-store' } });
}
