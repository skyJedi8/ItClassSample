'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from './Hero';
import {holidayPhase,holidaySms,lightWarranty,takedownGuarantee} from '@/lib/holiday';
export function useHolidayPhase(){const [phase,setPhase]=useState(holidayPhase());useEffect(()=>{const sync=()=>setPhase(holidayPhase());sync();const id=setInterval(sync,60000);return()=>clearInterval(id);},[]);return phase;}
export function HolidayOffer({banner=false}:{banner?:boolean}){
 const phase=useHolidayPhase();if(phase==='off')return null;
 const copy=phase==='early'?'Save $50 when you book by November 10. Prices plus sales tax.':phase==='install'?'Christmas light installation through December 10. Ask about available dates.':'Ask about purchased takedown service and the 2027 Return Pass.';
 return <div className={banner?'holiday-banner':'holiday-offer'}><Link href="/holiday-lighting">{copy} <span>{banner?'See packages →':''}</span></Link><p className="holiday-guarantee">{takedownGuarantee}</p><details className="holiday-warranty-detail"><summary>Light warranty</summary><p>{lightWarranty}</p></details></div>;
}
export function HolidayHero(){return <section className="holiday-hero"><div className="holiday-hero-photo"><Image src="/images/holiday/roofline.webp" alt="Custom white Christmas roofline lights on a home at night, from the OCF photo collection" fill priority sizes="100vw" /></div><div className="holiday-wrap holiday-hero-copy"><p className="holiday-eyebrow">Veteran-owned · Conroe · The Woodlands · Spring</p><h1>Put the ladder down.<br/><span>We’ll hang your<br className="hidden sm:block"/> Christmas lights.</span></h1><p className="holiday-intro">Custom-fit commercial C9 LEDs, a timer, and a warm welcome home. We install them. You keep them.</p><div className="holiday-hero-price">Packages from <strong>$549</strong> <small>plus sales tax · single-story front rooflines</small></div><div className="holiday-actions"><a className="holiday-button" href={holidaySms}>Text a photo for your price ↗</a><Link className="holiday-secondary" href="/holiday-lighting#packages">See packages ↓</Link></div><p className="holiday-hero-note">Send a front-of-house photo and your address to 346-623-6767.</p></div></section>;}
export function SeasonalHomeHero(){const phase=useHolidayPhase();return phase==='early'||phase==='install'?<HolidayHero/>:<Hero/>;}

export function HolidayStoryOffer(){return useHolidayPhase()==='early'?<>Book by Nov 10 and save $50.</>:null;}
