import { ChevronDown, ChevronUp, Layers3, Trash2 } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

/** One section's timing + marking scheme. Purely controlled. */
export default function SectionEditor({ section, index, total, onChange, onMove, onRemove, onPickQuestions, disabled = false }) {
  const set = (key, value) => onChange({ ...section, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-xs font-bold text-primary">{index + 1}</span>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink"><Layers3 className="h-4 w-4 text-accent" aria-hidden="true" /> {section.title || 'Untitled section'}</h3>
          <span className="text-xs text-muted">{(section.questionIds ?? []).length} questions</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button size="icon" variant="ghost" onClick={() => onMove(index, -1)} disabled={index === 0 || disabled} aria-label={`Move section ${index + 1} up`}><ChevronUp className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => onMove(index, 1)} disabled={index === total - 1 || disabled} aria-label={`Move section ${index + 1} down`}><ChevronDown className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => onRemove(index)} disabled={total <= 1 || disabled} aria-label={`Remove section ${index + 1}`}><Trash2 className="h-4 w-4 text-danger" /></Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Section title" value={section.title} onChange={(event) => set('title', event.target.value)} disabled={disabled} maxLength={100} />
        <Input label="Duration (minutes)" type="number" min={1} max={180} value={section.durationMinutes} onChange={(event) => set('durationMinutes', Number(event.target.value))} disabled={disabled} />
        <Input label="Sectional cut-off (%)" type="number" min={0} max={100} value={section.cutoffPercentage} onChange={(event) => set('cutoffPercentage', Number(event.target.value))} disabled={disabled} hint="0 disables the cut-off." />
        <Input label="Marks for correct" type="number" min={0.1} max={10} step={0.5} value={section.correctMarks} onChange={(event) => set('correctMarks', Number(event.target.value))} disabled={disabled} />
        <Input label="Negative marks (deduction)" type="number" min={0} max={10} step={0.25} value={section.negativeMarks} onChange={(event) => set('negativeMarks', Number(event.target.value))} disabled={disabled} hint="Unattempted questions always score 0." />
        <Input label="Description (optional)" value={section.description} onChange={(event) => set('description', event.target.value)} disabled={disabled} maxLength={500} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <p className="text-xs text-muted">
          Max {((section.questionIds ?? []).length * section.correctMarks || 0).toFixed(1)} pts · wrong answer {section.negativeMarks > 0 ? `−${section.negativeMarks}` : 'no penalty'}
        </p>
        <Button size="sm" variant="secondary" onClick={() => onPickQuestions(index)} disabled={disabled}>Choose questions</Button>
      </div>
    </div>
  );
}
