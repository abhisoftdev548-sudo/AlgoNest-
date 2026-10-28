import {
  KNOWLEDGE_GAP_REASONS, MOCK_LIMITS, PALETTE_STATES as P, WRONG_REASON_LABELS,
} from '@algonest/shared';
import { expectedAnswer } from '../quizzes/questionNormalizer.js';
import { isResponseCorrect } from '../quizzes/questionGrader.js';

/**
 * Pure mock-test scoring and analysis. No DB, no Express, no clock — the caller
 * passes server timestamps and the frozen version. Every branch is unit tested.
 *
 * Marking model (per section):
 *   correct   → +section.correctMarks
 *   incorrect → −section.negativeMarks
 *   unattempted / not visited → 0
 * A sectional cut-off is met when section.percentage >= section.cutoffPercentage.
 * Final pass requires EVERY sectional cut-off AND the overall pass percentage.
 */

const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });
const round1 = (value) => Math.round(value * 10) / 10;

/** Answers are stored per attempt; build a fast lookup once. */
export function indexAnswers(answers = []) {
  return new Map(answers.map((answer) => [String(answer.questionId), answer]));
}

/** Whether a stored response counts as "attempted". */
export function isAttempted(response) {
  if (response === null || response === undefined || response === '') return false;
  if (Array.isArray(response)) return response.length > 0;
  if (typeof response === 'object') return Object.keys(response).length > 0;
  return true;
}

/** One of the five palette states, derived from the stored answer row. */
export function paletteState(answer) {
  if (!answer || answer.visited !== true) return P.NOT_VISITED;
  const answered = isAttempted(answer.response);
  if (answer.marked) return answered ? P.ANSWERED_MARKED : P.MARKED;
  return answered ? P.ANSWERED : P.NOT_ANSWERED;
}

/** Summarise palette counts for the solver header. */
export function paletteSummary(questions = [], answers = []) {
  const byId = indexAnswers(answers);
  const summary = {
    [P.NOT_VISITED]: 0, [P.NOT_ANSWERED]: 0,
    [P.ANSWERED]: 0, [P.MARKED]: 0, [P.ANSWERED_MARKED]: 0,
  };
  for (const question of questions) summary[paletteState(byId.get(String(question.id ?? question._id)))] += 1;
  return summary;
}

/** Time credited to a question, from server-observed focus windows. */
export function timeFor(questionId, answers = []) {
  const entry = indexAnswers(answers).get(String(questionId));
  return Number(entry?.accumulatedSeconds ?? 0) || 0;
}

/**
 * Grade every section and build the full analysis payload.
 *
 * @param {object} version frozen MockVersion (sections[] each with questions[])
 * @param {Array} answers attempt answers (response, marked, visited, accumulatedSeconds)
 * @param {{showExplanations?:boolean}} options
 */
export function analyseMock(version, answers = [], { showExplanations = true } = {}) {
  const byId = indexAnswers(answers);
  const results = [];
  const sectionReports = [];
  const difficultyMap = new Map();
  const topicMap = new Map();

  let totalScore = 0;
  let totalMaxScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let totalTime = 0;

  for (const section of version.sections ?? []) {
    const questions = (section.questions ?? []).map((question) => {
      const q = plain(question);
      return { id: String(q._id), question: q };
    });
    const correctMarks = Number(section.correctMarks ?? 2);
    const negativeMarks = Number(section.negativeMarks ?? 0);

    let sectionScore = 0;
    let sectionCorrect = 0;
    let sectionIncorrect = 0;
    let sectionUnattempted = 0;
    let sectionTime = 0;
    const sectionMaxScore = questions.length * correctMarks;

    for (const { id, question } of questions) {
      const stored = byId.get(id);
      const attempted = Boolean(stored && isAttempted(stored.response));
      const correct = attempted ? isResponseCorrect(question, stored.response) : false;
      const awarded = !attempted ? 0 : correct ? correctMarks : -negativeMarks;
      const seconds = Number(stored?.accumulatedSeconds ?? 0) || 0;
      const topic = question.topic || 'General';
      const difficulty = question.difficulty || 'medium';

      const result = {
        questionId: id,
        sectionId: String(section._id ?? section.id),
        type: question.type,
        topic,
        difficulty,
        correct,
        attempted,
        marked: Boolean(stored?.marked),
        visited: Boolean(stored?.visited),
        response: stored?.response ?? null,
        awarded,
        timeSeconds: seconds,
        reason: stored?.reason ?? null,
        ...(showExplanations ? { expected: expectedAnswer(question), explanation: question.explanation || '' } : {}),
      };
      results.push(result);

      sectionScore += awarded;
      sectionTime += seconds;
      totalTime += seconds;
      if (correct) sectionCorrect += 1;
      else if (attempted) sectionIncorrect += 1;
      else sectionUnattempted += 1;

      const diff = difficultyMap.get(difficulty) ?? { difficulty, total: 0, correct: 0, incorrect: 0, score: 0, maxScore: 0, percentage: 0 };
      diff.total += 1;
      diff.correct += correct ? 1 : 0;
      diff.incorrect += attempted && !correct ? 1 : 0;
      diff.score += awarded;
      diff.maxScore += correctMarks;
      difficultyMap.set(difficulty, diff);

      const stat = topicMap.get(topic) ?? { topic, total: 0, correct: 0, incorrect: 0, score: 0, maxScore: 0, percentage: 0, lostMarks: 0, knowledgeGaps: 0 };
      stat.total += 1;
      stat.correct += correct ? 1 : 0;
      stat.incorrect += attempted && !correct ? 1 : 0;
      stat.score += awarded;
      stat.maxScore += correctMarks;
      stat.lostMarks += attempted && !correct ? correctMarks + negativeMarks : 0;
      topicMap.set(topic, stat);
    }

    totalScore += sectionScore;
    totalMaxScore += sectionMaxScore;
    correctCount += sectionCorrect;
    incorrectCount += sectionIncorrect;
    unattemptedCount += sectionUnattempted;

    const percentage = sectionMaxScore > 0 ? round1((Math.max(0, sectionScore) / sectionMaxScore) * 100) : 0;
    const cutoffPercentage = Number(section.cutoffPercentage ?? 0);
    sectionReports.push({
      sectionId: String(section._id ?? section.id),
      title: section.title,
      durationMinutes: Number(section.durationMinutes ?? 0),
      correctMarks,
      negativeMarks,
      questionCount: questions.length,
      correct: sectionCorrect,
      incorrect: sectionIncorrect,
      unattempted: sectionUnattempted,
      score: round1(sectionScore),
      maxScore: round1(sectionMaxScore),
      percentage,
      cutoffPercentage,
      passed: percentage >= cutoffPercentage,
      timeSeconds: sectionTime,
    });
  }

  const percentage = totalMaxScore > 0 ? round1((Math.max(0, totalScore) / totalMaxScore) * 100) : 0;
  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount ? round1((correctCount / attemptedCount) * 100) : 0;
  const passPercentage = Number(version.settings?.passPercentage ?? 60);
  const passed = percentage >= passPercentage && sectionReports.every((report) => report.passed);

  const difficultyStats = [...difficultyMap.values()]
    .map((stat) => ({ ...stat, score: round1(stat.score), percentage: stat.maxScore ? round1((Math.max(0, stat.score) / stat.maxScore) * 100) : 0 }))
    .sort((a, b) => a.difficulty.localeCompare(b.difficulty));

  const topicStats = [...topicMap.values()]
    .map((stat) => ({ ...stat, score: round1(stat.score), percentage: stat.maxScore ? round1((Math.max(0, stat.score) / stat.maxScore) * 100) : 0 }))
    .sort((a, b) => a.percentage - b.percentage || b.lostMarks - a.lostMarks || a.topic.localeCompare(b.topic));

  const strongest = [...topicStats].sort((a, b) => b.percentage - a.percentage || a.topic.localeCompare(b.topic))[0]?.topic ?? null;
  const weakest = topicStats[0]?.topic ?? null;

  return {
    results,
    sections: sectionReports,
    difficultyStats,
    topicStats,
    weakTopics: diagnoseWeakTopics(topicStats, results),
    strongestTopic: strongest,
    weakestTopic: weakest,
    score: round1(totalScore),
    maxScore: round1(totalMaxScore),
    percentage,
    passPercentage,
    passed,
    correctCount,
    incorrectCount,
    unattemptedCount,
    attemptedCount,
    questionCount: results.length,
    accuracy,
    timeStats: buildTimeStats(results, totalTime),
  };
}

