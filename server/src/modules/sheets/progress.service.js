import mongoose from 'mongoose';
import { COMPLETED_STATUSES, PROBLEM_STATUSES as PS, SHEET_LIMITS } from '@algonest/shared';
import { UserProgress } from '../../models/UserProgress.js';
import { PersonalResource } from '../../models/PersonalResource.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination, paginateQuery } from '../../utils/pagination.js';
import { detectPlatform } from './platformDetector.js';
import { getVisibleSheet } from './sheet.service.js';

const { Types } = mongoose;
const idOf = (value) => String(value?._id ?? value ?? '');
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Per-user learning state. Every query is scoped by `actor.id` from the access
 * token — a client can NEVER supply another user's id.
 */

function emptyRow(problem, version) {
  return {
    problemId: idOf(problem._id),
    sheetVersion: version,
    problemTitle: problem.title,
    topic: problem.topic || 'General',
    status: PS.NOT_STARTED,
    notes: '',
    bookmark: false,
    confidence: null,
    timeSpent: 0,
    revisionDate: null,
    lastReviewedAt: null,
    updatedAt: null,
  };
}

function summarise(rows) {
  const total = rows.length;
  const statusCounts = Object.fromEntries(Object.values(PS).map((status) => [status, 0]));
  const topics = new Map();

  for (const row of rows) {
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
    if (!topics.has(row.topic)) topics.set(row.topic, { topic: row.topic, total: 0, completed: 0 });
    const bucket = topics.get(row.topic);
    bucket.total += 1;
    if (COMPLETED_STATUSES.includes(row.status)) bucket.completed += 1;
  }

  const completed = COMPLETED_STATUSES.reduce((sum, status) => sum + (statusCounts[status] ?? 0), 0);
  const now = Date.now();
  return {
    total,
    completed,
    percentage: total ? Math.round((completed / total) * 100) : 0,
    statusCounts,
    bookmarks: rows.filter((row) => row.bookmark).length,
    timeSpent: rows.reduce((sum, row) => sum + (row.timeSpent ?? 0), 0),
    dueRevisions: rows.filter((row) => row.revisionDate && new Date(row.revisionDate).getTime() <= now).length,
    topicWise: [...topics.values()]
      .map((bucket) => ({ ...bucket, percentage: bucket.total ? Math.round((bucket.completed / bucket.total) * 100) : 0 }))
      .sort((a, b) => b.total - a.total || a.topic.localeCompare(b.topic)),
  };
}

export async function getProgress(sheetId, query, actor) {
  const { problems, version } = await getVisibleSheet(sheetId, actor);
  const stored = await UserProgress.find({
    user: new Types.ObjectId(actor.id), sheet: new Types.ObjectId(sheetId),
  }).lean();

  const byProblem = new Map(stored.map((row) => [idOf(row.problemId), UserProgress.toPublic(row)]));
  let rows = problems.map((problem) => byProblem.get(idOf(problem._id)) ?? emptyRow(problem, version));

  // Merge snapshot metadata into rows so old versions still show the right title.
  const problemMap = new Map(problems.map((p) => [idOf(p._id), p]));
  rows = rows.map((row) => ({
    ...row,
    problemTitle: row.problemTitle || problemMap.get(row.problemId)?.title || 'Removed problem',
    topic: row.topic || problemMap.get(row.problemId)?.topic || 'General',
    inCurrentVersion: problemMap.has(row.problemId),
  }));

  const summary = summarise(rows);

  if (query.status) rows = rows.filter((row) => row.status === query.status);
  if (query.topic) rows = rows.filter((row) => row.topic === query.topic);
  if (query.bookmarked === 'true') rows = rows.filter((row) => row.bookmark);

  const pagination = buildPagination(query.page, query.limit, rows.length, SHEET_LIMITS.MAX_PROBLEMS);
  const start = (pagination.page - 1) * pagination.limit;
  return { items: rows.slice(start, start + pagination.limit), pagination, summary, version };
}

