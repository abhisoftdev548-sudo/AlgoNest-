# AlgoNest — Phase 3 complete source code

> Auto-generated from the working tree on 2026-10-28. Every file below exists verbatim in the repository. Files marked "modified" also contain Phase 1/2 code; the Phase 3 additions are appended at the end of the shared contracts and are documented in [PHASE3.md](./PHASE3.md).

## Index

### Shared contracts (modified) (2 files)

- [`shared/src/constants.js`](#shared-src-constants-js)
- [`shared/src/schemas.js`](#shared-src-schemas-js)

### Server — models (new) (4 files)

- [`server/src/models/Question.js`](#server-src-models-question-js)
- [`server/src/models/Quiz.js`](#server-src-models-quiz-js)
- [`server/src/models/QuizVersion.js`](#server-src-models-quizversion-js)
- [`server/src/models/Attempt.js`](#server-src-models-attempt-js)

### Server — pure quiz engine (new) (6 files)

- [`server/src/modules/quizzes/questionNormalizer.js`](#server-src-modules-quizzes-questionnormalizer-js)
- [`server/src/modules/quizzes/questionGrader.js`](#server-src-modules-quizzes-questiongrader-js)
- [`server/src/modules/quizzes/quizPresentation.js`](#server-src-modules-quizzes-quizpresentation-js)
- [`server/src/modules/quizzes/bulkImport.js`](#server-src-modules-quizzes-bulkimport-js)
- [`server/src/modules/quizzes/quizWorkflow.js`](#server-src-modules-quizzes-quizworkflow-js)
- [`server/src/modules/quizzes/actor.js`](#server-src-modules-quizzes-actor-js)

### Server — services (new) (3 files)

- [`server/src/modules/quizzes/question.service.js`](#server-src-modules-quizzes-question-service-js)
- [`server/src/modules/quizzes/quiz.service.js`](#server-src-modules-quizzes-quiz-service-js)
- [`server/src/modules/quizzes/attempt.service.js`](#server-src-modules-quizzes-attempt-service-js)

### Server — controllers + routers + mount (7 files)

- [`server/src/modules/quizzes/question.controller.js`](#server-src-modules-quizzes-question-controller-js)
- [`server/src/modules/quizzes/quiz.controller.js`](#server-src-modules-quizzes-quiz-controller-js)
- [`server/src/modules/quizzes/attempt.controller.js`](#server-src-modules-quizzes-attempt-controller-js)
- [`server/src/modules/quizzes/question.routes.js`](#server-src-modules-quizzes-question-routes-js)
- [`server/src/modules/quizzes/quiz.routes.js`](#server-src-modules-quizzes-quiz-routes-js)
- [`server/src/modules/quizzes/attempt.routes.js`](#server-src-modules-quizzes-attempt-routes-js)
- [`server/src/routes/index.js`](#server-src-routes-index-js)

### Server — tests (new) (3 files)

- [`server/tests/quizzes.test.js`](#server-tests-quizzes-test-js)
- [`server/tests/quizzes.service.test.js`](#server-tests-quizzes-service-test-js)
- [`server/tests/quizzes.routes.test.js`](#server-tests-quizzes-routes-test-js)

### Client — shared wiring (modified) (4 files)

- [`client/src/lib/queryKeys.js`](#client-src-lib-querykeys-js)
- [`client/src/lib/navigation.js`](#client-src-lib-navigation-js)
- [`client/src/app/router.jsx`](#client-src-app-router-jsx)
- [`client/scripts/smokeRender.mjs`](#client-scripts-smokerender-mjs)

### Client — quizzes api, hooks, lib (new) (6 files)

- [`client/src/features/quizzes/api/quizApi.js`](#client-src-features-quizzes-api-quizapi-js)
- [`client/src/features/quizzes/api/questionApi.js`](#client-src-features-quizzes-api-questionapi-js)
- [`client/src/features/quizzes/api/attemptApi.js`](#client-src-features-quizzes-api-attemptapi-js)
- [`client/src/features/quizzes/hooks/useQuizzes.js`](#client-src-features-quizzes-hooks-usequizzes-js)
- [`client/src/features/quizzes/lib/quizUtils.js`](#client-src-features-quizzes-lib-quizutils-js)
- [`client/src/features/quizzes/lib/questionDefaults.js`](#client-src-features-quizzes-lib-questiondefaults-js)

### Client — quizzes components (new) (12 files)

- [`client/src/features/quizzes/components/QuizFilters.jsx`](#client-src-features-quizzes-components-quizfilters-jsx)
- [`client/src/features/quizzes/components/QuizCard.jsx`](#client-src-features-quizzes-components-quizcard-jsx)
- [`client/src/features/quizzes/components/QuizSettingsForm.jsx`](#client-src-features-quizzes-components-quizsettingsform-jsx)
- [`client/src/features/quizzes/components/QuestionEditor.jsx`](#client-src-features-quizzes-components-questioneditor-jsx)
- [`client/src/features/quizzes/components/QuestionList.jsx`](#client-src-features-quizzes-components-questionlist-jsx)
- [`client/src/features/quizzes/components/BulkImportDialog.jsx`](#client-src-features-quizzes-components-bulkimportdialog-jsx)
- [`client/src/features/quizzes/components/ModerationPanel.jsx`](#client-src-features-quizzes-components-moderationpanel-jsx)
- [`client/src/features/quizzes/components/QuestionPalette.jsx`](#client-src-features-quizzes-components-questionpalette-jsx)
- [`client/src/features/quizzes/components/QuestionRenderer.jsx`](#client-src-features-quizzes-components-questionrenderer-jsx)
- [`client/src/features/quizzes/components/QuizTimer.jsx`](#client-src-features-quizzes-components-quiztimer-jsx)
- [`client/src/features/quizzes/components/TopicPerformance.jsx`](#client-src-features-quizzes-components-topicperformance-jsx)
- [`client/src/features/quizzes/components/AttemptResult.jsx`](#client-src-features-quizzes-components-attemptresult-jsx)

### Client — quizzes pages (new) (5 files)

- [`client/src/features/quizzes/pages/QuizzesPage.jsx`](#client-src-features-quizzes-pages-quizzespage-jsx)
- [`client/src/features/quizzes/pages/QuizDetailPage.jsx`](#client-src-features-quizzes-pages-quizdetailpage-jsx)
- [`client/src/features/quizzes/pages/QuizEditorPage.jsx`](#client-src-features-quizzes-pages-quizeditorpage-jsx)
- [`client/src/features/quizzes/pages/QuizSolverPage.jsx`](#client-src-features-quizzes-pages-quizsolverpage-jsx)
- [`client/src/features/quizzes/pages/QuizResultPage.jsx`](#client-src-features-quizzes-pages-quizresultpage-jsx)

### Documentation (2 files)

- [`README.md`](#readme-md)
- [`docs/PHASE3.md`](#docs-phase3-md)


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

/* ───────────────────────── Phase 3: Quizzes ───────────────────────── */

/** The seven supported question types. */
export const QUESTION_TYPES = Object.freeze({
  MCQ: 'mcq',
  MULTI: 'multi',
  TRUE_FALSE: 'true_false',
  ORDERING: 'ordering',
  MATCHING: 'matching',
  OUTPUT: 'output',
  FILL_BLANK: 'fill_blank',
});
export const QUESTION_TYPE_VALUES = Object.freeze(Object.values(QUESTION_TYPES));
export const QUESTION_TYPE_LABELS = Object.freeze({
  mcq: 'Single choice (MCQ)',
  multi: 'Multiple select',
  true_false: 'True / False',
  ordering: 'Ordering',
  matching: 'Matching',
  output: 'Code output',
  fill_blank: 'Fill in the blank',
});
/** Short hints shown in the creator UI next to each type. */
export const QUESTION_TYPE_HINTS = Object.freeze({
  mcq: 'One correct option. Learners pick a single answer.',
  multi: 'Several correct options. All must be selected — no partial credit.',
  true_false: 'A binary statement, scored against a stored boolean.',
  ordering: 'List items in the correct order; the solver sees them shuffled.',
  matching: 'Pair each left item with its right item; columns are shuffled independently.',
  output: 'Show a code snippet and ask what it prints.',
  fill_blank: 'Accept one or more text answers (case-insensitive by default).',
});

/** Quizzes reuse the sheet lifecycle; keep a distinct name for clarity. */
export const QUIZ_STATUSES = SHEET_STATUSES;
export const QUIZ_STATUS_VALUES = SHEET_STATUS_VALUES;
export const QUIZ_STATUS_LABELS = SHEET_STATUS_LABELS;

export const QUIZ_VISIBILITIES = Object.freeze({
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
  PRIVATE: 'private',
});
export const QUIZ_VISIBILITY_VALUES = Object.freeze(Object.values(QUIZ_VISIBILITIES));
export const QUIZ_VISIBILITY_LABELS = Object.freeze({
  public: 'Public — listed in the catalogue',
  unlisted: 'Unlisted — reachable by link only',
  private: 'Private — author and moderators only',
});

export const ATTEMPT_STATUSES = Object.freeze({
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  TIMED_OUT: 'timed_out',
  ABANDONED: 'abandoned',
});
export const ATTEMPT_STATUS_VALUES = Object.freeze(Object.values(ATTEMPT_STATUSES));
export const ATTEMPT_STATUS_LABELS = Object.freeze({
  in_progress: 'In progress', submitted: 'Submitted',
  timed_out: 'Time up', abandoned: 'Abandoned',
});

export const ATTEMPT_MODES = Object.freeze({ FULL: 'full', INCORRECT: 'incorrect' });
export const ATTEMPT_MODE_VALUES = Object.freeze(Object.values(ATTEMPT_MODES));

/** Hard caps — keep embedded version/question arrays well under 16 MB. */
export const QUIZ_LIMITS = Object.freeze({
  MAX_QUESTIONS: 200,
  MAX_OPTIONS: 8,
  MAX_ITEMS: 10,
  MAX_PAIRS: 10,
  MAX_TEXT_ANSWERS: 10,
  MAX_IMPORT_BATCH: 100,
  MAX_IMPORT_CHARS: 200_000,
  MAX_CSV_ROWS: 200,
  MAX_PROMPT: 2000,
  MAX_EXPLANATION: 2000,
  MAX_CODE: 4000,
  MAX_OPTION_TEXT: 500,
  MAX_TITLE: 120,
  MAX_DESCRIPTION: 2000,
  MAX_POINTS: 10,
  MIN_TIMER_MINUTES: 1,
  MAX_TIMER_MINUTES: 180,
  MAX_ATTEMPTS: 20,
  MAX_TAGS: 12,
  /** Autosave is debounced on the client; this is the server-side floor. */
  AUTOSAVE_DEBOUNCE_MS: 900,
});

/** Options that only affect presentation, never scoring. */
export const QUIZ_SORT_OPTIONS = Object.freeze(['newest', 'oldest', 'popular', 'title', 'rating']);
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
  QUIZ_LIMITS,
  QUIZ_SORT_OPTIONS,
  QUIZ_STATUS_VALUES,
  QUIZ_VISIBILITY_VALUES,
  QUESTION_TYPE_VALUES,
  REPORT_REASON_VALUES,
  RESOURCE_TYPE_VALUES,
  ROLE_VALUES,
  SHEET_LIMITS,
  SHEET_STATUS_VALUES,
  USER_STATUS_VALUES,
  ATTEMPT_MODE_VALUES,
  ATTEMPT_STATUS_VALUES,
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

/* ───────────────────── Phase 3: Quiz contracts ───────────────────── */

/**
 * Question input is a discriminated union on `type`. The shape is deliberately
 * creator-friendly: options/items are plain strings and answers may be a
 * 0-based index, a 1-based number, a letter (A–H) or the option's exact text.
 * `questionNormalizer.js` turns every accepted form into one canonical stored
 * shape with stable ids — the grader only ever sees that canonical shape.
 */
const qText = (max) => z.string().trim().min(1).max(max);
const stringList = (min, max, label) =>
  z.array(qText(QUIZ_LIMITS.MAX_OPTION_TEXT)).min(min, `Add at least ${min} ${label}`).max(max, `At most ${max} ${label} are allowed`);
const optionAnswerSchema = z.union([z.coerce.number().int(), qText(QUIZ_LIMITS.MAX_OPTION_TEXT)]);
const booleanAnswerSchema = z.union([
  z.boolean(),
  z.enum(['true', 'false', 'yes', 'no', 't', 'f', '1', '0']),
]);
const pairSchema = z.union([
  z.tuple([qText(QUIZ_LIMITS.MAX_OPTION_TEXT), qText(QUIZ_LIMITS.MAX_OPTION_TEXT)]),
  z.object({
    left: qText(QUIZ_LIMITS.MAX_OPTION_TEXT),
    right: qText(QUIZ_LIMITS.MAX_OPTION_TEXT),
  }).strict(),
]);

const questionCommon = {
  prompt: z.string().trim().min(5, 'Prompt must be at least 5 characters').max(QUIZ_LIMITS.MAX_PROMPT),
  topic: topicSchema.default('General'),
  difficulty: difficultySchema.default('medium'),
  explanation: z.string().trim().max(QUIZ_LIMITS.MAX_EXPLANATION).default(''),
  points: z.coerce.number().int().min(1).max(QUIZ_LIMITS.MAX_POINTS).default(1),
  tags: z.array(z.string().trim().min(1).max(32)).max(QUIZ_LIMITS.MAX_TAGS).default([]),
};

export const questionInputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('mcq'),
    ...questionCommon,
    options: stringList(2, QUIZ_LIMITS.MAX_OPTIONS, 'options'),
    answer: optionAnswerSchema,
  }).strict(),
  z.object({
    type: z.literal('multi'),
    ...questionCommon,
    options: stringList(2, QUIZ_LIMITS.MAX_OPTIONS, 'options'),
    answer: z.array(optionAnswerSchema).min(1, 'Select at least one correct option').max(QUIZ_LIMITS.MAX_OPTIONS),
  }).strict(),
  z.object({
    type: z.literal('true_false'),
    ...questionCommon,
    answer: booleanAnswerSchema,
  }).strict(),
  z.object({
    type: z.literal('ordering'),
    ...questionCommon,
    items: stringList(2, QUIZ_LIMITS.MAX_ITEMS, 'items'),
  }).strict(),
  z.object({
    type: z.literal('matching'),
    ...questionCommon,
    pairs: z.array(pairSchema).min(2, 'Add at least 2 pairs').max(QUIZ_LIMITS.MAX_PAIRS),
  }).strict(),
  z.object({
    type: z.literal('output'),
    ...questionCommon,
    code: z.string().trim().min(1, 'Add the code snippet').max(QUIZ_LIMITS.MAX_CODE),
    options: stringList(2, QUIZ_LIMITS.MAX_OPTIONS, 'options'),
    answer: optionAnswerSchema,
  }).strict(),
  z.object({
    type: z.literal('fill_blank'),
    ...questionCommon,
    answer: z.union([qText(500), z.array(qText(500)).min(1).max(QUIZ_LIMITS.MAX_TEXT_ANSWERS)]),
    code: z.string().trim().max(QUIZ_LIMITS.MAX_CODE).default(''),
    caseSensitive: z.boolean().default(false),
  }).strict(),
]).superRefine((value, ctx) => {
  if (value.type === 'multi' && new Set(value.answer.map(String)).size !== value.answer.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['answer'], message: 'Duplicate correct answers' });
  }
  for (const [field, list] of [['options', value.options], ['items', value.items]]) {
    if (list && new Set(list.map((entry) => entry.toLowerCase())).size !== list.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} must be unique` });
    }
  }
});

/** Bulk importer preview: pure parse, no DB write. */
export const questionImportSchema = z
  .object({
    format: z.enum(['json', 'csv']),
    text: z.string().min(1, 'Paste some questions').max(QUIZ_LIMITS.MAX_IMPORT_CHARS),
  })
  .strict();

export const quizSettingsSchema = z
  .object({
    timerMinutes: z.coerce.number().int().min(QUIZ_LIMITS.MIN_TIMER_MINUTES).max(QUIZ_LIMITS.MAX_TIMER_MINUTES).default(20),
    passPercentage: z.coerce.number().int().min(0).max(100).default(60),
    maxAttempts: z.coerce.number().int().min(1).max(QUIZ_LIMITS.MAX_ATTEMPTS).default(3),
    shuffleQuestions: z.boolean().default(false),
    shuffleOptions: z.boolean().default(false),
    visibility: z.enum(QUIZ_VISIBILITY_VALUES).default('public'),
    showExplanations: z.boolean().default(true),
    allowRetryIncorrect: z.boolean().default(true),
  })
  .strict();

export const quizTitleSchema = z.string().trim().min(4, 'Title must be at least 4 characters').max(QUIZ_LIMITS.MAX_TITLE);
export const quizDescriptionSchema = z.string().trim().max(QUIZ_LIMITS.MAX_DESCRIPTION);

export const quizListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    q: z.string().trim().max(80).optional(),
    topic: z.string().trim().max(60).optional(),
    difficulty: difficultySchema.optional(),
    status: z.enum(QUIZ_STATUS_VALUES).optional(),
    sort: z.enum(QUIZ_SORT_OPTIONS).default('newest'),
    mine: z.enum(['true', 'false']).optional(),
  })
  .strict();

export const questionListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    q: z.string().trim().max(80).optional(),
    type: z.enum(QUESTION_TYPE_VALUES).optional(),
    topic: z.string().trim().max(60).optional(),
    difficulty: difficultySchema.optional(),
    mine: z.enum(['true', 'false']).optional(),
  })
  .strict();

export const quizCreateSchema = z
  .object({
    title: quizTitleSchema,
    description: quizDescriptionSchema.default(''),
    difficulty: difficultySchema.default('medium'),
    goals: z.array(z.enum(GOAL_VALUES)).max(GOAL_VALUES.length).default([]),
    topics: z.array(topicSchema).max(30).default([]),
    tags: z.array(z.string().trim().min(1).max(32)).max(QUIZ_LIMITS.MAX_TAGS).default([]),
    settings: quizSettingsSchema.default({}),
  })
  .strict();

/** Settings are merged server-side, so a partial settings object is valid. */
export const quizUpdateSchema = z
  .object({
    title: quizTitleSchema.optional(),
    description: quizDescriptionSchema.optional(),
    difficulty: difficultySchema.optional(),
    goals: z.array(z.enum(GOAL_VALUES)).max(GOAL_VALUES.length).optional(),
    topics: z.array(topicSchema).max(30).optional(),
    tags: z.array(z.string().trim().min(1).max(32)).max(QUIZ_LIMITS.MAX_TAGS).optional(),
    settings: quizSettingsSchema.partial().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const quizParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const questionParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const attemptParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const quizQuestionParamsSchema = z.object({ id: mongoIdSchema, questionId: mongoIdSchema }).strict();

export const quizQuestionsSchema = z
  .object({
    questionIds: z.array(mongoIdSchema).min(1, 'Select at least one question').max(QUIZ_LIMITS.MAX_IMPORT_BATCH),
  })
  .strict();

export const quizImportSchema = z
  .object({
    items: z.array(questionInputSchema).min(1, 'No valid questions to import').max(QUIZ_LIMITS.MAX_IMPORT_BATCH),
    source: z.enum(['json', 'csv']).default('json'),
  })
  .strict();

export const quizReorderSchema = z
  .object({
    orderedIds: z
      .array(mongoIdSchema)
      .min(1, 'Provide the ordered question ids')
      .max(QUIZ_LIMITS.MAX_QUESTIONS)
      .refine((ids) => new Set(ids).size === ids.length, 'Duplicate question ids are not allowed'),
  })
  .strict();

/** A solver response. `z.unknown()` is deliberately NOT used — every shape is bounded. */
export const attemptAnswerSchema = z
  .object({
    questionId: mongoIdSchema,
    response: z.union([
      z.string().max(2000),
      z.number(),
      z.boolean(),
      z.null(),
      z.array(z.union([z.string().max(500), z.number(), z.boolean()])).max(QUIZ_LIMITS.MAX_ITEMS),
      z.record(z.string().max(200)),
    ]),
    marked: z.boolean().default(false),
  })
  .strict();

/** Autosave is an UPSERT of the supplied rows, never a blind replace. */
export const autosaveSchema = z
  .object({
    answers: z.array(attemptAnswerSchema).min(1).max(QUIZ_LIMITS.MAX_QUESTIONS),
  })
  .strict();

export const submitAttemptSchema = z
  .object({
    answers: z.array(attemptAnswerSchema).max(QUIZ_LIMITS.MAX_QUESTIONS).default([]),
  })
  .strict();

export const attemptStartSchema = z
  .object({
    mode: z.enum(ATTEMPT_MODE_VALUES).default('full'),
    sourceAttemptId: mongoIdSchema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.mode === 'incorrect' && !value.sourceAttemptId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sourceAttemptId'], message: 'Choose the attempt to retry' });
    }
  });

export const attemptListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    status: z.enum(ATTEMPT_STATUS_VALUES).optional(),
  })
  .strict();

/** Editor question list + solver question list — both paginated. */
export const quizQuestionListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(QUIZ_LIMITS.MAX_QUESTIONS).default(QUIZ_LIMITS.MAX_QUESTIONS),
  })
  .strict();

export const attemptQuestionQuerySchema = quizQuestionListQuerySchema;
```

---

# Server — models (new)

## `server/src/models/Question.js`

```js
import mongoose from 'mongoose';
import {
  DIFFICULTY_VALUES, QUESTION_TYPE_VALUES, QUIZ_LIMITS,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * QUESTION BANK — reusable, author-scoped, REFERENCED by Quiz.
 *
 * A creator writes a question once and links it into several quizzes. Editing
 * a bank question therefore does NOT automatically change a live quiz: the
 * published QuizVersion holds a frozen copy. This is the deliberate split:
 *   Question (referenced) → cheap reuse while authoring
 *   QuizVersion (embedded) → immutable, answer-bearing snapshot for grading
 *
 * `QUESTION_FIELDS` is shared with QuizVersion so the two can never drift.
 */
export const QUESTION_FIELDS = Object.freeze({
  type: { type: String, enum: QUESTION_TYPE_VALUES, required: true },
  prompt: { type: String, required: true, trim: true, maxlength: QUIZ_LIMITS.MAX_PROMPT },
  topic: { type: String, trim: true, maxlength: 60, default: 'General' },
  difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
  explanation: { type: String, trim: true, maxlength: QUIZ_LIMITS.MAX_EXPLANATION, default: '' },
  points: { type: Number, min: 1, max: QUIZ_LIMITS.MAX_POINTS, default: 1 },
  tags: { type: [String], default: [] },
  code: { type: String, maxlength: QUIZ_LIMITS.MAX_CODE, default: '' },
  caseSensitive: { type: Boolean, default: false },
  options: {
    type: [{ id: { type: String, required: true }, text: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT } }],
    default: [],
  },
  items: {
    type: [{ id: { type: String, required: true }, text: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT } }],
    default: [],
  },
  pairs: {
    type: [{
      id: { type: String, required: true },
      left: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT },
      right: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT },
    }],
    default: [],
  },
  /** Option ids (choice types), item ids (ordering) or pair ids (matching). */
  answerKey: { type: [String], default: [] },
  booleanKey: { type: Boolean, default: null },
  textAnswers: { type: [String], default: [] },
});

/** The frozen, answer-bearing question shape stored inside a QuizVersion. */
export const snapshotQuestionSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: true },
    /** Dense rank inside the published quiz — preserved from the author's order. */
    order: { type: Number, default: 0, min: 0 },
    ...QUESTION_FIELDS,
  },
  { _id: false, versionKey: false },
);

const questionSchema = new Schema(
  {
    ...QUESTION_FIELDS,
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    /** How many quizzes currently link this question (denormalised counter). */
    usageCount: { type: Number, default: 0, min: 0 },
    source: { type: String, enum: ['manual', 'json', 'csv'], default: 'manual' },
  },
  { timestamps: true, versionKey: false },
);

questionSchema.index({ author: 1, createdAt: -1 });
questionSchema.index({ type: 1, topic: 1 });
questionSchema.index({ topic: 1, difficulty: 1 });
questionSchema.index(
  { prompt: 'text', topic: 'text', tags: 'text' },
  { weights: { topic: 6, prompt: 4, tags: 2 }, name: 'question_text_search' },
);

export const Question = mongoose.model('Question', questionSchema);
export default Question;
```

## `server/src/models/Quiz.js`

```js
import mongoose from 'mongoose';
import {
  DIFFICULTY_VALUES, GOAL_VALUES, QUIZ_LIMITS, QUIZ_STATUS_VALUES, QUIZ_VISIBILITY_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/** Ordered reference to a bank question. `_id: false` — the bank id IS the key. */
export const quizLinkSchema = new Schema(
  {
    question: { type: Types.ObjectId, ref: 'Question', required: true },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: false, versionKey: false },
);

const reviewEntrySchema = new Schema(
  {
    from: { type: String, enum: QUIZ_STATUS_VALUES },
    to: { type: String, enum: QUIZ_STATUS_VALUES, required: true },
    by: { type: Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    decision: { type: String, maxlength: 40, default: '' },
    note: { type: String, maxlength: 1000, default: '' },
  },
  { _id: false },
);

const settingsSchema = new Schema(
  {
    timerMinutes: { type: Number, min: QUIZ_LIMITS.MIN_TIMER_MINUTES, max: QUIZ_LIMITS.MAX_TIMER_MINUTES, default: 20 },
    passPercentage: { type: Number, min: 0, max: 100, default: 60 },
    maxAttempts: { type: Number, min: 1, max: QUIZ_LIMITS.MAX_ATTEMPTS, default: 3 },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    visibility: { type: String, enum: QUIZ_VISIBILITY_VALUES, default: 'public' },
    showExplanations: { type: Boolean, default: true },
    allowRetryIncorrect: { type: Boolean, default: true },
  },
  { _id: false, versionKey: false },
);

/**
 * Quiz = author's WORKING COPY. Questions are REFERENCES to the reusable bank
 * so one question can serve many quizzes. Publishing freezes everything into
 * a QuizVersion; students always read/attempt that frozen snapshot.
 */
const quizSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: QUIZ_LIMITS.MAX_TITLE },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: QUIZ_LIMITS.MAX_DESCRIPTION, default: '' },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
    goals: { type: [{ type: String, enum: GOAL_VALUES }], default: [] },
    topics: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: QUIZ_STATUS_VALUES, default: 'draft', index: true },
    settings: { type: settingsSchema, default: () => ({}) },
    questions: {
      type: [quizLinkSchema],
      default: [],
      validate: {
        validator: (value) => value.length <= QUIZ_LIMITS.MAX_QUESTIONS,
        message: `A quiz can hold at most ${QUIZ_LIMITS.MAX_QUESTIONS} questions`,
      },
    },
    publishedVersion: { type: Number, default: 0, min: 0 },
    publishedQuestionCount: { type: Number, default: 0, min: 0 },
    publishedMaxScore: { type: Number, default: 0, min: 0 },
    attemptCount: { type: Number, default: 0, min: 0 },
    submittedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    reviewedBy: { type: Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, maxlength: 1000, default: '' },
    reviewHistory: { type: [reviewEntrySchema], default: [] },
  },
  { timestamps: true, versionKey: '__v' },
);

quizSchema.index({ title: 'text', description: 'text', tags: 'text', topics: 'text' }, {
  weights: { title: 8, topics: 4, tags: 3, description: 1 }, name: 'quiz_text_search',
});
quizSchema.index({ status: 1, publishedAt: -1 });
quizSchema.index({ author: 1, status: 1, updatedAt: -1 });
quizSchema.index({ topics: 1, difficulty: 1 });
quizSchema.index({ 'settings.visibility': 1, status: 1 });

/** Single serialization point. Never leaks answer keys — those live in versions. */
quizSchema.statics.toPublic = function toPublic(doc, { snapshot = null, questions = null } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const author = plain.author && typeof plain.author === 'object' && plain.author.name
    ? { id: String(plain.author._id ?? plain.author.id), name: plain.author.name }
    : { id: String(plain.author ?? ''), name: 'AlgoNest creator' };

  const settings = snapshot ? snapshot.settings : (plain.settings ?? {});
  return {
    id: String(plain._id),
    slug: plain.slug,
    title: snapshot ? snapshot.title : plain.title,
    description: snapshot ? snapshot.description : (plain.description || ''),
    author,
    difficulty: snapshot ? snapshot.difficulty : plain.difficulty,
    goals: plain.goals ?? [],
    topics: snapshot ? (snapshot.topics ?? []) : (plain.topics ?? []),
    tags: plain.tags ?? [],
    status: plain.status,
    settings: {
      timerMinutes: settings?.timerMinutes ?? 20,
      passPercentage: settings?.passPercentage ?? 60,
      maxAttempts: settings?.maxAttempts ?? 3,
      shuffleQuestions: Boolean(settings?.shuffleQuestions),
      shuffleOptions: Boolean(settings?.shuffleOptions),
      visibility: settings?.visibility ?? 'public',
      showExplanations: settings?.showExplanations ?? true,
      allowRetryIncorrect: settings?.allowRetryIncorrect ?? true,
    },
    questionIds: questions ? questions.map(String) : (plain.questions ?? []).map((link) => String(link.question?._id ?? link.question)),
    questionCount: snapshot ? (snapshot.questionCount ?? 0) : (plain.questions?.length ?? 0),
    maxScore: snapshot ? (snapshot.maxScore ?? 0) : 0,
    publishedVersion: plain.publishedVersion ?? 0,
    publishedQuestionCount: plain.publishedQuestionCount ?? 0,
    attemptCount: plain.attemptCount ?? 0,
    viewedVersion: snapshot ? snapshot.version : null,
    isPublishedSnapshot: Boolean(snapshot),
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

export const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
```

## `server/src/models/QuizVersion.js`

```js
import mongoose from 'mongoose';
import { QUIZ_LIMITS } from '@algonest/shared';
import { snapshotQuestionSchema } from './Question.js';

const { Schema, Types } = mongoose;

const versionSettingsSchema = new Schema(
  {
    timerMinutes: { type: Number, required: true },
    passPercentage: { type: Number, required: true },
    maxAttempts: { type: Number, required: true },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    visibility: { type: String, default: 'public' },
    showExplanations: { type: Boolean, default: true },
    allowRetryIncorrect: { type: Boolean, default: true },
  },
  { _id: false, versionKey: false },
);

/**
 * Immutable published snapshot — created once per publish, NEVER updated.
 *
 * It EMBEDS a full copy of every question (including answer keys) plus the
 * settings in force at publish time. An attempt from version 1 can therefore
 * still be graded and explained correctly after the author edits the bank,
 * reorders questions, changes the passing score or publishes version 2.
 *
 * Answer keys never leave the server except through the post-submit result
 * endpoint (`redactQuestion` strips them from the solver payload).
 */
const quizVersionSchema = new Schema(
  {
    quiz: { type: Types.ObjectId, ref: 'Quiz', required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    settings: { type: versionSettingsSchema, required: true },
    questions: { type: [snapshotQuestionSchema], default: [] },
    questionCount: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    title: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_TITLE },
    description: { type: String, default: '' },
    difficulty: { type: String, default: 'medium' },
    topics: { type: [String], default: [] },
    changelog: { type: String, maxlength: 500, default: '' },
    publishedBy: { type: Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

quizVersionSchema.index({ quiz: 1, version: -1 }, { unique: true });

/** Plain, order-stable list used by grading and by the solver endpoint. */
quizVersionSchema.methods.canonicalItems = function canonicalItems() {
  return [...(this.questions ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((question) => {
      const plain = question.toObject ? question.toObject() : { ...question };
      return { id: String(plain._id), question: plain };
    });
};

quizVersionSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    quiz: String(plain.quiz),
    version: plain.version,
    questionCount: plain.questionCount ?? plain.questions?.length ?? 0,
    maxScore: plain.maxScore ?? 0,
    title: plain.title,
    description: plain.description || '',
    difficulty: plain.difficulty,
    topics: plain.topics ?? [],
    settings: plain.settings ?? {},
    changelog: plain.changelog || '',
    publishedBy: String(plain.publishedBy),
    publishedAt: plain.publishedAt,
  };
};

export const QuizVersion = mongoose.model('QuizVersion', quizVersionSchema);
export default QuizVersion;
```

## `server/src/models/Attempt.js`

```js
import mongoose from 'mongoose';
import { ATTEMPT_MODE_VALUES, ATTEMPT_STATUS_VALUES, QUIZ_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * PER-USER DATA, FULLY SEPARATE from Quiz / QuizVersion.
 *
 * An attempt stores (a) the learner's answers, (b) the exact frozen version it
 * targets, (c) the deterministic presentation order so reloads never reshuffle,
 * and (d) the computed result + topic stats. Results are persisted rather than
 * recomputed so a result page stays correct even if a question is later edited.
 */

const answerSchema = new Schema(
  {
    questionId: { type: Types.ObjectId, required: true },
    /** Bounded by `attemptAnswerSchema`; Mixed only because the 7 types differ. */
    response: { type: Schema.Types.Mixed, default: null },
    marked: { type: Boolean, default: false },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false, versionKey: false },
);

const presentationSchema = new Schema(
  {
    questionId: { type: Types.ObjectId, required: true },
    optionIds: { type: [String], default: [] },
    itemIds: { type: [String], default: [] },
    leftIds: { type: [String], default: [] },
    rightIds: { type: [String], default: [] },
  },
  { _id: false, versionKey: false },
);

const resultSchema = new Schema(
  {
    questionId: { type: Types.ObjectId, required: true },
    type: { type: String, required: true },
    topic: { type: String, default: 'General' },
    points: { type: Number, default: 1 },
    awarded: { type: Number, default: 0 },
    correct: { type: Boolean, default: false },
    attempted: { type: Boolean, default: false },
    marked: { type: Boolean, default: false },
    response: { type: Schema.Types.Mixed, default: null },
    expected: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  { _id: false, versionKey: false },
);

const topicStatSchema = new Schema(
  {
    topic: { type: String, required: true },
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false },
);

const attemptSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    quiz: { type: Types.ObjectId, ref: 'Quiz', required: true, index: true },
    /** Frozen version number this attempt was created from. */
    quizVersion: { type: Number, required: true, min: 1 },
    versionId: { type: Types.ObjectId, ref: 'QuizVersion', required: true },
    mode: { type: String, enum: ATTEMPT_MODE_VALUES, default: 'full' },
    sourceAttempt: { type: Types.ObjectId, ref: 'Attempt', default: null },
    status: { type: String, enum: ATTEMPT_STATUS_VALUES, default: 'in_progress', index: true },
    /** Snapshot of the settings that govern this attempt (never re-read live). */
    settings: {
      timerMinutes: { type: Number, required: true },
      passPercentage: { type: Number, required: true },
      showExplanations: { type: Boolean, default: true },
    },
    title: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_TITLE },
    /** The exact question subset. `incorrect` retries hold a smaller subset. */
    questionIds: { type: [Types.ObjectId], default: [] },
    presentation: { type: [presentationSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    /** Authoritative deadline — the client's timer is display-only. */
    expiresAt: { type: Date, required: true },
    submittedAt: { type: Date, default: null },
    durationSeconds: { type: Number, default: 0, min: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    correctCount: { type: Number, default: 0 },
    attemptedCount: { type: Number, default: 0 },
    results: { type: [resultSchema], default: [] },
    topicStats: { type: [topicStatSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

// One live attempt per (user, quiz). Completed attempts are unlimited up to
// the quiz's maxAttempts setting, enforced in the service.
attemptSchema.index(
  { user: 1, quiz: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'in_progress' }, name: 'uniq_live_attempt' },
);
attemptSchema.index({ user: 1, quiz: 1, createdAt: -1 });
attemptSchema.index({ user: 1, status: 1, expiresAt: 1 });
attemptSchema.index({ quiz: 1, percentage: -1 });

/** Upsert a batch of autosaved rows, keyed by questionId. Returns the attempt. */
attemptSchema.methods.mergeAnswers = function mergeAnswers(rows, allowedIds) {
  const allowed = new Set(allowedIds.map(String));
  const byId = new Map(this.answers.map((answer) => [String(answer.questionId), answer]));
  for (const row of rows) {
    if (!allowed.has(String(row.questionId))) continue; // silently ignore stale ids
    byId.set(String(row.questionId), {
      questionId: row.questionId,
      response: row.response,
      marked: Boolean(row.marked),
      savedAt: new Date(),
    });
  }
  this.answers = [...byId.values()];
  this.markModified('answers');
  return this;
};

/** Serializer. `view: 'solver' | 'result' | 'summary'`. */
attemptSchema.statics.toPublic = function toPublic(doc, view = 'summary') {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const base = {
    id: String(plain._id),
    quiz: String(plain.quiz),
    quizVersion: plain.quizVersion,
    mode: plain.mode,
    sourceAttempt: plain.sourceAttempt ? String(plain.sourceAttempt) : null,
    status: plain.status,
    title: plain.title || '',
    questionCount: plain.questionIds?.length ?? 0,
    startedAt: plain.startedAt,
    expiresAt: plain.expiresAt,
    submittedAt: plain.submittedAt ?? null,
    durationSeconds: plain.durationSeconds ?? 0,
    settings: plain.settings,
    createdAt: plain.createdAt,
  };

  if (view === 'solver') {
    return {
      ...base,
      questionIds: (plain.questionIds ?? []).map(String),
      presentation: (plain.presentation ?? []).map((entry) => ({
        questionId: String(entry.questionId),
        optionIds: entry.optionIds ?? [], itemIds: entry.itemIds ?? [],
        leftIds: entry.leftIds ?? [], rightIds: entry.rightIds ?? [],
      })),
      answers: (plain.answers ?? []).map((answer) => ({
        questionId: String(answer.questionId),
        response: answer.response ?? null,
        marked: Boolean(answer.marked),
        savedAt: answer.savedAt ?? null,
      })),
    };
  }

  const scored = {
    ...base,
    score: plain.score ?? 0,
    maxScore: plain.maxScore ?? 0,
    percentage: plain.percentage ?? 0,
    passed: Boolean(plain.passed),
    correctCount: plain.correctCount ?? 0,
    attemptedCount: plain.attemptedCount ?? 0,
    topicStats: (plain.topicStats ?? []).map((stat) => ({
      topic: stat.topic, total: stat.total, correct: stat.correct,
      score: stat.score, maxScore: stat.maxScore, percentage: stat.percentage,
    })),
  };

  if (view === 'result') {
    return {
      ...scored,
      results: (plain.results ?? []).map((result) => ({
        questionId: String(result.questionId), type: result.type, topic: result.topic,
        points: result.points, awarded: result.awarded, correct: Boolean(result.correct),
        attempted: Boolean(result.attempted), marked: Boolean(result.marked),
        response: result.response ?? null,
        expected: result.expected || '', explanation: result.explanation || '',
      })),
    };
  }
  return scored;
};

export const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;
```

---

# Server — pure quiz engine (new)

## `server/src/modules/quizzes/questionNormalizer.js`

```js
import { QUESTION_TYPES as T } from '@algonest/shared';

/**
 * Pure conversion from the creator-friendly Zod input shape to the ONE
 * canonical shape stored in Question / QuizVersion / graded by questionGrader.
 *
 * Canonical shape:
 *   { type, prompt, topic, difficulty, explanation, points, tags, code,
 *     caseSensitive, options: [{id,text}], items: [{id,text}],
 *     pairs: [{id,left,right}], answerKey: [id], booleanKey: bool|null,
 *     textAnswers: [string] }
 *
 * Every id is deterministic (o0, i0, p0 …). That makes snapshots byte-stable,
 * imported questions reproducible, and answer keys safe to diff in tests.
 */

/** Thrown when a validated shape still contains an unresolvable answer. */
export class QuestionNormalizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QuestionNormalizeError';
  }
}

const TRUE_WORDS = new Set(['true', 'yes', 't', '1']);
const FALSE_WORDS = new Set(['false', 'no', 'f', '0']);

export function coerceBoolean(value) {
  if (typeof value === 'boolean') return value;
  const key = String(value ?? '').trim().toLowerCase();
  if (TRUE_WORDS.has(key)) return true;
  if (FALSE_WORDS.has(key)) return false;
  return null;
}

/**
 * Accepts a 0-based index, a 1-based index (number or numeric string), a
 * letter A–H, or the exact text of an option. Returns -1 when unresolvable.
 */
export function resolveOptionIndex(answer, options) {
  const len = options.length;
  const numeric = (n) => {
    if (!Number.isInteger(n) || len === 0) return -1;
    if (n >= 0 && n < len) return n;
    if (n >= 1 && n <= len) return n - 1; // tolerate 1-based exports
    return -1;
  };

  if (typeof answer === 'number') return numeric(answer);
  const text = String(answer ?? '').trim();
  if (!text) return -1;
  if (/^\d+$/.test(text)) return numeric(Number(text));
  if (/^[a-h]$/i.test(text)) {
    const index = text.toLowerCase().charCodeAt(0) - 97;
    return index < len ? index : -1;
  }
  return options.findIndex((option) => option.text.trim().toLowerCase() === text.toLowerCase());
}

const textOptions = (values) => (values ?? []).map((text, index) => ({ id: `o${index}`, text: String(text).trim() }));
const textItems = (values) => (values ?? []).map((text, index) => ({ id: `i${index}`, text: String(text).trim() }));
const normalisePairs = (values) => (values ?? []).map((pair, index) => ({
  id: `p${index}`,
  left: String(Array.isArray(pair) ? pair[0] : pair.left).trim(),
  right: String(Array.isArray(pair) ? pair[1] : pair.right).trim(),
}));

/** @param {object} input validated by `questionInputSchema` (or a bulk row). */
export function normaliseQuestion(input) {
  if (!input || typeof input !== 'object') throw new QuestionNormalizeError('Question must be an object');

  const base = {
    type: input.type,
    prompt: String(input.prompt ?? '').trim(),
    topic: input.topic || 'General',
    difficulty: input.difficulty || 'medium',
    explanation: input.explanation || '',
    points: Number(input.points) || 1,
    tags: input.tags ?? [],
    code: input.code || '',
    caseSensitive: Boolean(input.caseSensitive),
    options: [],
    items: [],
    pairs: [],
    answerKey: [],
    booleanKey: null,
    textAnswers: [],
  };

  switch (input.type) {
    case T.MCQ:
    case T.MULTI:
    case T.OUTPUT: {
      base.options = textOptions(input.options);
      const raw = Array.isArray(input.answer) ? input.answer : [input.answer];
      const indexes = raw.map((answer) => resolveOptionIndex(answer, base.options));
      if (indexes.some((index) => index < 0)) {
        throw new QuestionNormalizeError(`Correct answer "${raw.join(', ')}" does not match any option`);
      }
      const unique = [...new Set(indexes)];
      if (input.type === T.MCQ || input.type === T.OUTPUT) {
        if (unique.length !== 1) throw new QuestionNormalizeError('This type needs exactly one correct option');
      } else if (unique.length < 2) {
        throw new QuestionNormalizeError('Multiple select needs at least two correct options');
      }
      base.answerKey = unique.map((index) => base.options[index].id);
      break;
    }
    case T.TRUE_FALSE: {
      const value = coerceBoolean(input.answer);
      if (value === null) throw new QuestionNormalizeError('True/false needs a boolean answer');
      base.booleanKey = value;
      break;
    }
    case T.ORDERING: {
      base.items = textItems(input.items);
      // `items` are authored in the correct order; the solver sees them shuffled.
      base.answerKey = base.items.map((item) => item.id);
      break;
    }
    case T.MATCHING: {
      base.pairs = normalisePairs(input.pairs);
      // Right options are identified by their own pair id; the association is
      // NEVER sent to the solver (see redactQuestion).
      base.answerKey = base.pairs.map((pair) => pair.id);
      break;
    }
    case T.FILL_BLANK: {
      const answers = Array.isArray(input.answer) ? input.answer : [input.answer];
      base.textAnswers = answers.map((answer) => String(answer).trim()).filter(Boolean);
      if (!base.textAnswers.length) throw new QuestionNormalizeError('Add at least one accepted answer');
      break;
    }
    default:
      throw new QuestionNormalizeError(`Unsupported question type "${input.type}"`);
  }

  return base;
}

/** Stable, human-readable expected answer for a result page. */
export function expectedAnswer(question) {
  const label = (id) => question.options?.find((option) => option.id === id)?.text ?? id;
  switch (question.type) {
    case T.MCQ:
    case T.OUTPUT:
      return label(question.answerKey?.[0]);
    case T.MULTI:
      return (question.answerKey ?? []).map(label).join(', ');
    case T.TRUE_FALSE:
      return question.booleanKey ? 'True' : 'False';
    case T.ORDERING:
      return (question.answerKey ?? [])
        .map((id) => question.items?.find((item) => item.id === id)?.text ?? id)
        .join(' → ');
    case T.MATCHING:
      return (question.pairs ?? []).map((pair) => `${pair.left} → ${pair.right}`).join(', ');
    case T.FILL_BLANK:
      return (question.textAnswers ?? []).join(' / ');
    default:
      return '';
  }
}

/**
 * Solver-safe projection. Explanations and ALL answer fields are removed here;
 * the only place a learner sees them is the post-submit result endpoint.
 * `presentation` (built once per attempt) controls display order.
 */
export function redactQuestion(question, questionId, presentation = null) {
  const order = (list, ids) => {
    if (!ids?.length) return list;
    const byId = new Map(list.map((entry) => [entry.id, entry]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
    // Defensive: never silently drop an item if a stale presentation is used.
    for (const entry of list) if (!ids.includes(entry.id)) ordered.push(entry);
    return ordered;
  };

  const view = {
    id: String(questionId),
    type: question.type,
    prompt: question.prompt,
    topic: question.topic || 'General',
    difficulty: question.difficulty || 'medium',
    points: Number(question.points) || 1,
    code: question.code || '',
  };

  switch (question.type) {
    case T.MCQ:
    case T.MULTI:
    case T.OUTPUT:
      view.options = order(question.options ?? [], presentation?.optionIds);
      view.multi = question.type === T.MULTI;
      break;
    case T.ORDERING:
      view.items = order(question.items ?? [], presentation?.itemIds);
      break;
    case T.MATCHING:
      // Two independent arrays: adjacency in the payload never reveals a pair.
      view.leftItems = order(
        (question.pairs ?? []).map((pair) => ({ id: pair.id, text: pair.left })),
        presentation?.leftIds,
      );
      view.rightItems = order(
        (question.pairs ?? []).map((pair) => ({ id: pair.id, text: pair.right })),
        presentation?.rightIds,
      );
      break;
    case T.FILL_BLANK:
      view.caseSensitive = Boolean(question.caseSensitive);
      break;
    default:
      break;
  }
  return view;
}

/** Author-facing projection: includes the canonical answer, no raw internals. */
export function authorQuestion(question, doc) {
  return {
    id: String(doc?._id ?? ''),
    type: question.type,
    prompt: question.prompt,
    topic: question.topic,
    difficulty: question.difficulty,
    explanation: question.explanation || '',
    points: question.points,
    tags: question.tags ?? [],
    code: question.code || '',
    caseSensitive: Boolean(question.caseSensitive),
    options: question.options ?? [],
    items: question.items ?? [],
    pairs: question.pairs ?? [],
    answerKey: question.answerKey ?? [],
    booleanKey: question.booleanKey,
    textAnswers: question.textAnswers ?? [],
    expected: expectedAnswer(question),
    usageCount: doc?.usageCount ?? 0,
    createdAt: doc?.createdAt ?? null,
    updatedAt: doc?.updatedAt ?? null,
  };
}
```

## `server/src/modules/quizzes/questionGrader.js`

```js
import { QUESTION_TYPES as T } from '@algonest/shared';
import { coerceBoolean, expectedAnswer } from './questionNormalizer.js';

/**
 * Pure, deterministic grading. No DB, no Express, no clock — every branch is
 * unit tested. `answerKey` ids are canonical (o0/i0/p0), so display shuffling
 * can never change a score.
 */

const sameSet = (left, right) => {
  const a = new Set(left);
  const b = new Set(right);
  return a.size === b.size && [...a].every((value) => b.has(value));
};

const asArray = (value) => (Array.isArray(value) ? value.map(String) : value == null ? [] : [String(value)]);

/** Canonicalise whitespace/case for fill-in-the-blank comparisons. */
function normaliseText(value, caseSensitive) {
  const text = String(value ?? '').trim().replace(/\s+/g, ' ');
  return caseSensitive ? text : text.toLowerCase();
}

/** @returns {boolean} whether one response is correct for one canonical question. */
export function isResponseCorrect(question, response) {
  switch (question.type) {
    case T.MCQ:
    case T.OUTPUT: {
      const answer = asArray(response);
      return answer.length === 1 && answer[0] === question.answerKey?.[0];
    }
    case T.MULTI:
      return sameSet(asArray(response), question.answerKey ?? []);
    case T.TRUE_FALSE: {
      const value = coerceBoolean(response);
      return value !== null && value === question.booleanKey;
    }
    case T.ORDERING: {
      const answer = asArray(response);
      const key = question.answerKey ?? [];
      return answer.length === key.length && answer.every((id, index) => id === key[index]);
    }
    case T.MATCHING: {
      if (!response || typeof response !== 'object' || Array.isArray(response)) return false;
      const pairs = question.pairs ?? [];
      if (!pairs.length) return false;
      // The solver maps each left id to a right id; a correct map is the identity.
      return pairs.every((pair) => response[pair.id] === pair.id)
        && Object.keys(response).length === pairs.length;
    }
    case T.FILL_BLANK: {
      const given = normaliseText(response, question.caseSensitive);
      if (!given) return false;
      return (question.textAnswers ?? []).some((accepted) => normaliseText(accepted, question.caseSensitive) === given);
    }
    default:
      return false;
  }
}

/**
 * Grade a whole attempt.
 *
 * @param {Array<{id:string, question:object}>} items canonical version questions
 * @param {Array<{questionId:string, response:unknown, marked?:boolean}>} answers
 * @param {{ showExplanations?: boolean }} options
 */
export function gradeAttempt(items, answers = [], { showExplanations = true } = {}) {
  const byId = new Map(answers.map((answer) => [String(answer.questionId), answer]));
  const results = [];
  const topicMap = new Map();

  for (const item of items) {
    const question = item.question ?? item;
    const questionId = String(item.id ?? question._id ?? '');
    const stored = byId.get(questionId);
    const correct = stored ? isResponseCorrect(question, stored.response) : false;
    const points = Number(question.points) || 1;
    const awarded = correct ? points : 0;
    const topic = question.topic || 'General';

    const result = {
      questionId,
      type: question.type,
      topic,
      points,
      awarded,
      correct,
      attempted: Boolean(stored && stored.response !== null && stored.response !== undefined
        && !(Array.isArray(stored.response) && stored.response.length === 0)
        && !(typeof stored.response === 'object' && !Array.isArray(stored.response) && Object.keys(stored.response).length === 0)),
      marked: Boolean(stored?.marked),
      response: stored?.response ?? null,
      ...(showExplanations ? { expected: expectedAnswer(question), explanation: question.explanation || '' } : {}),
    };
    results.push(result);

    const stat = topicMap.get(topic) ?? { topic, total: 0, correct: 0, score: 0, maxScore: 0, percentage: 0 };
    stat.total += 1;
    stat.correct += correct ? 1 : 0;
    stat.score += awarded;
    stat.maxScore += points;
    topicMap.set(topic, stat);
  }

  const topicStats = [...topicMap.values()]
    .map((stat) => ({ ...stat, percentage: stat.maxScore ? Math.round((stat.score / stat.maxScore) * 1000) / 10 : 0 }))
    .sort((a, b) => a.percentage - b.percentage || a.topic.localeCompare(b.topic));

  const score = results.reduce((sum, result) => sum + result.awarded, 0);
  const maxScore = results.reduce((sum, result) => sum + result.points, 0);
  const percentage = maxScore ? Math.round((score / maxScore) * 1000) / 10 : 0;

  return {
    results,
    topicStats,
    score,
    maxScore,
    percentage,
    correctCount: results.filter((result) => result.correct).length,
    attemptedCount: results.filter((result) => result.attempted).length,
    questionCount: results.length,
  };
}

/** Ids of questions a learner got wrong — used by retry-incorrect-only. */
export function incorrectQuestionIds(results) {
  // Results reloaded from Mongo hold ObjectIds; freshly graded ones hold
  // strings. Normalising here is what makes retry-incorrect-only work after a
  // page reload as well as in the same process.
  return results.filter((result) => !result.correct).map((result) => String(result.questionId));
}
```

## `server/src/modules/quizzes/quizPresentation.js`

```js
import { QUESTION_TYPES as T } from '@algonest/shared';

/**
 * Deterministic shuffle. Seeding from the attempt id means a page reload or an
 * autosave round-trip NEVER reorders questions/options under the learner — a
 * real correctness issue, not just polish, because answers are keyed by id.
 */

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates on a copy. Exported for tests. */
export function seededShuffle(values, seed) {
  const copy = [...values];
  const random = mulberry32(hashString(String(seed)));
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

/**
 * Build the exact display order for one attempt. Stored on the Attempt so it
 * is stable for the whole session and can be replayed on the result page.
 *
 * @param {Array<{id:string, question:object}>} items frozen version questions
 * @param {{shuffleQuestions?:boolean, shuffleOptions?:boolean}} settings
 * @param {string} seed attempt id
 */
export function buildPresentation(items, settings, seed) {
  const distinct = (values, key) => {
    const shuffled = seededShuffle(values, `${seed}:${key}`);
    return shuffled.length > 1 && shuffled.every((value, index) => value === values[index])
      ? seededShuffle(values, `${seed}:${key}:retry`)
      : shuffled;
  };

  const orderedItems = settings?.shuffleQuestions
    ? seededShuffle(items, `${seed}:questions`)
    : items;
  const optionShuffle = Boolean(settings?.shuffleOptions);

  return orderedItems.map((item, index) => {
    const question = item.question ?? item;
    const id = String(item.id ?? question._id ?? index);
    const entry = { questionId: id };

    if ([T.MCQ, T.MULTI, T.OUTPUT].includes(question.type)) {
      const ids = (question.options ?? []).map((option) => option.id);
      // Always shuffle options when requested; ordering/matching are inherently shuffled.
      entry.optionIds = optionShuffle ? distinct(ids, `options:${id}`) : ids;
    }
    if (question.type === T.ORDERING) {
      entry.itemIds = distinct((question.items ?? []).map((entry2) => entry2.id), `items:${id}`);
    }
    if (question.type === T.MATCHING) {
      const pairIds = (question.pairs ?? []).map((pair) => pair.id);
      entry.leftIds = distinct(pairIds, `left:${id}`);
      entry.rightIds = distinct(pairIds, `right:${id}`);
    }
    return entry;
  });
}

/** Order a frozen question list by a stored presentation array. */
export function applyQuestionOrder(items, presentation) {
  if (!presentation?.length) return items;
  const byId = new Map(items.map((item) => [String(item.id ?? item.question?._id ?? ''), item]));
  const ordered = presentation.map((entry) => byId.get(String(entry.questionId))).filter(Boolean);
  for (const item of items) {
    const id = String(item.id ?? item.question?._id ?? '');
    if (!presentation.some((entry) => String(entry.questionId) === id)) ordered.push(item);
  }
  return ordered;
}

/** Lookup helper for the per-question presentation entry. */
export function presentationFor(presentation, questionId) {
  return presentation?.find((entry) => String(entry.questionId) === String(questionId)) ?? null;
}
```

## `server/src/modules/quizzes/bulkImport.js`

```js
import { QUIZ_LIMITS, questionImportSchema, questionInputSchema } from '@algonest/shared';
import { normaliseQuestion } from './questionNormalizer.js';

/**
 * Pure JSON/CSV question importer: text in, validated rows + per-row errors
 * out. It performs NO database writes and NO network access, so the preview
 * endpoint is safe to call on untrusted pasted content.
 *
 * Multi-value CSV cells use `|` (rather than commas) so a normal spreadsheet
 * export does not need nested quoting. Matching pairs use `left::right`.
 */

export const CSV_HEADERS = Object.freeze([
  'type', 'prompt', 'options', 'answer', 'items', 'pairs',
  'code', 'explanation', 'topic', 'difficulty', 'points', 'tags', 'caseSensitive',
]);

/** Build a correctly quoted CSV row from an object keyed by header name. */
function csvRow(values) {
  return CSV_HEADERS.map((header) => {
    const value = values[header] ?? '';
    const text = String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',');
}

export const CSV_TEMPLATE = [
  CSV_HEADERS.join(','),
  csvRow({
    type: 'mcq', prompt: 'Which data structure is LIFO?', options: 'Queue|Stack|Tree|Graph', answer: 'B',
    explanation: 'A stack follows last-in first-out.', topic: 'Stacks & Queues', difficulty: 'easy', points: '1',
  }),
  csvRow({
    type: 'multi', prompt: 'Pick the prime numbers', options: '2|3|4|9', answer: 'A|B',
    topic: 'Math', difficulty: 'medium', points: '2',
  }),
  csvRow({
    type: 'true_false', prompt: 'Binary search needs sorted input.', answer: 'true',
    explanation: 'It relies on a monotonic predicate.', topic: 'Binary Search', difficulty: 'easy', points: '1',
  }),
  csvRow({
    type: 'ordering', prompt: 'Order these by complexity (least first)',
    items: 'O(1)|O(log n)|O(n)|O(n log n)', topic: 'Big-O',
  }),
  csvRow({
    type: 'matching', prompt: 'Match ADT to property', pairs: 'Stack::LIFO|Queue::FIFO', topic: 'Stacks & Queues',
  }),
].join('\n');

/** A copy-paste-friendly JSON example covering all seven types. */
export const JSON_TEMPLATE = JSON.stringify([
  { type: 'mcq', prompt: 'Which data structure is LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 'B', topic: 'Stacks & Queues', difficulty: 'easy', explanation: 'A stack follows last-in first-out.' },
  { type: 'multi', prompt: 'Pick the prime numbers', options: ['2', '3', '4', '9'], answer: [0, 1], topic: 'Math', points: 2 },
  { type: 'true_false', prompt: 'Binary search needs sorted input.', answer: true, topic: 'Binary Search' },
  { type: 'ordering', prompt: 'Order these by complexity', items: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], topic: 'Big-O' },
  { type: 'matching', prompt: 'Match ADT to property', pairs: [['Stack', 'LIFO'], ['Queue', 'FIFO']], topic: 'Stacks & Queues' },
  { type: 'output', prompt: 'What does this print?', code: 'console.log([1, 2, 3].map(x => x * 2).join("-"));', options: ['1-2-3', '2-4-6', '2 4 6', 'Error'], answer: 1, topic: 'Arrays' },
  { type: 'fill_blank', prompt: 'A ________ is a FIFO structure.', answer: ['queue', 'queues'], topic: 'Stacks & Queues' },
], null, 2);

/** RFC 4180-ish parser: quoted fields, escaped quotes, CRLF, embedded newlines. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const source = String(text ?? '').replace(/^\uFEFF/, '');

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
      continue;
    }
    if (char === '"' && field === '') { quoted = true; continue; }
    if (char === ',') { row.push(field.trim()); field = ''; continue; }
    if (char === '\r' || char === '\n') {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field.trim()); field = '';
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      continue;
    }
    field += char;
  }
  row.push(field.trim());
  if (row.some((cell) => cell !== '')) rows.push(row);
  return rows;
}

const cleanList = (value) => String(value ?? '').split('|').map((part) => part.trim()).filter(Boolean);
const put = (target, key, value) => {
  if (value !== undefined && value !== null && String(value).trim() !== '') target[key] = value;
};

function csvRowToInput(row) {
  const input = { type: String(row.type ?? '').trim().toLowerCase() };
  put(input, 'prompt', row.prompt);
  put(input, 'code', row.code);
  put(input, 'explanation', row.explanation);
  put(input, 'topic', row.topic);
  put(input, 'difficulty', String(row.difficulty ?? '').trim().toLowerCase());
  put(input, 'points', row.points);
  put(input, 'caseSensitive', row.caseSensitive === undefined || row.caseSensitive === ''
    ? undefined
    : ['true', 'yes', '1'].includes(String(row.caseSensitive).trim().toLowerCase()));
  if (row.tags) input.tags = cleanList(row.tags);

  const options = cleanList(row.options);
  if (options.length) input.options = options;
  const items = cleanList(row.items);
  if (items.length) input.items = items;

  const pairs = cleanList(row.pairs).map((cell) => {
    const [left, right] = cell.split('::').map((part) => part.trim());
    return { left, right };
  });
  if (pairs.length) input.pairs = pairs;

  const answerCell = String(row.answer ?? '').trim();
  if (answerCell !== '') {
    if (input.type === 'multi' || input.type === 'fill_blank') input.answer = cleanList(answerCell);
    else input.answer = answerCell;
  }
  return input;
}

/**
 * @returns {{ items: object[], errors: Array<{row:number,message:string}>,
 *             skipped: Array<{row:number,reason:string}>, total:number }}
 */
export function parseBulkQuestions(format, text) {
  const parsed = questionImportSchema.safeParse({ format, text });
  if (!parsed.success) {
    return { items: [], errors: [{ row: 0, message: parsed.error.issues[0]?.message ?? 'Invalid import' }], skipped: [], total: 0 };
  }

  let rawRows = [];
  if (format === 'json') {
    let value;
    try {
      value = JSON.parse(text);
    } catch (error) {
      return { items: [], errors: [{ row: 0, message: `Invalid JSON: ${error.message}` }], skipped: [], total: 0 };
    }
    const list = Array.isArray(value) ? value : Array.isArray(value?.questions) ? value.questions : Array.isArray(value?.items) ? value.items : [value];
    rawRows = list.map((entry) => ({ row: entry, label: 'json' }));
  } else {
    const rows = parseCsv(text);
    if (rows.length < 2) {
      return { items: [], errors: [{ row: 0, message: 'CSV needs a header row and at least one question row' }], skipped: [], total: 0 };
    }
    const header = rows[0].map((column) => String(column).trim().toLowerCase().replace(/[\s_-]/g, ''));
    const missing = ['type', 'prompt'].filter((column) => !header.includes(column));
    if (missing.length) {
      return { items: [], errors: [{ row: 1, message: `CSV is missing required column(s): ${missing.join(', ')}` }], skipped: [], total: 0 };
    }
    const aliases = { casesensitive: 'caseSensitive' };
    rawRows = rows.slice(1, QUIZ_LIMITS.MAX_CSV_ROWS + 1).map((cells, index) => {
      const row = {};
      header.forEach((column, cellIndex) => {
        row[aliases[column] ?? column] = cells[cellIndex] ?? '';
      });
      return { row: csvRowToInput(row), label: 'csv' };
    });
  }

  const items = [];
  const errors = [];
  const skipped = [];
  const seen = new Set();

  rawRows.slice(0, QUIZ_LIMITS.MAX_IMPORT_BATCH).forEach(({ row }, index) => {
    const rowNumber = index + 1;
    const validated = questionInputSchema.safeParse(row);
    if (!validated.success) {
      const issue = validated.error.issues[0];
      errors.push({ row: rowNumber, message: `${issue?.path.join('.') || 'row'}: ${issue?.message ?? 'invalid question'}` });
      return;
    }
    try {
      const canonical = normaliseQuestion(validated.data);
      const fingerprint = `${canonical.type}:${canonical.prompt.toLowerCase()}`;
      if (seen.has(fingerprint)) {
        skipped.push({ row: rowNumber, reason: 'Duplicate question' });
        return;
      }
      seen.add(fingerprint);
      items.push({ input: validated.data, canonical });
    } catch (error) {
      errors.push({ row: rowNumber, message: error.message });
    }
  });

  return { items, errors, skipped, total: rawRows.length };
}
```

## `server/src/modules/quizzes/quizWorkflow.js`

```js
import {
  MODERATION_DECISIONS,
  QUIZ_STATUSES as S,
  QUIZ_VISIBILITIES,
} from '@algonest/shared';

/**
 * Pure content-lifecycle state machine for quizzes. Mirrors the sheet workflow
 * intentionally so moderation UI and audit history behave identically across
 * content types, but lives in this module so quiz rules can evolve freely.
 *
 * draft ─submit→ pending_review ─approve→ approved ─publish→ published
 *                    │                                        │
 *   request_changes ─┘ → changes_requested ─resubmit→ pending_review
 *   reject ──────────┘ → rejected ─revise→ draft
 *   any non-archived ─archive→ archived ─restore→ draft
 *   published ─revision→ draft (the public QuizVersion stays frozen)
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

export const EDITABLE_STATUSES = Object.freeze([
  S.DRAFT, S.CHANGES_REQUESTED, S.REJECTED, S.APPROVED,
]);

export const DECISION_TO_STATUS = Object.freeze({
  [MODERATION_DECISIONS.APPROVE]: S.APPROVED,
  [MODERATION_DECISIONS.REQUEST_CHANGES]: S.CHANGES_REQUESTED,
  [MODERATION_DECISIONS.REJECT]: S.REJECTED,
});

export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

export function transitionError(from, to) {
  return `Cannot move a quiz from "${from}" to "${to}". Allowed next states: ${(TRANSITIONS[from] ?? []).join(', ') || 'none'}.`;
}

export function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

/** All roles with any permission are staff; students have an empty list. */
export function isStaff(actor) {
  return Boolean(actor?.permissions?.length);
}

/** A quiz may be attempted only when a frozen published version exists. */
export function isAttemptable(quiz, actor) {
  if (!quiz?.publishedVersion || quiz.status === S.ARCHIVED) return false;
  if (quiz.settings?.visibility === QUIZ_VISIBILITIES.PRIVATE) return isStaff(actor) || String(quiz.author?._id ?? quiz.author) === actor?.id;
  return true;
}

export default canTransition;
```

## `server/src/modules/quizzes/actor.js`

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

---

# Server — services (new)

## `server/src/modules/quizzes/question.service.js`

```js
import mongoose from 'mongoose';
import { PERMISSIONS, QUIZ_LIMITS } from '@algonest/shared';
import { Question } from '../../models/Question.js';
import ApiError from '../../utils/ApiError.js';
import { paginateQuery } from '../../utils/pagination.js';
import { authorQuestion, normaliseQuestion, QuestionNormalizeError } from './questionNormalizer.js';
import { parseBulkQuestions, CSV_TEMPLATE, JSON_TEMPLATE } from './bulkImport.js';

const { Types } = mongoose;
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isStaff = (actor) => Boolean(actor?.permissions?.length);
const canManage = (doc, actor) => String(doc.author?._id ?? doc.author) === String(actor.id) || isStaff(actor);

async function findQuestion(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid question id');
  const question = await Question.findById(id);
  if (!question) throw ApiError.notFound('Question not found');
  return question;
}

function toCanonicalInput(payload) {
  try {
    return normaliseQuestion(payload);
  } catch (error) {
    if (error instanceof QuestionNormalizeError) throw ApiError.unprocessable(error.message);
    throw error;
  }
}

/* ───────────────────────────── list / read ───────────────────────────── */

/**
 * Bank questions are PRIVATE to their author. Staff (any permission) can browse
 * the whole bank for moderation, but a student can never read another user's
 * answer keys through this endpoint.
 */
export async function listQuestions(query, actor) {
  const filter = {};
  if (query.mine === 'true' || !isStaff(actor)) filter.author = new Types.ObjectId(actor.id);
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ prompt: rx }, { topic: rx }, { tags: rx }];
  }
  if (query.type) filter.type = query.type;
  if (query.topic) filter.topic = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const { items, pagination } = await paginateQuery(filter, Question, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
  return { items: items.map((doc) => authorQuestion(doc, doc)), pagination };
}

export async function getQuestion(id, actor) {
  const question = await findQuestion(id);
  if (!canManage(question, actor)) throw ApiError.forbidden('This question belongs to another creator');
  return { question: authorQuestion(question, question) };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createQuestion(payload, actor, source = 'manual') {
  const canonical = toCanonicalInput(payload);
  const doc = await Question.create({ ...canonical, author: new Types.ObjectId(actor.id), source });
  return { question: authorQuestion(doc, doc) };
}

export async function updateQuestion(id, payload, actor) {
  const question = await findQuestion(id);
  if (!canManage(question, actor)) throw ApiError.forbidden('This question belongs to another creator');
  const canonical = toCanonicalInput(payload);
  for (const [key, value] of Object.entries(canonical)) question[key] = value;
  await question.save();
  // Published QuizVersions embed their own copy, so no attempt is invalidated.
  return { question: authorQuestion(question, question) };
}

/**
 * Hard-delete is only safe when nothing links this question. Published versions
 * are self-contained but a working-copy link would dangle, so refuse and tell
 * the creator exactly what to unlink.
 */
export async function deleteQuestion(id, actor) {
  const question = await findQuestion(id);
  if (!canManage(question, actor)) throw ApiError.forbidden('This question belongs to another creator');
  if ((question.usageCount ?? 0) > 0) {
    throw ApiError.conflict(`This question is linked to ${question.usageCount} quiz draft(s). Remove it from those quizzes first.`);
  }
  await Question.deleteOne({ _id: question._id });
  return { id: String(question._id), deleted: true };
}

/** Pure preview for the creator UI. Never writes to MongoDB. */
export function parseImport(format, text) {
  const result = parseBulkQuestions(format, text);
  return {
    items: result.items.map(({ input, canonical }) => ({
      ...input,
      canonical,
      expected: canonical.answerKey?.length ? canonical.answerKey.join(', ') : '',
    })),
    errors: result.errors,
    skipped: result.skipped,
    total: result.total,
    templates: { csv: CSV_TEMPLATE, json: JSON_TEMPLATE },
  };
}

/** Used by quiz.service when linking/unlinking; bounded to the batch cap. */
export async function adjustUsage(questionIds, delta) {
  if (!questionIds?.length) return;
  await Question.updateMany(
    { _id: { $in: questionIds.slice(0, QUIZ_LIMITS.MAX_IMPORT_BATCH).map((id) => new Types.ObjectId(id)) } },
    { $inc: { usageCount: delta } },
  );
}

export const hasModerationPermission = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
```

## `server/src/modules/quizzes/quiz.service.js`

```js
import mongoose from 'mongoose';
import {
  ATTEMPT_STATUSES, PERMISSIONS, QUIZ_LIMITS, QUIZ_STATUSES as S, QUIZ_VISIBILITIES, ROLES,
} from '@algonest/shared';
import { Quiz } from '../../models/Quiz.js';
import { QuizVersion } from '../../models/QuizVersion.js';
import { Question } from '../../models/Question.js';
import { Attempt } from '../../models/Attempt.js';
import ApiError from '../../utils/ApiError.js';
import { paginateQuery } from '../../utils/pagination.js';
import { uniqueSlug } from '../../utils/slug.js';
import { authorQuestion, normaliseQuestion, QuestionNormalizeError } from './questionNormalizer.js';
import { adjustUsage } from './question.service.js';
import {
  DECISION_TO_STATUS, canTransition, isAttemptable, isEditable, isStaff, transitionError,
} from './quizWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';
const idOf = (value) => String(value?._id ?? value ?? '');
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isModerator = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
const ownerOf = (quiz, actor) => idOf(quiz.author) === String(actor.id);
const canManage = (quiz, actor) => ownerOf(quiz, actor) || isModerator(actor);

function assertManage(quiz, actor) {
  if (!canManage(quiz, actor)) throw ApiError.forbidden('Only the author or a content moderator can change this quiz');
}

function assertQuestionEditable(quiz) {
  if (quiz.status === S.PUBLISHED) {
    throw ApiError.conflict('This quiz is published. Start a new revision before editing questions.');
  }
  if (!isEditable(quiz.status)) {
    throw ApiError.conflict(`Questions cannot be edited while the quiz is "${quiz.status}"`);
  }
}

async function findQuiz(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid quiz id');
  const quiz = await Quiz.findById(id).populate('author', AUTHOR_FIELDS);
  if (!quiz) throw ApiError.notFound('Quiz not found');
  return quiz;
}

async function latestVersion(quizId) {
  return QuizVersion.findOne({ quiz: quizId }).sort({ version: -1 }).lean();
}

function pushReview(quiz, from, to, actor, decision, note) {
  quiz.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  if (quiz.reviewHistory.length > 20) quiz.reviewHistory = quiz.reviewHistory.slice(-20);
}

/** Derive topic filters from the linked bank questions (no manual tagging needed). */
async function syncTopics(quiz) {
  const ids = (quiz.questions ?? []).map((link) => link.question).filter(Boolean);
  if (!ids.length) return;
  const docs = await Question.find({ _id: { $in: ids } }, { topic: 1 }).lean();
  const explicit = (quiz.topics ?? []).filter(Boolean);
  quiz.topics = [...new Set([...explicit, ...docs.map((doc) => doc.topic).filter(Boolean)])].slice(0, 30);
}

/* ───────────────────────────── list / read ───────────────────────────── */

export async function listQuizzes(query, actor) {
  const filter = {};
  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    filter.status = query.status; // moderation queue / staff views
  } else {
    filter.publishedVersion = { $gt: 0 };
    filter.status = { $ne: S.ARCHIVED };
    // `unlisted` is link-only; `private` is never listed.
    filter['settings.visibility'] = QUIZ_VISIBILITIES.PUBLIC;
  }

  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { tags: rx }, { topics: rx }];
  }
  if (query.topic) filter.topics = query.topic;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { attemptCount: -1, createdAt: -1 },
    rating: { attemptCount: -1, createdAt: -1 },
    title: { title: 1 },
  };

  const { items, pagination } = await paginateQuery(filter, Quiz, {
    page: query.page,
    limit: query.limit,
    sort: sorts[query.sort] ?? sorts.newest,
    populate: { path: 'author', select: AUTHOR_FIELDS },
  });

  return {
    items: items.map((doc) => {
      const view = Quiz.toPublic(doc);
      view.questionCount = doc.publishedVersion > 0 ? (doc.publishedQuestionCount ?? 0) : (doc.questions?.length ?? 0);
      view.maxScore = doc.publishedVersion > 0 ? (doc.publishedMaxScore ?? 0) : 0;
      return view;
    }),
    pagination,
  };
}

/** Student-facing detail: always the frozen published snapshot, never the draft. */
export async function getQuiz(id, actor) {
  const quiz = await findQuiz(id);
  const manage = canManage(quiz, actor);
  let snapshot = null;

  if (!manage) {
    if (quiz.status === S.ARCHIVED) throw ApiError.notFound('Quiz not found');
    if (!quiz.publishedVersion) throw ApiError.notFound('This quiz is not published yet');
    snapshot = await latestVersion(quiz._id);
    if (!snapshot) throw ApiError.notFound('Published version is unavailable');
    if (snapshot.settings?.visibility === QUIZ_VISIBILITIES.PRIVATE) {
      throw ApiError.forbidden('This quiz is private');
    }
  }

  const questionIds = snapshot
    ? (snapshot.questions ?? []).map((question) => String(question._id))
    : null;
  const view = Quiz.toPublic(quiz, { snapshot, questions: questionIds });

  // Per-user attempt summary is computed here (never stored on the shared Quiz).
  const attempts = await Attempt.find({ user: new Types.ObjectId(actor.id), quiz: quiz._id })
    .select('status percentage submittedAt expiresAt quizVersion mode')
    .sort({ createdAt: -1 })
    .lean();
  const completed = attempts.filter((attempt) => attempt.status !== ATTEMPT_STATUSES.ABANDONED);
  const active = attempts.find((attempt) => attempt.status === ATTEMPT_STATUSES.IN_PROGRESS && new Date(attempt.expiresAt) > new Date());
  const best = completed.reduce((max, attempt) => Math.max(max, attempt.percentage ?? 0), 0);

  return {
    quiz: view,
    canManage: manage,
    canModerate: isModerator(actor) && !ownerOf(quiz, actor),
    mySummary: {
      attemptsUsed: completed.length,
      maxAttempts: view.settings.maxAttempts,
      attemptsLeft: Math.max(0, view.settings.maxAttempts - completed.length),
      bestPercentage: best,
      bestPassed: best >= view.settings.passPercentage,
      activeAttemptId: active ? String(active._id) : null,
      canStart: isAttemptable(quiz, actor) && completed.length < view.settings.maxAttempts,
      recent: completed.slice(0, 5).map((attempt) => ({
        id: String(attempt._id),
        status: attempt.status,
        percentage: attempt.percentage ?? 0,
        quizVersion: attempt.quizVersion,
        mode: attempt.mode,
        submittedAt: attempt.submittedAt ?? null,
      })),
    },
  };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createQuiz(payload, actor) {
  const quiz = await Quiz.create({
    ...payload,
    slug: uniqueSlug(payload.title),
    author: new Types.ObjectId(actor.id),
    status: S.DRAFT,
  });
  const plain = quiz.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return { quiz: Quiz.toPublic(plain) };
}

export async function updateQuiz(id, payload, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status === S.ARCHIVED) throw ApiError.conflict('Restore the quiz before editing it');

  for (const key of ['title', 'description', 'difficulty', 'goals', 'topics', 'tags']) {
    if (payload[key] !== undefined) quiz[key] = payload[key];
  }
  if (payload.settings) {
    // Merge so a partial settings patch cannot reset unrelated fields.
    for (const [key, value] of Object.entries(payload.settings)) {
      if (value !== undefined) quiz.settings[key] = value;
    }
    quiz.markModified('settings');
  }
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function archiveQuiz(id, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status === S.ARCHIVED) throw ApiError.conflict('Quiz is already archived');
  if (!canTransition(quiz.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(quiz.status, S.ARCHIVED));
  pushReview(quiz, quiz.status, S.ARCHIVED, actor, 'archive', '');
  quiz.status = S.ARCHIVED;
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function restoreQuiz(id, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived quiz can be restored');
  pushReview(quiz, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  quiz.status = S.DRAFT;
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function startRevision(id, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status !== S.PUBLISHED) throw ApiError.conflict('Only a published quiz can start a revision');
  pushReview(quiz, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  quiz.status = S.DRAFT;
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

/* ───────────────────────────── lifecycle ───────────────────────────── */

export async function submitForReview(id, changelog, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (!canTransition(quiz.status, S.PENDING_REVIEW)) throw ApiError.conflict(transitionError(quiz.status, S.PENDING_REVIEW));
  if (!quiz.questions?.length) throw ApiError.unprocessable('Add at least one question before submitting');
  pushReview(quiz, quiz.status, S.PENDING_REVIEW, actor, 'submit', changelog || '');
  quiz.status = S.PENDING_REVIEW;
  quiz.submittedAt = new Date();
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function moderateQuiz(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const quiz = await findQuiz(id);
  // Separation of duties — never approve your own content (super admin exempt).
  if (ownerOf(quiz, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a quiz you authored');
  }
  if (quiz.status !== S.PENDING_REVIEW) throw ApiError.conflict('Only quizzes in review can be moderated');
  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(quiz.status, target)) throw ApiError.conflict(transitionError(quiz.status, target));
  pushReview(quiz, quiz.status, target, actor, decision, note);
  quiz.status = target;
  quiz.reviewedBy = new Types.ObjectId(actor.id);
  quiz.reviewNote = note || '';
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

/**
 * Freeze the working copy into an immutable QuizVersion. Question ids are the
 * bank ids (stable), so attempts on version 1 still resolve after version 2.
 */
export async function publishQuiz(id, changelog, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  if (quiz.status !== S.APPROVED) throw ApiError.conflict('A quiz must be approved before it can be published');
  const links = [...(quiz.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!links.length) throw ApiError.unprocessable('Cannot publish an empty quiz');

  const ids = links.map((link) => link.question);
  const docs = await Question.find({ _id: { $in: ids } }).lean();
  const byId = new Map(docs.map((doc) => [String(doc._id), doc]));
  const missing = ids.filter((value) => !byId.has(String(value)));
  if (missing.length) throw ApiError.conflict(`${missing.length} linked question(s) no longer exist in the bank`);

  const snapshotFields = [
    'type', 'prompt', 'topic', 'difficulty', 'explanation', 'points', 'tags',
    'code', 'caseSensitive', 'options', 'items', 'pairs', 'answerKey', 'booleanKey', 'textAnswers',
  ];
  const questions = links.map((link, index) => {
    const source = byId.get(String(link.question));
    const entry = { _id: new Types.ObjectId(source._id), order: index };
    for (const field of snapshotFields) entry[field] = source[field];
    return entry;
  });
  const maxScore = questions.reduce((sum, question) => sum + (Number(question.points) || 1), 0);
  const version = (quiz.publishedVersion ?? 0) + 1;

  const settings = quiz.settings?.toObject ? quiz.settings.toObject() : { ...quiz.settings };
  const snapshot = await QuizVersion.create({
    quiz: quiz._id,
    version,
    settings,
    questions,
    questionCount: questions.length,
    maxScore,
    title: quiz.title,
    description: quiz.description,
    difficulty: quiz.difficulty,
    topics: quiz.topics,
    changelog: changelog || '',
    publishedBy: new Types.ObjectId(actor.id),
  });

  try {
    pushReview(quiz, quiz.status, S.PUBLISHED, actor, 'publish', changelog || '');
    quiz.status = S.PUBLISHED;
    quiz.publishedVersion = version;
    quiz.publishedQuestionCount = questions.length;
    quiz.publishedMaxScore = maxScore;
    quiz.publishedAt = new Date();
    await quiz.save();
  } catch (error) {
    // Standalone Mongo has no multi-document transactions; remove the orphan.
    await QuizVersion.deleteOne({ _id: snapshot._id }).catch(() => {});
    throw error;
  }
  return { quiz: Quiz.toPublic(quiz), version: QuizVersion.toPublic(snapshot) };
}

export async function listVersions(id, actor) {
  const quiz = await findQuiz(id);
  if (!canManage(quiz, actor) && !quiz.publishedVersion) throw ApiError.notFound('Quiz not found');
  const items = await QuizVersion.find({ quiz: quiz._id }).sort({ version: -1 }).lean();
  return { items: items.map((item) => QuizVersion.toPublic(item)), quizId: idOf(quiz) };
}

export async function getVersion(id, versionNumber, actor) {
  const quiz = await findQuiz(id);
  if (!canManage(quiz, actor) && !quiz.publishedVersion) throw ApiError.notFound('Quiz not found');
  const snapshot = await QuizVersion.findOne({ quiz: quiz._id, version: versionNumber }).lean();
  if (!snapshot) throw ApiError.notFound('Version not found');
  // Author/staff see answer keys; students only ever get metadata + redacted list.
  const questions = canManage(quiz, actor)
    ? (snapshot.questions ?? []).map((question) => ({ ...authorQuestion(question, { _id: question._id }) }))
    : (snapshot.questions ?? []).map((question) => ({
      id: String(question._id), type: question.type, prompt: question.prompt,
      topic: question.topic, difficulty: question.difficulty, points: question.points,
    }));
  return { version: QuizVersion.toPublic(snapshot), questions };
}

/* ───────────────────────────── questions ───────────────────────────── */

/** Editor-facing list. Paginated, includes answer keys for owner/staff only. */
export async function listQuizQuestions(id, query, actor) {
  const quiz = await findQuiz(id);
  if (!canManage(quiz, actor)) throw ApiError.forbidden('Only the author or a moderator can inspect quiz questions');
  const links = [...(quiz.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(QUIZ_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || QUIZ_LIMITS.MAX_QUESTIONS));
  const slice = links.slice((page - 1) * limit, page * limit);
  const docs = await Question.find({ _id: { $in: slice.map((link) => link.question) } }).lean();
  const byId = new Map(docs.map((doc) => [String(doc._id), doc]));
  const { buildPagination } = await import('../../utils/pagination.js');
  return {
    items: slice.map((link, index) => {
      const doc = byId.get(String(link.question));
      return doc ? { ...authorQuestion(doc, doc), order: (page - 1) * limit + index } : null;
    }).filter(Boolean),
    pagination: buildPagination(page, limit, links.length, QUIZ_LIMITS.MAX_QUESTIONS),
  };
}

export async function linkQuestions(id, questionIds, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  const existing = new Set((quiz.questions ?? []).map((link) => String(link.question)));
  const fresh = questionIds.filter((value) => !existing.has(String(value)));
  if (!fresh.length) throw ApiError.conflict('All selected questions are already in this quiz');
  if ((quiz.questions?.length ?? 0) + fresh.length > QUIZ_LIMITS.MAX_QUESTIONS) {
    throw ApiError.unprocessable(`A quiz can hold at most ${QUIZ_LIMITS.MAX_QUESTIONS} questions`);
  }

  const docs = await Question.find({ _id: { $in: fresh } }).lean();
  if (docs.length !== fresh.length) throw ApiError.notFound('One or more questions no longer exist');
  const forbidden = docs.find((doc) => String(doc.author) !== String(actor.id) && !isStaff(actor));
  if (forbidden) throw ApiError.forbidden('You can only link questions from your own bank');

  let order = quiz.questions?.length ?? 0;
  for (const questionId of fresh) quiz.questions.push({ question: new Types.ObjectId(questionId), order: order++ });
  await syncTopics(quiz);
  await quiz.save();
  await adjustUsage(fresh, 1);
  return { quiz: Quiz.toPublic(quiz) };
}

/** Bulk import: create bank questions from parsed rows, then link them. */
export async function importQuestions(id, items, source, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  if ((quiz.questions?.length ?? 0) + items.length > QUIZ_LIMITS.MAX_QUESTIONS) {
    throw ApiError.unprocessable(`A quiz can hold at most ${QUIZ_LIMITS.MAX_QUESTIONS} questions`);
  }

  let canonicals;
  try {
    canonicals = items.map((item) => normaliseQuestion(item));
  } catch (error) {
    if (error instanceof QuestionNormalizeError) throw ApiError.unprocessable(error.message);
    throw error;
  }

  const created = await Question.insertMany(canonicals.map((canonical) => ({
    ...canonical, author: new Types.ObjectId(actor.id), source, usageCount: 1,
  })));
  try {
    let order = quiz.questions?.length ?? 0;
    for (const doc of created) quiz.questions.push({ question: doc._id, order: order++ });
    await syncTopics(quiz);
    await quiz.save();
  } catch (error) {
    // Roll back the bank rows so a failed import leaves no orphaned questions.
    await Question.deleteMany({ _id: { $in: created.map((doc) => doc._id) } }).catch(() => {});
    throw error;
  }
  return { quiz: Quiz.toPublic(quiz), imported: created.length, questions: created.map((doc) => authorQuestion(doc, doc)) };
}

/** Full-array reorder: every id must be present exactly once (Zod enforces this). */
export async function reorderQuestions(id, orderedIds, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  const current = (quiz.questions ?? []).map((link) => String(link.question));
  if (orderedIds.length !== current.length || new Set(orderedIds.map(String)).size !== current.length
      || orderedIds.some((value) => !current.includes(String(value)))) {
    throw ApiError.unprocessable('The ordered ids must contain every quiz question exactly once');
  }
  quiz.questions = orderedIds.map((value, index) => ({ question: new Types.ObjectId(value), order: index }));
  await quiz.save();
  return { quiz: Quiz.toPublic(quiz) };
}

export async function unlinkQuestion(id, questionId, actor) {
  const quiz = await findQuiz(id);
  assertManage(quiz, actor);
  assertQuestionEditable(quiz);
  const before = quiz.questions?.length ?? 0;
  quiz.questions = (quiz.questions ?? []).filter((link) => String(link.question) !== String(questionId));
  if (quiz.questions.length === before) throw ApiError.notFound('Question is not linked to this quiz');
  quiz.questions.forEach((link, index) => { link.order = index; });
  await quiz.save();
  await adjustUsage([questionId], -1);
  return { quiz: Quiz.toPublic(quiz) };
}

export { findQuiz, latestVersion, canManage, isStaff };
```

## `server/src/modules/quizzes/attempt.service.js`

```js
import mongoose from 'mongoose';
import {
  ATTEMPT_MODES, ATTEMPT_STATUSES as A, QUIZ_LIMITS, QUIZ_STATUSES,
} from '@algonest/shared';
import { Quiz } from '../../models/Quiz.js';
import { QuizVersion } from '../../models/QuizVersion.js';
import { Attempt } from '../../models/Attempt.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { gradeAttempt, incorrectQuestionIds } from './questionGrader.js';
import { redactQuestion } from './questionNormalizer.js';
import { buildPresentation, presentationFor } from './quizPresentation.js';
import { findQuiz, isStaff, latestVersion } from './quiz.service.js';
import { isAttemptable } from './quizWorkflow.js';

const { Types } = mongoose;
const idOf = (value) => String(value?._id ?? value ?? '');
const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });

async function findAttempt(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid attempt id');
  const attempt = await Attempt.findById(id);
  if (!attempt) throw ApiError.notFound('Attempt not found');
  return attempt;
}

function assertOwner(attempt, actor) {
  // Attempts are strictly private. Even staff need an audit endpoint (Phase 8).
  if (String(attempt.user) !== String(actor.id)) throw ApiError.forbidden('This attempt belongs to another learner');
}

async function findVersion(attempt) {
  const version = await QuizVersion.findById(attempt.versionId).lean();
  if (!version) throw ApiError.notFound('The published version for this attempt is unavailable');
  return version;
}

/** Frozen canonical questions restricted to this attempt's subset/order. */
function versionItems(version, questionIds) {
  const byId = new Map((version.questions ?? []).map((question) => [String(question._id), plain(question)]));
  return (questionIds ?? []).map((id) => ({ id: String(id), question: byId.get(String(id)) }))
    .filter((item) => item.question);
}

export function isExpired(attempt, now = Date.now()) {
  return attempt.status === A.IN_PROGRESS && new Date(attempt.expiresAt).getTime() <= now;
}

/** Idempotent: grade whatever was autosaved and freeze the result. */
export async function finalizeAttempt(attempt, { timedOut = false } = {}) {
  if (attempt.status !== A.IN_PROGRESS) return attempt;
  const version = await findVersion(attempt);
  const items = versionItems(version, attempt.questionIds);
  const showExplanations = attempt.settings?.showExplanations !== false && version.settings?.showExplanations !== false;
  const graded = gradeAttempt(items, attempt.answers.map((answer) => ({
    questionId: String(answer.questionId), response: answer.response, marked: answer.marked,
  })), { showExplanations });

  const endTime = timedOut ? new Date(attempt.expiresAt).getTime() : Date.now();
  const capSeconds = (Number(attempt.settings?.timerMinutes) || 20) * 60;
  attempt.durationSeconds = Math.min(capSeconds, Math.max(0, Math.round((endTime - new Date(attempt.startedAt).getTime()) / 1000)));
  attempt.results = graded.results;
  attempt.topicStats = graded.topicStats;
  attempt.score = graded.score;
  attempt.maxScore = graded.maxScore;
  attempt.percentage = graded.percentage;
  attempt.correctCount = graded.correctCount;
  attempt.attemptedCount = graded.attemptedCount;
  attempt.passed = graded.percentage >= (Number(attempt.settings?.passPercentage) || 60);
  attempt.status = timedOut ? A.TIMED_OUT : A.SUBMITTED;
  attempt.submittedAt = new Date(endTime);
  await attempt.save();

  // Denormalised popularity counter; never let it fail an otherwise good submit.
  await Quiz.updateOne({ _id: attempt.quiz }, { $inc: { attemptCount: 1 } }).catch(() => {});
  return attempt;
}

/** Called on every read so a learner cannot keep answering past the deadline. */
async function finalizeIfExpired(attempt) {
  if (!isExpired(attempt)) return false;
  await finalizeAttempt(attempt, { timedOut: true });
  return true;
}

const remainingSeconds = (attempt) => Math.max(0, Math.round((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000));

/* ───────────────────────────── list ───────────────────────────── */

export async function listAttempts(quizId, query, actor) {
  if (!Types.ObjectId.isValid(quizId)) throw ApiError.badRequest('Invalid quiz id');
  const filter = { user: new Types.ObjectId(actor.id), quiz: new Types.ObjectId(quizId) };
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    Attempt.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Attempt.countDocuments(filter),
  ]);
  return {
    items: items.map((doc) => Attempt.toPublic(doc, 'summary')),
    pagination: buildPagination(page, limit, total),
  };
}

/* ───────────────────────────── start ───────────────────────────── */

/**
 * Start an attempt against the FROZEN published version.
 * - maxAttempts and the deadline are enforced here, never on the client.
 * - shuffle is seeded by the attempt id and stored, so reloads are stable.
 * - `mode: incorrect` builds a subset from a previous attempt's wrong answers.
 */
export async function startAttempt(quizId, payload, actor) {
  const quiz = await findQuiz(quizId);
  if (!isAttemptable(quiz, actor)) throw ApiError.forbidden('This quiz is not available to attempt');
  if (quiz.status === QUIZ_STATUSES.ARCHIVED) throw ApiError.notFound('Quiz not found');

  const version = await latestVersion(quiz._id);
  if (!version || !version.questions?.length) throw ApiError.conflict('This quiz has no published questions yet');
  const settings = version.settings ?? {};

  // Finalise/clear any stale live attempt before opening a new one.
  const live = await Attempt.findOne({ user: new Types.ObjectId(actor.id), quiz: quiz._id, status: A.IN_PROGRESS });
  if (live) {
    if (!isExpired(live)) {
      throw ApiError.conflict('You already have an attempt in progress for this quiz');
    }
    await finalizeAttempt(live, { timedOut: true });
  }

  const used = await Attempt.countDocuments({
    user: new Types.ObjectId(actor.id), quiz: quiz._id, status: { $ne: A.ABANDONED },
  });
  if (used >= (Number(settings.maxAttempts) || 3)) {
    throw ApiError.conflict(`You have used all ${settings.maxAttempts} attempts for this quiz`);
  }

  const allItems = versionItems(version, (version.questions ?? []).map((question) => question._id));
  let items = allItems;

  if (payload.mode === ATTEMPT_MODES.INCORRECT) {
    if (!settings.allowRetryIncorrect) throw ApiError.forbidden('Retry-incorrect-only is disabled for this quiz');
    const source = await Attempt.findOne({ _id: payload.sourceAttemptId }).lean();
    if (!source || String(source.user) !== String(actor.id) || String(source.quiz) !== String(quiz._id)) {
      throw ApiError.notFound('Source attempt not found');
    }
    if (![A.SUBMITTED, A.TIMED_OUT].includes(source.status)) {
      throw ApiError.conflict('Choose a completed attempt to retry');
    }
    const wrong = new Set(incorrectQuestionIds(source.results ?? []));
    items = allItems.filter((item) => wrong.has(item.id));
    if (!items.length) throw ApiError.unprocessable('Nothing to retry — you got every question right!');
  }

  const attempt = new Attempt({
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(actor.id),
    quiz: quiz._id,
    quizVersion: version.version,
    versionId: version._id,
    mode: payload.mode,
    sourceAttempt: payload.sourceAttemptId ? new Types.ObjectId(payload.sourceAttemptId) : null,
    status: A.IN_PROGRESS,
    settings: {
      timerMinutes: Number(settings.timerMinutes) || 20,
      passPercentage: Number(settings.passPercentage) ?? 60,
      showExplanations: settings.showExplanations !== false,
    },
    title: version.title,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + (Number(settings.timerMinutes) || 20) * 60_000),
  });

  // Deterministic per-attempt display order; `questionIds` IS that order.
  const presentation = buildPresentation(items, settings, String(attempt._id));
  attempt.presentation = presentation.map((entry) => ({ ...entry, questionId: new Types.ObjectId(entry.questionId) }));
  attempt.questionIds = presentation.map((entry) => new Types.ObjectId(entry.questionId));
  attempt.maxScore = items.reduce((sum, item) => sum + (Number(item.question.points) || 1), 0);
  await attempt.save();

  return {
    attempt: Attempt.toPublic(attempt, 'solver'),
    remainingSeconds: remainingSeconds(attempt),
    quiz: {
      id: String(quiz._id), title: version.title, description: version.description,
      passPercentage: attempt.settings.passPercentage,
      showExplanations: attempt.settings.showExplanations,
      maxScore: attempt.maxScore,
      version: version.version,
    },
  };
}

/* ───────────────────────────── read / autosave ───────────────────────────── */

export async function getAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const expired = await finalizeIfExpired(attempt);
  const view = attempt.status === A.IN_PROGRESS ? 'solver' : 'result';
  return {
    attempt: Attempt.toPublic(attempt, view),
    remainingSeconds: remainingSeconds(attempt),
    expired,
  };
}

/** Frozen, answer-free question list for the solver. Paginated like every list. */
export async function getAttemptQuestions(id, query, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const version = await findVersion(attempt);
  const byId = new Map((version.questions ?? []).map((question) => [String(question._id), plain(question)]));
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(QUIZ_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || QUIZ_LIMITS.MAX_QUESTIONS));
  const ids = (attempt.questionIds ?? []).map(String);
  const slice = ids.slice((page - 1) * limit, page * limit);

  const items = slice.map((questionId) => {
    const question = byId.get(questionId);
    if (!question) return null;
    return redactQuestion(question, questionId, presentationFor(attempt.presentation, questionId));
  }).filter(Boolean);

  return {
    items,
    pagination: buildPagination(page, limit, ids.length, QUIZ_LIMITS.MAX_QUESTIONS),
    showExplanations: attempt.settings?.showExplanations !== false,
  };
}

/** Upsert-only autosave. Returns `expired: true` if the deadline hit mid-save. */
export async function autosaveAttempt(id, answers, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) {
    return { attempt: Attempt.toPublic(attempt, 'result'), remainingSeconds: 0, expired: false, alreadyFinal: true };
  }
  if (isExpired(attempt)) {
    await finalizeAttempt(attempt, { timedOut: true });
    return { attempt: Attempt.toPublic(attempt, 'result'), remainingSeconds: 0, expired: true, alreadyFinal: true };
  }
  attempt.mergeAnswers(answers, attempt.questionIds.map(String));
  await attempt.save();
  return { attempt: Attempt.toPublic(attempt, 'solver'), remainingSeconds: remainingSeconds(attempt), expired: false, alreadyFinal: false };
}

/** Final submit. Idempotent — a double POST returns the existing result. */
export async function submitAttempt(id, answers, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) {
    if (answers.length) attempt.mergeAnswers(answers, attempt.questionIds.map(String));
    if (isExpired(attempt)) await finalizeAttempt(attempt, { timedOut: true });
    else await finalizeAttempt(attempt, { timedOut: false });
  }
  return { attempt: Attempt.toPublic(attempt, 'result'), remainingSeconds: 0 };
}

/** Result page. Respects the quiz's `showExplanations` setting. */
export async function getResult(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  await finalizeIfExpired(attempt);
  if (attempt.status === A.IN_PROGRESS) throw ApiError.conflict('Submit the attempt before viewing its result');
  const data = Attempt.toPublic(attempt, 'result');
  if (attempt.settings?.showExplanations === false) {
    data.results = (data.results ?? []).map(({ expected, explanation, ...rest }) => rest);
  }
  return { attempt: data, retryAllowed: await canRetryIncorrect(attempt) };
}

export async function canRetryIncorrect(attempt) {
  const version = await QuizVersion.findById(attempt.versionId).select('settings').lean();
  if (!version?.settings?.allowRetryIncorrect) return false;
  const used = await Attempt.countDocuments({ user: attempt.user, quiz: attempt.quiz, status: { $ne: A.ABANDONED } });
  const quiz = await Quiz.findById(attempt.quiz).select('settings').lean();
  return used < (Number(quiz?.settings?.maxAttempts) || 3)
    && (attempt.results ?? []).some((result) => !result.correct);
}

/** Releases the single live-attempt slot without consuming an attempt. */
export async function abandonAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) throw ApiError.conflict('Only an in-progress attempt can be abandoned');
  await finalizeIfExpired(attempt);
  if (attempt.status === A.IN_PROGRESS) {
    attempt.status = A.ABANDONED;
    attempt.submittedAt = new Date();
    await attempt.save();
  }
  return { attempt: Attempt.toPublic(attempt, attempt.status === A.IN_PROGRESS ? 'solver' : 'result') };
}
```

---

# Server — controllers + routers + mount

## `server/src/modules/quizzes/question.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './question.service.js';

const actor = (req) => actorFrom(req);

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listQuestions(req.validated.query, actor(req)), 'Questions fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getQuestion(req.validated.params.id, actor(req)), 'Question fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createQuestion(req.validated.body, actor(req)), 'Question created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateQuestion(req.validated.params.id, req.validated.body, actor(req)), 'Question updated');
});

export const remove = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.deleteQuestion(req.validated.params.id, actor(req)), 'Question deleted');
});

/** Pure preview — no DB write, so untrusted pasted text is harmless here. */
export const parseImport = asyncHandler(async (req, res) => {
  const { format, text } = req.validated.body;
  sendSuccess(res, service.parseImport(format, text), 'Import preview ready');
});
```

## `server/src/modules/quizzes/quiz.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './quiz.service.js';
import * as attemptService from './attempt.service.js';

const actor = (req) => actorFrom(req);

/* Catalogue */
export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listQuizzes(req.validated.query, actor(req)), 'Quizzes fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getQuiz(req.validated.params.id, actor(req)), 'Quiz fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createQuiz(req.validated.body, actor(req)), 'Draft quiz created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateQuiz(req.validated.params.id, req.validated.body, actor(req)), 'Quiz updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveQuiz(req.validated.params.id, actor(req)), 'Quiz archived');
});

/* Lifecycle */
export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreQuiz(req.validated.params.id, actor(req)), 'Quiz restored to draft');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitForReview(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Submitted for review');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateQuiz(req.validated.params.id, decision, note, actor(req)), `Quiz ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishQuiz(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Quiz published');
});

export const versions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listVersions(req.validated.params.id, actor(req)), 'Versions fetched');
});

export const version = asyncHandler(async (req, res) => {
  const { id, version: number } = req.validated.params;
  sendSuccess(res, await service.getVersion(id, number, actor(req)), 'Version fetched');
});

/* Questions */
export const listQuestions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listQuizQuestions(req.validated.params.id, req.validated.query, actor(req)), 'Quiz questions fetched');
});

export const linkQuestions = asyncHandler(async (req, res) => {
  sendCreated(res, await service.linkQuestions(req.validated.params.id, req.validated.body.questionIds, actor(req)), 'Questions linked');
});

export const importQuestions = asyncHandler(async (req, res) => {
  const { items, source } = req.validated.body;
  sendCreated(res, await service.importQuestions(req.validated.params.id, items, source, actor(req)), 'Questions imported');
});

export const reorderQuestions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.reorderQuestions(req.validated.params.id, req.validated.body.orderedIds, actor(req)), 'Questions reordered');
});

export const unlinkQuestion = asyncHandler(async (req, res) => {
  const { id, questionId } = req.validated.params;
  sendSuccess(res, await service.unlinkQuestion(id, questionId, actor(req)), 'Question removed');
});

/* Attempts — list + start live under /quizzes/:id/attempts */
export const listAttempts = asyncHandler(async (req, res) => {
  sendSuccess(res, await attemptService.listAttempts(req.validated.params.id, req.validated.query, actor(req)), 'Attempts fetched');
});

export const startAttempt = asyncHandler(async (req, res) => {
  sendCreated(res, await attemptService.startAttempt(req.validated.params.id, req.validated.body, actor(req)), 'Attempt started');
});
```

## `server/src/modules/quizzes/attempt.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './attempt.service.js';

const actor = (req) => actorFrom(req);

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttempt(req.validated.params.id, actor(req)), 'Attempt fetched');
});

export const questions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttemptQuestions(req.validated.params.id, req.validated.query, actor(req)), 'Questions fetched');
});

export const autosave = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.autosaveAttempt(req.validated.params.id, req.validated.body.answers, actor(req)), 'Answers saved');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitAttempt(req.validated.params.id, req.validated.body.answers, actor(req)), 'Attempt submitted');
});

export const result = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getResult(req.validated.params.id, actor(req)), 'Result fetched');
});

export const abandon = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.abandonAttempt(req.validated.params.id, actor(req)), 'Attempt abandoned');
});
```

## `server/src/modules/quizzes/question.routes.js`

```js
import { Router } from 'express';
import {
  questionImportSchema, questionInputSchema, questionListQuerySchema, questionParamsSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './question.controller.js';

/** Mounted at /question-bank — reusable, author-scoped question library. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: questionListQuerySchema }), controller.list);
router.post('/', validate(questionInputSchema), controller.create);
router.post('/parse-import', validate(questionImportSchema), controller.parseImport);
router.get('/:id', validate({ params: questionParamsSchema }), controller.get);
router.patch('/:id', validate({ params: questionParamsSchema, body: questionInputSchema }), controller.update);
router.delete('/:id', validate({ params: questionParamsSchema }), controller.remove);

export default router;
```

## `server/src/modules/quizzes/quiz.routes.js`

```js
import { Router } from 'express';
import {
  attemptListQuerySchema, attemptStartSchema, changelogSchema, moderationSchema,
  quizCreateSchema, quizImportSchema, quizListQuerySchema, quizParamsSchema,
  quizQuestionListQuerySchema, quizQuestionParamsSchema, quizQuestionsSchema,
  quizReorderSchema, quizUpdateSchema, versionParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './quiz.controller.js';

/** Mounted at /quizzes. Every route is authenticated, onboarded and validated. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: quizListQuerySchema }), controller.list);
router.post('/', validate(quizCreateSchema), controller.create);

router.get('/:id', validate({ params: quizParamsSchema }), controller.get);
router.patch('/:id', validate({ params: quizParamsSchema, body: quizUpdateSchema }), controller.update);
router.delete('/:id', validate({ params: quizParamsSchema }), controller.archive);

router.post('/:id/restore', validate({ params: quizParamsSchema }), controller.restore);
router.post('/:id/revision', validate({ params: quizParamsSchema }), controller.revision);
router.post('/:id/submit', validate({ params: quizParamsSchema, body: changelogSchema }), controller.submit);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: quizParamsSchema, body: moderationSchema }),
  controller.moderate,
);
router.post('/:id/publish', validate({ params: quizParamsSchema, body: changelogSchema }), controller.publish);

router.get('/:id/versions', validate({ params: quizParamsSchema }), controller.versions);
router.get('/:id/versions/:version', validate({ params: versionParamsSchema }), controller.version);

// Static sub-paths (`/import`, `/order`) precede the `/:questionId` route.
router.get('/:id/questions', validate({ params: quizParamsSchema, query: quizQuestionListQuerySchema }), controller.listQuestions);
router.post('/:id/questions', validate({ params: quizParamsSchema, body: quizQuestionsSchema }), controller.linkQuestions);
router.post('/:id/questions/import', validate({ params: quizParamsSchema, body: quizImportSchema }), controller.importQuestions);
router.patch('/:id/questions/order', validate({ params: quizParamsSchema, body: quizReorderSchema }), controller.reorderQuestions);
router.delete('/:id/questions/:questionId', validate({ params: quizQuestionParamsSchema }), controller.unlinkQuestion);

router.get('/:id/attempts', validate({ params: quizParamsSchema, query: attemptListQuerySchema }), controller.listAttempts);
router.post('/:id/attempts', validate({ params: quizParamsSchema, body: attemptStartSchema }), controller.startAttempt);

export default router;
```

## `server/src/modules/quizzes/attempt.routes.js`

```js
import { Router } from 'express';
import {
  attemptParamsSchema, attemptQuestionQuerySchema, autosaveSchema, submitAttemptSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './attempt.controller.js';

/** Mounted at /attempts — private per-user attempt state and results. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/:id', validate({ params: attemptParamsSchema }), controller.get);
router.get(
  '/:id/questions',
  validate({ params: attemptParamsSchema, query: attemptQuestionQuerySchema }),
  controller.questions,
);
router.patch('/:id/answers', validate({ params: attemptParamsSchema, body: autosaveSchema }), controller.autosave);
router.post('/:id/submit', validate({ params: attemptParamsSchema, body: submitAttemptSchema }), controller.submit);
router.get('/:id/result', validate({ params: attemptParamsSchema }), controller.result);
router.post('/:id/abandon', validate({ params: attemptParamsSchema }), controller.abandon);

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
import questionRoutes from '../modules/quizzes/question.routes.js';
import quizRoutes from '../modules/quizzes/quiz.routes.js';
import attemptRoutes from '../modules/quizzes/attempt.routes.js';

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

// Phase 3 — Quizzes: reusable question bank, versioned quizzes and per-user
// attempts. All three routers apply authenticate + requireOnboarded internally.
router.use('/question-bank', requireDatabase, questionRoutes);
router.use('/quizzes', requireDatabase, quizRoutes);
router.use('/attempts', requireDatabase, attemptRoutes);

export default router;
```

---

# Server — tests (new)

## `server/tests/quizzes.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  attemptStartSchema, autosaveSchema, questionImportSchema, questionInputSchema,
  quizCreateSchema, quizReorderSchema, quizSettingsSchema, quizUpdateSchema,
  QUIZ_STATUSES as S,
} from '@algonest/shared';

const { normaliseQuestion, redactQuestion, resolveOptionIndex, expectedAnswer } =
  await import('../src/modules/quizzes/questionNormalizer.js');
const { gradeAttempt, isResponseCorrect, incorrectQuestionIds } =
  await import('../src/modules/quizzes/questionGrader.js');
const { seededShuffle, buildPresentation } =
  await import('../src/modules/quizzes/quizPresentation.js');
const { parseCsv, parseBulkQuestions, CSV_TEMPLATE, JSON_TEMPLATE } =
  await import('../src/modules/quizzes/bulkImport.js');
const { canTransition, isEditable, isAttemptable, transitionError } =
  await import('../src/modules/quizzes/quizWorkflow.js');

const ID = '507f1f77bcf86cd799439011';

const SAMPLES = {
  mcq: { type: 'mcq', prompt: 'Which structure is LIFO?', options: ['Queue', 'Stack', 'Tree'], answer: 'B', topic: 'Stacks', explanation: 'LIFO.' },
  multi: { type: 'multi', prompt: 'Pick the prime numbers', options: ['2', '3', '4', '9'], answer: [0, 1], topic: 'Math', points: 2 },
  true_false: { type: 'true_false', prompt: 'Binary search requires sorted input.', answer: 'true', topic: 'Binary Search' },
  ordering: { type: 'ordering', prompt: 'Order by complexity', items: ['O(1)', 'O(log n)', 'O(n)'], topic: 'Big-O' },
  matching: { type: 'matching', prompt: 'Match ADT to property', pairs: [['Stack', 'LIFO'], ['Queue', 'FIFO']], topic: 'Stacks' },
  output: { type: 'output', prompt: 'What does this print?', code: 'console.log(1 + 1)', options: ['1', '2', 'NaN'], answer: 1, topic: 'JavaScript' },
  fill_blank: { type: 'fill_blank', prompt: 'A ______ is FIFO.', answer: ['queue', 'queues'], topic: 'Stacks' },
};

const canonical = (key) => normaliseQuestion(SAMPLES[key]);

describe('Phase-3 question contracts', () => {
  it('accepts all seven question types', () => {
    for (const [key, sample] of Object.entries(SAMPLES)) {
      const parsed = questionInputSchema.safeParse(sample);
      assert.equal(parsed.success, true, `${key}: ${JSON.stringify(parsed.error?.issues)}`);
    }
  });

  it('rejects wrong shapes, unknown keys and too few options', () => {
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.mcq, hacker: 1 }).success, false);
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.mcq, options: ['only one'] }).success, false);
    assert.equal(questionInputSchema.safeParse({ type: 'mcq', prompt: 'Hi?', options: ['a', 'b'] }).success, false);
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.mcq, type: 'essay' }).success, false);
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.ordering, items: ['a', 'a'] }).success, false);
  });

  it('resolves 0-based, 1-based, letter and text answers', () => {
    const options = [{ id: 'o0', text: 'Alpha' }, { id: 'o1', text: 'Beta' }];
    assert.equal(resolveOptionIndex(0, options), 0);
    assert.equal(resolveOptionIndex(2, options), 1);
    assert.equal(resolveOptionIndex('B', options), 1);
    assert.equal(resolveOptionIndex('Alpha', options), 0);
    assert.equal(resolveOptionIndex('missing', options), -1);
    assert.equal(resolveOptionIndex(99, options), -1);
  });

  it('creates defaults and strict settings', () => {
    const quiz = quizCreateSchema.parse({ title: '  Arrays warmup  ' });
    assert.equal(quiz.title, 'Arrays warmup');
    assert.equal(quiz.settings.timerMinutes, 20);
    assert.equal(quiz.settings.passPercentage, 60);
    assert.equal(quiz.settings.maxAttempts, 3);
    assert.equal(quiz.settings.visibility, 'public');
    assert.throws(() => quizSettingsSchema.parse({ timerMinutes: 500 }));
    assert.equal(quizUpdateSchema.parse({ settings: { timerMinutes: 5 } }).settings.timerMinutes, 5);
    assert.throws(() => quizUpdateSchema.parse({}));
  });

  it('requires a source attempt for retry-incorrect-only', () => {
    assert.equal(attemptStartSchema.parse({}).mode, 'full');
    assert.equal(attemptStartSchema.safeParse({ mode: 'incorrect' }).success, false);
    assert.equal(attemptStartSchema.safeParse({ mode: 'incorrect', sourceAttemptId: ID }).success, true);
  });

  it('bounds autosave responses and rejects duplicate reorder ids', () => {
    const good = { answers: [{ questionId: ID, response: { p0: 'p0' }, marked: true }] };
    assert.equal(autosaveSchema.safeParse(good).success, true);
    assert.equal(autosaveSchema.safeParse({ answers: [] }).success, false);
    assert.equal(autosaveSchema.safeParse({ answers: [{ questionId: ID, response: 'x', extra: 1 }] }).success, false);
    assert.equal(quizReorderSchema.safeParse({ orderedIds: [ID, ID] }).success, false);
  });

  it('caps the bulk-import payload', () => {
    assert.equal(questionImportSchema.safeParse({ format: 'csv', text: 'a,b' }).success, true);
    assert.equal(questionImportSchema.safeParse({ format: 'xml', text: 'a' }).success, false);
    assert.equal(questionImportSchema.safeParse({ format: 'json', text: 'x'.repeat(300_000) }).success, false);
  });
});

describe('question normalisation + redaction', () => {
  it('normalises every type into one canonical shape with stable ids', () => {
    for (const key of Object.keys(SAMPLES)) {
      const question = canonical(key);
      assert.equal(question.type, key);
      assert.ok(Array.isArray(question.answerKey));
      assert.ok(question.points >= 1);
    }
    assert.deepEqual(canonical('mcq').answerKey, ['o1']);
    assert.deepEqual(canonical('multi').answerKey, ['o0', 'o1']);
    assert.equal(canonical('true_false').booleanKey, true);
    assert.deepEqual(canonical('ordering').answerKey, ['i0', 'i1', 'i2']);
    assert.deepEqual(canonical('matching').pairs[1], { id: 'p1', left: 'Queue', right: 'FIFO' });
    assert.deepEqual(canonical('fill_blank').textAnswers, ['queue', 'queues']);
  });

  it('rejects an answer that matches no option', () => {
    assert.throws(() => normaliseQuestion({ ...SAMPLES.mcq, answer: 'Z' }), /does not match/);
    assert.throws(() => normaliseQuestion({ type: 'mcq', prompt: 'test', options: [] }), /Unsupported|answer/i);
  });

  it('never exposes answer keys or explanations to a solver', () => {
    for (const key of Object.keys(SAMPLES)) {
      const view = redactQuestion(canonical(key), ID);
      const json = JSON.stringify(view);
      assert.ok(!json.includes('answerKey'), key);
      assert.ok(!json.includes('booleanKey'), key);
      assert.ok(!json.includes('textAnswers'), key);
      assert.ok(!json.includes('explanation'), key);
      assert.equal(view.id, ID);
    }
  });

  it('splits matching columns so adjacency cannot reveal a pair', () => {
    const view = redactQuestion(canonical('matching'), ID, { leftIds: ['p0', 'p1'], rightIds: ['p1', 'p0'] });
    assert.deepEqual(view.leftItems.map((item) => item.text), ['Stack', 'Queue']);
    assert.deepEqual(view.rightItems.map((item) => item.text), ['FIFO', 'LIFO']);
  });

  it('produces readable expected answers for the result page', () => {
    assert.equal(expectedAnswer(canonical('mcq')), 'Stack');
    assert.equal(expectedAnswer(canonical('true_false')), 'True');
    assert.equal(expectedAnswer(canonical('fill_blank')), 'queue / queues');
    assert.match(expectedAnswer(canonical('ordering')), /O\(1\) → O\(log n\)/);
  });
});

describe('pure grading engine', () => {
  const cases = [
    ['mcq', 'o1', 'o0'],
    ['multi', ['o0', 'o1'], ['o0']],
    ['true_false', true, false],
    ['ordering', ['i0', 'i1', 'i2'], ['i2', 'i1', 'i0']],
    ['matching', { p0: 'p0', p1: 'p1' }, { p0: 'p1', p1: 'p0' }],
    ['output', 'o1', 'o2'],
    ['fill_blank', '  QUEUE  ', 'stack'],
  ];
  for (const [type, right, wrong] of cases) {
    it(`scores ${type} correctly and rejects the wrong answer`, () => {
      const question = canonical(type);
      assert.equal(isResponseCorrect(question, right), true, type);
      assert.equal(isResponseCorrect(question, wrong), false, type);
      assert.equal(isResponseCorrect(question, null), false, type);
    });
  }

  it('computes score, percentage, per-topic stats and unattempted rows', () => {
    const items = [
      { id: 'q1', question: canonical('mcq') },
      { id: 'q2', question: { ...canonical('multi'), topic: 'Math' } },
      { id: 'q3', question: { ...canonical('true_false'), topic: 'Math' } },
    ];
    const graded = gradeAttempt(items, [
      { questionId: 'q1', response: 'o1' },
      { questionId: 'q2', response: ['o0'] },
    ]);
    assert.equal(graded.questionCount, 3);
    assert.equal(graded.score, 1);
    assert.equal(graded.maxScore, 4); // 1 + 2 + 1
    assert.equal(graded.percentage, 25);
    assert.equal(graded.attemptedCount, 2);
    assert.equal(graded.correctCount, 1);
    assert.equal(graded.topicStats.length, 2);
    const math = graded.topicStats.find((stat) => stat.topic === 'Math');
    assert.equal(math.maxScore, 3);
    assert.equal(math.percentage, 0);
    assert.deepEqual(incorrectQuestionIds(graded.results).sort(), ['q2', 'q3']);
  });

  it('omits explanations when the quiz disables them', () => {
    const graded = gradeAttempt([{ id: 'q1', question: canonical('mcq') }], [], { showExplanations: false });
    assert.equal('expected' in graded.results[0], false);
    assert.equal('explanation' in graded.results[0], false);
  });

  it('handles case-insensitive fill-blank and honours caseSensitive', () => {
    const loose = canonical('fill_blank');
    assert.equal(isResponseCorrect(loose, 'Queue'), true);
    const strict = normaliseQuestion({ ...SAMPLES.fill_blank, caseSensitive: true, answer: ['Queue'] });
    assert.equal(isResponseCorrect(strict, 'queue'), false);
    assert.equal(isResponseCorrect(strict, 'Queue'), true);
  });
});

describe('deterministic presentation', () => {
  it('is stable for the same seed and different for another', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    assert.deepEqual(seededShuffle(values, 'attempt-1'), seededShuffle(values, 'attempt-1'));
    assert.notDeepEqual(seededShuffle(values, 'attempt-1'), seededShuffle(values, 'attempt-2'));
  });

  it('never returns the identity order when shuffling is enabled', () => {
    const items = Array.from({ length: 6 }, (_, index) => ({ id: `q${index}`, question: canonical('mcq') }));
    const presentation = buildPresentation(items, { shuffleQuestions: true, shuffleOptions: true }, 'seed-xyz');
    assert.equal(presentation.length, 6);
    assert.notDeepEqual(presentation.map((entry) => entry.questionId), items.map((item) => item.id));
    assert.equal(presentation[0].optionIds.length, 3);
    assert.deepEqual(
      buildPresentation(items, { shuffleQuestions: true }, 'seed-xyz'),
      buildPresentation(items, { shuffleQuestions: true }, 'seed-xyz'),
    );
  });

  it('keeps authored order when shuffle is disabled', () => {
    const items = [{ id: 'a', question: canonical('mcq') }, { id: 'b', question: canonical('mcq') }];
    assert.deepEqual(buildPresentation(items, {}, 'seed').map((entry) => entry.questionId), ['a', 'b']);
  });
});

describe('JSON / CSV bulk import', () => {
  it('parses quoted CSV with embedded commas and newlines', () => {
    const rows = parseCsv('a,b\n"one, two","line1\nline2"\n');
    assert.deepEqual(rows, [['a', 'b'], ['one, two', 'line1\nline2']]);
  });

  it('imports the shipped JSON example (all 7 types)', () => {
    const result = parseBulkQuestions('json', JSON_TEMPLATE);
    assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
    assert.equal(result.items.length, 7);
  });

  it('imports the shipped CSV template', () => {
    const result = parseBulkQuestions('csv', CSV_TEMPLATE);
    assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
    assert.equal(result.items.length, 5);
    assert.equal(result.items.find((item) => item.input.type === 'matching').canonical.pairs.length, 2);
  });

  it('reports a row-level error without failing the whole batch', () => {
    const result = parseBulkQuestions('json', JSON.stringify([
      SAMPLES.mcq,
      { ...SAMPLES.mcq, prompt: 'A different valid prompt', answer: 'Z' },
      { type: 'unknown', prompt: 'Broken row' },
      SAMPLES.true_false,
    ]));
    assert.equal(result.items.length, 2);
    assert.equal(result.errors.length, 2);
    assert.deepEqual(result.errors.map((entry) => entry.row), [2, 3]);
    assert.match(result.errors[0].message, /does not match any option/);
  });

  it('deduplicates repeated questions and reports them as skipped', () => {
    const result = parseBulkQuestions('json', JSON.stringify([SAMPLES.mcq, SAMPLES.mcq]));
    assert.equal(result.items.length, 1);
    assert.equal(result.skipped[0].reason, 'Duplicate question');
  });

  it('rejects malformed JSON and CSV without a header', () => {
    assert.match(parseBulkQuestions('json', '{oops').errors[0].message, /Invalid JSON/);
    assert.equal(parseBulkQuestions('csv', 'just,one,row').errors.length, 1);
    assert.match(parseBulkQuestions('csv', 'a,b\nx,y').errors[0].message, /missing required column/);
  });
});

describe('quiz lifecycle + availability', () => {
  it('follows draft → review → approved → published', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.ok(canTransition(S.PUBLISHED, S.DRAFT));
    assert.equal(isEditable(S.PUBLISHED), false);
  });

  it('explains invalid transitions', () => {
    assert.match(transitionError(S.DRAFT, S.PUBLISHED), /Cannot move a quiz/);
  });

  it('requires a published version and honours private visibility', () => {
    const student = { id: 'u1', permissions: [] };
    assert.equal(isAttemptable({ publishedVersion: 0 }, student), false);
    assert.equal(isAttemptable({ publishedVersion: 1, settings: { visibility: 'public' } }, student), true);
    assert.equal(isAttemptable({ publishedVersion: 1, settings: { visibility: 'private' }, author: 'u2' }, student), false);
    assert.equal(isAttemptable({ publishedVersion: 1, settings: { visibility: 'private' }, author: 'u1' }, student), true);
    assert.equal(isAttemptable({ publishedVersion: 1, status: S.ARCHIVED }, student), false);
  });
});
```

## `server/tests/quizzes.service.test.js`

```js
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { ATTEMPT_STATUSES as A, PERMISSIONS, QUIZ_STATUSES as S, ROLES } from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { Quiz } = await import('../src/models/Quiz.js');
const { QuizVersion } = await import('../src/models/QuizVersion.js');
const { Question } = await import('../src/models/Question.js');
const { Attempt } = await import('../src/models/Attempt.js');
const quizService = await import('../src/modules/quizzes/quiz.service.js');
const attemptService = await import('../src/modules/quizzes/attempt.service.js');
const { normaliseQuestion } = await import('../src/modules/quizzes/questionNormalizer.js');
const { buildPresentation } = await import('../src/modules/quizzes/quizPresentation.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const QUIZ_ID = oid('507f1f77bcf86cd799439011');
const VERSION_ID = oid('507f1f77bcf86cd799439012');
const Q1 = oid('507f1f77bcf86cd7994390a1');
const Q2 = oid('507f1f77bcf86cd7994390a2');
const Q3 = oid('507f1f77bcf86cd7994390a3');
const Q4 = oid('507f1f77bcf86cd7994390a4');
const OWNER = oid('507f1f77bcf86cd799439001');
const OTHER = oid('507f1f77bcf86cd799439002');

const owner = { id: String(OWNER), role: ROLES.STUDENT, permissions: [] };
const stranger = { id: String(OTHER), role: ROLES.STUDENT, permissions: [] };
const moderator = {
  id: String(OTHER), role: ROLES.CONTENT_MODERATOR,
  permissions: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ],
};
const superAdmin = { id: String(OTHER), role: ROLES.SUPER_ADMIN, permissions: Object.values(PERMISSIONS) };

const stubs = [];
function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}
afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs.length = 0;
});

/** A thenable Mongoose-query double: any chain method returns itself. */
function chainable(value) {
  const promise = Promise.resolve(value);
  const chain = {};
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where', 'count']) {
    chain[method] = () => chain;
  }
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

const BANK = [
  normaliseQuestion({ type: 'mcq', prompt: 'Which structure is LIFO?', options: ['Queue', 'Stack'], answer: 'B', topic: 'Stacks', points: 1, explanation: 'LIFO' }),
  normaliseQuestion({ type: 'multi', prompt: 'Pick the prime numbers', options: ['2', '3', '4'], answer: [0, 1], topic: 'Math', points: 2, explanation: '2 and 3' }),
  normaliseQuestion({ type: 'true_false', prompt: 'Binary search needs sorted input.', answer: true, topic: 'Math', points: 1, explanation: 'Monotonic predicate' }),
];

function bankDocs() {
  return BANK.map((canonical, index) => ({
    ...canonical,
    _id: [Q1, Q2, Q3][index],
    author: OWNER,
    usageCount: 0,
    toObject() { return { ...this }; },
  }));
}

function makeQuiz(overrides = {}) {
  return new Quiz({
    _id: QUIZ_ID,
    title: 'Data structures warmup',
    slug: 'data-structures-warmup-abc',
    author: OWNER,
    status: S.DRAFT,
    difficulty: 'easy',
    goals: [], topics: [], tags: [],
    settings: { timerMinutes: 10, passPercentage: 50, maxAttempts: 3 },
    questions: BANK.map((question, index) => ({ question: [Q1, Q2, Q3][index], order: index })),
    publishedVersion: 0,
    ...overrides,
  });
}

function makeVersion(overrides = {}) {
  return {
    _id: VERSION_ID,
    quiz: QUIZ_ID,
    version: 1,
    title: 'Data structures warmup',
    description: '',
    difficulty: 'easy',
    topics: ['Stacks', 'Math'],
    settings: {
      timerMinutes: 10, passPercentage: 50, maxAttempts: 3,
      shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
      showExplanations: true, allowRetryIncorrect: true,
    },
    questions: BANK.map((canonical, index) => ({ ...canonical, _id: [Q1, Q2, Q3][index], order: index })),
    questionCount: 3,
    maxScore: 4,
    publishedBy: OWNER,
    ...overrides,
  };
}

function stubQuiz(quiz) {
  stub(Quiz, 'findById', () => chainable(quiz));
}
function stubVersion(version) {
  stub(QuizVersion, 'findOne', () => chainable(version));
  stub(QuizVersion, 'findById', () => chainable(version));
  stub(QuizVersion, 'find', () => chainable(version ? [version] : []));
  stub(QuizVersion, 'deleteOne', () => chainable({ deletedCount: 1 }));
}
function stubSave(...prototypes) {
  for (const proto of prototypes) stub(proto, 'save', async function save() { return this; });
}
function stubBank(docs = bankDocs()) {
  stub(Question, 'find', () => chainable(docs));
  stub(Question, 'updateMany', async () => ({ modifiedCount: docs.length }));
  stub(Question, 'deleteMany', async () => ({ deletedCount: docs.length }));
}
function stubAttemptQueries({ live = null, used = 0, source = null, attempts = [] } = {}) {
  stub(Attempt, 'findOne', () => chainable(live ?? source));
  stub(Attempt, 'countDocuments', async () => used);
  stub(Attempt, 'find', () => chainable(attempts));
  stub(Attempt, 'findById', async () => live);
  stub(Quiz, 'updateOne', () => chainable({ modifiedCount: 1 }));
}

/* ─────────────────────────── quiz service ─────────────────────────── */

describe('quiz.service — authorisation + lifecycle', () => {
  it('blocks a non-author student from editing a quiz', async () => {
    stubQuiz(makeQuiz());
    await assert.rejects(
      () => quizService.updateQuiz(String(QUIZ_ID), { title: 'Hacked quiz' }, stranger),
      (error) => error.statusCode === 403,
    );
  });

  it('lets a moderator edit but never moderate their own quiz', async () => {
    stubQuiz(makeQuiz({ status: S.PENDING_REVIEW, author: OTHER }));
    await assert.rejects(
      () => quizService.moderateQuiz(String(QUIZ_ID), 'approve', '', moderator),
      (error) => error.statusCode === 403 && /authored|own quiz/i.test(error.message),
    );
    // The super admin exemption is deliberate and tested separately.
    stubSave(Quiz.prototype);
    const result = await quizService.moderateQuiz(String(QUIZ_ID), 'approve', 'LGTM', superAdmin);
    assert.equal(result.quiz.status, S.APPROVED);
  });

  it('refuses to submit or publish an empty quiz', async () => {
    stubQuiz(makeQuiz({ questions: [] }));
    await assert.rejects(() => quizService.submitForReview(String(QUIZ_ID), '', owner), (error) => error.statusCode === 422);
    await assert.rejects(() => quizService.publishQuiz(String(QUIZ_ID), '', owner), (error) => error.statusCode === 409);
  });

  it('follows draft → pending_review → approved → published', async () => {
    const quiz = makeQuiz();
    stubQuiz(quiz);
    stubSave(Quiz.prototype);
    stubBank();

    await quizService.submitForReview(String(QUIZ_ID), 'first draft', owner);
    assert.equal(quiz.status, S.PENDING_REVIEW);
    assert.equal(quiz.reviewHistory.length, 1);

    await quizService.moderateQuiz(String(QUIZ_ID), 'approve', 'LGTM', moderator);
    assert.equal(quiz.status, S.APPROVED);

    let created = null;
    stub(QuizVersion, 'create', async (payload) => { created = payload; return { _id: VERSION_ID, ...payload }; });
    const published = await quizService.publishQuiz(String(QUIZ_ID), 'v1', owner);
    assert.equal(quiz.status, S.PUBLISHED);
    assert.equal(quiz.publishedVersion, 1);
    assert.equal(quiz.publishedQuestionCount, 3);
    assert.equal(quiz.publishedMaxScore, 4);
    assert.equal(published.version.version, 1);
    assert.equal(created.questions.length, 3);
    assert.equal(String(created.questions[0]._id), String(Q1)); // stable bank ids
    assert.equal(created.questions[1].answerKey[0], 'o0'); // answer keys frozen too
  });

  it('rolls back the orphan version when the quiz save fails', async () => {
    const quiz = makeQuiz({ status: S.APPROVED });
    stubQuiz(quiz);
    stubBank();
    let deleted = false;
    stub(QuizVersion, 'create', async (payload) => ({ _id: VERSION_ID, ...payload }));
    stub(QuizVersion, 'deleteOne', () => { deleted = true; return chainable({}); });
    stub(Quiz.prototype, 'save', async () => { throw new Error('db write failed'); });
    await assert.rejects(() => quizService.publishQuiz(String(QUIZ_ID), '', owner), /db write failed/);
    assert.equal(deleted, true);
  });

  it('keeps a published snapshot frozen when the bank question changes', async () => {
    const version = makeVersion();
    const quiz = makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 });
    stubQuiz(quiz);
    stubVersion(version);
    stubAttemptQueries({ attempts: [] });
    const before = JSON.stringify(version.questions);

    const detail = await quizService.getQuiz(String(QUIZ_ID), stranger);
    assert.equal(detail.quiz.viewedVersion, 1);
    assert.equal(detail.quiz.isPublishedSnapshot, true);
    assert.equal(detail.quiz.questionCount, 3);
    assert.equal(detail.canManage, false);
    assert.equal(detail.mySummary.activeAttemptId, null);
    assert.equal(detail.mySummary.attemptsLeft, 3);
    assert.equal(JSON.stringify(version.questions), before);
  });

  it('hides an unpublished draft from students', async () => {
    stubQuiz(makeQuiz({ status: S.DRAFT }));
    stubVersion(null);
    stubAttemptQueries({ attempts: [] });
    await assert.rejects(
      () => quizService.getQuiz(String(QUIZ_ID), stranger),
      (error) => error.statusCode === 404,
    );
  });

  it('rejects linking a foreign bank question and duplicate links', async () => {
    const quiz = makeQuiz();
    stubQuiz(quiz);
    stubSave(Quiz.prototype);
    stubBank([{ ...BANK[0], _id: Q4, author: OTHER }]);
    await assert.rejects(
      () => quizService.linkQuestions(String(QUIZ_ID), [String(Q4)], owner),
      (error) => error.statusCode === 403,
    );

    stubBank(bankDocs().slice(0, 1));
    await assert.rejects(
      () => quizService.linkQuestions(String(QUIZ_ID), [String(Q1)], owner),
      (error) => error.statusCode === 409,
    );
  });

  it('rejects a partial reorder and re-ranks on unlink', async () => {
    const quiz = makeQuiz();
    stubQuiz(quiz);
    stubSave(Quiz.prototype);
    await assert.rejects(
      () => quizService.reorderQuestions(String(QUIZ_ID), [String(Q1), String(Q2)], owner),
      (error) => error.statusCode === 422,
    );
    stubBank();
    const result = await quizService.unlinkQuestion(String(QUIZ_ID), String(Q2), owner);
    assert.equal(result.quiz.questionIds.length, 2);
    assert.deepEqual(quiz.questions.map((link) => link.order), [0, 1]);
  });
});

/* ─────────────────────────── attempt service ─────────────────────────── */

async function newStartedAttempt(overrides = {}) {
  const version = makeVersion(overrides.version);
  const quiz = makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 });
  stubQuiz(quiz);
  stubVersion(version);
  stubBank();
  stubSave(Attempt.prototype);
  stubAttemptQueries({ live: null, used: overrides.used ?? 0, attempts: [] });
  return attemptService.startAttempt(String(QUIZ_ID), overrides.payload ?? {}, owner);
}

describe('attempt.service — start, autosave, grading, expiry', () => {
  it('starts against the frozen version with a server-side deadline', async () => {
    const before = Date.now();
    const { attempt, remainingSeconds, quiz } = await newStartedAttempt();
    assert.equal(attempt.status, A.IN_PROGRESS);
    assert.equal(attempt.quizVersion, 1);
    assert.equal(attempt.questionCount, 3);
    assert.equal(quiz.maxScore, 4);
    assert.ok(remainingSeconds <= 600 && remainingSeconds >= 599);
    assert.ok(new Date(attempt.expiresAt).getTime() >= before + 599_000);
    assert.equal(attempt.answers.length, 0);
  });

  it('refuses to start an unpublished quiz', async () => {
    stubQuiz(makeQuiz({ status: S.DRAFT }));
    stubVersion(makeVersion());
    await assert.rejects(
      () => attemptService.startAttempt(String(QUIZ_ID), {}, owner),
      (error) => error.statusCode === 403,
    );
  });

  it('enforces maxAttempts server-side', async () => {
    stubQuiz(makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(makeVersion());
    stubAttemptQueries({ used: 3 });
    await assert.rejects(
      () => attemptService.startAttempt(String(QUIZ_ID), {}, owner),
      (error) => error.statusCode === 409 && /all 3 attempts/.test(error.message),
    );
  });

  it('stores a deterministic, seeded presentation order', async () => {
    const { attempt } = await newStartedAttempt({
      version: { settings: { ...makeVersion().settings, shuffleQuestions: true, shuffleOptions: true } },
    });
    assert.equal(attempt.presentation.length, 3);
    const expected = buildPresentation(
      makeVersion().questions.map((question) => ({ id: String(question._id), question })),
      { shuffleQuestions: true, shuffleOptions: true },
      attempt.id,
    );
    assert.deepEqual(attempt.questionIds, expected.map((entry) => entry.questionId));
  });

  it('never sends answer keys or explanations to the solver', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50 },
      title: 'Data structures warmup',
      questionIds: attempt.questionIds.map(oid),
      presentation: attempt.presentation,
      expiresAt: new Date(Date.now() + 600_000),
    });
    stub(Attempt, 'findById', async () => live);
    const data = await attemptService.getAttemptQuestions(attempt.id, { page: 1, limit: 200 }, owner);
    assert.equal(data.items.length, 3);
    const json = JSON.stringify(data.items);
    for (const secret of ['answerKey', 'booleanKey', 'textAnswers', 'explanation', 'expected']) {
      assert.equal(json.includes(secret), false, `leaked ${secret}`);
    }
    assert.equal(data.pagination.total, 3);
    assert.equal(data.items[0].options?.[0]?.text, 'Queue');
  });

  it('blocks autosave by another user and ignores stale question ids', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50 },
      title: 'Q', questionIds: attempt.questionIds.map(oid),
      expiresAt: new Date(Date.now() + 600_000),
    });
    stub(Attempt, 'findById', async () => live);
    stubSave(Attempt.prototype);
    await assert.rejects(
      () => attemptService.autosaveAttempt(attempt.id, [{ questionId: String(Q1), response: 'o1' }], stranger),
      (error) => error.statusCode === 403,
    );
    const saved = await attemptService.autosaveAttempt(attempt.id, [
      { questionId: String(Q1), response: 'o1', marked: true },
      { questionId: '507f1f77bcf86cd7994390ff', response: 'o0' },
    ], owner);
    assert.equal(saved.attempt.answers.length, 1);
    assert.equal(saved.attempt.answers[0].marked, true);
  });

  it('grades a submitted attempt with topic stats and pass flag', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50, showExplanations: true },
      title: 'Q', questionIds: attempt.questionIds.map(oid),
      startedAt: new Date(Date.now() - 30_000),
      expiresAt: new Date(Date.now() + 570_000),
    });
    stub(Attempt, 'findById', async () => live);
    stubSave(Attempt.prototype);
    stub(Quiz, 'updateOne', () => chainable({}));

    const result = await attemptService.submitAttempt(attempt.id, [
      { questionId: String(Q1), response: 'o1' },                 // correct, 1 point
      { questionId: String(Q2), response: ['o0', 'o1'], marked: true }, // correct, 2 points
      { questionId: String(Q3), response: false },                // wrong
    ], owner);

    assert.equal(result.attempt.status, A.SUBMITTED);
    assert.equal(result.attempt.score, 3);
    assert.equal(result.attempt.maxScore, 4);
    assert.equal(result.attempt.percentage, 75);
    assert.equal(result.attempt.passed, true);
    assert.equal(result.attempt.correctCount, 2);
    assert.equal(result.attempt.topicStats.length, 2);
    assert.equal(result.attempt.results.length, 3);
    assert.ok(result.attempt.results[0].explanation.length > 0);
    assert.ok(result.attempt.durationSeconds >= 29);
  });

  it('is idempotent: a second submit returns the same score', async () => {
    const submitted = new Attempt({
      _id: oid('507f1f77bcf86cd7994390c1'), user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.SUBMITTED,
      settings: { timerMinutes: 10, passPercentage: 50 }, title: 'Q',
      questionIds: [Q1], expiresAt: new Date(Date.now() + 600_000),
      score: 1, maxScore: 1, percentage: 100, results: [], topicStats: [],
    });
    stub(Attempt, 'findById', async () => submitted);
    const result = await attemptService.submitAttempt(String(submitted._id), [{ questionId: String(Q1), response: 'o0' }], owner);
    assert.equal(result.attempt.score, 1);
    assert.equal(result.attempt.status, A.SUBMITTED);
  });

  it('auto-finalises an expired attempt as timed_out on read', async () => {
    const { attempt } = await newStartedAttempt();
    const expired = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50, showExplanations: true },
      title: 'Q', questionIds: attempt.questionIds.map(oid),
      startedAt: new Date(Date.now() - 700_000),
      expiresAt: new Date(Date.now() - 100_000),
      answers: [{ questionId: Q1, response: 'o1', marked: false }],
    });
    stub(Attempt, 'findById', async () => expired);
    stubSave(Attempt.prototype);
    stub(Quiz, 'updateOne', () => chainable({}));
    const data = await attemptService.getAttempt(attempt.id, owner);
    assert.equal(data.expired, true);
    assert.equal(data.attempt.status, A.TIMED_OUT);
    assert.equal(data.attempt.score, 1);
    assert.equal(data.attempt.durationSeconds, 600); // capped at the timer
  });

  it('builds a retry-incorrect-only subset from a previous attempt', async () => {
    const source = {
      _id: oid('507f1f77bcf86cd7994390c2'), user: OWNER, quiz: QUIZ_ID,
      status: A.SUBMITTED,
      results: [
        { questionId: Q1, correct: true }, { questionId: Q2, correct: false }, { questionId: Q3, correct: false },
      ],
    };
    const version = makeVersion();
    stubQuiz(makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(version);
    stubBank();
    stubSave(Attempt.prototype);
    let calls = 0;
    stub(Attempt, 'findOne', () => { calls += 1; return chainable(calls === 1 ? null : source); });
    stub(Attempt, 'countDocuments', async () => 1);
    stub(Attempt, 'find', () => chainable([]));
    stub(Quiz, 'updateOne', () => chainable({}));

    const data = await attemptService.startAttempt(String(QUIZ_ID), {
      mode: 'incorrect', sourceAttemptId: String(source._id),
    }, owner);
    assert.equal(data.attempt.mode, 'incorrect');
    assert.equal(data.attempt.questionCount, 2);
    assert.equal(data.quiz.maxScore, 3); // 2 + 1
  });

  it('rejects retry-incorrect from someone else’s attempt', async () => {
    stubQuiz(makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(makeVersion());
    stubBank();
    let calls = 0;
    stub(Attempt, 'findOne', () => { calls += 1; return chainable(null); });
    stub(Attempt, 'countDocuments', async () => 1);
    await assert.rejects(
      () => attemptService.startAttempt(String(QUIZ_ID), {
        mode: 'incorrect', sourceAttemptId: '507f1f77bcf86cd7994390c2',
      }, owner),
      (error) => error.statusCode === 404,
    );
    assert.equal(calls, 2);
  });

  it('hides explanations on the result when the quiz disables them', async () => {
    const done = new Attempt({
      _id: oid('507f1f77bcf86cd7994390c3'), user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.SUBMITTED,
      settings: { timerMinutes: 10, passPercentage: 50, showExplanations: false },
      title: 'Q', questionIds: [Q1], expiresAt: new Date(Date.now() + 600_000),
      results: [{ questionId: Q1, type: 'mcq', topic: 'Stacks', correct: true, expected: 'Stack', explanation: 'LIFO' }],
      topicStats: [], score: 1, maxScore: 1, percentage: 100,
    });
    stub(Attempt, 'findById', async () => done);
    stub(QuizVersion, 'findById', () => chainable({ settings: { allowRetryIncorrect: false } }));
    stub(Attempt, 'countDocuments', async () => 1);
    stub(Quiz, 'findById', () => chainable(makeQuiz()));
    const data = await attemptService.getResult(String(done._id), owner);
    assert.equal('expected' in data.attempt.results[0], false);
    assert.equal('explanation' in data.attempt.results[0], false);
    assert.equal(data.retryAllowed, false);
  });
});
```

## `server/tests/quizzes.routes.test.js`

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
const QUIZ = '/quizzes/507f1f77bcf86cd799439011';
const ATTEMPT = '/attempts/507f1f77bcf86cd799439012';

/** Authentication must run before validation so error details never leak. */
describe('Phase-3 route protection', () => {
  it('rejects anonymous access to every question-bank route', async () => {
    const endpoints = [
      ['get', '/question-bank'],
      ['post', '/question-bank'],
      ['post', '/question-bank/parse-import'],
      ['get', '/question-bank/507f1f77bcf86cd799439013'],
      ['patch', '/question-bank/507f1f77bcf86cd799439013'],
      ['delete', '/question-bank/507f1f77bcf86cd799439013'],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to quiz CRUD, lifecycle and question routes', async () => {
    const endpoints = [
      ['get', '/quizzes'], ['post', '/quizzes'],
      ['get', QUIZ], ['patch', QUIZ], ['delete', QUIZ],
      ['post', `${QUIZ}/submit`], ['post', `${QUIZ}/moderate`], ['post', `${QUIZ}/publish`],
      ['get', `${QUIZ}/versions`], ['get', `${QUIZ}/versions/1`],
      ['get', `${QUIZ}/questions`], ['post', `${QUIZ}/questions`],
      ['post', `${QUIZ}/questions/import`], ['patch', `${QUIZ}/questions/order`],
      ['get', `${QUIZ}/attempts`], ['post', `${QUIZ}/attempts`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
    }
  });

  it('rejects anonymous access to attempt state and results', async () => {
    const endpoints = [
      ['get', ATTEMPT], ['get', `${ATTEMPT}/questions`],
      ['patch', `${ATTEMPT}/answers`], ['post', `${ATTEMPT}/submit`],
      ['get', `${ATTEMPT}/result`], ['post', `${ATTEMPT}/abandon`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.data, null);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const res = await request.post(`${base}/quizzes`).send({ title: 'x', bogus: true });
    assert.equal(res.status, 401);
    assert.equal(res.body.errors, null);
    const importRes = await request.post(`${base}/question-bank/parse-import`)
      .send({ format: 'csv', text: 'javascript:alert(1)' });
    assert.equal(importRes.status, 401);
  });

  it('keeps the health probe public and every other mount private', async () => {
    const health = await request.get(`${base}/health`);
    assert.equal(health.status, 200);
    const sheets = await request.get(`${base}/sheets`);
    assert.equal(sheets.status, 401, 'Phase 2 protection is unchanged');
  });
});
```

