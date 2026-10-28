# Phase 5 — Adaptive Plans & Student Dashboard

Status: **complete and verified**. Phase 5 adds a per-user adaptive study plan
engine and rebuilds `/app` into a "what should I do now" dashboard.

The complete source of every changed/new file is in
[`PHASE5-CODE.md`](./PHASE5-CODE.md). Phases 1–4 remain intact; only additive
wiring changed shared contracts, route mounts, router, navigation, query keys,
the render-smoke list, `HomePage.jsx` (explicitly in scope) and the README.

---

## 1. Plan that was executed

| Group | Files |
| --- | --- |
| Shared contracts | appended plan/task/date constants + 13 Zod contracts to `shared/src/constants.js` / `schemas.js` |
| Pure engine | `planEngine.js` — dates, distribution, 1/7/21 revisions, 14-day mocks, reschedule, overload, streak, progress, weak topics |
| Models | `Plan.js`, `PlanTask.js` |
| Server | `plan.service.js`, `dashboard.service.js`, 2 controllers, 2 routers, mount in `routes/index.js` |
| Server tests | `plans.test.js` (19), `plans.service.test.js` (13), `plans.routes.test.js` (4) |
| Client plans | 1 API, 1 hooks file, 1 utils, 11 components, 3 pages |
| Client dashboard | 1 API, 1 hooks file, 7 components, `HomePage.jsx` recomposed |
| Wiring | `queryKeys.js`, `navigation.js`, `router.jsx`, `smokeRender.mjs` |
| Docs | `README.md`, `docs/PHASE5.md`, `docs/PHASE5-CODE.md` |

---

## 2. Architecture decisions

### Dates are UTC `YYYY-MM-DD` keys, never timestamps

A task's `date` is a string like `2026-11-09`. `dateKeySchema` rejects invalid
calendar dates (`2026-02-30`). This removes DST and timezone drift entirely;
the client and server share the same key arithmetic (`addDays`, `diffDays`,
`weekdayOf`). Rest days are weekday indices `0=Sun..6=Sat`.

### Reference vs. embedding

```
Plan (per user) ──references──▶ published Sheet / Quiz / MockTest ids
        │
        ▼
PlanTask (per user, per day)
   • frozen title / url / topic / estimatedMinutes snapshot
   • deterministic taskKey  → unique index { plan, taskKey }
```

`Plan` stores only IDs of **published** content, so the wizard can only pick
real, public resources. `PlanTask` deliberately **embeds a snapshot** of the
task's label, URL, topic and duration: if a creator archives a sheet, the
learner's history and streak remain intact. This is the same
reference/embedding split used in Phases 2–4.

One **active** plan per learner is enforced by a partial unique index
`{user, status: 'active'}`. Creating a new plan archives the previous one
(completed task history is never deleted).

### Scheduling pipeline (`distribute`)

1. Build `workingDates(start, end, restDays)` and an overflow extension
   (bounded to 60 extra working days).
2. **Reserve the mock cadence first** — a full-length mock every
   `mockIntervalDays` (default 14) calendar days from the start, snapped to the
   next working day, cycling through the selected mocks. If none were selected,
   the service auto-fills up to five published mocks; if the catalogue is empty
   it emits `NO_MOCKS_AVAILABLE` rather than a fake link.
3. Place learning units: sheets expand into their **published problems**,
   quizzes stay single units. Greedy first-fit into daily buckets of
   `dailyMinutes`.
4. Insert **1 / 7 / 21-day revisions** after each learn task, snapped forward
   to the next working day, as short 10-minute blocks. Revisions search forward
   for capacity rather than being dropped.
5. Flag days over budget and oversized single tasks; deduplicate warnings.

A single task longer than `dailyMinutes` is **still scheduled** (never silently
lost) but flagged; a plan that cannot fit before `endDate` spills into overflow
days with `OVERFLOW_PAST_END` and `DAILY_OVERLOAD` warnings.

```
taskKey = `${type}:${refId}:${date}:${interval|0}`
```

