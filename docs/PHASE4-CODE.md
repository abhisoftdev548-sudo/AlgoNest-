# AlgoNest — Phase 4 complete source code

> Auto-generated from the working tree on 2026-10-28. Every file below exists verbatim in the repository. Files marked "modified" also contain Phase 1–3 code; Phase 4 additions are appended to the shared contracts and documented in [PHASE4.md](./PHASE4.md).

## Index

### Shared contracts (modified) (2 files)

- [`shared/src/constants.js`](#shared-src-constants-js)
- [`shared/src/schemas.js`](#shared-src-schemas-js)

### Server — models (new) (3 files)

- [`server/src/models/MockTest.js`](#server-src-models-mocktest-js)
- [`server/src/models/MockVersion.js`](#server-src-models-mockversion-js)
- [`server/src/models/MockAttempt.js`](#server-src-models-mockattempt-js)

### Server — pure mock engine (new) (4 files)

- [`server/src/modules/mocks/mockScoring.js`](#server-src-modules-mocks-mockscoring-js)
- [`server/src/modules/mocks/mockClock.js`](#server-src-modules-mocks-mockclock-js)
- [`server/src/modules/mocks/mockWorkflow.js`](#server-src-modules-mocks-mockworkflow-js)
- [`server/src/modules/mocks/actor.js`](#server-src-modules-mocks-actor-js)

### Server — services (new) (3 files)

- [`server/src/modules/mocks/mockTest.service.js`](#server-src-modules-mocks-mocktest-service-js)
- [`server/src/modules/mocks/mockAttempt.service.js`](#server-src-modules-mocks-mockattempt-service-js)
- [`server/src/modules/mocks/mockAnalysis.service.js`](#server-src-modules-mocks-mockanalysis-service-js)

### Server — controllers + routers + mount (5 files)

- [`server/src/modules/mocks/mockTest.controller.js`](#server-src-modules-mocks-mocktest-controller-js)
- [`server/src/modules/mocks/mockAttempt.controller.js`](#server-src-modules-mocks-mockattempt-controller-js)
- [`server/src/modules/mocks/mockTest.routes.js`](#server-src-modules-mocks-mocktest-routes-js)
- [`server/src/modules/mocks/mockAttempt.routes.js`](#server-src-modules-mocks-mockattempt-routes-js)
- [`server/src/routes/index.js`](#server-src-routes-index-js)

### Server — tests (new) (3 files)

- [`server/tests/mocks.test.js`](#server-tests-mocks-test-js)
- [`server/tests/mocks.service.test.js`](#server-tests-mocks-service-test-js)
- [`server/tests/mocks.routes.test.js`](#server-tests-mocks-routes-test-js)

### Client — shared wiring (modified) (4 files)

- [`client/src/lib/queryKeys.js`](#client-src-lib-querykeys-js)
- [`client/src/lib/navigation.js`](#client-src-lib-navigation-js)
- [`client/src/app/router.jsx`](#client-src-app-router-jsx)
- [`client/scripts/smokeRender.mjs`](#client-scripts-smokerender-mjs)

### Client — mocks api, hooks, lib (new) (4 files)

- [`client/src/features/mocks/api/mockApi.js`](#client-src-features-mocks-api-mockapi-js)
- [`client/src/features/mocks/api/mockAttemptApi.js`](#client-src-features-mocks-api-mockattemptapi-js)
- [`client/src/features/mocks/hooks/useMocks.js`](#client-src-features-mocks-hooks-usemocks-js)
- [`client/src/features/mocks/lib/mockUtils.js`](#client-src-features-mocks-lib-mockutils-js)

### Client — mocks components (new) (14 files)

- [`client/src/features/mocks/components/MockFilters.jsx`](#client-src-features-mocks-components-mockfilters-jsx)
- [`client/src/features/mocks/components/MockCard.jsx`](#client-src-features-mocks-components-mockcard-jsx)
- [`client/src/features/mocks/components/MockSettingsForm.jsx`](#client-src-features-mocks-components-mocksettingsform-jsx)
- [`client/src/features/mocks/components/SectionEditor.jsx`](#client-src-features-mocks-components-sectioneditor-jsx)
- [`client/src/features/mocks/components/SectionQuestionPicker.jsx`](#client-src-features-mocks-components-sectionquestionpicker-jsx)
- [`client/src/features/mocks/components/MockModerationPanel.jsx`](#client-src-features-mocks-components-mockmoderationpanel-jsx)
- [`client/src/features/mocks/components/SectionTabs.jsx`](#client-src-features-mocks-components-sectiontabs-jsx)
- [`client/src/features/mocks/components/MockPalette.jsx`](#client-src-features-mocks-components-mockpalette-jsx)
- [`client/src/features/mocks/components/MockTimer.jsx`](#client-src-features-mocks-components-mocktimer-jsx)
- [`client/src/features/mocks/components/DifficultyBreakdown.jsx`](#client-src-features-mocks-components-difficultybreakdown-jsx)
- [`client/src/features/mocks/components/WeakTopicPanel.jsx`](#client-src-features-mocks-components-weaktopicpanel-jsx)
- [`client/src/features/mocks/components/RecommendedResources.jsx`](#client-src-features-mocks-components-recommendedresources-jsx)
- [`client/src/features/mocks/components/ReasonTagger.jsx`](#client-src-features-mocks-components-reasontagger-jsx)
- [`client/src/features/mocks/components/MockResult.jsx`](#client-src-features-mocks-components-mockresult-jsx)

### Client — mocks pages (new) (5 files)

- [`client/src/features/mocks/pages/MocksPage.jsx`](#client-src-features-mocks-pages-mockspage-jsx)
- [`client/src/features/mocks/pages/MockDetailPage.jsx`](#client-src-features-mocks-pages-mockdetailpage-jsx)
- [`client/src/features/mocks/pages/MockEditorPage.jsx`](#client-src-features-mocks-pages-mockeditorpage-jsx)
- [`client/src/features/mocks/pages/MockSolverPage.jsx`](#client-src-features-mocks-pages-mocksolverpage-jsx)
- [`client/src/features/mocks/pages/MockResultPage.jsx`](#client-src-features-mocks-pages-mockresultpage-jsx)

### Documentation (2 files)

- [`README.md`](#readme-md)
- [`docs/PHASE4.md`](#docs-phase4-md)


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

/* ───────────────────────── Phase 4: Mock tests ───────────────────────── */

export const MOCK_STATUSES = SHEET_STATUSES;
export const MOCK_STATUS_VALUES = SHEET_STATUS_VALUES;
export const MOCK_STATUS_LABELS = SHEET_STATUS_LABELS;

/** How the exam clock is sliced across sections. */
export const MOCK_TIMER_MODES = Object.freeze({
  SECTIONAL: 'sectional',
  GLOBAL: 'global',
});
export const MOCK_TIMER_MODE_VALUES = Object.freeze(Object.values(MOCK_TIMER_MODES));
export const MOCK_TIMER_MODE_LABELS = Object.freeze({
  sectional: 'Sectional — one section at a time, auto-advance on timeout',
  global: 'Global — one overall clock, jump between sections freely',
});

export const MOCK_ATTEMPT_STATUSES = Object.freeze({
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  TIMED_OUT: 'timed_out',
  ABANDONED: 'abandoned',
});
export const MOCK_ATTEMPT_STATUS_VALUES = Object.freeze(Object.values(MOCK_ATTEMPT_STATUSES));
export const MOCK_ATTEMPT_STATUS_LABELS = Object.freeze({
  in_progress: 'In progress', submitted: 'Submitted', timed_out: 'Time up', abandoned: 'Abandoned',
});

/** Palette states. `not_visited` is never persisted — it is the absence of a row. */
export const PALETTE_STATES = Object.freeze({
  NOT_VISITED: 'not_visited',
  NOT_ANSWERED: 'not_answered',
  ANSWERED: 'answered',
  MARKED: 'marked',
  ANSWERED_MARKED: 'answered_marked',
});
export const PALETTE_STATE_VALUES = Object.freeze(Object.values(PALETTE_STATES));
export const PALETTE_STATE_LABELS = Object.freeze({
  not_visited: 'Not visited', not_answered: 'Not answered', answered: 'Answered',
  marked: 'Marked for review', answered_marked: 'Answered & marked',
});

/** Learner-selected root cause for a wrong answer (post-result tagging). */
export const WRONG_REASONS = Object.freeze({
  CONCEPT_GAP: 'concept_gap',
  SILLY_MISTAKE: 'silly_mistake',
  TIME_PRESSURE: 'time_pressure',
  MISREAD: 'misread',
  GUESSED: 'guessed',
  OTHER: 'other',
});
export const WRONG_REASON_VALUES = Object.freeze(Object.values(WRONG_REASONS));
export const WRONG_REASON_LABELS = Object.freeze({
  concept_gap: 'Concept gap', silly_mistake: 'Silly mistake', time_pressure: 'Ran out of time',
  misread: 'Misread the question', guessed: 'Guessed', other: 'Something else',
});
/** Reasons that indicate a genuine knowledge gap (drive recommendations). */
export const KNOWLEDGE_GAP_REASONS = Object.freeze([
  WRONG_REASONS.CONCEPT_GAP, WRONG_REASONS.MISREAD, WRONG_REASONS.GUESSED,
]);

export const MOCK_VISIBILITIES = Object.freeze({
  PUBLIC: 'public', UNLISTED: 'unlisted', PRIVATE: 'private',
});
export const MOCK_VISIBILITY_VALUES = Object.freeze(Object.values(MOCK_VISIBILITIES));

export const MOCK_LIMITS = Object.freeze({
  MAX_SECTIONS: 12,
  MAX_QUESTIONS_PER_SECTION: 100,
  MAX_QUESTIONS: 300,
  MAX_SECTION_MINUTES: 180,
  MIN_SECTION_MINUTES: 1,
  MAX_TOTAL_MINUTES: 360,
  MAX_ATTEMPTS: 20,
  MAX_CORRECT_MARKS: 10,
  MAX_NEGATIVE_MARKS: 10,
  MAX_TITLE: 120,
  MAX_DESCRIPTION: 2000,
  MAX_SECTION_TITLE: 100,
  MAX_TAGS: 12,
  MAX_RECOMMENDATIONS: 8,
  /** Grace added per section transition to the global backstop deadline. */
  TRANSITION_GRACE_SECONDS: 60,
  /** Max seconds a single focus window may credit to a question. */
  MAX_FOCUS_WINDOW_SECONDS: 300,
  /** Client heartbeat/autosave cadence; server timestamps remain authoritative. */
  HEARTBEAT_MS: 15_000,
  AUTOSAVE_DEBOUNCE_MS: 900,
});

export const MOCK_SORT_OPTIONS = Object.freeze(['newest', 'oldest', 'popular', 'title']);
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
  MOCK_ATTEMPT_STATUS_VALUES,
  MOCK_LIMITS,
  MOCK_SORT_OPTIONS,
  MOCK_STATUS_VALUES,
  MOCK_TIMER_MODE_VALUES,
  MOCK_VISIBILITY_VALUES,
  WRONG_REASON_VALUES,
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

/* ───────────────────── Phase 4: Mock test contracts ───────────────────── */

const mockTitleSchema = z.string().trim().min(4, 'Title must be at least 4 characters').max(MOCK_LIMITS.MAX_TITLE);
const sectionTitleSchema = z.string().trim().min(2, 'Section title must be at least 2 characters').max(MOCK_LIMITS.MAX_SECTION_TITLE);

/**
 * Sections own their question ids, duration and marking scheme. `negativeMarks`
 * is a POSITIVE magnitude that is deducted for a wrong answer; unattempted
 * questions always score zero.
 */
export const mockSectionInputSchema = z
  .object({
    title: sectionTitleSchema,
    description: z.string().trim().max(500).default(''),
    durationMinutes: z.coerce.number().int().min(MOCK_LIMITS.MIN_SECTION_MINUTES).max(MOCK_LIMITS.MAX_SECTION_MINUTES),
    correctMarks: z.coerce.number().min(0.1).max(MOCK_LIMITS.MAX_CORRECT_MARKS).default(2),
    negativeMarks: z.coerce.number().min(0).max(MOCK_LIMITS.MAX_NEGATIVE_MARKS).default(0.5),
    cutoffPercentage: z.coerce.number().min(0).max(100).default(0),
    questionIds: z.array(mongoIdSchema).max(MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION).default([]),
  })
  .strict();

export const mockSettingsSchema = z
  .object({
    timerMode: z.enum(MOCK_TIMER_MODE_VALUES).default('sectional'),
    passPercentage: z.coerce.number().min(0).max(100).default(60),
    maxAttempts: z.coerce.number().int().min(1).max(MOCK_LIMITS.MAX_ATTEMPTS).default(3),
    shuffleQuestions: z.boolean().default(false),
    shuffleOptions: z.boolean().default(false),
    visibility: z.enum(MOCK_VISIBILITY_VALUES).default('public'),
    showExplanations: z.boolean().default(true),
    allowPaletteBack: z.boolean().default(true),
  })
  .strict();

export const mockCreateSchema = z
  .object({
    title: mockTitleSchema,
    description: z.string().trim().max(MOCK_LIMITS.MAX_DESCRIPTION).default(''),
    difficulty: difficultySchema.default('medium'),
    goals: z.array(z.enum(GOAL_VALUES)).max(GOAL_VALUES.length).default([]),
    topics: z.array(topicSchema).max(30).default([]),
    tags: z.array(z.string().trim().min(1).max(32)).max(MOCK_LIMITS.MAX_TAGS).default([]),
    settings: mockSettingsSchema.default({}),
    sections: z.array(mockSectionInputSchema).max(MOCK_LIMITS.MAX_SECTIONS).default([]),
  })
  .strict()
  .superRefine((value, ctx) => {
    const totalMinutes = value.sections.reduce((sum, section) => sum + section.durationMinutes, 0);
    const totalQuestions = value.sections.reduce((sum, section) => sum + section.questionIds.length, 0);
    if (totalMinutes > MOCK_LIMITS.MAX_TOTAL_MINUTES) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sections'], message: `Total duration cannot exceed ${MOCK_LIMITS.MAX_TOTAL_MINUTES} minutes` });
    }
    if (totalQuestions > MOCK_LIMITS.MAX_QUESTIONS) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sections'], message: `A mock can hold at most ${MOCK_LIMITS.MAX_QUESTIONS} questions` });
    }
    const seen = new Set();
    for (const section of value.sections) {
      for (const id of section.questionIds) {
        if (seen.has(id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sections'], message: `Question ${id} appears in more than one section` });
        seen.add(id);
      }
    }
  });

/** Sections are replaced as a whole; other fields are optional. */
export const mockUpdateSchema = z
  .object({
    title: mockTitleSchema.optional(),
    description: z.string().trim().max(MOCK_LIMITS.MAX_DESCRIPTION).optional(),
    difficulty: difficultySchema.optional(),
    goals: z.array(z.enum(GOAL_VALUES)).max(GOAL_VALUES.length).optional(),
    topics: z.array(topicSchema).max(30).optional(),
    tags: z.array(z.string().trim().min(1).max(32)).max(MOCK_LIMITS.MAX_TAGS).optional(),
    settings: mockSettingsSchema.partial().optional(),
    sections: z.array(mockSectionInputSchema).max(MOCK_LIMITS.MAX_SECTIONS).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const mockListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    q: z.string().trim().max(80).optional(),
    topic: z.string().trim().max(60).optional(),
    difficulty: difficultySchema.optional(),
    status: z.enum(MOCK_STATUS_VALUES).optional(),
    sort: z.enum(MOCK_SORT_OPTIONS).default('newest'),
    mine: z.enum(['true', 'false']).optional(),
  })
  .strict();

export const mockParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const mockAttemptParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const mockSectionParamsSchema = z.object({ id: mongoIdSchema, sectionId: mongoIdSchema }).strict();
export const mockQuestionParamsSchema = z.object({ id: mongoIdSchema, questionId: mongoIdSchema }).strict();

/** Replace the question ids of one section. */
export const mockSectionQuestionsSchema = z
  .object({
    questionIds: z.array(mongoIdSchema).max(MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION).default([]),
  })
  .strict();

export const mockQuestionListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(MOCK_LIMITS.MAX_QUESTIONS).default(MOCK_LIMITS.MAX_QUESTIONS),
  })
  .strict();

export const mockAttemptStartSchema = z.object({}).strict();

/** Autosave is a delta, never a blind replace. `visited` drives palette state. */
export const mockAnswerItemSchema = z
  .object({
    questionId: mongoIdSchema,
    response: z.union([
      z.string().max(2000), z.number(), z.boolean(), z.null(),
      z.array(z.union([z.string().max(500), z.number(), z.boolean()])).max(MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION),
      z.record(z.string().max(200)),
    ]),
    marked: z.boolean().default(false),
    visited: z.boolean().default(true),
  })
  .strict();

export const mockAutosaveSchema = z
  .object({
    answers: z.array(mockAnswerItemSchema).max(MOCK_LIMITS.MAX_QUESTIONS).default([]),
    activeQuestionId: mongoIdSchema.nullable().optional(),
    sectionId: mongoIdSchema.optional(),
  })
  .strict()
  .refine((value) => value.answers.length > 0 || Boolean(value.activeQuestionId), 'Provide answers or an active question');

/** Heartbeat keeps server-side focus windows fresh during a long read. */
export const mockHeartbeatSchema = z
  .object({
    activeQuestionId: mongoIdSchema.nullable(),
    sectionId: mongoIdSchema.optional(),
  })
  .strict();

export const mockSubmitSchema = z
  .object({
    answers: z.array(mockAnswerItemSchema).max(MOCK_LIMITS.MAX_QUESTIONS).default([]),
    activeQuestionId: mongoIdSchema.nullable().optional(),
  })
  .strict();

export const mockReasonSchema = z
  .object({
    reasons: z.array(z.object({
      questionId: mongoIdSchema,
      reason: z.enum(WRONG_REASON_VALUES).nullable(),
    }).strict()).min(1).max(MOCK_LIMITS.MAX_QUESTIONS),
  })
  .strict();

export const mockAttemptListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    status: z.enum(MOCK_ATTEMPT_STATUS_VALUES).optional(),
  })
  .strict();
```

---

# Server — models (new)

## `server/src/models/MockTest.js`

```js
import mongoose from 'mongoose';
import {
  DIFFICULTY_VALUES, GOAL_VALUES, MOCK_LIMITS, MOCK_STATUS_VALUES,
  MOCK_TIMER_MODE_VALUES, MOCK_VISIBILITY_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * A section in the WORKING COPY. It REFERENCES bank questions so a creator can
 * reuse them across sections and mocks. Publishing freezes everything into
 * MockVersion (see that file) — the same deliberate reference/embedding split
 * used by Phase 3 quizzes.
 */
export const mockSectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: MOCK_LIMITS.MAX_SECTION_TITLE },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    durationMinutes: { type: Number, required: true, min: MOCK_LIMITS.MIN_SECTION_MINUTES, max: MOCK_LIMITS.MAX_SECTION_MINUTES },
    correctMarks: { type: Number, min: 0.1, max: MOCK_LIMITS.MAX_CORRECT_MARKS, default: 2 },
    /** Positive magnitude deducted for a wrong answer. */
    negativeMarks: { type: Number, min: 0, max: MOCK_LIMITS.MAX_NEGATIVE_MARKS, default: 0.5 },
    cutoffPercentage: { type: Number, min: 0, max: 100, default: 0 },
    questionIds: { type: [{ type: Types.ObjectId, ref: 'Question' }], default: [] },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: true, versionKey: false },
);

const settingsSchema = new Schema(
  {
    timerMode: { type: String, enum: MOCK_TIMER_MODE_VALUES, default: 'sectional' },
    passPercentage: { type: Number, min: 0, max: 100, default: 60 },
    maxAttempts: { type: Number, min: 1, max: MOCK_LIMITS.MAX_ATTEMPTS, default: 3 },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    visibility: { type: String, enum: MOCK_VISIBILITY_VALUES, default: 'public' },
    showExplanations: { type: Boolean, default: true },
    /** In sectional mode: allow jumping back inside the active section. */
    allowPaletteBack: { type: Boolean, default: true },
  },
  { _id: false, versionKey: false },
);

const reviewEntrySchema = new Schema(
  {
    from: { type: String, enum: MOCK_STATUS_VALUES },
    to: { type: String, enum: MOCK_STATUS_VALUES, required: true },
    by: { type: Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    decision: { type: String, maxlength: 40, default: '' },
    note: { type: String, maxlength: 1000, default: '' },
  },
  { _id: false },
);

const mockTestSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: MOCK_LIMITS.MAX_TITLE },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: MOCK_LIMITS.MAX_DESCRIPTION, default: '' },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
    goals: { type: [{ type: String, enum: GOAL_VALUES }], default: [] },
    topics: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: MOCK_STATUS_VALUES, default: 'draft', index: true },
    settings: { type: settingsSchema, default: () => ({}) },
    sections: { type: [mockSectionSchema], default: [] },
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

mockTestSchema.index({ title: 'text', description: 'text', tags: 'text', topics: 'text' }, {
  weights: { title: 8, topics: 4, tags: 3, description: 1 }, name: 'mock_text_search',
});
mockTestSchema.index({ status: 1, publishedAt: -1 });
mockTestSchema.index({ author: 1, status: 1, updatedAt: -1 });
mockTestSchema.index({ topics: 1, difficulty: 1 });
mockTestSchema.index({ 'settings.visibility': 1, status: 1 });

export function sectionToPublic(section) {
  const plain = section?.toObject ? section.toObject() : { ...section };
  return {
    id: String(plain._id),
    title: plain.title,
    description: plain.description || '',
    durationMinutes: Number(plain.durationMinutes) || 0,
    correctMarks: Number(plain.correctMarks ?? 2),
    negativeMarks: Number(plain.negativeMarks ?? 0),
    cutoffPercentage: Number(plain.cutoffPercentage ?? 0),
    questionIds: (plain.questionIds ?? []).map(String),
    questionCount: (plain.questionIds ?? []).length,
    order: plain.order ?? 0,
  };
}

mockTestSchema.statics.toPublic = function toPublic(doc, { snapshot = null } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const author = plain.author && typeof plain.author === 'object' && plain.author.name
    ? { id: String(plain.author._id ?? plain.author.id), name: plain.author.name }
    : { id: String(plain.author ?? ''), name: 'AlgoNest creator' };
  const source = snapshot ?? plain;
  const sections = (source.sections ?? []).map((section) => {
    const view = sectionToPublic(section);
    // Frozen sections carry `questions`, not `questionIds`.
    if (snapshot) {
      view.questionIds = (section.questions ?? []).map((question) => String(question._id));
      view.questionCount = view.questionIds.length;
    }
    return view;
  });
  const settings = source.settings?.toObject ? source.settings.toObject() : (source.settings ?? {});

  return {
    id: String(plain._id),
    slug: plain.slug,
    title: source.title,
    description: source.description || '',
    author,
    difficulty: source.difficulty,
    goals: plain.goals ?? [],
    topics: source.topics ?? [],
    tags: plain.tags ?? [],
    status: plain.status,
    settings: {
      timerMode: settings.timerMode ?? 'sectional',
      passPercentage: settings.passPercentage ?? 60,
      maxAttempts: settings.maxAttempts ?? 3,
      shuffleQuestions: Boolean(settings.shuffleQuestions),
      shuffleOptions: Boolean(settings.shuffleOptions),
      visibility: settings.visibility ?? 'public',
      showExplanations: settings.showExplanations ?? true,
      allowPaletteBack: settings.allowPaletteBack ?? true,
    },
    sections,
    sectionCount: sections.length,
    questionCount: sections.reduce((sum, section) => sum + section.questionCount, 0),
    totalDurationMinutes: sections.reduce((sum, section) => sum + section.durationMinutes, 0),
    maxScore: sections.reduce((sum, section) => sum + section.questionCount * section.correctMarks, 0),
    publishedVersion: plain.publishedVersion ?? 0,
    publishedQuestionCount: plain.publishedQuestionCount ?? 0,
    publishedMaxScore: plain.publishedMaxScore ?? 0,
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

export const MockTest = mongoose.model('MockTest', mockTestSchema);
export default MockTest;
```

## `server/src/models/MockVersion.js`

```js
import mongoose from 'mongoose';
import { MOCK_LIMITS, MOCK_TIMER_MODE_VALUES, MOCK_VISIBILITY_VALUES } from '@algonest/shared';
import { snapshotQuestionSchema } from './Question.js';

const { Schema, Types } = mongoose;

/** Frozen section: metadata + marking scheme + EMBEDDED answer-bearing questions. */
export const versionSectionSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: true },
    title: { type: String, required: true, maxlength: MOCK_LIMITS.MAX_SECTION_TITLE },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true, min: MOCK_LIMITS.MIN_SECTION_MINUTES },
    correctMarks: { type: Number, required: true },
    negativeMarks: { type: Number, required: true },
    cutoffPercentage: { type: Number, default: 0 },
    order: { type: Number, required: true, min: 0 },
    questions: { type: [snapshotQuestionSchema], default: [] },
    questionCount: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false },
);

const versionSettingsSchema = new Schema(
  {
    timerMode: { type: String, enum: MOCK_TIMER_MODE_VALUES, default: 'sectional' },
    passPercentage: { type: Number, required: true },
    maxAttempts: { type: Number, required: true },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    visibility: { type: String, enum: MOCK_VISIBILITY_VALUES, default: 'public' },
    showExplanations: { type: Boolean, default: true },
    allowPaletteBack: { type: Boolean, default: true },
  },
  { _id: false, versionKey: false },
);

/**
 * Immutable published snapshot. Created once per publish and NEVER updated.
 * Old MockAttempt rows keep grading correctly after the author edits the bank,
 * changes the negative-marking scheme or publishes a new version.
 */
const mockVersionSchema = new Schema(
  {
    mock: { type: Types.ObjectId, ref: 'MockTest', required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    settings: { type: versionSettingsSchema, required: true },
    sections: { type: [versionSectionSchema], default: [] },
    questionCount: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    totalDurationMinutes: { type: Number, default: 0 },
    title: { type: String, required: true, maxlength: MOCK_LIMITS.MAX_TITLE },
    description: { type: String, default: '' },
    difficulty: { type: String, default: 'medium' },
    topics: { type: [String], default: [] },
    changelog: { type: String, maxlength: 500, default: '' },
    publishedBy: { type: Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

mockVersionSchema.index({ mock: 1, version: -1 }, { unique: true });

/** Plain, order-stable section/question list used by grading and the solver. */
mockVersionSchema.methods.canonicalSections = function canonicalSections() {
  return [...(this.sections ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((section) => {
      const s = section.toObject ? section.toObject() : { ...section };
      return {
        ...s,
        _id: String(s._id),
        questions: [...(s.questions ?? [])]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((question) => {
            const q = question.toObject ? question.toObject() : { ...question };
            return { ...q, _id: String(q._id) };
          }),
      };
    });
};

mockVersionSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    mock: String(plain.mock),
    version: plain.version,
    sectionCount: plain.sections?.length ?? 0,
    questionCount: plain.questionCount ?? 0,
    maxScore: plain.maxScore ?? 0,
    totalDurationMinutes: plain.totalDurationMinutes ?? 0,
    title: plain.title,
    description: plain.description || '',
    difficulty: plain.difficulty,
    topics: plain.topics ?? [],
    settings: plain.settings ?? {},
    sections: (plain.sections ?? []).map((section) => ({
      id: String(section._id), title: section.title, description: section.description || '',
      durationMinutes: section.durationMinutes, correctMarks: section.correctMarks,
      negativeMarks: section.negativeMarks, cutoffPercentage: section.cutoffPercentage,
      questionCount: section.questionCount ?? section.questions?.length ?? 0,
      order: section.order,
    })),
    changelog: plain.changelog || '',
    publishedBy: String(plain.publishedBy),
    publishedAt: plain.publishedAt,
  };
};

export const MockVersion = mongoose.model('MockVersion', mockVersionSchema);
export default MockVersion;
```

## `server/src/models/MockAttempt.js`

```js
import mongoose from 'mongoose';
import {
  MOCK_ATTEMPT_STATUS_VALUES, MOCK_LIMITS, MOCK_TIMER_MODE_VALUES, WRONG_REASON_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

const sectionStateSchema = new Schema(
  {
    sectionId: { type: Types.ObjectId, required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    order: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'active', 'submitted', 'timed_out'], default: 'pending' },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
  },
  { _id: false, versionKey: false },
);

const answerSchema = new Schema(
  {
    questionId: { type: Types.ObjectId, required: true },
    sectionId: { type: Types.ObjectId, required: true },
    response: { type: Schema.Types.Mixed, default: null },
    marked: { type: Boolean, default: false },
    /** Drives not_visited vs not_answered — never derived from the client UI. */
    visited: { type: Boolean, default: false },
    firstSeenAt: { type: Date, default: null },
    lastSeenAt: { type: Date, default: null },
    /** Server-credited seconds; the client never sends a duration. */
    accumulatedSeconds: { type: Number, default: 0, min: 0 },
    reason: { type: String, enum: WRONG_REASON_VALUES, default: null },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false, versionKey: false },
);

const presentationSchema = new Schema(
  {
    questionId: { type: Types.ObjectId, required: true },
    sectionId: { type: Types.ObjectId, required: true },
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
    sectionId: { type: Types.ObjectId, required: true },
    type: { type: String, required: true },
    topic: { type: String, default: 'General' },
    difficulty: { type: String, default: 'medium' },
    correct: { type: Boolean, default: false },
    attempted: { type: Boolean, default: false },
    marked: { type: Boolean, default: false },
    visited: { type: Boolean, default: false },
    response: { type: Schema.Types.Mixed, default: null },
    awarded: { type: Number, default: 0 },
    timeSeconds: { type: Number, default: 0 },
    reason: { type: String, enum: WRONG_REASON_VALUES, default: null },
    expected: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  { _id: false, versionKey: false },
);

const sectionReportSchema = new Schema(
  {
    sectionId: { type: Types.ObjectId, required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, default: 0 },
    correctMarks: { type: Number, default: 2 },
    negativeMarks: { type: Number, default: 0.5 },
    questionCount: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    unattempted: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    cutoffPercentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    timeSeconds: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false },
);

const recommendationSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'article' },
    topic: { type: String, default: 'General' },
    source: { type: String, default: 'sheet' },
    reason: { type: String, default: '' },
  },
  { _id: false, versionKey: false },
);

/**
 * PER-USER attempt, fully separate from MockTest / MockVersion.
 * Stores the frozen version, absolute server deadlines, section states,
 * server-credited focus windows and the computed result so a result page
 * never has to recompute from mutable content.
 */
const mockAttemptSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    mock: { type: Types.ObjectId, ref: 'MockTest', required: true, index: true },
    mockVersion: { type: Number, required: true, min: 1 },
    versionId: { type: Types.ObjectId, ref: 'MockVersion', required: true },
    status: { type: String, enum: MOCK_ATTEMPT_STATUS_VALUES, default: 'in_progress', index: true },
    settings: {
      timerMode: { type: String, enum: MOCK_TIMER_MODE_VALUES, default: 'sectional' },
      passPercentage: { type: Number, required: true },
      showExplanations: { type: Boolean, default: true },
      allowPaletteBack: { type: Boolean, default: true },
    },
    title: { type: String, required: true, maxlength: MOCK_LIMITS.MAX_TITLE },
    questionIds: { type: [Types.ObjectId], default: [] },
    sectionStates: { type: [sectionStateSchema], default: [] },
    activeQuestionId: { type: Types.ObjectId, default: null },
    lastHeartbeatAt: { type: Date, default: null },
    presentation: { type: [presentationSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    /** Absolute hard backstop — the only deadline for global mode. */
    expiresAt: { type: Date, required: true },
    submittedAt: { type: Date, default: null },
    durationSeconds: { type: Number, default: 0, min: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    accuracy: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },
    sections: { type: [sectionReportSchema], default: [] },
    results: { type: [resultSchema], default: [] },
    // Kept as Mixed: the pure analysis produces topic/difficulty-keyed rows
    // with extra diagnostic fields, and the result page needs them verbatim.
    difficultyStats: { type: [Schema.Types.Mixed], default: [] },
    topicStats: { type: [Schema.Types.Mixed], default: [] },
    weakTopics: { type: [Schema.Types.Mixed], default: [] },
    reasonSummary: { type: [Schema.Types.Mixed], default: [] },
    timeStats: { type: Schema.Types.Mixed, default: {} },
    recommendations: { type: [recommendationSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

mockAttemptSchema.index(
  { user: 1, mock: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'in_progress' }, name: 'uniq_live_mock_attempt' },
);
mockAttemptSchema.index({ user: 1, mock: 1, createdAt: -1 });
mockAttemptSchema.index({ user: 1, status: 1, expiresAt: 1 });
mockAttemptSchema.index({ mock: 1, percentage: -1 });

/** Upsert a batch of autosaved rows, keyed by questionId, scoped to this attempt. */
mockAttemptSchema.methods.mergeAnswers = function mergeAnswers(rows, allowed) {
  // `allowed` comes from versionQuestions(): { id, sectionId, question }.
  // Older callers may pass { questionId }, so accept both shapes.
  const allowedMap = new Map(allowed.map((item) => [String(item.id ?? item.questionId), item]));
  const byId = new Map(this.answers.map((answer) => [String(answer.questionId), answer]));
  for (const row of rows) {
    const key = String(row.questionId);
    const scope = allowedMap.get(key);
    if (!scope) continue;
    const previous = byId.get(key) ?? { questionId: row.questionId, sectionId: scope.sectionId };
    byId.set(key, {
      ...(previous.toObject ? previous.toObject() : previous),
      questionId: row.questionId,
      sectionId: scope.sectionId,
      response: row.response ?? null,
      marked: Boolean(row.marked),
      visited: Boolean(row.visited) || Boolean(previous.visited),
      savedAt: new Date(),
    });
  }
  this.answers = [...byId.values()];
  this.markModified('answers');
  return this;
};

mockAttemptSchema.methods.ensureAnswerRow = function ensureAnswerRow(questionId, sectionId) {
  const key = String(questionId);
  let row = this.answers.find((answer) => String(answer.questionId) === key);
  if (!row) {
    this.answers.push({ questionId, sectionId, response: null, marked: false, visited: true });
    row = this.answers[this.answers.length - 1];
    this.markModified('answers');
  } else if (!row.visited) {
    row.visited = true;
    this.markModified('answers');
  }
  return row;
};

mockAttemptSchema.statics.toPublic = function toPublic(doc, view = 'summary') {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const sectionStates = (plain.sectionStates ?? []).map((state) => ({
    sectionId: String(state.sectionId), title: state.title,
    durationMinutes: state.durationMinutes, order: state.order, status: state.status,
    startedAt: state.startedAt ?? null, expiresAt: state.expiresAt ?? null,
    submittedAt: state.submittedAt ?? null,
  }));
  const base = {
    id: String(plain._id),
    mock: String(plain.mock),
    mockVersion: plain.mockVersion,
    status: plain.status,
    title: plain.title || '',
    questionCount: plain.questionIds?.length ?? 0,
    startedAt: plain.startedAt,
    expiresAt: plain.expiresAt,
    submittedAt: plain.submittedAt ?? null,
    durationSeconds: plain.durationSeconds ?? 0,
    settings: plain.settings,
    sectionStates,
    activeSectionId: sectionStates.find((state) => state.status === 'active')?.sectionId ?? null,
    createdAt: plain.createdAt,
  };

  if (view === 'solver') {
    return {
      ...base,
      questionIds: (plain.questionIds ?? []).map(String),
      activeQuestionId: plain.activeQuestionId ? String(plain.activeQuestionId) : null,
      presentation: (plain.presentation ?? []).map((entry) => ({
        questionId: String(entry.questionId), sectionId: String(entry.sectionId),
        optionIds: entry.optionIds ?? [], itemIds: entry.itemIds ?? [],
        leftIds: entry.leftIds ?? [], rightIds: entry.rightIds ?? [],
      })),
      answers: (plain.answers ?? []).map((answer) => ({
        questionId: String(answer.questionId),
        sectionId: String(answer.sectionId),
        response: answer.response ?? null,
        marked: Boolean(answer.marked),
        visited: Boolean(answer.visited),
        accumulatedSeconds: answer.accumulatedSeconds ?? 0,
        reason: answer.reason ?? null,
        savedAt: answer.savedAt ?? null,
      })),
    };
  }

  return {
    ...base,
    score: plain.score ?? 0,
    maxScore: plain.maxScore ?? 0,
    percentage: plain.percentage ?? 0,
    passed: Boolean(plain.passed),
    accuracy: plain.accuracy ?? 0,
    correctCount: plain.correctCount ?? 0,
    incorrectCount: plain.incorrectCount ?? 0,
    unattemptedCount: plain.unattemptedCount ?? 0,
    sections: (plain.sections ?? []).map((section) => ({ ...section, sectionId: String(section.sectionId) })),
    difficultyStats: plain.difficultyStats ?? [],
    topicStats: plain.topicStats ?? [],
    weakTopics: plain.weakTopics ?? [],
    timeStats: plain.timeStats ?? {},
    ...(view === 'result' ? {
      results: (plain.results ?? []).map((result) => ({
        ...result,
        questionId: String(result.questionId),
        sectionId: String(result.sectionId),
      })),
      reasonSummary: plain.reasonSummary ?? [],
      recommendations: plain.recommendations ?? [],
    } : {}),
  };
};

export const MockAttempt = mongoose.model('MockAttempt', mockAttemptSchema);
export default MockAttempt;
```

---

# Server — pure mock engine (new)

## `server/src/modules/mocks/mockScoring.js`

```js
import {
  KNOWLEDGE_GAP_REASONS, MOCK_LIMITS, PALETTE_STATES as P, WRONG_REASON_LABELS,
} from '@algonest/shared';
import { expectedAnswer } from '../quizzes/questionNormalizer.js';
import { isResponseCorrect } from '../quizzes/questionGrader.js';

/**
 * Pure mock-test scoring and analysis. No DB, no Express, no clock — the caller
 * passes server timestamps and the frozen version. Every branch is unit tested.
 *
 * Marking model (per section):
 *   correct   → +section.correctMarks
 *   incorrect → −section.negativeMarks
 *   unattempted / not visited → 0
 * A sectional cut-off is met when section.percentage >= section.cutoffPercentage.
 * Final pass requires EVERY sectional cut-off AND the overall pass percentage.
 */

const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });
const round1 = (value) => Math.round(value * 10) / 10;

/** Answers are stored per attempt; build a fast lookup once. */
export function indexAnswers(answers = []) {
  return new Map(answers.map((answer) => [String(answer.questionId), answer]));
}

/** Whether a stored response counts as "attempted". */
export function isAttempted(response) {
  if (response === null || response === undefined || response === '') return false;
  if (Array.isArray(response)) return response.length > 0;
  if (typeof response === 'object') return Object.keys(response).length > 0;
  return true;
}

/** One of the five palette states, derived from the stored answer row. */
export function paletteState(answer) {
  if (!answer || answer.visited !== true) return P.NOT_VISITED;
  const answered = isAttempted(answer.response);
  if (answer.marked) return answered ? P.ANSWERED_MARKED : P.MARKED;
  return answered ? P.ANSWERED : P.NOT_ANSWERED;
}

/** Summarise palette counts for the solver header. */
export function paletteSummary(questions = [], answers = []) {
  const byId = indexAnswers(answers);
  const summary = {
    [P.NOT_VISITED]: 0, [P.NOT_ANSWERED]: 0,
    [P.ANSWERED]: 0, [P.MARKED]: 0, [P.ANSWERED_MARKED]: 0,
  };
  for (const question of questions) summary[paletteState(byId.get(String(question.id ?? question._id)))] += 1;
  return summary;
}

/** Time credited to a question, from server-observed focus windows. */
export function timeFor(questionId, answers = []) {
  const entry = indexAnswers(answers).get(String(questionId));
  return Number(entry?.accumulatedSeconds ?? 0) || 0;
}

/**
 * Grade every section and build the full analysis payload.
 *
 * @param {object} version frozen MockVersion (sections[] each with questions[])
 * @param {Array} answers attempt answers (response, marked, visited, accumulatedSeconds)
 * @param {{showExplanations?:boolean}} options
 */
export function analyseMock(version, answers = [], { showExplanations = true } = {}) {
  const byId = indexAnswers(answers);
  const results = [];
  const sectionReports = [];
  const difficultyMap = new Map();
  const topicMap = new Map();

  let totalScore = 0;
  let totalMaxScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let totalTime = 0;

  for (const section of version.sections ?? []) {
    const questions = (section.questions ?? []).map((question) => {
      const q = plain(question);
      return { id: String(q._id), question: q };
    });
    const correctMarks = Number(section.correctMarks ?? 2);
    const negativeMarks = Number(section.negativeMarks ?? 0);

    let sectionScore = 0;
    let sectionCorrect = 0;
    let sectionIncorrect = 0;
    let sectionUnattempted = 0;
    let sectionTime = 0;
    const sectionMaxScore = questions.length * correctMarks;

    for (const { id, question } of questions) {
      const stored = byId.get(id);
      const attempted = Boolean(stored && isAttempted(stored.response));
      const correct = attempted ? isResponseCorrect(question, stored.response) : false;
      const awarded = !attempted ? 0 : correct ? correctMarks : -negativeMarks;
      const seconds = Number(stored?.accumulatedSeconds ?? 0) || 0;
      const topic = question.topic || 'General';
      const difficulty = question.difficulty || 'medium';

      const result = {
        questionId: id,
        sectionId: String(section._id ?? section.id),
        type: question.type,
        topic,
        difficulty,
        correct,
        attempted,
        marked: Boolean(stored?.marked),
        visited: Boolean(stored?.visited),
        response: stored?.response ?? null,
        awarded,
        timeSeconds: seconds,
        reason: stored?.reason ?? null,
        ...(showExplanations ? { expected: expectedAnswer(question), explanation: question.explanation || '' } : {}),
      };
      results.push(result);

      sectionScore += awarded;
      sectionTime += seconds;
      totalTime += seconds;
      if (correct) sectionCorrect += 1;
      else if (attempted) sectionIncorrect += 1;
      else sectionUnattempted += 1;

      const diff = difficultyMap.get(difficulty) ?? { difficulty, total: 0, correct: 0, incorrect: 0, score: 0, maxScore: 0, percentage: 0 };
      diff.total += 1;
      diff.correct += correct ? 1 : 0;
      diff.incorrect += attempted && !correct ? 1 : 0;
      diff.score += awarded;
      diff.maxScore += correctMarks;
      difficultyMap.set(difficulty, diff);

      const stat = topicMap.get(topic) ?? { topic, total: 0, correct: 0, incorrect: 0, score: 0, maxScore: 0, percentage: 0, lostMarks: 0, knowledgeGaps: 0 };
      stat.total += 1;
      stat.correct += correct ? 1 : 0;
      stat.incorrect += attempted && !correct ? 1 : 0;
      stat.score += awarded;
      stat.maxScore += correctMarks;
      stat.lostMarks += attempted && !correct ? correctMarks + negativeMarks : 0;
      topicMap.set(topic, stat);
    }

    totalScore += sectionScore;
    totalMaxScore += sectionMaxScore;
    correctCount += sectionCorrect;
    incorrectCount += sectionIncorrect;
    unattemptedCount += sectionUnattempted;

    const percentage = sectionMaxScore > 0 ? round1((Math.max(0, sectionScore) / sectionMaxScore) * 100) : 0;
    const cutoffPercentage = Number(section.cutoffPercentage ?? 0);
    sectionReports.push({
      sectionId: String(section._id ?? section.id),
      title: section.title,
      durationMinutes: Number(section.durationMinutes ?? 0),
      correctMarks,
      negativeMarks,
      questionCount: questions.length,
      correct: sectionCorrect,
      incorrect: sectionIncorrect,
      unattempted: sectionUnattempted,
      score: round1(sectionScore),
      maxScore: round1(sectionMaxScore),
      percentage,
      cutoffPercentage,
      passed: percentage >= cutoffPercentage,
      timeSeconds: sectionTime,
    });
  }

  const percentage = totalMaxScore > 0 ? round1((Math.max(0, totalScore) / totalMaxScore) * 100) : 0;
  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount ? round1((correctCount / attemptedCount) * 100) : 0;
  const passPercentage = Number(version.settings?.passPercentage ?? 60);
  const passed = percentage >= passPercentage && sectionReports.every((report) => report.passed);

  const difficultyStats = [...difficultyMap.values()]
    .map((stat) => ({ ...stat, score: round1(stat.score), percentage: stat.maxScore ? round1((Math.max(0, stat.score) / stat.maxScore) * 100) : 0 }))
    .sort((a, b) => a.difficulty.localeCompare(b.difficulty));

  const topicStats = [...topicMap.values()]
    .map((stat) => ({ ...stat, score: round1(stat.score), percentage: stat.maxScore ? round1((Math.max(0, stat.score) / stat.maxScore) * 100) : 0 }))
    .sort((a, b) => a.percentage - b.percentage || b.lostMarks - a.lostMarks || a.topic.localeCompare(b.topic));

  const strongest = [...topicStats].sort((a, b) => b.percentage - a.percentage || a.topic.localeCompare(b.topic))[0]?.topic ?? null;
  const weakest = topicStats[0]?.topic ?? null;

  return {
    results,
    sections: sectionReports,
    difficultyStats,
    topicStats,
    weakTopics: diagnoseWeakTopics(topicStats, results),
    strongestTopic: strongest,
    weakestTopic: weakest,
    score: round1(totalScore),
    maxScore: round1(totalMaxScore),
    percentage,
    passPercentage,
    passed,
    correctCount,
    incorrectCount,
    unattemptedCount,
    attemptedCount,
    questionCount: results.length,
    accuracy,
    timeStats: buildTimeStats(results, totalTime),
  };
}

/** Weak topics = below the passing bar, ranked by marks actually thrown away. */
export function diagnoseWeakTopics(topicStats, results, threshold = 60) {
  const gaps = new Map();
  for (const result of results) {
    if (result.correct || !result.reason) continue;
    if (!KNOWLEDGE_GAP_REASONS.includes(result.reason)) continue;
    gaps.set(result.topic, (gaps.get(result.topic) ?? 0) + 1);
  }
  return topicStats
    .filter((stat) => stat.percentage < threshold || (gaps.get(stat.topic) ?? 0) > 0)
    .map((stat) => {
      const knowledgeGaps = gaps.get(stat.topic) ?? 0;
      const severity = stat.percentage < 40 || knowledgeGaps >= 2 ? 'high' : stat.percentage < threshold ? 'medium' : 'low';
      return {
        topic: stat.topic,
        percentage: stat.percentage,
        lostMarks: round1(stat.lostMarks),
        incorrect: stat.incorrect,
        knowledgeGaps,
        severity,
        advice: severity === 'high'
          ? 'Revise the fundamentals, then re-attempt topic problems.'
          : 'Practise a few timed problems to close the gap.',
      };
    })
    .sort((a, b) => b.lostMarks - a.lostMarks || a.percentage - b.percentage)
    .slice(0, MOCK_LIMITS.MAX_RECOMMENDATIONS);
}

export function buildTimeStats(results, totalSeconds) {
  const withTime = results.filter((result) => result.timeSeconds > 0).sort((a, b) => b.timeSeconds - a.timeSeconds);
  return {
    totalSeconds,
    averageSeconds: results.length ? Math.round(totalSeconds / results.length) : 0,
    slowest: withTime.slice(0, 5).map((result) => ({ questionId: result.questionId, topic: result.topic, seconds: result.timeSeconds })),
    untracked: results.length - withTime.length,
  };
}

/**
 * Apply learner-selected root causes. Pure — returns new results plus a summary.
 * Only wrong, attempted questions can be tagged.
 */
export function applyWrongReasons(results, reasons = []) {
  const incoming = new Map(reasons.map((item) => [String(item.questionId), item.reason]));
  const summary = Object.fromEntries(Object.keys(WRONG_REASON_LABELS).map((key) => [key, 0]));
  const next = results.map((result) => {
    const key = String(result.questionId);
    if (!incoming.has(key) || result.correct) return result;
    const reason = incoming.get(key);
    if (reason && KNOWLEDGE_GAP_REASONS.includes(reason)) summary[reason] += 1;
    else if (reason) summary[reason] += 1;
    return { ...result, reason: reason ?? null };
  });
  return {
    results: next,
    reasonSummary: Object.entries(summary).map(([reason, count]) => ({ reason, label: WRONG_REASON_LABELS[reason], count })).filter((entry) => entry.count > 0),
    taggedCount: results.filter((result) => !result.correct && incoming.has(String(result.questionId))).length,
  };
}
```

## `server/src/modules/mocks/mockClock.js`

```js
import { MOCK_LIMITS, MOCK_TIMER_MODES } from '@algonest/shared';

/**
 * Server-authoritative time. All functions take an explicit `now` (ms epoch)
 * so they are deterministic in tests and never read a client-supplied clock.
 */

export const toMs = (value) => new Date(value).getTime();

export function totalDurationSeconds(sections = []) {
  return sections.reduce((sum, section) => sum + (Number(section.durationMinutes) || 0) * 60, 0);
}

/**
 * Hard backstop for the whole attempt. In sectional mode a small grace per
 * transition covers a slow reconnection without letting an attempt live forever.
 */
export function globalDeadline(startedAt, sections = [], timerMode = MOCK_TIMER_MODES.SECTIONAL) {
  const seconds = totalDurationSeconds(sections);
  const grace = timerMode === MOCK_TIMER_MODES.SECTIONAL
    ? Math.max(0, sections.length - 1) * MOCK_LIMITS.TRANSITION_GRACE_SECONDS
    : 0;
  return toMs(startedAt) + (seconds + grace) * 1000;
}

/** A section's deadline can never extend beyond the attempt's hard backstop. */
export function sectionDeadline(enteredAt, durationMinutes, hardDeadline) {
  const candidate = toMs(enteredAt) + (Number(durationMinutes) || 0) * 60_000;
  return Math.min(candidate, toMs(hardDeadline));
}

export function isExpired(deadline, now = Date.now()) {
  return toMs(deadline) <= now;
}

export function remainingSeconds(deadline, now = Date.now()) {
  return Math.max(0, Math.round((toMs(deadline) - now) / 1000));
}

/**
 * Which deadline governs this attempt right now. In global mode it is always
 * the attempt deadline; in sectional mode it is the earlier of the current
 * section deadline and the attempt backstop.
 */
export function effectiveDeadline(attempt, now = Date.now()) {
  const hard = toMs(attempt.expiresAt);
  const section = attempt.sectionStates?.find((state) => state.status === 'active');
  const soft = section?.expiresAt ? toMs(section.expiresAt) : hard;
  return Math.min(hard, soft);
}

export function effectiveRemainingSeconds(attempt, now = Date.now()) {
  return remainingSeconds(effectiveDeadline(attempt, now), now);
}

/**
 * Credit one server-observed focus window to a question.
 *
 * The client only reports WHICH question is active; it never sends a duration.
 * We open a window on first sight, close the previous one on every heartbeat,
 * and cap a single window so a disconnected tab cannot inflate the metric.
 *
 * @returns {{firstSeenAt: Date|null, lastSeenAt: Date|null, accumulatedSeconds: number}}
 */
export function creditFocusWindow(entry, now = Date.now(), { open = false } = {}) {
  const current = {
    firstSeenAt: entry?.firstSeenAt ?? null,
    lastSeenAt: entry?.lastSeenAt ?? null,
    accumulatedSeconds: Number(entry?.accumulatedSeconds ?? 0) || 0,
  };
  if (!open) {
    // Closing: charge the time since the last heartbeat, then clear the window.
    if (current.lastSeenAt) {
      const elapsed = Math.max(0, Math.min(MOCK_LIMITS.MAX_FOCUS_WINDOW_SECONDS, (now - toMs(current.lastSeenAt)) / 1000));
      current.accumulatedSeconds = Math.round((current.accumulatedSeconds + elapsed) * 10) / 10;
    }
    current.lastSeenAt = null;
    return current;
  }

  const nowDate = new Date(now);
  if (!current.firstSeenAt) current.firstSeenAt = nowDate;
  if (current.lastSeenAt) {
    const elapsed = Math.max(0, Math.min(MOCK_LIMITS.MAX_FOCUS_WINDOW_SECONDS, (now - toMs(current.lastSeenAt)) / 1000));
    current.accumulatedSeconds = Math.round((current.accumulatedSeconds + elapsed) * 10) / 10;
  }
  current.lastSeenAt = nowDate;
  return current;
}

/** Section states for a freshly started attempt. */
export function initialSectionStates(sections = [], startedAt, timerMode, hardDeadline) {
  // Global mode: every section shares ONE clock. Marking them all active keeps
  // effectiveDeadline() == the hard backstop and makes all questions visible.
  if (timerMode === MOCK_TIMER_MODES.GLOBAL) {
    return sections.map((section, index) => ({
      sectionId: String(section._id ?? section.id ?? index),
      title: section.title,
      durationMinutes: Number(section.durationMinutes) || 0,
      order: index,
      status: 'active',
      startedAt: startedAt,
      expiresAt: new Date(toMs(hardDeadline)),
      submittedAt: null,
    }));
  }
  return sections.map((section, index) => {
    const active = index === 0;
    const enteredAt = active ? startedAt : null;
    return {
      sectionId: String(section._id ?? section.id ?? index),
      title: section.title,
      durationMinutes: Number(section.durationMinutes) || 0,
      order: index,
      status: active ? 'active' : 'pending',
      startedAt: enteredAt,
      expiresAt: active ? new Date(sectionDeadline(enteredAt, section.durationMinutes, hardDeadline)) : null,
      submittedAt: null,
    };
  });
}

/** Advance to the next section (or finish). Mutates a plain states array. */
export function advanceSection(states, now = Date.now(), hardDeadline, endedStatus = 'submitted') {
  const index = states.findIndex((state) => state.status === 'active');
  if (index < 0) return { states, finished: true, next: null };
  states[index] = { ...states[index], status: endedStatus, submittedAt: new Date(now) };
  const nextIndex = index + 1;
  if (nextIndex >= states.length) return { states, finished: true, next: null };
  const enteredAt = new Date(now);
  states[nextIndex] = {
    ...states[nextIndex],
    status: 'active',
    startedAt: enteredAt,
    expiresAt: new Date(sectionDeadline(enteredAt, states[nextIndex].durationMinutes, hardDeadline)),
  };
  return { states, finished: false, next: states[nextIndex] };
}
```

## `server/src/modules/mocks/mockWorkflow.js`

```js
import { MODERATION_DECISIONS, MOCK_STATUSES as S, MOCK_VISIBILITIES } from '@algonest/shared';

/** Same lifecycle as sheets/quizzes; kept local so mock rules can evolve. */
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
  return `Cannot move a mock test from "${from}" to "${to}". Allowed next states: ${(TRANSITIONS[from] ?? []).join(', ') || 'none'}.`;
}

export function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

export function isStaff(actor) {
  return Boolean(actor?.permissions?.length);
}

export function isAttemptable(mock, actor) {
  if (!mock?.publishedVersion || mock.status === S.ARCHIVED) return false;
  if (mock.settings?.visibility === MOCK_VISIBILITIES.PRIVATE) {
    return isStaff(actor) || String(mock.author?._id ?? mock.author) === actor?.id;
  }
  return true;
}

export default canTransition;
```

## `server/src/modules/mocks/actor.js`

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

## `server/src/modules/mocks/mockTest.service.js`

```js
import mongoose from 'mongoose';
import {
  MOCK_LIMITS, MOCK_STATUSES as S, MOCK_VISIBILITIES, PERMISSIONS, ROLES,
} from '@algonest/shared';
import { MockTest } from '../../models/MockTest.js';
import { MockVersion } from '../../models/MockVersion.js';
import { Question } from '../../models/Question.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import ApiError from '../../utils/ApiError.js';
import { paginateQuery } from '../../utils/pagination.js';
import { uniqueSlug } from '../../utils/slug.js';
import { adjustUsage } from '../quizzes/question.service.js';
import {
  DECISION_TO_STATUS, canTransition, isAttemptable, isEditable, isStaff, transitionError,
} from './mockWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';
const idOf = (value) => String(value?._id ?? value ?? '');
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isModerator = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
const ownerOf = (doc, actor) => idOf(doc.author) === String(actor.id);
const canManage = (doc, actor) => ownerOf(doc, actor) || isModerator(actor);

function assertManage(doc, actor) {
  if (!canManage(doc, actor)) throw ApiError.forbidden('Only the author or a content moderator can change this mock test');
}

function assertSectionEditable(doc) {
  if (doc.status === S.PUBLISHED) throw ApiError.conflict('This mock is published. Start a new revision before editing sections.');
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Restore the mock before editing it');
  if (!isEditable(doc.status)) throw ApiError.conflict(`Sections cannot be edited while the mock is "${doc.status}"`);
}

async function findMock(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid mock id');
  const doc = await MockTest.findById(id).populate('author', AUTHOR_FIELDS);
  if (!doc) throw ApiError.notFound('Mock test not found');
  return doc;
}

async function latestVersion(mockId) {
  return MockVersion.findOne({ mock: mockId }).sort({ version: -1 }).lean();
}

function pushReview(doc, from, to, actor, decision, note) {
  doc.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  if (doc.reviewHistory.length > 20) doc.reviewHistory = doc.reviewHistory.slice(-20);
}

/** Derive topic filters from the linked bank questions. */
async function syncTopics(doc) {
  const ids = (doc.sections ?? []).flatMap((section) => section.questionIds ?? []);
  if (!ids.length) return;
  const questions = await Question.find({ _id: { $in: ids } }, { topic: 1 }).lean();
  doc.topics = [...new Set([...(doc.topics ?? []), ...questions.map((q) => q.topic).filter(Boolean)])].slice(0, 30);
}

/** Validate totals that the shared Zod contract also checks (defence in depth). */
function validateTotals(sections) {
  const totalMinutes = sections.reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0);
  const totalQuestions = sections.reduce((sum, section) => sum + (section.questionIds?.length ?? 0), 0);
  if (totalMinutes > MOCK_LIMITS.MAX_TOTAL_MINUTES) throw ApiError.unprocessable(`Total duration exceeds ${MOCK_LIMITS.MAX_TOTAL_MINUTES} minutes`);
  if (totalQuestions > MOCK_LIMITS.MAX_QUESTIONS) throw ApiError.unprocessable(`A mock can hold at most ${MOCK_LIMITS.MAX_QUESTIONS} questions`);
}

/* ───────────────────────────── list / read ───────────────────────────── */

export async function listMocks(query, actor) {
  const filter = {};
  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    filter.status = query.status;
  } else {
    filter.publishedVersion = { $gt: 0 };
    filter.status = { $ne: S.ARCHIVED };
    filter['settings.visibility'] = MOCK_VISIBILITIES.PUBLIC;
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
    title: { title: 1 },
  };
  const { items, pagination } = await paginateQuery(filter, MockTest, {
    page: query.page, limit: query.limit, sort: sorts[query.sort] ?? sorts.newest,
    populate: { path: 'author', select: AUTHOR_FIELDS },
  });
  return {
    items: items.map((doc) => {
      const view = MockTest.toPublic(doc);
      if (doc.publishedVersion > 0) {
        view.questionCount = doc.publishedQuestionCount ?? view.questionCount;
        view.maxScore = doc.publishedMaxScore ?? view.maxScore;
      }
      return view;
    }),
    pagination,
  };
}

export async function getMock(id, actor) {
  const doc = await findMock(id);
  const manage = canManage(doc, actor);
  let snapshot = null;
  if (!manage) {
    if (doc.status === S.ARCHIVED) throw ApiError.notFound('Mock test not found');
    if (!doc.publishedVersion) throw ApiError.notFound('This mock test is not published yet');
    snapshot = await latestVersion(doc._id);
    if (!snapshot) throw ApiError.notFound('Published version is unavailable');
    if (snapshot.settings?.visibility === MOCK_VISIBILITIES.PRIVATE) throw ApiError.forbidden('This mock test is private');
  }
  const view = MockTest.toPublic(doc, { snapshot });

  const attempts = await MockAttempt.find({ user: new Types.ObjectId(actor.id), mock: doc._id })
    .select('status percentage submittedAt expiresAt mockVersion')
    .sort({ createdAt: -1 }).lean();
  const completed = attempts.filter((item) => item.status !== 'abandoned');
  const active = attempts.find((item) => item.status === 'in_progress' && new Date(item.expiresAt) > new Date());
  const best = completed.reduce((max, item) => Math.max(max, item.percentage ?? 0), 0);

  return {
    mock: view,
    canManage: manage,
    canModerate: isModerator(actor) && !ownerOf(doc, actor),
    mySummary: {
      attemptsUsed: completed.length,
      maxAttempts: view.settings.maxAttempts,
      attemptsLeft: Math.max(0, view.settings.maxAttempts - completed.length),
      bestPercentage: best,
      activeAttemptId: active ? String(active._id) : null,
      canStart: isAttemptable(doc, actor) && completed.length < view.settings.maxAttempts,
      recent: completed.slice(0, 5).map((item) => ({
        id: String(item._id), status: item.status, percentage: item.percentage ?? 0,
        mockVersion: item.mockVersion, submittedAt: item.submittedAt ?? null,
      })),
    },
  };
}

/* ───────────────────────────── create / update ───────────────────────────── */

export async function createMock(payload, actor) {
  const sections = (payload.sections ?? []).map((section, index) => ({
    ...section, questionIds: [], order: index,
  }));
  validateTotals(sections);
  const doc = await MockTest.create({
    ...payload, sections, slug: uniqueSlug(payload.title),
    author: new Types.ObjectId(actor.id), status: S.DRAFT,
  });
  const plain = doc.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return { mock: MockTest.toPublic(plain) };
}

export async function updateMock(id, payload, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Restore the mock before editing it');

  for (const key of ['title', 'description', 'difficulty', 'goals', 'topics', 'tags']) {
    if (payload[key] !== undefined) doc[key] = payload[key];
  }
  if (payload.settings) {
    for (const [key, value] of Object.entries(payload.settings)) if (value !== undefined) doc.settings[key] = value;
    doc.markModified('settings');
  }
  if (payload.sections) {
    assertSectionEditable(doc);
    const existing = doc.sections ?? [];
    const next = payload.sections.map((section, index) => ({
      // Keep ids by position so attempt/version references stay stable.
      ...(existing[index]?._id ? { _id: existing[index]._id } : {}),
      ...section,
      questionIds: (section.questionIds ?? []).map((value) => new Types.ObjectId(value)),
      order: index,
    }));
    validateTotals(next);
    doc.sections = next;
  }
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

/** Replace one section's question list. A question may live in only one section. */
export async function setSectionQuestions(id, sectionId, questionIds, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  assertSectionEditable(doc);
  if (!Types.ObjectId.isValid(sectionId)) throw ApiError.badRequest('Invalid section id');
  const section = (doc.sections ?? []).find((item) => String(item._id) === String(sectionId));
  if (!section) throw ApiError.notFound('Section not found');

  const elsewhere = new Set((doc.sections ?? [])
    .filter((item) => String(item._id) !== String(sectionId))
    .flatMap((item) => (item.questionIds ?? []).map(String)));
  if (questionIds.some((value) => elsewhere.has(String(value)))) {
    throw ApiError.conflict('A question can only belong to one section of a mock test');
  }
  if (questionIds.length > MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION) {
    throw ApiError.unprocessable(`A section can hold at most ${MOCK_LIMITS.MAX_QUESTIONS_PER_SECTION} questions`);
  }

  const docs = questionIds.length ? await Question.find({ _id: { $in: questionIds } }).lean() : [];
  if (docs.length !== questionIds.length) throw ApiError.notFound('One or more questions no longer exist in the bank');
  const forbidden = docs.find((question) => String(question.author) !== String(actor.id) && !isStaff(actor));
  if (forbidden) throw ApiError.forbidden('You can only use questions from your own bank');

  const previous = (section.questionIds ?? []).map(String);
  section.questionIds = questionIds.map((value) => new Types.ObjectId(value));
  await syncTopics(doc);
  await doc.save();
  await adjustUsage(questionIds, 1).catch(() => {});
  if (previous.length) await adjustUsage(previous.filter((value) => !questionIds.includes(value)), -1).catch(() => {});
  return { mock: MockTest.toPublic(doc) };
}

/* ───────────────────────────── lifecycle ───────────────────────────── */

export async function archiveMock(id, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Mock is already archived');
  if (!canTransition(doc.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(doc.status, S.ARCHIVED));
  pushReview(doc, doc.status, S.ARCHIVED, actor, 'archive', '');
  doc.status = S.ARCHIVED;
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function restoreMock(id, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived mock can be restored');
  pushReview(doc, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  doc.status = S.DRAFT;
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function startRevision(id, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status !== S.PUBLISHED) throw ApiError.conflict('Only a published mock can start a revision');
  pushReview(doc, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  doc.status = S.DRAFT;
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function submitForReview(id, changelog, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (!canTransition(doc.status, S.PENDING_REVIEW)) throw ApiError.conflict(transitionError(doc.status, S.PENDING_REVIEW));
  const sections = [...(doc.sections ?? [])].sort((a, b) => a.order - b.order);
  if (!sections.length || sections.some((section) => !section.questionIds?.length)) {
    throw ApiError.unprocessable('Every section needs at least one question before submitting');
  }
  pushReview(doc, doc.status, S.PENDING_REVIEW, actor, 'submit', changelog || '');
  doc.status = S.PENDING_REVIEW;
  doc.submittedAt = new Date();
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

export async function moderateMock(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const doc = await findMock(id);
  if (ownerOf(doc, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a mock test you authored');
  }
  if (doc.status !== S.PENDING_REVIEW) throw ApiError.conflict('Only mocks in review can be moderated');
  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(doc.status, target)) throw ApiError.conflict(transitionError(doc.status, target));
  pushReview(doc, doc.status, target, actor, decision, note);
  doc.status = target;
  doc.reviewedBy = new Types.ObjectId(actor.id);
  doc.reviewNote = note || '';
  await doc.save();
  return { mock: MockTest.toPublic(doc) };
}

/** Freeze sections + questions + marking scheme into an immutable MockVersion. */
export async function publishMock(id, changelog, actor) {
  const doc = await findMock(id);
  assertManage(doc, actor);
  if (doc.status !== S.APPROVED) throw ApiError.conflict('A mock must be approved before it can be published');
  const sections = [...(doc.sections ?? [])].sort((a, b) => a.order - b.order);
  if (!sections.length || sections.some((section) => !section.questionIds?.length)) {
    throw ApiError.unprocessable('Cannot publish a mock with an empty section');
  }

  const allIds = sections.flatMap((section) => section.questionIds ?? []);
  const bank = await Question.find({ _id: { $in: allIds } }).lean();
  const byId = new Map(bank.map((question) => [String(question._id), question]));
  if (allIds.some((value) => !byId.has(String(value)))) {
    throw ApiError.conflict('Some linked questions no longer exist in the bank');
  }
  const fields = [
    'type', 'prompt', 'topic', 'difficulty', 'explanation', 'points', 'tags',
    'code', 'caseSensitive', 'options', 'items', 'pairs', 'answerKey', 'booleanKey', 'textAnswers',
  ];
  let questionCount = 0;
  let maxScore = 0;
  let totalMinutes = 0;
  const frozenSections = sections.map((section, sectionIndex) => {
    const questions = (section.questionIds ?? []).map((value, index) => {
      const source = byId.get(String(value));
      const entry = { _id: new Types.ObjectId(source._id), order: index, sectionOrder: sectionIndex };
      for (const field of fields) entry[field] = source[field];
      return entry;
    });
    questionCount += questions.length;
    maxScore += questions.length * (Number(section.correctMarks) || 2);
    totalMinutes += Number(section.durationMinutes) || 0;
    return {
      _id: section._id,
      title: section.title,
      description: section.description || '',
      durationMinutes: section.durationMinutes,
      correctMarks: section.correctMarks,
      negativeMarks: section.negativeMarks,
      cutoffPercentage: section.cutoffPercentage,
      order: sectionIndex,
      questions,
      questionCount: questions.length,
      maxScore: questions.length * (Number(section.correctMarks) || 2),
    };
  });
  if (totalMinutes > MOCK_LIMITS.MAX_TOTAL_MINUTES) throw ApiError.unprocessable('Total duration exceeds the allowed maximum');

  const version = (doc.publishedVersion ?? 0) + 1;
  const settings = doc.settings?.toObject ? doc.settings.toObject() : { ...doc.settings };
  const snapshot = await MockVersion.create({
    mock: doc._id, version, settings,
    sections: frozenSections, questionCount, maxScore, totalDurationMinutes: totalMinutes,
    title: doc.title, description: doc.description, difficulty: doc.difficulty,
    topics: doc.topics, changelog: changelog || '', publishedBy: new Types.ObjectId(actor.id),
  });
  try {
    pushReview(doc, doc.status, S.PUBLISHED, actor, 'publish', changelog || '');
    doc.status = S.PUBLISHED;
    doc.publishedVersion = version;
    doc.publishedQuestionCount = questionCount;
    doc.publishedMaxScore = maxScore;
    doc.publishedAt = new Date();
    await doc.save();
  } catch (error) {
    await MockVersion.deleteOne({ _id: snapshot._id }).catch(() => {});
    throw error;
  }
  return { mock: MockTest.toPublic(doc), version: MockVersion.toPublic(snapshot) };
}

export async function listVersions(id, actor) {
  const doc = await findMock(id);
  if (!canManage(doc, actor) && !doc.publishedVersion) throw ApiError.notFound('Mock test not found');
  const items = await MockVersion.find({ mock: doc._id }).sort({ version: -1 }).lean();
  return { items: items.map((item) => MockVersion.toPublic(item)), mockId: idOf(doc) };
}

export async function getVersion(id, versionNumber, actor) {
  const doc = await findMock(id);
  if (!canManage(doc, actor) && !doc.publishedVersion) throw ApiError.notFound('Mock test not found');
  const snapshot = await MockVersion.findOne({ mock: doc._id, version: versionNumber }).lean();
  if (!snapshot) throw ApiError.notFound('Version not found');
  return { version: MockVersion.toPublic(snapshot) };
}

/** Editor-facing bank questions for one section (paginated, answer keys included). */
export async function listSectionQuestions(id, sectionId, query, actor) {
  const doc = await findMock(id);
  if (!canManage(doc, actor)) throw ApiError.forbidden('Only the author or a moderator can inspect section questions');
  const section = (doc.sections ?? []).find((item) => String(item._id) === String(sectionId));
  if (!section) throw ApiError.notFound('Section not found');
  const ids = (section.questionIds ?? []).map(String);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MOCK_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || MOCK_LIMITS.MAX_QUESTIONS));
  const slice = ids.slice((page - 1) * limit, page * limit);
  const docs = await Question.find({ _id: { $in: slice } }).lean();
  const byId = new Map(docs.map((question) => [String(question._id), question]));
  const { authorQuestion, expectedAnswer } = await import('../quizzes/questionNormalizer.js');
  const { buildPagination } = await import('../../utils/pagination.js');
  return {
    items: slice.map((questionId, index) => {
      const question = byId.get(questionId);
      if (!question) return null;
      return { ...authorQuestion(question, question), order: (page - 1) * limit + index, expected: expectedAnswer(question) };
    }).filter(Boolean),
    pagination: buildPagination(page, limit, ids.length, MOCK_LIMITS.MAX_QUESTIONS),
  };
}

export { findMock, latestVersion, canManage, isStaff };
```

## `server/src/modules/mocks/mockAttempt.service.js`

```js
import mongoose from 'mongoose';
import {
  MOCK_ATTEMPT_STATUSES as A, MOCK_LIMITS, MOCK_STATUSES, MOCK_TIMER_MODES,
} from '@algonest/shared';
import { MockTest } from '../../models/MockTest.js';
import { MockVersion } from '../../models/MockVersion.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { redactQuestion } from '../quizzes/questionNormalizer.js';
import { buildPresentation } from '../quizzes/quizPresentation.js';
import { analyseMock, applyWrongReasons } from './mockScoring.js';
import {
  advanceSection, creditFocusWindow, effectiveRemainingSeconds, globalDeadline,
  initialSectionStates, remainingSeconds, toMs,
} from './mockClock.js';
import { findMock, isStaff, latestVersion } from './mockTest.service.js';
import { isAttemptable } from './mockWorkflow.js';
import { buildRecommendations, refreshAnalysis } from './mockAnalysis.service.js';

const { Types } = mongoose;
const idOf = (value) => String(value?._id ?? value ?? '');
const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });

async function findAttempt(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid attempt id');
  const attempt = await MockAttempt.findById(id);
  if (!attempt) throw ApiError.notFound('Attempt not found');
  return attempt;
}

function assertOwner(attempt, actor) {
  if (String(attempt.user) !== String(actor.id)) throw ApiError.forbidden('This attempt belongs to another learner');
}

async function findVersion(attempt) {
  const version = await MockVersion.findById(attempt.versionId).lean();
  if (!version) throw ApiError.notFound('The published version for this attempt is unavailable');
  return version;
}

/** All frozen questions as { id, sectionId, sectionTitle, question }. */
function versionQuestions(version) {
  return (version.sections ?? []).flatMap((section) =>
    (section.questions ?? []).map((question) => {
      const q = plain(question);
      return {
        id: String(q._id),
        sectionId: String(section._id),
        sectionTitle: section.title,
        order: Number(section.order ?? 0),
        question: q,
      };
    }));
}

/** In sectional mode only the active section is writable and visible. */
function accessibleQuestions(attempt, version) {
  const all = versionQuestions(version);
  if (attempt.settings?.timerMode !== MOCK_TIMER_MODES.SECTIONAL) return all;
  const active = (attempt.sectionStates ?? []).find((state) => state.status === 'active');
  return active ? all.filter((item) => item.sectionId === String(active.sectionId)) : [];
}

function presentationFor(attempt, questionId) {
  return (attempt.presentation ?? []).find((entry) => String(entry.questionId) === String(questionId)) ?? null;
}

/**
 * Move server-observed focus windows. The client only tells us WHICH question
 * is active; it never supplies a duration or a timestamp.
 */
function applyFocus(attempt, activeQuestionId, allowed, now) {
  const allowedMap = new Map(allowed.map((item) => [item.id, item]));
  const previousId = attempt.activeQuestionId ? String(attempt.activeQuestionId) : null;
  const nextId = activeQuestionId ? String(activeQuestionId) : null;

  if (previousId && previousId !== nextId) {
    const row = (attempt.answers ?? []).find((answer) => String(answer.questionId) === previousId);
    if (row) {
      const window = creditFocusWindow(row, now, { open: false });
      row.firstSeenAt = window.firstSeenAt;
      row.lastSeenAt = window.lastSeenAt;
      row.accumulatedSeconds = window.accumulatedSeconds;
    }
  }
  if (nextId && allowedMap.has(nextId)) {
    const scope = allowedMap.get(nextId);
    const row = attempt.ensureAnswerRow(new Types.ObjectId(nextId), new Types.ObjectId(scope.sectionId));
    const window = creditFocusWindow(row, now, { open: true });
    row.firstSeenAt = window.firstSeenAt;
    row.lastSeenAt = window.lastSeenAt;
    row.accumulatedSeconds = window.accumulatedSeconds;
  }
  attempt.activeQuestionId = nextId && allowedMap.has(nextId) ? new Types.ObjectId(nextId) : null;
  attempt.lastHeartbeatAt = new Date(now);
  attempt.markModified('answers');
}

/** Idempotent final grading. Results are persisted, not recomputed on read. */
export async function finalizeAttempt(attempt, { status = A.SUBMITTED, endTime = Date.now(), actor = null } = {}) {
  if (attempt.status !== A.IN_PROGRESS) return attempt;
  const version = await findVersion(attempt);
  const showExplanations = attempt.settings?.showExplanations !== false && version.settings?.showExplanations !== false;
  const analysis = analyseMock(version, attempt.answers.map((answer) => plain(answer)), { showExplanations });

  const capSeconds = (Number(version.totalDurationMinutes) || 0) * 60 + MOCK_LIMITS.TRANSITION_GRACE_SECONDS * Math.max(0, (version.sections?.length ?? 1) - 1);
  attempt.durationSeconds = Math.min(capSeconds, Math.max(0, Math.round((endTime - toMs(attempt.startedAt)) / 1000)));
  attempt.results = analysis.results;
  attempt.sections = analysis.sections;
  attempt.difficultyStats = analysis.difficultyStats;
  attempt.topicStats = analysis.topicStats;
  attempt.weakTopics = analysis.weakTopics;
  attempt.timeStats = analysis.timeStats;
  attempt.score = analysis.score;
  attempt.maxScore = analysis.maxScore;
  attempt.percentage = analysis.percentage;
  attempt.passed = analysis.passed;
  attempt.accuracy = analysis.accuracy;
  attempt.correctCount = analysis.correctCount;
  attempt.incorrectCount = analysis.incorrectCount;
  attempt.unattemptedCount = analysis.unattemptedCount;
  attempt.status = status;
  attempt.submittedAt = new Date(endTime);
  attempt.activeQuestionId = null;

  // Close the last focus window so the final question's time is credited.
  const active = (attempt.answers ?? []).find((answer) => answer.lastSeenAt);
  if (active) {
    const window = creditFocusWindow(active, endTime, { open: false });
    active.lastSeenAt = window.lastSeenAt;
    active.accumulatedSeconds = window.accumulatedSeconds;
    attempt.markModified('answers');
  }

  if (actor) {
    attempt.recommendations = await buildRecommendations(attempt, actor).catch(() => []);
    attempt.markModified('recommendations');
  }
  await attempt.save();
  await MockTest.updateOne({ _id: attempt.mock }, { $inc: { attemptCount: 1 } }).catch(() => {});
  return attempt;
}

/**
 * Enforce both deadlines. Called on EVERY read and write, so a disconnected
 * client can never extend an attempt by not sending requests.
 * @returns {{changed:boolean, timedOut:boolean, sectionAdvanced:boolean}}
 */
export async function syncClock(attempt, actor, now = Date.now()) {
  if (attempt.status !== A.IN_PROGRESS) return { changed: false, timedOut: false, sectionAdvanced: false };
  let sectionAdvanced = false;

  if (now >= toMs(attempt.expiresAt)) {
    await finalizeAttempt(attempt, { status: A.TIMED_OUT, endTime: toMs(attempt.expiresAt), actor });
    return { changed: true, timedOut: true, sectionAdvanced: false };
  }

  if (attempt.settings?.timerMode === MOCK_TIMER_MODES.SECTIONAL) {
    // Guard bounds the loop even if a corrupt document has zero-duration sections.
    for (let guard = 0; guard < MOCK_LIMITS.MAX_SECTIONS + 1; guard += 1) {
      const states = (attempt.sectionStates ?? []).map(plain);
      const active = states.find((state) => state.status === 'active');
      if (!active) {
        await finalizeAttempt(attempt, { status: A.SUBMITTED, endTime: now, actor });
        return { changed: true, timedOut: false, sectionAdvanced };
      }
      if (!active.expiresAt || now < toMs(active.expiresAt)) break;
      const result = advanceSection(states, now, attempt.expiresAt, 'timed_out');
      attempt.sectionStates = result.states;
      attempt.activeQuestionId = null;
      attempt.markModified('sectionStates');
      sectionAdvanced = true;
      if (result.finished) {
        await finalizeAttempt(attempt, { status: A.SUBMITTED, endTime: now, actor });
        return { changed: true, timedOut: false, sectionAdvanced };
      }
    }
    if (sectionAdvanced) await attempt.save();
  }
  return { changed: sectionAdvanced, timedOut: false, sectionAdvanced };
}

/* ───────────────────────────── start / list ───────────────────────────── */

export async function listAttempts(mockId, query, actor) {
  if (!Types.ObjectId.isValid(mockId)) throw ApiError.badRequest('Invalid mock id');
  const filter = { user: new Types.ObjectId(actor.id), mock: new Types.ObjectId(mockId) };
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    MockAttempt.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    MockAttempt.countDocuments(filter),
  ]);
  return { items: items.map((doc) => MockAttempt.toPublic(doc, 'summary')), pagination: buildPagination(page, limit, total) };
}

export async function startAttempt(mockId, actor) {
  const mock = await findMock(mockId);
  if (!isAttemptable(mock, actor)) throw ApiError.forbidden('This mock test is not available to attempt');
  if (mock.status === MOCK_STATUSES.ARCHIVED) throw ApiError.notFound('Mock test not found');
  const version = await latestVersion(mock._id);
  if (!version || !(version.sections ?? []).some((section) => section.questions?.length)) {
    throw ApiError.conflict('This mock has no published questions yet');
  }
  const sections = [...(version.sections ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const settings = version.settings ?? {};

  const live = await MockAttempt.findOne({ user: new Types.ObjectId(actor.id), mock: mock._id, status: A.IN_PROGRESS });
  if (live) {
    const sync = await syncClock(live, actor);
    if (live.status === A.IN_PROGRESS) throw ApiError.conflict('You already have an attempt in progress for this mock test');
    // A just-expired live attempt was finalised above; a new one is allowed.
    void sync;
  }
  const used = await MockAttempt.countDocuments({
    user: new Types.ObjectId(actor.id), mock: mock._id, status: { $ne: A.ABANDONED },
  });
  if (used >= (Number(settings.maxAttempts) || 3)) {
    throw ApiError.conflict(`You have used all ${settings.maxAttempts} attempts for this mock test`);
  }

  const startedAt = new Date();
  const hardDeadline = new Date(globalDeadline(startedAt, sections, settings.timerMode));
  const attempt = new MockAttempt({
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(actor.id),
    mock: mock._id,
    mockVersion: version.version,
    versionId: version._id,
    status: A.IN_PROGRESS,
    settings: {
      timerMode: settings.timerMode ?? MOCK_TIMER_MODES.SECTIONAL,
      passPercentage: Number(settings.passPercentage ?? 60),
      showExplanations: settings.showExplanations !== false,
      allowPaletteBack: settings.allowPaletteBack !== false,
    },
    title: version.title,
    startedAt,
    expiresAt: hardDeadline,
    sectionStates: initialSectionStates(sections, startedAt, settings.timerMode, hardDeadline),
  });

  const items = versionQuestions(version);
  // Seeded presentation is stored once, so a reload never reshuffles.
  const presentation = buildPresentation(
    items.map((item) => ({ id: item.id, question: item.question })),
    settings, String(attempt._id),
  );
  const byId = new Map(items.map((item) => [item.id, item]));
  attempt.presentation = presentation.map((entry) => ({
    ...entry,
    questionId: new Types.ObjectId(entry.questionId),
    sectionId: new Types.ObjectId(byId.get(entry.questionId).sectionId),
  }));
  attempt.questionIds = presentation.map((entry) => new Types.ObjectId(entry.questionId));
  attempt.maxScore = Number(version.maxScore) || 0;
  await attempt.save();

  return {
    attempt: MockAttempt.toPublic(attempt, 'solver'),
    remainingSeconds: effectiveRemainingSeconds(attempt),
    attemptRemainingSeconds: remainingSeconds(attempt.expiresAt),
    mock: {
      id: String(mock._id), title: version.title,
      totalDurationMinutes: version.totalDurationMinutes,
      maxScore: attempt.maxScore, version: version.version,
      timerMode: attempt.settings.timerMode,
      passPercentage: attempt.settings.passPercentage,
    },
  };
}

/* ───────────────────────────── read / resume ───────────────────────────── */

/** Resume endpoint: returns frozen state + server-computed remaining time. */
export async function getAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const sync = await syncClock(attempt, actor);
  const view = attempt.status === A.IN_PROGRESS ? 'solver' : 'result';
  return {
    attempt: MockAttempt.toPublic(attempt, view),
    remainingSeconds: attempt.status === A.IN_PROGRESS ? effectiveRemainingSeconds(attempt) : 0,
    attemptRemainingSeconds: attempt.status === A.IN_PROGRESS ? remainingSeconds(attempt.expiresAt) : 0,
    expired: sync.timedOut,
    sectionAdvanced: sync.sectionAdvanced,
  };
}

/** Frozen, answer-free questions for the accessible sections, paginated. */
export async function getAttemptQuestions(id, query, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  await syncClock(attempt, actor);
  const version = await findVersion(attempt);
  const accessible = accessibleQuestions(attempt, version);
  const accessibleIds = new Set(accessible.map((item) => item.id));
  const order = (attempt.questionIds ?? []).map(String).filter((questionId) => accessibleIds.has(questionId));
  const byId = new Map(accessible.map((item) => [item.id, item]));

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MOCK_LIMITS.MAX_QUESTIONS, Math.max(1, Number(query.limit) || MOCK_LIMITS.MAX_QUESTIONS));
  const slice = order.slice((page - 1) * limit, page * limit);
  const items = slice.map((questionId, index) => {
    const item = byId.get(questionId);
    if (!item) return null;
    return {
      ...redactQuestion(item.question, questionId, presentationFor(attempt, questionId)),
      sectionId: item.sectionId,
      sectionTitle: item.sectionTitle,
      number: (page - 1) * limit + index + 1,
    };
  }).filter(Boolean);

  return {
    items,
    sections: (version.sections ?? []).map((section) => ({
      id: String(section._id), title: section.title,
      durationMinutes: section.durationMinutes,
      correctMarks: section.correctMarks, negativeMarks: section.negativeMarks,
      cutoffPercentage: section.cutoffPercentage,
      questionCount: section.questions?.length ?? 0,
      accessible: accessibleIds.size > 0 && [...accessibleIds].some((questionId) => byId.get(questionId)?.sectionId === String(section._id)),
    })),
    pagination: buildPagination(page, limit, order.length, MOCK_LIMITS.MAX_QUESTIONS),
    showExplanations: attempt.settings?.showExplanations !== false,
    timerMode: attempt.settings?.timerMode,
  };
}

/* ───────────────────────────── autosave / heartbeat ───────────────────────────── */

async function writeAnswers(attempt, payload, actor, now = Date.now()) {
  const sync = await syncClock(attempt, actor, now);
  if (attempt.status !== A.IN_PROGRESS) {
    return { attempt, sync, ignored: payload.answers?.length ?? 0, final: true };
  }
  const version = await findVersion(attempt);
  const allowed = accessibleQuestions(attempt, version);
  const allowedIds = new Set(allowed.map((item) => item.id));
  const rows = (payload.answers ?? []).filter((row) => allowedIds.has(String(row.questionId)));
  if (rows.length) attempt.mergeAnswers(rows, allowed);
  applyFocus(attempt, payload.activeQuestionId ?? null, allowed, now);
  await attempt.save();
  return { attempt, sync, ignored: (payload.answers?.length ?? 0) - rows.length, final: false };
}

export async function autosaveAttempt(id, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const result = await writeAnswers(attempt, payload, actor);
  return {
    attempt: MockAttempt.toPublic(attempt, result.final ? 'result' : 'solver'),
    remainingSeconds: result.final ? 0 : effectiveRemainingSeconds(attempt),
    attemptRemainingSeconds: result.final ? 0 : remainingSeconds(attempt.expiresAt),
    expired: result.sync.timedOut,
    sectionAdvanced: result.sync.sectionAdvanced,
    ignored: result.ignored,
    savedAt: new Date().toISOString(),
  };
}

export async function heartbeat(id, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  const result = await writeAnswers(attempt, { answers: [], activeQuestionId: payload.activeQuestionId }, actor);
  return {
    status: attempt.status,
    remainingSeconds: result.final ? 0 : effectiveRemainingSeconds(attempt),
    attemptRemainingSeconds: result.final ? 0 : remainingSeconds(attempt.expiresAt),
    sectionAdvanced: result.sync.sectionAdvanced,
    expired: result.sync.timedOut,
    activeSectionId: MockAttempt.toPublic(attempt, 'summary').activeSectionId,
  };
}

/* ───────────────────────────── sections / submit ───────────────────────────── */

export async function submitSection(id, sectionId, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  await syncClock(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) throw ApiError.conflict('This attempt has already finished');
  if (attempt.settings?.timerMode !== MOCK_TIMER_MODES.SECTIONAL) {
    throw ApiError.conflict('Sections are not timed individually in this mock');
  }
  const active = (attempt.sectionStates ?? []).find((state) => state.status === 'active');
  if (!active || String(active.sectionId) !== String(sectionId)) {
    throw ApiError.conflict('This section is not active. Re-sync your attempt.');
  }

  // Flush the final answers for the closing section BEFORE it becomes read-only.
  const version = await findVersion(attempt);
  const allowed = accessibleQuestions(attempt, version);
  const allowedIds = new Set(allowed.map((item) => item.id));
  const rows = (payload.answers ?? []).filter((row) => allowedIds.has(String(row.questionId)));
  if (rows.length) attempt.mergeAnswers(rows, allowed);
  applyFocus(attempt, null, allowed, Date.now());

  const states = (attempt.sectionStates ?? []).map(plain);
  const result = advanceSection(states, Date.now(), attempt.expiresAt, 'submitted');
  attempt.sectionStates = result.states;
  attempt.activeQuestionId = null;
  attempt.markModified('sectionStates');

  if (result.finished) {
    await finalizeAttempt(attempt, { status: A.SUBMITTED, actor });
    return { attempt: MockAttempt.toPublic(attempt, 'result'), finished: true, remainingSeconds: 0, sectionAdvanced: false };
  }
  await attempt.save();
  return {
    attempt: MockAttempt.toPublic(attempt, 'solver'),
    finished: false,
    sectionAdvanced: true,
    remainingSeconds: effectiveRemainingSeconds(attempt),
    nextSectionId: result.next?.sectionId ? String(result.next.sectionId) : null,
  };
}

export async function submitAttempt(id, payload, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) {
    await writeAnswers(attempt, payload, actor);
    if (attempt.status === A.IN_PROGRESS) {
      const timedOut = Date.now() >= toMs(attempt.expiresAt);
      await finalizeAttempt(attempt, {
        status: timedOut ? A.TIMED_OUT : A.SUBMITTED,
        endTime: timedOut ? toMs(attempt.expiresAt) : Date.now(),
        actor,
      });
    }
  }
  return {
    attempt: MockAttempt.toPublic(attempt, 'result'),
    remainingSeconds: 0,
  };
}

/* ───────────────────────────── result / reasons ───────────────────────────── */

export async function getResult(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) await syncClock(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) throw ApiError.conflict('Submit the attempt before viewing its result');
  const data = MockAttempt.toPublic(attempt, 'result');
  if (attempt.settings?.showExplanations === false) {
    data.results = (data.results ?? []).map(({ expected, explanation, ...rest }) => rest);
  }
  return {
    attempt: data,
    mockId: String(attempt.mock),
    reasonOptions: null, // the client imports WRONG_REASON_LABELS from @algonest/shared
  };
}

/** Learner-tagged root causes feed weak-topic diagnosis + recommendations. */
export async function setWrongReasons(id, reasons, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) throw ApiError.conflict('Finish the attempt before tagging answers');
  const valid = new Set((attempt.results ?? []).filter((result) => !result.correct).map((result) => idOf(result.questionId)));
  for (const item of reasons) {
    if (!valid.has(String(item.questionId))) {
      throw ApiError.unprocessable('You can only tag a question you answered incorrectly');
    }
  }
  const tagged = applyWrongReasons(attempt.results.map(plain), reasons);
  attempt.results = tagged.results;
  attempt.reasonSummary = tagged.reasonSummary;
  attempt.markModified('results');
  await attempt.save();
  const analysis = await refreshAnalysis(attempt, actor);
  return {
    results: MockAttempt.toPublic(attempt, 'result').results,
    reasonSummary: tagged.reasonSummary,
    weakTopics: analysis.weakTopics,
    recommendations: analysis.recommendations,
  };
}

export async function abandonAttempt(id, actor) {
  const attempt = await findAttempt(id);
  assertOwner(attempt, actor);
  if (attempt.status !== A.IN_PROGRESS) throw ApiError.conflict('Only an in-progress attempt can be abandoned');
  await syncClock(attempt, actor);
  if (attempt.status === A.IN_PROGRESS) {
    applyFocus(attempt, null, [], Date.now());
    attempt.status = A.ABANDONED;
    attempt.submittedAt = new Date();
    await attempt.save();
  }
  return { attempt: MockAttempt.toPublic(attempt, 'summary') };
}

export { findAttempt, versionQuestions, accessibleQuestions };
```

## `server/src/modules/mocks/mockAnalysis.service.js`

```js
import mongoose from 'mongoose';
import { MOCK_LIMITS, MOCK_STATUSES, PLATFORM_VALUES, RESOURCE_TYPE_VALUES } from '@algonest/shared';
import { Sheet } from '../../models/Sheet.js';
import { PersonalResource } from '../../models/PersonalResource.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import { diagnoseWeakTopics } from './mockScoring.js';
import ApiError from '../../utils/ApiError.js';

const { Types } = mongoose;

/**
 * Real, database-backed "what should I study next". No hardcoded links:
 *   - published sheets whose problems match a weak topic
 *   - the learner's own saved resources for that topic
 * Ranked by the marks actually lost in the attempt, deduped by URL.
 */
export async function buildRecommendations(attempt, actor) {
  const weak = (attempt.weakTopics ?? []).length
    ? attempt.weakTopics
    : diagnoseWeakTopics(attempt.topicStats ?? [], attempt.results ?? []);
  const topics = weak.map((entry) => entry.topic).filter(Boolean).slice(0, 8);
  if (!topics.length) return [];

  const severity = new Map(weak.map((entry) => [entry.topic, Number(entry.lostMarks ?? 0)]));
  const candidates = [];

  const sheets = await Sheet.find({
    status: { $ne: MOCK_STATUSES.ARCHIVED },
    publishedVersion: { $gt: 0 },
    topics: { $in: topics },
  }).select('title topics problems').limit(20).lean().catch(() => []);

  for (const sheet of sheets) {
    for (const problem of sheet.problems ?? []) {
      if (!topics.includes(problem.topic) || !problem.url) continue;
      candidates.push({
        title: problem.title,
        url: problem.url,
        type: 'problem',
        topic: problem.topic,
        source: 'sheet',
        reason: `From "${sheet.title}" — ${weak.find((entry) => entry.topic === problem.topic)?.advice ?? 'practise this topic'}`,
        weight: severity.get(problem.topic) ?? 0,
      });
    }
  }

  const saved = await PersonalResource.find({
    user: new Types.ObjectId(actor.id),
    $or: [{ topic: { $in: topics } }, { tags: { $in: topics } }],
  }).limit(40).lean().catch(() => []);
  for (const resource of saved) {
    candidates.push({
      title: resource.title,
      url: resource.url,
      type: RESOURCE_TYPE_VALUES.includes(resource.type) ? resource.type : 'article',
      topic: resource.topic,
      source: 'personal',
      reason: 'From your saved resources for this weak topic',
      // Personal resources are surfaced first when marks lost are equal.
      weight: (severity.get(resource.topic) ?? 0) + 0.5,
    });
  }

  const seen = new Set();
  return candidates
    .filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title))
    .slice(0, MOCK_LIMITS.MAX_RECOMMENDATIONS)
    .map(({ weight, ...item }) => ({
      ...item,
      type: RESOURCE_TYPE_VALUES.includes(item.type) ? item.type : 'article',
      source: PLATFORM_VALUES.includes(item.source) ? 'sheet' : item.source,
    }));
}

/** Recompute weak topics + recommendations after the learner tags reasons. */
export async function refreshAnalysis(attempt, actor) {
  const weakTopics = diagnoseWeakTopics(attempt.topicStats ?? [], attempt.results ?? []);
  attempt.weakTopics = weakTopics;
  attempt.markModified('weakTopics');
  attempt.recommendations = await buildRecommendations(attempt, actor);
  attempt.markModified('recommendations');
  await attempt.save();
  return { weakTopics, recommendations: attempt.recommendations };
}

export async function assertAttemptOwner(id, actor) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid attempt id');
  const attempt = await MockAttempt.findById(id);
  if (!attempt) throw ApiError.notFound('Attempt not found');
  if (String(attempt.user) !== String(actor.id)) throw ApiError.forbidden('This attempt belongs to another learner');
  return attempt;
}
```

---

# Server — controllers + routers + mount

## `server/src/modules/mocks/mockTest.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './mockTest.service.js';
import * as attemptService from './mockAttempt.service.js';

const actor = (req) => actorFrom(req);

/* Catalogue */
export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listMocks(req.validated.query, actor(req)), 'Mock tests fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getMock(req.validated.params.id, actor(req)), 'Mock test fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createMock(req.validated.body, actor(req)), 'Draft mock created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateMock(req.validated.params.id, req.validated.body, actor(req)), 'Mock test updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveMock(req.validated.params.id, actor(req)), 'Mock test archived');
});

/* Lifecycle */
export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreMock(req.validated.params.id, actor(req)), 'Mock test restored to draft');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitForReview(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Submitted for review');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateMock(req.validated.params.id, decision, note, actor(req)), `Mock test ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishMock(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Mock test published');
});

export const versions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listVersions(req.validated.params.id, actor(req)), 'Versions fetched');
});

export const version = asyncHandler(async (req, res) => {
  const { id, version: number } = req.validated.params;
  sendSuccess(res, await service.getVersion(id, number, actor(req)), 'Version fetched');
});

/* Sections */
export const listSectionQuestions = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.validated.params;
  sendSuccess(res, await service.listSectionQuestions(id, sectionId, req.validated.query, actor(req)), 'Section questions fetched');
});

export const setSectionQuestions = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.validated.params;
  sendSuccess(res, await service.setSectionQuestions(id, sectionId, req.validated.body.questionIds, actor(req)), 'Section questions updated');
});

/* Attempts (list + start live under /mocks/:id/attempts) */
export const listAttempts = asyncHandler(async (req, res) => {
  sendSuccess(res, await attemptService.listAttempts(req.validated.params.id, req.validated.query, actor(req)), 'Attempts fetched');
});

export const startAttempt = asyncHandler(async (req, res) => {
  sendCreated(res, await attemptService.startAttempt(req.validated.params.id, actor(req)), 'Attempt started');
});
```

## `server/src/modules/mocks/mockAttempt.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './mockAttempt.service.js';

const actor = (req) => actorFrom(req);

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttempt(req.validated.params.id, actor(req)), 'Attempt fetched');
});

export const questions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttemptQuestions(req.validated.params.id, req.validated.query, actor(req)), 'Questions fetched');
});

export const autosave = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.autosaveAttempt(req.validated.params.id, req.validated.body, actor(req)), 'Answers saved');
});

export const heartbeat = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.heartbeat(req.validated.params.id, req.validated.body, actor(req)), 'Clock synced');
});

export const submitSection = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.validated.params;
  sendSuccess(res, await service.submitSection(id, sectionId, req.validated.body, actor(req)), 'Section submitted');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitAttempt(req.validated.params.id, req.validated.body, actor(req)), 'Attempt submitted');
});

export const result = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getResult(req.validated.params.id, actor(req)), 'Result fetched');
});

export const reasons = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.setWrongReasons(req.validated.params.id, req.validated.body.reasons, actor(req)), 'Answer reasons saved');
});

