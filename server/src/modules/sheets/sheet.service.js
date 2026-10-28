import mongoose from 'mongoose';
import {
  PERMISSIONS,
  ROLES,
  SHEET_LIMITS,
  SHEET_STATUSES as S,
} from '@algonest/shared';
import { Sheet } from '../../models/Sheet.js';
import { SheetVersion } from '../../models/SheetVersion.js';
import { SheetRating } from '../../models/SheetRating.js';
import { SheetReport } from '../../models/SheetReport.js';
import { UserProgress } from '../../models/UserProgress.js';
import ApiError from '../../utils/ApiError.js';
import { recordAdminAudit } from '../../utils/adminAudit.js';
import { uniqueSlug } from '../../utils/slug.js';
import { paginateQuery } from '../../utils/pagination.js';
import { detectPlatform, parsePastedLinks } from './platformDetector.js';
import {
  DECISION_TO_STATUS, canTransition, isEditable, transitionError,
} from './sheetWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';

/* ───────────────────────────── helpers ───────────────────────────── */

const idOf = (value) => String(value?._id ?? value ?? '');

function ownerOf(sheet, actor) {
  return idOf(sheet.author) === idOf(actor.id);
}

function isModerator(actor) {
  return actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
}

function canManage(sheet, actor) {
  return ownerOf(sheet, actor) || isModerator(actor);
}

function assertManage(sheet, actor) {
  if (!canManage(sheet, actor)) {
    throw ApiError.forbidden('Only the author or a content moderator can change this sheet');
  }
}

function assertProblemEditable(sheet) {
  if (sheet.status === S.PUBLISHED) {
    throw ApiError.conflict('This sheet is published. Start a new revision before editing problems.');
  }
  if (!isEditable(sheet.status)) {
    throw ApiError.conflict(`Problems cannot be edited while the sheet is "${sheet.status}"`);
  }
}

async function findSheet(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid sheet id');
  const sheet = await Sheet.findById(id).populate('author', AUTHOR_FIELDS);
  if (!sheet) throw ApiError.notFound('Sheet not found');
  return sheet;
}

function pushReview(sheet, from, to, actor, decision, note) {
  sheet.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  // Bounded embedded audit trail; full audit logs arrive with the admin module.
  if (sheet.reviewHistory.length > 20) {
    sheet.reviewHistory = sheet.reviewHistory.slice(-20);
  }
}

/** Derive `topics` from problems so topic filters work without manual tagging. */
function syncTopics(sheet) {
  const explicit = (sheet.topics ?? []).filter(Boolean);
  const fromProblems = (sheet.problems ?? []).map((p) => p.topic).filter(Boolean);
  sheet.topics = [...new Set([...explicit, ...fromProblems])].slice(0, 30);
}

async function latestSnapshot(sheetId) {
  return SheetVersion.findOne({ sheet: sheetId }).sort({ version: -1 }).lean();
}

/**
 * Resolve the exact problem set a viewer should see. Students always read the
 * frozen published snapshot; authors/moderators read the working copy.
 */
export async function getVisibleSheet(id, actor) {
  const sheet = await findSheet(id);
  const manage = canManage(sheet, actor);

  if (!manage) {
    if (sheet.status === S.ARCHIVED) throw ApiError.notFound('Sheet not found');
    if (!sheet.publishedVersion) throw ApiError.notFound('This sheet is not published yet');
    const snapshot = await latestSnapshot(sheet._id);
    if (!snapshot) throw ApiError.notFound('Published version is unavailable');
    return { sheet, snapshot, problems: snapshot.problems, version: snapshot.version, manage };
  }

  return { sheet, snapshot: null, problems: sheet.problems, version: sheet.publishedVersion ?? 0, manage };
}

/* ───────────────────────────── list / read ───────────────────────────── */

