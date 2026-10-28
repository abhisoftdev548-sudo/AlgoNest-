import { Link } from 'react-router-dom';
import { Clock3, FileCheck2, Layers3, Play, Target, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import {
  DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, formatDate, formatMinutes, mockStatusLabel,
} from '../lib/mockUtils.js';

export default function MockCard({ mock, showStatus = false }) {
  return (
    <Link to={`/app/mocks/${mock.id}`} className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:border-primary">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Badge variant={DIFFICULTY_TONE[mock.difficulty] ?? 'neutral'}>{difficultyLabel(mock.difficulty)}</Badge>
        {showStatus ? <Badge variant={STATUS_TONE[mock.status] ?? 'neutral'}>{mockStatusLabel(mock.status)}</Badge> : null}
      </div>
      <div className="min-h-0 flex-1">
        <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">{mock.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{mock.description || 'A full-length timed mock with sectional cut-offs and detailed analysis.'}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(mock.sections ?? []).slice(0, 3).map((section) => (
          <span key={section.id} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{section.title}</span>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-3 text-xs text-muted sm:grid-cols-4">
        <div className="flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Sections</dt><dd>{mock.sectionCount}</dd></div>
        <div className="flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Questions</dt><dd>{mock.questionCount}</dd></div>
        <div className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Duration</dt><dd>{formatMinutes(mock.totalDurationMinutes)}</dd></div>
        <div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Max score</dt><dd>{mock.maxScore} pts</dd></div>
      </dl>
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden="true" /> {mock.attemptCount ?? 0} · {formatDate(mock.publishedAt ?? mock.createdAt)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary"><Play className="h-3.5 w-3.5" aria-hidden="true" /> Open</span>
      </div>
    </Link>
  );
}
