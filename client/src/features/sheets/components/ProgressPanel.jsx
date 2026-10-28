import { useEffect, useState } from 'react';
import { Bookmark, Check, Clock3 } from 'lucide-react';
import Select from '../../../components/ui/Select.jsx';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_OPTIONS, errorMessage } from '../lib/sheetUtils.js';
import { useUpdateProgress } from '../hooks/useSheets.js';

const BLANK = { status: 'not_started', notes: '', bookmark: false, confidence: '', timeSpent: 0, revisionDate: '' };

function fromProgress(progress) {
  if (!progress) return BLANK;
  return {
    status: progress.status ?? 'not_started',
    notes: progress.notes ?? '',
    bookmark: Boolean(progress.bookmark),
    confidence: progress.confidence ?? '',
    timeSpent: progress.timeSpent ?? 0,
    revisionDate: progress.revisionDate ? new Date(progress.revisionDate).toISOString().slice(0, 10) : '',
  };
}

/** Right pane: per-user progress + notes. Writes ONLY to UserProgress. */
export default function ProgressPanel({ sheetId, problem, progress }) {
  const [form, setForm] = useState(BLANK);
  const [saved, setSaved] = useState(false);
  const update = useUpdateProgress(sheetId);

  useEffect(() => { setForm(fromProgress(progress)); setSaved(false); }, [problem?.id, progress]);

  if (!problem) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-6 text-center text-sm text-muted">
        Your notes, status and bookmark for the selected problem appear here.
      </div>
    );
  }

  const set = (key, value) => { setForm((previous) => ({ ...previous, [key]: value })); setSaved(false); };

  const save = (event) => {
    event.preventDefault();
    update.mutate({
      problemId: problem.id,
      body: {
        status: form.status,
        notes: form.notes,
        bookmark: form.bookmark,
        confidence: form.confidence ? Number(form.confidence) : null,
        timeSpent: Number(form.timeSpent) || 0,
        revisionDate: form.revisionDate ? new Date(`${form.revisionDate}T00:00:00Z`).toISOString() : null,
      },
    }, { onSuccess: () => setSaved(true) });
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">My progress</h3>
        <button
          type="button"
          onClick={() => set('bookmark', !form.bookmark)}
          aria-pressed={form.bookmark}
          aria-label={form.bookmark ? 'Remove bookmark' : 'Bookmark this problem'}
          className={`rounded-lg p-1.5 transition-colors ${form.bookmark ? 'bg-primary/15 text-primary' : 'text-muted hover:text-primary'}`}
        >
          <Bookmark className={`h-4 w-4 ${form.bookmark ? 'fill-primary' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {update.isError ? <Alert variant="error">{errorMessage(update.error)}</Alert> : null}
      {saved ? <Alert variant="success">Progress saved.</Alert> : null}

      <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={(e) => set('status', e.target.value)} />

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Confidence</p>
        <div className="flex gap-1.5" role="group" aria-label="Confidence level 1 to 5">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => set('confidence', String(form.confidence) === String(level) ? '' : level)}
              aria-pressed={String(form.confidence) === String(level)}
              className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition-colors ${String(form.confidence) === String(level) ? 'border-primary bg-primary/15 text-primary' : 'border-line text-muted hover:border-primary/40'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Time (min)"
          type="number"
          min={0}
          icon={Clock3}
          value={form.timeSpent}
          onChange={(e) => set('timeSpent', e.target.value)}
        />
        <Input
          label="Revise on"
          type="date"
          value={form.revisionDate}
          onChange={(e) => set('revisionDate', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="progress-notes" className="mb-1.5 block text-sm font-medium text-ink">My notes</label>
        <textarea
          id="progress-notes"
          rows={5}
          maxLength={5000}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Edge cases, pattern, what to revise…"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <p className="mt-1 text-right text-[11px] text-muted">{form.notes.length}/5000</p>
      </div>

      <Button type="submit" className="w-full gap-1.5" loading={update.isPending}>
        <Check className="h-4 w-4" aria-hidden="true" /> Save progress
      </Button>
    </form>
  );
}
