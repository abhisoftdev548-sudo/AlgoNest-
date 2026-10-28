# AlgoNest — Phase 2 complete source code

> Auto-generated from the working tree on 2026-10-28. Every file below exists verbatim in the repository. Files marked "modified" also contain Phase 1 code; the sections added in Phase 2 are at the end of the shared contracts and are documented in [PHASE2.md](./PHASE2.md).

## Index — Shared contracts (modified) (2 files)

- [`shared/src/constants.js`](#shared-src-constants-js)
- [`shared/src/schemas.js`](#shared-src-schemas-js)

## Index — Server — models + utilities (new) (9 files)

- [`server/src/models/Problem.js`](#server-src-models-problem-js)
- [`server/src/models/Sheet.js`](#server-src-models-sheet-js)
- [`server/src/models/SheetVersion.js`](#server-src-models-sheetversion-js)
- [`server/src/models/UserProgress.js`](#server-src-models-userprogress-js)
- [`server/src/models/SheetRating.js`](#server-src-models-sheetrating-js)
- [`server/src/models/SheetReport.js`](#server-src-models-sheetreport-js)
- [`server/src/models/PersonalResource.js`](#server-src-models-personalresource-js)
- [`server/src/utils/pagination.js`](#server-src-utils-pagination-js)
- [`server/src/utils/slug.js`](#server-src-utils-slug-js)

## Index — Server — sheets module (new) (10 files)

- [`server/src/modules/sheets/platformDetector.js`](#server-src-modules-sheets-platformdetector-js)
- [`server/src/modules/sheets/sheetWorkflow.js`](#server-src-modules-sheets-sheetworkflow-js)
- [`server/src/modules/sheets/sheet.service.js`](#server-src-modules-sheets-sheet-service-js)
- [`server/src/modules/sheets/progress.service.js`](#server-src-modules-sheets-progress-service-js)
- [`server/src/modules/sheets/actor.js`](#server-src-modules-sheets-actor-js)
- [`server/src/modules/sheets/sheet.controller.js`](#server-src-modules-sheets-sheet-controller-js)
- [`server/src/modules/sheets/progress.controller.js`](#server-src-modules-sheets-progress-controller-js)
- [`server/src/modules/sheets/sheet.routes.js`](#server-src-modules-sheets-sheet-routes-js)
- [`server/src/modules/sheets/resource.routes.js`](#server-src-modules-sheets-resource-routes-js)
- [`server/src/routes/index.js`](#server-src-routes-index-js)

## Index — Server — tests (new) (3 files)

- [`server/tests/sheets.test.js`](#server-tests-sheets-test-js)
- [`server/tests/sheets.service.test.js`](#server-tests-sheets-service-test-js)
- [`server/tests/sheets.routes.test.js`](#server-tests-sheets-routes-test-js)

## Index — Client — shared primitives + wiring (new/modified) (7 files)

- [`client/src/components/ui/Modal.jsx`](#client-src-components-ui-modal-jsx)
- [`client/src/components/ui/ProgressBar.jsx`](#client-src-components-ui-progressbar-jsx)
- [`client/src/app/router.jsx`](#client-src-app-router-jsx)
- [`client/src/lib/queryKeys.js`](#client-src-lib-querykeys-js)
- [`client/src/lib/navigation.js`](#client-src-lib-navigation-js)
- [`client/src/hooks/useDebouncedValue.js`](#client-src-hooks-usedebouncedvalue-js)
- [`client/scripts/smokeRender.mjs`](#client-scripts-smokerender-mjs)

## Index — Client — sheets feature: api, hooks, lib (new) (4 files)

- [`client/src/features/sheets/api/sheetsApi.js`](#client-src-features-sheets-api-sheetsapi-js)
- [`client/src/features/sheets/api/progressApi.js`](#client-src-features-sheets-api-progressapi-js)
- [`client/src/features/sheets/hooks/useSheets.js`](#client-src-features-sheets-hooks-usesheets-js)
- [`client/src/features/sheets/lib/sheetUtils.js`](#client-src-features-sheets-lib-sheetutils-js)

## Index — Client — sheets feature: components (new) (12 files)

- [`client/src/features/sheets/components/SheetFilters.jsx`](#client-src-features-sheets-components-sheetfilters-jsx)
- [`client/src/features/sheets/components/SheetCard.jsx`](#client-src-features-sheets-components-sheetcard-jsx)
- [`client/src/features/sheets/components/ProblemList.jsx`](#client-src-features-sheets-components-problemlist-jsx)
- [`client/src/features/sheets/components/ProblemDetail.jsx`](#client-src-features-sheets-components-problemdetail-jsx)
- [`client/src/features/sheets/components/ProgressPanel.jsx`](#client-src-features-sheets-components-progresspanel-jsx)
- [`client/src/features/sheets/components/TopicProgress.jsx`](#client-src-features-sheets-components-topicprogress-jsx)
- [`client/src/features/sheets/components/RatingSection.jsx`](#client-src-features-sheets-components-ratingsection-jsx)
- [`client/src/features/sheets/components/ReportDialog.jsx`](#client-src-features-sheets-components-reportdialog-jsx)
- [`client/src/features/sheets/components/PersonalResources.jsx`](#client-src-features-sheets-components-personalresources-jsx)
- [`client/src/features/sheets/components/ProblemEditor.jsx`](#client-src-features-sheets-components-problemeditor-jsx)
- [`client/src/features/sheets/components/BulkImportDialog.jsx`](#client-src-features-sheets-components-bulkimportdialog-jsx)
- [`client/src/features/sheets/components/ModerationPanel.jsx`](#client-src-features-sheets-components-moderationpanel-jsx)

## Index — Client — sheets feature: pages (new) (3 files)

- [`client/src/features/sheets/pages/SheetsPage.jsx`](#client-src-features-sheets-pages-sheetspage-jsx)
- [`client/src/features/sheets/pages/SheetDetailPage.jsx`](#client-src-features-sheets-pages-sheetdetailpage-jsx)
- [`client/src/features/sheets/pages/SheetEditorPage.jsx`](#client-src-features-sheets-pages-sheeteditorpage-jsx)

## Index — Documentation (modified/new) (2 files)

- [`README.md`](#readme-md)
- [`docs/PHASE2.md`](#docs-phase2-md)


---

# Shared contracts (modified)

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

/* ───────────────────────── Phase 2: DSA Sheets ───────────────────────── */

/** `approved` = moderation passed; `published` = a frozen public version exists. */
export const CONTENT_STATUSES_P2 = Object.freeze({
  PUBLISHED: 'published',
});

// Extend the Phase-1 lifecycle without breaking existing imports.
export const SHEET_STATUSES = Object.freeze({
  ...CONTENT_STATUSES,
  PUBLISHED: 'published',
});
export const SHEET_STATUS_VALUES = Object.freeze(Object.values(SHEET_STATUSES));

export const SHEET_STATUS_LABELS = Object.freeze({
  draft: 'Draft',
  pending_review: 'In review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  published: 'Published',
  rejected: 'Rejected',
  archived: 'Archived',
});

/** Moderation decisions are separate from statuses: decision → status. */
export const MODERATION_DECISIONS = Object.freeze({
  APPROVE: 'approve',
  REQUEST_CHANGES: 'request_changes',
  REJECT: 'reject',
});
export const MODERATION_DECISION_VALUES = Object.freeze(Object.values(MODERATION_DECISIONS));

export const PROBLEM_STATUSES = Object.freeze({
  NOT_STARTED: 'not_started',
  ATTEMPTED: 'attempted',
  SOLVED: 'solved',
  REVISING: 'revising',
  SKIPPED: 'skipped',
});
export const PROBLEM_STATUS_VALUES = Object.freeze(Object.values(PROBLEM_STATUSES));
export const PROBLEM_STATUS_LABELS = Object.freeze({
  not_started: 'Not started',
  attempted: 'Attempted',
  solved: 'Solved',
  revising: 'Revising',
  skipped: 'Skipped',
});
/** Statuses that count towards the completion percentage. */
export const COMPLETED_STATUSES = Object.freeze([PROBLEM_STATUSES.SOLVED, PROBLEM_STATUSES.REVISING]);

export const DIFFICULTIES = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' });
export const DIFFICULTY_VALUES = Object.freeze(Object.values(DIFFICULTIES));
export const DIFFICULTY_LABELS = Object.freeze({ easy: 'Easy', medium: 'Medium', hard: 'Hard' });

export const CONFIDENCE_MIN = 1;
export const CONFIDENCE_MAX = 5;

/** Canonical platforms recognised by the bulk-link importer. */
export const PLATFORMS = Object.freeze({
  LEETCODE: 'leetcode',
  CODEFORCES: 'codeforces',
  GEEKSFORGEEKS: 'geeksforgeeks',
  HACKERRANK: 'hackerrank',
  CODECHEF: 'codechef',
  ATCODER: 'atcoder',
  INTERVIEWBIT: 'interviewbit',
  HACKEREARTH: 'hackerearth',
  NEETCODE: 'neetcode',
  TAKEUFORWARD: 'takeuforward',
  CODESIGNAL: 'codesignal',
  SPOJ: 'spoj',
  KATTIS: 'kattis',
  YOUTUBE: 'youtube',
  GITHUB: 'github',
  GENERIC: 'generic',
});
export const PLATFORM_VALUES = Object.freeze(Object.values(PLATFORMS));
export const PLATFORM_LABELS = Object.freeze({
  leetcode: 'LeetCode', codeforces: 'Codeforces', geeksforgeeks: 'GeeksforGeeks',
  hackerrank: 'HackerRank', codechef: 'CodeChef', atcoder: 'AtCoder',
  interviewbit: 'InterviewBit', hackerearth: 'HackerEarth', neetcode: 'NeetCode',
  takeuforward: 'takeUforward', codesignal: 'CodeSignal', spoj: 'SPOJ',
  kattis: 'Kattis', youtube: 'YouTube', github: 'GitHub', generic: 'Other',
});

export const REPORT_REASONS = Object.freeze({
  BROKEN_LINK: 'broken_link',
  WRONG_CONTENT: 'wrong_content',
  DUPLICATE: 'duplicate',
  COPYRIGHT: 'copyright',
  INAPPROPRIATE: 'inappropriate',
  OTHER: 'other',
});
export const REPORT_REASON_VALUES = Object.freeze(Object.values(REPORT_REASONS));

export const REPORT_STATUSES = Object.freeze({ OPEN: 'open', RESOLVED: 'resolved', DISMISSED: 'dismissed' });
export const REPORT_STATUS_VALUES = Object.freeze(Object.values(REPORT_STATUSES));

export const RESOURCE_TYPES = Object.freeze({
  VIDEO: 'video', ARTICLE: 'article', REPOSITORY: 'repository',
  PDF: 'pdf', COURSE: 'course', OTHER: 'other',
});
export const RESOURCE_TYPE_VALUES = Object.freeze(Object.values(RESOURCE_TYPES));

/** Canonical topic vocabulary — free text is still allowed via `topic`. */
export const SHEET_TOPICS = Object.freeze([
  'Arrays', 'Strings', 'Two Pointers', 'Sliding Window', 'Binary Search',
  'Linked Lists', 'Stacks & Queues', 'Hashing', 'Trees', 'BST', 'Heaps',
  'Graphs', 'BFS / DFS', 'Recursion', 'Backtracking', 'Greedy',
  'Dynamic Programming', 'Tries', 'Intervals', 'Bit Manipulation', 'Math',
  'Sorting', 'Segment Trees', 'Topo Sort', 'Big-O', 'General',
]);

/** Hard caps keep embedded problem arrays far below MongoDB's 16 MB limit. */
export const SHEET_LIMITS = Object.freeze({
  MAX_PROBLEMS: 300,
  MAX_ADD_BATCH: 100,
  MAX_PASTED_CHARS: 20_000,
  MAX_PASTED_LINES: 200,
  MAX_TAGS: 12,
  MAX_TITLE: 120,
  MAX_DESCRIPTION: 2000,
  MAX_NOTES: 5000,
  MAX_REVIEW: 1000,
  MAX_URL: 2048,
  MAX_TIME_SPENT: 100_000,
  MAX_ESTIMATED_MINUTES: 600,
});
```

## `shared/src/schemas.js`

```js
import { z } from 'zod';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  DIFFICULTIES,
  DIFFICULTY_VALUES,
  GOAL_VALUES,
  MODERATION_DECISION_VALUES,
  PAGINATION,
  PLATFORM_VALUES,
  PREFERRED_LANGUAGES,
  PROBLEM_STATUS_VALUES,
  REPORT_REASON_VALUES,
  RESOURCE_TYPE_VALUES,
  ROLE_VALUES,
  SHEET_LIMITS,
  SHEET_STATUS_VALUES,
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

/* ───────────────────── Phase 2: DSA Sheets contracts ───────────────────── */

/** http(s)-only URLs: blocks javascript:, data:, file: and protocol-relative. */
export const httpUrlSchema = z
  .string()
  .trim()
  .min(8, 'Enter a URL')
  .max(SHEET_LIMITS.MAX_URL, 'URL is too long')
  .refine((value) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value), 'Enter a valid http(s) URL')
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return ['http:', 'https:'].includes(parsed.protocol) && Boolean(parsed.hostname);
    } catch {
      return false;
    }
  }, 'Enter a valid http(s) URL');

const shortText = (max) => z.string().trim().max(max);

export const sheetTitleSchema = z.string().trim().min(4, 'Title must be at least 4 characters').max(SHEET_LIMITS.MAX_TITLE);
export const sheetDescriptionSchema = z.string().trim().max(SHEET_LIMITS.MAX_DESCRIPTION);
export const topicSchema = z.string().trim().min(1).max(60);
export const difficultySchema = z.enum(DIFFICULTY_VALUES);
export const problemStatusSchema = z.enum(PROBLEM_STATUS_VALUES);
export const sheetStatusSchema = z.enum(SHEET_STATUS_VALUES);

/** Common list contract: pagination is mandatory on every list endpoint. */
export const sheetListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    q: z.string().trim().max(80).optional(),
    topic: z.string().trim().max(60).optional(),
    difficulty: difficultySchema.optional(),
    goal: z.enum(GOAL_VALUES).optional(),
    platform: z.enum(PLATFORM_VALUES).optional(),
    status: sheetStatusSchema.optional(),
    sort: z.enum(['newest', 'oldest', 'rating', 'popular', 'title']).default('newest'),
    mine: z.enum(['true', 'false']).optional(),
    bookmarked: z.enum(['true', 'false']).optional(),
  })
  .strict();

export const sheetParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const problemParamsSchema = z.object({ id: mongoIdSchema, problemId: mongoIdSchema }).strict();
export const versionParamsSchema = z.object({ id: mongoIdSchema, version: z.coerce.number().int().min(1) }).strict();
export const resourceParamsSchema = z.object({ id: mongoIdSchema }).strict();

export const sheetCreateSchema = z
  .object({
    title: sheetTitleSchema,
    description: sheetDescriptionSchema.default(''),
    difficulty: difficultySchema.default(DIFFICULTIES.MEDIUM),
    goals: z.array(z.enum(GOAL_VALUES)).max(GOAL_VALUES.length).default([]),
    tags: z.array(z.string().trim().min(1).max(32)).max(SHEET_LIMITS.MAX_TAGS).default([]),
    topics: z.array(topicSchema).max(30).default([]),
  })
  .strict();

export const sheetUpdateSchema = sheetCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const problemCreateSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    url: httpUrlSchema,
    platform: z.enum(PLATFORM_VALUES).optional(), // always re-detected server-side
    difficulty: difficultySchema.default('medium'),
    topic: topicSchema.default('General'),
    estimatedMinutes: z.coerce.number().int().min(1).max(SHEET_LIMITS.MAX_ESTIMATED_MINUTES).default(20),
    hint: z.string().trim().max(500).optional(),
  })
  .strict();

export const problemUpdateSchema = problemCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const addProblemsSchema = z
  .object({
    problems: z.array(problemCreateSchema).min(1, 'Add at least one problem').max(SHEET_LIMITS.MAX_ADD_BATCH),
  })
  .strict();

/** Full-array reorder: the client sends every id in the new order. */
export const reorderProblemsSchema = z
  .object({
    orderedIds: z
      .array(mongoIdSchema)
      .min(1, 'Provide the ordered problem ids')
      .max(SHEET_LIMITS.MAX_PROBLEMS)
      .refine((ids) => new Set(ids).size === ids.length, 'Duplicate problem ids are not allowed'),
  })
  .strict();

export const parseLinksSchema = z
  .object({
    text: z.string().trim().min(1, 'Paste at least one link').max(SHEET_LIMITS.MAX_PASTED_CHARS),
  })
  .strict();

export const importProblemsSchema = z
  .object({
    items: z.array(problemCreateSchema).min(1).max(SHEET_LIMITS.MAX_ADD_BATCH),
  })
  .strict();

export const changelogSchema = z
  .object({ changelog: z.string().trim().max(500).default('') })
  .strict();

export const moderationSchema = z
  .object({
    decision: z.enum(MODERATION_DECISION_VALUES),
    note: z.string().trim().max(1000).default(''),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.decision !== 'approve' && !value.note) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['note'], message: 'Explain what needs to change' });
    }
  });

export const ratingSchema = z
  .object({
    rating: z.coerce.number().int().min(1, 'Choose 1–5 stars').max(5, 'Choose 1–5 stars'),
    review: z.string().trim().max(SHEET_LIMITS.MAX_REVIEW).default(''),
  })
  .strict();

export const ratingsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
  })
  .strict();

export const reportSchema = z
  .object({
    reason: z.enum(REPORT_REASON_VALUES),
    details: z.string().trim().max(1000).default(''),
  })
  .strict();

export const reportsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
    status: z.enum(['open', 'resolved', 'dismissed']).optional(),
  })
  .strict();

export const resolveReportSchema = z
  .object({
    status: z.enum(['resolved', 'dismissed']),
    resolutionNote: z.string().trim().max(1000).default(''),
  })
  .strict();

/** Partial updates: every field optional but at least one must be present. */
export const progressUpdateSchema = z
  .object({
    status: problemStatusSchema.optional(),
    notes: z.string().trim().max(SHEET_LIMITS.MAX_NOTES).optional(),
    bookmark: z.boolean().optional(),
    confidence: z.coerce.number().int().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX).nullable().optional(),
    timeSpent: z.coerce.number().int().min(0).max(SHEET_LIMITS.MAX_TIME_SPENT).optional(),
    revisionDate: z.coerce.date().nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const progressQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    // Progress rows are tiny and a sheet is bounded, so the workspace can load
    // them all in one request (still paginated, just with a higher ceiling).
    limit: z.coerce.number().int().min(1).max(SHEET_LIMITS.MAX_PROBLEMS).default(SHEET_LIMITS.MAX_PROBLEMS),
    status: problemStatusSchema.optional(),
    topic: z.string().trim().max(60).optional(),
    bookmarked: z.enum(['true', 'false']).optional(),
  })
  .strict();

export const personalResourceCreateSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    url: httpUrlSchema,
    type: z.enum(RESOURCE_TYPE_VALUES).default('article'),
    platform: z.enum(PLATFORM_VALUES).optional(),
    topic: topicSchema.default('General'),
    note: z.string().trim().max(SHEET_LIMITS.MAX_NOTES).default(''),
    tags: z.array(z.string().trim().min(1).max(32)).max(SHEET_LIMITS.MAX_TAGS).default([]),
    sheetId: mongoIdSchema.optional(),
    problemId: mongoIdSchema.optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
  })
  .strict();

export const personalResourceUpdateSchema = personalResourceCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const personalResourceQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
    q: z.string().trim().max(80).optional(),
    type: z.enum(RESOURCE_TYPE_VALUES).optional(),
    topic: z.string().trim().max(60).optional(),
    sheetId: mongoIdSchema.optional(),
  })
  .strict();

export const reportParamsSchema = z.object({ reportId: mongoIdSchema }).strict();
```

---

# Server — models + utilities (new)

## `server/src/models/Problem.js`

```js
import mongoose from 'mongoose';
import { DIFFICULTY_VALUES, PLATFORM_VALUES, SHEET_LIMITS } from '@algonest/shared';

const { Schema } = mongoose;

/**
 * EMBEDDED, NOT REFERENCED — deliberate design decision.
 *
 * A problem is meaningless without its sheet, is always read together with the
 * sheet (never queried independently), and is part of an ordered progression.
 * Embedding gives us:
 *   - one atomic document write for add / edit / reorder (no transaction);
 *   - stable subdocument `_id`s that UserProgress can point to;
 *   - a cheap, exact snapshot for SheetVersion on publish.
 *
 * The array is capped at SHEET_LIMITS.MAX_PROBLEMS (300), so the parent stays
 * far below MongoDB's 16 MB document limit. Problems are NOT shared between
 * sheets; cloning deep-copies them with fresh ids.
 */
export const problemSchema = new Schema(
  {
    title: { type: String, required: [true, 'Problem title is required'], trim: true, maxlength: 200 },
    url: { type: String, required: [true, 'Problem URL is required'], trim: true, maxlength: SHEET_LIMITS.MAX_URL },
    /** Normalised host-level platform key (see platformDetector). */
    platform: { type: String, enum: PLATFORM_VALUES, default: 'generic' },
    /** Display label, denormalised so a snapshot never needs a lookup. */
    platformLabel: { type: String, trim: true, maxlength: 60, default: 'Other' },
    difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    /** Dense 0-based rank inside the sheet; maintained by reorderProblems. */
    order: { type: Number, required: true, min: 0 },
    estimatedMinutes: { type: Number, min: 1, max: SHEET_LIMITS.MAX_ESTIMATED_MINUTES, default: 20 },
    /** Lowercased canonical URL slug — used to dedupe bulk imports. */
    externalId: { type: String, trim: true, maxlength: 300, default: '' },
    /** Optional creator hint about the problem (NOT the student's private note). */
    hint: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { _id: true, timestamps: false, versionKey: false },
);

/** Plain-object projection shared by Sheet and SheetVersion responses. */
export function problemToPlain(problem) {
  const doc = problem?.toObject ? problem.toObject() : { ...problem };
  return {
    id: String(doc._id),
    title: doc.title,
    url: doc.url,
    platform: doc.platform,
    platformLabel: doc.platformLabel,
    difficulty: doc.difficulty,
    topic: doc.topic,
    order: doc.order,
    estimatedMinutes: doc.estimatedMinutes,
    externalId: doc.externalId || '',
    hint: doc.hint || '',
  };
}

export default problemSchema;
```

## `server/src/models/Sheet.js`

```js
import mongoose from 'mongoose';
import {
  DIFFICULTY_VALUES,
  GOAL_VALUES,
  SHEET_LIMITS,
  SHEET_STATUS_VALUES,
} from '@algonest/shared';
import { problemSchema } from './Problem.js';

const { Schema, Types } = mongoose;

/**
 * Sheet = the author's WORKING COPY. Published, immutable problem sets live in
 * SheetVersion. This lets an author edit a published sheet without changing
 * what students already solved; every attempt/progress row records the version
 * number it belongs to.
 */
const reviewEntrySchema = new Schema(
  {
    from: { type: String, enum: SHEET_STATUS_VALUES },
    to: { type: String, enum: SHEET_STATUS_VALUES, required: true },
    by: { type: Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    decision: { type: String, maxlength: 40, default: '' },
    note: { type: String, maxlength: 1000, default: '' },
  },
  { _id: false },
);

const sheetSchema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: SHEET_LIMITS.MAX_TITLE },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_DESCRIPTION, default: '' },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
    goals: { type: [{ type: String, enum: GOAL_VALUES }], default: [] },
    topics: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: SHEET_STATUS_VALUES, default: 'draft', index: true },
    problems: {
      type: [problemSchema],
      default: [],
      validate: {
        validator: (value) => value.length <= SHEET_LIMITS.MAX_PROBLEMS,
        message: `A sheet can hold at most ${SHEET_LIMITS.MAX_PROBLEMS} problems`,
      },
    },
    /** 0 = never published. Incremented on every publish. */
    publishedVersion: { type: Number, default: 0, min: 0 },
    /** Denormalised count from the latest snapshot — cheap catalogue cards. */
    publishedProblemCount: { type: Number, default: 0, min: 0 },
    ratingSummary: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    cloneOf: { type: Types.ObjectId, ref: 'Sheet', default: null },
    cloneCount: { type: Number, default: 0, min: 0 },
    submittedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    reviewedBy: { type: Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, maxlength: 1000, default: '' },
    reviewHistory: { type: [reviewEntrySchema], default: [] },
  },
  { timestamps: true, versionKey: '__v' },
);

// Text search for the catalogue; weighted so a title match outranks a tag.
sheetSchema.index({ title: 'text', description: 'text', tags: 'text', topics: 'text' }, {
  weights: { title: 8, topics: 4, tags: 3, description: 1 },
  name: 'sheet_text_search',
});
sheetSchema.index({ status: 1, publishedAt: -1 });
sheetSchema.index({ author: 1, status: 1, updatedAt: -1 });
sheetSchema.index({ topics: 1, difficulty: 1 });
sheetSchema.index({ 'ratingSummary.average': -1 });
sheetSchema.index({ cloneOf: 1 });

/** @returns plain, sorted problem list from a lean sheet/version document. */
function plainProblems(doc) {
  return [...(doc.problems ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => ({
      id: String(p._id),
      title: p.title,
      url: p.url,
      platform: p.platform,
      platformLabel: p.platformLabel,
      difficulty: p.difficulty,
      topic: p.topic,
      order: p.order,
      estimatedMinutes: p.estimatedMinutes,
      externalId: p.externalId || '',
      hint: p.hint || '',
    }));
}

/**
 * Single serialization point. `problems` is replaced by the published snapshot
 * when the viewer is not the author or staff — so editing a live sheet never
 * silently rewrites what learners see.
 */
sheetSchema.statics.toPublic = function toPublic(doc, { snapshot = null } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const author = plain.author && typeof plain.author === 'object' && plain.author.name
    ? { id: String(plain.author._id ?? plain.author.id), name: plain.author.name }
    : { id: String(plain.author ?? ''), name: 'AlgoNest creator' };

  const problems = snapshot ? plainProblems(snapshot) : plainProblems(plain);
  return {
    id: String(plain._id),
    slug: plain.slug,
    title: plain.title,
    description: plain.description || '',
    author,
    difficulty: plain.difficulty,
    goals: plain.goals ?? [],
    topics: plain.topics ?? [],
    tags: plain.tags ?? [],
    status: plain.status,
    problems,
    problemCount: problems.length,
    publishedVersion: plain.publishedVersion ?? 0,
    publishedProblemCount: plain.publishedProblemCount ?? 0,
    viewedVersion: snapshot ? snapshot.version : null,
    isPublishedSnapshot: Boolean(snapshot),
    ratingSummary: {
      average: Number((plain.ratingSummary?.average ?? 0).toFixed(2)),
      count: plain.ratingSummary?.count ?? 0,
    },
    cloneOf: plain.cloneOf ? String(plain.cloneOf) : null,
    cloneCount: plain.cloneCount ?? 0,
    submittedAt: plain.submittedAt ?? null,
    publishedAt: plain.publishedAt ?? null,
    reviewedBy: plain.reviewedBy ? String(plain.reviewedBy) : null,
    reviewNote: plain.reviewNote || '',
    reviewHistory: (plain.reviewHistory ?? []).slice(-10).map((entry) => ({
      from: entry.from, to: entry.to, by: String(entry.by), at: entry.at,
      decision: entry.decision || '', note: entry.note || '',
    })),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const Sheet = mongoose.model('Sheet', sheetSchema);
export { plainProblems };
export const isValidObjectId = (id) => Types.ObjectId.isValid(id);
export default Sheet;
```

## `server/src/models/SheetVersion.js`

```js
import mongoose from 'mongoose';
import { problemSchema } from './Problem.js';

const { Schema, Types } = mongoose;

/**
 * Immutable published snapshot. Created once per publish; NEVER updated.
 * Old UserProgress rows keep a valid `problemId` + `sheetVersion` pair even
 * after the author reorders, renames or removes problems from the working copy.
 */
const sheetVersionSchema = new Schema(
  {
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    problems: { type: [problemSchema], default: [] },
    problemCount: { type: Number, default: 0 },
    // Metadata is snapshotted too, so a result page can show the original title.
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, default: '' },
    difficulty: { type: String, default: 'medium' },
    topics: { type: [String], default: [] },
    changelog: { type: String, maxlength: 500, default: '' },
    publishedBy: { type: Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

sheetVersionSchema.index({ sheet: 1, version: -1 }, { unique: true });

sheetVersionSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    sheet: String(plain.sheet),
    version: plain.version,
    problemCount: plain.problemCount ?? plain.problems?.length ?? 0,
    title: plain.title,
    description: plain.description || '',
    difficulty: plain.difficulty,
    topics: plain.topics ?? [],
    changelog: plain.changelog || '',
    publishedBy: String(plain.publishedBy),
    publishedAt: plain.publishedAt,
  };
};

export const SheetVersion = mongoose.model('SheetVersion', sheetVersionSchema);
export default SheetVersion;
```

## `server/src/models/UserProgress.js`

```js
import mongoose from 'mongoose';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  PROBLEM_STATUS_VALUES,
  SHEET_LIMITS,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * PER-USER DATA, FULLY SEPARATE FROM THE SHARED SHEET.
 *
 * One document per (user, sheet, problemId). A student can never modify the
 * Sheet document — all notes, bookmarks, confidence and time live here.
 * `topic`, `problemTitle` and `sheetVersion` are deliberate denormalised
 * snapshots: topic-wise progress needs no join, and progress on version 1
 * still renders correctly after version 2 is published.
 */
const userProgressSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true },
    problemId: { type: Types.ObjectId, required: true },
    /** Version of the published snapshot this row refers to (0 = unpublished). */
    sheetVersion: { type: Number, default: 0, min: 0 },
    problemTitle: { type: String, trim: true, maxlength: 200, default: '' },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    status: { type: String, enum: PROBLEM_STATUS_VALUES, default: 'not_started' },
    notes: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_NOTES, default: '' },
    bookmark: { type: Boolean, default: false },
    confidence: { type: Number, min: CONFIDENCE_MIN, max: CONFIDENCE_MAX, default: null },
    /** Cumulative minutes spent by this user on this problem. */
    timeSpent: { type: Number, min: 0, max: SHEET_LIMITS.MAX_TIME_SPENT, default: 0 },
    revisionDate: { type: Date, default: null },
    lastReviewedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

userProgressSchema.index({ user: 1, sheet: 1, problemId: 1 }, { unique: true, name: 'uniq_user_sheet_problem' });
userProgressSchema.index({ user: 1, sheet: 1, status: 1 });
userProgressSchema.index({ user: 1, sheet: 1, topic: 1 });
userProgressSchema.index({ user: 1, bookmark: 1, updatedAt: -1 });
userProgressSchema.index({ user: 1, revisionDate: 1 });

userProgressSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    problemId: String(plain.problemId),
    sheetVersion: plain.sheetVersion ?? 0,
    problemTitle: plain.problemTitle || '',
    topic: plain.topic || 'General',
    status: plain.status,
    notes: plain.notes || '',
    bookmark: Boolean(plain.bookmark),
    confidence: plain.confidence ?? null,
    timeSpent: plain.timeSpent ?? 0,
    revisionDate: plain.revisionDate ?? null,
    lastReviewedAt: plain.lastReviewedAt ?? null,
    updatedAt: plain.updatedAt,
  };
};

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
```

## `server/src/models/SheetRating.js`

```js
import mongoose from 'mongoose';
import { SHEET_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/** Rating + optional written review. One row per (user, sheet) — upserted. */
const sheetRatingSchema = new Schema(
  {
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true, index: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_REVIEW, default: '' },
  },
  { timestamps: true, versionKey: false },
);

sheetRatingSchema.index({ sheet: 1, user: 1 }, { unique: true, name: 'uniq_sheet_user_rating' });
sheetRatingSchema.index({ sheet: 1, createdAt: -1 });

sheetRatingSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const user = plain.user && typeof plain.user === 'object'
    ? { id: String(plain.user._id ?? plain.user.id), name: plain.user.name ?? 'Student' }
    : { id: String(plain.user), name: 'Student' };
  return {
    id: String(plain._id), user, rating: plain.rating,
    review: plain.review || '', createdAt: plain.createdAt, updatedAt: plain.updatedAt,
  };
};

export const SheetRating = mongoose.model('SheetRating', sheetRatingSchema);
export default SheetRating;
```

## `server/src/models/SheetReport.js`

```js
import mongoose from 'mongoose';
import { REPORT_REASON_VALUES, REPORT_STATUS_VALUES, SHEET_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/** User-submitted content report; triaged by staff with CONTENT_MODERATE. */
const sheetReportSchema = new Schema(
  {
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true, index: true },
    reporter: { type: Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: REPORT_REASON_VALUES, required: true },
    details: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: REPORT_STATUS_VALUES, default: 'open', index: true },
    handledBy: { type: Types.ObjectId, ref: 'User', default: null },
    resolutionNote: { type: String, trim: true, maxlength: 1000, default: '' },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

sheetReportSchema.index({ status: 1, createdAt: -1 });
sheetReportSchema.index({ sheet: 1, reporter: 1, status: 1 });

sheetReportSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    sheet: String(plain.sheet),
    reporter: typeof plain.reporter === 'object' && plain.reporter
      ? { id: String(plain.reporter._id), name: plain.reporter.name }
      : String(plain.reporter),
    reason: plain.reason, details: plain.details || '', status: plain.status,
    handledBy: plain.handledBy ? String(plain.handledBy) : null,
    resolutionNote: plain.resolutionNote || '', resolvedAt: plain.resolvedAt ?? null,
    createdAt: plain.createdAt,
  };
};

export const SheetReport = mongoose.model('SheetReport', sheetReportSchema);
export default SheetReport;
```

## `server/src/models/PersonalResource.js`

```js
import mongoose from 'mongoose';
import { PLATFORM_VALUES, RESOURCE_TYPE_VALUES, SHEET_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * A learner's private link library. Kept out of the Phase-6 public resource
 * directory: `user` is always taken from the access token, never from the body.
 */
const personalResourceSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true, trim: true, maxlength: SHEET_LIMITS.MAX_URL },
    type: { type: String, enum: RESOURCE_TYPE_VALUES, default: 'article' },
    platform: { type: String, enum: PLATFORM_VALUES, default: 'generic' },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    note: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_NOTES, default: '' },
    tags: { type: [String], default: [] },
    sheetId: { type: Types.ObjectId, ref: 'Sheet', default: null },
    problemId: { type: Types.ObjectId, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true, versionKey: false },
);

personalResourceSchema.index({ user: 1, createdAt: -1 });
personalResourceSchema.index({ user: 1, topic: 1 });
personalResourceSchema.index({ user: 1, type: 1 });
personalResourceSchema.index({ user: 1, sheetId: 1 });

personalResourceSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    title: plain.title, url: plain.url, type: plain.type, platform: plain.platform,
    topic: plain.topic, note: plain.note || '', tags: plain.tags ?? [],
    sheetId: plain.sheetId ? String(plain.sheetId) : null,
    problemId: plain.problemId ? String(plain.problemId) : null,
    rating: plain.rating ?? null,
    createdAt: plain.createdAt, updatedAt: plain.updatedAt,
  };
};

export const PersonalResource = mongoose.model('PersonalResource', personalResourceSchema);
export default PersonalResource;
```

## `server/src/utils/pagination.js`

```js
import { PAGINATION } from '@algonest/shared';

/** Uniform pagination envelope used by every Phase-2+ list endpoint. */
export function buildPagination(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, total = 0, maxLimit = PAGINATION.MAX_LIMIT) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(maxLimit, Math.max(1, Number(limit) || PAGINATION.DEFAULT_LIMIT));
  const totalPages = Math.ceil(total / safeLimit);
  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

/**
 * Runs a filtered Mongoose query and its count in parallel. `mapItem` keeps
 * serialization decisions in the service, never in the controller.
 */
export async function paginateQuery(filter, query, options = {}) {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    sort = { createdAt: -1 },
    projection = null,
    populate = null,
  } = options;
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Number(limit) || PAGINATION.DEFAULT_LIMIT));

  let list = query.find(filter, projection).sort(sort).skip((safePage - 1) * safeLimit).limit(safeLimit);
  if (populate) list = list.populate(populate);
  const [items, total] = await Promise.all([list.lean(), query.countDocuments(filter)]);
  return { items, pagination: buildPagination(safePage, safeLimit, total) };
}

export default paginateQuery;
```

## `server/src/utils/slug.js`

```js
import crypto from 'node:crypto';

/** URL-safe, deterministic-ish slug plus a short random suffix for uniqueness. */
export function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'sheet';
}

export function uniqueSlug(value) {
  return `${slugify(value)}-${crypto.randomBytes(3).toString('hex')}`;
}

/** Canonical dedupe key for a problem URL (ignores tracking params + trailing /). */
export function canonicalUrlKey(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const path = url.pathname.replace(/\/+$/, '').toLowerCase();
    return `${host}${path}`;
  } catch {
    return String(rawUrl).trim().toLowerCase();
  }
}

export default slugify;
```

---

# Server — sheets module (new)

## `server/src/modules/sheets/platformDetector.js`

```js
import { PLATFORMS, PLATFORM_LABELS, SHEET_LIMITS } from '@algonest/shared';
import { canonicalUrlKey } from '../../utils/slug.js';

/**
 * URL → structured problem. Pure functions only (no DB, no network): the
 * parser is safe to unit-test and can be reused by a future import CLI.
 *
 * SECURITY: we never fetch the URL. Only the hostname + pathname are inspected,
 * and the scheme is strictly http/https, so `javascript:`/`data:`/`file:` URLs
 * and SSRF-by-import are impossible.
 */

const RULES = [
  {
    platform: PLATFORMS.LEETCODE,
    hosts: ['leetcode.com', 'leetcode.cn'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'LeetCode problem',
  },
  {
    platform: PLATFORMS.CODEFORCES,
    hosts: ['codeforces.com'],
    title: (u) => {
      const contest = u.pathname.match(/\/(?:problemset\/problem|contest|gym)\/([^/]+)\/(?:problem\/)?([^/]+)/i);
      return contest ? `Codeforces ${contest[1]}${contest[2].toUpperCase()}` : 'Codeforces problem';
    },
  },
  {
    platform: PLATFORMS.GEEKSFORGEEKS,
    hosts: ['geeksforgeeks.org', 'practice.geeksforgeeks.org'],
    title: (u) => slugSegment(u, /\/(?:problems|problem-of-the-day|batch)?\/?([^/]+?)(?:-\d+)?\/?$/) || 'GeeksforGeeks problem',
  },
  {
    platform: PLATFORMS.HACKERRANK,
    hosts: ['hackerrank.com'],
    title: (u) => slugSegment(u, /\/challenges\/([^/]+)/) || 'HackerRank challenge',
  },
  {
    platform: PLATFORMS.CODECHEF,
    hosts: ['codechef.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/)?.toUpperCase().replace(/^/, 'CodeChef ') || 'CodeChef problem',
  },
  {
    platform: PLATFORMS.ATCODER,
    hosts: ['atcoder.jp'],
    title: (u) => slugSegment(u, /\/tasks\/([^/]+)/) || 'AtCoder task',
  },
  {
    platform: PLATFORMS.INTERVIEWBIT,
    hosts: ['interviewbit.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'InterviewBit problem',
  },
  {
    platform: PLATFORMS.HACKEREARTH,
    hosts: ['hackerearth.com'],
    title: (u) => slugSegment(u, /\/problem\/([^/]+)/) || 'HackerEarth problem',
  },
  {
    platform: PLATFORMS.NEETCODE,
    hosts: ['neetcode.io'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'NeetCode problem',
  },
  {
    platform: PLATFORMS.TAKEUFORWARD,
    hosts: ['takeuforward.org', 'takeuforward.com'],
    title: (u) => slugSegment(u, /\/([^/]+)\/?$/) || 'takeUforward problem',
  },
  {
    platform: PLATFORMS.CODESIGNAL,
    hosts: ['codesignal.com'],
    title: (u) => slugSegment(u, /\/([^/]+)\/?$/) || 'CodeSignal task',
  },
  {
    platform: PLATFORMS.SPOJ,
    hosts: ['spoj.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/)?.toUpperCase().replace(/^/, 'SPOJ ') || 'SPOJ problem',
  },
  {
    platform: PLATFORMS.KATTIS,
    hosts: ['kattis.com', 'open.kattis.com'],
    title: (u) => slugSegment(u, /\/problems\/([^/]+)/) || 'Kattis problem',
  },
  {
    platform: PLATFORMS.YOUTUBE,
    hosts: ['youtube.com', 'm.youtube.com', 'youtu.be'],
    title: (u) => (u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop() || 'YouTube video'),
  },
  {
    platform: PLATFORMS.GITHUB,
    hosts: ['github.com', 'gist.github.com'],
    title: (u) => u.pathname.split('/').filter(Boolean).slice(0, 2).join('/') || 'GitHub repository',
  },
];

const TOPIC_PATTERNS = [
  [/two[-_ ]?pointer|2[-_ ]?pointer/i, 'Two Pointers'],
  [/sliding[-_ ]?window/i, 'Sliding Window'],
  [/binary[-_ ]?search|lower[-_ ]?bound/i, 'Binary Search'],
  [/dynamic[-_ ]?program|[-_]dp[-_]|^dp[-_]|knapsack|lcs[-_]|lis[-_]/i, 'Dynamic Programming'],
  [/breadth[-_ ]?first|[-_]bfs|depth[-_ ]?first|[-_]dfs|topological/i, 'BFS / DFS'],
  [/dijkstra|[-_]graph|shortest[-_]?path|union[-_]?find|mst[-_]/i, 'Graphs'],
  [/binary[-_ ]?tree|binary[-_ ]?search[-_ ]?tree|[-_]bst|traversal/i, 'Trees'],
  [/linked[-_ ]?list/i, 'Linked Lists'],
  [/stack|queue|deque/i, 'Stacks & Queues'],
  [/hash[-_ ]?map|hash[-_ ]?set|frequency[-_]/i, 'Hashing'],
  [/anagram|palindrome|subsequence|[-_]string|substring/i, 'Strings'],
  [/trie|prefix[-_ ]?tree/i, 'Tries'],
  [/heap|priority[-_ ]?queue|kth[-_]/i, 'Heaps'],
  [/interval|merge[-_ ]?intervals/i, 'Intervals'],
  [/bitwise|bit[-_ ]?manipulation|[-_]xor|bit[-_ ]?count/i, 'Bit Manipulation'],
  [/backtrack|permutation|combination|subset|n[-_]?queen/i, 'Backtracking'],
  [/greedy|jump[-_ ]?game/i, 'Greedy'],
  [/recursion/i, 'Recursion'],
  [/prime[-_]|gcd[-_]|lcm[-_]|modulo|factorial/i, 'Math'],
  [/sort[-_]|merge[-_ ]?sort|quick[-_ ]?sort/i, 'Sorting'],
  [/matrix|subarray|prefix[-_ ]?sum|two[-_ ]?sum|three[-_ ]?sum|[-_]array|array[-_]/i, 'Arrays'],
];

function slugSegment(url, regex) {
  const match = url.pathname.match(regex);
  if (!match) return '';
  return humanize(decodeURIComponent(match[1]).replace(/\.\w{1,5}$/, ''));
}

function humanize(slug) {
  const words = String(slug)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!words) return '';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function guessTopic(text) {
  for (const [pattern, topic] of TOPIC_PATTERNS) if (pattern.test(text)) return topic;
  return 'General';
}

function guessDifficulty(text) {
  if (/[-_\s]easy[-_\s]?|\beasy\b/i.test(text)) return 'easy';
  if (/[-_\s]hard[-_\s]?|\bhard\b|[-_]dp[-_]/i.test(text)) return 'hard';
  return 'medium';
}

/** Normalise a raw URL: drop tracking params, fragments and trailing slashes. */
export function normaliseUrl(rawUrl) {
  const url = new URL(rawUrl.trim());
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http(s) links are allowed');
  if (!url.hostname) throw new Error('Link has no host');

  const isMedia = ['youtube.com', 'youtu.be', 'm.youtube.com'].some((h) => url.hostname.endsWith(h));
  if (!isMedia) {
    for (const key of [...url.searchParams.keys()]) url.searchParams.delete(key);
  } else {
    for (const key of [...url.searchParams.keys()]) {
      if (!['v', 't', 'list', 'index'].includes(key)) url.searchParams.delete(key);
    }
  }
  url.hash = '';
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.toString().replace(/\/$/, '');
}

/**
 * @returns {{valid:boolean, url:string, title:string, platform:string,
 *   platformLabel:string, platformHost:string|null, topic:string,
 *   difficulty:string, externalId:string, reason?:string}}
 */
export function detectPlatform(rawUrl) {
  let url;
  let cleaned;
  try {
    cleaned = normaliseUrl(rawUrl);
    url = new URL(cleaned);
  } catch (error) {
    return {
      valid: false, url: String(rawUrl ?? '').slice(0, SHEET_LIMITS.MAX_URL),
      title: '', platform: PLATFORMS.GENERIC, platformLabel: PLATFORM_LABELS.generic,
      platformHost: null, topic: 'General', difficulty: 'medium', externalId: '',
      reason: error.message || 'Invalid URL',
    };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const rule = RULES.find((entry) => entry.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
  const platform = rule?.platform ?? PLATFORMS.GENERIC;
  const slug = `${url.pathname} ${url.search}`.replace(/\//g, ' ');
  const autoTitle = rule ? rule.title(url) : (slugSegment(url, /\/([^/]+)\/?$/) || host);

  return {
    valid: true,
    url: cleaned,
    title: autoTitle.slice(0, 200) || 'Untitled problem',
    platform,
    platformLabel: PLATFORM_LABELS[platform] ?? PLATFORM_LABELS.generic,
    platformHost: host,
    topic: guessTopic(slug),
    difficulty: guessDifficulty(slug),
    // YouTube uses ?v= as the real identifier; including it prevents
    // every watch URL from collapsing into one dedupe key.
    externalId: platform === PLATFORMS.YOUTUBE && url.searchParams.get('v')
      ? `${canonicalUrlKey(cleaned)}?v=${url.searchParams.get('v')}`
      : canonicalUrlKey(cleaned),
  };
}

/**
 * Pulls URLs out of pasted text. Accepts plain lines, `Title | URL`,
 * `URL | Title`, `URL, Title`, markdown `[title](url)` and numbered lists.
 * The title is only used when it is clearly supplied by the user.
 */
export function parsePastedLinks(text) {
  const lines = String(text ?? '')
    .split(/\r?\n/)
    .slice(0, SHEET_LIMITS.MAX_PASTED_LINES);

  const items = [];
  const skipped = [];
  const seen = new Set();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const markdown = line.match(/\[([^\]]{2,200})\]\((https?:\/\/[^\s)]+)\)/i);
    const urlMatch = line.match(/https?:\/\/[^\s<>"')\]]+/i);
    const rawUrl = markdown ? markdown[2] : urlMatch?.[0];
    if (!rawUrl) {
      if (!/^#|^\/\//.test(line)) skipped.push({ line: line.slice(0, 200), reason: 'No http(s) link found' });
      continue;
    }

    // Trailing punctuation from prose ("…/two-sum.") is not part of the URL.
    const tidyUrl = markdown ? rawUrl : rawUrl.replace(/[.,;:!?]+$/, '');
    let detected;
    try {
      detected = detectPlatform(tidyUrl);
    } catch {
      skipped.push({ line: line.slice(0, 200), reason: 'Malformed link' });
      continue;
    }
    if (!detected.valid) {
      skipped.push({ line: line.slice(0, 200), reason: detected.reason });
      continue;
    }

    const withoutUrl = line.replace(rawUrl, '').replace(/^[\[\(]|[\]\)]$/g, '').trim();
    const explicitTitle = markdown
      ? markdown[1].trim()
      : withoutUrl.replace(/^[-*\d.)\s|,:]+|[|,:]+$/g, '').trim();
    if (explicitTitle && explicitTitle.length >= 2 && explicitTitle.length <= 200) {
      detected.title = explicitTitle;
    }

    if (seen.has(detected.externalId)) {
      skipped.push({ line: line.slice(0, 200), reason: 'Duplicate link' });
      continue;
    }
    seen.add(detected.externalId);
    items.push(detected);
  }

  return { items, skipped, total: lines.length };
}

export default detectPlatform;
```

## `server/src/modules/sheets/sheetWorkflow.js`

```js
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
```

## `server/src/modules/sheets/sheet.service.js`

```js
import mongoose from 'mongoose';
import {
  PERMISSIONS,
  ROLES,
  SHEET_LIMITS,
  SHEET_STATUSES as S,
} from '@algonest/shared';
import { Sheet } from '../../models/Sheet.js';
import { SheetVersion } from '../../models/SheetVersion.js';
import { SheetRating } from '../../models/SheetRating.js';
import { SheetReport } from '../../models/SheetReport.js';
import { UserProgress } from '../../models/UserProgress.js';
import ApiError from '../../utils/ApiError.js';
import { uniqueSlug } from '../../utils/slug.js';
import { paginateQuery } from '../../utils/pagination.js';
import { detectPlatform, parsePastedLinks } from './platformDetector.js';
import {
  DECISION_TO_STATUS, canTransition, isEditable, transitionError,
} from './sheetWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';

/* ───────────────────────────── helpers ───────────────────────────── */

const idOf = (value) => String(value?._id ?? value ?? '');
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function ownerOf(sheet, actor) {
  return idOf(sheet.author) === idOf(actor.id);
}

function isModerator(actor) {
  return actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
}

function canManage(sheet, actor) {
  return ownerOf(sheet, actor) || isModerator(actor);
}

function assertManage(sheet, actor) {
  if (!canManage(sheet, actor)) {
    throw ApiError.forbidden('Only the author or a content moderator can change this sheet');
  }
}

function assertProblemEditable(sheet) {
  if (sheet.status === S.PUBLISHED) {
    throw ApiError.conflict('This sheet is published. Start a new revision before editing problems.');
  }
  if (!isEditable(sheet.status)) {
    throw ApiError.conflict(`Problems cannot be edited while the sheet is "${sheet.status}"`);
  }
}

async function findSheet(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid sheet id');
  const sheet = await Sheet.findById(id).populate('author', AUTHOR_FIELDS);
  if (!sheet) throw ApiError.notFound('Sheet not found');
  return sheet;
}

function pushReview(sheet, from, to, actor, decision, note) {
  sheet.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  // Bounded embedded audit trail; full audit logs arrive with the admin module.
  if (sheet.reviewHistory.length > 20) {
    sheet.reviewHistory = sheet.reviewHistory.slice(-20);
  }
}

/** Derive `topics` from problems so topic filters work without manual tagging. */
function syncTopics(sheet) {
  const explicit = (sheet.topics ?? []).filter(Boolean);
  const fromProblems = (sheet.problems ?? []).map((p) => p.topic).filter(Boolean);
  sheet.topics = [...new Set([...explicit, ...fromProblems])].slice(0, 30);
}

async function latestSnapshot(sheetId) {
  return SheetVersion.findOne({ sheet: sheetId }).sort({ version: -1 }).lean();
}

/**
 * Resolve the exact problem set a viewer should see. Students always read the
 * frozen published snapshot; authors/moderators read the working copy.
 */
export async function getVisibleSheet(id, actor) {
  const sheet = await findSheet(id);
  const manage = canManage(sheet, actor);

  if (!manage) {
    if (sheet.status === S.ARCHIVED) throw ApiError.notFound('Sheet not found');
    if (!sheet.publishedVersion) throw ApiError.notFound('This sheet is not published yet');
    const snapshot = await latestSnapshot(sheet._id);
    if (!snapshot) throw ApiError.notFound('Published version is unavailable');
    return { sheet, snapshot, problems: snapshot.problems, version: snapshot.version, manage };
  }

  return { sheet, snapshot: null, problems: sheet.problems, version: sheet.publishedVersion ?? 0, manage };
}

/* ───────────────────────────── list / read ───────────────────────────── */

export async function listSheets(query, actor) {
  const filter = {};

  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    // Moderation queue / staff status views.
    filter.status = query.status;
  } else {
    filter.publishedVersion = { $gt: 0 };
    filter.status = { $ne: S.ARCHIVED };
  }

  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { tags: rx }, { topics: rx }];
  }
  if (query.topic) filter.topics = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.goal) filter.goals = query.goal;
  if (query.platform) filter['problems.platform'] = query.platform;

  if (query.bookmarked === 'true') {
    const ids = await UserProgress.distinct('sheet', {
      user: new Types.ObjectId(actor.id), bookmark: true,
    });
    filter._id = { $in: ids };
  }

  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    rating: { 'ratingSummary.average': -1, createdAt: -1 },
    popular: { cloneCount: -1, 'ratingSummary.count': -1 },
    title: { title: 1 },
  };

  const { items, pagination } = await paginateQuery(filter, Sheet, {
    page: query.page,
    limit: query.limit,
    sort: sorts[query.sort] ?? sorts.newest,
    populate: { path: 'author', select: AUTHOR_FIELDS },
  });

  return {
    items: items.map((sheet) => {
      const view = Sheet.toPublic(sheet);
      view.problemCount = sheet.publishedVersion > 0
        ? (sheet.publishedProblemCount ?? 0)
        : (sheet.problems?.length ?? 0);
      return view;
    }),
    pagination,
  };
}

export async function getSheet(id, actor) {
  const { sheet, snapshot } = await getVisibleSheet(id, actor);
  return { sheet: Sheet.toPublic(sheet, { snapshot }), canManage: canManage(sheet, actor) };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createSheet(payload, actor) {
  const sheet = await Sheet.create({
    ...payload,
    slug: uniqueSlug(payload.title),
    author: new Types.ObjectId(actor.id),
    status: S.DRAFT,
  });
  const plain = sheet.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return Sheet.toPublic(plain);
}

export async function updateSheet(id, payload, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status === S.ARCHIVED) throw ApiError.conflict('Restore the sheet before editing it');

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'title' || key === 'description' || key === 'difficulty' || key === 'goals' || key === 'tags' || key === 'topics') {
      sheet[key] = value;
    }
  }
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function archiveSheet(id, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status === S.ARCHIVED) throw ApiError.conflict('Sheet is already archived');
  if (!canTransition(sheet.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(sheet.status, S.ARCHIVED));

  const from = sheet.status;
  sheet.status = S.ARCHIVED;
  pushReview(sheet, from, S.ARCHIVED, actor, 'archive', '');
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function restoreSheet(id, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived sheet can be restored');
  pushReview(sheet, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  sheet.status = S.DRAFT;
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

/** Published sheets must be explicitly branched: the public snapshot is frozen. */
export async function startRevision(id, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status !== S.PUBLISHED) throw ApiError.conflict('Only a published sheet can start a revision');
  pushReview(sheet, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  sheet.status = S.DRAFT;
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

/* ───────────────────────────── lifecycle ───────────────────────────── */

export async function submitForReview(id, changelog, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (!canTransition(sheet.status, S.PENDING_REVIEW)) {
    throw ApiError.conflict(transitionError(sheet.status, S.PENDING_REVIEW));
  }
  if (!sheet.problems.length) throw ApiError.unprocessable('Add at least one problem before submitting');

  const from = sheet.status;
  sheet.status = S.PENDING_REVIEW;
  sheet.submittedAt = new Date();
  pushReview(sheet, from, S.PENDING_REVIEW, actor, 'submit', changelog || '');
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function moderateSheet(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const sheet = await findSheet(id);
  // Separation of duties: never approve your own content (super admin exempt).
  if (ownerOf(sheet, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a sheet you authored');
  }
  if (sheet.status !== S.PENDING_REVIEW) {
    throw ApiError.conflict('Only sheets in review can be moderated');
  }

  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(sheet.status, target)) {
    throw ApiError.conflict(transitionError(sheet.status, target));
  }

  pushReview(sheet, sheet.status, target, actor, decision, note);
  sheet.status = target;
  sheet.reviewedBy = new Types.ObjectId(actor.id);
  sheet.reviewNote = note || '';
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function publishSheet(id, changelog, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  if (sheet.status !== S.APPROVED) {
    throw ApiError.conflict('A sheet must be approved before it can be published');
  }
  if (!sheet.problems.length) throw ApiError.unprocessable('Cannot publish an empty sheet');

  const version = (sheet.publishedVersion ?? 0) + 1;
  const problems = sheet.problems.map((p, index) => ({
    _id: p._id, // stable ids: existing progress rows keep pointing at the same problem
    title: p.title, url: p.url, platform: p.platform, platformLabel: p.platformLabel,
    difficulty: p.difficulty, topic: p.topic, order: index,
    estimatedMinutes: p.estimatedMinutes, externalId: p.externalId, hint: p.hint,
  }));

  const snapshot = await SheetVersion.create({
    sheet: sheet._id,
    version,
    problems,
    problemCount: problems.length,
    title: sheet.title,
    description: sheet.description,
    difficulty: sheet.difficulty,
    topics: sheet.topics,
    changelog: changelog || '',
    publishedBy: new Types.ObjectId(actor.id),
  });

  try {
    pushReview(sheet, sheet.status, S.PUBLISHED, actor, 'publish', changelog || '');
    sheet.status = S.PUBLISHED;
    sheet.publishedVersion = version;
    sheet.publishedProblemCount = problems.length;
    sheet.publishedAt = new Date();
    await sheet.save();
  } catch (error) {
    // Mongo standalone has no transactions; roll back the orphan snapshot.
    await SheetVersion.deleteOne({ _id: snapshot._id }).catch(() => {});
    throw error;
  }

  return { sheet: Sheet.toPublic(sheet), version: SheetVersion.toPublic(snapshot) };
}

export async function listVersions(id, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const versions = await SheetVersion.find({ sheet: sheet._id }).sort({ version: -1 }).lean();
  return { items: versions.map(SheetVersion.toPublic), sheetId: idOf(sheet) };
}

export async function getVersion(id, versionNumber, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const snapshot = await SheetVersion.findOne({ sheet: sheet._id, version: versionNumber }).lean();
  if (!snapshot) throw ApiError.notFound('Version not found');
  return { version: SheetVersion.toPublic(snapshot), problems: snapshot.problems.map((p) => ({
    id: idOf(p._id), title: p.title, url: p.url, platform: p.platform,
    platformLabel: p.platformLabel, difficulty: p.difficulty, topic: p.topic,
    order: p.order, estimatedMinutes: p.estimatedMinutes, hint: p.hint || '',
  })) };
}

/* ───────────────────────────── problems ───────────────────────────── */

/** Always re-detect platform from the URL — client claims are never trusted. */
function toProblemDocument(input, order) {
  const detected = detectPlatform(input.url);
  if (!detected.valid) throw ApiError.unprocessable(`Invalid problem URL: ${input.url}`);
  return {
    title: input.title,
    url: detected.url,
    platform: detected.platform,
    platformLabel: detected.platformLabel,
    difficulty: input.difficulty ?? detected.difficulty,
    topic: input.topic || detected.topic,
    order,
    estimatedMinutes: input.estimatedMinutes ?? 20,
    externalId: detected.externalId,
    hint: input.hint || '',
  };
}

export async function addProblems(id, inputs, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);

  if (sheet.problems.length + inputs.length > SHEET_LIMITS.MAX_PROBLEMS) {
    throw ApiError.unprocessable(`A sheet can hold at most ${SHEET_LIMITS.MAX_PROBLEMS} problems`);
  }

  const existing = new Set(sheet.problems.map((p) => p.externalId).filter(Boolean));
  const batchSeen = new Set();
  let order = sheet.problems.length;
  let added = 0;
  const skipped = [];

  for (const input of inputs) {
    const detected = detectPlatform(input.url);
    if (!detected.valid) { skipped.push({ url: input.url, reason: detected.reason }); continue; }
    if (existing.has(detected.externalId) || batchSeen.has(detected.externalId)) {
      skipped.push({ url: detected.url, reason: 'Already in this sheet' });
      continue;
    }
    batchSeen.add(detected.externalId);
    sheet.problems.push(toProblemDocument(input, order));
    order += 1;
    added += 1;
  }

  if (!added) throw ApiError.conflict('No new problems were added — all links are duplicates or invalid');
  syncTopics(sheet);
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet), added, skipped };
}

export async function updateProblem(id, problemId, patch, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);
  const problem = sheet.problems.id(problemId);
  if (!problem) throw ApiError.notFound('Problem not found in this sheet');

  if (patch.url) {
    const detected = detectPlatform(patch.url);
    if (!detected.valid) throw ApiError.unprocessable('Invalid problem URL');
    problem.url = detected.url;
    problem.platform = detected.platform;
    problem.platformLabel = detected.platformLabel;
    problem.externalId = detected.externalId;
  }
  for (const key of ['title', 'difficulty', 'topic', 'estimatedMinutes', 'hint']) {
    if (patch[key] !== undefined) problem[key] = patch[key];
  }
  syncTopics(sheet);
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export async function removeProblem(id, problemId, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);
  const problem = sheet.problems.id(problemId);
  if (!problem) throw ApiError.notFound('Problem not found in this sheet');

  const index = sheet.problems.findIndex((p) => idOf(p._id) === idOf(problemId));
  const reordered = sheet.problems.toObject ? sheet.problems.toObject() : [...sheet.problems];
  reordered.splice(index, 1);
  sheet.problems = reordered
    .sort((a, b) => a.order - b.order)
    .map((p, position) => ({ ...p, order: position }));
  syncTopics(sheet);
  await sheet.save();
  // Historical progress rows are intentionally kept: they belong to a version.
  return { sheet: Sheet.toPublic(sheet) };
}

export async function reorderProblems(id, orderedIds, actor) {
  const sheet = await findSheet(id);
  assertManage(sheet, actor);
  assertProblemEditable(sheet);

  const current = sheet.problems.map((p) => idOf(p._id));
  if (orderedIds.length !== current.length || new Set(orderedIds).size !== current.length) {
    throw ApiError.unprocessable('orderedIds must contain every problem id exactly once');
  }
  if (current.some((pid) => !orderedIds.includes(pid))) {
    throw ApiError.unprocessable('orderedIds contains an unknown problem id');
  }

  const byId = new Map(sheet.problems.map((p) => [idOf(p._id), p]));
  sheet.problems = orderedIds.map((pid, index) => {
    const problem = byId.get(pid);
    problem.order = index;
    return problem;
  });
  await sheet.save();
  return { sheet: Sheet.toPublic(sheet) };
}

export function parseLinks(text) {
  return parsePastedLinks(text);
}

/* ───────────────────────────── clone ───────────────────────────── */

export async function cloneSheet(id, actor) {
  const { sheet, problems } = await getVisibleSheet(id, actor);
  if (!problems.length) throw ApiError.unprocessable('Cannot clone an empty sheet');

  const copy = await Sheet.create({
    title: `Copy of ${sheet.title}`.slice(0, SHEET_LIMITS.MAX_TITLE),
    slug: uniqueSlug(sheet.title),
    description: sheet.description,
    author: new Types.ObjectId(actor.id),
    difficulty: sheet.difficulty,
    goals: sheet.goals,
    topics: sheet.topics,
    tags: sheet.tags,
    status: S.DRAFT,
    cloneOf: sheet._id,
    // Fresh ids: progress/bookmarks are per-sheet and must never leak across clones.
    problems: problems.map((p, index) => ({
      title: p.title, url: p.url, platform: p.platform, platformLabel: p.platformLabel,
      difficulty: p.difficulty, topic: p.topic, order: index,
      estimatedMinutes: p.estimatedMinutes, externalId: p.externalId, hint: p.hint || '',
    })),
  });
  const plain = copy.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  await Sheet.updateOne({ _id: sheet._id }, { $inc: { cloneCount: 1 } }).catch(() => {});
  return { sheet: Sheet.toPublic(plain), sourceId: idOf(sheet) };
}

/* ───────────────────────────── ratings / reviews ───────────────────────────── */

async function recomputeRatingSummary(sheetId) {
  const [agg] = await SheetRating.aggregate([
    { $match: { sheet: new Types.ObjectId(sheetId) } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Sheet.updateOne({ _id: sheetId }, {
    $set: {
      'ratingSummary.average': Number((agg?.average ?? 0).toFixed(2)),
      'ratingSummary.count': agg?.count ?? 0,
    },
  });
}

export async function listRatings(id, query, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const { items, pagination } = await paginateQuery({ sheet: sheet._id }, SheetRating, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: { path: 'user', select: AUTHOR_FIELDS },
  });
  const own = items.find((item) => idOf(item.user?._id ?? item.user) === idOf(actor.id)) ?? null;
  return {
    items: items.map(SheetRating.toPublic),
    ownRating: own ? SheetRating.toPublic(own) : null,
    pagination,
  };
}

export async function upsertRating(id, payload, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const rating = await SheetRating.findOneAndUpdate(
    { sheet: sheet._id, user: new Types.ObjectId(actor.id) },
    { $set: { rating: payload.rating, review: payload.review || '' } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  await recomputeRatingSummary(sheet._id);
  return { rating: SheetRating.toPublic({ ...rating.toObject(), user: { _id: actor.id, name: 'You' } }) };
}

export async function removeRating(id, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  await SheetRating.deleteOne({ sheet: sheet._id, user: new Types.ObjectId(actor.id) });
  await recomputeRatingSummary(sheet._id);
  return { removed: true };
}

/* ───────────────────────────── reports ───────────────────────────── */

export async function createReport(id, payload, actor) {
  const { sheet } = await getVisibleSheet(id, actor);
  const duplicate = await SheetReport.findOne({
    sheet: sheet._id, reporter: new Types.ObjectId(actor.id), status: 'open',
  }).lean();
  if (duplicate) throw ApiError.conflict('You already have an open report for this sheet');

  const report = await SheetReport.create({
    sheet: sheet._id,
    reporter: new Types.ObjectId(actor.id),
    reason: payload.reason,
    details: payload.details || '',
  });
  return { report: SheetReport.toPublic(report) };
}

export async function listReports(query, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const filter = query.status ? { status: query.status } : {};
  const { items, pagination } = await paginateQuery(filter, SheetReport, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'reporter', select: AUTHOR_FIELDS }, { path: 'sheet', select: 'title slug' }],
  });
  return { items: items.map(SheetReport.toPublic), pagination };
}

export async function resolveReport(reportId, payload, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  if (!Types.ObjectId.isValid(reportId)) throw ApiError.badRequest('Invalid report id');
  const report = await SheetReport.findById(reportId);
  if (!report) throw ApiError.notFound('Report not found');
  if (report.status !== 'open') throw ApiError.conflict('Report is already closed');

  report.status = payload.status;
  report.resolutionNote = payload.resolutionNote || '';
  report.handledBy = new Types.ObjectId(actor.id);
  report.resolvedAt = new Date();
  await report.save();
  return { report: SheetReport.toPublic(report) };
}

export default { listSheets, getSheet, createSheet };
```

## `server/src/modules/sheets/progress.service.js`

```js
import mongoose from 'mongoose';
import { COMPLETED_STATUSES, PROBLEM_STATUSES as PS, SHEET_LIMITS } from '@algonest/shared';
import { UserProgress } from '../../models/UserProgress.js';
import { PersonalResource } from '../../models/PersonalResource.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination, paginateQuery } from '../../utils/pagination.js';
import { detectPlatform } from './platformDetector.js';
import { getVisibleSheet } from './sheet.service.js';

const { Types } = mongoose;
const idOf = (value) => String(value?._id ?? value ?? '');
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Per-user learning state. Every query is scoped by `actor.id` from the access
 * token — a client can NEVER supply another user's id.
 */

function emptyRow(problem, version) {
  return {
    problemId: idOf(problem._id),
    sheetVersion: version,
    problemTitle: problem.title,
    topic: problem.topic || 'General',
    status: PS.NOT_STARTED,
    notes: '',
    bookmark: false,
    confidence: null,
    timeSpent: 0,
    revisionDate: null,
    lastReviewedAt: null,
    updatedAt: null,
  };
}

function summarise(rows) {
  const total = rows.length;
  const statusCounts = Object.fromEntries(Object.values(PS).map((status) => [status, 0]));
  const topics = new Map();

  for (const row of rows) {
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
    if (!topics.has(row.topic)) topics.set(row.topic, { topic: row.topic, total: 0, completed: 0 });
    const bucket = topics.get(row.topic);
    bucket.total += 1;
    if (COMPLETED_STATUSES.includes(row.status)) bucket.completed += 1;
  }

  const completed = COMPLETED_STATUSES.reduce((sum, status) => sum + (statusCounts[status] ?? 0), 0);
  const now = Date.now();
  return {
    total,
    completed,
    percentage: total ? Math.round((completed / total) * 100) : 0,
    statusCounts,
    bookmarks: rows.filter((row) => row.bookmark).length,
    timeSpent: rows.reduce((sum, row) => sum + (row.timeSpent ?? 0), 0),
    dueRevisions: rows.filter((row) => row.revisionDate && new Date(row.revisionDate).getTime() <= now).length,
    topicWise: [...topics.values()]
      .map((bucket) => ({ ...bucket, percentage: bucket.total ? Math.round((bucket.completed / bucket.total) * 100) : 0 }))
      .sort((a, b) => b.total - a.total || a.topic.localeCompare(b.topic)),
  };
}

export async function getProgress(sheetId, query, actor) {
  const { problems, version } = await getVisibleSheet(sheetId, actor);
  const stored = await UserProgress.find({
    user: new Types.ObjectId(actor.id), sheet: new Types.ObjectId(sheetId),
  }).lean();

  const byProblem = new Map(stored.map((row) => [idOf(row.problemId), UserProgress.toPublic(row)]));
  let rows = problems.map((problem) => byProblem.get(idOf(problem._id)) ?? emptyRow(problem, version));

  // Merge snapshot metadata into rows so old versions still show the right title.
  const problemMap = new Map(problems.map((p) => [idOf(p._id), p]));
  rows = rows.map((row) => ({
    ...row,
    problemTitle: row.problemTitle || problemMap.get(row.problemId)?.title || 'Removed problem',
    topic: row.topic || problemMap.get(row.problemId)?.topic || 'General',
    inCurrentVersion: problemMap.has(row.problemId),
  }));

  const summary = summarise(rows);

  if (query.status) rows = rows.filter((row) => row.status === query.status);
  if (query.topic) rows = rows.filter((row) => row.topic === query.topic);
  if (query.bookmarked === 'true') rows = rows.filter((row) => row.bookmark);

  const pagination = buildPagination(query.page, query.limit, rows.length, SHEET_LIMITS.MAX_PROBLEMS);
  const start = (pagination.page - 1) * pagination.limit;
  return { items: rows.slice(start, start + pagination.limit), pagination, summary, version };
}

export async function upsertProgress(sheetId, problemId, payload, actor) {
  if (!Types.ObjectId.isValid(problemId)) throw ApiError.badRequest('Invalid problem id');
  const { problems, version } = await getVisibleSheet(sheetId, actor);
  const problem = problems.find((item) => idOf(item._id) === idOf(problemId));
  if (!problem) throw ApiError.notFound('Problem not found in the published version of this sheet');

  const set = {
    problemTitle: problem.title,
    topic: problem.topic || 'General',
    sheetVersion: version,
  };
  for (const key of ['status', 'notes', 'bookmark', 'confidence', 'timeSpent', 'revisionDate']) {
    if (payload[key] !== undefined) set[key] = payload[key];
  }
  if (payload.status === PS.SOLVED) set.lastReviewedAt = new Date();
  if (payload.status && COMPLETED_STATUSES.includes(payload.status)) {
    const existing = await UserProgress.findOne({
      user: new Types.ObjectId(actor.id),
      sheet: new Types.ObjectId(sheetId),
      problemId: new Types.ObjectId(problemId),
    }).select('revisionDate').lean();
    // Spaced-repetition default: revisit in 7 days, but never overwrite a date
    // the student deliberately chose.
    if (!existing?.revisionDate && payload.revisionDate === undefined) {
      set.revisionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  const row = await UserProgress.findOneAndUpdate(
    {
      user: new Types.ObjectId(actor.id),
      sheet: new Types.ObjectId(sheetId),
      problemId: new Types.ObjectId(problemId),
    },
    { $set: set },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  return { progress: UserProgress.toPublic(row) };
}

/* ─────────────────────── personal resources ─────────────────────── */

function toResourceDocument(payload) {
  const detected = detectPlatform(payload.url);
  if (!detected.valid) throw ApiError.unprocessable('Invalid resource URL');
  return {
    title: payload.title,
    url: detected.url,
    type: payload.type,
    // The detector is authoritative; a client cannot spoof the platform key.
    platform: detected.platform,
    topic: payload.topic || detected.topic,
    note: payload.note || '',
    tags: payload.tags ?? [],
    sheetId: payload.sheetId ? new Types.ObjectId(payload.sheetId) : null,
    problemId: payload.problemId ? new Types.ObjectId(payload.problemId) : null,
    rating: payload.rating ?? null,
  };
}

export async function listPersonalResources(query, actor) {
  const filter = { user: new Types.ObjectId(actor.id) };
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: rx }, { note: rx }, { tags: rx }, { topic: rx }];
  }
  if (query.type) filter.type = query.type;
  if (query.topic) filter.topic = query.topic;
  if (query.sheetId) filter.sheetId = new Types.ObjectId(query.sheetId);

  const { items, pagination } = await paginateQuery(filter, PersonalResource, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
  return { items: items.map(PersonalResource.toPublic), pagination };
}

export async function createPersonalResource(payload, actor) {
  const resource = await PersonalResource.create({
    ...toResourceDocument(payload),
    user: new Types.ObjectId(actor.id),
  });
  return { resource: PersonalResource.toPublic(resource) };
}

export async function updatePersonalResource(resourceId, payload, actor) {
  if (!Types.ObjectId.isValid(resourceId)) throw ApiError.badRequest('Invalid resource id');
  const resource = await PersonalResource.findOne({
    _id: new Types.ObjectId(resourceId), user: new Types.ObjectId(actor.id),
  });
  if (!resource) throw ApiError.notFound('Resource not found');

  const patch = payload.url ? toResourceDocument({ ...payload }) : {};
  for (const key of ['title', 'type', 'topic', 'note', 'tags', 'rating', 'sheetId', 'problemId']) {
    if (payload[key] !== undefined) {
      patch[key] = ['sheetId', 'problemId'].includes(key) && payload[key]
        ? new Types.ObjectId(payload[key])
        : payload[key];
    }
  }
  Object.assign(resource, patch);
  await resource.save();
  return { resource: PersonalResource.toPublic(resource) };
}

export async function deletePersonalResource(resourceId, actor) {
  if (!Types.ObjectId.isValid(resourceId)) throw ApiError.badRequest('Invalid resource id');
  const result = await PersonalResource.deleteOne({
    _id: new Types.ObjectId(resourceId), user: new Types.ObjectId(actor.id),
  });
  if (!result.deletedCount) throw ApiError.notFound('Resource not found');
  return { removed: true };
}

export default { getProgress, upsertProgress };
```

## `server/src/modules/sheets/actor.js`

```js
/** Narrow, immutable view of the caller passed into every service function. */
export function actorFrom(req) {
  return {
    id: String(req.user._id),
    role: req.user.role,
    permissions: req.auth?.permissions ?? [],
  };
}

export default actorFrom;
```

## `server/src/modules/sheets/sheet.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './sheet.service.js';

const actor = (req) => actorFrom(req);

/* Catalogue */
export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listSheets(req.validated.query, actor(req)), 'Sheets fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getSheet(req.validated.params.id, actor(req)), 'Sheet fetched');
});

export const create = asyncHandler(async (req, res) => {
  const sheet = await service.createSheet(req.validated.body, actor(req));
  sendCreated(res, { sheet }, 'Draft sheet created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateSheet(req.validated.params.id, req.validated.body, actor(req)), 'Sheet updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveSheet(req.validated.params.id, actor(req)), 'Sheet archived');
});

export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreSheet(req.validated.params.id, actor(req)), 'Sheet restored to draft');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

/* Lifecycle */
export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitForReview(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Submitted for review');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateSheet(req.validated.params.id, decision, note, actor(req)), `Sheet ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishSheet(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Sheet published');
});

export const versions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listVersions(req.validated.params.id, actor(req)), 'Versions fetched');
});

export const version = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getVersion(req.validated.params.id, req.validated.params.version, actor(req)), 'Version fetched');
});

/* Problems */
export const addProblems = asyncHandler(async (req, res) => {
  sendCreated(res, await service.addProblems(req.validated.params.id, req.validated.body.problems, actor(req)), 'Problems added');
});

export const importProblems = asyncHandler(async (req, res) => {
  sendCreated(res, await service.addProblems(req.validated.params.id, req.validated.body.items, actor(req)), 'Problems imported');
});

export const parseLinks = asyncHandler(async (req, res) => {
  sendSuccess(res, service.parseLinks(req.validated.body.text), 'Links parsed');
});

export const updateProblem = asyncHandler(async (req, res) => {
  const { id, problemId } = req.validated.params;
  sendSuccess(res, await service.updateProblem(id, problemId, req.validated.body, actor(req)), 'Problem updated');
});

export const removeProblem = asyncHandler(async (req, res) => {
  const { id, problemId } = req.validated.params;
  sendSuccess(res, await service.removeProblem(id, problemId, actor(req)), 'Problem removed');
});

export const reorderProblems = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.reorderProblems(req.validated.params.id, req.validated.body.orderedIds, actor(req)), 'Problems reordered');
});

export const clone = asyncHandler(async (req, res) => {
  sendCreated(res, await service.cloneSheet(req.validated.params.id, actor(req)), 'Sheet cloned to your drafts');
});

/* Ratings & reviews */
export const ratings = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.listRatings(id, req.validated.query, actor(req)), 'Reviews fetched');
});

export const rate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.upsertRating(req.validated.params.id, req.validated.body, actor(req)), 'Rating saved');
});

export const unrate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.removeRating(req.validated.params.id, actor(req)), 'Rating removed');
});

