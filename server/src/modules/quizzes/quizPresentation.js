import { QUESTION_TYPES as T } from '@algonest/shared';

/**
 * Deterministic shuffle. Seeding from the attempt id means a page reload or an
 * autosave round-trip NEVER reorders questions/options under the learner — a
 * real correctness issue, not just polish, because answers are keyed by id.
 */

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates on a copy. Exported for tests. */
export function seededShuffle(values, seed) {
  const copy = [...values];
  const random = mulberry32(hashString(String(seed)));
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

/**
 * Build the exact display order for one attempt. Stored on the Attempt so it
 * is stable for the whole session and can be replayed on the result page.
 *
 * @param {Array<{id:string, question:object}>} items frozen version questions
 * @param {{shuffleQuestions?:boolean, shuffleOptions?:boolean}} settings
 * @param {string} seed attempt id
 */
export function buildPresentation(items, settings, seed) {
  const distinct = (values, key) => {
    const shuffled = seededShuffle(values, `${seed}:${key}`);
    return shuffled.length > 1 && shuffled.every((value, index) => value === values[index])
      ? seededShuffle(values, `${seed}:${key}:retry`)
      : shuffled;
  };

  const orderedItems = settings?.shuffleQuestions
    ? seededShuffle(items, `${seed}:questions`)
    : items;
  const optionShuffle = Boolean(settings?.shuffleOptions);

  return orderedItems.map((item, index) => {
    const question = item.question ?? item;
    const id = String(item.id ?? question._id ?? index);
    const entry = { questionId: id };

    if ([T.MCQ, T.MULTI, T.OUTPUT].includes(question.type)) {
      const ids = (question.options ?? []).map((option) => option.id);
      // Always shuffle options when requested; ordering/matching are inherently shuffled.
      entry.optionIds = optionShuffle ? distinct(ids, `options:${id}`) : ids;
    }
    if (question.type === T.ORDERING) {
      entry.itemIds = distinct((question.items ?? []).map((entry2) => entry2.id), `items:${id}`);
    }
    if (question.type === T.MATCHING) {
      const pairIds = (question.pairs ?? []).map((pair) => pair.id);
      entry.leftIds = distinct(pairIds, `left:${id}`);
      entry.rightIds = distinct(pairIds, `right:${id}`);
    }
    return entry;
  });
}

/** Order a frozen question list by a stored presentation array. */
export function applyQuestionOrder(items, presentation) {
  if (!presentation?.length) return items;
  const byId = new Map(items.map((item) => [String(item.id ?? item.question?._id ?? ''), item]));
  const ordered = presentation.map((entry) => byId.get(String(entry.questionId))).filter(Boolean);
  for (const item of items) {
    const id = String(item.id ?? item.question?._id ?? '');
    if (!presentation.some((entry) => String(entry.questionId) === id)) ordered.push(item);
  }
  return ordered;
}

/** Lookup helper for the per-question presentation entry. */
export function presentationFor(presentation, questionId) {
  return presentation?.find((entry) => String(entry.questionId) === String(questionId)) ?? null;
}
