import { Link } from 'react-router-dom';
import { Clock, ListChecks, Play, Target, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, formatDate, quizStatusLabel } from '../lib/quizUtils.js';

/** Data-heavy card: plain Tailwind, no animation dependency. */
export default function QuizCard({ quiz, showStatus = false }) {
  const settings = quiz.settings ?? {};
  return (
    <Link
      to={`/app/quizzes/${quiz.id}`}
      className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:border-primary"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Badge variant={DIFFICULTY_TONE[quiz.difficulty] ?? 'neutral'}>{difficultyLabel(quiz.difficulty)}</Badge>
        {showStatus ? <Badge variant={STATUS_TONE[quiz.status] ?? 'neutral'}>{quizStatusLabel(quiz.status)}</Badge> : null}
      </div>

      <div className="min-h-0 flex-1">
        <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">{quiz.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">
          {quiz.description || 'A timed DSA quiz with explanations and topic-wise analysis.'}
        </p>
      </div>

      {quiz.topics?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {quiz.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{topic}</span>
          ))}
        </div>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-3 text-xs text-muted sm:grid-cols-4">
        <div className="flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Questions</dt><dd>{quiz.questionCount ?? 0}</dd></div>
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Timer</dt><dd>{settings.timerMinutes ?? 20}m</dd></div>
        <div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Pass</dt><dd>{settings.passPercentage ?? 60}%</dd></div>
        <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Attempts</dt><dd>{quiz.attemptCount ?? 0}</dd></div>
      </dl>

      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span>by {quiz.author?.name ?? 'AlgoNest creator'} · {formatDate(quiz.publishedAt ?? quiz.createdAt)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          <Play className="h-3.5 w-3.5" aria-hidden="true" /> Open
        </span>
      </div>
    </Link>
  );
}