/* Reports */
export const report = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createReport(req.validated.params.id, req.validated.body, actor(req)), 'Report submitted');
});

export const reports = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listReports(req.validated.query, actor(req)), 'Reports fetched');
});

export const resolveReport = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.resolveReport(req.validated.params.reportId, req.validated.body, actor(req)), 'Report updated');
});
```

## `server/src/modules/sheets/progress.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './progress.service.js';

const actor = (req) => actorFrom(req);

/* Progress */
export const getProgress = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.getProgress(id, req.validated.query, actor(req)), 'Progress fetched');
});

export const upsertProgress = asyncHandler(async (req, res) => {
  const { id, problemId } = req.validated.params;
  sendSuccess(res, await service.upsertProgress(id, problemId, req.validated.body, actor(req)), 'Progress saved');
});

/* Personal resources */
export const listResources = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listPersonalResources(req.validated.query, actor(req)), 'Resources fetched');
});

export const createResource = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createPersonalResource(req.validated.body, actor(req)), 'Resource saved');
});

export const updateResource = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updatePersonalResource(req.validated.params.id, req.validated.body, actor(req)), 'Resource updated');
});

export const deleteResource = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.deletePersonalResource(req.validated.params.id, actor(req)), 'Resource removed');
});
```

## `server/src/modules/sheets/sheet.routes.js`

```js
import { Router } from 'express';
import {
  addProblemsSchema, changelogSchema, importProblemsSchema, moderationSchema,
  parseLinksSchema, problemParamsSchema, problemUpdateSchema, progressQuerySchema,
  progressUpdateSchema, ratingSchema, ratingsQuerySchema, reorderProblemsSchema,
  reportParamsSchema, reportSchema, reportsQuerySchema, resolveReportSchema,
  sheetCreateSchema, sheetListQuerySchema, sheetParamsSchema, sheetUpdateSchema,
  versionParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as sheet from './sheet.controller.js';
import * as progress from './progress.controller.js';

const router = Router();

/**
 * Every sheet endpoint requires a valid access token AND completed onboarding.
 * Privileged transitions additionally require CONTENT_MODERATE; the service
 * re-checks ownership/role so a route change can never bypass RBAC.
 */
router.use(authenticate, requireOnboarded);

// ── Static paths MUST come before /:id (otherwise "reports" is parsed as an id).
router.get('/', validate({ query: sheetListQuerySchema }), sheet.list);
router.post('/', validate(sheetCreateSchema), sheet.create);
router.post('/parse-links', validate(parseLinksSchema), sheet.parseLinks);

router.get(
  '/reports',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ query: reportsQuerySchema }),
  sheet.reports,
);
router.patch(
  '/reports/:reportId',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: reportParamsSchema, body: resolveReportSchema }),
  sheet.resolveReport,
);

