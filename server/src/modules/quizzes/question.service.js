import mongoose from 'mongoose';
import { PERMISSIONS, QUIZ_LIMITS } from '@algonest/shared';
import { Question } from '../../models/Question.js';
import ApiError from '../../utils/ApiError.js';
import { paginateQuery } from '../../utils/pagination.js';
import { authorQuestion, normaliseQuestion, QuestionNormalizeError } from './questionNormalizer.js';
import { parseBulkQuestions, CSV_TEMPLATE, JSON_TEMPLATE } from './bulkImport.js';

const { Types } = mongoose;

const isStaff = (actor) => Boolean(actor?.permissions?.length);
const canManage = (doc, actor) => String(doc.author?._id ?? doc.author) === String(actor.id) || isStaff(actor);

async function findQuestion(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid question id');
  const question = await Question.findById(id);
  if (!question) throw ApiError.notFound('Question not found');
  return question;
}

function toCanonicalInput(payload) {
  try {
    return normaliseQuestion(payload);
  } catch (error) {
    if (error instanceof QuestionNormalizeError) throw ApiError.unprocessable(error.message);
    throw error;
  }
}

/* ───────────────────────────── list / read ───────────────────────────── */

/**
 * Bank questions are PRIVATE to their author. Staff (any permission) can browse
 * the whole bank for moderation, but a student can never read another user's
 * answer keys through this endpoint.
 */
export async function listQuestions(query, actor) {
  const filter = {};
  if (query.mine === 'true' || !isStaff(actor)) filter.author = new Types.ObjectId(actor.id);
  if (query.q?.trim()) filter.$text = { $search: query.q.trim() };
  if (query.type) filter.type = query.type;
  if (query.topic) filter.topic = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const { items, pagination } = await paginateQuery(filter, Question, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
  return { items: items.map((doc) => authorQuestion(doc, doc)), pagination };
}

export async function getQuestion(id, actor) {
  const question = await findQuestion(id);
  if (!canManage(question, actor)) throw ApiError.forbidden('This question belongs to another creator');
  return { question: authorQuestion(question, question) };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createQuestion(payload, actor, source = 'manual') {
  const canonical = toCanonicalInput(payload);
  const doc = await Question.create({ ...canonical, author: new Types.ObjectId(actor.id), source });
  return { question: authorQuestion(doc, doc) };
}

export async function updateQuestion(id, payload, actor) {
  const question = await findQuestion(id);
  if (!canManage(question, actor)) throw ApiError.forbidden('This question belongs to another creator');
  const canonical = toCanonicalInput(payload);
  for (const [key, value] of Object.entries(canonical)) question[key] = value;
  await question.save();
  // Published QuizVersions embed their own copy, so no attempt is invalidated.
  return { question: authorQuestion(question, question) };
}

/**
 * Hard-delete is only safe when nothing links this question. Published versions
 * are self-contained but a working-copy link would dangle, so refuse and tell
 * the creator exactly what to unlink.
 */
export async function deleteQuestion(id, actor) {
  const question = await findQuestion(id);
  if (!canManage(question, actor)) throw ApiError.forbidden('This question belongs to another creator');
  if ((question.usageCount ?? 0) > 0) {
    throw ApiError.conflict(`This question is linked to ${question.usageCount} quiz draft(s). Remove it from those quizzes first.`);
  }
  await Question.deleteOne({ _id: question._id });
  return { id: String(question._id), deleted: true };
}

/** Pure preview for the creator UI. Never writes to MongoDB. */
export function parseImport(format, text) {
  const result = parseBulkQuestions(format, text);
  return {
    items: result.items.map(({ input, canonical }) => ({
      ...input,
      canonical,
      expected: canonical.answerKey?.length ? canonical.answerKey.join(', ') : '',
    })),
    errors: result.errors,
    skipped: result.skipped,
    total: result.total,
    templates: { csv: CSV_TEMPLATE, json: JSON_TEMPLATE },
  };
}

/** Used by quiz.service when linking/unlinking; bounded to the batch cap. */
export async function adjustUsage(questionIds, delta) {
  if (!questionIds?.length) return;
  await Question.updateMany(
    { _id: { $in: questionIds.slice(0, QUIZ_LIMITS.MAX_IMPORT_BATCH).map((id) => new Types.ObjectId(id)) } },
    { $inc: { usageCount: delta } },
  );
}

export const hasModerationPermission = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
