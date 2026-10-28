# AlgoNest — Phase 1 complete source code

> Auto-generated from the working tree on 2026-10-28. Every first-party file below exists verbatim in the repository.
> The fourteen vendored third-party React Bits component sources (~5k lines) and their licence live in `client/src/components/reactbits/` and are not duplicated here.

## Index

**Root / workspace** (3 files)

- [`.gitignore`](#-gitignore)
- [`docker-compose.yml`](#docker-compose-yml)
- [`package.json`](#package-json)

**Shared contracts (@algonest/shared)** (4 files)

- [`shared/package.json`](#shared-package-json)
- [`shared/src/constants.js`](#shared-src-constants-js)
- [`shared/src/index.js`](#shared-src-index-js)
- [`shared/src/schemas.js`](#shared-src-schemas-js)

**Server — config, utils, models, middleware, tests** (31 files)

- [`server/.env.example`](#server-env-example)
- [`server/package.json`](#server-package-json)
- [`server/scripts/checkSyntax.js`](#server-scripts-checksyntax-js)
- [`server/scripts/seedSuperAdmin.js`](#server-scripts-seedsuperadmin-js)
- [`server/src/app.js`](#server-src-app-js)
- [`server/src/config/db.js`](#server-src-config-db-js)
- [`server/src/config/env.js`](#server-src-config-env-js)
- [`server/src/middlewares/auth.middleware.js`](#server-src-middlewares-auth-middleware-js)
- [`server/src/middlewares/dbGuard.middleware.js`](#server-src-middlewares-dbguard-middleware-js)
- [`server/src/middlewares/error.middleware.js`](#server-src-middlewares-error-middleware-js)
- [`server/src/middlewares/sanitize.middleware.js`](#server-src-middlewares-sanitize-middleware-js)
- [`server/src/middlewares/security.middleware.js`](#server-src-middlewares-security-middleware-js)
- [`server/src/middlewares/validate.middleware.js`](#server-src-middlewares-validate-middleware-js)
- [`server/src/models/RefreshSession.js`](#server-src-models-refreshsession-js)
- [`server/src/models/User.js`](#server-src-models-user-js)
- [`server/src/modules/auth/auth.controller.js`](#server-src-modules-auth-auth-controller-js)
- [`server/src/modules/auth/auth.routes.js`](#server-src-modules-auth-auth-routes-js)
- [`server/src/modules/auth/auth.service.js`](#server-src-modules-auth-auth-service-js)
- [`server/src/modules/users/user.controller.js`](#server-src-modules-users-user-controller-js)
- [`server/src/modules/users/user.routes.js`](#server-src-modules-users-user-routes-js)
- [`server/src/modules/users/user.service.js`](#server-src-modules-users-user-service-js)
- [`server/src/routes/index.js`](#server-src-routes-index-js)
- [`server/src/server.js`](#server-src-server-js)
- [`server/src/utils/ApiError.js`](#server-src-utils-apierror-js)
- [`server/src/utils/asyncHandler.js`](#server-src-utils-asynchandler-js)
- [`server/src/utils/cookies.js`](#server-src-utils-cookies-js)
- [`server/src/utils/response.js`](#server-src-utils-response-js)
- [`server/src/utils/tokens.js`](#server-src-utils-tokens-js)
- [`server/tests/app.test.js`](#server-tests-app-test-js)
- [`server/tests/auth.service.test.js`](#server-tests-auth-service-test-js)
- [`server/tests/contracts.test.js`](#server-tests-contracts-test-js)

**Client — Vite, Tailwind, features, components** (52 files)

- [`client/.env.example`](#client-env-example)
- [`client/eslint.config.js`](#client-eslint-config-js)
- [`client/index.html`](#client-index-html)
- [`client/package.json`](#client-package-json)
- [`client/scripts/RenderHarness.jsx`](#client-scripts-renderharness-jsx)
- [`client/scripts/smokeRender.mjs`](#client-scripts-smokerender-mjs)
- [`client/src/App.jsx`](#client-src-app-jsx)
- [`client/src/app/queryClient.js`](#client-src-app-queryclient-js)
- [`client/src/app/router.jsx`](#client-src-app-router-jsx)
- [`client/src/components/common/ErrorBoundary.jsx`](#client-src-components-common-errorboundary-jsx)
- [`client/src/components/common/PolishBoundary.jsx`](#client-src-components-common-polishboundary-jsx)
- [`client/src/components/layout/AppLayout.jsx`](#client-src-components-layout-applayout-jsx)
- [`client/src/components/layout/Sidebar.jsx`](#client-src-components-layout-sidebar-jsx)
- [`client/src/components/layout/Topbar.jsx`](#client-src-components-layout-topbar-jsx)
- [`client/src/components/reactbits/index.js`](#client-src-components-reactbits-index-js)
- [`client/src/components/reactbits/safe.js`](#client-src-components-reactbits-safe-js)
- [`client/src/components/ui/Alert.jsx`](#client-src-components-ui-alert-jsx)
- [`client/src/components/ui/Badge.jsx`](#client-src-components-ui-badge-jsx)
- [`client/src/components/ui/Button.jsx`](#client-src-components-ui-button-jsx)
- [`client/src/components/ui/Card.jsx`](#client-src-components-ui-card-jsx)
- [`client/src/components/ui/EmptyState.jsx`](#client-src-components-ui-emptystate-jsx)
- [`client/src/components/ui/Input.jsx`](#client-src-components-ui-input-jsx)
- [`client/src/components/ui/Logo.jsx`](#client-src-components-ui-logo-jsx)
- [`client/src/components/ui/Select.jsx`](#client-src-components-ui-select-jsx)
- [`client/src/components/ui/Skeleton.jsx`](#client-src-components-ui-skeleton-jsx)
- [`client/src/components/ui/Spinner.jsx`](#client-src-components-ui-spinner-jsx)
- [`client/src/components/ui/ThemeToggle.jsx`](#client-src-components-ui-themetoggle-jsx)
- [`client/src/features/auth/api/authApi.js`](#client-src-features-auth-api-authapi-js)
- [`client/src/features/auth/components/AuthGate.jsx`](#client-src-features-auth-components-authgate-jsx)
- [`client/src/features/auth/components/AuthShell.jsx`](#client-src-features-auth-components-authshell-jsx)
- [`client/src/features/auth/components/GuestRoute.jsx`](#client-src-features-auth-components-guestroute-jsx)
- [`client/src/features/auth/components/ProtectedRoute.jsx`](#client-src-features-auth-components-protectedroute-jsx)
- [`client/src/features/auth/hooks/useAuth.js`](#client-src-features-auth-hooks-useauth-js)
- [`client/src/features/auth/pages/LoginPage.jsx`](#client-src-features-auth-pages-loginpage-jsx)
- [`client/src/features/auth/pages/OnboardingPage.jsx`](#client-src-features-auth-pages-onboardingpage-jsx)
- [`client/src/features/auth/pages/RegisterPage.jsx`](#client-src-features-auth-pages-registerpage-jsx)
- [`client/src/features/auth/store/authStore.js`](#client-src-features-auth-store-authstore-js)
- [`client/src/features/home/pages/HomePage.jsx`](#client-src-features-home-pages-homepage-jsx)
- [`client/src/features/landing/components/MicroInteractions.jsx`](#client-src-features-landing-components-microinteractions-jsx)
- [`client/src/features/landing/pages/LandingPage.jsx`](#client-src-features-landing-pages-landingpage-jsx)
- [`client/src/features/settings/pages/SettingsPage.jsx`](#client-src-features-settings-pages-settingspage-jsx)
- [`client/src/hooks/useClickOutside.js`](#client-src-hooks-useclickoutside-js)
- [`client/src/index.css`](#client-src-index-css)
- [`client/src/lib/apiClient.js`](#client-src-lib-apiclient-js)
- [`client/src/lib/cn.js`](#client-src-lib-cn-js)
- [`client/src/lib/navigation.js`](#client-src-lib-navigation-js)
- [`client/src/lib/queryKeys.js`](#client-src-lib-querykeys-js)
- [`client/src/main.jsx`](#client-src-main-jsx)
- [`client/src/pages/ModulePage.jsx`](#client-src-pages-modulepage-jsx)
- [`client/src/pages/NotFoundPage.jsx`](#client-src-pages-notfoundpage-jsx)
- [`client/src/store/themeStore.js`](#client-src-store-themestore-js)
- [`client/vite.config.js`](#client-vite-config-js)


---

# Root / workspace

## `.gitignore`

```text
# dependencies / build output
node_modules/
dist/
build/
coverage/
.vite/
*.tsbuildinfo

# secrets and local config
.env
.env.*
!.env.example
*.pem
*.key

# logs / caches / editors
logs/
*.log
npm-debug.log*
.cache/
.DS_Store
.idea/
.vscode/*
!.vscode/extensions.json

# test / tooling
.eslintcache
```

## `docker-compose.yml`

```yaml
services:
  mongo:
    image: mongo:7
    container_name: algonest-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: algonest
    volumes:
      - algonest-mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

volumes:
  algonest-mongo-data:
```

## `package.json`

```json
{
  "name": "algonest",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "AlgoNest — production-grade DSA preparation platform (MERN monorepo)",
  "workspaces": ["shared", "server", "client"],
  "engines": {
    "node": ">=20.11.0"
  },
  "scripts": {
    "dev": "concurrently -n server,client -c cyan,magenta \"npm:dev:server\" \"npm:dev:client\"",
    "dev:server": "npm run dev -w @algonest/server",
    "dev:client": "npm run dev -w @algonest/client",
    "build": "npm run build -w @algonest/client",
    "preview": "npm run preview -w @algonest/client",
    "start": "npm run start -w @algonest/server",
    "seed:admin": "npm run seed:admin -w @algonest/server",
    "test": "npm run test -w @algonest/server && npm run test:render -w @algonest/client",
    "lint": "npm run lint -w @algonest/server && npm run lint -w @algonest/client",
    "db:up": "docker compose up -d mongo",
    "db:down": "docker compose down"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
```

---

# Shared contracts (@algonest/shared)

## `shared/package.json`

```json
{
  "name": "@algonest/shared",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Framework-agnostic constants and Zod contracts shared by server and client",
  "exports": {
    ".": "./src/index.js",
    "./constants": "./src/constants.js",
    "./schemas": "./src/schemas.js"
  },
  "dependencies": {
    "zod": "^3.25.76"
  }
}
```

## `shared/src/constants.js`

```js
/**
 * Shared domain vocabulary. Imported by BOTH the Express server and the Vite
 * client so a role/goal string can never drift between the two runtimes.
 * Keep this file free of Node and browser APIs.
 */

export const ROLES = Object.freeze({
  STUDENT: 'student',
  CONTENT_EDITOR: 'content_editor',
  CONTENT_MODERATOR: 'content_moderator',
  SUPPORT_ANALYST: 'support_analyst',
  SUPER_ADMIN: 'super_admin',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

export const ROLE_LABELS = Object.freeze({
  [ROLES.STUDENT]: 'Student',
  [ROLES.CONTENT_EDITOR]: 'Content Editor',
  [ROLES.CONTENT_MODERATOR]: 'Content Moderator',
  [ROLES.SUPPORT_ANALYST]: 'Support / Analyst',
  [ROLES.SUPER_ADMIN]: 'Super Admin',
});

/** Fine-grained permissions. Roles map to permissions, routes check permissions. */
export const PERMISSIONS = Object.freeze({
  USER_READ: 'user:read',
  USER_MANAGE: 'user:manage',
  CONTENT_MODERATE: 'content:moderate',
  ANALYTICS_READ: 'analytics:read',
});

export const PERMISSION_VALUES = Object.freeze(Object.values(PERMISSIONS));

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.STUDENT]: [],
  [ROLES.CONTENT_EDITOR]: [PERMISSIONS.CONTENT_MODERATE],
  [ROLES.CONTENT_MODERATOR]: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ],
  [ROLES.SUPPORT_ANALYST]: [PERMISSIONS.USER_READ, PERMISSIONS.ANALYTICS_READ],
  [ROLES.SUPER_ADMIN]: PERMISSION_VALUES,
});

export const GOALS = Object.freeze({
  DSA_BEGINNER: 'dsa_beginner',
  PLACEMENT_PREP: 'placement_prep',
  LEETCODE: 'leetcode',
  COMPETITIVE_PROGRAMMING: 'competitive_programming',
  INTERVIEW_60_DAYS: 'interview_60_days',
});

export const GOAL_VALUES = Object.freeze(Object.values(GOALS));

export const GOAL_OPTIONS = Object.freeze([
  { value: GOALS.DSA_BEGINNER, label: 'DSA Beginner', description: 'Start from arrays, loops and Big-O.', icon: 'sprout' },
  { value: GOALS.PLACEMENT_PREP, label: 'Placement Prep', description: 'Company-wise sheets, aptitude and interviews.', icon: 'briefcase' },
  { value: GOALS.LEETCODE, label: 'LeetCode Grind', description: 'Daily problems, patterns and timed contests.', icon: 'code' },
  { value: GOALS.COMPETITIVE_PROGRAMMING, label: 'Competitive Programming', description: 'Math, graphs, DP and contest strategy.', icon: 'trophy' },
  { value: GOALS.INTERVIEW_60_DAYS, label: 'Interview in 60 Days', description: 'A strict, scheduled 60-day revision plan.', icon: 'calendar' },
]);

export const PREFERRED_LANGUAGES = Object.freeze([
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
]);

export const PREFERRED_LANGUAGE_LABELS = Object.freeze({
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
});

export const USER_STATUSES = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
});

export const USER_STATUS_VALUES = Object.freeze(Object.values(USER_STATUSES));

/** Content lifecycle for sheets/quizzes/resources (used from Phase 2 onward). */
export const CONTENT_STATUSES = Object.freeze({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  CHANGES_REQUESTED: 'changes_requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
});

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});
```

## `shared/src/index.js`

```js
export * from './constants.js';
export * from './schemas.js';
```

## `shared/src/schemas.js`

```js
import { z } from 'zod';
import {
  GOAL_VALUES,
  PAGINATION,
  PREFERRED_LANGUAGES,
  ROLE_VALUES,
  USER_STATUS_VALUES,
} from './constants.js';

/**
 * The single source of truth for request shapes. The server validates with
 * these schemas; the client validates forms with the same schemas before it
 * ever sends a request (so error copy stays identical).
 */

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(60, 'Name must be at most 60 characters')
  .regex(/^[\p{L}\p{M} .'-]+$/u, 'Name contains unsupported characters');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, 'Email is required')
  .max(254, 'Email is too long')
  .email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Add at least one lowercase letter')
  .regex(/[A-Z]/, 'Add at least one uppercase letter')
  .regex(/[0-9]/, 'Add at least one number')
  .regex(/[^A-Za-z0-9]/, 'Add at least one symbol');

export const preferredLanguageSchema = z.enum(PREFERRED_LANGUAGES);

export const goalSchema = z.enum(GOAL_VALUES);

/** POST /auth/register */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

/** POST /auth/login — deliberately do not enforce strength rules on sign-in. */
export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required').max(128),
  })
  .strict();

/** PATCH /users/me/goal — onboarding. */
export const onboardingSchema = z
  .object({
    goal: goalSchema,
    preferredLanguage: preferredLanguageSchema.default('javascript'),
  })
  .strict();

/** PATCH /users/me */
export const updateProfileSchema = z
  .object({
    name: nameSchema.optional(),
    preferredLanguage: preferredLanguageSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

/** Query contract for every paginated list endpoint. */
export const paginationSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
    q: z.string().trim().max(80).optional(),
    role: z.enum(ROLE_VALUES).optional(),
    status: z.enum(USER_STATUS_VALUES).optional(),
  })
  .strict();

export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const userParamsSchema = z.object({ id: mongoIdSchema }).strict();

export const updateUserRoleSchema = z
  .object({ role: z.enum(ROLE_VALUES) })
  .strict();

export const updateUserStatusSchema = z
  .object({ status: z.enum(USER_STATUS_VALUES) })
  .strict();

/** Flatten Zod issues into the API's `errors` array: [{ field, message, code }]. */
export function formatZodIssues(issues) {
  return issues.map((issue) => ({
    field: issue.path.join('.') || '_',
    message: issue.message,
    code: issue.code,
  }));
}

/** Client-side helper: returns a { field: message } map for form rendering. */
export function zodFieldErrors(error) {
  if (!error?.issues) return {};
  const result = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
```

---

# Server — config, utils, models, middleware, tests

## `server/.env.example`

```bash
# ── Runtime ────────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000
API_VERSION=v1
# 1 = trust the first proxy hop (needed when deployed behind nginx / a PaaS LB)
TRUST_PROXY=0

# ── Database ────────────────────────────────────────────────────────────────
MONGODB_URI=mongodb://127.0.0.1:27017/algonest

# ── CORS / cookies ──────────────────────────────────────────────────────────
CLIENT_URL=http://localhost:5173
# Comma-separated extra origins, e.g. https://5173-xxxxx.e2b.app
CORS_ORIGINS=
# lax | strict | none  (use "none" + HTTPS only for genuinely cross-site setups)
COOKIE_SAME_SITE=lax
# Optional: scope the refresh cookie to a parent domain, e.g. .example.com
COOKIE_DOMAIN=

# ── JWT / hashing ───────────────────────────────────────────────────────────
# Generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_ACCESS_SECRET=replace-with-a-long-random-64-plus-character-string
JWT_REFRESH_SECRET=replace-with-a-DIFFERENT-long-random-string
JWT_ISSUER=algonest-api
JWT_AUDIENCE=algonest-web
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7
BCRYPT_ROUNDS=12

# ── Rate limiting ───────────────────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=10

# ── Seed script only (never used by the running server) ─────────────────────
SEED_ADMIN_NAME=Platform Owner
SEED_ADMIN_EMAIL=owner@example.com
SEED_ADMIN_PASSWORD=
```

## `server/package.json`

```json
{
  "name": "@algonest/server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "src/server.js",
  "engines": {
    "node": ">=20.11.0"
  },
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "seed:admin": "node scripts/seedSuperAdmin.js",
    "test": "node --test tests/*.test.js",
    "lint": "node scripts/checkSyntax.js"
  },
  "dependencies": {
    "@algonest/shared": "*",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.22.3",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^7.5.1",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.24.7",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "supertest": "^7.3.1"
  }
}
```

## `server/scripts/checkSyntax.js`

```js
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Dependency-free syntax gate for every JS file in the Node workspaces. */
const here = path.dirname(fileURLToPath(import.meta.url));
const roots = [
  path.resolve(here, '../src'),
  path.resolve(here, '../scripts'),
  path.resolve(here, '../tests'),
  path.resolve(here, '../../shared/src'),
];

function* walk(directory) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith('.js')) yield full;
  }
}

let checked = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Syntax error in ${path.relative(process.cwd(), file)}\n${error.stderr?.toString() ?? error.message}`);
      process.exitCode = 1;
    }
    checked += 1;
  }
}

// eslint-disable-next-line no-console
console.info(`[lint] syntax OK for ${checked} JavaScript files`);
```

## `server/scripts/seedSuperAdmin.js`

```js
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { z } from 'zod';
import { emailSchema } from '@algonest/shared';
import { ROLES, USER_STATUSES } from '@algonest/shared/constants';
import { User } from '../src/models/User.js';

dotenv.config();

/**
 * Idempotent Super Admin bootstrap.
 *   node scripts/seedSuperAdmin.js                 # create or promote
 *   node scripts/seedSuperAdmin.js --reset-password  # also rotate the password
 * Credentials come ONLY from the environment — no password is hard-coded.
 */
const configSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  SEED_ADMIN_NAME: z.string().trim().min(2).max(60).default('Platform Owner'),
  SEED_ADMIN_EMAIL: emailSchema,
  SEED_ADMIN_PASSWORD: z
    .string()
    .min(12, 'SEED_ADMIN_PASSWORD must be at least 12 characters')
    .max(128),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
});

const parsed = configSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[seed] Invalid configuration (values are never printed):');
  for (const issue of parsed.error.issues) {
    // eslint-disable-next-line no-console
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

const config = parsed.data;
const resetPassword = process.argv.includes('--reset-password');

async function run() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });

  const email = config.SEED_ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email }).select('+passwordHash');
  const passwordHash = await bcrypt.hash(config.SEED_ADMIN_PASSWORD, config.BCRYPT_ROUNDS);

  if (existing) {
    existing.role = ROLES.SUPER_ADMIN;
    existing.status = USER_STATUSES.ACTIVE;
    existing.onboardingCompleted = true;
    if (resetPassword) existing.passwordHash = passwordHash;
    await existing.save();
    // eslint-disable-next-line no-console
    console.info(`[seed] promoted existing account to Super Admin: ${email} (id=${existing.id})`);
    // eslint-disable-next-line no-console
    console.info(`[seed] password ${resetPassword ? 'was reset from SEED_ADMIN_PASSWORD' : 'was left unchanged'}`);
  } else {
    const created = await User.create({
      name: config.SEED_ADMIN_NAME,
      email,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      status: USER_STATUSES.ACTIVE,
      onboardingCompleted: true,
      preferredLanguage: 'javascript',
      streak: { current: 0, longest: 0, lastActiveDate: null },
    });
    // eslint-disable-next-line no-console
    console.info(`[seed] Super Admin created: ${email} (id=${created.id})`);
  }
}

try {
  await run();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
```

## `server/src/app.js`

```js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { sanitizeInput } from './middlewares/sanitize.middleware.js';
import { apiLimiter, requestContext } from './middlewares/security.middleware.js';
import ApiError from './utils/ApiError.js';
import routes from './routes/index.js';

/** Preview/dev hosts served by Arena look like https://5173-abc123.e2b.app. */
const isPreviewOrigin = (origin) => !env.isProduction && /^https:\/\/[\w-]+\.e2b\.app$/i.test(origin);

function corsOrigin(origin, callback) {
  // No Origin header = same-origin request, curl, or a health probe.
  if (!origin) return callback(null, true);
  if (env.corsOrigins.includes(origin) || isPreviewOrigin(origin)) return callback(null, true);
  return callback(ApiError.forbidden('Origin is not allowed by CORS'));
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  if (env.TRUST_PROXY > 0) app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestContext);
  app.use(
    helmet({
      // JSON-only API: no inline scripts ever need to run.
      contentSecurityPolicy: { directives: { ...helmet.contentSecurityPolicy.getDefaultDirectives(), 'script-src': ["'none'"] } },
      hsts: env.isProduction ? undefined : false,
    }),
  );
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      maxAge: 600,
    }),
  );

  app.use(express.json({ limit: '256kb', strict: true }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use(cookieParser());

  // NoSQL injection + control characters, before anything reads the payload.
  app.use(mongoSanitize({ replaceWith: '_' }));
  app.use(sanitizeInput);

  app.use(`/api/${env.API_VERSION}`, apiLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
```

## `server/src/config/db.js`

```js
import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

/** Connect once at process start. Fatal on failure — never serve without a DB. */
export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 20,
      minPoolSize: 2,
      retryWrites: true,
    });
    // eslint-disable-next-line no-console
    console.info(`[db] connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] connection failed:', error.message);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    // eslint-disable-next-line no-console
    console.info('[db] disconnected');
  }
}
```

## `server/src/config/env.js`

```js
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env from the server working directory. Never commit the real file.
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * In development/test a missing secret is replaced by a per-process random
 * value (nothing secret is ever hard-coded). In production a missing secret is
 * a fatal configuration error — fail fast instead of booting insecurely.
 */
const ephemeralSecret = () => (isProduction ? undefined : crypto.randomBytes(48).toString('hex'));

const raw = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? 5000,
  API_VERSION: process.env.API_VERSION ?? 'v1',
  TRUST_PROXY: process.env.TRUST_PROXY ?? 0,
  MONGODB_URI:
    process.env.MONGODB_URI ?? (isProduction ? undefined : 'mongodb://127.0.0.1:27017/algonest'),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? '',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE ?? 'lax',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? ephemeralSecret(),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? ephemeralSecret(),
  JWT_ISSUER: process.env.JWT_ISSUER ?? 'algonest-api',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? 'algonest-web',
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? '15m',
  REFRESH_TOKEN_TTL_DAYS: process.env.REFRESH_TOKEN_TTL_DAYS ?? 7,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS ?? 12,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ?? 900_000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ?? 300,
  AUTH_RATE_LIMIT_MAX: process.env.AUTH_RATE_LIMIT_MAX ?? 10,
};

const sameSite = z.enum(['lax', 'strict', 'none']);

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number().int().min(1).max(65535),
    API_VERSION: z.string().regex(/^v\d+$/, 'API_VERSION must look like v1'),
    TRUST_PROXY: z.coerce.number().int().min(0).max(10),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    CLIENT_URL: z.string().url(),
    CORS_ORIGINS: z.string(),
    COOKIE_SAME_SITE: sameSite,
    COOKIE_DOMAIN: z.string(),
    JWT_ACCESS_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_ISSUER: z.string().min(1),
    JWT_AUDIENCE: z.string().min(1),
    ACCESS_TOKEN_TTL: z.string().regex(/^\d+[smhd]$/, 'Use e.g. 15m'),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30),
    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000),
    RATE_LIMIT_MAX: z.coerce.number().int().min(1),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(1),
  })
  .superRefine((value, ctx) => {
    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_REFRESH_SECRET'], message: 'Access and refresh secrets must differ' });
    }
    if (value.COOKIE_SAME_SITE === 'none' && value.NODE_ENV === 'production' && !value.CLIENT_URL.startsWith('https://')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['COOKIE_SAME_SITE'], message: 'sameSite=none requires HTTPS' });
    }
  });

const parsed = envSchema.safeParse(raw);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[config] Invalid environment configuration:', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
  process.exit(1);
}

export const env = Object.freeze({
  ...parsed.data,
  isProduction,
  isTest: parsed.data.NODE_ENV === 'test',
  corsOrigins: [
    ...new Set(
      [parsed.data.CLIENT_URL, ...parsed.data.CORS_ORIGINS.split(',').map((s) => s.trim())].filter(Boolean),
    ),
  ],
});
```

## `server/src/middlewares/auth.middleware.js`

```js
import { ROLE_PERMISSIONS, USER_STATUSES } from '@algonest/shared';
import { User } from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { extractBearerToken, toAuthError, verifyAccessToken } from '../utils/tokens.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Verifies the short-lived access token and re-loads the user from MongoDB on
 * every request. That costs one indexed lookup but means a suspended account,
 * a role change, or a deleted user takes effect immediately rather than after
 * the access token expires. The DB role — not the token role — is authoritative.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req.get('authorization'));
  if (!token) throw ApiError.unauthorized('Access token is required', { code: 'NO_TOKEN' });

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw toAuthError();
  }

  const user = await User.findById(payload.sub);
  if (!user) throw toAuthError();
  // logoutAll / admin session revocation invalidates access tokens immediately.
  if ((payload.sv ?? 0) !== (user.sessionVersion ?? 0)) throw toAuthError();
  if (user.status !== USER_STATUSES.ACTIVE) {
    throw ApiError.forbidden('This account is suspended. Contact support.', { code: 'ACCOUNT_SUSPENDED' });
  }

  req.user = user;
  req.auth = { tokenPayload: payload, role: user.role, permissions: ROLE_PERMISSIONS[user.role] ?? [] };
  next();
});

/** Public routes that can personalise a response but must not fail on no token. */
export const optionalAuthenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req.get('authorization'));
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.status === USER_STATUSES.ACTIVE) {
      req.user = user;
      req.auth = { tokenPayload: payload, role: user.role, permissions: ROLE_PERMISSIONS[user.role] ?? [] };
    }
  } catch {
    // A malformed token on a public route is simply treated as anonymous.
  }
  return next();
});

/** Coarse role check. Prefer requirePermission for privileged routes. */
export function authorize(...allowedRoles) {
  const allowed = new Set(allowedRoles.flat());
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!allowed.has(req.user.role)) return next(ApiError.forbidden());
    return next();
  };
}

/** Permission-based RBAC: super_admin implicitly owns every permission. */
export function requirePermission(...required) {
  const needed = required.flat();
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    const granted = req.auth?.permissions ?? [];
    return needed.every((permission) => granted.includes(permission))
      ? next()
      : next(ApiError.forbidden('Your role cannot perform this action'));
  };
}

/** Blocks core product routes until goal selection is done. */
export function requireOnboarded(req, _res, next) {
  if (!req.user) return next(ApiError.unauthorized());
  if (!req.user.onboardingCompleted || !req.user.goal) {
    return next(ApiError.forbidden('Complete onboarding first', { code: 'ONBOARDING_REQUIRED' }));
  }
  return next();
}
```

## `server/src/middlewares/dbGuard.middleware.js`

```js
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Fail fast (503) instead of letting Mongoose buffer a query for 10 seconds
 * when the database is unreachable. Keeps health probes honest and gives the
 * client a deterministic error it can display.
 */
export function requireDatabase(_req, _res, next) {
  // Unit tests stub the models, so they intentionally run without a connection.
  if (env.isTest) return next();
  if (mongoose.connection.readyState !== 1) {
    return next(
      ApiError.serviceUnavailable('The database is temporarily unavailable. Please try again shortly.'),
    );
  }
  return next();
}

export default requireDatabase;
```

## `server/src/middlewares/error.middleware.js`

```js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { formatZodIssues } from '@algonest/shared';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import { sendError } from '../utils/response.js';

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} was not found`));
}

/**
 * Single place where every failure becomes the same JSON envelope. Internal
 * details (stacks, Mongoose internals, SQL-ish messages) never leave prod.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let statusCode = 500;
  let message = 'Something went wrong. Please try again later.';
  let errors = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors ?? null;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = formatZodIssues(err.issues);
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((item) => ({ field: item.path, message: item.message, code: 'invalid' }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = 'A record with those values already exists';
    errors = Object.keys(err.keyPattern ?? {}).map((field) => ({
      field,
      message: `${field} is already in use`,
      code: 'duplicate',
    }));
  } else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired credentials';
  } else if (err?.type === 'entity.parse.failed' || err?.type === 'entity.too.large') {
    statusCode = err.type === 'entity.too.large' ? 413 : 400;
    message = err.type === 'entity.too.large' ? 'Request body is too large' : 'Malformed JSON body';
  } else if (err?.status === 413 || err?.statusCode === 413) {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (typeof err?.statusCode === 'number' && err.statusCode < 500) {
    // e.g. body-parser / cors errors that already carry a safe client status.
    statusCode = err.statusCode;
    message = err.message || message;
  }

  const log = statusCode >= 500 ? console.error : console.warn;
  if (!env.isTest || statusCode >= 500) {
    log(`[error] ${req.id ?? '-'} ${req.method} ${req.originalUrl} -> ${statusCode}`, err);
  }

  if (res.headersSent) return;
  sendError(res, statusCode, message, errors);
}
```

## `server/src/middlewares/sanitize.middleware.js`

```js
/**
 * Input hardening, layered on top of express-mongo-sanitize:
 *  - mongo-sanitize removes `$`-prefixed keys / dots (NoSQL injection).
 *  - this middleware removes NUL/control characters and trims free text.
 *  - password-like fields are never trimmed (spaces can be intentional).
 *  - recursion is bounded to keep a deeply nested payload from being a DoS.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const UNTRIMMED_KEYS = new Set(['password', 'passwordHash', 'newPassword', 'confirmPassword', 'token']);
const MAX_DEPTH = 8;
const MAX_ARRAY_ITEMS = 200;

function cleanValue(value, key = '', depth = 0) {
  if (depth > MAX_DEPTH) return undefined;

  if (typeof value === 'string') {
    const stripped = value.replace(CONTROL_CHARS, '');
    return UNTRIMMED_KEYS.has(key) ? stripped : stripped.trim();
  }

  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => cleanValue(item, key, depth + 1));
  }

  if (value && typeof value === 'object' && !Buffer.isBuffer(value)) {
    const output = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      // Drop prototype-pollution style keys that survived mongo-sanitize.
      if (childKey === '__proto__' || childKey === 'constructor' || childKey === 'prototype') continue;
      output[childKey] = cleanValue(childValue, childKey, depth + 1);
    }
    return output;
  }

  return value;
}

export function sanitizeInput(req, _res, next) {
  for (const source of ['body', 'query', 'params']) {
    const value = req[source];
    if (value && typeof value === 'object') {
      const cleaned = cleanValue(value, source, 0) ?? {};
      if (source === 'query') {
        // Express defines req.query as a configurable getter (no setter);
        // redefine it rather than assigning in strict-mode ESM.
        Object.defineProperty(req, 'query', {
          value: cleaned,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        req[source] = cleaned;
      }
    }
  }
  next();
}

export default sanitizeInput;
```

## `server/src/middlewares/security.middleware.js`

```js
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/** Attach a correlation id to every request/response for audit logs. */
export function requestContext(req, res, next) {
  const incoming = req.get('x-request-id');
  const id = incoming && /^[\w-]{1,64}$/.test(incoming) ? incoming : crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

const rateLimitHandler = (req, _res, next, options) => {
  const minutes = Math.max(1, Math.ceil(options.windowMs / 60_000));
  next(ApiError.tooManyRequests(`Too many requests. Try again in about ${minutes} minutes.`));
};

const common = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler,
};

/** Global guard for all /api routes. */
export const apiLimiter = rateLimit({
  ...common,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.isTest ? 10_000 : env.RATE_LIMIT_MAX,
});

/** Stricter limiter for register/login, keyed by IP + attempted email. */
export const authLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60_000,
  limit: env.isTest ? 10_000 : env.AUTH_RATE_LIMIT_MAX,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase() : '';
    return `${req.ip}:${email}`;
  },
});

/** Refresh is cheap but should not be hammered by a broken client loop. */
export const refreshLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60_000,
  limit: env.isTest ? 10_000 : 60,
  skipSuccessfulRequests: true,
});
```

## `server/src/middlewares/validate.middleware.js`

```js
import { formatZodIssues } from '@algonest/shared';
import ApiError from '../utils/ApiError.js';

/**
 * Zod validation for any request part.
 *
 *   validate(loginSchema)                              // shorthand for body
 *   validate({ query: paginationSchema, params: idSchema })
 *
 * Parsed (and unknown-key-stripped) values are exposed on `req.validated`.
 * The raw body is replaced too, which prevents mass-assignment of fields that
 * are not in the contract.
 */
export function validate(contract) {
  const parts = contract?.safeParse ? { body: contract } : contract;

  if (!parts || typeof parts !== 'object') {
    throw new TypeError('validate() expects a Zod schema or a map of Zod schemas');
  }

  return (req, _res, next) => {
    const validated = { ...(req.validated ?? {}) };

    for (const [source, schema] of Object.entries(parts)) {
      if (!schema?.safeParse) {
        return next(new TypeError(`Invalid schema supplied for "${source}"`));
      }
      const result = schema.safeParse(req[source] ?? {});
      if (!result.success) {
        return next(
          ApiError.unprocessable('Validation failed', {
            errors: formatZodIssues(result.error.issues),
          }),
        );
      }
      validated[source] = result.data;
      if (source === 'body') req.body = result.data;
    }

    req.validated = validated;
    return next();
  };
}

export default validate;
```

## `server/src/models/RefreshSession.js`

```js
import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * One document per issued refresh token. We store only a SHA-256 digest, so a
 * database leak cannot be replayed against /auth/refresh. `family` groups a
 * rotation chain: presenting an already-rotated token means token theft, so we
 * revoke the whole family (refresh token reuse detection).
 */
const refreshSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    revokeReason: {
      type: String,
      enum: ['rotated', 'logout', 'logout_all', 'reuse_detected', 'admin_revoke', null],
      default: null,
    },
    createdByIp: { type: String, maxlength: 64, default: null },
    userAgent: { type: String, maxlength: 256, default: null },
  },
  { timestamps: true, versionKey: false },
);

// MongoDB removes expired sessions automatically. `expiresAt` is also checked
// in code so behaviour is correct even before the TTL monitor runs.
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshSession = mongoose.model('RefreshSession', refreshSessionSchema);
```

## `server/src/models/User.js`

```js
import mongoose from 'mongoose';
import {
  GOAL_VALUES,
  PREFERRED_LANGUAGES,
  ROLES,
  ROLE_VALUES,
  USER_STATUSES,
  USER_STATUS_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * Shared, globally unique identity. Per-user learning data (progress, notes,
 * personal resources) will live in separate collections from Phase 2 onward —
 * never embedded here — so sheet/quiz documents stay immutable per user.
 */
const streakSchema = new Schema(
  {
    current: { type: Number, default: 0, min: 0 },
    longest: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name is too short'],
      maxlength: [60, 'Name is too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email is too long'],
      // Deliberately no regex here: Zod owns validation, Mongoose is a backstop.
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: { values: ROLE_VALUES, message: 'Unknown role' },
      default: ROLES.STUDENT,
      required: true,
    },
    goal: {
      type: String,
      enum: { values: GOAL_VALUES, message: 'Unknown goal' },
      default: null,
    },
    onboardingCompleted: { type: Boolean, default: false },
    streak: { type: streakSchema, default: () => ({}) },
    preferredLanguage: {
      type: String,
      enum: { values: PREFERRED_LANGUAGES, message: 'Unknown language' },
      default: null,
    },
    status: {
      type: String,
      enum: { values: USER_STATUS_VALUES, message: 'Unknown status' },
      default: USER_STATUSES.ACTIVE,
    },
    lastLoginAt: { type: Date, default: null },
    // Basic account lockout complements the IP-level rate limiter.
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
    // Bumped by an admin/support action to invalidate every access token.
    sessionVersion: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: '__v' },
);

// Unique email is created by the `unique: true` above; these cover admin
// listings and future analytics queries.
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ status: 1 });
userSchema.index({ goal: 1 });

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.failedLoginAttempts;
    delete ret.lockUntil;
    delete ret.sessionVersion;
    return ret;
  },
});

userSchema.statics.findByEmailWithSecrets = function findByEmailWithSecrets(email) {
  return this.findOne({ email: String(email).toLowerCase() }).select(
    '+passwordHash +failedLoginAttempts +lockUntil +sessionVersion',
  );
};

userSchema.methods.toPublic = function toPublic() {
  return this.toJSON();
};

userSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const User = mongoose.model('User', userSchema);
export const isValidObjectId = (id) => Types.ObjectId.isValid(id);
```

## `server/src/modules/auth/auth.controller.js`

```js
import * as authService from './auth.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from '../../utils/cookies.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body, authService.requestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendCreated(res, { user: result.user, accessToken: result.accessToken }, 'Account created');
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body, authService.requestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Signed in');
});

export const refresh = asyncHandler(async (req, res) => {
  const token = readRefreshCookie(req);
  if (!token) throw ApiError.unauthorized('No active refresh session', { code: 'NO_REFRESH' });

  try {
    const result = await authService.rotateRefreshSession(token, authService.requestContext(req));
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Session refreshed');
  } catch (error) {
    // Prevent a broken/expired cookie from causing an endless refresh loop.
    clearRefreshCookie(res);
    throw error;
  }
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(readRefreshCookie(req));
  clearRefreshCookie(res);
  sendSuccess(res, null, 'Signed out');
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user._id);
  clearRefreshCookie(res);
  sendSuccess(res, null, 'Signed out of all devices');
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: await authService.getCurrentUser(req.user._id) }, 'OK');
});
```

## `server/src/modules/auth/auth.routes.js`

```js
import { Router } from 'express';
import { loginSchema, registerSchema } from '@algonest/shared';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authLimiter, refreshLimiter } from '../../middlewares/security.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './auth.controller.js';

const router = Router();

// Public, but rate limited and Zod-validated.
router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', refreshLimiter, controller.refresh);
router.post('/logout', controller.logout);

// Authenticated.
router.post('/logout-all', authenticate, controller.logoutAll);
router.get('/me', authenticate, controller.me);

export default router;
```

## `server/src/modules/auth/auth.service.js`

```js
import bcrypt from 'bcryptjs';
import { ROLES } from '@algonest/shared';
import { env } from '../../config/env.js';
import { RefreshSession } from '../../models/RefreshSession.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import {
  hashToken,
  newTokenFamily,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/tokens.js';
import { applyDailyStreak } from '../users/user.service.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60_000;

// Constant-work comparison for unknown emails, so user enumeration by timing
// is not trivially possible.
const DUMMY_HASH = bcrypt.hashSync('timing-attack-mitigation-placeholder', 10);

export function requestContext(req) {
  return {
    ip: String(req.ip ?? req.socket?.remoteAddress ?? '').slice(0, 64),
    userAgent: String(req.get?.('user-agent') ?? '').slice(0, 256),
  };
}

/** Create a refresh session + access token pair for a user. */
async function createSession(user, ctx, family = newTokenFamily()) {
  const refreshToken = signRefreshToken({ sub: user._id, family });
  const payload = verifyRefreshToken(refreshToken);

  await RefreshSession.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    family,
    expiresAt: new Date(payload.exp * 1000),
    createdByIp: ctx.ip || null,
    userAgent: ctx.userAgent || null,
  });

  return { accessToken: signAccessToken(user), refreshToken };
}

async function revokeFamily(family, reason) {
  if (!family) return;
  await RefreshSession.updateMany(
    { family, revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: reason } },
  );
}

export async function register(input, ctx) {
  const email = input.email.toLowerCase();
  if (await User.exists({ email })) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  let user;
  try {
    user = await User.create({
      name: input.name,
      email,
      passwordHash,
      role: ROLES.STUDENT, // role is NEVER accepted from the client
    });
  } catch (error) {
    // Handles the race between exists() and create() on a concurrent signup.
    if (error?.code === 11000) throw ApiError.conflict('An account with this email already exists');
    throw error;
  }

  const tokens = await createSession(user, ctx);
  return { user: user.toPublic(), ...tokens };
}

export async function login(input, ctx) {
  const email = input.email.toLowerCase();
  const user = await User.findByEmailWithSecrets(email);

  if (!user) {
    await bcrypt.compare(input.password, DUMMY_HASH);
    throw ApiError.unauthorized('Invalid email or password', { code: 'INVALID_CREDENTIALS' });
  }

  if (user.isLocked()) {
    throw ApiError.tooManyRequests('Account temporarily locked after too many failed attempts. Try again in 15 minutes.');
  }

  if (user.status !== 'active') {
    throw ApiError.forbidden('This account is suspended. Contact support.');
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw ApiError.unauthorized('Invalid email or password', { code: 'INVALID_CREDENTIALS' });
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.lastLoginAt = new Date();
  applyDailyStreak(user);
  await user.save();

  const tokens = await createSession(user, ctx);
  return { user: user.toPublic(), ...tokens };
}

/**
 * Refresh-token rotation with reuse detection. The old session is claimed
 * atomically (findOneAndUpdate) so two concurrent refreshes cannot both win.
 */
export async function rotateRefreshSession(rawToken, ctx) {
  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.', { code: 'REFRESH_INVALID' });
  }

  const tokenHash = hashToken(rawToken);
  const claimed = await RefreshSession.findOneAndUpdate(
    { tokenHash, family: payload.family, revokedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date(), revokeReason: 'rotated' } },
    { new: true },
  );

  if (!claimed) {
    const existing = await RefreshSession.findOne({ tokenHash });
    if (existing) {
      // A rotated/expired token was replayed: assume theft, kill the chain.
      await revokeFamily(existing.family, 'reuse_detected');
      throw ApiError.unauthorized('Session reuse detected. Please sign in again.', { code: 'REFRESH_REUSE' });
    }
    throw ApiError.unauthorized('Session not found. Please sign in again.', { code: 'REFRESH_UNKNOWN' });
  }

  const user = await User.findById(claimed.user);
  if (!user || user.status !== 'active') {
    await revokeFamily(claimed.family, 'admin_revoke');
    throw ApiError.unauthorized('Account is unavailable. Please sign in again.', { code: 'ACCOUNT_UNAVAILABLE' });
  }

  const tokens = await createSession(user, ctx, claimed.family);
  return { user: user.toPublic(), ...tokens };
}

/** Revoke only the current device. Safe to call with an invalid token. */
export async function logout(rawToken) {
  if (!rawToken) return;
  await RefreshSession.updateOne(
    { tokenHash: hashToken(rawToken), revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: 'logout' } },
  );
}

/** Revoke every session and invalidate all outstanding access tokens. */
export async function logoutAll(userId) {
  await Promise.all([
    RefreshSession.updateMany(
      { user: userId, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: 'logout_all' } },
    ),
    User.updateOne({ _id: userId }, { $inc: { sessionVersion: 1 } }),
  ]);
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toPublic();
}
```

## `server/src/modules/users/user.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as userService from './user.service.js';

export const setGoal = asyncHandler(async (req, res) => {
  const user = await userService.setOnboardingGoal(req.user._id, req.validated.body);
  sendSuccess(res, { user }, 'Goal saved. Your plan is ready.');
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.validated.body);
  sendSuccess(res, { user }, 'Profile updated');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: await userService.getUserById(req.user._id) }, 'OK');
});

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.listUsers(req.validated.query), 'Users fetched');
});

export const setRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.validated.params.id, req.validated.body.role, req.user._id);
  sendSuccess(res, { user }, 'Role updated');
});

export const setStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.validated.params.id, req.validated.body.status, req.user._id);
  sendSuccess(res, { user }, 'Account status updated');
});
```

## `server/src/modules/users/user.routes.js`

```js
import { Router } from 'express';
import {
  onboardingSchema,
  paginationSchema,
  updateProfileSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './user.controller.js';

const router = Router();

// Every route in this module requires a valid access token.
router.use(authenticate);

// Self-service (student + staff).
router.get('/me', controller.getMe);
router.patch('/me', validate(updateProfileSchema), controller.updateMe);
router.patch('/me/goal', validate(onboardingSchema), controller.setGoal);

// Admin-only user management — demonstrates RBAC + paginated list pattern.
router.get('/', requirePermission(PERMISSIONS.USER_READ), validate({ query: paginationSchema }), controller.list);
router.patch(
  '/:id/role',
  requirePermission(PERMISSIONS.USER_MANAGE),
  validate({ params: userParamsSchema, body: updateUserRoleSchema }),
  controller.setRole,
);
router.patch(
  '/:id/status',
  requirePermission(PERMISSIONS.USER_MANAGE),
  validate({ params: userParamsSchema, body: updateUserStatusSchema }),
  controller.setStatus,
);

export default router;
```

## `server/src/modules/users/user.service.js`

```js
import { PAGINATION, ROLES, USER_STATUSES } from '@algonest/shared';
import { RefreshSession } from '../../models/RefreshSession.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (date) => new Date(Math.floor(new Date(date).getTime() / DAY_MS) * DAY_MS);

/**
 * Idempotent daily streak. Called on login and onboarding today; Phase 5's
 * adaptive plan will call it whenever a daily task is completed as well.
 * Assumption: calendar days are UTC (no timezone field exists on User yet).
 */
export function applyDailyStreak(user, now = new Date()) {
  const today = startOfUtcDay(now);
  const last = user.streak?.lastActiveDate ? startOfUtcDay(user.streak.lastActiveDate) : null;

  if (last && last.getTime() === today.getTime()) return user;

  const yesterday = new Date(today.getTime() - DAY_MS);
  user.streak.current = last && last.getTime() === yesterday.getTime() ? (user.streak.current ?? 0) + 1 : 1;
  user.streak.longest = Math.max(user.streak.longest ?? 0, user.streak.current);
  user.streak.lastActiveDate = today;
  return user;
}

export async function setOnboardingGoal(userId, { goal, preferredLanguage }) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  user.goal = goal;
  user.preferredLanguage = preferredLanguage;
  user.onboardingCompleted = true;
  applyDailyStreak(user);
  await user.save();
  return user.toPublic();
}

export async function updateProfile(userId, patch) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (patch.name !== undefined) user.name = patch.name;
  if (patch.preferredLanguage !== undefined) user.preferredLanguage = patch.preferredLanguage;
  await user.save();
  return user.toPublic();
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toPublic();
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** All list endpoints share this pagination contract. */
export async function listUsers({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, q, role, status }) {
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (q) {
    const safe = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: safe }, { email: safe }];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    items: users.map((user) => user.toPublic()),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function updateUserRole(userId, role, actorId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (String(user._id) === String(actorId) && role !== ROLES.SUPER_ADMIN) {
    throw ApiError.badRequest('You cannot remove your own Super Admin role');
  }

  if (user.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
    const otherAdmins = await User.countDocuments({
      _id: { $ne: user._id },
      role: ROLES.SUPER_ADMIN,
      status: USER_STATUSES.ACTIVE,
    });
    if (otherAdmins === 0) throw ApiError.badRequest('Cannot demote the last active Super Admin');
  }

  user.role = role;
  await user.save();
  return user.toPublic();
}

export async function updateUserStatus(userId, status, actorId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (String(user._id) === String(actorId) && status === USER_STATUSES.SUSPENDED) {
    throw ApiError.badRequest('You cannot suspend your own account');
  }

  user.status = status;
  if (status === USER_STATUSES.SUSPENDED) {
    // Kick out every live session of a suspended account.
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await RefreshSession.updateMany(
      { user: user._id, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: 'admin_revoke' } },
    );
  }
  await user.save();
  return user.toPublic();
}
```

## `server/src/routes/index.js`

```js
import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response.js';
import { requireDatabase } from '../middlewares/dbGuard.middleware.js';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';

const router = Router();

/**
 * Unauthenticated liveness probe only. It exposes no user data; every other
 * endpoint in this API requires a valid access token (or is an auth endpoint).
 */
router.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  sendSuccess(
    res,
    {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      database: states[mongoose.connection.readyState] ?? 'unknown',
      timestamp: new Date().toISOString(),
    },
    'OK',
  );
});

router.use('/auth', requireDatabase, authRoutes);
router.use('/users', requireDatabase, userRoutes);

export default router;
```

## `server/src/server.js`

```js
import http from 'node:http';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

const app = createApp();
const server = http.createServer(app);

let shuttingDown = false;
let reconnectTimer = null;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (reconnectTimer) clearInterval(reconnectTimer);
  // eslint-disable-next-line no-console
  console.info(`[server] ${signal} received, shutting down gracefully`);
  server.close(async () => {
    try {
      await disconnectDatabase();
    } finally {
      process.exit(0);
    }
  });
  // Do not hang forever on keep-alive connections.
  setTimeout(() => process.exit(1), 10_000).unref();
}

/** Development convenience: recover automatically if MongoDB starts later. */
function scheduleReconnect() {
  if (reconnectTimer || env.isProduction) return;
  reconnectTimer = setInterval(async () => {
    try {
      await connectDatabase();
      // eslint-disable-next-line no-console
      console.info('[server] database reconnected; data routes are live again');
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    } catch {
      // connectDatabase already logs; keep retrying quietly.
    }
  }, 10_000);
  reconnectTimer.unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('[server] unhandled rejection:', reason);
  void shutdown('unhandledRejection');
});
process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('[server] uncaught exception:', error);
  void shutdown('uncaughtException');
});

try {
  await connectDatabase();
} catch (error) {
  if (env.isProduction) {
    // eslint-disable-next-line no-console
    console.error('[server] refusing to start without a database in production:', error.message);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.warn('[server] MongoDB unavailable at boot — /health stays up, data routes return 503');
  scheduleReconnect();
}

server.listen(env.PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.info(`[server] AlgoNest API listening on :${env.PORT} (${env.NODE_ENV})`);
});
```

## `server/src/utils/ApiError.js`

```js
/** Operational HTTP error. Anything not an ApiError is treated as a 500. */
export default class ApiError extends Error {
  constructor(statusCode, message, { code = null, errors = null, cause = null } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message = 'Bad request', options) {
    return new ApiError(400, message, { code: 'BAD_REQUEST', ...options });
  }

  static unauthorized(message = 'Authentication required', options) {
    return new ApiError(401, message, { code: 'UNAUTHORIZED', ...options });
  }

  static forbidden(message = 'You do not have permission to do that', options) {
    return new ApiError(403, message, { code: 'FORBIDDEN', ...options });
  }

  static notFound(message = 'Resource not found', options) {
    return new ApiError(404, message, { code: 'NOT_FOUND', ...options });
  }

  static conflict(message = 'Resource already exists', options) {
    return new ApiError(409, message, { code: 'CONFLICT', ...options });
  }

  static unprocessable(message = 'Validation failed', options) {
    return new ApiError(422, message, { code: 'VALIDATION_ERROR', ...options });
  }

  static tooManyRequests(message = 'Too many requests, please slow down', options) {
    return new ApiError(429, message, { code: 'RATE_LIMITED', ...options });
  }

  static serviceUnavailable(message = 'Service temporarily unavailable', options) {
    return new ApiError(503, message, { code: 'SERVICE_UNAVAILABLE', ...options });
  }
}
```

## `server/src/utils/asyncHandler.js`

```js
/**
 * Wraps async route handlers so rejected promises reach the central error
 * handler instead of crashing the process (Express 4 does not do this).
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
```

## `server/src/utils/cookies.js`

```js
import { env } from '../config/env.js';

export const REFRESH_COOKIE_NAME = 'ag_refresh';
export const REFRESH_COOKIE_PATH = `/api/${env.API_VERSION}/auth`;

/** Build cookie options once so set and clear always match (path/domain matter). */
export function refreshCookieOptions() {
  const options = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.COOKIE_SAME_SITE,
    path: REFRESH_COOKIE_PATH,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
  if (env.COOKIE_DOMAIN) options.domain = env.COOKIE_DOMAIN;
  return options;
}

export function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions());
}

export function clearRefreshCookie(res) {
  const { maxAge, ...options } = refreshCookieOptions();
  res.clearCookie(REFRESH_COOKIE_NAME, { ...options, expires: new Date(0) });
}

export function readRefreshCookie(req) {
  const value = req.cookies?.[REFRESH_COOKIE_NAME];
  return typeof value === 'string' && value.length > 0 ? value : null;
}
```

## `server/src/utils/response.js`

```js
/**
 * Every API response has exactly this shape:
 *   { success: boolean, data: any|null, message: string, errors: array|null }
 * Pagination lives in `data.pagination` so no extra top-level keys are needed.
 */
export function sendSuccess(res, data = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message, errors: null });
}

export function sendCreated(res, data = null, message = 'Created') {
  return sendSuccess(res, data, message, 201);
}

export function sendError(res, statusCode, message, errors = null) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors,
  });
}
```

## `server/src/utils/tokens.js`

```js
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ApiError from './ApiError.js';

const signOptions = (expiresIn, jwtid) => ({
  algorithm: 'HS256',
  expiresIn,
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
  jwtid,
});

const verifyOptions = {
  algorithms: ['HS256'],
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
};

/** Short-lived access token. Carries the role for fast RBAC checks. */
export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, sv: user.sessionVersion ?? 0, type: 'access' },
    env.JWT_ACCESS_SECRET,
    signOptions(env.ACCESS_TOKEN_TTL, crypto.randomUUID()),
  );
}

/** Long-lived refresh token. Stored (hashed) server-side so it can be revoked. */
export function signRefreshToken({ sub, family }) {
  return jwt.sign(
    { sub: String(sub), family, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    signOptions(`${env.REFRESH_TOKEN_TTL_DAYS}d`, crypto.randomUUID()),
  );
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, verifyOptions);
  if (payload.type !== 'access' || !payload.sub) throw new jwt.JsonWebTokenError('Wrong token type');
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, verifyOptions);
  if (payload.type !== 'refresh' || !payload.sub || !payload.family) {
    throw new jwt.JsonWebTokenError('Wrong token type');
  }
  return payload;
}

/** Refresh tokens are random JWTs; a SHA-256 digest is enough to index them. */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function newTokenFamily() {
  return crypto.randomUUID();
}

/** Normalise a raw Authorization header, returning null when malformed. */
export function extractBearerToken(header) {
  if (typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
}

/** Convert jsonwebtoken failures into safe, uniform 401 responses. */
export function toAuthError() {
  return ApiError.unauthorized('Invalid or expired credentials', { code: 'TOKEN_INVALID' });
}
```

## `server/tests/app.test.js`

```js
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import supertest from 'supertest';

// Must be set before importing anything that reads config.
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');

const base = `/api/${env.API_VERSION}`;

describe('API envelope + security middleware', () => {
  let request;

  before(() => {
    request = supertest(createApp());
  });

  after(() => {});

  it('serves a public health probe with the standard envelope', async () => {
    const res = await request.get(`${base}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'ok');
    assert.ok(res.headers['x-request-id']);
    assert.ok(res.headers['x-content-type-options']);
  });

  it('returns 422 with field-level errors for an invalid registration', async () => {
    const res = await request.post(`${base}/auth/register`).send({ name: 'x', email: 'nope', password: 'weak' });
    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes('email'));
    assert.ok(fields.includes('password'));
    assert.ok(fields.includes('name'));
  });

  it('strips unknown keys from a validated body (mass-assignment protection)', async () => {
    // A crafted role must be rejected by .strict() rather than silently used.
    const res = await request.post(`${base}/auth/register`).send({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'StrongPass1!',
      role: 'super_admin',
    });
    assert.equal(res.status, 422);
    assert.ok(res.body.errors.some((e) => e.field === '_' || e.message.includes('Unrecognized')));
  });

  it('blocks protected routes without an access token', async () => {
    const me = await request.get(`${base}/auth/me`);
    const users = await request.get(`${base}/users`);
    assert.equal(me.status, 401);
    assert.equal(users.status, 401);
    assert.equal(me.body.success, false);
  });

  it('rejects an invalid bearer token', async () => {
    const res = await request.get(`${base}/auth/me`).set('Authorization', 'Bearer not-a-jwt');
    assert.equal(res.status, 401);
  });

  it('requires a refresh cookie', async () => {
    const res = await request.post(`${base}/auth/refresh`).send({});
    assert.equal(res.status, 401);
  });

  it('returns a consistent 404 for unknown routes', async () => {
    const res = await request.get(`${base}/does-not-exist`);
    assert.equal(res.status, 404);
    assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    assert.equal(res.body.success, false);
  });

  it('rejects malformed JSON with a 400 envelope', async () => {
    const res = await request
      .post(`${base}/auth/login`)
      .set('Content-Type', 'application/json')
      .send('{"email":');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  it('rejects disallowed CORS origins', async () => {
    const res = await request.get(`${base}/health`).set('Origin', 'https://evil.example');
    assert.equal(res.status, 403);
  });
});
```

## `server/tests/auth.service.test.js`

```js
import assert from 'node:assert/strict';
import { afterEach, before, describe, it } from 'node:test';
import bcrypt from 'bcryptjs';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { User } = await import('../src/models/User.js');
const { RefreshSession } = await import('../src/models/RefreshSession.js');
const service = await import('../src/modules/auth/auth.service.js');
const { verifyAccessToken, verifyRefreshToken, hashToken } = await import('../src/utils/tokens.js');

const ctx = { ip: '127.0.0.1', userAgent: 'node:test' };
const PASSWORD = 'StrongPass1!';
let passwordHash;
let stubs = [];

function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}

const makeUser = (overrides = {}) =>
  new User({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash,
    role: 'student',
    ...overrides,
  });

before(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 4);
});

afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs = [];
});

describe('auth.service — register', () => {
  it('rejects a duplicate email with a 409', async () => {
    stub(User, 'exists', async () => true);
    await assert.rejects(
      () => service.register({ name: 'Ada Lovelace', email: 'ada@example.com', password: PASSWORD }, ctx),
      (error) => error.statusCode === 409,
    );
  });

  it('always creates a student and returns a verifiable token pair', async () => {
    let createdSession = null;
    stub(User, 'exists', async () => false);
    stub(User, 'create', async (doc) => new User(doc));
    stub(RefreshSession, 'create', async (doc) => {
      createdSession = doc;
      return doc;
    });

    const result = await service.register(
      { name: 'Ada Lovelace', email: 'ADA@example.com', password: PASSWORD, role: 'super_admin' },
      ctx,
    );

    assert.equal(result.user.role, 'student');
    assert.equal(result.user.email, 'ada@example.com');
    assert.equal(result.user.passwordHash, undefined, 'password hash must never be serialised');
    assert.equal(verifyAccessToken(result.accessToken).sub, result.user.id);
    assert.equal(verifyRefreshToken(result.refreshToken).type, 'refresh');
    assert.equal(createdSession.tokenHash, hashToken(result.refreshToken));
  });
});

describe('auth.service — login', () => {
  it('uses a generic error and counts failed attempts', async () => {
    const user = makeUser();
    stub(User, 'findByEmailWithSecrets', async () => user);
    stub(User.prototype, 'save', async function save() { return this; });

    await assert.rejects(
      () => service.login({ email: 'ada@example.com', password: 'WrongPass1!' }, ctx),
      (error) => error.statusCode === 401 && error.message === 'Invalid email or password',
    );
    assert.equal(user.failedLoginAttempts, 1);
  });

  it('resets lockout state, starts a streak and issues tokens on success', async () => {
    const user = makeUser({ failedLoginAttempts: 3, lockUntil: new Date(Date.now() - 1000) });
    stub(User, 'findByEmailWithSecrets', async () => user);
    stub(User.prototype, 'save', async function save() { return this; });
    stub(RefreshSession, 'create', async (doc) => doc);

    const result = await service.login({ email: 'ada@example.com', password: PASSWORD }, ctx);

    assert.equal(result.user.streak.current, 1);
    assert.equal(user.failedLoginAttempts, 0);
    assert.equal(user.lockUntil, null);
    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
  });

  it('refuses a locked account before checking the password', async () => {
    const user = makeUser({ lockUntil: new Date(Date.now() + 60_000) });
    stub(User, 'findByEmailWithSecrets', async () => user);
    await assert.rejects(
      () => service.login({ email: 'ada@example.com', password: PASSWORD }, ctx),
      (error) => error.statusCode === 429,
    );
  });
});

describe('auth.service — refresh rotation', () => {
  it('rotates a valid session atomically into the same family', async () => {
    const user = makeUser();
    const seed = await (async () => {
      let captured = null;
      stub(User, 'exists', async () => false);
      stub(User, 'create', async (doc) => new User(doc));
      stub(RefreshSession, 'create', async (doc) => {
        captured = doc;
        return doc;
      });
      const result = await service.register({ name: 'Ada', email: 'ada@example.com', password: PASSWORD }, ctx);
      return { refreshToken: result.refreshToken, session: captured, user };
    })();

    let created = null;
    stub(RefreshSession, 'findOneAndUpdate', async () => ({ user: seed.user._id, family: seed.session.family }));
    stub(RefreshSession, 'create', async (doc) => {
      created = doc;
      return doc;
    });
    stub(User, 'findById', async () => seed.user);

    const rotated = await service.rotateRefreshSession(seed.refreshToken, ctx);
    assert.equal(created.family, seed.session.family, 'rotation must stay in the same token family');
    assert.notEqual(created.tokenHash, seed.session.tokenHash);
    assert.equal(verifyAccessToken(rotated.accessToken).sub, String(seed.user._id));
  });

  it('revokes the whole family when a rotated token is replayed', async () => {
    const user = makeUser();
    let captured = null;
    stub(User, 'exists', async () => false);
    stub(User, 'create', async (doc) => new User(doc));
    stub(RefreshSession, 'create', async (doc) => {
      captured = doc;
      return doc;
    });
    const { refreshToken } = await service.register({ name: 'Ada', email: 'ada@example.com', password: PASSWORD }, ctx);

    let revokedFilter = null;
    stub(RefreshSession, 'findOneAndUpdate', async () => null);
    stub(RefreshSession, 'findOne', async () => ({ family: captured.family }));
    stub(RefreshSession, 'updateMany', async (filter) => {
      revokedFilter = filter;
      return { modifiedCount: 2 };
    });

    await assert.rejects(
      () => service.rotateRefreshSession(refreshToken, ctx),
      (error) => error.statusCode === 401 && error.code === 'REFRESH_REUSE',
    );
    assert.equal(revokedFilter.family, captured.family);
    assert.equal(revokedFilter.revokedAt, null);
  });
});

describe('auth.service — logout everywhere', () => {
  it('revokes sessions and bumps the session version', async () => {
    let filter = null;
    let update = null;
    stub(RefreshSession, 'updateMany', async (arg) => {
      filter = arg;
      return {};
    });
    stub(User, 'updateOne', async (_filter, arg) => {
      update = arg;
      return {};
    });

    await service.logoutAll('507f1f77bcf86cd799439011');
    assert.ok(filter.user);
    assert.deepEqual(update, { $inc: { sessionVersion: 1 } });
  });
});
```

## `server/tests/contracts.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  loginSchema,
  onboardingSchema,
  paginationSchema,
  registerSchema,
  updateProfileSchema,
} from '@algonest/shared';
import { GOALS, ROLE_PERMISSIONS, ROLES, PERMISSIONS } from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken, extractBearerToken } =
  await import('../src/utils/tokens.js');

describe('shared Zod contracts', () => {
  it('normalises email and accepts a strong registration', () => {
    const parsed = registerSchema.parse({
      name: '  Ada Lovelace  ',
      email: '  ADA@Example.COM ',
      password: 'StrongPass1!',
    });
    assert.equal(parsed.name, 'Ada Lovelace');
    assert.equal(parsed.email, 'ada@example.com');
  });

  it('rejects weak passwords and unknown keys', () => {
    assert.equal(registerSchema.safeParse({ name: 'Ada', email: 'a@b.co', password: 'password' }).success, false);
    assert.equal(
      registerSchema.safeParse({ name: 'Ada', email: 'a@b.co', password: 'StrongPass1!', role: 'super_admin' }).success,
      false,
    );
    assert.equal(loginSchema.safeParse({ email: 'a@b.co', password: 'x' }).success, true);
  });

  it('defaults onboarding language and validates goal enum', () => {
    const parsed = onboardingSchema.parse({ goal: GOALS.INTERVIEW_60_DAYS });
    assert.equal(parsed.preferredLanguage, 'javascript');
    assert.equal(onboardingSchema.safeParse({ goal: 'not-a-goal' }).success, false);
    assert.equal(updateProfileSchema.safeParse({}).success, false);
  });

  it('coerces + caps pagination', () => {
    assert.deepEqual(
      { page: paginationSchema.parse({ page: '3', limit: '25' }).page, limit: paginationSchema.parse({ page: '3', limit: '25' }).limit },
      { page: 3, limit: 25 },
    );
    assert.equal(paginationSchema.safeParse({ limit: '1000' }).success, false);
    assert.equal(paginationSchema.parse({}).limit, 20);
  });

  it('gives the super admin every permission and students none', () => {
    assert.ok(ROLE_PERMISSIONS[ROLES.SUPER_ADMIN].includes(PERMISSIONS.USER_MANAGE));
    assert.equal(ROLE_PERMISSIONS[ROLES.STUDENT].length, 0);
  });
});

describe('JWT utilities', () => {
  const user = { _id: '507f1f77bcf86cd799439011', role: ROLES.STUDENT, sessionVersion: 2 };

  it('round-trips access tokens and rejects the wrong type/secret', () => {
    const token = signAccessToken(user);
    const payload = verifyAccessToken(token);
    assert.equal(payload.sub, user._id);
    assert.equal(payload.sv, 2);
    assert.throws(() => verifyRefreshToken(token));
  });

  it('round-trips refresh tokens with a family', () => {
    const token = signRefreshToken({ sub: user._id, family: 'family-1' });
    const payload = verifyRefreshToken(token);
    assert.equal(payload.family, 'family-1');
    assert.ok(payload.exp > Date.now() / 1000);
    assert.throws(() => verifyAccessToken(token));
  });

  it('hashes tokens deterministically and extracts bearer headers', () => {
    assert.equal(hashToken('abc'), hashToken('abc'));
    assert.notEqual(hashToken('abc'), hashToken('abd'));
    assert.equal(extractBearerToken('Bearer abc.def.ghi'), 'abc.def.ghi');
    assert.equal(extractBearerToken('Basic abc'), null);
    assert.equal(extractBearerToken(undefined), null);
  });
});
```

---

# Client — Vite, Tailwind, features, components

## `client/.env.example`

```bash
# Browser-facing code uses a RELATIVE base URL by default; Vite proxies /api
# to the Express server, which keeps the refresh cookie same-origin.
VITE_API_URL=/api/v1

# Where the Vite dev/preview server proxies /api requests (server-side only).
VITE_PROXY_TARGET=http://localhost:5000
```

## `client/eslint.config.js`

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'src/components/reactbits/**'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { 'react-hooks': reactHooks, react },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // JSX component names are real references; without this rule an undefined
      // component (e.g. a forgotten import) builds fine but crashes at runtime.
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
```

## `client/index.html`

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#070b14" />
    <meta
      name="description"
      content="AlgoNest — curated DSA sheets, quizzes, mock tests and an adaptive daily plan, built for placements."
    />
    <title>AlgoNest — Prepare with a plan</title>
    <script>
      // Apply the persisted theme before first paint to avoid a flash.
      try {
        const stored = JSON.parse(localStorage.getItem('algonest-theme') || '{}');
        const theme = stored?.state?.theme || 'dark';
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.style.colorScheme = theme;
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', theme === 'dark' ? '#070b14' : '#f6f8fb');
      } catch (_error) {
        document.documentElement.classList.add('dark');
      }
    </script>
    <script>
      // Two React copies (a stale Vite `?v=` chunk mixed with a fresh one) make
      // every hook dispatcher null. Reload once, before React mounts, so the
      // browser fetches one consistent module graph. Shares the rate-limit key
      // with ErrorBoundary so we never end up in a reload loop.
      (function () {
        var KEY = 'ag:last-auto-reload';
        window.addEventListener('error', function (event) {
          var message = (event && (event.message || (event.error && event.error.message))) || '';
          if (!/Cannot read properties of null \(reading 'use|Invalid hook call/.test(message)) return;
          try {
            var last = Number(sessionStorage.getItem(KEY) || 0);
            if (Date.now() - last < 20000) return;
            sessionStorage.setItem(KEY, String(Date.now()));
          } catch (_storageError) {
            return;
          }
          window.location.reload();
        });
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## `client/package.json`

```json
{
  "name": "@algonest/client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "lint": "eslint .",
    "test:render": "node scripts/smokeRender.mjs"
  },
  "dependencies": {
    "@algonest/shared": "*",
    "@tanstack/react-query": "^5.105.0",
    "gsap": "^3.15.0",
    "lucide-react": "^0.468.0",
    "motion": "^12.43.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.1.5",
    "zod": "^3.25.76",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.5",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^4.7.0",
    "eslint": "^9.39.5",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "globals": "^15.15.0",
    "tailwindcss": "^4.3.3",
    "vite": "^6.4.5"
  }
}
```

## `client/scripts/RenderHarness.jsx`

```jsx
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/** Wraps a page in the providers it needs for a server-side render smoke test. */
export function wrap(Component) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(Component)),
  );
}
```

## `client/scripts/smokeRender.mjs`

```js
/**
 * Render smoke test: catches render-time crashes (undefined components, bad
 * props, broken React Bits imports) that `vite build` and ESLint cannot see.
 * Effects do not run under renderToString — this is deliberately a render
 * check, not a browser interaction test.
 *
 * react-router-dom v7 ships a CJS `node` export, so SSR aliases it to its ESM
 * build to keep a single RouterContext instance across all modules.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';

const here = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(here, '..');
const require = createRequire(import.meta.url);
const routerPackage = require.resolve('react-router-dom/package.json');
const esmRouter = path.join(path.dirname(routerPackage), 'dist/index.mjs');

const PAGES = [
  ['LandingPage', '/src/features/landing/pages/LandingPage.jsx'],
  ['HomePage', '/src/features/home/pages/HomePage.jsx'],
  ['NotFoundPage', '/src/pages/NotFoundPage.jsx'],
  ['LoginPage', '/src/features/auth/pages/LoginPage.jsx'],
  ['RegisterPage', '/src/features/auth/pages/RegisterPage.jsx'],
  ['OnboardingPage', '/src/features/auth/pages/OnboardingPage.jsx'],
  ['SettingsPage', '/src/features/settings/pages/SettingsPage.jsx'],
  ['ModulePage', '/src/pages/ModulePage.jsx'],
  ['MicroInteractions', '/src/features/landing/components/MicroInteractions.jsx'],
];

const vite = await createServer({
  root: clientRoot,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
  optimizeDeps: { noDiscovery: true, include: [] },
  resolve: { alias: { 'react-router-dom': esmRouter } },
  ssr: { noExternal: ['react-router-dom', 'react-router'] },
});

let failed = 0;
try {
  const { wrap } = await vite.ssrLoadModule('/scripts/RenderHarness.jsx');
  for (const [name, modulePath] of PAGES) {
    try {
      const module = await vite.ssrLoadModule(modulePath);
      const html = renderToString(wrap(module.default));
      if (!html || html.length < 50) throw new Error('suspiciously short render output');
      console.info(`  ok  ${name.padEnd(20)} ${html.length} chars`);
    } catch (error) {
      failed += 1;
      console.error(`  FAIL ${name}: ${String(error.message).slice(0, 500)}`);
    }
  }
} finally {
  await vite.close();
}

console.info(`[render] ${PAGES.length - failed}/${PAGES.length} pages rendered`);
process.exit(failed > 0 ? 1 : 0);
```

## `client/src/App.jsx`

```jsx
import AppRouter from './app/router.jsx';

export default function App() {
  return <AppRouter />;
}
```

## `client/src/app/queryClient.js`

```js
import { QueryClient } from '@tanstack/react-query';

/** Server-state defaults. Auth/session state stays in Zustand (not the cache). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Client errors never benefit from a retry; 5xx gets two attempts.
        if (error?.status && error.status < 500 && error.status !== 408) return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: 0 },
  },
});

export default queryClient;
```

## `client/src/app/router.jsx`

```jsx
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthGate from '../features/auth/components/AuthGate.jsx';
import GuestRoute from '../features/auth/components/GuestRoute.jsx';
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import { FullPageLoader } from '../components/ui/Spinner.jsx';

/**
 * React Bits + gsap + motion are polish-only dependencies. Lazy-loading feature
 * pages keeps them out of the entry chunk, so /app screens stay fast even before
 * a visitor ever opens the animated landing page.
 */
const LandingPage = lazy(() => import('../features/landing/pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage.jsx'));
const OnboardingPage = lazy(() => import('../features/auth/pages/OnboardingPage.jsx'));
const HomePage = lazy(() => import('../features/home/pages/HomePage.jsx'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage.jsx'));
const ModulePage = lazy(() => import('../pages/ModulePage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

const UPCOMING_MODULES = ['sheets', 'quizzes', 'mocks', 'plans', 'resources', 'community'];

export default function AppRouter() {
  return (
    <AuthGate>
      <Suspense fallback={<FullPageLoader label="Loading AlgoNest…" />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Guests only */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated, onboarding optional (this IS the onboarding route) */}
          <Route element={<ProtectedRoute requireOnboarding={false} />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Authenticated + onboarded app shell */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              {UPCOMING_MODULES.map((module) => (
                <Route key={module} path={module} element={<ModulePage />} />
              ))}
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthGate>
  );
}
```

## `client/src/components/common/ErrorBoundary.jsx`

```jsx
import { Component } from 'react';
import { TriangleAlert } from 'lucide-react';
import Button from '../ui/Button.jsx';

/**
 * Stale lazy chunks are the most common cause of a blank screen right after a
 * deploy or a Vite dependency re-optimisation: the browser still has the old
 * module graph. Mixing an old and new React chunk additionally produces
 * "Cannot read properties of null (reading 'useCallback')" from zustand.
 * Reload once (rate-limited) instead of showing an error forever.
 */
const CHUNK_ERROR = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|does not provide an export named|Failed to resolve module specifier|Outdated Optimize Dep|Failed to fetch|Invalid hook call|Cannot read properties of null \(reading 'use|dispatcher is null|resolveDispatcher/i;
const RELOAD_KEY = 'ag:last-auto-reload';
const RELOAD_WINDOW_MS = 20000;

function tryAutoReload() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    return true;
  } catch {
    return false; // private mode / storage disabled — never crash on this path
  }
}

/** Last line of defence for render-time crashes; shows a recoverable screen. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AlgoNest] render error:', error, info.componentStack);
    if (CHUNK_ERROR.test(error?.message ?? '') && tryAutoReload()) {
      window.location.reload();
    }
  }

  handleRetry = () => this.setState({ error: null });

  handleReload = () => {
    try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ }
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
        <TriangleAlert className="h-10 w-10 text-warning" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-ink">Something broke on this screen</h1>
        <p className="max-w-md text-sm text-muted">
          The rest of AlgoNest is fine. Reload this screen, or go back to the dashboard.
        </p>

        {import.meta.env.DEV ? (
          <details className="w-full max-w-xl rounded-xl border border-line bg-surface p-3 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-muted">Technical details</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-warning">
              {error.stack || error.message || String(error)}
            </pre>
          </details>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={this.handleRetry}>Try again</Button>
          <Button variant="secondary" onClick={this.handleReload}>Hard reload</Button>
          <Button variant="ghost" onClick={() => window.location.assign('/app')}>Go to dashboard</Button>
        </div>
      </div>
    );
  }
}
```

## `client/src/components/common/PolishBoundary.jsx`

```jsx
import { Component } from 'react';

/**
 * Decorative animations are optional. React Bits is vendored third-party code
 * that touches canvas, ResizeObserver, matchMedia, gsap and requestAnimationFrame.
 * If one of those APIs misbehaves in a particular browser — or a stale Vite
 * chunk fails to load — we must degrade to the static content instead of
 * blanking the whole route with the top-level error screen.
 */
export default class PolishBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Logged once, never rethrown: the user still gets readable content.
    console.warn('[AlgoNest] disabled animation', this.props.name, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const { fallback } = this.props;
    return typeof fallback === 'function' ? fallback() : (fallback ?? null);
  }
}
```

## `client/src/components/layout/AppLayout.jsx`

```jsx
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the drawer on navigation and on Escape.
  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

## `client/src/components/layout/Sidebar.jsx`

```jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, CalendarRange, FolderOpen, LayoutDashboard, ListChecks,
  LogOut, Settings, ShieldCheck, Timer, Users, X,
} from 'lucide-react';
import { ROLE_LABELS } from '@algonest/shared/constants';
import { NAV_ITEMS } from '../../lib/navigation.js';
import { cn } from '../../lib/cn.js';
import Logo from '../ui/Logo.jsx';
import Badge from '../ui/Badge.jsx';
import useAuth from '../../features/auth/hooks/useAuth.js';

const ICONS = { LayoutDashboard, BookOpen, ListChecks, Timer, CalendarRange, FolderOpen, Users };

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) });
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}
      aria-label="Primary navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Link to="/app" className="inline-flex items-center" aria-label="AlgoNest dashboard">
          <Logo showWordmark />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="ag-scrollbar flex-1 overflow-y-auto px-3 py-5" aria-label="Modules">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Workspace</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive ? 'bg-primary/12 text-primary' : 'text-muted hover:translate-x-0.5 hover:bg-surface-2 hover:text-ink',
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {!item.ready ? (
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>
                  ) : null}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <p className="mt-7 px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Account</p>
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/app/settings"
              className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink')}
            >
              <Settings className="h-[18px] w-[18px]" aria-hidden="true" />
              Settings
            </NavLink>
          </li>
          {user?.role !== 'student' ? (
            <li className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted">
              <ShieldCheck className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
              <span className="flex-1">Staff access</span>
              <Badge variant="accent">{ROLE_LABELS[user.role] ?? user.role}</Badge>
            </li>
          ) : null}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl bg-surface-2/60 p-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary" aria-hidden="true">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.name ?? 'Student'}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-danger disabled:opacity-50"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
```

## `client/src/components/layout/Topbar.jsx`

```jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Flame, LogOut, Menu, Search, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { ROLE_LABELS } from '@algonest/shared/constants';
import { NAV_ITEMS } from '../../lib/navigation.js';
import { cn } from '../../lib/cn.js';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import Badge from '../ui/Badge.jsx';
import useAuth from '../../features/auth/hooks/useAuth.js';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout, logoutAll } = useAuth();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(searchRef, () => setSearchOpen(false), searchOpen);
  useClickOutside(notificationsRef, () => setNotificationsOpen(false), notificationsOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(term));
  }, [query]);

  const goToResult = (item) => {
    if (!item) return;
    navigate(item.to);
    setSearchOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      goToResult(results[activeIndex]);
    }
  };

  const initials = (user?.name ?? '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const streak = user?.streak?.current ?? 0;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl border border-line bg-surface p-2 text-muted hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Local, fully functional module search — no fake backend call. */}
      <div ref={searchRef} className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Jump to a module…"
          aria-label="Search modules"
          role="combobox"
          aria-expanded={searchOpen}
          aria-controls="global-search-results"
          aria-autocomplete="list"
          aria-activedescendant={searchOpen && results[activeIndex] ? `search-option-${activeIndex}` : undefined}
          className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchOpen ? (
          <div id="global-search-results" role="listbox" aria-label="Modules" className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-xl">
            {results.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted">No module matches “{query}”.</p>
            ) : (
              results.map((item, index) => (
                <button
                  key={item.to}
                  id={`search-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToResult(item)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm',
                    index === activeIndex ? 'bg-primary/12 text-primary' : 'text-ink hover:bg-surface-2',
                  )}
                >
                  <span>{item.label}</span>
                  {!item.ready ? <span className="text-[10px] uppercase tracking-wide text-muted">Phase 2</span> : null}
                </button>
              ))
            )}
            <p className="border-t border-line px-3 pb-1 pt-2 text-[11px] text-muted">↑ ↓ to navigate · Enter to open · Esc to close</p>
          </div>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="hidden items-center gap-1.5 rounded-xl border border-warning/25 bg-warning/8 px-3 py-2 text-sm font-semibold text-warning sm:inline-flex"
          title={`Longest streak: ${user?.streak?.longest ?? 0} days`}
          aria-label={`${streak} day streak. Longest streak ${user?.streak?.longest ?? 0} days.`}
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          {streak} <span className="hidden font-medium md:inline">day streak</span>
        </div>

        <ThemeToggle className="hidden sm:inline-flex" />

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative rounded-xl border border-line bg-surface p-2.5 text-muted transition-colors hover:text-ink"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="dialog"
          >
            <Bell className="h-4 w-4" />
          </button>
          {notificationsOpen ? (
            <div role="dialog" aria-label="Notifications" className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-line bg-surface p-4 shadow-xl">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              <div className="mt-4 rounded-xl border border-dashed border-line px-4 py-8 text-center">
                <Bell className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium text-ink">You’re all caught up</p>
                <p className="mt-1 text-xs text-muted">Mock reminders and plan nudges will show up here.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface py-1.5 pl-1.5 pr-2.5 text-sm transition-colors hover:border-primary/40"
            aria-label="Account menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">{initials}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          </button>
          {profileOpen ? (
            <div role="menu" className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-line bg-surface p-2 shadow-xl">
              <div className="border-b border-line px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <Badge variant="accent">{ROLE_LABELS[user?.role] ?? 'Student'}</Badge>
                </div>
              </div>
              <Link to="/app/settings" role="menuitem" onClick={() => setProfileOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-2">
                <Settings className="h-4 w-4 text-muted" aria-hidden="true" /> Settings
              </Link>
              <Link to="/" role="menuitem" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-2">
                <UserRound className="h-4 w-4 text-muted" aria-hidden="true" /> View landing page
              </Link>
              <div className="my-1 border-t border-line" />
              <button type="button" role="menuitem" disabled={logout.isPending} onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface-2 disabled:opacity-50">
                <LogOut className="h-4 w-4 text-muted" aria-hidden="true" /> Sign out
              </button>
              <button type="button" role="menuitem" disabled={logoutAll.isPending} onClick={() => logoutAll.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-muted hover:bg-surface-2 disabled:opacity-50">
                Sign out of all devices
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
```

## `client/src/components/reactbits/index.js`

```js
/**
 * Vendored React Bits components (official JS + Tailwind variants).
 * See README.md in this folder for provenance, licence and update instructions.
 * Only import these on polish surfaces (landing, home, empty states, headers).
 *
 * Every export is wrapped in a local PolishBoundary: an animation that fails in
 * an unsupported browser degrades to static content instead of triggering the
 * global "Something broke on this screen" fallback.
 */
import withSafeFallback from './safe.js';

import BlurTextSource from './BlurText.jsx';
import GradientTextSource from './GradientText.jsx';
import GridMotionSource from './GridMotion.jsx';
import ShinyTextSource from './ShinyText.jsx';
import SpotlightCardSource from './SpotlightCard.jsx';
import StarBorderSource from './StarBorder.jsx';
import ClickSparkSource from './ClickSpark.jsx';
import GlareHoverSource from './GlareHover.jsx';
import MagnetSource from './Magnet.jsx';
import PixelTransitionSource from './PixelTransition.jsx';
import AnimatedContentSource from './AnimatedContent.jsx';
import CountUpSource from './CountUp.jsx';
import DecryptedTextSource from './DecryptedText.jsx';
import GlitchTextSource from './GlitchText.jsx';

// Backgrounds / text (Phase 1)
export const BlurText = withSafeFallback('BlurText', BlurTextSource);
export const GradientText = withSafeFallback('GradientText', GradientTextSource);
export const GridMotion = withSafeFallback('GridMotion', GridMotionSource);
export const ShinyText = withSafeFallback('ShinyText', ShinyTextSource);
export const SpotlightCard = withSafeFallback('SpotlightCard', SpotlightCardSource);
export const StarBorder = withSafeFallback('StarBorder', StarBorderSource);

// Hover / pointer interactions
export const ClickSpark = withSafeFallback('ClickSpark', ClickSparkSource);
export const GlareHover = withSafeFallback('GlareHover', GlareHoverSource);
export const Magnet = withSafeFallback('Magnet', MagnetSource);
export const PixelTransition = withSafeFallback('PixelTransition', PixelTransitionSource);

// Scroll / mount / text animations
export const AnimatedContent = withSafeFallback('AnimatedContent', AnimatedContentSource);
export const CountUp = withSafeFallback('CountUp', CountUpSource);
export const DecryptedText = withSafeFallback('DecryptedText', DecryptedTextSource);
export const GlitchText = withSafeFallback('GlitchText', GlitchTextSource);
```

## `client/src/components/reactbits/safe.js`

```js
import { createElement } from 'react';
import PolishBoundary from '../common/PolishBoundary.jsx';

/**
 * Wraps a vendored React Bits component in a local error boundary.
 *
 * The fallback is deliberately boring but complete: the same text, link or
 * children with the same class names, so layout and content survive even when
 * gsap / canvas / observers fail. This keeps the "React Bits for polish only"
 * rule honest — animations never become a single point of failure.
 */

// Components that render a block wrapper in their normal implementation.
const BLOCK = new Set([
  'BlurText', 'SpotlightCard', 'ClickSpark', 'GlareHover', 'Magnet',
  'PixelTransition', 'AnimatedContent',
]);

// Purely decorative: nothing is lost if we drop it.
const DECORATIVE = new Set(['GridMotion']);

function staticFallback(name, props) {
  if (DECORATIVE.has(name)) return null;

  const Tag = props.as || (BLOCK.has(name) ? 'div' : 'span');
  const passthrough = { className: props.className, style: props.style };

  // StarBorder is used with `as={Link} to="/register"`; keep navigation alive.
  if (typeof Tag !== 'string') {
    if (props.to) passthrough.to = props.to;
    if (props.href) passthrough.href = props.href;
  }

  let content = props.children ?? props.text ?? props.firstContent ?? null;
  if (content == null && typeof props.to !== 'string' && props.to != null) {
    // CountUp: render the final number rather than an empty placeholder.
    content = `${props.to}${props.suffix ?? ''}`;
  }

  return createElement(Tag, passthrough, content);
}

export default function withSafeFallback(name, Component) {
  function SafeBitsComponent(props) {
    return createElement(
      PolishBoundary,
      { name, fallback: () => staticFallback(name, props) },
      createElement(Component, props),
    );
  }

  SafeBitsComponent.displayName = `Safe(${name})`;
  return SafeBitsComponent;
}
```

## `client/src/components/ui/Alert.jsx`

```jsx
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const VARIANTS = {
  error: { Icon: AlertCircle, classes: 'border-danger/30 bg-danger/8 text-danger' },
  success: { Icon: CheckCircle2, classes: 'border-success/30 bg-success/8 text-success' },
  warning: { Icon: TriangleAlert, classes: 'border-warning/30 bg-warning/8 text-warning' },
  info: { Icon: Info, classes: 'border-primary/30 bg-primary/8 text-primary' },
};

export default function Alert({ variant = 'info', title, children, className, onDismiss }) {
  const { Icon, classes } = VARIANTS[variant] ?? VARIANTS.info;
  return (
    <div role="alert" className={cn('flex gap-3 rounded-xl border px-4 py-3 text-sm', classes, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn('text-ink/80', title && 'mt-1')}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} className="text-xs underline underline-offset-2" aria-label="Dismiss">
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
```

## `client/src/components/ui/Badge.jsx`

```jsx
import { cn } from '../../lib/cn.js';

const VARIANTS = {
  neutral: 'bg-surface-2 text-muted border-line',
  primary: 'bg-primary/12 text-primary border-primary/25',
  accent: 'bg-accent/12 text-accent border-accent/25',
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/10 text-warning border-warning/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
};

export default function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

## `client/src/components/ui/Button.jsx`

```jsx
import { forwardRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const VARIANTS = {
  primary: 'bg-primary text-primary-ink hover:bg-primary-hover shadow-sm',
  secondary: 'bg-surface-2 text-ink hover:bg-line/60 border border-line',
  outline: 'border border-line bg-transparent text-ink hover:bg-surface-2',
  ghost: 'bg-transparent text-muted hover:bg-surface-2 hover:text-ink',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, type = 'button', ...props },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'enabled:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});

export default Button;
```

## `client/src/components/ui/Card.jsx`

```jsx
import { cn } from '../../lib/cn.js';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('ag-card shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, title, description, action }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4', className)}>
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('px-5 py-5', className)}>{children}</div>;
}

export default Card;
```

## `client/src/components/ui/EmptyState.jsx`

```jsx
import { cn } from '../../lib/cn.js';

/** Used for real empty data (Phase 2 modules) — React Bits may decorate it. */
export default function EmptyState({ icon: Icon, title, description, action, className, compact = false }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/50 text-center',
        compact ? 'gap-2 px-5 py-8' : 'gap-3 px-6 py-14',
        className,
      )}
    >
      {Icon ? (
        <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? <p className="max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
```

## `client/src/components/ui/Input.jsx`

```jsx
import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn.js';

/** Accessible text input with label, hint, error and optional leading icon. */
const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, trailing, className, containerClassName, id, required, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-1 text-danger" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        ) : null}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink',
            'placeholder:text-muted/70 transition-colors',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            Icon && 'pl-10',
            trailing && 'pr-12',
            error && 'border-danger focus:border-danger focus:ring-danger/25',
            className,
          )}
          {...props}
        />
        {trailing ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div> : null}
      </div>
      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : null}
    </div>
  );
});

export default Input;
```

## `client/src/components/ui/Logo.jsx`

```jsx
import { cn } from '../../lib/cn.js';

/** Original mark: a graph of connected nodes inside a rounded hexagon. */
export default function Logo({ size = 'md', showWordmark = false, className }) {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('relative inline-flex shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/30', box)}>
        <svg viewBox="0 0 40 40" className="h-3/5 w-3/5" fill="none" aria-hidden="true">
          <path
            d="M20 3.5 34 11.5v17L20 36.5 6 28.5v-17L20 3.5Z"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            strokeLinejoin="round"
          />
          <path d="M20 12v8m0 0-6 6m6-6 6 6" stroke="currentColor" strokeWidth="2" className="text-accent" strokeLinecap="round" />
          <circle cx="20" cy="11" r="2.6" className="fill-primary" />
          <circle cx="13" cy="27" r="2.6" className="fill-accent" />
          <circle cx="27" cy="27" r="2.6" className="fill-accent" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="text-lg font-bold tracking-tight text-ink">
          Algo<span className="text-primary">Nest</span>
        </span>
      ) : null}
    </span>
  );
}
```

## `client/src/components/ui/Select.jsx`

```jsx
import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-line bg-surface px-3.5 pr-10 text-sm text-ink',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            error && 'border-danger',
            className,
          )}
          {...props}
        >
          {placeholder ? <option value="" disabled>{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
      {hint && !error ? <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
});

export default Select;
```

## `client/src/components/ui/Skeleton.jsx`

```jsx
import { cn } from '../../lib/cn.js';

export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-2', className)} aria-hidden="true" />;
}
```

## `client/src/components/ui/Spinner.jsx`

```jsx
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import Logo from './Logo.jsx';

export function Spinner({ className, label = 'Loading' }) {
  return (
    <LoaderCircle className={cn('h-5 w-5 animate-spin text-primary', className)} role="status" aria-label={label} />
  );
}

export function FullPageLoader({ label = 'Preparing your workspace…' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas text-ink">
      <Logo size="lg" showWordmark />
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Spinner;
```

## `client/src/components/ui/ThemeToggle.jsx`

```jsx
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore.js';
import { cn } from '../../lib/cn.js';

export default function ThemeToggle({ className, withLabel = false }) {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggle);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-muted transition-colors hover:text-ink',
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      {withLabel ? <span>{isDark ? 'Light' : 'Dark'}</span> : null}
    </button>
  );
}
```

## `client/src/features/auth/api/authApi.js`

```js
import { api, refreshSession } from '../../../lib/apiClient.js';

// A single cached boot promise prevents React StrictMode's double effect from
// firing two refreshes (the second would look like refresh-token reuse).
let bootstrapPromise = null;

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout', {}),
  logoutAll: () => api.post('/auth/logout-all', {}),
  me: () => api.get('/auth/me'),
  refresh: () => refreshSession(),
  updateGoal: (payload) => api.patch('/users/me/goal', payload),
  updateProfile: (payload) => api.patch('/users/me', payload),

  bootstrap: () => {
    if (!bootstrapPromise) bootstrapPromise = refreshSession();
    return bootstrapPromise;
  },
  resetBootstrap: () => {
    bootstrapPromise = null;
  },
};

export default authApi;
```

## `client/src/features/auth/components/AuthGate.jsx`

```jsx
import { useEffect, useState } from 'react';
import { setUnauthorizedHandler } from '../../../lib/apiClient.js';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useThemeStore } from '../../../store/themeStore.js';
import authApi from '../api/authApi.js';
import { useAuthStore } from '../store/authStore.js';

/**
 * Bootstraps the session from the httpOnly refresh cookie before rendering any
 * route, and wires the apiClient's "session lost" callback to the auth store.
 */
export default function AuthGate({ children }) {
  const [ready, setReady] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    let alive = true;
    authApi
      .bootstrap()
      .then((data) => {
        if (alive) setSession(data.user);
      })
      .catch(() => {
        if (alive) clear();
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [setSession, clear]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clear();
    });
    return () => setUnauthorizedHandler(null);
  }, [clear]);

  useEffect(() => {
    useThemeStore.getState().apply();
  }, []);

  if (!ready) return <FullPageLoader />;
  return children;
}
```

## `client/src/features/auth/components/AuthShell.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '../../../components/ui/Logo.jsx';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';
import { ShinyText } from '../../../components/reactbits/index.js';
import { useIsDark } from '../../../store/themeStore.js';

/** Shared chrome for login / register / onboarding (React Bits used sparingly). */
export default function AuthShell({ title, subtitle, children, footer, wide = false }) {
  const isDark = useIsDark();

  return (
    <div className="relative min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="ag-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      {/* Brand / value panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface/40 px-12 py-10 lg:flex">
        <div
          className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/12 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-52 -right-32 h-96 w-96 rounded-full bg-accent/12 blur-3xl"
          aria-hidden="true"
        />
        <Link to="/" className="relative inline-flex w-fit items-center transition-transform duration-200 hover:scale-[1.03]" aria-label="AlgoNest home">
          <Logo showWordmark size="lg" />
        </Link>

        <div className="relative max-w-md">
          <ShinyText
            text="YOUR PREP, ORGANISED"
            speed={3}
            color={isDark ? '#94a5bd' : '#56657a'}
            shineColor={isDark ? '#2dd4bf' : '#0d9488'}
            className="text-xs font-bold tracking-[0.24em]"
          />
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink">
            Stop guessing what to<br />
            <span className="text-primary">study tomorrow.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Curated DSA sheets, timed quizzes, full-length mocks and a daily plan that adapts when life gets in the way.
          </p>
          <ul className="mt-9 space-y-4 text-sm text-ink/85">
            <li className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1"><Sparkles className="h-4 w-4 text-accent" aria-hidden="true" /> One clear next task, every single day</li>
            <li className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Your notes and progress stay yours</li>
          </ul>
        </div>

        <p className="relative text-xs text-muted">© {new Date().getFullYear()} AlgoNest · Built for placements, not procrastination.</p>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="lg:hidden"><Logo showWordmark /></Link>
          <span className="hidden lg:block" />
          <ThemeToggle />
        </div>

        <div className={`mx-auto flex w-full flex-1 flex-col justify-center py-10 ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <div className="ag-rise">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p> : null}
          </div>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
```

## `client/src/features/auth/components/GuestRoute.jsx`

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useAuthStore } from '../store/authStore.js';

/** Keeps signed-in users away from /login and /register. */
export default function GuestRoute() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader />;
  if (status === 'authenticated') {
    const destination = !user?.onboardingCompleted || !user?.goal ? '/onboarding' : '/app';
    return <Navigate to={destination} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
```

## `client/src/features/auth/components/ProtectedRoute.jsx`

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useAuthStore } from '../store/authStore.js';

/** Blocks unauthenticated users; optionally forces onboarding goal selection. */
export default function ProtectedRoute({ requireOnboarding = true }) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader />;
  if (status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (requireOnboarding && (!user?.onboardingCompleted || !user?.goal)) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}
```

## `client/src/features/auth/hooks/useAuth.js`

```js
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAccessToken } from '../../../lib/apiClient.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import authApi from '../api/authApi.js';
import { useAuthStore } from '../store/authStore.js';

/** Everything session-related in one hook; components never touch the store directly. */
export function useAuth() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  const applySession = useCallback(
    (data) => {
      setAccessToken(data.accessToken);
      setSession(data.user);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      return data;
    },
    [queryClient, setSession],
  );

  const login = useMutation({ mutationFn: authApi.login, onSuccess: applySession });
  const register = useMutation({ mutationFn: authApi.register, onSuccess: applySession });

  const updateGoal = useMutation({
    mutationFn: authApi.updateGoal,
    onSuccess: ({ user: updated }) => {
      setUser(updated);
      queryClient.setQueryData(queryKeys.auth.me, updated);
    },
  });

  const updateProfile = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ user: updated }) => {
      setUser(updated);
      queryClient.setQueryData(queryKeys.auth.me, updated);
    },
  });

  // `onSettled` means the local session is cleared even if the network is down.
  const clearLocalSession = useCallback(() => {
    setAccessToken(null);
    clear();
    authApi.resetBootstrap();
    queryClient.clear();
  }, [clear, queryClient]);

  const logout = useMutation({ mutationFn: authApi.logout, onSettled: clearLocalSession });
  const logoutAll = useMutation({ mutationFn: authApi.logoutAll, onSettled: clearLocalSession });

  return { user, status, login, register, updateGoal, updateProfile, logout, logoutAll };
}

export default useAuth;
```

## `client/src/features/auth/pages/LoginPage.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { loginSchema, zodFieldErrors } from '@algonest/shared';
import AuthShell from '../components/AuthShell.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [clientErrors, setClientErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const destination = location.state?.from?.startsWith('/app') ? location.state.from : '/app';
  const serverErrors = login.error instanceof ApiClientError ? login.error.fieldErrors : {};
  const errors = { ...serverErrors, ...clientErrors };
  const generalError = login.error && Object.keys(serverErrors).length === 0 ? login.error.message : null;

  const update = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setClientErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setClientErrors({});
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setClientErrors(zodFieldErrors(parsed.error));
      return;
    }
    login.mutate(parsed.data, { onSuccess: () => navigate(destination, { replace: true }) });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up exactly where your plan left off."
      footer={<>New to AlgoNest? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {generalError ? <Alert variant="error" title="Could not sign in">{generalError}</Alert> : null}

        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@college.edu"
          icon={Mail}
          required
          value={values.email}
          onChange={update('email')}
          error={errors.email}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            icon={LockKeyhole}
            required
            value={values.password}
            onChange={update('password')}
            error={errors.password}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="rounded-lg p-1.5 text-muted hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
          {!login.isPending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </Button>

        <p className="text-center text-xs text-muted">
          Your session refreshes automatically. Accounts are locked for 15 minutes after 5 failed attempts.
        </p>
      </form>
    </AuthShell>
  );
}
```

## `client/src/features/auth/pages/OnboardingPage.jsx`

```jsx
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, CalendarRange, Code2, Sprout, Trophy } from 'lucide-react';
import { GOAL_OPTIONS, PREFERRED_LANGUAGE_LABELS, onboardingSchema, zodFieldErrors } from '@algonest/shared';
import AuthShell from '../components/AuthShell.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Select from '../../../components/ui/Select.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { cn } from '../../../lib/cn.js';

const GOAL_ICONS = {
  sprout: Sprout,
  briefcase: Briefcase,
  code: Code2,
  trophy: Trophy,
  calendar: CalendarRange,
};

const LANGUAGE_OPTIONS = Object.entries(PREFERRED_LANGUAGE_LABELS).map(([value, label]) => ({ value, label }));

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateGoal } = useAuth();
  const [goal, setGoal] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('javascript');
  const [clientErrors, setClientErrors] = useState({});

  if (user?.onboardingCompleted && user?.goal) return <Navigate to="/app" replace />;

  const serverErrors = updateGoal.error instanceof ApiClientError ? updateGoal.error.fieldErrors : {};
  const generalError = updateGoal.error && Object.keys(serverErrors).length === 0 ? updateGoal.error.message : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsed = onboardingSchema.safeParse({ goal, preferredLanguage });
    if (!parsed.success) {
      setClientErrors(zodFieldErrors(parsed.error));
      return;
    }
    setClientErrors({});
    updateGoal.mutate(parsed.data, { onSuccess: () => navigate('/app', { replace: true }) });
  };

  return (
    <AuthShell
      wide
      title="What are you preparing for?"
      subtitle="Pick the closest goal. It shapes your daily plan, recommended sheets and mock tests — you can change it later in Settings."
      footer={<Badge variant="primary">Step 1 of 1 · Takes 10 seconds</Badge>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {generalError ? <Alert variant="error" title="Could not save your goal">{generalError}</Alert> : null}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ink">Your primary goal</legend>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Primary goal">
            {GOAL_OPTIONS.map((option) => {
              const Icon = GOAL_ICONS[option.icon] ?? Sprout;
              const selected = goal === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-all',
                    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary',
                    selected ? 'border-primary bg-primary/8 ag-ring' : 'border-line bg-surface hover:border-primary/50',
                  )}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={option.value}
                    checked={selected}
                    onChange={() => {
                      setGoal(option.value);
                      setClientErrors((previous) => ({ ...previous, goal: undefined }));
                    }}
                    className="sr-only"
                  />
                  <span className={cn('mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', selected ? 'bg-primary text-primary-ink' : 'bg-surface-2 text-muted')}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{option.description}</span>
                  </span>
                  {selected ? <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> : null}
                </label>
              );
            })}
          </div>
          {clientErrors.goal || serverErrors.goal ? (
            <p role="alert" className="mt-2 text-xs font-medium text-danger">{clientErrors.goal || serverErrors.goal}</p>
          ) : null}
        </fieldset>

        <Select
          label="Preferred coding language"
          value={preferredLanguage}
          onChange={(event) => setPreferredLanguage(event.target.value)}
          options={LANGUAGE_OPTIONS}
          hint="Used for code snippets and solution explanations."
          error={clientErrors.preferredLanguage || serverErrors.preferredLanguage}
        />

        <Button type="submit" size="lg" className="w-full" loading={updateGoal.isPending}>
          {updateGoal.isPending ? 'Building your plan…' : 'Save goal and continue'}
          {!updateGoal.isPending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </Button>
      </form>
    </AuthShell>
  );
}
```

## `client/src/features/auth/pages/RegisterPage.jsx`

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { passwordSchema, registerSchema, zodFieldErrors } from '@algonest/shared';
import AuthShell from '../components/AuthShell.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

const PASSWORD_RULES = [
  { label: '10+ characters', test: (value) => value.length >= 10 },
  { label: 'Upper & lowercase', test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: 'A number', test: (value) => /[0-9]/.test(value) },
  { label: 'A symbol', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [clientErrors, setClientErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const serverErrors = register.error instanceof ApiClientError ? register.error.fieldErrors : {};
  const errors = { ...serverErrors, ...clientErrors };
  const generalError = register.error && Object.keys(serverErrors).length === 0 ? register.error.message : null;

  const update = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setClientErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    const parsed = registerSchema.safeParse({ name: values.name, email: values.email, password: values.password });
    if (!parsed.success) Object.assign(nextErrors, zodFieldErrors(parsed.error));
    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    register.mutate(parsed.data, { onSuccess: () => navigate('/onboarding', { replace: true }) });
  };

  const passwordStrength = PASSWORD_RULES.filter((rule) => rule.test(values.password)).length;
  const strengthOk = passwordSchema.safeParse(values.password).success;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. One goal, one plan, real progress."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {generalError ? <Alert variant="error" title="Could not create account">{generalError}</Alert> : null}

        <Input label="Full name" name="name" autoComplete="name" placeholder="Ada Lovelace" icon={UserRound} required value={values.name} onChange={update('name')} error={errors.name} />
        <Input label="Email address" type="email" name="email" autoComplete="email" placeholder="you@college.edu" icon={Mail} required value={values.email} onChange={update('email')} error={errors.email} />

        <div>
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            icon={LockKeyhole}
            required
            value={values.password}
            onChange={update('password')}
            error={errors.password}
            trailing={
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="rounded-lg p-1.5 text-muted hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1" aria-live="polite">
            {PASSWORD_RULES.map((rule) => {
              const passed = rule.test(values.password);
              return (
                <span key={rule.label} className={`text-[11px] ${passed ? 'text-success' : 'text-muted'}`}>
                  {passed ? '✓' : '○'} {rule.label}
                </span>
              );
            })}
            <span className="sr-only">{strengthOk ? 'Password strong enough' : `${passwordStrength} of 4 rules met`}</span>
          </div>
        </div>

        <Input
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={LockKeyhole}
          required
          value={values.confirmPassword}
          onChange={update('confirmPassword')}
          error={clientErrors.confirmPassword}
        />

        <Button type="submit" size="lg" className="w-full" loading={register.isPending}>
          {register.isPending ? 'Creating account…' : 'Create account'}
          {!register.isPending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted">
          By continuing you agree to use AlgoNest responsibly. We hash your password with bcrypt and never store it in plain text.
        </p>
      </form>
    </AuthShell>
  );
}
```

## `client/src/features/auth/store/authStore.js`

```js
import { create } from 'zustand';
import { ROLES } from '@algonest/shared';

const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.CONTENT_MODERATOR,
  ROLES.CONTENT_EDITOR,
  ROLES.SUPPORT_ANALYST,
];

/**
 * Session UI state. The access token is deliberately NOT here (or in local
 * storage) — it lives in the apiClient module's memory only.
 */
export const useAuthStore = create((set) => ({
  user: null,
  status: 'loading', // 'loading' | 'authenticated' | 'guest'
  setSession: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
  clear: () => set({ user: null, status: 'guest' }),
}));

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsStaff = () => useAuthStore((state) => STAFF_ROLES.includes(state.user?.role));
export const useHasCompletedOnboarding = () =>
  useAuthStore((state) => Boolean(state.user?.onboardingCompleted && state.user?.goal));
```

## `client/src/features/home/pages/HomePage.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Flame, Goal, ListChecks, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { GOAL_OPTIONS, ROLE_LABELS } from '@algonest/shared/constants';
import { Magnet, ShinyText, SpotlightCard } from '../../../components/reactbits/index.js';
import { useCurrentUser } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';

export default function HomePage() {
  const user = useCurrentUser();
  const isDark = useIsDark();
  const goalLabel = GOAL_OPTIONS.find((option) => option.value === user?.goal)?.label ?? 'Not set';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const stats = [
    { label: 'Current streak', Icon: Flame, iconClass: 'text-warning', value: user?.streak?.current ?? 0, unit: 'days', hint: `Best: ${user?.streak?.longest ?? 0} days` },
    { label: 'Your goal', Icon: Goal, iconClass: 'text-primary', value: goalLabel, hint: 'Shapes your daily plan', small: true },
    { label: 'Preferred language', Icon: ListChecks, iconClass: 'text-accent', value: user?.preferredLanguage ?? 'Not set', hint: 'Used in code explanations', small: true },
    { label: 'Account', Icon: ShieldCheck, iconClass: 'text-success', value: ROLE_LABELS[user?.role] ?? 'Student', hint: user?.email, badge: true },
  ];

  return (
    <div className="space-y-7">
      {/* Header polish — CSS reveal + React Bits text animation (no gsap needed) */}
      <div className="ag-rise">
        <ShinyText
          text="YOUR WORKSPACE"
          speed={4}
          color={isDark ? '#94a5bd' : '#56657a'}
          shineColor={isDark ? '#2dd4bf' : '#0d9488'}
          className="text-[11px] font-bold tracking-[0.2em]"
        />
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Good to see you, {firstName}.</h1>
        <p className="mt-1.5 text-sm text-muted">Here’s your preparation at a glance. Everything else is one click away.</p>
        <div className="mt-3">
          <ShinyText
            text="PHASE_01 // FOUNDATION_READY"
            speed={3}
            color={isDark ? '#94a5bd' : '#56657a'}
            shineColor={isDark ? '#a78bfa' : '#7c3aed'}
            className="font-mono text-[11px] tracking-[0.14em]"
          />
        </div>
      </div>

      {/* Stats — staggered CSS reveal, hover lift */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.Icon;
          return (
            <Card
              key={stat.label}
              className="ag-rise p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.iconClass}`} aria-hidden="true" />
              </div>
              {stat.badge ? (
                <div className="mt-3"><Badge variant="primary">{stat.value}</Badge></div>
              ) : (
                <p className={`mt-3 font-bold text-ink ${stat.small ? 'truncate text-lg' : 'text-3xl'}`}>
                  {stat.value}
                  {stat.unit ? <span className="ml-1.5 text-sm font-medium text-muted">{stat.unit}</span> : null}
                </p>
              )}
              <p className="mt-1 truncate text-xs text-muted">{stat.hint}</p>
            </Card>
          );
        })}
      </div>

      {/* "What should I do now" */}
      <SpotlightCard
        theme={isDark ? 'dark' : 'light'}
        spotlightColor={isDark ? '#2dd4bf' : '#0d9488'}
        className="border border-line p-6 transition-colors duration-300 hover:border-primary/40 sm:p-8"
        style={{
          '--spotlight-card-surface': 'var(--ag-surface)',
          '--spotlight-card-border': 'var(--ag-line)',
          '--spotlight-card-shadow': 'none',
        }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> What should I do now
            </span>
            <h2 className="mt-4 text-xl font-bold text-ink sm:text-2xl">Start with a sheet, keep the streak alive.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Your adaptive daily plan arrives in Phase 5. Until then, the fastest way to build momentum is to open a sheet and solve the first unsolved problem.
            </p>
          </div>
          <Magnet magnetStrength={3} maxOffset={10} padding={28}>
            <Link to="/app/sheets" className="block">
              <Button size="lg" className="gap-2">Browse sheets <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            </Link>
          </Magnet>
        </div>
      </SpotlightCard>

      {/* Data-heavy area stays plain Tailwind */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
          <CardHeader title="Today’s tasks" description="Your daily plan will live here." action={<CalendarClock className="h-5 w-5 text-muted" aria-hidden="true" />} />
          <CardBody>
            <EmptyState compact icon={ListChecks} title="No tasks yet" description="Adaptive plans ship in Phase 5. Your streak is already being tracked." />
          </CardBody>
        </Card>
        <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
          <CardHeader title="Weak topics" description="Computed from quiz and mock results." action={<Target className="h-5 w-5 text-muted" aria-hidden="true" />} />
          <CardBody>
            <EmptyState compact icon={Target} title="No analytics yet" description="Attempt a quiz or mock once those modules are live and this fills up automatically." />
          </CardBody>
        </Card>
        <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
          <CardHeader title="Upcoming mock" description="Scheduled full-length tests." action={<CalendarClock className="h-5 w-5 text-muted" aria-hidden="true" />} />
          <CardBody>
            <EmptyState compact icon={CalendarClock} title="Nothing scheduled" description="Mock tests with sections and negative marking arrive in Phase 4." />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
```

## `client/src/features/landing/components/MicroInteractions.jsx`

```jsx
import { ArrowUpRight, MousePointer2, Sparkles, WandSparkles } from 'lucide-react';
import {
  AnimatedContent, ClickSpark, DecryptedText, GlareHover, Magnet, PixelTransition,
} from '../../../components/reactbits/index.js';
import { useIsDark } from '../../../store/themeStore.js';

/**
 * Polish-only band that puts the React Bits hover components to work on real
 * product copy. Every tile is keyboard reachable and readable without hover.
 */
export default function MicroInteractions() {
  const isDark = useIsDark();
  const teal = isDark ? '#2dd4bf' : '#0d9488';
  const purple = isDark ? '#a78bfa' : '#7c3aed';

  return (
    <section id="interactions" className="border-b border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <AnimatedContent distance={28} duration={0.7} trigger="scroll" once>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Micro-interactions</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              A little motion, a lot of <span className="text-primary">focus</span>.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Hover, move or tap anywhere in these cards. The effects are decorative — never required to read the content.
            </p>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={40}
          duration={0.7}
          trigger="scroll"
          stagger={0.12}
          once
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {/* 1 — GlareHover */}
          <GlareHover
            width="100%"
            height="100%"
            borderRadius="16px"
            borderColor="transparent"
            background="var(--ag-surface)"
            glareColor={teal}
            glareOpacity={0.4}
            glareSize={38}
            glareAngle={-35}
            transitionDuration={600}
            className="min-h-[270px] w-full border border-line"
          >
            <div className="flex h-full w-full flex-col justify-between p-6 text-left">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <MousePointer2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">Glare on hover</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  A light sweep follows your cursor across every sheet and feature card. Subtle by design, never blinding.
                </p>
              </div>
            </div>
          </GlareHover>

          {/* 2 — Magnet + ClickSpark */}
          <div className="relative flex min-h-[270px] w-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
              <WandSparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-ink">Magnetic pull + click spark</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Primary actions lean toward your pointer and burst into sparks when you commit.
              </p>
            </div>
            <div className="mt-5 h-14 w-full">
              <ClickSpark
                sparkColor={purple}
                sparkCount={10}
                sparkRadius={26}
                sparkSize={10}
                sparkWidth={2}
                duration={520}
                className="flex h-full w-full items-center justify-center"
              >
                <Magnet magnetStrength={3} maxOffset={12} padding={28}>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 text-sm font-semibold text-ink transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" /> Try the pull
                  </button>
                </Magnet>
              </ClickSpark>
            </div>
          </div>

          {/* 3 — PixelTransition */}
          <PixelTransition
            firstContent={
              <div className="flex h-full w-full flex-col justify-between bg-surface p-6 text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warning/12 text-warning">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">Hover to reveal</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">Focus or hover this card to flip the pixel grid.</p>
                </div>
              </div>
            }
            secondContent={
              <div className="flex h-full w-full flex-col justify-between bg-primary/10 p-6 text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">Today’s first task</h3>
                  <p className="mt-2 font-mono text-xs text-primary">arrays → two_sum → easy → 20 min</p>
                </div>
              </div>
            }
            gridSize={9}
            pixelColor={teal}
            pixelShape="rounded"
            animationStepDuration={0.32}
            aspectRatio="4 / 3"
            className="w-full"
            style={{ width: '100%', borderRadius: 16, border: '1px solid var(--ag-line)' }}
          />
        </AnimatedContent>

        <div className="mt-9 text-center">
          <DecryptedText
            text="SMALL INTERACTIONS · ZERO DISTRACTIONS"
            animateOn="hover"
            speed={35}
            maxIterations={12}
            useOriginalCharsOnly
            className="font-mono text-[11px] font-semibold tracking-[0.18em] text-muted"
            encryptedClassName="text-primary"
            parentClassName="inline-block cursor-pointer rounded-md px-2 py-1"
          />
        </div>
      </div>
    </section>
  );
}
```

## `client/src/features/landing/pages/LandingPage.jsx`

```jsx
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, CalendarClock,
  Check, CirclePlay, Layers3, LockKeyhole, Sparkles, Target, Zap,
} from 'lucide-react';
import {
  AnimatedContent, BlurText, ClickSpark, CountUp, GlareHover, GradientText,
  GridMotion, Magnet, ShinyText, SpotlightCard, StarBorder,
} from '../../../components/reactbits/index.js';
import MicroInteractions from '../components/MicroInteractions.jsx';
import Logo from '../../../components/ui/Logo.jsx';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';
import Button from '../../../components/ui/Button.jsx';
import { useIsDark } from '../../../store/themeStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const TOPICS = [
  'Arrays', 'Two Pointers', 'Binary Search', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'Greedy', 'Heaps', 'Tries', 'Recursion', 'Sorting',
  'Sliding Window', 'Backtracking', 'BFS / DFS', 'Bit Manipulation', 'Strings',
  'Stacks & Queues', 'Hashing', 'Intervals', 'Math', 'Big-O', 'Segment Trees', 'Topo Sort',
];

const FEATURES = [
  {
    icon: Layers3,
    title: 'Sheets that build on each other',
    text: 'Curated, structured progressions with external problem links, personal notes, bookmarks and ratings. Clone any sheet and make it yours.',
  },
  {
    icon: BrainCircuit,
    title: 'Seven question types',
    text: 'MCQ, multi-select, true/false, ordering, matching, code-output and fill-in-the-blank — with timers, attempts and real explanations.',
  },
  {
    icon: CalendarClock,
    title: 'A plan that forgives you',
    text: 'Daily task distribution, automatic rescheduling of missed days and overload warnings when you bite off more than you can chew.',
  },
  {
    icon: BarChart3,
    title: 'Mocks that feel like the real thing',
    text: 'Sections, negative marking, question palette, mark-for-review, autosave and auto-submit — followed by honest result analysis.',
  },
  {
    icon: BookOpenCheck,
    title: 'One trustworthy resource library',
    text: 'Vetted YouTube, article, GitHub and PDF links with filters, saving, ratings and reports. No more 40-tab chaos.',
  },
  {
    icon: LockKeyhole,
    title: 'Your data stays yours',
    text: 'Progress, notes and personal resources live separately from shared content, so the original sheet is never modified by a student.',
  },
];

const STEPS = [
  { number: '01', title: 'Pick your goal', text: 'Beginner, placements, LeetCode, competitive programming or a 60-day interview sprint.' },
  { number: '02', title: 'Follow today’s plan', text: 'One dashboard answers “what should I do now?” — tasks, streak, weak topics, next mock.' },
  { number: '03', title: 'Measure and adapt', text: 'Quizzes and mocks surface weak topics; the next day’s plan quietly rebalances.' },
];

const STATS = [
  { to: 7, suffix: '', label: 'question types' },
  { to: 60, suffix: '', label: 'day interview track' },
  { to: 100, suffix: '%', label: 'your own progress data' },
];

export default function LandingPage() {
  const isDark = useIsDark();
  const status = useAuthStore((state) => state.status);
  const isSignedIn = status === 'authenticated';
  const primaryDestination = isSignedIn ? '/app' : '/register';
  const teal = isDark ? '#2dd4bf' : '#0d9488';

  return (
    <div className="min-h-screen overflow-hidden bg-canvas text-ink">
      <a href="#main-landing" className="skip-link">Skip to content</a>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8">
          <Link to="/" aria-label="AlgoNest home" className="transition-transform duration-200 hover:scale-[1.03]">
            <Logo showWordmark />
          </Link>
          <nav className="ml-8 hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Marketing">
            <a href="#features" className="transition-colors duration-200 hover:text-primary">Features</a>
            <a href="#interactions" className="transition-colors duration-200 hover:text-primary">Interactions</a>
            <a href="#how-it-works" className="transition-colors duration-200 hover:text-primary">How it works</a>
            <a href="#trust" className="transition-colors duration-200 hover:text-primary">Why AlgoNest</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {isSignedIn ? (
              <Link to="/app" className="hidden sm:block"><Button size="sm">Dashboard</Button></Link>
            ) : (
              <Link to="/login" className="hidden sm:block"><Button variant="ghost" size="sm">Sign in</Button></Link>
            )}
            <Magnet magnetStrength={3.2} maxOffset={10} padding={24}>
              <Link to={primaryDestination}>
                <Button size="sm" className="gap-1.5 transition-transform duration-200 hover:-translate-y-0.5">
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Magnet>
          </div>
        </div>
      </header>

      <main id="main-landing">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
            <GridMotion
              items={TOPICS}
              rows={4}
              angle={-12}
              tilt={8}
              speed={22}
              gap={14}
              radius={14}
              spotlight={0.55}
              dim={0.62}
              fade={0.72}
              theme={isDark ? 'dark' : 'light'}
              tileColor={isDark ? '#121c2c' : '#eef3f9'}
              textColor={isDark ? '#94a5bd' : '#56657a'}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/85 to-canvas" aria-hidden="true" />

          <ClickSpark
            sparkColor={teal}
            sparkCount={9}
            sparkRadius={30}
            sparkSize={10}
            sparkWidth={2}
            duration={520}
            className="relative mx-auto w-full max-w-5xl px-5 py-24 text-center sm:px-8"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 transition-colors duration-300 hover:border-primary/60">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <ShinyText
                text="STRUCTURED DSA PREP, BUILT FOR PLACEMENTS"
                speed={3.5}
                color={isDark ? '#94a5bd' : '#56657a'}
                shineColor={isDark ? '#5eead4' : '#0d9488'}
                className="text-[10px] font-bold tracking-[0.18em] sm:text-xs"
              />
            </div>

            <BlurText
              text="Master DSA with a plan that actually adapts."
              animateBy="words"
              direction="top"
              delay={90}
              stepDuration={0.32}
              className="mx-auto max-w-4xl justify-center text-center text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            />

            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Curated sheets, serious quizzes, full-length mock tests and a daily plan that reshuffles itself when you miss a day.
              <GradientText colors={['#2dd4bf', '#a78bfa', '#2dd4bf']} animationSpeed={9} className="font-semibold">
                {' '}Less guessing. More solving.
              </GradientText>
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnet magnetStrength={3.2} maxOffset={14} padding={40}>
                <StarBorder
                  as={Link}
                  to={primaryDestination}
                  radius={12}
                  thickness={1.2}
                  duration={4.5}
                  glow={0.7}
                  color={isDark ? '#5eead4' : '#ffffff'}
                  backgroundColor={teal}
                  textColor={isDark ? '#04201d' : '#ffffff'}
                  borderColor="transparent"
                  className="px-7 py-3.5 text-sm font-bold"
                >
                  {isSignedIn ? 'Open my dashboard' : 'Start preparing — it’s free'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </StarBorder>
              </Magnet>
              <a href="#how-it-works" className="transition-transform duration-200 hover:-translate-y-0.5">
                <Button variant="outline" size="lg" className="gap-2">
                  <CirclePlay className="h-4 w-4" aria-hidden="true" /> See how it works
                </Button>
              </a>
            </div>

            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-line pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-xl py-2 transition-colors duration-300 hover:bg-primary/5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold text-primary sm:text-3xl">
                      <CountUp
                        to={stat.to}
                        from={0}
                        duration={1.8}
                        suffix={stat.suffix}
                        trigger="view"
                        replayOnHover
                        className="cursor-pointer"
                      />
                    </span>
                    <span className="mt-1 block text-xs text-muted sm:text-sm">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </ClickSpark>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <AnimatedContent distance={30} duration={0.7} trigger="scroll" once>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">The ecosystem</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Everything you need, <GradientText colors={['#2dd4bf', '#a78bfa']} className="font-bold">connected</GradientText>.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                No scattered spreadsheets, no 30 open tabs. One coherent path from your first array problem to your final mock interview.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={46}
            duration={0.72}
            trigger="scroll"
            stagger={0.09}
            once
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlareHover
                  key={feature.title}
                  width="100%"
                  height="100%"
                  borderRadius="16px"
                  borderColor="transparent"
                  background="transparent"
                  glareColor={teal}
                  glareOpacity={0.3}
                  glareSize={34}
                  transitionDuration={620}
                  className="rounded-2xl"
                >
                  <SpotlightCard
                    theme={isDark ? 'dark' : 'light'}
                    spotlightColor={teal}
                    className="w-full border border-line p-7 transition-colors duration-300 hover:border-primary/40"
                    style={{
                      '--spotlight-card-surface': 'var(--ag-surface)',
                      '--spotlight-card-border': 'var(--ag-line)',
                      '--spotlight-card-shadow': 'none',
                    }}
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
                  </SpotlightCard>
                </GlareHover>
              );
            })}
          </AnimatedContent>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="border-y border-line bg-surface/50">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <AnimatedContent distance={28} duration={0.7} trigger="scroll" once>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">How it works</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Three steps. Then just show up.</h2>
                </div>
                <p className="max-w-md text-sm text-muted">The platform handles the planning; you handle the problems.</p>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={40}
              direction="horizontal"
              duration={0.72}
              trigger="scroll"
              stagger={0.12}
              once
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="ag-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <span className="font-mono text-sm font-bold text-primary">{step.number}</span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              ))}
            </AnimatedContent>
          </div>
        </section>

        {/* ── React Bits hover / animation showcase ───────────────────────── */}
        <MicroInteractions />

        {/* ── Trust / CTA ─────────────────────────────────────────────────── */}
        <section id="trust" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <AnimatedContent distance={36} duration={0.75} trigger="scroll" once>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Built for the long grind, not a dopamine hit.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    Short-lived access tokens, httpOnly refresh cookies, role-based access, validated inputs and versioned published content —
                    the boring engineering that keeps your preparation data safe.
                  </p>
                  <ul className="mt-7 grid gap-3 text-sm text-ink sm:grid-cols-2">
                    {['Dark & light mode', 'Keyboard accessible', 'Mobile-first quiz UI', 'Auditable content workflow'].map((item) => (
                      <li key={item} className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                        <Check className="h-4 w-4 text-primary" aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-line bg-canvas/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <Target className="h-8 w-8 text-accent" aria-hidden="true" />
                  <p className="mt-5 text-lg font-semibold text-ink">Ready to stop collecting roadmaps?</p>
                  <p className="mt-2 text-sm text-muted">Pick a goal and get your first task in under a minute.</p>
                  <Magnet magnetStrength={3} maxOffset={10} padding={26} wrapperClassName="mt-6 block w-full" innerClassName="w-full">
                    <Link to={primaryDestination} className="block w-full">
                      <Button size="lg" className="w-full gap-2"><Zap className="h-4 w-4" aria-hidden="true" /> {isSignedIn ? 'Open dashboard' : 'Create free account'}</Button>
                    </Link>
                  </Magnet>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo showWordmark size="sm" />
          <p>© {new Date().getFullYear()} AlgoNest. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/login" className="transition-colors hover:text-primary">Sign in</Link>
            <Link to="/register" className="transition-colors hover:text-primary">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

## `client/src/features/settings/pages/SettingsPage.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, ShieldCheck, UserRound } from 'lucide-react';
import { GOAL_OPTIONS, PREFERRED_LANGUAGE_LABELS, ROLE_LABELS } from '@algonest/shared/constants';
import { onboardingSchema, updateProfileSchema, zodFieldErrors } from '@algonest/shared';
import useAuth from '../../auth/hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';

const LANGUAGE_OPTIONS = Object.entries(PREFERRED_LANGUAGE_LABELS).map(([value, label]) => ({ value, label }));
const GOAL_SELECT_OPTIONS = GOAL_OPTIONS.map((option) => ({ value: option.value, label: option.label }));

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateGoal, logout, logoutAll } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name ?? '', preferredLanguage: user?.preferredLanguage ?? 'javascript' });
  const [goal, setGoal] = useState(user?.goal ?? '');
  const [profileErrors, setProfileErrors] = useState({});
  const [goalErrors, setGoalErrors] = useState({});
  const [saved, setSaved] = useState(null);

  const serverProfileErrors = updateProfile.error instanceof ApiClientError ? updateProfile.error.fieldErrors : {};
  const serverGoalErrors = updateGoal.error instanceof ApiClientError ? updateGoal.error.fieldErrors : {};

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setSaved(null);
    const parsed = updateProfileSchema.safeParse(profile);
    if (!parsed.success) {
      setProfileErrors(zodFieldErrors(parsed.error));
      return;
    }
    setProfileErrors({});
    updateProfile.mutate(parsed.data, { onSuccess: () => setSaved('Profile saved.') });
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    setSaved(null);
    const parsed = onboardingSchema.safeParse({ goal, preferredLanguage: profile.preferredLanguage });
    if (!parsed.success) {
      setGoalErrors(zodFieldErrors(parsed.error));
      return;
    }
    setGoalErrors({});
    updateGoal.mutate(parsed.data, { onSuccess: () => setSaved('Goal updated. Your plan will use it from now on.') });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1.5 text-sm text-muted">Manage your profile, preparation goal, appearance and sessions.</p>
      </div>

      {saved ? <Alert variant="success" onDismiss={() => setSaved(null)}>{saved}</Alert> : null}
      {updateProfile.error && Object.keys(serverProfileErrors).length === 0 ? (
        <Alert variant="error">{updateProfile.error.message}</Alert>
      ) : null}
      {updateGoal.error && Object.keys(serverGoalErrors).length === 0 ? (
        <Alert variant="error">{updateGoal.error.message}</Alert>
      ) : null}

      <Card>
        <CardHeader title="Profile" description="How you appear across AlgoNest." action={<UserRound className="h-5 w-5 text-muted" aria-hidden="true" />} />
        <CardBody>
          <form onSubmit={handleProfileSubmit} noValidate className="space-y-4">
            <Input
              label="Full name"
              value={profile.name}
              onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))}
              error={profileErrors.name || serverProfileErrors.name}
              autoComplete="name"
              required
            />
            <Input label="Email address" value={user?.email ?? ''} readOnly disabled hint="Email changes require support in this phase." />
            <Select
              label="Preferred coding language"
              value={profile.preferredLanguage}
              onChange={(event) => setProfile((previous) => ({ ...previous, preferredLanguage: event.target.value }))}
              options={LANGUAGE_OPTIONS}
              error={profileErrors.preferredLanguage || serverProfileErrors.preferredLanguage}
            />
            <Button type="submit" loading={updateProfile.isPending} className="gap-2">
              <Save className="h-4 w-4" aria-hidden="true" /> Save profile
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Preparation goal" description="Changing this re-targets your daily plan." />
        <CardBody>
          <form onSubmit={handleGoalSubmit} noValidate className="space-y-4">
            <Select
              label="Primary goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              options={GOAL_SELECT_OPTIONS}
              placeholder="Choose a goal"
              error={goalErrors.goal || serverGoalErrors.goal}
            />
            <Button type="submit" variant="secondary" loading={updateGoal.isPending}>Update goal</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Appearance" description="Applies instantly and is remembered on this device." />
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Theme</p>
              <p className="mt-1 text-xs text-muted">Dark navy by default; light mode has the same contrast guarantees.</p>
            </div>
            <ThemeToggle withLabel />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Account & sessions" description="Role and session controls." action={<ShieldCheck className="h-5 w-5 text-muted" aria-hidden="true" />} />
        <CardBody className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="accent">{ROLE_LABELS[user?.role] ?? 'Student'}</Badge>
            <span className="text-muted">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'today'}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2" disabled={logout.isPending} onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </Button>
            <Button variant="danger" disabled={logoutAll.isPending} onClick={() => logoutAll.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })}>
              {logoutAll.isPending ? 'Signing out…' : 'Sign out of all devices'}
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Access tokens last 15 minutes. Refresh tokens are httpOnly cookies, rotated on every use and revoked when reuse is detected.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
```

## `client/src/hooks/useClickOutside.js`

```js
import { useEffect } from 'react';

/** Close popovers on outside pointer-down; `enabled` keeps the listener cheap. */
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler(event);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [ref, handler, enabled]);
}

