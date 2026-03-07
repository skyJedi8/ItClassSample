import Link from 'next/link';
import { services } from '@/lib/services';

export default function ServiceCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="glass-card group p-6 transition hover:-translate-y-1 hover:border-sky-300/50"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-200">Veteran-Owned Service</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{service.name}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {service.includes.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-sky-200">Learn more →</p>
        </Link>
      ))}
      <Link href="/services#bundles" className="glass-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-200">Efficiency Bundle</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Exterior Cleaning Bundles</h3>
        <p className="mt-3 text-sm text-slate-300">Bundle services to save time, reduce repeat visits, and keep your property in top condition.</p>
      </Link>
    </div>
  );
}
