import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import type {NextRequest} from 'next/server';
export const TRACKING_VERSION='2026-10-05.1';
export const CAMPAIGN='hc-oct-2026';
export const TRACKING_COOKIE='ocf_hc_visit';
export type Attribution={visitorId:string;sessionId:string;campaign:string;linkToken:string|null;expires:number};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const mac=(text:string,key:string)=>createHmac('sha256',key).update('homecare-attribution:'+text).digest('hex');
export function encodeAttribution(a:Attribution,key:string){const body=Buffer.from(JSON.stringify(a)).toString('base64url');return body+'.'+mac(body,key);}
export function decodeAttribution(value:string|undefined,key:string,now=Date.now()):Attribution|null{
  if(!value||value.length>1200)return null;
  const [body,sig,...extra]=value.split('.');
  if(extra.length||!/^[0-9a-f]{64}$/.test(sig||''))return null;
  if(!timingSafeEqual(Buffer.from(mac(body,key)),Buffer.from(sig)))return null;
  try{const a=JSON.parse(Buffer.from(body,'base64url').toString());if(!uuid.test(a.visitorId)||!uuid.test(a.sessionId)||![CAMPAIGN,'direct'].includes(a.campaign)||(a.linkToken&&!/^[0-9a-f]{32}$/.test(a.linkToken))||!Number.isSafeInteger(a.expires)||a.expires<now)return null;return a;}catch{return null;}
}
export function attributionFromRequest(request:NextRequest,key:string){return decodeAttribution(request.cookies.get(TRACKING_COOKIE)?.value,key);}
export function eventAttribution(raw:Record<string,unknown>,old:Attribution|null,now=Date.now()):Attribution{
  if(!uuid.test(String(raw.sessionId||'')))throw new Error('invalid_session');
  const campaign=raw.campaign===CAMPAIGN?CAMPAIGN:old?.campaign||'direct';
  const linkToken=raw.campaign===CAMPAIGN&&typeof raw.linkToken==='string'&&/^[0-9a-f]{32}$/.test(raw.linkToken)?raw.linkToken:raw.campaign===CAMPAIGN?null:old?.linkToken||null;
  return {visitorId:old?.visitorId||randomUUID(),sessionId:String(raw.sessionId),campaign,linkToken,expires:now+30*86400000};
}
export function obviousBot(ua:string){return !ua||/bot\b|crawler|spider|preview|facebookexternalhit|slackbot|twitterbot|whatsapp|telegrambot|headless|google-inspectiontool|lighthouse|curl\//i.test(ua);}