export default useClickOutside;
```

## `client/src/index.css`

```css
@import "tailwindcss";

/* Class-based dark mode: <html class="dark"> */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --ag-canvas: #f5f8fc;
  --ag-surface: #ffffff;
  --ag-surface-2: #eaf0f7;
  --ag-ink: #0d1626;
  --ag-muted: #56657a;
  --ag-line: #d8e2ee;
  --ag-primary: #0d9488;
  --ag-primary-hover: #0b7f75;
  --ag-primary-ink: #ffffff;
  --ag-accent: #7c3aed;
  --ag-accent-soft: #ede9fe;
  --ag-success: #15803d;
  --ag-danger: #dc2626;
  --ag-warning: #b45309;
  color-scheme: light;
}

.dark {
  --ag-canvas: #070b14;
  --ag-surface: #0e1523;
  --ag-surface-2: #151f31;
  --ag-ink: #e9f0fa;
  --ag-muted: #94a5bd;
  --ag-line: #25324a;
  --ag-primary: #2dd4bf;
  --ag-primary-hover: #5eead4;
  --ag-primary-ink: #04201d;
  --ag-accent: #a78bfa;
  --ag-accent-soft: #221a3d;
  --ag-success: #4ade80;
  --ag-danger: #f87171;
  --ag-warning: #fbbf24;
  color-scheme: dark;
}

