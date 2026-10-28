import mongoose from 'mongoose';
import {
  MOCK_LIMITS, MOCK_STATUSES as S, MOCK_VISIBILITIES, PERMISSIONS, ROLES,
} from '@algonest/shared';
import { MockTest } from '../../models/MockTest.js';
import { MockVersion } from '../../models/MockVersion.js';
import { Question } from '../../models/Question.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import ApiError from '../../utils/ApiError.js';
import { paginateQuery } from '../../utils/pagination.js';
import { uniqueSlug } from '../../utils/slug.js';
import { adjustUsage } from '../quizzes/question.service.js';
import {
  DECISION_TO_STATUS, canTransition, isAttemptable, isEditable, isStaff, transitionError,
} from './mockWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';
const idOf = (value) => String(value?._id ?? value ?? '');
const isModerator = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
const ownerOf = (doc, actor) => idOf(doc.author) === String(actor.id);
const canManage = (doc, actor) => ownerOf(doc, actor) || isModerator(actor);

function assertManage(doc, actor) {
  if (!canManage(doc, actor)) throw ApiError.forbidden('Only the author or a content moderator can change this mock test');
}

function assertSectionEditable(doc) {
  if (doc.status === S.PUBLISHED) throw ApiError.conflict('This mock is published. Start a new revision before editing sections.');
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Restore the mock before editing it');
  if (!isEditable(doc.status)) throw ApiError.conflict(`Sections cannot be edited while the mock is "${doc.status}"`);
}

async function findMock(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid mock id');
  const doc = await MockTest.findById(id).populate('author', AUTHOR_FIELDS);
  if (!doc) throw ApiError.notFound('Mock test not found');
  return doc;
}

async function latestVersion(mockId) {
  return MockVersion.findOne({ mock: mockId }).sort({ version: -1 }).lean();
}

function pushReview(doc, from, to, actor, decision, note) {
  doc.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  if (doc.reviewHistory.length > 20) doc.reviewHistory = doc.reviewHistory.slice(-20);
}

/** Derive topic filters from the linked bank questions. */
async function syncTopics(doc) {
  const ids = (doc.sections ?? []).flatMap((section) => section.questionIds ?? []);
  if (!ids.length) return;
  const questions = await Question.find({ _id: { $in: ids } }, { topic: 1 }).lean();
  doc.topics = [...new Set([...(doc.topics ?? []), ...questions.map((q) => q.topic).filter(Boolean)])].slice(0, 30);
}

/** Validate totals that the shared Zod contract also checks (defence in depth). */
function validateTotals(sections) {
  const totalMinutes = sections.reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0);
  const totalQuestions = sections.reduce((sum, section) => sum + (section.questionIds?.length ?? 0), 0);
  if (totalMinutes > MOCK_LIMITS.MAX_TOTAL_MINUTES) throw ApiError.unprocessable(`Total duration exceeds ${MOCK_LIMITS.MAX_TOTAL_MINUTES} minutes`);
  if (totalQuestions > MOCK_LIMITS.MAX_QUESTIONS) throw ApiError.unprocessable(`A mock can hold at most ${MOCK_LIMITS.MAX_QUESTIONS} questions`);
}

/* ───────────────────────────── list / read ───────────────────────────── */

export async function listMocks(query, actor) {
  const filter = {};
  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    filter.status = query.status;
  } else {
    filter.publishedVersion = { $gt: 0 };
    filter.status = { $ne: S.ARCHIVED };
    filter['settings.visibility'] = MOCK_VISIBILITIES.PUBLIC;
  }
  if (query.q?.trim()) filter.$text = { $search: query.q.trim() };
  if (query.topic) filter.topics = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { attemptCount: -1, createdAt: -1 },
    title: { title: 1 },
  };
  const { items, pagination } = await paginateQuery(filter, MockTest, {
    page: query.page, limit: query.limit, sort: sorts[query.sort] ?? sorts.newest,
    populate: { path: 'author', select: AUTHOR_FIELDS },
  });
  return {
    items: items.map((doc) => {
      const view = MockTest.toPublic(doc);
      if (doc.publishedVersion > 0) {
        view.questionCount = doc.publishedQuestionCount ?? view.questionCount;
        view.maxScore = doc.publishedMaxScore ?? view.maxScore;
      }
      return view;
    }),
    pagination,
  };
}

