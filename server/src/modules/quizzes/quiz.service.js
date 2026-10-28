import mongoose from 'mongoose';
import {
  ATTEMPT_STATUSES, PERMISSIONS, QUIZ_LIMITS, QUIZ_STATUSES as S, QUIZ_VISIBILITIES, ROLES,
} from '@algonest/shared';
import { Quiz } from '../../models/Quiz.js';
import { QuizVersion } from '../../models/QuizVersion.js';
import { Question } from '../../models/Question.js';
import { Attempt } from '../../models/Attempt.js';
import ApiError from '../../utils/ApiError.js';
import { recordAdminAudit } from '../../utils/adminAudit.js';
import { paginateQuery } from '../../utils/pagination.js';
import { uniqueSlug } from '../../utils/slug.js';
import { authorQuestion, normaliseQuestion, QuestionNormalizeError } from './questionNormalizer.js';
import { adjustUsage } from './question.service.js';
import {
  DECISION_TO_STATUS, canTransition, isAttemptable, isEditable, isStaff, transitionError,
} from './quizWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';
const idOf = (value) => String(value?._id ?? value ?? '');

const isModerator = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
const ownerOf = (quiz, actor) => idOf(quiz.author) === String(actor.id);
const canManage = (quiz, actor) => ownerOf(quiz, actor) || isModerator(actor);

function assertManage(quiz, actor) {
  if (!canManage(quiz, actor)) throw ApiError.forbidden('Only the author or a content moderator can change this quiz');
}

function assertQuestionEditable(quiz) {
  if (quiz.status === S.PUBLISHED) {
    throw ApiError.conflict('This quiz is published. Start a new revision before editing questions.');
  }
  if (!isEditable(quiz.status)) {
    throw ApiError.conflict(`Questions cannot be edited while the quiz is "${quiz.status}"`);
  }
}

async function findQuiz(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid quiz id');
  const quiz = await Quiz.findById(id).populate('author', AUTHOR_FIELDS);
  if (!quiz) throw ApiError.notFound('Quiz not found');
  return quiz;
}

async function latestVersion(quizId) {
  return QuizVersion.findOne({ quiz: quizId }).sort({ version: -1 }).lean();
}

function pushReview(quiz, from, to, actor, decision, note) {
  quiz.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  if (quiz.reviewHistory.length > 20) quiz.reviewHistory = quiz.reviewHistory.slice(-20);
}

/** Derive topic filters from the linked bank questions (no manual tagging needed). */
async function syncTopics(quiz) {
  const ids = (quiz.questions ?? []).map((link) => link.question).filter(Boolean);
  if (!ids.length) return;
  const docs = await Question.find({ _id: { $in: ids } }, { topic: 1 }).lean();
  const explicit = (quiz.topics ?? []).filter(Boolean);
  quiz.topics = [...new Set([...explicit, ...docs.map((doc) => doc.topic).filter(Boolean)])].slice(0, 30);
}

/* ───────────────────────────── list / read ───────────────────────────── */

export async function listQuizzes(query, actor) {
  const filter = {};
  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    filter.status = query.status; // moderation queue / staff views
  } else {
    filter.publishedVersion = { $gt: 0 };
    filter.status = { $ne: S.ARCHIVED };
    // `unlisted` is link-only; `private` is never listed.
    filter['settings.visibility'] = QUIZ_VISIBILITIES.PUBLIC;
  }

  if (query.q?.trim()) filter.$text = { $search: query.q.trim() };
  if (query.topic) filter.topics = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { attemptCount: -1, createdAt: -1 },
    rating: { attemptCount: -1, createdAt: -1 },
    title: { title: 1 },
  };

  const { items, pagination } = await paginateQuery(filter, Quiz, {
    page: query.page,
    limit: query.limit,
    sort: sorts[query.sort] ?? sorts.newest,
    populate: { path: 'author', select: AUTHOR_FIELDS },
  });

  return {
    items: items.map((doc) => {
      const view = Quiz.toPublic(doc);
      view.questionCount = doc.publishedVersion > 0 ? (doc.publishedQuestionCount ?? 0) : (doc.questions?.length ?? 0);
      view.maxScore = doc.publishedVersion > 0 ? (doc.publishedMaxScore ?? 0) : 0;
      return view;
    }),
    pagination,
  };
}

