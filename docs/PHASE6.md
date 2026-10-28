# Phase 6 — Resource directory, creator profiles & analytics

Status: **complete and verified**. Phase 6 adds a public, moderated resource
directory with a submission form, full filter set, save/rate/helpful/report,
canonical duplicate-URL detection and an SSRF-safe broken-link checker job.
It also adds creator profiles with basic `view / save / start / completion`
analytics, and wires weak topics / mock-test recommendations into the new
catalogue.

The complete source of every changed/new file is in
[`PHASE6-CODE.md`](./PHASE6-CODE.md). Phases 1–5 remain intact; only additive
wiring changed shared contracts, route mounts, router, navigation, query keys,
the render-smoke list, `.env.example`, npm scripts and the README. Two tiny
additive integrations touch Phase 4/5 files and are documented in §8.

---

## 1. Plan that was executed

| Group | Files |
| --- | --- |
| Shared contracts | appended resource/creator/link constants + 19 Zod contracts to `shared/src/constants.js` / `schemas.js` |
| Pure engine | `resourceUrl.js`, `linkChecker.js`, `resourceWorkflow.js`, `analytics.js` |
| Models | `Resource`, `ResourceSave`, `ResourceReaction`, `ResourceReport`, `ResourceEvent`, `CreatorProfile` |
| Server | 3 services + 1 analytics helper, 3 controllers, 2 routers, `routes/index.js` mount, `scripts/checkResourceLinks.mjs` CLI |
| Server tests | `resources.test.js` (19), `resources.service.test.js` (17), `resources.routes.test.js` (4) |
| Client | 2 APIs, 1 hooks file, 1 utils, 16 components, 5 pages |
| Wiring | `queryKeys.js`, `navigation.js`, `router.jsx`, `smokeRender.mjs`, `package.json`, `server/.env.example` |
| Docs | `README.md`, `docs/PHASE6.md`, `docs/PHASE6-CODE.md` |

---

## 2. Architecture decisions

### Two distinct link stores — deliberate

| | `PersonalResource` (Phase 2) | `Resource` (Phase 6) |
| --- | --- | --- |
| Visibility | private, per-user | public catalogue |
| Moderation | none | full lifecycle |
| Fields | free-form note/rating | typed topic/level/language/pricing/type |
| Link checks | none | nightly SSRF-safe job |
| Analytics | none | append-only events + counters |

They are **not merged**: a learner's private notes must never become public,
and a curated catalogue entry must never be editable by its readers. Saving a
public resource creates a separate `ResourceSave` row — no data duplication.

### Reference vs. embedding

`Resource` **embeds a frozen snapshot** of the normalised URL, platform, host
and metadata so an author renaming a third-party page cannot break history.
Per-user facts (`ResourceSave`, `ResourceReaction`, `ResourceReport`,
`ResourceEvent`) **reference** the resource and are always scoped by `user`.
Creator profiles reference `User` with a unique index.

### Canonical duplicate detection (pure, never fetches)

`resourceUrl.js` reuses Phase 2's `detectPlatform`/`normaliseUrl`:

```
https://www.LeetCode.com/problems/two-sum/?utm_source=x#comments
  → https://www.leetcode.com/problems/two-sum
  → urlKey: leetcode.com/problems/two-sum
```

Tracking params, fragments, `www.`, case and trailing slashes are stripped;
YouTube `?v=` is preserved so distinct videos don't collapse. The server
checks `urlKey` before create/update/restore and returns `409` with a link to
the existing entry. A `GET /resources/check-duplicate?url=…` endpoint powers
the live warning in the submission form. **No network request is made** by
duplicate detection — the URL is only parsed.

### Lifecycle and RBAC

`draft → pending_review → changes_requested → approved/published | rejected →
archived`, identical to sheets/quizzes/mocks. `content:moderate` is required
for moderation, report triage and link checks, and the service re-checks
separation of duties (a creator cannot moderate their own submission). Only
published resources can be saved, rated, voted on, reported or tracked.

### Ratings, votes and reports

`ResourceReaction` is **one row per (user, resource)** holding a nullable
1–5 `rating` + review and an independent nullable `helpful` boolean. PUT is
an upsert; `helpful: null` withdraws the vote without touching the star
rating. `ratingCount/ratingSum/helpfulCount/notHelpfulCount` are recomputed
from the reaction rows after each write (no drift). Ratings are forbidden on
your own submission. `ResourceReport` deduplicates open reports per
(reporter, resource); a `broken_link` report clears `linkCheckedAt` so the
next job run re-checks it immediately.

