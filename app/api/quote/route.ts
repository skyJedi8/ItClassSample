import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require('nodemailer');
import { isValidQuote } from '@/lib/validators';

type Entry = { count: number; ts: number };
const bucket = new Map<string, Entry>();

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body });
  const json = await res.json();
  return Boolean(json.success);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const entry = bucket.get(ip) || { count: 0, ts: now };
    if (now - entry.ts > 60_000) { entry.count = 0; entry.ts = now; }
    entry.count += 1;
    bucket.set(ip, entry);
    if (entry.count > 8) return NextResponse.json({ error: 'Too many requests. Please call or text 346-306-7622.' }, { status: 429 });

    const data = await req.json();
    if (data.company) return NextResponse.json({ ok: true });
    if (!isValidQuote(data)) return NextResponse.json({ error: 'Please complete the required quote details.' }, { status: 400 });
    if (!(await verifyRecaptcha(data.recaptchaToken))) return NextResponse.json({ error: 'Verification failed. Please call or text 346-306-7622.' }, { status: 400 });

    const text = Object.entries(data)
      .filter(([key]) => key !== 'company' && key !== 'recaptchaToken')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    let delivered = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: 'info@operationcleanfreedom.com',
        replyTo: typeof data.email === 'string' && data.email ? data.email : undefined,
        subject: `New OCF Quote Request — ${data.servicesNeeded || 'Exterior Cleaning'}`,
        text
      });
      delivered = true;
    }

    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      const webhookResponse = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (webhookResponse.ok) delivered = true;
    }

    if (!delivered) {
      return NextResponse.json(
        { error: 'Online delivery is not configured yet. Please call or text 346-306-7622.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Delivery failed. Please call or text 346-306-7622.' }, { status: 500 });
  }
}