export async function upsertProgress(sheetId, problemId, payload, actor) {
  if (!Types.ObjectId.isValid(problemId)) throw ApiError.badRequest('Invalid problem id');
  const { problems, version } = await getVisibleSheet(sheetId, actor);
  const problem = problems.find((item) => idOf(item._id) === idOf(problemId));
  if (!problem) throw ApiError.notFound('Problem not found in the published version of this sheet');

  const set = {
    problemTitle: problem.title,
    topic: problem.topic || 'General',
    sheetVersion: version,
  };
  for (const key of ['status', 'notes', 'bookmark', 'confidence', 'timeSpent', 'revisionDate']) {
    if (payload[key] !== undefined) set[key] = payload[key];
  }
  if (payload.status === PS.SOLVED) set.lastReviewedAt = new Date();
  if (payload.status && COMPLETED_STATUSES.includes(payload.status)) {
    const existing = await UserProgress.findOne({
      user: new Types.ObjectId(actor.id),
      sheet: new Types.ObjectId(sheetId),
      problemId: new Types.ObjectId(problemId),
    }).select('revisionDate').lean();
    // Spaced-repetition default: revisit in 7 days, but never overwrite a date
    // the student deliberately chose.
    if (!existing?.revisionDate && payload.revisionDate === undefined) {
      set.revisionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  const row = await UserProgress.findOneAndUpdate(
    {
      user: new Types.ObjectId(actor.id),
      sheet: new Types.ObjectId(sheetId),
      problemId: new Types.ObjectId(problemId),
    },
    { $set: set },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  return { progress: UserProgress.toPublic(row) };
}

/* ─────────────────────── personal resources ─────────────────────── */

function toResourceDocument(payload) {
  const detected = detectPlatform(payload.url);
  if (!detected.valid) throw ApiError.unprocessable('Invalid resource URL');
  return {
    title: payload.title,
    url: detected.url,
    type: payload.type,
    // The detector is authoritative; a client cannot spoof the platform key.
    platform: detected.platform,
    topic: payload.topic || detected.topic,
    note: payload.note || '',
    tags: payload.tags ?? [],
    sheetId: payload.sheetId ? new Types.ObjectId(payload.sheetId) : null,
    problemId: payload.problemId ? new Types.ObjectId(payload.problemId) : null,
    rating: payload.rating ?? null,
  };
}

export async function listPersonalResources(query, actor) {
  const filter = { user: new Types.ObjectId(actor.id) };
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: rx }, { note: rx }, { tags: rx }, { topic: rx }];
  }
  if (query.type) filter.type = query.type;
  if (query.topic) filter.topic = query.topic;
  if (query.sheetId) filter.sheetId = new Types.ObjectId(query.sheetId);

  const { items, pagination } = await paginateQuery(filter, PersonalResource, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
  return { items: items.map(PersonalResource.toPublic), pagination };
}

export async function createPersonalResource(payload, actor) {
  const resource = await PersonalResource.create({
    ...toResourceDocument(payload),
    user: new Types.ObjectId(actor.id),
  });
  return { resource: PersonalResource.toPublic(resource) };
}

export async function updatePersonalResource(resourceId, payload, actor) {
  if (!Types.ObjectId.isValid(resourceId)) throw ApiError.badRequest('Invalid resource id');
  const resource = await PersonalResource.findOne({
    _id: new Types.ObjectId(resourceId), user: new Types.ObjectId(actor.id),
  });
  if (!resource) throw ApiError.notFound('Resource not found');

  const patch = payload.url ? toResourceDocument({ ...payload }) : {};
  for (const key of ['title', 'type', 'topic', 'note', 'tags', 'rating', 'sheetId', 'problemId']) {
    if (payload[key] !== undefined) {
      patch[key] = ['sheetId', 'problemId'].includes(key) && payload[key]
        ? new Types.ObjectId(payload[key])
        : payload[key];
    }
  }
  Object.assign(resource, patch);
  await resource.save();
  return { resource: PersonalResource.toPublic(resource) };
}

export async function deletePersonalResource(resourceId, actor) {
  if (!Types.ObjectId.isValid(resourceId)) throw ApiError.badRequest('Invalid resource id');
  const result = await PersonalResource.deleteOne({
    _id: new Types.ObjectId(resourceId), user: new Types.ObjectId(actor.id),
  });
  if (!result.deletedCount) throw ApiError.notFound('Resource not found');
  return { removed: true };
}

export default { getProgress, upsertProgress };
