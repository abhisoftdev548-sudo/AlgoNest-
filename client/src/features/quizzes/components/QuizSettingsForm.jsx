import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { VISIBILITY_OPTIONS } from '../lib/quizUtils.js';

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
      />
    </label>
  );
}

/** Controlled settings editor. Values are merged on the server on PATCH. */
export default function QuizSettingsForm({ value, onChange, errors = {}, disabled = false }) {
  const set = (key, input) => onChange({ ...value, [key]: input });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Timer (minutes)" type="number" min={1} max={180} required
          value={value.timerMinutes} error={errors.timerMinutes} disabled={disabled}
          onChange={(event) => set('timerMinutes', Number(event.target.value))}
        />
        <Input
          label="Passing score (%)" type="number" min={0} max={100} required
          value={value.passPercentage} error={errors.passPercentage} disabled={disabled}
          onChange={(event) => set('passPercentage', Number(event.target.value))}
        />
        <Input
          label="Max attempts" type="number" min={1} max={20} required
          value={value.maxAttempts} error={errors.maxAttempts} disabled={disabled}
          onChange={(event) => set('maxAttempts', Number(event.target.value))}
        />
        <Select
          label="Visibility" options={VISIBILITY_OPTIONS} value={value.visibility}
          error={errors.visibility} disabled={disabled}
          onChange={(event) => set('visibility', event.target.value)}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle id="quiz-shuffle-questions" label="Shuffle question order" hint="Stable per attempt, so autosave never reorders." checked={value.shuffleQuestions} onChange={(checked) => set('shuffleQuestions', checked)} />
        <Toggle id="quiz-shuffle-options" label="Shuffle options" hint="Applies to choice, ordering and matching columns." checked={value.shuffleOptions} onChange={(checked) => set('shuffleOptions', checked)} />
        <Toggle id="quiz-show-explanations" label="Show explanations after submit" hint="Disable for exam-style quizzes." checked={value.showExplanations} onChange={(checked) => set('showExplanations', checked)} />
        <Toggle id="quiz-retry-incorrect" label="Allow retry-incorrect-only" hint="Learners can retry just the questions they got wrong." checked={value.allowRetryIncorrect} onChange={(checked) => set('allowRetryIncorrect', checked)} />
      </div>
    </div>
  );
}
