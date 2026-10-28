import mongoose from 'mongoose';
import {
  PLAN_LIMITS, PLAN_STATUSES as P, TASK_STATUSES as ST, TASK_TYPES as TT,
} from '@algonest/shared';
import { Plan } from '../../models/Plan.js';
import { PlanTask } from '../../models/PlanTask.js';
import { Sheet } from '../../models/Sheet.js';
import { SheetVersion } from '../../models/SheetVersion.js';
import { Quiz } from '../../models/Quiz.js';
import { MockTest } from '../../models/MockTest.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import {
  addDays, buildMockPool, buildUnits, computeProgress, computeStreak, dailyLoad,
  dateKey, diffDays, distribute, isValidDateKey, reschedule,
} from './planEngine.js';
import { actorFrom } from '../mocks/actor.js';

const { Types } = mongoose;
const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });
const idOf = (value) => String(value?._id ?? value ?? '');

function assertOwner(doc, actor) {
  if (String(doc.user) !== String(actor.id)) throw ApiError.forbidden('This plan belongs to another learner');
}

async function findPlan(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid plan id');
  const doc = await Plan.findById(id);
  if (!doc) throw ApiError.notFound('Plan not found');
  return doc;
}

function todayKey(override) {
  if (override && isValidDateKey(override)) return override;
  return dateKey(new Date());
}

/** Load only PUBLISHED, non-archived content; private visibility is excluded. */
async function loadContent(payload) {
  const sheetIds = (payload.sheetIds ?? []).map((value) => new Types.ObjectId(value));
  const quizIds = (payload.quizIds ?? []).map((value) => new Types.ObjectId(value));
  const mockIds = (payload.mockIds ?? []).map((value) => new Types.ObjectId(value));
  const [sheets, quizzes, mocks, versions] = await Promise.all([
    sheetIds.length ? Sheet.find({ _id: { $in: sheetIds }, publishedVersion: { $gt: 0 }, status: { $ne: 'archived' }, 'settings.visibility': 'public' }).lean() : [],
    quizIds.length ? Quiz.find({ _id: { $in: quizIds }, publishedVersion: { $gt: 0 }, status: { $ne: 'archived' }, 'settings.visibility': 'public' }).lean() : [],
    mockIds.length ? MockTest.find({ _id: { $in: mockIds }, publishedVersion: { $gt: 0 }, status: { $ne: 'archived' }, 'settings.visibility': 'public' }).lean() : [],
    sheetIds.length ? SheetVersion.find({ sheet: { $in: sheetIds } }).sort({ version: -1 }).lean() : [],
  ]);
  if (sheets.length !== sheetIds.length) throw ApiError.notFound('One or more selected sheets are not published');
  if (quizzes.length !== quizIds.length) throw ApiError.notFound('One or more selected quizzes are not published');
  if (mocks.length !== mockIds.length) throw ApiError.notFound('One or more selected mock tests are not published');

  const latestVersion = new Map();
  for (const version of versions) if (!latestVersion.has(String(version.sheet))) latestVersion.set(String(version.sheet), version);
  const sheetsForUnits = sheets.map((sheet) => {
    const snapshot = latestVersion.get(String(sheet._id));
    return {
      id: String(sheet._id), title: snapshot?.title ?? sheet.title,
      problems: snapshot?.problems ?? sheet.problems ?? [],
    };
  });
  const quizzesForUnits = quizzes.map((quiz) => ({
    id: String(quiz._id), title: quiz.title, topics: quiz.topics ?? [],
    settings: quiz.settings?.toObject ? quiz.settings.toObject() : (quiz.settings ?? {}),
  }));
  const mocksForUnits = mocks.map((mock) => ({
    id: String(mock._id), title: mock.title, topics: mock.topics ?? [],
    totalDurationMinutes: (mock.sections ?? []).reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0) || 60,
  }));
  return { sheets: sheetsForUnits, quizzes: quizzesForUnits, mocks: mocksForUnits };
}

