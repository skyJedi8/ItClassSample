import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  full?: boolean;
  className?: string;
};

export default function BrandLogo({ full = false, className = '' }: BrandLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Operation Clean Freedom home">
      {full ? (
        <Image
          src="/logo-full.svg"
          alt="Operation Clean Freedom veteran-owned exterior cleaning logo"
          width={360}
          height={96}
          className="h-auto w-[260px] max-w-full sm:w-[320px]"
          priority
        />
      ) : (
        <Image
          src="/logo-full.svg"
          alt="Operation Clean Freedom veteran-owned exterior cleaning logo"
          width={300}
          height={80}
          className="h-auto w-[220px] max-w-full sm:w-[260px]"
          priority
        />
      )}
    </Link>
  );
}
