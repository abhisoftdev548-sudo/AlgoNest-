import mongoose from 'mongoose';
import {
  MOCK_ATTEMPT_STATUSES as A, MOCK_LIMITS, MOCK_STATUSES, MOCK_TIMER_MODES,
} from '@algonest/shared';
import { MockTest } from '../../models/MockTest.js';
import { MockVersion } from '../../models/MockVersion.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { redactQuestion } from '../quizzes/questionNormalizer.js';
import { buildPresentation } from '../quizzes/quizPresentation.js';
import { analyseMock, applyWrongReasons } from './mockScoring.js';
import {
  advanceSection, creditFocusWindow, effectiveRemainingSeconds, globalDeadline,
  initialSectionStates, remainingSeconds, toMs,
} from './mockClock.js';
import { findMock, isStaff, latestVersion } from './mockTest.service.js';
import { isAttemptable } from './mockWorkflow.js';
import { buildRecommendations, refreshAnalysis } from './mockAnalysis.service.js';

const { Types } = mongoose;
const idOf = (value) => String(value?._id ?? value ?? '');
const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });

async function findAttempt(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid attempt id');
  const attempt = await MockAttempt.findById(id);
  if (!attempt) throw ApiError.notFound('Attempt not found');
  return attempt;
}

function assertOwner(attempt, actor) {
  if (String(attempt.user) !== String(actor.id)) throw ApiError.forbidden('This attempt belongs to another learner');
}

async function findVersion(attempt) {
  const version = await MockVersion.findById(attempt.versionId).lean();
  if (!version) throw ApiError.notFound('The published version for this attempt is unavailable');
  return version;
}

/** All frozen questions as { id, sectionId, sectionTitle, question }. */
function versionQuestions(version) {
  return (version.sections ?? []).flatMap((section) =>
    (section.questions ?? []).map((question) => {
      const q = plain(question);
      return {
        id: String(q._id),
        sectionId: String(section._id),
        sectionTitle: section.title,
        order: Number(section.order ?? 0),
        question: q,
      };
    }));
}

/** In sectional mode only the active section is writable and visible. */
function accessibleQuestions(attempt, version) {
  const all = versionQuestions(version);
  if (attempt.settings?.timerMode !== MOCK_TIMER_MODES.SECTIONAL) return all;
  const active = (attempt.sectionStates ?? []).find((state) => state.status === 'active');
  return active ? all.filter((item) => item.sectionId === String(active.sectionId)) : [];
}

function presentationFor(attempt, questionId) {
  return (attempt.presentation ?? []).find((entry) => String(entry.questionId) === String(questionId)) ?? null;
}

/**
 * Move server-observed focus windows. The client only tells us WHICH question
 * is active; it never supplies a duration or a timestamp.
 */
function applyFocus(attempt, activeQuestionId, allowed, now) {
  const allowedMap = new Map(allowed.map((item) => [item.id, item]));
  const previousId = attempt.activeQuestionId ? String(attempt.activeQuestionId) : null;
  const nextId = activeQuestionId ? String(activeQuestionId) : null;

  if (previousId && previousId !== nextId) {
    const row = (attempt.answers ?? []).find((answer) => String(answer.questionId) === previousId);
    if (row) {
      const window = creditFocusWindow(row, now, { open: false });
      row.firstSeenAt = window.firstSeenAt;
      row.lastSeenAt = window.lastSeenAt;
      row.accumulatedSeconds = window.accumulatedSeconds;
    }
  }
  if (nextId && allowedMap.has(nextId)) {
    const scope = allowedMap.get(nextId);
    const row = attempt.ensureAnswerRow(new Types.ObjectId(nextId), new Types.ObjectId(scope.sectionId));
    const window = creditFocusWindow(row, now, { open: true });
    row.firstSeenAt = window.firstSeenAt;
    row.lastSeenAt = window.lastSeenAt;
    row.accumulatedSeconds = window.accumulatedSeconds;
  }
  attempt.activeQuestionId = nextId && allowedMap.has(nextId) ? new Types.ObjectId(nextId) : null;
  attempt.lastHeartbeatAt = new Date(now);
  attempt.markModified('answers');
}

