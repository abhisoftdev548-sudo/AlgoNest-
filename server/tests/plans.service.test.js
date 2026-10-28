import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { PLAN_STATUSES as P, TASK_STATUSES as ST, TASK_TYPES as TT } from '@algonest/shared/constants';

const { Plan } = await import('../src/models/Plan.js');
const { PlanTask } = await import('../src/models/PlanTask.js');
const { Sheet } = await import('../src/models/Sheet.js');
const { SheetVersion } = await import('../src/models/SheetVersion.js');
const { Quiz } = await import('../src/models/Quiz.js');
const { MockTest } = await import('../src/models/MockTest.js');
const { User } = await import('../src/models/User.js');
const { Attempt } = await import('../src/models/Attempt.js');
const { MockAttempt } = await import('../src/models/MockAttempt.js');
const { UserProgress } = await import('../src/models/UserProgress.js');
const service = await import('../src/modules/plans/plan.service.js');
const dashboard = await import('../src/modules/plans/dashboard.service.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const USER_ID = oid('507f1f77bcf86cd799439001');
const OTHER_ID = oid('507f1f77bcf86cd799439002');
const PLAN_ID = oid('507f1f77bcf86cd799439010');
const TASK_ID = oid('507f1f77bcf86cd799439020');
const SHEET_ID = oid('507f1f77bcf86cd799439030');
const QUIZ_ID = oid('507f1f77bcf86cd799439040');
const MOCK_ID = oid('507f1f77bcf86cd799439050');

const actor = { id: String(USER_ID), role: 'student', permissions: [] };
const stranger = { id: String(OTHER_ID), role: 'student', permissions: [] };
const TODAY = '2026-11-09';
const START = '2026-11-09';
const END = '2026-12-08';

const stubs = [];
function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}
afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs.length = 0;
});

