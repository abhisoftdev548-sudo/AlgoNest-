import { TriangleAlert } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { formatDate, warningLabel, warningTone } from '../lib/planUtils.js';

export default function OverloadAlert({ warnings = [], todayMinutes = 0, capacity = 0, onReschedule, missedCount = 0, rescheduling = false }) {
  const overload = warnings.filter((warning) => ['DAILY_OVERLOAD', 'SINGLE_TASK_TOO_LONG', 'OVERFLOW_PAST_END', 'RESCHEDULE_OVERLOAD', 'TASK_UNSCHEDULED', 'NO_WORKING_DAYS'].includes(warning.code));
  const todayOver = capacity > 0 && todayMinutes > capacity;
  if (!overload.length && !todayOver && !missedCount) return null;
  return (
    <Alert variant={todayOver || overload.some((warning) => warningTone(warning.code) === 'danger') ? 'warning' : 'info'} title="Workload check">
      <div className="space-y-2">
        {todayOver ? <p className="flex items-center gap-1.5"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Today has {todayMinutes} min of work against a {capacity} min budget ({Math.round((todayMinutes / capacity) * 100)}%).</p> : null}
        {missedCount > 0 ? <p className="flex flex-wrap items-center gap-2">{missedCount} task(s) are marked missed. <button type="button" onClick={onReschedule} disabled={rescheduling} className="rounded-lg bg-primary/12 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-50">{rescheduling ? 'Rescheduling…' : 'Reschedule missed tasks'}</button></p> : null}
        <ul className="space-y-1.5">
          {overload.slice(0, 4).map((warning, index) => (
            <li key={`${warning.code}-${warning.date ?? index}`} className="flex flex-wrap items-start gap-2 text-xs">
              <Badge variant={warningTone(warning.code) === 'danger' ? 'danger' : 'warning'}>{warningLabel(warning.code)}</Badge>
              <span>{warning.date ? `${formatDate(warning.date)} — ` : ''}{warning.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}