// ── Sheet-level routes.
router.get('/:id', validate({ params: sheetParamsSchema }), sheet.get);
router.patch('/:id', validate({ params: sheetParamsSchema, body: sheetUpdateSchema }), sheet.update);
router.delete('/:id', validate({ params: sheetParamsSchema }), sheet.archive);

router.post('/:id/restore', validate({ params: sheetParamsSchema }), sheet.restore);
router.post('/:id/revision', validate({ params: sheetParamsSchema }), sheet.revision);
router.post('/:id/submit', validate({ params: sheetParamsSchema, body: changelogSchema }), sheet.submit);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: sheetParamsSchema, body: moderationSchema }),
  sheet.moderate,
);
router.post('/:id/publish', validate({ params: sheetParamsSchema, body: changelogSchema }), sheet.publish);
router.post('/:id/clone', validate({ params: sheetParamsSchema }), sheet.clone);

router.get('/:id/versions', validate({ params: sheetParamsSchema }), sheet.versions);
router.get('/:id/versions/:version', validate({ params: versionParamsSchema }), sheet.version);

// ── Problem sub-routes. `/order` and `/import` precede `/:problemId`.
router.post('/:id/problems', validate({ params: sheetParamsSchema, body: addProblemsSchema }), sheet.addProblems);
router.post('/:id/problems/import', validate({ params: sheetParamsSchema, body: importProblemsSchema }), sheet.importProblems);
router.patch('/:id/problems/order', validate({ params: sheetParamsSchema, body: reorderProblemsSchema }), sheet.reorderProblems);
router.patch(
  '/:id/problems/:problemId',
  validate({ params: problemParamsSchema, body: problemUpdateSchema }),
  sheet.updateProblem,
);
router.delete(
  '/:id/problems/:problemId',
  validate({ params: problemParamsSchema }),
  sheet.removeProblem,
);