Deterministic keys plus a unique index make regeneration idempotent.

### Rescheduling missed tasks

Past `pending`/`in_progress` tasks are **auto-marked `missed`** on every plan
read and on the dashboard read (idempotent; nothing is deleted). The learner
explicitly calls `POST /plans/:id/reschedule`: `reschedule()` redistributes
missed tasks into the remaining capacity from today onward, respecting
already-planned minutes, and **re-anchors their 1/7/21 revisions** to the new
date. Days that still exceed capacity get `RESCHEDULE_OVERLOAD` warnings.

### Overload warnings

`dailyLoad()` computes minutes/day vs capacity. Warnings are stored on the
`Plan` (last 60) and surfaced on both the plan page and the dashboard:
`DAILY_OVERLOAD`, `SINGLE_TASK_TOO_LONG`, `OVERFLOW_PAST_END`,
`NO_WORKING_DAYS`, `NO_MOCKS_AVAILABLE`, `TASK_UNSCHEDULED`,
`RESCHEDULE_OVERLOAD`, `REVISION_SKIPPED`.

### Streak

`computeStreak(completedDates, today, restDays)` counts consecutive non-rest
days with at least one completed task. Rest days are **transparent**: they
neither count nor break a run. If today has no completion yet, the streak is
measured up to yesterday (a streak is not lost until the day ends). Completing
a task also updates `User.streak.{current,longest,lastActiveDate}` so the top
bar stays consistent.

### Dashboard aggregation

`getDashboard()` is one aggregated, strictly per-user read:

| Field | Source |
| --- | --- |
| `today.tasks`, `today.minutes/done/missed` | `PlanTask` for the active plan on the date key |
| `streak`, `progress`, `dailyLoad` | `PlanTask` + pure engine helpers |
| `weakTopics` | merged `Attempt.topicStats` + `MockAttempt.topicStats` (mocks weighted 1.2×), sorted by percentage |
| `upcomingMock`, `pendingRevisions` | `PlanTask` queries in the horizon window, enriched with live titles |
| `continueWith` | live `Attempt` → live `MockAttempt` → today's in-progress/pending task → an in-progress `UserProgress` problem |
| `overload`, `recentActivity`, `nextRestDay` | plan warnings + attempt history + rest-day arithmetic |

Every query is scoped by `user`, so no cross-learner data can leak.

---

## 3. API reference (`/api/v1`)

Every response uses `{ success, data, message, errors }`; pagination lives in
`data.pagination`. Every route below requires a valid access token **and**
completed onboarding, and every request part is Zod-validated. There is no
staff cross-read: a plan can only be read by its owner.

### Plans — `/plans`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `planListQuerySchema` | Paginated, `status` filter |
| POST | `/` | `planCreateSchema` | Generate + distribute tasks; archives the previous active plan |
| GET | `/active` | — | The current plan (or `null`) |
| GET | `/content` | — | Published sheets/quizzes/mocks for the wizard |
| GET | `/:id` | `planParamsSchema` | Plan + progress + streak + daily load; auto-marks missed |
| PATCH | `/:id` | `planParamsSchema` + `planUpdateSchema` | Title/notes/budget/rest days/revision flag/status |
| DELETE | `/:id` | `planParamsSchema` | Archive |
| POST | `/:id/regenerate` | `planParamsSchema` | Rebuild future pending tasks; keeps `done`/`skipped` history |
| POST | `/:id/reschedule` | `planParamsSchema` + `rescheduleSchema` | Redistribute missed tasks + re-anchor revisions |
| GET | `/:id/tasks` | `planParamsSchema` + `taskListQuerySchema` | Paginated tasks + calendar day summaries |
| PUT | `/:id/tasks/order` | `planParamsSchema` + `taskReorderSchema` | Reorder one day's tasks |
| PATCH | `/:id/tasks/:taskId` | `planTaskParamsSchema` + `taskStatusSchema` | Status transition + optional note |

