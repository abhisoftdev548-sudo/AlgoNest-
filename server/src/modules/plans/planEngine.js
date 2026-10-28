import {
  MOCK_INTERVAL_DAYS, PLAN_LIMITS, REVISION_INTERVALS,
  TASK_SOURCES as SRC, TASK_STATUSES as ST, TASK_TYPES as T,
} from '@algonest/shared';

/**
 * Pure adaptive-plan engine. No DB, no Express, no hidden clock — every
 * function takes explicit date keys so the unit tests are deterministic.
 *
 * A "date" here is always a UTC `YYYY-MM-DD` string. That removes DST and
 * timezone drift from scheduling and makes task ids stable across reloads.
 */

const DAY_MS = 86_400_000;

export function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function dateKey(value = new Date()) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && isValidDateKey(value)) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  if (typeof value === 'number') return new Date(value).toISOString().slice(0, 10);
  throw new TypeError('Expected a Date, date key or parseable date string');
}

export function toDate(key) {
  return new Date(`${key}T00:00:00.000Z`);
}

export function addDays(key, days) {
  return new Date(toDate(key).getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

export function diffDays(from, to) {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / DAY_MS);
}

/** 0 = Sunday … 6 = Saturday, in UTC. */
export function weekdayOf(key) {
  return toDate(key).getUTCDay();
}

export function isRestDay(key, restDays = []) {
  return restDays.includes(weekdayOf(key));
}

export function workingDates(start, end, restDays = []) {
  const result = [];
  if (diffDays(start, end) < 0) return result;
  for (let cursor = start; diffDays(cursor, end) >= 0; cursor = addDays(cursor, 1)) {
    if (!isRestDay(cursor, restDays)) result.push(cursor);
  }
  return result;
}

/** First non-rest date on or after `key` (bounded to avoid infinite loops). */
export function nextWorkingDate(key, restDays = [], maxLookahead = 14) {
  let cursor = key;
  for (let index = 0; index <= maxLookahead; index += 1) {
    if (!isRestDay(cursor, restDays)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return cursor; // all seven days are rest days — the contract forbids this
}

/** Extend the working-date list past `end` when the plan overflows. */
export function extendDates(dates, restDays = [], extra = PLAN_LIMITS.MAX_OVERFLOW_DAYS) {
  const result = [...dates];
  if (!result.length) return result;
  let cursor = addDays(result[result.length - 1], 1);
  while (result.length < dates.length + extra) {
    if (!isRestDay(cursor, restDays)) result.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return result;
}

const num = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Flatten published content into schedulable units.
 * Sheets expand into their embedded problems (the actionable item); quizzes
 * and mocks stay single units.
 */
export function buildUnits({ sheets = [], quizzes = [] } = {}) {
  const units = [];
  for (const sheet of sheets) {
    const problems = [...(sheet.problems ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const problem of problems) {
      units.push({
        type: T.PROBLEM,
        title: problem.title || 'Untitled problem',
        topic: problem.topic || 'General',
        minutes: Math.ceil(num(problem.estimatedMinutes, 20)),
        refId: String(problem.id ?? problem._id),
        refType: 'Sheet',
        sheetId: String(sheet.id ?? sheet._id),
        url: problem.url || '',
        difficulty: problem.difficulty || 'medium',
      });
    }
  }
  for (const quiz of quizzes) {
    units.push({
      type: T.QUIZ,
      title: quiz.title || 'Untitled quiz',
      topic: (quiz.topics ?? [])[0] || 'General',
      minutes: Math.ceil(num(quiz.settings?.timerMinutes, 20)),
      refId: String(quiz.id ?? quiz._id),
      refType: 'Quiz',
      url: `/app/quizzes/${String(quiz.id ?? quiz._id)}`,
      difficulty: quiz.difficulty || 'medium',
    });
  }
  return units;
}

export function buildMockPool(mocks = []) {
  return mocks.map((mock) => ({
    type: T.MOCK,
    title: mock.title || 'Full-length mock',
    topic: (mock.topics ?? [])[0] || 'Mixed',
    minutes: Math.ceil(num(mock.totalDurationMinutes, 60)),
    refId: String(mock.id ?? mock._id),
    refType: 'MockTest',
    url: `/app/mocks/${String(mock.id ?? mock._id)}`,
  }));
}

const warn = (code, message, extra = {}) => ({ code, message, ...extra });

/**
 * Distribute units into daily buckets, then overlay the 14-day mock cadence
 * and the 1/7/21 revision cadence.
 *
 * @returns {{tasks:Array, warnings:Array, dailyLoad:Object, usedDates:Array}}
 */
export function distribute(units, options) {
  const {
    start, end, dailyMinutes, restDays = [], revisionEnabled = true,
    mockIntervalDays = MOCK_INTERVAL_DAYS, mockPool = [], autoMocks = false,
  } = options;
  const capacity = Math.max(1, Number(dailyMinutes) || 60);
  const warnings = [];
  const baseDates = workingDates(start, end, restDays);
  if (!baseDates.length) return { tasks: [], warnings: [warn('NO_WORKING_DAYS', 'Every day in this range is a rest day. Keep at least one working day.')], dailyLoad: {}, usedDates: [] };
  const dates = extendDates(baseDates, restDays);
  const loads = Object.fromEntries(dates.map((date) => [date, 0]));
  const tasks = [];
  let sequence = 0;

  const addTask = (date, unit, extra = {}) => {
    sequence += 1;
    const oversized = unit.minutes > capacity;
    if (oversized) warnings.push(warn('SINGLE_TASK_TOO_LONG', `"${unit.title}" needs ${unit.minutes} min but a day only has ${capacity} min.`, { date, taskTitle: unit.title }));
    const task = {
      taskKey: extra.taskKey ?? `${unit.type}:${unit.refId}:${date}:${extra.interval ?? 0}`,
      date,
      order: extra.order ?? sequence,
      type: unit.type,
      title: unit.title,
      topic: unit.topic || 'General',
      description: extra.description ?? '',
      refId: unit.refId,
      refType: unit.refType,
      sheetId: unit.sheetId ?? null,
      url: unit.url ?? '',
      estimatedMinutes: unit.minutes,
      status: ST.PENDING,
      source: extra.source ?? SRC.GENERATED,
      revisionInterval: extra.interval ?? null,
      revisionOf: extra.revisionOf ?? null,
      overloaded: oversized,
      rescheduledFrom: null,
      rescheduleCount: 0,
      note: '',
    };
    tasks.push(task);
    loads[date] = (loads[date] ?? 0) + unit.minutes;
    return task;
  };

  /* 1. Reserve the mock cadence FIRST so a long mock is never pushed off. */
  if (mockPool.length) {
    const interval = Math.max(7, Number(mockIntervalDays) || MOCK_INTERVAL_DAYS);
    for (let offset = 0, index = 0; diffDays(start, addDays(start, offset)) <= diffDays(start, end); offset += interval, index += 1) {
      const target = nextWorkingDate(addDays(start, offset), restDays);
      if (diffDays(end, target) > 0) break; // target is past the plan end
      const unit = mockPool[index % mockPool.length];
      const task = addTask(target, unit, { source: SRC.MOCK, taskKey: `mock:${unit.refId}:${target}:${index}` });
      task.description = 'Full-length timed mock. Review the analysis afterwards.';
    }
  } else if (autoMocks) {
    warnings.push(warn('NO_MOCKS_AVAILABLE', 'No published mock tests were available, so the 14-day mock cadence was skipped.'));
  }

  /* 2. Place the learning units into the first day with enough capacity. */
  const learnable = [];
  for (const unit of units) {
    let placed = false;
    for (let index = 0; index < dates.length; index += 1) {
      const date = dates[index];
      const dayTasks = tasks.filter((task) => task.date === date);
      const fits = (loads[date] ?? 0) + unit.minutes <= capacity || (loads[date] ?? 0) === 0;
      const tooMany = dayTasks.length >= PLAN_LIMITS.MAX_TASKS_PER_DAY;
      if (tooMany) continue;
      if (!fits) continue;
      if (diffDays(end, date) > 0 && warnings.every((item) => item.code !== 'OVERFLOW_PAST_END')) {
        warnings.push(warn('OVERFLOW_PAST_END', `The workload does not fit before ${end}; ${date} and later are overflow days. Consider a longer plan or fewer items.`));
      }
      const task = addTask(date, unit, { taskKey: `${unit.type}:${unit.refId}:${date}:0` });
      learnable.push(task);
      placed = true;
      break;
    }
    if (!placed) warnings.push(warn('TASK_UNSCHEDULED', `"${unit.title}" could not be scheduled within the allowed overflow.`, { taskTitle: unit.title }));
  }

  /* 3. Spaced revisions at +1 / +7 / +21 days after each learn task. */
  if (revisionEnabled) {
    for (const source of learnable) {
      for (const interval of REVISION_INTERVALS) {
        const target = nextWorkingDate(addDays(source.date, interval), restDays);
        const unit = {
          type: T.REVISION,
          title: `Revise: ${source.title}`,
          topic: source.topic,
          minutes: Math.min(PLAN_LIMITS.REVISION_MINUTES, Math.max(5, Math.ceil(source.estimatedMinutes / 3))),
          refId: source.refId,
          refType: source.refType,
          url: source.url,
          sheetId: source.sheetId,
        };
        // Search forward from the target for a day with capacity; never drop it.
        const startIndex = dates.findIndex((date) => date >= target);
        if (startIndex < 0) {
          warnings.push(warn('REVISION_SKIPPED', `A ${interval}-day revision for "${source.title}" falls outside the plan.`, { taskTitle: source.title }));
          continue;
        }
        let chosen = dates[startIndex];
        for (let index = startIndex; index < dates.length; index += 1) {
          const date = dates[index];
          if ((loads[date] ?? 0) + unit.minutes <= capacity) { chosen = date; break; }
        }
        addTask(chosen, unit, {
          source: SRC.REVISION,
          interval,
          revisionOf: source.taskKey,
          taskKey: `revision:${source.taskKey}:${interval}`,
          description: `${interval}-day spaced revision of this topic.`,
        });
      }
    }
  }

  /* 4. Flag days whose total exceeds the learner's daily budget. */
  for (const date of Object.keys(loads)) {
    if (loads[date] > capacity) {
      warnings.push(warn('DAILY_OVERLOAD', `${date} has ${loads[date]} min of work but your budget is ${capacity} min.`, { date, minutes: loads[date] }));
      for (const task of tasks) if (task.date === date) task.overloaded = true;
    }
  }

  const usedDates = [...new Set(tasks.map((task) => task.date))].sort();
  return {
    tasks: tasks.sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order),
    warnings: dedupeWarnings(warnings),
    dailyLoad: loads,
    usedDates,
  };
}

function dedupeWarnings(warnings) {
  const seen = new Set();
  return warnings.filter((item) => {
    const key = `${item.code}:${item.date ?? ''}:${item.taskTitle ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 60);
}

/**
 * Move missed tasks into the remaining capacity from `today` onward and
 * re-anchor their revisions. `existing` are already-planned (non-missed)
 * tasks whose minutes must be respected.
 */
export function reschedule(missed, existing, options) {
  const { today, end, dailyMinutes, restDays = [], revisionIntervals = REVISION_INTERVALS } = options;
  const capacity = Math.max(1, Number(dailyMinutes) || 60);
  const baseDates = workingDates(today, end, restDays);
  const dates = baseDates.length ? extendDates(baseDates, restDays, Math.min(30, PLAN_LIMITS.MAX_OVERFLOW_DAYS)) : [];
  const loads = Object.fromEntries(dates.map((date) => [date, 0]));
  for (const task of existing) {
    if (loads[task.date] !== undefined) loads[task.date] += Number(task.estimatedMinutes) || 0;
  }
  const warnings = [];
  const moves = [];
  const sorted = [...missed].sort((a, b) => a.date.localeCompare(b.date) || (a.order ?? 0) - (b.order ?? 0));

  for (const task of sorted) {
    const minutes = Number(task.estimatedMinutes) || 0;
    let chosen = null;
    for (const date of dates) {
      if ((loads[date] ?? 0) + minutes <= capacity) { chosen = date; break; }
    }
    if (!chosen) {
      chosen = dates[dates.length - 1] ?? today;
      warnings.push(warn('RESCHEDULE_OVERLOAD', `${chosen} now exceeds ${capacity} min while rescheduling "${task.title}".`, { date: chosen }));
    }
    loads[chosen] = (loads[chosen] ?? 0) + minutes;
    moves.push({
      taskKey: task.taskKey,
      date: chosen,
      rescheduledFrom: task.date,
      rescheduleCount: (Number(task.rescheduleCount) || 0) + 1,
      source: SRC.RESCHEDULED,
      status: ST.PENDING,
      overloaded: loads[chosen] > capacity,
    });
  }

  for (const date of Object.keys(loads)) {
    if (loads[date] > capacity) warnings.push(warn('DAILY_OVERLOAD', `${date} is overloaded at ${loads[date]}/${capacity} min after rescheduling.`, { date }));
  }
  return { moves, warnings: dedupeWarnings(warnings), dailyLoad: loads, intervals: revisionIntervals };
}

/**
 * Consecutive non-rest days with at least one completed task. Rest days are
 * transparent: they neither count nor break the run. If today has no
 * completion yet, the streak is still measured up to yesterday.
 */
export function computeStreak(completedDates = [], today, restDays = []) {
  const done = new Set(completedDates.filter(isValidDateKey));
  const sorted = [...done].sort();
  if (!sorted.length || !isValidDateKey(today)) return { current: 0, longest: 0, lastActiveDate: sorted[sorted.length - 1] ?? null };

  let cursor = today;
  if (!done.has(cursor)) cursor = addDays(today, -1);
  // Skip rest days at the head of the walk.
  for (let index = 0; index < 7 && isRestDay(cursor, restDays); index += 1) cursor = addDays(cursor, -1);

  let current = 0;
  const earliest = sorted[0];
  while (diffDays(earliest, cursor) >= 0) {
    if (isRestDay(cursor, restDays)) { cursor = addDays(cursor, -1); continue; }
    if (!done.has(cursor)) break;
    current += 1;
    cursor = addDays(cursor, -1);
  }

  // Longest run over the whole history.
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const date of sorted) {
    if (isRestDay(date, restDays)) continue;
    if (previous) {
      let bridge = addDays(previous, 1);
      let gapOk = true;
      while (diffDays(bridge, date) < 0) {
        if (!isRestDay(bridge, restDays)) { gapOk = false; break; }
        bridge = addDays(bridge, 1);
      }
      run = gapOk ? run + 1 : 1;
    } else run = 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  return { current, longest: Math.max(longest, current), lastActiveDate: sorted[sorted.length - 1] };
}

export function computeProgress(tasks = []) {
  const result = {
    total: tasks.length, done: 0, skipped: 0, pending: 0, inProgress: 0, missed: 0,
    minutesTotal: 0, minutesDone: 0, completionPercentage: 0,
  };
  for (const task of tasks) {
    result.minutesTotal += Number(task.estimatedMinutes) || 0;
    if (task.status === ST.DONE) { result.done += 1; result.minutesDone += Number(task.estimatedMinutes) || 0; }
    else if (task.status === ST.SKIPPED) result.skipped += 1;
    else if (task.status === ST.IN_PROGRESS) result.inProgress += 1;
    else if (task.status === ST.MISSED) result.missed += 1;
    else result.pending += 1;
  }
  const countable = result.total - result.skipped;
  result.completionPercentage = countable > 0 ? Math.round((result.done / countable) * 1000) / 10 : 0;
  return result;
}

export function dailyLoad(tasks = [], dailyMinutes = 60) {
  const map = {};
  for (const task of tasks) map[task.date] = (map[task.date] ?? 0) + (Number(task.estimatedMinutes) || 0);
  return Object.entries(map).map(([date, minutes]) => ({
    date, minutes, capacity: dailyMinutes,
    overloaded: minutes > dailyMinutes,
    ratio: dailyMinutes ? Math.round((minutes / dailyMinutes) * 100) : 0,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

/** Merge quiz + mock topic stats into one ranked weak-topic list. */
export function aggregateWeakTopics(quizStats = [], mockStats = [], limit = PLAN_LIMITS.WEAK_TOPIC_LIMIT) {
  const map = new Map();
  const add = (stat, weight) => {
    const topic = String(stat.topic ?? stat.key ?? 'General');
    const total = Number(stat.total) || 0;
    const correct = Number(stat.correct) || 0;
    const percentage = Number(stat.percentage);
    const row = map.get(topic) ?? { topic, total: 0, correct: 0, attempts: 0, weightedPercentage: 0, lostMarks: 0, sources: new Set() };
    row.total += total;
    row.correct += correct;
    row.attempts += 1;
    row.weightedPercentage += (Number.isFinite(percentage) ? percentage : total ? (correct / total) * 100 : 100) * (total || 1) * weight;
    row.lostMarks += Number(stat.lostMarks) || 0;
    row.sources.add(weight === 1.2 ? 'mock' : 'quiz');
    map.set(topic, row);
  };
  for (const stat of quizStats) add(stat, 1);
  for (const stat of mockStats) add(stat, 1.2); // full-length mocks weigh more

  return [...map.values()]
    .map((row) => ({
      topic: row.topic,
      total: row.total,
      correct: row.correct,
      attempts: row.attempts,
      percentage: Math.round((row.weightedPercentage / Math.max(1, row.total)) * 10) / 10,
      lostMarks: Math.round(row.lostMarks * 10) / 10,
      sources: [...row.sources],
      severity: row.weightedPercentage / Math.max(1, row.total) < 40 ? 'high' : row.weightedPercentage / Math.max(1, row.total) < 65 ? 'medium' : 'low',
    }))
    .sort((a, b) => a.percentage - b.percentage || b.lostMarks - a.lostMarks || a.topic.localeCompare(b.topic))
    .slice(0, limit);
}