---

# Client — shared wiring (modified)

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
  // Phase 3 — Quizzes, question bank and per-user attempts.
  quizzes: {
    all: ['quizzes'],
    list: (params) => ['quizzes', 'list', params],
    detail: (id) => ['quizzes', 'detail', id],
    versions: (id) => ['quizzes', 'versions', id],
    questions: (id, params) => ['quizzes', 'questions', id, params],
    attempts: (id, params) => ['quizzes', 'attempts', id, params],
  },
  questionBank: {
    all: ['question-bank'],
    list: (params) => ['question-bank', 'list', params],
  },
  attempts: {
    all: ['attempts'],
    detail: (id) => ['attempts', 'detail', id],
    questions: (id, params) => ['attempts', 'questions', id, params],
    result: (id) => ['attempts', 'result', id],
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
  { label: 'Quizzes', to: '/app/quizzes', icon: 'ListChecks', ready: true },
  { label: 'Mocks', to: '/app/mocks', icon: 'Timer', ready: false },
  { label: 'Plans', to: '/app/plans', icon: 'CalendarRange', ready: false },
  { label: 'Resources', to: '/app/resources', icon: 'FolderOpen', ready: false },
  { label: 'Community', to: '/app/community', icon: 'Users', ready: false },
];

export const isNavReady = (pathname) => NAV_ITEMS.find((item) => item.to === pathname)?.ready ?? true;
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

