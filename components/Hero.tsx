import Image from 'next/image';
import Link from 'next/link';
import { CallButton, TextButton } from './CTAButtons';

const proofImages = [
  { src: '/images/projects/pwr1%20-%20Copy.png', alt: 'Freshly cleaned Houston driveway and walkways by Operation Clean Freedom' },
  { src: '/images/projects/pwr2.png', alt: 'Operation Clean Freedom technician surface cleaning a driveway' },
  { src: '/images/projects/pwr4.png', alt: 'Operation Clean Freedom pressure washing result' }
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="hero-glow -left-10 top-12 h-44 w-44 bg-brand-200/20" />
      <div className="hero-glow right-0 top-0 h-56 w-56 bg-blue-500/20" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-8">
        <div className="relative">
          <p className="inline-flex items-center rounded-full border border-brand-200/40 bg-brand-200/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Veteran-Owned • Fully Insured • Greater Houston
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Veteran-Owned Exterior Cleaning. Visible Results. No Guesswork.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Professional gutter, window, roof, pressure-washing, and drainage service for homes and managed properties across Greater Houston.
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
          <div className="mt-7 grid max-w-2xl gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="glass-card p-3"><span className="font-semibold text-white">$2M insured</span><br />General liability coverage</div>
            <div className="glass-card p-3"><span className="font-semibold text-white">Fast response</span><br />Call or text for scheduling</div>
            <div className="glass-card p-3"><span className="font-semibold text-white">Clean finish</span><br />Professional site cleanup</div>
          </div>
        </div>

        <div className="premium-panel relative p-5 sm:p-6">
          <div className="absolute -inset-1 -z-10 rounded-[1.75rem] bg-gradient-to-br from-brand-200/20 via-transparent to-blue-500/20 blur-2xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">Real Houston-Area Work</p>
          <p className="mt-2 text-sm text-slate-300">Actual project photos—no stock gallery and no invented results.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {proofImages.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={1200}
                height={900}
                sizes="(max-width: 640px) 100vw, 50vw"
                className={`w-full rounded-xl border border-slate-700 object-cover ${index === 0 ? 'h-56 sm:col-span-2' : 'h-40'}`}
                priority={index === 0}
              />
            ))}
          </div>
          <div className="mt-5 glass-card p-4 text-sm text-slate-200">
            <p className="font-semibold text-brand-200">The OCF Standard</p>
            <p className="mt-1 text-slate-300">Clear scope, careful property protection, professional cleanup, and reliable follow-through.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
