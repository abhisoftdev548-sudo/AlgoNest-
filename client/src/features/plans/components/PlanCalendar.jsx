import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import { WEEKDAY_OPTIONS, addDays, buildCalendarWeeks, dateKey, diffDays, formatDate } from '../lib/planUtils.js';

const monthLabel = (key) => {
  const date = new Date(`${key}T00:00:00.000Z`);
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

/** Month grid with per-day load bars. Pure presentation, no data fetching. */
export default function PlanCalendar({ plan, calendar = [], selected, onSelect }) {
  const [anchor, setAnchor] = useState(() => plan?.startDate ?? dateKey());
  const byDate = useMemo(() => Object.fromEntries(calendar.map((day) => [day.date, day])), [calendar]);
  const firstOfMonth = `${anchor.slice(0, 7)}-01`;
  const monthEnd = useMemo(() => {
    const date = new Date(`${firstOfMonth}T00:00:00.000Z`);
    date.setUTCMonth(date.getUTCMonth() + 1);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  }, [firstOfMonth]);
  const lastOfMonth = diffDays(firstOfMonth, monthEnd) >= 0 ? monthEnd : addDays(firstOfMonth, 30);
  const weeks = buildCalendarWeeks(firstOfMonth, lastOfMonth, byDate);
  const capacity = plan?.dailyMinutes ?? 60;
  const today = dateKey();
  const restDays = plan?.restDays ?? [];

  const shift = (months) => {
    const date = new Date(`${firstOfMonth}T00:00:00.000Z`);
    date.setUTCMonth(date.getUTCMonth() + months);
    setAnchor(date.toISOString().slice(0, 10));
  };

  return (
    <section className="ag-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{monthLabel(firstOfMonth)}</h2>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label="This month" onClick={() => setAnchor(today)}>·</Button>
          <Button size="icon" variant="ghost" aria-label="Next month" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
        {WEEKDAY_OPTIONS.map((day) => <span key={day.value} className="py-1">{day.label}</span>)}
      </div>
      <div className="mt-1 space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((cell) => {
              const day = cell.day;
              const isRest = restDays.includes(new Date(`${cell.key}T00:00:00.000Z`).getUTCDay());
              const isSelected = selected === cell.key;
              const ratio = day ? Math.min(100, Math.round((day.minutes / Math.max(1, capacity)) * 100)) : 0;
              return (
                <button
                  key={cell.key} type="button" onClick={() => onSelect(cell.key)}
                  aria-label={`${formatDate(cell.key)}${day ? `, ${day.total} tasks, ${day.done} done` : ', no tasks'}`}
                  aria-pressed={isSelected}
                  className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg border text-xs transition-colors ${isSelected ? 'border-primary bg-primary/10 text-ink' : 'border-transparent text-muted hover:border-line hover:bg-surface-2'} ${cell.key === today ? 'ring-1 ring-inset ring-primary/50' : ''} ${!cell.inRange ? 'opacity-45' : ''}`}
                >
                  <span className={cell.key === today ? 'font-bold text-primary' : ''}>{Number(cell.key.slice(-2))}</span>
                  {day ? <>
                    <span className="h-1 w-8 overflow-hidden rounded-full bg-line"><span className={`block h-full ${ratio > 100 ? 'bg-danger' : day.done === day.total ? 'bg-success' : 'bg-primary'}`} style={{ width: `${Math.max(8, ratio)}%` }} /></span>
                    <span className="text-[9px]">{day.done}/{day.total}</span>
                  </> : isRest ? <span className="text-[9px] text-accent">rest</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Bars show planned minutes against your {capacity} min budget. Green = every task done.</p>
    </section>
  );
}