export const abandon = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.abandonAttempt(req.validated.params.id, actor(req)), 'Attempt abandoned');
});
```

## `server/src/modules/mocks/mockTest.routes.js`

```js
import { Router } from 'express';
import {
  changelogSchema, mockAttemptListQuerySchema, mockAttemptStartSchema, mockCreateSchema,
  mockListQuerySchema, mockParamsSchema, mockQuestionListQuerySchema,
  mockSectionParamsSchema, mockSectionQuestionsSchema, mockUpdateSchema,
  moderationSchema, versionParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './mockTest.controller.js';

/** Mounted at /mocks. Every route is authenticated, onboarded and validated. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: mockListQuerySchema }), controller.list);
router.post('/', validate(mockCreateSchema), controller.create);

router.get('/:id', validate({ params: mockParamsSchema }), controller.get);
router.patch('/:id', validate({ params: mockParamsSchema, body: mockUpdateSchema }), controller.update);
router.delete('/:id', validate({ params: mockParamsSchema }), controller.archive);

router.post('/:id/restore', validate({ params: mockParamsSchema }), controller.restore);
router.post('/:id/revision', validate({ params: mockParamsSchema }), controller.revision);
router.post('/:id/submit', validate({ params: mockParamsSchema, body: changelogSchema }), controller.submit);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: mockParamsSchema, body: moderationSchema }),
  controller.moderate,
);
router.post('/:id/publish', validate({ params: mockParamsSchema, body: changelogSchema }), controller.publish);

router.get('/:id/versions', validate({ params: mockParamsSchema }), controller.versions);
router.get('/:id/versions/:version', validate({ params: versionParamsSchema }), controller.version);

router.get(
  '/:id/sections/:sectionId/questions',
  validate({ params: mockSectionParamsSchema, query: mockQuestionListQuerySchema }),
  controller.listSectionQuestions,
);
router.put(
  '/:id/sections/:sectionId/questions',
  validate({ params: mockSectionParamsSchema, body: mockSectionQuestionsSchema }),
  controller.setSectionQuestions,
);

router.get(
  '/:id/attempts',
  validate({ params: mockParamsSchema, query: mockAttemptListQuerySchema }),
  controller.listAttempts,
);
router.post(
  '/:id/attempts',
  validate({ params: mockParamsSchema, body: mockAttemptStartSchema }),
  controller.startAttempt,
);

export default router;
```

## `server/src/modules/mocks/mockAttempt.routes.js`

```js
import { Router } from 'express';
import {
  mockAttemptParamsSchema, mockAutosaveSchema, mockHeartbeatSchema,
  mockQuestionListQuerySchema, mockReasonSchema, mockSectionParamsSchema,
  mockSubmitSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './mockAttempt.controller.js';

/** Mounted at /mock-attempts — private per-user attempt state and results. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/:id', validate({ params: mockAttemptParamsSchema }), controller.get);
router.get(
  '/:id/questions',
  validate({ params: mockAttemptParamsSchema, query: mockQuestionListQuerySchema }),
  controller.questions,
);
router.patch('/:id/answers', validate({ params: mockAttemptParamsSchema, body: mockAutosaveSchema }), controller.autosave);
router.post('/:id/heartbeat', validate({ params: mockAttemptParamsSchema, body: mockHeartbeatSchema }), controller.heartbeat);
router.post(
  '/:id/sections/:sectionId/submit',
  validate({ params: mockSectionParamsSchema, body: mockSubmitSchema }),
  controller.submitSection,
);
router.post('/:id/submit', validate({ params: mockAttemptParamsSchema, body: mockSubmitSchema }), controller.submit);
router.get('/:id/result', validate({ params: mockAttemptParamsSchema }), controller.result);
router.put('/:id/reasons', validate({ params: mockAttemptParamsSchema, body: mockReasonSchema }), controller.reasons);
router.post('/:id/abandon', validate({ params: mockAttemptParamsSchema }), controller.abandon);

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
import mockRoutes from '../modules/mocks/mockTest.routes.js';
import mockAttemptRoutes from '../modules/mocks/mockAttempt.routes.js';

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

// Phase 4 — Mock tests: sectional/global timers, negative marking, palette,
// server-authoritative autosave and result analysis. Both routers apply
// authenticate + requireOnboarded internally.
router.use('/mocks', requireDatabase, mockRoutes);
router.use('/mock-attempts', requireDatabase, mockAttemptRoutes);

export default router;
```

---

# Server — tests (new)

## `server/tests/mocks.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MOCK_STATUSES as S, MOCK_TIMER_MODES, PALETTE_STATES as P, WRONG_REASONS,
  mockAutosaveSchema, mockCreateSchema, mockHeartbeatSchema, mockReasonSchema,
  mockUpdateSchema,
} from '@algonest/shared';

const { normaliseQuestion } = await import('../src/modules/quizzes/questionNormalizer.js');
const {
  analyseMock, applyWrongReasons, diagnoseWeakTopics, isAttempted, paletteState, paletteSummary,
} = await import('../src/modules/mocks/mockScoring.js');
const {
  advanceSection, creditFocusWindow, effectiveDeadline, globalDeadline,
  initialSectionStates, remainingSeconds, sectionDeadline, totalDurationSeconds,
} = await import('../src/modules/mocks/mockClock.js');
const { canTransition, isEditable, isAttemptable } = await import('../src/modules/mocks/mockWorkflow.js');

const QID = '507f1f77bcf86cd7994390a1';
const SID = '507f1f77bcf86cd7994390b1';

function question(overrides = {}) {
  return normaliseQuestion({
    type: 'mcq', prompt: 'Which structure is LIFO?',
    options: ['Queue', 'Stack', 'Tree'], answer: 'B',
    topic: 'Arrays', difficulty: 'easy', explanation: 'LIFO.', points: 1,
    ...overrides,
  });
}

function makeVersion(overrides = {}) {
  const sections = overrides.sections ?? [
    {
      _id: SID, title: 'Aptitude', durationMinutes: 20, order: 0,
      correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 50,
      questions: [
        { ...question(), _id: QID },
        { ...question({ prompt: 'Which one is FIFO?', topic: 'Queues', difficulty: 'hard' }), _id: '507f1f77bcf86cd7994390a2' },
        { ...question({ prompt: 'Which sort is stable?', topic: 'Sorting' }), _id: '507f1f77bcf86cd7994390a3' },
      ],
    },
  ];
  return {
    version: 1, title: 'Placement Mock', totalDurationMinutes: 20, maxScore: 6,
    settings: { passPercentage: 60, timerMode: MOCK_TIMER_MODES.SECTIONAL },
    sections,
    ...overrides,
  };
}

const IDS = [QID, '507f1f77bcf86cd7994390a2', '507f1f77bcf86cd7994390a3'];
const answer = (questionId, response, extra = {}) => ({
  questionId, response, marked: false, visited: true, accumulatedSeconds: 30,
  ...extra,
});

describe('Phase-4 Zod contracts', () => {
  it('creates a mock with sections and sane defaults', () => {
    const parsed = mockCreateSchema.parse({ title: '  Placement Mock 1  ', sections: [{ title: 'Quant', durationMinutes: 30 }] });
    assert.equal(parsed.title, 'Placement Mock 1');
    assert.equal(parsed.settings.timerMode, 'sectional');
    assert.equal(parsed.settings.maxAttempts, 3);
    assert.equal(parsed.sections[0].correctMarks, 2);
    assert.equal(parsed.sections[0].negativeMarks, 0.5);
  });

  it('rejects invalid section shapes and unknown keys', () => {
    assert.equal(mockCreateSchema.safeParse({ title: 'Valid title', hacker: 1 }).success, false);
    assert.equal(mockCreateSchema.safeParse({ title: 'Valid title', sections: [{ title: 'Q', durationMinutes: 0 }] }).success, false);
    assert.equal(mockCreateSchema.safeParse({ title: 'Valid title', sections: [{ title: 'Q', durationMinutes: 10, negativeMarks: -1 }] }).success, false);
  });

  it('caps total duration and questions, and rejects cross-section duplicates', () => {
    const many = Array.from({ length: 13 }, (_, index) => ({ title: `S${index}`, durationMinutes: 30 }));
    assert.equal(mockCreateSchema.safeParse({ title: 'Too long', sections: many }).success, false);
    const dup = [
      { title: 'A', durationMinutes: 10, questionIds: [QID] },
      { title: 'B', durationMinutes: 10, questionIds: [QID] },
    ];
    assert.equal(mockCreateSchema.safeParse({ title: 'Duplicate', sections: dup }).success, false);
  });

  it('merges partial settings on update', () => {
    assert.equal(mockUpdateSchema.parse({ settings: { timerMode: 'global' } }).settings.timerMode, 'global');
    assert.throws(() => mockUpdateSchema.parse({}));
  });

  it('validates autosave, heartbeat and reason payloads', () => {
    assert.equal(mockAutosaveSchema.safeParse({ answers: [], activeQuestionId: QID }).success, true);
    assert.equal(mockAutosaveSchema.safeParse({ answers: [] }).success, false);
    assert.equal(mockAutosaveSchema.safeParse({
      answers: [{ questionId: QID, response: 'o1', marked: true, visited: true }],
    }).success, true);
    assert.equal(mockAutosaveSchema.safeParse({ answers: [{ questionId: QID, response: 'o1', extra: 1 }] }).success, false);
    assert.equal(mockHeartbeatSchema.safeParse({ activeQuestionId: null }).success, true);
    assert.equal(mockReasonSchema.safeParse({ reasons: [{ questionId: QID, reason: WRONG_REASONS.CONCEPT_GAP }] }).success, true);
    assert.equal(mockReasonSchema.safeParse({ reasons: [{ questionId: QID, reason: 'nope' }] }).success, false);
  });
});

describe('palette states', () => {
  it('distinguishes all five states', () => {
    assert.equal(paletteState(undefined), P.NOT_VISITED);
    assert.equal(paletteState({ visited: true, response: null }), P.NOT_ANSWERED);
    assert.equal(paletteState({ visited: true, response: 'o1' }), P.ANSWERED);
    assert.equal(paletteState({ visited: true, response: null, marked: true }), P.MARKED);
    assert.equal(paletteState({ visited: true, response: ['o0'], marked: true }), P.ANSWERED_MARKED);
  });

  it('counts attempted responses across all question shapes', () => {
    assert.equal(isAttempted([]), false);
    assert.equal(isAttempted({}), false);
    assert.equal(isAttempted(false), true);
    assert.equal(isAttempted(0), true);
    assert.equal(isAttempted('o1'), true);
    assert.equal(isAttempted(['o0']), true);
    assert.equal(isAttempted({ p0: 'p0' }), true);
  });

  it('summarises a palette', () => {
    const summary = paletteSummary(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      [answer('a', 'o1'), answer('b', null, { marked: true }), { questionId: 'c', visited: true, response: null }],
    );
    assert.equal(summary[P.ANSWERED], 1);
    assert.equal(summary[P.MARKED], 1);
    assert.equal(summary[P.NOT_ANSWERED], 1);
    assert.equal(summary[P.NOT_VISITED], 1);
  });
});

describe('mock scoring with negative marking', () => {
  it('awards +2 for correct, −0.5 for wrong, 0 for unattempted', () => {
    const analysis = analyseMock(makeVersion(), [
      answer(IDS[0], 'o1'),          // correct
      answer(IDS[1], 'o0'),          // wrong (o1 is correct)
      answer(IDS[2], null),          // unattempted
    ]);
    assert.equal(analysis.correctCount, 1);
    assert.equal(analysis.incorrectCount, 1);
    assert.equal(analysis.unattemptedCount, 1);
    assert.equal(analysis.score, 1.5); // 2 − 0.5
    assert.equal(analysis.maxScore, 6);
    assert.equal(analysis.percentage, 25);
    assert.equal(analysis.accuracy, 50);
    assert.equal(analysis.sections[0].score, 1.5);
  });

  it('enforces sectional cut-off even when the overall score passes', () => {
    const version = makeVersion({
      settings: { passPercentage: 10, timerMode: MOCK_TIMER_MODES.GLOBAL },
    });
    version.sections[0].cutoffPercentage = 80;
    const analysis = analyseMock(version, [answer(IDS[0], 'o1'), answer(IDS[1], 'o0'), answer(IDS[2], 'o1')]);
    // 2 − 0.5 + 2 = 3.5 / 6 = 58.3% > 10% overall but < 80% sectional
    assert.equal(analysis.percentage, 58.3);
    assert.equal(analysis.sections[0].passed, false);
    assert.equal(analysis.passed, false);
  });

  it('passes only when all cut-offs and the overall bar are met', () => {
    const version = makeVersion({ settings: { passPercentage: 50, timerMode: MOCK_TIMER_MODES.GLOBAL } });
    version.sections[0].cutoffPercentage = 50;
    const analysis = analyseMock(version, [answer(IDS[0], 'o1'), answer(IDS[1], 'o1'), answer(IDS[2], 'o1')]);
    assert.equal(analysis.score, 6);
    assert.equal(analysis.percentage, 100);
    assert.equal(analysis.passed, true);
  });

  it('aggregates multiple sections with different marking schemes', () => {
    const version = makeVersion({
      settings: { passPercentage: 0, timerMode: MOCK_TIMER_MODES.SECTIONAL },
      sections: [
        { ...makeVersion().sections[0], cutoffPercentage: 0 },
        {
          _id: '507f1f77bcf86cd7994390b2', title: 'Reasoning', durationMinutes: 10, order: 1,
          correctMarks: 3, negativeMarks: 1, cutoffPercentage: 0,
          questions: [{ ...question(), _id: '507f1f77bcf86cd7994390a4' }],
        },
      ],
    });
    const analysis = analyseMock(version, [
      answer(IDS[0], 'o1'), answer('507f1f77bcf86cd7994390a4', 'o0'),
    ]);
    assert.equal(analysis.sections.length, 2);
    assert.equal(analysis.sections[1].score, -1);
    assert.equal(analysis.score, 1); // 2 − 1
    assert.equal(analysis.maxScore, 9); // 3*2 + 3
  });

  it('builds difficulty, topic, weak-topic and time diagnostics', () => {
    const analysis = analyseMock(makeVersion(), [
      answer(IDS[0], 'o1', { accumulatedSeconds: 20 }),
      answer(IDS[1], 'o0', { accumulatedSeconds: 90 }),
      answer(IDS[2], 'o0', { accumulatedSeconds: 40 }),
    ]);
    assert.equal(analysis.difficultyStats.length, 2);
    assert.ok(analysis.difficultyStats.some((stat) => stat.difficulty === 'hard'));
    assert.equal(analysis.topicStats.length, 3);
    assert.equal(analysis.timeStats.totalSeconds, 150);
    assert.equal(analysis.timeStats.averageSeconds, 50);
    assert.equal(analysis.timeStats.slowest[0].seconds, 90);
    assert.ok(analysis.weakTopics.length >= 1);
    assert.equal(analysis.weakTopics[0].topic, 'Queues'); // hardest hit first
  });

  it('hides explanations when disabled', () => {
    const analysis = analyseMock(makeVersion(), [], { showExplanations: false });
    assert.equal('expected' in analysis.results[0], false);
    assert.equal('explanation' in analysis.results[0], false);
  });

  it('raises severity for knowledge-gap reasons', () => {
    const results = [
      { questionId: IDS[0], topic: 'Arrays', correct: false, reason: WRONG_REASONS.CONCEPT_GAP },
      { questionId: IDS[1], topic: 'Arrays', correct: false, reason: WRONG_REASONS.CONCEPT_GAP },
      { questionId: IDS[2], topic: 'Arrays', correct: true, reason: null },
    ];
    const topicStats = [{ topic: 'Arrays', percentage: 66.7, lostMarks: 5, incorrect: 2, total: 3, correct: 1, score: 2, maxScore: 6 }];
    const weak = diagnoseWeakTopics(topicStats, results);
    assert.equal(weak[0].knowledgeGaps, 2);
    assert.equal(weak[0].severity, 'high');
  });

  it('only tags wrong questions and summarises reasons', () => {
    const results = [
      { questionId: IDS[0], correct: true, topic: 'Arrays' },
      { questionId: IDS[1], correct: false, topic: 'Queues' },
      { questionId: IDS[2], correct: false, topic: 'Sorting' },
    ];
    const tagged = applyWrongReasons(results, [
      { questionId: IDS[0], reason: WRONG_REASONS.GUESSED }, // ignored: correct
      { questionId: IDS[1], reason: WRONG_REASONS.CONCEPT_GAP },
      { questionId: IDS[2], reason: WRONG_REASONS.SILLY_MISTAKE },
    ]);
    assert.equal(tagged.results[0].reason, undefined);
    assert.equal(tagged.results[1].reason, WRONG_REASONS.CONCEPT_GAP);
    assert.equal(tagged.taggedCount, 2);
    assert.equal(tagged.reasonSummary.find((item) => item.reason === WRONG_REASONS.CONCEPT_GAP).count, 1);
  });
});

describe('server-authoritative clock', () => {
  const start = new Date('2026-01-01T10:00:00.000Z');
  const twoSections = [
    { _id: 's1', title: 'A', durationMinutes: 10 },
    { _id: 's2', title: 'B', durationMinutes: 20 },
  ];

  it('computes total duration and a global hard deadline', () => {
    assert.equal(totalDurationSeconds(twoSections), 1800);
    const deadline = globalDeadline(start, twoSections, MOCK_TIMER_MODES.GLOBAL);
    assert.equal(deadline, start.getTime() + 1800_000);
    assert.equal(remainingSeconds(deadline, start.getTime()), 1800);
  });

  it('adds a bounded transition grace only in sectional mode', () => {
    const sectional = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    assert.equal(sectional, start.getTime() + 1860_000);
  });

  it('never lets a section deadline exceed the hard backstop', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    const entered = new Date(hard - 60_000);
    assert.equal(sectionDeadline(entered, 20, hard), hard);
  });

  it('credits focus windows using server timestamps with a cap', () => {
    const t0 = Date.parse('2026-01-01T10:00:00Z');
    const opened = creditFocusWindow(null, t0, { open: true });
    assert.equal(opened.accumulatedSeconds, 0);
    assert.equal(opened.lastSeenAt.getTime(), t0);

    const beat = creditFocusWindow(opened, t0 + 20_000, { open: true });
    assert.equal(beat.accumulatedSeconds, 20);

    const closed = creditFocusWindow(beat, t0 + 35_000, { open: false });
    assert.equal(closed.accumulatedSeconds, 35);
    assert.equal(closed.lastSeenAt, null);

    // A disconnected tab cannot credit more than the cap in one window.
    const capped = creditFocusWindow(opened, t0 + 3_600_000, { open: true });
    assert.equal(capped.accumulatedSeconds, 300);
  });

  it('creates correct initial section states for both timer modes', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    const sectional = initialSectionStates(twoSections, start, MOCK_TIMER_MODES.SECTIONAL, hard);
    assert.equal(sectional[0].status, 'active');
    assert.equal(sectional[1].status, 'pending');
    assert.equal(sectional[0].expiresAt.getTime(), start.getTime() + 600_000);

    const global = initialSectionStates(twoSections, start, MOCK_TIMER_MODES.GLOBAL, hard);
    assert.ok(global.every((state) => state.status === 'active'));
    assert.ok(global.every((state) => state.expiresAt.getTime() === hard));
  });

  it('advances to the next section with a fresh deadline, then finishes', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    let states = initialSectionStates(twoSections, start, MOCK_TIMER_MODES.SECTIONAL, hard);
    const now = start.getTime() + 600_000;
    const first = advanceSection(states, now, hard, 'timed_out');
    states = first.states;
    assert.equal(first.finished, false);
    assert.equal(states[0].status, 'timed_out');
    assert.equal(states[1].status, 'active');
    assert.equal(states[1].expiresAt.getTime(), now + 1200_000);

    const second = advanceSection(states, now + 1200_000, hard, 'submitted');
    assert.equal(second.finished, true);
    assert.equal(second.states[1].status, 'submitted');
  });

  it('effectiveDeadline is the earlier of section and attempt deadlines', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    const attempt = {
      expiresAt: new Date(hard),
      sectionStates: initialSectionStates(twoSections, start, MOCK_TIMER_MODES.SECTIONAL, hard),
    };
    assert.equal(effectiveDeadline(attempt, start.getTime()), start.getTime() + 600_000);
  });
});

describe('mock lifecycle + availability', () => {
  it('follows the standard content lifecycle', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.equal(isEditable(S.PUBLISHED), false);
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

## `server/tests/mocks.service.test.js`

```js
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import {
  MOCK_ATTEMPT_STATUSES as A, MOCK_STATUSES as S, MOCK_TIMER_MODES,
  PERMISSIONS, ROLES,
} from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { MockTest } = await import('../src/models/MockTest.js');
const { MockVersion } = await import('../src/models/MockVersion.js');
const { MockAttempt } = await import('../src/models/MockAttempt.js');
const { Question } = await import('../src/models/Question.js');
const { Sheet } = await import('../src/models/Sheet.js');
const { PersonalResource } = await import('../src/models/PersonalResource.js');
const testService = await import('../src/modules/mocks/mockTest.service.js');
const attemptService = await import('../src/modules/mocks/mockAttempt.service.js');
const { normaliseQuestion } = await import('../src/modules/quizzes/questionNormalizer.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const MOCK_ID = oid('507f1f77bcf86cd799439011');
const VERSION_ID = oid('507f1f77bcf86cd799439012');
const SECTION_A = oid('507f1f77bcf86cd7994390b1');
const SECTION_B = oid('507f1f77bcf86cd7994390b2');
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

function chainable(value) {
  const promise = Promise.resolve(value);
  const chain = {};
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where', 'count']) chain[method] = () => chain;
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

const q = (prompt, topic, difficulty = 'easy') => normaliseQuestion({
  type: 'mcq', prompt, options: ['Queue', 'Stack', 'Tree'], answer: 'B',
  topic, difficulty, explanation: 'LIFO.', points: 1,
});

const BANK = [
  { ...q('Which structure is LIFO?', 'Arrays'), _id: Q1, author: OWNER },
  { ...q('Which one is FIFO?', 'Queues', 'hard'), _id: Q2, author: OWNER },
  { ...q('Which sort is stable?', 'Sorting'), _id: Q3, author: OWNER },
  { ...q('Which tree is balanced?', 'Trees'), _id: Q4, author: OWNER },
];

function makeMock(overrides = {}) {
  return new MockTest({
    _id: MOCK_ID,
    title: 'Placement Mock 1',
    slug: 'placement-mock-1-abc',
    author: OWNER,
    status: S.DRAFT,
    difficulty: 'medium',
    goals: [], topics: [], tags: [],
    settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60, maxAttempts: 3 },
    sections: [
      { _id: SECTION_A, title: 'Aptitude', description: '', durationMinutes: 10, correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 50, questionIds: [Q1, Q2], order: 0 },
      { _id: SECTION_B, title: 'Reasoning', description: '', durationMinutes: 10, correctMarks: 3, negativeMarks: 1, cutoffPercentage: 40, questionIds: [Q3, Q4], order: 1 },
    ],
    publishedVersion: 0,
    ...overrides,
  });
}

function makeVersion(overrides = {}) {
  return {
    _id: VERSION_ID,
    mock: MOCK_ID,
    version: 1,
    title: 'Placement Mock 1',
    description: '',
    difficulty: 'medium',
    topics: ['Arrays', 'Queues', 'Sorting', 'Trees'],
    totalDurationMinutes: 20,
    maxScore: 10,
    settings: {
      timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60, maxAttempts: 3,
      shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
      showExplanations: true, allowPaletteBack: true,
    },
    sections: [
      { _id: SECTION_A, title: 'Aptitude', description: '', durationMinutes: 10, correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 50, order: 0, questionCount: 2, maxScore: 4, questions: [{ ...BANK[0], order: 0 }, { ...BANK[1], order: 1 }] },
      { _id: SECTION_B, title: 'Reasoning', description: '', durationMinutes: 10, correctMarks: 3, negativeMarks: 1, cutoffPercentage: 40, order: 1, questionCount: 2, maxScore: 6, questions: [{ ...BANK[2], order: 0 }, { ...BANK[3], order: 1 }] },
    ],
    ...overrides,
  };
}

function stubMock(doc) {
  stub(MockTest, 'findById', () => chainable(doc));
  stub(MockTest, 'updateOne', () => chainable({}));
}
function stubVersion(version) {
  stub(MockVersion, 'findOne', () => chainable(version));
  stub(MockVersion, 'findById', () => chainable(version));
  stub(MockVersion, 'find', () => chainable(version ? [version] : []));
  stub(MockVersion, 'deleteOne', () => chainable({}));
}
function stubBank(docs = BANK) {
  stub(Question, 'find', () => chainable(docs));
  stub(Question, 'updateMany', async () => ({ modifiedCount: docs.length }));
}
function stubSave(...prototypes) {
  for (const proto of prototypes) stub(proto, 'save', async function save() { return this; });
}
function stubNoRecommendations() {
  stub(Sheet, 'find', () => chainable([]));
  stub(PersonalResource, 'find', () => chainable([]));
}
function stubAttemptQueries({ live = null, used = 0, attempts = [] } = {}) {
  stub(MockAttempt, 'findOne', () => chainable(live));
  stub(MockAttempt, 'countDocuments', async () => used);
  stub(MockAttempt, 'find', () => chainable(attempts));
}

/* ───────────────────────── mock test service ───────────────────────── */

describe('mockTest.service — authorisation + lifecycle', () => {
  it('blocks a non-author student from editing', async () => {
    stubMock(makeMock());
    await assert.rejects(
      () => testService.updateMock(String(MOCK_ID), { title: 'Hacked mock' }, stranger),
      (error) => error.statusCode === 403,
    );
  });

  it('lets a moderator edit but never moderate their own mock', async () => {
    stubMock(makeMock({ status: S.PENDING_REVIEW, author: OTHER }));
    await assert.rejects(
      () => testService.moderateMock(String(MOCK_ID), 'approve', '', moderator),
      (error) => error.statusCode === 403 && /authored|own mock/i.test(error.message),
    );
    stubSave(MockTest.prototype);
    const result = await testService.moderateMock(String(MOCK_ID), 'approve', 'LGTM', superAdmin);
    assert.equal(result.mock.status, S.APPROVED);
  });

  it('refuses to submit a mock with an empty section', async () => {
    stubMock(makeMock({ sections: [{ _id: SECTION_A, title: 'Empty', durationMinutes: 10, correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 0, questionIds: [], order: 0 }] }));
    await assert.rejects(
      () => testService.submitForReview(String(MOCK_ID), '', owner),
      (error) => error.statusCode === 422,
    );
  });

  it('follows draft → review → approved → published with an immutable version', async () => {
    const mock = makeMock();
    stubMock(mock);
    stubSave(MockTest.prototype);
    stubBank();

    await testService.submitForReview(String(MOCK_ID), 'first draft', owner);
    assert.equal(mock.status, S.PENDING_REVIEW);
    await testService.moderateMock(String(MOCK_ID), 'approve', 'LGTM', moderator);
    assert.equal(mock.status, S.APPROVED);

    let created = null;
    stub(MockVersion, 'create', async (payload) => { created = payload; return { _id: VERSION_ID, ...payload }; });
    const result = await testService.publishMock(String(MOCK_ID), 'v1', owner);
    assert.equal(mock.status, S.PUBLISHED);
    assert.equal(mock.publishedVersion, 1);
    assert.equal(mock.publishedQuestionCount, 4);
    assert.equal(result.version.maxScore, 10);
    assert.equal(created.sections.length, 2);
    assert.equal(String(created.sections[0].questions[0]._id), String(Q1));
    assert.equal(created.sections[1].correctMarks, 3);
    assert.equal(created.sections[1].negativeMarks, 1);
    assert.deepEqual(created.sections[0].questions[0].answerKey, ['o1']);
  });

  it('rolls back the orphan version when the mock save fails', async () => {
    stubMock(makeMock({ status: S.APPROVED }));
    stubBank();
    let deleted = false;
    stub(MockVersion, 'create', async (payload) => ({ _id: VERSION_ID, ...payload }));
    stub(MockVersion, 'deleteOne', () => { deleted = true; return chainable({}); });
    stub(MockTest.prototype, 'save', async () => { throw new Error('db write failed'); });
    await assert.rejects(() => testService.publishMock(String(MOCK_ID), '', owner), /db write failed/);
    assert.equal(deleted, true);
  });

  it('serves students the frozen published snapshot, never the draft', async () => {
    const version = makeVersion();
    stubMock(makeMock({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(version);
    stubAttemptQueries({ attempts: [] });
    const detail = await testService.getMock(String(MOCK_ID), stranger);
    assert.equal(detail.mock.viewedVersion, 1);
    assert.equal(detail.mock.isPublishedSnapshot, true);
    assert.equal(detail.mock.sectionCount, 2);
    assert.equal(detail.mock.questionCount, 4);
    assert.equal(detail.canManage, false);
    assert.equal(detail.mySummary.attemptsLeft, 3);
  });

  it('rejects a duplicate question across sections and a foreign bank question', async () => {
    const mock = makeMock();
    stubMock(mock);
    stubSave(MockTest.prototype);
    stubBank();
    await assert.rejects(
      () => testService.setSectionQuestions(String(MOCK_ID), String(SECTION_B), [String(Q1), String(Q3)], owner),
      (error) => error.statusCode === 409,
    );
    stubBank([{ ...BANK[0], _id: '507f1f77bcf86cd7994390ff', author: OTHER }]);
    await assert.rejects(
      () => testService.setSectionQuestions(String(MOCK_ID), String(SECTION_A), ['507f1f77bcf86cd7994390ff'], owner),
      (error) => error.statusCode === 403,
    );
  });
});

/* ───────────────────────── attempt service ───────────────────────── */

async function newStartedAttempt(overrides = {}) {
  const version = makeVersion(overrides.version);
  stubMock(makeMock({ status: S.PUBLISHED, publishedVersion: 1 }));
  stubVersion(version);
  stubBank();
  stubSave(MockAttempt.prototype);
  stubAttemptQueries({ live: null, used: overrides.used ?? 0, attempts: [] });
  stubNoRecommendations();
  return attemptService.startAttempt(String(MOCK_ID), owner);
}

describe('mockAttempt.service — server clock, resume, grading', () => {
  it('starts with an absolute server deadline and one active section', async () => {
    const before = Date.now();
    const { attempt, remainingSeconds, mock } = await newStartedAttempt();
    assert.equal(attempt.status, A.IN_PROGRESS);
    assert.equal(attempt.questionCount, 4);
    assert.equal(attempt.sectionStates[0].status, 'active');
    assert.equal(attempt.sectionStates[1].status, 'pending');
    assert.equal(mock.maxScore, 10);
    // First section is 10 minutes; the hard backstop is 21 minutes.
    assert.ok(remainingSeconds <= 600 && remainingSeconds >= 599);
    assert.ok(new Date(attempt.expiresAt).getTime() >= before + 1_259_000);
  });

  it('refuses to start an unpublished mock and enforces maxAttempts', async () => {
    stubMock(makeMock({ status: S.DRAFT }));
    stubVersion(makeVersion());
    await assert.rejects(
      () => attemptService.startAttempt(String(MOCK_ID), owner),
      (error) => error.statusCode === 403,
    );

    stubMock(makeMock({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubAttemptQueries({ used: 3 });
    await assert.rejects(
      () => attemptService.startAttempt(String(MOCK_ID), owner),
      (error) => error.statusCode === 409 && /all 3 attempts/.test(error.message),
    );
  });

  it('never sends answer keys to the solver and only exposes the active section', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      expiresAt: new Date(Date.now() + 1_260_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    const data = await attemptService.getAttemptQuestions(attempt.id, { page: 1, limit: 300 }, owner);
    assert.equal(data.items.length, 2, 'only the active section is visible');
    assert.equal(data.pagination.total, 2);
    const json = JSON.stringify(data.items);
    for (const secret of ['answerKey', 'booleanKey', 'textAnswers', 'explanation', 'expected']) {
      assert.equal(json.includes(secret), false, `leaked ${secret}`);
    }
  });

  it('rejects autosave by another user and ignores locked-section answers', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      expiresAt: new Date(Date.now() + 1_260_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    await assert.rejects(
      () => attemptService.autosaveAttempt(attempt.id, { answers: [{ questionId: String(Q1), response: 'o1', marked: false, visited: true }], activeQuestionId: String(Q1) }, stranger),
      (error) => error.statusCode === 403,
    );
    const saved = await attemptService.autosaveAttempt(attempt.id, {
      answers: [
        { questionId: String(Q1), response: 'o1', marked: false, visited: true },
        { questionId: String(Q3), response: 'o0', marked: false, visited: true }, // locked section
      ],
      activeQuestionId: String(Q1),
    }, owner);
    assert.equal(saved.ignored, 1);
    assert.equal(saved.attempt.answers.length, 1);
    assert.equal(saved.attempt.answers[0].response, 'o1');
  });

  it('credits focus time from server timestamps, never from the client payload', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      expiresAt: new Date(Date.now() + 1_260_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    // Strict Zod rejects a client-supplied duration before the service sees it.
    // The service itself only ever credits time from `new Date()` on its side.
    const first = await attemptService.autosaveAttempt(attempt.id, { answers: [], activeQuestionId: String(Q1) }, owner);
    assert.equal(first.attempt.answers.length, 1);
    assert.equal(first.attempt.answers[0].visited, true);
    assert.equal(first.attempt.answers[0].accumulatedSeconds, 0);
    assert.equal(first.attempt.answers[0].response, null);
  });

  it('auto-advances on section timeout and auto-finalises on the hard deadline', async () => {
    const { attempt } = await newStartedAttempt();
    const expiredSection = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates.map((state, index) => ({
        ...state,
        expiresAt: new Date(Date.now() - 1000),
        sectionId: oid(state.sectionId),
      })),
      startedAt: new Date(Date.now() - 1_300_000),
      expiresAt: new Date(Date.now() + 60_000),
      answers: [{ questionId: Q1, sectionId: SECTION_A, response: 'o1', marked: false, visited: true, accumulatedSeconds: 30 }],
    });
    stub(MockAttempt, 'findById', async () => expiredSection);
    stubSave(MockAttempt.prototype);
    stubNoRecommendations();
    const resumed = await attemptService.getAttempt(attempt.id, owner);
    assert.equal(resumed.sectionAdvanced, true);
    assert.equal(resumed.attempt.status, A.IN_PROGRESS);
    assert.equal(resumed.attempt.sectionStates[0].status, 'timed_out');
    assert.equal(resumed.attempt.sectionStates[1].status, 'active');
    assert.ok(resumed.attempt.answers.length >= 1, 'resume restores autosaved answers');

    // Now force the hard deadline back.
    expiredSection.expiresAt = new Date(Date.now() - 1000);
    const final = await attemptService.getAttempt(attempt.id, owner);
    assert.equal(final.expired, true);
    assert.equal(final.attempt.status, A.TIMED_OUT);
  });

  it('grades with negative marking and builds difficulty/topic/time diagnostics', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.GLOBAL, passPercentage: 60, showExplanations: true },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates.map((state) => ({ ...state, status: 'active', expiresAt: new Date(Date.now() + 600_000) })),
      startedAt: new Date(Date.now() - 120_000),
      expiresAt: new Date(Date.now() + 600_000),
      answers: [
        { questionId: Q1, sectionId: SECTION_A, response: 'o1', marked: false, visited: true, accumulatedSeconds: 20 },
        { questionId: Q2, sectionId: SECTION_A, response: 'o0', marked: true, visited: true, accumulatedSeconds: 90 },
        { questionId: Q3, sectionId: SECTION_B, response: null, marked: false, visited: true, accumulatedSeconds: 40 },
      ],
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    stubNoRecommendations();

    const result = await attemptService.submitAttempt(attempt.id, { answers: [] }, owner);
    assert.equal(result.attempt.status, A.SUBMITTED);
    // Q1 +2, Q2 −0.5, Q3 unattempted 0, Q4 not visited 0 → 1.5 / 10
    assert.equal(result.attempt.score, 1.5);
    assert.equal(result.attempt.maxScore, 10);
    assert.equal(result.attempt.percentage, 15);
    assert.equal(result.attempt.accuracy, 50);
    assert.equal(result.attempt.correctCount, 1);
    assert.equal(result.attempt.incorrectCount, 1);
    assert.equal(result.attempt.unattemptedCount, 2);
    assert.equal(result.attempt.sections.length, 2);
    assert.ok(result.attempt.difficultyStats.length >= 2);
    assert.ok(result.attempt.topicStats.length >= 3);
    assert.ok(result.attempt.timeStats.totalSeconds >= 150);
  });

  it('submitSection flushes final answers, advances, then finalises on the last section', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      startedAt: new Date(Date.now() - 60_000),
      expiresAt: new Date(Date.now() + 1_200_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    stubNoRecommendations();

    const first = await attemptService.submitSection(String(attempt.id), String(SECTION_A), {
      answers: [{ questionId: String(Q1), response: 'o1', marked: false, visited: true }],
    }, owner);
    assert.equal(first.finished, false);
    assert.equal(first.sectionAdvanced, true);
    assert.equal(first.attempt.answers.length, 1);

    const second = await attemptService.submitSection(String(attempt.id), String(SECTION_B), {
      answers: [{ questionId: String(Q3), response: 'o1', marked: false, visited: true }],
    }, owner);
    assert.equal(second.finished, true);
    assert.equal(second.attempt.status, A.SUBMITTED);
    assert.equal(second.attempt.score, 5); // 2 + 3
  });

  it('tags only wrong answers and refreshes weak topics + recommendations', async () => {
    const { attempt } = await newStartedAttempt();
    const finished = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.SUBMITTED,
      settings: { timerMode: MOCK_TIMER_MODES.GLOBAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: [], expiresAt: new Date(Date.now() + 600_000),
      results: [
        { questionId: Q1, sectionId: SECTION_A, type: 'mcq', topic: 'Arrays', correct: true },
        { questionId: Q2, sectionId: SECTION_A, type: 'mcq', topic: 'Queues', correct: false },
      ],
      topicStats: [{ key: 'Queues', topic: 'Queues', total: 1, correct: 0, incorrect: 1, score: -0.5, maxScore: 2, percentage: 0, lostMarks: 2.5 }],
    });
    stub(MockAttempt, 'findById', async () => finished);
    stubSave(MockAttempt.prototype);
    stub(Sheet, 'find', () => chainable([{
      title: 'Queue fundamentals', topics: ['Queues'],
      problems: [{ title: 'Implement Queue using Stacks', url: 'https://leetcode.com/problems/implement-queue-using-stacks/', topic: 'Queues' }],
    }]));
    stub(PersonalResource, 'find', () => chainable([{
      title: 'Queues explained', url: 'https://example.com/queues', topic: 'Queues', type: 'video',
    }]));

    await assert.rejects(
      () => attemptService.setWrongReasons(String(attempt.id), [{ questionId: String(Q1), reason: 'concept_gap' }], owner),
      (error) => error.statusCode === 422,
    );
    const tagged = await attemptService.setWrongReasons(String(attempt.id), [{ questionId: String(Q2), reason: 'concept_gap' }], owner);
    assert.equal(tagged.reasonSummary.find((item) => item.reason === 'concept_gap').count, 1);
    assert.ok(tagged.weakTopics.some((entry) => entry.topic === 'Queues'));
    assert.equal(tagged.recommendations.length, 2);
    assert.ok(tagged.recommendations.some((item) => item.url.includes('leetcode.com')));
    assert.ok(tagged.recommendations.some((item) => item.source === 'personal'));
  });
});
```

## `server/tests/mocks.routes.test.js`

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
const MOCK = '/mocks/507f1f77bcf86cd799439011';
const SECTION = '507f1f77bcf86cd7994390b1';
const ATTEMPT = '/mock-attempts/507f1f77bcf86cd799439012';

describe('Phase-4 route protection', () => {
  it('rejects anonymous access to every mock test route', async () => {
    const endpoints = [
      ['get', '/mocks'], ['post', '/mocks'],
      ['get', MOCK], ['patch', MOCK], ['delete', MOCK],
      ['post', `${MOCK}/submit`], ['post', `${MOCK}/moderate`], ['post', `${MOCK}/publish`],
      ['post', `${MOCK}/revision`], ['post', `${MOCK}/restore`],
      ['get', `${MOCK}/versions`], ['get', `${MOCK}/versions/1`],
      ['get', `${MOCK}/sections/${SECTION}/questions`],
      ['put', `${MOCK}/sections/${SECTION}/questions`],
      ['get', `${MOCK}/attempts`], ['post', `${MOCK}/attempts`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to every mock-attempt route', async () => {
    const endpoints = [
      ['get', ATTEMPT], ['get', `${ATTEMPT}/questions`],
      ['patch', `${ATTEMPT}/answers`], ['post', `${ATTEMPT}/heartbeat`],
      ['post', `${ATTEMPT}/sections/${SECTION}/submit`],
      ['post', `${ATTEMPT}/submit`], ['get', `${ATTEMPT}/result`],
      ['put', `${ATTEMPT}/reasons`], ['post', `${ATTEMPT}/abandon`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.data, null);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const res = await request.post(`${base}/mocks`).send({ title: 'x', bogus: true });
    assert.equal(res.status, 401);
    assert.equal(res.body.errors, null);
    const autosave = await request.patch(`${base}${ATTEMPT}/answers`).send({ answers: [{ questionId: 'nope', response: 'x' }] });
    assert.equal(autosave.status, 401);
    assert.equal(autosave.body.errors, null);
  });

  it('keeps the health probe public and earlier phases unchanged', async () => {
    assert.equal((await request.get(`${base}/health`)).status, 200);
    assert.equal((await request.get(`${base}/quizzes`)).status, 401);
    assert.equal((await request.get(`${base}/sheets`)).status, 401);
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
  // Phase 4 — Mock tests.
  mocks: {
    all: ['mocks'],
    list: (params) => ['mocks', 'list', params],
    detail: (id) => ['mocks', 'detail', id],
    versions: (id) => ['mocks', 'versions', id],
    sections: (id, sectionId, params) => ['mocks', 'sections', id, sectionId, params],
    attempts: (id, params) => ['mocks', 'attempts', id, params],
  },
  mockAttempts: {
    all: ['mock-attempts'],
    detail: (id) => ['mock-attempts', 'detail', id],
    questions: (id, params) => ['mock-attempts', 'questions', id, params],
    result: (id) => ['mock-attempts', 'result', id],
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
  { label: 'Mocks', to: '/app/mocks', icon: 'Timer', ready: true },
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

// Phase 4 — Mock tests. The engine and analysis are separate chunks so the
// catalogue never downloads the timer/palette/result code.
const MocksPage = lazy(() => import('../features/mocks/pages/MocksPage.jsx'));
const MockDetailPage = lazy(() => import('../features/mocks/pages/MockDetailPage.jsx'));
const MockEditorPage = lazy(() => import('../features/mocks/pages/MockEditorPage.jsx'));
const MockSolverPage = lazy(() => import('../features/mocks/pages/MockSolverPage.jsx'));
const MockResultPage = lazy(() => import('../features/mocks/pages/MockResultPage.jsx'));

// Plans, Resources and Community keep their honest placeholder
// until their phase lands.
const UPCOMING_MODULES = ['plans', 'resources', 'community'];

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

              <Route path="mocks" element={<MocksPage />} />
              <Route path="mocks/new" element={<MockEditorPage />} />
              <Route path="mocks/:id" element={<MockDetailPage />} />
              <Route path="mocks/:id/edit" element={<MockEditorPage />} />
              <Route path="mocks/:id/attempts/:attemptId" element={<MockSolverPage />} />
              <Route path="mocks/:id/results/:attemptId" element={<MockResultPage />} />

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
  ['MocksPage', '/src/features/mocks/pages/MocksPage.jsx'],
  ['MockDetailPage', '/src/features/mocks/pages/MockDetailPage.jsx'],
  ['MockEditorPage', '/src/features/mocks/pages/MockEditorPage.jsx'],
  ['MockSolverPage', '/src/features/mocks/pages/MockSolverPage.jsx'],
  ['MockResultPage', '/src/features/mocks/pages/MockResultPage.jsx'],
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

# Client — mocks api, hooks, lib (new)

## `client/src/features/mocks/api/mockApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Thin wrappers around /api/v1/mocks. No user id or clock is ever sent. */
export const mockApi = {
  list: (params) => api.get('/mocks', { query: params }),
  get: (id) => api.get(`/mocks/${id}`),
  create: (body) => api.post('/mocks', body),
  update: (id, body) => api.patch(`/mocks/${id}`, body),
  archive: (id) => api.delete(`/mocks/${id}`),
  restore: (id) => api.post(`/mocks/${id}/restore`, {}),
  revision: (id) => api.post(`/mocks/${id}/revision`, {}),
  submit: (id, changelog = '') => api.post(`/mocks/${id}/submit`, { changelog }),
  moderate: (id, body) => api.post(`/mocks/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/mocks/${id}/publish`, { changelog }),

  versions: (id) => api.get(`/mocks/${id}/versions`),
  version: (id, version) => api.get(`/mocks/${id}/versions/${version}`),

  sectionQuestions: (id, sectionId, params) => api.get(`/mocks/${id}/sections/${sectionId}/questions`, { query: params }),
  setSectionQuestions: (id, sectionId, questionIds) => api.put(`/mocks/${id}/sections/${sectionId}/questions`, { questionIds }),

  attempts: (id, params) => api.get(`/mocks/${id}/attempts`, { query: params }),
  startAttempt: (id) => api.post(`/mocks/${id}/attempts`, {}),
};

export default mockApi;
```

## `client/src/features/mocks/api/mockAttemptApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Per-user mock attempt state (/mock-attempts). All deadlines come from the server. */
export const mockAttemptApi = {
  get: (id) => api.get(`/mock-attempts/${id}`),
  // `sectionKey` is a React Query cache-buster only — never sent to the API.
  questions: (id, params = {}) => {
    const query = { ...params };
    delete query.sectionKey;
    return api.get(`/mock-attempts/${id}/questions`, { query });
  },
  autosave: (id, body) => api.patch(`/mock-attempts/${id}/answers`, body),
  heartbeat: (id, activeQuestionId) => api.post(`/mock-attempts/${id}/heartbeat`, { activeQuestionId }),
  submitSection: (id, sectionId, body) => api.post(`/mock-attempts/${id}/sections/${sectionId}/submit`, body),
  submit: (id, body = {}) => api.post(`/mock-attempts/${id}/submit`, body),
  result: (id) => api.get(`/mock-attempts/${id}/result`),
  reasons: (id, reasons) => api.put(`/mock-attempts/${id}/reasons`, { reasons }),
  abandon: (id) => api.post(`/mock-attempts/${id}/abandon`, {}),
};

export default mockAttemptApi;
```

## `client/src/features/mocks/hooks/useMocks.js`

```js
import {
  keepPreviousData, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import mockApi from '../api/mockApi.js';
import mockAttemptApi from '../api/mockAttemptApi.js';

function useInvalidators() {
  const qc = useQueryClient();
  return {
    lists: () => qc.invalidateQueries({ queryKey: queryKeys.mocks.all }),
    mock: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.mocks.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.versions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.sections(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.attempts(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.all });
    },
    attempt: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.mockAttempts.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mockAttempts.result(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mockAttempts.all });
    },
    bank: () => qc.invalidateQueries({ queryKey: queryKeys.questionBank.all }),
  };
}