// ── Ratings, reviews and reports.
router.get('/:id/ratings', validate({ params: sheetParamsSchema, query: ratingsQuerySchema }), sheet.ratings);
router.put('/:id/rating', validate({ params: sheetParamsSchema, body: ratingSchema }), sheet.rate);
router.delete('/:id/rating', validate({ params: sheetParamsSchema }), sheet.unrate);
router.post('/:id/report', validate({ params: sheetParamsSchema, body: reportSchema }), sheet.report);

// ── Per-user progress (never writes to the shared Sheet).
router.get('/:id/progress', validate({ params: sheetParamsSchema, query: progressQuerySchema }), progress.getProgress);
router.put(
  '/:id/progress/:problemId',
  validate({ params: problemParamsSchema, body: progressUpdateSchema }),
  progress.upsertProgress,
);

export default router;
```

## `server/src/modules/sheets/resource.routes.js`

```js
import { Router } from 'express';
import {
  personalResourceCreateSchema, personalResourceQuerySchema,
  personalResourceUpdateSchema, resourceParamsSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './progress.controller.js';

/** Mounted at /personal-resources — private per-user link library. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: personalResourceQuerySchema }), controller.listResources);
router.post('/', validate(personalResourceCreateSchema), controller.createResource);
router.patch(
  '/:id',
  validate({ params: resourceParamsSchema, body: personalResourceUpdateSchema }),
  controller.updateResource,
);
router.delete('/:id', validate({ params: resourceParamsSchema }), controller.deleteResource);

export default router;
```

## `server/src/routes/index.js`

```js
import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response.js';
import { requireDatabase } from '../middlewares/dbGuard.middleware.js';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import sheetRoutes from '../modules/sheets/sheet.routes.js';
import personalResourceRoutes from '../modules/sheets/resource.routes.js';

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

// Phase 2 — DSA Sheets + per-user progress + private resources. All routes
// inside these routers call `authenticate` + `requireOnboarded` themselves.
router.use('/sheets', requireDatabase, sheetRoutes);
router.use('/personal-resources', requireDatabase, personalResourceRoutes);

export default router;
```

---

# Server — tests (new)

## `server/tests/sheets.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  addProblemsSchema, importProblemsSchema, parseLinksSchema, personalResourceCreateSchema,
  progressUpdateSchema, ratingSchema, reorderProblemsSchema, sheetCreateSchema,
  sheetListQuerySchema, moderationSchema,
} from '@algonest/shared';
import { SHEET_STATUSES as S } from '@algonest/shared/constants';

const { detectPlatform, parsePastedLinks, normaliseUrl } = await import('../src/modules/sheets/platformDetector.js');
const { canTransition, isEditable, DECISION_TO_STATUS } = await import('../src/modules/sheets/sheetWorkflow.js');
const { canonicalUrlKey, slugify } = await import('../src/utils/slug.js');
const { buildPagination } = await import('../src/utils/pagination.js');

const VALID = 'https://leetcode.com/problems/two-sum/';

describe('platform detection (pure, no network)', () => {
  it('detects the major judge platforms and derives readable titles', () => {
    assert.equal(detectPlatform(VALID).platform, 'leetcode');
    assert.equal(detectPlatform(VALID).title, 'Two sum');
    assert.equal(detectPlatform(VALID).topic, 'Arrays');
    assert.equal(detectPlatform('https://codeforces.com/problemset/problem/1/A').title, 'Codeforces 1A');
    assert.equal(detectPlatform('https://www.geeksforgeeks.org/binary-search/').platform, 'geeksforgeeks');
    assert.equal(detectPlatform('https://www.geeksforgeeks.org/binary-search/').topic, 'Binary Search');
    assert.equal(detectPlatform('https://www.hackerrank.com/challenges/solve-me-first/').platform, 'hackerrank');
    assert.equal(detectPlatform('https://youtu.be/abc123').platform, 'youtube');
    assert.equal(detectPlatform('https://example.com/random-thing').platform, 'generic');
  });

  it('rejects non-http schemes and never fetches remote content', () => {
    for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'file:///etc/passwd', 'not a url']) {
      assert.equal(detectPlatform(bad).valid, false, bad);
    }
    assert.throws(() => normaliseUrl('ftp://example.com/x'));
  });

  it('normalises tracking params, fragments and trailing slashes', () => {
    const clean = normaliseUrl('https://leetcode.com/problems/two-sum/?utm_source=x&ref=y#desc');
    assert.equal(clean, 'https://leetcode.com/problems/two-sum');
    assert.equal(canonicalUrlKey('https://WWW.LeetCode.com/problems/Two-Sum/'), 'leetcode.com/problems/two-sum');
  });

  it('parses mixed pasted formats and dedupes links', () => {
    const pasted = [
      'Two Sum | https://leetcode.com/problems/two-sum/',
      '1. https://leetcode.com/problems/two-sum/',
      '[DP course](https://www.youtube.com/watch?v=abc)',
      'https://www.youtube.com/watch?v=xyz',
      'this line has no link',
    ].join('\n');
    const result = parsePastedLinks(pasted);
    assert.equal(result.items.length, 3);
    assert.equal(result.items[0].title, 'Two Sum');
    assert.equal(result.items[1].title, 'DP course');
    assert.equal(result.skipped.length, 2);
    assert.equal(result.skipped[0].reason, 'Duplicate link');
  });
});

describe('content lifecycle state machine', () => {
  it('follows draft → pending_review → approved → published', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(DECISION_TO_STATUS.approve, S.APPROVED);
  });

  it('forbids publishing a draft and skipping review', () => {
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.equal(canTransition(S.PENDING_REVIEW, S.PUBLISHED), false);
  });

  it('allows a published sheet to branch into a new draft revision', () => {
    assert.ok(canTransition(S.PUBLISHED, S.DRAFT));
    assert.equal(isEditable(S.PUBLISHED), false);
    assert.equal(isEditable(S.DRAFT), true);
    assert.equal(isEditable(S.CHANGES_REQUESTED), true);
  });

  it('requires a restore before editing an archived sheet', () => {
    assert.equal(canTransition(S.ARCHIVED, S.PUBLISHED), false);
    assert.ok(canTransition(S.ARCHIVED, S.DRAFT));
  });
});

describe('Phase-2 Zod contracts', () => {
  it('validates sheet creation and strips unknown keys', () => {
    const parsed = sheetCreateSchema.parse({ title: '  Arrays mastery  ' });
    assert.equal(parsed.title, 'Arrays mastery');
    assert.equal(parsed.difficulty, 'medium');
    assert.deepEqual(parsed.topics, []);
    assert.equal(sheetCreateSchema.safeParse({ title: 'abc' }).success, false);
    assert.equal(sheetCreateSchema.safeParse({ title: 'Valid title', status: 'published' }).success, false);
  });

  it('rejects unsafe URLs in problems, imports and personal resources', () => {
    assert.equal(addProblemsSchema.safeParse({ problems: [{ title: 'Two sum', url: VALID }] }).success, true);
    assert.equal(addProblemsSchema.safeParse({ problems: [{ title: 'Two sum', url: 'javascript:alert(1)' }] }).success, false);
    assert.equal(importProblemsSchema.safeParse({ items: [] }).success, false);
    assert.equal(personalResourceCreateSchema.safeParse({ title: 'Doc', url: 'file:///etc/passwd' }).success, false);
  });

  it('requires every id exactly once for reorder', () => {
    const a = '507f1f77bcf86cd799439011';
    const b = '507f1f77bcf86cd799439012';
    assert.equal(reorderProblemsSchema.safeParse({ orderedIds: [a, b] }).success, true);
    assert.equal(reorderProblemsSchema.safeParse({ orderedIds: [a, a] }).success, false);
  });

  it('requires a note when requesting changes or rejecting', () => {
    assert.equal(moderationSchema.safeParse({ decision: 'approve' }).success, true);
    assert.equal(moderationSchema.safeParse({ decision: 'reject', note: '' }).success, false);
    assert.equal(moderationSchema.safeParse({ decision: 'reject', note: 'Broken links' }).success, true);
  });

  it('validates progress patches, ratings and list pagination', () => {
    assert.equal(progressUpdateSchema.safeParse({}).success, false);
    assert.equal(progressUpdateSchema.safeParse({ notes: 'remember prefix sums' }).success, true);
    assert.equal(progressUpdateSchema.safeParse({ confidence: 6 }).success, false);
    assert.equal(ratingSchema.safeParse({ rating: 9 }).success, false);
    const list = sheetListQuerySchema.parse({ page: '2', limit: '5', sort: 'rating' });
    assert.equal(list.page, 2);
    assert.equal(list.limit, 5);
    assert.equal(sheetListQuerySchema.safeParse({ limit: '1000' }).success, false);
    assert.equal(parseLinksSchema.safeParse({ text: '' }).success, false);
  });

  it('builds a bounded pagination envelope', () => {
    assert.deepEqual(buildPagination(2, 10, 25), {
      page: 2, limit: 10, total: 25, totalPages: 3, hasNext: true, hasPrev: true,
    });
    assert.equal(buildPagination(0, 0, 0).page, 1);
    assert.equal(buildPagination(1, 999, 1).limit, 100);
  });

  it('slugifies titles safely', () => {
    assert.equal(slugify('  Binary Trees — Part 1! '), 'binary-trees-part-1');
    assert.equal(slugify('###'), 'sheet');
  });
});
```

## `server/tests/sheets.service.test.js`

```js
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { PERMISSIONS, ROLES } from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { Sheet } = await import('../src/models/Sheet.js');
const { SheetVersion } = await import('../src/models/SheetVersion.js');
const { UserProgress } = await import('../src/models/UserProgress.js');
const service = await import('../src/modules/sheets/sheet.service.js');
const progressService = await import('../src/modules/sheets/progress.service.js');

const SHEET_ID = '507f1f77bcf86cd799439011';
const OWNER_ID = '507f1f77bcf86cd799439001';
const OTHER_ID = '507f1f77bcf86cd799439002';
const PROBLEM_ID = '507f1f77bcf86cd7994390aa';

const stubs = [];
function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}
afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs.length = 0;
});

const owner = { id: OWNER_ID, role: ROLES.STUDENT, permissions: [] };
const moderator = {
  id: OTHER_ID, role: ROLES.CONTENT_MODERATOR,
  permissions: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ],
};

function makeSheet(overrides = {}) {
  return new Sheet({
    _id: new mongoose.Types.ObjectId(SHEET_ID),
    title: 'Arrays Mastery',
    slug: 'arrays-mastery-abc123',
    author: new mongoose.Types.ObjectId(OWNER_ID),
    status: 'draft',
    difficulty: 'easy',
    goals: [], topics: [], tags: [],
    problems: [{
      _id: new mongoose.Types.ObjectId(PROBLEM_ID),
      title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum',
      platform: 'leetcode', platformLabel: 'LeetCode', difficulty: 'easy',
      topic: 'Arrays', order: 0, estimatedMinutes: 20,
      externalId: 'leetcode.com/problems/two-sum', hint: '',
    }],
    ...overrides,
  });
}

function stubFind(sheet) {
  stub(Sheet, 'findById', () => ({ populate: async () => sheet }));
}
function stubSave() {
  stub(Sheet.prototype, 'save', async function save() { return this; });
}

describe('sheet.service — authorisation + lifecycle', () => {
  it('blocks a non-author student from editing', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    const stranger = { id: OTHER_ID, role: ROLES.STUDENT, permissions: [] };
    await assert.rejects(
      () => service.updateSheet(SHEET_ID, { title: 'Hacked' }, stranger),
      (error) => error.statusCode === 403,
    );
  });

  it('allows a moderator to edit but not to moderate their own sheet', async () => {
    const sheet = makeSheet({ status: 'pending_review', author: new mongoose.Types.ObjectId(OTHER_ID) });
    stubFind(sheet);
    await assert.rejects(
      () => service.moderateSheet(SHEET_ID, 'approve', '', moderator),
      (error) => error.statusCode === 403 && /authored|own sheet/i.test(error.message),
    );
  });

  it('refuses to submit an empty sheet', async () => {
    const sheet = makeSheet({ problems: [] });
    stubFind(sheet);
    await assert.rejects(
      () => service.submitForReview(SHEET_ID, '', owner),
      (error) => error.statusCode === 422,
    );
  });

  it('follows draft → pending_review → approved', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    stubSave();
    await service.submitForReview(SHEET_ID, 'first draft', owner);
    assert.equal(sheet.status, 'pending_review');
    assert.equal(sheet.reviewHistory.length, 1);

    await service.moderateSheet(SHEET_ID, 'approve', 'LGTM', moderator);
    assert.equal(sheet.status, 'approved');
    assert.equal(sheet.reviewNote, 'LGTM');
  });

  it('rejects a change-request decision without a note', async () => {
    const { moderationSchema } = await import('@algonest/shared');
    assert.equal(moderationSchema.safeParse({ decision: 'request_changes', note: '' }).success, false);
  });

  it('cannot publish before approval', async () => {
    const sheet = makeSheet({ status: 'draft' });
    stubFind(sheet);
    await assert.rejects(
      () => service.publishSheet(SHEET_ID, '', owner),
      (error) => error.statusCode === 409,
    );
  });
});

describe('sheet.service — versioning', () => {
  it('publishes an immutable snapshot with stable problem ids', async () => {
    const sheet = makeSheet({ status: 'approved', publishedVersion: 0 });
    stubFind(sheet);
    stubSave();

    let snapshot = null;
    stub(SheetVersion, 'create', async (doc) => {
      snapshot = doc;
      return { ...doc, _id: new mongoose.Types.ObjectId(), toObject() { return { ...this }; } };
    });

    const result = await service.publishSheet(SHEET_ID, 'v1', owner);
    assert.equal(sheet.status, 'published');
    assert.equal(sheet.publishedVersion, 1);
    assert.equal(sheet.publishedProblemCount, 1);
    assert.equal(snapshot.version, 1);
    assert.equal(snapshot.problemCount, 1);
    // The SAME id is copied, otherwise historical progress rows would orphan.
    assert.equal(String(snapshot.problems[0]._id), String(PROBLEM_ID));
    assert.equal(result.sheet.status, 'published');
  });

  it('rolls back the snapshot when the sheet save fails', async () => {
    const sheet = makeSheet({ status: 'approved' });
    stubFind(sheet);
    stub(Sheet.prototype, 'save', async () => { throw new Error('write failed'); });
    let deleted = 0;
    stub(SheetVersion, 'create', async (doc) => ({ ...doc, _id: new mongoose.Types.ObjectId(), toObject() { return { ...this }; } }));
    stub(SheetVersion, 'deleteOne', async () => { deleted += 1; return { deletedCount: 1 }; });

    await assert.rejects(() => service.publishSheet(SHEET_ID, '', owner), /write failed/);
    assert.equal(deleted, 1);
  });

  it('forces a new revision before editing a published sheet', async () => {
    const sheet = makeSheet({ status: 'published', publishedVersion: 1 });
    stubFind(sheet);
    await assert.rejects(
      () => service.addProblems(SHEET_ID, [{ title: 'New', url: 'https://leetcode.com/problems/new', difficulty: 'easy', topic: 'Arrays', estimatedMinutes: 10 }], owner),
      (error) => error.statusCode === 409 && /revision/i.test(error.message),
    );
  });
});

describe('sheet.service — problems + bulk import', () => {
  it('re-detects the platform server-side and dedupes by canonical URL', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    stubSave();

    const result = await service.addProblems(SHEET_ID, [
      { title: 'Two Sum duplicate', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'hard', topic: 'Arrays', estimatedMinutes: 15 },
      { title: 'Binary Search', url: 'https://www.geeksforgeeks.org/binary-search/', difficulty: 'medium', topic: '', estimatedMinutes: 20 },
    ], owner);

    assert.equal(result.added, 1, 'duplicate leetcode link must be skipped');
    assert.equal(result.skipped.length, 1);
    const added = sheet.problems[1];
    assert.equal(added.platform, 'geeksforgeeks', 'platform comes from the URL, not the client');
    assert.equal(added.topic, 'Binary Search');
    assert.equal(added.order, 1);
    assert.ok(sheet.topics.includes('Binary Search'), 'topics are derived from problems');
  });

  it('rejects a full reorder list with unknown or missing ids', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    await assert.rejects(
      () => service.reorderProblems(SHEET_ID, [PROBLEM_ID, '507f1f77bcf86cd7994390bb'], owner),
      (error) => error.statusCode === 422,
    );
  });
});

describe('progress.service — per-user state', () => {
  it('computes percentage and topic-wise progress from the visible version', async () => {
    const sheet = makeSheet({ status: 'published', publishedVersion: 1 });
    stubFind(sheet);
    stub(UserProgress, 'find', () => ({ lean: async () => [{
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(OWNER_ID),
      sheet: new mongoose.Types.ObjectId(SHEET_ID),
      problemId: new mongoose.Types.ObjectId(PROBLEM_ID),
      sheetVersion: 1, problemTitle: 'Two Sum', topic: 'Arrays',
      status: 'solved', notes: 'hash map', bookmark: true, confidence: 4,
      timeSpent: 20, revisionDate: null, lastReviewedAt: null,
      updatedAt: new Date(),
    }] }));

    const result = await progressService.getProgress(SHEET_ID, { page: 1, limit: 300 }, owner);
    assert.equal(result.summary.total, 1);
    assert.equal(result.summary.completed, 1);
    assert.equal(result.summary.percentage, 100);
    assert.equal(result.summary.bookmarks, 1);
    assert.equal(result.summary.topicWise[0].topic, 'Arrays');
    assert.equal(result.items[0].notes, 'hash map');
  });

  it('rejects progress for a problem that is not in the visible version', async () => {
    const sheet = makeSheet({ status: 'published', publishedVersion: 1 });
    stubFind(sheet);
    await assert.rejects(
      () => progressService.upsertProgress(SHEET_ID, '507f1f77bcf86cd7994390cc', { status: 'solved' }, owner),
      (error) => error.statusCode === 404,
    );
  });
});
```

## `server/tests/sheets.routes.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const base = `/api/${env.API_VERSION}`;
const request = supertest(createApp());

/** Auth-before-validation is a security invariant, not just a status code. */
describe('Phase-2 route protection', () => {
  it('rejects anonymous access to every sheets sub-route', async () => {
    const endpoints = [
      ['get', '/sheets'], ['post', '/sheets'], ['get', '/sheets/507f1f77bcf86cd799439011'],
      ['post', '/sheets/parse-links'], ['get', '/sheets/reports'],
      ['patch', '/sheets/507f1f77bcf86cd799439011/problems/order'],
      ['put', '/sheets/507f1f77bcf86cd799439011/progress/507f1f77bcf86cd799439012'],
      ['get', '/personal-resources'], ['post', '/personal-resources'],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path} should require a token`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const res = await request.post(`${base}/sheets`).send({ title: 'x', bogus: true });
    assert.equal(res.status, 401);
    assert.equal(res.body.errors, null);
  });

  it('keeps the health probe public', async () => {
    const res = await request.get(`${base}/health`);
    assert.equal(res.status, 200);
  });
});
```

---

# Client — shared primitives + wiring (new/modified)

## `client/src/components/ui/Modal.jsx`

```jsx
import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

/**
 * Accessible dialog: labelled, Escape-to-close, focus moved inside on open and
 * returned to the trigger on close. No focus-trap dependency — the small number
 * of controls in each dialog keeps Tab order predictable.
 */
export default function Modal({ open, onClose, title, description, children, footer, className, size = 'md' }) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusable = panel?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
    };
    document.addEventListener('keydown', onKeyDown);
    // Prevent background scrolling while the dialog is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-2xl',
          size === 'lg' ? 'sm:max-w-3xl' : size === 'sm' ? 'sm:max-w-md' : 'sm:max-w-xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-ink">{title}</h2>
            {description ? <p id={descriptionId} className="mt-1 text-xs text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="ag-scrollbar flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
```

## `client/src/components/ui/ProgressBar.jsx`

```jsx
import { cn } from '../../lib/cn.js';

/** Deterministic, accessible progress meter (no animation dependency). */
export default function ProgressBar({ value = 0, max = 100, label, className, tone = 'primary' }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  const TONES = { primary: 'bg-primary', accent: 'bg-accent', success: 'bg-success', warning: 'bg-warning' };
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `${percent}% complete`}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-2', className)}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-500', TONES[tone] ?? TONES.primary)} style={{ width: `${percent}%` }} />
    </div>
  );
}
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

// Phase 2 — DSA Sheets. Loaded only when the sheets routes are visited.
const SheetsPage = lazy(() => import('../features/sheets/pages/SheetsPage.jsx'));
const SheetDetailPage = lazy(() => import('../features/sheets/pages/SheetDetailPage.jsx'));
const SheetEditorPage = lazy(() => import('../features/sheets/pages/SheetEditorPage.jsx'));

// Quizzes, Mocks, Plans, Resources and Community keep their honest placeholder
// until their phase lands.
const UPCOMING_MODULES = ['quizzes', 'mocks', 'plans', 'resources', 'community'];

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

              {/* Static segments are ranked above /:id by React Router. */}
              <Route path="sheets" element={<SheetsPage />} />
              <Route path="sheets/new" element={<SheetEditorPage />} />
              <Route path="sheets/:id" element={<SheetDetailPage />} />
              <Route path="sheets/:id/edit" element={<SheetEditorPage />} />

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
  // Phase 2 — DSA Sheets. Keys are deterministic so invalidation is precise.
  sheets: {
    all: ['sheets'],
    list: (params) => ['sheets', 'list', params],
    detail: (id) => ['sheets', 'detail', id],
    versions: (id) => ['sheets', 'versions', id],
    ratings: (id, params) => ['sheets', 'ratings', id, params],
    reports: (params) => ['sheets', 'reports', params],
    progress: (id, params) => ['sheets', 'progress', id, params],
  },
  personalResources: {
    all: ['personal-resources'],
    list: (params) => ['personal-resources', 'list', params],
  },
};

export default queryKeys;
```

## `client/src/lib/navigation.js`

```js
/** Single source for sidebar + topbar search. `ready: false` = Phase 2+. */
export const NAV_ITEMS = [
  { label: 'Home', to: '/app', icon: 'LayoutDashboard', end: true, ready: true },
  { label: 'Sheets', to: '/app/sheets', icon: 'BookOpen', ready: true },
  { label: 'Quizzes', to: '/app/quizzes', icon: 'ListChecks', ready: false },
  { label: 'Mocks', to: '/app/mocks', icon: 'Timer', ready: false },
  { label: 'Plans', to: '/app/plans', icon: 'CalendarRange', ready: false },
  { label: 'Resources', to: '/app/resources', icon: 'FolderOpen', ready: false },
  { label: 'Community', to: '/app/community', icon: 'Users', ready: false },
];

export const isNavReady = (pathname) => NAV_ITEMS.find((item) => item.to === pathname)?.ready ?? true;
```

## `client/src/hooks/useDebouncedValue.js`

```js
import { useEffect, useState } from 'react';

/** Keeps text inputs responsive while avoiding a request per keystroke. */
export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
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
  ['SheetsPage', '/src/features/sheets/pages/SheetsPage.jsx'],
  ['SheetDetailPage', '/src/features/sheets/pages/SheetDetailPage.jsx'],
  ['SheetEditorPage', '/src/features/sheets/pages/SheetEditorPage.jsx'],
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

---

# Client — sheets feature: api, hooks, lib (new)

## `client/src/features/sheets/api/sheetsApi.js`

```js
import api from '../../../lib/apiClient.js';

/**
 * Thin, typed-by-contract wrapper around the shared apiClient. Every call goes
 * through `/api/v1` with the in-memory access token and the httpOnly refresh
 * cookie; no token or user id is ever passed from a component.
 */
export const sheetsApi = {
  list: (params) => api.get('/sheets', { query: params }),
  get: (id) => api.get(`/sheets/${id}`),
  create: (body) => api.post('/sheets', body),
  update: (id, body) => api.patch(`/sheets/${id}`, body),
  archive: (id) => api.delete(`/sheets/${id}`),
  restore: (id) => api.post(`/sheets/${id}/restore`, {}),
  revision: (id) => api.post(`/sheets/${id}/revision`, {}),
  submit: (id, changelog = '') => api.post(`/sheets/${id}/submit`, { changelog }),
  moderate: (id, body) => api.post(`/sheets/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/sheets/${id}/publish`, { changelog }),
  clone: (id) => api.post(`/sheets/${id}/clone`, {}),

  versions: (id) => api.get(`/sheets/${id}/versions`),
  version: (id, version) => api.get(`/sheets/${id}/versions/${version}`),

  parseLinks: (text) => api.post('/sheets/parse-links', { text }),
  addProblems: (id, problems) => api.post(`/sheets/${id}/problems`, { problems }),
  importProblems: (id, items) => api.post(`/sheets/${id}/problems/import`, { items }),
  updateProblem: (id, problemId, body) => api.patch(`/sheets/${id}/problems/${problemId}`, body),
  removeProblem: (id, problemId) => api.delete(`/sheets/${id}/problems/${problemId}`),
  reorderProblems: (id, orderedIds) => api.patch(`/sheets/${id}/problems/order`, { orderedIds }),

  ratings: (id, params) => api.get(`/sheets/${id}/ratings`, { query: params }),
  rate: (id, body) => api.put(`/sheets/${id}/rating`, body),
  unrate: (id) => api.delete(`/sheets/${id}/rating`),
  report: (id, body) => api.post(`/sheets/${id}/report`, body),
  reports: (params) => api.get('/sheets/reports', { query: params }),
  resolveReport: (reportId, body) => api.patch(`/sheets/reports/${reportId}`, body),
};

export default sheetsApi;
```

## `client/src/features/sheets/api/progressApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Per-user state: progress + private resources. Always scoped by the session. */
export const progressApi = {
  list: (sheetId, params) => api.get(`/sheets/${sheetId}/progress`, { query: params }),
  update: (sheetId, problemId, body) => api.put(`/sheets/${sheetId}/progress/${problemId}`, body),

  resources: (params) => api.get('/personal-resources', { query: params }),
  createResource: (body) => api.post('/personal-resources', body),
  updateResource: (id, body) => api.patch(`/personal-resources/${id}`, body),
  deleteResource: (id) => api.delete(`/personal-resources/${id}`),
};

export default progressApi;
```

## `client/src/features/sheets/hooks/useSheets.js`

```js
import {
  keepPreviousData, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import sheetsApi from '../api/sheetsApi.js';
import progressApi from '../api/progressApi.js';

/** Central invalidation helpers — one place decides what a mutation dirties. */
function useInvalidators() {
  const qc = useQueryClient();
  return {
    lists: () => qc.invalidateQueries({ queryKey: queryKeys.sheets.all }),
    detail: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.sheets.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.versions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.all });
    },
    ratings: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.sheets.ratings(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.all });
    },
    progress: (id) => qc.invalidateQueries({ queryKey: queryKeys.sheets.progress(id) }),
    resources: () => qc.invalidateQueries({ queryKey: queryKeys.personalResources.all }),
    reports: () => qc.invalidateQueries({ queryKey: queryKeys.sheets.reports() }),
  };
}

/* ───────────────────────────── queries ───────────────────────────── */

export function useSheetList(params) {
  return useQuery({
    queryKey: queryKeys.sheets.list(params),
    queryFn: () => sheetsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useSheet(id) {
  return useQuery({
    queryKey: queryKeys.sheets.detail(id),
    queryFn: () => sheetsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useSheetVersions(id) {
  return useQuery({
    queryKey: queryKeys.sheets.versions(id),
    queryFn: () => sheetsApi.versions(id),
    enabled: Boolean(id),
  });
}

export function useRatings(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.sheets.ratings(id, params),
    queryFn: () => sheetsApi.ratings(id, params),
    enabled: Boolean(id),
  });
}

export function useReports(params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.sheets.reports(params),
    queryFn: () => sheetsApi.reports(params),
    enabled,
  });
}

export function useProgress(sheetId, params = {}) {
  return useQuery({
    queryKey: queryKeys.sheets.progress(sheetId, params),
    queryFn: () => progressApi.list(sheetId, params),
    enabled: Boolean(sheetId),
    placeholderData: keepPreviousData,
  });
}

export function usePersonalResources(params = {}) {
  return useQuery({
    queryKey: queryKeys.personalResources.list(params),
    queryFn: () => progressApi.resources(params),
    placeholderData: keepPreviousData,
  });
}

/* ───────────────────────────── mutations ───────────────────────────── */

export function useCreateSheet() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: sheetsApi.create,
    onSuccess: () => invalidate.lists(),
  });
}

