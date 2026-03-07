import Link from 'next/link';
import Section from './Section';

const items = [
  'Veteran-owned & operated with disciplined service standards',
  'Fully insured – $2M aggregate general liability',
  'Fast response, clear scheduling, no-guesswork communication',
  'Professional process + complete cleanup after every job'
];

export default function TrustBar() {
  return (
    <Section>
      <div className="premium-panel p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Trust & Proof</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Veteran-Owned Reliability Is Our #1 Standard.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {items.map((item) => (
            <div key={item} className="glass-card p-4 text-sm leading-relaxed text-slate-200">
              {item}
            </div>
          ))}
          <Link href="/reviews" className="glass-card bg-brand-500/10 p-4 text-sm font-semibold text-brand-100">
            59+ Thumbtack reviews • Read Reviews
          </Link>
        </div>
      </div>
    </Section>
  );
}
