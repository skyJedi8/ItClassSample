import Link from 'next/link';
import Section from './Section';
const items=['Veteran-owned & operated','Fully insured – $2M aggregate general liability','Fast response & scheduling','Professional process & cleanup'];
export default function TrustBar(){return <Section className="bg-slate-50"><div className="grid gap-4 md:grid-cols-5 text-sm font-medium">{items.map(i=><div key={i} className="rounded bg-white p-4 shadow-sm">{i}</div>)}<Link href="/reviews" className="rounded bg-brand-50 p-4 text-brand-700">59+ Thumbtack reviews • Read Reviews</Link></div></Section>}