export function useUpdateSheet(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => sheetsApi.update(id, body),
    onSuccess: () => invalidate.detail(id),
  });
}

export function useArchiveSheet() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: sheetsApi.archive,
    onSuccess: () => invalidate.lists(),
  });
}

/** Lifecycle actions (submit / moderate / publish / restore / revision). */
export function useSheetLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.detail(id);
  return {
    submit: useMutation({ mutationFn: (changelog) => sheetsApi.submit(id, changelog), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => sheetsApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: (changelog) => sheetsApi.publish(id, changelog), onSuccess }),
    restore: useMutation({ mutationFn: () => sheetsApi.restore(id), onSuccess }),
    revision: useMutation({ mutationFn: () => sheetsApi.revision(id), onSuccess }),
  };
}

export function useProblemMutations(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.detail(id);
  return {
    add: useMutation({ mutationFn: (problems) => sheetsApi.addProblems(id, problems), onSuccess }),
    importItems: useMutation({ mutationFn: (items) => sheetsApi.importProblems(id, items), onSuccess }),
    update: useMutation({ mutationFn: ({ problemId, body }) => sheetsApi.updateProblem(id, problemId, body), onSuccess }),
    remove: useMutation({ mutationFn: (problemId) => sheetsApi.removeProblem(id, problemId), onSuccess }),
    reorder: useMutation({ mutationFn: (orderedIds) => sheetsApi.reorderProblems(id, orderedIds), onSuccess }),
  };
}

