import { ChevronDown, ChevronUp, Code2, Flag } from 'lucide-react';
import { QUESTION_TYPES as T } from '@algonest/shared';
import Badge from '../../../components/ui/Badge.jsx';
import { typeLabel } from '../lib/quizUtils.js';

const controlClass = 'flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/8';
const inputClass = 'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

/**
 * One redacted question and its response editor. The payload contains NO answer
 * keys, so this component cannot cheat; grading happens only on the server.
 */
export default function QuestionRenderer({ question, number, value, onChange, marked = false, onToggleMarked, disabled = false }) {
  const set = (next) => !disabled && onChange(next);
  const move = (ids, index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    set(next);
  };

  return (
    <article className="space-y-4" aria-labelledby={`question-${question.id}-title`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Question {number}</Badge>
          <Badge>{typeLabel(question.type)}</Badge>
          <span className="text-xs text-muted">{question.topic} · {question.points} pt</span>
        </div>
        {onToggleMarked ? (
          <button
            type="button"
            onClick={onToggleMarked}
            aria-pressed={marked}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${marked ? 'bg-warning/15 text-warning' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" /> {marked ? 'Marked for review' : 'Mark for review'}
          </button>
        ) : null}
      </header>

      <h2 id={`question-${question.id}-title`} className="text-lg font-semibold leading-relaxed text-ink">{question.prompt}</h2>

      {question.code ? (
        <div className="rounded-xl border border-line bg-surface-2/60 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><Code2 className="h-3.5 w-3.5" aria-hidden="true" /> Code</p>
          <pre className="ag-scrollbar overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink">{question.code}</pre>
        </div>
      ) : null}

      {[T.MCQ, T.MULTI, T.OUTPUT].includes(question.type) ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">
            {question.multi ? 'Select all that apply' : 'Select one answer'}
          </legend>
          <div className="space-y-2">
            {(question.options ?? []).map((option, index) => {
              const checked = question.multi
                ? (Array.isArray(value) ? value : []).includes(option.id)
                : value === option.id;
              return (
                <label key={option.id} className={controlClass}>
                  <input
                    type={question.multi ? 'checkbox' : 'radio'}
                    name={`answer-${question.id}`}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => {
                      if (!question.multi) { set(option.id); return; }
                      const current = Array.isArray(value) ? value : [];
                      set(current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id]);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  />
                  <span><span className="mr-2 font-semibold text-muted">{String.fromCharCode(65 + index)}.</span>{option.text}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {question.type === T.TRUE_FALSE ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">Choose one</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[true, false].map((option) => (
              <label key={String(option)} className={controlClass}>
                <input
                  type="radio" name={`answer-${question.id}`} checked={value === option}
                  disabled={disabled} onChange={() => set(option)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <span>{option ? 'True' : 'False'}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {question.type === T.ORDERING ? (() => {
        const ids = Array.isArray(value) && value.length ? value : (question.items ?? []).map((item) => item.id);
        const byId = new Map((question.items ?? []).map((item) => [item.id, item]));
        return (
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-muted">Use the arrows to put the items in the correct order</legend>
            <ol className="space-y-2">
              {ids.map((id, index) => (
                <li key={id} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink">
                  <span className="w-5 shrink-0 text-xs font-bold text-muted">{index + 1}</span>
                  <span className="min-w-0 flex-1">{byId.get(id)?.text ?? id}</span>
                  <button type="button" disabled={disabled || index === 0} onClick={() => move(ids, index, -1)} aria-label={`Move ${byId.get(id)?.text ?? 'item'} up`} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 disabled:opacity-40"><ChevronUp className="h-4 w-4" /></button>
                  <button type="button" disabled={disabled || index === ids.length - 1} onClick={() => move(ids, index, 1)} aria-label={`Move ${byId.get(id)?.text ?? 'item'} down`} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 disabled:opacity-40"><ChevronDown className="h-4 w-4" /></button>
                </li>
              ))}
            </ol>
          </fieldset>
        );
      })() : null}

      {question.type === T.MATCHING ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">Match each item on the left with one on the right</legend>
          <div className="space-y-2">
            {(question.leftItems ?? []).map((left) => (
              <label key={left.id} className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-3 sm:flex-row sm:items-center">
                <span className="min-w-0 flex-1 text-sm font-medium text-ink">{left.text}</span>
                <select
                  value={value?.[left.id] ?? ''}
                  disabled={disabled}
                  onChange={(event) => set({ ...(value ?? {}), [left.id]: event.target.value })}
                  aria-label={`Match for ${left.text}`}
                  className={`${inputClass} sm:max-w-[45%]`}
                >
                  <option value="">Choose…</option>
                  {(question.rightItems ?? []).map((right) => (
                    <option key={right.id} value={right.id}>{right.text}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {question.type === T.FILL_BLANK ? (
        <div>
          <label htmlFor={`answer-${question.id}`} className="mb-1.5 block text-xs font-medium text-muted">Your answer</label>
          <input
            id={`answer-${question.id}`} type="text" maxLength={500} value={typeof value === 'string' ? value : ''}
            disabled={disabled} onChange={(event) => set(event.target.value)}
            placeholder="Type your answer" className={inputClass}
            autoComplete="off"
          />
          {question.caseSensitive ? <p className="mt-1.5 text-xs text-warning">This answer is case sensitive.</p> : null}
        </div>
      ) : null}
    </article>
  );
}
