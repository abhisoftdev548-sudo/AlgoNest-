import { ROLE_PERMISSIONS, USER_STATUSES } from '@algonest/shared';
import { Attempt } from '../../models/Attempt.js';
import { AdminAuditLog } from '../../models/AdminAuditLog.js';
import { CreatorProfile } from '../../models/CreatorProfile.js';
import { FeatureFlag } from '../../models/FeatureFlag.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import { Quiz } from '../../models/Quiz.js';
import { Resource } from '../../models/Resource.js';
import { ResourceEvent } from '../../models/ResourceEvent.js';
import { ResourceReport } from '../../models/ResourceReport.js';
import { Sheet } from '../../models/Sheet.js';
import { SheetReport } from '../../models/SheetReport.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { recordAdminAudit } from '../../utils/adminAudit.js';
import * as sheetService from '../sheets/sheet.service.js';
import * as quizService from '../quizzes/quiz.service.js';
import * as resourceService from '../resources/resource.service.js';
import * as userService from '../users/user.service.js';
import * as sheetReports from '../sheets/sheet.service.js';
import * as resourceInteractions from '../resources/interaction.service.js';

const CONTENT_MODELS = { sheet: Sheet, quiz: Quiz, resource: Resource };
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const startOfDay = (date) => { const value = new Date(date); value.setUTCHours(0, 0, 0, 0); return value; };
const actorShape = (user) => ({ id: String(user._id ?? user.id), role: user.role, permissions: ROLE_PERMISSIONS[user.role] ?? [] });

export async function getOverview(permissions = []) {
  const now = new Date();
  const canUsers = permissions.includes('user:read');
  const canModerate = permissions.includes('content:moderate');
  const canAnalytics = permissions.includes('analytics:read');
  const day = new Date(now.getTime() - 86_400_000);
  const month = new Date(now.getTime() - 30 * 86_400_000);
  const [totalUsers, activeUsers, suspendedUsers, bannedUsers, pendingSheets, pendingQuizzes, pendingResources, openSheetReports, openResourceReports, completedAttempts, completedMocks, dauUsers, mauUsers, signups, quizAccuracy, topicStats] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: USER_STATUSES.ACTIVE }),
    User.countDocuments({ status: USER_STATUSES.SUSPENDED }),
    User.countDocuments({ status: USER_STATUSES.BANNED }),
    Sheet.countDocuments({ status: 'pending_review' }),
    Quiz.countDocuments({ status: 'pending_review' }),
    Resource.countDocuments({ status: 'pending_review' }),
    SheetReport.countDocuments({ status: 'open' }),
    ResourceReport.countDocuments({ status: 'open' }),
    Attempt.countDocuments({ status: { $in: ['submitted', 'timed_out'] } }),
    MockAttempt.countDocuments({ status: { $in: ['submitted', 'timed_out'] } }),
    activeUserIds(day),
    activeUserIds(month),
    User.aggregate([{ $match: { createdAt: { $gte: month } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Attempt.aggregate([{ $match: { status: { $in: ['submitted', 'timed_out'] }, submittedAt: { $gte: month } } }, { $group: { _id: null, averagePercentage: { $avg: '$percentage' }, attempts: { $sum: 1 }, averageAccuracy: { $avg: { $cond: [{ $gt: ['$attemptedCount', 0] }, { $multiply: [{ $divide: ['$correctCount', '$attemptedCount'] }, 100] }, 0] } } } }]),
    Attempt.aggregate([{ $match: { status: { $in: ['submitted', 'timed_out'] }, submittedAt: { $gte: month } } }, { $unwind: '$topicStats' }, { $group: { _id: '$topicStats.topic', attempts: { $sum: '$topicStats.total' }, correct: { $sum: '$topicStats.correct' }, averageAccuracy: { $avg: '$topicStats.percentage' } } }, { $sort: { attempts: -1 } }, { $limit: 8 }]),
  ]);
  const signupMap = new Map(signups.map((row) => [row._id, row.count]));
  const seriesStart = new Date(startOfDay(now).getTime() - 29 * 86_400_000);
  const signupSeries = Array.from({ length: 30 }, (_, offset) => {
    const date = new Date(seriesStart.getTime() + offset * 86_400_000);
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: signupMap.get(key) ?? 0 };
  });
  return {
    users: canUsers ? { total: totalUsers, active: activeUsers, suspended: suspendedUsers, banned: bannedUsers } : null,
    moderation: canModerate ? { pending: pendingSheets + pendingQuizzes + pendingResources, sheets: pendingSheets, quizzes: pendingQuizzes, resources: pendingResources, openReports: openSheetReports + openResourceReports } : null,
    engagement: canAnalytics ? { dau: dauUsers.length, mau: mauUsers.length, completedQuizAttempts: completedAttempts, completedMocks } : null,
    signups: canAnalytics ? { last30Days: signups.reduce((sum, row) => sum + row.count, 0), series: signupSeries } : null,
    quizPerformance: canAnalytics ? { attempts: quizAccuracy[0]?.attempts ?? 0, averageScore: round(quizAccuracy[0]?.averagePercentage ?? 0), averageAccuracy: round(quizAccuracy[0]?.averageAccuracy ?? 0) } : null,
    popularTopics: canAnalytics ? topicStats.map((row) => ({ topic: row._id || 'General', attempts: row.attempts, accuracy: round(row.averageAccuracy ?? (row.attempts ? row.correct / row.attempts * 100 : 0)) })) : null,
    generatedAt: now.toISOString(),
  };
}

