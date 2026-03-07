import Image from 'next/image';
import Link from 'next/link';
import { CallButton, TextButton } from './CTAButtons';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <Image
        src="/placeholders/hero.svg"
        alt="Exterior cleaning hero placeholder"
        fill
        priority
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70" />
      <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="max-w-4xl animate-[fadeIn_700ms_ease-out]">
          <p className="mb-4 inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
            Veteran-Owned & Operated in Greater Houston
          </p>
          <h1 className="font-[var(--font-orbitron)] text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Veteran-Owned Exterior Cleaning for Houston Properties That Need It Done Right
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-200">
            Precision, professionalism, and visible results for gutters, windows, pressure washing, roof soft wash,
            and drainage clean-outs across Greater Houston.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CallButton />
            <TextButton />
            <Link
              href="/contact"
              className="rounded-lg border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
