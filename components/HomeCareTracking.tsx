'use client';
import {useEffect} from 'react';
let viewPromise:Promise<unknown>|undefined;
let session='';
let campaign='';
let linkToken='';
let started=false;
async function send(kind:'view'|'start',eventId:string){
  const result=await fetch('/api/home-care/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,eventId,sessionId:session,campaign,linkToken}),credentials:'same-origin',keepalive:true,signal:AbortSignal.timeout(10000)});
  if(!result.ok)throw new Error('Home Care visit tracking unavailable');
  return result.json();
}
export function trackHomeCareStart(){
  if(started)return;started=true;
  void (viewPromise||Promise.resolve()).then(()=>session?send('start',crypto.randomUUID()):null).catch(()=>{started=false;});
}
export default function HomeCareTracking(){
  useEffect(()=>{
    const params=new URLSearchParams(location.search);campaign=params.get('c')==='hc-oct-2026'?'hc-oct-2026':'';linkToken=/^[0-9a-f]{32}$/.test(params.get('r')||'')?params.get('r')!:'';started=false;
    try{const old=JSON.parse(sessionStorage.getItem('ocf-hc-session')||'null');session=old?.id&&old?.expires>Date.now()?old.id:crypto.randomUUID();sessionStorage.setItem('ocf-hc-session',JSON.stringify({id:session,expires:Date.now()+30*60000}));}catch{session=crypto.randomUUID();}
    let timer:ReturnType<typeof setTimeout>|undefined,stopped=false,sent=false;
    let complete:()=>void=()=>{};viewPromise=new Promise<void>(resolve=>{complete=resolve;});
    const eventId=crypto.randomUUID();
    const record=()=>{if(document.visibilityState!=='visible'||sent||stopped)return;timer=setTimeout(()=>{if(document.visibilityState!=='visible'||stopped)return;sent=true;void send('view',eventId).catch(()=>{console.warn('Home Care visit tracking unavailable. Signup remains available.');}).finally(complete);},2000);};
    const visible=()=>{if(timer)clearTimeout(timer);record();};
    record();document.addEventListener('visibilitychange',visible);
    return()=>{stopped=true;if(timer)clearTimeout(timer);document.removeEventListener('visibilitychange',visible);complete();};
  },[]);
  return null;
}
