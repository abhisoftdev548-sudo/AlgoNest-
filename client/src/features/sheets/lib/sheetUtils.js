import {
  DIFFICULTY_LABELS, PLATFORM_LABELS, PROBLEM_STATUS_LABELS,
  RESOURCE_TYPE_VALUES, SHEET_STATUS_LABELS, SHEET_TOPICS,
} from '@algonest/shared';

export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({ value, label }));
export const STATUS_OPTIONS = Object.entries(PROBLEM_STATUS_LABELS).map(([value, label]) => ({ value, label }));
export const TOPIC_OPTIONS = SHEET_TOPICS.map((value) => ({ value, label: value }));
export const RESOURCE_TYPE_OPTIONS = RESOURCE_TYPE_VALUES.map((value) => ({
  value, label: value.charAt(0).toUpperCase() + value.slice(1),
}));
export const REASON_OPTIONS = [
  { value: 'broken_link', label: 'Broken / dead link' },
  { value: 'wrong_content', label: 'Wrong topic or difficulty' },
  { value: 'duplicate', label: 'Duplicate content' },
  { value: 'copyright', label: 'Copyright issue' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'other', label: 'Something else' },
];

export const statusLabel = (status) => SHEET_STATUS_LABELS[status] ?? status;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;
export const platformLabel = (value) => PLATFORM_LABELS[value] ?? 'Other';
export const problemStatusLabel = (value) => PROBLEM_STATUS_LABELS[value] ?? value;

export const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };
export const STATUS_TONE = {
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
};
export const PROBLEM_STATUS_TONE = {
  not_started: 'neutral', attempted: 'warning', solved: 'success',
  revising: 'accent', skipped: 'neutral',
};

/** Human error message from an ApiClientError or plain Error. */
export function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong. Please try again.';
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatMinutes(value = 0) {
  const minutes = Number(value) || 0;
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
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

export default { errorMessage, formatDate };
