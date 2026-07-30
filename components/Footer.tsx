import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { services } from '@/lib/services';
import { serviceAreas } from '@/lib/areas';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/90 pb-24 pt-10 md:pb-10">
      <Container>
        <div className="mb-8">
          <BrandLogo full className="max-w-full" />
          <p className="mt-3 max-w-xl text-sm text-slate-300">Veteran-owned exterior cleaning for homes, rentals, HOAs, commercial properties, and managed communities across Greater Houston.</p>
        </div>
        <div className="grid gap-8 text-sm md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-brand-100">Services</h3>
            {services.map((service) => (
              <Link className="mt-2 block text-slate-300" key={service.slug} href={`/services/${service.slug}`}>
                {service.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-brand-100">Service Areas</h3>
            {serviceAreas.map((area) => (
              <Link className="mt-2 block text-slate-300" key={area.slug} href={`/service-areas/${area.slug}`}>
                {area.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-brand-100">Contact</h3>
            <a className="mt-2 block text-slate-300 hover:text-brand-200" href={siteConfig.phoneLink}>{siteConfig.phoneDisplay}</a>
            <a className="mt-2 block break-all text-slate-300 hover:text-brand-200" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <p className="mt-2 text-slate-300">{siteConfig.hours}</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-100">Legal</h3>
            <Link href="/privacy" className="text-slate-300">Privacy Policy</Link>
            <p className="mt-3 text-xs text-slate-400">Serving residential and commercial clients with veteran-owned standards.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