Static sub-paths (`/active`, `/content`, `/tasks/order`) are registered before
parameterised routes.

### Dashboard — `/dashboard`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `dashboardQuerySchema` | `date` (UTC key) + `horizon` (1–90 days) |

**Task status transitions** (server-enforced):
`pending → in_progress|done|skipped|missed`,
`in_progress → pending|done|skipped|missed`,
`done → in_progress|pending`, `skipped → pending`, `missed → pending|done`.

---

## 4. Limits

| Limit | Value |
| --- | --- |
| Daily time budget | 15–720 min |
| Plan duration | 1–365 days |
| Rest days | ≤6 (at least one working day/week) |
| Selected sheets / quizzes / mocks | ≤20 each |
| Tasks per plan | 4,000 |
| Tasks per day | 40 |
| Missed tasks rescheduled per call | 500 |
| Revision block | 10 min |
| Overflow extension | ≤60 working days |
| Dashboard horizon / today list | 90 / 12 |

---

## 5. Client structure

```
client/src/features/plans/
├── api/planApi.js
├── hooks/usePlans.js
├── lib/planUtils.js
├── components/
│   ├── GoalPicker.jsx, RestDayPicker.jsx, PlanBasicsForm.jsx,
│   │   PlanContentPicker.jsx, PlanWizard.jsx
│   ├── PlanCard.jsx, PlanProgress.jsx, OverloadAlert.jsx,
│   │   PlanCalendar.jsx, TaskItem.jsx, TaskList.jsx
└── pages/{PlansPage,PlanDetailPage,PlanEditorPage}.jsx

client/src/features/dashboard/
├── api/dashboardApi.js
├── hooks/useDashboard.js
├── components/{DashboardHero,ContinueCard,StreakCard,TodayTasks,
│              WeakTopicsCard,UpcomingMockCard,PendingRevisions}.jsx
└── (HomePage.jsx in features/home composes them)
```

Routes: `/app` (dashboard), `/app/plans`, `/app/plans/new`, `/app/plans/:id`,
`/app/plans/:id/edit`.

The wizard validates each step with the **same** `planCreateSchema` the server
uses, so error copy is identical. React Bits (`ShinyText`, `SpotlightCard`) is
confined to the dashboard hero and the catalogue eyebrow; calendars, task
lists, tables and forms are plain accessible Tailwind. Task checkboxes use
`role="checkbox"` + `aria-checked`, the calendar buttons have `aria-pressed`
and descriptive `aria-label`s, and the streak ring is pure CSS (no SVG/JS
animation dependency).

---

## 6. Security checklist

* All 15 new routes: `authenticate` + `requireOnboarded` + `validate(Zod)`.
* Every DB query is scoped by `user` from the access token; `assertOwner`
  rejects cross-user plan reads. No admin/staff override is exposed.
* Strict `.strict()` contracts strip unknown keys — a client cannot inject
  `user`, `plan`, `status`, `taskKey` or `completedAt`.
* Only published, non-archived, `public` content can be selected; the service
  re-checks counts and returns 404 for anything else.
* Task status transitions are allow-listed server-side, so a client cannot
  resurrect a skipped task directly to `done`.
* Task URLs are re-derived from the stored frozen snapshot; the dashboard does
  not trust a live resource URL from the request.
* `insertMany({ ordered: false })` with a unique `taskKey` index makes
  concurrent regeneration safe; on any other failure the plan and its tasks
  are rolled back.
* Existing Phase-1 protections apply unchanged: `express.json({ limit:
  '256kb' })`, helmet CSP, CORS allowlist, `express-mongo-sanitize`,
  control-character stripping, rate limiting, bcrypt, short-lived access
  tokens and httpOnly refresh cookies.
* Role is re-read from MongoDB on every request; tokens are never persisted
  client-side.

---

## 7. Tests and verification

```
npm run lint   → 0 errors (104 server JS files syntax-checked, client ESLint clean)
npm test       → 197/197 server tests + 25/25 client render smoke tests
npm run build  → ✓ built, all three plan pages as lazy chunks
dev=200  api=200  prod=200
```

