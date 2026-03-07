import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { CallButton, TextButton } from './CTAButtons';

const nav = [['Home', '/'], ['Services', '/services'], ['Service Areas', '/service-areas'], ['Commercial/HOA', '/commercial-hoa'], ['About', '/about'], ['Gallery', '/gallery'], ['Reviews', '/reviews'], ['Contact', '/contact']];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <Link href="/" className="font-bold text-cyan-100">Operation Clean Freedom</Link>
            <p className="text-xs text-slate-400">Veteran-owned exterior cleaning</p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm font-medium text-slate-200">{siteConfig.phoneDisplay}</span>
            <CallButton />
            <TextButton />
          </div>
        </div>
        <nav className="flex flex-wrap gap-4 pb-3 text-sm text-slate-300">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-cyan-200">
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