### Broken-link checker — SSRF-safe by construction

`server/scripts/checkResourceLinks.mjs` is a **separate process** (cron, not a
request thread). Before any socket opens, `linkChecker.js`:

1. allows only `http/https` on ports 80/443, rejects credentials and local
   hostnames (`localhost`, `*.local`, `*.internal`);
2. resolves **all** A/AAAA records and rejects loopback, private, CGNAT,
   link-local, multicast, reserved, unspecified and IPv6 ULA ranges;
3. re-validates every redirect hop (max 2) with the same rules;
4. aborts after `LINK_CHECK_TIMEOUT_MS` and cancels the response body
   immediately (it only needs the status code);
5. validates a DNS answer again inside the job's `fetchImpl` path — the
   injected fetch is used with `redirect: 'manual'` so no hidden redirects.

`2xx → ok`, `404/410/451 → broken`, everything else (`401/403/429/5xx`,
timeout, DNS error) → `unknown`. `classify()` requires **two consecutive
failures** before flagging a resource broken, so a transient 503 is harmless;
a healthy probe resets the counter. `selectCandidates()` picks published,
due links (24 h interval) and prioritises already-failing ones. A staff
endpoint runs a bounded batch on demand.

### Creator analytics

`ResourceEvent` is an append-only fact table `{resource, creator, user, type,
dayKey}`. `view` is deduplicated per (resource, user, UTC day) by a partial
unique index, so refreshing a page cannot inflate numbers. `save`, `start`
and `completion` are explicit events (save endpoint, "Open resource" click,
"Mark complete" click). `Resource` carries denormalised counters for cheap
catalogue sorting; `CreatorProfile` pages show aggregate stats, and
`getAnalytics()` builds a daily series, top resources and a conversion funnel
from the event table. Analytics are own-only unless the caller has
`analytics:read`/`user:read`.

---

## 3. API reference (`/api/v1`)

Every response uses `{ success, data, message, errors }`; pagination lives in
`data.pagination`. Every route requires a valid access token **and** completed
onboarding, and every request part is Zod-validated.

### Resources — `/resources`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `resourceListQuerySchema` | `q, topic, level, language, type, pricing, platform, linkStatus, status, sort, mine, saved` |
| POST | `/` | `resourceCreateSchema` | Create draft or submit for review; duplicate check |
| GET | `/check-duplicate` | `resourceDuplicateQuerySchema` | Pure canonical lookup, no fetch |
| GET | `/saved` | `resourceSavedQuerySchema` | Saved catalogue |
| GET | `/reports` | `resourceReportListQuerySchema` + `content:moderate` | Staff report queue |
| PATCH | `/reports/:reportId` | `resourceReportResolveSchema` + `content:moderate` | Resolve / dismiss |
| POST | `/link-check/run` | `resourceLinkCheckQuerySchema` + `content:moderate` | Bounded on-demand batch |
| GET / PATCH / DELETE | `/:id` | `resourceParamsSchema` (+ update body) | Detail (records a deduped view) / edit / archive |
| POST | `/:id/{submit,revision,restore,publish}` | `resourceParamsSchema` | Lifecycle |
| POST | `/:id/moderate` | `moderationSchema` + `content:moderate` | Approve / request changes / reject |
| POST | `/:id/check-link` | + `content:moderate` | Probe one link |
| PUT / DELETE | `/:id/save` | `resourceParamsSchema` | Idempotent save / unsave |
| PUT / GET | `/:id/rating` · `/:id/ratings` | `resourceRatingSchema` / `resourceRatingsQuerySchema` | Upsert review / paginated reviews |
| PUT | `/:id/feedback` | `resourceFeedbackSchema` | Helpful / not helpful / withdraw |
| POST | `/:id/report` | `resourceReportSchema` | Report with details |
| POST | `/:id/events` | `resourceEventSchema` | `view\|start\|completion` (save uses its endpoint) |

Static paths (`check-duplicate`, `saved`, `reports`, `link-check`) are
registered before `/:id`.

### Creators — `/creators`

| Method | Path | Contract | Notes |
| --- | --- | --- | --- |
| GET | `/` | `creatorListQuerySchema` | Paginated public profiles |
| GET / PUT | `/me` | `creatorProfileSchema` | Own profile (lazily created) |
| GET | `/me/analytics` | `creatorAnalyticsQuerySchema` | Own analytics |
| GET | `/:id` | `creatorParamsSchema` + `creatorGetQuerySchema` | Public profile + published resources |
| GET | `/:id/analytics` | + `analytics:read` | Staff analytics |

