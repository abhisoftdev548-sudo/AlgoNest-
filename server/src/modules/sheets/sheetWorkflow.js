import {
  MODERATION_DECISIONS,
  SHEET_STATUSES as S,
} from '@algonest/shared';

/**
 * Pure content-lifecycle state machine (no DB, no Express) so it can be unit
 * tested exhaustively. The service is the only place allowed to mutate status.
 *
 * draft ─submit→ pending_review ─approve→ approved ─publish→ published
 *                    │                                          │
 *   request_changes ─┘ → changes_requested ─resubmit→ pending_review
 *   reject ──────────┘ → rejected ─revise→ draft
 *   any non-archived ─archive→ archived ─restore→ draft
 *   published ─revision→ draft (public snapshot stays frozen in SheetVersion)
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

/** Statuses whose problem list / metadata the author may freely edit. */
export const EDITABLE_STATUSES = Object.freeze([
  S.DRAFT, S.CHANGES_REQUESTED, S.REJECTED, S.APPROVED,
]);

/** Statuses visible to ordinary students in the catalogue. */
export const PUBLIC_STATUSES = Object.freeze([S.PUBLISHED]);

export const DECISION_TO_STATUS = Object.freeze({
  [MODERATION_DECISIONS.APPROVE]: S.APPROVED,
  [MODERATION_DECISIONS.REQUEST_CHANGES]: S.CHANGES_REQUESTED,
  [MODERATION_DECISIONS.REJECT]: S.REJECTED,
});

export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

export function transitionError(from, to) {
  return `Cannot move a sheet from "${from}" to "${to}". Allowed next states: ${(TRANSITIONS[from] ?? []).join(', ') || 'none'}.`;
}

export function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

/** Who may see an unpublished working copy. */
export function isStaff(role, permissions) {
  return Boolean(permissions?.length) || role === 'content_editor' || role === 'content_moderator' || role === 'super_admin';
}

export default canTransition;
