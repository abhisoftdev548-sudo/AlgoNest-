# Phase 3 — Quiz module

Status: **complete and verified**. Phase 3 adds a reusable question bank, seven
question types, versioned quizzes, timed attempts with autosave, and a result
page with explanations, topic-wise analysis and retry-incorrect-only.

The complete source of every changed/new file is in
[`PHASE3-CODE.md`](./PHASE3-CODE.md). Phase 1 and Phase 2 remain untouched
except for deliberate additive wiring (shared contracts, route mounts, router,
navigation, query keys, render smoke list and README).

---

## 1. Plan that was executed

| Group | Files |
| --- | --- |
| Shared contracts | appended quiz constants + 22 Zod contracts to `shared/src/constants.js` and `shared/src/schemas.js` |
| Pure logic (unit tested, no DB/Express) | `questionNormalizer.js`, `questionGrader.js`, `quizPresentation.js`, `bulkImport.js`, `quizWorkflow.js` |
| Models | `Question.js`, `Quiz.js`, `QuizVersion.js`, `Attempt.js` |
| Server module | `actor.js`, `question.service.js`, `quiz.service.js`, `attempt.service.js`, three controllers, three routers, mount in `routes/index.js` |
| Server tests | `quizzes.test.js` (34), `quizzes.service.test.js` (21), `quizzes.routes.test.js` (5) |
| Client feature | 3 API wrappers, 1 hooks file, 2 utility files, 11 components, 5 pages |
| Wiring | `queryKeys.js`, `navigation.js`, `router.jsx`, `smokeRender.mjs` |
| Docs | `README.md`, `docs/PHASE3.md`, `docs/PHASE3-CODE.md` |

---

## 2. Architecture decisions

### Question bank: referenced. Published version: embedded.

This is the deliberate reference-vs-embedding split:

```
Question (bank, standalone collection)  ──referenced──▶  Quiz.questions[]
                                                             │ publish
                                                             ▼
                                              QuizVersion.questions[]  (EMBEDDED COPY)
                                                             │
                                                             ▼
                                              Attempt.results[] (frozen result)
```

* `Question` is **referenced** by `Quiz.questions` (`{ question: ObjectId, order }`).
  A creator writes a question once and links it into many quizzes. Editing a bank
  question does not silently change a live quiz.
* `QuizVersion` **embeds a full frozen copy** of every question — including the
  answer keys — plus the settings in force at publish time. An attempt started on
  version 1 still grades and explains correctly after the author edits the bank,
  reorders questions, changes the passing score or publishes version 2.
* `Attempt` stores its own `results[]` and `topicStats[]` so a result page never
  has to recompute from a mutable source.

`QUESTION_FIELDS` is a single exported Mongoose field descriptor shared by
`Question` and `snapshotQuestionSchema`, so the two shapes can never drift.

### Answer keys never reach the solver

`redactQuestion()` is the only function that produces a learner-facing question.
It strips `answerKey`, `booleanKey`, `textAnswers`, `expected` and `explanation`.
For `matching`, it emits two independent arrays (`leftItems`, `rightItems`) so
adjacency in the payload cannot reveal a correct pair. Explanations are returned
only by `GET /attempts/:id/result` — and omitted entirely when the quiz sets
`showExplanations: false`.

### One canonical question shape

Creator input is a Zod **discriminated union on `type`** that is deliberately
friendly: options are plain strings and an answer may be a 0-based index, a
1-based number, a letter `A`–`H`, or the exact option text. `normaliseQuestion()`
converts every accepted form into one canonical shape with deterministic ids
(`o0`, `i0`, `p0`) so imported questions are reproducible and snapshots diff
cleanly. The grader only ever sees that canonical shape.

### Deterministic shuffle

`buildPresentation()` seeds a Fisher–Yates shuffle from the attempt id. The exact
display order is stored on the `Attempt`, so a reload or an autosave round-trip
never reorders questions under the learner — a correctness issue, not just
polish, because answers are keyed by id.

### Server-authoritative time and attempts

