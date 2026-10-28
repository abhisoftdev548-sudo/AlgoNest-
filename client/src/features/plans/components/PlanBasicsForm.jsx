import Input from '../../../components/ui/Input.jsx';
import GoalPicker from './GoalPicker.jsx';
import RestDayPicker from './RestDayPicker.jsx';
import { addDays, diffDays, estimatedDays } from '../lib/planUtils.js';

/** Step 1 — goal, window, daily budget, rest days and cadence. */
export default function PlanBasicsForm({ value, onChange, errors = {} }) {
  const set = (key, input) => onChange({ ...value, [key]: input });
  const days = estimatedDays(value);
  return (
    <div className="space-y-5">
      <GoalPicker value={value.goal} onChange={(goal) => set('goal', goal)} error={errors.goal} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Plan title" required value={value.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Interview in 60 days" maxLength={120} />
        <Input label="Daily time budget (minutes)" type="number" min={15} max={720} required value={value.dailyMinutes} onChange={(event) => set('dailyMinutes', Number(event.target.value))} error={errors.dailyMinutes} hint="The scheduler will not exceed this without warning." />
        <Input label="Start date" type="date" required value={value.startDate} onChange={(event) => set('startDate', event.target.value)} error={errors.startDate} />
        <Input label="Target date" type="date" required value={value.endDate} onChange={(event) => set('endDate', event.target.value)} error={errors.endDate} />
        <Input label="Mock cadence (days)" type="number" min={7} max={60} value={value.mockIntervalDays} onChange={(event) => set('mockIntervalDays', Number(event.target.value))} hint="A full-length mock is inserted every N days." />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: '30 days', days: 30 }, { label: '60 days', days: 60 }, { label: '90 days', days: 90 },
        ].map((preset) => (
          <button key={preset.days} type="button" onClick={() => set('endDate', addDays(value.startDate, preset.days - 1))} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:border-primary/40 hover:text-primary">
            {preset.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted">{days > 0 ? `${days} calendar days` : 'Invalid window'}</span>
      </div>
      {diffDays(value.startDate, value.endDate) < 0 ? <p className="text-xs text-danger">The target date must be on or after the start date.</p> : null}

      <RestDayPicker value={value.restDays} onChange={(restDays) => set('restDays', restDays)} error={errors.restDays} />

      <div className="grid gap-2 sm:grid-cols-2">
        <label htmlFor="plan-revisions" className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span><span className="block text-sm font-medium text-ink">Spaced revision (1 / 7 / 21 days)</span><span className="mt-0.5 block text-xs text-muted">Auto-insert short revision blocks after every lesson.</span></span>
          <input id="plan-revisions" type="checkbox" checked={value.revisionEnabled} onChange={(event) => set('revisionEnabled', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        </label>
        <label htmlFor="plan-replace" className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span><span className="block text-sm font-medium text-ink">Replace my active plan</span><span className="mt-0.5 block text-xs text-muted">Archives the current plan and keeps its task history.</span></span>
          <input id="plan-replace" type="checkbox" checked={value.replaceActive} onChange={(event) => set('replaceActive', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        </label>
      </div>

      <Input label="Notes (optional)" value={value.notes} onChange={(event) => set('notes', event.target.value)} maxLength={500} placeholder="Focus on DP and graphs…" />
    </div>
  );
}