/** When no mock was chosen, auto-fill from the published catalogue. */
async function autoMockPool(excludeIds = []) {
  const docs = await MockTest.find({
    publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public',
    _id: { $nin: excludeIds.map((value) => new Types.ObjectId(value)) },
  }).sort({ publishedAt: -1 }).limit(5).lean().catch(() => []);
  return buildMockPool(docs.map((mock) => ({
    id: String(mock._id), title: mock.title, topics: mock.topics ?? [],
    totalDurationMinutes: (mock.sections ?? []).reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0) || 60,
  })));
}

function toWarnings(entries = []) {
  return entries.slice(0, 60).map((entry) => ({
    code: entry.code,
    message: entry.message,
    date: entry.date ?? null,
    minutes: entry.minutes ?? null,
  }));
}

/** Persist generated tasks; duplicate keys are ignored (idempotent regeneration). */
async function persistTasks(planId, userId, tasks) {
  if (!tasks.length) return 0;
  const rows = tasks.slice(0, PLAN_LIMITS.MAX_TASKS).map((task) => ({
    user: new Types.ObjectId(userId),
    plan: new Types.ObjectId(planId),
    taskKey: task.taskKey,
    date: task.date,
    order: task.order,
    type: task.type,
    title: task.title,
    topic: task.topic || 'General',
    description: task.description || '',
    refId: task.refId || '',
    refType: task.refType || 'Manual',
    sheetId: task.sheetId || null,
    url: task.url || '',
    estimatedMinutes: Math.max(1, Number(task.estimatedMinutes) || 10),
    status: task.status ?? ST.PENDING,
    source: task.source ?? 'generated',
    revisionInterval: task.revisionInterval ?? null,
    revisionOf: task.revisionOf ?? null,
    overloaded: Boolean(task.overloaded),
    rescheduledFrom: task.rescheduledFrom ?? null,
    rescheduleCount: task.rescheduleCount ?? 0,
    note: task.note || '',
  }));
  const result = await PlanTask.insertMany(rows, { ordered: false }).catch((error) => {
    // E11000 from a concurrent regeneration is acceptable: other rows inserted.
    if (error?.code === 11000 || error?.writeErrors?.every((item) => item.code === 11000)) {
      return error?.result?.insertedCount ? rows.slice(0, error.result.insertedCount) : [];
    }
    throw error;
  });
  return result.length;
}

/** Recompute the denormalised stats snapshot from the live task rows. */
export async function refreshStats(planId) {
  const tasks = await PlanTask.find({ plan: planId }).select('status').lean();
  const progress = computeProgress(tasks);
  const overloadCount = await PlanTask.countDocuments({ plan: planId, overloaded: true });
  await Plan.updateOne({ _id: planId }, {
    $set: {
      'stats.totalTasks': progress.total,
      'stats.doneTasks': progress.done,
      'stats.missedTasks': progress.missed,
      'stats.completionPercentage': progress.completionPercentage,
      'stats.overloadCount': overloadCount,
    },
  });
  return { ...progress, overloadCount };
}

/** Idempotent: past pending/in-progress tasks become `missed` (never deleted). */
export async function markMissedTasks(plan, actor, now) {
  const result = await PlanTask.updateMany(
    { plan: plan._id, user: new Types.ObjectId(actor.id), date: { $lt: now }, status: { $in: [ST.PENDING, ST.IN_PROGRESS] } },
    { $set: { status: ST.MISSED } },
  );
  return result.modifiedCount ?? result.nModified ?? 0;
}

/* ─────────────────────────── create / read ─────────────────────────── */

