import Image from 'next/image';

const images = ['gallery-1.svg', 'gallery-2.svg', 'gallery-3.svg', 'gallery-4.svg', 'gallery-5.svg', 'gallery-6.svg'];

export default function GalleryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {images.map((image) => (
        <Image
          key={image}
          src={`/placeholders/${image}`}
          alt="Exterior cleaning work sample"
          width={800}
          height={600}
          className="h-52 w-full rounded-xl border border-slate-700 object-cover"
        />
      ))}
    </div>
  );
}
