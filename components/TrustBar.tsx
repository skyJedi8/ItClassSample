import Link from 'next/link';
import Section from './Section';

const items = [
  'Veteran-Owned & Operated',
  'Fully Insured — $2M Aggregate General Liability',
  'Fast Response & Scheduling',
  'Professional Cleanup Standards'
];

export default function TrustBar() {
  return (
    <Section>
      <div className="glass-card grid gap-4 p-6 md:grid-cols-5 md:p-8">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-white/10 bg-slate-900/30 p-4 text-sm font-medium text-slate-100">
            {item}
          </div>
        ))}
        <Link
          href="/reviews"
          className="rounded-xl border border-sky-300/40 bg-sky-400/10 p-4 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20"
        >
          Thumbtack Social Proof → Read Reviews
        </Link>
      </div>
    </Section>
  );
}
