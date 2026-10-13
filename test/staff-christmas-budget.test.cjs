const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function load(relative) {
  const filename = path.resolve(__dirname, '..', relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:true});
  assert.equal(code.diagnostics.length, 0);
  const m = new Module(filename, module);m.filename=filename;m.paths=module.paths;
  const originalRequire=m.require.bind(m);
  m.require=id=>{
    if(id.endsWith('.css'))return {};
    if(id==='@/lib/staff/campaign')return load('lib/staff/campaign.ts');
    if(id==='@/lib/staff/message-review')return load('lib/staff/message-review.ts');
    if(['./QuickAudience','./BulkPermissions','./CustomerPermission'].includes(id))return {__esModule:true,default:()=>null};
    return originalRequire(id);
  };
  m._compile(code.outputText,filename);return m.exports;
}
const ChristmasCampaign=load('components/staff/ChristmasCampaign.tsx').default;
function render(budget){return renderToStaticMarkup(React.createElement(ChristmasCampaign,{initial:{connected:true,trackerConnected:true,offerConfirmed:true,template:"Hi [First], it's Eric with Operation Clean Freedom. Reply STOP to unsubscribe.",revision:1,paused:false,window:{open:true,reason:'Sending window is open.'},quota:null,recipients:[],batch:null,counts:{approved:0,sent:0,accepted:0,held:0,unknown:0},audience:{mode:'reviewed_allowlist',clientIds:['fixture'],reviewedAt:'2026-10-13T16:00:00Z'},budget}}));}
const approved={scope:'whole_campaign',approvedTotalLimitCents:15000,introductionLimitCents:14000,replyReserveCents:1000,replyUsedCents:null,totalUsedCents:841,totalLimitCents:14000,limitCents:14000,usedCents:841,remainingCents:13159,week:'2026-10-12',notice:'No automatic credit purchases.'};
test('approved UI separates introduction spending, whole-campaign total and reply reserve',()=>{
  const html=render(approved);assert.match(html,/\$150 approved total campaign ceiling/);assert.match(html,/Approved total: \$150\.00/);assert.match(html,/Introduction ceiling: \$140\.00/);assert.match(html,/Reply reserve: \$10\.00/);
  assert.match(html,/\$8\.41 \/ \$140\.00/);assert.match(html,/\$131\.59/);assert.match(html,/Estimated introduction cost, whole campaign/);assert.match(html,/Remaining introduction budget/);assert.match(html,/Neither allowance resets daily or weekly/);assert.match(html,/Reply spending is tracked separately/);
  assert.doesNotMatch(html,/id="weekly-budget"|Save weekly budget|\$50 total campaign ceiling/);
});
test('legacy UI reflects the actual old limit until the backend migration is verified',()=>{
  const html=render({totalUsedCents:841,totalLimitCents:5000,limitCents:5000,usedCents:841,remainingCents:4159,week:'2026-10-12',notice:'Legacy budget.'});
  assert.match(html,/\$50 approved total campaign ceiling/);assert.match(html,/id="weekly-budget"/);assert.match(html,/Save weekly budget/);assert.doesNotMatch(html,/Reply reserve:|Approved total: \$150/);
});
test('exhausted introductions show zero without offering the protected reply reserve to introductions',()=>{
  const html=render({...approved,totalUsedCents:14000,usedCents:14000,remainingCents:0});assert.match(html,/\$140\.00 \/ \$140\.00/);assert.match(html,/\$0\.00/);assert.match(html,/Reply reserve: \$10\.00/);assert.doesNotMatch(html,/Save weekly budget/);
});