/* `inline` keeps the CSS variables live, so .dark overrides every utility. */
@theme inline {
  --color-canvas: var(--ag-canvas);
  --color-surface: var(--ag-surface);
  --color-surface-2: var(--ag-surface-2);
  --color-ink: var(--ag-ink);
  --color-muted: var(--ag-muted);
  --color-line: var(--ag-line);
  --color-primary: var(--ag-primary);
  --color-primary-hover: var(--ag-primary-hover);
  --color-primary-ink: var(--ag-primary-ink);
  --color-accent: var(--ag-accent);
  --color-accent-soft: var(--ag-accent-soft);
  --color-success: var(--ag-success);
  --color-danger: var(--ag-danger);
  --color-warning: var(--ag-warning);
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace;
}

@layer base {
  * {
    border-color: var(--ag-line);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-canvas text-ink font-sans antialiased;
    min-height: 100vh;
    margin: 0;
  }

  :focus-visible {
    outline: 2px solid var(--ag-primary);
    outline-offset: 2px;
  }

  ::selection {
    background: color-mix(in srgb, var(--ag-primary) 32%, transparent);
  }

  /* Keyboard users skip the sidebar/topbar. */
  .skip-link {
    @apply sr-only;
  }
  .skip-link:focus {
    @apply not-sr-only fixed left-4 top-4 z-100 rounded-lg bg-primary px-4 py-2 text-primary-ink;
  }
}