/* Queries */
export function useMockList(params) {
  return useQuery({
    queryKey: queryKeys.mocks.list(params),
    queryFn: () => mockApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useMock(id) {
  return useQuery({ queryKey: queryKeys.mocks.detail(id), queryFn: () => mockApi.get(id), enabled: Boolean(id) });
}

export function useMockVersions(id) {
  return useQuery({ queryKey: queryKeys.mocks.versions(id), queryFn: () => mockApi.versions(id), enabled: Boolean(id) });
}

export function useMockAttempts(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.mocks.attempts(id, params),
    queryFn: () => mockApi.attempts(id, params),
    enabled: Boolean(id), placeholderData: keepPreviousData,
  });
}

export function useSectionQuestions(id, sectionId, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mocks.sections(id, sectionId, params),
    queryFn: () => mockApi.sectionQuestions(id, sectionId, params),
    enabled: Boolean(id && sectionId) && enabled,
  });
}

export function useMockAttempt(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mockAttempts.detail(id),
    queryFn: () => mockAttemptApi.get(id),
    enabled: Boolean(id) && enabled,
    refetchOnWindowFocus: true, // reconnection re-syncs the server clock
  });
}

export function useMockAttemptQuestions(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mockAttempts.questions(id, params),
    queryFn: () => mockAttemptApi.questions(id, params),
    enabled: Boolean(id) && enabled,
    staleTime: Infinity,
  });
}

