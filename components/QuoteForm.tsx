'use client';

import { useEffect } from 'react';

const JOBBER_FORM_ID = '79f18a49-0ca1-4d8f-85db-fa0804c8f6ce-1774207';
const JOBBER_FORM_URL =
  'https://clienthub.getjobber.com/client_hubs/79f18a49-0ca1-4d8f-85db-fa0804c8f6ce/public/work_request/embedded_work_request_form?form_id=1774207';
const JOBBER_PUBLIC_URL =
  'https://clienthub.getjobber.com/hubs/79f18a49-0ca1-4d8f-85db-fa0804c8f6ce/public/requests/1774207/new';

export default function QuoteForm({ compact = false }: { compact?: boolean }) {
  useEffect(() => {
    const stylesheetId = 'jobber-request-form-styles';
    if (!document.getElementById(stylesheetId)) {
      const stylesheet = document.createElement('link');
      stylesheet.id = stylesheetId;
      stylesheet.rel = 'stylesheet';
      stylesheet.href =
        'https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css';
      stylesheet.media = 'screen';
      document.head.appendChild(stylesheet);
    }

    const script = document.createElement('script');
    script.src =
      'https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js';
    script.async = true;
    script.dataset.ocfJobberRequest = 'true';
    script.setAttribute('clienthub_id', JOBBER_FORM_ID);
    script.setAttribute('form_url', JOBBER_FORM_URL);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-700/70 bg-white ${
        compact ? 'p-2 sm:p-3' : 'p-3 sm:p-5'
      }`}
      aria-label="Request exterior cleaning service"
    >
      <div id={JOBBER_FORM_ID} />
      <noscript>
        <p className="p-4 text-slate-900">
          JavaScript is required for the request form.{' '}
          <a className="font-semibold text-blue-700 underline" href={JOBBER_PUBLIC_URL}>
            Open the secure Jobber request form
          </a>
          .
        </p>
      </noscript>
      <p className="px-3 pb-2 pt-3 text-center text-xs text-slate-600">
        Your request is securely recorded in Jobber. For urgent scheduling, call or text{' '}
        <a className="font-semibold underline" href="tel:+13463067622">
          (346) 306-7622
        </a>
        .
      </p>
    </section>
  );
}