export async function createPlan(payload, actor, now = dateKey(new Date())) {
  const start = payload.startDate;
  if (diffDays(now, start) < -365) throw ApiError.unprocessable('A plan cannot start more than a year in the past');
  if (diffDays(start, payload.endDate) < 0) throw ApiError.unprocessable('End date must be on or after the start date');

  const existing = await Plan.findOne({ user: new Types.ObjectId(actor.id), status: P.ACTIVE });
  if (existing) {
    if (!payload.replaceActive) throw ApiError.conflict('You already have an active plan. Archive it first or enable replacement.');
    existing.status = P.ARCHIVED;
    existing.completedAt = new Date();
    await existing.save();
  }

  const content = await loadContent(payload);
  let mockPool = buildMockPool(content.mocks);
  let autoMocks = false;
  if (!mockPool.length) { mockPool = await autoMockPool(payload.mockIds); autoMocks = true; }

  const generated = distribute(buildUnits(content), {
    start, end: payload.endDate,
    dailyMinutes: payload.dailyMinutes,
    restDays: payload.restDays,
    revisionEnabled: payload.revisionEnabled,
    mockIntervalDays: payload.mockIntervalDays,
    mockPool, autoMocks,
  });
  if (!generated.tasks.length) {
    throw ApiError.unprocessable(generated.warnings[0]?.message ?? 'Nothing could be scheduled for this plan');
  }
  if (generated.tasks.length > PLAN_LIMITS.MAX_TASKS) {
    throw ApiError.unprocessable(`This plan would create ${generated.tasks.length} tasks; reduce the selected content or lengthen the plan.`);
  }

  const plan = await Plan.create({
    user: new Types.ObjectId(actor.id),
    title: payload.title, goal: payload.goal,
    startDate: start, endDate: payload.endDate,
    dailyMinutes: payload.dailyMinutes, restDays: payload.restDays,
    sheetIds: payload.sheetIds.map((value) => new Types.ObjectId(value)),
    quizIds: payload.quizIds.map((value) => new Types.ObjectId(value)),
    mockIds: payload.mockIds.map((value) => new Types.ObjectId(value)),
    revisionEnabled: payload.revisionEnabled,
    mockIntervalDays: payload.mockIntervalDays,
    notes: payload.notes,
    status: P.ACTIVE,
    warnings: toWarnings(generated.warnings),
  });
  try {
    await persistTasks(plan._id, actor.id, generated.tasks);
  } catch (error) {
    await PlanTask.deleteMany({ plan: plan._id }).catch(() => {});
    await Plan.deleteOne({ _id: plan._id }).catch(() => {});
    throw error;
  }
  const stats = await refreshStats(plan._id);
  const fresh = await Plan.findById(plan._id);
  return {
    plan: Plan.toPublic(fresh, 'detail'),
    generated: {
      tasks: generated.tasks.length,
      mockTasks: generated.tasks.filter((task) => task.type === TT.MOCK).length,
      revisionTasks: generated.tasks.filter((task) => task.type === TT.REVISION).length,
      usedDates: generated.usedDates,
      warnings: generated.warnings,
      dailyLoad: dailyLoad(generated.tasks, payload.dailyMinutes),
      progress: stats,
    },
  };
}

export async function listPlans(query, actor) {
  const filter = { user: new Types.ObjectId(actor.id) };
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    Plan.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Plan.countDocuments(filter),
  ]);
  return { items: items.map((doc) => Plan.toPublic(doc, 'summary')), pagination: buildPagination(page, limit, total) };
}

export async function getActivePlan(actor) {
  const doc = await Plan.findOne({ user: new Types.ObjectId(actor.id), status: P.ACTIVE });
  return doc ? Plan.toPublic(doc, 'detail') : null;
}

export async function getPlan(id, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  const missed = await markMissedTasks(plan, actor, now);
  if (missed) await refreshStats(plan._id);
  const fresh = missed ? await Plan.findById(plan._id) : plan;
  const tasks = await PlanTask.find({ plan: plan._id }).sort({ date: 1, order: 1 }).lean();
  return {
    plan: Plan.toPublic(fresh, 'detail'),
    progress: computeProgress(tasks),
    dailyLoad: dailyLoad(tasks, fresh.dailyMinutes),
    missedJustNow: missed,
    streak: computeStreak(
      tasks.filter((task) => task.status === ST.DONE).map((task) => task.date),
      now, fresh.restDays,
    ),
  };
}