export function useMockResult(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mockAttempts.result(id),
    queryFn: () => mockAttemptApi.result(id),
    enabled: Boolean(id) && enabled,
  });
}

/* Mock CRUD + lifecycle */
export function useCreateMock() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: mockApi.create, onSuccess: () => invalidate.lists() });
}

export function useUpdateMock(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => mockApi.update(id, body), onSuccess: () => invalidate.mock(id) });
}

export function useArchiveMock() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: mockApi.archive, onSuccess: () => invalidate.lists() });
}

export function useMockLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.mock(id);
  return {
    submit: useMutation({ mutationFn: (changelog) => mockApi.submit(id, changelog), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => mockApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: (changelog) => mockApi.publish(id, changelog), onSuccess }),
    restore: useMutation({ mutationFn: () => mockApi.restore(id), onSuccess }),
    revision: useMutation({ mutationFn: () => mockApi.revision(id), onSuccess }),
  };
}

export function useSetSectionQuestions(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ sectionId, questionIds }) => mockApi.setSectionQuestions(id, sectionId, questionIds),
    onSuccess: () => { invalidate.mock(id); invalidate.bank(); },
  });
}

/* Attempt mutations. Autosave/heartbeat deliberately do NOT invalidate the
   solver query: local state is the source of truth until a section advances. */
