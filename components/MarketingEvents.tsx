'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {trackEvent} from '@/lib/analytics';
declare global {interface Window {fbq?:(...args:unknown[])=>void}}
// Uses an existing verified pixel only; this component never creates a pixel or grant.
export default function MarketingEvents(){const pathname=usePathname();useEffect(()=>{
 if(pathname.startsWith('/staff'))return;
 const enabled=process.env.NEXT_PUBLIC_MARKETING_EVENTS_ENABLED==='true';
 if(enabled&&window.fbq){window.fbq('track','PageView');if(pathname==='/holiday-lighting')window.fbq('track','ViewContent',{content_name:'Holiday Lighting 2026'});}
 const click=(event:MouseEvent)=>{const target=event.target instanceof Element?event.target.closest('a'):null;const href=target?.getAttribute('href')||'';if(!/^(sms:|tel:)/.test(href))return;const method=href.startsWith('sms:')?'sms':'phone';trackEvent('contact_intent',{method,page:pathname});if(enabled&&window.fbq)window.fbq('track','Contact',{method});};document.addEventListener('click',click);return()=>document.removeEventListener('click',click);
 },[pathname]);return null;}
