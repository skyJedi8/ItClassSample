import Image from 'next/image';

type GalleryVariant = 'placeholder' | 'pressure';

type GalleryImage = {
  src: string;
  alt: string;
};

const placeholderImages: GalleryImage[] = [
  'gallery-1.svg',
  'gallery-2.svg',
  'gallery-3.svg',
  'gallery-4.svg',
  'gallery-5.svg',
  'gallery-6.svg'
].map((image) => ({
  src: `/placeholders/${image}`,
  alt: 'Exterior cleaning work sample placeholder'
}));

const pressureImages: GalleryImage[] = [
  { src: '/images/projects/pwr1%20-%20Copy.png', alt: 'Operation Clean Freedom pressure washing project' },
  { src: '/images/projects/pwr2.png', alt: 'Operation Clean Freedom concrete cleaning result' },
  { src: '/images/projects/pwr3.png', alt: 'Operation Clean Freedom exterior surface cleaning project' },
  { src: '/images/projects/pwr4.png', alt: 'Operation Clean Freedom pressure washing work sample' },
  { src: '/images/projects/pwr5%20-%20Copy.png', alt: 'Operation Clean Freedom completed power washing project' }
];

export default function GalleryGrid({ variant = 'placeholder' }: { variant?: GalleryVariant }) {
  const images = variant === 'pressure' ? pressureImages : placeholderImages;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {images.map((image) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={1200}
          height={900}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-56 w-full rounded-xl border border-slate-700 object-cover"
        />
      ))}
    </div>
  );
}