export async function updatePlan(id, payload, actor) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  if (plan.status === P.ARCHIVED) throw ApiError.conflict('Restore is not supported; create a new plan instead');
  if (payload.status) {
    const allowed = plan.status === P.ACTIVE ? [P.PAUSED, P.COMPLETED, P.ARCHIVED] : [P.ACTIVE, P.COMPLETED, P.ARCHIVED];
    if (!allowed.includes(payload.status)) throw ApiError.conflict(`Cannot change a ${plan.status} plan to ${payload.status}`);
    if (payload.status === P.ACTIVE) {
      const other = await Plan.findOne({ user: new Types.ObjectId(actor.id), status: P.ACTIVE, _id: { $ne: plan._id } });
      if (other) throw ApiError.conflict('Another plan is already active. Pause it first.');
    }
    plan.status = payload.status;
    if (payload.status === P.COMPLETED || payload.status === P.ARCHIVED) plan.completedAt = new Date();
  }
  for (const key of ['title', 'notes', 'dailyMinutes', 'restDays', 'revisionEnabled']) {
    if (payload[key] !== undefined) plan[key] = payload[key];
  }
  plan.markModified('restDays');
  await plan.save();
  return { plan: Plan.toPublic(plan, 'detail') };
}

/** Delete only PENDING future tasks and regenerate from `today` onward. */
export async function regeneratePlan(id, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  if (plan.status === P.ARCHIVED) throw ApiError.conflict('Cannot regenerate an archived plan');
  await markMissedTasks(plan, actor, now);
  const content = await loadContent({
    sheetIds: (plan.sheetIds ?? []).map(String),
    quizIds: (plan.quizIds ?? []).map(String),
    mockIds: (plan.mockIds ?? []).map(String),
  });
  let mockPool = buildMockPool(content.mocks);
  if (!mockPool.length) mockPool = await autoMockPool((plan.mockIds ?? []).map(String));

  const start = now > plan.startDate ? now : plan.startDate;
  const generated = distribute(buildUnits(content), {
    start, end: plan.endDate,
    dailyMinutes: plan.dailyMinutes, restDays: plan.restDays,
    revisionEnabled: plan.revisionEnabled, mockIntervalDays: plan.mockIntervalDays,
    mockPool,
  });
  const removable = await PlanTask.find({
    plan: plan._id, date: { $gte: start }, status: { $in: [ST.PENDING, ST.MISSED] },
  }).select('_id taskKey').lean();
  if (removable.length) await PlanTask.deleteMany({ _id: { $in: removable.map((item) => item._id) } });
  await persistTasks(plan._id, actor.id, generated.tasks);
  plan.warnings = toWarnings(generated.warnings);
  plan.markModified('warnings');
  await plan.save();
  const stats = await refreshStats(plan._id);
  return { plan: Plan.toPublic(plan, 'detail'), generated: { tasks: generated.tasks.length, warnings: generated.warnings, progress: stats } };
}

/* ─────────────────────────── tasks ─────────────────────────── */

export async function listTasks(id, query, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  await markMissedTasks(plan, actor, now);
  const filter = { plan: plan._id, user: new Types.ObjectId(actor.id) };
  if (query.from) filter.date = { ...(filter.date ?? {}), $gte: query.from };
  if (query.to) filter.date = { ...(filter.date ?? {}), $lte: query.to };
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(PLAN_LIMITS.MAX_TASKS_PER_DAY * 8, Math.max(1, Number(query.limit) || 200));
  const [items, total, groups] = await Promise.all([
    PlanTask.find(filter).sort({ date: 1, order: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    PlanTask.countDocuments(filter),
    PlanTask.find({ plan: plan._id, user: new Types.ObjectId(actor.id) }).select('date status estimatedMinutes').lean(),
  ]);
  const byDate = {};
  for (const task of groups) {
    const row = byDate[task.date] ?? { date: task.date, minutes: 0, done: 0, total: 0 };
    row.minutes += Number(task.estimatedMinutes) || 0;
    row.total += 1;
    if (task.status === ST.DONE) row.done += 1;
    byDate[task.date] = row;
  }
  return {
    items: items.map((doc) => PlanTask.toPublic(doc)),
    calendar: Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)),
    pagination: buildPagination(page, limit, total, PLAN_LIMITS.MAX_TASKS_PER_DAY * 8),
  };
}