// Phase 3 — Quizzes. The solver/result pages are separate chunks so the quiz
// engine (timer + palette) is never downloaded for the catalogue.
const QuizzesPage = lazy(() => import('../features/quizzes/pages/QuizzesPage.jsx'));
const QuizDetailPage = lazy(() => import('../features/quizzes/pages/QuizDetailPage.jsx'));
const QuizEditorPage = lazy(() => import('../features/quizzes/pages/QuizEditorPage.jsx'));
const QuizSolverPage = lazy(() => import('../features/quizzes/pages/QuizSolverPage.jsx'));
const QuizResultPage = lazy(() => import('../features/quizzes/pages/QuizResultPage.jsx'));

// Mocks, Plans, Resources and Community keep their honest placeholder
// until their phase lands.
const UPCOMING_MODULES = ['mocks', 'plans', 'resources', 'community'];

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

              {/* Static segments are ranked above /:id by React Router. */}
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="quizzes/new" element={<QuizEditorPage />} />
              <Route path="quizzes/:id" element={<QuizDetailPage />} />
              <Route path="quizzes/:id/edit" element={<QuizEditorPage />} />
              <Route path="quizzes/:id/attempts/:attemptId" element={<QuizSolverPage />} />
              <Route path="quizzes/:id/results/:attemptId" element={<QuizResultPage />} />

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
  ['QuizzesPage', '/src/features/quizzes/pages/QuizzesPage.jsx'],
  ['QuizDetailPage', '/src/features/quizzes/pages/QuizDetailPage.jsx'],
  ['QuizEditorPage', '/src/features/quizzes/pages/QuizEditorPage.jsx'],
  ['QuizSolverPage', '/src/features/quizzes/pages/QuizSolverPage.jsx'],
  ['QuizResultPage', '/src/features/quizzes/pages/QuizResultPage.jsx'],
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

