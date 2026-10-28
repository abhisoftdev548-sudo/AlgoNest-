import mongoose from 'mongoose';
import {
  PERMISSIONS, REPORT_STATUSES, RESOURCE_EVENT_TYPES as E,
  RESOURCE_STATUSES as S,
} from '@algonest/shared';
import { Resource } from '../../models/Resource.js';
import { ResourceSave } from '../../models/ResourceSave.js';
import { ResourceReaction } from '../../models/ResourceReaction.js';
import { ResourceReport } from '../../models/ResourceReport.js';
import ApiError from '../../utils/ApiError.js';
import { recordAdminAudit } from '../../utils/adminAudit.js';
import { buildPagination } from '../../utils/pagination.js';
import { findResource, isModerator } from './resource.service.js';
import { recordEvent } from './analytics.js';

const { Types } = mongoose;

function assertPublic(doc) {
  if (doc.status !== S.PUBLISHED) throw ApiError.forbidden('Only published resources can be rated, saved or reported');
}

function assertStaff(actor) {
  if (!isModerator(actor) && !actor.permissions?.includes(PERMISSIONS.USER_READ)) {
    throw ApiError.forbidden('Report triage requires staff permission');
  }
}

/* ─────────────────────────── save / unsave ─────────────────────────── */

export async function toggleSave(id, actor, desired = null) {
  const doc = await findResource(id);
  assertPublic(doc);
  const userId = new Types.ObjectId(actor.id);
  const existing = await ResourceSave.findOne({ resource: doc._id, user: userId });
  // `desired` makes the endpoint idempotent (PUT = save, DELETE = unsave).
  if (desired === false && !existing) return { saved: false, saveCount: doc.saveCount ?? 0 };
  if (desired === true && existing) return { saved: true, saveCount: doc.saveCount ?? 0 };
  if (existing) {
    await ResourceSave.deleteOne({ _id: existing._id });
    await Resource.updateOne({ _id: doc._id, saveCount: { $gt: 0 } }, { $inc: { saveCount: -1 } });
    return { saved: false, saveCount: Math.max(0, (doc.saveCount ?? 1) - 1) };
  }
  await ResourceSave.create({ resource: doc._id, user: userId });
  await Resource.updateOne({ _id: doc._id }, { $inc: { saveCount: 1 } });
  await recordEvent(doc, E.SAVE, actor).catch(() => {});
  return { saved: true, saveCount: (doc.saveCount ?? 0) + 1 };
}

export async function listSaved(query, actor) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const filter = { user: new Types.ObjectId(actor.id) };
  const [rows, total] = await Promise.all([
    ResourceSave.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ResourceSave.countDocuments(filter),
  ]);
  const ids = rows.map((row) => row.resource);
  const resources = await Resource.find({ _id: { $in: ids }, status: S.PUBLISHED }).populate('author', 'name').lean();
  const byId = new Map(resources.map((doc) => [String(doc._id), doc]));
  return {
    items: rows.map((row) => ({
      ...ResourceSave.toPublic(row),
      resource: byId.has(String(row.resource)) ? Resource.toPublic(byId.get(String(row.resource)), { saved: true }) : null,
    })).filter((row) => row.resource),
    pagination: buildPagination(page, limit, total),
  };
}

/* ─────────────────────────── ratings & feedback ─────────────────────────── */

async function recomputeRatings(resourceId) {
  const [summary] = await ResourceReaction.aggregate([
    { $match: { resource: resourceId, rating: { $ne: null } } },
    { $group: { _id: null, ratingCount: { $sum: 1 }, ratingSum: { $sum: '$rating' } } },
    { $project: { _id: 0 } },
  ]);
  const counts = summary ?? { ratingCount: 0, ratingSum: 0 };
  await Resource.updateOne({ _id: resourceId }, { $set: counts });
  return counts;
}

async function recomputeFeedback(resourceId) {
  const [helpful, notHelpful] = await Promise.all([
    ResourceReaction.countDocuments({ resource: resourceId, helpful: true }),
    ResourceReaction.countDocuments({ resource: resourceId, helpful: false }),
  ]);
  await Resource.updateOne({ _id: resourceId }, { $set: { helpfulCount: helpful, notHelpfulCount: notHelpful } });
  return { helpfulCount: helpful, notHelpfulCount: notHelpful };
}

