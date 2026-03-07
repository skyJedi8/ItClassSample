import { reviews } from '@/lib/reviews';

export default function ReviewCarousel({ limit = 6 }: { limit?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.slice(0, limit).map((review) => (
        <article key={review.name + review.date} className="glass-card p-5">
          <p className="text-sm leading-relaxed text-slate-200">“{review.quote}”</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-cyan-200">
            {review.name} • {review.service}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {review.date} • {review.source}
          </p>
        </article>
      ))}
    </div>
  );
}