@layer utilities {
  .ag-card {
    @apply rounded-2xl border border-line bg-surface;
  }

  .ag-ring {
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--ag-primary) 18%, transparent),
      0 24px 70px -40px color-mix(in srgb, var(--ag-primary) 70%, transparent);
  }

  .ag-grid-bg {
    background-image:
      linear-gradient(to right, color-mix(in srgb, var(--ag-line) 70%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--ag-line) 70%, transparent) 1px, transparent 1px);
    background-size: 44px 44px;
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 10%, transparent 100%);
  }

  .ag-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .ag-scrollbar::-webkit-scrollbar-thumb {
    background: var(--ag-line);
    border-radius: 999px;
  }
}

@keyframes ag-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ag-rise {
  animation: ag-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## `client/src/lib/apiClient.js`

```js
/**
 * Fetch wrapper for the AlgoNest API.
 *
 * - access token lives ONLY in memory (never localStorage) — XSS-safe by design
 * - refresh token is an httpOnly cookie, sent with `credentials: 'include'`
 * - a single-flight refresh prevents token-rotation races (React StrictMode,
 *   parallel queries, etc.)
 * - every response is unwrapped from { success, data, message, errors }
 */
const BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 15_000;

let accessToken = null;
let onUnauthorized = null;
let refreshPromise = null;

export class ApiClientError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }

  /** Map for form-level display: { email: 'Enter a valid email address' }. */
  get fieldErrors() {
    const result = {};
    for (const issue of this.errors ?? []) {
      if (issue?.field && !result[issue.field]) result[issue.field] = issue.message;
    }
    return result;
  }
}

export function setAccessToken(token) {
  accessToken = token ?? null;
}

export function getAccessToken() {
  return accessToken;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

function buildUrl(path, query) {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${suffix}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((item) => params.append(key, String(item)));
    else params.append(key, String(value));
  }
  const search = params.toString();
  return search ? `${url}?${search}` : url;
}

async function parseBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function rawRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    signal,
    timeout = DEFAULT_TIMEOUT_MS,
    auth = true,
  } = options;

  const requestSignal = signal ?? AbortSignal.timeout(timeout);
  const response = await fetch(buildUrl(path, query), {
    method,
    credentials: 'include',
    signal: requestSignal,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await parseBody(response);

  if (!response.ok || payload?.success === false) {
    throw new ApiClientError(
      payload?.message || `Request failed (${response.status})`,
      response.status,
      payload?.errors ?? null,
    );
  }

  return payload?.data ?? payload;
}

/** Public helper used by AuthGate on boot and by the 401 interceptor. */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', { method: 'POST', body: {}, auth: false })
      .then((data) => {
        if (!data?.accessToken || !data?.user) {
          throw new ApiClientError('Invalid refresh response', 401);
        }
        setAccessToken(data.accessToken);
        return data;
      })
      .catch((error) => {
        setAccessToken(null);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, options = {}) {
  const { retryOnUnauthorized = true, ...rest } = options;
  const isAuthCall = path.startsWith('/auth/login') || path.startsWith('/auth/register') || path.startsWith('/auth/refresh');

  try {
    return await rawRequest(path, rest);
  } catch (error) {
    if (!(error instanceof ApiClientError) || error.status !== 401 || !retryOnUnauthorized || isAuthCall) {
      throw error;
    }
    try {
      await refreshSession();
    } catch (refreshError) {
      onUnauthorized?.();
      throw refreshError;
    }
    return rawRequest(path, rest);
  }
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { request, BASE_URL };
export default api;
```

## `client/src/lib/cn.js`

```js
/** Tiny classname joiner — avoids a dependency for a five-line utility. */
export function cn(...values) {
  return values
    .flat(Infinity)
    .filter((value) => typeof value === 'string' && value.length > 0)
    .join(' ');
}

export default cn;
```

## `client/src/lib/navigation.js`

```js
/** Single source for sidebar + topbar search. `ready: false` = Phase 2+. */
export const NAV_ITEMS = [
  { label: 'Home', to: '/app', icon: 'LayoutDashboard', end: true, ready: true },
  { label: 'Sheets', to: '/app/sheets', icon: 'BookOpen', ready: false },
  { label: 'Quizzes', to: '/app/quizzes', icon: 'ListChecks', ready: false },
  { label: 'Mocks', to: '/app/mocks', icon: 'Timer', ready: false },
  { label: 'Plans', to: '/app/plans', icon: 'CalendarRange', ready: false },
  { label: 'Resources', to: '/app/resources', icon: 'FolderOpen', ready: false },
  { label: 'Community', to: '/app/community', icon: 'Users', ready: false },
];

export const isNavReady = (pathname) => NAV_ITEMS.find((item) => item.to === pathname)?.ready ?? true;
```

## `client/src/lib/queryKeys.js`

```js
export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  users: {
    all: ['users'],
    list: (params) => ['users', 'list', params],
  },
};

export default queryKeys;
```

## `client/src/main.jsx`

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { queryClient } from './app/queryClient.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { useThemeStore } from './store/themeStore.js';
import './index.css';

// Re-apply the persisted theme (index.html already did it pre-paint).
useThemeStore.getState().apply();

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root is missing from index.html');

createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
```

## `client/src/pages/ModulePage.jsx`

```jsx
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { NAV_ITEMS } from '../lib/navigation.js';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

/** Honest Phase-2 placeholder: no fake data, no dead-end click targets. */
export default function ModulePage() {
  const { pathname } = useLocation();
  const module = NAV_ITEMS.find((item) => item.to === pathname);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Coming in a later phase</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{module?.label ?? 'Module'}</h1>
        <p className="mt-1.5 text-sm text-muted">
          Phase 1 ships the foundation: authentication, RBAC, onboarding, theming and the app shell. This module is intentionally empty.
        </p>
      </div>

      <EmptyState
        icon={Construction}
        title={`${module?.label ?? 'This module'} isn’t wired up yet`}
        description="The route, navigation and access control are ready. The data models, services and screens arrive with their phase — no stub data is shown here."
        action={<Link to="/app"><Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard</Button></Link>}
      />
    </div>
  );
}
```

## `client/src/pages/NotFoundPage.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { ClickSpark, GlitchText } from '../components/reactbits/index.js';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/ui/Logo.jsx';
import { useIsDark } from '../store/themeStore.js';

