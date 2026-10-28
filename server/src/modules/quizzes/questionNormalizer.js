import { QUESTION_TYPES as T } from '@algonest/shared';

/**
 * Pure conversion from the creator-friendly Zod input shape to the ONE
 * canonical shape stored in Question / QuizVersion / graded by questionGrader.
 *
 * Canonical shape:
 *   { type, prompt, topic, difficulty, explanation, points, tags, code,
 *     caseSensitive, options: [{id,text}], items: [{id,text}],
 *     pairs: [{id,left,right}], answerKey: [id], booleanKey: bool|null,
 *     textAnswers: [string] }
 *
 * Every id is deterministic (o0, i0, p0 …). That makes snapshots byte-stable,
 * imported questions reproducible, and answer keys safe to diff in tests.
 */

/** Thrown when a validated shape still contains an unresolvable answer. */
export class QuestionNormalizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QuestionNormalizeError';
  }
}

const TRUE_WORDS = new Set(['true', 'yes', 't', '1']);
const FALSE_WORDS = new Set(['false', 'no', 'f', '0']);

export function coerceBoolean(value) {
  if (typeof value === 'boolean') return value;
  const key = String(value ?? '').trim().toLowerCase();
  if (TRUE_WORDS.has(key)) return true;
  if (FALSE_WORDS.has(key)) return false;
  return null;
}

/**
 * Accepts a 0-based index, a 1-based index (number or numeric string), a
 * letter A–H, or the exact text of an option. Returns -1 when unresolvable.
 */
export function resolveOptionIndex(answer, options) {
  const len = options.length;
  const numeric = (n) => {
    if (!Number.isInteger(n) || len === 0) return -1;
    if (n >= 0 && n < len) return n;
    if (n >= 1 && n <= len) return n - 1; // tolerate 1-based exports
    return -1;
  };

  if (typeof answer === 'number') return numeric(answer);
  const text = String(answer ?? '').trim();
  if (!text) return -1;
  if (/^\d+$/.test(text)) return numeric(Number(text));
  if (/^[a-h]$/i.test(text)) {
    const index = text.toLowerCase().charCodeAt(0) - 97;
    return index < len ? index : -1;
  }
  return options.findIndex((option) => option.text.trim().toLowerCase() === text.toLowerCase());
}

const textOptions = (values) => (values ?? []).map((text, index) => ({ id: `o${index}`, text: String(text).trim() }));
const textItems = (values) => (values ?? []).map((text, index) => ({ id: `i${index}`, text: String(text).trim() }));
const normalisePairs = (values) => (values ?? []).map((pair, index) => ({
  id: `p${index}`,
  left: String(Array.isArray(pair) ? pair[0] : pair.left).trim(),
  right: String(Array.isArray(pair) ? pair[1] : pair.right).trim(),
}));

/** @param {object} input validated by `questionInputSchema` (or a bulk row). */
export function normaliseQuestion(input) {
  if (!input || typeof input !== 'object') throw new QuestionNormalizeError('Question must be an object');

  const base = {
    type: input.type,
    prompt: String(input.prompt ?? '').trim(),
    topic: input.topic || 'General',
    difficulty: input.difficulty || 'medium',
    explanation: input.explanation || '',
    points: Number(input.points) || 1,
    tags: input.tags ?? [],
    code: input.code || '',
    caseSensitive: Boolean(input.caseSensitive),
    options: [],
    items: [],
    pairs: [],
    answerKey: [],
    booleanKey: null,
    textAnswers: [],
  };

  switch (input.type) {
    case T.MCQ:
    case T.MULTI:
    case T.OUTPUT: {
      base.options = textOptions(input.options);
      const raw = Array.isArray(input.answer) ? input.answer : [input.answer];
      const indexes = raw.map((answer) => resolveOptionIndex(answer, base.options));
      if (indexes.some((index) => index < 0)) {
        throw new QuestionNormalizeError(`Correct answer "${raw.join(', ')}" does not match any option`);
      }
      const unique = [...new Set(indexes)];
      if (input.type === T.MCQ || input.type === T.OUTPUT) {
        if (unique.length !== 1) throw new QuestionNormalizeError('This type needs exactly one correct option');
      } else if (unique.length < 2) {
        throw new QuestionNormalizeError('Multiple select needs at least two correct options');
      }
      base.answerKey = unique.map((index) => base.options[index].id);
      break;
    }
    case T.TRUE_FALSE: {
      const value = coerceBoolean(input.answer);
      if (value === null) throw new QuestionNormalizeError('True/false needs a boolean answer');
      base.booleanKey = value;
      break;
    }
    case T.ORDERING: {
      base.items = textItems(input.items);
      // `items` are authored in the correct order; the solver sees them shuffled.
      base.answerKey = base.items.map((item) => item.id);
      break;
    }
    case T.MATCHING: {
      base.pairs = normalisePairs(input.pairs);
      // Right options are identified by their own pair id; the association is
      // NEVER sent to the solver (see redactQuestion).
      base.answerKey = base.pairs.map((pair) => pair.id);
      break;
    }
    case T.FILL_BLANK: {
      const answers = Array.isArray(input.answer) ? input.answer : [input.answer];
      base.textAnswers = answers.map((answer) => String(answer).trim()).filter(Boolean);
      if (!base.textAnswers.length) throw new QuestionNormalizeError('Add at least one accepted answer');
      break;
    }
    default:
      throw new QuestionNormalizeError(`Unsupported question type "${input.type}"`);
  }

  return base;
}

