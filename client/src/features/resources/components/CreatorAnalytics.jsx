import { Activity, Bookmark, CheckCircle2, Eye, PlayCircle, TrendingUp } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { EVENT_LABELS, errorMessage, formatNumber, sparklinePoints } from '../lib/resourceUtils.js';

const CARDS = [
  { key: 'views', label: 'Views', Icon: Eye, tone: 'text-primary' },
  { key: 'saves', label: 'Saves', Icon: Bookmark, tone: 'text-accent' },
  { key: 'starts', label: 'Starts', Icon: PlayCircle, tone: 'text-warning' },
  { key: 'completions', label: 'Completions', Icon: CheckCircle2, tone: 'text-success' },
];

export default function CreatorAnalytics({ data, isLoading, isError, error, days = 30, onDaysChange }) {
  if (isLoading) return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24 w-full" />)}</div>;
  if (isError) return <Alert variant="error">{errorMessage(error) || 'Could not load analytics.'}</Alert>;
  if (!data) return <EmptyState compact icon={Activity} title="No analytics yet" description="Publish a resource and views, saves, starts and completions will appear here." />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink"><TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" /> Creator analytics</h2>
        <div className="flex gap-1">{[7, 14, 30].map((value) => (
          <button key={value} type="button" onClick={() => onDaysChange?.(value)} aria-pressed={days === value} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${days === value ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2'}`}>{value}d</button>
        ))}</div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ key, label, Icon, tone }) => (
          <div key={key} className="ag-card p-4">
            <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" /> {label}</dt>
            <dd className="mt-1.5 text-2xl font-bold text-ink">{formatNumber(data.totals?.[key])}</dd>
            <dd className="text-[11px] text-muted">{formatNumber(data.window?.[key.replace(/s$/, '')] ?? 0)} in the last {days} days</dd>
          </div>
        ))}
      </dl>

      <section className="ag-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">Daily views ({days} days)</h3>
        <svg viewBox="0 0 240 48" preserveAspectRatio="none" className="h-16 w-full" role="img" aria-label={`Daily views over the last ${days} days`}>
          <polyline points={sparklinePoints(data.series, 'view')} fill="none" stroke="var(--ag-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <polyline points={sparklinePoints(data.series, 'completion')} fill="none" stroke="var(--ag-accent, #a78bfa)" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="mt-1 text-[11px] text-muted">Solid = views · dashed = completions. {EVENT_LABELS.view} are deduplicated per learner per day.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="ag-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Conversion funnel</h3>
          <ul className="space-y-3">
            {[
              { label: 'Save rate', value: data.conversion?.saveRate, hint: 'saves ÷ views' },
              { label: 'Start rate', value: data.conversion?.startRate, hint: 'starts ÷ views' },
              { label: 'Completion rate', value: data.conversion?.completionRate, hint: 'completions ÷ starts' },
            ].map((row) => (
              <li key={row.label}>
                <div className="mb-1 flex items-center justify-between text-xs"><span className="text-ink">{row.label} <span className="text-muted">({row.hint})</span></span><strong className="text-ink">{row.value ?? 0}%</strong></div>
                <ProgressBar value={row.value ?? 0} label={`${row.label}: ${row.value ?? 0}%`} tone={(row.value ?? 0) >= 30 ? 'success' : 'primary'} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{data.totals?.publishedResources ?? 0} published resources · average rating {data.totals?.ratingAverage || '—'} from {data.totals?.ratingCount ?? 0} ratings.</p>
        </section>
        <section className="ag-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Top resources</h3>
          {!data.topResources?.length ? <EmptyState compact icon={Activity} title="No activity yet" description="Share your resources to start collecting events." /> : (
            <ol className="space-y-2">{data.topResources.slice(0, 6).map((row, index) => (
              <li key={row.resource} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface-2/40 p-2.5 text-xs">
                <span className="min-w-0 truncate text-ink">{index + 1}. {row.title}</span>
                <span className="shrink-0 text-muted">{formatNumber(row.view)} views · {formatNumber(row.completion)} done</span>
              </li>
            ))}</ol>
          )}
        </section>
      </div>
    </div>
  );
}