async function activeUserIds(since) {
  const [quiz, mock, resource] = await Promise.all([
    Attempt.distinct('user', { createdAt: { $gte: since } }),
    MockAttempt.distinct('user', { createdAt: { $gte: since } }),
    ResourceEvent.distinct('user', { createdAt: { $gte: since } }),
  ]);
  return [...new Set([...quiz, ...mock, ...resource].map(String))];
}
const round = (number) => Math.round(Number(number || 0) * 10) / 10;

export async function listModeration({ page, limit, type = 'all' }) {
  const types = type === 'all' ? ['sheet', 'quiz', 'resource'] : [type];
  const take = page * limit;
  const queries = types.map(async (kind) => {
    const Model = CONTENT_MODELS[kind];
    const [rows, total] = await Promise.all([
      Model.find({ status: 'pending_review' }).populate('author', 'name email').sort({ submittedAt: 1, createdAt: 1 }).limit(take).lean(),
      Model.countDocuments({ status: 'pending_review' }),
    ]);
    return { rows: rows.map((doc) => ({ type: kind, id: String(doc._id), title: doc.title, description: doc.description || '', author: doc.author ? { id: String(doc.author._id), name: doc.author.name, email: doc.author.email } : null, status: doc.status, submittedAt: doc.submittedAt, createdAt: doc.createdAt, topics: doc.topics ?? (doc.topic ? [doc.topic] : []), reviewNote: doc.reviewNote || '', href: `/app/${kind === 'sheet' ? 'sheets' : kind === 'quiz' ? 'quizzes' : 'resources'}/${doc._id}` })), total };
  });
  const sources = await Promise.all(queries);
  const sorted = sources.flatMap((source) => source.rows).sort((a, b) => new Date(a.submittedAt ?? a.createdAt) - new Date(b.submittedAt ?? b.createdAt));
  const total = sources.reduce((sum, source) => sum + source.total, 0);
  return { items: sorted.slice((page - 1) * limit, page * limit), pagination: buildPagination(page, limit, total) };
}

export async function moderate({ type, id, decision, note }, actor) {
  const dispatch = { sheet: sheetService.moderateSheet, quiz: quizService.moderateQuiz, resource: resourceService.moderateResource };
  const result = await dispatch[type](id, decision, note, actorShape(actor));
  return result;
}

export async function listUsers(query) {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.q) {
    const search = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ name: search }, { email: search }];
  }
  const [users, total] = await Promise.all([
    User.find(filter).select('name email role status goal onboardingCompleted createdAt lastLoginAt').sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).lean(),
    User.countDocuments(filter),
  ]);
  const ids = users.map((user) => user._id);
  const profiles = await CreatorProfile.find({ user: { $in: ids } }).select('user verified').lean();
  const verified = new Set(profiles.filter((item) => item.verified).map((item) => String(item.user)));
  return { items: users.map((user) => ({ id: String(user._id), name: user.name, email: user.email, role: user.role, status: user.status, goal: user.goal, onboardingCompleted: user.onboardingCompleted, verifiedCreator: verified.has(String(user._id)), createdAt: user.createdAt, lastLoginAt: user.lastLoginAt })), pagination: buildPagination(query.page, query.limit, total) };
}

export async function setRole(id, role, actor) { return userService.updateUserRole(id, role, actor._id); }
export async function setStatus(id, status, actor) { return userService.updateUserStatus(id, status, actor._id); }

