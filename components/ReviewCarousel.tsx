import { reviews } from '@/lib/reviews';

export default function ReviewCarousel({ limit = 6 }: { limit?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.slice(0, limit).map((review) => (
        <article key={review.name + review.date} className="glass-card lift-hover p-5">
          <p className="mb-4 text-sm uppercase tracking-[0.12em] text-sky-300">Verified Thumbtack Feedback</p>
          <p className="text-sm leading-relaxed text-slate-100">“{review.quote}”</p>
          <p className="mt-4 text-xs text-slate-300">
            {review.name} • {review.service} • {review.date}
          </p>
        </article>
      ))}
    </div>
  );
}
