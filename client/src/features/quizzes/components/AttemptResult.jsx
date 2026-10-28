import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock3, RotateCcw, Target, X } from 'lucide-react';
import { QUESTION_TYPES as T } from '@algonest/shared';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import TopicPerformance from './TopicPerformance.jsx';
import { ATTEMPT_TONE, attemptStatusLabel, formatDateTime, formatDuration, typeLabel } from '../lib/quizUtils.js';

/** Convert a stored response into something a human can read on the result. */
function readableResponse(result, question) {
  const value = result.response;
  if (value === null || value === undefined || value === '') return 'Not answered';
  const label = (id) => question?.options?.find((option) => option.id === id)?.text
    ?? question?.items?.find((item) => item.id === id)?.text
    ?? question?.leftItems?.find((item) => item.id === id)?.text ?? id;
  switch (result.type) {
    case T.MCQ:
    case T.OUTPUT:
      return label(value);
    case T.MULTI:
      return Array.isArray(value) ? value.map(label).join(', ') || 'Not answered' : String(value);
    case T.TRUE_FALSE:
      return value === true || value === 'true' ? 'True' : 'False';
    case T.ORDERING:
      return Array.isArray(value) ? value.map(label).join(' → ') : 'Not answered';
    case T.MATCHING:
      return (question?.leftItems ?? [])
        .map((left) => {
          const rightId = value?.[left.id];
          const right = question?.rightItems?.find((item) => item.id === rightId);
          return `${left.text} → ${right?.text ?? '—'}`;
        }).join(', ') || 'Not answered';
    default:
      return Array.isArray(value) ? value.join(', ') : String(value);
  }
}

export default function AttemptResult({ attempt, questions = [], showExplanations = true, retryAllowed = false, onRetryIncorrect, onRetryFull, pending = false, quizId }) {
  const passPercentage = attempt.settings?.passPercentage ?? 60;
  const passed = attempt.passed;
  const byId = new Map(questions.map((question) => [question.id, question]));

  return (
    <div className="space-y-6">
      <Link to={`/app/quizzes/${quizId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to quiz
      </Link>

      <section className="ag-card overflow-hidden">
        <div className={`border-b border-line px-5 py-6 sm:px-8 ${passed ? 'bg-success/8' : 'bg-warning/8'}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Result · {attempt.title}</p>
              <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{passed ? 'You passed!' : 'Keep practising'}</h1>
              <p className="mt-1 text-sm text-muted">
                {attemptStatusLabel(attempt.status)} · {formatDateTime(attempt.submittedAt)} · version {attempt.quizVersion}
                {attempt.mode === 'incorrect' ? ' · retry-incorrect-only' : ''}
              </p>
            </div>
            <Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <p className="text-5xl font-bold tabular-nums text-ink">{attempt.percentage}<span className="text-2xl text-muted">%</span></p>
            <p className="mt-1 text-sm text-muted">Pass mark: {passPercentage}%</p>
            <ProgressBar className="mt-4" value={attempt.percentage} tone={passed ? 'success' : 'warning'} label={`Score ${attempt.percentage}%`} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Target className="h-3.5 w-3.5" aria-hidden="true" /> Score</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{attempt.score}/{attempt.maxScore}</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Correct</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{attempt.correctCount}/{attempt.results?.length ?? 0}</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><X className="h-3.5 w-3.5" aria-hidden="true" /> Attempted</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{attempt.attemptedCount}/{attempt.results?.length ?? 0}</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Time</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{formatDuration(attempt.durationSeconds)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
          {retryAllowed ? (
            <Button className="gap-1.5" loading={pending} onClick={onRetryIncorrect}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry incorrect only
            </Button>
          ) : null}
          {onRetryFull ? (
            <Button variant="secondary" className="gap-1.5" loading={pending} onClick={onRetryFull}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake full quiz
            </Button>
          ) : null}
        </div>
      </section>

      <section className="ag-card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-ink">Topic-wise performance</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Weakest topics are listed first — start your revision there.</p>
        <TopicPerformance stats={attempt.topicStats} />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-ink">Review your answers</h2>
        {(attempt.results ?? []).map((result, index) => {
          const question = byId.get(result.questionId);
          return (
            <article key={result.questionId} className="ag-card p-4 sm:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={result.correct ? 'success' : 'danger'}>{result.correct ? 'Correct' : result.attempted ? 'Incorrect' : 'Skipped'}</Badge>
                <Badge>{typeLabel(result.type)}</Badge>
                <span className="text-xs text-muted">Q{index + 1} · {result.topic} · {result.awarded}/{result.points} pt</span>
                {result.marked ? <Badge variant="warning">Marked</Badge> : null}
              </div>
              <h3 className="text-sm font-medium text-ink">{question?.prompt ?? `Question ${index + 1}`}</h3>
              {question?.code ? <pre className="ag-scrollbar mt-2 overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-xs text-ink">{question.code}</pre> : null}
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-surface-2/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your answer</p>
                  <p className="mt-1 text-ink">{readableResponse(result, question)}</p>
                </div>
                {showExplanations ? (
                  <div className="rounded-lg border border-success/25 bg-success/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Correct answer</p>
                    <p className="mt-1 text-ink">{result.expected || '—'}</p>
                  </div>
                ) : null}
              </div>
              {showExplanations && result.explanation ? (
                <p className="mt-3 rounded-lg border border-line bg-surface-2/30 p-3 text-sm text-muted"><strong className="text-ink">Explanation: </strong>{result.explanation}</p>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