export async function listSheets(query, actor) {
  const filter = {};

  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    // Moderation queue / staff status views.
    filter.status = query.status;
  } else {
    filter.publishedVersion = { $gt: 0 };
    filter.status = { $ne: S.ARCHIVED };
  }

  if (query.q?.trim()) filter.$text = { $search: query.q.trim() };
  if (query.topic) filter.topics = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.goal) filter.goals = query.goal;
  if (query.platform) filter['problems.platform'] = query.platform;

  if (query.bookmarked === 'true') {
    const ids = await UserProgress.distinct('sheet', {
      user: new Types.ObjectId(actor.id), bookmark: true,
    });
    filter._id = { $in: ids };
  }

  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    rating: { 'ratingSummary.average': -1, createdAt: -1 },
    popular: { cloneCount: -1, 'ratingSummary.count': -1 },
    title: { title: 1 },
  };

  const { items, pagination } = await paginateQuery(filter, Sheet, {
    page: query.page,
    limit: query.limit,
    sort: sorts[query.sort] ?? sorts.newest,
    populate: { path: 'author', select: AUTHOR_FIELDS },
  });

  return {
    items: items.map((sheet) => {
      const view = Sheet.toPublic(sheet);
      view.problemCount = sheet.publishedVersion > 0
        ? (sheet.publishedProblemCount ?? 0)
        : (sheet.problems?.length ?? 0);
      return view;
    }),
    pagination,
  };
}

