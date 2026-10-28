import mongoose from 'mongoose';
import {
  PLAN_LIMITS, PLAN_STATUSES as P, TASK_STATUSES as ST, TASK_TYPES as TT,
} from '@algonest/shared';
import { Plan } from '../../models/Plan.js';
import { PlanTask } from '../../models/PlanTask.js';
import { Attempt } from '../../models/Attempt.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import { UserProgress } from '../../models/UserProgress.js';
import { Quiz } from '../../models/Quiz.js';
import { MockTest } from '../../models/MockTest.js';
import { Sheet } from '../../models/Sheet.js';
import { aggregateWeakTopics, addDays, computeProgress, computeStreak, dateKey, dailyLoad } from './planEngine.js';
import { markMissedTasks } from './plan.service.js';

const { Types } = mongoose;

/**
 * "What should I do now?" — one aggregated read for the student dashboard.
 * Every query is scoped by `user`, so no cross-learner data can leak.
 */
export async function getDashboard(actor, query = {}) {
  const today = query.date ?? dateKey(new Date());
  const horizon = Math.max(1, Math.min(90, Number(query.horizon) || 30));
  const lastDay = addDays(today, horizon);
  const userId = new Types.ObjectId(actor.id);

  const plan = await Plan.findOne({ user: userId, status: P.ACTIVE });
  const restDays = plan?.restDays ?? [];
  if (plan) await markMissedTasks(plan, actor, today);
  const freshPlan = plan ? await Plan.findById(plan._id) : null;

  const taskFilter = plan ? { plan: plan._id, user: userId } : { user: userId, date: { $gte: today, $lte: lastDay } };
  const [
    todayTasks, upcomingRaw, revisionRaw, allTasks, completedDates,
    quizAttempts, mockAttempts, liveAttempts, progressRows,
  ] = await Promise.all([
    PlanTask.find({ ...taskFilter, date: today }).sort({ order: 1 }).limit(PLAN_LIMITS.DASHBOARD_TODAY_LIMIT + 1).lean(),
    PlanTask.find({
      ...taskFilter, type: TT.MOCK, date: { $gte: today, $lte: lastDay },
      status: { $nin: [ST.DONE, ST.SKIPPED] },
    }).sort({ date: 1 }).limit(5).lean(),
    PlanTask.find({
      ...taskFilter, type: TT.REVISION, date: { $gte: today, $lte: lastDay },
      status: { $nin: [ST.DONE, ST.SKIPPED] },
    }).sort({ date: 1 }).limit(10).lean(),
    plan ? PlanTask.find({ plan: plan._id, user: userId }).select('status estimatedMinutes date overloaded').lean() : [],
    PlanTask.distinct('date', { user: userId, status: ST.DONE }),
    Attempt.find({ user: userId, status: { $in: ['submitted', 'timed_out'] } })
      .select('topicStats percentage submittedAt quiz').sort({ submittedAt: -1 }).limit(20).lean(),
    MockAttempt.find({ user: userId, status: { $in: ['submitted', 'timed_out'] } })
      .select('topicStats percentage submittedAt mock').sort({ submittedAt: -1 }).limit(20).lean(),
    Promise.all([
      Attempt.findOne({ user: userId, status: 'in_progress' }).select('_id quiz quizVersion startedAt expiresAt').sort({ createdAt: -1 }).lean(),
      MockAttempt.findOne({ user: userId, status: 'in_progress' }).select('_id mock mockVersion startedAt expiresAt title').sort({ createdAt: -1 }).lean(),
    ]),
    UserProgress.find({ user: userId, status: { $in: ['in_progress', 'revisit'] } })
      .select('sheet problemId problemTitle topic updatedAt').sort({ updatedAt: -1 }).limit(5).lean(),
  ]);

  const progress = computeProgress(allTasks);
  const streak = computeStreak(completedDates.filter(Boolean), today, restDays);
  const weakTopics = aggregateWeakTopics(
    quizAttempts.flatMap((attempt) => attempt.topicStats ?? []),
    mockAttempts.flatMap((attempt) => attempt.topicStats ?? []),
  );

  const enrichedRevisions = await enrichTasks(revisionRaw);
  const enrichedUpcoming = await enrichTasks(upcomingRaw);
  const continueWith = await buildContinueCard(liveAttempts, todayTasks, progressRows);
  const recent = [...quizAttempts, ...mockAttempts]
    .map((attempt) => ({
      kind: attempt.mock ? 'mock' : 'quiz',
      percentage: attempt.percentage ?? 0,
      at: attempt.submittedAt ?? null,
      id: String(attempt._id),
    }))
    .sort((a, b) => new Date(b.at ?? 0) - new Date(a.at ?? 0))
    .slice(0, 5);

  const overloadWarnings = (freshPlan?.warnings ?? [])
    .filter((warning) => ['DAILY_OVERLOAD', 'SINGLE_TASK_TOO_LONG', 'OVERFLOW_PAST_END', 'RESCHEDULE_OVERLOAD'].includes(warning.code))
    .slice(0, 8);
  const todayMinutes = todayTasks.reduce((sum, task) => sum + (Number(task.estimatedMinutes) || 0), 0);
  const capacity = freshPlan?.dailyMinutes ?? 0;
  const overload = {
    todayMinutes, capacity,
    ratio: capacity ? Math.round((todayMinutes / capacity) * 100) : 0,
    isOverloaded: Boolean(capacity && todayMinutes > capacity),
    warnings: overloadWarnings,
  };

  return {
    date: today,
    plan: freshPlan ? Plan.toPublic(freshPlan, 'detail') : null,
    greeting: null, // the client composes a localised greeting from auth state
    today: {
      tasks: todayTasks.slice(0, PLAN_LIMITS.DASHBOARD_TODAY_LIMIT).map((doc) => PlanTask.toPublic(doc)),
      total: todayTasks.length,
      minutes: todayMinutes,
      done: todayTasks.filter((task) => task.status === ST.DONE).length,
      missed: todayTasks.filter((task) => task.status === ST.MISSED).length,
    },
    streak,
    progress,
    dailyLoad: plan ? dailyLoad(allTasks, freshPlan.dailyMinutes).slice(-14) : [],
    weakTopics,
    upcomingMock: enrichedUpcoming[0] ?? null,
    upcomingMocks: enrichedUpcoming,
    pendingRevisions: enrichedRevisions,
    pendingRevisionCount: revisionRaw.length,
    missedCount: allTasks.filter((task) => task.status === ST.MISSED).length,
    continueWith,
    overload,
    recentActivity: recent,
    nextRestDay: findNextRestDay(today, restDays),
  };
}

