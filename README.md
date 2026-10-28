# AlgoNest — DSA Preparation Platform (MERN monorepo)

A production-grade, phase-by-phase build of a DSA preparation platform: curated sheets,
quizzes, mock tests, adaptive plans, a resource directory and an RBAC admin area.

> **Status: Phase 8 complete.** Security hardening, bounded pagination, query efficiency, route-level error recovery and production deployment guidance are included. Phase 1 shipped authentication, onboarding, RBAC,
> the app shell, dark/light theming and the animated React Bits landing page.
> Phase 2 added **DSA Sheets**, Phase 3 **Quizzes**, Phase 4 the **Mock test
> engine**, Phase 5 **Adaptive Plans** + the student dashboard, and Phase 6 the
> **Resource directory** with creator analytics. Phase 7 adds a permission-scoped
> **Admin dashboard** for overview metrics, account management, unified content
> moderation, report handling, append-only audit logs and persistent feature
> flags. See [`docs/PHASE7.md`](./docs/PHASE7.md) for its API and RBAC rules.
> Earlier phase references: [`docs/PHASE6.md`](./docs/PHASE6.md) · [`docs/PHASE5.md`](./docs/PHASE5.md) ·
> [`docs/PHASE4.md`](./docs/PHASE4.md) · [`docs/PHASE3.md`](./docs/PHASE3.md) ·
> [`docs/PHASE2.md`](./docs/PHASE2.md) · [`docs/PHASE1-CODE.md`](./docs/PHASE1-CODE.md).

---

## 1. Folder structure

```
AlgoNest-/
├── package.json                     # npm workspaces + root scripts
├── docker-compose.yml               # MongoDB 7 for local development
├── README.md
├── docs/
│   ├── PHASE1-CODE.md               # complete Phase 1 source, file by file
│   ├── PHASE2.md                    # Phase 2 design + API reference
│   ├── PHASE2-CODE.md               # complete Phase 2 source, file by file
│   ├── PHASE3.md                    # Phase 3 design + API reference
│   ├── PHASE3-CODE.md               # complete Phase 3 source, file by file
│   ├── PHASE4.md                    # Phase 4 design + API reference
│   ├── PHASE4-CODE.md               # complete Phase 4 source, file by file
│   ├── PHASE5.md                    # Phase 5 design + API reference
│   ├── PHASE5-CODE.md               # complete Phase 5 source, file by file
│   ├── PHASE6.md                    # Phase 6 design + API reference
│   ├── PHASE6-CODE.md               # complete Phase 6 source, file by file
│   └── PHASE7.md                    # Phase 7 admin dashboard + RBAC/API reference
├── shared/                          # @algonest/shared — used by BOTH apps
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── constants.js             # roles, goals, permissions, statuses
│       └── schemas.js               # Zod contracts (single source of truth)
├── server/                          # Express + Mongoose (ESM, layered)
│   ├── package.json
│   ├── .env.example
│   ├── scripts/
│   │   ├── seedSuperAdmin.js        # idempotent Super Admin bootstrap
│   │   └── checkSyntax.js           # dependency-free syntax lint
│   ├── tests/                       # node:test — admin/RBAC + module coverage; no DB required
│   │   ├── app.test.js, contracts.test.js, auth.service.test.js
│   │   ├── sheets*.test.js         # detector, workflow, Zod, service, routes
│   │   ├── quizzes*.test.js        # 7 types, grading, import, versions, attempts
│   │   ├── mocks*.test.js          # marking, server clock, sections, analysis
│   │   ├── plans*.test.js          # scheduler, revisions, streak, dashboard
│   │   └── resources*.test.js      # links, duplicates, SSRF, reactions, analytics
│   └── scripts/checkResourceLinks.mjs  # nightly broken-link checker CLI
│   └── src/
│       ├── server.js                # bootstrap + graceful shutdown
│       ├── app.js                   # express app factory (security stack)
│       ├── config/{env,db}.js       # Zod-validated env, mongoose connection
│       ├── models/                  # User, RefreshSession + Phase-2/3 models
│       │   ├── {Sheet,SheetVersion,UserProgress}.js
│       │   ├── {SheetRating,SheetReport,PersonalResource}.js
│       │   ├── Problem.js           # embedded subdocument schema
│       │   ├── {Question,Quiz,QuizVersion,Attempt}.js
│       │   ├── {MockTest,MockVersion,MockAttempt}.js
│       │   ├── {Plan,PlanTask}.js
│       │   ├── {Resource,ResourceSave,ResourceReaction,ResourceReport,
│       │       ResourceEvent,CreatorProfile}.js
│       │   └── {AdminAuditLog,FeatureFlag}.js
│       ├── middlewares/             # auth/RBAC, validate, sanitize, security, error
│       ├── utils/                   # ApiError, response, asyncHandler, tokens, cookies
│       ├── routes/index.js          # /api/v1 health + module mount
│       └── modules/
│           ├── auth/                # routes → controller → service
│           ├── users/               # onboarding, profile, admin user management
│           ├── sheets/              # routes → controllers → services
│           │   ├── platformDetector.js  # pure URL → problem parser
│           │   ├── sheetWorkflow.js     # lifecycle state machine
│           │   ├── sheet.service.js     # CRUD, problems, versions, social
│           │   └── progress.service.js  # per-user progress + resources
│           └── quizzes/             # routes → controllers → services
│               ├── questionNormalizer.js # 7 types → one canonical shape
│               ├── questionGrader.js     # pure scoring + topic stats
│               ├── quizPresentation.js   # seeded, stable shuffle
│               ├── bulkImport.js         # pure JSON/CSV parser
│               ├── quizWorkflow.js       # lifecycle state machine
│               └── {question,quiz,attempt}.service.js
└── client/                          # React 19 + Vite 6 + Tailwind v4
    ├── package.json
    ├── vite.config.js               # 0.0.0.0 host, allowedHosts, /api proxy
    ├── eslint.config.js             # react-hooks + jsx-no-undef
    ├── tailwind (CSS-first via @theme inline in index.css)
    ├── index.html                   # pre-paint theme script
    ├── scripts/                     # smokeRender.mjs + RenderHarness.jsx
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── app/{queryClient,router}.js   # router = lazy-loaded feature chunks
        ├── lib/{apiClient,queryKeys,cn,navigation}.js
        ├── hooks/useClickOutside.js
        ├── store/themeStore.js      # Zustand + persist
        ├── components/
        │   ├── reactbits/           # 14 official JS+Tailwind components + licence
        │   ├── ui/                  # Button, Input, Select, Card, Alert, Modal…
        │   ├── layout/              # AppLayout, Sidebar, Topbar
        │   └── common/ErrorBoundary.jsx
        ├── features/
        │   ├── auth/                # api, hooks, store, guards, pages
        │   ├── landing/
        │   │   ├── pages/LandingPage.jsx
        │   │   └── components/MicroInteractions.jsx
        │   ├── home/pages/HomePage.jsx
        │   └── settings/pages/SettingsPage.jsx
        └── pages/{ModulePage,NotFoundPage}.jsx
```