export async function getSheet(id, actor) {
  const { sheet, snapshot } = await getVisibleSheet(id, actor);
  return { sheet: Sheet.toPublic(sheet, { snapshot }), canManage: canManage(sheet, actor) };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createSheet(payload, actor) {
  const sheet = await Sheet.create({
    ...payload,
    slug: uniqueSlug(payload.title),
    author: new Types.ObjectId(actor.id),
    status: S.DRAFT,
  });
  const plain = sheet.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return Sheet.toPublic(plain);
}

export async function updateSheet(id, payload, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status === S.ARCHIVED) throw ApiError.conflict('Restore the sheet before editing it');

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'title' || key === 'description' || key === 'difficulty' || key === 'goals' || key === 'tags' || key === 'topics') {
      sheet[key] = value;
    }
  }
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function archiveSheet(id, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status === S.ARCHIVED) throw ApiError.conflict('Sheet is already archived');
  if (!canTransition(sheet.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(sheet.status, S.ARCHIVED));

  const from = sheet.status;
  sheet.status = S.ARCHIVED;
  pushReview(sheet, from, S.ARCHIVED, actor, 'archive', '');
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function restoreSheet(id, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived sheet can be restored');
  pushReview(sheet, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  sheet.status = S.DRAFT;
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

/** Published sheets must be explicitly branched: the public snapshot is frozen. */
export async function startRevision(id, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status !== S.PUBLISHED) throw ApiError.conflict('Only a published sheet can start a revision');
  pushReview(sheet, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  sheet.status = S.DRAFT;
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

/* ───────────────────────────── lifecycle ───────────────────────────── */

export async function submitForReview(id, changelog, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (!canTransition(sheet.status, S.PENDING_REVIEW)) {
    throw ApiError.conflict(transitionError(sheet.status, S.PENDING_REVIEW));
  }
  if (!sheet.problems.length) throw ApiError.unprocessable('Add at least one problem before submitting');

  const from = sheet.status;
  sheet.status = S.PENDING_REVIEW;
  sheet.submittedAt = new Date();
  pushReview(sheet, from, S.PENDING_REVIEW, actor, 'submit', changelog || '');
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function moderateSheet(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const sheet = await findSheet(id);
  // Separation of duties: never approve your own content (super admin exempt).
  if (ownerOf(sheet, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a sheet you authored');
  }
  if (sheet.status !== S.PENDING_REVIEW) {
    throw ApiError.conflict('Only sheets in review can be moderated');
  }

  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(sheet.status, target)) {
    throw ApiError.conflict(transitionError(sheet.status, target));
  }

  pushReview(sheet, sheet.status, target, actor, decision, note);
  sheet.status = target;
  sheet.reviewedBy = new Types.ObjectId(actor.id);
  sheet.reviewNote = note || '';
  await sheet.save();
  await recordAdminAudit({ actor, action: `content.sheet.${decision}`, targetType: 'sheet', targetId: sheet._id, summary: `Sheet moderation: ${decision}`, metadata: { decision, note: note || '', from: S.PENDING_REVIEW, to: target } });
  return { sheet: Sheet.toPublic(sheet) };
}

export async function publishSheet(id, changelog, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status !== S.APPROVED) {
    throw ApiError.conflict('A sheet must be approved before it can be published');
  }
  if (!sheet.problems.length) throw ApiError.unprocessable('Cannot publish an empty sheet');

  const version = (sheet.publishedVersion ?? 0) + 1;
  const problems = sheet.problems.map((p, index) => ({
    _id: p._id, // stable ids: existing progress rows keep pointing at the same problem
    title: p.title, url: p.url, platform: p.platform, platformLabel: p.platformLabel,
    difficulty: p.difficulty, topic: p.topic, order: index,
    estimatedMinutes: p.estimatedMinutes, externalId: p.externalId, hint: p.hint,
  }));

  const snapshot = await SheetVersion.create({
    sheet: sheet._id,
    version,
    problems,
    problemCount: problems.length,
    title: sheet.title,
    description: sheet.description,
    difficulty: sheet.difficulty,
    topics: sheet.topics,
    changelog: changelog || '',
    publishedBy: new Types.ObjectId(actor.id),
  });

  try {
    pushReview(sheet, sheet.status, S.PUBLISHED, actor, 'publish', changelog || '');
    sheet.status = S.PUBLISHED;
    sheet.publishedVersion = version;
    sheet.publishedProblemCount = problems.length;
    sheet.publishedAt = new Date();
    await sheet.save();
  } catch (error) {
    // Mongo standalone has no transactions; roll back the orphan snapshot.
    await SheetVersion.deleteOne({ _id: snapshot._id }).catch(() => {});
    throw error;
  }

  return { sheet: Sheet.toPublic(sheet), version: SheetVersion.toPublic(snapshot) };
}

export async function listVersions(id, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const versions = await SheetVersion.find({ sheet: sheet._id }).sort({ version: -1 }).lean();
  return { items: versions.map(SheetVersion.toPublic), sheetId: idOf(sheet) };
}

export async function getVersion(id, versionNumber, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const snapshot = await SheetVersion.findOne({ sheet: sheet._id, version: versionNumber }).lean();
  if (!snapshot) throw ApiError.notFound('Version not found');
  return { version: SheetVersion.toPublic(snapshot), problems: snapshot.problems.map((p) => ({
    id: idOf(p._id), title: p.title, url: p.url, platform: p.platform,
    platformLabel: p.platformLabel, difficulty: p.difficulty, topic: p.topic,
    order: p.order, estimatedMinutes: p.estimatedMinutes, hint: p.hint || '',
  })) };
}

/* ───────────────────────────── problems ───────────────────────────── */

/** Always re-detect platform from the URL — client claims are never trusted. */
function toProblemDocument(input, order) {
  const detected = detectPlatform(input.url);
  if (!detected.valid) throw ApiError.unprocessable(`Invalid problem URL: ${input.url}`);
  return {
    title: input.title,
    url: detected.url,
    platform: detected.platform,
    platformLabel: detected.platformLabel,
    difficulty: input.difficulty ?? detected.difficulty,
    topic: input.topic || detected.topic,
    order,
    estimatedMinutes: input.estimatedMinutes ?? 20,
    externalId: detected.externalId,
    hint: input.hint || '',
  };
}

export async function addProblems(id, inputs, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);

  if (sheet.problems.length + inputs.length > SHEET_LIMITS.MAX_PROBLEMS) {
    throw ApiError.unprocessable(`A sheet can hold at most ${SHEET_LIMITS.MAX_PROBLEMS} problems`);
  }

  const existing = new Set(sheet.problems.map((p) => p.externalId).filter(Boolean));
  const batchSeen = new Set();
  let order = sheet.problems.length;
  let added = 0;
  const skipped = [];

  for (const input of inputs) {
    const detected = detectPlatform(input.url);
    if (!detected.valid) { skipped.push({ url: input.url, reason: detected.reason }); continue; }
    if (existing.has(detected.externalId) || batchSeen.has(detected.externalId)) {
      skipped.push({ url: detected.url, reason: 'Already in this sheet' });
      continue;
    }
    batchSeen.add(detected.externalId);
    sheet.problems.push(toProblemDocument(input, order));
    order += 1;
    added += 1;
  }

  if (!added) throw ApiError.conflict('No new problems were added — all links are duplicates or invalid');
  syncTopics(sheet);
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet), added, skipped };
}

export async function updateProblem(id, problemId, patch, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);
  const problem = sheet.problems.id(problemId);
  if (!problem) throw ApiError.notFound('Problem not found in this sheet');

  if (patch.url) {
    const detected = detectPlatform(patch.url);
    if (!detected.valid) throw ApiError.unprocessable('Invalid problem URL');
    problem.url = detected.url;
    problem.platform = detected.platform;
    problem.platformLabel = detected.platformLabel;
    problem.externalId = detected.externalId;
  }
  for (const key of ['title', 'difficulty', 'topic', 'estimatedMinutes', 'hint']) {
    if (patch[key] !== undefined) problem[key] = patch[key];
  }
  syncTopics(sheet);
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function removeProblem(id, problemId, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);
  const problem = sheet.problems.id(problemId);
  if (!problem) throw ApiError.notFound('Problem not found in this sheet');

  const index = sheet.problems.findIndex((p) => idOf(p._id) === idOf(problemId));
  const reordered = sheet.problems.toObject ? sheet.problems.toObject() : [...sheet.problems];
  reordered.splice(index, 1);
  sheet.problems = reordered
    .sort((a, b) => a.order - b.order)
    .map((p, position) => ({ ...p, order: position }));
  syncTopics(sheet);
  await sheet.save();
  // Historical progress rows are intentionally kept: they belong to a version.
  return { sheet: Sheet.toPublic(sheet) };
}

