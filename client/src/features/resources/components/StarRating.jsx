import { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

/** Accessible 1–5 star input. Uses radio semantics, not a hover-only widget. */
export default function StarRating({ value = null, average = 0, count = 0, onSubmit, pending = false, disabled = false }) {
  const [rating, setRating] = useState(value ?? 0);
  const [review, setReview] = useState('');
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Rate this resource</h2>
        <span className="text-xs text-muted">Average {average || '—'} / 5 · {count} rating(s)</span>
      </div>
      {disabled ? <p className="text-xs text-muted">You cannot rate your own submission.</p> : (
        <>
          <fieldset disabled={pending}>
            <legend className="sr-only">Your rating from 1 to 5 stars</legend>
            <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star} type="button" role="radio" aria-checked={rating === star}
                  aria-label={`${star} star${star === 1 ? '' : 's'}`}
                  onClick={() => setRating(star)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${rating >= star ? 'border-warning bg-warning/15 text-warning' : 'border-line text-muted hover:border-warning/40'}`}
                ><Star className="h-4 w-4" fill={rating >= star ? 'currentColor' : 'none'} aria-hidden="true" /></button>
              ))}
            </div>
          </fieldset>
          <Input label="Review (optional)" value={review} onChange={(event) => setReview(event.target.value)} maxLength={1000} placeholder="What was useful? What was missing?" />
          <Button size="sm" disabled={!rating || pending} loading={pending} onClick={() => onSubmit({ rating, review: review.trim() })}>Save rating</Button>
        </>
      )}
    </section>
  );
}
