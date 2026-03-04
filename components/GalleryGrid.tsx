import Image from 'next/image';
const imgs=['gallery-1.svg','gallery-2.svg','gallery-3.svg','gallery-4.svg','gallery-5.svg','gallery-6.svg'];
export default function GalleryGrid(){return <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{imgs.map(i=><Image key={i} src={`/placeholders/${i}`} alt="Exterior cleaning work sample" width={800} height={600} className="h-52 w-full rounded object-cover" />)}</div>}