const ALLOWED_TRANSITIONS = Object.freeze({
  [ST.PENDING]: [ST.IN_PROGRESS, ST.DONE, ST.SKIPPED, ST.MISSED],
  [ST.IN_PROGRESS]: [ST.PENDING, ST.DONE, ST.SKIPPED, ST.MISSED],
  [ST.DONE]: [ST.IN_PROGRESS, ST.PENDING],
  [ST.SKIPPED]: [ST.PENDING],
  [ST.MISSED]: [ST.PENDING, ST.DONE],
});

export async function updateTaskStatus(id, taskId, payload, actor) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  if (!Types.ObjectId.isValid(taskId)) throw ApiError.badRequest('Invalid task id');
  const task = await PlanTask.findOne({ _id: taskId, plan: plan._id, user: new Types.ObjectId(actor.id) });
  if (!task) throw ApiError.notFound('Task not found');
  if (!(ALLOWED_TRANSITIONS[task.status] ?? []).includes(payload.status)) {
    throw ApiError.conflict(`Cannot move a ${task.status} task to ${payload.status}`);
  }
  task.status = payload.status;
  if (payload.note !== undefined) task.note = payload.note;
  task.completedAt = payload.status === ST.DONE ? new Date() : null;
  await task.save();
  const stats = await refreshStats(plan._id);
  await syncUserStreak(actor, plan).catch(() => {});
  return { task: PlanTask.toPublic(task), progress: stats };
}

/** Keep the Phase-1 profile streak field in sync for the top bar. */
async function syncUserStreak(actor, plan) {
  const completed = await PlanTask.find({ user: new Types.ObjectId(actor.id), status: ST.DONE }).select('date').lean();
  const streak = computeStreak([...new Set(completed.map((task) => task.date))], dateKey(new Date()), plan.restDays);
  await User.updateOne({ _id: new Types.ObjectId(actor.id) }, {
    $set: {
      'streak.current': streak.current,
      'streak.longest': streak.longest,
      'streak.lastActiveDate': streak.lastActiveDate ? new Date(`${streak.lastActiveDate}T00:00:00.000Z`) : null,
    },
  });
  return streak;
}

export async function reorderTasks(id, payload, actor) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  const tasks = await PlanTask.find({ plan: plan._id, user: new Types.ObjectId(actor.id), date: payload.date }).select('_id').lean();
  const owned = new Set(tasks.map((task) => String(task._id)));
  if (payload.taskIds.some((value) => !owned.has(String(value)))) throw ApiError.unprocessable('Every task must belong to this plan and date');
  if (payload.taskIds.length !== tasks.length) throw ApiError.unprocessable('Send every task id for this date in the new order');
  await PlanTask.bulkWrite(payload.taskIds.map((taskId, index) => ({
    updateOne: { filter: { _id: new Types.ObjectId(taskId), plan: plan._id }, update: { $set: { order: index } } },
  })));
  const items = await PlanTask.find({ plan: plan._id, date: payload.date }).sort({ order: 1 }).lean();
  return { items: items.map((doc) => PlanTask.toPublic(doc)) };
}

