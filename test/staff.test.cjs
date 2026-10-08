const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
function load(file) {
  const filename = path.resolve(__dirname, '../lib/staff/' + file + '.ts');
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const m = new Module(filename, module); m.filename = filename; m.paths = module.paths; m._compile(code, filename); return m.exports;
}
const { registeredLink, sanitizeSummary, smsSegments, preparationDraft, campaignWindow, FOOTER, CAMPAIGN } = load('campaign');
const { verifyOwnerLogin, isOwner, OWNER_EMAIL, allowedStaffOrigin } = load('owner');
const token = 'b'.repeat(32);
const r = { key: 'fixture-household', name: 'Fixture', token, url: 'https://www.operationcleanfreedom.com/home-care-plan?c=' + CAMPAIGN + '&r=' + token, signupCount: 0 };
const summary = () => ({ available: true, campaign: CAMPAIGN, recipients: [r], metrics: [{ campaign: CAMPAIGN, pageViews: 0, estimatedVisitors: 0, planStarters: 0, signupSubmissions: 0 }], recipientsTruncated: false });
test('private owner verification fails closed and validates the actual connected company', async () => {
  let calls = 0;
  const transport = async (url, options) => { calls++; assert.equal(url, 'https://ocf-jobber-service.vercel.app/api/account'); assert.equal(options.redirect, 'error'); assert.equal(options.cache, 'no-store'); return Response.json({ connected: true, account: { id: 'fixture', name: 'Operation Clean Freedom' } }); };
  assert.equal(await verifyOwnerLogin('someone', 'x'.repeat(64), transport), false);
  assert.equal(await verifyOwnerLogin('eric', 'short', transport), false); assert.equal(calls, 0);
  assert.equal(await verifyOwnerLogin('eric', 'x'.repeat(64), transport), true);
  for (const data of [{ connected: false, account: { id: 'fixture', name: 'Operation Clean Freedom' } }, { connected: true, account: { id: 'fixture', name: 'Other company' } }, {}]) assert.equal(await verifyOwnerLogin('eric', 'x'.repeat(64), async () => Response.json(data)), false);
  assert.equal(await verifyOwnerLogin('eric', 'x'.repeat(64), async () => { throw new Error('offline'); }), false);
  assert.equal(await verifyOwnerLogin('eric', 'x'.repeat(64), async () => new Response('', { status: 401 })), false);
  assert.equal(isOwner(null), false); assert.equal(isOwner({ user: { email: 'other@example.com' } }), false); assert.equal(isOwner({ user: { email: OWNER_EMAIL } }), false); assert.equal(isOwner({ user: { email: OWNER_EMAIL, id: 'ocf-owner', role: 'owner' } }), true);
  assert.equal(allowedStaffOrigin('https://attacker.example'), false); assert.equal(allowedStaffOrigin(null), false); assert.equal(allowedStaffOrigin('https://www.operationcleanfreedom.com'), true);
});
test('registry rejects swapped links, duplicate keys, private query data and QA', () => {
  assert.equal(registeredLink(r.url, token), true);
  for (const url of [r.url + '&phone=private', r.url + '#fragment', r.url.replace('https:', 'http:'), r.url.replace(token, 'c'.repeat(32))]) assert.equal(registeredLink(url, token), false);
  const body = summary(); body.recipients.push({ ...r, key: 'qa', token: '0c9102c5884a9bd8d365fd8c18904f6e', internalTest: false });
  assert.equal(sanitizeSummary(body).recipients.length, 1); assert.equal(sanitizeSummary(body).recipientsComplete, false);
  const duplicate = summary(); duplicate.recipients.push(r); assert.throws(() => sanitizeSummary(duplicate));
  const bad = summary(); bad.metrics[0].signupSubmissions = undefined; assert.throws(() => sanitizeSummary(bad));
});
test('final segment counts include extensions, Unicode and the required footer', () => {
  assert.deepEqual(smsSegments('a'.repeat(160)), { encoding: 'GSM-7', units: 160, segments: 1 });
  assert.equal(smsSegments('a'.repeat(161)).segments, 2); assert.equal(smsSegments('^'.repeat(81)).units, 162);
  assert.deepEqual(smsSegments('😀'.repeat(36)), { encoding: 'UCS-2', units: 72, segments: 2 });
  const draft = preparationDraft('Hello ' + r.url, r); assert.equal(draft.content.endsWith(FOOTER), true); assert.deepEqual(smsSegments(draft.content), { encoding: draft.encoding, units: draft.units, segments: draft.segments });
  assert.equal(preparationDraft(draft.content, r).content, draft.content);
  assert.throws(() => preparationDraft('Wrong https://example.com', r));
});
test('campaign preparation cannot bypass Central dates or sending boundaries', () => {
  for (const time of ['2026-10-07T13:59:59Z', '2026-10-07T23:00:00Z', '2026-10-10T14:00:00Z']) assert.equal(campaignWindow(new Date(time)).open, false, time);
  for (const time of ['2026-10-07T14:00:00Z', '2026-10-09T22:59:59Z']) assert.equal(campaignWindow(new Date(time)).open, true, time);
});
