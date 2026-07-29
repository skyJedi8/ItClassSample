import Link from 'next/link';

type BrandLogoProps = {
  full?: boolean;
  className?: string;
};

export default function BrandLogo({ full = false, className = '' }: BrandLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Operation Clean Freedom home">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-400/40 bg-brand-500/10 font-bold tracking-[0.12em] text-brand-100 shadow-[0_0_28px_rgba(59,130,246,0.18)]">
        OCF
      </span>
      <span className="min-w-0">
        <span className="block font-semibold tracking-[0.08em] text-white">OPERATION CLEAN FREEDOM</span>
        <span className="block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-brand-200">
          {full ? 'Veteran-Owned Exterior Cleaning' : 'Veteran-Owned & Operated'}
        </span>
      </span>
    </Link>
  );
}
