import mongoose from 'mongoose';
import {
  PERMISSIONS, RESOURCE_STATUS_VALUES, RESOURCE_STATUSES as S, ROLES,
} from '@algonest/shared';
import { Resource } from '../../models/Resource.js';
import { ResourceSave } from '../../models/ResourceSave.js';
import { ResourceReaction } from '../../models/ResourceReaction.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { recordAdminAudit } from '../../utils/adminAudit.js';
import { buildPagination } from '../../utils/pagination.js';
import { uniqueSlug } from '../../utils/slug.js';
import { normaliseForStorage, urlKeyFor } from './resourceUrl.js';
import { classify, checkLink, selectCandidates } from './linkChecker.js';
import { DECISION_TO_STATUS, canTransition, isEditable, isStaff, transitionError } from './resourceWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';
const isModerator = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
const ownerOf = (doc, actor) => String(doc.author?._id ?? doc.author) === String(actor.id);
const canManage = (doc, actor) => ownerOf(doc, actor) || isModerator(actor);

function normaliseOr400(rawUrl) {
  try { return normaliseForStorage(rawUrl); }
  catch (error) { throw ApiError.unprocessable(error.message || 'Invalid URL'); }
}

function assertManage(doc, actor) {
  if (!canManage(doc, actor)) throw ApiError.forbidden('Only the author or a content moderator can change this resource');
}

async function findResource(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid resource id');
  const doc = await Resource.findById(id).populate('author', AUTHOR_FIELDS);
  if (!doc) throw ApiError.notFound('Resource not found');
  return doc;
}

function pushReview(doc, from, to, actor, decision, note) {
  doc.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  if (doc.reviewHistory.length > 20) doc.reviewHistory = doc.reviewHistory.slice(-20);
}

async function viewerState(resourceId, actor) {
  const userId = new Types.ObjectId(actor.id);
  const [save, reaction] = await Promise.all([
    ResourceSave.findOne({ resource: resourceId, user: userId }).lean(),
    ResourceReaction.findOne({ resource: resourceId, user: userId }).lean(),
  ]);
  return { saved: Boolean(save), myReaction: reaction };
}

/* ─────────────────────────── duplicate detection ─────────────────────────── */

/** Pure normalisation + DB lookup. Never fetches the URL. */
export async function checkDuplicate(rawUrl, actor, { excludeId = null } = {}) {
  const key = urlKeyFor(rawUrl);
  if (!key) throw ApiError.unprocessable('That link is not a valid http(s) URL');
  const filter = { urlKey: key, status: { $ne: S.ARCHIVED } };
  if (excludeId) filter._id = { $ne: new Types.ObjectId(excludeId) };
  const existing = await Resource.findOne(filter).select('title url status author publishedAt').lean();
  if (!existing) return { duplicate: false, resource: null, urlKey: key };
  // Only reveal the author's own duplicate to non-staff; staff/mod see details.
  const visible = ownerOf(existing, actor) || isModerator(actor) || existing.status === S.PUBLISHED;
  return {
    duplicate: true,
    urlKey: key,
    resource: visible
      ? { id: String(existing._id), title: existing.title, status: existing.status, url: existing.url }
      : { id: null, title: 'A submission with this link already exists', status: existing.status, url: null },
  };
}

async function assertNoDuplicate(rawUrl, actor, excludeId = null) {
  const result = await checkDuplicate(rawUrl, actor, { excludeId });
  if (result.duplicate) {
    throw ApiError.conflict(`This link is already in the directory${result.resource?.id ? ` as "${result.resource.title}"` : ''}. Submit a different URL.`);
  }
  return result.urlKey;
}

/* ─────────────────────────── list / read ─────────────────────────── */

