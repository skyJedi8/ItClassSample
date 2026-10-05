const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const filename=path.resolve(__dirname,'../lib/home-care-tracking.ts');
const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const m=new Module(filename,module);m.filename=filename;m.paths=module.paths;m._compile(compiled,filename);
const {CAMPAIGN,eventAttribution,encodeAttribution,decodeAttribution,obviousBot}=m.exports;
const key='a'.repeat(64),now=Date.now();
const raw={sessionId:crypto.randomUUID(),campaign:CAMPAIGN,linkToken:'b'.repeat(32)};
test('tracking cookie authenticates attribution and rejects tampering, a wrong key and expiry',()=>{
 const a=eventAttribution(raw,null,now),cookie=encodeAttribution(a,key);assert.deepEqual(decodeAttribution(cookie,key,now),a);
 assert.equal(decodeAttribution(cookie+'a',key,now),null);assert.equal(decodeAttribution(cookie,'different',now),null);assert.equal(decodeAttribution(cookie,key,now+31*86400000),null);
 const b={...a,campaign:'paid'};assert.equal(decodeAttribution(encodeAttribution(b,key),key,now),null);
});
test('repeat visits keep the anonymous visitor and campaign without encoding contact details',()=>{
 const a=eventAttribution({...raw,phone:'private'},null,now),b=eventAttribution({sessionId:crypto.randomUUID()},a,now+100);
 assert.equal(a.visitorId,b.visitorId);assert.equal(b.campaign,CAMPAIGN);assert.equal(b.linkToken,raw.linkToken);assert.equal(a.phone,undefined);
 assert.notEqual(a.visitorId,eventAttribution(raw,null,now).visitorId);
});
test('obvious previews and automation are excluded before metrics or cookies are written',()=>{
 for(const ua of ['','Slackbot-LinkExpanding','facebookexternalhit/1.1','WhatsApp/2.24','HeadlessChrome/131','curl/8.0'])assert.equal(obviousBot(ua),true,ua);
 assert.equal(obviousBot('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'),false);
});