/** Explicit, learner-triggered redistribution of missed tasks. */
export async function rescheduleMissed(id, payload, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  await markMissedTasks(plan, actor, now);
  const filter = {
    plan: plan._id, user: new Types.ObjectId(actor.id), status: ST.MISSED,
  };
  if (payload.taskIds?.length) filter._id = { $in: payload.taskIds.map((value) => new Types.ObjectId(value)) };
  const missed = await PlanTask.find(filter).sort({ date: 1, order: 1 }).lean();
  if (!missed.length) return { moved: 0, warnings: [], progress: computeProgress([]) };
  if (missed.length > PLAN_LIMITS.MAX_RESCHEDULE) throw ApiError.unprocessable('Too many missed tasks to reschedule at once');

  const existing = await PlanTask.find({
    plan: plan._id, date: { $gte: now }, status: { $nin: [ST.SKIPPED] },
  }).select('date estimatedMinutes').lean();
  // Extend the plan when there is no room before its end date.
  const end = now > plan.endDate ? addDays(now, 14) : plan.endDate;
  const result = reschedule(missed, existing, {
    today: now, end, dailyMinutes: plan.dailyMinutes, restDays: plan.restDays,
  });
  const byKey = new Map(result.moves.map((move) => [move.taskKey, move]));
  for (const move of result.moves) {
    await PlanTask.updateOne({ plan: plan._id, taskKey: move.taskKey }, {
      $set: {
        date: move.date, status: ST.PENDING, source: move.source,
        rescheduledFrom: move.rescheduledFrom,
        rescheduleCount: move.rescheduleCount,
        overloaded: move.overloaded,
      },
    });
  }
  // Re-anchor this task's 1/7/21 revisions to the new date.
  for (const task of missed) {
    const move = byKey.get(task.taskKey);
    if (!move) continue;
    const revisions = await PlanTask.find({ plan: plan._id, revisionOf: task.taskKey, status: { $in: [ST.PENDING, ST.MISSED] } });
    for (const revision of revisions) {
      const interval = Number(revision.revisionInterval) || 1;
      revision.date = addDays(move.date, interval);
      revision.status = ST.PENDING;
      revision.taskKey = `revision:${task.taskKey}:${interval}`;
      await revision.save();
    }
  }
  plan.warnings = toWarnings([...(plan.warnings ?? []).map((entry) => ({ code: entry.code, message: entry.message, date: entry.date, minutes: entry.minutes })), ...result.warnings]);
  plan.markModified('warnings');
  await plan.save();
  const progress = await refreshStats(plan._id);
  return { moved: result.moves.length, warnings: result.warnings, dailyLoad: result.dailyLoad, progress, plan: Plan.toPublic(plan, 'detail') };
}

/** Wizard data: only published, publicly visible content, paginated per type. */
export async function getAvailableContent(actor) {
  void actor;
  const [sheets, quizzes, mocks] = await Promise.all([
    Sheet.find({ publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public' })
      .select('title difficulty topics problems.estimatedMinutes').sort({ publishedAt: -1 }).limit(30).lean(),
    Quiz.find({ publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public' })
      .select('title difficulty topics settings.timerMinutes').sort({ publishedAt: -1 }).limit(30).lean(),
    MockTest.find({ publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public' })
      .select('title difficulty topics sections.durationMinutes').sort({ publishedAt: -1 }).limit(30).lean(),
  ]);
  const shape = (doc, extra = {}) => ({
    id: String(doc._id), title: doc.title, difficulty: doc.difficulty || 'medium',
    topics: doc.topics ?? [], ...extra,
  });
  return {
    sheets: sheets.map((doc) => shape(doc, {
      problemCount: doc.problems?.length ?? 0,
      estimatedMinutes: (doc.problems ?? []).reduce((sum, problem) => sum + (Number(problem.estimatedMinutes) || 0), 0),
    })),
    quizzes: quizzes.map((doc) => shape(doc, { minutes: Number(doc.settings?.timerMinutes) || 20 })),
    mocks: mocks.map((doc) => shape(doc, {
      minutes: (doc.sections ?? []).reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0) || 60,
    })),
  };
}

export { findPlan, actorFrom };
