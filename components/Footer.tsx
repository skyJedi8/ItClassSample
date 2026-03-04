import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { services } from '@/lib/services';
import { areas } from '@/lib/areas';

export default function Footer() {
  return <footer className="mt-20 border-t bg-slate-50 py-10"><Container><div className="grid gap-8 md:grid-cols-4 text-sm"><div><h3 className="font-semibold">Services</h3>{services.map(s=><Link className="block mt-2" key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>)}</div><div><h3 className="font-semibold">Service Areas</h3>{areas.map(a=><Link className="block mt-2" key={a} href={`/service-areas/${a.toLowerCase().replace(' ','-')}`}>{a}</Link>)}</div><div><h3 className="font-semibold">Contact</h3><p>{siteConfig.phoneDisplay}</p><p>{siteConfig.email}</p><p>{siteConfig.hours}</p></div><div><h3 className="font-semibold">Legal</h3><Link href="/privacy">Privacy Policy</Link></div></div></Container></footer>;
}