export function useParseLinks() {
  return useMutation({ mutationFn: (text) => sheetsApi.parseLinks(text) });
}

export function useCloneSheet() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: sheetsApi.clone, onSuccess: () => invalidate.lists() });
}

export function useRateSheet(id) {
  const invalidate = useInvalidators();
  return {
    rate: useMutation({ mutationFn: (body) => sheetsApi.rate(id, body), onSuccess: () => invalidate.ratings(id) }),
    unrate: useMutation({ mutationFn: () => sheetsApi.unrate(id), onSuccess: () => invalidate.ratings(id) }),
  };
}

export function useReportSheet(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => sheetsApi.report(id, body),
    onSuccess: () => invalidate.reports(),
  });
}

export function useResolveReport() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ reportId, body }) => sheetsApi.resolveReport(reportId, body),
    onSuccess: () => invalidate.reports(),
  });
}

export function useUpdateProgress(sheetId) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ problemId, body }) => progressApi.update(sheetId, problemId, body),
    onSuccess: () => invalidate.progress(sheetId),
  });
}

export function useResourceMutations() {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.resources();
  return {
    create: useMutation({ mutationFn: progressApi.createResource, onSuccess }),
    update: useMutation({ mutationFn: ({ id, body }) => progressApi.updateResource(id, body), onSuccess }),
    remove: useMutation({ mutationFn: progressApi.deleteResource, onSuccess }),
  };
}

export default useSheetList;
```

## `client/src/features/sheets/lib/sheetUtils.js`

```js
import {
  DIFFICULTY_LABELS, PLATFORM_LABELS, PROBLEM_STATUS_LABELS,
  RESOURCE_TYPE_VALUES, SHEET_STATUS_LABELS, SHEET_TOPICS,
} from '@algonest/shared';

export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({ value, label }));
export const STATUS_OPTIONS = Object.entries(PROBLEM_STATUS_LABELS).map(([value, label]) => ({ value, label }));
export const TOPIC_OPTIONS = SHEET_TOPICS.map((value) => ({ value, label: value }));
export const RESOURCE_TYPE_OPTIONS = RESOURCE_TYPE_VALUES.map((value) => ({
  value, label: value.charAt(0).toUpperCase() + value.slice(1),
}));
export const REASON_OPTIONS = [
  { value: 'broken_link', label: 'Broken / dead link' },
  { value: 'wrong_content', label: 'Wrong topic or difficulty' },
  { value: 'duplicate', label: 'Duplicate content' },
  { value: 'copyright', label: 'Copyright issue' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'other', label: 'Something else' },
];

export const statusLabel = (status) => SHEET_STATUS_LABELS[status] ?? status;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;
export const platformLabel = (value) => PLATFORM_LABELS[value] ?? 'Other';
export const problemStatusLabel = (value) => PROBLEM_STATUS_LABELS[value] ?? value;

export const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };
export const STATUS_TONE = {
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
};
export const PROBLEM_STATUS_TONE = {
  not_started: 'neutral', attempted: 'warning', solved: 'success',
  revising: 'accent', skipped: 'neutral',
};