export async function getMock(id, actor) {
  const doc = await findMock(id);
  const manage = canManage(doc, actor);
  let snapshot = null;
  if (!manage) {
    if (doc.status === S.ARCHIVED) throw ApiError.notFound('Mock test not found');
    if (!doc.publishedVersion) throw ApiError.notFound('This mock test is not published yet');
    snapshot = await latestVersion(doc._id);
    if (!snapshot) throw ApiError.notFound('Published version is unavailable');
    if (snapshot.settings?.visibility === MOCK_VISIBILITIES.PRIVATE) throw ApiError.forbidden('This mock test is private');
  }
  const view = MockTest.toPublic(doc, { snapshot });

  // Aggregate all-time counters but only load the small recent-attempt window.
  const userId = new Types.ObjectId(actor.id);
  const [summaryRows, active, recent] = await Promise.all([
    MockAttempt.aggregate([
      { $match: { user: userId, mock: doc._id, status: { $ne: 'abandoned' } } },
      { $group: { _id: null, attemptsUsed: { $sum: 1 }, bestPercentage: { $max: '$percentage' } } },
    ]),
    MockAttempt.findOne({ user: userId, mock: doc._id, status: 'in_progress', expiresAt: { $gt: new Date() } })
      .select('_id').lean(),
    MockAttempt.find({ user: userId, mock: doc._id, status: { $ne: 'abandoned' } })
      .select('status percentage submittedAt mockVersion')
      .sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const summary = summaryRows[0] ?? { attemptsUsed: 0, bestPercentage: 0 };
  const attemptsUsed = summary.attemptsUsed;
  const best = summary.bestPercentage ?? 0;

  return {
    mock: view,
    canManage: manage,
    canModerate: isModerator(actor) && !ownerOf(doc, actor),
    mySummary: {
      attemptsUsed,
      maxAttempts: view.settings.maxAttempts,
      attemptsLeft: Math.max(0, view.settings.maxAttempts - attemptsUsed),
      bestPercentage: best,
      activeAttemptId: active ? String(active._id) : null,
      canStart: isAttemptable(doc, actor) && attemptsUsed < view.settings.maxAttempts,
      recent: recent.map((item) => ({
        id: String(item._id), status: item.status, percentage: item.percentage ?? 0,
        mockVersion: item.mockVersion, submittedAt: item.submittedAt ?? null,
      })),
    },
  };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createMock(payload, actor) {
  const sections = (payload.sections ?? []).map((section, index) => ({
    ...section, questionIds: [], order: index,
  }));
  validateTotals(sections);
  const doc = await MockTest.create({
    ...payload, sections, slug: uniqueSlug(payload.title),
    author: new Types.ObjectId(actor.id), status: S.DRAFT,
  });
  const plain = doc.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return { mock: MockTest.toPublic(plain) };
}

export async function updateMock(id, payload, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Restore the mock before editing it');

  for (const key of ['title', 'description', 'difficulty', 'goals', 'topics', 'tags']) {
    if (payload[key] !== undefined) doc[key] = payload[key];
  }
  if (payload.settings) {
    for (const [key, value] of Object.entries(payload.settings)) if (value !== undefined) doc.settings[key] = value;
    doc.markModified('settings');
  }
  if (payload.sections) {
    assertSectionEditable(doc);
    const existing = doc.sections ?? [];
    const next = payload.sections.map((section, index) => ({
      // Keep ids by position so attempt/version references stay stable.
      ...(existing[index]?._id ? { _id: existing[index]._id } : {}),
      ...section,
      questionIds: (section.questionIds ?? []).map((value) => new Types.ObjectId(value)),
      order: index,
    }));
    validateTotals(next);
    doc.sections = next;
  }
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

/** Replace one section's question list. A question may live in only one section. */
export async function setSectionQuestions(id, sectionId, questionIds, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  assertSectionEditable(doc);
  if (!Types.ObjectId.isValid(sectionId)) throw ApiError.badRequest('Invalid section id');
  const section = (doc.sections ?? []).find((item) => String(item._id) === String(sectionId));
  if (!section) throw ApiError.notFound('Section not found');

  const elsewhere = new Set((doc.sections ?? [])
    .filter((item) => String(item._id) !== String(sectionId))
    .flatMap((item) => (item.questionIds ?? []).map(String)));
  if (questionIds.some((value) => elsewhere.has(String(value)))) {
    throw ApiError.conflict('A question can only belong to one section of a mock test');
  }
  if (questionIds.length > MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION) {
    throw ApiError.unprocessable(`A section can hold at most ${MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION} questions`);
  }

  const docs = questionIds.length ? await Question.find({ _id: { $in: questionIds } }).lean() : [];
  if (docs.length !== questionIds.length) throw ApiError.notFound('One or more questions no longer exist in the bank');
  const forbidden = docs.find((question) => String(question.author) !== String(actor.id) && !isStaff(actor));
  if (forbidden) throw ApiError.forbidden('You can only use questions from your own bank');

  const previous = (section.questionIds ?? []).map(String);
  section.questionIds = questionIds.map((value) => new Types.ObjectId(value));
  await syncTopics(doc);
  await doc.save();
  await adjustUsage(questionIds, 1).catch(() => {});
  if (previous.length) await adjustUsage(previous.filter((value) => !questionIds.includes(value)), -1).catch(() => {});
  return { mock: MockTest.toPublic(doc) };
}

/* ───────────────────────────── lifecycle ───────────────────────────── */

export async function archiveMock(id, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Mock is already archived');
  if (!canTransition(doc.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(doc.status, S.ARCHIVED));
  pushReview(doc, doc.status, S.ARCHIVED, actor, 'archive', '');
  doc.status = S.ARCHIVED;
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function restoreMock(id, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived mock can be restored');
  pushReview(doc, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  doc.status = S.DRAFT;
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function startRevision(id, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status !== S.PUBLISHED) throw ApiError.conflict('Only a published mock can start a revision');
  pushReview(doc, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  doc.status = S.DRAFT;
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function submitForReview(id, changelog, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (!canTransition(doc.status, S.PENDING_REVIEW)) throw ApiError.conflict(transitionError(doc.status, S.PENDING_REVIEW));
  const sections = [...(doc.sections ?? [])].sort((a, b) => a.order - b.order);
  if (!sections.length || sections.some((section) => !section.questionIds?.length)) {
    throw ApiError.unprocessable('Every section needs at least one question before submitting');
  }
  pushReview(doc, doc.status, S.PENDING_REVIEW, actor, 'submit', changelog || '');
  doc.status = S.PENDING_REVIEW;
  doc.submittedAt = new Date();
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function moderateMock(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const doc = await findMock(id);
  if (ownerOf(doc, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a mock test you authored');
  }
  if (doc.status !== S.PENDING_REVIEW) throw ApiError.conflict('Only mocks in review can be moderated');
  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(doc.status, target)) throw ApiError.conflict(transitionError(doc.status, target));
  pushReview(doc, doc.status, target, actor, decision, note);
  doc.status = target;
  doc.reviewedBy = new Types.ObjectId(actor.id);
  doc.reviewNote = note || '';
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

/** Freeze sections + questions + marking scheme into an immutable MockVersion. */
export async function publishMock(id, changelog, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status !== S.APPROVED) throw ApiError.conflict('A mock must be approved before it can be published');
  const sections = [...(doc.sections ?? [])].sort((a, b) => a.order - b.order);
  if (!sections.length || sections.some((section) => !section.questionIds?.length)) {
    throw ApiError.unprocessable('Cannot publish a mock with an empty section');
  }

  const allIds = sections.flatMap((section) => section.questionIds ?? []);
  const bank = await Question.find({ _id: { $in: allIds } }).lean();
  const byId = new Map(bank.map((question) => [String(question._id), question]));
  if (allIds.some((value) => !byId.has(String(value)))) {
    throw ApiError.conflict('Some linked questions no longer exist in the bank');
  }
  const fields = [
    'type', 'prompt', 'topic', 'difficulty', 'explanation', 'points', 'tags',
    'code', 'caseSensitive', 'options', 'items', 'pairs', 'answerKey', 'booleanKey', 'textAnswers',
  ];
  let questionCount = 0;
  let maxScore = 0;
  let totalMinutes = 0;
  const frozenSections = sections.map((section, sectionIndex) => {
    const questions = (section.questionIds ?? []).map((value, index) => {
      const source = byId.get(String(value));
      const entry = { _id: new Types.ObjectId(source._id), order: index, sectionOrder: sectionIndex };
      for (const field of fields) entry[field] = source[field];
      return entry;
    });
    questionCount += questions.length;
    maxScore += questions.length * (Number(section.correctMarks) || 2);
    totalMinutes += Number(section.durationMinutes) || 0;
    return {
      _id: section._id,
      title: section.title,
      description: section.description || '',
      durationMinutes: section.durationMinutes,
      correctMarks: section.correctMarks,
      negativeMarks: section.negativeMarks,
      cutoffPercentage: section.cutoffPercentage,
      order: sectionIndex,
      questions,
      questionCount: questions.length,
      maxScore: questions.length * (Number(section.correctMarks) || 2),
    };
  });
  if (totalMinutes > MOCK_LIMITS.MAX_TOTAL_MINUTES) throw ApiError.unprocessable('Total duration exceeds the allowed maximum');

  const version = (doc.publishedVersion ?? 0) + 1;
  const settings = doc.settings?.toObject ? doc.settings.toObject() : { ...doc.settings };
  const snapshot = await MockVersion.create({
    mock: doc._id, version, settings,
    sections: frozenSections, questionCount, maxScore, totalDurationMinutes: totalMinutes,
    title: doc.title, description: doc.description, difficulty: doc.difficulty,
    topics: doc.topics, changelog: changelog || '', publishedBy: new Types.ObjectId(actor.id),
  });
  try {
    pushReview(doc, doc.status, S.PUBLISHED, actor, 'publish', changelog || '');
    doc.status = S.PUBLISHED;
    doc.publishedVersion = version;
    doc.publishedQuestionCount = questionCount;
    doc.publishedMaxScore = maxScore;
    doc.publishedAt = new Date();
    await doc.save();
  } catch (error) {
    await MockVersion.deleteOne({ _id: snapshot._id }).catch(() => {});
    throw error;
  }
  return { mock: MockTest.toPublic(doc), version: MockVersion.toPublic(snapshot) };
}

export async function listVersions(id, actor) {
  const doc = await findMock(id);
  if (!canManage(doc, actor) && !doc.publishedVersion) throw ApiError.notFound('Mock test not found');
  const items = await MockVersion.find({ mock: doc._id }).sort({ version: -1 }).lean();
  return { items: items.map((item) => MockVersion.toPublic(item)), mockId: idOf(doc) };
}

export async function getVersion(id, versionNumber, actor) {
  const doc = await findMock(id);
  if (!canManage(doc, actor) && !doc.publishedVersion) throw ApiError.notFound('Mock test not found');
  const snapshot = await MockVersion.findOne({ mock: doc._id, version: versionNumber }).lean();
  if (!snapshot) throw ApiError.notFound('Version not found');
  return { version: MockVersion.toPublic(snapshot) };
}

/** Editor-facing bank questions for one section (paginated, answer keys included). */
export async function listSectionQuestions(id, sectionId, query, actor) {
  const doc = await findMock(id);
  if (!canManage(doc, actor)) throw ApiError.forbidden('Only the author or a moderator can inspect section questions');
  const section = (doc.sections ?? []).find((item) => String(item._id) === String(sectionId));
  if (!section) throw ApiError.notFound('Section not found');
  const ids = (section.questionIds ?? []).map(String);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MOCK_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || MOCK_LIMITS.MAX_QUESTIONS));
  const slice = ids.slice((page - 1) * limit, page * limit);
  const docs = await Question.find({ _id: { $in: slice } }).lean();
  const byId = new Map(docs.map((question) => [String(question._id), question]));
  const { authorQuestion, expectedAnswer } = await import('../quizzes/questionNormalizer.js');
  const { buildPagination } = await import('../../utils/pagination.js');
  return {
    items: slice.map((questionId, index) => {
      const question = byId.get(questionId);
      if (!question) return null;
      return { ...authorQuestion(question, question), order: (page - 1) * limit + index, expected: expectedAnswer(question) };
    }).filter(Boolean),
    pagination: buildPagination(page, limit, ids.length, MOCK_LIMITS.MAX_QUESTIONS),
  };
}

export { findMock, latestVersion, canManage, isStaff };