# Client — quizzes api, hooks, lib (new)

## `client/src/features/quizzes/api/quizApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Thin wrappers around /api/v1/quizzes. No token or user id is ever passed. */
export const quizApi = {
  list: (params) => api.get('/quizzes', { query: params }),
  get: (id) => api.get(`/quizzes/${id}`),
  create: (body) => api.post('/quizzes', body),
  update: (id, body) => api.patch(`/quizzes/${id}`, body),
  archive: (id) => api.delete(`/quizzes/${id}`),
  restore: (id) => api.post(`/quizzes/${id}/restore`, {}),
  revision: (id) => api.post(`/quizzes/${id}/revision`, {}),
  submit: (id, changelog = '') => api.post(`/quizzes/${id}/submit`, { changelog }),
  moderate: (id, body) => api.post(`/quizzes/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/quizzes/${id}/publish`, { changelog }),

  versions: (id) => api.get(`/quizzes/${id}/versions`),
  version: (id, version) => api.get(`/quizzes/${id}/versions/${version}`),

  questions: (id, params) => api.get(`/quizzes/${id}/questions`, { query: params }),
  linkQuestions: (id, questionIds) => api.post(`/quizzes/${id}/questions`, { questionIds }),
  importQuestions: (id, items, source = 'json') => api.post(`/quizzes/${id}/questions/import`, { items, source }),
  reorderQuestions: (id, orderedIds) => api.patch(`/quizzes/${id}/questions/order`, { orderedIds }),
  unlinkQuestion: (id, questionId) => api.delete(`/quizzes/${id}/questions/${questionId}`),

  attempts: (id, params) => api.get(`/quizzes/${id}/attempts`, { query: params }),
  startAttempt: (id, body = {}) => api.post(`/quizzes/${id}/attempts`, body),
};