/** Idempotent final grading. Results are persisted, not recomputed on read. */
export async function finalizeAttempt(attempt, { status = A.SUBMITTED, endTime = Date.now(), actor = null } = {}) {
  if (attempt.status !== A.IN_PROGRESS) return attempt;
  const version = await findVersion(attempt);
  const showExplanations = attempt.settings?.showExplanations !== false && version.settings?.showExplanations !== false;
  const analysis = analyseMock(version, attempt.answers.map((answer) => plain(answer)), { showExplanations });

  const capSeconds = (Number(version.totalDurationMinutes) || 0) * 60 + MOCK_LIMITS.TRANSITION_GRACE_SECONDS * Math.max(0, (version.sections?.length ?? 1) - 1);
  attempt.durationSeconds = Math.min(capSeconds, Math.max(0, Math.round((endTime - toMs(attempt.startedAt)) / 1000)));
  attempt.results = analysis.results;
  attempt.sections = analysis.sections;
  attempt.difficultyStats = analysis.difficultyStats;
  attempt.topicStats = analysis.topicStats;
  attempt.weakTopics = analysis.weakTopics;
  attempt.timeStats = analysis.timeStats;
  attempt.score = analysis.score;
  attempt.maxScore = analysis.maxScore;
  attempt.percentage = analysis.percentage;
  attempt.passed = analysis.passed;
  attempt.accuracy = analysis.accuracy;
  attempt.correctCount = analysis.correctCount;
  attempt.incorrectCount = analysis.incorrectCount;
  attempt.unattemptedCount = analysis.unattemptedCount;
  attempt.status = status;
  attempt.submittedAt = new Date(endTime);
  attempt.activeQuestionId = null;

  // Close the last focus window so the final question's time is credited.
  const active = (attempt.answers ?? []).find((answer) => answer.lastSeenAt);
  if (active) {
    const window = creditFocusWindow(active, endTime, { open: false });
    active.lastSeenAt = window.lastSeenAt;
    active.accumulatedSeconds = window.accumulatedSeconds;
    attempt.markModified('answers');
  }

  if (actor) {
    attempt.recommendations = await buildRecommendations(attempt, actor).catch(() => []);
    attempt.markModified('recommendations');
  }
  await attempt.save();
  await MockTest.updateOne({ _id: attempt.mock }, { $inc: { attemptCount: 1 } }).catch(() => {});
  return attempt;
}

/**
 * Enforce both deadlines. Called on EVERY read and write, so a disconnected
 * client can never extend an attempt by not sending requests.
 * @returns {{changed:boolean, timedOut:boolean, sectionAdvanced:boolean}}
 */
export async function syncClock(attempt, actor, now = Date.now()) {
  if (attempt.status !== A.IN_PROGRESS) return { changed: false, timedOut: false, sectionAdvanced: false };
  let sectionAdvanced = false;

  if (now >= toMs(attempt.expiresAt)) {
    await finalizeAttempt(attempt, { status: A.TIMED_OUT, endTime: toMs(attempt.expiresAt), actor });
    return { changed: true, timedOut: true, sectionAdvanced: false };
  }

  if (attempt.settings?.timerMode === MOCK_TIMER_MODES.SECTIONAL) {
    // Guard bounds the loop even if a corrupt document has zero-duration sections.
    for (let guard = 0; guard < MOCK_LIMITS.MAX_SECTIONS + 1; guard += 1) {
      const states = (attempt.sectionStates ?? []).map(plain);
      const active = states.find((state) => state.status === 'active');
      if (!active) {
        await finalizeAttempt(attempt, { status: A.SUBMITTED, endTime: now, actor });
        return { changed: true, timedOut: false, sectionAdvanced };
      }
      if (!active.expiresAt || now < toMs(active.expiresAt)) break;
      const result = advanceSection(states, now, attempt.expiresAt, 'timed_out');
      attempt.sectionStates = result.states;
      attempt.activeQuestionId = null;
      attempt.markModified('sectionStates');
      sectionAdvanced = true;
      if (result.finished) {
        await finalizeAttempt(attempt, { status: A.SUBMITTED, endTime: now, actor });
        return { changed: true, timedOut: false, sectionAdvanced };
      }
    }
    if (sectionAdvanced) await attempt.save();
  }
  return { changed: sectionAdvanced, timedOut: false, sectionAdvanced };
}

/* ───────────────────────────── start / list ───────────────────────────── */