export function useStartMockAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: () => mockApi.startAttempt(id), onSuccess: () => invalidate.mock(id) });
}

export function useMockAutosave() {
  return useMutation({ mutationFn: ({ id, body }) => mockAttemptApi.autosave(id, body) });
}

export function useMockHeartbeat() {
  return useMutation({ mutationFn: ({ id, activeQuestionId }) => mockAttemptApi.heartbeat(id, activeQuestionId) });
}

export function useMockSubmitSection(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, sectionId, body }) => mockAttemptApi.submitSection(attemptId, sectionId, body),
    onSuccess: () => invalidate.attempt(id),
  });
}

export function useMockSubmitAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, body }) => mockAttemptApi.submit(attemptId, body),
    onSuccess: () => { invalidate.attempt(id); invalidate.mock(id); },
  });
}

export function useMockReasons(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, reasons }) => mockAttemptApi.reasons(attemptId, reasons),
    onSuccess: () => invalidate.attempt(id),
  });
}

export function useMockAbandon(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId }) => mockAttemptApi.abandon(attemptId),
    onSuccess: () => { invalidate.attempt(id); invalidate.mock(id); },
  });
}

export default useMockList;
```

## `client/src/features/mocks/lib/mockUtils.js`

```js
import {
  DIFFICULTY_LABELS, DIFFICULTY_VALUES, MOCK_ATTEMPT_STATUS_LABELS,
  MOCK_SORT_OPTIONS, MOCK_STATUS_LABELS, MOCK_TIMER_MODE_LABELS,
  MOCK_VISIBILITY_VALUES, PALETTE_STATE_LABELS, PALETTE_STATES as P,
  SHEET_TOPICS, WRONG_REASON_LABELS, WRONG_REASON_VALUES,
} from '@algonest/shared';