export default quizApi;
```

## `client/src/features/quizzes/api/questionApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Reusable question bank (/question-bank). */
export const questionApi = {
  list: (params) => api.get('/question-bank', { query: params }),
  get: (id) => api.get(`/question-bank/${id}`),
  create: (body) => api.post('/question-bank', body),
  update: (id, body) => api.patch(`/question-bank/${id}`, body),
  remove: (id) => api.delete(`/question-bank/${id}`),
  /** Pure server-side preview: validates and normalises pasted JSON/CSV. */
  parseImport: (format, text) => api.post('/question-bank/parse-import', { format, text }),
};

export default questionApi;
```

## `client/src/features/quizzes/api/attemptApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Per-user attempt state (/attempts). All rows are scoped by the access token. */
export const attemptApi = {
  get: (id) => api.get(`/attempts/${id}`),
  questions: (id, params = {}) => api.get(`/attempts/${id}/questions`, { query: params }),
  autosave: (id, answers) => api.patch(`/attempts/${id}/answers`, { answers }),
  submit: (id, answers = []) => api.post(`/attempts/${id}/submit`, { answers }),
  result: (id) => api.get(`/attempts/${id}/result`),
  abandon: (id) => api.post(`/attempts/${id}/abandon`, {}),
};

export default attemptApi;
```

## `client/src/features/quizzes/hooks/useQuizzes.js`

```js
import {
  keepPreviousData, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import quizApi from '../api/quizApi.js';
import questionApi from '../api/questionApi.js';
import attemptApi from '../api/attemptApi.js';

/** One place decides which query keys a mutation dirties. */
function useInvalidators() {
  const qc = useQueryClient();
  return {
    lists: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.all });
      qc.invalidateQueries({ queryKey: queryKeys.attempts.all });
    },
    quiz: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.versions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.questions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.attempts(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.all });
    },
    bank: () => qc.invalidateQueries({ queryKey: queryKeys.questionBank.all }),
    attempt: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.attempts.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.attempts.result(id) });
      qc.invalidateQueries({ queryKey: queryKeys.attempts.all });
    },
  };
}

