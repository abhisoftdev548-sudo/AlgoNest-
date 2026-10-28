# Phase 2 — DSA Sheets

Complete design + API reference for the Sheets module. Full source of every file
changed in this phase is in [`PHASE2-CODE.md`](./PHASE2-CODE.md).

---

## 1. What shipped

| Area | Delivered |
| --- | --- |
| Domain contracts | Shared constants + Zod schemas used by **both** runtimes (no duplicated validation) |
| Data model | `Sheet`, `SheetVersion`, `UserProgress`, `SheetRating`, `SheetReport`, `PersonalResource` |
| Sheet APIs | CRUD, archive/restore, clone, lifecycle (submit/moderate/publish/revision), versions |
| Problem APIs | add (single + bulk), edit, remove, **full-array reorder**, bulk-import from pasted links |
| Platform detection | 15 judge/video/code hosts, URL normalisation, title/topic/difficulty inference, SSRF-safe |
| Social APIs | rating + written review, report, staff report queue + resolution |
| Per-user state | status, notes, bookmark, confidence, time spent, revision date, topic-wise summary |
| Personal resources | private link library with filters, scoped by access token |
| Client | catalogue with filters + pagination, 3-pane workspace, creator/editor with drag-and-drop |
| Tests | 56 server tests, 12 SSR render smoke checks, real-Chromium interaction verification |

---

## 2. Data model decisions

### 2.1 Problems are **embedded**, not referenced

`Sheet.problems` is an array of `problemSchema` subdocuments
(`server/src/models/Problem.js`). Justification:

1. A problem is meaningless without its sheet and is **always** read with the sheet.
   There is no screen that queries a problem independently.
2. A sheet is an **ordered progression**. Embedding makes add / edit / reorder a
   single atomic document write — no multi-document transaction, no join, no
   sort-index on a separate collection.
3. Subdocument `_id`s are stable and are the exact keys `UserProgress.problemId`
   points at.
4. The array is hard-capped at **300** (`SHEET_LIMITS.MAX_PROBLEMS`) by both Zod
   and a Mongoose validator, so the parent document stays far below MongoDB's
   16 MB limit even with long URLs.
5. Problems are never shared across sheets. `clone` deep-copies them with **fresh**
   `_id`s so progress/bookmarks can never leak between sheets.

A referenced `Problem` collection would only be justified if problems were reused
across sheets or independently searchable — neither is true here.

### 2.2 Versioning: working copy ↔ immutable snapshot

- `Sheet` is the author's **working copy** (status `draft`, `pending_review`, …).
- `SheetVersion` is an **immutable, never-updated** snapshot created on each
  `publish`. It copies `problems` with their original `_id`s plus metadata.
- `Sheet.publishedVersion` points at the live version;
  `Sheet.publishedProblemCount` denormalises the card count.
- `GET /sheets/:id` for a student returns the **latest snapshot** problem list
  (`isPublishedSnapshot: true`, `viewedVersion: n`); author/moderator sees the
  working copy.
- Editing a published sheet requires an explicit `POST /:id/revision`, which moves
  it back to `draft` **without touching the published snapshot** — the public
  sheet stays stable while the author works.
- `UserProgress.sheetVersion` records which version the row belongs to, and
  `problemTitle` / `topic` are denormalised snapshots. Old progress stays
  renderable even after version 2 renames or removes a problem.
- On publish failure the snapshot is deleted (manual rollback) because dev uses
  a standalone Mongo without replica-set transactions. In production a session
  transaction should wrap the two writes.

### 2.3 Per-user data is completely separate

`Sheet` is **never** written by a student action. All of
`status / notes / bookmark / confidence / timeSpent / revisionDate` live in
`UserProgress` with a unique `(user, sheet, problemId)` index. Every query is
scoped by `actor.id` derived from the **access token** — a client cannot pass a
user id. `PersonalResource` follows the same rule.

### 2.4 Indexes