---

## 4. Limits

| Limit | Value |
| --- | --- |
| Title / description / URL | 160 / 2,000 / 2,000 chars |
| Tags | 12 (32 chars each) |
| Rating review / report details / bio | 1,000 / 1,000 / 600 chars |
| Expertise / social links | 12 / 5 |
| Link-check batch / timeout / redirects | 100 / 8 s / 2 |
| Failure threshold before "broken" | 2 consecutive |
| Re-check interval | 24 h |
| Analytics window | 1–90 days (default 30) |

---

## 5. Client structure

```
client/src/features/resources/
├── api/{resourceApi,creatorApi}.js
├── hooks/useResources.js
├── lib/resourceUtils.js
├── components/
│   ├── ResourceFilters.jsx, ResourceCard.jsx, LinkStatusBadge.jsx,
│   │   StarRating.jsx, HelpfulVote.jsx, ReviewList.jsx, ReportDialog.jsx,
│   │   DuplicateWarning.jsx, ResourceSubmitForm.jsx,
│   │   ResourceDetail.jsx, ResourceModerationPanel.jsx, ReportQueue.jsx,
│   │   CreatorCard.jsx, CreatorHero.jsx, CreatorProfileForm.jsx,
│   │   CreatorAnalytics.jsx
└── pages/{ResourcesPage,ResourceDetailPage,ResourceEditorPage,
           CreatorsPage,CreatorPage}.jsx
```

Routes: `/app/resources`, `/app/resources/new`, `/app/resources/:id`,
`/app/resources/:id/edit`, `/app/creators`, `/app/creators/me`,
`/app/creators/:id`.

The catalogue has Explore / Saved / My submissions / Creators tabs plus staff
Reports and Review queue tabs; filters are in `ResourceFilters`. The
submission form validates with the **same** `resourceCreateSchema` the server
uses and shows the live duplicate hint. React Bits (`ShinyText`) is confined to
the catalogue eyebrow; all tables, forms, cards and charts are plain accessible
Tailwind. Star rating uses `role="radio"`/`aria-checked`, votes use
`aria-pressed`, and external links always carry
`rel="noopener noreferrer nofollow"`.

---

## 6. Security checklist

* All 31 new routes: `authenticate` + `requireOnboarded` + `validate(Zod)`;
  moderation, report triage and link checks additionally need
  `content:moderate`, re-checked in the service.
* Strict `.strict()` contracts strip unknown keys — a client cannot inject
  `author`, `status`, `viewCount`, `urlKey`, `verified`, `creator` or
  `linkStatus`.
* Every URL is normalised to http(s) before storage; `safeExternalUrl()`
  re-validates before rendering any `href`.
* Duplicate detection and the submission form never fetch a URL.
* The link checker resolves DNS and rejects all private ranges **before**
  opening a socket, re-validates every redirect, caps redirects/timeout/body,
  and never follows a `file:`/`ftp:`/credentialed URL.
* One open report per (reporter, resource); reports are staff-only.
* Views deduplicated per user per day; self-rating forbidden.
* Creator analytics are owner-only unless the caller has `analytics:read`.
* Existing Phase-1 protections apply unchanged: `express.json({ limit:
  '256kb' })`, helmet CSP, CORS allowlist, `express-mongo-sanitize`,
  control-character stripping, rate limiting, bcrypt, short-lived access
  tokens and httpOnly refresh cookies.
* Role is re-read from MongoDB on every request; no secrets in code — all
  job settings come from environment variables with an `.env.example` entry.

---

## 7. Tests and verification

```
npm run lint   → 0 errors (125 server JS files syntax-checked, client ESLint clean)
npm test       → 237/237 server tests + 30/30 client render smoke tests
npm run build  → ✓ built, all five resource/creator pages as lazy chunks
dev=200  api=200  prod=200
```

New server tests (40):

* `resources.test.js` — 19 tests: contract validation (non-http schemes,
  enums, reports, creator input), URL canonicalisation, cross-form duplicate
  detection, distinct YouTube IDs, private/loopback/link-local/CGNAT IPv4+IPv6
  rejection, local hostname / credentials / port / scheme rejection, DNS
  answers resolving to private addresses, 2xx/404/410 classification,
  inconclusive 401/403/429/5xx handling, redirect-hop validation and limit,
  redirect into `169.254.169.254` refusal, timeout handling, two-strike
  failure threshold with recovery, candidate selection, lifecycle transitions,
  and event summarisation into totals/series/top resources.