/** Upsert one star rating. Only the author of a review may change it. */
export async function rateResource(id, payload, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  if (String(doc.author?._id ?? doc.author) === String(actor.id)) {
    throw ApiError.forbidden('You cannot rate your own submission');
  }
  const userId = new Types.ObjectId(actor.id);
  await ResourceReaction.findOneAndUpdate(
    { resource: doc._id, user: userId },
    { $set: { rating: payload.rating, review: payload.review || '' }, $setOnInsert: { resource: doc._id, user: userId } },
    { upsert: true, new: true, runValidators: true },
  );
  const counts = await recomputeRatings(doc._id);
  const reaction = await ResourceReaction.findOne({ resource: doc._id, user: userId }).lean();
  return {
    reaction: ResourceReaction.toPublic(reaction),
    ratingAverage: counts.ratingCount ? Math.round((counts.ratingSum / counts.ratingCount) * 10) / 10 : 0,
    ...counts,
  };
}

/** `helpful: null` withdraws the vote without touching the star rating. */
export async function setFeedback(id, payload, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  const userId = new Types.ObjectId(actor.id);
  await ResourceReaction.findOneAndUpdate(
    { resource: doc._id, user: userId },
    { $set: { helpful: payload.helpful }, $setOnInsert: { resource: doc._id, user: userId } },
    { upsert: true, new: true, runValidators: true },
  );
  const counts = await recomputeFeedback(doc._id);
  const reaction = await ResourceReaction.findOne({ resource: doc._id, user: userId }).lean();
  return { reaction: ResourceReaction.toPublic(reaction), ...counts };
}

export async function listRatings(id, query, actor) {
  const doc = await findResource(id);
  if (doc.status !== S.PUBLISHED && !isModerator(actor) && String(doc.author?._id ?? doc.author) !== String(actor.id)) {
    throw ApiError.notFound('Resource not found');
  }
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const filter = { resource: doc._id, rating: { $ne: null } };
  const [rows, total] = await Promise.all([
    ResourceReaction.find(filter).populate('user', 'name').sort({ updatedAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    ResourceReaction.countDocuments(filter),
  ]);
  return { items: rows.map((row) => ResourceReaction.toPublic(row)), pagination: buildPagination(page, limit, total) };
}

/* ─────────────────────────── reports ─────────────────────────── */

export async function reportResource(id, payload, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  const reporter = new Types.ObjectId(actor.id);
  const open = await ResourceReport.findOne({ resource: doc._id, reporter, status: REPORT_STATUSES.OPEN });
  if (open) throw ApiError.conflict('You already have an open report for this resource');
  const report = await ResourceReport.create({
    resource: doc._id, reporter, reason: payload.reason, details: payload.details,
  });
  await Resource.updateOne({ _id: doc._id }, { $inc: { reportCount: 1 } });
  // A broken-link report nudges the checker without waiting for the nightly job.
  if (payload.reason === 'broken_link') {
    await Resource.updateOne({ _id: doc._id }, { $set: { linkCheckedAt: null } });
  }
  return { report: ResourceReport.toPublic(report) };
}

export async function listReports(query, actor) {
  assertStaff(actor);
  const filter = {};
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const [rows, total] = await Promise.all([
    ResourceReport.find(filter).populate('reporter', 'name').populate('handledBy', 'name')
      .populate('resource', 'title url status')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ResourceReport.countDocuments(filter),
  ]);
  return { items: rows.map((row) => ResourceReport.toPublic(row)), pagination: buildPagination(page, limit, total) };
}

export async function resolveReport(id, payload, actor) {
  assertStaff(actor);
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid report id');
  const report = await ResourceReport.findById(id);
  if (!report) throw ApiError.notFound('Report not found');
  if (report.status !== REPORT_STATUSES.OPEN) throw ApiError.conflict('This report has already been handled');
  report.status = payload.status;
  report.resolutionNote = payload.note || '';
  report.handledBy = new Types.ObjectId(actor.id);
  report.resolvedAt = new Date();
  await report.save();
  await recordAdminAudit({ actor, action: `report.resource.${payload.status}`, targetType: 'resource_report', targetId: report._id, summary: `Resource report ${payload.status}`, metadata: { status: payload.status, note: payload.note || '' } });
  return { report: ResourceReport.toPublic(report) };
}

/* ─────────────────────────── analytics events ─────────────────────────── */

/** `start` = learner opened the external link; `completion` = marked it done. */
export async function trackEvent(id, type, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  if (type === E.SAVE) throw ApiError.badRequest('Use the save endpoint to record a save');
  const result = await recordEvent(doc, type, actor);
  return { ...result, url: type === E.START ? doc.url : undefined };
}