export async function listResources(query, actor) {
  const filter = {};
  const savedOnly = query.saved === 'true';
  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = query.status ?? { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    filter.status = query.status;
  } else {
    filter.status = S.PUBLISHED;
  }
  if (query.q?.trim()) filter.$text = { $search: query.q.trim() };
  for (const key of ['topic', 'level', 'language', 'type', 'pricing', 'platform', 'linkStatus']) {
    if (query[key]) filter[key] = query[key];
  }
  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { saveCount: -1, viewCount: -1, createdAt: -1 },
    rating: { ratingSum: -1, ratingCount: -1, createdAt: -1 },
    title: { title: 1 },
  };
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  let items;
  let total;
  if (savedOnly) {
    const userId = new Types.ObjectId(actor.id);
    const [pageResult] = await Resource.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: ResourceSave.collection.name,
          let: { resourceId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ['$resource', '$$resourceId'] },
              { $eq: ['$user', userId] },
            ] } } },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: 'viewerSave',
        },
      },
      { $match: { 'viewerSave.0': { $exists: true } } },
      { $sort: sorts[query.sort] ?? sorts.newest },
      { $facet: {
        items: [{ $skip: (page - 1) * limit }, { $limit: limit }, { $project: { _id: 1 } }],
        total: [{ $count: 'count' }],
      } },
    ]);
    const ids = (pageResult?.items ?? []).map((row) => row._id);
    const documents = ids.length
      ? await Resource.find({ _id: { $in: ids } }).populate('author', AUTHOR_FIELDS).lean()
      : [];
    const byId = new Map(documents.map((doc) => [String(doc._id), doc]));
    items = ids.map((id) => byId.get(String(id))).filter(Boolean);
    total = pageResult?.total?.[0]?.count ?? 0;
  } else {
    [items, total] = await Promise.all([
      Resource.find(filter).populate('author', AUTHOR_FIELDS).sort(sorts[query.sort] ?? sorts.newest)
        .skip((page - 1) * limit).limit(limit).lean(),
      Resource.countDocuments(filter),
    ]);
  }
  const ids = items.map((item) => item._id);
  const [saves, reactions] = await Promise.all([
    ResourceSave.find({ user: new Types.ObjectId(actor.id), resource: { $in: ids } }).select('resource').lean().catch(() => []),
    ResourceReaction.find({ user: new Types.ObjectId(actor.id), resource: { $in: ids } }).lean().catch(() => []),
  ]);
  const savedSet = new Set(saves.map((row) => String(row.resource)));
  const reactionMap = new Map(reactions.map((row) => [String(row.resource), row]));
  return {
    items: items.map((doc) => Resource.toPublic(doc, {
      saved: savedSet.has(String(doc._id)),
      myReaction: reactionMap.get(String(doc._id)) ?? null,
      canManage: canManage(doc, actor),
    })),
    pagination: buildPagination(page, limit, total),
  };
}

/**
 * Detail + a deduplicated `view` event. Only published resources are publicly
 * readable; drafts stay with the author and moderators.
 */
export async function getResource(id, actor, { recordView = true } = {}) {
  const doc = await findResource(id);
  const manage = canManage(doc, actor);
  if (!manage && doc.status !== S.PUBLISHED) throw ApiError.notFound('Resource not found');
  const { saved, myReaction } = await viewerState(doc._id, actor);
  if (recordView && doc.status === S.PUBLISHED) {
    const { recordEvent } = await import('./analytics.js');
    await recordEvent(doc, 'view', actor).catch(() => {});
    doc.viewCount = (doc.viewCount ?? 0) + 1;
  }
  return { resource: Resource.toPublic(doc, { saved, myReaction, canManage: manage }) };
}

/* ─────────────────────────── create / update ─────────────────────────── */

export async function createResource(payload, actor) {
  const normalised = normaliseOr400(payload.url);
  await assertNoDuplicate(payload.url, actor);
  const status = payload.submit ? S.PENDING_REVIEW : S.DRAFT;
  const doc = await Resource.create({
    title: payload.title,
    slug: uniqueSlug(payload.title),
    url: normalised.url,
    urlKey: normalised.urlKey,
    description: payload.description,
    type: payload.type,
    topic: payload.topic,
    level: payload.level,
    language: payload.language,
    pricing: payload.pricing,
    tags: payload.tags,
    platform: normalised.platform,
    platformLabel: normalised.platformLabel,
    host: normalised.host,
    author: new Types.ObjectId(actor.id),
    status,
    submittedAt: status === S.PENDING_REVIEW ? new Date() : null,
  });
  const plain = doc.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return { resource: Resource.toPublic(plain, { canManage: true }) };
}

