import {
  DIFFICULTY_LABELS, PLATFORM_LABELS, PLATFORM_VALUES, REPORT_REASON_VALUES,
  RESOURCE_EVENT_TYPE_VALUES, RESOURCE_LANGUAGE_LABELS, RESOURCE_LANGUAGE_VALUES,
  RESOURCE_LEVEL_LABELS, RESOURCE_LEVEL_VALUES, RESOURCE_LINK_STATUS_LABELS,
  RESOURCE_PRICING_LABELS, RESOURCE_PRICING_VALUES, RESOURCE_SORT_OPTIONS,
  RESOURCE_STATUS_LABELS, RESOURCE_STATUS_VALUES, RESOURCE_TYPE_VALUES,
} from '@algonest/shared/constants';

export const TYPE_LABELS = Object.freeze({
  video: 'Video', article: 'Article', repository: 'GitHub repo',
  pdf: 'PDF / notes', course: 'Course', other: 'Other',
});
export const TYPE_OPTIONS = RESOURCE_TYPE_VALUES.map((value) => ({ value, label: TYPE_LABELS[value] }));
export const LEVEL_OPTIONS = RESOURCE_LEVEL_VALUES.map((value) => ({ value, label: RESOURCE_LEVEL_LABELS[value] }));
export const LANGUAGE_OPTIONS = RESOURCE_LANGUAGE_VALUES.map((value) => ({ value, label: RESOURCE_LANGUAGE_LABELS[value] ?? value }));
export const PRICING_OPTIONS = RESOURCE_PRICING_VALUES.map((value) => ({ value, label: RESOURCE_PRICING_LABELS[value] }));
export const SORT_OPTIONS = RESOURCE_SORT_OPTIONS.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
export const STATUS_OPTIONS = RESOURCE_STATUS_VALUES.map((value) => ({ value, label: RESOURCE_STATUS_LABELS[value] }));
export const PLATFORM_OPTIONS = PLATFORM_VALUES.map((value) => ({ value, label: PLATFORM_LABELS[value] ?? value }));
export const REPORT_REASON_OPTIONS = REPORT_REASON_VALUES.map((value) => ({
  value, label: ({
    broken_link: 'Broken link', wrong_content: 'Wrong or misleading content',
    duplicate: 'Duplicate entry', copyright: 'Copyright issue',
    inappropriate: 'Inappropriate content', other: 'Something else',
  })[value] ?? value,
}));
export const EVENT_LABELS = Object.freeze({
  view: 'Views', save: 'Saves', start: 'Starts', completion: 'Completions',
});
export const EVENT_TYPES = RESOURCE_EVENT_TYPE_VALUES;

export const EMPTY_FILTERS = Object.freeze({
  q: '', topic: '', level: '', language: '', type: '', pricing: '', platform: '', sort: 'newest',
});

export const STATUS_TONE = Object.freeze({
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
});
export const TYPE_TONE = Object.freeze({
  video: 'danger', article: 'primary', repository: 'accent', pdf: 'warning', course: 'success', other: 'neutral',
});
export const LEVEL_TONE = Object.freeze({ beginner: 'success', intermediate: 'warning', advanced: 'danger' });
export const PRICING_TONE = Object.freeze({ free: 'success', freemium: 'accent', paid: 'warning' });
export const LINK_TONE = Object.freeze({ unchecked: 'neutral', ok: 'success', broken: 'danger', unknown: 'warning' });

export const statusLabel = (value) => RESOURCE_STATUS_LABELS[value] ?? value;
export const levelLabel = (value) => RESOURCE_LEVEL_LABELS[value] ?? value;
export const typeLabel = (value) => TYPE_LABELS[value] ?? value;
export const pricingLabel = (value) => RESOURCE_PRICING_LABELS[value] ?? value;
export const languageLabel = (value) => RESOURCE_LANGUAGE_LABELS[value] ?? value;
export const linkStatusLabel = (value) => RESOURCE_LINK_STATUS_LABELS[value] ?? value;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;

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

export function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatNumber(value = 0) {
  const number = Number(value) || 0;
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(1)}k`;
  return String(number);
}

/** Safe external link: only http(s) can be rendered as an href. */
export function safeExternalUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function resourceHref(resource) {
  return `/app/resources/${resource?.id ?? resource?._id ?? ''}`;
}

export function creatorHref(creator) {
  const id = creator?.user?.id ?? creator?.id ?? '';
  return `/app/creators/${id}`;
}

/** Compact sparkline points from a daily analytics series. Pure. */
export function sparklinePoints(series = [], key = 'view', width = 240, height = 48) {
  if (!series.length) return '';
  const values = series.map((row) => Number(row[key]) || 0);
  const max = Math.max(1, ...values);
  const step = series.length > 1 ? width / (series.length - 1) : width;
  return values.map((value, index) => `${Math.round(index * step)},${Math.round(height - (value / max) * (height - 4) - 2)}`).join(' ');
}

export default { errorMessage, formatDate };