export const DIFFICULTY_OPTIONS = DIFFICULTY_VALUES.map((value) => ({ value, label: DIFFICULTY_LABELS[value] }));
export const TOPIC_OPTIONS = SHEET_TOPICS.map((value) => ({ value, label: value }));
export const SORT_OPTIONS = MOCK_SORT_OPTIONS.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
export const TIMER_MODE_OPTIONS = Object.entries(MOCK_TIMER_MODE_LABELS).map(([value, label]) => ({ value, label }));
export const VISIBILITY_OPTIONS = MOCK_VISIBILITY_VALUES.map((value) => ({
  value, label: value.charAt(0).toUpperCase() + value.slice(1),
}));
export const REASON_OPTIONS = WRONG_REASON_VALUES.map((value) => ({ value, label: WRONG_REASON_LABELS[value] }));

export const mockStatusLabel = (value) => MOCK_STATUS_LABELS[value] ?? value;
export const attemptStatusLabel = (value) => MOCK_ATTEMPT_STATUS_LABELS[value] ?? value;
export const paletteLabel = (value) => PALETTE_STATE_LABELS[value] ?? value;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;

export const STATUS_TONE = {
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
};
export const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };
export const ATTEMPT_TONE = {
  in_progress: 'warning', submitted: 'success', timed_out: 'danger', abandoned: 'neutral',
};
export const SEVERITY_TONE = { high: 'danger', medium: 'warning', low: 'accent' };

/** Tailwind classes for each of the five palette states. */
export const PALETTE_CLASS = {
  [P.NOT_VISITED]: 'bg-surface-2 text-muted border-line',
  [P.NOT_ANSWERED]: 'bg-danger/12 text-danger border-danger/40',
  [P.ANSWERED]: 'bg-success/12 text-success border-success/40',
  [P.MARKED]: 'bg-accent/15 text-accent border-accent/40',
  [P.ANSWERED_MARKED]: 'bg-success/12 text-success border-accent/50 ring-1 ring-inset ring-accent/50',
};

export function paletteStateOf(answer) {
  if (!answer || answer.visited !== true) return P.NOT_VISITED;
  const response = answer.response;
  const answered = response !== null && response !== undefined && response !== ''
    && !(Array.isArray(response) && response.length === 0)
    && !(typeof response === 'object' && Object.keys(response).length === 0);
  if (answer.marked) return answered ? P.ANSWERED_MARKED : P.MARKED;
  return answered ? P.ANSWERED : P.NOT_ANSWERED;
}

export function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Something went wrong. Please try again.';
}

export function contractErrors(error) {
  const result = {};
  for (const issue of error?.issues ?? []) {
    const key = issue.path.join('.') || '_';
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

export function apiFieldErrors(error) {
  const result = {};
  for (const issue of error?.errors ?? []) {
    if (issue?.field && !result[issue.field]) result[issue.field] = issue.message;
  }
  return result;
}

export function formatClock(totalSeconds = 0) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const tail = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return hours ? `${hours}:${tail}` : tail;
}

export function formatSeconds(seconds = 0) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  if (value < 60) return `${value}s`;
  return `${Math.floor(value / 60)}m ${value % 60}s`;
}

export function formatMinutes(minutes = 0) {
  const value = Number(minutes) || 0;
  if (value < 60) return `${value} min`;
  return `${Math.floor(value / 60)}h ${value % 60}m`;
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

export const signed = (value) => `${Number(value) > 0 ? '+' : ''}${Number(value) || 0}`;

export default { errorMessage, formatClock };
```

---

# Client — mocks components (new)

## `client/src/features/mocks/components/MockFilters.jsx`

```jsx
import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { DIFFICULTY_OPTIONS, SORT_OPTIONS, TOPIC_OPTIONS } from '../lib/mockUtils.js';

export const EMPTY_MOCK_FILTERS = Object.freeze({ q: '', topic: '', difficulty: '', sort: 'newest' });

export default function MockFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filters
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Search" type="search" placeholder="Title, topic, tag…" icon={Search} value={filters.q} onChange={(event) => set('q', event.target.value)} />
        <Select label="Topic" placeholder="All topics" options={TOPIC_OPTIONS} value={filters.topic} onChange={(event) => set('topic', event.target.value)} />
        <Select label="Difficulty" placeholder="Any difficulty" options={DIFFICULTY_OPTIONS} value={filters.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        <Select label="Sort by" options={SORT_OPTIONS} value={filters.sort} onChange={(event) => set('sort', event.target.value)} />
      </div>
    </div>
  );
}
```

## `client/src/features/mocks/components/MockCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Clock3, FileCheck2, Layers3, Play, Target, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import {
  DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, formatDate, formatMinutes, mockStatusLabel,
} from '../lib/mockUtils.js';

export default function MockCard({ mock, showStatus = false }) {
  return (
    <Link to={`/app/mocks/${mock.id}`} className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:border-primary">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Badge variant={DIFFICULTY_TONE[mock.difficulty] ?? 'neutral'}>{difficultyLabel(mock.difficulty)}</Badge>
        {showStatus ? <Badge variant={STATUS_TONE[mock.status] ?? 'neutral'}>{mockStatusLabel(mock.status)}</Badge> : null}
      </div>
      <div className="min-h-0 flex-1">
        <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">{mock.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{mock.description || 'A full-length timed mock with sectional cut-offs and detailed analysis.'}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(mock.sections ?? []).slice(0, 3).map((section) => (
          <span key={section.id} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{section.title}</span>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-3 text-xs text-muted sm:grid-cols-4">
        <div className="flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Sections</dt><dd>{mock.sectionCount}</dd></div>
        <div className="flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Questions</dt><dd>{mock.questionCount}</dd></div>
        <div className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Duration</dt><dd>{formatMinutes(mock.totalDurationMinutes)}</dd></div>
        <div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Max score</dt><dd>{mock.maxScore} pts</dd></div>
      </dl>
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden="true" /> {mock.attemptCount ?? 0} · {formatDate(mock.publishedAt ?? mock.createdAt)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary"><Play className="h-3.5 w-3.5" aria-hidden="true" /> Open</span>
      </div>
    </Link>
  );
}
```

## `client/src/features/mocks/components/MockSettingsForm.jsx`

```jsx
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { TIMER_MODE_OPTIONS, VISIBILITY_OPTIONS } from '../lib/mockUtils.js';

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
      <span><span className="block text-sm font-medium text-ink">{label}</span>{hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}</span>
      <input id={id} type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
    </label>
  );
}

export const DEFAULT_MOCK_SETTINGS = Object.freeze({
  timerMode: 'sectional', passPercentage: 60, maxAttempts: 3,
  shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
  showExplanations: true, allowPaletteBack: true,
});

export default function MockSettingsForm({ value, onChange, errors = {}, disabled = false }) {
  const set = (key, input) => onChange({ ...value, [key]: input });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Timer mode" options={TIMER_MODE_OPTIONS} value={value.timerMode} onChange={(event) => set('timerMode', event.target.value)} error={errors.timerMode} disabled={disabled} />
        <Select label="Visibility" options={VISIBILITY_OPTIONS} value={value.visibility} onChange={(event) => set('visibility', event.target.value)} disabled={disabled} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Overall passing score (%)" type="number" min={0} max={100} value={value.passPercentage} error={errors.passPercentage} disabled={disabled} onChange={(event) => set('passPercentage', Number(event.target.value))} />
        <Input label="Max attempts" type="number" min={1} max={20} value={value.maxAttempts} error={errors.maxAttempts} disabled={disabled} onChange={(event) => set('maxAttempts', Number(event.target.value))} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle id="mock-shuffle-questions" label="Shuffle questions" hint="Seeded per attempt, stable on reload." checked={value.shuffleQuestions} onChange={(checked) => set('shuffleQuestions', checked)} />
        <Toggle id="mock-shuffle-options" label="Shuffle options" hint="Also shuffles ordering and matching columns." checked={value.shuffleOptions} onChange={(checked) => set('shuffleOptions', checked)} />
        <Toggle id="mock-explanations" label="Show explanations after submit" hint="Turn off for exam-style mocks." checked={value.showExplanations} onChange={(checked) => set('showExplanations', checked)} />
        <Toggle id="mock-palette-back" label="Allow going back within a section" hint="Only applies to sectional timer mode." checked={value.allowPaletteBack} onChange={(checked) => set('allowPaletteBack', checked)} />
      </div>
    </div>
  );
}
```

## `client/src/features/mocks/components/SectionEditor.jsx`

```jsx
import { ChevronDown, ChevronUp, Layers3, Trash2 } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

/** One section's timing + marking scheme. Purely controlled. */
export default function SectionEditor({ section, index, total, onChange, onMove, onRemove, onPickQuestions, disabled = false }) {
  const set = (key, value) => onChange({ ...section, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-xs font-bold text-primary">{index + 1}</span>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink"><Layers3 className="h-4 w-4 text-accent" aria-hidden="true" /> {section.title || 'Untitled section'}</h3>
          <span className="text-xs text-muted">{(section.questionIds ?? []).length} questions</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button size="icon" variant="ghost" onClick={() => onMove(index, -1)} disabled={index === 0 || disabled} aria-label={`Move section ${index + 1} up`}><ChevronUp className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => onMove(index, 1)} disabled={index === total - 1 || disabled} aria-label={`Move section ${index + 1} down`}><ChevronDown className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => onRemove(index)} disabled={total <= 1 || disabled} aria-label={`Remove section ${index + 1}`}><Trash2 className="h-4 w-4 text-danger" /></Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Section title" value={section.title} onChange={(event) => set('title', event.target.value)} disabled={disabled} maxLength={100} />
        <Input label="Duration (minutes)" type="number" min={1} max={180} value={section.durationMinutes} onChange={(event) => set('durationMinutes', Number(event.target.value))} disabled={disabled} />
        <Input label="Sectional cut-off (%)" type="number" min={0} max={100} value={section.cutoffPercentage} onChange={(event) => set('cutoffPercentage', Number(event.target.value))} disabled={disabled} hint="0 disables the cut-off." />
        <Input label="Marks for correct" type="number" min={0.1} max={10} step={0.5} value={section.correctMarks} onChange={(event) => set('correctMarks', Number(event.target.value))} disabled={disabled} />
        <Input label="Negative marks (deduction)" type="number" min={0} max={10} step={0.25} value={section.negativeMarks} onChange={(event) => set('negativeMarks', Number(event.target.value))} disabled={disabled} hint="Unattempted questions always score 0." />
        <Input label="Description (optional)" value={section.description} onChange={(event) => set('description', event.target.value)} disabled={disabled} maxLength={500} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <p className="text-xs text-muted">
          Max {((section.questionIds ?? []).length * section.correctMarks || 0).toFixed(1)} pts · wrong answer {section.negativeMarks > 0 ? `−${section.negativeMarks}` : 'no penalty'}
        </p>
        <Button size="sm" variant="secondary" onClick={() => onPickQuestions(index)} disabled={disabled}>Choose questions</Button>
      </div>
    </div>
  );
}
```

## `client/src/features/mocks/components/SectionQuestionPicker.jsx`

```jsx
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { useQuestionBank } from '../../quizzes/hooks/useQuizzes.js';
import { errorMessage } from '../lib/mockUtils.js';
import { typeLabel } from '../../quizzes/lib/quizUtils.js';

/** Pick reusable bank questions for one section. */
export default function SectionQuestionPicker({ open, onClose, section, usedElsewhere = [], onSave, pending = false }) {
  const [selected, setSelected] = useState(() => (section?.questionIds ?? []).map(String));
  // Depend on a primitive key: the array identity changes on every parent render.
  const idsKey = (section?.questionIds ?? []).join(',');
  useEffect(() => {
    if (open) setSelected(idsKey ? idsKey.split(',') : []);
  }, [open, section?.id, idsKey]);
  const params = useMemo(() => ({ page: 1, limit: 100, mine: 'true' }), []);
  const { data, isLoading, isError, error } = useQuestionBank(params, open);
  const blocked = new Set(usedElsewhere.map(String));
  const available = (data?.items ?? []).filter((question) => !blocked.has(question.id));

  return (
    <Modal
      open={open} onClose={onClose} size="lg"
      title={`Questions for ${section?.title ?? 'section'}`}
      description="Reuse questions from your bank. Published versions keep their own frozen copy."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button loading={pending} onClick={() => onSave(selected)}>Save {selected.length} question{selected.length === 1 ? '' : 's'}</Button>
      </>}
    >
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="space-y-2">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div> : null}
      {!isLoading && !available.length ? <p className="py-6 text-center text-sm text-muted">Your bank has no available questions. Add some in the Quizzes creator first.</p> : null}
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
              <span className="mt-1 flex flex-wrap items-center gap-2"><Badge variant="primary">{typeLabel(question.type)}</Badge><span className="text-xs text-muted">{question.topic} · {question.difficulty}</span></span>
            </span>
          </label>
        ))}
      </div>
    </Modal>
  );
}
```

## `client/src/features/mocks/components/MockModerationPanel.jsx`

```jsx
import { useState } from 'react';
import { Check, RotateCcw, Send, ShieldCheck, X } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_TONE, errorMessage, formatDate, mockStatusLabel } from '../lib/mockUtils.js';
import { useMockLifecycle } from '../hooks/useMocks.js';

const CAN_SUBMIT = ['draft', 'changes_requested', 'rejected', 'approved'];

export default function MockModerationPanel({ mockId, mock, canModerate = false }) {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lifecycle = useMockLifecycle(mockId);
  const status = mock.status;

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
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Publication</h2>
        <Badge variant={STATUS_TONE[status]}>{mockStatusLabel(status)}</Badge>
      </div>
      {message ? <Alert variant="info">{message}</Alert> : null}
      {mock.reviewNote ? <div className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-ink"><p className="font-semibold text-warning">Last reviewer note</p><p className="mt-1">{mock.reviewNote}</p></div> : null}
      <div>
        <label htmlFor="mock-moderation-note" className="mb-1.5 block text-sm font-medium text-ink">Changelog / review note</label>
        <textarea id="mock-moderation-note" rows={2} maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Describe your changes or explain a rejection…" className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
      </div>
      <div className="flex flex-wrap gap-2">
        {CAN_SUBMIT.includes(status) ? <Button size="sm" className="gap-1.5" loading={lifecycle.submit.isPending} onClick={() => run(lifecycle.submit, note, 'Submitted for review.')}><Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit for review</Button> : null}
        {status === 'pending_review' && canModerate ? <>
          <Button size="sm" className="gap-1.5" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'approve', note }, 'Mock approved.')}><Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve</Button>
          <Button size="sm" variant="secondary" disabled={!note.trim()} loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'request_changes', note }, 'Changes requested.')}>Request changes</Button>
          <Button size="sm" variant="danger" disabled={!note.trim()} loading={lifecycle.moderate.isPending} className="gap-1.5" onClick={() => run(lifecycle.moderate, { decision: 'reject', note }, 'Mock rejected.')}><X className="h-3.5 w-3.5" aria-hidden="true" /> Reject</Button>
        </> : null}
        {status === 'approved' ? <Button size="sm" className="gap-1.5" loading={lifecycle.publish.isPending} onClick={() => run(lifecycle.publish, note, 'Published — a new immutable version was created.')}><Check className="h-3.5 w-3.5" aria-hidden="true" /> Publish</Button> : null}
        {status === 'published' ? <Button size="sm" variant="secondary" className="gap-1.5" loading={lifecycle.revision.isPending} onClick={() => run(lifecycle.revision, undefined, 'New draft revision started.')}><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start new revision</Button> : null}
        {status === 'archived' ? <Button size="sm" variant="secondary" loading={lifecycle.restore.isPending} onClick={() => run(lifecycle.restore, undefined, 'Restored to draft.')}>Restore</Button> : null}
      </div>
      {mock.reviewHistory?.length ? <ol className="space-y-1.5 border-t border-line pt-3 text-xs text-muted">{mock.reviewHistory.slice(-4).reverse().map((entry, index) => <li key={`${entry.at}-${index}`}><span className="font-medium text-ink">{entry.decision || entry.to}</span> · {formatDate(entry.at)}{entry.note ? ` — ${entry.note}` : ''}</li>)}</ol> : null}
    </section>
  );
}
```

## `client/src/features/mocks/components/SectionTabs.jsx`

```jsx
import { Check, Clock3, LockKeyhole } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { formatClock } from '../lib/mockUtils.js';