export async function reorderProblems(id, orderedIds, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);

  const current = sheet.problems.map((p) => idOf(p._id));
  if (orderedIds.length !== current.length || new Set(orderedIds).size !== current.length) {
    throw ApiError.unprocessable('orderedIds must contain every problem id exactly once');
  }
  if (current.some((pid) => !orderedIds.includes(pid))) {
    throw ApiError.unprocessable('orderedIds contains an unknown problem id');
  }

  const byId = new Map(sheet.problems.map((p) => [idOf(p._id), p]));
  sheet.problems = orderedIds.map((pid, index) => {
    const problem = byId.get(pid);
    problem.order = index;
    return problem;
  });
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export function parseLinks(text) {
  return parsePastedLinks(text);
}

/* ───────────────────────────── clone ───────────────────────────── */

export async function cloneSheet(id, actor) {
  const { sheet, problems } = await getVisibleSheet(id, actor);
  if (!problems.length) throw ApiError.unprocessable('Cannot clone an empty sheet');

  const copy = await Sheet.create({
    title: `Copy of ${sheet.title}`.slice(0, SHEET_LIMITS.MAX_TITLE),
    slug: uniqueSlug(sheet.title),
    description: sheet.description,
    author: new Types.ObjectId(actor.id),
    difficulty: sheet.difficulty,
    goals: sheet.goals,
    topics: sheet.topics,
    tags: sheet.tags,
    status: S.DRAFT,
    cloneOf: sheet._id,
    // Fresh ids: progress/bookmarks are per-sheet and must never leak across clones.
    problems: problems.map((p, index) => ({
      title: p.title, url: p.url, platform: p.platform, platformLabel: p.platformLabel,
      difficulty: p.difficulty, topic: p.topic, order: index,
      estimatedMinutes: p.estimatedMinutes, externalId: p.externalId, hint: p.hint || '',
    })),
  });
  const plain = copy.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  await Sheet.updateOne({ _id: sheet._id }, { $inc: { cloneCount: 1 } }).catch(() => {});
  return { sheet: Sheet.toPublic(plain), sourceId: idOf(sheet) };
}

