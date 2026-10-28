import { QUESTION_TYPES as T } from '@algonest/shared';
import { coerceBoolean, expectedAnswer } from './questionNormalizer.js';

/**
 * Pure, deterministic grading. No DB, no Express, no clock — every branch is
 * unit tested. `answerKey` ids are canonical (o0/i0/p0), so display shuffling
 * can never change a score.
 */

const sameSet = (left, right) => {
  const a = new Set(left);
  const b = new Set(right);
  return a.size === b.size && [...a].every((value) => b.has(value));
};

const asArray = (value) => (Array.isArray(value) ? value.map(String) : value == null ? [] : [String(value)]);

/** Canonicalise whitespace/case for fill-in-the-blank comparisons. */
function normaliseText(value, caseSensitive) {
  const text = String(value ?? '').trim().replace(/\s+/g, ' ');
  return caseSensitive ? text : text.toLowerCase();
}

/** @returns {boolean} whether one response is correct for one canonical question. */
export function isResponseCorrect(question, response) {
  switch (question.type) {
    case T.MCQ:
    case T.OUTPUT: {
      const answer = asArray(response);
      return answer.length === 1 && answer[0] === question.answerKey?.[0];
    }
    case T.MULTI:
      return sameSet(asArray(response), question.answerKey ?? []);
    case T.TRUE_FALSE: {
      const value = coerceBoolean(response);
      return value !== null && value === question.booleanKey;
    }
    case T.ORDERING: {
      const answer = asArray(response);
      const key = question.answerKey ?? [];
      return answer.length === key.length && answer.every((id, index) => id === key[index]);
    }
    case T.MATCHING: {
      if (!response || typeof response !== 'object' || Array.isArray(response)) return false;
      const pairs = question.pairs ?? [];
      if (!pairs.length) return false;
      // The solver maps each left id to a right id; a correct map is the identity.
      return pairs.every((pair) => response[pair.id] === pair.id)
        && Object.keys(response).length === pairs.length;
    }
    case T.FILL_BLANK: {
      const given = normaliseText(response, question.caseSensitive);
      if (!given) return false;
      return (question.textAnswers ?? []).some((accepted) => normaliseText(accepted, question.caseSensitive) === given);
    }
    default:
      return false;
  }
}

/**
 * Grade a whole attempt.
 *
 * @param {Array<{id:string, question:object}>} items canonical version questions
 * @param {Array<{questionId:string, response:unknown, marked?:boolean}>} answers
 * @param {{ showExplanations?: boolean }} options
 */
export function gradeAttempt(items, answers = [], { showExplanations = true } = {}) {
  const byId = new Map(answers.map((answer) => [String(answer.questionId), answer]));
  const results = [];
  const topicMap = new Map();

  for (const item of items) {
    const question = item.question ?? item;
    const questionId = String(item.id ?? question._id ?? '');
    const stored = byId.get(questionId);
    const correct = stored ? isResponseCorrect(question, stored.response) : false;
    const points = Number(question.points) || 1;
    const awarded = correct ? points : 0;
    const topic = question.topic || 'General';

    const result = {
      questionId,
      type: question.type,
      topic,
      points,
      awarded,
      correct,
      attempted: Boolean(stored && stored.response !== null && stored.response !== undefined
        && !(Array.isArray(stored.response) && stored.response.length === 0)
        && !(typeof stored.response === 'object' && !Array.isArray(stored.response) && Object.keys(stored.response).length === 0)),
      marked: Boolean(stored?.marked),
      response: stored?.response ?? null,
      ...(showExplanations ? { expected: expectedAnswer(question), explanation: question.explanation || '' } : {}),
    };
    results.push(result);

    const stat = topicMap.get(topic) ?? { topic, total: 0, correct: 0, score: 0, maxScore: 0, percentage: 0 };
    stat.total += 1;
    stat.correct += correct ? 1 : 0;
    stat.score += awarded;
    stat.maxScore += points;
    topicMap.set(topic, stat);
  }

  const topicStats = [...topicMap.values()]
    .map((stat) => ({ ...stat, percentage: stat.maxScore ? Math.round((stat.score / stat.maxScore) * 1000) / 10 : 0 }))
    .sort((a, b) => a.percentage - b.percentage || a.topic.localeCompare(b.topic));

  const score = results.reduce((sum, result) => sum + result.awarded, 0);
  const maxScore = results.reduce((sum, result) => sum + result.points, 0);
  const percentage = maxScore ? Math.round((score / maxScore) * 1000) / 10 : 0;

  return {
    results,
    topicStats,
    score,
    maxScore,
    percentage,
    correctCount: results.filter((result) => result.correct).length,
    attemptedCount: results.filter((result) => result.attempted).length,
    questionCount: results.length,
  };
}

/** Ids of questions a learner got wrong — used by retry-incorrect-only. */
export function incorrectQuestionIds(results) {
  // Results reloaded from Mongo hold ObjectIds; freshly graded ones hold
  // strings. Normalising here is what makes retry-incorrect-only work after a
  // page reload as well as in the same process.
  return results.filter((result) => !result.correct).map((result) => String(result.questionId));
}