/** Section strip for the solver. Locked sections are visible but disabled. */
export default function SectionTabs({ sections = [], states = [], activeSectionId, onSelect, timerMode = 'sectional' }) {
  const statusOf = (id) => states.find((state) => state.sectionId === id)?.status ?? 'pending';
  return (
    <nav aria-label="Mock sections" className="ag-scrollbar flex gap-2 overflow-x-auto pb-1">
      {sections.map((section, index) => {
        const status = statusOf(section.id);
        const locked = timerMode === 'sectional' && status !== 'active';
        const active = section.id === activeSectionId;
        return (
          <button
            key={section.id}
            type="button"
            disabled={locked}
            onClick={() => onSelect(index)}
            aria-current={active ? 'true' : undefined}
            className={`flex min-w-40 shrink-0 flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left transition-colors ${active ? 'border-primary bg-primary/10' : 'border-line bg-surface'} ${locked ? 'cursor-not-allowed opacity-55' : 'hover:border-primary/40'}`}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold text-ink">{index + 1}. {section.title}</span>
              {status === 'submitted' || status === 'timed_out' ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : null}
              {status === 'active' ? <Badge variant="primary">Live</Badge> : null}
              {status === 'pending' && timerMode === 'sectional' ? <LockKeyhole className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> : null}
            </span>
            <span className="flex items-center gap-2 text-[11px] text-muted">
              <span>{section.questionCount} Q</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" aria-hidden="true" /> {formatClock(section.durationMinutes * 60)}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
```

## `client/src/features/mocks/components/MockPalette.jsx`

```jsx
import Badge from '../../../components/ui/Badge.jsx';
import { PALETTE_STATES as P } from '@algonest/shared';
import { PALETTE_CLASS, paletteLabel, paletteStateOf } from '../lib/mockUtils.js';

const LEGEND = [P.ANSWERED, P.NOT_ANSWERED, P.MARKED, P.ANSWERED_MARKED, P.NOT_VISITED];

/** Five-state palette. Every button is a real button with an aria-label. */
export default function MockPalette({ questions = [], answers = {}, currentId, onSelect, title = 'Questions' }) {
  const byId = new Map(Object.entries(answers));
  const counts = Object.fromEntries(LEGEND.map((state) => [state, 0]));
  for (const question of questions) counts[paletteStateOf(byId.get(question.id))] += 1;

  return (
    <nav aria-label="Question palette" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <Badge variant="primary">{counts[P.ANSWERED] + counts[P.ANSWERED_MARKED]}/{questions.length}</Badge>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-5">
        {questions.map((question, index) => {
          const state = paletteStateOf(byId.get(question.id));
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(question.id)}
              aria-current={currentId === question.id ? 'true' : undefined}
              aria-label={`Question ${index + 1}: ${paletteLabel(state)}`}
              className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${PALETTE_CLASS[state]} ${currentId === question.id ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <ul className="space-y-1 text-[11px] text-muted" aria-label="Palette legend">
        {LEGEND.map((state) => (
          <li key={state} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5"><span className={`inline-block h-2.5 w-2.5 rounded-sm border ${PALETTE_CLASS[state]}`} />{paletteLabel(state)}</span>
            <span className="font-semibold text-ink">{counts[state]}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## `client/src/features/mocks/components/MockTimer.jsx`

```jsx
import { Check, Clock3, LoaderCircle, TriangleAlert } from 'lucide-react';
import { formatClock } from '../lib/mockUtils.js';

/** Display-only. Every sync response from the server resets this clock. */
export default function MockTimer({ sectionSeconds = 0, attemptSeconds = 0, timerMode = 'sectional', saveState = 'saved', error = '', syncedAt }) {
  const urgent = sectionSeconds <= 60;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
      <div className={`flex items-center gap-3 ${urgent ? 'text-danger' : 'text-ink'}`}>
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{timerMode === 'sectional' ? 'Section time left' : 'Time left'}</p>
          <span className="font-mono text-lg font-bold tabular-nums" role="timer" aria-live={urgent ? 'polite' : 'off'} aria-label={`${Math.floor(sectionSeconds / 60)} minutes ${sectionSeconds % 60} seconds remaining`}>{formatClock(sectionSeconds)}</span>
        </div>
        {timerMode === 'sectional' ? (
          <div className="hidden border-l border-line pl-3 sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Total left</p>
            <span className="font-mono text-sm tabular-nums text-muted">{formatClock(attemptSeconds)}</span>
          </div>
        ) : null}
        {urgent ? <span className="flex items-center gap-1 text-xs font-semibold"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Hurry</span> : null}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
        {saveState === 'saving' ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving…</>
          : saveState === 'error' ? <><TriangleAlert className="h-3.5 w-3.5 text-danger" aria-hidden="true" /> <span className="text-danger">{error || 'Save failed'}</span></>
            : <><Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Saved{syncedAt ? ' · server clock synced' : ''}</>}
      </div>
    </div>
  );
}
```

## `client/src/features/mocks/components/DifficultyBreakdown.jsx`

```jsx
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { DIFFICULTY_TONE, difficultyLabel, signed } from '../lib/mockUtils.js';
import Badge from '../../../components/ui/Badge.jsx';

/** Score and accuracy split by easy/medium/hard. */
export default function DifficultyBreakdown({ stats = [] }) {
  if (!stats.length) return <p className="text-sm text-muted">No difficulty data for this attempt.</p>;
  return (
    <ul className="space-y-3">
      {stats.map((stat) => (
        <li key={stat.difficulty}>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
            <Badge variant={DIFFICULTY_TONE[stat.difficulty] ?? 'neutral'}>{difficultyLabel(stat.difficulty)}</Badge>
            <span className="text-xs text-muted">{stat.correct}/{stat.total} correct · <strong className="text-ink">{signed(stat.score)}/{stat.maxScore}</strong> pts</span>
          </div>
          <ProgressBar value={Math.max(0, stat.percentage)} label={`${stat.difficulty}: ${stat.percentage}%`} tone={stat.percentage >= 60 ? 'success' : 'warning'} />
        </li>
      ))}
    </ul>
  );
}
```

## `client/src/features/mocks/components/WeakTopicPanel.jsx`

```jsx
import { Lightbulb, TrendingDown } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { SEVERITY_TONE } from '../lib/mockUtils.js';

export default function WeakTopicPanel({ topics = [], strongest, weakest }) {
  if (!topics.length) return (
    <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success/8 p-4 text-sm text-ink">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
      <p>No weak topics detected — every topic is at or above the passing bar. Keep the momentum going.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        {strongest ? <Badge variant="success">Strongest: {strongest}</Badge> : null}
        {weakest ? <Badge variant="danger">Focus first: {weakest}</Badge> : null}
      </div>
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic.topic} className="rounded-xl border border-line bg-surface-2/40 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink"><TrendingDown className="h-3.5 w-3.5 text-danger" aria-hidden="true" /> {topic.topic}</span>
              <Badge variant={SEVERITY_TONE[topic.severity] ?? 'neutral'}>{topic.severity} priority</Badge>
            </div>
            <ProgressBar value={topic.percentage} label={`${topic.topic}: ${topic.percentage}%`} tone={topic.severity === 'high' ? 'warning' : 'accent'} />
            <p className="mt-2 text-xs text-muted">{topic.incorrect} wrong · {topic.lostMarks} marks lost{topic.knowledgeGaps ? ` · ${topic.knowledgeGaps} tagged as concept gaps` : ''}. {topic.advice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## `client/src/features/mocks/components/RecommendedResources.jsx`

```jsx
import { ArrowUpRight, Bookmark, FileQuestion } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Badge from '../../../components/ui/Badge.jsx';

/** Real DB-backed suggestions: published sheet problems + the user's own library. */
export default function RecommendedResources({ items = [] }) {
  if (!items.length) return (
    <EmptyState compact icon={Bookmark} title="No matching resources yet" description="Save a link for a weak topic in your personal library, or publish a sheet covering it — recommendations appear here automatically." />
  );
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-primary/40 focus-visible:border-primary"
          >
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileQuestion className="h-4 w-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-ink">{item.title}</span>
                <Badge variant={item.source === 'personal' ? 'accent' : 'primary'}>{item.source === 'personal' ? 'Saved by you' : 'Curated sheet'}</Badge>
              </span>
              <span className="mt-1 block text-xs text-muted">{item.topic} · {item.reason}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
```

## `client/src/features/mocks/components/ReasonTagger.jsx`

```jsx
import { useState } from 'react';
import { Tag } from 'lucide-react';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { REASON_OPTIONS } from '../lib/mockUtils.js';

const EMPTY = [{ value: '', label: 'Select a reason…' }, ...REASON_OPTIONS];

/** Post-result root-cause tagging for wrong answers, with per-tag save. */
export default function ReasonTagger({ results = [], onChange, pending = false }) {
  const [draft, setDraft] = useState({});
  const wrong = results.filter((result) => !result.correct);
  if (!wrong.length) return <p className="text-sm text-muted">No wrong answers to tag — great work.</p>;

  const set = (questionId, value) => setDraft((previous) => ({ ...previous, [questionId]: value || null }));
  const dirty = Object.entries(draft).filter(([id, value]) => value !== (wrong.find((result) => result.questionId === id)?.reason ?? null));
  const save = () => {
    if (!dirty.length) return;
    onChange(dirty.map(([questionId, reason]) => ({ questionId, reason })));
  };

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-sm text-muted"><Tag className="h-4 w-4" aria-hidden="true" /> Tag why you got each question wrong. Concept gaps drive your study recommendations.</p>
      <ul className="space-y-2">
        {wrong.map((result, index) => (
          <li key={result.questionId} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface-2/40 p-3">
            <Badge variant="danger">Q{results.indexOf(result) + 1}</Badge>
            <span className="min-w-0 flex-1 truncate text-xs text-ink">{result.topic} · {result.difficulty}</span>
            <span className="w-full sm:w-52">
              <Select
                label={`Reason for question ${index + 1}`}
                options={EMPTY}
                value={draft[result.questionId] ?? result.reason ?? ''}
                onChange={(event) => set(result.questionId, event.target.value)}
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">{dirty.length} unsaved change(s)</p>
        <Button size="sm" disabled={!dirty.length} loading={pending} onClick={save}>Save reasons &amp; refresh advice</Button>
      </div>
    </div>
  );
}
```

## `client/src/features/mocks/components/MockResult.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock3, Gauge, RotateCcw, Target, X } from 'lucide-react';
import { WRONG_REASON_LABELS } from '@algonest/shared';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import TopicPerformance from '../../quizzes/components/TopicPerformance.jsx';
import DifficultyBreakdown from './DifficultyBreakdown.jsx';
import WeakTopicPanel from './WeakTopicPanel.jsx';
import RecommendedResources from './RecommendedResources.jsx';
import ReasonTagger from './ReasonTagger.jsx';
import {
  ATTEMPT_TONE, attemptStatusLabel, formatDateTime, formatSeconds, signed,
} from '../lib/mockUtils.js';

function Section({ title, description, children, className = '' }) {
  return (
    <section className={`ag-card p-5 sm:p-6 ${className}`}>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description ? <p className="mb-4 mt-1 text-sm text-muted">{description}</p> : <div className="mb-4" />}
      {children}
    </section>
  );
}

export default function MockResult({ attempt, questions = [], onRetry, canRetry = false, onReasons, reasonsPending = false, pending = false, mockId }) {
  const results = attempt.results ?? [];
  const byId = new Map(questions.map((question) => [question.id, question]));
  const passPercentage = attempt.settings?.passPercentage ?? 60;
  const showExplanations = attempt.settings?.showExplanations !== false && results.some((result) => 'expected' in result);

  return (
    <div className="space-y-6">
      <Link to={`/app/mocks/${mockId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to mock
      </Link>

      <section className="ag-card overflow-hidden">
        <div className={`border-b border-line px-5 py-6 sm:px-8 ${attempt.passed ? 'bg-success/8' : 'bg-warning/8'}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Result · {attempt.title}</p>
              <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{attempt.passed ? 'You cleared the mock!' : 'Not there yet — here is the plan'}</h1>
              <p className="mt-1 text-sm text-muted">{attemptStatusLabel(attempt.status)} · {formatDateTime(attempt.submittedAt)} · version {attempt.mockVersion}</p>
            </div>
            <Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge>
          </div>
        </div>
        <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <p className="text-5xl font-bold tabular-nums text-ink">{signed(attempt.score)}<span className="text-2xl text-muted">/{attempt.maxScore}</span></p>
            <p className="mt-1 text-sm text-muted">{attempt.percentage}% · pass mark {passPercentage}%</p>
            <ProgressBar className="mt-4" value={Math.max(0, attempt.percentage)} tone={attempt.passed ? 'success' : 'warning'} label={`Score ${attempt.percentage}%`} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><Gauge className="h-3.5 w-3.5" aria-hidden="true" /> Accuracy</dt><dd className="mt-1 text-lg font-bold text-ink">{attempt.accuracy}%</dd></div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Correct</dt><dd className="mt-1 text-lg font-bold text-ink">{attempt.correctCount}</dd></div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><X className="h-3.5 w-3.5" aria-hidden="true" /> Wrong / skipped</dt><dd className="mt-1 text-lg font-bold text-ink">{attempt.incorrectCount} / {attempt.unattemptedCount}</dd></div>
            <div className="rounded-xl border border-line bg-surface-2/50 p-3"><dt className="flex items-center gap-1.5 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Time</dt><dd className="mt-1 text-lg font-bold text-ink">{formatSeconds(attempt.durationSeconds)}</dd></div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
          {canRetry ? <Button className="gap-1.5" loading={pending} onClick={onRetry}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake mock</Button> : null}
        </div>
      </section>

      <Section title="Sectional cut-offs" description="Every section must clear its own cut-off to pass the mock.">
        <ul className="space-y-3">
          {(attempt.sections ?? []).map((section) => (
            <li key={section.sectionId} className="rounded-xl border border-line bg-surface-2/40 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-ink">{section.title} <Badge variant={section.passed ? 'success' : 'danger'}>{section.passed ? 'Cleared' : 'Missed'}</Badge></span>
                <span className="text-xs text-muted">{section.correct}✓ / {section.incorrect}✗ / {section.unattempted}– · <strong className="text-ink">{signed(section.score)}/{section.maxScore}</strong> · {section.percentage}% (need {section.cutoffPercentage}%)</span>
              </div>
              <ProgressBar value={Math.max(0, section.percentage)} label={`${section.title}: ${section.percentage}%`} tone={section.passed ? 'success' : 'warning'} />
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Difficulty-wise score" description="Where your marks actually came from."><DifficultyBreakdown stats={attempt.difficultyStats} /></Section>
        <Section title="Topic-wise performance" description="Weakest topics first."><TopicPerformance stats={attempt.topicStats} /></Section>
      </div>

      <Section title="Time per question" description="Slowest questions first. Times are credited from server-observed focus windows.">
        <div className="grid gap-4 sm:grid-cols-2">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted">Total tracked</dt><dd className="font-semibold text-ink">{formatSeconds(attempt.timeStats?.totalSeconds)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Average per question</dt><dd className="font-semibold text-ink">{formatSeconds(attempt.timeStats?.averageSeconds)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Untracked questions</dt><dd className="font-semibold text-ink">{attempt.timeStats?.untracked ?? 0}</dd></div>
          </dl>
          <ul className="space-y-1.5 text-xs">
            {(attempt.timeStats?.slowest ?? []).map((entry, index) => (
              <li key={entry.questionId} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
                <span className="truncate text-ink">{index + 1}. {byId.get(entry.questionId)?.prompt ?? entry.topic}</span>
                <span className="shrink-0 font-semibold text-warning">{formatSeconds(entry.seconds)}</span>
              </li>
            ))}
            {!(attempt.timeStats?.slowest ?? []).length ? <li className="text-muted">No focus data recorded.</li> : null}
          </ul>
        </div>
      </Section>

      <Section title="Weak topic diagnosis" description="Ranked by marks lost and the reasons you tag below."><WeakTopicPanel topics={attempt.weakTopics} /></Section>

      <Section title="Why did you get them wrong?" description="Tagging concept gaps sharpens the diagnosis and the resources we recommend.">
        <ReasonTagger results={results} onChange={onReasons} pending={reasonsPending} />
      </Section>

      {attempt.reasonSummary?.length ? (
        <div className="flex flex-wrap gap-2">
          {attempt.reasonSummary.map((entry) => <Badge key={entry.reason} variant="accent">{entry.label}: {entry.count}</Badge>)}
        </div>
      ) : null}

      <Section title="Recommended next resources" description="Drawn from published sheets and your own saved library — never placeholder links."><RecommendedResources items={attempt.recommendations} /></Section>

      <Section title="Answer review" description={showExplanations ? 'Correct answers and explanations for every question.' : 'This mock hides explanations after submission.'}>
        <ol className="space-y-2">
          {results.map((result, index) => (
            <li key={result.questionId} className="rounded-xl border border-line bg-surface-2/30 p-3">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Badge variant={result.correct ? 'success' : result.attempted ? 'danger' : 'neutral'}>{result.correct ? 'Correct' : result.attempted ? 'Wrong' : 'Skipped'}</Badge>
                <span className="text-xs text-muted">Q{index + 1} · {result.topic} · {result.difficulty} · {signed(result.awarded)} pt · {formatSeconds(result.timeSeconds)}</span>
                {result.reason ? <Badge variant="accent">{WRONG_REASON_LABELS[result.reason] ?? result.reason}</Badge> : null}
              </div>
              <p className="text-sm text-ink">{byId.get(result.questionId)?.prompt ?? `Question ${index + 1}`}</p>
              {showExplanations ? (
                <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                  <div className="rounded-lg border border-line bg-surface p-2"><span className="font-semibold text-muted">Your answer: </span><span className="text-ink">{result.response === null || result.response === undefined ? 'Not answered' : Array.isArray(result.response) ? result.response.join(', ') : typeof result.response === 'object' ? JSON.stringify(result.response) : String(result.response)}</span></div>
                  <div className="rounded-lg border border-success/25 bg-success/5 p-2"><span className="font-semibold text-muted">Correct: </span><span className="text-ink">{result.expected || '—'}</span></div>
                </div>
              ) : null}
              {showExplanations && result.explanation ? <p className="mt-2 text-xs text-muted">{result.explanation}</p> : null}
            </li>
          ))}
        </ol>
      </Section>

      <p className="flex items-center gap-1.5 text-center text-xs text-muted"><Target className="h-3.5 w-3.5" aria-hidden="true" /> Scores use the marking scheme frozen in version {attempt.mockVersion}; negative marks are included.</p>
    </div>
  );
}
```

---

# Client — mocks pages (new)

## `client/src/features/mocks/pages/MocksPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ClipboardList, Plus, ShieldCheck } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import MockFilters, { EMPTY_MOCK_FILTERS } from '../components/MockFilters.jsx';
import MockCard from '../components/MockCard.jsx';
import { useMockList } from '../hooks/useMocks.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { errorMessage } from '../lib/mockUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function MocksPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(EMPTY_MOCK_FILTERS);
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

  const { data, isLoading, isError, error, isFetching } = useMockList(params);
  const mocks = data?.items ?? [];
  const pagination = data?.pagination;
  const changeFilters = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText text="MOCK TESTS // FULL-LENGTH SIMULATION" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Mock tests</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">Sectional or global timers, negative marking, cut-offs and deep result analysis. The server owns the clock — disconnect and resume without losing a second.</p>
        </div>
        <Link to="/app/mocks/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New mock</Button></Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { id: 'explore', label: 'Explore' }, { id: 'mine', label: 'My mocks' },
          ...(isStaff ? [{ id: 'review', label: 'Review queue' }] : []),
        ].map((item) => (
          <button key={item.id} type="button" onClick={() => changeTab(item.id)} aria-pressed={tab === item.id} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}>
            {item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}{item.label}
          </button>
        ))}
        {isFetching && !isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      <MockFilters filters={filters} onChange={changeFilters} />
      {isError ? <Alert variant="error" title="Couldn't load mocks">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-60 w-full" />)}</div>
        : mocks.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{mocks.map((mock) => <MockCard key={mock.id} mock={mock} showStatus={tab !== 'explore'} />)}</div>
          : <EmptyState icon={ClipboardList} title={tab === 'mine' ? 'You have no mocks yet' : tab === 'review' ? 'Review queue is clear' : 'No mocks match these filters'} description={tab === 'mine' ? 'Create a draft, add timed sections with questions, then submit it for review.' : 'Try clearing the filters, or create the first mock.'} action={<Link to="/app/mocks/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Create a mock</Button></Link>} />}

      {pagination && pagination.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Mocks pagination">
          <p className="text-xs text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} mock(s)</p>
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

## `client/src/features/mocks/pages/MockDetailPage.jsx`

```jsx
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Layers3, ListChecks, Pencil, Play, Target, Trophy } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useMock, useMockAttempts, useMockVersions, useStartMockAttempt } from '../hooks/useMocks.js';
import {
  ATTEMPT_TONE, DIFFICULTY_TONE, STATUS_TONE, attemptStatusLabel,
  difficultyLabel, errorMessage, formatDateTime, formatMinutes, mockStatusLabel,
} from '../lib/mockUtils.js';

const PAGE_SIZE = 5;

export default function MockDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMock(id);
  const attemptParams = useMemo(() => ({ page: 1, limit: PAGE_SIZE }), []);
  const { data: attemptsData } = useMockAttempts(id, attemptParams);
  const { data: versionsData } = useMockVersions(id);
  const start = useStartMockAttempt(id);

  const mock = data?.mock;
  const summary = data?.mySummary;

  if (isLoading) return <FullPageLoader label="Loading mock test…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this mock">{errorMessage(error)}</Alert>;
  if (!mock) return <FullPageLoader label="Loading mock test…" />;

  const settings = mock.settings ?? {};
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/mocks" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All mocks</Link>
        {data?.canManage ? <Link to={`/app/mocks/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit mock</Button></Link> : null}
      </div>

      <header className="ag-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={DIFFICULTY_TONE[mock.difficulty] ?? 'neutral'}>{difficultyLabel(mock.difficulty)}</Badge>
          <Badge variant={STATUS_TONE[mock.status] ?? 'neutral'}>{mockStatusLabel(mock.status)}</Badge>
          {mock.isPublishedSnapshot ? <Badge variant="accent">Version {mock.viewedVersion}</Badge> : null}
          <Badge variant="primary">{settings.timerMode === 'global' ? 'Global timer' : 'Sectional timer'}</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{mock.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{mock.description || 'A full-length timed mock with sectional cut-offs and detailed result analysis.'}</p>
        <p className="mt-3 text-xs text-muted">by {mock.author?.name ?? 'AlgoNest creator'} · {mock.sectionCount} sections · {mock.questionCount} questions</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="ag-card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-ink">Sections &amp; marking</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="border-b border-line text-xs uppercase tracking-wider text-muted"><th scope="col" className="py-2 pr-3 font-semibold">Section</th><th scope="col" className="py-2 pr-3 font-semibold">Q</th><th scope="col" className="py-2 pr-3 font-semibold">Time</th><th scope="col" className="py-2 pr-3 font-semibold">Correct</th><th scope="col" className="py-2 pr-3 font-semibold">Wrong</th><th scope="col" className="py-2 font-semibold">Cut-off</th></tr></thead>
              <tbody>
                {(mock.sections ?? []).map((section, index) => (
                  <tr key={section.id} className="border-b border-line/60 last:border-0">
                    <th scope="row" className="py-2.5 pr-3 font-medium text-ink">{index + 1}. {section.title}</th>
                    <td className="py-2.5 pr-3 text-muted">{section.questionCount}</td>
                    <td className="py-2.5 pr-3 text-muted">{formatMinutes(section.durationMinutes)}</td>
                    <td className="py-2.5 pr-3 text-success">+{section.correctMarks}</td>
                    <td className="py-2.5 pr-3 text-danger">−{section.negativeMarks}</td>
                    <td className="py-2.5 text-muted">{section.cutoffPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: ListChecks, label: 'Total questions', value: mock.questionCount },
              { Icon: Target, label: 'Maximum score', value: `${mock.maxScore} pts` },
              { Icon: Clock3, label: 'Total duration', value: formatMinutes(mock.totalDurationMinutes) },
              { Icon: Trophy, label: 'Overall pass mark', value: `${settings.passPercentage}%` },
              { Icon: Layers3, label: 'Attempts allowed', value: settings.maxAttempts },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3"><Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><div><dt className="text-xs text-muted">{label}</dt><dd className="text-sm font-semibold text-ink">{value}</dd></div></div>
            ))}
          </dl>
          <ul className="mt-4 space-y-1.5 text-sm text-muted" aria-label="Mock rules">
            <li>• The server owns the clock — it auto-submits when time is up, even if the tab is closed.</li>
            <li>• Answers autosave; a reconnect restores your palette, marks and remaining time.</li>
            <li>• Unattempted questions score 0; wrong answers lose {Math.max(...(mock.sections ?? []).map((section) => section.negativeMarks), 0)} marks in the strictest section.</li>
            <li>• {settings.showExplanations ? 'Explanations and correct answers appear after you submit.' : 'This mock hides explanations after submission.'}</li>
          </ul>
          {start.isError ? <Alert variant="error" className="mt-4">{errorMessage(start.error)}</Alert> : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {summary?.activeAttemptId ? <Button className="gap-2" onClick={() => navigate(`/app/mocks/${id}/attempts/${summary.activeAttemptId}`)}><Play className="h-4 w-4" aria-hidden="true" /> Resume attempt</Button>
              : <Button className="gap-2" loading={start.isPending} disabled={!summary?.canStart} onClick={() => start.mutate(undefined, { onSuccess: (result) => navigate(`/app/mocks/${id}/attempts/${result.attempt.id}`) })}><Play className="h-4 w-4" aria-hidden="true" /> Start mock</Button>}
          </div>
          {!summary?.canStart && !summary?.activeAttemptId ? <p className="mt-2 text-xs text-muted">{mock.publishedVersion ? 'You have used all your attempts or this mock is not available.' : 'This mock is not published yet.'}</p> : null}
        </section>

        <aside className="space-y-4">
          <section className="ag-card p-5">
            <h2 className="text-sm font-semibold text-ink">Your progress</h2>
            <p className="mt-3 text-3xl font-bold tabular-nums text-ink">{summary?.bestPercentage ?? 0}%</p>
            <p className="text-xs text-muted">Best score</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p className="flex justify-between gap-2 text-muted"><span>Attempts used</span><strong className="text-ink">{summary?.attemptsUsed ?? 0}/{settings.maxAttempts}</strong></p>
              <p className="flex justify-between gap-2 text-muted"><span>Attempts left</span><strong className="text-ink">{summary?.attemptsLeft ?? 0}</strong></p>
            </div>
          </section>
          <section className="ag-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Recent attempts</h2>
            {(attemptsData?.items ?? []).length ? <ul className="space-y-2">{attemptsData.items.map((attempt) => (
              <li key={attempt.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
                <div className="flex items-center justify-between gap-2"><Badge variant={ATTEMPT_TONE[attempt.status] ?? 'neutral'}>{attemptStatusLabel(attempt.status)}</Badge><span className="text-sm font-bold text-ink">{attempt.percentage}%</span></div>
                <p className="mt-1.5 text-[11px] text-muted">{formatDateTime(attempt.submittedAt)} · v{attempt.mockVersion}</p>
                {attempt.status !== 'in_progress' ? <Link to={`/app/mocks/${id}/results/${attempt.id}`} className="mt-1.5 inline-block text-xs font-semibold text-primary hover:underline">View analysis</Link> : null}
              </li>
            ))}</ul> : <p className="text-sm text-muted">No attempts yet. Your analysis will appear here.</p>}
          </section>
          {data?.canManage && versionsData?.items?.length ? <section className="ag-card p-5"><h2 className="mb-3 text-sm font-semibold text-ink">Published versions</h2><ul className="space-y-1.5 text-xs text-muted">{versionsData.items.map((version) => <li key={version.id} className="flex justify-between gap-2"><span>Version {version.version}</span><span>{version.questionCount} questions</span></li>)}</ul></section> : null}
        </aside>
      </div>
    </div>
  );
}
```

## `client/src/features/mocks/pages/MockEditorPage.jsx`

```jsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Layers3, Plus, Save, Trash2 } from 'lucide-react';
import { mockCreateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import MockSettingsForm, { DEFAULT_MOCK_SETTINGS } from '../components/MockSettingsForm.jsx';
import SectionEditor from '../components/SectionEditor.jsx';
import SectionQuestionPicker from '../components/SectionQuestionPicker.jsx';
import MockModerationPanel from '../components/MockModerationPanel.jsx';
import { useArchiveMock, useCreateMock, useMock, useSetSectionQuestions, useUpdateMock } from '../hooks/useMocks.js';
import {
  DIFFICULTY_OPTIONS, STATUS_TONE, TOPIC_OPTIONS, apiFieldErrors, contractErrors,
  errorMessage, mockStatusLabel,
} from '../lib/mockUtils.js';

const blankSection = (index = 0) => ({
  title: `Section ${index + 1}`,
  description: '',
  durationMinutes: 20,
  correctMarks: 2,
  negativeMarks: 0.5,
  cutoffPercentage: 40,
  questionIds: [],
});

function sectionsForPayload(sections) {
  return sections.map((section) => ({
    title: section.title,
    description: section.description || '',
    durationMinutes: Number(section.durationMinutes),
    correctMarks: Number(section.correctMarks),
    negativeMarks: Number(section.negativeMarks),
    cutoffPercentage: Number(section.cutoffPercentage),
    questionIds: section.questionIds ?? [],
  }));
}

/* ─────────────────────────── create ─────────────────────────── */

function MockCreatePage() {
  const navigate = useNavigate();
  const create = useCreateMock();
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'medium', topics: '', tags: '',
    settings: { ...DEFAULT_MOCK_SETTINGS }, sections: [blankSection(0)],
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(), description: form.description.trim(), difficulty: form.difficulty,
      topics: form.topics.split(',').map((value) => value.trim()).filter(Boolean),
      tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean),
      goals: [], settings: form.settings, sections: sectionsForPayload(form.sections),
    };
    const parsed = mockCreateSchema.safeParse(payload);
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setServerError(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setServerError('');
    create.mutate(parsed.data, {
      onSuccess: (data) => navigate(`/app/mocks/${data.mock.id}/edit`, { replace: true }),
      onError: (error) => { setServerError(errorMessage(error)); setErrors(apiFieldErrors(error)); },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/mocks" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All mocks</Link>
      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Create a mock test</h1><p className="mt-1.5 text-sm text-muted">Define the exam structure first. After saving, add questions to each section.</p></header>
      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError ? <Alert variant="error" title="Couldn't create the mock">{serverError}</Alert> : null}
        <section className="ag-card space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Title" required value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Placement Mock 1" />
            <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
          </div>
          <div>
            <label htmlFor="mock-new-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea id="mock-new-description" rows={3} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What does this mock simulate?" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Topics (comma separated)" list="mock-topic-list" value={form.topics} onChange={(event) => set('topics', event.target.value)} placeholder="Arrays, DP" />
            <Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} placeholder="placement, full-length" />
          </div>
          <datalist id="mock-topic-list">{TOPIC_OPTIONS.map((option) => <option key={option.value} value={option.value} />)}</datalist>
        </section>
        <section className="ag-card space-y-4 p-5"><h2 className="text-base font-semibold text-ink">Exam settings</h2><MockSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} errors={errors} /></section>
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Sections</h2>
          {errors.sections ? <Alert variant="error">{errors.sections}</Alert> : null}
          {form.sections.map((section, index) => (
            <SectionEditor key={index} section={section} index={index} total={form.sections.length}
              onChange={(next) => set('sections', form.sections.map((item, i) => (i === index ? next : item)))}
              onMove={(i, direction) => {
                const next = [...form.sections]; const target = i + direction;
                if (target < 0 || target >= next.length) return;
                [next[i], next[target]] = [next[target], next[i]]; set('sections', next);
              }}
              onRemove={(i) => set('sections', form.sections.filter((_, position) => position !== i))}
              onPickQuestions={() => setServerError('Save the mock first, then choose questions for each section.')}
            />
          ))}
          <Button type="button" variant="secondary" size="sm" className="gap-1.5" disabled={form.sections.length >= 12} onClick={() => set('sections', [...form.sections, blankSection(form.sections.length)])}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add section</Button>
        </section>
        <div className="flex justify-end gap-2"><Link to="/app/mocks"><Button type="button" variant="ghost">Cancel</Button></Link><Button type="submit" className="gap-1.5" loading={create.isPending}><Save className="h-4 w-4" aria-hidden="true" /> Create draft</Button></div>
      </form>
    </div>
  );
}

/* ─────────────────────────── edit ─────────────────────────── */

function MockEditor({ id }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMock(id);
  const update = useUpdateMock(id);
  const setQuestions = useSetSectionQuestions(id);
  const archive = useArchiveMock();

  const [pickerIndex, setPickerIndex] = useState(null);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [form, setForm] = useState(null);
  const initialised = data?.mock?.id ?? null;

  // Lazily initialise once per mock (a keyed child would also work). Keeping it
  // here avoids a useEffect that would fight optimistic query invalidations.
  if (data?.mock && (!form || form._id !== initialised)) {
    const mock = data.mock;
    setForm({
      _id: mock.id,
      title: mock.title, description: mock.description || '', difficulty: mock.difficulty,
      topics: (mock.topics ?? []).join(', '), tags: (mock.tags ?? []).join(', '),
      settings: { ...DEFAULT_MOCK_SETTINGS, ...(mock.settings ?? {}) },
      sections: (mock.sections ?? []).map((section) => ({
        id: section.id, title: section.title, description: section.description || '',
        durationMinutes: section.durationMinutes, correctMarks: section.correctMarks,
        negativeMarks: section.negativeMarks, cutoffPercentage: section.cutoffPercentage,
        questionIds: section.questionIds ?? [],
      })),
    });
  }

  if (isLoading) return <FullPageLoader label="Loading mock editor…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this mock">{errorMessage(error)}</Alert>;
  if (!data?.mock || !form) return <FullPageLoader label="Loading mock editor…" />;
  const mock = data.mock;
  const locked = ['published', 'pending_review', 'archived'].includes(mock.status);

  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const patchSection = (index, next) => set('sections', form.sections.map((item, i) => (i === index ? next : item)));
  const moveSection = (index, direction) => {
    const next = [...form.sections]; const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; set('sections', next);
  };

  const save = () => {
    const payload = {
      title: form.title.trim(), description: form.description.trim(), difficulty: form.difficulty,
      topics: form.topics.split(',').map((value) => value.trim()).filter(Boolean),
      tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean),
      settings: form.settings, sections: sectionsForPayload(form.sections),
    };
    const parsed = mockCreateSchema.safeParse({ ...payload, goals: [] });
    if (!parsed.success) { setActionError(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setActionError('');
    update.mutate(parsed.data, {
      onSuccess: () => setMessage('Mock settings saved.'),
      onError: (err) => setActionError(errorMessage(err)),
    });
  };

  const saveSectionQuestions = (questionIds) => {
    const section = form.sections[pickerIndex];
    setQuestions.mutate({ sectionId: section.id, questionIds }, {
      onSuccess: () => {
        patchSection(pickerIndex, { ...section, questionIds });
        setPickerIndex(null); setMessage(`Saved ${questionIds.length} questions for ${section.title}.`);
      },
      onError: (err) => setActionError(errorMessage(err)),
    });
  };

  const usedElsewhere = form.sections
    .filter((_, index) => index !== pickerIndex)
    .flatMap((section) => section.questionIds ?? []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/app/mocks/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to mock</Link>
          <Badge variant={STATUS_TONE[mock.status]}>{mockStatusLabel(mock.status)}</Badge>
        </div>
        <Button variant="danger" size="sm" className="gap-1.5" loading={archive.isPending} onClick={() => archive.mutate(id, { onSuccess: () => navigate('/app/mocks'), onError: (err) => setActionError(errorMessage(err)) })}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Archive</Button>
      </div>

      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Edit mock</h1><p className="mt-1.5 text-sm text-muted">{locked ? 'Structure is locked in this status. Start a new revision to edit sections.' : 'Update settings, sections and questions, then publish an immutable version.'}</p></header>
      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {message ? <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert> : null}

      <section className="ag-card space-y-4 p-5">
        <h2 className="text-base font-semibold text-ink">Details &amp; settings</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(event) => set('title', event.target.value)} />
          <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        </div>
        <div><label htmlFor="mock-edit-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label><textarea id="mock-edit-description" rows={2} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" /></div>
        <div className="grid gap-3 sm:grid-cols-2"><Input label="Topics (comma separated)" value={form.topics} onChange={(event) => set('topics', event.target.value)} /><Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} /></div>
        <MockSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} />
        <div className="flex justify-end"><Button size="sm" className="gap-1.5" loading={update.isPending} onClick={save}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save changes</Button></div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h2 className="flex items-center gap-2 text-base font-semibold text-ink"><Layers3 className="h-4 w-4 text-accent" aria-hidden="true" /> Sections <span className="text-muted">({form.sections.length})</span></h2><p className="mt-1 text-xs text-muted">Total {form.sections.reduce((sum, section) => sum + Number(section.durationMinutes || 0), 0)} min · {form.sections.reduce((sum, section) => sum + (section.questionIds?.length ?? 0), 0)} questions</p></div>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={locked || form.sections.length >= 12} onClick={() => set('sections', [...form.sections, blankSection(form.sections.length)])}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add section</Button>
        </div>
        {form.sections.map((section, index) => (
          <SectionEditor key={section.id ?? `new-${index}`} section={section} index={index} total={form.sections.length}
            onChange={(next) => patchSection(index, next)} onMove={moveSection}
            onRemove={(i) => set('sections', form.sections.filter((_, position) => position !== i))}
            onPickQuestions={(i) => section.id ? setPickerIndex(i) : setActionError('Save the mock first to create this section, then choose questions.')}
            disabled={locked}
          />
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <MockModerationPanel mockId={id} mock={mock} canModerate={data?.canModerate} />
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <h2 className="text-sm font-semibold text-ink">Versioning &amp; exam integrity</h2>
          <p className="text-xs text-muted">Publishing freezes every section, marking scheme, question and answer key. Attempts always grade against the version they started on, so editing a bank question never changes an old result.</p>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published version</dt><dd className="mt-0.5 text-base font-bold text-ink">{mock.publishedVersion || '—'}</dd></div>
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published questions</dt><dd className="mt-0.5 text-base font-bold text-ink">{mock.publishedQuestionCount || 0}</dd></div>
          </dl>
          <p className="text-xs text-muted">Deadlines are absolute server timestamps. A closed tab, a suspended laptop or a forged client clock cannot extend an attempt.</p>
        </section>
      </div>

      {pickerIndex !== null && form.sections[pickerIndex] ? (
        <SectionQuestionPicker
          open section={form.sections[pickerIndex]} usedElsewhere={usedElsewhere}
          onClose={() => setPickerIndex(null)} onSave={saveSectionQuestions}
          pending={setQuestions.isPending}
        />
      ) : null}
    </div>
  );
}

export default function MockEditorPage() {
  const { id } = useParams();
  return !id ? <MockCreatePage /> : <MockEditor id={id} />;
}
```

## `client/src/features/mocks/pages/MockSolverPage.jsx`

```jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_LIMITS, MOCK_TIMER_MODES } from '@algonest/shared';
import { ChevronLeft, ChevronRight, Flag, RefreshCw, Send } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import QuestionRenderer from '../../quizzes/components/QuestionRenderer.jsx';
import SectionTabs from '../components/SectionTabs.jsx';
import MockPalette from '../components/MockPalette.jsx';
import MockTimer from '../components/MockTimer.jsx';
import {
  useMockAttempt, useMockAttemptQuestions, useMockAutosave, useMockHeartbeat,
  useMockSubmitAttempt, useMockSubmitSection,
} from '../hooks/useMocks.js';
import { errorMessage, formatClock, paletteStateOf } from '../lib/mockUtils.js';

/**
 * Mock test engine.
 *
 * The server owns every deadline. This clock is display-only and is RESET from
 * `remainingSeconds` on every autosave / heartbeat response. When it reaches
 * zero we do not decide the outcome locally — we refetch the attempt so the
 * server's syncClock() advances the section or finalises the attempt.
 */
export default function MockSolverPage() {
  const { id: mockId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useMockAttempt(attemptId);
  const attempt = data?.attempt;
  const sectionKey = attempt?.activeSectionId ?? 'all';
  const questionParams = useMemo(() => ({ page: 1, limit: MOCK_LIMITS.MAX_QUESTIONS, sectionKey }), [sectionKey]);
  const { data: questionData, isLoading: questionsLoading, isError: questionsError, error: questionsLoadError } = useMockAttemptQuestions(attemptId, questionParams);

  const autosave = useMockAutosave();
  const heartbeat = useMockHeartbeat();
  const submitSection = useMockSubmitSection(attemptId);
  const submitAttempt = useMockSubmitAttempt(attemptId);
  const autosaveMutate = autosave.mutate;
  const heartbeatMutate = heartbeat.mutate;
  const submitSectionMutate = submitSection.mutate;
  const submitAttemptMutate = submitAttempt.mutate;

  const [answers, setAnswers] = useState({});
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [sectionSeconds, setSectionSeconds] = useState(null);
  const [attemptSeconds, setAttemptSeconds] = useState(null);
  const [saveState, setSaveState] = useState('saved');
  const [saveError, setSaveError] = useState('');
  const [actionError, setActionError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sectionConfirmOpen, setSectionConfirmOpen] = useState(false);
  const [syncedAt, setSyncedAt] = useState(null);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);

  const questions = useMemo(() => questionData?.items ?? [], [questionData?.items]);
  const sections = useMemo(() => questionData?.sections ?? [], [questionData?.sections]);
  const timerMode = attempt?.settings?.timerMode ?? MOCK_TIMER_MODES.SECTIONAL;
  const isFinal = Boolean(attempt && attempt.status !== 'in_progress');
  const activeSectionId = attempt?.activeSectionId ?? null;
  const current = questions.find((question) => question.id === activeQuestionId) ?? questions[0];
  const currentIndex = current ? questions.findIndex((question) => question.id === current.id) : -1;

  /* Hydrate from the server on first load and whenever the active section changes. */
  const attemptKey = attempt?.id;
  useEffect(() => {
    if (!attempt || attempt.status !== 'in_progress') return;
    const restored = {};
    for (const answer of attempt.answers ?? []) {
      restored[answer.questionId] = {
        response: answer.response ?? null,
        marked: Boolean(answer.marked),
        visited: Boolean(answer.visited),
      };
    }
    setAnswers(restored);
    setActiveQuestionId(attempt.activeQuestionId ?? null);
    setSectionSeconds(data?.remainingSeconds ?? 0);
    setAttemptSeconds(data?.attemptRemainingSeconds ?? 0);
    setSyncedAt(new Date());
    dirtyRef.current = false;
    setSaveState('saved');
  }, [attemptKey, activeSectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Choose the first question once the section's questions arrive. */
  useEffect(() => {
    if (!questions.length) return;
    setActiveQuestionId((previous) => (previous && questions.some((question) => question.id === previous) ? previous : questions[0].id));
  }, [sectionKey, questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /* A completed attempt belongs on the result page. */
  useEffect(() => {
    if (isFinal) navigate(`/app/mocks/${mockId}/results/${attemptId}`, { replace: true });
  }, [isFinal, navigate, mockId, attemptId]);

  const answerRows = useCallback((source) => Object.entries(source)
    .filter(([questionId]) => /^[a-f\d]{24}$/i.test(questionId))
    .map(([questionId, entry]) => ({
      questionId,
      response: entry.response ?? null,
      marked: Boolean(entry.marked),
      visited: Boolean(entry.visited),
    })), []);

  const resync = useCallback((result) => {
    if (!result) return;
    if (typeof result.remainingSeconds === 'number') setSectionSeconds(result.remainingSeconds);
    if (typeof result.attemptRemainingSeconds === 'number') setAttemptSeconds(result.attemptRemainingSeconds);
    setSyncedAt(new Date());
    if (result.sectionAdvanced || result.expired) refetch();
  }, [refetch]);

  /* Debounced autosave — the payload never contains a timestamp or duration. */
  useEffect(() => {
    if (!dirtyRef.current || isFinal || !attempt) return undefined;
    setSaveState('saving');
    const payload = {
      answers: answerRows(answers),
      activeQuestionId: activeQuestionId ?? null,
      ...(activeSectionId ? { sectionId: activeSectionId } : {}),
    };
    const timer = window.setTimeout(() => {
      autosaveMutate({ id: attemptId, body: payload }, {
        onSuccess: (result) => { dirtyRef.current = false; setSaveState('saved'); setSaveError(''); resync(result); },
        onError: (err) => { setSaveState('error'); setSaveError(errorMessage(err)); refetch(); },
      });
    }, MOCK_LIMITS.AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [answers, activeQuestionId, activeSectionId, answerRows, attempt, attemptId, autosaveMutate, isFinal, refetch, resync]);

  /* Heartbeat credits focus time and re-syncs the server clock. */
  useEffect(() => {
    if (isFinal || !attempt) return undefined;
    const timer = window.setInterval(() => {
      heartbeatMutate({ id: attemptId, activeQuestionId: activeQuestionId ?? null }, {
        onSuccess: resync,
        onError: () => refetch(),
      });
    }, MOCK_LIMITS.HEARTBEAT_MS);
    return () => window.clearInterval(timer);
  }, [isFinal, attempt, attemptId, activeQuestionId, heartbeatMutate, resync, refetch]);

  /* Display-only local countdown, always overwritten by the next server sync. */
  useEffect(() => {
    if (isFinal || sectionSeconds === null) return undefined;
    const timer = window.setInterval(() => {
      setSectionSeconds((value) => (typeof value === 'number' ? Math.max(0, value - 1) : value));
      setAttemptSeconds((value) => (typeof value === 'number' ? Math.max(0, value - 1) : value));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isFinal, sectionSeconds === null]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Zero means "ask the server", never "submit locally". */
  useEffect(() => {
    if (sectionSeconds !== 0 || isFinal || !attempt || busyRef.current) return;
    busyRef.current = true;
    setSaveState('saving');
    refetch().finally(() => { busyRef.current = false; });
  }, [sectionSeconds, isFinal, attempt, refetch]);

  /* Alt + arrow navigation, without stealing arrows from text inputs. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey || !questions.length) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const index = questions.findIndex((question) => question.id === activeQuestionId);
        const next = Math.max(0, Math.min(questions.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
        setActiveQuestionId(questions[next].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [questions, activeQuestionId]);

  const selectQuestion = useCallback((questionId) => {
    setActiveQuestionId(questionId);
    setAnswers((previous) => ({
      ...previous,
      [questionId]: { response: previous[questionId]?.response ?? null, marked: previous[questionId]?.marked ?? false, visited: true },
    }));
    dirtyRef.current = true;
  }, []);

  const updateAnswer = useCallback((response) => {
    if (!current) return;
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [current.id]: { response, marked: previous[current.id]?.marked ?? false, visited: true },
    }));
  }, [current]);

  const toggleMarked = useCallback(() => {
    if (!current) return;
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [current.id]: { response: previous[current.id]?.response ?? null, marked: !previous[current.id]?.marked, visited: true },
    }));
  }, [current]);

  const onSelectSection = useCallback((index) => {
    const target = sections[index];
    if (!target) return;
    const first = questions.find((question) => question.sectionId === target.id);
    if (first) selectQuestion(first.id);
  }, [sections, questions, selectQuestion]);

  const doSubmitSection = () => {
    if (busyRef.current || !activeSectionId) return;
    busyRef.current = true;
    setSectionConfirmOpen(false);
    submitSectionMutate({
      attemptId, sectionId: activeSectionId,
      body: { answers: answerRows(answers), activeQuestionId: null },
    }, {
      onSuccess: (result) => {
        busyRef.current = false;
        if (result.finished) navigate(`/app/mocks/${mockId}/results/${attemptId}`, { replace: true });
        else { setAnswers({}); setActiveQuestionId(null); refetch(); }
      },
      onError: (err) => { setActionError(errorMessage(err)); busyRef.current = false; refetch(); },
    });
  };

  const doSubmitAll = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setConfirmOpen(false);
    submitAttemptMutate({ attemptId, body: { answers: answerRows(answers), activeQuestionId: null } }, {
      onSuccess: () => navigate(`/app/mocks/${mockId}/results/${attemptId}`, { replace: true }),
      onError: (err) => { setActionError(errorMessage(err)); busyRef.current = false; refetch(); },
    });
  };

  const summary = useMemo(() => {
    const result = { answered: 0, marked: 0, notVisited: 0 };
    for (const question of questions) {
      const state = paletteStateOf(answers[question.id]);
      if (state === 'answered' || state === 'answered_marked') result.answered += 1;
      if (state === 'marked' || state === 'answered_marked') result.marked += 1;
      if (state === 'not_visited') result.notVisited += 1;
    }
    return result;
  }, [answers, questions]);

  if (isLoading || questionsLoading) return <FullPageLoader label="Preparing your mock…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load this attempt">{errorMessage(error)}</Alert></div>;
  if (questionsError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the questions">{errorMessage(questionsLoadError)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Preparing your mock…" />;

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const isBusy = submitSection.isPending || submitAttempt.isPending;

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Mock attempt · version {attempt.mockVersion} · {timerMode === 'sectional' ? 'sectional timer' : 'global timer'}</p>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{attempt.title}</h1>
          {activeSection ? <p className="mt-0.5 text-xs text-muted">{activeSection.title} · +{activeSection.correctMarks} / −{activeSection.negativeMarks} marks · cut-off {activeSection.cutoffPercentage}%</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {timerMode === MOCK_TIMER_MODES.SECTIONAL ? <Button variant="secondary" size="sm" onClick={() => setSectionConfirmOpen(true)} disabled={isBusy}>Finish section</Button> : null}
          <Button size="sm" onClick={() => setConfirmOpen(true)} className="gap-1.5" disabled={isBusy}><Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit test</Button>
        </div>
      </header>

      <MockTimer sectionSeconds={sectionSeconds ?? 0} attemptSeconds={attemptSeconds ?? 0} timerMode={timerMode} saveState={saveState} error={saveError} syncedAt={syncedAt} />
      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {data?.sectionAdvanced ? <Alert variant="info" className="flex items-center gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" /> A section timed out and the server moved you to the next one.</Alert> : null}

      <SectionTabs sections={sections} states={attempt.sectionStates} activeSectionId={activeSectionId} onSelect={onSelectSection} timerMode={timerMode} />

      <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
        <main className="ag-card min-w-0 p-5 sm:p-6">
          {current ? <>
            <QuestionRenderer
              key={current.id} question={current} number={currentIndex + 1}
              value={answers[current.id]?.response}
              onChange={updateAnswer}
              marked={Boolean(answers[current.id]?.marked)}
              onToggleMarked={toggleMarked}
              disabled={isBusy}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <Button variant="secondary" size="sm" className="gap-1.5" disabled={currentIndex <= 0} onClick={() => selectQuestion(questions[currentIndex - 1].id)}><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous</Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={toggleMarked} aria-pressed={Boolean(answers[current.id]?.marked)}><Flag className="h-3.5 w-3.5" aria-hidden="true" /> {answers[current.id]?.marked ? 'Unmark' : 'Mark for review'}</Button>
                <span className="hidden text-xs text-muted sm:inline">{currentIndex + 1}/{questions.length} · Alt + ← / →</span>
              </div>
              {currentIndex >= questions.length - 1
                ? <Button size="sm" onClick={() => setConfirmOpen(true)}>Finish <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
                : <Button size="sm" className="gap-1" onClick={() => selectQuestion(questions[currentIndex + 1].id)}>Next <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>}
            </div>
          </> : <p className="text-sm text-muted">No questions are available in this section.</p>}
        </main>

        <aside className="ag-card h-fit p-4 lg:sticky lg:top-4">
          <MockPalette questions={questions} answers={answers} currentId={current?.id} onSelect={selectQuestion} title={activeSection?.title ?? 'Questions'} />
          <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
            <p className="flex justify-between gap-2"><span>Answered</span><strong className="text-ink">{summary.answered}/{questions.length}</strong></p>
            <p className="flex justify-between gap-2"><span>Marked</span><strong className="text-ink">{summary.marked}</strong></p>
            <p className="flex justify-between gap-2"><span>Time left (server)</span><strong className="font-mono text-ink">{formatClock(attemptSeconds ?? 0)}</strong></p>
          </div>
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-3 text-xs text-muted">
            <p className="font-semibold text-primary">Disconnected?</p>
            <p className="mt-1">Just reload. Your answers, marks and the remaining time are restored from the server — the clock never pauses.</p>
          </div>
        </aside>
      </div>

      <Modal open={sectionConfirmOpen} onClose={() => setSectionConfirmOpen(false)} title="Finish this section?" description="In sectional mode you cannot return to a submitted section."
        footer={<><Button variant="ghost" onClick={() => setSectionConfirmOpen(false)}>Keep working</Button><Button loading={submitSection.isPending} onClick={doSubmitSection}>Finish section</Button></>}>
        <div className="space-y-1.5 text-sm text-ink"><p>{summary.answered} of {questions.length} questions answered in this section.</p><p>{summary.marked} marked for review.</p>{summary.notVisited > 0 ? <Alert variant="warning" className="mt-3">{summary.notVisited} question(s) were never opened and will score zero.</Alert> : null}</div>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Submit the whole mock?" description="You cannot change your answers after submitting."
        footer={<><Button variant="ghost" onClick={() => setConfirmOpen(false)}>Keep working</Button><Button loading={submitAttempt.isPending} onClick={doSubmitAll}>Submit now</Button></>}>
        <div className="space-y-1.5 text-sm text-ink"><p>{summary.answered} of {questions.length} questions answered in the current section.</p><p>{formatClock(sectionSeconds ?? 0)} left on the server clock.</p><Alert variant="warning" className="mt-3">Unanswered and wrong answers are scored with this section's negative marking.</Alert></div>
      </Modal>
    </div>
  );
}
```

## `client/src/features/mocks/pages/MockResultPage.jsx`

```jsx
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_LIMITS } from '@algonest/shared';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import MockResult from '../components/MockResult.jsx';
import {
  useMock, useMockAttemptQuestions, useMockReasons, useMockResult, useStartMockAttempt,
} from '../hooks/useMocks.js';
import { errorMessage } from '../lib/mockUtils.js';

const params = Object.freeze({ page: 1, limit: MOCK_LIMITS.MAX_QUESTIONS, sectionKey: 'all' });

export default function MockResultPage() {
  const { id: mockId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMockResult(attemptId);
  const { data: questionData } = useMockAttemptQuestions(attemptId, params);
  const { data: mockData } = useMock(mockId);
  const reasons = useMockReasons(attemptId);
  const start = useStartMockAttempt(mockId);

  const questions = useMemo(() => questionData?.items ?? [], [questionData?.items]);
  const attempt = data?.attempt;
  const summary = mockData?.mySummary;
  const canRetry = Boolean(summary?.canStart && !summary?.activeAttemptId);

  if (isLoading) return <FullPageLoader label="Analysing your attempt…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the analysis">{errorMessage(error)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Analysing your attempt…" />;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {reasons.isError ? <Alert variant="error">{errorMessage(reasons.error)}</Alert> : null}
      {start.isError ? <Alert variant="error">{errorMessage(start.error)}</Alert> : null}
      <MockResult
        attempt={attempt}
        questions={questions}
        mockId={mockId}
        canRetry={canRetry}
        pending={start.isPending}
        reasonsPending={reasons.isPending}
        onRetry={() => start.mutate(undefined, {
          onSuccess: (result) => navigate(`/app/mocks/${mockId}/attempts/${result.attempt.id}`),
        })}
        onReasons={(items) => reasons.mutate({ attemptId, reasons: items })}
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

> **Status: Phase 4 complete.** Phase 1 shipped authentication, onboarding, RBAC,
> the app shell, dark/light theming and the animated React Bits landing page.
> Phase 2 added **DSA Sheets**, Phase 3 added **Quizzes**, and Phase 4 adds the
> **Mock test engine**: sectional/global server-authoritative timers, negative
> marking, sectional cut-offs, a five-state question palette, autosave and
> resume after disconnect, auto-submit on timeout, attempt limits, and deep
> result analysis with weak-topic diagnosis and real resource recommendations.
> See [`docs/PHASE4.md`](./docs/PHASE4.md) for the design and full API reference and
> [`docs/PHASE4-CODE.md`](./docs/PHASE4-CODE.md) for every changed file verbatim.
> Earlier: [`docs/PHASE3.md`](./docs/PHASE3.md) · [`docs/PHASE2.md`](./docs/PHASE2.md) ·
> [`docs/PHASE1-CODE.md`](./docs/PHASE1-CODE.md).

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
│   └── PHASE4-CODE.md               # complete Phase 4 source, file by file
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
│   ├── tests/                       # node:test — 161 tests, no DB required
│   │   ├── app.test.js, contracts.test.js, auth.service.test.js
│   │   ├── sheets*.test.js         # detector, workflow, Zod, service, routes
│   │   ├── quizzes*.test.js        # 7 types, grading, import, versions, attempts
│   │   └── mocks*.test.js          # marking, server clock, sections, analysis
│   └── src/
│       ├── server.js                # bootstrap + graceful shutdown
│       ├── app.js                   # express app factory (security stack)
│       ├── config/{env,db}.js       # Zod-validated env, mongoose connection
│       ├── models/                  # User, RefreshSession + Phase-2/3 models
│       │   ├── {Sheet,SheetVersion,UserProgress}.js
│       │   ├── {SheetRating,SheetReport,PersonalResource}.js
│       │   ├── Problem.js           # embedded subdocument schema
│       │   ├── {Question,Quiz,QuizVersion,Attempt}.js
│       │   └── {MockTest,MockVersion,MockAttempt}.js
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
npm test                 # 161 node:test server tests + 22 client render smoke tests
                         # (API envelope, validation, RBAC, JWT, auth services,
                         #  platform detection, lifecycle, versioning, progress,
                         #  7 question types, grading, JSON/CSV import, attempts,
                         #  negative marking, sectional timers, palette states,
                         #  result analysis, and render-time crashes on every page)
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
5. Admin *screens* are Phase 8; Phase 1 ships the RBAC middleware, permissions and
   two permission-guarded user-management endpoints so the pattern is real, not TODO.
6. Module routes (Sheets → Community) exist with honest "coming in a later phase"
   empty states. No fake data or stub service logic.
7. Published-content versioning and per-user progress collections now exist in
   Phase 2 (`SheetVersion`, `UserProgress`), Phase 3 (`QuizVersion`, `Attempt`)
   and Phase 4 (`MockVersion`, `MockAttempt`). See `docs/PHASE2.md` §2,
   `docs/PHASE3.md` §2 and `docs/PHASE4.md` §2 for the embedding, snapshot and
   separation decisions.
8. In production the client and API should share an origin (or use
   `COOKIE_SAME_SITE=none` + HTTPS); the Vite dev proxy reproduces that locally.

---

## 10. Next phase

**Phase 5 — Adaptive Plans**: daily task distribution from sheets, quizzes and
mocks, rescheduling missed days, overload warnings and a "what should I do now"
queue. Reuse `weakTopics` from mock results and `topicStats` from quiz attempts
to rank revision tasks, and reuse `UserProgress` for completion signals.
```

## `docs/PHASE4.md`

```markdown
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
```
