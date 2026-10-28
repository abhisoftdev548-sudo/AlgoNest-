import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Clock3, Layers, ListChecks, Pencil, Play, RotateCcw, Target, Trophy,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useMyAttempts, useQuiz, useQuizVersions, useStartAttempt } from '../hooks/useQuizzes.js';
import {
  ATTEMPT_TONE, DIFFICULTY_TONE, STATUS_TONE, attemptStatusLabel, difficultyLabel,
  errorMessage, formatDateTime, quizStatusLabel,
} from '../lib/quizUtils.js';

const PAGE_SIZE = 5;

/** Start screen: metadata, rules, attempt history and the primary CTA. */
export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuiz(id);
  const canManage = data?.canManage;
  const attemptsParams = useMemo(() => ({ page: 1, limit: PAGE_SIZE }), []);
  const { data: attemptsData } = useMyAttempts(id, attemptsParams);
  const { data: versionsData } = useQuizVersions(id);
  const start = useStartAttempt(id);

  const quiz = data?.quiz;
  const summary = data?.mySummary;

  const begin = (payload = {}) => {
    start.mutate(payload, {
      onSuccess: (result) => navigate(`/app/quizzes/${id}/attempts/${result.attempt.id}`),
    });
  };

  if (isLoading) return <FullPageLoader label="Loading quiz…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this quiz">{errorMessage(error)}</Alert>;
  if (!quiz) return <FullPageLoader label="Loading quiz…" />;

  const settings = quiz.settings ?? {};
  const lastCompleted = (attemptsData?.items ?? []).find((attempt) => attempt.status !== 'in_progress' && attempt.status !== 'abandoned');

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/quizzes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All quizzes
        </Link>
        {canManage ? <Link to={`/app/quizzes/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit quiz</Button></Link> : null}
      </div>

      <header className="ag-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={DIFFICULTY_TONE[quiz.difficulty] ?? 'neutral'}>{difficultyLabel(quiz.difficulty)}</Badge>
          <Badge variant={STATUS_TONE[quiz.status] ?? 'neutral'}>{quizStatusLabel(quiz.status)}</Badge>
          {quiz.isPublishedSnapshot ? <Badge variant="accent">Version {quiz.viewedVersion}</Badge> : null}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{quiz.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{quiz.description || 'A timed DSA quiz with seven question types and detailed explanations.'}</p>
        <p className="mt-3 text-xs text-muted">by {quiz.author?.name ?? 'AlgoNest creator'} · {quiz.topics?.length ? quiz.topics.slice(0, 5).join(' · ') : 'General'}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ag-card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-ink">Before you start</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: ListChecks, label: 'Questions', value: quiz.questionCount },
              { Icon: Target, label: 'Maximum score', value: `${quiz.maxScore || quiz.questionCount} pts` },
              { Icon: Clock3, label: 'Time limit', value: `${settings.timerMinutes} minutes` },
              { Icon: Trophy, label: 'Passing score', value: `${settings.passPercentage}%` },
              { Icon: Layers, label: 'Attempts allowed', value: settings.maxAttempts },
              { Icon: RotateCcw, label: 'Retry incorrect only', value: settings.allowRetryIncorrect ? 'Allowed' : 'Disabled' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div><dt className="text-xs text-muted">{label}</dt><dd className="text-sm font-semibold text-ink">{value}</dd></div>
              </div>
            ))}
          </dl>
          <ul className="mt-4 space-y-1.5 text-sm text-muted" aria-label="Quiz rules">
            <li>• Answers autosave as you go; a page reload restores your progress.</li>
            <li>• The timer is enforced on the server — it auto-submits when time is up.</li>
            <li>• {settings.showExplanations ? 'Explanations and correct answers appear after you submit.' : 'This quiz hides explanations after submission.'}</li>
            <li>• You can flag questions for review and jump between them with the palette.</li>
          </ul>

          {start.isError ? <Alert variant="error" className="mt-4">{errorMessage(start.error)}</Alert> : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {summary?.activeAttemptId ? (
              <Button className="gap-2" onClick={() => navigate(`/app/quizzes/${id}/attempts/${summary.activeAttemptId}`)}>
                <Play className="h-4 w-4" aria-hidden="true" /> Resume attempt
              </Button>
            ) : (
              <Button className="gap-2" loading={start.isPending} disabled={!summary?.canStart} onClick={() => begin()}>
                <Play className="h-4 w-4" aria-hidden="true" /> Start quiz
              </Button>
            )}
            {lastCompleted && summary?.attemptsLeft > 0 && settings.allowRetryIncorrect ? (
              <Button variant="secondary" className="gap-2" loading={start.isPending} onClick={() => begin({ mode: 'incorrect', sourceAttemptId: lastCompleted.id })}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry incorrect only
              </Button>
            ) : null}
          </div>
          {!summary?.canStart && !summary?.activeAttemptId ? (
            <p className="mt-2 text-xs text-muted">
              {quiz.publishedVersion ? 'You have used all your attempts or this quiz is not available.' : 'This quiz is not published yet.'}
            </p>
          ) : null}
        </section>

        <aside className="space-y-4">
          <section className="ag-card p-5">
            <h2 className="text-sm font-semibold text-ink">Your progress</h2>
            <p className="mt-3 text-3xl font-bold tabular-nums text-ink">{summary?.bestPercentage ?? 0}%</p>
            <p className="text-xs text-muted">Best score{summary?.bestPassed ? ' · passed' : ''}</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p className="flex justify-between gap-2 text-muted"><span>Attempts used</span><strong className="text-ink">{summary?.attemptsUsed ?? 0}/{settings.maxAttempts}</strong></p>
              <p className="flex justify-between gap-2 text-muted"><span>Attempts left</span><strong className="text-ink">{summary?.attemptsLeft ?? 0}</strong></p>
            </div>
          </section>

          <section className="ag-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Recent attempts</h2>
            {(attemptsData?.items ?? []).length ? (
              <ul className="space-y-2">
                {attemptsData.items.map((attempt) => (
                  <li key={attempt.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge>
                      <span className="text-sm font-bold text-ink">{attempt.percentage}%</span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted">{formatDateTime(attempt.submittedAt)} · v{attempt.quizVersion}{attempt.mode === 'incorrect' ? ' · retry' : ''}</p>
                    {attempt.status !== 'in_progress' ? (
                      <Link to={`/app/quizzes/${id}/results/${attempt.id}`} className="mt-1.5 inline-block text-xs font-semibold text-primary hover:underline">View result</Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">No attempts yet. Your results will appear here.</p>}
          </section>

          {canManage && versionsData?.items?.length ? (
            <section className="ag-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">Published versions</h2>
              <ul className="space-y-1.5 text-xs text-muted">
                {versionsData.items.map((version) => (
                  <li key={version.id} className="flex justify-between gap-2"><span>Version {version.version}</span><span>{version.questionCount} questions</span></li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
