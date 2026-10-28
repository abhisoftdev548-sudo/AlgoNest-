import { ExternalLink, RotateCcw } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { TASK_TONE, TYPE_TONE, formatMinutes, isExternalHref, taskHref, taskStatusLabel, taskTypeLabel } from '../lib/planUtils.js';

const NEXT = {
  pending: 'in_progress', in_progress: 'done', done: 'pending', skipped: 'pending', missed: 'pending',
};

/** One task row. The checkbox is a real button with an accessible label. */
export default function TaskItem({ task, onStatus, busy = false, showDate = false }) {
  const href = taskHref(task);
  const external = isExternalHref(href);
  const done = task.status === 'done';
  const next = NEXT[task.status] ?? 'pending';

  return (
    <li className={`rounded-xl border p-3 transition-colors ${done ? 'border-success/25 bg-success/5' : task.status === 'missed' ? 'border-danger/25 bg-danger/5' : 'border-line bg-surface'}`}>
      <div className="flex items-start gap-3">
        <button
          type="button" role="checkbox" aria-checked={done}
          aria-label={`${done ? 'Reopen' : 'Complete'} ${task.title}`}
          disabled={busy}
          onClick={() => onStatus(task, done ? 'pending' : 'done')}
          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${done ? 'border-success bg-success text-white' : 'border-line bg-surface hover:border-primary'}`}
        >{done ? '✓' : ''}</button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={TYPE_TONE[task.type] ?? 'neutral'}>{taskTypeLabel(task.type)}</Badge>
            <Badge variant={TASK_TONE[task.status] ?? 'neutral'}>{taskStatusLabel(task.status)}</Badge>
            {task.overloaded ? <Badge variant="warning">Overload</Badge> : null}
            {task.revisionInterval ? <Badge variant="accent">+{task.revisionInterval}d revision</Badge> : null}
            {task.rescheduledFrom ? <Badge variant="neutral"><RotateCcw className="mr-1 inline h-3 w-3" aria-hidden="true" /> moved</Badge> : null}
          </div>
          <p className={`mt-1.5 text-sm font-medium ${done ? 'text-muted line-through' : 'text-ink'}`}>{task.title}</p>
          <p className="mt-0.5 text-xs text-muted">
            {showDate ? `${task.date} · ` : ''}{task.topic} · {formatMinutes(task.estimatedMinutes)}
            {task.description ? ` · ${task.description}` : ''}
          </p>
          {task.note ? <p className="mt-1 text-xs italic text-muted">Note: {task.note}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {task.status !== 'done' ? <Button size="sm" variant="ghost" disabled={busy} onClick={() => onStatus(task, next)}>{next === 'done' ? 'Done' : next === 'in_progress' ? 'Start' : 'Reopen'}</Button> : null}
          <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer nofollow' : undefined} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:border-primary/40 hover:text-primary" aria-label={`Open ${task.title}`}>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </li>
  );
}
