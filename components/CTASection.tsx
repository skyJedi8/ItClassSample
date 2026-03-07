import Link from 'next/link';
import Section from './Section';
import { CallButton, TextButton } from './CTAButtons';

export default function CTASection({ title = 'Ready for disciplined, reliable exterior cleaning?' }: { title?: string }) {
  return (
    <Section>
      <div className="glass-card border-sky-300/30 bg-gradient-to-r from-slate-900/70 to-blue-950/40 p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-sky-300">Veteran-Owned. Fast Follow-Through.</p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <CallButton />
            <TextButton />
            <Link href="/contact" className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100">
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