| Collection | Index | Purpose |
| --- | --- | --- |
| `Sheet` | text(title, description, tags, topics) | catalogue search |
| | `{status, publishedAt:-1}` | public catalogue |
| | `{author, status, updatedAt:-1}` | "My sheets" |
| | `{topics, difficulty}` | filters |
| | `{'ratingSummary.average':-1}` | rating sort |
| | unique `slug` | stable URLs |
| `SheetVersion` | unique `{sheet, version:-1}` | version lookup |
| `UserProgress` | unique `{user, sheet, problemId}` | atomic upsert |
| | `{user, sheet, status}`, `{user, sheet, topic}` | summaries |
| | `{user, bookmark, updatedAt:-1}` | bookmarked filter |
| `SheetRating` | unique `{sheet, user}` | one rating per user |
| `SheetReport` | `{status, createdAt:-1}`, `{sheet, reporter, status}` | queue + duplicate guard |
| `PersonalResource` | `{user, createdAt:-1}`, `{user, topic}`, `{user, type}`, `{user, sheetId}` | private library |

---

## 3. Content lifecycle

```
draft ──submit──▶ pending_review ──approve──▶ approved ──publish──▶ published
  ▲                    │  │                                              │
  │                    │  └──request_changes──▶ changes_requested       │
  │  revise            └───────reject────────▶ rejected                 │revision
  │                                                                     ▼
  └──────────────────────── restore ◀── archived ◀─────────────────── draft
```

The transition table lives in `server/src/modules/sheets/sheetWorkflow.js` and
is exhaustively unit-tested. Illegal jumps return `409`. Every transition is
appended to a bounded embedded `reviewHistory` (full audit logs arrive with the
admin module in Phase 8).

**Separation of duties:** a moderator cannot approve/reject a sheet they authored
(only `super_admin` is exempt). `content_editor` and `content_moderator` both
carry `content:moderate`; `publish` additionally allows the author of an already
approved sheet.

---

## 4. RBAC matrix

All routes run `authenticate` + `requireOnboarded`. `authenticate` reloads the
user from MongoDB on every request, so a role change or suspension takes effect
immediately.

| Action | Student (owner) | Student (other) | Editor / Moderator | Super Admin |
| --- | --- | --- | --- | --- |
| List/read published | ✅ | ✅ | ✅ | ✅ |
| Create draft | ✅ | ✅ | ✅ | ✅ |
| Edit/archive/clone metadata | ✅ own | ❌ | ✅ any | ✅ any |
| Add/edit/reorder problems | ✅ own (editable status) | ❌ | ✅ any | ✅ any |
| Submit for review | ✅ own | ❌ | ✅ any | ✅ any |
| Moderate (approve/reject) | ❌ | ❌ | ✅ (not own) | ✅ |
| Publish approved | ✅ own | ❌ | ✅ | ✅ |
| Rate / review / report | ✅ | ✅ | ✅ | ✅ |
| Report queue + resolution | ❌ | ❌ | ✅ | ✅ |
| Progress + personal resources | ✅ own only | ✅ own only | ✅ own only | ✅ own only |

---

## 5. API reference

Base: `/api/v1`. Envelope: `{ success, data, message, errors }`, pagination in
`data.pagination`. **Every** list endpoint is paginated (`page`, `limit`).

### Sheets — `/sheets`