---

## 2. Prerequisites

- Node.js **>= 20.11** (uses `node --watch`, `--env-file` is not required)
- MongoDB 7 (local install **or** Docker) — `npm run db:up` uses `docker-compose.yml`
- npm 10+ (workspaces)

---

## 3. Quick start

```bash
# 1. install all three workspaces from the repo root
npm install

# 2. create the server env and generate two DIFFERENT strong secrets
cp server/.env.example server/.env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # run twice
#    paste the outputs into JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
#    set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (>= 12 chars) too
cp client/.env.example client/.env   # optional; defaults already work

# 3. start MongoDB
npm run db:up                        # or use your own mongodb:// URI in server/.env

# 4. create the first Super Admin (idempotent)
npm run seed:admin
#    re-rotate that password later: npm run seed:admin -- --reset-password

# 5. run API (http://localhost:5000) + client (http://localhost:5173)
npm run dev
```

Production build: `npm run build` → `client/dist`. For production hosting, use the deployment guide below; do not run Vite's preview server as the public web host.

### Production deployment (MongoDB Atlas + Render/Railway + Vercel)

The recommended topology is **MongoDB Atlas** for persistence, **Render or Railway** for the Express API, and **Vercel** for the Vite client. Use HTTPS on both public hosts.

#### 1. MongoDB Atlas

1. Create an Atlas project, a production cluster, and a database user with a strong unique password. Grant only the database roles AlgoNest needs (read/write on the AlgoNest database); never use an Atlas account/admin credential in the app.
2. In **Network Access**, allow the API host's stable outbound IPs if available. If the PaaS has no stable egress IP, use Atlas's documented network access option for that provider; avoid `0.0.0.0/0` except as a temporary, time-limited setup measure.
3. Copy the **SRV connection string** (`mongodb+srv://…`) into the API host's `MONGODB_URI`; URL-encode reserved characters in the database password and include a database name, e.g. `...mongodb.net/algonest?retryWrites=true&w=majority`.
4. Keep the connection string only in the provider's secret/environment-variable store. Do not commit it or paste it into client/Vercel variables.