* `resources.service.test.js` — 17 tests with stubbed models: normalised
  create (draft + direct review submission), duplicate conflict + masked
  non-public duplicate, cross-user edit denial, published-edit denial, URL
  change resetting link state, full lifecycle with moderation separation of
  duties, published-only list with filters, staff-only link-check batch,
  idempotent save/unsave with counter and event, published-only save,
  self-rating denial + average recomputation, vote withdrawal without touching
  stars, duplicate open report + broken-link re-check nudge, staff-only report
  queue, lazy creator profile creation + update, and own-only analytics with
  conversion rates.
* `resources.routes.test.js` — 4 tests: anonymous access to all 23 resource
  endpoints and 6 creator endpoints returns `401` with the standard envelope;
  validation details never leak before auth; health stays public; Phases 2–5
  protection unchanged.

Real Chromium on **dev `:5173` and production preview `:4173`** rendered all
seven Phase-6 routes with `pageerrors: []`, no console errors and no
`ErrorBoundary` fallback. Verified interactions: catalogue filters and broken
link badge, staff link-check batch + report queue resolve, submission form
live duplicate hint, detail page save / star rating / helpful vote / reviews /
link health, and the creator profile editor with analytics chart, conversion
funnel and top resources.

Two real bugs were found by these checks and fixed:

1. `resource.service.listResources()` referenced `items` inside the same
   `Promise.all` array that defined it (TDZ `ReferenceError`) when building the
   saved/reaction lookups.
2. `/creators/me` is a **static** route, so `useParams().id` was `undefined`
   and `CreatorPage` rendered as a public profile — fixed by deriving `isMe`
   from `useLocation().pathname`.

> The sandbox has no MongoDB, so live data routes return the intended `503`
> from `dbGuard`; browser checks used mocked API envelopes. Server tests stub
> models, and the link checker's `fetchImpl`/`lookupImpl` injections mean no
> test makes a real network call.

---

## 8. Additive integrations (Phases 4–5)

* `server/src/modules/mocks/mockAnalysis.service.js` — `buildRecommendations()`
  now also queries published, non-broken `Resource` rows whose topic matches a
  weak topic, so mock results link into the curated catalogue. It skips the
  query when Mongo is disconnected, which also keeps DB-free tests fast.
* `client/src/features/dashboard/components/WeakTopicsCard.jsx` — the primary
  CTA now deep-links to `/app/resources?topic=<weakest>`; the quiz shortcut
  remains.

---

## 9. Assumptions

1. **JavaScript throughout**, consistent with Phases 1–5.
2. `PersonalResource` stays private and unmoderated; the directory is a
   separate public collection.
3. Levels are `beginner/intermediate/advanced`; pricing is
   `free/paid/freemium`; languages are the existing `PREFERRED_LANGUAGES`
   plus `agnostic`.
4. `approved` and `published` are distinct states; publishing is a separate
   click for the author (no auto-publish on approval).
5. Ratings and helpful votes share one reaction row but are independent;
   `helpful: null` withdraws only the vote.
6. A resource is flagged broken after **two consecutive** failed checks —
   single 404s are broken immediately in classification but still require the
   threshold to flip the persisted status, protecting against transient DNS
   blips.
7. The link checker is a CLI job, not an in-request loop; the staff batch
   endpoint is intentionally bounded to 100 links.
8. Analytics views dedupe per user per UTC day; starts/completions are
   self-reported client events and are therefore indicative, not proctored.
9. Creator profiles are public; analytics are private by default.
10. All timestamps are UTC; the client formats them in the viewer's locale.

---

## 10. Running the checker job

```bash
# .env
LINK_CHECK_BATCH=20
LINK_CHECK_FORCE=false
LINK_CHECK_TIMEOUT_MS=8000
LINK_CHECK_MAX_REDIRECTS=2
LINK_CHECK_FAILURE_THRESHOLD=2

npm run check:links
# cron: 17 3 * * * cd /app && npm run check:links >> /var/log/linkcheck.log 2>&1
```

The job prints one line per checked URL plus a summary
(`ok / broken / unknown / newlyFlagged`) and exits non-zero only on a fatal
configuration or database error — finding broken links is a successful run.

---

## 11. Next step

**Phase 7 — Student dashboard v2 + notifications**: real-time notifications
for review decisions, missed-task reminders and broken-link reports; a
notification bell in the top bar; weekly digest emails (optional); and
cross-module "continue learning" deep links. Then **Phase 8 — Admin dashboard**
(moderation queue across all content types, user management, platform
analytics, audit logs and scheduled jobs UI).
