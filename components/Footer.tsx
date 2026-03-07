import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { services } from '@/lib/services';
import { areas } from '@/lib/areas';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/95 py-12">
      <Container>
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-sky-400/20 bg-slate-900/50 px-5 py-5 text-center md:flex-row md:text-left">
          <Image src="/brand/ocf-logo-full.svg" alt="Operation Clean Freedom" width={440} height={132} className="h-auto w-[220px] sm:w-[300px]" />
          <p className="max-w-xl text-sm text-slate-300">Veteran-owned and operated in Greater Houston with premium communication, dependable scheduling, and spotless exterior cleaning results.</p>
        </div>

        <div className="grid gap-8 text-sm md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-sky-100">Services</h3>
            {services.map((service) => (
              <Link className="mt-2 block text-slate-300" key={service.slug} href={`/services/${service.slug}`}>
                {service.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-sky-100">Service Areas</h3>
            {areas.map((area) => (
              <Link className="mt-2 block text-slate-300" key={area} href={`/service-areas/${area.toLowerCase().replace(' ', '-')}`}>
                {area}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-sky-100">Contact</h3>
            <p className="text-slate-300">{siteConfig.phoneDisplay}</p>
            <p className="text-slate-300">{siteConfig.email}</p>
            <p className="text-slate-300">{siteConfig.hours}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sky-100">Legal</h3>
            <Link href="/privacy" className="text-slate-300">Privacy Policy</Link>
            <p className="mt-3 text-xs text-slate-400">Veteran-owned and operated in Greater Houston.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
