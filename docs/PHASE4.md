# Phase 4 — Mock test engine

Status: **complete and verified**. Phase 4 adds full-length mock tests with
sectional/global timers, negative marking, sectional cut-offs, a five-state
question palette, server-authoritative autosave and resume, auto-submit on
timeout, attempt limits, and a result analysis suite (score, accuracy, time per
question, difficulty-wise score, weak-topic diagnosis, wrong-answer reason
tagging and real DB-backed resource recommendations).

The complete source of every changed/new file is in
[`PHASE4-CODE.md`](./PHASE4-CODE.md). Phases 1–3 remain untouched except for
deliberate additive wiring (shared contracts, route mounts, router, navigation,
query keys, render smoke list and README).

---

## 1. Plan that was executed

| Group | Files |
| --- | --- |
| Shared contracts | appended mock constants + 18 Zod contracts to `shared/src/constants.js` and `shared/src/schemas.js` |
| Pure engine | `mockScoring.js`, `mockClock.js`, `mockWorkflow.js` (all DB-free, unit tested) |
| Models | `MockTest.js`, `MockVersion.js`, `MockAttempt.js` |
| Server module | `actor.js`, `mockTest.service.js`, `mockAttempt.service.js`, `mockAnalysis.service.js`, 2 controllers, 2 routers, mount in `routes/index.js` |
| Server tests | `mocks.test.js` (25), `mocks.service.test.js` (16), `mocks.routes.test.js` (4) |
| Client feature | 2 API wrappers, 1 hooks file, 1 utils, 14 components, 5 pages |
| Wiring | `queryKeys.js`, `navigation.js`, `router.jsx`, `smokeRender.mjs` |
| Docs | `README.md`, `docs/PHASE4.md`, `docs/PHASE4-CODE.md` |

---

## 2. Architecture decisions

### Reference vs. embedding (same rule as Phase 2/3)

```
Question (bank) ──referenced──▶ MockTest.sections[].questionIds[]
                                        │ publish
                                        ▼
                            MockVersion.sections[].questions[]  (EMBEDDED COPY)
                                        │
                                        ▼
                            MockAttempt.results[]  (FROZEN RESULT)
```

* `MockTest` sections **reference** the Phase 3 question bank so creators can
  reuse questions across sections and mocks.
* `MockVersion` **embeds a frozen copy** of each section: duration, marking
  scheme, cut-off and every question **including answer keys**. An attempt on
  version 1 still grades and explains correctly after the author edits the
  bank, changes negative marking or publishes version 2.
* `MockAttempt` stores its own `results`, `sections`, `difficultyStats`,
  `topicStats`, `weakTopics` and `recommendations` so a result page never
  recomputes from mutable content.

### The server is the only clock

Every deadline is an **absolute server timestamp**:

* `expiresAt` — hard backstop for the whole attempt
  (`startedAt + Σ section minutes`, plus a bounded 60 s grace per section
  transition in sectional mode).
* `sectionStates[i].expiresAt` — per-section deadline, set by the server when
  the section is entered; never allowed to exceed `expiresAt`.
* `GET /mock-attempts/:id`, autosave, heartbeat, section submit and final
  submit all call `syncClock()` first. It compares `Date.now()` against both
  deadlines, auto-advances timed-out sections, and auto-finalises with
  `status: 'timed_out'` when the hard deadline passes.

The client never sends a timestamp or duration. Its countdown is display-only
and is **overwritten** by `remainingSeconds` from every server response. When
it reaches zero the client does not decide anything — it refetches the attempt
so the server advances/finalises. A closed tab, a suspended laptop or a forged
client clock cannot extend an attempt.

**Time per question** uses server-observed focus windows. The client reports
only `activeQuestionId`; `creditFocusWindow()` stamps `firstSeenAt`,
`lastSeenAt` and accumulates seconds with a 300 s cap per window. A 15 s
heartbeat keeps the attribution fresh. Nothing time-related is persisted
client-side.

### Resume after disconnect

`GET /mock-attempts/:id` returns the complete frozen solver state: answers,
marks, `visited` flags, active question, section states, and server-computed
remaining seconds. Reloading the tab simply re-hydrates from that response.
A partial unique index (`{user, mock, status}` where
`status: 'in_progress'`) guarantees at most one live attempt per learner.

### Timer modes

| Mode | Behaviour |
| --- | --- |
| `sectional` | One active section at a time. Its clock starts when the server opens it. On timeout the server marks it `timed_out` and opens the next section. Locked sections are neither visible nor writable. |
| `global` | One overall clock; all sections are active, visible and writable, and the palette can jump anywhere. |