export async function listAttempts(mockId, query, actor) {
  if (!Types.ObjectId.isValid(mockId)) throw ApiError.badRequest('Invalid mock id');
  const filter = { user: new Types.ObjectId(actor.id), mock: new Types.ObjectId(mockId) };
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    MockAttempt.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    MockAttempt.countDocuments(filter),
  ]);
  return { items: items.map((doc) => MockAttempt.toPublic(doc, 'summary')), pagination: buildPagination(page, limit, total) };
}

export async function startAttempt(mockId, actor) {
  const mock = await findMock(mockId);
  if (!isAttemptable(mock, actor)) throw ApiError.forbidden('This mock test is not available to attempt');
  if (mock.status === MOCK_STATUSES.ARCHIVED) throw ApiError.notFound('Mock test not found');
  const version = await latestVersion(mock._id);
  if (!version || !(version.sections ?? []).some((section) => section.questions?.length)) {
    throw ApiError.conflict('This mock has no published questions yet');
  }
  const sections = [...(version.sections ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const settings = version.settings ?? {};

  const live = await MockAttempt.findOne({ user: new Types.ObjectId(actor.id), mock: mock._id, status: A.IN_PROGRESS });
  if (live) {
    const sync = await syncClock(live, actor);
    if (live.status === A.IN_PROGRESS) throw ApiError.conflict('You already have an attempt in progress for this mock test');
    // A just-expired live attempt was finalised above; a new one is allowed.
    void sync;
  }
  const used = await MockAttempt.countDocuments({
    user: new Types.ObjectId(actor.id), mock: mock._id, status: { $ne: A.ABANDONED },
  });
  if (used >= (Number(settings.maxAttempts) || 3)) {
    throw ApiError.conflict(`You have used all ${settings.maxAttempts} attempts for this mock test`);
  }

  const startedAt = new Date();
  const hardDeadline = new Date(globalDeadline(startedAt, sections, settings.timerMode));
  const attempt = new MockAttempt({
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(actor.id),
    mock: mock._id,
    mockVersion: version.version,
    versionId: version._id,
    status: A.IN_PROGRESS,
    settings: {
      timerMode: settings.timerMode ?? MOCK_TIMER_MODES.SECTIONAL,
      passPercentage: Number(settings.passPercentage ?? 60),
      showExplanations: settings.showExplanations !== false,
      allowPaletteBack: settings.allowPaletteBack !== false,
    },
    title: version.title,
    startedAt,
    expiresAt: hardDeadline,
    sectionStates: initialSectionStates(sections, startedAt, settings.timerMode, hardDeadline),
  });

  const items = versionQuestions(version);
  // Seeded presentation is stored once, so a reload never reshuffles.
  const presentation = buildPresentation(
    items.map((item) => ({ id: item.id, question: item.question })),
    settings, String(attempt._id),
  );
  const byId = new Map(items.map((item) => [item.id, item]));
  attempt.presentation = presentation.map((entry) => ({
    ...entry,
    questionId: new Types.ObjectId(entry.questionId),
    sectionId: new Types.ObjectId(byId.get(entry.questionId).sectionId),
  }));
  attempt.questionIds = presentation.map((entry) => new Types.ObjectId(entry.questionId));
  attempt.maxScore = Number(version.maxScore) || 0;
  await attempt.save();

  return {
    attempt: MockAttempt.toPublic(attempt, 'solver'),
    remainingSeconds: effectiveRemainingSeconds(attempt),
    attemptRemainingSeconds: remainingSeconds(attempt.expiresAt),
    mock: {
      id: String(mock._id), title: version.title,
      totalDurationMinutes: version.totalDurationMinutes,
      maxScore: attempt.maxScore, version: version.version,
      timerMode: attempt.settings.timerMode,
      passPercentage: attempt.settings.passPercentage,
    },
  };
}

/* ───────────────────────────── read / resume ───────────────────────────── */

/** Resume endpoint: returns frozen state + server-computed remaining time. */
export async function getAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const sync = await syncClock(attempt, actor);
  const view = attempt.status === A.IN_PROGRESS ? 'solver' : 'result';
  return {
    attempt: MockAttempt.toPublic(attempt, view),
    remainingSeconds: attempt.status === A.IN_PROGRESS ? effectiveRemainingSeconds(attempt) : 0,
    attemptRemainingSeconds: attempt.status === A.IN_PROGRESS ? remainingSeconds(attempt.expiresAt) : 0,
    expired: sync.timedOut,
    sectionAdvanced: sync.sectionAdvanced,
  };
}

/** Frozen, answer-free questions for the accessible sections, paginated. */
export async function getAttemptQuestions(id, query, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  await syncClock(attempt, actor);
  const version = await findVersion(attempt);
  const accessible = accessibleQuestions(attempt, version);
  const accessibleIds = new Set(accessible.map((item) => item.id));
  const order = (attempt.questionIds ?? []).map(String).filter((questionId) => accessibleIds.has(questionId));
  const byId = new Map(accessible.map((item) => [item.id, item]));

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MOCK_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || MOCK_LIMITS.MAX_QUESTIONS));
  const slice = order.slice((page - 1) * limit, page * limit);
  const items = slice.map((questionId, index) => {
    const item = byId.get(questionId);
    if (!item) return null;
    return {
      ...redactQuestion(item.question, questionId, presentationFor(attempt, questionId)),
      sectionId: item.sectionId,
      sectionTitle: item.sectionTitle,
      number: (page - 1) * limit + index + 1,
    };
  }).filter(Boolean);

  return {
    items,
    sections: (version.sections ?? []).map((section) => ({
      id: String(section._id), title: section.title,
      durationMinutes: section.durationMinutes,
      correctMarks: section.correctMarks, negativeMarks: section.negativeMarks,
      cutoffPercentage: section.cutoffPercentage,
      questionCount: section.questions?.length ?? 0,
      accessible: accessibleIds.size > 0 && [...accessibleIds].some((questionId) => byId.get(questionId)?.sectionId === String(section._id)),
    })),
    pagination: buildPagination(page, limit, order.length, MOCK_LIMITS.MAX_QUESTIONS),
    showExplanations: attempt.settings?.showExplanations !== false,
    timerMode: attempt.settings?.timerMode,
  };
}