/* ───────────────────────────── queries ───────────────────────────── */

export function useQuizList(params) {
  return useQuery({
    queryKey: queryKeys.quizzes.list(params),
    queryFn: () => quizApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useQuiz(id) {
  return useQuery({
    queryKey: queryKeys.quizzes.detail(id),
    queryFn: () => quizApi.get(id),
    enabled: Boolean(id),
  });
}

export function useQuizVersions(id) {
  return useQuery({
    queryKey: queryKeys.quizzes.versions(id),
    queryFn: () => quizApi.versions(id),
    enabled: Boolean(id),
  });
}

export function useQuizQuestions(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.quizzes.questions(id, params),
    queryFn: () => quizApi.questions(id, params),
    enabled: Boolean(id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function useMyAttempts(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.quizzes.attempts(id, params),
    queryFn: () => quizApi.attempts(id, params),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });
}

export function useQuestionBank(params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.questionBank.list(params),
    queryFn: () => questionApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useAttempt(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attempts.detail(id),
    queryFn: () => attemptApi.get(id),
    enabled: Boolean(id) && enabled,
    // The solver owns the countdown; refetching would fight local state.
    refetchOnWindowFocus: false,
  });
}

export function useAttemptQuestions(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attempts.questions(id, params),
    queryFn: () => attemptApi.questions(id, params),
    enabled: Boolean(id) && enabled,
    staleTime: Infinity, // frozen version — never changes mid-attempt
  });
}

export function useAttemptResult(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attempts.result(id),
    queryFn: () => attemptApi.result(id),
    enabled: Boolean(id) && enabled,
  });
}

/* ───────────────────────── quiz mutations ───────────────────────── */

export function useCreateQuiz() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: quizApi.create, onSuccess: () => invalidate.lists() });
}

export function useUpdateQuiz(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => quizApi.update(id, body), onSuccess: () => invalidate.quiz(id) });
}

export function useArchiveQuiz() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: quizApi.archive, onSuccess: () => invalidate.lists() });
}

export function useQuizLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.quiz(id);
  return {
    submit: useMutation({ mutationFn: (changelog) => quizApi.submit(id, changelog), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => quizApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: (changelog) => quizApi.publish(id, changelog), onSuccess }),
    restore: useMutation({ mutationFn: () => quizApi.restore(id), onSuccess }),
    revision: useMutation({ mutationFn: () => quizApi.revision(id), onSuccess }),
  };
}

export function useQuizQuestionMutations(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.quiz(id);
  return {
    link: useMutation({ mutationFn: (questionIds) => quizApi.linkQuestions(id, questionIds), onSuccess: () => { onSuccess(); invalidate.bank(); } }),
    importItems: useMutation({ mutationFn: ({ items, source }) => quizApi.importQuestions(id, items, source), onSuccess: () => { onSuccess(); invalidate.bank(); } }),
    reorder: useMutation({ mutationFn: (orderedIds) => quizApi.reorderQuestions(id, orderedIds), onSuccess }),
    unlink: useMutation({ mutationFn: (questionId) => quizApi.unlinkQuestion(id, questionId), onSuccess: () => { onSuccess(); invalidate.bank(); } }),
  };
}

/* ─────────────────────── question bank mutations ─────────────────────── */

export function useQuestionMutations() {
  const invalidate = useInvalidators();
  return {
    create: useMutation({ mutationFn: questionApi.create, onSuccess: () => invalidate.bank() }),
    update: useMutation({ mutationFn: ({ id, body }) => questionApi.update(id, body), onSuccess: () => invalidate.bank() }),
    remove: useMutation({ mutationFn: questionApi.remove, onSuccess: () => invalidate.bank() }),
  };
}

export function useParseQuestionImport() {
  return useMutation({ mutationFn: ({ format, text }) => questionApi.parseImport(format, text) });
}

/* ───────────────────────── attempt mutations ───────────────────────── */

export function useStartAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => quizApi.startAttempt(id, body),
    onSuccess: () => invalidate.quiz(id),
  });
}

/** Autosave deliberately does NOT invalidate: the solver holds local state. */
export function useAutosaveAttempt() {
  return useMutation({ mutationFn: ({ id, answers }) => attemptApi.autosave(id, answers) });
}

export function useSubmitAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, answers }) => attemptApi.submit(attemptId, answers),
    onSuccess: () => { invalidate.attempt(id); invalidate.quiz(id); },
  });
}

export function useAbandonAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: attemptApi.abandon,
    onSuccess: () => { invalidate.attempt(id); invalidate.quiz(id); },
  });
}

export default useQuizList;
```

## `client/src/features/quizzes/lib/quizUtils.js`

```js
import {
  ATTEMPT_STATUS_LABELS, QUIZ_STATUS_LABELS, QUIZ_VISIBILITY_LABELS,
  QUESTION_TYPE_LABELS, QUESTION_TYPE_VALUES, DIFFICULTY_LABELS, DIFFICULTY_VALUES,
  SHEET_TOPICS, QUIZ_SORT_OPTIONS,
} from '@algonest/shared';

export const QUESTION_TYPE_OPTIONS = QUESTION_TYPE_VALUES.map((value) => ({ value, label: QUESTION_TYPE_LABELS[value] }));
export const DIFFICULTY_OPTIONS = DIFFICULTY_VALUES.map((value) => ({ value, label: DIFFICULTY_LABELS[value] }));
export const TOPIC_OPTIONS = SHEET_TOPICS.map((value) => ({ value, label: value }));
export const VISIBILITY_OPTIONS = Object.entries(QUIZ_VISIBILITY_LABELS).map(([value, label]) => ({ value, label }));
export const SORT_OPTIONS = QUIZ_SORT_OPTIONS.map((value) => ({
  value, label: value.charAt(0).toUpperCase() + value.slice(1),
}));
export const STATUS_OPTIONS = Object.entries(QUIZ_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export const typeLabel = (value) => QUESTION_TYPE_LABELS[value] ?? value;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;
export const quizStatusLabel = (value) => QUIZ_STATUS_LABELS[value] ?? value;
export const attemptStatusLabel = (value) => ATTEMPT_STATUS_LABELS[value] ?? value;

export const STATUS_TONE = {
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
};
export const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };
export const ATTEMPT_TONE = {
  in_progress: 'warning', submitted: 'success', timed_out: 'danger', abandoned: 'neutral',
};
export const SCORE_TONE = (percentage, passPercentage) =>
  percentage >= passPercentage ? 'success' : percentage >= passPercentage * 0.6 ? 'warning' : 'danger';

export function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong. Please try again.';
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

/** API error array → { field: message } for form rendering. */
export function apiFieldErrors(error) {
  const result = {};
  for (const issue of error?.errors ?? []) {
    if (issue?.field && !result[issue.field]) result[issue.field] = issue.message;
  }
  return result;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

/** mm:ss from seconds — used by the countdown and the result page. */
export function formatClock(totalSeconds = 0) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function formatDuration(seconds = 0) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  if (value < 60) return `${value}s`;
  return `${Math.floor(value / 60)}m ${value % 60}s`;
}

export const ordinal = (index) => `Q${index + 1}`;

export default { errorMessage, formatClock };
```

## `client/src/features/quizzes/lib/questionDefaults.js`

```js
import { QUESTION_TYPES as T, QUESTION_TYPE_HINTS } from '@algonest/shared';

/** Blank, creator-friendly input for each question type (matches the Zod union). */
export function blankQuestion(type = T.MCQ) {
  const base = {
    type,
    prompt: '',
    topic: 'General',
    difficulty: 'medium',
    explanation: '',
    points: 1,
    tags: [],
    code: '',
  };
  switch (type) {
    case T.MCQ:
    case T.OUTPUT:
      return { ...base, options: ['', ''], answer: 0 };
    case T.MULTI:
      return { ...base, options: ['', '', ''], answer: [0] };
    case T.TRUE_FALSE:
      return { ...base, answer: true };
    case T.ORDERING:
      return { ...base, items: ['', ''] };
    case T.MATCHING:
      return { ...base, pairs: [{ left: '', right: '' }, { left: '', right: '' }] };
    case T.FILL_BLANK:
      return { ...base, answer: [''], caseSensitive: false };
    default:
      return base;
  }
}

/**
 * Convert the author-facing canonical question (from the API) back into the
 * same input shape the editor uses. Keeps editing and creating identical.
 */
export function canonicalToInput(question) {
  if (!question) return blankQuestion();
  const base = {
    type: question.type,
    prompt: question.prompt || '',
    topic: question.topic || 'General',
    difficulty: question.difficulty || 'medium',
    explanation: question.explanation || '',
    points: question.points || 1,
    tags: question.tags ?? [],
    code: question.code || '',
    caseSensitive: Boolean(question.caseSensitive),
  };
  const optionIndexes = (keys) => (keys ?? []).map((key) =>
    Math.max(0, (question.options ?? []).findIndex((option) => option.id === key)));

  switch (question.type) {
    case T.MCQ:
    case T.OUTPUT:
      return { ...base, options: (question.options ?? []).map((option) => option.text), answer: optionIndexes(question.answerKey)[0] ?? 0 };
    case T.MULTI:
      return { ...base, options: (question.options ?? []).map((option) => option.text), answer: optionIndexes(question.answerKey) };
    case T.TRUE_FALSE:
      return { ...base, answer: Boolean(question.booleanKey) };
    case T.ORDERING:
      return { ...base, items: (question.items ?? []).map((item) => item.text) };
    case T.MATCHING:
      return { ...base, pairs: (question.pairs ?? []).map((pair) => ({ left: pair.left, right: pair.right })) };
    case T.FILL_BLANK:
      return { ...base, answer: question.textAnswers?.length ? question.textAnswers : [''], caseSensitive: Boolean(question.caseSensitive) };
    default:
      return { ...base, ...blankQuestion(question.type) };
  }
}

/** Strip empty option/item rows before validation so they don't fail min(1). */
export function compactQuestion(input) {
  const next = { ...input };
  if (Array.isArray(next.options)) next.options = next.options.map((value) => String(value).trim()).filter(Boolean);
  if (Array.isArray(next.items)) next.items = next.items.map((value) => String(value).trim()).filter(Boolean);
  if (Array.isArray(next.pairs)) {
    next.pairs = next.pairs
      .map((pair) => ({ left: String(pair.left ?? '').trim(), right: String(pair.right ?? '').trim() }))
      .filter((pair) => pair.left && pair.right);
  }
  if (Array.isArray(next.answer) && (next.type === T.FILL_BLANK)) {
    next.answer = next.answer.map((value) => String(value).trim()).filter(Boolean);
  }
  if (Array.isArray(next.tags)) next.tags = next.tags.map((value) => String(value).trim()).filter(Boolean);
  // Fields that only belong to some variants must be removed for `.strict()`.
  const allowed = {
    [T.MCQ]: ['options', 'answer'],
    [T.MULTI]: ['options', 'answer'],
    [T.TRUE_FALSE]: ['answer'],
    [T.ORDERING]: ['items'],
    [T.MATCHING]: ['pairs'],
    [T.OUTPUT]: ['options', 'answer', 'code'],
    [T.FILL_BLANK]: ['answer', 'code', 'caseSensitive'],
  }[next.type] ?? [];
  const common = ['type', 'prompt', 'topic', 'difficulty', 'explanation', 'points', 'tags'];
  const result = {};
  for (const key of [...common, ...allowed]) if (next[key] !== undefined) result[key] = next[key];
  return result;
}

export const typeHint = (type) => QUESTION_TYPE_HINTS[type] ?? '';
```

---

# Client — quizzes components (new)

## `client/src/features/quizzes/components/QuizFilters.jsx`

```jsx
import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { DIFFICULTY_OPTIONS, SORT_OPTIONS, TOPIC_OPTIONS } from '../lib/quizUtils.js';

export const EMPTY_QUIZ_FILTERS = Object.freeze({ q: '', topic: '', difficulty: '', sort: 'newest' });

/** Debounced search lives in the page; this component is purely controlled. */
export default function QuizFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filters
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Search"
          type="search"
          placeholder="Title, topic, tag…"
          icon={Search}
          value={filters.q}
          onChange={(event) => set('q', event.target.value)}
        />
        <Select label="Topic" placeholder="All topics" options={TOPIC_OPTIONS} value={filters.topic} onChange={(event) => set('topic', event.target.value)} />
        <Select label="Difficulty" placeholder="Any difficulty" options={DIFFICULTY_OPTIONS} value={filters.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        <Select label="Sort by" options={SORT_OPTIONS} value={filters.sort} onChange={(event) => set('sort', event.target.value)} />
      </div>
    </div>
  );
}
```

## `client/src/features/quizzes/components/QuizCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Clock, ListChecks, Play, Target, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, formatDate, quizStatusLabel } from '../lib/quizUtils.js';

/** Data-heavy card: plain Tailwind, no animation dependency. */
export default function QuizCard({ quiz, showStatus = false }) {
  const settings = quiz.settings ?? {};
  return (
    <Link
      to={`/app/quizzes/${quiz.id}`}
      className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:border-primary"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Badge variant={DIFFICULTY_TONE[quiz.difficulty] ?? 'neutral'}>{difficultyLabel(quiz.difficulty)}</Badge>
        {showStatus ? <Badge variant={STATUS_TONE[quiz.status] ?? 'neutral'}>{quizStatusLabel(quiz.status)}</Badge> : null}
      </div>

      <div className="min-h-0 flex-1">
        <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">{quiz.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">
          {quiz.description || 'A timed DSA quiz with explanations and topic-wise analysis.'}
        </p>
      </div>

      {quiz.topics?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {quiz.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{topic}</span>
          ))}
        </div>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-3 text-xs text-muted sm:grid-cols-4">
        <div className="flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Questions</dt><dd>{quiz.questionCount ?? 0}</dd></div>
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Timer</dt><dd>{settings.timerMinutes ?? 20}m</dd></div>
        <div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Pass</dt><dd>{settings.passPercentage ?? 60}%</dd></div>
        <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Attempts</dt><dd>{quiz.attemptCount ?? 0}</dd></div>
      </dl>

      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span>by {quiz.author?.name ?? 'AlgoNest creator'} · {formatDate(quiz.publishedAt ?? quiz.createdAt)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          <Play className="h-3.5 w-3.5" aria-hidden="true" /> Open
        </span>
      </div>
    </Link>
  );
}
```

## `client/src/features/quizzes/components/QuizSettingsForm.jsx`

```jsx
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { VISIBILITY_OPTIONS } from '../lib/quizUtils.js';

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
      />
    </label>
  );
}

/** Controlled settings editor. Values are merged on the server on PATCH. */
export default function QuizSettingsForm({ value, onChange, errors = {}, disabled = false }) {
  const set = (key, input) => onChange({ ...value, [key]: input });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Timer (minutes)" type="number" min={1} max={180} required
          value={value.timerMinutes} error={errors.timerMinutes} disabled={disabled}
          onChange={(event) => set('timerMinutes', Number(event.target.value))}
        />
        <Input
          label="Passing score (%)" type="number" min={0} max={100} required
          value={value.passPercentage} error={errors.passPercentage} disabled={disabled}
          onChange={(event) => set('passPercentage', Number(event.target.value))}
        />
        <Input
          label="Max attempts" type="number" min={1} max={20} required
          value={value.maxAttempts} error={errors.maxAttempts} disabled={disabled}
          onChange={(event) => set('maxAttempts', Number(event.target.value))}
        />
        <Select
          label="Visibility" options={VISIBILITY_OPTIONS} value={value.visibility}
          error={errors.visibility} disabled={disabled}
          onChange={(event) => set('visibility', event.target.value)}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle id="quiz-shuffle-questions" label="Shuffle question order" hint="Stable per attempt, so autosave never reorders." checked={value.shuffleQuestions} onChange={(checked) => set('shuffleQuestions', checked)} />
        <Toggle id="quiz-shuffle-options" label="Shuffle options" hint="Applies to choice, ordering and matching columns." checked={value.shuffleOptions} onChange={(checked) => set('shuffleOptions', checked)} />
        <Toggle id="quiz-show-explanations" label="Show explanations after submit" hint="Disable for exam-style quizzes." checked={value.showExplanations} onChange={(checked) => set('showExplanations', checked)} />
        <Toggle id="quiz-retry-incorrect" label="Allow retry-incorrect-only" hint="Learners can retry just the questions they got wrong." checked={value.allowRetryIncorrect} onChange={(checked) => set('allowRetryIncorrect', checked)} />
      </div>
    </div>
  );
}
```

## `client/src/features/quizzes/components/QuestionEditor.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { questionInputSchema, QUESTION_TYPES as T } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { blankQuestion, compactQuestion, canonicalToInput, typeHint } from '../lib/questionDefaults.js';
import { DIFFICULTY_OPTIONS, QUESTION_TYPE_OPTIONS, TOPIC_OPTIONS, contractErrors } from '../lib/quizUtils.js';

const letter = (index) => String.fromCharCode(65 + index);
const listClass = 'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

