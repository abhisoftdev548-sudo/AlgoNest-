import { MODERATION_DECISIONS, RESOURCE_STATUSES as S } from '@algonest/shared';

/** Same lifecycle as sheets/quizzes/mocks — consistent moderation UI. */
export const TRANSITIONS = Object.freeze({
  [S.DRAFT]: [S.PENDING_REVIEW, S.ARCHIVED],
  [S.PENDING_REVIEW]: [S.CHANGES_REQUESTED, S.APPROVED, S.REJECTED, S.DRAFT, S.ARCHIVED],
  [S.CHANGES_REQUESTED]: [S.PENDING_REVIEW, S.ARCHIVED],
  [S.APPROVED]: [S.PUBLISHED, S.PENDING_REVIEW, S.ARCHIVED],
  [S.REJECTED]: [S.DRAFT, S.ARCHIVED],
  [S.PUBLISHED]: [S.DRAFT, S.PENDING_REVIEW, S.ARCHIVED],
  [S.ARCHIVED]: [S.DRAFT],
});

export const EDITABLE_STATUSES = Object.freeze([
  S.DRAFT, S.CHANGES_REQUESTED, S.REJECTED, S.APPROVED,
]);

export const DECISION_TO_STATUS = Object.freeze({
  [MODERATION_DECISIONS.APPROVE]: S.APPROVED,
  [MODERATION_DECISIONS.REQUEST_CHANGES]: S.CHANGES_REQUESTED,
  [MODERATION_DECISIONS.REJECT]: S.REJECTED,
});

export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

export function transitionError(from, to) {
  return `Cannot move a resource from "${from}" to "${to}". Allowed next states: ${(TRANSITIONS[from] ?? []).join(', ') || 'none'}.`;
}

export function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

export function isStaff(actor) {
  return Boolean(actor?.permissions?.length);
}

export default canTransition;
