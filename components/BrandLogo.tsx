import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  full?: boolean;
  className?: string;
};

export default function BrandLogo({ full = false, className = '' }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Operation Clean Freedom home"
    >
      <Image
        src="/ocf-logo.png.png"
        alt="Operation Clean Freedom logo"
        width={900}
        height={360}
        priority
        className={
          full
            ? 'h-auto w-[280px] max-w-full object-contain sm:w-[360px]'
            : 'h-auto w-[210px] max-w-full object-contain sm:w-[280px]'
        }
      />
    </Link>
  );
}
