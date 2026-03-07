import Link from 'next/link';
import Container from './Container';
import { siteConfig } from '@/lib/site';
import { CallButton, TextButton } from './CTAButtons';

const nav = [
  ['Home', '/'],
  ['Services', '/services'],
  ['Service Areas', '/service-areas'],
  ['Commercial/HOA', '/commercial-hoa'],
  ['About', '/about'],
  ['Gallery', '/gallery'],
  ['Reviews', '/reviews'],
  ['Contact', '/contact']
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/" className="font-[var(--font-orbitron)] text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
            Operation Clean Freedom
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm font-medium text-slate-300">{siteConfig.phoneDisplay}</span>
            <CallButton />
            <TextButton />
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 pb-3 text-sm text-slate-200">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-sky-300">
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
