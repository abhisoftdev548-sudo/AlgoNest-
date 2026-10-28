import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarRange, CheckCircle2, Flame } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { STATUS_TONE, formatDate, formatMinutes, planStatusLabel } from '../lib/planUtils.js';

export default function PlanCard({ plan }) {
  const completion = plan.stats?.completionPercentage ?? 0;
  return (
    <Link to={`/app/plans/${plan.id}`} className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:border-primary">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">{plan.title}</h3>
        <Badge variant={STATUS_TONE[plan.status] ?? 'neutral'}>{planStatusLabel(plan.status)}</Badge>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted"><CalendarRange className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(plan.startDate)} → {formatDate(plan.endDate)}</p>
      <div className="mt-auto space-y-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-muted">Completion</span><span className="font-semibold text-ink">{completion}%</span></div>
          <ProgressBar value={completion} label={`${plan.title}: ${completion}%`} tone={completion >= 70 ? 'success' : 'primary'} />
        </div>
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <div className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Done</dt><dd>{plan.stats?.doneTasks ?? 0}/{plan.stats?.totalTasks ?? 0}</dd></div>
          <div className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Daily budget</dt><dd>{formatMinutes(plan.dailyMinutes)}/day</dd></div>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-primary">Open <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </dl>
      </div>
    </Link>
  );
}
