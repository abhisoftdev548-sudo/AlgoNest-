import {
  MODERATION_DECISIONS,
  QUIZ_STATUSES as S,
  QUIZ_VISIBILITIES,
} from '@algonest/shared';

/**
 * Pure content-lifecycle state machine for quizzes. Mirrors the sheet workflow
 * intentionally so moderation UI and audit history behave identically across
 * content types, but lives in this module so quiz rules can evolve freely.
 *
 * draft ─submit→ pending_review ─approve→ approved ─publish→ published
 *                    │                                        │
 *   request_changes ─┘ → changes_requested ─resubmit→ pending_review
 *   reject ──────────┘ → rejected ─revise→ draft
 *   any non-archived ─archive→ archived ─restore→ draft
 *   published ─revision→ draft (the public QuizVersion stays frozen)
 */
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
  return `Cannot move a quiz from "${from}" to "${to}". Allowed next states: ${(TRANSITIONS[from] ?? []).join(', ') || 'none'}.`;
}

export function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

/** All roles with any permission are staff; students have an empty list. */
export function isStaff(actor) {
  return Boolean(actor?.permissions?.length);
}

/** A quiz may be attempted only when a frozen published version exists. */
export function isAttemptable(quiz, actor) {
  if (!quiz?.publishedVersion || quiz.status === S.ARCHIVED) return false;
  if (quiz.settings?.visibility === QUIZ_VISIBILITIES.PRIVATE) return isStaff(actor) || String(quiz.author?._id ?? quiz.author) === actor?.id;
  return true;
}

export default canTransition;
