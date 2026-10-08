const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the save handler with an isolated account response, never a real account.
function setup(response) {
  const state = ['a'.repeat(64), { email: 'fixture@example.invalid', name: 'Fixture', purpose: 'invite' }, '', false, false];
  const navigations = [], requests = [];
  let cursor = 0;
  const hooks = { useState: () => { const i = cursor++; return [state[i], value => { state[i] = value; }]; }, useEffect() {} };
  const jsx = (type, props) => ({ type, props });
  const source = ts.transpileModule(fs.readFileSync(require.resolve('../components/staff/PasswordSetup.tsx'), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const context = {
    exports: {}, require: id => id === 'react' ? hooks : id === 'react/jsx-runtime' ? { jsx, jsxs: jsx, Fragment: 'fragment' } : (() => { throw Error(id); })(),
    FormData: class { constructor(form) { this.values = form.values; } get(key) { return this.values[key]; } },
    window: { location: { replace: path => navigations.push(path) }, history: { replaceState() { throw Error('Unsafe embedded-browser router transition'); } } },
    fetch: async (path, options) => { requests.push({ path, ...options }); return { ok: response.ok, json: async () => response.body }; }
  };
  vm.runInNewContext(source, context);
  const tree = context.exports.default();
  function findForm(node) { if (!node || typeof node !== 'object') return; if (node.type === 'form' && node.props.children?.some?.(child => child?.props?.name === 'password')) return node; for (const child of [node.props?.children].flat(Infinity)) { const found = findForm(child); if (found) return found; } }
  const form = findForm(tree);
  assert.ok(form, 'verified invitation shows the password form');
  return { state, navigations, requests, save: values => form.props.onSubmit({ preventDefault() {}, currentTarget: { values } }) };
}
test('saved password opens a fresh sign-in document, avoiding embedded-browser history state', async () => {
  const fixture = setup({ ok: true, body: { email: 'fixture@example.invalid' } });
  await fixture.save({ password: 'local fixture phrase', confirm: 'local fixture phrase' });
  assert.deepEqual(fixture.navigations, ['/staff/login?setup=complete']);
  assert.equal(fixture.state[4], true);
  assert.equal(fixture.state[2], '');
  assert.equal(JSON.parse(fixture.requests[0].body).action, 'redeem');
});
test('failed or mismatched password save stays on the form without claiming completion', async () => {
  const failed = setup({ ok: false, body: { error: 'This setup link has already been used.' } });
  await failed.save({ password: 'local fixture phrase', confirm: 'local fixture phrase' });
  assert.deepEqual(failed.navigations, []); assert.equal(failed.state[4], false); assert.match(failed.state[2], /already been used/);
  const mismatch = setup({ ok: true, body: {} });
  await mismatch.save({ password: 'local fixture phrase', confirm: 'different fixture phrase' });
  assert.equal(mismatch.requests.length, 0); assert.deepEqual(mismatch.navigations, []);
});