/* ───────────────────────────── ratings / reviews ───────────────────────────── */

async function recomputeRatingSummary(sheetId) {
  const [agg] = await SheetRating.aggregate([
    { $match: { sheet: new Types.ObjectId(sheetId) } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Sheet.updateOne({ _id: sheetId }, {
    $set: {
      'ratingSummary.average': Number((agg?.average ?? 0).toFixed(2)),
      'ratingSummary.count': agg?.count ?? 0,
    },
  });
}

export async function listRatings(id, query, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const { items, pagination } = await paginateQuery({ sheet: sheet._id }, SheetRating, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: { path: 'user', select: AUTHOR_FIELDS },
  });
  const own = items.find((item) => idOf(item.user?._id ?? item.user) === idOf(actor.id)) ?? null;
  return {
    items: items.map(SheetRating.toPublic),
    ownRating: own ? SheetRating.toPublic(own) : null,
    pagination,
  };
}

export async function upsertRating(id, payload, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const rating = await SheetRating.findOneAndUpdate(
    { sheet: sheet._id, user: new Types.ObjectId(actor.id) },
    { $set: { rating: payload.rating, review: payload.review || '' } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  await recomputeRatingSummary(sheet._id);
  return { rating: SheetRating.toPublic({ ...rating.toObject(), user: { _id: actor.id, name: 'You' } }) };
}

export async function removeRating(id, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  await SheetRating.deleteOne({ sheet: sheet._id, user: new Types.ObjectId(actor.id) });
  await recomputeRatingSummary(sheet._id);
  return { removed: true };
}

/* ───────────────────────────── reports ───────────────────────────── */

export async function createReport(id, payload, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const duplicate = await SheetReport.findOne({
    sheet: sheet._id, reporter: new Types.ObjectId(actor.id), status: 'open',
  }).lean();
  if (duplicate) throw ApiError.conflict('You already have an open report for this sheet');

  const report = await SheetReport.create({
    sheet: sheet._id,
    reporter: new Types.ObjectId(actor.id),
    reason: payload.reason,
    details: payload.details || '',
  });
  return { report: SheetReport.toPublic(report) };
}

export async function listReports(query, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const filter = query.status ? { status: query.status } : {};
  const { items, pagination } = await paginateQuery(filter, SheetReport, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'reporter', select: AUTHOR_FIELDS }, { path: 'sheet', select: 'title slug' }],
  });
  return { items: items.map(SheetReport.toPublic), pagination };
}

export async function resolveReport(reportId, payload, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  if (!Types.ObjectId.isValid(reportId)) throw ApiError.badRequest('Invalid report id');
  const report = await SheetReport.findById(reportId);
  if (!report) throw ApiError.notFound('Report not found');
  if (report.status !== 'open') throw ApiError.conflict('Report is already closed');

  report.status = payload.status;
  report.resolutionNote = payload.resolutionNote || '';
  report.handledBy = new Types.ObjectId(actor.id);
  report.resolvedAt = new Date();
  await report.save();
  await recordAdminAudit({ actor, action: `report.sheet.${payload.status}`, targetType: 'sheet_report', targetId: report._id, summary: `Sheet report ${payload.status}`, metadata: { status: payload.status, note: payload.resolutionNote || '' } });
  return { report: SheetReport.toPublic(report) };
}

export default { listSheets, getSheet, createSheet };
