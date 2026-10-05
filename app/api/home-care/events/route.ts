import {NextRequest,NextResponse} from 'next/server';
import {createHmac} from 'node:crypto';
import {intakeSignature} from '@/lib/home-care-intake-auth';
import {attributionFromRequest,eventAttribution,encodeAttribution,obviousBot,TRACKING_COOKIE,TRACKING_VERSION} from '@/lib/home-care-tracking';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const response=(body:unknown,status:number)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:NextRequest){
  if(!['https://www.operationcleanfreedom.com','https://operationcleanfreedom.com'].includes(request.headers.get('origin')||''))return response({error:'origin_not_allowed'},403);
  const key=process.env.HOME_CARE_INTAKE_SHARED_KEY;if(!key||key.length<64)return response({error:'tracking_unavailable'},503);
  if(obviousBot(request.headers.get('user-agent')||''))return response({recorded:false,reason:'automated_preview'},202);
  let raw,a;
  try{const body=await request.text();if(Buffer.byteLength(body)>2048)return response({error:'request_too_large'},413);raw=JSON.parse(body);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw.eventId)||!['view','start'].includes(raw.kind))throw new Error();a=eventAttribution(raw,attributionFromRequest(request,key));}catch{return response({error:'invalid_event'},400);}
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const rateKey=createHmac('sha256',key).update('homecare-event-rate:'+ip).digest('hex');
  const payload={operation:'event',event:{...a,eventId:raw.eventId,kind:raw.kind,rateKey}},stamp=String(Date.now());
  try{
    const result=await fetch('https://ocf-jobber-service.vercel.app/api/campaign',{method:'POST',headers:{'Content-Type':'application/json','x-ocf-time':stamp,'x-ocf-signature':intakeSignature(payload,stamp,key)},body:JSON.stringify(payload),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(8000)});
    const receipt=await result.json();if(!result.ok)return response({error:receipt.error||'tracking_unavailable'},[400,429].includes(result.status)?result.status:503);
    const out=response({recorded:receipt.recorded,trackingVersion:TRACKING_VERSION},200);
    out.cookies.set(TRACKING_COOKIE,encodeAttribution(a,key),{httpOnly:true,secure:true,sameSite:'lax',path:'/api/home-care',maxAge:30*86400});
    return out;
  }catch{return response({error:'tracking_unavailable'},503);}
}
export function GET(){return response({trackingVersion:TRACKING_VERSION,privateMetrics:true,notice:'Metrics require authenticated owner access.'},200);}