`expiresAt` is computed on the server at attempt start. The client's countdown
is display-only. Every read of an attempt calls `finalizeIfExpired()`, which
grades whatever was autosaved and marks the attempt `timed_out`; a late autosave
returns `expired: true` and the final result. `maxAttempts` is checked against
non-abandoned attempts on the server. A partial unique index
(`{user, quiz, status}` where `status: 'in_progress'`) guarantees one live
attempt per learner per quiz.

### Per-user separation

Attempts, answers, marks and results are never written to `Quiz` or
`QuizVersion`. Assertions use the authenticated token's user id; no endpoint
accepts a user id from the client.

---

## 3. Question types

| Type | Creator input | Stored answer | Grading |
| --- | --- | --- | --- |
| `mcq` | `options: string[]`, `answer: index/letter/text` | `answerKey: [optionId]` | exact id match |
| `multi` | `options: string[]`, `answer: (index/letter/text)[]` | `answerKey: [optionId…]` | exact set match (no partial credit) |
| `true_false` | `answer: boolean \| 'true' \| 'yes' \| '1' …` | `booleanKey` | strict boolean equality |
| `ordering` | `items: string[]` in correct order | `answerKey: itemIds in order` | order-sensitive array equality |
| `matching` | `pairs: [left,right][] \| {left,right}[]` | `answerKey: pairIds` | identity map from left id → right id |
| `output` | `code`, `options`, `answer` | `answerKey: [optionId]` | exact id match |
| `fill_blank` | `answer: string \| string[]`, `caseSensitive?` | `textAnswers` | trimmed + whitespace-collapsed, case-insensitive by default |

`expectedAnswer()` produces a human-readable correct answer for the result page.

---

## 4. Content lifecycle

Identical to Phase 2 (same state machine, separate implementation so quiz rules
can evolve):

```
draft ─submit→ pending_review ─approve→ approved ─publish→ published
                   │                                        │
  request_changes ─┘ → changes_requested ─resubmit→ pending_review
  reject ──────────┘ → rejected ─revise→ draft
  any non-archived ─archive→ archived ─restore→ draft
  published ─revision→ draft  (public QuizVersion stays frozen)
```

Separation of duties: a moderator cannot moderate a quiz they authored
(`super_admin` is exempt). `publish` refuses an empty quiz or an unapproved one,
and rolls back the orphan version if the subsequent quiz save fails (standalone
MongoDB has no multi-document transactions).

---

## 5. API reference (`/api/v1`)

Every response uses `{ success, data, message, errors }`; pagination lives in
`data.pagination`. Every route below requires a valid access token **and**
completed onboarding, and every request part is Zod-validated.

### Question bank — `/question-bank`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `questionListQuerySchema` | Paginated; author-scoped for students, staff can browse all |
| POST | `/` | `questionInputSchema` | Create one question (manual) |
| POST | `/parse-import` | `questionImportSchema` | **Pure preview** — no DB write, no network fetch |
| GET | `/:id` | `questionParamsSchema` | Owner/staff only; includes answer keys |
| PATCH | `/:id` | `questionParamsSchema` + `questionInputSchema` | Full replace; published versions are unaffected |
| DELETE | `/:id` | `questionParamsSchema` | Refuses while `usageCount > 0` with an actionable message |

