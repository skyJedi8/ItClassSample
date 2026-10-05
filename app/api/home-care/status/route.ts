import { NextResponse } from 'next/server';
import { HOME_CARE_VERSION, TERMS_VERSION, SERVICES } from '@/lib/home-care';
export const dynamic = 'force-dynamic';
export function GET() {
  const directPlanSave = (process.env.HOME_CARE_INTAKE_SHARED_KEY?.length || 0) >= 64;
  return NextResponse.json({ version: HOME_CARE_VERSION, termsVersion: TERMS_VERSION, intakeVersion: '2026-10-04.2', catalog: SERVICES.map(x => ({ id: x.id, frequencies: x.frequencies })), mode: 'quote-review', checkoutEnabled: false, automaticMaintenanceActivation: false, submission: directPlanSave ? 'authenticated server-to-Jobber intake with customer-sent Quo/native form fallback' : 'customer-sent Quo text or secure native Jobber request with pasted plan', draftStorage: 'device-local', directPlanSave, directPlanSaveConfiguration: directPlanSave ? 'configured; verify actual receipt and Jobber readback' : 'unconfigured' }, { headers: { 'Cache-Control': 'no-store' } });
}
