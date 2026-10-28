import mongoose from 'mongoose';
import {
  ATTEMPT_MODES, ATTEMPT_STATUSES as A, QUIZ_LIMITS, QUIZ_STATUSES,
} from '@algonest/shared';
import { Quiz } from '../../models/Quiz.js';
import { QuizVersion } from '../../models/QuizVersion.js';
import { Attempt } from '../../models/Attempt.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { gradeAttempt, incorrectQuestionIds } from './questionGrader.js';
import { redactQuestion } from './questionNormalizer.js';
import { buildPresentation, presentationFor } from './quizPresentation.js';
import { findQuiz, isStaff, latestVersion } from './quiz.service.js';
import { isAttemptable } from './quizWorkflow.js';

const { Types } = mongoose;
const idOf = (value) => String(value?._id ?? value ?? '');
const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });

async function findAttempt(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid attempt id');
  const attempt = await Attempt.findById(id);
  if (!attempt) throw ApiError.notFound('Attempt not found');
  return attempt;
}

function assertOwner(attempt, actor) {
  // Attempts are strictly private. Even staff need an audit endpoint (Phase 8).
  if (String(attempt.user) !== String(actor.id)) throw ApiError.forbidden('This attempt belongs to another learner');
}

async function findVersion(attempt) {
  const version = await QuizVersion.findById(attempt.versionId).lean();
  if (!version) throw ApiError.notFound('The published version for this attempt is unavailable');
  return version;
}

/** Frozen canonical questions restricted to this attempt's subset/order. */
function versionItems(version, questionIds) {
  const byId = new Map((version.questions ?? []).map((question) => [String(question._id), plain(question)]));
  return (questionIds ?? []).map((id) => ({ id: String(id), question: byId.get(String(id)) }))
    .filter((item) => item.question);
}

export function isExpired(attempt, now = Date.now()) {
  return attempt.status === A.IN_PROGRESS && new Date(attempt.expiresAt).getTime() <= now;
}

/** Idempotent: grade whatever was autosaved and freeze the result. */
export async function finalizeAttempt(attempt, { timedOut = false } = {}) {
  if (attempt.status !== A.IN_PROGRESS) return attempt;
  const version = await findVersion(attempt);
  const items = versionItems(version, attempt.questionIds);
  const showExplanations = attempt.settings?.showExplanations !== false && version.settings?.showExplanations !== false;
  const graded = gradeAttempt(items, attempt.answers.map((answer) => ({
    questionId: String(answer.questionId), response: answer.response, marked: answer.marked,
  })), { showExplanations });

  const endTime = timedOut ? new Date(attempt.expiresAt).getTime() : Date.now();
  const capSeconds = (Number(attempt.settings?.timerMinutes) || 20) * 60;
  attempt.durationSeconds = Math.min(capSeconds, Math.max(0, Math.round((endTime - new Date(attempt.startedAt).getTime()) / 1000)));
  attempt.results = graded.results;
  attempt.topicStats = graded.topicStats;
  attempt.score = graded.score;
  attempt.maxScore = graded.maxScore;
  attempt.percentage = graded.percentage;
  attempt.correctCount = graded.correctCount;
  attempt.attemptedCount = graded.attemptedCount;
  attempt.passed = graded.percentage >= (Number(attempt.settings?.passPercentage) || 60);
  attempt.status = timedOut ? A.TIMED_OUT : A.SUBMITTED;
  attempt.submittedAt = new Date(endTime);
  await attempt.save();

  // Denormalised popularity counter; never let it fail an otherwise good submit.
  await Quiz.updateOne({ _id: attempt.quiz }, { $inc: { attemptCount: 1 } }).catch(() => {});
  return attempt;
}

/** Called on every read so a learner cannot keep answering past the deadline. */
async function finalizeIfExpired(attempt) {
  if (!isExpired(attempt)) return false;
  await finalizeAttempt(attempt, { timedOut: true });
  return true;
}

const remainingSeconds = (attempt) => Math.max(0, Math.round((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000));

/* ───────────────────────────── list ───────────────────────────── */

export async function listAttempts(quizId, query, actor) {
  if (!Types.ObjectId.isValid(quizId)) throw ApiError.badRequest('Invalid quiz id');
  const filter = { user: new Types.ObjectId(actor.id), quiz: new Types.ObjectId(quizId) };
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    Attempt.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Attempt.countDocuments(filter),
  ]);
  return {
    items: items.map((doc) => Attempt.toPublic(doc, 'summary')),
    pagination: buildPagination(page, limit, total),
  };
}

