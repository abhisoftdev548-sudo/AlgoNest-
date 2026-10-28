import { CheckCircle2, Clock3, Flame, ListTodo, TriangleAlert } from 'lucide-react';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { formatMinutes } from '../lib/planUtils.js';

export default function PlanProgress({ progress = {}, streak = {}, plan }) {
  const cells = [
    { Icon: ListTodo, label: 'Total tasks', value: progress.total ?? 0, tone: 'text-primary' },
    { Icon: CheckCircle2, label: 'Completed', value: progress.done ?? 0, tone: 'text-success' },
    { Icon: TriangleAlert, label: 'Missed', value: progress.missed ?? 0, tone: 'text-danger' },
    { Icon: Clock3, label: 'Time planned', value: formatMinutes(progress.minutesTotal), tone: 'text-accent' },
    { Icon: Flame, label: 'Current streak', value: `${streak.current ?? 0}d`, tone: 'text-warning' },
  ];
  return (
    <section className="ag-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-ink">Plan completion</h2>
        <span className="text-2xl font-bold tabular-nums text-ink">{progress.completionPercentage ?? 0}%</span>
      </div>
      <ProgressBar className="mt-3" value={progress.completionPercentage ?? 0} label={`Plan ${progress.completionPercentage ?? 0}% complete`} tone={(progress.completionPercentage ?? 0) >= 70 ? 'success' : 'primary'} />
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cells.map(({ Icon, label, value, tone }) => (
          <div key={label} className="rounded-xl border border-line bg-surface-2/40 p-3">
            <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" /> {label}</dt>
            <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      {plan ? <p className="mt-3 text-xs text-muted">{formatMinutes(plan.dailyMinutes)}/day · {plan.restDays.length} rest day(s) · best streak {streak.longest ?? 0} days</p> : null}
    </section>
  );
}