/** Human error message from an ApiClientError or plain Error. */
export function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong. Please try again.';
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatMinutes(value = 0) {
  const minutes = Number(value) || 0;
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** Zod field errors from a shared-contract parse, for inline form feedback. */
export function contractErrors(error) {
  const result = {};
  for (const issue of error?.issues ?? []) {
    const key = issue.path.join('.') || '_';
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

export default { errorMessage, formatDate };
```

---

# Client — sheets feature: components (new)

## `client/src/features/sheets/components/SheetFilters.jsx`

```jsx
import { GOAL_OPTIONS } from '@algonest/shared/constants';
import { PLATFORM_LABELS } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS } from '../lib/sheetUtils.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'popular', label: 'Most cloned' },
  { value: 'title', label: 'Title A–Z' },
];

const PLATFORM_OPTIONS = Object.entries(PLATFORM_LABELS)
  .filter(([value]) => ['leetcode', 'codeforces', 'geeksforgeeks', 'hackerrank', 'codechef', 'neetcode', 'youtube', 'generic'].includes(value))
  .map(([value, label]) => ({ value, label }));

const EMPTY = { q: '', topic: '', difficulty: '', goal: '', platform: '', sort: 'newest', bookmarked: false };

/** Controlled filter bar. Parents own the state so URLs can stay in sync. */
export default function SheetFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search"
        placeholder="Title, tag or topic…"
        value={filters.q || ''}
        onChange={(event) => set('q', event.target.value)}
        className="sm:col-span-2"
      />
      <Select
        label="Topic"
        placeholder="All topics"
        options={TOPIC_OPTIONS}
        value={filters.topic || ''}
        onChange={(event) => set('topic', event.target.value)}
      />
      <Select
        label="Difficulty"
        placeholder="Any difficulty"
        options={DIFFICULTY_OPTIONS}
        value={filters.difficulty || ''}
        onChange={(event) => set('difficulty', event.target.value)}
      />
      <Select
        label="Goal"
        placeholder="Any goal"
        options={GOAL_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
        value={filters.goal || ''}
        onChange={(event) => set('goal', event.target.value)}
      />
      <Select
        label="Platform"
        placeholder="Any platform"
        options={PLATFORM_OPTIONS}
        value={filters.platform || ''}
        onChange={(event) => set('platform', event.target.value)}
      />
      <Select
        label="Sort by"
        options={SORT_OPTIONS}
        value={filters.sort || 'newest'}
        onChange={(event) => set('sort', event.target.value)}
      />
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <label className="flex h-11 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={Boolean(filters.bookmarked)}
            onChange={(event) => set('bookmarked', event.target.checked)}
            className="h-4 w-4 accent-[var(--ag-primary)]"
          />
          Bookmarked only
        </label>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => onChange({ ...EMPTY })}
          title="Clear filters"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

export { EMPTY as EMPTY_SHEET_FILTERS };
```

## `client/src/features/sheets/components/SheetCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { BookOpen, Copy, Star } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import {
  DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, formatDate, statusLabel,
} from '../lib/sheetUtils.js';

/** Catalogue card — plain Tailwind for speed; hover is CSS only. */
export default function SheetCard({ sheet, showStatus = false }) {
  const average = Number(sheet.ratingSummary?.average ?? 0);
  return (
    <Link
      to={`/app/sheets/${sheet.id}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant={DIFFICULTY_TONE[sheet.difficulty]}>{difficultyLabel(sheet.difficulty)}</Badge>
        {showStatus ? <Badge variant={STATUS_TONE[sheet.status]}>{statusLabel(sheet.status)}</Badge> : null}
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-snug text-ink group-hover:text-primary">
        {sheet.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
        {sheet.description || 'A structured problem progression for focused DSA practice.'}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(sheet.topics ?? []).slice(0, 3).map((topic) => (
          <span key={topic} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{topic}</span>
        ))}
        {(sheet.topics ?? []).length > 3 ? (
          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">+{sheet.topics.length - 3}</span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {sheet.problemCount ?? 0} problems</span>
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning" aria-hidden="true" /> {average.toFixed(1)} ({sheet.ratingSummary?.count ?? 0})</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
        <span>by {sheet.author?.name ?? 'AlgoNest creator'}</span>
        <span className="inline-flex items-center gap-2">
          {sheet.cloneCount ? <span className="inline-flex items-center gap-1"><Copy className="h-3 w-3" aria-hidden="true" />{sheet.cloneCount}</span> : null}
          {formatDate(sheet.publishedAt || sheet.createdAt)}
        </span>
      </div>
    </Link>
  );
}
```

## `client/src/features/sheets/components/ProblemList.jsx`

```jsx
import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowUp, Bookmark, GripVertical, Pencil, Search, Trash2,
} from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import { STATUS_OPTIONS, problemStatusLabel } from '../lib/sheetUtils.js';
import { cn } from '../../../lib/cn.js';

const DOT = {
  not_started: 'bg-muted/50', attempted: 'bg-warning', solved: 'bg-success',
  revising: 'bg-accent', skipped: 'bg-line',
};
// Static class strings so Tailwind's scanner can see every variant.
const STATUS_TEXT = {
  not_started: 'text-muted', attempted: 'text-warning', solved: 'text-success',
  revising: 'text-accent', skipped: 'text-muted',
};

/**
 * Left pane of the sheet workspace. Native HTML5 drag-and-drop plus explicit
 * keyboard move buttons — a mouse-free user can reorder the whole list.
 */
export default function ProblemList({
  problems, progressById = {}, selectedId, onSelect,
  reorderable = false, onReorder, onEdit, onDelete, loading = false,
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dragId, setDragId] = useState(null);

  const visible = useMemo(() => problems.filter((problem) => {
    if (query && !`${problem.title} ${problem.topic}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (statusFilter && (progressById[problem.id]?.status ?? 'not_started') !== statusFilter) return false;
    return true;
  }), [problems, query, statusFilter, progressById]);

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= problems.length) return;
    const ids = problems.map((problem) => problem.id);
    const [moved] = ids.splice(index, 1);
    ids.splice(target, 0, moved);
    onReorder?.(ids);
  };

  const dropOn = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); return; }
    const ids = problems.map((problem) => problem.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) { setDragId(null); return; }
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    setDragId(null);
    onReorder?.(ids);
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-line bg-surface">
      <div className="space-y-2 border-b border-line p-3">
        <Input
          placeholder="Filter problems…"
          icon={Search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter problems"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          className="h-9 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-muted focus:border-primary focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <ul className="ag-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto p-2" aria-label="Problems">
        {visible.map((problem) => {
          const index = problems.findIndex((item) => item.id === problem.id);
          const progress = progressById[problem.id];
          const status = progress?.status ?? 'not_started';
          const isSelected = problem.id === selectedId;
          return (
            <li
              key={problem.id}
              draggable={reorderable}
              onDragStart={() => setDragId(problem.id)}
              onDragOver={(event) => { if (reorderable) event.preventDefault(); }}
              onDrop={() => dropOn(problem.id)}
              onDragEnd={() => setDragId(null)}
              className={cn(
                'group rounded-xl border transition-colors',
                isSelected ? 'border-primary/50 bg-primary/8' : 'border-transparent hover:bg-surface-2',
                dragId === problem.id && 'opacity-50',
              )}
            >
              <div className="flex items-center gap-1.5 p-1.5">
                {reorderable ? (
                  <span className="cursor-grab text-muted" title="Drag to reorder" aria-hidden="true">
                    <GripVertical className="h-4 w-4" />
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onSelect?.(problem.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', DOT[status] ?? DOT.not_started)} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{index + 1}. {problem.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                      <span className="truncate">{problem.topic}</span>
                      {progress?.bookmark ? <Bookmark className="h-3 w-3 fill-primary text-primary" aria-hidden="true" /> : null}
                      <span className={cn('rounded px-1 py-0.5', STATUS_TEXT[status] ?? 'text-muted')}>
                        {problemStatusLabel(status)}
                      </span>
                    </span>
                  </span>
                </button>

                {reorderable ? (
                  <span className="flex shrink-0 flex-col">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${problem.title} up`} className="rounded p-0.5 text-muted hover:text-primary disabled:opacity-30">
                      <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === problems.length - 1} aria-label={`Move ${problem.title} down`} className="rounded p-0.5 text-muted hover:text-primary disabled:opacity-30">
                      <ArrowDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ) : null}
                {onEdit ? (
                  <button type="button" onClick={() => onEdit(problem)} aria-label={`Edit ${problem.title}`} className="rounded p-1 text-muted opacity-0 transition-opacity hover:text-primary group-hover:opacity-100 focus:opacity-100">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
                {onDelete ? (
                  <button type="button" onClick={() => onDelete(problem)} aria-label={`Remove ${problem.title}`} className="rounded p-1 text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 focus:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
        {!visible.length && !loading ? (
          <li className="px-3 py-8 text-center text-xs text-muted">
            {problems.length ? 'No problems match this filter.' : 'No problems yet — add one or paste a list of links.'}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
```

## `client/src/features/sheets/components/ProblemDetail.jsx`

```jsx
import { ArrowUpRight, Clock3, ExternalLink, Lightbulb } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { DIFFICULTY_TONE, difficultyLabel, formatMinutes, platformLabel } from '../lib/sheetUtils.js';

/** Centre pane: everything about a single problem, with a safe external link. */
export default function ProblemDetail({ problem }) {
  if (!problem) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center">
        <p className="text-sm text-muted">Select a problem from the list to see its details.</p>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={DIFFICULTY_TONE[problem.difficulty]}>{difficultyLabel(problem.difficulty)}</Badge>
        <Badge variant="primary">{platformLabel(problem.platform)}</Badge>
        <Badge>{problem.topic}</Badge>
      </div>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-ink sm:text-2xl">{problem.title}</h2>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> ~{formatMinutes(problem.estimatedMinutes)}</span>
        <span className="truncate">{problem.platformLabel || platformLabel(problem.platform)}</span>
      </div>

      <p className="mt-5 break-all rounded-xl border border-line bg-surface-2/40 p-3 font-mono text-[11px] leading-relaxed text-muted">
        {problem.url}
      </p>

      {problem.hint ? (
        <div className="mt-4 flex gap-2 rounded-xl border border-accent/25 bg-accent/8 p-3 text-sm text-ink">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p><span className="font-semibold">Creator hint: </span>{problem.hint}</p>
        </div>
      ) : null}

      <div className="mt-6">
        <a href={problem.url} target="_blank" rel="noopener noreferrer nofollow">
          <Button className="gap-2">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open problem <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </a>
      </div>
    </article>
  );
}
```

## `client/src/features/sheets/components/ProgressPanel.jsx`

```jsx
import { useEffect, useState } from 'react';
import { Bookmark, Check, Clock3 } from 'lucide-react';
import Select from '../../../components/ui/Select.jsx';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_OPTIONS, errorMessage } from '../lib/sheetUtils.js';
import { useUpdateProgress } from '../hooks/useSheets.js';

const BLANK = { status: 'not_started', notes: '', bookmark: false, confidence: '', timeSpent: 0, revisionDate: '' };

function fromProgress(progress) {
  if (!progress) return BLANK;
  return {
    status: progress.status ?? 'not_started',
    notes: progress.notes ?? '',
    bookmark: Boolean(progress.bookmark),
    confidence: progress.confidence ?? '',
    timeSpent: progress.timeSpent ?? 0,
    revisionDate: progress.revisionDate ? new Date(progress.revisionDate).toISOString().slice(0, 10) : '',
  };
}

/** Right pane: per-user progress + notes. Writes ONLY to UserProgress. */
export default function ProgressPanel({ sheetId, problem, progress }) {
  const [form, setForm] = useState(BLANK);
  const [saved, setSaved] = useState(false);
  const update = useUpdateProgress(sheetId);

  useEffect(() => { setForm(fromProgress(progress)); setSaved(false); }, [problem?.id, progress]);

  if (!problem) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-6 text-center text-sm text-muted">
        Your notes, status and bookmark for the selected problem appear here.
      </div>
    );
  }

  const set = (key, value) => { setForm((previous) => ({ ...previous, [key]: value })); setSaved(false); };

  const save = (event) => {
    event.preventDefault();
    update.mutate({
      problemId: problem.id,
      body: {
        status: form.status,
        notes: form.notes,
        bookmark: form.bookmark,
        confidence: form.confidence ? Number(form.confidence) : null,
        timeSpent: Number(form.timeSpent) || 0,
        revisionDate: form.revisionDate ? new Date(`${form.revisionDate}T00:00:00Z`).toISOString() : null,
      },
    }, { onSuccess: () => setSaved(true) });
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">My progress</h3>
        <button
          type="button"
          onClick={() => set('bookmark', !form.bookmark)}
          aria-pressed={form.bookmark}
          aria-label={form.bookmark ? 'Remove bookmark' : 'Bookmark this problem'}
          className={`rounded-lg p-1.5 transition-colors ${form.bookmark ? 'bg-primary/15 text-primary' : 'text-muted hover:text-primary'}`}
        >
          <Bookmark className={`h-4 w-4 ${form.bookmark ? 'fill-primary' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {update.isError ? <Alert variant="error">{errorMessage(update.error)}</Alert> : null}
      {saved ? <Alert variant="success">Progress saved.</Alert> : null}

      <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={(e) => set('status', e.target.value)} />

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Confidence</p>
        <div className="flex gap-1.5" role="group" aria-label="Confidence level 1 to 5">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => set('confidence', String(form.confidence) === String(level) ? '' : level)}
              aria-pressed={String(form.confidence) === String(level)}
              className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition-colors ${String(form.confidence) === String(level) ? 'border-primary bg-primary/15 text-primary' : 'border-line text-muted hover:border-primary/40'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Time (min)"
          type="number"
          min={0}
          icon={Clock3}
          value={form.timeSpent}
          onChange={(e) => set('timeSpent', e.target.value)}
        />
        <Input
          label="Revise on"
          type="date"
          value={form.revisionDate}
          onChange={(e) => set('revisionDate', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="progress-notes" className="mb-1.5 block text-sm font-medium text-ink">My notes</label>
        <textarea
          id="progress-notes"
          rows={5}
          maxLength={5000}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Edge cases, pattern, what to revise…"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <p className="mt-1 text-right text-[11px] text-muted">{form.notes.length}/5000</p>
      </div>

      <Button type="submit" className="w-full gap-1.5" loading={update.isPending}>
        <Check className="h-4 w-4" aria-hidden="true" /> Save progress
      </Button>
    </form>
  );
}
```

## `client/src/features/sheets/components/TopicProgress.jsx`

```jsx
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { formatMinutes } from '../lib/sheetUtils.js';

/** Topic-wise breakdown — plain Tailwind, no animation on data-heavy views. */
export default function TopicProgress({ summary }) {
  const topics = summary?.topicWise ?? [];
  if (!topics.length) return <p className="text-sm text-muted">Add problems to see topic coverage.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink">Topic-wise progress</h3>
        <span className="text-xs text-muted">{formatMinutes(summary.timeSpent)} tracked</span>
      </div>
      <ul className="space-y-2.5">
        {topics.map((topic) => (
          <li key={topic.topic}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-medium text-ink">{topic.topic}</span>
              <span className="shrink-0 text-muted">{topic.completed}/{topic.total} · {topic.percentage}%</span>
            </div>
            <ProgressBar
              value={topic.percentage}
              label={`${topic.topic}: ${topic.percentage}%`}
              tone={topic.percentage === 100 ? 'success' : 'primary'}
              className="h-1.5"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## `client/src/features/sheets/components/RatingSection.jsx`

```jsx
import { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { errorMessage, formatDate } from '../lib/sheetUtils.js';
import { useRateSheet, useRatings } from '../hooks/useSheets.js';

function Stars({ value, onChange, disabled = !onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          disabled={disabled}
          onClick={() => onChange?.(star)}
          className="rounded p-0.5 transition-transform hover:scale-110 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Star className={`h-5 w-5 ${star <= value ? 'fill-warning text-warning' : 'text-muted'}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

/** Rating + written reviews, paginated by the API. */
export default function RatingSection({ sheetId }) {
  const { data, isLoading, isError, error } = useRatings(sheetId, { page: 1, limit: 5 });
  const { rate, unrate } = useRateSheet(sheetId);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const own = data?.ownRating;
  const activeRating = rating || own?.rating || 0;
  const activeReview = review || own?.review || '';

  const save = () => {
    if (!activeRating) return;
    rate.mutate({ rating: activeRating, review: activeReview }, {
      onSuccess: () => { setRating(0); setReview(''); },
    });
  };

  return (
    <section className="space-y-4" aria-label="Ratings and reviews">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Rate this sheet</h3>
        <span className="text-xs text-muted">{data?.pagination?.total ?? 0} review(s)</span>
      </div>

      {rate.isError ? <Alert variant="error">{errorMessage(rate.error)}</Alert> : null}

      <div className="rounded-xl border border-line bg-surface-2/40 p-3">
        <Stars value={activeRating} onChange={(value) => setRating(value)} disabled={rate.isPending} />
        <textarea
          value={activeReview}
          onChange={(event) => setReview(event.target.value)}
          rows={2}
          maxLength={1000}
          placeholder="Share what worked (or didn't)…"
          aria-label="Your review"
          className="mt-3 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <div className="mt-2 flex justify-end gap-2">
          {own ? (
            <Button size="sm" variant="ghost" loading={unrate.isPending} onClick={() => unrate.mutate()}>
              Remove rating
            </Button>
          ) : null}
          <Button size="sm" loading={rate.isPending} disabled={!activeRating} onClick={save}>Save</Button>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-14 w-full" /> : null}
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}

      <ul className="space-y-2">
        {(data?.items ?? []).map((item) => (
          <li key={item.id} className="rounded-xl border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ink">{item.user?.name ?? 'Student'}</span>
              <span className="text-[11px] text-muted">{formatDate(item.createdAt)}</span>
            </div>
            <div className="mt-1"><Stars value={item.rating} /></div>
            {item.review ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.review}</p> : null}
          </li>
        ))}
        {data?.items?.length === 0 ? <li className="text-sm text-muted">No written reviews yet.</li> : null}
      </ul>
    </section>
  );
}
```

## `client/src/features/sheets/components/ReportDialog.jsx`

```jsx
import { useState } from 'react';
import Modal from '../../../components/ui/Modal.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { REASON_OPTIONS, errorMessage } from '../lib/sheetUtils.js';
import { useReportSheet } from '../hooks/useSheets.js';

export default function ReportDialog({ sheetId, open, onClose }) {
  const [reason, setReason] = useState('broken_link');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);
  const report = useReportSheet(sheetId);

  const submit = (event) => {
    event.preventDefault();
    setDone(false);
    report.mutate({ reason, details }, {
      onSuccess: () => { setDone(true); setDetails(''); },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report this sheet"
      description="Reports go to the moderation queue. Please be specific."
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <form onSubmit={submit} className="space-y-4">
        {done ? <Alert variant="success" title="Report submitted">Thank you — a moderator will review it shortly.</Alert> : null}
        {report.isError ? <Alert variant="error">{errorMessage(report.error)}</Alert> : null}
        <Select label="Reason" options={REASON_OPTIONS} value={reason} onChange={(e) => setReason(e.target.value)} />
        <label className="block text-sm font-medium text-ink" htmlFor="report-details">Details</label>
        <textarea
          id="report-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="e.g. problem 12 links to a 404 page"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <div className="flex justify-end">
          <Button type="submit" loading={report.isPending}>Submit report</Button>
        </div>
      </form>
    </Modal>
  );
}
```

## `client/src/features/sheets/components/PersonalResources.jsx`

```jsx
import { useState } from 'react';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import { personalResourceCreateSchema } from '@algonest/shared';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { RESOURCE_TYPE_OPTIONS, contractErrors, errorMessage, platformLabel } from '../lib/sheetUtils.js';
import { usePersonalResources, useResourceMutations } from '../hooks/useSheets.js';

const BLANK = { title: '', url: '', type: 'article', topic: '', note: '' };

/** Private link library. `sheetId` scopes the list to the current sheet. */
export default function PersonalResources({ sheetId, problemId }) {
  const params = { page: 1, limit: 20, ...(sheetId ? { sheetId } : {}) };
  const { data, isLoading, isError, error } = usePersonalResources(params);
  const { create, remove } = useResourceMutations();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const parsed = personalResourceCreateSchema.safeParse({
      ...form,
      ...(sheetId ? { sheetId } : {}),
      ...(problemId ? { problemId } : {}),
    });
    if (!parsed.success) { setFieldErrors(contractErrors(parsed.error)); return; }
    setFieldErrors({});
    create.mutate(parsed.data, { onSuccess: () => { setForm(BLANK); setOpen(false); } });
  };

  return (
    <section className="space-y-3" aria-label="My saved resources">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">My resources</h3>
        <Button size="sm" variant="ghost" onClick={() => setOpen((value) => !value)} className="gap-1">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add
        </Button>
      </div>

      {open ? (
        <form onSubmit={submit} className="space-y-2 rounded-xl border border-line bg-surface-2/40 p-3">
          <Input placeholder="Title" value={form.title} error={fieldErrors.title} onChange={(e) => set('title', e.target.value)} />
          <Input placeholder="https://…" value={form.url} error={fieldErrors.url} onChange={(e) => set('url', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Select options={RESOURCE_TYPE_OPTIONS} value={form.type} onChange={(e) => set('type', e.target.value)} />
            <Input placeholder="Topic" value={form.topic} onChange={(e) => set('topic', e.target.value)} />
          </div>
          {create.isError ? <Alert variant="error">{errorMessage(create.error)}</Alert> : null}
          <div className="flex justify-end"><Button size="sm" type="submit" loading={create.isPending}>Save link</Button></div>
        </form>
      ) : null}

      {isLoading ? <Skeleton className="h-12 w-full" /> : null}
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}

      <ul className="space-y-2">
        {(data?.items ?? []).map((item) => (
          <li key={item.id} className="group flex items-start gap-2 rounded-xl border border-line p-2.5">
            <div className="min-w-0 flex-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1 truncate text-sm font-medium text-ink hover:text-primary"
              >
                <span className="truncate">{item.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
              <p className="mt-0.5 text-[11px] text-muted">{platformLabel(item.platform)} · {item.topic}</p>
              {item.note ? <p className="mt-1 line-clamp-2 text-xs text-muted">{item.note}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => remove.mutate(item.id)}
              aria-label={`Delete ${item.title}`}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
        {data?.items?.length === 0 ? <li className="text-xs text-muted">No saved links for this sheet yet.</li> : null}
      </ul>
    </section>
  );
}
```

## `client/src/features/sheets/components/ProblemEditor.jsx`

```jsx
import { useEffect, useState } from 'react';
import { problemCreateSchema } from '@algonest/shared';
import Modal from '../../../components/ui/Modal.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS, contractErrors } from '../lib/sheetUtils.js';

const BLANK = { title: '', url: '', difficulty: 'medium', topic: 'General', estimatedMinutes: 20, hint: '' };

/** Add/edit a single embedded problem; validated with the SAME Zod contract as the API. */
export default function ProblemEditor({ open, onClose, initial = null, onSubmit, pending = false }) {
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(initial ? {
      title: initial.title ?? '',
      url: initial.url ?? '',
      difficulty: initial.difficulty ?? 'medium',
      topic: initial.topic ?? 'General',
      estimatedMinutes: initial.estimatedMinutes ?? 20,
      hint: initial.hint ?? '',
    } : BLANK);
    setErrors({});
  }, [open, initial]);

  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const parsed = problemCreateSchema.safeParse({
      ...form,
      estimatedMinutes: Number(form.estimatedMinutes) || 20,
    });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); return; }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit problem' : 'Add problem'}
      description="Paste an external problem link — the platform is detected automatically."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="problem-editor-form" loading={pending}>{initial ? 'Save changes' : 'Add problem'}</Button>
        </>
      }
    >
      <form id="problem-editor-form" onSubmit={submit} className="space-y-4">
        <Input label="Title" value={form.title} error={errors.title} onChange={(e) => set('title', e.target.value)} placeholder="Two Sum" />
        <Input label="Problem URL" value={form.url} error={errors.url} onChange={(e) => set('url', e.target.value)} placeholder="https://leetcode.com/problems/two-sum/" hint="Only http(s) links are accepted." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} error={errors.difficulty} onChange={(e) => set('difficulty', e.target.value)} />
          <Select label="Topic" options={TOPIC_OPTIONS} value={form.topic} error={errors.topic} onChange={(e) => set('topic', e.target.value)} />
        </div>
        <Input
          label="Estimated minutes"
          type="number"
          min={1}
          max={600}
          value={form.estimatedMinutes}
          error={errors.estimatedMinutes}
          onChange={(e) => set('estimatedMinutes', e.target.value)}
        />
        <div>
          <label htmlFor="problem-hint" className="mb-1.5 block text-sm font-medium text-ink">Creator hint (optional)</label>
          <textarea
            id="problem-hint"
            rows={2}
            maxLength={500}
            value={form.hint}
            onChange={(e) => set('hint', e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </form>
    </Modal>
  );
}
```

## `client/src/features/sheets/components/BulkImportDialog.jsx`

```jsx
import { useState } from 'react';
import { Check, Link2, WandSparkles } from 'lucide-react';
import { problemCreateSchema } from '@algonest/shared';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Select from '../../../components/ui/Select.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS, errorMessage } from '../lib/sheetUtils.js';
import { useParseLinks } from '../hooks/useSheets.js';

/**
 * Paste → preview → edit → import. The server re-detects every platform, so
 * the preview is a convenience, never a trust boundary.
 */
export default function BulkImportDialog({ open, onClose, onImport, pending = false }) {
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [formError, setFormError] = useState('');
  const parse = useParseLinks();

  const doParse = () => {
    setFormError('');
    parse.mutate(text, {
      onSuccess: (data) => {
        setRows(data.items.map((item) => ({
          ...item,
          selected: true,
          difficulty: item.difficulty || 'medium',
          topic: item.topic || 'General',
          estimatedMinutes: 20,
        })));
        setSkipped(data.skipped ?? []);
      },
    });
  };

  const patchRow = (index, key, value) => {
    setRows((previous) => previous.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const doImport = () => {
    const chosen = rows.filter((row) => row.selected);
    if (!chosen.length) { setFormError('Select at least one problem.'); return; }
    const items = [];
    for (const row of chosen) {
      const parsed = problemCreateSchema.safeParse({
        title: row.title,
        url: row.url,
        difficulty: row.difficulty,
        topic: row.topic,
        estimatedMinutes: Number(row.estimatedMinutes) || 20,
      });
      if (!parsed.success) {
        setFormError(`"${row.title}": ${parsed.error.issues[0]?.message ?? 'invalid'}`);
        return;
      }
      items.push(parsed.data);
    }
    setFormError('');
    onImport(items);
  };

  const selectedCount = rows.filter((row) => row.selected).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Bulk import from links"
      description="One link per line. Also accepts “Title | URL”, numbered lists and markdown links."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={doImport} disabled={!rows.length || !selectedCount} loading={pending} className="gap-1.5">
            <Check className="h-4 w-4" aria-hidden="true" /> Import {selectedCount || ''} problem{selectedCount === 1 ? '' : 's'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <label htmlFor="bulk-links" className="block text-sm font-medium text-ink">Pasted links</label>
        <textarea
          id="bulk-links"
          rows={5}
          value={text}
          maxLength={20000}
          onChange={(event) => setText(event.target.value)}
          placeholder={'https://leetcode.com/problems/two-sum/\nValid Parentheses | https://leetcode.com/problems/valid-parentheses/\nhttps://www.geeksforgeeks.org/binary-search/'}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 font-mono text-xs text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">{skipped.length ? `${skipped.length} line(s) skipped` : 'Duplicates and invalid links are removed automatically.'}</p>
          <Button size="sm" variant="secondary" onClick={doParse} loading={parse.isPending} className="gap-1.5">
            <WandSparkles className="h-3.5 w-3.5" aria-hidden="true" /> Parse links
          </Button>
        </div>

        {parse.isError ? <Alert variant="error">{errorMessage(parse.error)}</Alert> : null}
        {formError ? <Alert variant="error">{formError}</Alert> : null}

        {skipped.length ? (
          <ul className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-warning">
            {skipped.slice(0, 5).map((item, index) => (
              <li key={`${item.line}-${index}`} className="truncate">• {item.line} — {item.reason}</li>
            ))}
          </ul>
        ) : null}

        {rows.length ? (
          <div className="ag-scrollbar max-h-72 space-y-2 overflow-y-auto rounded-xl border border-line p-2">
            {rows.map((row, index) => (
              <div key={`${row.externalId}-${index}`} className="rounded-xl border border-line bg-surface-2/40 p-2.5">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={(event) => patchRow(index, 'selected', event.target.checked)}
                    aria-label={`Select ${row.title}`}
                    className="mt-3 h-4 w-4 accent-[var(--ag-primary)]"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <input
                      value={row.title}
                      onChange={(event) => patchRow(index, 'title', event.target.value)}
                      aria-label="Problem title"
                      className="h-9 w-full rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                    />
                    <p className="flex items-center gap-1 truncate text-[11px] text-muted">
                      <Link2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{row.url}</span>
                      <span className="shrink-0 rounded bg-primary/12 px-1.5 py-0.5 font-semibold text-primary">{row.platformLabel}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Select options={TOPIC_OPTIONS} value={row.topic} onChange={(event) => patchRow(index, 'topic', event.target.value)} className="h-9" />
                      <Select options={DIFFICULTY_OPTIONS} value={row.difficulty} onChange={(event) => patchRow(index, 'difficulty', event.target.value)} className="h-9" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
```

## `client/src/features/sheets/components/ModerationPanel.jsx`

```jsx
import { useState } from 'react';
import { Check, RotateCcw, Send, ShieldCheck, X } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_TONE, errorMessage, formatDate, statusLabel } from '../lib/sheetUtils.js';
import { useSheetLifecycle } from '../hooks/useSheets.js';

const CAN_SUBMIT = ['draft', 'changes_requested', 'rejected', 'approved'];

/** Author + moderation actions for the working copy of a sheet. */
export default function ModerationPanel({ sheetId, sheet, canModerate = false }) {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lifecycle = useSheetLifecycle(sheetId);
  const status = sheet.status;

  const run = (mutation, args, successText) => {
    setMessage('');
    mutation.mutate(args, {
      onSuccess: () => { setMessage(successText); setNote(''); },
      onError: (error) => setMessage(errorMessage(error)),
    });
  };

  const anyPending = Object.values(lifecycle).some((item) => item.isPending);

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Publication
        </h3>
        <Badge variant={STATUS_TONE[status]}>{statusLabel(status)}</Badge>
      </div>

      {message ? <Alert variant="info">{message}</Alert> : null}
      {sheet.reviewNote ? (
        <div className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-ink">
          <p className="font-semibold text-warning">Last reviewer note</p>
          <p className="mt-1">{sheet.reviewNote}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="moderation-note" className="mb-1.5 block text-sm font-medium text-ink">Changelog / review note</label>
        <textarea
          id="moderation-note"
          rows={2}
          maxLength={1000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Describe your changes or explain a rejection…"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CAN_SUBMIT.includes(status) ? (
          <Button size="sm" className="gap-1.5" loading={lifecycle.submit.isPending} onClick={() => run(lifecycle.submit, note, 'Submitted for review.')}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit for review
          </Button>
        ) : null}

        {status === 'pending_review' && canModerate ? (
          <>
            <Button size="sm" variant="primary" className="gap-1.5" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'approve', note }, 'Sheet approved.')}>
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve
            </Button>
            <Button size="sm" variant="secondary" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'request_changes', note }, 'Changes requested.')}>
              Request changes
            </Button>
            <Button size="sm" variant="danger" className="gap-1.5" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'reject', note }, 'Sheet rejected.')}>
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Reject
            </Button>
          </>
        ) : null}

        {status === 'approved' ? (
          <Button size="sm" className="gap-1.5" loading={lifecycle.publish.isPending} onClick={() => run(lifecycle.publish, note, 'Published — a new immutable version was created.')}>
            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Publish
          </Button>
        ) : null}

        {status === 'published' ? (
          <Button size="sm" variant="secondary" className="gap-1.5" loading={lifecycle.revision.isPending} onClick={() => run(lifecycle.revision, undefined, 'New draft revision started.')}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start new revision
          </Button>
        ) : null}

        {status === 'archived' ? (
          <Button size="sm" variant="secondary" loading={lifecycle.restore.isPending} onClick={() => run(lifecycle.restore, undefined, 'Restored to draft.')}>
            Restore
          </Button>
        ) : null}
      </div>

      {anyPending ? <p className="text-xs text-muted">Saving…</p> : null}

      {sheet.reviewHistory?.length ? (
        <details className="rounded-xl border border-line p-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted">History ({sheet.reviewHistory.length})</summary>
          <ul className="mt-2 space-y-1.5 text-[11px] text-muted">
            {[...sheet.reviewHistory].reverse().map((entry, index) => (
              <li key={`${entry.at}-${index}`}>
                {formatDate(entry.at)} · {statusLabel(entry.from)} → {statusLabel(entry.to)}
                {entry.note ? ` — ${entry.note}` : ''}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
```

---

# Client — sheets feature: pages (new)

## `client/src/features/sheets/pages/SheetsPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Plus, ShieldCheck } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import SheetFilters, { EMPTY_SHEET_FILTERS } from '../components/SheetFilters.jsx';
import SheetCard from '../components/SheetCard.jsx';
import { useSheetList } from '../hooks/useSheets.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import { errorMessage } from '../lib/sheetUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function SheetsPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(EMPTY_SHEET_FILTERS);
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    const clean = { page, limit: PAGE_SIZE, sort: filters.sort || 'newest' };
    for (const key of ['q', 'topic', 'difficulty', 'goal', 'platform']) {
      if (filters[key]) clean[key] = filters[key];
    }
    if (filters.bookmarked) clean.bookmarked = 'true';
    if (tab === 'mine') clean.mine = 'true';
    if (tab === 'review') clean.status = 'pending_review';
    return clean;
  }, [filters, page, tab]);

  const { data, isLoading, isError, error, isFetching } = useSheetList(params);
  const sheets = data?.items ?? [];
  const pagination = data?.pagination;

  const changeFilters = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText
            text="DSA SHEETS // CURATED PROGRESSIONS"
            speed={4}
            color={isDark ? '#94a5bd' : '#56657a'}
            shineColor={isDark ? '#2dd4bf' : '#0d9488'}
            className="text-[11px] font-bold tracking-[0.2em]"
          />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Sheets</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            Work through a structured problem list, track every solve and keep your own notes. Published sheets are versioned, so your progress never breaks.
          </p>
        </div>
        <Link to="/app/sheets/new">
          <Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New sheet</Button>
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { id: 'explore', label: 'Explore' },
          { id: 'mine', label: 'My sheets' },
          ...(isStaff ? [{ id: 'review', label: 'Review queue' }] : []),
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeTab(item.id)}
            aria-pressed={tab === item.id}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}
          >
            {item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}
            {item.label}
          </button>
        ))}
        {isFetching && !isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      <SheetFilters filters={filters} onChange={changeFilters} />

      {isError ? <Alert variant="error" title="Couldn't load sheets">{errorMessage(error)}</Alert> : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-60 w-full" />)}
        </div>
      ) : sheets.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sheets.map((sheet) => <SheetCard key={sheet.id} sheet={sheet} showStatus={tab !== 'explore'} />)}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={tab === 'mine' ? 'You have no sheets yet' : tab === 'review' ? 'Review queue is clear' : 'No sheets match these filters'}
          description={tab === 'mine'
            ? 'Create a draft, add problems from your favourite judge, and submit it for review.'
            : 'Try clearing the filters, or create the first sheet for this topic.'}
          action={<Link to="/app/sheets/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Create a sheet</Button></Link>}
        />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Sheets pagination">
          <p className="text-xs text-muted">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} sheet(s)
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1">
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
            </Button>
            <Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">
              Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
```

## `client/src/features/sheets/pages/SheetDetailPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Copy, Flag, GitBranch, Layers3, Pencil, Star,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import ProblemList from '../components/ProblemList.jsx';
import ProblemDetail from '../components/ProblemDetail.jsx';
import ProgressPanel from '../components/ProgressPanel.jsx';
import TopicProgress from '../components/TopicProgress.jsx';
import RatingSection from '../components/RatingSection.jsx';
import PersonalResources from '../components/PersonalResources.jsx';
import ModerationPanel from '../components/ModerationPanel.jsx';
import ReportDialog from '../components/ReportDialog.jsx';
import { useCloneSheet, useProgress, useSheet } from '../hooks/useSheets.js';
import {
  DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, errorMessage, statusLabel,
} from '../lib/sheetUtils.js';

export default function SheetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportOpen, setReportOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const { data, isLoading, isError, error } = useSheet(id);
  const progressQuery = useProgress(id, { page: 1, limit: 300 });
  const clone = useCloneSheet();

  const sheet = data?.sheet;
  const canManage = data?.canManage;
  const problems = sheet?.problems ?? [];
  const progressById = useMemo(() => {
    const map = {};
    for (const item of progressQuery.data?.items ?? []) map[item.problemId] = item;
    return map;
  }, [progressQuery.data]);

  const selectedId = searchParams.get('p') && problems.some((p) => p.id === searchParams.get('p'))
    ? searchParams.get('p')
    : problems[0]?.id ?? null;
  const selectedProblem = problems.find((problem) => problem.id === selectedId) ?? null;
  const summary = progressQuery.data?.summary;

  const selectProblem = (problemId) => {
    const next = new URLSearchParams(searchParams);
    next.set('p', problemId);
    setSearchParams(next, { replace: true });
  };

  const handleClone = () => {
    setActionError('');
    clone.mutate(id, {
      onSuccess: (result) => navigate(`/app/sheets/${result.sheet.id}/edit`),
      onError: (cloneError) => setActionError(errorMessage(cloneError)),
    });
  };

  if (!id) return <Alert variant="error">No sheet id was provided.</Alert>;
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" /><Skeleton className="h-4 w-1/2" />
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <Skeleton className="h-96" /><Skeleton className="h-96" /><Skeleton className="h-96" />
        </div>
      </div>
    );
  }
  if (isError) return <Alert variant="error" title="Couldn't load this sheet">{errorMessage(error)}</Alert>;
  if (!sheet) return <EmptyState icon={BookOpen} title="Sheet unavailable" />;

  return (
    <div className="space-y-5">
      <Link to="/app/sheets" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All sheets
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={DIFFICULTY_TONE[sheet.difficulty]}>{difficultyLabel(sheet.difficulty)}</Badge>
              {canManage ? <Badge variant={STATUS_TONE[sheet.status]}>{statusLabel(sheet.status)}</Badge> : null}
              <Badge variant="neutral"><Layers3 className="mr-1 h-3 w-3" aria-hidden="true" />{sheet.problemCount} problems</Badge>
              {sheet.publishedVersion ? <Badge variant="accent"><GitBranch className="mr-1 h-3 w-3" aria-hidden="true" />v{sheet.publishedVersion}</Badge> : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{sheet.title}</h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">{sheet.description || 'No description provided.'}</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span>by {sheet.author?.name ?? 'AlgoNest creator'}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-warning" aria-hidden="true" />{Number(sheet.ratingSummary?.average ?? 0).toFixed(1)} ({sheet.ratingSummary?.count ?? 0})</span>
              <span aria-hidden="true">·</span>
              <span>{sheet.cloneCount ?? 0} clones</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canManage ? (
              <Link to={`/app/sheets/${sheet.id}/edit`}>
                <Button size="sm" variant="secondary" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit</Button>
              </Link>
            ) : null}
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleClone} loading={clone.isPending}>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Clone
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setReportOpen(true)}>
              <Flag className="h-3.5 w-3.5" aria-hidden="true" /> Report
            </Button>
          </div>
        </div>

        {actionError ? <Alert variant="error">{actionError}</Alert> : null}
        {sheet.isPublishedSnapshot ? (
          <Alert variant="info" title="Viewing published version">
            You are seeing the frozen published problem set. The author may be editing a newer draft; your progress stays tied to this version.
          </Alert>
        ) : null}

        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">Your progress</span>
            <span className="text-muted">{summary?.completed ?? 0}/{summary?.total ?? problems.length} · <strong className="text-primary">{summary?.percentage ?? 0}%</strong></span>
          </div>
          <ProgressBar value={summary?.percentage ?? 0} label="Overall sheet progress" />
          {summary?.dueRevisions ? (
            <p className="mt-2 text-xs text-warning">{summary.dueRevisions} problem(s) due for revision.</p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <div className="min-h-[28rem] lg:max-h-[calc(100vh-13rem)]">
          <ProblemList
            problems={problems}
            progressById={progressById}
            selectedId={selectedId}
            onSelect={selectProblem}
            loading={progressQuery.isLoading}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <ProblemDetail problem={selectedProblem} />
          <div className="rounded-2xl border border-line bg-surface p-4">
            <TopicProgress summary={summary} />
          </div>
        </div>

        <aside className="space-y-4" aria-label="Notes and progress">
          <ProgressPanel sheetId={id} problem={selectedProblem} progress={selectedProblem ? progressById[selectedProblem.id] : null} />
          <PersonalResources sheetId={id} problemId={selectedProblem?.id} />
          <RatingSection sheetId={id} />
          {canManage ? <ModerationPanel sheetId={id} sheet={sheet} canModerate={false} /> : null}
        </aside>
      </div>

      <ReportDialog sheetId={id} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
```

## `client/src/features/sheets/pages/SheetEditorPage.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Archive, FilePlus2, Link2, ListPlus, Plus, Save,
} from 'lucide-react';
import { GOAL_OPTIONS } from '@algonest/shared/constants';
import { sheetCreateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import ProblemList from '../components/ProblemList.jsx';
import ProblemEditor from '../components/ProblemEditor.jsx';
import BulkImportDialog from '../components/BulkImportDialog.jsx';
import ModerationPanel from '../components/ModerationPanel.jsx';
import { DIFFICULTY_OPTIONS, STATUS_TONE, contractErrors, errorMessage, statusLabel } from '../lib/sheetUtils.js';
import {
  useArchiveSheet, useCreateSheet, useProblemMutations, useSheet, useUpdateSheet,
} from '../hooks/useSheets.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const MODERATOR_ROLES = ['content_editor', 'content_moderator', 'super_admin'];

const BLANK = { title: '', description: '', difficulty: 'medium', goals: [], tags: '', topics: '' };

function fromSheet(sheet) {
  return {
    title: sheet.title ?? '',
    description: sheet.description ?? '',
    difficulty: sheet.difficulty ?? 'medium',
    goals: sheet.goals ?? [],
    tags: (sheet.tags ?? []).join(', '),
    topics: (sheet.topics ?? []).join(', '),
  };
}

/** Shared metadata form for both "create" and "edit". */
function MetadataFields({ form, setForm, errors }) {
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const toggleGoal = (value) => set('goals', form.goals.includes(value)
    ? form.goals.filter((goal) => goal !== value)
    : [...form.goals, value]);

  return (
    <div className="space-y-4">
      <Input label="Title" value={form.title} error={errors.title} onChange={(e) => set('title', e.target.value)} placeholder="Striver A2Z — Arrays" />
      <div>
        <label htmlFor="sheet-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea
          id="sheet-description"
          rows={4}
          maxLength={2000}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What does this sheet cover, and who is it for?"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        {errors.description ? <p role="alert" className="mt-1 text-xs text-danger">{errors.description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} error={errors.difficulty} onChange={(e) => set('difficulty', e.target.value)} />
        <Input label="Tags (comma separated)" value={form.tags} error={errors.tags} onChange={(e) => set('tags', e.target.value)} placeholder="interview, patterns" />
      </div>
      <Input label="Topics (comma separated)" value={form.topics} error={errors.topics} onChange={(e) => set('topics', e.target.value)} placeholder="Arrays, Two Pointers" hint="Problem topics are added automatically on import." />
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Relevant goals</legend>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <label
              key={goal.value}
              className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${form.goals.includes(goal.value) ? 'border-primary bg-primary/12 text-primary' : 'border-line text-muted hover:border-primary/40'}`}
            >
              <input type="checkbox" checked={form.goals.includes(goal.value)} onChange={() => toggleGoal(goal.value)} className="sr-only" />
              {goal.label}
            </label>
          ))}
        </div>
        {errors.goals ? <p role="alert" className="mt-1 text-xs text-danger">{errors.goals}</p> : null}
      </fieldset>
    </div>
  );
}

export default function SheetEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState({ open: false, initial: null });
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const role = useAuthStore((state) => state.user?.role);
  const isModerator = MODERATOR_ROLES.includes(role);

  const sheetQuery = useSheet(id);
  const create = useCreateSheet();
  const update = useUpdateSheet(id);
  const archive = useArchiveSheet();
  const mutations = useProblemMutations(id);
  const sheet = sheetQuery.data?.sheet;
  const canManage = sheetQuery.data?.canManage;

  useEffect(() => { if (sheet) { setForm(fromSheet(sheet)); setErrors({}); } }, [sheet]);

  const problems = useMemo(() => sheet?.problems ?? [], [sheet]);
  const selectedProblem = problems.find((problem) => problem.id === selectedId) ?? null;

  const validatedPayload = () => {
    const parsed = sheetCreateSchema.safeParse({
      title: form.title, description: form.description, difficulty: form.difficulty,
      goals: form.goals,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      topics: form.topics.split(',').map((topic) => topic.trim()).filter(Boolean),
    });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); return null; }
    setErrors({});
    return parsed.data;
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const payload = validatedPayload();
    if (!payload) return;
    create.mutate(payload, {
      onSuccess: (result) => navigate(`/app/sheets/${result.sheet.id}/edit`, { replace: true }),
      onError: (error) => setNotice(errorMessage(error)),
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    const payload = validatedPayload();
    if (!payload) return;
    update.mutate(payload, {
      onSuccess: () => setNotice('Draft saved.'),
      onError: (error) => setNotice(errorMessage(error)),
    });
  };

  const handleProblemSubmit = (payload) => {
    if (editor.initial) {
      mutations.update.mutate(
        { problemId: editor.initial.id, body: payload },
        { onSuccess: () => setEditor({ open: false, initial: null }) },
      );
    } else {
      mutations.add.mutate([payload], {
        onSuccess: () => setEditor({ open: false, initial: null }),
      });
    }
  };

  const handleReorder = (orderedIds) => {
    setNotice('');
    mutations.reorder.mutate(orderedIds, { onError: (error) => setNotice(errorMessage(error)) });
  };

  const handleDelete = (problem) => {
    if (!window.confirm(`Remove "${problem.title}" from this sheet?`)) return;
    mutations.remove.mutate(problem.id, { onError: (error) => setNotice(errorMessage(error)) });
  };

  const handleArchive = () => {
    if (!window.confirm('Archive this sheet? It will disappear from the catalogue.')) return;
    archive.mutate(id, { onSuccess: () => navigate('/app/sheets') });
  };

  if (!isNew && sheetQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-72 w-full" /></div>;
  }
  if (!isNew && sheetQuery.isError) {
    return <Alert variant="error" title="Couldn't load this sheet">{errorMessage(sheetQuery.error)}</Alert>;
  }
  if (!isNew && sheet && !canManage) {
    return <Alert variant="warning" title="No edit access">Only the author or a content moderator can edit this sheet.</Alert>;
  }

  return (
    <div className="space-y-6">
      <Link to={isNew ? '/app/sheets' : `/app/sheets/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {isNew ? 'All sheets' : 'Back to sheet'}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{isNew ? 'Create a sheet' : 'Edit sheet'}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            {isNew
              ? 'Start with a draft. Add problems manually or paste a list of links, then submit it for review.'
              : 'Changes are saved to your working copy. Publishing creates a new immutable version.'}
          </p>
        </div>
        {sheet ? <Badge variant={STATUS_TONE[sheet.status]}>{statusLabel(sheet.status)}</Badge> : null}
      </header>

      {notice ? <Alert variant="info" onDismiss={() => setNotice('')}>{notice}</Alert> : null}
      {create.isError ? <Alert variant="error">{errorMessage(create.error)}</Alert> : null}
      {update.isError ? <Alert variant="error">{errorMessage(update.error)}</Alert> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form id="sheet-metadata-form" onSubmit={isNew ? handleCreate : handleSave} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-base font-semibold text-ink">Sheet details</h2>
          <MetadataFields form={form} setForm={setForm} errors={errors} />
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <Button type="submit" className="gap-1.5" loading={isNew ? create.isPending : update.isPending}>
              <Save className="h-4 w-4" aria-hidden="true" /> {isNew ? 'Create draft' : 'Save details'}
            </Button>
            {!isNew ? (
              <Link to={`/app/sheets/${id}`}><Button type="button" variant="secondary">View sheet</Button></Link>
            ) : null}
          </div>
        </form>

        {isNew ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-6">
            <h2 className="text-sm font-semibold text-ink">Next steps</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>1. Create the draft.</li>
              <li>2. Add problems one by one, or bulk-import pasted links.</li>
              <li>3. Drag to reorder, then submit for review.</li>
              <li>4. A moderator approves it; publishing freezes version 1.</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            <ModerationPanel sheetId={id} sheet={sheet} canModerate={isModerator} />
            <div className="rounded-2xl border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold text-ink">Versions</h2>
              <p className="mt-1 text-xs text-muted">
                Published version {sheet?.publishedVersion ?? 0}. Each publish freezes the problem list so existing progress stays valid.
              </p>
            </div>
            <Button variant="danger" className="w-full gap-1.5" onClick={handleArchive} loading={archive.isPending}>
              <Archive className="h-4 w-4" aria-hidden="true" /> Archive sheet
            </Button>
          </div>
        )}
      </div>

      {!isNew ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Problems ({problems.length})</h2>
              <p className="text-xs text-muted">Drag rows or use the arrow buttons to reorder. Platforms are detected from the URL.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setBulkOpen(true)}>
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Paste links
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => setEditor({ open: true, initial: null })}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add problem
              </Button>
            </div>
          </div>

          {mutations.add.isError || mutations.update.isError || mutations.remove.isError || mutations.reorder.isError
            ? <Alert variant="error">A problem operation failed. Check that the link is a valid http(s) URL and not a duplicate.</Alert>
            : null}

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="h-[28rem]">
              <ProblemList
                problems={problems}
                selectedId={selectedId}
                onSelect={setSelectedId}
                reorderable
                onReorder={handleReorder}
                onEdit={(problem) => setEditor({ open: true, initial: problem })}
                onDelete={handleDelete}
              />
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              {selectedProblem ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted"><ListPlus className="h-4 w-4" aria-hidden="true" /> Selected problem</div>
                  <p className="text-base font-semibold text-ink">{selectedProblem.title}</p>
                  <p className="break-all font-mono text-[11px] text-muted">{selectedProblem.url}</p>
                  <p className="text-xs text-muted">{selectedProblem.topic} · {selectedProblem.platformLabel} · {selectedProblem.difficulty}</p>
                  <Button size="sm" variant="secondary" onClick={() => setEditor({ open: true, initial: selectedProblem })}>Edit problem</Button>
                </div>
              ) : (
                <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 text-center text-sm text-muted">
                  <FilePlus2 className="h-8 w-8 text-primary" aria-hidden="true" />
                  <p>Select a problem to edit, or paste a batch of links to get started.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <ProblemEditor
        open={editor.open}
        onClose={() => setEditor({ open: false, initial: null })}
        initial={editor.initial}
        onSubmit={handleProblemSubmit}
        pending={mutations.add.isPending || mutations.update.isPending}
      />
      <BulkImportDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImport={(items) => mutations.importItems.mutate(items, { onSuccess: () => setBulkOpen(false) })}
        pending={mutations.importItems.isPending}
      />
    </div>
  );
}
```

---

# Documentation (modified/new)

## `README.md`

```markdown
# AlgoNest — DSA Preparation Platform (MERN monorepo)

A production-grade, phase-by-phase build of a DSA preparation platform: curated sheets,
quizzes, mock tests, adaptive plans, a resource directory and an RBAC admin area.

> **Status: Phase 2 complete.** Phase 1 shipped authentication, onboarding, RBAC,
> protected client routes, the app shell, dark/light theming and the animated React
> Bits landing page. Phase 2 adds the full **DSA Sheets** module: versioned sheets,
> embedded problems, bulk link import with platform detection, moderation lifecycle,
> per-user progress/notes/bookmarks, ratings, reports and a private resource library.
> See [`docs/PHASE2.md`](./docs/PHASE2.md) for the design and full API reference, and
> [`docs/PHASE2-CODE.md`](./docs/PHASE2-CODE.md) for every changed file verbatim.

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
│   └── PHASE2-CODE.md               # complete Phase 2 source, file by file
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
│   ├── tests/                       # node:test — 56 tests, no DB required
│   │   ├── app.test.js, contracts.test.js, auth.service.test.js
│   │   └── sheets*.test.js         # detector, workflow, Zod, service, routes
│   └── src/
│       ├── server.js                # bootstrap + graceful shutdown
│       ├── app.js                   # express app factory (security stack)
│       ├── config/{env,db}.js       # Zod-validated env, mongoose connection
│       ├── models/                  # User, RefreshSession + 6 Phase-2 models
│       │   ├── {Sheet,SheetVersion,UserProgress}.js
│       │   ├── {SheetRating,SheetReport,PersonalResource}.js
│       │   └── Problem.js           # embedded subdocument schema
│       ├── middlewares/             # auth/RBAC, validate, sanitize, security, error
│       ├── utils/                   # ApiError, response, asyncHandler, tokens, cookies
│       ├── routes/index.js          # /api/v1 health + module mount
│       └── modules/
│           ├── auth/                # routes → controller → service
│           ├── users/               # onboarding, profile, admin user management
│           └── sheets/              # routes → controllers → services
│               ├── platformDetector.js  # pure URL → problem parser
│               ├── sheetWorkflow.js     # lifecycle state machine
│               ├── sheet.service.js     # CRUD, problems, versions, social
│               └── progress.service.js  # per-user progress + resources
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

Production build: `npm run build` → `client/dist`, then serve it behind the API
(same origin, or set `CLIENT_URL`/`CORS_ORIGINS` and `COOKIE_SAME_SITE=none` for
genuinely cross-site cookie delivery).

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
| `AUTH_RATE_LIMIT_MAX` | `10` | per IP+email login/register failures per 15 min |
| `TRUST_PROXY` | `0` | set `1` behind a trusted reverse proxy |
| `SEED_ADMIN_*` | — | used **only** by the seed script |

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
- Correlation `X-Request-Id` on every request, ready for Phase 8 audit logs.

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
npm test                 # 56 node:test server tests + 12 client render smoke tests
                         # (API envelope, validation, RBAC, JWT, auth services,
                         #  platform detection, lifecycle, versioning, progress,
                         #  and render-time crashes on every page)
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
bookmark and confidence → rate/review → clone. Without MongoDB, data routes
return a clean `503` from `dbGuard` while `/health` and the client keep working.

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
5. Admin *screens* are Phase 8; Phase 1 ships the RBAC middleware, permissions and
   two permission-guarded user-management endpoints so the pattern is real, not TODO.
6. Module routes (Sheets → Community) exist with honest "coming in a later phase"
   empty states. No fake data or stub service logic.
7. Published-content versioning and per-user progress collections now exist in
   Phase 2 (`SheetVersion`, `UserProgress`); see `docs/PHASE2.md` §2 for the
   embedding, snapshot and separation decisions.
8. In production the client and API should share an origin (or use
   `COOKIE_SAME_SITE=none` + HTTPS); the Vite dev proxy reproduces that locally.

---

## 10. Next phase

**Phase 3 — Quizzes**: seven question types (MCQ, multi-select, true/false,
ordering, matching, code-output, fill-in-the-blank), creator + solver roles,
timers, attempts and explanations. Reuse `SheetVersion`'s immutable snapshot
pattern for published quizzes so old attempts stay valid, and reuse the
per-user separation from `UserProgress` for attempt records.
```

## `docs/PHASE2.md`

```markdown
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
```