### Quizzes — `/quizzes`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `quizListQuerySchema` | Filters `q, topic, difficulty, status, sort, mine`; public catalogue hides `unlisted`/`private` |
| POST | `/` | `quizCreateSchema` | Creates a draft owned by the caller |
| GET | `/:id` | `quizParamsSchema` | Students always read the frozen published snapshot + their own attempt summary |
| PATCH | `/:id` | `quizParamsSchema` + `quizUpdateSchema` | Settings are merged, never reset |
| DELETE | `/:id` | `quizParamsSchema` | Archive |
| POST | `/:id/restore` | `quizParamsSchema` | Archived → draft |
| POST | `/:id/revision` | `quizParamsSchema` | Published → draft (snapshot stays frozen) |
| POST | `/:id/submit` | `quizParamsSchema` + `changelogSchema` | Refuses an empty quiz |
| POST | `/:id/moderate` | `quizParamsSchema` + `moderationSchema` + `content:moderate` | Separation of duties |
| POST | `/:id/publish` | `quizParamsSchema` + `changelogSchema` | Creates the immutable `QuizVersion` |
| GET | `/:id/versions[/:version]` | `quizParamsSchema` / `versionParamsSchema` | Students get metadata + redacted question list only |
| GET | `/:id/questions` | `quizParamsSchema` + `quizQuestionListQuerySchema` | Editor-only, paginated, includes answer keys |
| POST | `/:id/questions` | `quizParamsSchema` + `quizQuestionsSchema` | Link existing bank questions (1–100) |
| POST | `/:id/questions/import` | `quizParamsSchema` + `quizImportSchema` | Create bank questions from parsed rows, then link; rolls back on failure |
| PATCH | `/:id/questions/order` | `quizParamsSchema` + `quizReorderSchema` | Full-array reorder; every id exactly once |
| DELETE | `/:id/questions/:questionId` | `quizQuestionParamsSchema` | Unlink + re-rank |
| GET | `/:id/attempts` | `quizParamsSchema` + `attemptListQuerySchema` | Caller's own attempts, paginated |
| POST | `/:id/attempts` | `quizParamsSchema` + `attemptStartSchema` | Start `full` or `incorrect` retry |

### Attempts — `/attempts`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/:id` | `attemptParamsSchema` | Solver or result view; auto-finalises expired attempts |
| GET | `/:id/questions` | `attemptParamsSchema` + `attemptQuestionQuerySchema` | Paginated, **redacted**, in stored presentation order |
| PATCH | `/:id/answers` | `attemptParamsSchema` + `autosaveSchema` | Upsert-only; ignores unknown question ids; returns `expired` when time is up |
| POST | `/:id/submit` | `attemptParamsSchema` + `submitAttemptSchema` | Idempotent; applies final answers then grades |
| GET | `/:id/result` | `attemptParamsSchema` | Explanations + `retryAllowed` |
| POST | `/:id/abandon` | `attemptParamsSchema` | Releases the live-attempt slot without consuming an attempt |

Static sub-paths (`/parse-import`, `/questions/import`, `/questions/order`)
are registered before parameterised routes.

---

## 6. Bulk import format

`POST /question-bank/parse-import` accepts `{ format: 'json' | 'csv', text }`
and returns `{ items, errors, skipped, total, templates }` without writing to
MongoDB. The client shows a preview with per-row errors and duplicate skips,
then sends the selected (validated) rows to
`POST /quizzes/:id/questions/import`.

**JSON** — an array, or `{ questions: [...] }` / `{ items: [...] }`:

```json
[
  { "type": "mcq", "prompt": "Which data structure is LIFO?", "options": ["Queue", "Stack", "Tree"], "answer": "B", "topic": "Stacks", "explanation": "LIFO." },
  { "type": "multi", "prompt": "Pick the primes", "options": ["2", "3", "4", "9"], "answer": [0, 1], "points": 2 },
  { "type": "true_false", "prompt": "Binary search needs sorted input.", "answer": true },
  { "type": "ordering", "prompt": "Order by complexity", "items": ["O(1)", "O(log n)", "O(n)"] },
  { "type": "matching", "prompt": "Match ADT to property", "pairs": [["Stack", "LIFO"], ["Queue", "FIFO"]] },
  { "type": "output", "prompt": "What does this print?", "code": "console.log(1 + 1)", "options": ["1", "2"], "answer": 1 },
  { "type": "fill_blank", "prompt": "A ______ is FIFO.", "answer": ["queue", "queues"] }
]
```

**CSV** — header row plus one row per question. Multi-value cells use `|`
(not commas, so a spreadsheet export needs no nested quoting); matching pairs
use `left::right`. The parser supports quoted fields, escaped quotes, embedded
newlines and a UTF-8 BOM.

```
type,prompt,options,answer,items,pairs,code,explanation,topic,difficulty,points,tags,caseSensitive
mcq,Which data structure is LIFO?,Queue|Stack|Tree|Graph,B,,,,A stack follows last-in first-out.,Stacks & Queues,easy,1,,
multi,Pick the prime numbers,2|3|4|9,A|B,,,,,Math,medium,2,,
matching,Match ADT to property,,,,Stack::LIFO|Queue::FIFO,,,Stacks & Queues,,,,
```