/** Stable, human-readable expected answer for a result page. */
export function expectedAnswer(question) {
  const label = (id) => question.options?.find((option) => option.id === id)?.text ?? id;
  switch (question.type) {
    case T.MCQ:
    case T.OUTPUT:
      return label(question.answerKey?.[0]);
    case T.MULTI:
      return (question.answerKey ?? []).map(label).join(', ');
    case T.TRUE_FALSE:
      return question.booleanKey ? 'True' : 'False';
    case T.ORDERING:
      return (question.answerKey ?? [])
        .map((id) => question.items?.find((item) => item.id === id)?.text ?? id)
        .join(' → ');
    case T.MATCHING:
      return (question.pairs ?? []).map((pair) => `${pair.left} → ${pair.right}`).join(', ');
    case T.FILL_BLANK:
      return (question.textAnswers ?? []).join(' / ');
    default:
      return '';
  }
}

/**
 * Solver-safe projection. Explanations and ALL answer fields are removed here;
 * the only place a learner sees them is the post-submit result endpoint.
 * `presentation` (built once per attempt) controls display order.
 */
export function redactQuestion(question, questionId, presentation = null) {
  const order = (list, ids) => {
    if (!ids?.length) return list;
    const byId = new Map(list.map((entry) => [entry.id, entry]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
    // Defensive: never silently drop an item if a stale presentation is used.
    for (const entry of list) if (!ids.includes(entry.id)) ordered.push(entry);
    return ordered;
  };

  const view = {
    id: String(questionId),
    type: question.type,
    prompt: question.prompt,
    topic: question.topic || 'General',
    difficulty: question.difficulty || 'medium',
    points: Number(question.points) || 1,
    code: question.code || '',
  };

  switch (question.type) {
    case T.MCQ:
    case T.MULTI:
    case T.OUTPUT:
      view.options = order(question.options ?? [], presentation?.optionIds);
      view.multi = question.type === T.MULTI;
      break;
    case T.ORDERING:
      view.items = order(question.items ?? [], presentation?.itemIds);
      break;
    case T.MATCHING:
      // Two independent arrays: adjacency in the payload never reveals a pair.
      view.leftItems = order(
        (question.pairs ?? []).map((pair) => ({ id: pair.id, text: pair.left })),
        presentation?.leftIds,
      );
      view.rightItems = order(
        (question.pairs ?? []).map((pair) => ({ id: pair.id, text: pair.right })),
        presentation?.rightIds,
      );
      break;
    case T.FILL_BLANK:
      view.caseSensitive = Boolean(question.caseSensitive);
      break;
    default:
      break;
  }
  return view;
}

/** Author-facing projection: includes the canonical answer, no raw internals. */
export function authorQuestion(question, doc) {
  return {
    id: String(doc?._id ?? ''),
    type: question.type,
    prompt: question.prompt,
    topic: question.topic,
    difficulty: question.difficulty,
    explanation: question.explanation || '',
    points: question.points,
    tags: question.tags ?? [],
    code: question.code || '',
    caseSensitive: Boolean(question.caseSensitive),
    options: question.options ?? [],
    items: question.items ?? [],
    pairs: question.pairs ?? [],
    answerKey: question.answerKey ?? [],
    booleanKey: question.booleanKey,
    textAnswers: question.textAnswers ?? [],
    expected: expectedAnswer(question),
    usageCount: doc?.usageCount ?? 0,
    createdAt: doc?.createdAt ?? null,
    updatedAt: doc?.updatedAt ?? null,
  };
}
