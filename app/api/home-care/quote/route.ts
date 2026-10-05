import { NextRequest, NextResponse } from 'next/server';
import { quotePlan } from '@/lib/home-care';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    if (Number(req.headers.get('content-length') || 0) > 16000) return NextResponse.json({ error: 'Plan is too large.' }, { status: 413 });
    const text = await req.text(); if (text.length > 16000) return NextResponse.json({ error: 'Plan is too large.' }, { status: 413 });
    return NextResponse.json({ ...quotePlan(JSON.parse(text)), intakeAvailable: (process.env.HOME_CARE_INTAKE_SHARED_KEY?.length || 0) >= 64 }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Please check the plan details.' }, { status: 400 }); }
}
