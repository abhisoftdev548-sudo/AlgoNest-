import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { TIMER_MODE_OPTIONS, VISIBILITY_OPTIONS } from '../lib/mockUtils.js';

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
      <span><span className="block text-sm font-medium text-ink">{label}</span>{hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}</span>
      <input id={id} type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
    </label>
  );
}

export const DEFAULT_MOCK_SETTINGS = Object.freeze({
  timerMode: 'sectional', passPercentage: 60, maxAttempts: 3,
  shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
  showExplanations: true, allowPaletteBack: true,
});

export default function MockSettingsForm({ value, onChange, errors = {}, disabled = false }) {
  const set = (key, input) => onChange({ ...value, [key]: input });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Timer mode" options={TIMER_MODE_OPTIONS} value={value.timerMode} onChange={(event) => set('timerMode', event.target.value)} error={errors.timerMode} disabled={disabled} />
        <Select label="Visibility" options={VISIBILITY_OPTIONS} value={value.visibility} onChange={(event) => set('visibility', event.target.value)} disabled={disabled} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Overall passing score (%)" type="number" min={0} max={100} value={value.passPercentage} error={errors.passPercentage} disabled={disabled} onChange={(event) => set('passPercentage', Number(event.target.value))} />
        <Input label="Max attempts" type="number" min={1} max={20} value={value.maxAttempts} error={errors.maxAttempts} disabled={disabled} onChange={(event) => set('maxAttempts', Number(event.target.value))} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle id="mock-shuffle-questions" label="Shuffle questions" hint="Seeded per attempt, stable on reload." checked={value.shuffleQuestions} onChange={(checked) => set('shuffleQuestions', checked)} />
        <Toggle id="mock-shuffle-options" label="Shuffle options" hint="Also shuffles ordering and matching columns." checked={value.shuffleOptions} onChange={(checked) => set('shuffleOptions', checked)} />
        <Toggle id="mock-explanations" label="Show explanations after submit" hint="Turn off for exam-style mocks." checked={value.showExplanations} onChange={(checked) => set('showExplanations', checked)} />
        <Toggle id="mock-palette-back" label="Allow going back within a section" hint="Only applies to sectional timer mode." checked={value.allowPaletteBack} onChange={(checked) => set('allowPaletteBack', checked)} />
      </div>
    </div>
  );
}
