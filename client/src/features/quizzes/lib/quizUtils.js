import {
  ATTEMPT_STATUS_LABELS, QUIZ_STATUS_LABELS, QUIZ_VISIBILITY_LABELS,
  QUESTION_TYPE_LABELS, QUESTION_TYPE_VALUES, DIFFICULTY_LABELS, DIFFICULTY_VALUES,
  SHEET_TOPICS, QUIZ_SORT_OPTIONS,
} from '@algonest/shared';

export const QUESTION_TYPE_OPTIONS = QUESTION_TYPE_VALUES.map((value) => ({ value, label: QUESTION_TYPE_LABELS[value] }));
export const DIFFICULTY_OPTIONS = DIFFICULTY_VALUES.map((value) => ({ value, label: DIFFICULTY_LABELS[value] }));
export const TOPIC_OPTIONS = SHEET_TOPICS.map((value) => ({ value, label: value }));
export const VISIBILITY_OPTIONS = Object.entries(QUIZ_VISIBILITY_LABELS).map(([value, label]) => ({ value, label }));
export const SORT_OPTIONS = QUIZ_SORT_OPTIONS.map((value) => ({
  value, label: value.charAt(0).toUpperCase() + value.slice(1),
}));
export const STATUS_OPTIONS = Object.entries(QUIZ_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export const typeLabel = (value) => QUESTION_TYPE_LABELS[value] ?? value;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;
export const quizStatusLabel = (value) => QUIZ_STATUS_LABELS[value] ?? value;
export const attemptStatusLabel = (value) => ATTEMPT_STATUS_LABELS[value] ?? value;

export const STATUS_TONE = {
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
};
export const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };
export const ATTEMPT_TONE = {
  in_progress: 'warning', submitted: 'success', timed_out: 'danger', abandoned: 'neutral',
};
export const SCORE_TONE = (percentage, passPercentage) =>
  percentage >= passPercentage ? 'success' : percentage >= passPercentage * 0.6 ? 'warning' : 'danger';

export function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong. Please try again.';
}

/** Zod field errors from a shared-contract parse, for inline form feedback. */
export function contractErrors(error) {
  const result = {};
  for (const issue of error?.issues ?? []) {
    const key = issue.path.join('.') || '_';
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

/** API error array → { field: message } for form rendering. */
export function apiFieldErrors(error) {
  const result = {};
  for (const issue of error?.errors ?? []) {
    if (issue?.field && !result[issue.field]) result[issue.field] = issue.message;
  }
  return result;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

/** mm:ss from seconds — used by the countdown and the result page. */
export function formatClock(totalSeconds = 0) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function formatDuration(seconds = 0) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  if (value < 60) return `${value}s`;
  return `${Math.floor(value / 60)}m ${value % 60}s`;
}

export const ordinal = (index) => `Q${index + 1}`;

export default { errorMessage, formatClock };