export async function updateResource(id, payload, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (!isEditable(doc.status) || doc.status === S.PUBLISHED) {
    throw ApiError.conflict(`A ${doc.status} resource cannot be edited. Start a revision first.`);
  }
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Restore the resource before editing it');
  if (payload.url) {
    const normalised = normaliseOr400(payload.url);
    await assertNoDuplicate(payload.url, actor, id);
    doc.url = normalised.url;
    doc.urlKey = normalised.urlKey;
    doc.platform = normalised.platform;
    doc.platformLabel = normalised.platformLabel;
    doc.host = normalised.host;
    // A changed link must be re-verified.
    doc.linkStatus = 'unchecked';
    doc.linkCheckedAt = null;
    doc.consecutiveFailures = 0;
  }
  for (const key of ['title', 'description', 'type', 'topic', 'level', 'language', 'pricing', 'tags']) {
    if (payload[key] !== undefined) doc[key] = payload[key];
  }
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

/* ─────────────────────────── lifecycle ─────────────────────────── */

export async function submitResource(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (!canTransition(doc.status, S.PENDING_REVIEW)) throw ApiError.conflict(transitionError(doc.status, S.PENDING_REVIEW));
  pushReview(doc, doc.status, S.PENDING_REVIEW, actor, 'submit', '');
  doc.status = S.PENDING_REVIEW;
  doc.submittedAt = new Date();
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function startRevision(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (doc.status !== S.PUBLISHED) throw ApiError.conflict('Only a published resource can start a revision');
  pushReview(doc, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  doc.status = S.DRAFT;
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function moderateResource(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const doc = await findResource(id);
  if (ownerOf(doc, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a resource you submitted');
  }
  if (doc.status !== S.PENDING_REVIEW) throw ApiError.conflict('Only resources in review can be moderated');
  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(doc.status, target)) throw ApiError.conflict(transitionError(doc.status, target));
  pushReview(doc, doc.status, target, actor, decision, note);
  doc.status = target;
  doc.reviewedBy = new Types.ObjectId(actor.id);
  doc.reviewNote = note || '';
  await doc.save();
  await recordAdminAudit({ actor, action: `content.resource.${decision}`, targetType: 'resource', targetId: doc._id, summary: `Resource moderation: ${decision}`, metadata: { decision, note: note || '', from: 'pending_review', to: target } });
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

/** Approve + publish are merged for resources: one click, one immutable-ish URL. */
export async function publishResource(id, actor, { autoPublish = false } = {}) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (autoPublish) {
    if (!isStaff(actor)) throw ApiError.forbidden('Direct publishing requires staff permission');
  } else if (doc.status !== S.APPROVED) {
    throw ApiError.conflict('A resource must be approved before it can be published');
  }
  if (doc.status === S.PUBLISHED) throw ApiError.conflict('Resource is already published');
  pushReview(doc, doc.status, S.PUBLISHED, actor, 'publish', '');
  doc.status = S.PUBLISHED;
  doc.publishedAt = new Date();
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function archiveResource(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (!canTransition(doc.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(doc.status, S.ARCHIVED));
  pushReview(doc, doc.status, S.ARCHIVED, actor, 'archive', '');
  doc.status = S.ARCHIVED;
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function restoreResource(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (doc.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived resource can be restored');
  await assertNoDuplicate(doc.url, actor, id);
  pushReview(doc, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  doc.status = S.DRAFT;
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

/* ─────────────────────────── broken-link checks ─────────────────────────── */

async function applyCheck(doc, result) {
  const next = classify(doc, result);
  doc.linkStatus = next.linkStatus;
  doc.linkHttpStatus = next.linkHttpStatus;
  doc.linkCheckedAt = next.linkCheckedAt;
  doc.linkCheckError = next.linkCheckError;
  doc.linkCheckHops = next.linkCheckHops;
  doc.consecutiveFailures = next.consecutiveFailures;
  await doc.save();
  return { ...next, id: String(doc._id), url: doc.url };
}

/** Staff-only, on-demand single check. */
export async function checkResourceLink(id, actor) {
  if (!isModerator(actor) && !actor.permissions?.includes(PERMISSIONS.ANALYTICS_READ)) {
    throw ApiError.forbidden('Link checks require staff permission');
  }
  const doc = await findResource(id);
  const result = await checkLink(doc.url);
  return { result: await applyCheck(doc, result), resource: Resource.toPublic(doc, { canManage: true }) };
}

/** Staff-only bounded batch. The CLI job uses the same pure helpers. */
export async function runLinkCheckBatch(query, actor) {
  if (!isModerator(actor) && !actor.permissions?.includes(PERMISSIONS.ANALYTICS_READ)) {
    throw ApiError.forbidden('Link checks require staff permission');
  }
  const pool = await Resource.find({ status: S.PUBLISHED }).select('url urlKey status linkStatus linkCheckedAt consecutiveFailures').lean();
  const candidates = selectCandidates(pool, { force: query.force === 'true', limit: query.limit });
  const results = [];
  for (const candidate of candidates) {
    const doc = await Resource.findById(candidate._id);
    if (!doc) continue;
    const result = await checkLink(doc.url);
    results.push(await applyCheck(doc, result));
  }
  return {
    checked: results.length,
    broken: results.filter((item) => item.linkStatus === 'broken').length,
    flagged: results.filter((item) => item.flagged).length,
    results,
  };
}

export { findResource, canManage, ownerOf, isModerator, applyCheck };
