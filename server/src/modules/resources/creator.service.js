import mongoose from 'mongoose';
import { CREATOR_LIMITS, PERMISSIONS, RESOURCE_STATUSES as S } from '@algonest/shared';
import { CreatorProfile } from '../../models/CreatorProfile.js';
import { Resource } from '../../models/Resource.js';
import { ResourceEvent } from '../../models/ResourceEvent.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { summariseEvents } from './analytics.js';

const { Types } = mongoose;

async function defaultProfile(actor) {
  const user = await User.findById(actor.id).select('name').lean();
  return {
    user: new Types.ObjectId(actor.id),
    displayName: user?.name || 'AlgoNest creator',
    headline: '', bio: '', website: '', expertise: [], socials: [], verified: false,
  };
}

/** Lazily materialise a profile so a creator page works before the first edit. */
export async function getOrCreateProfile(userId, actor) {
  if (!Types.ObjectId.isValid(userId)) throw ApiError.badRequest('Invalid creator id');
  const objectId = new Types.ObjectId(userId);
  let profile = await CreatorProfile.findOne({ user: objectId }).populate('user', 'name');
  if (!profile) {
    if (String(userId) !== String(actor.id) && !actor.permissions?.includes(PERMISSIONS.USER_READ)) {
      throw ApiError.notFound('Creator not found');
    }
    const seed = await defaultProfile({ id: userId });
    profile = await CreatorProfile.create(seed);
    profile = await CreatorProfile.findById(profile._id).populate('user', 'name');
  }
  return profile;
}

export async function getMyProfile(actor) {
  const profile = await getOrCreateProfile(actor.id, actor);
  return { profile: CreatorProfile.toPublic(profile, { isOwner: true }) };
}

export async function upsertMyProfile(payload, actor) {
  const profile = await getOrCreateProfile(actor.id, actor);
  for (const key of ['displayName', 'headline', 'bio', 'website', 'expertise', 'socials']) {
    if (payload[key] !== undefined) profile[key] = payload[key];
  }
  profile.markModified('expertise');
  profile.markModified('socials');
  await profile.save();
  return { profile: CreatorProfile.toPublic(profile, { isOwner: true }) };
}

async function aggregateFor(userId) {
  const [totals] = await Resource.aggregate([
    { $match: { author: new Types.ObjectId(userId), status: S.PUBLISHED } },
    { $group: {
      _id: null,
      publishedResources: { $sum: 1 },
      views: { $sum: '$viewCount' }, saves: { $sum: '$saveCount' },
      starts: { $sum: '$startCount' }, completions: { $sum: '$completionCount' },
      ratingCount: { $sum: '$ratingCount' }, ratingSum: { $sum: '$ratingSum' },
    } },
    { $project: { _id: 0 } },
  ]);
  return totals ?? { publishedResources: 0, views: 0, saves: 0, starts: 0, completions: 0, ratingCount: 0, ratingSum: 0 };
}

/** Public creator page: profile + published resources + headline aggregates. */
export async function getCreator(id, actor, query = {}) {
  const profile = await getOrCreateProfile(id, actor);
  const isOwner = String(profile.user?._id ?? profile.user) === String(actor.id);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const filter = { author: profile.user?._id ?? profile.user, status: S.PUBLISHED };
  const [items, total, stats] = await Promise.all([
    Resource.find(filter).populate('author', 'name').sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    Resource.countDocuments(filter),
    aggregateFor(profile.user?._id ?? profile.user),
  ]);
  return {
    profile: CreatorProfile.toPublic(profile, {
      isOwner,
      stats,
      resources: items.map((doc) => Resource.toPublic(doc)),
    }),
    pagination: buildPagination(page, limit, total),
  };
}

export async function listCreators(query) {
  const filter = {};
  if (query.q?.trim()) filter.$text = { $search: query.q.trim() };
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    CreatorProfile.find(filter).populate('user', 'name').sort({ verified: -1, createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    CreatorProfile.countDocuments(filter),
  ]);
  return { items: items.map((doc) => CreatorProfile.toPublic(doc)), pagination: buildPagination(page, limit, total) };
}

/**
 * Creator analytics. Own profile only, unless the caller has `analytics:read`.
 * Time-series comes from the append-only ResourceEvent collection; headline
 * totals come from the denormalised Resource counters (cheap and consistent).
 */
export async function getAnalytics(actor, query = {}, { creatorId = null } = {}) {
  const target = creatorId ?? actor.id;
  if (!Types.ObjectId.isValid(target)) throw ApiError.badRequest('Invalid creator id');
  const canReadAll = actor.permissions?.includes(PERMISSIONS.ANALYTICS_READ)
    || actor.permissions?.includes(PERMISSIONS.USER_READ);
  if (String(target) !== String(actor.id) && !canReadAll) {
    throw ApiError.forbidden('You can only view your own analytics');
  }
  const days = Math.min(90, Math.max(1, Number(query.days) || CREATOR_LIMITS.ANALYTICS_DAYS));
  const since = new Date(Date.now() - (days - 1) * 86_400_000);
  since.setUTCHours(0, 0, 0, 0);
  const creator = new Types.ObjectId(target);
  const [events, totals] = await Promise.all([
    ResourceEvent.aggregate([
      { $match: { creator, createdAt: { $gte: since } } },
      { $group: { _id: { resource: '$resource', type: '$type', dayKey: '$dayKey' }, count: { $sum: 1 } } },
      { $project: { _id: 0, resource: '$_id.resource', type: '$_id.type', dayKey: '$_id.dayKey', count: 1 } },
    ]),
    aggregateFor(creator),
  ]);
  const summary = summariseEvents(events, days);
  const topIds = summary.topResources.map((row) => new Types.ObjectId(row.resource));
  const resources = topIds.length
    ? await Resource.find({ _id: { $in: topIds }, author: creator, status: S.PUBLISHED })
      .select('title slug').lean()
    : [];
  const byId = new Map(resources.map((doc) => [String(doc._id), doc]));
  const topResources = summary.topResources.slice(0, CREATOR_LIMITS.TOP_RESOURCES).map((row) => {
    const resource = byId.get(row.resource);
    return {
      ...row,
      title: resource?.title ?? 'Removed resource',
      slug: resource?.slug ?? '',
      url: resource ? `/app/resources/${resource._id}` : null,
    };
  });
  const rate = (numerator, denominator) => denominator ? Math.round((numerator / denominator) * 1000) / 10 : 0;
  return {
    days,
    creatorId: String(creator),
    totals: {
      ...totals,
      ratingAverage: totals.ratingCount ? Math.round((totals.ratingSum / totals.ratingCount) * 10) / 10 : 0,
    },
    window: summary.totals,
    series: summary.series,
    topResources,
    conversion: {
      saveRate: rate(totals.saves, totals.views),
      startRate: rate(totals.starts, totals.views),
      completionRate: rate(totals.completions, totals.starts),
    },
  };
}