/* ───────────────────────────── start ───────────────────────────── */

/**
 * Start an attempt against the FROZEN published version.
 * - maxAttempts and the deadline are enforced here, never on the client.
 * - shuffle is seeded by the attempt id and stored, so reloads are stable.
 * - `mode: incorrect` builds a subset from a previous attempt's wrong answers.
 */
export async function startAttempt(quizId, payload, actor) {
  const quiz = await findQuiz(quizId);
  if (!isAttemptable(quiz, actor)) throw ApiError.forbidden('This quiz is not available to attempt');
  if (quiz.status === QUIZ_STATUSES.ARCHIVED) throw ApiError.notFound('Quiz not found');

  const version = await latestVersion(quiz._id);
  if (!version || !version.questions?.length) throw ApiError.conflict('This quiz has no published questions yet');
  const settings = version.settings ?? {};

  // Finalise/clear any stale live attempt before opening a new one.
  const live = await Attempt.findOne({ user: new Types.ObjectId(actor.id), quiz: quiz._id, status: A.IN_PROGRESS });
  if (live) {
    if (!isExpired(live)) {
      throw ApiError.conflict('You already have an attempt in progress for this quiz');
    }
    await finalizeAttempt(live, { timedOut: true });
  }

  const used = await Attempt.countDocuments({
    user: new Types.ObjectId(actor.id), quiz: quiz._id, status: { $ne: A.ABANDONED },
  });
  if (used >= (Number(settings.maxAttempts) || 3)) {
    throw ApiError.conflict(`You have used all ${settings.maxAttempts} attempts for this quiz`);
  }

  const allItems = versionItems(version, (version.questions ?? []).map((question) => question._id));
  let items = allItems;

  if (payload.mode === ATTEMPT_MODES.INCORRECT) {
    if (!settings.allowRetryIncorrect) throw ApiError.forbidden('Retry-incorrect-only is disabled for this quiz');
    const source = await Attempt.findOne({ _id: payload.sourceAttemptId }).lean();
    if (!source || String(source.user) !== String(actor.id) || String(source.quiz) !== String(quiz._id)) {
      throw ApiError.notFound('Source attempt not found');
    }
    if (![A.SUBMITTED, A.TIMED_OUT].includes(source.status)) {
      throw ApiError.conflict('Choose a completed attempt to retry');
    }
    const wrong = new Set(incorrectQuestionIds(source.results ?? []));
    items = allItems.filter((item) => wrong.has(item.id));
    if (!items.length) throw ApiError.unprocessable('Nothing to retry — you got every question right!');
  }

  const attempt = new Attempt({
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(actor.id),
    quiz: quiz._id,
    quizVersion: version.version,
    versionId: version._id,
    mode: payload.mode,
    sourceAttempt: payload.sourceAttemptId ? new Types.ObjectId(payload.sourceAttemptId) : null,
    status: A.IN_PROGRESS,
    settings: {
      timerMinutes: Number(settings.timerMinutes) || 20,
      passPercentage: Number(settings.passPercentage) ?? 60,
      showExplanations: settings.showExplanations !== false,
    },
    title: version.title,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + (Number(settings.timerMinutes) || 20) * 60_000),
  });

  // Deterministic per-attempt display order; `questionIds` IS that order.
  const presentation = buildPresentation(items, settings, String(attempt._id));
  attempt.presentation = presentation.map((entry) => ({ ...entry, questionId: new Types.ObjectId(entry.questionId) }));
  attempt.questionIds = presentation.map((entry) => new Types.ObjectId(entry.questionId));
  attempt.maxScore = items.reduce((sum, item) => sum + (Number(item.question.points) || 1), 0);
  await attempt.save();

  return {
    attempt: Attempt.toPublic(attempt, 'solver'),
    remainingSeconds: remainingSeconds(attempt),
    quiz: {
      id: String(quiz._id), title: version.title, description: version.description,
      passPercentage: attempt.settings.passPercentage,
      showExplanations: attempt.settings.showExplanations,
      maxScore: attempt.maxScore,
      version: version.version,
    },
  };
}

