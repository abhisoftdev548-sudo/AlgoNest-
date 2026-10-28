import { Check } from 'lucide-react';
import { GOALS } from '../lib/planUtils.js';

/** Radio group with real inputs (keyboard + screen-reader friendly). */
export default function GoalPicker({ value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? 'plan-goal-error' : undefined}>
      <legend className="mb-2 text-sm font-medium text-ink">What are you preparing for?</legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((goal) => (
          <label
            key={goal.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${value === goal.value ? 'border-primary bg-primary/10' : 'border-line bg-surface hover:border-primary/40'}`}
          >
            <input
              type="radio" name="plan-goal" value={goal.value} checked={value === goal.value}
              onChange={() => onChange(goal.value)} className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">{goal.label}{value === goal.value ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{goal.description}</span>
            </span>
          </label>
        ))}
      </div>
      {error ? <p id="plan-goal-error" role="alert" className="mt-2 text-xs text-danger">{error}</p> : null}
    </fieldset>
  );
}
