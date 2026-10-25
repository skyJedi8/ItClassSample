'use client';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
const JobberEmbed=dynamic(()=>import('./JobberEmbed'),{ssr:false,loading:()=> <p role="status">Loading the secure Jobber form…</p>});
export default function QuoteForm({compact=false,clickOnly=false}:{compact?:boolean;clickOnly?:boolean}){
 const [active,setActive]=useState(false);const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(clickOnly||!ref.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){setActive(true);observer.disconnect();}},{rootMargin:'200px'});observer.observe(ref.current);return()=>observer.disconnect();},[clickOnly]);
 return <div ref={ref} className="min-h-[120px]">{active?<JobberEmbed compact={compact}/>:<div className="rounded-2xl border border-slate-700 bg-slate-900 p-6"><p className="mb-4 text-slate-300">Prefer a form? Send your request securely through Jobber.</p><button type="button" className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950" onClick={()=>setActive(true)}>Open the quote form</button><noscript><a href="https://clienthub.getjobber.com/hubs/79f18a49-0ca1-4d8f-85db-fa0804c8f6ce/public/requests/1774207/new?utm_source=website">Open the secure Jobber form</a></noscript></div>}</div>;
}
