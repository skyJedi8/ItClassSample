import { createHmac } from 'node:crypto';
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') { const object = value as Record<string, unknown>; return Object.fromEntries(Object.keys(object).sort().map(k => [k, canonical(object[k])])); }
  return value;
}
export function intakeSignature(payload: unknown, stamp: string, secret: string) {
  return createHmac('sha256', secret).update(stamp + '\n' + JSON.stringify(canonical(payload))).digest('hex');
}