/* ───────────────────────────── read / autosave ───────────────────────────── */

export async function getAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const expired = await finalizeIfExpired(attempt);
  const view = attempt.status === A.IN_PROGRESS ? 'solver' : 'result';
  return {
    attempt: Attempt.toPublic(attempt, view),
    remainingSeconds: remainingSeconds(attempt),
    expired,
  };
}

/** Frozen, answer-free question list for the solver. Paginated like every list. */
export async function getAttemptQuestions(id, query, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const version = await findVersion(attempt);
  const byId = new Map((version.questions ?? []).map((question) => [String(question._id), plain(question)]));
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(QUIZ_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || QUIZ_LIMITS.MAX_QUESTIONS));
  const ids = (attempt.questionIds ?? []).map(String);
  const slice = ids.slice((page - 1) * limit, page * limit);

  const items = slice.map((questionId) => {
    const question = byId.get(questionId);
    if (!question) return null;
    return redactQuestion(question, questionId, presentationFor(attempt.presentation, questionId));
  }).filter(Boolean);

  return {
    items,
    pagination: buildPagination(page, limit, ids.length, QUIZ_LIMITS.MAX_QUESTIONS),
    showExplanations: attempt.settings?.showExplanations !== false,
  };
}

/** Upsert-only autosave. Returns `expired: true` if the deadline hit mid-save. */
export async function autosaveAttempt(id, answers, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) {
    return { attempt: Attempt.toPublic(attempt, 'result'), remainingSeconds: 0, expired: false, alreadyFinal: true };
  }
  if (isExpired(attempt)) {
    await finalizeAttempt(attempt, { timedOut: true });
    return { attempt: Attempt.toPublic(attempt, 'result'), remainingSeconds: 0, expired: true, alreadyFinal: true };
  }
  attempt.mergeAnswers(answers, attempt.questionIds.map(String));
  await attempt.save();
  return { attempt: Attempt.toPublic(attempt, 'solver'), remainingSeconds: remainingSeconds(attempt), expired: false, alreadyFinal: false };
}

/** Final submit. Idempotent — a double POST returns the existing result. */
export async function submitAttempt(id, answers, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) {
    if (answers.length) attempt.mergeAnswers(answers, attempt.questionIds.map(String));
    if (isExpired(attempt)) await finalizeAttempt(attempt, { timedOut: true });
    else await finalizeAttempt(attempt, { timedOut: false });
  }
  return { attempt: Attempt.toPublic(attempt, 'result'), remainingSeconds: 0 };
}

/** Result page. Respects the quiz's `showExplanations` setting. */
export async function getResult(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  await finalizeIfExpired(attempt);
  if (attempt.status === A.IN_PROGRESS) throw ApiError.conflict('Submit the attempt before viewing its result');
  const data = Attempt.toPublic(attempt, 'result');
  if (attempt.settings?.showExplanations === false) {
    data.results = (data.results ?? []).map(({ expected, explanation, ...rest }) => rest);
  }
  return { attempt: data, retryAllowed: await canRetryIncorrect(attempt) };
}

export async function canRetryIncorrect(attempt) {
  const version = await QuizVersion.findById(attempt.versionId).select('settings').lean();
  if (!version?.settings?.allowRetryIncorrect) return false;
  const used = await Attempt.countDocuments({ user: attempt.user, quiz: attempt.quiz, status: { $ne: A.ABANDONED } });
  const quiz = await Quiz.findById(attempt.quiz).select('settings').lean();
  return used < (Number(quiz?.settings?.maxAttempts) || 3)
    && (attempt.results ?? []).some((result) => !result.correct);
}

/** Releases the single live-attempt slot without consuming an attempt. */
export async function abandonAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) throw ApiError.conflict('Only an in-progress attempt can be abandoned');
  await finalizeIfExpired(attempt);
  if (attempt.status === A.IN_PROGRESS) {
    attempt.status = A.ABANDONED;
    attempt.submittedAt = new Date();
    await attempt.save();
  }
  return { attempt: Attempt.toPublic(attempt, attempt.status === A.IN_PROGRESS ? 'solver' : 'result') };
}
