import { WEEKDAY_OPTIONS } from '../lib/planUtils.js';

/** Toggle weekday rest days. At least one working day must remain. */
export default function RestDayPicker({ value = [], onChange, error }) {
  const toggle = (day) => {
    if (value.includes(day)) onChange(value.filter((item) => item !== day));
    else if (value.length < 6) onChange([...value, day].sort((a, b) => a - b));
  };
  return (
    <fieldset aria-describedby={error ? 'rest-day-error' : undefined}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <legend className="text-sm font-medium text-ink">Rest days</legend>
        <span className="text-xs text-muted">{value.length ? WEEKDAY_OPTIONS.filter((day) => value.includes(day.value)).map((day) => day.label).join(', ') : 'No days off'}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {WEEKDAY_OPTIONS.map((day) => {
          const active = value.includes(day.value);
          return (
            <button
              key={day.value} type="button" onClick={() => toggle(day.value)}
              aria-pressed={active} aria-label={`${day.long} rest day`}
              disabled={!active && value.length >= 6}
              className={`min-w-12 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'border-accent bg-accent/15 text-accent' : 'border-line bg-surface text-muted hover:border-primary/40'}`}
            >{day.label}</button>
          );
        })}
      </div>
      <p className="mt-1.5 text-xs text-muted">Rest days never receive tasks and do not break your streak.</p>
      {error ? <p id="rest-day-error" role="alert" className="mt-1 text-xs text-danger">{error}</p> : null}
    </fieldset>
  );
}
