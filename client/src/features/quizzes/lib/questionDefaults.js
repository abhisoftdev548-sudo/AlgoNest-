import { QUESTION_TYPES as T, QUESTION_TYPE_HINTS } from '@algonest/shared';

/** Blank, creator-friendly input for each question type (matches the Zod union). */
export function blankQuestion(type = T.MCQ) {
  const base = {
    type,
    prompt: '',
    topic: 'General',
    difficulty: 'medium',
    explanation: '',
    points: 1,
    tags: [],
    code: '',
  };
  switch (type) {
    case T.MCQ:
    case T.OUTPUT:
      return { ...base, options: ['', ''], answer: 0 };
    case T.MULTI:
      return { ...base, options: ['', '', ''], answer: [0] };
    case T.TRUE_FALSE:
      return { ...base, answer: true };
    case T.ORDERING:
      return { ...base, items: ['', ''] };
    case T.MATCHING:
      return { ...base, pairs: [{ left: '', right: '' }, { left: '', right: '' }] };
    case T.FILL_BLANK:
      return { ...base, answer: [''], caseSensitive: false };
    default:
      return base;
  }
}

/**
 * Convert the author-facing canonical question (from the API) back into the
 * same input shape the editor uses. Keeps editing and creating identical.
 */
export function canonicalToInput(question) {
  if (!question) return blankQuestion();
  const base = {
    type: question.type,
    prompt: question.prompt || '',
    topic: question.topic || 'General',
    difficulty: question.difficulty || 'medium',
    explanation: question.explanation || '',
    points: question.points || 1,
    tags: question.tags ?? [],
    code: question.code || '',
    caseSensitive: Boolean(question.caseSensitive),
  };
  const optionIndexes = (keys) => (keys ?? []).map((key) =>
    Math.max(0, (question.options ?? []).findIndex((option) => option.id === key)));

  switch (question.type) {
    case T.MCQ:
    case T.OUTPUT:
      return { ...base, options: (question.options ?? []).map((option) => option.text), answer: optionIndexes(question.answerKey)[0] ?? 0 };
    case T.MULTI:
      return { ...base, options: (question.options ?? []).map((option) => option.text), answer: optionIndexes(question.answerKey) };
    case T.TRUE_FALSE:
      return { ...base, answer: Boolean(question.booleanKey) };
    case T.ORDERING:
      return { ...base, items: (question.items ?? []).map((item) => item.text) };
    case T.MATCHING:
      return { ...base, pairs: (question.pairs ?? []).map((pair) => ({ left: pair.left, right: pair.right })) };
    case T.FILL_BLANK:
      return { ...base, answer: question.textAnswers?.length ? question.textAnswers : [''], caseSensitive: Boolean(question.caseSensitive) };
    default:
      return { ...base, ...blankQuestion(question.type) };
  }
}

/** Strip empty option/item rows before validation so they don't fail min(1). */
export function compactQuestion(input) {
  const next = { ...input };
  if (Array.isArray(next.options)) next.options = next.options.map((value) => String(value).trim()).filter(Boolean);
  if (Array.isArray(next.items)) next.items = next.items.map((value) => String(value).trim()).filter(Boolean);
  if (Array.isArray(next.pairs)) {
    next.pairs = next.pairs
      .map((pair) => ({ left: String(pair.left ?? '').trim(), right: String(pair.right ?? '').trim() }))
      .filter((pair) => pair.left && pair.right);
  }
  if (Array.isArray(next.answer) && (next.type === T.FILL_BLANK)) {
    next.answer = next.answer.map((value) => String(value).trim()).filter(Boolean);
  }
  if (Array.isArray(next.tags)) next.tags = next.tags.map((value) => String(value).trim()).filter(Boolean);
  // Fields that only belong to some variants must be removed for `.strict()`.
  const allowed = {
    [T.MCQ]: ['options', 'answer'],
    [T.MULTI]: ['options', 'answer'],
    [T.TRUE_FALSE]: ['answer'],
    [T.ORDERING]: ['items'],
    [T.MATCHING]: ['pairs'],
    [T.OUTPUT]: ['options', 'answer', 'code'],
    [T.FILL_BLANK]: ['answer', 'code', 'caseSensitive'],
  }[next.type] ?? [];
  const common = ['type', 'prompt', 'topic', 'difficulty', 'explanation', 'points', 'tags'];
  const result = {};
  for (const key of [...common, ...allowed]) if (next[key] !== undefined) result[key] = next[key];
  return result;
}

export const typeHint = (type) => QUESTION_TYPE_HINTS[type] ?? '';
