import Link from 'next/link';
import { services } from '@/lib/services';

const labels = ['Exterior Maintenance Protocols', 'Precision Exterior Services', 'Property Protection Services'];

export default function ServiceCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((service, idx) => (
        <Link key={service.slug} href={`/services/${service.slug}`} className="glass-card lift-hover p-6">
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-sky-300">{labels[idx % labels.length]}</p>
          <h3 className="text-xl font-semibold text-white">{service.name}</h3>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {service.includes.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="mt-4 inline-block text-sm font-semibold text-sky-300">View Service Details →</span>
        </Link>
      ))}
      <Link href="/services#bundles" className="glass-card lift-hover p-6">
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-sky-300">Efficiency Bundle</p>
        <h3 className="text-xl font-semibold text-white">Gutters + Windows</h3>
        <p className="mt-3 text-sm text-slate-300">
          Keep exteriors sharp with one disciplined appointment flow and one communication channel.
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-sky-300">Ask About Bundles →</span>
      </Link>
    </div>
  );
}