/* ───────────────────────────── autosave / heartbeat ───────────────────────────── */

async function writeAnswers(attempt, payload, actor, now = Date.now()) {
  const sync = await syncClock(attempt, actor, now);
  if (attempt.status !== A.IN_PROGRESS) {
    return { attempt, sync, ignored: payload.answers?.length ?? 0, final: true };
  }
  const version = await findVersion(attempt);
  const allowed = accessibleQuestions(attempt, version);
  const allowedIds = new Set(allowed.map((item) => item.id));
  const rows = (payload.answers ?? []).filter((row) => allowedIds.has(String(row.questionId)));
  if (rows.length) attempt.mergeAnswers(rows, allowed);
  applyFocus(attempt, payload.activeQuestionId ?? null, allowed, now);
  await attempt.save();
  return { attempt, sync, ignored: (payload.answers?.length ?? 0) - rows.length, final: false };
}

export async function autosaveAttempt(id, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const result = await writeAnswers(attempt, payload, actor);
  return {
    attempt: MockAttempt.toPublic(attempt, result.final ? 'result' : 'solver'),
    remainingSeconds: result.final ? 0 : effectiveRemainingSeconds(attempt),
    attemptRemainingSeconds: result.final ? 0 : remainingSeconds(attempt.expiresAt),
    expired: result.sync.timedOut,
    sectionAdvanced: result.sync.sectionAdvanced,
    ignored: result.ignored,
    savedAt: new Date().toISOString(),
  };
}

export async function heartbeat(id, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const result = await writeAnswers(attempt, { answers: [], activeQuestionId: payload.activeQuestionId }, actor);
  return {
    status: attempt.status,
    remainingSeconds: result.final ? 0 : effectiveRemainingSeconds(attempt),
    attemptRemainingSeconds: result.final ? 0 : remainingSeconds(attempt.expiresAt),
    sectionAdvanced: result.sync.sectionAdvanced,
    expired: result.sync.timedOut,
    activeSectionId: MockAttempt.toPublic(attempt, 'summary').activeSectionId,
  };
}

/* ───────────────────────────── sections / submit ───────────────────────────── */

