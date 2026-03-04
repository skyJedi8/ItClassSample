import Section from './Section';
import FAQAccordion from './FAQAccordion';
import GalleryGrid from './GalleryGrid';
import CTASection from './CTASection';

const commonWhy=['Veteran-owned and operated','Fully insured – $2M aggregate general liability','Careful property protection and surface-safe methods','Clear communication and professional cleanup'];
const process=['Answer your questions and confirm scope','Schedule a convenient service window','Protect nearby landscaping and access points','Complete cleaning with the right method','Final walk-through and cleanup confirmation'];

export default function ServiceDetailPage({title,intro,includes,faqs,schema}:{title:string;intro:string;includes:string[];faqs:{q:string;a:string}[];schema:object}){
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><Section><h1 className="text-4xl font-bold">{title} in Houston & Surrounding Areas</h1><p className="mt-4 max-w-3xl">{intro}</p></Section><Section className="bg-slate-50"><h2 className="text-3xl font-bold">What’s Included</h2><ul className="mt-4 list-disc pl-5 space-y-2">{includes.map(i=><li key={i}>{i}</li>)}</ul></Section><Section><h2 className="text-3xl font-bold">Why OCF</h2><ul className="mt-4 list-disc pl-5 space-y-2">{commonWhy.map(i=><li key={i}>{i}</li>)}</ul></Section><Section className="bg-slate-50"><h2 className="text-3xl font-bold">Our Process</h2><ol className="mt-4 list-decimal pl-5 space-y-2">{process.map(i=><li key={i}>{i}</li>)}</ol></Section><Section><h2 className="text-3xl font-bold mb-5">FAQs</h2><FAQAccordion items={faqs}/></Section><Section className="bg-slate-50"><h2 className="text-3xl font-bold mb-5">Recent Work</h2><GalleryGrid/></Section><CTASection/></main>
}
