import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowUp, Bookmark, GripVertical, Pencil, Search, Trash2,
} from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import { STATUS_OPTIONS, problemStatusLabel } from '../lib/sheetUtils.js';
import { cn } from '../../../lib/cn.js';

const DOT = {
  not_started: 'bg-muted/50', attempted: 'bg-warning', solved: 'bg-success',
  revising: 'bg-accent', skipped: 'bg-line',
};
// Static class strings so Tailwind's scanner can see every variant.
const STATUS_TEXT = {
  not_started: 'text-muted', attempted: 'text-warning', solved: 'text-success',
  revising: 'text-accent', skipped: 'text-muted',
};

/**
 * Left pane of the sheet workspace. Native HTML5 drag-and-drop plus explicit
 * keyboard move buttons — a mouse-free user can reorder the whole list.
 */
export default function ProblemList({
  problems, progressById = {}, selectedId, onSelect,
  reorderable = false, onReorder, onEdit, onDelete, loading = false,
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dragId, setDragId] = useState(null);

  const visible = useMemo(() => problems.filter((problem) => {
    if (query && !`${problem.title} ${problem.topic}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (statusFilter && (progressById[problem.id]?.status ?? 'not_started') !== statusFilter) return false;
    return true;
  }), [problems, query, statusFilter, progressById]);

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= problems.length) return;
    const ids = problems.map((problem) => problem.id);
    const [moved] = ids.splice(index, 1);
    ids.splice(target, 0, moved);
    onReorder?.(ids);
  };

  const dropOn = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); return; }
    const ids = problems.map((problem) => problem.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) { setDragId(null); return; }
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    setDragId(null);
    onReorder?.(ids);
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-line bg-surface">
      <div className="space-y-2 border-b border-line p-3">
        <Input
          placeholder="Filter problems…"
          icon={Search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter problems"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          className="h-9 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-muted focus:border-primary focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <ul className="ag-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto p-2" aria-label="Problems">
        {visible.map((problem) => {
          const index = problems.findIndex((item) => item.id === problem.id);
          const progress = progressById[problem.id];
          const status = progress?.status ?? 'not_started';
          const isSelected = problem.id === selectedId;
          return (
            <li
              key={problem.id}
              draggable={reorderable}
              onDragStart={() => setDragId(problem.id)}
              onDragOver={(event) => { if (reorderable) event.preventDefault(); }}
              onDrop={() => dropOn(problem.id)}
              onDragEnd={() => setDragId(null)}
              className={cn(
                'group rounded-xl border transition-colors',
                isSelected ? 'border-primary/50 bg-primary/8' : 'border-transparent hover:bg-surface-2',
                dragId === problem.id && 'opacity-50',
              )}
            >
              <div className="flex items-center gap-1.5 p-1.5">
                {reorderable ? (
                  <span className="cursor-grab text-muted" title="Drag to reorder" aria-hidden="true">
                    <GripVertical className="h-4 w-4" />
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onSelect?.(problem.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', DOT[status] ?? DOT.not_started)} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{index + 1}. {problem.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                      <span className="truncate">{problem.topic}</span>
                      {progress?.bookmark ? <Bookmark className="h-3 w-3 fill-primary text-primary" aria-hidden="true" /> : null}
                      <span className={cn('rounded px-1 py-0.5', STATUS_TEXT[status] ?? 'text-muted')}>
                        {problemStatusLabel(status)}
                      </span>
                    </span>
                  </span>
                </button>

                {reorderable ? (
                  <span className="flex shrink-0 flex-col">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${problem.title} up`} className="rounded p-0.5 text-muted hover:text-primary disabled:opacity-30">
                      <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === problems.length - 1} aria-label={`Move ${problem.title} down`} className="rounded p-0.5 text-muted hover:text-primary disabled:opacity-30">
                      <ArrowDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ) : null}
                {onEdit ? (
                  <button type="button" onClick={() => onEdit(problem)} aria-label={`Edit ${problem.title}`} className="rounded p-1 text-muted opacity-0 transition-opacity hover:text-primary group-hover:opacity-100 focus:opacity-100">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
                {onDelete ? (
                  <button type="button" onClick={() => onDelete(problem)} aria-label={`Remove ${problem.title}`} className="rounded p-1 text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 focus:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
        {!visible.length && !loading ? (
          <li className="px-3 py-8 text-center text-xs text-muted">
            {problems.length ? 'No problems match this filter.' : 'No problems yet — add one or paste a list of links.'}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
