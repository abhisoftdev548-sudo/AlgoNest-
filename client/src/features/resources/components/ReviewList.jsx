import { Star } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { formatDate } from '../lib/resourceUtils.js';

export default function ReviewList({ data, isLoading, isError, error }) {
  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>;
  if (isError) return <p className="text-sm text-danger">{error?.message ?? 'Could not load reviews.'}</p>;
  const items = data?.items ?? [];
  if (!items.length) return <EmptyState compact icon={Star} title="No written reviews yet" description="Be the first to rate this resource." />;
  return (
    <ul className="space-y-2">
      {items.map((review) => (
        <li key={review.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{review.user?.name ?? 'Student'}</span>
            <span className="inline-flex items-center gap-1 text-xs text-warning">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-3 w-3" fill={star <= review.rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</span>
          </div>
          {review.review ? <p className="mt-1.5 text-sm text-muted">{review.review}</p> : null}
          <p className="mt-1 text-[11px] text-muted">{formatDate(review.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
}
