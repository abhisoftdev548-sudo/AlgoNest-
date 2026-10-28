import { BookOpen, ListChecks, Timer } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { formatMinutes, planCapacityLabel } from '../lib/planUtils.js';

function Group({ title, Icon, items, selected, onToggle, minuteKey = 'minutes' }) {
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-primary" aria-hidden="true" /> {title} <Badge variant="primary">{selected.length} selected</Badge></h3>
      {!items.length ? <p className="rounded-xl border border-dashed border-line p-3 text-xs text-muted">No published {title.toLowerCase()} available yet.</p> : null}
      <div className="ag-scrollbar max-h-64 space-y-1.5 overflow-y-auto">
        {items.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-primary/40">
            <input type="checkbox" checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                <span>{formatMinutes(item[minuteKey] ?? item.estimatedMinutes ?? 0)}</span>
                <span>·</span><span>{item.difficulty}</span>
                {item.problemCount ? <><span>·</span><span>{item.problemCount} problems</span></> : null}
                {(item.topics ?? []).slice(0, 2).map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}
              </span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

/** Step 2 — select published sheets / quizzes / mocks, with a capacity hint. */
export default function PlanContentPicker({ value, onChange, content, isLoading, isError, error, errors = {} }) {
  const toggle = (field, id) => {
    const current = value[field];
    onChange({ ...value, [field]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  };
  const capacity = planCapacityLabel(value, content);
  const over = capacity.minutesPerDay > value.dailyMinutes;

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>;
  if (isError) return <Alert variant="error">{(error && error.message) || 'Could not load published content.'}</Alert>;

  return (
    <div className="space-y-5">
      {errors.sheetIds ? <Alert variant="error">{errors.sheetIds}</Alert> : null}
      {errors._ ? <Alert variant="error">{errors._}</Alert> : null}
      <div className={`rounded-xl border p-4 ${over ? 'border-warning/40 bg-warning/8' : 'border-primary/25 bg-primary/8'}`}>
        <p className="text-sm font-semibold text-ink">Estimated workload: {formatMinutes(capacity.minutes)}</p>
        <p className="mt-1 text-xs text-muted">Spread across ~{capacity.workingDays} working days ≈ {formatMinutes(capacity.minutesPerDay)} per day (budget {formatMinutes(value.dailyMinutes)}). Revisions and mocks are added on top.</p>
        {over ? <p className="mt-2 text-xs font-semibold text-warning">Heads-up: this exceeds your daily budget. The plan will flag overloaded days and may overrun your target date.</p> : null}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Group title="Sheets" Icon={BookOpen} items={content?.sheets ?? []} selected={value.sheetIds} onToggle={(id) => toggle('sheetIds', id)} minuteKey="estimatedMinutes" />
        <Group title="Quizzes" Icon={ListChecks} items={content?.quizzes ?? []} selected={value.quizIds} onToggle={(id) => toggle('quizIds', id)} />
        <Group title="Mocks" Icon={Timer} items={content?.mocks ?? []} selected={value.mockIds} onToggle={(id) => toggle('mockIds', id)} />
      </div>
      <p className="text-xs text-muted">Sheets expand into their published problems. If you select no mock, the scheduler auto-fills from the published catalogue so the 14-day cadence is preserved.</p>
    </div>
  );
}