function chainable(value) {
  const promise = Promise.resolve(value);
  const chain = {};
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where', 'count']) chain[method] = () => chain;
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

function makePlan(overrides = {}) {
  return new Plan({
    _id: PLAN_ID, user: USER_ID, title: 'Interview sprint', goal: 'interview_60_days',
    startDate: START, endDate: END, dailyMinutes: 60, restDays: [0],
    sheetIds: [SHEET_ID], quizIds: [QUIZ_ID], mockIds: [MOCK_ID],
    revisionEnabled: true, mockIntervalDays: 14, status: P.ACTIVE,
    warnings: [], notes: '',
    ...overrides,
  });
}

const content = {
  sheets: [{ _id: SHEET_ID, title: 'Sheet 1', topics: ['Arrays'], publishedVersion: 1, status: 'published', 'settings.visibility': 'public' }],
  quizzes: [{ _id: QUIZ_ID, title: 'Quiz 1', topics: ['Arrays'], settings: { timerMinutes: 20 } }],
  mocks: [{ _id: MOCK_ID, title: 'Mock 1', topics: ['Mixed'], sections: [{ durationMinutes: 20 }, { durationMinutes: 20 }] }],
  versions: [{ sheet: SHEET_ID, version: 1, title: 'Sheet 1', problems: [
    { _id: oid('507f1f77bcf86cd799439061'), title: 'Two sum', order: 0, estimatedMinutes: 25, topic: 'Arrays', url: 'https://leetcode.com/p/1' },
    { _id: oid('507f1f77bcf86cd799439062'), title: 'Valid paren', order: 1, estimatedMinutes: 30, topic: 'Stacks', url: 'https://leetcode.com/p/2' },
  ] }],
};

function stubContent(overrides = {}) {
  stub(Sheet, 'find', () => chainable(overrides.sheets ?? content.sheets));
  stub(Quiz, 'find', () => chainable(overrides.quizzes ?? content.quizzes));
  stub(MockTest, 'find', () => chainable(overrides.mocks ?? content.mocks));
  stub(SheetVersion, 'find', () => chainable(overrides.versions ?? content.versions));
}

function stubPlanCrud(plan, { insertRows = true } = {}) {
  let created = null;
  stub(Plan, 'findOne', () => chainable(null));
  // Return the freshly created document (with generated warnings) once it exists.
  stub(Plan, 'findById', () => chainable(created ?? plan));
  stub(Plan, 'updateOne', () => chainable({}));
  stub(Plan, 'deleteOne', () => chainable({}));
  stub(Plan.prototype, 'save', async function save() { return this; });
  let inserted = [];
  stub(Plan, 'create', async (payload) => {
    created = new Plan({ ...payload, _id: PLAN_ID });
    return created;
  });
  stub(PlanTask, 'insertMany', async (rows) => {
    inserted = rows;
    return insertRows ? rows : [];
  });
  stub(PlanTask, 'deleteMany', () => chainable({}));
  stub(PlanTask, 'find', () => chainable(inserted));
  stub(PlanTask, 'countDocuments', async () => 0);
  stub(User, 'updateOne', async () => ({}));
  return { getInserted: () => inserted };
}

const basePayload = () => ({
  title: 'Interview sprint', goal: 'interview_60_days',
  startDate: START, endDate: END, dailyMinutes: 60, restDays: [0],
  sheetIds: [String(SHEET_ID)], quizIds: [String(QUIZ_ID)], mockIds: [String(MOCK_ID)],
  revisionEnabled: true, mockIntervalDays: 14, replaceActive: true, notes: '',
});

describe('plan.service — creation and generation', () => {
  it('distributes tasks, mocks and 1/7/21 revisions', async () => {
    const plan = makePlan();
    const crud = stubPlanCrud(plan);
    stubContent();
    const result = await service.createPlan(basePayload(), actor, TODAY);
    const rows = crud.getInserted();
    assert.ok(rows.length > 10, 'expected a full schedule');
    assert.equal(result.plan.status, P.ACTIVE);
    assert.equal(result.generated.mockTasks, 3); // day 0, 14, 28
    assert.ok(result.generated.revisionTasks >= 9); // 3 per learn task (2 problems + 1 quiz)
    assert.ok(rows.every((row) => row.user && row.plan && row.taskKey && row.date));
    assert.ok(rows.every((row) => row.estimatedMinutes > 0));
    assert.ok(rows.some((row) => row.type === TT.REVISION && row.revisionInterval === 1));
    assert.ok(rows.some((row) => row.type === TT.REVISION && row.revisionInterval === 7));
    assert.ok(rows.some((row) => row.type === TT.REVISION && row.revisionInterval === 21));
    assert.equal(new Set(rows.map((row) => row.taskKey)).size, rows.length);
    assert.ok(rows.every((row) => !row.url.startsWith('/') || row.refType !== 'Sheet'));
  });

  it('rejects unpublished content before writing anything', async () => {
    stub(Plan, 'findOne', () => chainable(null));
    stubContent({ sheets: [] });
    await assert.rejects(
      () => service.createPlan(basePayload(), actor, TODAY),
      (error) => error.statusCode === 404 && /sheets/.test(error.message),
    );
  });

  it('keeps an existing active plan when replacement is disabled', async () => {
    const existing = makePlan();
    stub(Plan, 'findOne', () => chainable(existing));
    await assert.rejects(
      () => service.createPlan({ ...basePayload(), replaceActive: false }, actor, TODAY),
      (error) => error.statusCode === 409 && /active plan/.test(error.message),
    );
    assert.equal(existing.status, P.ACTIVE);
  });

  it('archives the previous active plan when replacement is enabled', async () => {
    const existing = makePlan();
    const plan = makePlan();
    stubPlanCrud(plan);
    stub(Plan, 'findOne', () => chainable(existing));
    stubContent();
    await service.createPlan(basePayload(), actor, TODAY);
    assert.equal(existing.status, P.ARCHIVED);
    assert.ok(existing.completedAt instanceof Date);
  });

  it('rolls back the plan and tasks when the bulk insert fails', async () => {
    const plan = makePlan();
    stubPlanCrud(plan);
    stubContent();
    let deletedPlan = false; let deletedTasks = false;
    stub(PlanTask, 'insertMany', async () => { const error = new Error('insert failed'); error.code = 1; throw error; });
    stub(PlanTask, 'deleteMany', () => { deletedTasks = true; return chainable({}); });
    stub(Plan, 'deleteOne', () => { deletedPlan = true; return chainable({}); });
    await assert.rejects(() => service.createPlan(basePayload(), actor, TODAY), /insert failed/);
    assert.equal(deletedTasks, true);
    assert.equal(deletedPlan, true);
  });

  it('raises an overload warning for an impossible daily budget', async () => {
    const plan = makePlan();
    stubPlanCrud(plan);
    stubContent({
      versions: [{ ...content.versions[0], problems: [{ _id: oid('507f1f77bcf86cd799439063'), title: 'Big', order: 0, estimatedMinutes: 400, topic: 'DP', url: 'x' }] }],
    });
    const result = await service.createPlan({ ...basePayload(), dailyMinutes: 30 }, actor, TODAY);
    assert.ok(result.generated.warnings.some((warning) => warning.code === 'SINGLE_TASK_TOO_LONG'));
    assert.ok(result.plan.warnings.some((warning) => warning.code === 'DAILY_OVERLOAD'));
  });
});

describe('plan.service — reads, ownership and missed tasks', () => {
  it('blocks another learner from reading a plan', async () => {
    stub(Plan, 'findById', () => chainable(makePlan()));
    await assert.rejects(
      () => service.getPlan(String(PLAN_ID), stranger, { now: TODAY }),
      (error) => error.statusCode === 403,
    );
  });

  it('marks stale pending tasks as missed on read', async () => {
    const plan = makePlan();
    stub(Plan, 'findById', () => chainable(plan));
    let updateFilter = null;
    stub(PlanTask, 'updateMany', (filter) => { updateFilter = filter; return chainable({ modifiedCount: 3 }); });
    stub(PlanTask, 'find', () => chainable([]));
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(Plan, 'updateOne', () => chainable({}));
    const result = await service.getPlan(String(PLAN_ID), actor, { now: TODAY });
    assert.equal(result.missedJustNow, 3);
    assert.deepEqual(updateFilter.status.$in, [ST.PENDING, ST.IN_PROGRESS]);
    assert.equal(updateFilter.date.$lt, TODAY);
  });

  it('only allows legal task status transitions', async () => {
    const plan = makePlan();
    const task = new PlanTask({
      _id: TASK_ID, user: USER_ID, plan: PLAN_ID, taskKey: 'problem:p1:2026-11-09:0',
      date: TODAY, order: 0, type: TT.PROBLEM, title: 'Two sum', estimatedMinutes: 20, status: ST.DONE,
    });
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'findOne', () => chainable(task));
    stub(PlanTask, 'find', () => chainable([]));
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(Plan.prototype, 'save', async function save() { return this; });
    stub(PlanTask.prototype, 'save', async function save() { return this; });
    stub(Plan, 'updateOne', () => chainable({}));
    stub(User, 'updateOne', async () => ({}));
    await assert.rejects(
      () => service.updateTaskStatus(String(PLAN_ID), String(TASK_ID), { status: ST.SKIPPED }, actor),
      (error) => error.statusCode === 409,
    );
    const updated = await service.updateTaskStatus(String(PLAN_ID), String(TASK_ID), { status: ST.IN_PROGRESS, note: 'Resume' }, actor);
    assert.equal(updated.task.status, ST.IN_PROGRESS);
    assert.equal(updated.task.note, 'Resume');
    assert.equal(updated.task.completedAt, null);
  });

  it('reschedules missed tasks and re-anchors their revisions', async () => {
    const plan = makePlan();
    const missed = new PlanTask({
      _id: TASK_ID, user: USER_ID, plan: PLAN_ID, taskKey: 'problem:p1:2026-11-01:0',
      date: '2026-11-01', order: 0, type: TT.PROBLEM, title: 'Two sum', estimatedMinutes: 20, status: ST.MISSED,
    });
    const revision = new PlanTask({
      _id: oid('507f1f77bcf86cd799439021'), user: USER_ID, plan: PLAN_ID,
      taskKey: 'revision:problem:p1:2026-11-01:0:7', date: '2026-11-08', order: 0,
      type: TT.REVISION, title: 'Revise: Two sum', estimatedMinutes: 10,
      status: ST.MISSED, revisionInterval: 7, revisionOf: missed.taskKey,
    });
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'updateMany', () => chainable({ modifiedCount: 0 }));
    stub(PlanTask, 'find', (filter) => {
      if (filter?.revisionOf) return chainable([revision]);
      if (filter?.status === ST.MISSED) return chainable([missed]);
      if (filter?.status === ST.DONE) return chainable([]);
      return chainable([]);
    });
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(PlanTask, 'updateOne', () => chainable({}));
    stub(PlanTask.prototype, 'save', async function save() { return this; });
    stub(Plan.prototype, 'save', async function save() { return this; });
    stub(Plan, 'updateOne', () => chainable({}));
    const result = await service.rescheduleMissed(String(PLAN_ID), {}, actor, { now: TODAY });
    assert.equal(result.moved, 1);
    assert.ok(missed.taskKey === 'problem:p1:2026-11-01:0');
    assert.ok(revision.date >= TODAY, 'revision re-anchored to the new task date');
    assert.equal(revision.status, ST.PENDING);
  });

  it('preserves completed tasks when regenerating', async () => {
    const plan = makePlan();
    const done = { _id: oid('507f1f77bcf86cd799439022'), taskKey: 'done', date: '2026-11-02', status: ST.DONE, estimatedMinutes: 20 };
    const pending = { _id: oid('507f1f77bcf86cd799439023'), taskKey: 'pending', date: '2026-11-20', status: ST.PENDING, estimatedMinutes: 20 };
    let deletedIds = [];
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'updateMany', () => chainable({ modifiedCount: 0 }));
    stub(PlanTask, 'find', (filter) => {
      if (filter?.status?.$in?.includes(ST.MISSED)) return chainable([pending]);
      return chainable([done, pending]);
    });
    stub(PlanTask, 'deleteMany', (filter) => { deletedIds = filter._id.$in.map(String); return chainable({}); });
    stub(PlanTask, 'insertMany', async (rows) => rows);
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(Plan.prototype, 'save', async function save() { return this; });
    stub(Plan, 'updateOne', () => chainable({}));
    stubContent();
    const result = await service.regeneratePlan(String(PLAN_ID), actor, { now: TODAY });
    assert.deepEqual(deletedIds, [String(pending._id)]);
    assert.ok(result.generated.tasks > 0);
  });
});

