import Container from './Container';
import { siteConfig } from '@/lib/site';
import { CallButton, TextButton } from './CTAButtons';
import BrandLogo from './BrandLogo';
import Link from 'next/link';
import { serviceAreas } from '@/lib/areas';

const nav = [['Home', '/'], ['Services', '/services'], ['Commercial/HOA', '/commercial-hoa'], ['About', '/about'], ['Gallery', '/gallery'], ['Reviews', '/reviews'], ['Contact', '/contact']];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/92 shadow-lg shadow-slate-950/30 backdrop-blur-xl">
      <Container>
        <div className="flex items-center justify-between gap-4 py-2">
          <BrandLogo />
          <div className="hidden items-center gap-2 lg:flex">
            <span className="mr-2 text-sm font-semibold text-slate-200">{siteConfig.phoneDisplay}</span>
            <CallButton />
            <TextButton />
          </div>
          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white">
              Menu
              <span aria-hidden="true" className="text-brand-200 transition group-open:rotate-45">+</span>
            </summary>
            <nav className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl">
              <div className="grid gap-1">
                {nav.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white">
                    {label}
                  </Link>
                ))}
                <Link href="/service-areas" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-200 transition hover:bg-slate-800">
                  Service Areas
                </Link>
                <div className="grid grid-cols-2 gap-1 border-l border-slate-700 pl-3">
                  {serviceAreas.map((area) => (
                    <Link key={area.slug} href={`/service-areas/${area.slug}`} className="rounded-md px-2 py-2 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white">
                      {area.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3">
                <CallButton />
                <TextButton />
              </div>
            </nav>
          </details>
        </div>
        <nav className="hidden items-center justify-center border-t border-slate-800/70 py-2.5 text-sm text-slate-300 lg:flex">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-brand-200">
                {label}
              </Link>
            ))}
            <details className="group relative">
              <summary className="cursor-pointer list-none transition hover:text-brand-200">
                Service Areas <span aria-hidden="true" className="text-brand-200">▾</span>
              </summary>
              <div className="absolute left-1/2 top-[calc(100%+0.75rem)] z-50 w-52 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-2xl">
                <Link href="/service-areas" className="block rounded-lg px-3 py-2 font-semibold text-brand-200 hover:bg-slate-800">All Service Areas</Link>
                {serviceAreas.map((area) => (
                  <Link key={area.slug} href={`/service-areas/${area.slug}`} className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                    {area.name}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </nav>
      </Container>
    </header>
  );
}