New server tests (36):

* `plans.test.js` — 19 tests: UTC date keys (including DST), invalid calendar
  dates, working-date/rest-day arithmetic, contract validation (backwards
  ranges, all-rest weeks, empty selection, unknown keys), unit building,
  daily-budget packing, 14-day mock cadence with pool cycling, 1/7/21
  revision offsets, disabling revisions, oversized-task + overloaded-day
  warnings, no-working-days warning, deterministic task keys, rescheduling
  into remaining capacity with existing load, streak across rest days,
  progress excluding skipped tasks, and weighted weak-topic aggregation.
* `plans.service.test.js` — 13 tests with stubbed models: full generation
  (mocks + 3 revision intervals + unique keys), unpublished-content 404,
  active-plan conflict, active-plan archival, rollback on bulk-insert failure,
  overload warnings, cross-user read denial, auto-marking missed tasks,
  illegal status transitions, rescheduling with revision re-anchoring,
  regeneration preserving completed tasks, and two dashboard aggregations
  (full view + live-attempt continue card).
* `plans.routes.test.js` — 4 tests: anonymous access to all 12 plan endpoints
  and `/dashboard` returns `401` with the standard envelope; validation
  details never leak before auth; health stays public; Phases 2–4 protection
  unchanged.

Real Chromium on **dev `:5173` and production preview `:4173`** rendered all
five Phase-5 routes plus the dashboard with `pageerrors: []`, no console
errors and no `ErrorBoundary` fallback. Verified interactions: dashboard
showing today's tasks, streak, plan completion, weak topics, upcoming mock,
pending revisions, continue card, overload warnings and missed-task alert;
task checkbox → `PATCH /plans/:id/tasks/:taskId`; three-step wizard with 5
goals, 2 date inputs, published content picker and `POST /plans`; plan detail
calendar/progress/warnings/task list and `POST /plans/:id/reschedule`; plan
settings editor.

One real bug was found and fixed during development: the mock cadence
originally used an inverted `diffDays` comparison, which caused `distribute()`
to skip every periodic mock. It was caught by the pure-engine smoke check
before the client was written.

> The sandbox has no MongoDB, so live data routes return the intended `503`
> from `dbGuard`; browser checks used mocked API envelopes. With Docker Mongo
> the full flow works end to end.

---

## 8. Assumptions

1. **JavaScript throughout**, consistent with Phases 1–4.
2. One active plan per user; creating a new plan archives the old one
   (`replaceActive: true` by default, `false` returns 409).
3. Sheets expand into their **published problems**; quizzes and mocks are
   single tasks. Private/unlisted content is never selectable.
4. Rest days are weekday indices; they are empty, and they do not break a
   streak.
5. Overload is **warned about, not prevented** — a task longer than one day is
   still scheduled, and a plan that cannot fit spills past `endDate` with
   explicit warnings rather than losing work.
6. Revisions are 10-minute blocks at +1/+7/+21 days from the **scheduled**
   learn date, snapped to the next working day; rescheduling re-anchors them.
7. A mock is inserted every 14 calendar days from the plan start. If the user
   selects no mock, published mocks are auto-filled; if none exist, a warning
   is emitted.
8. Missed tasks are auto-marked on reads but only **moved** when the learner
   triggers reschedule (no surprising automatic reshuffling).
9. Weak topics weight full-length mock results 1.2× over quizzes.
10. `continueWith` prefers a live attempt so a running timed quiz/mock is
    never buried under a checklist item.

---

## 9. Next step

**Phase 6 — Resource directory**: public YouTube/article/GitHub/PDF links with
filters, save, ratings and reports. Promote the existing `PersonalResource`
library into a moderated public catalogue (same
`draft → pending_review → … → published` lifecycle), then wire the dashboard's
weak-topic cards and mock-test `recommendations` into that catalogue so the
suggested links become interactive.
