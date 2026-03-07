import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { services } from '@/lib/services';
import { areas } from '@/lib/areas';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/90 py-10">
      <Container>
        <div className="grid gap-8 text-sm md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-cyan-100">Services</h3>
            {services.map((service) => (
              <Link className="mt-2 block text-slate-300" key={service.slug} href={`/services/${service.slug}`}>
                {service.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-cyan-100">Service Areas</h3>
            {areas.map((area) => (
              <Link className="mt-2 block text-slate-300" key={area} href={`/service-areas/${area.toLowerCase().replace(' ', '-')}`}>
                {area}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-cyan-100">Contact</h3>
            <p className="text-slate-300">{siteConfig.phoneDisplay}</p>
            <p className="text-slate-300">{siteConfig.email}</p>
            <p className="text-slate-300">{siteConfig.hours}</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-100">Legal</h3>
            <Link href="/privacy" className="text-slate-300">Privacy Policy</Link>
            <p className="mt-3 text-xs text-slate-400">Veteran-owned and operated in Greater Houston.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