The in-product **Load JSON/CSV template** button inserts examples covering all
seven types. Hard caps: 100 rows per import, 200 000 characters of pasted text,
200 CSV rows, 200 questions per quiz, 8 options, 10 ordering items, 10 matching
pairs.

---

## 7. Quiz settings

| Setting | Default | Meaning |
| --- | --- | --- |
| `timerMinutes` | 20 | 1–180; `expiresAt = startedAt + timerMinutes` |
| `passPercentage` | 60 | 0–100; frozen into each version |
| `maxAttempts` | 3 | 1–20; server-enforced, abandoned attempts don't count |
| `shuffleQuestions` | false | Seeded, stable per attempt |
| `shuffleOptions` | false | Also shuffles ordering items and both matching columns |
| `visibility` | `public` | `public` \| `unlisted` (link only) \| `private` (author + staff) |
| `showExplanations` | true | Hides correct answers/explanations on the result page when false |
| `allowRetryIncorrect` | true | Enables retry-incorrect-only attempts |

---

## 8. Client structure

```
client/src/features/quizzes/
├── api/{quizApi,questionApi,attemptApi}.js   # thin apiClient wrappers
├── hooks/useQuizzes.js                       # TanStack Query keys + mutations
├── lib/{quizUtils,questionDefaults}.js       # labels, formatting, form shapes
├── components/
│   ├── QuizFilters.jsx, QuizCard.jsx         # catalogue
│   ├── QuizSettingsForm.jsx                  # 8 settings controls
│   ├── QuestionEditor.jsx                    # one form, seven types, Zod validated
│   ├── QuestionList.jsx                      # HTML5 DnD + keyboard arrows
│   ├── BulkImportDialog.jsx                  # paste → preview → select → import
│   ├── ModerationPanel.jsx                   # lifecycle actions + review history
│   ├── QuestionPalette.jsx, QuizTimer.jsx    # solver chrome
│   ├── QuestionRenderer.jsx                  # seven response editors
│   └── TopicPerformance.jsx, AttemptResult.jsx
└── pages/
    ├── QuizzesPage.jsx                       # filters/tabs/pagination
    ├── QuizDetailPage.jsx                    # start screen + attempt history
    ├── QuizEditorPage.jsx                    # create + edit + questions + publish
    ├── QuizSolverPage.jsx                    # timer, palette, autosave, submit
    └── QuizResultPage.jsx                    # score, topics, explanations, retry
```

Routes: `/app/quizzes`, `/app/quizzes/new`, `/app/quizzes/:id`,
`/app/quizzes/:id/edit`, `/app/quizzes/:id/attempts/:attemptId`,
`/app/quizzes/:id/results/:attemptId`.

React Bits is used only for the catalogue eyebrow (`ShinyText`); the solver,
editor and result screens are plain accessible Tailwind. Palette buttons,
reorder controls and all form fields are keyboard reachable; the solver adds
`Alt + ← / →` for jumping questions without stealing arrows from text inputs.

---

## 9. Security checklist

* All 30+ new routes: `authenticate` + `requireOnboarded` + `validate(Zod)`;
  moderation additionally `requirePermission('content:moderate')` and the
  service re-checks ownership so a route change cannot bypass RBAC.
* Strict `.strict()` contracts strip unknown keys; raw `req.body` is replaced
  with the parsed value, preventing mass assignment.
* Answer keys, explanations and expected answers never appear in a solver
  response; `matching` columns are separated.
* Autosave is scoped by attempt ownership and only accepts question ids that
  belong to that attempt's frozen version.
* Timers, `maxAttempts` and pass marks are read from the frozen version, never
  from the request body.
* `express.json({ limit: '256kb' })`, helmet CSP, CORS allowlist,
  `express-mongo-sanitize`, control-character stripping and rate limiting are
  unchanged from Phase 1 and apply to every new route.
* Role is re-read from MongoDB on every request; access tokens remain in
  memory, refresh tokens in an httpOnly cookie scoped to `/api/v1/auth`.
