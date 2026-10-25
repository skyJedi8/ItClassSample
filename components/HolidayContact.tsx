'use client';
import Link from 'next/link';
import {holidaySms} from '@/lib/holiday';
export default function HolidayContact(){return <div className="holiday-mobile"><a href={holidaySms}>Text a photo</a><a href="tel:+13466236767">Call</a><Link href="/holiday-lighting#packages">See prices</Link></div>;}
