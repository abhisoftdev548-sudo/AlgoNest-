import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Layers3, ListChecks, Pencil, Play, Target, Trophy } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useMock, useMockAttempts, useMockVersions, useStartMockAttempt } from '../hooks/useMocks.js';
import {
  ATTEMPT_TONE, DIFFICULTY_TONE, STATUS_TONE, attemptStatusLabel,
  difficultyLabel, errorMessage, formatDateTime, formatMinutes, mockStatusLabel,
} from '../lib/mockUtils.js';

const PAGE_SIZE = 5;

export default function MockDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMock(id);
  const attemptParams = useMemo(() => ({ page: 1, limit: PAGE_SIZE }), []);
  const { data: attemptsData } = useMockAttempts(id, attemptParams);
  const { data: versionsData } = useMockVersions(id);
  const start = useStartMockAttempt(id);

  const mock = data?.mock;
  const summary = data?.mySummary;

  if (isLoading) return <FullPageLoader label="Loading mock test…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this mock">{errorMessage(error)}</Alert>;
  if (!mock) return <FullPageLoader label="Loading mock test…" />;

  const settings = mock.settings ?? {};
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/mocks" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All mocks</Link>
        {data?.canManage ? <Link to={`/app/mocks/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit mock</Button></Link> : null}
      </div>

      <header className="ag-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={DIFFICULTY_TONE[mock.difficulty] ?? 'neutral'}>{difficultyLabel(mock.difficulty)}</Badge>
          <Badge variant={STATUS_TONE[mock.status] ?? 'neutral'}>{mockStatusLabel(mock.status)}</Badge>
          {mock.isPublishedSnapshot ? <Badge variant="accent">Version {mock.viewedVersion}</Badge> : null}
          <Badge variant="primary">{settings.timerMode === 'global' ? 'Global timer' : 'Sectional timer'}</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{mock.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{mock.description || 'A full-length timed mock with sectional cut-offs and detailed result analysis.'}</p>
        <p className="mt-3 text-xs text-muted">by {mock.author?.name ?? 'AlgoNest creator'} · {mock.sectionCount} sections · {mock.questionCount} questions</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ag-card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-ink">Sections &amp; marking</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="border-b border-line text-xs uppercase tracking-wider text-muted"><th scope="col" className="py-2 pr-3 font-semibold">Section</th><th scope="col" className="py-2 pr-3 font-semibold">Q</th><th scope="col" className="py-2 pr-3 font-semibold">Time</th><th scope="col" className="py-2 pr-3 font-semibold">Correct</th><th scope="col" className="py-2 pr-3 font-semibold">Wrong</th><th scope="col" className="py-2 font-semibold">Cut-off</th></tr></thead>
              <tbody>
                {(mock.sections ?? []).map((section, index) => (
                  <tr key={section.id} className="border-b border-line/60 last:border-0">
                    <th scope="row" className="py-2.5 pr-3 font-medium text-ink">{index + 1}. {section.title}</th>
                    <td className="py-2.5 pr-3 text-muted">{section.questionCount}</td>
                    <td className="py-2.5 pr-3 text-muted">{formatMinutes(section.durationMinutes)}</td>
                    <td className="py-2.5 pr-3 text-success">+{section.correctMarks}</td>
                    <td className="py-2.5 pr-3 text-danger">−{section.negativeMarks}</td>
                    <td className="py-2.5 text-muted">{section.cutoffPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: ListChecks, label: 'Total questions', value: mock.questionCount },
              { Icon: Target, label: 'Maximum score', value: `${mock.maxScore} pts` },
              { Icon: Clock3, label: 'Total duration', value: formatMinutes(mock.totalDurationMinutes) },
              { Icon: Trophy, label: 'Overall pass mark', value: `${settings.passPercentage}%` },
              { Icon: Layers3, label: 'Attempts allowed', value: settings.maxAttempts },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3"><Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><div><dt className="text-xs text-muted">{label}</dt><dd className="text-sm font-semibold text-ink">{value}</dd></div></div>
            ))}
          </dl>
          <ul className="mt-4 space-y-1.5 text-sm text-muted" aria-label="Mock rules">
            <li>• The server owns the clock — it auto-submits when time is up, even if the tab is closed.</li>
            <li>• Answers autosave; a reconnect restores your palette, marks and remaining time.</li>
            <li>• Unattempted questions score 0; wrong answers lose {Math.max(...(mock.sections ?? []).map((section) => section.negativeMarks), 0)} marks in the strictest section.</li>
            <li>• {settings.showExplanations ? 'Explanations and correct answers appear after you submit.' : 'This mock hides explanations after submission.'}</li>
          </ul>
          {start.isError ? <Alert variant="error" className="mt-4">{errorMessage(start.error)}</Alert> : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {summary?.activeAttemptId ? <Button className="gap-2" onClick={() => navigate(`/app/mocks/${id}/attempts/${summary.activeAttemptId}`)}><Play className="h-4 w-4" aria-hidden="true" /> Resume attempt</Button>
              : <Button className="gap-2" loading={start.isPending} disabled={!summary?.canStart} onClick={() => start.mutate(undefined, { onSuccess: (result) => navigate(`/app/mocks/${id}/attempts/${result.attempt.id}`) })}><Play className="h-4 w-4" aria-hidden="true" /> Start mock</Button>}
          </div>
          {!summary?.canStart && !summary?.activeAttemptId ? <p className="mt-2 text-xs text-muted">{mock.publishedVersion ? 'You have used all your attempts or this mock is not available.' : 'This mock is not published yet.'}</p> : null}
        </section>

        <aside className="space-y-4">
          <section className="ag-card p-5">
            <h2 className="text-sm font-semibold text-ink">Your progress</h2>
            <p className="mt-3 text-3xl font-bold tabular-nums text-ink">{summary?.bestPercentage ?? 0}%</p>
            <p className="text-xs text-muted">Best score</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p className="flex justify-between gap-2 text-muted"><span>Attempts used</span><strong className="text-ink">{summary?.attemptsUsed ?? 0}/{settings.maxAttempts}</strong></p>
              <p className="flex justify-between gap-2 text-muted"><span>Attempts left</span><strong className="text-ink">{summary?.attemptsLeft ?? 0}</strong></p>
            </div>
          </section>
          <section className="ag-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Recent attempts</h2>
            {(attemptsData?.items ?? []).length ? <ul className="space-y-2">{attemptsData.items.map((attempt) => (
              <li key={attempt.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
                <div className="flex items-center justify-between gap-2"><Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge><span className="text-sm font-bold text-ink">{attempt.percentage}%</span></div>
                <p className="mt-1.5 text-[11px] text-muted">{formatDateTime(attempt.submittedAt)} · v{attempt.mockVersion}</p>
                {attempt.status !== 'in_progress' ? <Link to={`/app/mocks/${id}/results/${attempt.id}`} className="mt-1.5 inline-block text-xs font-semibold text-primary hover:underline">View analysis</Link> : null}
              </li>
            ))}</ul> : <p className="text-sm text-muted">No attempts yet. Your analysis will appear here.</p>}
          </section>
          {data?.canManage && versionsData?.items?.length ? <section className="ag-card p-5"><h2 className="mb-3 text-sm font-semibold text-ink">Published versions</h2><ul className="space-y-1.5 text-xs text-muted">{versionsData.items.map((version) => <li key={version.id} className="flex justify-between gap-2"><span>Version {version.version}</span><span>{version.questionCount} questions</span></li>)}</ul></section> : null}
        </aside>
      </div>
    </div>
  );
}
