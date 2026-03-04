import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { CallButton, TextButton } from './CTAButtons';

const nav = [['Home','/'],['Services','/services'],['Service Areas','/service-areas'],['Commercial/HOA','/commercial-hoa'],['About','/about'],['Gallery','/gallery'],['Reviews','/reviews'],['Contact','/contact']];

export default function Header() {
  return <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur"><Container><div className="flex flex-wrap items-center justify-between gap-3 py-3"><Link href="/" className="font-bold text-brand-900">Operation Clean Freedom</Link><div className="hidden items-center gap-2 md:flex"><span className="text-sm font-medium">{siteConfig.phoneDisplay}</span><CallButton/><TextButton/></div></div><nav className="flex flex-wrap gap-4 pb-3 text-sm">{nav.map(([l,h])=><Link key={h} href={h} className="hover:text-brand-700">{l}</Link>)}</nav></Container></header>;
}
