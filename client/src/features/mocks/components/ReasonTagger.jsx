import { useState } from 'react';
import { Tag } from 'lucide-react';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { REASON_OPTIONS } from '../lib/mockUtils.js';

const EMPTY = [{ value: '', label: 'Select a reason…' }, ...REASON_OPTIONS];

/** Post-result root-cause tagging for wrong answers, with per-tag save. */
export default function ReasonTagger({ results = [], onChange, pending = false }) {
  const [draft, setDraft] = useState({});
  const wrong = results.filter((result) => !result.correct);
  if (!wrong.length) return <p className="text-sm text-muted">No wrong answers to tag — great work.</p>;

  const set = (questionId, value) => setDraft((previous) => ({ ...previous, [questionId]: value || null }));
  const dirty = Object.entries(draft).filter(([id, value]) => value !== (wrong.find((result) => result.questionId === id)?.reason ?? null));
  const save = () => {
    if (!dirty.length) return;
    onChange(dirty.map(([questionId, reason]) => ({ questionId, reason })));
  };

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-sm text-muted"><Tag className="h-4 w-4" aria-hidden="true" /> Tag why you got each question wrong. Concept gaps drive your study recommendations.</p>
      <ul className="space-y-2">
        {wrong.map((result, index) => (
          <li key={result.questionId} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface-2/40 p-3">
            <Badge variant="danger">Q{results.indexOf(result) + 1}</Badge>
            <span className="min-w-0 flex-1 truncate text-xs text-ink">{result.topic} · {result.difficulty}</span>
            <span className="w-full sm:w-52">
              <Select
                label={`Reason for question ${index + 1}`}
                options={EMPTY}
                value={draft[result.questionId] ?? result.reason ?? ''}
                onChange={(event) => set(result.questionId, event.target.value)}
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">{dirty.length} unsaved change(s)</p>
        <Button size="sm" disabled={!dirty.length} loading={pending} onClick={save}>Save reasons &amp; refresh advice</Button>
      </div>
    </div>
  );
}
