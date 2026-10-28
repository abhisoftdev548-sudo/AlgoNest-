import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock3, Gauge, RotateCcw, Target, X } from 'lucide-react';
import { WRONG_REASON_LABELS } from '@algonest/shared';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import TopicPerformance from '../../quizzes/components/TopicPerformance.jsx';
import DifficultyBreakdown from './DifficultyBreakdown.jsx';
import WeakTopicPanel from './WeakTopicPanel.jsx';
import RecommendedResources from './RecommendedResources.jsx';
import ReasonTagger from './ReasonTagger.jsx';
import {
  ATTEMPT_TONE, attemptStatusLabel, formatDateTime, formatSeconds, signed,
} from '../lib/mockUtils.js';

function Section({ title, description, children, className = '' }) {
  return (
    <section className={`ag-card p-5 sm:p-6 ${className}`}>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description ? <p className="mb-4 mt-1 text-sm text-muted">{description}</p> : <div className="mb-4" />}
      {children}
    </section>
  );
}

export default function MockResult({ attempt, questions = [], onRetry, canRetry = false, onReasons, reasonsPending = false, pending = false, mockId }) {
  const results = attempt.results ?? [];
  const byId = new Map(questions.map((question) => [question.id, question]));
  const passPercentage = attempt.settings?.passPercentage ?? 60;
  const showExplanations = attempt.settings?.showExplanations !== false && results.some((result) => 'expected' in result);

  return (
    <div className="space-y-6">
      <Link to={`/app/mocks/${mockId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to mock
      </Link>

      <section className="ag-card overflow-hidden">
        <div className={`border-b border-line px-5 py-6 sm:px-8 ${attempt.passed ? 'bg-success/8' : 'bg-warning/8'}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Result · {attempt.title}</p>
              <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{attempt.passed ? 'You cleared the mock!' : 'Not there yet — here is the plan'}</h1>
              <p className="mt-1 text-sm text-muted">{attemptStatusLabel(attempt.status)} · {formatDateTime(attempt.submittedAt)} · version {attempt.mockVersion}</p>
            </div>
            <Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge>
          </div>
        </div>
        <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <p className="text-5xl font-bold tabular-nums text-ink">{signed(attempt.score)}<span className="text-2xl text-muted">/{attempt.maxScore}</span></p>
            <p className="mt-1 text-sm text-muted">{attempt.percentage}% · pass mark {passPercentage}%</p>
            <ProgressBar className="mt-4" value={Math.max(0, attempt.percentage)} tone={attempt.passed ? 'success' : 'warning'} label={`Score ${attempt.percentage}%`} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><Gauge className="h-3.5 w-3.5" aria-hidden="true" /> Accuracy</dt><dd className="mt-1 text-lg font-bold text-ink">{attempt.accuracy}%</dd></div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Correct</dt><dd className="mt-1 text-lg font-bold text-ink">{attempt.correctCount}</dd></div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><X className="h-3.5 w-3.5" aria-hidden="true" /> Wrong / skipped</dt><dd className="mt-1 text-lg font-bold text-ink">{attempt.incorrectCount} / {attempt.unattemptedCount}</dd></div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Time</dt><dd className="mt-1 text-lg font-bold text-ink">{formatSeconds(attempt.durationSeconds)}</dd></div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
          {canRetry ? <Button className="gap-1.5" loading={pending} onClick={onRetry}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake mock</Button> : null}
        </div>
      </section>

      <Section title="Sectional cut-offs" description="Every section must clear its own cut-off to pass the mock.">
        <ul className="space-y-3">
          {(attempt.sections ?? []).map((section) => (
            <li key={section.sectionId} className="rounded-xl border border-line bg-surface-2/40 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-ink">{section.title} <Badge variant={section.passed ? 'success' : 'danger'}>{section.passed ? 'Cleared' : 'Missed'}</Badge></span>
                <span className="text-xs text-muted">{section.correct}✓ / {section.incorrect}✗ / {section.unattempted}– · <strong className="text-ink">{signed(section.score)}/{section.maxScore}</strong> · {section.percentage}% (need {section.cutoffPercentage}%)</span>
              </div>
              <ProgressBar value={Math.max(0, section.percentage)} label={`${section.title}: ${section.percentage}%`} tone={section.passed ? 'success' : 'warning'} />
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Difficulty-wise score" description="Where your marks actually came from."><DifficultyBreakdown stats={attempt.difficultyStats} /></Section>
        <Section title="Topic-wise performance" description="Weakest topics first."><TopicPerformance stats={attempt.topicStats} /></Section>
      </div>

      <Section title="Time per question" description="Slowest questions first. Times are credited from server-observed focus windows.">
        <div className="grid gap-4 sm:grid-cols-2">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted">Total tracked</dt><dd className="font-semibold text-ink">{formatSeconds(attempt.timeStats?.totalSeconds)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Average per question</dt><dd className="font-semibold text-ink">{formatSeconds(attempt.timeStats?.averageSeconds)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Untracked questions</dt><dd className="font-semibold text-ink">{attempt.timeStats?.untracked ?? 0}</dd></div>
          </dl>
          <ul className="space-y-1.5 text-xs">
            {(attempt.timeStats?.slowest ?? []).map((entry, index) => (
              <li key={entry.questionId} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
                <span className="truncate text-ink">{index + 1}. {byId.get(entry.questionId)?.prompt ?? entry.topic}</span>
                <span className="shrink-0 font-semibold text-warning">{formatSeconds(entry.seconds)}</span>
              </li>
            ))}
            {!(attempt.timeStats?.slowest ?? []).length ? <li className="text-muted">No focus data recorded.</li> : null}
          </ul>
        </div>
      </Section>

      <Section title="Weak topic diagnosis" description="Ranked by marks lost and the reasons you tag below."><WeakTopicPanel topics={attempt.weakTopics} /></Section>

      <Section title="Why did you get them wrong?" description="Tagging concept gaps sharpens the diagnosis and the resources we recommend.">
        <ReasonTagger results={results} onChange={onReasons} pending={reasonsPending} />
      </Section>

      {attempt.reasonSummary?.length ? (
        <div className="flex flex-wrap gap-2">
          {attempt.reasonSummary.map((entry) => <Badge key={entry.reason} variant="accent">{entry.label}: {entry.count}</Badge>)}
        </div>
      ) : null}

      <Section title="Recommended next resources" description="Drawn from published sheets and your own saved library — never placeholder links."><RecommendedResources items={attempt.recommendations} /></Section>

      <Section title="Answer review" description={showExplanations ? 'Correct answers and explanations for every question.' : 'This mock hides explanations after submission.'}>
        <ol className="space-y-2">
          {results.map((result, index) => (
            <li key={result.questionId} className="rounded-xl border border-line bg-surface-2/30 p-3">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Badge variant={result.correct ? 'success' : result.attempted ? 'danger' : 'neutral'}>{result.correct ? 'Correct' : result.attempted ? 'Wrong' : 'Skipped'}</Badge>
                <span className="text-xs text-muted">Q{index + 1} · {result.topic} · {result.difficulty} · {signed(result.awarded)} pt · {formatSeconds(result.timeSeconds)}</span>
                {result.reason ? <Badge variant="accent">{WRONG_REASON_LABELS[result.reason] ?? result.reason}</Badge> : null}
              </div>
              <p className="text-sm text-ink">{byId.get(result.questionId)?.prompt ?? `Question ${index + 1}`}</p>
              {showExplanations ? (
                <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                  <div className="rounded-lg border border-line bg-surface p-2"><span className="font-semibold text-muted">Your answer: </span><span className="text-ink">{result.response === null || result.response === undefined ? 'Not answered' : Array.isArray(result.response) ? result.response.join(', ') : typeof result.response === 'object' ? JSON.stringify(result.response) : String(result.response)}</span></div>
                  <div className="rounded-lg border border-success/25 bg-success/5 p-2"><span className="font-semibold text-muted">Correct: </span><span className="text-ink">{result.expected || '—'}</span></div>
                </div>
              ) : null}
              {showExplanations && result.explanation ? <p className="mt-2 text-xs text-muted">{result.explanation}</p> : null}
            </li>
          ))}
        </ol>
      </Section>

      <p className="flex items-center gap-1.5 text-center text-xs text-muted"><Target className="h-3.5 w-3.5" aria-hidden="true" /> Scores use the marking scheme frozen in version {attempt.mockVersion}; negative marks are included.</p>
    </div>
  );
}
