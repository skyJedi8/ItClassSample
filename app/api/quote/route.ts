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
    if (entry.count > 8) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const data = await req.json();
    if (data.company) return NextResponse.json({ ok: true });
    if (!isValidQuote(data)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    if (!(await verifyRecaptcha(data.recaptchaToken))) return NextResponse.json({ error: 'reCAPTCHA failed' }, { status: 400 });

    const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: 'info@operationcleanfreedom.com', subject: 'New OCF Quote Request', text });
    }

    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
