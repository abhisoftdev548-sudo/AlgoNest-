# Phase 7 — Admin dashboard

## Scope

A unified `/app/admin` workspace and `/api/v1/admin` API for overview metrics, paginated user management, moderation of sheets/quizzes/resources, report triage, append-only audit history, and persistent feature flags.

## RBAC

Authorization is evaluated from the user record on each request (not from role claims in the JWT):

| Role | Admin permissions |
| --- | --- |
| Student | none |
| Content Editor | `content:moderate` |
| Content Moderator | `content:moderate`, `user:read`, `audit:read` |
| Support / Analyst | `user:read`, `analytics:read`, `audit:read` |
| Super Admin | all permissions |

User status/role changes, creator verification, and feature flags require `user:manage` (Super Admin only). Content decisions and report triage require `content:moderate`. Lists are paginated and all request inputs use strict shared Zod contracts. Sensitive mutations invalidate sessions when role/status changes. The last active Super Admin cannot be demoted or disabled.

## API

All paths below are mounted under `/api/v1/admin`; every route requires authentication and completed onboarding, plus the listed permission.

- `GET /overview` — user counts, pending moderation/reports, DAU/MAU, signup series, completed quiz/mock counts, quiz accuracy, topic accuracy.
- `GET /moderation?page=&limit=&type=` — unified pending queue; `type` is `all|sheet|quiz|resource`.
- `POST /moderation/:type/:id` — `{ decision, note }`; decisions are `approve|request_changes|reject`; notes are mandatory except for approval. Approval changes status to `approved`; publishing remains a distinct author action.
- `GET /users?page=&limit=&q=&role=&status=` — searchable account directory (`user:read`).
- `PATCH /users/:id/role` — `{ role }`; `PATCH /users/:id/status` — `{ status: active|suspended|banned }` (`user:manage`).
- `PATCH /users/:id/creator-verification` — `{ verified }` (`user:manage`).
- `GET /reports?page=&limit=&status=` — unified sheet/resource report queue (`content:moderate`).
- `PATCH /reports/:type/:id` — `{ status: resolved|dismissed, note? }`.
- `GET /audit-logs?page=&limit=&action=&targetType=&from=&to=` — paginated administrative event history.
- `GET /feature-flags` and `PUT /feature-flags/:key` — persist `{ enabled, description? }` (`user:manage`).

All API responses retain the common `{ success, data, message, errors }` envelope.

## Audit and analytics notes

Successful content decisions, report resolutions, user role/status changes, creator verification and feature-flag updates append records to `AdminAuditLog`, with actor, action, target, summary, request id, IP and bounded metadata. Audit entries are not editable through the API. The audit write is awaited after the domain write; standalone MongoDB transactions are intentionally not assumed.

DAU/MAU currently count distinct users with quiz attempts, mock attempts, or resource events in the respective rolling windows. Signup counts use account creation timestamps. Quiz accuracy is derived from submitted/timed-out attempts and topic accuracy from persisted topic stats. These definitions are surfaced in the dashboard so metrics are interpretable.

Feature flags are persisted and auditable as rollout configuration. This phase provides management and storage; individual product modules must explicitly consume a flag before it changes their behavior.

## Verification

- `npm run lint`
- `npm test`
- `npm run build`

A live MongoDB is required for authenticated end-to-end admin workflows. In the sandbox without a database, DB-backed API routes correctly fail with `503`; anonymous requests still fail with `401` before validation or data access.
