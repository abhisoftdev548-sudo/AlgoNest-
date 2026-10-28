import { useMemo, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { questionInputSchema, QUESTION_TYPES as T } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { blankQuestion, compactQuestion, canonicalToInput, typeHint } from '../lib/questionDefaults.js';
import { DIFFICULTY_OPTIONS, QUESTION_TYPE_OPTIONS, TOPIC_OPTIONS, contractErrors } from '../lib/quizUtils.js';

const letter = (index) => String.fromCharCode(65 + index);
const listClass = 'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

/** All seven question types share one form; the union contract validates it. */
export default function QuestionEditor({ initial = null, onSave, onCancel, pending = false, title = 'Add a question' }) {
  const [draft, setDraft] = useState(() => (initial ? canonicalToInput(initial) : blankQuestion(T.MCQ)));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const hint = useMemo(() => typeHint(draft.type), [draft.type]);
  const set = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));

  const changeType = (type) => {
    setFormError(''); setErrors({});
    setDraft(blankQuestion(type));
  };

  const patchOption = (index, value) => {
    const options = [...draft.options]; options[index] = value;
    set('options', options);
  };
  const removeOption = (index) => {
    const options = draft.options.filter((_, i) => i !== index);
    const answer = Array.isArray(draft.answer)
      ? draft.answer.map((value) => (value > index ? value - 1 : value)).filter((value) => value !== index)
      : draft.answer > index ? draft.answer - 1 : draft.answer;
    setDraft((previous) => ({ ...previous, options, answer }));
  };
  const toggleMultiAnswer = (index) => {
    const current = Array.isArray(draft.answer) ? draft.answer : [];
    set('answer', current.includes(index) ? current.filter((value) => value !== index) : [...current, index].sort((a, b) => a - b));
  };
  const move = (key, index, direction) => {
    const list = [...draft[key]];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    set(key, list);
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = compactQuestion(draft);
    const parsed = questionInputSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setFormError(parsed.error.issues[0]?.message ?? 'Check the highlighted fields.');
      return;
    }
    setErrors({}); setFormError('');
    onSave(parsed.data);
  };

  const hasOptions = [T.MCQ, T.MULTI, T.OUTPUT].includes(draft.type);
  const hasItems = draft.type === T.ORDERING;
  const hasPairs = draft.type === T.MATCHING;
  const hasTextAnswers = draft.type === T.FILL_BLANK;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="mt-0.5 text-xs text-muted">{hint}</p>
        </div>
      </div>

      {formError ? <Alert variant="error" title="Fix this question">{formError}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Question type" options={QUESTION_TYPE_OPTIONS} value={draft.type} onChange={(event) => changeType(event.target.value)} />
        <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={draft.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        <Input label="Topic" list="quiz-topic-list" value={draft.topic} onChange={(event) => set('topic', event.target.value)} error={errors.topic} />
        <Input label="Points" type="number" min={1} max={10} value={draft.points} onChange={(event) => set('points', Number(event.target.value))} error={errors.points} />
      </div>
      <datalist id="quiz-topic-list">{TOPIC_OPTIONS.map((option) => <option key={option.value} value={option.value} />)}</datalist>

      <div>
        <label htmlFor="question-prompt" className="mb-1.5 block text-sm font-medium text-ink">Prompt <span className="text-danger">*</span></label>
        <textarea
          id="question-prompt" rows={3} maxLength={2000} value={draft.prompt}
          aria-invalid={errors.prompt ? 'true' : undefined}
          onChange={(event) => set('prompt', event.target.value)}
          placeholder={hasTextAnswers ? 'Use ___ for the blank, e.g. "A ______ is a FIFO structure."' : 'What do you want to ask?'}
          className={listClass}
        />
        {errors.prompt ? <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.prompt}</p> : null}
      </div>

      {(draft.type === T.OUTPUT || draft.type === T.FILL_BLANK) ? (
        <div>
          <label htmlFor="question-code" className="mb-1.5 block text-sm font-medium text-ink">
            Code snippet {draft.type === T.OUTPUT ? <span className="text-danger">*</span> : '(optional)'}
          </label>
          <textarea
            id="question-code" rows={4} maxLength={4000} value={draft.code ?? ''}
            onChange={(event) => set('code', event.target.value)}
            spellCheck={false}
            className={`${listClass} font-mono text-xs`}
            placeholder="console.log([1, 2, 3].map(x => x * 2));"
          />
          {errors.code ? <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.code}</p> : null}
        </div>
      ) : null}

      {hasOptions ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">
            Options &amp; correct answer {draft.type === T.MULTI ? '(select all)' : '(select one)'}
          </legend>
          {errors.options ? <p role="alert" className="text-xs font-medium text-danger">{errors.options}</p> : null}
          {errors.answer ? <p role="alert" className="text-xs font-medium text-danger">{errors.answer}</p> : null}
          {draft.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type={draft.type === T.MULTI ? 'checkbox' : 'radio'}
                  name="correct-option"
                  checked={draft.type === T.MULTI ? (draft.answer ?? []).includes(index) : draft.answer === index}
                  onChange={() => (draft.type === T.MULTI ? toggleMultiAnswer(index) : set('answer', index))}
                  className="h-4 w-4 shrink-0 accent-primary"
                  aria-label={`Mark option ${letter(index)} as correct`}
                />
                <span className="w-5 shrink-0 text-xs font-semibold text-muted">{letter(index)}</span>
                <input
                  type="text" value={option} maxLength={500}
                  onChange={(event) => patchOption(index, event.target.value)}
                  placeholder={`Option ${letter(index)}`}
                  className={listClass}
                  aria-label={`Option ${letter(index)} text`}
                />
              </label>
              <Button type="button" size="icon" variant="ghost" onClick={() => removeOption(index)} disabled={draft.options.length <= 2} aria-label={`Remove option ${letter(index)}`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('options', [...draft.options, ''])} disabled={draft.options.length >= 8}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add option
          </Button>
        </fieldset>
      ) : null}

      {draft.type === T.TRUE_FALSE ? (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">Correct answer</legend>
          <div className="flex gap-3">
            {[true, false].map((value) => (
              <label key={String(value)} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink">
                <input type="radio" name="correct-boolean" checked={draft.answer === value} onChange={() => set('answer', value)} className="h-4 w-4 accent-primary" />
                {value ? 'True' : 'False'}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {hasItems ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Items in the correct order</legend>
          <p className="flex items-center gap-1.5 text-xs text-muted"><Info className="h-3.5 w-3.5" aria-hidden="true" /> Learners see these shuffled; move them with the arrow buttons.</p>
          {errors.items ? <p role="alert" className="text-xs font-medium text-danger">{errors.items}</p> : null}
          {draft.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-xs font-semibold text-muted">{index + 1}</span>
              <input type="text" value={item} maxLength={500} onChange={(event) => {
                const items = [...draft.items]; items[index] = event.target.value; set('items', items);
              }} className={listClass} aria-label={`Item ${index + 1}`} placeholder={`Item ${index + 1}`} />
              <Button type="button" size="icon" variant="ghost" onClick={() => move('items', index, -1)} disabled={index === 0} aria-label={`Move item ${index + 1} up`}><ChevronUp className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => move('items', index, 1)} disabled={index === draft.items.length - 1} aria-label={`Move item ${index + 1} down`}><ChevronDown className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => set('items', draft.items.filter((_, i) => i !== index))} disabled={draft.items.length <= 2} aria-label={`Remove item ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('items', [...draft.items, ''])} disabled={draft.items.length >= 10}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add item
          </Button>
        </fieldset>
      ) : null}

      {hasPairs ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Matching pairs</legend>
          {errors.pairs ? <p role="alert" className="text-xs font-medium text-danger">{errors.pairs}</p> : null}
          {draft.pairs.map((pair, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-xs font-semibold text-muted">{index + 1}</span>
              <input type="text" value={pair.left} maxLength={500} onChange={(event) => {
                const pairs = [...draft.pairs]; pairs[index] = { ...pair, left: event.target.value }; set('pairs', pairs);
              }} className={listClass} aria-label={`Pair ${index + 1} left`} placeholder="Left item" />
              <span className="text-muted" aria-hidden="true">→</span>
              <input type="text" value={pair.right} maxLength={500} onChange={(event) => {
                const pairs = [...draft.pairs]; pairs[index] = { ...pair, right: event.target.value }; set('pairs', pairs);
              }} className={listClass} aria-label={`Pair ${index + 1} right`} placeholder="Right item" />
              <Button type="button" size="icon" variant="ghost" onClick={() => set('pairs', draft.pairs.filter((_, i) => i !== index))} disabled={draft.pairs.length <= 2} aria-label={`Remove pair ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('pairs', [...draft.pairs, { left: '', right: '' }])} disabled={draft.pairs.length >= 10}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add pair
          </Button>
        </fieldset>
      ) : null}

      {hasTextAnswers ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Accepted answers</legend>
          {errors.answer ? <p role="alert" className="text-xs font-medium text-danger">{errors.answer}</p> : null}
          {draft.answer.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="text" value={answer} maxLength={500} onChange={(event) => {
                const answers = [...draft.answer]; answers[index] = event.target.value; set('answer', answers);
              }} className={listClass} aria-label={`Accepted answer ${index + 1}`} placeholder="e.g. queue" />
              <Button type="button" size="icon" variant="ghost" onClick={() => set('answer', draft.answer.filter((_, i) => i !== index))} disabled={draft.answer.length <= 1} aria-label={`Remove accepted answer ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('answer', [...draft.answer, ''])} disabled={draft.answer.length >= 10}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add synonym
            </Button>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={draft.caseSensitive} onChange={(event) => set('caseSensitive', event.target.checked)} className="h-4 w-4 accent-primary" />
              Case sensitive
            </label>
          </div>
        </fieldset>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="question-explanation" className="mb-1.5 block text-sm font-medium text-ink">Explanation (shown after submit)</label>
          <textarea id="question-explanation" rows={3} maxLength={2000} value={draft.explanation} onChange={(event) => set('explanation', event.target.value)} className={listClass} placeholder="Why is this the answer?" />
        </div>
        <Input
          label="Tags (comma separated)" value={(draft.tags ?? []).join(', ')}
          onChange={(event) => set('tags', event.target.value.split(',').map((tag) => tag.trim()))}
          hint="Optional — helps you find the question later."
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
        {onCancel ? <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button> : null}
        <Button type="submit" loading={pending}>Save question</Button>
      </div>
    </form>
  );
}