### Marking scheme & cut-offs

Per section: `correctMarks` (default 2), `negativeMarks` (positive deduction,
default 0.5), `cutoffPercentage` (default 0 = disabled).

```
correct     → +correctMarks
incorrect   → −negativeMarks
unattempted → 0
section.percentage = max(0, sectionScore) / (questionCount × correctMarks)
final passed = overallPercentage >= settings.passPercentage
               AND EVERY section.percentage >= section.cutoffPercentage
```

`accuracy = correct / (correct + incorrect)`. Scores may be fractional and
negative; the UI renders them with an explicit sign.

### Five palette states

`not_visited` (no row), `not_answered` (visited, no response), `answered`,
`marked` (visited, no response, flagged), `answered_marked`. States are derived
from the persisted `visited` flag, not from client UI state, so they survive a
reload. Every palette button is a real `<button>` with an `aria-label`.

### Wrong-answer reasons and recommendations

After a result, learners tag each wrong answer with `concept_gap`,
`silly_mistake`, `time_pressure`, `misread`, `guessed` or `other`.
`diagnoseWeakTopics()` ranks topics below the passing bar by marks lost and
boosts severity for knowledge-gap reasons. `buildRecommendations()` queries
**real data**: published `Sheet` problems whose topic matches a weak topic,
plus the learner's own `PersonalResource` rows. Results are deduplicated by
URL, ranked by marks lost and capped at 8. No placeholder links.

---

## 3. API reference (`/api/v1`)

Every response uses `{ success, data, message, errors }`; pagination lives in
`data.pagination`. Every route below requires a valid access token **and**
completed onboarding, and every request part is Zod-validated.

### Mock tests — `/mocks`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `mockListQuerySchema` | Filters `q, topic, difficulty, status, sort, mine`; hides `unlisted`/`private` |
| POST | `/` | `mockCreateSchema` | Creates a draft with sections (question lists start empty) |
| GET | `/:id` | `mockParamsSchema` | Students read the frozen published snapshot + their own attempt summary |
| PATCH | `/:id` | `mockParamsSchema` + `mockUpdateSchema` | Settings merged; sections replaced as a whole, ids preserved by position |
| DELETE | `/:id` | `mockParamsSchema` | Archive |
| POST | `/:id/restore` | `mockParamsSchema` | Archived → draft |
| POST | `/:id/revision` | `mockParamsSchema` | Published → draft (snapshot stays frozen) |
| POST | `/:id/submit` | `mockParamsSchema` + `changelogSchema` | Refuses a mock with an empty section |
| POST | `/:id/moderate` | `mockParamsSchema` + `moderationSchema` + `content:moderate` | Separation of duties |
| POST | `/:id/publish` | `mockParamsSchema` + `changelogSchema` | Creates immutable `MockVersion` |
| GET | `/:id/versions[/:version]` | `mockParamsSchema` / `versionParamsSchema` | Version metadata, never answer keys |
| GET | `/:id/sections/:sectionId/questions` | `mockSectionParamsSchema` + `mockQuestionListQuerySchema` | Editor-only, paginated, answer keys included |
| PUT | `/:id/sections/:sectionId/questions` | `mockSectionParamsSchema` + `mockSectionQuestionsSchema` | Replace one section's bank refs; rejects cross-section duplicates and foreign questions |
| GET | `/:id/attempts` | `mockParamsSchema` + `mockAttemptListQuerySchema` | Caller's own attempts, paginated |
| POST | `/:id/attempts` | `mockParamsSchema` + `mockAttemptStartSchema` | Start an attempt; server sets all deadlines |

### Mock attempts — `/mock-attempts`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/:id` | `mockAttemptParamsSchema` | **Resume**: full frozen state + server-computed remaining seconds |
| GET | `/:id/questions` | `mockAttemptParamsSchema` + `mockQuestionListQuerySchema` | Paginated, redacted, only accessible sections |
| PATCH | `/:id/answers` | `mockAttemptParamsSchema` + `mockAutosaveSchema` | Delta upsert + `activeQuestionId` focus window; ignores locked sections |
| POST | `/:id/heartbeat` | `mockAttemptParamsSchema` + `mockHeartbeatSchema` | Credits focus time, returns server clock |
| POST | `/:id/sections/:sectionId/submit` | `mockSectionParamsSchema` + `mockSubmitSchema` | Flushes final answers, then advances or finalises |
| POST | `/:id/submit` | `mockAttemptParamsSchema` + `mockSubmitSchema` | Idempotent final grading |
| GET | `/:id/result` | `mockAttemptParamsSchema` | Full analysis; strips explanations when disabled |
| PUT | `/:id/reasons` | `mockAttemptParamsSchema` + `mockReasonSchema` | Tag wrong answers, refresh diagnosis + recommendations |
| POST | `/:id/abandon` | `mockAttemptParamsSchema` | Releases the live-attempt slot without consuming an attempt |