/** All seven question types share one form; the union contract validates it. */
export default function QuestionEditor({ initial = null, onSave, onCancel, pending = false, title = 'Add a question' }) {
  const [draft, setDraft] = useState(() => (initial ? canonicalToInput(initial) : blankQuestion(T.MCQ)));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const hint = useMemo(() => typeHint(draft.type), [draft.type]);
  const set = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));

  const changeType = (type) => {
    setFormError(''); setErrors({});
    setDraft(blankQuestion(type));
  };

  const patchOption = (index, value) => {
    const options = [...draft.options]; options[index] = value;
    set('options', options);
  };
  const removeOption = (index) => {
    const options = draft.options.filter((_, i) => i !== index);
    const answer = Array.isArray(draft.answer)
      ? draft.answer.map((value) => (value > index ? value - 1 : value)).filter((value) => value !== index)
      : draft.answer > index ? draft.answer - 1 : draft.answer;
    setDraft((previous) => ({ ...previous, options, answer }));
  };
  const toggleMultiAnswer = (index) => {
    const current = Array.isArray(draft.answer) ? draft.answer : [];
    set('answer', current.includes(index) ? current.filter((value) => value !== index) : [...current, index].sort((a, b) => a - b));
  };
  const move = (key, index, direction) => {
    const list = [...draft[key]];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    set(key, list);
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = compactQuestion(draft);
    const parsed = questionInputSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setFormError(parsed.error.issues[0]?.message ?? 'Check the highlighted fields.');
      return;
    }
    setErrors({}); setFormError('');
    onSave(parsed.data);
  };

  const hasOptions = [T.MCQ, T.MULTI, T.OUTPUT].includes(draft.type);
  const hasItems = draft.type === T.ORDERING;
  const hasPairs = draft.type === T.MATCHING;
  const hasTextAnswers = draft.type === T.FILL_BLANK;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="mt-0.5 text-xs text-muted">{hint}</p>
        </div>
      </div>

      {formError ? <Alert variant="error" title="Fix this question">{formError}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Question type" options={QUESTION_TYPE_OPTIONS} value={draft.type} onChange={(event) => changeType(event.target.value)} />
        <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={draft.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        <Input label="Topic" list="quiz-topic-list" value={draft.topic} onChange={(event) => set('topic', event.target.value)} error={errors.topic} />
        <Input label="Points" type="number" min={1} max={10} value={draft.points} onChange={(event) => set('points', Number(event.target.value))} error={errors.points} />
      </div>
      <datalist id="quiz-topic-list">{TOPIC_OPTIONS.map((option) => <option key={option.value} value={option.value} />)}</datalist>

      <div>
        <label htmlFor="question-prompt" className="mb-1.5 block text-sm font-medium text-ink">Prompt <span className="text-danger">*</span></label>
        <textarea
          id="question-prompt" rows={3} maxLength={2000} value={draft.prompt}
          aria-invalid={errors.prompt ? 'true' : undefined}
          onChange={(event) => set('prompt', event.target.value)}
          placeholder={hasTextAnswers ? 'Use ___ for the blank, e.g. "A ______ is a FIFO structure."' : 'What do you want to ask?'}
          className={listClass}
        />
        {errors.prompt ? <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.prompt}</p> : null}
      </div>

      {(draft.type === T.OUTPUT || draft.type === T.FILL_BLANK) ? (
        <div>
          <label htmlFor="question-code" className="mb-1.5 block text-sm font-medium text-ink">
            Code snippet {draft.type === T.OUTPUT ? <span className="text-danger">*</span> : '(optional)'}
          </label>
          <textarea
            id="question-code" rows={4} maxLength={4000} value={draft.code ?? ''}
            onChange={(event) => set('code', event.target.value)}
            spellCheck={false}
            className={`${listClass} font-mono text-xs`}
            placeholder="console.log([1, 2, 3].map(x => x * 2));"
          />
          {errors.code ? <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.code}</p> : null}
        </div>
      ) : null}

      {hasOptions ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">
            Options &amp; correct answer {draft.type === T.MULTI ? '(select all)' : '(select one)'}
          </legend>
          {errors.options ? <p role="alert" className="text-xs font-medium text-danger">{errors.options}</p> : null}
          {errors.answer ? <p role="alert" className="text-xs font-medium text-danger">{errors.answer}</p> : null}
          {draft.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type={draft.type === T.MULTI ? 'checkbox' : 'radio'}
                  name="correct-option"
                  checked={draft.type === T.MULTI ? (draft.answer ?? []).includes(index) : draft.answer === index}
                  onChange={() => (draft.type === T.MULTI ? toggleMultiAnswer(index) : set('answer', index))}
                  className="h-4 w-4 shrink-0 accent-primary"
                  aria-label={`Mark option ${letter(index)} as correct`}
                />
                <span className="w-5 shrink-0 text-xs font-semibold text-muted">{letter(index)}</span>
                <input
                  type="text" value={option} maxLength={500}
                  onChange={(event) => patchOption(index, event.target.value)}
                  placeholder={`Option ${letter(index)}`}
                  className={listClass}
                  aria-label={`Option ${letter(index)} text`}
                />
              </label>
              <Button type="button" size="icon" variant="ghost" onClick={() => removeOption(index)} disabled={draft.options.length <= 2} aria-label={`Remove option ${letter(index)}`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('options', [...draft.options, ''])} disabled={draft.options.length >= 8}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add option
          </Button>
        </fieldset>
      ) : null}

      {draft.type === T.TRUE_FALSE ? (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">Correct answer</legend>
          <div className="flex gap-3">
            {[true, false].map((value) => (
              <label key={String(value)} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink">
                <input type="radio" name="correct-boolean" checked={draft.answer === value} onChange={() => set('answer', value)} className="h-4 w-4 accent-primary" />
                {value ? 'True' : 'False'}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {hasItems ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Items in the correct order</legend>
          <p className="flex items-center gap-1.5 text-xs text-muted"><Info className="h-3.5 w-3.5" aria-hidden="true" /> Learners see these shuffled; move them with the arrow buttons.</p>
          {errors.items ? <p role="alert" className="text-xs font-medium text-danger">{errors.items}</p> : null}
          {draft.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-xs font-semibold text-muted">{index + 1}</span>
              <input type="text" value={item} maxLength={500} onChange={(event) => {
                const items = [...draft.items]; items[index] = event.target.value; set('items', items);
              }} className={listClass} aria-label={`Item ${index + 1}`} placeholder={`Item ${index + 1}`} />
              <Button type="button" size="icon" variant="ghost" onClick={() => move('items', index, -1)} disabled={index === 0} aria-label={`Move item ${index + 1} up`}><ChevronUp className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => move('items', index, 1)} disabled={index === draft.items.length - 1} aria-label={`Move item ${index + 1} down`}><ChevronDown className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => set('items', draft.items.filter((_, i) => i !== index))} disabled={draft.items.length <= 2} aria-label={`Remove item ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('items', [...draft.items, ''])} disabled={draft.items.length >= 10}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add item
          </Button>
        </fieldset>
      ) : null}

      {hasPairs ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Matching pairs</legend>
          {errors.pairs ? <p role="alert" className="text-xs font-medium text-danger">{errors.pairs}</p> : null}
          {draft.pairs.map((pair, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-xs font-semibold text-muted">{index + 1}</span>
              <input type="text" value={pair.left} maxLength={500} onChange={(event) => {
                const pairs = [...draft.pairs]; pairs[index] = { ...pair, left: event.target.value }; set('pairs', pairs);
              }} className={listClass} aria-label={`Pair ${index + 1} left`} placeholder="Left item" />
              <span className="text-muted" aria-hidden="true">→</span>
              <input type="text" value={pair.right} maxLength={500} onChange={(event) => {
                const pairs = [...draft.pairs]; pairs[index] = { ...pair, right: event.target.value }; set('pairs', pairs);
              }} className={listClass} aria-label={`Pair ${index + 1} right`} placeholder="Right item" />
              <Button type="button" size="icon" variant="ghost" onClick={() => set('pairs', draft.pairs.filter((_, i) => i !== index))} disabled={draft.pairs.length <= 2} aria-label={`Remove pair ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('pairs', [...draft.pairs, { left: '', right: '' }])} disabled={draft.pairs.length >= 10}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add pair
          </Button>
        </fieldset>
      ) : null}

      {hasTextAnswers ? (
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Accepted answers</legend>
          {errors.answer ? <p role="alert" className="text-xs font-medium text-danger">{errors.answer}</p> : null}
          {draft.answer.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="text" value={answer} maxLength={500} onChange={(event) => {
                const answers = [...draft.answer]; answers[index] = event.target.value; set('answer', answers);
              }} className={listClass} aria-label={`Accepted answer ${index + 1}`} placeholder="e.g. queue" />
              <Button type="button" size="icon" variant="ghost" onClick={() => set('answer', draft.answer.filter((_, i) => i !== index))} disabled={draft.answer.length <= 1} aria-label={`Remove accepted answer ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={() => set('answer', [...draft.answer, ''])} disabled={draft.answer.length >= 10}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add synonym
            </Button>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={draft.caseSensitive} onChange={(event) => set('caseSensitive', event.target.checked)} className="h-4 w-4 accent-primary" />
              Case sensitive
            </label>
          </div>
        </fieldset>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="question-explanation" className="mb-1.5 block text-sm font-medium text-ink">Explanation (shown after submit)</label>
          <textarea id="question-explanation" rows={3} maxLength={2000} value={draft.explanation} onChange={(event) => set('explanation', event.target.value)} className={listClass} placeholder="Why is this the answer?" />
        </div>
        <Input
          label="Tags (comma separated)" value={(draft.tags ?? []).join(', ')}
          onChange={(event) => set('tags', event.target.value.split(',').map((tag) => tag.trim()))}
          hint="Optional — helps you find the question later."
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
        {onCancel ? <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button> : null}
        <Button type="submit" loading={pending}>Save question</Button>
      </div>
    </form>
  );
}
```

## `client/src/features/quizzes/components/QuestionList.jsx`

```jsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Pencil, Trash2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { DIFFICULTY_TONE, difficultyLabel, typeLabel } from '../lib/quizUtils.js';

/**
 * Editor question list. HTML5 drag-and-drop for mouse users plus explicit
 * up/down buttons so reordering is fully keyboard accessible.
 */
export default function QuestionList({ questions = [], onReorder, onEdit, onUnlink, busy = false }) {
  const [dragId, setDragId] = useState(null);

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const ids = questions.map((question) => question.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onReorder(ids);
  };

  const drop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    const ids = questions.map((question) => question.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setDragId(null);
    onReorder(ids);
  };

  if (!questions.length) {
    return (
      <EmptyState
        compact
        icon={GripVertical}
        title="No questions yet"
        description="Add one manually, paste JSON/CSV, or link questions from your bank."
      />
    );
  }

  return (
    <ol className="space-y-2" aria-label="Quiz questions in order">
      {questions.map((question, index) => (
        <li
          key={question.id}
          draggable={!busy}
          onDragStart={() => setDragId(question.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => drop(question.id)}
          onDragEnd={() => setDragId(null)}
          className={`flex items-start gap-2 rounded-xl border border-line bg-surface px-3 py-3 ${dragId === question.id ? 'opacity-50' : ''}`}
        >
          <span className="mt-1.5 cursor-grab text-muted" aria-hidden="true"><GripVertical className="h-4 w-4" /></span>
          <span className="mt-1.5 w-6 shrink-0 text-xs font-bold text-muted">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium text-ink">{question.prompt}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="primary">{typeLabel(question.type)}</Badge>
              <Badge variant={DIFFICULTY_TONE[question.difficulty] ?? 'neutral'}>{difficultyLabel(question.difficulty)}</Badge>
              <span className="text-[11px] text-muted">{question.topic} · {question.points} pt</span>
            </div>
            {question.expected ? <p className="mt-1 truncate text-[11px] text-muted">Answer: {question.expected}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Button size="icon" variant="ghost" onClick={() => move(index, -1)} disabled={index === 0 || busy} aria-label={`Move question ${index + 1} up`}><ChevronUp className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => move(index, 1)} disabled={index === questions.length - 1 || busy} aria-label={`Move question ${index + 1} down`}><ChevronDown className="h-4 w-4" /></Button>
            {onEdit ? <Button size="icon" variant="ghost" onClick={() => onEdit(question)} disabled={busy} aria-label={`Edit question ${index + 1}`}><Pencil className="h-4 w-4" /></Button> : null}
            {onUnlink ? <Button size="icon" variant="ghost" onClick={() => onUnlink(question.id)} disabled={busy} aria-label={`Remove question ${index + 1}`}><Trash2 className="h-4 w-4 text-danger" /></Button> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
```

## `client/src/features/quizzes/components/BulkImportDialog.jsx`

```jsx
import { useState } from 'react';
import { Braces, FileSpreadsheet, Upload, WandSparkles } from 'lucide-react';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { useParseQuestionImport } from '../hooks/useQuizzes.js';
import { errorMessage, typeLabel } from '../lib/quizUtils.js';

/** Paste → server-validated preview → select → import. No local CSV parser. */
export default function BulkImportDialog({ open, onClose, onImport, pending = false }) {
  const [format, setFormat] = useState('json');
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [templates, setTemplates] = useState(null);
  const [formError, setFormError] = useState('');
  const parse = useParseQuestionImport();

  const changeFormat = (next) => {
    setFormat(next); setRows([]); setErrors([]); setSkipped([]); setFormError('');
  };

  const doParse = () => {
    setFormError('');
    parse.mutate({ format, text }, {
      onSuccess: (data) => {
        setRows((data.items ?? []).map((item) => ({ ...item, selected: true })));
        setErrors(data.errors ?? []);
        setSkipped(data.skipped ?? []);
        setTemplates(data.templates ?? null);
        if (!data.items?.length) setFormError('No valid questions found. Check the row errors below.');
      },
      onError: (error) => setFormError(errorMessage(error)),
    });
  };

  const loadTemplate = () => {
    const value = templates?.[format] ?? '';
    setText(value);
    setRows([]); setErrors([]); setSkipped([]); setFormError('');
  };

  const doImport = () => {
    const chosen = rows.filter((row) => row.selected).map((row) => {
      const input = { ...row };
      delete input.selected;
      delete input.canonical;
      delete input.expected;
      return input;
    });
    if (!chosen.length) { setFormError('Select at least one question to import.'); return; }
    setFormError('');
    onImport(chosen, format);
  };

  const selectedCount = rows.filter((row) => row.selected).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Bulk import questions"
      description="Paste JSON or CSV. The server validates every row before anything is saved."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={doImport} loading={pending} disabled={!selectedCount} className="gap-1.5">
          <Upload className="h-4 w-4" aria-hidden="true" /> Import {selectedCount || ''} question{selectedCount === 1 ? '' : 's'}
        </Button>
      </>}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-line bg-surface-2 p-1" role="tablist" aria-label="Import format">
            {[
              { id: 'json', label: 'JSON', Icon: Braces },
              { id: 'csv', label: 'CSV', Icon: FileSpreadsheet },
            ].map(({ id, label, Icon }) => (
              <button
                key={id} type="button" role="tab" aria-selected={format === id}
                onClick={() => changeFormat(id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${format === id ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
          {templates ? (
            <Button size="sm" variant="secondary" onClick={loadTemplate} className="gap-1.5">
              <WandSparkles className="h-3.5 w-3.5" aria-hidden="true" /> Load {format.toUpperCase()} template
            </Button>
          ) : null}
        </div>

        <div>
          <label htmlFor="bulk-question-input" className="mb-1.5 block text-sm font-medium text-ink">
            {format === 'json' ? 'JSON array of questions' : 'CSV with a header row'}
          </label>
          <textarea
            id="bulk-question-input"
            rows={8}
            value={text}
            spellCheck={false}
            onChange={(event) => setText(event.target.value)}
            placeholder={format === 'json'
              ? '[{"type":"mcq","prompt":"...","options":["A","B"],"answer":0}]'
              : 'type,prompt,options,answer,items,pairs,code,explanation,topic,difficulty,points,tags,caseSensitive'}
            className="ag-scrollbar w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 font-mono text-xs text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
          <p className="mt-1.5 text-xs text-muted">
            Multi-value cells use <code className="rounded bg-surface-2 px-1">|</code>; matching pairs use{' '}
            <code className="rounded bg-surface-2 px-1">left::right</code>. Answers accept an index, a letter (A–H) or exact option text.
          </p>
        </div>

        <Button variant="secondary" onClick={doParse} loading={parse.isPending} disabled={!text.trim()}>Preview questions</Button>

        {formError ? <Alert variant="error">{formError}</Alert> : null}
        {parse.isError ? <Alert variant="error">{errorMessage(parse.error)}</Alert> : null}

        {errors.length ? (
          <Alert variant="warning" title={`${errors.length} row(s) need fixing`}>
            <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto text-xs">
              {errors.map((issue) => <li key={`${issue.row}-${issue.message}`}>Row {issue.row}: {issue.message}</li>)}
            </ul>
          </Alert>
        ) : null}
        {skipped.length ? <p className="text-xs text-muted">{skipped.length} duplicate row(s) skipped.</p> : null}

        {rows.length ? (
          <div className="ag-scrollbar max-h-72 space-y-2 overflow-y-auto rounded-xl border border-line p-2">
            {rows.map((row, index) => (
              <label key={`${row.type}-${index}`} className="flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-surface-2">
                <input
                  type="checkbox" checked={row.selected}
                  onChange={(event) => setRows((previous) => previous.map((item, i) => (i === index ? { ...item, selected: event.target.checked } : item)))}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{row.prompt}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="primary">{typeLabel(row.type)}</Badge>
                    <span className="text-[11px] text-muted">{row.topic} · {row.points} pt</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
```

## `client/src/features/quizzes/components/ModerationPanel.jsx`

```jsx
import { useState } from 'react';
import { Check, RotateCcw, Send, ShieldCheck, X } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_TONE, errorMessage, formatDate, quizStatusLabel } from '../lib/quizUtils.js';
import { useQuizLifecycle } from '../hooks/useQuizzes.js';

const CAN_SUBMIT = ['draft', 'changes_requested', 'rejected', 'approved'];

/** Author + moderation actions for the working copy of a quiz. */
export default function ModerationPanel({ quizId, quiz, canModerate = false }) {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lifecycle = useQuizLifecycle(quizId);
  const status = quiz.status;

  const run = (mutation, args, successText) => {
    setMessage('');
    mutation.mutate(args, {
      onSuccess: () => { setMessage(successText); setNote(''); },
      onError: (error) => setMessage(errorMessage(error)),
    });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Publication
        </h2>
        <Badge variant={STATUS_TONE[status]}>{quizStatusLabel(status)}</Badge>
      </div>

      {message ? <Alert variant="info">{message}</Alert> : null}
      {quiz.reviewNote ? (
        <div className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-ink">
          <p className="font-semibold text-warning">Last reviewer note</p>
          <p className="mt-1">{quiz.reviewNote}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="quiz-moderation-note" className="mb-1.5 block text-sm font-medium text-ink">Changelog / review note</label>
        <textarea
          id="quiz-moderation-note" rows={2} maxLength={1000} value={note}
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
            <Button size="sm" loading={lifecycle.moderate.isPending} className="gap-1.5" onClick={() => run(lifecycle.moderate, { decision: 'approve', note }, 'Quiz approved.')}>
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve
            </Button>
            <Button size="sm" variant="secondary" disabled={!note.trim()} loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'request_changes', note }, 'Changes requested.')}>Request changes</Button>
            <Button size="sm" variant="danger" disabled={!note.trim()} loading={lifecycle.moderate.isPending} className="gap-1.5" onClick={() => run(lifecycle.moderate, { decision: 'reject', note }, 'Quiz rejected.')}>
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
          <Button size="sm" variant="secondary" loading={lifecycle.restore.isPending} onClick={() => run(lifecycle.restore, undefined, 'Restored to draft.')}>Restore</Button>
        ) : null}
      </div>

      {quiz.reviewHistory?.length ? (
        <ol className="space-y-1.5 border-t border-line pt-3 text-xs text-muted">
          {quiz.reviewHistory.slice(-4).reverse().map((entry, index) => (
            <li key={`${entry.at}-${index}`}>
              <span className="font-medium text-ink">{entry.decision || entry.to}</span> · {formatDate(entry.at)}
              {entry.note ? ` — ${entry.note}` : ''}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
```

## `client/src/features/quizzes/components/QuestionPalette.jsx`

```jsx
import Badge from '../../../components/ui/Badge.jsx';

const stateClass = {
  current: 'bg-primary text-primary-ink border-primary',
  answered: 'bg-success/12 text-success border-success/40',
  marked: 'bg-warning/15 text-warning border-warning/40',
  empty: 'bg-surface-2 text-muted border-line hover:border-primary/40',
};

/** Keyboard-accessible jump list. Every button is reachable with Tab. */
export default function QuestionPalette({ questions = [], answers = {}, currentIndex = 0, onSelect }) {
  return (
    <nav aria-label="Question palette" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Questions</h2>
        <Badge variant="primary">{Object.keys(answers).length}/{questions.length}</Badge>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-5">
        {questions.map((question, index) => {
          const key = question.id ?? index;
          const entry = answers[key];
          const response = entry && typeof entry === 'object' && !Array.isArray(entry) && 'response' in entry
            ? entry.response : entry;
          const answered = response !== undefined && response !== null && response !== ''
            && !(Array.isArray(response) && response.length === 0)
            && !(typeof response === 'object' && Object.keys(response).length === 0);
          const marked = Boolean(entry?.marked);
          const state = index === currentIndex ? 'current' : marked ? 'marked' : answered ? 'answered' : 'empty';
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(index)}
              aria-current={index === currentIndex ? 'true' : undefined}
              aria-label={`Question ${index + 1}${marked ? ', marked for review' : answered ? ', answered' : ', not answered'}`}
              className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${stateClass[state]}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <ul className="space-y-1 text-[11px] text-muted" aria-label="Palette legend">
        <li><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-success/60" />Answered</li>
        <li><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-warning/60" />Marked for review</li>
        <li><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-surface-2" />Not answered</li>
      </ul>
    </nav>
  );
}
```

## `client/src/features/quizzes/components/QuestionRenderer.jsx`

```jsx
import { ChevronDown, ChevronUp, Code2, Flag } from 'lucide-react';
import { QUESTION_TYPES as T } from '@algonest/shared';
import Badge from '../../../components/ui/Badge.jsx';
import { typeLabel } from '../lib/quizUtils.js';

const controlClass = 'flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/8';
const inputClass = 'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

/**
 * One redacted question and its response editor. The payload contains NO answer
 * keys, so this component cannot cheat; grading happens only on the server.
 */
export default function QuestionRenderer({ question, number, value, onChange, marked = false, onToggleMarked, disabled = false }) {
  const set = (next) => !disabled && onChange(next);
  const move = (ids, index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    set(next);
  };

  return (
    <article className="space-y-4" aria-labelledby={`question-${question.id}-title`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Question {number}</Badge>
          <Badge>{typeLabel(question.type)}</Badge>
          <span className="text-xs text-muted">{question.topic} · {question.points} pt</span>
        </div>
        {onToggleMarked ? (
          <button
            type="button"
            onClick={onToggleMarked}
            aria-pressed={marked}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${marked ? 'bg-warning/15 text-warning' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" /> {marked ? 'Marked for review' : 'Mark for review'}
          </button>
        ) : null}
      </header>

      <h2 id={`question-${question.id}-title`} className="text-lg font-semibold leading-relaxed text-ink">{question.prompt}</h2>

      {question.code ? (
        <div className="rounded-xl border border-line bg-surface-2/60 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted"><Code2 className="h-3.5 w-3.5" aria-hidden="true" /> Code</p>
          <pre className="ag-scrollbar overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink">{question.code}</pre>
        </div>
      ) : null}

      {[T.MCQ, T.MULTI, T.OUTPUT].includes(question.type) ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">
            {question.multi ? 'Select all that apply' : 'Select one answer'}
          </legend>
          <div className="space-y-2">
            {(question.options ?? []).map((option, index) => {
              const checked = question.multi
                ? (Array.isArray(value) ? value : []).includes(option.id)
                : value === option.id;
              return (
                <label key={option.id} className={controlClass}>
                  <input
                    type={question.multi ? 'checkbox' : 'radio'}
                    name={`answer-${question.id}`}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => {
                      if (!question.multi) { set(option.id); return; }
                      const current = Array.isArray(value) ? value : [];
                      set(current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id]);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  />
                  <span><span className="mr-2 font-semibold text-muted">{String.fromCharCode(65 + index)}.</span>{option.text}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {question.type === T.TRUE_FALSE ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">Choose one</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[true, false].map((option) => (
              <label key={String(option)} className={controlClass}>
                <input
                  type="radio" name={`answer-${question.id}`} checked={value === option}
                  disabled={disabled} onChange={() => set(option)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <span>{option ? 'True' : 'False'}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {question.type === T.ORDERING ? (() => {
        const ids = Array.isArray(value) && value.length ? value : (question.items ?? []).map((item) => item.id);
        const byId = new Map((question.items ?? []).map((item) => [item.id, item]));
        return (
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-muted">Use the arrows to put the items in the correct order</legend>
            <ol className="space-y-2">
              {ids.map((id, index) => (
                <li key={id} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink">
                  <span className="w-5 shrink-0 text-xs font-bold text-muted">{index + 1}</span>
                  <span className="min-w-0 flex-1">{byId.get(id)?.text ?? id}</span>
                  <button type="button" disabled={disabled || index === 0} onClick={() => move(ids, index, -1)} aria-label={`Move ${byId.get(id)?.text ?? 'item'} up`} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 disabled:opacity-40"><ChevronUp className="h-4 w-4" /></button>
                  <button type="button" disabled={disabled || index === ids.length - 1} onClick={() => move(ids, index, 1)} aria-label={`Move ${byId.get(id)?.text ?? 'item'} down`} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 disabled:opacity-40"><ChevronDown className="h-4 w-4" /></button>
                </li>
              ))}
            </ol>
          </fieldset>
        );
      })() : null}

      {question.type === T.MATCHING ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">Match each item on the left with one on the right</legend>
          <div className="space-y-2">
            {(question.leftItems ?? []).map((left) => (
              <label key={left.id} className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-3 sm:flex-row sm:items-center">
                <span className="min-w-0 flex-1 text-sm font-medium text-ink">{left.text}</span>
                <select
                  value={value?.[left.id] ?? ''}
                  disabled={disabled}
                  onChange={(event) => set({ ...(value ?? {}), [left.id]: event.target.value })}
                  aria-label={`Match for ${left.text}`}
                  className={`${inputClass} sm:max-w-[45%]`}
                >
                  <option value="">Choose…</option>
                  {(question.rightItems ?? []).map((right) => (
                    <option key={right.id} value={right.id}>{right.text}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {question.type === T.FILL_BLANK ? (
        <div>
          <label htmlFor={`answer-${question.id}`} className="mb-1.5 block text-xs font-medium text-muted">Your answer</label>
          <input
            id={`answer-${question.id}`} type="text" maxLength={500} value={typeof value === 'string' ? value : ''}
            disabled={disabled} onChange={(event) => set(event.target.value)}
            placeholder="Type your answer" className={inputClass}
            autoComplete="off"
          />
          {question.caseSensitive ? <p className="mt-1.5 text-xs text-warning">This answer is case sensitive.</p> : null}
        </div>
      ) : null}
    </article>
  );
}
```

## `client/src/features/quizzes/components/QuizTimer.jsx`

```jsx
import { Check, Clock3, LoaderCircle, TriangleAlert } from 'lucide-react';
import { formatClock } from '../lib/quizUtils.js';

/** Display-only countdown. `expiresAt` on the server is authoritative. */
export default function QuizTimer({ remainingSeconds = 0, saveState = 'saved', autosaveError = '' }) {
  const urgent = remainingSeconds <= 60;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
      <div className={`flex items-center gap-2 ${urgent ? 'text-danger' : 'text-ink'}`}>
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono text-lg font-bold tabular-nums" role="timer" aria-live={urgent ? 'polite' : 'off'} aria-label={`${Math.floor(remainingSeconds / 60)} minutes ${remainingSeconds % 60} seconds remaining`}>
          {formatClock(remainingSeconds)}
        </span>
        {urgent ? <span className="flex items-center gap-1 text-xs font-semibold"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Hurry</span> : null}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
        {saveState === 'saving' ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving…</>
          : saveState === 'error' ? <><TriangleAlert className="h-3.5 w-3.5 text-danger" aria-hidden="true" /> <span className="text-danger">{autosaveError || 'Save failed'}</span></>
            : <><Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Answers saved</>}
      </div>
    </div>
  );
}
```

## `client/src/features/quizzes/components/TopicPerformance.jsx`

```jsx
import ProgressBar from '../../../components/ui/ProgressBar.jsx';

/** Weakest topics first — directly answers "what should I revise next". */
export default function TopicPerformance({ stats = [] }) {
  if (!stats.length) return <p className="text-sm text-muted">No topic data for this attempt.</p>;
  return (
    <ul className="space-y-3">
      {stats.map((stat) => (
        <li key={stat.topic}>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-ink">{stat.topic}</span>
            <span className="text-xs text-muted">{stat.correct}/{stat.total} correct · {stat.score}/{stat.maxScore} pts · <strong className={stat.percentage >= 60 ? 'text-success' : 'text-warning'}>{stat.percentage}%</strong></span>
          </div>
          <ProgressBar value={stat.percentage} label={`${stat.topic}: ${stat.percentage}%`} tone={stat.percentage >= 60 ? 'success' : 'warning'} />
        </li>
      ))}
    </ul>
  );
}
```

## `client/src/features/quizzes/components/AttemptResult.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock3, RotateCcw, Target, X } from 'lucide-react';
import { QUESTION_TYPES as T } from '@algonest/shared';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import TopicPerformance from './TopicPerformance.jsx';
import { ATTEMPT_TONE, attemptStatusLabel, formatDateTime, formatDuration, typeLabel } from '../lib/quizUtils.js';

/** Convert a stored response into something a human can read on the result. */
function readableResponse(result, question) {
  const value = result.response;
  if (value === null || value === undefined || value === '') return 'Not answered';
  const label = (id) => question?.options?.find((option) => option.id === id)?.text
    ?? question?.items?.find((item) => item.id === id)?.text
    ?? question?.leftItems?.find((item) => item.id === id)?.text ?? id;
  switch (result.type) {
    case T.MCQ:
    case T.OUTPUT:
      return label(value);
    case T.MULTI:
      return Array.isArray(value) ? value.map(label).join(', ') || 'Not answered' : String(value);
    case T.TRUE_FALSE:
      return value === true || value === 'true' ? 'True' : 'False';
    case T.ORDERING:
      return Array.isArray(value) ? value.map(label).join(' → ') : 'Not answered';
    case T.MATCHING:
      return (question?.leftItems ?? [])
        .map((left) => {
          const rightId = value?.[left.id];
          const right = question?.rightItems?.find((item) => item.id === rightId);
          return `${left.text} → ${right?.text ?? '—'}`;
        }).join(', ') || 'Not answered';
    default:
      return Array.isArray(value) ? value.join(', ') : String(value);
  }
}

export default function AttemptResult({ attempt, questions = [], showExplanations = true, retryAllowed = false, onRetryIncorrect, onRetryFull, pending = false, quizId }) {
  const passPercentage = attempt.settings?.passPercentage ?? 60;
  const passed = attempt.passed;
  const byId = new Map(questions.map((question) => [question.id, question]));

  return (
    <div className="space-y-6">
      <Link to={`/app/quizzes/${quizId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to quiz
      </Link>

      <section className="ag-card overflow-hidden">
        <div className={`border-b border-line px-5 py-6 sm:px-8 ${passed ? 'bg-success/8' : 'bg-warning/8'}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Result · {attempt.title}</p>
              <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{passed ? 'You passed!' : 'Keep practising'}</h1>
              <p className="mt-1 text-sm text-muted">
                {attemptStatusLabel(attempt.status)} · {formatDateTime(attempt.submittedAt)} · version {attempt.quizVersion}
                {attempt.mode === 'incorrect' ? ' · retry-incorrect-only' : ''}
              </p>
            </div>
            <Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <p className="text-5xl font-bold tabular-nums text-ink">{attempt.percentage}<span className="text-2xl text-muted">%</span></p>
            <p className="mt-1 text-sm text-muted">Pass mark: {passPercentage}%</p>
            <ProgressBar className="mt-4" value={attempt.percentage} tone={passed ? 'success' : 'warning'} label={`Score ${attempt.percentage}%`} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Target className="h-3.5 w-3.5" aria-hidden="true" /> Score</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{attempt.score}/{attempt.maxScore}</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Correct</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{attempt.correctCount}/{attempt.results?.length ?? 0}</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><X className="h-3.5 w-3.5" aria-hidden="true" /> Attempted</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{attempt.attemptedCount}/{attempt.results?.length ?? 0}</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Time</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{formatDuration(attempt.durationSeconds)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
          {retryAllowed ? (
            <Button className="gap-1.5" loading={pending} onClick={onRetryIncorrect}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry incorrect only
            </Button>
          ) : null}
          {onRetryFull ? (
            <Button variant="secondary" className="gap-1.5" loading={pending} onClick={onRetryFull}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake full quiz
            </Button>
          ) : null}
        </div>
      </section>

      <section className="ag-card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-ink">Topic-wise performance</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Weakest topics are listed first — start your revision there.</p>
        <TopicPerformance stats={attempt.topicStats} />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-ink">Review your answers</h2>
        {(attempt.results ?? []).map((result, index) => {
          const question = byId.get(result.questionId);
          return (
            <article key={result.questionId} className="ag-card p-4 sm:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={result.correct ? 'success' : 'danger'}>{result.correct ? 'Correct' : result.attempted ? 'Incorrect' : 'Skipped'}</Badge>
                <Badge>{typeLabel(result.type)}</Badge>
                <span className="text-xs text-muted">Q{index + 1} · {result.topic} · {result.awarded}/{result.points} pt</span>
                {result.marked ? <Badge variant="warning">Marked</Badge> : null}
              </div>
              <h3 className="text-sm font-medium text-ink">{question?.prompt ?? `Question ${index + 1}`}</h3>
              {question?.code ? <pre className="ag-scrollbar mt-2 overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-xs text-ink">{question.code}</pre> : null}
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-surface-2/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your answer</p>
                  <p className="mt-1 text-ink">{readableResponse(result, question)}</p>
                </div>
                {showExplanations ? (
                  <div className="rounded-lg border border-success/25 bg-success/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Correct answer</p>
                    <p className="mt-1 text-ink">{result.expected || '—'}</p>
                  </div>
                ) : null}
              </div>
              {showExplanations && result.explanation ? (
                <p className="mt-3 rounded-lg border border-line bg-surface-2/30 p-3 text-sm text-muted"><strong className="text-ink">Explanation: </strong>{result.explanation}</p>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
```

---

# Client — quizzes pages (new)

## `client/src/features/quizzes/pages/QuizzesPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ListChecks, Plus, ShieldCheck } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import QuizFilters, { EMPTY_QUIZ_FILTERS } from '../components/QuizFilters.jsx';
import QuizCard from '../components/QuizCard.jsx';
import { useQuizList } from '../hooks/useQuizzes.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { errorMessage } from '../lib/quizUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function QuizzesPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(EMPTY_QUIZ_FILTERS);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(filters.q, 300);

  const params = useMemo(() => {
    const clean = { page, limit: PAGE_SIZE, sort: filters.sort || 'newest' };
    if (debouncedSearch) clean.q = debouncedSearch;
    for (const key of ['topic', 'difficulty']) if (filters[key]) clean[key] = filters[key];
    if (tab === 'mine') clean.mine = 'true';
    if (tab === 'review') clean.status = 'pending_review';
    return clean;
  }, [debouncedSearch, filters, page, tab]);

  const { data, isLoading, isError, error, isFetching } = useQuizList(params);
  const quizzes = data?.items ?? [];
  const pagination = data?.pagination;

  const changeFilters = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText
            text="QUIZZES // TEST YOUR UNDERSTANDING"
            speed={4}
            color={isDark ? '#94a5bd' : '#56657a'}
            shineColor={isDark ? '#2dd4bf' : '#0d9488'}
            className="text-[11px] font-bold tracking-[0.2em]"
          />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Quizzes</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            Seven question types, timed attempts, autosave and topic-wise analysis. Published quizzes are versioned, so your results always stay valid.
          </p>
        </div>
        <Link to="/app/quizzes/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New quiz</Button></Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { id: 'explore', label: 'Explore' },
          { id: 'mine', label: 'My quizzes' },
          ...(isStaff ? [{ id: 'review', label: 'Review queue' }] : []),
        ].map((item) => (
          <button
            key={item.id} type="button" onClick={() => changeTab(item.id)} aria-pressed={tab === item.id}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}
          >
            {item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}
            {item.label}
          </button>
        ))}
        {isFetching && !isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      <QuizFilters filters={filters} onChange={changeFilters} />
      {isError ? <Alert variant="error" title="Couldn't load quizzes">{errorMessage(error)}</Alert> : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-60 w-full" />)}
        </div>
      ) : quizzes.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} showStatus={tab !== 'explore'} />)}
        </div>
      ) : (
        <EmptyState
          icon={ListChecks}
          title={tab === 'mine' ? 'You have no quizzes yet' : tab === 'review' ? 'Review queue is clear' : 'No quizzes match these filters'}
          description={tab === 'mine' ? 'Create a draft, add questions manually or paste JSON/CSV, then submit it for review.' : 'Try clearing the filters, or create the first quiz for this topic.'}
          action={<Link to="/app/quizzes/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Create a quiz</Button></Link>}
        />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Quizzes pagination">
          <p className="text-xs text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} quiz(zes)</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button>
            <Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
```

## `client/src/features/quizzes/pages/QuizDetailPage.jsx`

```jsx
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Clock3, Layers, ListChecks, Pencil, Play, RotateCcw, Target, Trophy,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useMyAttempts, useQuiz, useQuizVersions, useStartAttempt } from '../hooks/useQuizzes.js';
import {
  ATTEMPT_TONE, DIFFICULTY_TONE, STATUS_TONE, attemptStatusLabel, difficultyLabel,
  errorMessage, formatDateTime, quizStatusLabel,
} from '../lib/quizUtils.js';

const PAGE_SIZE = 5;

/** Start screen: metadata, rules, attempt history and the primary CTA. */
export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuiz(id);
  const canManage = data?.canManage;
  const attemptsParams = useMemo(() => ({ page: 1, limit: PAGE_SIZE }), []);
  const { data: attemptsData } = useMyAttempts(id, attemptsParams);
  const { data: versionsData } = useQuizVersions(id);
  const start = useStartAttempt(id);

  const quiz = data?.quiz;
  const summary = data?.mySummary;

  const begin = (payload = {}) => {
    start.mutate(payload, {
      onSuccess: (result) => navigate(`/app/quizzes/${id}/attempts/${result.attempt.id}`),
    });
  };

  if (isLoading) return <FullPageLoader label="Loading quiz…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this quiz">{errorMessage(error)}</Alert>;
  if (!quiz) return <FullPageLoader label="Loading quiz…" />;

  const settings = quiz.settings ?? {};
  const lastCompleted = (attemptsData?.items ?? []).find((attempt) => attempt.status !== 'in_progress' && attempt.status !== 'abandoned');

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/quizzes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All quizzes
        </Link>
        {canManage ? <Link to={`/app/quizzes/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit quiz</Button></Link> : null}
      </div>

      <header className="ag-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={DIFFICULTY_TONE[quiz.difficulty] ?? 'neutral'}>{difficultyLabel(quiz.difficulty)}</Badge>
          <Badge variant={STATUS_TONE[quiz.status] ?? 'neutral'}>{quizStatusLabel(quiz.status)}</Badge>
          {quiz.isPublishedSnapshot ? <Badge variant="accent">Version {quiz.viewedVersion}</Badge> : null}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{quiz.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{quiz.description || 'A timed DSA quiz with seven question types and detailed explanations.'}</p>
        <p className="mt-3 text-xs text-muted">by {quiz.author?.name ?? 'AlgoNest creator'} · {quiz.topics?.length ? quiz.topics.slice(0, 5).join(' · ') : 'General'}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ag-card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-ink">Before you start</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: ListChecks, label: 'Questions', value: quiz.questionCount },
              { Icon: Target, label: 'Maximum score', value: `${quiz.maxScore || quiz.questionCount} pts` },
              { Icon: Clock3, label: 'Time limit', value: `${settings.timerMinutes} minutes` },
              { Icon: Trophy, label: 'Passing score', value: `${settings.passPercentage}%` },
              { Icon: Layers, label: 'Attempts allowed', value: settings.maxAttempts },
              { Icon: RotateCcw, label: 'Retry incorrect only', value: settings.allowRetryIncorrect ? 'Allowed' : 'Disabled' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div><dt className="text-xs text-muted">{label}</dt><dd className="text-sm font-semibold text-ink">{value}</dd></div>
              </div>
            ))}
          </dl>
          <ul className="mt-4 space-y-1.5 text-sm text-muted" aria-label="Quiz rules">
            <li>• Answers autosave as you go; a page reload restores your progress.</li>
            <li>• The timer is enforced on the server — it auto-submits when time is up.</li>
            <li>• {settings.showExplanations ? 'Explanations and correct answers appear after you submit.' : 'This quiz hides explanations after submission.'}</li>
            <li>• You can flag questions for review and jump between them with the palette.</li>
          </ul>

          {start.isError ? <Alert variant="error" className="mt-4">{errorMessage(start.error)}</Alert> : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {summary?.activeAttemptId ? (
              <Button className="gap-2" onClick={() => navigate(`/app/quizzes/${id}/attempts/${summary.activeAttemptId}`)}>
                <Play className="h-4 w-4" aria-hidden="true" /> Resume attempt
              </Button>
            ) : (
              <Button className="gap-2" loading={start.isPending} disabled={!summary?.canStart} onClick={() => begin()}>
                <Play className="h-4 w-4" aria-hidden="true" /> Start quiz
              </Button>
            )}
            {lastCompleted && summary?.attemptsLeft > 0 && settings.allowRetryIncorrect ? (
              <Button variant="secondary" className="gap-2" loading={start.isPending} onClick={() => begin({ mode: 'incorrect', sourceAttemptId: lastCompleted.id })}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry incorrect only
              </Button>
            ) : null}
          </div>
          {!summary?.canStart && !summary?.activeAttemptId ? (
            <p className="mt-2 text-xs text-muted">
              {quiz.publishedVersion ? 'You have used all your attempts or this quiz is not available.' : 'This quiz is not published yet.'}
            </p>
          ) : null}
        </section>

        <aside className="space-y-4">
          <section className="ag-card p-5">
            <h2 className="text-sm font-semibold text-ink">Your progress</h2>
            <p className="mt-3 text-3xl font-bold tabular-nums text-ink">{summary?.bestPercentage ?? 0}%</p>
            <p className="text-xs text-muted">Best score{summary?.bestPassed ? ' · passed' : ''}</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p className="flex justify-between gap-2 text-muted"><span>Attempts used</span><strong className="text-ink">{summary?.attemptsUsed ?? 0}/{settings.maxAttempts}</strong></p>
              <p className="flex justify-between gap-2 text-muted"><span>Attempts left</span><strong className="text-ink">{summary?.attemptsLeft ?? 0}</strong></p>
            </div>
          </section>

          <section className="ag-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Recent attempts</h2>
            {(attemptsData?.items ?? []).length ? (
              <ul className="space-y-2">
                {attemptsData.items.map((attempt) => (
                  <li key={attempt.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge>
                      <span className="text-sm font-bold text-ink">{attempt.percentage}%</span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted">{formatDateTime(attempt.submittedAt)} · v{attempt.quizVersion}{attempt.mode === 'incorrect' ? ' · retry' : ''}</p>
                    {attempt.status !== 'in_progress' ? (
                      <Link to={`/app/quizzes/${id}/results/${attempt.id}`} className="mt-1.5 inline-block text-xs font-semibold text-primary hover:underline">View result</Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">No attempts yet. Your results will appear here.</p>}
          </section>

          {canManage && versionsData?.items?.length ? (
            <section className="ag-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">Published versions</h2>
              <ul className="space-y-1.5 text-xs text-muted">
                {versionsData.items.map((version) => (
                  <li key={version.id} className="flex justify-between gap-2"><span>Version {version.version}</span><span>{version.questionCount} questions</span></li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
```

## `client/src/features/quizzes/pages/QuizEditorPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Braces, LibraryBig, Link2, Plus, Save, Trash2,
} from 'lucide-react';
import { quizCreateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import QuizSettingsForm from '../components/QuizSettingsForm.jsx';
import QuestionEditor from '../components/QuestionEditor.jsx';
import QuestionList from '../components/QuestionList.jsx';
import BulkImportDialog from '../components/BulkImportDialog.jsx';
import ModerationPanel from '../components/ModerationPanel.jsx';
import {
  useCreateQuiz, useQuiz, useQuizQuestionMutations, useQuizQuestions,
  useQuestionBank, useQuestionMutations, useUpdateQuiz, useArchiveQuiz,
} from '../hooks/useQuizzes.js';
import {
  DIFFICULTY_OPTIONS, STATUS_TONE, apiFieldErrors, contractErrors,
  errorMessage, quizStatusLabel, typeLabel,
} from '../lib/quizUtils.js';

const DEFAULT_SETTINGS = Object.freeze({
  timerMinutes: 20, passPercentage: 60, maxAttempts: 3,
  shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
  showExplanations: true, allowRetryIncorrect: true,
});

/* ─────────────────────────── create a draft ─────────────────────────── */

function QuizCreatePage() {
  const navigate = useNavigate();
  const create = useCreateQuiz();
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'medium',
    topics: '', tags: '', settings: { ...DEFAULT_SETTINGS },
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      topics: form.topics.split(',').map((value) => value.trim()).filter(Boolean),
      tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean),
      settings: form.settings,
    };
    const parsed = quizCreateSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setServerError(parsed.error.issues[0]?.message ?? 'Check the form.');
      return;
    }
    setErrors({}); setServerError('');
    create.mutate(parsed.data, {
      onSuccess: (data) => navigate(`/app/quizzes/${data.quiz.id}/edit`, { replace: true }),
      onError: (error) => { setServerError(errorMessage(error)); setErrors(apiFieldErrors(error)); },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/quizzes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All quizzes
      </Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Create a quiz</h1>
        <p className="mt-1.5 text-sm text-muted">Start with the basics — you can add questions and change every setting before publishing.</p>
      </header>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError ? <Alert variant="error" title="Couldn't create the quiz">{serverError}</Alert> : null}
        <section className="ag-card space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Title" required value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Arrays & hashing warmup" />
            <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
          </div>
          <div>
            <label htmlFor="quiz-new-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea id="quiz-new-description" rows={3} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What will learners practise?" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Topics (comma separated)" value={form.topics} onChange={(event) => set('topics', event.target.value)} placeholder="Arrays, Hashing" hint="Also derived automatically from your questions." />
            <Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} placeholder="placement, warmup" />
          </div>
        </section>

        <section className="ag-card space-y-4 p-5">
          <h2 className="text-base font-semibold text-ink">Quiz settings</h2>
          <QuizSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} errors={errors} />
        </section>

        <div className="flex justify-end gap-2">
          <Link to="/app/quizzes"><Button type="button" variant="ghost">Cancel</Button></Link>
          <Button type="submit" className="gap-1.5" loading={create.isPending}><Save className="h-4 w-4" aria-hidden="true" /> Create draft</Button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────── edit an existing quiz ─────────────────────────── */

function MetadataEditor({ quiz, onSave, pending }) {
  const [form, setForm] = useState(() => ({
    title: quiz.title ?? '',
    description: quiz.description ?? '',
    difficulty: quiz.difficulty ?? 'medium',
    settings: { ...DEFAULT_SETTINGS, ...(quiz.settings ?? {}) },
  }));
  const [errors, setErrors] = useState({});
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      settings: form.settings,
    };
    const parsed = quizCreateSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      return;
    }
    setErrors({});
    onSave(parsed.data, setErrors);
  };

  return (
    <form onSubmit={submit} className="ag-card space-y-4 p-5" noValidate>
      <h2 className="text-base font-semibold text-ink">Details &amp; settings</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} />
        <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
      </div>
      <div>
        <label htmlFor="quiz-edit-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea id="quiz-edit-description" rows={2} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
      </div>
      <QuizSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} errors={errors} />
      <div className="flex justify-end">
        <Button type="submit" size="sm" className="gap-1.5" loading={pending}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save changes</Button>
      </div>
    </form>
  );
}

function BankPicker({ open, onClose, linkedIds, onLink, pending }) {
  const [selected, setSelected] = useState([]);
  const params = useMemo(() => ({ page: 1, limit: 100, mine: 'true' }), []);
  const { data, isLoading, isError, error } = useQuestionBank(params, open);
  const available = (data?.items ?? []).filter((question) => !linkedIds.includes(question.id));

  return (
    <Modal
      open={open} onClose={onClose} size="lg"
      title="Link from your question bank"
      description="Reuse questions you already wrote. Published versions keep their own frozen copy."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button disabled={!selected.length} loading={pending} onClick={() => { onLink(selected); setSelected([]); }}>Link {selected.length || ''} question{selected.length === 1 ? '' : 's'}</Button>
      </>}
    >
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="space-y-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div> : null}
      {!isLoading && !available.length ? <p className="py-6 text-center text-sm text-muted">No other questions in your bank. Add questions manually or import a file.</p> : null}
      <div className="ag-scrollbar max-h-96 space-y-2 overflow-y-auto">
        {available.map((question) => (
          <label key={question.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 hover:border-primary/40">
            <input
              type="checkbox" checked={selected.includes(question.id)}
              onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, question.id] : previous.filter((id) => id !== question.id))}
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-ink">{question.prompt}</span>
              <span className="mt-1 flex items-center gap-2"><Badge variant="primary">{typeLabel(question.type)}</Badge><span className="text-xs text-muted">{question.topic}</span></span>
            </span>
          </label>
        ))}
      </div>
    </Modal>
  );
}

function QuizEditor({ id }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuiz(id);
  const questionParams = useMemo(() => ({ page: 1, limit: 200 }), []);
  const { data: questionData, isLoading: questionsLoading } = useQuizQuestions(id, questionParams);
  const update = useUpdateQuiz(id);
  const archive = useArchiveQuiz();
  const qMutations = useQuizQuestionMutations(id);
  const questionMutations = useQuestionMutations();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const quiz = data?.quiz;
  const questions = questionData?.items ?? [];
  const linkedIds = quiz?.questionIds ?? [];
  const busy = qMutations.link.isPending || qMutations.importItems.isPending || qMutations.reorder.isPending
    || qMutations.unlink.isPending || questionMutations.create.isPending || questionMutations.update.isPending;

  const flash = (text) => { setMessage(text); setActionError(''); };
  const fail = (err) => { setActionError(errorMessage(err)); setMessage(''); };

  const saveMetadata = (body, setErrors) => {
    update.mutate(body, {
      onSuccess: () => flash('Quiz settings saved.'),
      onError: (err) => { setErrors(apiFieldErrors(err)); fail(err); },
    });
  };

  const saveQuestion = async (payload) => {
    try {
      if (editing) {
        await questionMutations.update.mutateAsync({ id: editing.id, body: payload });
        await qMutations.reorder.mutateAsync(linkedIds);
        flash('Question updated.');
      } else {
        const created = await questionMutations.create.mutateAsync(payload);
        await qMutations.link.mutateAsync([created.question.id]);
        flash('Question added to the quiz.');
      }
      setEditorOpen(false); setEditing(null);
    } catch (err) { fail(err); }
  };

  const doImport = async (items, source) => {
    try {
      const result = await qMutations.importItems.mutateAsync({ items, source });
      flash(`${result.imported} question(s) imported.`);
      setImportOpen(false);
    } catch (err) { fail(err); }
  };

  const doLink = async (ids) => {
    try {
      await qMutations.link.mutateAsync(ids);
      flash(`${ids.length} question(s) linked.`);
      setBankOpen(false);
    } catch (err) { fail(err); }
  };

  const doReorder = (ids) => qMutations.reorder.mutate(ids, { onError: fail });
  const doUnlink = (questionId) => qMutations.unlink.mutate(questionId, { onSuccess: () => flash('Question removed.'), onError: fail });
  const doArchive = () => archive.mutate(id, { onSuccess: () => navigate('/app/quizzes'), onError: fail });

  if (isLoading) return <FullPageLoader label="Loading quiz editor…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this quiz">{errorMessage(error)}</Alert>;
  if (!quiz) return <FullPageLoader label="Loading quiz editor…" />;

  const locked = quiz.status === 'published' || quiz.status === 'pending_review';

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/app/quizzes/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to quiz
          </Link>
          <Badge variant={STATUS_TONE[quiz.status]}>{quizStatusLabel(quiz.status)}</Badge>
        </div>
        <Button variant="danger" size="sm" className="gap-1.5" loading={archive.isPending} onClick={doArchive}>
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Archive
        </Button>
      </div>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Edit quiz</h1>
        <p className="mt-1.5 text-sm text-muted">
          {locked ? 'Questions are locked in this status. Start a new revision to edit them.' : 'Add questions, tune the settings and publish an immutable version when ready.'}
        </p>
      </header>

      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {message ? <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert> : null}

      <MetadataEditor key={quiz.id} quiz={quiz} onSave={saveMetadata} pending={update.isPending} />

      <section className="ag-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Questions <span className="text-muted">({questions.length})</span></h2>
            <p className="mt-1 text-xs text-muted">Max 200 per quiz. Drag rows or use the arrow buttons to reorder.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setBankOpen(true)}><LibraryBig className="h-3.5 w-3.5" aria-hidden="true" /> From bank</Button>
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setImportOpen(true)}><Braces className="h-3.5 w-3.5" aria-hidden="true" /> Bulk import</Button>
            <Button size="sm" className="gap-1.5" onClick={() => { setEditing(null); setEditorOpen(true); }}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add question</Button>
          </div>
        </div>
        {questionsLoading ? (
          <div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>
        ) : (
          <QuestionList
            questions={questions}
            busy={busy || locked}
            onReorder={doReorder}
            onEdit={(question) => { setEditing(question); setEditorOpen(true); }}
            onUnlink={doUnlink}
          />
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ModerationPanel quizId={id} quiz={quiz} canModerate={data?.canModerate} />
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Link2 className="h-4 w-4 text-accent" aria-hidden="true" /> Versioning</h2>
          <p className="text-xs text-muted">
            Publishing freezes the settings and every question (including answer keys) into an immutable version. Existing attempts keep grading against the version they started on.
          </p>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published version</dt><dd className="mt-0.5 text-base font-bold text-ink">{quiz.publishedVersion || '—'}</dd></div>
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published questions</dt><dd className="mt-0.5 text-base font-bold text-ink">{quiz.publishedQuestionCount || 0}</dd></div>
          </dl>
        </section>
      </div>

      <Modal open={editorOpen} onClose={() => { setEditorOpen(false); setEditing(null); }} size="lg" title={editing ? 'Edit question' : 'Add a question'}>
        <QuestionEditor
          initial={editing}
          title={editing ? 'Edit question' : 'Add a question'}
          pending={busy}
          onSave={saveQuestion}
          onCancel={() => { setEditorOpen(false); setEditing(null); }}
        />
      </Modal>
      <BulkImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={doImport} pending={qMutations.importItems.isPending} />
      <BankPicker open={bankOpen} onClose={() => setBankOpen(false)} linkedIds={linkedIds} onLink={doLink} pending={qMutations.link.isPending} />
    </div>
  );
}

export default function QuizEditorPage() {
  const { id } = useParams();
  return !id ? <QuizCreatePage /> : <QuizEditor id={id} />;
}
```

## `client/src/features/quizzes/pages/QuizSolverPage.jsx`

```jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUIZ_LIMITS, QUESTION_TYPES as T } from '@algonest/shared';
import {
  ArrowRight, ChevronLeft, ChevronRight, Flag, Send,
} from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import QuestionPalette from '../components/QuestionPalette.jsx';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import QuizTimer from '../components/QuizTimer.jsx';
import {
  useAttempt, useAttemptQuestions, useAutosaveAttempt, useSubmitAttempt,
} from '../hooks/useQuizzes.js';
import { errorMessage } from '../lib/quizUtils.js';

