import { Link } from 'react-router-dom';
import { BookOpen, Copy, Star } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import {
  DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, formatDate, statusLabel,
} from '../lib/sheetUtils.js';

/** Catalogue card — plain Tailwind for speed; hover is CSS only. */
export default function SheetCard({ sheet, showStatus = false }) {
  const average = Number(sheet.ratingSummary?.average ?? 0);
  return (
    <Link
      to={`/app/sheets/${sheet.id}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant={DIFFICULTY_TONE[sheet.difficulty]}>{difficultyLabel(sheet.difficulty)}</Badge>
        {showStatus ? <Badge variant={STATUS_TONE[sheet.status]}>{statusLabel(sheet.status)}</Badge> : null}
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-snug text-ink group-hover:text-primary">
        {sheet.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
        {sheet.description || 'A structured problem progression for focused DSA practice.'}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(sheet.topics ?? []).slice(0, 3).map((topic) => (
          <span key={topic} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{topic}</span>
        ))}
        {(sheet.topics ?? []).length > 3 ? (
          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">+{sheet.topics.length - 3}</span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {sheet.problemCount ?? 0} problems</span>
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning" aria-hidden="true" /> {average.toFixed(1)} ({sheet.ratingSummary?.count ?? 0})</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
        <span>by {sheet.author?.name ?? 'AlgoNest creator'}</span>
        <span className="inline-flex items-center gap-2">
          {sheet.cloneCount ? <span className="inline-flex items-center gap-1"><Copy className="h-3 w-3" aria-hidden="true" />{sheet.cloneCount}</span> : null}
          {formatDate(sheet.publishedAt || sheet.createdAt)}
        </span>
      </div>
    </Link>
  );
}