/** Weak topics = below the passing bar, ranked by marks actually thrown away. */
export function diagnoseWeakTopics(topicStats, results, threshold = 60) {
  const gaps = new Map();
  for (const result of results) {
    if (result.correct || !result.reason) continue;
    if (!KNOWLEDGE_GAP_REASONS.includes(result.reason)) continue;
    gaps.set(result.topic, (gaps.get(result.topic) ?? 0) + 1);
  }
  return topicStats
    .filter((stat) => stat.percentage < threshold || (gaps.get(stat.topic) ?? 0) > 0)
    .map((stat) => {
      const knowledgeGaps = gaps.get(stat.topic) ?? 0;
      const severity = stat.percentage < 40 || knowledgeGaps >= 2 ? 'high' : stat.percentage < threshold ? 'medium' : 'low';
      return {
        topic: stat.topic,
        percentage: stat.percentage,
        lostMarks: round1(stat.lostMarks),
        incorrect: stat.incorrect,
        knowledgeGaps,
        severity,
        advice: severity === 'high'
          ? 'Revise the fundamentals, then re-attempt topic problems.'
          : 'Practise a few timed problems to close the gap.',
      };
    })
    .sort((a, b) => b.lostMarks - a.lostMarks || a.percentage - b.percentage)
    .slice(0, MOCK_LIMITS.MAX_RECOMMENDATIONS);
}

export function buildTimeStats(results, totalSeconds) {
  const withTime = results.filter((result) => result.timeSeconds > 0).sort((a, b) => b.timeSeconds - a.timeSeconds);
  return {
    totalSeconds,
    averageSeconds: results.length ? Math.round(totalSeconds / results.length) : 0,
    slowest: withTime.slice(0, 5).map((result) => ({ questionId: result.questionId, topic: result.topic, seconds: result.timeSeconds })),
    untracked: results.length - withTime.length,
  };
}

/**
 * Apply learner-selected root causes. Pure — returns new results plus a summary.
 * Only wrong, attempted questions can be tagged.
 */
export function applyWrongReasons(results, reasons = []) {
  const incoming = new Map(reasons.map((item) => [String(item.questionId), item.reason]));
  const summary = Object.fromEntries(Object.keys(WRONG_REASON_LABELS).map((key) => [key, 0]));
  const next = results.map((result) => {
    const key = String(result.questionId);
    if (!incoming.has(key) || result.correct) return result;
    const reason = incoming.get(key);
    if (reason && KNOWLEDGE_GAP_REASONS.includes(reason)) summary[reason] += 1;
    else if (reason) summary[reason] += 1;
    return { ...result, reason: reason ?? null };
  });
  return {
    results: next,
    reasonSummary: Object.entries(summary).map(([reason, count]) => ({ reason, label: WRONG_REASON_LABELS[reason], count })).filter((entry) => entry.count > 0),
    taggedCount: results.filter((result) => !result.correct && incoming.has(String(result.questionId))).length,
  };
}
