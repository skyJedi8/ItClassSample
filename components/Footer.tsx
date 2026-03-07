import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { services } from '@/lib/services';
import { areas } from '@/lib/areas';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 py-10">
      <Container>
        <div className="grid gap-8 text-sm text-slate-300 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-white">Services</h3>
            {services.map((s) => (
              <Link className="mt-2 block transition hover:text-sky-300" key={s.slug} href={`/services/${s.slug}`}>
                {s.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-white">Service Areas</h3>
            {areas.map((a) => (
              <Link
                className="mt-2 block transition hover:text-sky-300"
                key={a}
                href={`/service-areas/${a.toLowerCase().replace(' ', '-')}`}
              >
                {a}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <p>{siteConfig.phoneDisplay}</p>
            <p>{siteConfig.email}</p>
            <p>{siteConfig.hours}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Legal</h3>
            <Link href="/privacy" className="transition hover:text-sky-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