describe('dashboard.service — aggregated student view', () => {
  it('assembles today, streak, weak topics, mock, revisions and continue card', async () => {
    const plan = makePlan();
    const taskRow = (overrides = {}) => ({
      _id: oid(), user: USER_ID, plan: PLAN_ID, taskKey: `k-${Math.random()}`,
      date: TODAY, order: 0, type: TT.PROBLEM, title: 'Two sum', topic: 'Arrays',
      refType: 'Sheet', refId: 'p1', sheetId: String(SHEET_ID), url: 'https://leetcode.com/p/1',
      estimatedMinutes: 25, status: ST.PENDING, source: 'generated',
      ...overrides,
    });
    stub(Plan, 'findOne', () => chainable(plan));
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'updateMany', () => chainable({ modifiedCount: 0 }));
    stub(PlanTask, 'distinct', async () => ['2026-11-07', '2026-11-06', TODAY]);
    stub(PlanTask, 'find', (filter = {}) => {
      if (filter.type === TT.MOCK) return chainable([taskRow({ type: TT.MOCK, refType: 'MockTest', refId: String(MOCK_ID), title: 'Full mock', date: '2026-11-16' })]);
      if (filter.type === TT.REVISION) return chainable([taskRow({ type: TT.REVISION, date: '2026-11-10', revisionInterval: 1 })]);
      if (filter.status === ST.DONE) return chainable([{ date: '2026-11-07' }, { date: '2026-11-06' }, { date: TODAY }]);
      if (filter.date === TODAY) return chainable([taskRow({ status: ST.DONE }), taskRow(), taskRow({ status: ST.MISSED })]);
      return chainable([taskRow(), taskRow({ status: ST.DONE, date: '2026-11-07' })]);
    });
    stub(Attempt, 'find', () => chainable([{ _id: oid(), quiz: QUIZ_ID, percentage: 80, submittedAt: new Date(), topicStats: [{ topic: 'Arrays', total: 5, correct: 4, percentage: 80 }] }]));
    stub(MockAttempt, 'find', () => chainable([{ _id: oid(), mock: MOCK_ID, percentage: 40, submittedAt: new Date(), topicStats: [{ topic: 'DP', total: 5, correct: 1, percentage: 20, lostMarks: 8 }] }]));
    stub(Attempt, 'findOne', () => chainable(null));
    stub(MockAttempt, 'findOne', () => chainable(null));
    stub(UserProgress, 'find', () => chainable([]));
    stub(Quiz, 'find', () => chainable([]));
    stub(MockTest, 'find', () => chainable([{ _id: MOCK_ID, title: 'Full mock', status: 'published' }]));
    stub(Sheet, 'findById', () => chainable({ _id: SHEET_ID, title: 'Sheet 1' }));

    const view = await dashboard.getDashboard(actor, { date: TODAY, horizon: 30 });
    assert.equal(view.date, TODAY);
    assert.equal(view.plan.id, String(PLAN_ID));
    assert.equal(view.today.tasks.length, 3);
    assert.equal(view.today.done, 1);
    assert.equal(view.today.missed, 1);
    assert.ok(view.streak.current >= 1);
    assert.equal(view.weakTopics[0].topic, 'DP');
    assert.equal(view.upcomingMock.title, 'Full mock');
    assert.equal(view.pendingRevisions.length, 1);
    assert.equal(view.continueWith.kind, 'plan_task');
    assert.equal(view.overload.capacity, 60);
    assert.equal(view.recentActivity.length, 2);
    assert.equal(view.nextRestDay, '2026-11-15');
  });

  it('prefers a live attempt for the continue card', async () => {
    stub(Plan, 'findOne', () => chainable(null));
    stub(PlanTask, 'distinct', async () => []);
    stub(PlanTask, 'find', () => chainable([]));
    stub(Attempt, 'find', () => chainable([]));
    stub(MockAttempt, 'find', () => chainable([]));
    stub(Attempt, 'findOne', () => chainable(null));
    stub(MockAttempt, 'findOne', () => chainable({
      _id: oid('507f1f77bcf86cd799439070'), mock: MOCK_ID, title: 'Resume me',
      expiresAt: new Date(Date.now() + 600_000),
    }));
    stub(UserProgress, 'find', () => chainable([]));
    stub(Quiz, 'find', () => chainable([]));
    stub(MockTest, 'find', () => chainable([]));
    const view = await dashboard.getDashboard(actor, { date: TODAY });
    assert.equal(view.plan, null);
    assert.equal(view.continueWith.kind, 'mock_attempt');
    assert.ok(view.continueWith.href.includes('/attempts/'));
  });
});
