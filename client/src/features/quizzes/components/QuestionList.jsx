import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Pencil, Trash2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { DIFFICULTY_TONE, difficultyLabel, typeLabel } from '../lib/quizUtils.js';

/**
 * Editor question list. HTML5 drag-and-drop for mouse users plus explicit
 * up/down buttons so reordering is fully keyboard accessible.
 */
export default function QuestionList({ questions = [], onReorder, onEdit, onUnlink, busy = false }) {
  const [dragId, setDragId] = useState(null);

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const ids = questions.map((question) => question.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onReorder(ids);
  };

  const drop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    const ids = questions.map((question) => question.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setDragId(null);
    onReorder(ids);
  };

  if (!questions.length) {
    return (
      <EmptyState
        compact
        icon={GripVertical}
        title="No questions yet"
        description="Add one manually, paste JSON/CSV, or link questions from your bank."
      />
    );
  }

  return (
    <ol className="space-y-2" aria-label="Quiz questions in order">
      {questions.map((question, index) => (
        <li
          key={question.id}
          draggable={!busy}
          onDragStart={() => setDragId(question.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => drop(question.id)}
          onDragEnd={() => setDragId(null)}
          className={`flex items-start gap-2 rounded-xl border border-line bg-surface px-3 py-3 ${dragId === question.id ? 'opacity-50' : ''}`}
        >
          <span className="mt-1.5 cursor-grab text-muted" aria-hidden="true"><GripVertical className="h-4 w-4" /></span>
          <span className="mt-1.5 w-6 shrink-0 text-xs font-bold text-muted">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium text-ink">{question.prompt}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="primary">{typeLabel(question.type)}</Badge>
              <Badge variant={DIFFICULTY_TONE[question.difficulty] ?? 'neutral'}>{difficultyLabel(question.difficulty)}</Badge>
              <span className="text-[11px] text-muted">{question.topic} · {question.points} pt</span>
            </div>
            {question.expected ? <p className="mt-1 truncate text-[11px] text-muted">Answer: {question.expected}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Button size="icon" variant="ghost" onClick={() => move(index, -1)} disabled={index === 0 || busy} aria-label={`Move question ${index + 1} up`}><ChevronUp className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => move(index, 1)} disabled={index === questions.length - 1 || busy} aria-label={`Move question ${index + 1} down`}><ChevronDown className="h-4 w-4" /></Button>
            {onEdit ? <Button size="icon" variant="ghost" onClick={() => onEdit(question)} disabled={busy} aria-label={`Edit question ${index + 1}`}><Pencil className="h-4 w-4" /></Button> : null}
            {onUnlink ? <Button size="icon" variant="ghost" onClick={() => onUnlink(question.id)} disabled={busy} aria-label={`Remove question ${index + 1}`}><Trash2 className="h-4 w-4 text-danger" /></Button> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