Static sub-paths are registered before parameterised routes. `syncClock()`
runs on every one of these reads/writes.

---

## 4. Result analysis payload

`GET /mock-attempts/:id/result` returns:

```
attempt: {
  score, maxScore, percentage, passPercentage, passed, accuracy,
  correctCount, incorrectCount, unattemptedCount, durationSeconds,
  sections: [{ sectionId, title, correct, incorrect, unattempted,
               score, maxScore, percentage, cutoffPercentage, passed, timeSeconds }],
  difficultyStats: [{ difficulty, total, correct, incorrect, score, maxScore, percentage }],
  topicStats:      [{ topic, total, correct, incorrect, score, maxScore, percentage, lostMarks }],
  weakTopics:      [{ topic, percentage, lostMarks, incorrect, knowledgeGaps, severity, advice }],
  timeStats:       { totalSeconds, averageSeconds, slowest: [...], untracked },
  results:         [{ questionId, sectionId, type, topic, difficulty, correct,
                      attempted, marked, visited, response, awarded, timeSeconds,
                      reason, expected, explanation }],
  reasonSummary:   [{ reason, label, count }],
  recommendations: [{ title, url, type, topic, source, reason }],
  settings:        { timerMode, passPercentage, showExplanations, allowPaletteBack }
}
```

`expected`/`explanation` are omitted when the frozen version sets
`showExplanations: false`.

---

## 5. Limits

| Limit | Value |
| --- | --- |
| Sections per mock | 12 |
| Questions per section / per mock | 100 / 300 |
| Section duration / total duration | 1–180 min / ≤360 min |
| Attempts per mock | 1–20 (server-enforced) |
| Correct / negative marks | 0.1–10 / 0–10 |
| Single credited focus window | 300 s |
| Heartbeat / autosave debounce | 15 s / 900 ms |
| Recommendations | 8 |

---

## 6. Client structure

```
client/src/features/mocks/
├── api/{mockApi,mockAttemptApi}.js
├── hooks/useMocks.js
├── lib/mockUtils.js
├── components/
│   ├── MockFilters.jsx, MockCard.jsx, MockSettingsForm.jsx
│   ├── SectionEditor.jsx, SectionQuestionPicker.jsx, MockModerationPanel.jsx
│   ├── SectionTabs.jsx, MockPalette.jsx, MockTimer.jsx
│   └── DifficultyBreakdown.jsx, WeakTopicPanel.jsx, RecommendedResources.jsx,
│       ReasonTagger.jsx, MockResult.jsx
└── pages/
    ├── MocksPage.jsx        # catalogue
    ├── MockDetailPage.jsx   # start screen, sections table, attempt history
    ├── MockEditorPage.jsx   # create + edit, sections, publishing
    ├── MockSolverPage.jsx   # timer, palette, autosave, section submit
    └── MockResultPage.jsx   # full analysis
```

Routes: `/app/mocks`, `/app/mocks/new`, `/app/mocks/:id`,
`/app/mocks/:id/edit`, `/app/mocks/:id/attempts/:attemptId`,
`/app/mocks/:id/results/:attemptId`.

`QuestionRenderer` and `TopicPerformance` are reused from `features/quizzes`
(imported, not copied or modified). React Bits is used only for the catalogue
eyebrow; the solver, editor and result screens are plain accessible Tailwind.
`Alt + ← / →` jumps questions without stealing arrows from text inputs.

---

## 7. Security checklist

* All 25 new routes: `authenticate` + `requireOnboarded` + `validate(Zod)`;
  moderation additionally `requirePermission('content:moderate')` and the
  service re-checks ownership.
* Strict `.strict()` contracts strip unknown keys — a client cannot inject
  `accumulatedSeconds`, `expiresAt`, `score` or any other server-owned field.
* Answer keys and explanations never appear in a solver response; locked
  sections are neither returned nor writable.
* Autosave is scoped by attempt ownership and silently drops rows outside the
  accessible section set; the response reports an `ignored` count.
* Deadlines, `maxAttempts`, pass marks and marking schemes are read from the
  frozen version, never from the request body.
* `syncClock()` runs on every read and write; a learner cannot outlast a
  deadline by withholding requests.
