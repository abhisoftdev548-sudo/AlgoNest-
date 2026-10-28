import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MOCK_INTERVAL_DAYS, REVISION_INTERVALS, TASK_STATUSES as ST, TASK_TYPES as TT,
  dashboardQuerySchema, dateKeySchema, planCreateSchema, planUpdateSchema,
  rescheduleSchema, taskListQuerySchema, taskStatusSchema,
} from '@algonest/shared';

const {
  addDays, aggregateWeakTopics, buildMockPool, buildUnits, computeProgress,
  computeStreak, dailyLoad, dateKey, diffDays, distribute, extendDates,
  isRestDay, isValidDateKey, nextWorkingDate, reschedule, weekdayOf, workingDates,
} = await import('../src/modules/plans/planEngine.js');

const START = '2026-11-02'; // Monday
const END = '2026-12-01';
const REST = [0]; // Sundays off

const problem = (id, minutes = 25, topic = 'Arrays') => ({
  id, title: `Problem ${id}`, topic, minutes, type: TT.PROBLEM,
  refId: id, refType: 'Sheet', url: `https://example.com/${id}`, sheetId: 'sheet1',
});
const mockPool = () => buildMockPool([
  { id: 'm1', title: 'Mock A', topics: ['Mixed'], totalDurationMinutes: 60 },
  { id: 'm2', title: 'Mock B', topics: ['Mixed'], totalDurationMinutes: 60 },
]);

