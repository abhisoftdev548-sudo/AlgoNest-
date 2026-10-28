import { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { errorMessage, formatDate } from '../lib/sheetUtils.js';
import { useRateSheet, useRatings } from '../hooks/useSheets.js';

function Stars({ value, onChange, disabled = !onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          disabled={disabled}
          onClick={() => onChange?.(star)}
          className="rounded p-0.5 transition-transform hover:scale-110 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Star className={`h-5 w-5 ${star <= value ? 'fill-warning text-warning' : 'text-muted'}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

/** Rating + written reviews, paginated by the API. */
export default function RatingSection({ sheetId }) {
  const { data, isLoading, isError, error } = useRatings(sheetId, { page: 1, limit: 5 });
  const { rate, unrate } = useRateSheet(sheetId);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const own = data?.ownRating;
  const activeRating = rating || own?.rating || 0;
  const activeReview = review || own?.review || '';

  const save = () => {
    if (!activeRating) return;
    rate.mutate({ rating: activeRating, review: activeReview }, {
      onSuccess: () => { setRating(0); setReview(''); },
    });
  };

  return (
    <section className="space-y-4" aria-label="Ratings and reviews">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Rate this sheet</h3>
        <span className="text-xs text-muted">{data?.pagination?.total ?? 0} review(s)</span>
      </div>

      {rate.isError ? <Alert variant="error">{errorMessage(rate.error)}</Alert> : null}

      <div className="rounded-xl border border-line bg-surface-2/40 p-3">
        <Stars value={activeRating} onChange={(value) => setRating(value)} disabled={rate.isPending} />
        <textarea
          value={activeReview}
          onChange={(event) => setReview(event.target.value)}
          rows={2}
          maxLength={1000}
          placeholder="Share what worked (or didn't)…"
          aria-label="Your review"
          className="mt-3 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <div className="mt-2 flex justify-end gap-2">
          {own ? (
            <Button size="sm" variant="ghost" loading={unrate.isPending} onClick={() => unrate.mutate()}>
              Remove rating
            </Button>
          ) : null}
          <Button size="sm" loading={rate.isPending} disabled={!activeRating} onClick={save}>Save</Button>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-14 w-full" /> : null}
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}

      <ul className="space-y-2">
        {(data?.items ?? []).map((item) => (
          <li key={item.id} className="rounded-xl border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ink">{item.user?.name ?? 'Student'}</span>
              <span className="text-[11px] text-muted">{formatDate(item.createdAt)}</span>
            </div>
            <div className="mt-1"><Stars value={item.rating} /></div>
            {item.review ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.review}</p> : null}
          </li>
        ))}
        {data?.items?.length === 0 ? <li className="text-sm text-muted">No written reviews yet.</li> : null}
      </ul>
    </section>
  );
}