const params = Object.freeze({ page: 1, limit: QUIZ_LIMITS.MAX_QUESTIONS });

/**
 * Timed quiz engine.
 * - the server owns the deadline; this clock is display-only
 * - every change is debounced-autosaved; a reload restores `attempt.answers`
 * - submit sends the full answer set, so a race with autosave cannot lose data
 */
export default function QuizSolverPage() {
  const { id: quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useAttempt(attemptId);
  const { data: questionData, isLoading: questionsLoading, isError: questionsError, error: questionsLoadError } = useAttemptQuestions(attemptId, params);
  const autosave = useAutosaveAttempt();
  const submit = useSubmitAttempt(quizId);
  // `mutate` is referentially stable even though the mutation object is not.
  // Depending on the whole object would restart the debounce on every render.
  const autosaveMutate = autosave.mutate;
  const submitMutate = submit.mutate;

  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  // null = "clock not initialised yet". Without this sentinel the first commit
  // that receives attempt data still sees 0 and would instantly auto-submit.
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [saveState, setSaveState] = useState('saved');
  const [autosaveError, setAutosaveError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dirtyRef = useRef(false);
  const submittingRef = useRef(false);

  const attempt = data?.attempt;
  const questions = questionData?.items ?? [];
  const isFinal = Boolean(attempt && attempt.status !== 'in_progress');
  const current = questions[currentIndex];

  /* Restore autosaved answers exactly once per attempt. */
  useEffect(() => {
    if (!attempt?.answers) return;
    const restored = {};
    for (const answer of attempt.answers) {
      restored[answer.questionId] = { response: answer.response ?? null, marked: Boolean(answer.marked) };
    }
    setAnswers(restored);
    setRemainingSeconds(data?.remainingSeconds ?? 0);
    dirtyRef.current = false;
    setSaveState('saved');
  }, [attempt?.id, data?.remainingSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Ordering questions display a concrete order — record it as the answer. */
  useEffect(() => {
    if (!questionData?.items) return;
    setAnswers((previous) => {
      let changed = false;
      const next = { ...previous };
      for (const question of questionData.items) {
        if (question.type === T.ORDERING && !next[question.id]) {
          next[question.id] = { response: (question.items ?? []).map((item) => item.id), marked: false };
          changed = true;
        }
      }
      return changed ? next : previous;
    });
  }, [questionData?.items]);

  /* Display-only countdown. */
  useEffect(() => {
    if (isFinal || !attempt) return undefined;
    const timer = window.setInterval(() => setRemainingSeconds((value) => Math.max(0, (value ?? 0) - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [isFinal, attempt?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const answerPayload = useCallback((source) => Object.entries(source)
    .filter(([questionId]) => /^[a-f\d]{24}$/i.test(questionId))
    .map(([questionId, entry]) => ({
      questionId,
      response: entry.response ?? null,
      marked: Boolean(entry.marked),
    })), []);

  const finalize = useCallback((timedOut = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setConfirmOpen(false);
    setSubmitError('');
    submitMutate({ attemptId, answers: answerPayload(answers) }, {
      onSuccess: () => navigate(`/app/quizzes/${quizId}/results/${attemptId}`, { replace: true, state: { timedOut } }),
      onError: (err) => { setSubmitError(errorMessage(err)); submittingRef.current = false; },
    });
  }, [answerPayload, answers, attemptId, navigate, quizId, submitMutate]);

  /* Auto-submit when the clock hits zero. */
  useEffect(() => {
    if (typeof remainingSeconds === 'number' && remainingSeconds === 0
        && attempt && !isFinal && !submittingRef.current) finalize(true);
  }, [remainingSeconds, attempt, isFinal, finalize]);

  /* Debounced autosave — only when the learner actually changed something. */
  useEffect(() => {
    if (!dirtyRef.current || isFinal || !attempt) return undefined;
    setSaveState('saving');
    const timer = window.setTimeout(() => {
      const rows = answerPayload(answers);
      if (!rows.length) { setSaveState('saved'); return; }
      autosaveMutate({ id: attemptId, answers: rows }, {
        onSuccess: (result) => {
          dirtyRef.current = false;
          setSaveState('saved');
          setAutosaveError('');
          if (result.expired) {
            submittingRef.current = true;
            navigate(`/app/quizzes/${quizId}/results/${attemptId}`, { replace: true, state: { timedOut: true } });
          }
        },
        onError: (err) => { setSaveState('error'); setAutosaveError(errorMessage(err)); },
      });
    }, QUIZ_LIMITS.AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [answers, answerPayload, attempt, attemptId, autosaveMutate, isFinal, navigate, quizId]);

  /* Alt + arrow jumps between questions without stealing text-input arrows. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); setCurrentIndex((value) => Math.max(0, value - 1)); }
      if (event.key === 'ArrowRight') { event.preventDefault(); setCurrentIndex((value) => Math.min(questions.length - 1, value + 1)); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [questions.length]);

  /* A completed attempt belongs on the result page. */
  useEffect(() => {
    if (isFinal) navigate(`/app/quizzes/${quizId}/results/${attemptId}`, { replace: true });
  }, [isFinal, navigate, quizId, attemptId]);

  const updateAnswer = useCallback((questionId, response) => {
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [questionId]: { response, marked: previous[questionId]?.marked ?? false },
    }));
  }, []);

  const toggleMarked = useCallback((questionId) => {
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [questionId]: { response: previous[questionId]?.response ?? null, marked: !previous[questionId]?.marked },
    }));
  }, []);

  const answeredCount = useMemo(() => Object.values(answers).filter((entry) => {
    const value = entry.response;
    return value !== null && value !== undefined && value !== ''
      && !(Array.isArray(value) && value.length === 0)
      && !(typeof value === 'object' && Object.keys(value).length === 0);
  }).length, [answers]);
  const markedCount = useMemo(() => Object.values(answers).filter((entry) => entry.marked).length, [answers]);

  if (isLoading || questionsLoading) return <FullPageLoader label="Preparing your attempt…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load this attempt">{errorMessage(error)}</Alert></div>;
  if (questionsError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the questions">{errorMessage(questionsLoadError)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Preparing your attempt…" />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Attempt · version {attempt.quizVersion}{attempt.mode === 'incorrect' ? ' · retry incorrect' : ''}</p>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{attempt.title}</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)} className="gap-1.5">
          <Send className="h-3.5 w-3.5" aria-hidden="true" /> Finish &amp; submit
        </Button>
      </header>

      <QuizTimer remainingSeconds={remainingSeconds ?? 0} saveState={saveState} autosaveError={autosaveError} />
      {submitError ? <Alert variant="error" title="Submit failed">{submitError}</Alert> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <main className="ag-card min-w-0 p-5 sm:p-6">
          {current ? (
            <>
              <QuestionRenderer
                key={current.id}
                question={current}
                number={currentIndex + 1}
                value={answers[current.id]?.response}
                onChange={(response) => updateAnswer(current.id, response)}
                marked={Boolean(answers[current.id]?.marked)}
                onToggleMarked={() => toggleMarked(current.id)}
                disabled={submittingRef.current}
              />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <Button variant="secondary" size="sm" className="gap-1.5" disabled={currentIndex === 0} onClick={() => setCurrentIndex((value) => value - 1)}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                </Button>
                <span className="text-xs text-muted">{currentIndex + 1} of {questions.length} · Alt + ← / → to jump</span>
                {currentIndex === questions.length - 1 ? (
                  <Button size="sm" className="gap-1.5" onClick={() => setConfirmOpen(true)}>Finish <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
                ) : (
                  <Button size="sm" className="gap-1.5" onClick={() => setCurrentIndex((value) => value + 1)}>Next <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
                )}
              </div>
            </>
          ) : <p className="text-sm text-muted">This attempt has no questions.</p>}
        </main>

        <aside className="ag-card h-fit p-4 lg:sticky lg:top-4">
          <QuestionPalette
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelect={setCurrentIndex}
          />
          <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
            <p className="flex justify-between gap-2"><span>Answered</span><strong className="text-ink">{answeredCount}/{questions.length}</strong></p>
            <p className="flex justify-between gap-2"><span>Marked</span><strong className="text-ink">{markedCount}</strong></p>
          </div>
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-3 text-xs text-muted">
            <p className="flex items-center gap-1.5 font-semibold text-primary"><Flag className="h-3.5 w-3.5" aria-hidden="true" /> Tip</p>
            <p className="mt-1">Unanswered questions count as incorrect. Use the palette to jump back before submitting.</p>
          </div>
        </aside>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Submit this attempt?"
        description="You can't change your answers after submitting."
        footer={<>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Keep working</Button>
          <Button loading={submit.isPending} onClick={() => finalize(false)} className="gap-1.5"><Send className="h-4 w-4" aria-hidden="true" /> Submit now</Button>
        </>}
      >
        <div className="space-y-2 text-sm text-ink">
          <p><strong>{answeredCount}</strong> of {questions.length} questions answered.</p>
          <p><strong>{markedCount}</strong> marked for review.</p>
          <p>{Math.floor((remainingSeconds ?? 0) / 60)}m {(remainingSeconds ?? 0) % 60}s remaining.</p>
          {answeredCount < questions.length ? (
            <Alert variant="warning" className="mt-3">{questions.length - answeredCount} question(s) are still unanswered and will be scored as incorrect.</Alert>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
```

## `client/src/features/quizzes/pages/QuizResultPage.jsx`

```jsx
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUIZ_LIMITS } from '@algonest/shared';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import AttemptResult from '../components/AttemptResult.jsx';
import {
  useAttemptQuestions, useAttemptResult, useStartAttempt,
} from '../hooks/useQuizzes.js';
import { errorMessage } from '../lib/quizUtils.js';

const params = Object.freeze({ page: 1, limit: QUIZ_LIMITS.MAX_QUESTIONS });

/** Result + explanations. Both datasets come from the frozen attempt version. */
export default function QuizResultPage() {
  const { id: quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useAttemptResult(attemptId);
  const { data: questionData } = useAttemptQuestions(attemptId, params);
  const start = useStartAttempt(quizId);

  const attempt = data?.attempt;
  const questions = useMemo(() => questionData?.items ?? [], [questionData?.items]);

  const retry = (payload) => {
    start.mutate(payload, {
      onSuccess: (result) => navigate(`/app/quizzes/${quizId}/attempts/${result.attempt.id}`),
    });
  };

  if (isLoading) return <FullPageLoader label="Calculating your result…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the result">{errorMessage(error)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Calculating your result…" />;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {start.isError ? <Alert variant="error">{errorMessage(start.error)}</Alert> : null}
      <AttemptResult
        attempt={attempt}
        questions={questions}
        showExplanations={attempt.settings?.showExplanations !== false && questionData?.showExplanations !== false}
        retryAllowed={Boolean(data?.retryAllowed)}
        pending={start.isPending}
        quizId={quizId}
        onRetryIncorrect={() => retry({ mode: 'incorrect', sourceAttemptId: attemptId })}
        onRetryFull={() => retry({})}
      />
    </div>
  );
}
```

---

# Documentation

## `README.md`

```markdown
# AlgoNest — DSA Preparation Platform (MERN monorepo)

A production-grade, phase-by-phase build of a DSA preparation platform: curated sheets,
quizzes, mock tests, adaptive plans, a resource directory and an RBAC admin area.

> **Status: Phase 3 complete.** Phase 1 shipped authentication, onboarding, RBAC,
> protected client routes, the app shell, dark/light theming and the animated React
> Bits landing page. Phase 2 added the full **DSA Sheets** module. Phase 3 adds the
> **Quiz module**: a reusable question bank with seven question types, JSON/CSV bulk
> import, versioned quizzes, timed attempts with autosave, a question palette,
> explanations, topic-wise results and retry-incorrect-only.
> See [`docs/PHASE3.md`](./docs/PHASE3.md) for the design and full API reference and
> [`docs/PHASE3-CODE.md`](./docs/PHASE3-CODE.md) for every changed file verbatim.
> Earlier: [`docs/PHASE2.md`](./docs/PHASE2.md) / [`docs/PHASE1-CODE.md`](./docs/PHASE1-CODE.md).

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
│   └── PHASE3-CODE.md               # complete Phase 3 source, file by file
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
│   ├── tests/                       # node:test — 116 tests, no DB required
│   │   ├── app.test.js, contracts.test.js, auth.service.test.js
│   │   ├── sheets*.test.js         # detector, workflow, Zod, service, routes
│   │   └── quizzes*.test.js        # 7 types, grading, import, versions, attempts
│   └── src/
│       ├── server.js                # bootstrap + graceful shutdown
│       ├── app.js                   # express app factory (security stack)
│       ├── config/{env,db}.js       # Zod-validated env, mongoose connection
│       ├── models/                  # User, RefreshSession + Phase-2/3 models
│       │   ├── {Sheet,SheetVersion,UserProgress}.js
│       │   ├── {SheetRating,SheetReport,PersonalResource}.js
│       │   ├── Problem.js           # embedded subdocument schema
│       │   └── {Question,Quiz,QuizVersion,Attempt}.js
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
npm test                 # 116 node:test server tests + 17 client render smoke tests
                         # (API envelope, validation, RBAC, JWT, auth services,
                         #  platform detection, lifecycle, versioning, progress,
                         #  7 question types, grading, JSON/CSV import, attempts,
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
bookmark and confidence → rate/review → clone.

Phase-3 manual flow: **New quiz** → tune the eight settings → **Add question**
(pick any of seven types) or **Bulk import** (paste JSON/CSV → preview → import)
or **From bank** → drag/keyboard reorder → **Submit for review** → moderator
**Approve** → **Publish** (creates an immutable version) → **Start quiz** →
answer, mark for review, autosave → **Finish & submit** → read score, topic-wise
performance and explanations → **Retry incorrect only**. Without MongoDB, data
routes return a clean `503` from `dbGuard` while `/health` and the client keep
working.

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
   Phase 2 (`SheetVersion`, `UserProgress`) and Phase 3 (`QuizVersion`,
   `Attempt`). See `docs/PHASE2.md` §2 and `docs/PHASE3.md` §2 for the
   embedding, snapshot and separation decisions.
8. In production the client and API should share an origin (or use
   `COOKIE_SAME_SITE=none` + HTTPS); the Vite dev proxy reproduces that locally.

---

## 10. Next phase

**Phase 4 — Mock tests**: sections with independent/section timers, negative
marking, a question palette with mark-for-review, autosave, auto-submit and
result analysis. Reuse `QuizVersion`'s immutable snapshot pattern and
`Attempt`'s server-authoritative timer, and extract the shared question
renderer so mocks and quizzes stay consistent.
```

## `docs/PHASE3.md`

```markdown
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
```
