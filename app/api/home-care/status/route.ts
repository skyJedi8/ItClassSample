import { NextResponse } from 'next/server';
import { HOME_CARE_VERSION, TERMS_VERSION, SERVICES } from '@/lib/home-care';
export const dynamic = 'force-dynamic';
export function GET() {
  return NextResponse.json({ version: HOME_CARE_VERSION, termsVersion: TERMS_VERSION, catalog: SERVICES.map(x => ({ id: x.id, frequencies: x.frequencies })), mode: 'quote-review', checkoutEnabled: false, automaticMaintenanceActivation: false, submission: 'customer-sent Quo text or secure native Jobber request with pasted plan', draftStorage: 'device-local', directPlanSave: false }, { headers: { 'Cache-Control': 'no-store' } });
}
