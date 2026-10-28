import { Link } from 'react-router-dom';
import { BookmarkCheck, RotateCcw } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { formatDate, formatMinutes, relativeDay } from '../../plans/lib/planUtils.js';

export default function PendingRevisions({ items = [], planId }) {
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><RotateCcw className="h-4 w-4 text-success" aria-hidden="true" /> Pending revisions</h2><Badge variant="success">1 / 7 / 21</Badge></div>
      {!items.length ? <EmptyState compact icon={BookmarkCheck} title="No revisions due" description="Spaced revision blocks appear 1, 7 and 21 days after each lesson." />
        : <ul className="mt-3 space-y-2">{items.slice(0, 5).map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/40 p-3">
            <div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{item.title}</p><p className="mt-0.5 text-[11px] text-muted">{relativeDay(item.date)} · {formatDate(item.date)} · {formatMinutes(item.estimatedMinutes)}</p></div>
            <Badge variant="accent">+{item.revisionInterval ?? 1}d</Badge>
          </li>
        ))}</ul>}
      {planId ? <Link to={`/app/plans/${planId}`} className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">Open plan →</Link> : null}
    </section>
  );
}