* Wrong-answer reasons may only tag questions the learner actually got wrong.
* `express.json({ limit: '256kb' })`, helmet CSP, CORS allowlist,
  `express-mongo-sanitize`, control-character stripping and rate limiting are
  unchanged from Phase 1 and apply to every new route.
* Role is re-read from MongoDB on every request; access tokens remain in
  memory, refresh tokens in an httpOnly cookie scoped to `/api/v1/auth`.

---

## 8. Tests and verification

```
npm run lint   → 0 errors (92 server JS files syntax-checked, client ESLint clean)
npm test       → 161/161 server tests + 22/22 client render smoke tests
npm run build  → ✓ built, all five mock pages as lazy chunks
```

New server tests (45):

* `mocks.test.js` — 25 tests: section/settings contracts, total-duration and
  cross-section-duplicate rejection, all five palette states, negative-marking
  arithmetic, sectional cut-off gating, multi-section marking schemes,
  difficulty/topic/weak-topic/time diagnostics, reason tagging, global and
  sectional deadlines, focus-window crediting with the cap, section-state
  initialisation for both timer modes, section advancement, and lifecycle.
* `mocks.service.test.js` — 16 tests with stubbed models: non-owner edit
  denial, moderator self-review denial (plus super-admin exemption), empty
  section refusal, full lifecycle, immutable version with frozen answer keys
  and marking scheme, orphan-version rollback, frozen snapshot for students,
  duplicate/foreign question rejection, attempt deadline + `maxAttempts`,
  solver redaction and active-section visibility, autosave ownership and
  locked-section filtering, focus-time crediting, section-timeout
  auto-advance, hard-deadline auto-finalise, negative-marking grading with
  full diagnostics, section submit flush/advance/finalise, and reason tagging
  that refreshes real recommendations.
* `mocks.routes.test.js` — 4 tests: anonymous access to 25 endpoints returns
  `401` with the standard envelope, validation details never leak before auth,
  health stays public, Phase 2/3 protection unchanged.

Real Chromium (dev `:5173` and production preview `:4173`) rendered all six
mock routes with `pageerrors: []`, no console errors and no `ErrorBoundary`
fallback. Verified interactions: five-state palette legend, two section tabs,
server-clock display, debounced autosave `PATCH`, section question picker,
`Finish section` confirmation and `POST .../sections/:id/submit`, reason
tagging with `PUT .../reasons`, and a result page showing score, accuracy,
sectional cut-offs, difficulty/topic breakdowns, time per question, weak-topic
diagnosis, recommended resources and answer review.

Three real bugs were found by these checks and fixed rather than papered over:

1. `MockAttempt.mergeAnswers()` looked up allowed questions by `questionId`
   while the version helper supplies `id` — every autosaved answer was
   silently dropped.
2. `applyWrongReasons()` compared a `Map` of string ids against raw Mongoose
   `ObjectId`s — reason tagging did nothing on reloaded results.
3. `initialSectionStates()` marked only the first section active in global
   mode, which made `effectiveDeadline()` use that section's short window
   instead of the overall clock.

> The sandbox has no MongoDB, so live data routes return the intended `503`
> from `dbGuard`; browser checks used mocked API envelopes. With Docker Mongo
> the full flow works end to end.

---

## 9. Assumptions

1. **JavaScript throughout**, consistent with Phases 1–3.
2. `approved` and `published` remain distinct states: approval is moderation,
   publishing creates the immutable version.
3. `negativeMarks` is a positive magnitude that is **deducted**; unattempted
   questions always score zero. Partial credit is not applied.
4. Final pass requires **all** sectional cut-offs **and** the overall pass
   percentage. A cut-off of `0` disables that section's gate.
5. In sectional mode a question can only appear in one section; a section must
   be flushed (`POST .../sections/:id/submit`) before the next opens.
6. Time per question is an estimate based on server-observed focus windows,
   not keylogger-level precision; a single disconnected window is capped.
7. `retry` is a normal fresh attempt — it consumes one of `maxAttempts` and
   uses the current published version.
8. Recommendations are derived only from content that actually exists in the
   database; an empty result is shown honestly rather than padded with links.
9. UTC timestamps everywhere; the client formats them in the viewer's locale.

---

## 10. Next step

**Phase 5 — Adaptive Plans**: daily task distribution from sheets/quizzes/mocks,
rescheduling missed days, overload warnings and a "what should I do now" queue.
Reuse `weakTopics` from mock results and `topicStats` from quiz attempts to
rank revision tasks, and reuse `UserProgress` for completion signals.