| Method | Path | Body / query | Notes |
| --- | --- | --- | --- |
| GET | `/` | `sheetListQuerySchema` | `q, topic, difficulty, goal, platform, status, sort, mine, bookmarked, page, limit` |
| POST | `/` | `sheetCreateSchema` | creates a `draft` owned by caller |
| POST | `/parse-links` | `{ text }` | pure parse preview; returns `items, skipped, total` |
| GET | `/reports` | `reportsQuerySchema` | staff queue |
| PATCH | `/reports/:reportId` | `resolveReportSchema` | staff resolution |
| GET | `/:id` | — | published snapshot for students, working copy for managers |
| PATCH | `/:id` | `sheetUpdateSchema` | metadata only |
| DELETE | `/:id` | — | soft archive |
| POST | `/:id/restore` | — | archived → draft |
| POST | `/:id/revision` | — | published → new draft revision |
| POST | `/:id/submit` | `{ changelog }` | draft → pending_review |
| POST | `/:id/moderate` | `{ decision, note }` | staff only |
| POST | `/:id/publish` | `{ changelog }` | approved → published + new `SheetVersion` |
| POST | `/:id/clone` | — | deep-copies problems into your drafts |
| GET | `/:id/versions` | — | version list |
| GET | `/:id/versions/:version` | — | frozen problem set |

### Problems — `/sheets/:id/problems`

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| POST | `/` | `{ problems: [...] }` | 1–100, deduped by canonical URL |
| POST | `/import` | `{ items: [...] }` | bulk import of parsed/edited links |
| PATCH | `/order` | `{ orderedIds: [...] }` | must contain **every** id exactly once |
| PATCH | `/:problemId` | `problemUpdateSchema` | partial |
| DELETE | `/:problemId` | — | re-ranks the remaining problems |

> `platform` is always **re-detected server-side** from the URL. A client-supplied
> platform key is ignored — the server never trusts it.

### Ratings / reports — `/sheets/:id`

| Method | Path | Body |
| --- | --- | --- |
| GET | `/ratings` | `page, limit` → `items, ownRating, pagination` |
| PUT | `/rating` | `{ rating: 1..5, review? }` (upsert) |
| DELETE | `/rating` | — |
| POST | `/report` | `{ reason, details? }` (one open report per user) |

### Progress — `/sheets/:id/progress`

| Method | Path | Body / query |
| --- | --- | --- |
| GET | `/` | `page, limit (≤300), status, topic, bookmarked` → `items, pagination, summary, version` |
| PUT | `/:problemId` | `progressUpdateSchema` (at least one field) |

`summary` = `{ total, completed, percentage, statusCounts, bookmarks, timeSpent,
dueRevisions, topicWise[] }`. `completed` counts `solved` + `revising`. Setting
`solved` or `revising` defaults `revisionDate` to +7 days (spaced repetition)
unless the student chose one.

### Personal resources — `/personal-resources`

| Method | Path | Body |
| --- | --- | --- |
| GET | `/` | `q, type, topic, sheetId, page, limit` |
| POST | `/` | `personalResourceCreateSchema` |
| PATCH | `/:id` | `personalResourceUpdateSchema` |
| DELETE | `/:id` | — |

Mounted at `/personal-resources` (not `/resources`) so Phase 6's public resource
directory keeps its own namespace.

---

## 6. Bulk import + platform detection

`server/src/modules/sheets/platformDetector.js` is pure — **no network calls**.
It only inspects hostname + pathname, so `javascript:`, `data:`, `file:` and SSRF
by URL are impossible. Supported hosts:

`LeetCode`, `Codeforces`, `GeeksforGeeks`, `HackerRank`, `CodeChef`, `AtCoder`,
`InterviewBit`, `HackerEarth`, `NeetCode`, `takeUforward`, `CodeSignal`, `SPOJ`,
`Kattis`, `YouTube`, `GitHub`, plus `generic` fallback.

For each link it derives a readable title, a canonical `externalId` for dedupe,
a topic (regex vocabulary) and a difficulty hint. Tracking params, fragments and
trailing slashes are stripped. Pasted text accepts plain lines, `Title | URL`,
`URL | Title`, numbered lists and markdown `[title](url)`. Duplicates and invalid
lines are reported in `skipped[]` rather than failing the whole batch.

The UI flow is **paste → parse (preview) → edit title/topic/difficulty → select →
import**, so the creator always confirms what will be created.

---

## 7. Client structure

