import Section from '@/components/Section';
import { getMetadata } from '@/lib/seo';

export const metadata = getMetadata('Privacy Policy | Operation Clean Freedom','Privacy information for quote requests and customer communication.', '/privacy');

export default function Page() {
  return (
    <main>
      <Section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">Privacy</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Privacy Policy</h1>
        <div className="premium-panel mt-7 max-w-3xl space-y-5 p-6 text-slate-300 sm:p-8">
          <p>Operation Clean Freedom collects the contact and property details you choose to submit so we can respond to quote requests, scheduling questions, and service needs.</p>
          <p>We do not sell your personal information. Submitted details may be retained for customer service, scheduling, invoicing, and business recordkeeping.</p>
          <p>For privacy questions or requests, email <a className="font-semibold text-brand-200" href="mailto:info@operationcleanfreedom.com">info@operationcleanfreedom.com</a>.</p>
        </div>
      </Section>
    </main>
  );
}
