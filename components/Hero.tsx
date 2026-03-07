import Image from 'next/image';
import Link from 'next/link';
import { CallButton, TextButton } from './CTAButtons';

const proofImages = ['gallery-1.svg', 'gallery-4.svg', 'gallery-6.svg'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="hero-glow -left-10 top-12 h-44 w-44 bg-brand-200/20" />
      <div className="hero-glow right-0 top-0 h-56 w-56 bg-blue-500/20" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="relative">
          <p className="inline-flex items-center rounded-full border border-brand-200/40 bg-brand-200/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Veteran-Owned • Houston Exterior Cleaning
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Premium Exterior Cleaning Built on Veteran-Owned Discipline.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Operation Clean Freedom delivers roof soft wash, gutter cleaning, windows, pressure washing, and drainage clean-outs with military-grade reliability and white-glove communication.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CallButton />
            <TextButton />
            <Link
              href="/contact"
              className="rounded-md border border-slate-300/40 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-brand-100"
            >
              Request a Quote
            </Link>
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-brand-100/90">
            Trusted by homeowners, veterans, and property managers across Greater Houston.
          </p>
        </div>

        <div className="premium-panel relative p-6">
          <div className="absolute -inset-1 -z-10 rounded-[1.75rem] bg-gradient-to-br from-brand-200/20 via-transparent to-blue-500/20 blur-2xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">Proof of Quality</p>
          <p className="mt-2 text-sm text-slate-300">Current project samples from local exterior cleaning jobs.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {proofImages.map((img, index) => (
              <Image
                key={img}
                src={`/placeholders/${img}`}
                alt="Operation Clean Freedom work sample"
                width={800}
                height={600}
                className={`h-40 w-full rounded-xl border border-slate-700 object-cover ${index === 0 ? 'sm:col-span-2 h-48' : ''}`}
              />
            ))}
          </div>
          <div className="mt-5 glass-card p-4 text-sm text-slate-200">
            <p className="font-semibold text-brand-200">Veteran-Owned Promise</p>
            <p className="mt-1 text-slate-300">On-time arrival, clear scope confirmation, and a spotless finish before we leave.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