#### 2. Express API on Render or Railway

1. Create a Node web service from this repository. Use the repository root as the working directory so npm workspaces and `shared/` are available. Build/install with `npm install`; start with `npm start` (equivalent to `npm run start -w @algonest/server`). The server listens on `0.0.0.0` and the platform-provided `PORT`.
2. Configure these runtime variables in the host dashboard (values are examples/placeholders; generate real secrets):
   - `NODE_ENV=production`
   - `MONGODB_URI=<Atlas SRV URI>`
   - `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`: two different, random 48-byte secrets. Generate locally with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` twice. Never reuse the example values from `.env.example`.
   - `JWT_ISSUER=algonest-api`, `JWT_AUDIENCE=algonest-web` (or the values chosen consistently for your environment)
   - `CLIENT_URL=https://<your-vercel-domain>` and `CORS_ORIGINS=https://<your-vercel-domain>` (comma-separated exact origins only; no path or trailing slash)
   - `COOKIE_SAME_SITE=none` for the Vercel-to-API cross-site setup below; the server sets secure cookies in production. Use `lax` only when the client and API share a same-site domain/topology.
   - `TRUST_PROXY=1` when running behind the provider's trusted HTTPS proxy/load balancer; do not enable proxy trust on an unproxied public server.
   - Set `AUTH_RATE_LIMIT_MAX`, `RATE_LIMIT_MAX` and other operational values deliberately; default auth throttling is per source IP.
3. Add a health-check path of `/api/v1/health`. Confirm its response reports the database connected before onboarding users.
4. Run the one-time Super Admin seed as a controlled release/console job, not as an every-deploy command: provide `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL` and a unique `SEED_ADMIN_PASSWORD`, then run `npm run seed:admin`. Remove the seed password from the service environment after bootstrap. Verify the account and rotate credentials using your normal operational process.
5. Enable provider logs/alerts, backups and restore testing. Do not expose MongoDB to the public internet.

#### 3. React client on Vercel