export async function submitSection(id, sectionId, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  await syncClock(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) throw ApiError.conflict('This attempt has already finished');
  if (attempt.settings?.timerMode !== MOCK_TIMER_MODES.SECTIONAL) {
    throw ApiError.conflict('Sections are not timed individually in this mock');
  }
  const active = (attempt.sectionStates ?? []).find((state) => state.status === 'active');
  if (!active || String(active.sectionId) !== String(sectionId)) {
    throw ApiError.conflict('This section is not active. Re-sync your attempt.');
  }

  // Flush the final answers for the closing section BEFORE it becomes read-only.
  const version = await findVersion(attempt);
  const allowed = accessibleQuestions(attempt, version);
  const allowedIds = new Set(allowed.map((item) => item.id));
  const rows = (payload.answers ?? []).filter((row) => allowedIds.has(String(row.questionId)));
  if (rows.length) attempt.mergeAnswers(rows, allowed);
  applyFocus(attempt, null, allowed, Date.now());

  const states = (attempt.sectionStates ?? []).map(plain);
  const result = advanceSection(states, Date.now(), attempt.expiresAt, 'submitted');
  attempt.sectionStates = result.states;
  attempt.activeQuestionId = null;
  attempt.markModified('sectionStates');

  if (result.finished) {
    await finalizeAttempt(attempt, { status: A.SUBMITTED, actor });
    return { attempt: MockAttempt.toPublic(attempt, 'result'), finished: true, remainingSeconds: 0, sectionAdvanced: false };
  }
  await attempt.save();
  return {
    attempt: MockAttempt.toPublic(attempt, 'solver'),
    finished: false,
    sectionAdvanced: true,
    remainingSeconds: effectiveRemainingSeconds(attempt),
    nextSectionId: result.next?.sectionId ? String(result.next.sectionId) : null,
  };
}

export async function submitAttempt(id, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) {
    await writeAnswers(attempt, payload, actor);
    if (attempt.status === A.IN_PROGRESS) {
      const timedOut = Date.now() >= toMs(attempt.expiresAt);
      await finalizeAttempt(attempt, {
        status: timedOut ? A.TIMED_OUT : A.SUBMITTED,
        endTime: timedOut ? toMs(attempt.expiresAt) : Date.now(),
        actor,
      });
    }
  }
  return {
    attempt: MockAttempt.toPublic(attempt, 'result'),
    remainingSeconds: 0,
  };
}

/* ───────────────────────────── result / reasons ───────────────────────────── */

export async function getResult(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) await syncClock(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) throw ApiError.conflict('Submit the attempt before viewing its result');
  const data = MockAttempt.toPublic(attempt, 'result');
  if (attempt.settings?.showExplanations === false) {
    data.results = (data.results ?? []).map(({ expected, explanation, ...rest }) => rest);
  }
  return {
    attempt: data,
    mockId: String(attempt.mock),
    reasonOptions: null, // the client imports WRONG_REASON_LABELS from @algonest/shared
  };
}

/** Learner-tagged root causes feed weak-topic diagnosis + recommendations. */
export async function setWrongReasons(id, reasons, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) throw ApiError.conflict('Finish the attempt before tagging answers');
  const valid = new Set((attempt.results ?? []).filter((result) => !result.correct).map((result) => idOf(result.questionId)));
  for (const item of reasons) {
    if (!valid.has(String(item.questionId))) {
      throw ApiError.unprocessable('You can only tag a question you answered incorrectly');
    }
  }
  const tagged = applyWrongReasons(attempt.results.map(plain), reasons);
  attempt.results = tagged.results;
  attempt.reasonSummary = tagged.reasonSummary;
  attempt.markModified('results');
  await attempt.save();
  const analysis = await refreshAnalysis(attempt, actor);
  return {
    results: MockAttempt.toPublic(attempt, 'result').results,
    reasonSummary: tagged.reasonSummary,
    weakTopics: analysis.weakTopics,
    recommendations: analysis.recommendations,
  };
}

export async function abandonAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) throw ApiError.conflict('Only an in-progress attempt can be abandoned');
  await syncClock(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) {
    applyFocus(attempt, null, [], Date.now());
    attempt.status = A.ABANDONED;
    attempt.submittedAt = new Date();
    await attempt.save();
  }
  return { attempt: MockAttempt.toPublic(attempt, 'summary') };
}

export { findAttempt, versionQuestions, accessibleQuestions };