/** Empty state polish: glitch text + click sparks, still fully readable. */
export default function NotFoundPage() {
  const isDark = useIsDark();

  return (
    <ClickSpark
      sparkColor={isDark ? '#2dd4bf' : '#0d9488'}
      sparkCount={8}
      sparkRadius={26}
      sparkSize={9}
      duration={500}
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center"
    >
      <Logo size="lg" showWordmark />
      <Compass className="h-12 w-12 text-primary transition-transform duration-500 hover:rotate-45" aria-hidden="true" />

      <GlitchText
        trigger="hover"
        speed={0.8}
        intensity={0.35}
        enableShadows
        shadowColors={isDark ? ['#2dd4bf', '#a78bfa'] : ['#0d9488', '#7c3aed']}
        className="font-mono text-ink"
      >
        404
      </GlitchText>

      <div>
        <h1 className="text-xl font-semibold text-ink">This path isn’t on the map</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">The link may be outdated. Let’s get you back to something solvable.</p>
      </div>
      <Link to="/"><Button className="transition-transform duration-200 hover:-translate-y-0.5">Go to home</Button></Link>
    </ClickSpark>
  );
}
```

## `client/src/store/themeStore.js`

```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI state: theme. Persisted so the choice survives reloads; the inline script
 * in index.html applies it before React mounts (no flash of the wrong theme).
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        if (theme !== 'dark' && theme !== 'light') return;
        set({ theme });
        get().apply(theme);
      },
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        get().apply(next);
      },
      apply: (theme = get().theme) => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', theme === 'dark' ? '#070b14' : '#f6f8fb');
      },
    }),
    {
      name: 'algonest-theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => state?.apply(),
    },
  ),
);