export async function verifyCreator(userId, verified, actor) {
  const user = await User.findById(userId).select('name');
  if (!user) throw ApiError.notFound('User not found');
  const profile = await CreatorProfile.findOneAndUpdate(
    { user: userId },
    { $set: { verified }, $setOnInsert: { displayName: user.name, user: userId, headline: '', bio: '', website: '', expertise: [], socials: [] } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  await recordAdminAudit({ actor, action: verified ? 'creator.verified' : 'creator.unverified', targetType: 'creator_profile', targetId: profile._id, summary: `Creator verification ${verified ? 'granted' : 'revoked'}`, metadata: { userId: String(userId), verified } });
  return { userId: String(userId), verified: profile.verified };
}

export async function listReports({ page, limit, status }) {
  const [sheetRows, resourceRows, sheetTotal, resourceTotal] = await Promise.all([
    SheetReport.find({ status }).populate('reporter', 'name').populate('sheet', 'title').sort({ createdAt: -1 }).limit(page * limit).lean(),
    ResourceReport.find({ status }).populate('reporter', 'name').populate('resource', 'title').sort({ createdAt: -1 }).limit(page * limit).lean(),
    SheetReport.countDocuments({ status }), ResourceReport.countDocuments({ status }),
  ]);
  const items = [
    ...sheetRows.map((item) => ({ id: String(item._id), type: 'sheet', target: item.sheet?.title ?? 'Removed sheet', targetId: String(item.sheet?._id ?? item.sheet), reporter: item.reporter?.name ?? 'User', reason: item.reason, details: item.details || '', status: item.status, createdAt: item.createdAt })),
    ...resourceRows.map((item) => ({ id: String(item._id), type: 'resource', target: item.resource?.title ?? 'Removed resource', targetId: String(item.resource?._id ?? item.resource), reporter: item.reporter?.name ?? 'User', reason: item.reason, details: item.details || '', status: item.status, createdAt: item.createdAt })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { items: items.slice((page - 1) * limit, page * limit), pagination: buildPagination(page, limit, sheetTotal + resourceTotal) };
}

export async function resolveReport({ type, id, status, note }, actor) {
  if (type === 'sheet') return sheetReports.resolveReport(id, { status, resolutionNote: note }, actorShape(actor));
  return resourceInteractions.resolveReport(id, { status, note }, actorShape(actor));
}

export async function listAudit(query) {
  const filter = {};
  if (query.action) filter.action = query.action;
  if (query.targetType) filter.targetType = query.targetType;
  if (query.from || query.to) filter.createdAt = { ...(query.from ? { $gte: query.from } : {}), ...(query.to ? { $lte: query.to } : {}) };
  const [items, total] = await Promise.all([
    AdminAuditLog.find(filter).populate('actor', 'name email role').sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).lean(),
    AdminAuditLog.countDocuments(filter),
  ]);
  return { items: items.map((log) => ({ id: String(log._id), action: log.action, targetType: log.targetType, targetId: log.targetId, summary: log.summary, metadata: log.metadata, actor: log.actor ? { id: String(log.actor._id), name: log.actor.name, email: log.actor.email, role: log.actor.role } : null, requestId: log.requestId, ip: log.ip, createdAt: log.createdAt })), pagination: buildPagination(query.page, query.limit, total) };
}

export async function listFlags({ page, limit }) {
  const [flags, total] = await Promise.all([
    FeatureFlag.find().populate('updatedBy', 'name email').sort({ key: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    FeatureFlag.countDocuments(),
  ]);
  return { items: flags.map((flag) => ({ key: flag.key, enabled: flag.enabled, description: flag.description, updatedAt: flag.updatedAt, updatedBy: flag.updatedBy?.name ?? null })), pagination: buildPagination(page, limit, total) };
}

export async function upsertFlag(key, body, actor, request) {
  const flag = await FeatureFlag.findOneAndUpdate(
    { key },
    { $set: { enabled: body.enabled, ...(body.description === undefined ? {} : { description: body.description }), updatedBy: actor._id }, $setOnInsert: { key } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  await recordAdminAudit({ actor, action: 'feature_flag.updated', targetType: 'feature_flag', targetId: key, summary: `Feature flag ${key} ${body.enabled ? 'enabled' : 'disabled'}`, metadata: { enabled: body.enabled, description: body.description ?? flag.description }, request });
  return { key: flag.key, enabled: flag.enabled, description: flag.description, updatedAt: flag.updatedAt };
}