function findNextRestDay(today, restDays) {
  if (!restDays.length) return null;
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = addDays(today, offset);
    const weekday = new Date(`${candidate}T00:00:00.000Z`).getUTCDay();
    if (restDays.includes(weekday)) return candidate;
  }
  return null;
}

/** Add live titles/URLs for task cards without ever trusting a task's own URL alone. */
async function enrichTasks(tasks) {
  if (!tasks.length) return [];
  const quizIds = [...new Set(tasks.filter((task) => task.refType === 'Quiz').map((task) => task.refId))]
    .filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
  const mockIds = [...new Set(tasks.filter((task) => task.refType === 'MockTest').map((task) => task.refId))]
    .filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
  const [quizzes, mocks] = await Promise.all([
    quizIds.length ? Quiz.find({ _id: { $in: quizIds } }).select('title status').lean() : [],
    mockIds.length ? MockTest.find({ _id: { $in: mockIds } }).select('title status').lean() : [],
  ]);
  const quizMap = new Map(quizzes.map((quiz) => [String(quiz._id), quiz]));
  const mockMap = new Map(mocks.map((mock) => [String(mock._id), mock]));
  return tasks.map((task) => {
    const view = PlanTask.toPublic(task);
    const live = task.refType === 'Quiz' ? quizMap.get(task.refId) : task.refType === 'MockTest' ? mockMap.get(task.refId) : null;
    if (live) { view.title = live.title || view.title; view.available = live.status !== 'archived'; }
    else view.available = true;
    return view;
  });
}

async function buildContinueCard(liveAttempts, todayTasks, progressRows) {
  const [liveQuiz, liveMock] = liveAttempts;
  if (liveQuiz) {
    return {
      kind: 'quiz_attempt', title: 'Finish the quiz you started',
      description: 'Your autosaved answers are waiting. The server clock is still running.',
      href: `/app/quizzes/${String(liveQuiz.quiz)}/attempts/${String(liveQuiz._id)}`,
      expiresAt: liveQuiz.expiresAt ?? null,
    };
  }
  if (liveMock) {
    return {
      kind: 'mock_attempt', title: liveMock.title || 'Resume your mock test',
      description: 'You can reconnect at any point; time is enforced by the server.',
      href: `/app/mocks/${String(liveMock.mock)}/attempts/${String(liveMock._id)}`,
      expiresAt: liveMock.expiresAt ?? null,
    };
  }
  const next = todayTasks.find((task) => task.status === ST.IN_PROGRESS)
    ?? todayTasks.find((task) => task.status === ST.PENDING || task.status === ST.MISSED);
  if (next) {
    const view = PlanTask.toPublic(next);
    return {
      kind: 'plan_task', title: view.title,
      description: `${view.type.replace('_', ' ')} · ${view.estimatedMinutes} min · ${view.topic}`,
      href: taskHref(view),
      taskId: view.id,
    };
  }
  if (progressRows.length) {
    const row = progressRows[0];
    const sheet = await Sheet.findById(row.sheet).select('title status').lean().catch(() => null);
    if (sheet) {
      return {
        kind: 'sheet_problem', title: row.problemTitle || 'Continue a problem',
        description: `${sheet.title} · ${row.topic}`,
        href: `/app/sheets/${String(row.sheet)}`,
      };
    }
  }
  return null;
}

export function taskHref(task) {
  if (task.refType === 'Quiz' && task.refId) return `/app/quizzes/${task.refId}`;
  if (task.refType === 'MockTest' && task.refId) return `/app/mocks/${task.refId}`;
  if (task.refType === 'Sheet' && task.sheetId) return `/app/sheets/${task.sheetId}`;
  if (task.url) return task.url;
  return '/app/plans';
}