/** Student-facing detail: always the frozen published snapshot, never the draft. */
export async function getQuiz(id, actor) {
  const quiz = await findQuiz(id);
  const manage = canManage(quiz, actor);
  let snapshot = null;

  if (!manage) {
    if (quiz.status === S.ARCHIVED) throw ApiError.notFound('Quiz not found');
    if (!quiz.publishedVersion) throw ApiError.notFound('This quiz is not published yet');
    snapshot = await latestVersion(quiz._id);
    if (!snapshot) throw ApiError.notFound('Published version is unavailable');
    if (snapshot.settings?.visibility === QUIZ_VISIBILITIES.PRIVATE) {
      throw ApiError.forbidden('This quiz is private');
    }
  }

  const questionIds = snapshot
    ? (snapshot.questions ?? []).map((question) => String(question._id))
    : null;
  const view = Quiz.toPublic(quiz, { snapshot, questions: questionIds });

  // Compute unbounded history summaries in MongoDB; fetch only the five recent rows.
  const userId = new Types.ObjectId(actor.id);
  const [summaryRows, active, recent] = await Promise.all([
    Attempt.aggregate([
      { $match: { user: userId, quiz: quiz._id, status: { $ne: ATTEMPT_STATUSES.ABANDONED } } },
      { $group: { _id: null, attemptsUsed: { $sum: 1 }, bestPercentage: { $max: '$percentage' } } },
    ]),
    Attempt.findOne({ user: userId, quiz: quiz._id, status: ATTEMPT_STATUSES.IN_PROGRESS, expiresAt: { $gt: new Date() } })
      .select('_id').lean(),
    Attempt.find({ user: userId, quiz: quiz._id, status: { $ne: ATTEMPT_STATUSES.ABANDONED } })
      .select('status percentage submittedAt quizVersion mode')
      .sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const summary = summaryRows[0] ?? { attemptsUsed: 0, bestPercentage: 0 };
  const attemptsUsed = summary.attemptsUsed;
  const best = summary.bestPercentage ?? 0;

  return {
    quiz: view,
    canManage: manage,
    canModerate: isModerator(actor) && !ownerOf(quiz, actor),
    mySummary: {
      attemptsUsed,
      maxAttempts: view.settings.maxAttempts,
      attemptsLeft: Math.max(0, view.settings.maxAttempts - attemptsUsed),
      bestPercentage: best,
      bestPassed: best >= view.settings.passPercentage,
      activeAttemptId: active ? String(active._id) : null,
      canStart: isAttemptable(quiz, actor) && attemptsUsed < view.settings.maxAttempts,
      recent: recent.map((attempt) => ({
        id: String(attempt._id),
        status: attempt.status,
        percentage: attempt.percentage ?? 0,
        quizVersion: attempt.quizVersion,
        mode: attempt.mode,
        submittedAt: attempt.submittedAt ?? null,
      })),
    },
  };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createQuiz(payload, actor) {
  const quiz = await Quiz.create({
    ...payload,
    slug: uniqueSlug(payload.title),
    author: new Types.ObjectId(actor.id),
    status: S.DRAFT,
  });
  const plain = quiz.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return { quiz: Quiz.toPublic(plain) };
}

export async function updateQuiz(id, payload, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status === S.ARCHIVED) throw ApiError.conflict('Restore the quiz before editing it');

  for (const key of ['title', 'description', 'difficulty', 'goals', 'topics', 'tags']) {
    if (payload[key] !== undefined) quiz[key] = payload[key];
  }
  if (payload.settings) {
    // Merge so a partial settings patch cannot reset unrelated fields.
    for (const [key, value] of Object.entries(payload.settings)) {
      if (value !== undefined) quiz.settings[key] = value;
    }
    quiz.markModified('settings');
  }
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function archiveQuiz(id, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status === S.ARCHIVED) throw ApiError.conflict('Quiz is already archived');
  if (!canTransition(quiz.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(quiz.status, S.ARCHIVED));
  pushReview(quiz, quiz.status, S.ARCHIVED, actor, 'archive', '');
  quiz.status = S.ARCHIVED;
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function restoreQuiz(id, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived quiz can be restored');
  pushReview(quiz, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  quiz.status = S.DRAFT;
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function startRevision(id, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status !== S.PUBLISHED) throw ApiError.conflict('Only a published quiz can start a revision');
  pushReview(quiz, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  quiz.status = S.DRAFT;
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

/* ───────────────────────────── lifecycle ───────────────────────────── */

export async function submitForReview(id, changelog, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (!canTransition(quiz.status, S.PENDING_REVIEW)) throw ApiError.conflict(transitionError(quiz.status, S.PENDING_REVIEW));
  if (!quiz.questions?.length) throw ApiError.unprocessable('Add at least one question before submitting');
  pushReview(quiz, quiz.status, S.PENDING_REVIEW, actor, 'submit', changelog || '');
  quiz.status = S.PENDING_REVIEW;
  quiz.submittedAt = new Date();
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function moderateQuiz(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const quiz = await findQuiz(id);
  // Separation of duties — never approve your own content (super admin exempt).
  if (ownerOf(quiz, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a quiz you authored');
  }
  if (quiz.status !== S.PENDING_REVIEW) throw ApiError.conflict('Only quizzes in review can be moderated');
  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(quiz.status, target)) throw ApiError.conflict(transitionError(quiz.status, target));
  pushReview(quiz, quiz.status, target, actor, decision, note);
  quiz.status = target;
  quiz.reviewedBy = new Types.ObjectId(actor.id);
  quiz.reviewNote = note || '';
  await quiz.save();
  await recordAdminAudit({ actor, action: `content.quiz.${decision}`, targetType: 'quiz', targetId: quiz._id, summary: `Quiz moderation: ${decision}`, metadata: { decision, note: note || '', from: 'pending_review', to: target } });
  return { quiz: Quiz.toPublic(quiz) };
}

/**
 * Freeze the working copy into an immutable QuizVersion. Question ids are the
 * bank ids (stable), so attempts on version 1 still resolve after version 2.
 */
export async function publishQuiz(id, changelog, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status !== S.APPROVED) throw ApiError.conflict('A quiz must be approved before it can be published');
  const links = [...(quiz.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!links.length) throw ApiError.unprocessable('Cannot publish an empty quiz');

  const ids = links.map((link) => link.question);
  const docs = await Question.find({ _id: { $in: ids } }).lean();
  const byId = new Map(docs.map((doc) => [String(doc._id), doc]));
  const missing = ids.filter((value) => !byId.has(String(value)));
  if (missing.length) throw ApiError.conflict(`${missing.length} linked question(s) no longer exist in the bank`);

  const snapshotFields = [
    'type', 'prompt', 'topic', 'difficulty', 'explanation', 'points', 'tags',
    'code', 'caseSensitive', 'options', 'items', 'pairs', 'answerKey', 'booleanKey', 'textAnswers',
  ];
  const questions = links.map((link, index) => {
    const source = byId.get(String(link.question));
    const entry = { _id: new Types.ObjectId(source._id), order: index };
    for (const field of snapshotFields) entry[field] = source[field];
    return entry;
  });
  const maxScore = questions.reduce((sum, question) => sum + (Number(question.points) || 1), 0);
  const version = (quiz.publishedVersion ?? 0) + 1;

  const settings = quiz.settings?.toObject ? quiz.settings.toObject() : { ...quiz.settings };
  const snapshot = await QuizVersion.create({
    quiz: quiz._id,
    version,
    settings,
    questions,
    questionCount: questions.length,
    maxScore,
    title: quiz.title,
    description: quiz.description,
    difficulty: quiz.difficulty,
    topics: quiz.topics,
    changelog: changelog || '',
    publishedBy: new Types.ObjectId(actor.id),
  });

  try {
    pushReview(quiz, quiz.status, S.PUBLISHED, actor, 'publish', changelog || '');
    quiz.status = S.PUBLISHED;
    quiz.publishedVersion = version;
    quiz.publishedQuestionCount = questions.length;
    quiz.publishedMaxScore = maxScore;
    quiz.publishedAt = new Date();
    await quiz.save();
  } catch (error) {
    // Standalone Mongo has no multi-document transactions; remove the orphan.
    await QuizVersion.deleteOne({ _id: snapshot._id }).catch(() => {});
    throw error;
  }
  return { quiz: Quiz.toPublic(quiz), version: QuizVersion.toPublic(snapshot) };
}

export async function listVersions(id, actor) {
  const quiz = await findQuiz(id);
  if (!canManage(quiz, actor) && !quiz.publishedVersion) throw ApiError.notFound('Quiz not found');
  const items = await QuizVersion.find({ quiz: quiz._id }).sort({ version: -1 }).lean();
  return { items: items.map((item) => QuizVersion.toPublic(item)), quizId: idOf(quiz) };
}

export async function getVersion(id, versionNumber, actor) {
  const quiz = await findQuiz(id);
  if (!canManage(quiz, actor) && !quiz.publishedVersion) throw ApiError.notFound('Quiz not found');
  const snapshot = await QuizVersion.findOne({ quiz: quiz._id, version: versionNumber }).lean();
  if (!snapshot) throw ApiError.notFound('Version not found');
  // Author/staff see answer keys; students only ever get metadata + redacted list.
  const questions = canManage(quiz, actor)
    ? (snapshot.questions ?? []).map((question) => ({ ...authorQuestion(question, { _id: question._id }) }))
    : (snapshot.questions ?? []).map((question) => ({
      id: String(question._id), type: question.type, prompt: question.prompt,
      topic: question.topic, difficulty: question.difficulty, points: question.points,
    }));
  return { version: QuizVersion.toPublic(snapshot), questions };
}

/* ───────────────────────────── questions ───────────────────────────── */

/** Editor-facing list. Paginated, includes answer keys for owner/staff only. */
export async function listQuizQuestions(id, query, actor) {
  const quiz = await findQuiz(id);
  if (!canManage(quiz, actor)) throw ApiError.forbidden('Only the author or a moderator can inspect quiz questions');
  const links = [...(quiz.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(QUIZ_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || QUIZ_LIMITS.MAX_QUESTIONS));
  const slice = links.slice((page - 1) * limit, page * limit);
  const docs = await Question.find({ _id: { $in: slice.map((link) => link.question) } }).lean();
  const byId = new Map(docs.map((doc) => [String(doc._id), doc]));
  const { buildPagination } = await import('../../utils/pagination.js');
  return {
    items: slice.map((link, index) => {
      const doc = byId.get(String(link.question));
      return doc ? { ...authorQuestion(doc, doc), order: (page - 1) * limit + index } : null;
    }).filter(Boolean),
    pagination: buildPagination(page, limit, links.length, QUIZ_LIMITS.MAX_QUESTIONS),
  };
}

export async function linkQuestions(id, questionIds, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  const existing = new Set((quiz.questions ?? []).map((link) => String(link.question)));
  const fresh = questionIds.filter((value) => !existing.has(String(value)));
  if (!fresh.length) throw ApiError.conflict('All selected questions are already in this quiz');
  if ((quiz.questions?.length ?? 0) + fresh.length > QUIZ_LIMITS.MAX_QUESTIONS) {
    throw ApiError.unprocessable(`A quiz can hold at most ${QUIZ_LIMITS.MAX_QUESTIONS} questions`);
  }

  const docs = await Question.find({ _id: { $in: fresh } }).lean();
  if (docs.length !== fresh.length) throw ApiError.notFound('One or more questions no longer exist');
  const forbidden = docs.find((doc) => String(doc.author) !== String(actor.id) && !isStaff(actor));
  if (forbidden) throw ApiError.forbidden('You can only link questions from your own bank');

  let order = quiz.questions?.length ?? 0;
  for (const questionId of fresh) quiz.questions.push({ question: new Types.ObjectId(questionId), order: order++ });
  await syncTopics(quiz);
  await quiz.save();
  await adjustUsage(fresh, 1);
  return { quiz: Quiz.toPublic(quiz) };
}

/** Bulk import: create bank questions from parsed rows, then link them. */
export async function importQuestions(id, items, source, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  if ((quiz.questions?.length ?? 0) + items.length > QUIZ_LIMITS.MAX_QUESTIONS) {
    throw ApiError.unprocessable(`A quiz can hold at most ${QUIZ_LIMITS.MAX_QUESTIONS} questions`);
  }

  let canonicals;
  try {
    canonicals = items.map((item) => normaliseQuestion(item));
  } catch (error) {
    if (error instanceof QuestionNormalizeError) throw ApiError.unprocessable(error.message);
    throw error;
  }

  const created = await Question.insertMany(canonicals.map((canonical) => ({
    ...canonical, author: new Types.ObjectId(actor.id), source, usageCount: 1,
  })));
  try {
    let order = quiz.questions?.length ?? 0;
    for (const doc of created) quiz.questions.push({ question: doc._id, order: order++ });
    await syncTopics(quiz);
    await quiz.save();
  } catch (error) {
    // Roll back the bank rows so a failed import leaves no orphaned questions.
    await Question.deleteMany({ _id: { $in: created.map((doc) => doc._id) } }).catch(() => {});
    throw error;
  }
  return { quiz: Quiz.toPublic(quiz), imported: created.length, questions: created.map((doc) => authorQuestion(doc, doc)) };
}

/** Full-array reorder: every id must be present exactly once (Zod enforces this). */
export async function reorderQuestions(id, orderedIds, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  const current = (quiz.questions ?? []).map((link) => String(link.question));
  if (orderedIds.length !== current.length || new Set(orderedIds.map(String)).size !== current.length
      || orderedIds.some((value) => !current.includes(String(value)))) {
    throw ApiError.unprocessable('The ordered ids must contain every quiz question exactly once');
  }
  quiz.questions = orderedIds.map((value, index) => ({ question: new Types.ObjectId(value), order: index }));
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function unlinkQuestion(id, questionId, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  const before = quiz.questions?.length ?? 0;
  quiz.questions = (quiz.questions ?? []).filter((link) => String(link.question) !== String(questionId));
  if (quiz.questions.length === before) throw ApiError.notFound('Question is not linked to this quiz');
  quiz.questions.forEach((link, index) => { link.order = index; });
  await quiz.save();
  await adjustUsage([questionId], -1);
  return { quiz: Quiz.toPublic(quiz) };
}

export { findQuiz, latestVersion, canManage, isStaff };
