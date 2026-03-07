import Link from 'next/link';
import Section from './Section';
import { CallButton, TextButton } from './CTAButtons';

export default function CTASection({ title = 'Ready for a fast quote?' }: { title?: string }) {
  return (
    <Section>
      <div className="premium-panel p-8 sm:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Veteran-Owned • Fast Response</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <CallButton />
            <TextButton />
            <Link href="/contact" className="rounded-md border border-slate-300/40 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-cyan-100">
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