export const useIsDark = () => useThemeStore((state) => state.theme === 'dark');
```

## `client/vite.config.js`

```js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Kill every cached dep response: stale `?v=` chunks cause duplicate React. */
function preventStaleModules() {
  return {
    name: 'algonest-no-stale-modules',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
      });
    },
  };
}

/**
 * The browser always talks to `/api/...` (relative URLs). In dev Vite proxies
 * that to the Express server, so auth cookies stay same-origin and work behind
 * the Arena preview host as well as on localhost.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET || 'http://localhost:5000';
  const proxy = {
    '/api': { target, changeOrigin: true, secure: false },
  };

  return {
    plugins: [react(), tailwindcss(), preventStaleModules()],

    /**
     * A single React instance is non-negotiable. If two optimized chunks each
     * bundle their own React copy, the hooks dispatcher is null and zustand
     * dies with "Cannot read properties of null (reading 'useCallback')".
     */
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },

    /**
     * Pre-bundle everything up front. If Vite discovers gsap / motion only when
     * a lazy landing chunk loads, it re-optimises mid-session and the browser
     * mixes old `?v=` URLs with new ones → two React copies → blank screen.
     */
    optimizeDeps: {
      force: true,
      include: [
        'react', 'react-dom', 'react-dom/client',
        'react/jsx-runtime', 'react/jsx-dev-runtime',
        'react-router-dom', '@tanstack/react-query', 'zustand', 'lucide-react',
        'gsap', 'gsap/ScrollTrigger', 'motion/react',
      ],
    },

    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      allowedHosts: true, // preview hosts like https://5173-xxxx.e2b.app
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
      proxy,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      allowedHosts: true,
      proxy,
    },
    build: {
      outDir: 'dist',
      target: 'es2022',
      sourcemap: true,
      chunkSizeWarningLimit: 900,
    },
  };
});
```