```
client/src/features/sheets/
├── api/          sheetsApi.js, progressApi.js        (thin apiClient wrappers)
├── hooks/        useSheets.js                        (TanStack Query keys + invalidations)
├── lib/          sheetUtils.js                       (labels, tones, formatters)
├── components/   SheetFilters, SheetCard, ProblemList (HTML5 DnD + keyboard move),
│                 ProblemDetail, ProgressPanel, TopicProgress, RatingSection,
│                 ReportDialog, PersonalResources, ProblemEditor,
│                 BulkImportDialog, ModerationPanel
└── pages/        SheetsPage, SheetDetailPage, SheetEditorPage
```

Plus two shared primitives: `components/ui/Modal.jsx` (accessible dialog) and
`components/ui/ProgressBar.jsx`. React Bits is used only for the `ShinyText`
eyebrow on the catalogue header — every table, form and pane is plain Tailwind,
fast and keyboard accessible. Drag-and-drop always has arrow-button keyboard
equivalents; all external links use `rel="noopener noreferrer nofollow"`.

Routes: `/app/sheets`, `/app/sheets/new`, `/app/sheets/:id`,
`/app/sheets/:id/edit`. All are lazy-loaded; `/app` does not pull the sheet code.

---

## 8. Security checklist

- JWT access token in memory + httpOnly refresh cookie (unchanged from Phase 1).
- Every new route: `authenticate` → `requireOnboarded` → `validate(Zod)` → RBAC.
- `.strict()` on every body/query/params contract blocks mass assignment;
  `validate()` replaces `req.body` with the parsed value.
- mongo-sanitize + control-character sanitisation run before any handler.
- All Mongo ids validated (`/^[a-f\d]{24}$/i`) before `findById`.
- Only http(s) URLs accepted; the importer never fetches remote content.
- Per-user collections are scoped by token id, never by a request parameter.
- Duplicate-key errors → consistent 409 envelope via the central error handler.
- Rate limiting inherited from the global `/api` limiter.
- Separation of duties on moderation; bounded review history prevents document
  growth.

---

## 9. Run & test

```bash
cd /home/user/AlgoNest-
npm install
npm run db:up                 # MongoDB (Docker) — required for real API calls
npm run dev                   # API :5000 + Vite :5173
npm run seed:admin            # optional: create the Super Admin

npm test                      # 56 server tests + 12 client render smoke checks
npm run lint                  # server syntax scan + client ESLint
npm run build                 # production client bundle
npm run preview               # production client on :4173
```

Without MongoDB, data routes return a clean **503** (`dbGuard`); `/health` and
the client still work. The tests deliberately need no database — models are
stubbed at the service layer.

Manual flow: register → onboard → `/app/sheets` → **New sheet** → save draft →
add problems (or paste links) → drag to reorder → **Submit for review** → sign in
as moderator → **Approve** → **Publish** → open the sheet as a student → set
status/notes/bookmark → rate/review → clone.

---

## 10. Assumptions made

1. **UTC days** for revision dates (no per-user timezone field exists yet).
2. `timeSpent` is sent as the **cumulative** minutes, not a delta — idempotent on retry.
3. `approved` is a distinct state from `published`; publishing is a separate,
   explicit action that creates the frozen version.
4. Only **published** sheets appear in the public catalogue; `draft`,
   `pending_review`, `rejected` and `archived` are visible to author + staff only.
5. Rating and review share one row per `(user, sheet)`; reports are separate and
   one **open** report per `(user, sheet)` is allowed.
6. Quizzes/Mocks/Plans/Resources/Community keep their honest Phase-1 placeholders
   until their own phases land.

---

## 11. Next step (Phase 3)

Quizzes: seven question types, creator + solver roles, timers, attempts and
explanations. Reuse `SheetVersion`'s snapshot pattern for published quizzes so
attempts stay valid, and reuse `progressApi`'s per-user separation for attempt
records.