1. Import the same repository in Vercel. Keep the project root at the repository root (the client imports the `@algonest/shared` workspace). Select Vite or configure: install command `npm install`, build command `npm run build`, output directory `client/dist`.
2. Set the build-time environment variable `VITE_API_URL=https://<your-api-host>/api/v1` (for example, the Render or Railway service's HTTPS origin plus `/api/v1`). This is public configuration, not a secret. Never set it to `localhost` in a production build.
3. Deploy, then set the exact assigned Vercel domain in the API's `CLIENT_URL` and `CORS_ORIGINS`. If using a Vercel preview domain, explicitly allow that exact preview origin only for a preview API; do not add broad wildcard CORS rules to production.
4. Verify login, refresh, logout and a protected API request in a browser. The API must allow credentials and the cross-site refresh cookie uses `SameSite=None; Secure`; browsers may block third-party cookies in some contexts. For the most reliable cookie behavior, use a same-site custom domain or a Vercel rewrite/proxy that forwards `/api/*` to the API, then use the relative `VITE_API_URL=/api/v1` and `COOKIE_SAME_SITE=lax`.
5. Redeploy the client after changing `VITE_API_URL`; Vite variables are baked into the static build. Keep all JWT, MongoDB and seed secrets exclusively on the server.

For local-only setup, retain `VITE_API_URL=/api/v1`; Vite proxies API requests using the server-side `VITE_PROXY_TARGET` from `client/.env`.

---

## 4. Environment variables (`server/.env`)

| Variable | Default / example | Purpose |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development \| test \| production` |
| `PORT` | `5000` | API port |
| `API_VERSION` | `v1` | also defines the refresh-cookie path |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/algonest` | required in prod |
| `CLIENT_URL` | `http://localhost:5173` | primary CORS origin |
| `CORS_ORIGINS` | empty | comma-separated extra origins (preview hosts) |
| `COOKIE_SAME_SITE` | `lax` | `lax \| strict \| none` |
| `COOKIE_DOMAIN` | empty | optional parent-domain cookie scope |
| `JWT_ACCESS_SECRET` | — | ≥ 32 chars, **required in prod** |
| `JWT_REFRESH_SECRET` | — | ≥ 32 chars, **must differ** from access secret |
| `ACCESS_TOKEN_TTL` | `15m` | short-lived access token |
| `REFRESH_TOKEN_TTL_DAYS` | `7` | cookie + DB session lifetime |
| `BCRYPT_ROUNDS` | `12` | 10–15 |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | `900000` / `300` | global limiter |
| `AUTH_RATE_LIMIT_MAX` | `10` | per source IP login/register failures per 15 min |
| `TRUST_PROXY` | `0` | set `1` behind a trusted reverse proxy |
| `SEED_ADMIN_*` | — | used **only** by the seed script |

The built-in Express rate-limit counters use an in-process memory store, so they protect a single API instance but are not shared across horizontally scaled instances or restarts. For multi-instance production, add a shared rate-limit store or enforce equivalent limits at the trusted API gateway; do not assume the per-process counter is a cluster-wide quota.

In development/test, a missing JWT secret is replaced by a **random per-process**
value — no secret is ever hard-coded. In production, missing/invalid config exits
the process immediately (fail fast).

Client variables (`client/.env`): `VITE_API_URL=/api/v1` (relative — never put
`localhost` in browser code) and `VITE_PROXY_TARGET=http://localhost:5000`
(server-side Vite proxy target only).

---

## 5. Phase 1 API (`/api/v1`)

Every response uses the same envelope:

```json
{ "success": true, "data": { }, "message": "OK", "errors": null }
```

Failures set `success: false`, `data: null` and `errors: [{ field, message, code }]`.
Pagination lives in `data.pagination`.

| Method | Path | Auth | Validation | Notes |
| --- | --- | --- | --- | --- |
| GET | `/health` | public liveness probe | — | db state + uptime; the only unauthenticated route |
| POST | `/auth/register` | rate-limited | `registerSchema` | creates a `student`; role never accepted from client |
| POST | `/auth/login` | rate-limited | `loginSchema` | bcrypt compare, lockout, streak |
| POST | `/auth/refresh` | httpOnly cookie | cookie presence | rotation + reuse detection |
| POST | `/auth/logout` | cookie (optional) | — | revokes current session, clears cookie |
| POST | `/auth/logout-all` | access token | — | revokes all sessions, bumps `sessionVersion` |
| GET | `/auth/me` | access token | — | fresh user from DB |
| GET | `/users/me` | access token | — | same as above (self-service alias) |
| PATCH | `/users/me` | access token | `updateProfileSchema` | name / language |
| PATCH | `/users/me/goal` | access token | `onboardingSchema` | sets goal, completes onboarding |
| GET | `/users` | `user:read` permission | `paginationSchema` | paginated admin list |
| PATCH | `/users/:id/role` | `user:manage` | params + role schema | cannot demote last super admin |
| PATCH | `/users/:id/status` | `user:manage` | params + status schema | suspending revokes all sessions |

RBAC roles: `student`, `content_editor`, `content_moderator`, `support_analyst`,
`super_admin`. Permissions (`user:read`, `user:manage`, `content:moderate`,
`analytics:read`) are mapped to roles in `@algonest/shared/constants`. Routes check
**permissions**, and the role is re-read from MongoDB on every request so a role
change or suspension takes effect immediately.

---

## 5a. Phase 2 API — DSA Sheets (`/api/v1`)

Every route below requires an access token **and** completed onboarding; each has
a Zod contract and, where relevant, a `content:moderate` permission check.
Full details: [`docs/PHASE2.md`](./docs/PHASE2.md).

| Method | Path | Validation | Notes |
| --- | --- | --- | --- |
| GET | `/sheets` | `sheetListQuerySchema` | paginated catalogue: `q, topic, difficulty, goal, platform, status, sort, mine, bookmarked` |
| POST | `/sheets` | `sheetCreateSchema` | creates a draft owned by the caller |
| POST | `/sheets/parse-links` | `parseLinksSchema` | preview parsed links (no DB write, no network fetch) |
| GET / PATCH | `/sheets/reports[*/:reportId]` | `reportsQuerySchema` / `resolveReportSchema` | staff moderation queue |
| GET / PATCH / DELETE | `/sheets/:id` | `sheetParamsSchema`, `sheetUpdateSchema` | published snapshot for students, working copy for managers |
| POST | `/sheets/:id/{submit,moderate,publish,revision,restore,clone}` | per-action Zod | full content lifecycle |
| GET | `/sheets/:id/versions[/:version]` | `versionParamsSchema` | immutable published problem sets |
| POST | `/sheets/:id/problems[/import]` | `addProblemsSchema` / `importProblemsSchema` | 1–100 items, URL-deduped |
| PATCH | `/sheets/:id/problems/order` | `reorderProblemsSchema` | must contain every id exactly once |
| PATCH / DELETE | `/sheets/:id/problems/:problemId` | `problemParamsSchema` | edit / remove |
| GET / PUT / DELETE | `/sheets/:id/rating[s]` | `ratingSchema` | rating + written review (upsert) |
| POST | `/sheets/:id/report` | `reportSchema` | one open report per user |
| GET / PUT | `/sheets/:id/progress[/:problemId]` | `progressQuerySchema` / `progressUpdateSchema` | status, notes, bookmark, confidence, time, revision + summary |
| GET / POST / PATCH / DELETE | `/personal-resources[/:id]` | `personalResource*Schema` | private per-user link library |

Design invariants: problems are **embedded** (ordered, always read with the
sheet, capped at 300); publishing creates an immutable `SheetVersion` so old
progress stays valid; **all** per-user state lives in `UserProgress` /
`PersonalResource`, never in `Sheet`.


---

## 5b. Phase 3 API — Quizzes (`/api/v1`)

Every route below requires an access token **and** completed onboarding; each has
a Zod contract and moderation additionally requires `content:moderate`.
Full details: [`docs/PHASE3.md`](./docs/PHASE3.md).

| Method | Path | Notes |
| --- | --- | --- |
| GET / POST | `/question-bank` | Paginated, author-scoped bank; create one question |
| POST | `/question-bank/parse-import` | **Pure** JSON/CSV preview — no DB write, no network fetch |
| GET / PATCH / DELETE | `/question-bank/:id` | Owner/staff only; delete refuses while linked |
| GET / POST | `/quizzes` | Paginated catalogue (`q, topic, difficulty, status, sort, mine`) / create draft |
| GET / PATCH / DELETE | `/quizzes/:id` | Students read the frozen published snapshot; archive |
| POST | `/quizzes/:id/{restore,revision,submit,moderate,publish}` | Full content lifecycle |
| GET | `/quizzes/:id/versions[/:version]` | Immutable snapshots; students get redacted questions |
| GET / POST | `/quizzes/:id/questions` | Editor list (paginated) / link bank questions |
| POST / PATCH | `/quizzes/:id/questions/{import,order}` | Bulk import / full-array reorder |
| DELETE | `/quizzes/:id/questions/:questionId` | Unlink + re-rank |
| GET / POST | `/quizzes/:id/attempts` | My attempts / start `full` or `incorrect` retry |
| GET | `/attempts/:id[/questions\|/result]` | Solver state, redacted questions, graded result |
| PATCH / POST | `/attempts/:id/{answers,submit,abandon}` | Debounced autosave, idempotent submit, release slot |

Design invariants: the bank is **referenced**, but `QuizVersion` **embeds a
frozen copy** of every question and setting so old attempts stay valid. Answer
keys and explanations are stripped by `redactQuestion()` and only returned by
the post-submit result route. `expiresAt` and `maxAttempts` are enforced on the
server; shuffle is seeded from the attempt id so reloads never reorder.

---

## 5c. Phase 4 API — Mock tests (`/api/v1`)

Every route below requires an access token **and** completed onboarding; each has
a Zod contract and moderation additionally requires `content:moderate`.
Full details: [`docs/PHASE4.md`](./docs/PHASE4.md).

| Method | Path | Notes |
| --- | --- | --- |
| GET / POST | `/mocks` | Paginated catalogue / create draft with sections |
| GET / PATCH / DELETE | `/mocks/:id` | Frozen published snapshot for students / update / archive |
| POST | `/mocks/:id/{restore,revision,submit,moderate,publish}` | Full content lifecycle |
| GET | `/mocks/:id/versions[/:version]` | Immutable snapshots (sections + marking, never answer keys) |
| GET / PUT | `/mocks/:id/sections/:sectionId/questions` | Editor question list / replace section refs |
| GET / POST | `/mocks/:id/attempts` | My attempts / start (server sets every deadline) |
| GET | `/mock-attempts/:id` | **Resume**: frozen state + server-computed remaining time |
| GET | `/mock-attempts/:id/questions` | Paginated, redacted, accessible sections only |
| PATCH / POST | `/mock-attempts/:id/{answers,heartbeat}` | Delta autosave / focus-window clock sync |
| POST | `/mock-attempts/:id/sections/:sectionId/submit` | Flush final answers, advance or finalise |
| POST / GET | `/mock-attempts/:id/{submit,result}` | Idempotent grading / full analysis |
| PUT / POST | `/mock-attempts/:id/{reasons,abandon}` | Wrong-answer reason tagging / release slot |

Design invariants: `MockVersion` embeds frozen sections, marking schemes and
answer keys so old attempts stay valid. **The server is the only clock** — all
deadlines are absolute server timestamps, `syncClock()` runs on every read and
write, and the client countdown is display-only. Wrong-answer reasons drive
weak-topic diagnosis and real DB-backed resource recommendations.

---

## 5d. Phase 5 API — Adaptive plans & dashboard (`/api/v1`)

Every route below requires an access token **and** completed onboarding; each
has a Zod contract and every query is scoped to the token's user id.
Full details: [`docs/PHASE5.md`](./docs/PHASE5.md).

| Method | Path | Notes |
| --- | --- | --- |
| GET / POST | `/plans` | Paginated plans / create + distribute tasks |
| GET | `/plans/active` · `/plans/content` | Active plan / published wizard content |
| GET / PATCH / DELETE | `/plans/:id` | Progress + streak + calendar / update settings / archive |
| POST | `/plans/:id/{regenerate,reschedule}` | Rebuild future tasks / move missed tasks + re-anchor revisions |
| GET / PUT / PATCH | `/plans/:id/tasks[/order\|/:taskId]` | Paginated tasks + calendar / reorder / status |
| GET | `/dashboard?date=&horizon=` | One aggregated student view |

Design invariants: dates are UTC `YYYY-MM-DD` keys. Sheets expand into their
published problems; `PlanTask` embeds a frozen title/URL/topic snapshot so
archived content never erases history. A deterministic `taskKey` plus a unique
index makes regeneration idempotent. Revisions appear at **+1/+7/+21 days**
and a mock every **14 days**. Overload is warned about, never silently dropped.

---

## 5e. Phase 6 API — Resource directory & creators (`/api/v1`)

Every route below requires an access token **and** completed onboarding; each
has a Zod contract. Moderation, report triage and link checks additionally
require `content:moderate`. Full details: [`docs/PHASE6.md`](./docs/PHASE6.md).

| Method | Path | Notes |
| --- | --- | --- |
| GET / POST | `/resources` | Filtered, paginated catalogue / create draft or submit |
| GET | `/resources/check-duplicate` | Pure canonical URL lookup — **never fetches** the link |
| GET | `/resources/saved` · `/resources/reports` | Saved catalogue / staff report queue |
| POST | `/resources/link-check/run` | Bounded on-demand SSRF-safe batch |
| GET / PATCH / DELETE | `/resources/:id` | Detail (records a deduped view) / edit / archive |
| POST | `/resources/:id/{submit,moderate,publish,revision,restore,check-link}` | Full lifecycle |
| PUT / DELETE | `/resources/:id/save` | Idempotent bookmark |
| PUT / GET | `/resources/:id/rating[/s]` | Upsert star review / paginated reviews |
| PUT / POST | `/resources/:id/{feedback,report,events}` | Helpful vote / report / analytics event |
| GET / PUT | `/creators[/me]` | Creator list / own profile (lazily created) |
| GET | `/creators/me/analytics` · `/creators/:id[/analytics]` | Own analytics / public profile / staff analytics |

`npm run check:links` runs the nightly broken-link job in a **separate
process**. It resolves DNS and rejects all private ranges before opening a
socket, re-validates every redirect, and needs two consecutive failures before
flagging a link broken. Configure it via `LINK_CHECK_*` env vars (see
`server/.env.example`).

---

## 6. Security decisions (Phase 1)

- **JWT access token** (15 min, HS256, `iss`/`aud`/`jti`) kept in **memory only** on
  the client — never in `localStorage`. **Refresh token** in an `httpOnly`,
  `sameSite`, `secure`-in-prod cookie scoped to `/api/v1/auth`.
- **Rotating refresh sessions**: only a SHA-256 hash is stored in MongoDB; the old
  session is claimed atomically (`findOneAndUpdate`), and replay of a rotated token
  revokes the entire token family.
- **bcrypt** hashing (12 rounds), constant-work comparison for unknown emails,
  5-attempt account lockout, generic "Invalid email or password" response.
- **helmet**, **cors allowlist**, **express-rate-limit** (global + auth + refresh),
  **express-mongo-sanitize** + a control-character/prototype-pollution sanitizer,
  256 KB JSON body limit, `x-powered-by` disabled.
- **Zod `.strict()`** contracts on both sides: unknown keys (e.g. `role:
  super_admin` on register) are rejected and stripped, preventing mass assignment.
- Central error handler normalises Mongoose, Zod, JWT and body-parser failures;
  internal details never leave production responses.
- Correlation `X-Request-Id` on every request; Phase 7 audit entries store it with actor, target and IP metadata.

---

## 7. React Bits setup

Fourteen official **JS + Tailwind** components are vendored under
`client/src/components/reactbits/` (see that folder's `README.md` and `LICENSE.md`),
so the project builds without access to reactbits.dev. Provenance:
`DavidHDev/react-bits` commit `e12c2219`, MIT + Commons Clause.

- **Base visuals:** `GridMotion`, `BlurText`, `ShinyText`, `GradientText`, `StarBorder`, `SpotlightCard`
- **Hover / pointer effects:** `GlareHover` (feature cards), `Magnet` (CTAs), `ClickSpark` (hero + 404), `PixelTransition` (hover-reveal tile)
- **Animated components:** `AnimatedContent` (scroll/mount reveals), `CountUp` (hero stats, replay on hover), `DecryptedText` (hover-to-decode taglines), `GlitchText` (404)

Plain Tailwind hover polish is also applied to buttons, sidebar links, stat cards,
step cards and landing links. All effects are decorative: content stays readable
and keyboard reachable without hovering, and `prefers-reduced-motion` is honoured.

Official installation docs: <https://reactbits.dev/get-started/installation>.
Components are copied into your repo as source you own — there is no runtime
npm package. The suffix selects the variant; this project uses **JS-TW**
(JavaScript + Tailwind):

```bash
cd client
npx shadcn@latest add @react-bits/BlurText-JS-TW

# or the equivalent jsrepo form
npx jsrepo@latest add https://reactbits.dev/r/BlurText-JS-TW
```

Runtime dependencies are declared in `client/package.json`: `motion`
(`motion/react`) for `BlurText`, `CountUp` and `DecryptedText`, and `gsap`
(+ `gsap/ScrollTrigger`) for `AnimatedContent`. Everything else is dependency-free.
React Bits is used **only** on the landing page, auth-shell kickers, the home
header/cards and the 404 empty state; tables, forms and the admin area use plain
Tailwind components. All components honour `prefers-reduced-motion`.

Tailwind v4 is configured CSS-first (`@import "tailwindcss"`, `@theme inline`,
`@custom-variant dark`) — there is intentionally no `tailwind.config.js`.

---

## 8. How to run / test

```bash
npm test                 # 237 node:test server tests + 30 client render smoke tests
                         # (API envelope, validation, RBAC, JWT, auth services,
                         #  platform detection, lifecycle, versioning, progress,
                         #  7 question types, grading, JSON/CSV import, attempts,
                         #  negative marking, sectional timers, palette states,
                         #  result analysis, plan scheduling, streak, dashboard,
                         #  duplicate/SSRF link checks, reactions, creator
                         #  analytics, and render-time crashes on every page)
npm run lint             # server syntax check + client ESLint
                         # (react-hooks + react/jsx-no-undef)
npm run build            # production Vite build (client/dist)
npm run dev              # API + client together
npm run seed:admin       # create/promote Super Admin
```

`client/scripts/smokeRender.mjs` server-renders every page through Vite's SSR
loader. It caught a missing `GlareHover` import that neither `vite build` nor
plain ESLint could see — keep it in CI alongside `eslint-plugin-react`'s
`jsx-no-undef` rule.

Feature pages are **lazy-loaded** in `src/app/router.jsx`, so `gsap`/`motion`
and the React Bits sources stay out of the entry chunk: `/app` loads ~117 kB
gzip of JavaScript, while the animation-heavy landing route pulls the extra
chunks only when visited.

Manual smoke test with a running stack:

```bash
curl -i http://localhost:5000/api/v1/health
curl -i -X POST http://localhost:5000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"StrongPass1!"}'
# → 201, Set-Cookie: ag_refresh=...; HttpOnly; Path=/api/v1/auth
# Then walk /register → /onboarding → /app/sheets in the browser.
```

Phase-2 manual flow: **New sheet** → save draft → add problems (or paste a list
of judge links) → drag/keyboard reorder → **Submit for review** → sign in as a
moderator → **Approve** → **Publish** → open as a student → set status, notes,
bookmark and confidence → rate/review → clone.

Phase-3 manual flow: **New quiz** → tune the eight settings → **Add question**
(pick any of seven types) or **Bulk import** (paste JSON/CSV → preview → import)
or **From bank** → drag/keyboard reorder → **Submit for review** → moderator
**Approve** → **Publish** (creates an immutable version) → **Start quiz** →
answer, mark for review, autosave → **Finish & submit** → read score, topic-wise
performance and explanations → **Retry incorrect only**.

Phase-6 manual flow: **Submit resource** → paste a link (the form checks for
duplicates live) → choose type, topic, level, language and free/paid → **Submit
for review** → moderator **Approve** → author **Publish** → learners filter the
catalogue, **Save**, **Open** (records a start), star-rate, vote helpful/not
helpful and **Mark complete** → creator page shows views/saves/starts/
completions and a conversion funnel. Broken links are reported by users or
flagged by `npm run check:links`; the report queue is triaged by staff.

Phase-5 manual flow: **New plan** → pick a goal, date window, daily minutes
and rest days → choose published sheets/quizzes/mocks → **Create plan**
(generates the whole calendar with revisions and mocks) → open **/app** to see
today's checklist, streak, weak topics, upcoming mock, pending revisions and
"continue where you left off" → tick tasks → on a missed day use **Reschedule
missed tasks** or **Regenerate** → watch overload warnings before adding more
content.

Phase-4 manual flow: **New mock** → define sections (duration, correct/negative
marks, cut-off) and timer mode → save draft → **Choose questions** per section
→ **Submit for review** → moderator **Approve** → **Publish** → **Start mock** →
work through a section with the five-state palette, mark for review, autosave →
**Finish section** (or let the server auto-advance on timeout) → **Submit test**
→ read score, accuracy, sectional cut-offs, difficulty/topic breakdowns, time
per question and weak topics → tag wrong-answer reasons → follow the
recommended resources. Disconnect at any point and reload to resume — the
server clock never pauses. Without MongoDB, data routes return a clean `503`
from `dbGuard` while `/health` and the client keep working.

The server tests intentionally need **no MongoDB** (models are stubbed at the
service layer); a live DB is only needed for the manual end-to-end flow.

**Troubleshooting “Something broke on this screen” / `Cannot read properties of
null (reading 'useCallback')`:** both mean the browser is mixing two Vite
dependency generations — one `chunk-*.js?v=OLD` (with its own React) and one
`?v=NEW`. Two React copies make the hooks dispatcher `null`, so zustand and
every hook fail. The dev config now prevents it three ways: `optimizeDeps.force`
rebuilds one consistent dep graph on every start, `resolve.dedupe` pins a single
React, and a `no-store` header stops the browser/proxy caching stale modules.
`ErrorBoundary` (plus a pre-React guard in `index.html`) also reloads once,
rate-limited, on stale-chunk or invalid-hook errors, and shows the real stack
trace in dev with a **Hard reload** button. Every React Bits component is wrapped
in `PolishBoundary`, so a failing hover effect degrades to static content
instead of blanking the route. If it still appears, hard-reload the tab
(Ctrl+Shift+R); as a last resort clear `client/node_modules/.vite` and restart
`npm run dev`.

---

## 9. Assumptions made in Phase 1

1. **JavaScript (not TypeScript)** is used consistently across all workspaces.
2. **UTC calendar days** for streaks — `User` has no timezone field yet; Phase 5
   can add one without changing the API.
3. `preferredLanguage` defaults to `javascript` during onboarding but is a first-
   class field that can be changed in Settings.
4. Onboarding is **mandatory** before entering `/app`; it is a single goal + language
   step. Changeable later in Settings.
5. The unified Admin dashboard arrived in Phase 7. Existing roles map to
   permission scopes; user/role/status changes and feature-flag management are
   Super Admin-only, while moderation and analytics are assigned by role.
6. Module routes (Sheets → Community) exist with honest "coming in a later phase"
   empty states. No fake data or stub service logic.
7. Published-content versioning and per-user progress collections now exist in
   Phase 2 (`SheetVersion`, `UserProgress`), Phase 3 (`QuizVersion`, `Attempt`)
   Phase 4 (`MockVersion`, `MockAttempt`), Phase 5 (`Plan`, `PlanTask`) and
   Phase 6 (`Resource`, `ResourceSave`, `ResourceReaction`, `ResourceReport`,
   `ResourceEvent`, `CreatorProfile`). See `docs/PHASE2.md` §2,
   `docs/PHASE3.md` §2, `docs/PHASE4.md` §2, `docs/PHASE5.md` §2 and
   `docs/PHASE6.md` §2 for the embedding, snapshot and separation decisions.
8. In production the client and API should share an origin (or use
   `COOKIE_SAME_SITE=none` + HTTPS); the Vite dev proxy reproduces that locally.

---

## 10. Next phase

**Phase 9 — Notifications + dashboard v2**: notifications for review decisions,
missed-task reminders and broken-link reports, a notification bell in the top
bar, and cross-module "continue learning" deep links. Then consider Community
and a scheduled-jobs administration screen.