describe('Phase-5 Zod contracts', () => {
  it('accepts a valid plan and applies defaults', () => {
    const parsed = planCreateSchema.parse({
      title: '  60-day interview prep  ', goal: 'interview_60_days',
      startDate: START, endDate: END, dailyMinutes: 90, restDays: [0],
      sheetIds: ['507f1f77bcf86cd799439011'],
    });
    assert.equal(parsed.title, '60-day interview prep');
    assert.deepEqual(parsed.quizIds, []);
    assert.equal(parsed.revisionEnabled, true);
    assert.equal(parsed.mockIntervalDays, MOCK_INTERVAL_DAYS);
    assert.equal(parsed.replaceActive, true);
  });

  it('rejects invalid dates, backwards ranges, all-rest weeks and empty selection', () => {
    const base = { title: 'Valid plan', goal: 'dsa_beginner', startDate: START, endDate: END, dailyMinutes: 60 };
    assert.equal(dateKeySchema.safeParse('2026-02-30').success, false);
    assert.equal(dateKeySchema.safeParse('2026-02-28').success, true);
    assert.equal(planCreateSchema.safeParse({ ...base, endDate: '2026-10-01', sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse({ ...base, restDays: [0, 1, 2, 3, 4, 5, 6], sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse({ ...base, restDays: [0, 0], sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse(base).success, false); // nothing selected
    assert.equal(planCreateSchema.safeParse({ ...base, hacker: 1, sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse({ ...base, dailyMinutes: 5, sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
  });

  it('validates updates, task filters, status and reschedule payloads', () => {
    assert.throws(() => planUpdateSchema.parse({}));
    assert.equal(planUpdateSchema.parse({ dailyMinutes: 120 }).dailyMinutes, 120);
    assert.equal(taskListQuerySchema.safeParse({ from: '2026-11-10', to: '2026-11-01' }).success, false);
    assert.equal(taskListQuerySchema.parse({}).limit, 200);
    assert.equal(taskStatusSchema.parse({ status: ST.DONE }).status, ST.DONE);
    assert.equal(rescheduleSchema.parse({}).taskIds, undefined);
    assert.equal(dashboardQuerySchema.parse({}).horizon, 30);
  });
});

describe('date helpers', () => {
  it('uses UTC calendar-day keys with no DST drift', () => {
    assert.equal(dateKey(new Date('2026-11-02T23:59:59.000Z')), '2026-11-02');
    assert.equal(dateKey('2026-03-29T01:00:00+05:30'), '2026-03-28');
    assert.equal(isValidDateKey('2026-02-30'), false);
    assert.equal(addDays('2026-11-30', 1), '2026-12-01');
    assert.equal(diffDays(START, END), 29);
    assert.equal(weekdayOf(START), 1);
  });

  it('skips rest days when building working dates', () => {
    assert.equal(isRestDay('2026-11-08', REST), true);
    assert.equal(isRestDay('2026-11-09', REST), false);
    const dates = workingDates('2026-11-02', '2026-11-15', REST);
    assert.equal(dates.length, 12); // 14 days − 2 Sundays
    assert.ok(!dates.includes('2026-11-08'));
    assert.equal(nextWorkingDate('2026-11-08', REST), '2026-11-09');
    assert.equal(workingDates(END, START, REST).length, 0);
    assert.ok(extendDates(dates, REST, 5).length >= 17);
  });
});

describe('unit building', () => {
  it('expands published sheets into problem units and keeps quizzes whole', () => {
    const units = buildUnits({
      sheets: [{ id: 's1', problems: [
        { id: 'p2', title: 'Second', order: 1, estimatedMinutes: 30, topic: 'DP', url: 'u2' },
        { id: 'p1', title: 'First', order: 0, estimatedMinutes: 20, topic: 'Arrays', url: 'u1' },
      ] }],
      quizzes: [{ id: 'q1', title: 'Arrays quiz', topics: ['Arrays'], settings: { timerMinutes: 15 } }],
    });
    assert.equal(units.length, 3);
    assert.equal(units[0].title, 'First'); // sorted by order
    assert.equal(units[0].minutes, 20);
    assert.equal(units[2].type, TT.QUIZ);
    assert.equal(units[2].url, '/app/quizzes/q1');
  });

  it('builds a mock pool with a sane minimum duration', () => {
    const pool = buildMockPool([{ id: 'm', title: 'M', topics: ['Mixed'], totalDurationMinutes: 0 }]);
    assert.equal(pool[0].minutes, 60);
    assert.equal(pool[0].type, TT.MOCK);
  });
});

describe('distribution: daily budget, mock cadence, spaced revisions', () => {
  const options = { start: START, end: END, dailyMinutes: 60, restDays: REST, mockPool: mockPool() };

  it('never exceeds the daily budget on normal tasks', () => {
    const units = Array.from({ length: 12 }, (_, index) => problem(`p${index}`, 25));
    const result = distribute(units, options);
    const byDate = dailyLoad(result.tasks, 60);
    assert.ok(byDate.every((day) => day.minutes <= 60), JSON.stringify(byDate));
    assert.equal(result.tasks.filter((task) => task.type === TT.PROBLEM).length, 12);
  });

  it('inserts a mock every 14 calendar days, cycling the pool', () => {
    const result = distribute([problem('p1', 20)], options);
    const mocks = result.tasks.filter((task) => task.type === TT.MOCK).sort((a, b) => a.date.localeCompare(b.date));
    assert.equal(mocks.length, 3); // day 0, 14, 28
    assert.equal(mocks[0].date, START);
    assert.equal(mocks[1].date, addDays(START, 14));
    assert.equal(mocks[2].date, addDays(START, 28));
    assert.equal(mocks[0].refId, 'm1');
    assert.equal(mocks[1].refId, 'm2');
  });

  it('inserts 1/7/21-day revisions after each learn task', () => {
    const result = distribute([problem('p1', 20)], options);
    const revisions = result.tasks.filter((task) => task.type === TT.REVISION).sort((a, b) => a.revisionInterval - b.revisionInterval);
    assert.equal(revisions.length, 3);
    assert.deepEqual(revisions.map((task) => task.revisionInterval), REVISION_INTERVALS);
    assert.equal(revisions[0].date, addDays(result.tasks.find((task) => task.type === TT.PROBLEM).date, 1));
    assert.ok(revisions.every((task) => task.url.includes('p1')));
  });

  it('can disable revisions and warns when no mocks exist', () => {
    const result = distribute([problem('p1', 20)], { ...options, mockPool: [], revisionEnabled: false, autoMocks: true });
    assert.equal(result.tasks.filter((task) => task.type === TT.REVISION).length, 0);
    assert.ok(result.warnings.some((warning) => warning.code === 'NO_MOCKS_AVAILABLE'));
  });

  it('flags an oversized task and a day over budget instead of dropping work', () => {
    const result = distribute([problem('huge', 200)], { ...options, revisionEnabled: false });
    assert.ok(result.tasks.some((task) => task.type === TT.PROBLEM && task.overloaded));
    assert.ok(result.warnings.some((warning) => warning.code === 'SINGLE_TASK_TOO_LONG'));
    assert.ok(result.warnings.some((warning) => warning.code === 'DAILY_OVERLOAD'));
  });

  it('returns a clear warning when every day is a rest day', () => {
    const result = distribute([problem('p1', 20)], { start: START, end: START, dailyMinutes: 60, restDays: [1], mockPool: [] });
    assert.equal(result.tasks.length, 0);
    assert.equal(result.warnings[0].code, 'NO_WORKING_DAYS');
  });

  it('produces deterministic task keys so regeneration cannot duplicate rows', () => {
    const units = [problem('p1', 20)];
    const first = distribute(units, options);
    const second = distribute(units, options);
    assert.deepEqual(first.tasks.map((task) => task.taskKey), second.tasks.map((task) => task.taskKey));
    assert.equal(new Set(first.tasks.map((task) => task.taskKey)).size, first.tasks.length);
  });
});

describe('rescheduling + streak + progress', () => {
  it('moves missed tasks into remaining capacity', () => {
    const missed = [
      { taskKey: 'a', date: '2026-11-01', estimatedMinutes: 20, title: 'A' },
      { taskKey: 'b', date: '2026-11-01', estimatedMinutes: 20, title: 'B' },
    ];
    const result = reschedule(missed, [], { today: '2026-11-09', end: '2026-11-20', dailyMinutes: 60, restDays: REST });
    assert.equal(result.moves.length, 2);
    assert.ok(result.moves.every((move) => move.date >= '2026-11-09'));
    assert.equal(result.moves[0].status, ST.PENDING);
    assert.equal(result.moves[0].rescheduledFrom, '2026-11-01');
    assert.equal(result.moves[0].rescheduleCount, 1);
  });

  it('respects already-planned minutes and warns on overload', () => {
    const existing = Array.from({ length: 3 }, () => ({ date: '2026-11-09', estimatedMinutes: 25 }));
    const result = reschedule([{ taskKey: 'a', date: '2026-11-01', estimatedMinutes: 30 }], existing,
      { today: '2026-11-09', end: '2026-11-20', dailyMinutes: 60, restDays: REST });
    assert.notEqual(result.moves[0].date, '2026-11-09');
  });

  it('counts a streak across rest days without breaking it', () => {
    // Fri, Sat, (Sun rest), Mon — four completions, sun is transparent.
    const streak = computeStreak(['2026-11-06', '2026-11-07', '2026-11-09'], '2026-11-09', REST);
    assert.equal(streak.current, 3);
    assert.equal(streak.longest, 3);
    assert.equal(computeStreak([], '2026-11-09', REST).current, 0);
    // A missed working day ends the run.
    assert.equal(computeStreak(['2026-11-01', '2026-11-02', '2026-11-09'], '2026-11-09', REST).current, 1);
  });

  it('computes progress excluding skipped tasks from the denominator', () => {
    const tasks = [
      { status: ST.DONE, estimatedMinutes: 20 }, { status: ST.DONE, estimatedMinutes: 10 },
      { status: ST.PENDING, estimatedMinutes: 10 }, { status: ST.SKIPPED, estimatedMinutes: 5 },
      { status: ST.MISSED, estimatedMinutes: 5 },
    ];
    const progress = computeProgress(tasks);
    assert.equal(progress.total, 5);
    assert.equal(progress.done, 2);
    assert.equal(progress.missed, 1);
    assert.equal(progress.completionPercentage, 50); // 2 of 4 countable
    assert.equal(progress.minutesDone, 30);
  });

  it('aggregates weak topics from quiz and mock stats', () => {
    const weak = aggregateWeakTopics(
      [{ topic: 'Arrays', total: 4, correct: 3, percentage: 75, lostMarks: 0 }],
      [{ topic: 'DP', total: 5, correct: 1, percentage: 20, lostMarks: 8 }, { topic: 'Arrays', total: 2, correct: 1, percentage: 50, lostMarks: 2 }],
    );
    assert.equal(weak[0].topic, 'DP');
    assert.equal(weak[0].severity, 'high');
    assert.deepEqual(weak.find((entry) => entry.topic === 'Arrays').sources.sort(), ['mock', 'quiz']);
  });
});