* `dbGuard` returns a clean `503` when MongoDB is unreachable.

---

## 10. Tests and verification

```
npm run lint   → 0 errors (75 server JS files syntax-checked, client ESLint clean)
npm test       → 116/116 server tests + 17/17 client render smoke tests
npm run build  → ✓ built, all five quiz pages emitted as lazy chunks
```

New server tests (60):

* `quizzes.test.js` — 34 tests: all seven Zod variants, option-answer
  resolution, normalisation, redaction (no leaked keys), grading for every type
  including case sensitivity, topic stats, seeded shuffle determinism, CSV/JSON
  import (quoted fields, templates, per-row errors, dedupe, malformed input),
  lifecycle transitions and visibility rules.
* `quizzes.service.test.js` — 21 tests with stubbed models: non-owner edit
  denial, moderator self-review denial (plus super-admin exemption), empty
  submit/publish refusal, full lifecycle, immutable version with stable bank
  ids and frozen answer keys, orphan-version rollback, frozen snapshot after
  bank edits, unpublished-draft hiding, foreign bank question rejection,
  duplicate link rejection, partial reorder rejection and re-ranking on unlink,
  attempt deadline, `maxAttempts`, seeded presentation, solver redaction,
  autosave ownership/upsert, scoring + topic stats, idempotent submit,
  expired auto-finalise as `timed_out`, retry-incorrect-only subset and hidden
  explanations.
* `quizzes.routes.test.js` — 5 tests: anonymous access to 30 endpoints returns
  `401` with the standard envelope, validation details never leak before auth,
  health stays public, Phase 2 protection unchanged.

Real Chromium (dev `:5173` and production preview `:4173`) rendered all six
quiz routes with `pageerrors: []`, no console errors and no `ErrorBoundary`
fallback. Verified interactions: autosave `PATCH` fired after answering and
marking; all seven response editors render the correct controls; palette jumps;
submit confirmation shows answered/marked counts; `POST /submit` navigates to
the result page with score, topic performance, explanations and retry CTA;
creator UI lists/reorders seven questions, switches the manual editor through
all seven types, and the bulk-import dialog parses a preview with templates.

Two bugs were found by these checks and fixed rather than papered over:

1. `incorrectQuestionIds()` returned raw Mongoose `ObjectId`s, so
   retry-incorrect-only built an empty subset after a page reload.
2. The solver's initial `remainingSeconds = 0` raced with the first load and
   auto-submitted the attempt. It now uses an explicit `null` "clock not
   initialised" sentinel.

> The sandbox has no MongoDB, so live data routes return the intended `503`
> from `dbGuard`; browser checks used mocked API envelopes. With Docker Mongo
> the full flow works end to end.

---

## 11. Assumptions

1. **JavaScript throughout**, consistent with Phases 1 and 2.
2. `approved` and `published` remain distinct states, as in Phase 2: approval
   is a moderation decision, publishing creates the immutable version.
3. **Multi-select uses exact-match scoring** (no partial credit) for
   deterministic, explainable results. Partial credit can be added later as an
   explicit per-question policy.
4. Ordering questions are authored in the correct order; the solver sees them
   shuffled. The displayed order is recorded as the learner's initial answer.
5. Matching right-options are identified by their own pair id, so a correct
   answer is the identity map; two independently shuffled columns hide it.
6. `retry-incorrect-only` counts as a normal attempt against `maxAttempts` and
   uses the same frozen version as its source attempt.
7. Abandoning an attempt releases the single live-attempt slot and does not
   consume an attempt.
8. Question bank questions are private to their author; staff can browse the
   whole bank for moderation, but no student can read another creator's answer
   keys.
9. UTC timestamps everywhere; the client formats them in the viewer's locale.

---

## 12. Next step

**Phase 4 — Mock tests**: sections with independent/section timers, negative
marking, a question palette with mark-for-review, autosave, auto-submit and
result analysis. Reuse `QuizVersion`'s immutable snapshot and `Attempt`'s
server-authoritative timer, and extract the shared question renderer so mocks
and quizzes stay consistent.
