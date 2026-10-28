import {
  GOAL_OPTIONS, PLAN_LIMITS, PLAN_STATUS_LABELS, REVISION_INTERVALS,
  TASK_SOURCE_VALUES, TASK_STATUS_LABELS, TASK_STATUS_VALUES,
  TASK_TYPE_LABELS, TASK_TYPE_VALUES, WEEKDAYS,
} from '@algonest/shared/constants';

export const GOALS = GOAL_OPTIONS;
export const TASK_TYPE_OPTIONS = TASK_TYPE_VALUES.map((value) => ({ value, label: TASK_TYPE_LABELS[value] }));
export const TASK_STATUS_OPTIONS = TASK_STATUS_VALUES.map((value) => ({ value, label: TASK_STATUS_LABELS[value] }));
export const WEEKDAY_OPTIONS = WEEKDAYS.map((day) => ({ value: day.value, label: day.label, long: day.long }));

export const STATUS_TONE = {
  active: 'success', paused: 'warning', completed: 'accent', archived: 'neutral',
};
export const TASK_TONE = {
  pending: 'neutral', in_progress: 'warning', done: 'success', skipped: 'neutral', missed: 'danger',
};
export const TYPE_TONE = {
  problem: 'primary', quiz: 'accent', mock: 'warning', revision: 'success',
};
export const SEVERITY_TONE = { high: 'danger', medium: 'warning', low: 'accent' };

export const planStatusLabel = (value) => PLAN_STATUS_LABELS[value] ?? value;
export const taskStatusLabel = (value) => TASK_STATUS_LABELS[value] ?? value;
export const taskTypeLabel = (value) => TASK_TYPE_LABELS[value] ?? value;

export function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong. Please try again.';
}

export function contractErrors(error) {
  const result = {};
  for (const issue of error?.issues ?? []) {
    const key = issue.path.join('.') || '_';
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

export function apiFieldErrors(error) {
  const result = {};
  for (const issue of error?.errors ?? []) {
    if (issue?.field && !result[issue.field]) result[issue.field] = issue.message;
  }
  return result;
}

/* ── UTC date keys, mirroring the server engine exactly ── */

export function dateKey(value = new Date()) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

export function addDays(key, days) {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function diffDays(from, to) {
  const a = new Date(`${from}T00:00:00.000Z`).getTime();
  const b = new Date(`${to}T00:00:00.000Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function weekdayOf(key) {
  return new Date(`${key}T00:00:00.000Z`).getUTCDay();
}

export function formatDate(key, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  if (!key) return '—';
  const date = new Date(`${key}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { ...options, timeZone: 'UTC' }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function formatMinutes(minutes = 0) {
  const value = Math.max(0, Math.round(Number(minutes) || 0));
  if (value < 60) return `${value} min`;
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}

export function relativeDay(key, today = dateKey()) {
  const delta = diffDays(today, key);
  if (delta === 0) return 'Today';
  if (delta === 1) return 'Tomorrow';
  if (delta === -1) return 'Yesterday';
  if (delta < 0) return `${-delta} days late`;
  return `in ${delta} days`;
}

export function buildCalendarWeeks(from, to, tasksByDate = {}) {
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  const gridStart = new Date(start);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
  const weeks = [];
  let cursor = new Date(gridStart);
  while (cursor <= end || cursor.getUTCDay() !== 0) {
    const week = [];
    for (let index = 0; index < 7; index += 1) {
      const key = cursor.toISOString().slice(0, 10);
      week.push({ key, inRange: cursor >= start && cursor <= end, day: tasksByDate[key] ?? null });
      cursor = new Date(cursor.getTime() + 86_400_000);
    }
    weeks.push(week);
    if (weeks.length > 8) break;
  }
  return weeks;
}

export function warningTone(code) {
  if (code === 'DAILY_OVERLOAD' || code === 'RESCHEDULE_OVERLOAD') return 'warning';
  if (code === 'NO_WORKING_DAYS' || code === 'TASK_UNSCHEDULED') return 'danger';
  return 'info';
}

export function warningLabel(code) {
  const labels = {
    DAILY_OVERLOAD: 'Day over capacity',
    SINGLE_TASK_TOO_LONG: 'Task longer than a day',
    OVERFLOW_PAST_END: 'Plan overruns the end date',
    NO_WORKING_DAYS: 'No working days',
    NO_MOCKS_AVAILABLE: 'No mocks available',
    TASK_UNSCHEDULED: 'Task could not fit',
    RESCHEDULE_OVERLOAD: 'Rescheduling caused overload',
    REVISION_SKIPPED: 'Revision fell outside the plan',
  };
  return labels[code] ?? code;
}

export function taskHref(task) {
  if (!task) return '/app/plans';
  if (task.refType === 'Quiz' && task.refId) return `/app/quizzes/${task.refId}`;
  if (task.refType === 'MockTest' && task.refId) return `/app/mocks/${task.refId}`;
  if (task.refType === 'Sheet' && task.sheetId) return `/app/sheets/${task.sheetId}`;
  if (task.url && /^https?:\/\//i.test(task.url)) return task.url;
  return '/app/plans';
}

export function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

export const REVISION_OPTIONS = REVISION_INTERVALS.map((value) => ({ value, label: `+${value} day${value === 1 ? '' : 's'}` }));
export const SOURCE_OPTIONS = TASK_SOURCE_VALUES.map((value) => ({ value, label: value }));
export const DEFAULT_PLAN_DRAFT = (start) => ({
  title: '', goal: '', startDate: start, endDate: addDays(start, 59),
  dailyMinutes: 90, restDays: [0], sheetIds: [], quizIds: [], mockIds: [],
  revisionEnabled: true, mockIntervalDays: 14, replaceActive: true, notes: '',
});

export function estimatedDays(payload) {
  return Math.max(0, diffDays(payload.startDate, payload.endDate) + 1);
}

export function planCapacityLabel(payload, content) {
  const minutes = [
    ...(content?.sheets ?? []).filter((item) => payload.sheetIds.includes(item.id)),
    ...(content?.quizzes ?? []).filter((item) => payload.quizIds.includes(item.id)),
  ].reduce((sum, item) => sum + (item.estimatedMinutes ?? item.minutes ?? 0), 0);
  const days = estimatedDays(payload);
  const working = Math.max(1, days - Math.floor(days / 7) * payload.restDays.length);
  return { minutes, workingDays: working, minutesPerDay: Math.round(minutes / working) };
}

export { PLAN_LIMITS };
