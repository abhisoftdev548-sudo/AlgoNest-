import {
  DIFFICULTY_LABELS, DIFFICULTY_VALUES, MOCK_ATTEMPT_STATUS_LABELS,
  MOCK_SORT_OPTIONS, MOCK_STATUS_LABELS, MOCK_TIMER_MODE_LABELS,
  MOCK_VISIBILITY_VALUES, PALETTE_STATE_LABELS, PALETTE_STATES as P,
  SHEET_TOPICS, WRONG_REASON_LABELS, WRONG_REASON_VALUES,
} from '@algonest/shared';

export const DIFFICULTY_OPTIONS = DIFFICULTY_VALUES.map((value) => ({ value, label: DIFFICULTY_LABELS[value] }));
export const TOPIC_OPTIONS = SHEET_TOPICS.map((value) => ({ value, label: value }));
export const SORT_OPTIONS = MOCK_SORT_OPTIONS.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
export const TIMER_MODE_OPTIONS = Object.entries(MOCK_TIMER_MODE_LABELS).map(([value, label]) => ({ value, label }));
export const VISIBILITY_OPTIONS = MOCK_VISIBILITY_VALUES.map((value) => ({
  value, label: value.charAt(0).toUpperCase() + value.slice(1),
}));
export const REASON_OPTIONS = WRONG_REASON_VALUES.map((value) => ({ value, label: WRONG_REASON_LABELS[value] }));

export const mockStatusLabel = (value) => MOCK_STATUS_LABELS[value] ?? value;
export const attemptStatusLabel = (value) => MOCK_ATTEMPT_STATUS_LABELS[value] ?? value;
export const paletteLabel = (value) => PALETTE_STATE_LABELS[value] ?? value;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;

export const STATUS_TONE = {
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
};
export const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };
export const ATTEMPT_TONE = {
  in_progress: 'warning', submitted: 'success', timed_out: 'danger', abandoned: 'neutral',
};
export const SEVERITY_TONE = { high: 'danger', medium: 'warning', low: 'accent' };

/** Tailwind classes for each of the five palette states. */
export const PALETTE_CLASS = {
  [P.NOT_VISITED]: 'bg-surface-2 text-muted border-line',
  [P.NOT_ANSWERED]: 'bg-danger/12 text-danger border-danger/40',
  [P.ANSWERED]: 'bg-success/12 text-success border-success/40',
  [P.MARKED]: 'bg-accent/15 text-accent border-accent/40',
  [P.ANSWERED_MARKED]: 'bg-success/12 text-success border-accent/50 ring-1 ring-inset ring-accent/50',
};

export function paletteStateOf(answer) {
  if (!answer || answer.visited !== true) return P.NOT_VISITED;
  const response = answer.response;
  const answered = response !== null && response !== undefined && response !== ''
    && !(Array.isArray(response) && response.length === 0)
    && !(typeof response === 'object' && Object.keys(response).length === 0);
  if (answer.marked) return answered ? P.ANSWERED_MARKED : P.MARKED;
  return answered ? P.ANSWERED : P.NOT_ANSWERED;
}

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

export function formatClock(totalSeconds = 0) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const tail = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return hours ? `${hours}:${tail}` : tail;
}

export function formatSeconds(seconds = 0) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  if (value < 60) return `${value}s`;
  return `${Math.floor(value / 60)}m ${value % 60}s`;
}

export function formatMinutes(minutes = 0) {
  const value = Number(minutes) || 0;
  if (value < 60) return `${value} min`;
  return `${Math.floor(value / 60)}h ${value % 60}m`;
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

export const signed = (value) => `${Number(value) > 0 ? '+' : ''}${Number(value) || 0}`;

export default { errorMessage, formatClock };
