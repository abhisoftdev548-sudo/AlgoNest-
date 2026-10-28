# AlgoNest — Phase 5 complete source code

> Auto-generated from the working tree on 2026-10-28. Every file below exists verbatim in the repository. Files marked "modified" also contain Phase 1–4 code; Phase 5 additions are appended to the shared contracts and documented in [PHASE5.md](./PHASE5.md).

## Index

### Shared contracts (modified) (2 files)

- [`shared/src/constants.js`](#shared-src-constants-js)
- [`shared/src/schemas.js`](#shared-src-schemas-js)

### Server — models (new) (2 files)

- [`server/src/models/Plan.js`](#server-src-models-plan-js)
- [`server/src/models/PlanTask.js`](#server-src-models-plantask-js)

### Server — pure plan engine (new) (1 files)

- [`server/src/modules/plans/planEngine.js`](#server-src-modules-plans-planengine-js)

### Server — services (new) (2 files)

- [`server/src/modules/plans/plan.service.js`](#server-src-modules-plans-plan-service-js)
- [`server/src/modules/plans/dashboard.service.js`](#server-src-modules-plans-dashboard-service-js)

### Server — controllers + routers + mount (5 files)

- [`server/src/modules/plans/plan.controller.js`](#server-src-modules-plans-plan-controller-js)
- [`server/src/modules/plans/dashboard.controller.js`](#server-src-modules-plans-dashboard-controller-js)
- [`server/src/modules/plans/plan.routes.js`](#server-src-modules-plans-plan-routes-js)
- [`server/src/modules/plans/dashboard.routes.js`](#server-src-modules-plans-dashboard-routes-js)
- [`server/src/routes/index.js`](#server-src-routes-index-js)

### Server — tests (new) (3 files)

- [`server/tests/plans.test.js`](#server-tests-plans-test-js)
- [`server/tests/plans.service.test.js`](#server-tests-plans-service-test-js)
- [`server/tests/plans.routes.test.js`](#server-tests-plans-routes-test-js)

### Client — shared wiring (modified) (4 files)

- [`client/src/lib/queryKeys.js`](#client-src-lib-querykeys-js)
- [`client/src/lib/navigation.js`](#client-src-lib-navigation-js)
- [`client/src/app/router.jsx`](#client-src-app-router-jsx)
- [`client/scripts/smokeRender.mjs`](#client-scripts-smokerender-mjs)

### Client — plans api / hooks / lib (new) (3 files)

- [`client/src/features/plans/api/planApi.js`](#client-src-features-plans-api-planapi-js)
- [`client/src/features/plans/hooks/usePlans.js`](#client-src-features-plans-hooks-useplans-js)
- [`client/src/features/plans/lib/planUtils.js`](#client-src-features-plans-lib-planutils-js)

### Client — plans components (new) (11 files)

- [`client/src/features/plans/components/GoalPicker.jsx`](#client-src-features-plans-components-goalpicker-jsx)
- [`client/src/features/plans/components/RestDayPicker.jsx`](#client-src-features-plans-components-restdaypicker-jsx)
- [`client/src/features/plans/components/PlanBasicsForm.jsx`](#client-src-features-plans-components-planbasicsform-jsx)
- [`client/src/features/plans/components/PlanContentPicker.jsx`](#client-src-features-plans-components-plancontentpicker-jsx)
- [`client/src/features/plans/components/PlanWizard.jsx`](#client-src-features-plans-components-planwizard-jsx)
- [`client/src/features/plans/components/PlanCard.jsx`](#client-src-features-plans-components-plancard-jsx)
- [`client/src/features/plans/components/PlanProgress.jsx`](#client-src-features-plans-components-planprogress-jsx)
- [`client/src/features/plans/components/OverloadAlert.jsx`](#client-src-features-plans-components-overloadalert-jsx)
- [`client/src/features/plans/components/PlanCalendar.jsx`](#client-src-features-plans-components-plancalendar-jsx)
- [`client/src/features/plans/components/TaskItem.jsx`](#client-src-features-plans-components-taskitem-jsx)
- [`client/src/features/plans/components/TaskList.jsx`](#client-src-features-plans-components-tasklist-jsx)

### Client — plans pages (new) (3 files)

- [`client/src/features/plans/pages/PlansPage.jsx`](#client-src-features-plans-pages-planspage-jsx)
- [`client/src/features/plans/pages/PlanDetailPage.jsx`](#client-src-features-plans-pages-plandetailpage-jsx)
- [`client/src/features/plans/pages/PlanEditorPage.jsx`](#client-src-features-plans-pages-planeditorpage-jsx)

### Client — dashboard api / hooks (new) (2 files)

- [`client/src/features/dashboard/api/dashboardApi.js`](#client-src-features-dashboard-api-dashboardapi-js)
- [`client/src/features/dashboard/hooks/useDashboard.js`](#client-src-features-dashboard-hooks-usedashboard-js)

### Client — dashboard components (new) (7 files)

- [`client/src/features/dashboard/components/DashboardHero.jsx`](#client-src-features-dashboard-components-dashboardhero-jsx)
- [`client/src/features/dashboard/components/ContinueCard.jsx`](#client-src-features-dashboard-components-continuecard-jsx)
- [`client/src/features/dashboard/components/StreakCard.jsx`](#client-src-features-dashboard-components-streakcard-jsx)
- [`client/src/features/dashboard/components/TodayTasks.jsx`](#client-src-features-dashboard-components-todaytasks-jsx)
- [`client/src/features/dashboard/components/WeakTopicsCard.jsx`](#client-src-features-dashboard-components-weaktopicscard-jsx)
- [`client/src/features/dashboard/components/UpcomingMockCard.jsx`](#client-src-features-dashboard-components-upcomingmockcard-jsx)
- [`client/src/features/dashboard/components/PendingRevisions.jsx`](#client-src-features-dashboard-components-pendingrevisions-jsx)

### Client — student dashboard page (rewritten) (1 files)

- [`client/src/features/home/pages/HomePage.jsx`](#client-src-features-home-pages-homepage-jsx)

### Documentation (2 files)

- [`README.md`](#readme-md)
- [`docs/PHASE5.md`](#docs-phase5-md)


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

/* ─────────────────────── Phase 5: Adaptive plans ─────────────────────── */

export const PLAN_STATUSES = Object.freeze({
  ACTIVE: 'active', PAUSED: 'paused', COMPLETED: 'completed', ARCHIVED: 'archived',
});
export const PLAN_STATUS_VALUES = Object.freeze(Object.values(PLAN_STATUSES));
export const PLAN_STATUS_LABELS = Object.freeze({
  active: 'Active', paused: 'Paused', completed: 'Completed', archived: 'Archived',
});

export const TASK_TYPES = Object.freeze({
  PROBLEM: 'problem', QUIZ: 'quiz', MOCK: 'mock', REVISION: 'revision',
});
export const TASK_TYPE_VALUES = Object.freeze(Object.values(TASK_TYPES));
export const TASK_TYPE_LABELS = Object.freeze({
  problem: 'Problem', quiz: 'Quiz', mock: 'Mock test', revision: 'Revision',
});

export const TASK_STATUSES = Object.freeze({
  PENDING: 'pending', IN_PROGRESS: 'in_progress', DONE: 'done',
  SKIPPED: 'skipped', MISSED: 'missed',
});
export const TASK_STATUS_VALUES = Object.freeze(Object.values(TASK_STATUSES));
export const TASK_STATUS_LABELS = Object.freeze({
  pending: 'To do', in_progress: 'In progress', done: 'Done', skipped: 'Skipped', missed: 'Missed',
});

export const TASK_SOURCES = Object.freeze({
  GENERATED: 'generated', MANUAL: 'manual', RESCHEDULED: 'rescheduled',
  REVISION: 'revision', MOCK: 'mock',
});
export const TASK_SOURCE_VALUES = Object.freeze(Object.values(TASK_SOURCES));

/** Spaced-repetition offsets, in calendar days after the source task. */
export const REVISION_INTERVALS = Object.freeze([1, 7, 21]);
/** A full-length mock is inserted every 14 calendar days from the plan start. */
export const MOCK_INTERVAL_DAYS = 14;

export const WEEKDAYS = Object.freeze([
  { value: 0, label: 'Sun', long: 'Sunday' },
  { value: 1, label: 'Mon', long: 'Monday' },
  { value: 2, label: 'Tue', long: 'Tuesday' },
  { value: 3, label: 'Wed', long: 'Wednesday' },
  { value: 4, label: 'Thu', long: 'Thursday' },
  { value: 5, label: 'Fri', long: 'Friday' },
  { value: 6, label: 'Sat', long: 'Saturday' },
]);
export const WEEKDAY_VALUES = Object.freeze(WEEKDAYS.map((day) => day.value));

export const PLAN_LIMITS = Object.freeze({
  MIN_DAILY_MINUTES: 15,
  MAX_DAILY_MINUTES: 720,
  MIN_DURATION_DAYS: 1,
  MAX_DURATION_DAYS: 365,
  MAX_TITLE: 120,
  MAX_NOTES: 500,
  MAX_SELECTED_SHEETS: 20,
  MAX_SELECTED_QUIZZES: 20,
  MAX_SELECTED_MOCKS: 20,
  MAX_REST_DAYS: 6,
  MAX_TASKS: 4000,
  MAX_TASKS_PER_DAY: 40,
  MAX_RESCHEDULE: 500,
  /** Short revision blocks; distinct from the source task's estimate. */
  REVISION_MINUTES: 10,
  /** If a single unit is bigger than this, it is flagged but still scheduled. */
  OVERLOAD_RATIO: 1,
  /** Caps how far past endDate an overloaded plan may spill. */
  MAX_OVERFLOW_DAYS: 60,
  WEAK_TOPIC_LIMIT: 6,
  DASHBOARD_TODAY_LIMIT: 12,
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
  GOAL_VALUES,
  PLAN_LIMITS,
  PLAN_STATUS_VALUES,
  REVISION_INTERVALS,
  TASK_SOURCE_VALUES,
  TASK_STATUS_VALUES,
  TASK_TYPE_VALUES,
  WEEKDAY_VALUES,
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

/* ──────────────────── Phase 5: Adaptive plan contracts ──────────────────── */

/** UTC calendar-day key. Never an epoch — avoids DST/timezone drift. */
export const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a YYYY-MM-DD date')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'That calendar date does not exist');

const planTitleSchema = z.string().trim().min(3, 'Title must be at least 3 characters').max(PLAN_LIMITS.MAX_TITLE);
const selectedIdsSchema = z.array(mongoIdSchema).max(PLAN_LIMITS.MAX_SELECTED_SHEETS);

export const planCreateSchema = z
  .object({
    title: planTitleSchema,
    goal: z.enum(GOAL_VALUES),
    startDate: dateKeySchema,
    endDate: dateKeySchema,
    dailyMinutes: z.coerce.number().int().min(PLAN_LIMITS.MIN_DAILY_MINUTES).max(PLAN_LIMITS.MAX_DAILY_MINUTES),
    restDays: z.array(z.number().int().min(0).max(6)).max(PLAN_LIMITS.MAX_REST_DAYS).default([])
      .refine((days) => new Set(days).size === days.length, 'Duplicate rest days'),
    sheetIds: selectedIdsSchema.default([]),
    quizIds: z.array(mongoIdSchema).max(PLAN_LIMITS.MAX_SELECTED_QUIZZES).default([]),
    mockIds: z.array(mongoIdSchema).max(PLAN_LIMITS.MAX_SELECTED_MOCKS).default([]),
    revisionEnabled: z.boolean().default(true),
    mockIntervalDays: z.coerce.number().int().min(7).max(60).default(14),
    /** Replaces any currently active plan; false rejects creation instead. */
    replaceActive: z.boolean().default(true),
    notes: z.string().trim().max(PLAN_LIMITS.MAX_NOTES).default(''),
  })
  .strict()
  .superRefine((value, ctx) => {
    const start = new Date(`${value.startDate}T00:00:00.000Z`).getTime();
    const end = new Date(`${value.endDate}T00:00:00.000Z`).getTime();
    const days = Math.round((end - start) / 86_400_000) + 1;
    if (end < start) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date must be on or after the start date' });
    if (days > PLAN_LIMITS.MAX_DURATION_DAYS) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: `A plan cannot exceed ${PLAN_LIMITS.MAX_DURATION_DAYS} days` });
    if (value.restDays.length >= 7) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['restDays'], message: 'Keep at least one working day per week' });
    if (!value.sheetIds.length && !value.quizIds.length && !value.mockIds.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sheetIds'], message: 'Select at least one sheet, quiz or mock' });
    }
  });

export const planUpdateSchema = z
  .object({
    title: planTitleSchema.optional(),
    notes: z.string().trim().max(PLAN_LIMITS.MAX_NOTES).optional(),
    dailyMinutes: z.coerce.number().int().min(PLAN_LIMITS.MIN_DAILY_MINUTES).max(PLAN_LIMITS.MAX_DAILY_MINUTES).optional(),
    restDays: z.array(z.number().int().min(0).max(6)).max(PLAN_LIMITS.MAX_REST_DAYS).optional(),
    revisionEnabled: z.boolean().optional(),
    status: z.enum(PLAN_STATUS_VALUES).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const planParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const taskParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const planTaskParamsSchema = z.object({ id: mongoIdSchema, taskId: mongoIdSchema }).strict();

export const planListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    status: z.enum(PLAN_STATUS_VALUES).optional(),
  })
  .strict();

/** Calendar/task list. `from`/`to` is an inclusive UTC date-key window. */
export const taskListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(PLAN_LIMITS.MAX_TASKS_PER_DAY * 8).default(200),
    from: dateKeySchema.optional(),
    to: dateKeySchema.optional(),
    status: z.enum(TASK_STATUS_VALUES).optional(),
    type: z.enum(TASK_TYPE_VALUES).optional(),
  })
  .strict()
  .refine((value) => !value.from || !value.to || value.from <= value.to, '`from` must be on or before `to`');

export const taskStatusSchema = z
  .object({
    status: z.enum(TASK_STATUS_VALUES),
    note: z.string().trim().max(PLAN_LIMITS.MAX_NOTES).optional(),
  })
  .strict();

export const taskReorderSchema = z
  .object({
    /** Task ids in the exact new order for one date. */
    taskIds: z.array(mongoIdSchema).min(1).max(PLAN_LIMITS.MAX_TASKS_PER_DAY),
    date: dateKeySchema,
  })
  .strict();

export const rescheduleSchema = z
  .object({
    /** Only these tasks are moved; omit to reschedule every missed task. */
    taskIds: z.array(mongoIdSchema).max(PLAN_LIMITS.MAX_RESCHEDULE).optional(),
  })
  .strict();

export const dashboardQuerySchema = z
  .object({
    date: dateKeySchema.optional(),
    /** Number of future days to include for upcoming mock/revision lookups. */
    horizon: z.coerce.number().int().min(1).max(90).default(30),
  })
  .strict();

/** Reusable for cron-style maintenance endpoints (Phase 8). */
export const revisionIntervalSchema = z.coerce.number().int().refine(
  (value) => REVISION_INTERVALS.includes(value),
  'Revision interval must be 1, 7 or 21 days',
);
export const taskSourceSchema = z.enum(TASK_SOURCE_VALUES);
export const taskTypeSchema = z.enum(TASK_TYPE_VALUES);
export const taskStatusValueSchema = z.enum(TASK_STATUS_VALUES);
export const weekdaySchema = z.number().int().min(0).max(6).refine(
  (value) => WEEKDAY_VALUES.includes(value), 'Invalid weekday',
);
```

---

# Server — models (new)

## `server/src/models/Plan.js`

```js
import mongoose from 'mongoose';
import {
  GOAL_VALUES, MOCK_INTERVAL_DAYS, PLAN_LIMITS, PLAN_STATUS_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

const warningSchema = new Schema(
  {
    code: { type: String, required: true, maxlength: 40 },
    message: { type: String, required: true, maxlength: 300 },
    date: { type: String, default: null },
    minutes: { type: Number, default: null },
  },
  { _id: false, versionKey: false },
);

/**
 * PER-USER adaptive plan. Content is never copied — only IDs of published
 * sheets/quizzes/mocks are referenced, so a plan follows published versions
 * while generated PlanTask rows keep a frozen title/URL/topic snapshot for
 * the day (a deleted resource must not erase someone's history).
 */
const planSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: PLAN_LIMITS.MAX_TITLE },
    goal: { type: String, enum: GOAL_VALUES, required: true },
    /** UTC calendar-day keys, never Date objects. */
    startDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    endDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    dailyMinutes: { type: Number, required: true, min: PLAN_LIMITS.MIN_DAILY_MINUTES, max: PLAN_LIMITS.MAX_DAILY_MINUTES },
    restDays: { type: [Number], default: [] },
    sheetIds: { type: [{ type: Types.ObjectId, ref: 'Sheet' }], default: [] },
    quizIds: { type: [{ type: Types.ObjectId, ref: 'Quiz' }], default: [] },
    mockIds: { type: [{ type: Types.ObjectId, ref: 'MockTest' }], default: [] },
    revisionEnabled: { type: Boolean, default: true },
    mockIntervalDays: { type: Number, min: 7, max: 60, default: MOCK_INTERVAL_DAYS },
    status: { type: String, enum: PLAN_STATUS_VALUES, default: 'active', index: true },
    notes: { type: String, trim: true, maxlength: PLAN_LIMITS.MAX_NOTES, default: '' },
    /** Snapshot refreshed whenever tasks change; never the source of truth. */
    stats: {
      totalTasks: { type: Number, default: 0 },
      doneTasks: { type: Number, default: 0 },
      missedTasks: { type: Number, default: 0 },
      completionPercentage: { type: Number, default: 0 },
      overloadCount: { type: Number, default: 0 },
    },
    warnings: { type: [warningSchema], default: [] },
    activatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

// At most one ACTIVE plan per learner. A new plan archives the old one first.
planSchema.index(
  { user: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' }, name: 'uniq_active_plan_per_user' },
);
planSchema.index({ user: 1, createdAt: -1 });
planSchema.index({ user: 1, status: 1, endDate: -1 });

planSchema.methods.isEditable = function isEditable() {
  return this.status === 'active' || this.status === 'paused';
};

planSchema.statics.toPublic = function toPublic(doc, view = 'summary') {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const ids = (values) => (values ?? []).map(String);
  const base = {
    id: String(plain._id),
    title: plain.title,
    goal: plain.goal,
    startDate: plain.startDate,
    endDate: plain.endDate,
    dailyMinutes: plain.dailyMinutes,
    restDays: plain.restDays ?? [],
    sheetIds: ids(plain.sheetIds),
    quizIds: ids(plain.quizIds),
    mockIds: ids(plain.mockIds),
    revisionEnabled: plain.revisionEnabled !== false,
    mockIntervalDays: plain.mockIntervalDays ?? MOCK_INTERVAL_DAYS,
    status: plain.status,
    notes: plain.notes || '',
    stats: {
      totalTasks: plain.stats?.totalTasks ?? 0,
      doneTasks: plain.stats?.doneTasks ?? 0,
      missedTasks: plain.stats?.missedTasks ?? 0,
      completionPercentage: plain.stats?.completionPercentage ?? 0,
      overloadCount: plain.stats?.overloadCount ?? 0,
    },
    activatedAt: plain.activatedAt ?? null,
    completedAt: plain.completedAt ?? null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
  if (view === 'summary') return base;
  return {
    ...base,
    warnings: (plain.warnings ?? []).map((entry) => ({
      code: entry.code, message: entry.message, date: entry.date ?? null, minutes: entry.minutes ?? null,
    })),
  };
};

export const Plan = mongoose.model('Plan', planSchema);
export default Plan;
```

## `server/src/models/PlanTask.js`

```js
import mongoose from 'mongoose';
import {
  PLAN_LIMITS, REVISION_INTERVALS, TASK_SOURCE_VALUES, TASK_STATUS_VALUES, TASK_TYPE_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * One actionable item on one UTC calendar day. PER-USER and fully separate
 * from the shared Sheet/Quiz/MockTest documents: completing a task never
 * mutates published content. `taskKey` is deterministic (generated by the
 * pure engine) so regeneration and rescheduling cannot create duplicates.
 */
const planTaskSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: Types.ObjectId, ref: 'Plan', required: true, index: true },
    taskKey: { type: String, required: true, trim: true, maxlength: 300 },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
    order: { type: Number, required: true, min: 0 },
    type: { type: String, enum: TASK_TYPE_VALUES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    refId: { type: String, default: '' },
    refType: { type: String, enum: ['Sheet', 'Quiz', 'MockTest', 'Manual'], default: 'Manual' },
    sheetId: { type: String, default: null },
    url: { type: String, trim: true, maxlength: 2000, default: '' },
    estimatedMinutes: { type: Number, required: true, min: 1, max: PLAN_LIMITS.MAX_DAILY_MINUTES },
    status: { type: String, enum: TASK_STATUS_VALUES, default: 'pending', index: true },
    source: { type: String, enum: TASK_SOURCE_VALUES, default: 'generated' },
    /** 1 | 7 | 21 for spaced revision tasks. */
    revisionInterval: { type: Number, enum: [...REVISION_INTERVALS, null], default: null },
    revisionOf: { type: String, default: null },
    overloaded: { type: Boolean, default: false },
    rescheduledFrom: { type: String, default: null },
    rescheduleCount: { type: Number, default: 0, min: 0 },
    note: { type: String, trim: true, maxlength: PLAN_LIMITS.MAX_NOTES, default: '' },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

planTaskSchema.index({ plan: 1, taskKey: 1 }, { unique: true, name: 'uniq_plan_task_key' });
planTaskSchema.index({ user: 1, date: 1, order: 1 });
planTaskSchema.index({ user: 1, status: 1, date: 1 });
planTaskSchema.index({ plan: 1, type: 1, date: 1 });
planTaskSchema.index({ plan: 1, revisionOf: 1 });

planTaskSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    plan: String(plain.plan),
    taskKey: plain.taskKey,
    date: plain.date,
    order: plain.order ?? 0,
    type: plain.type,
    title: plain.title,
    topic: plain.topic || 'General',
    description: plain.description || '',
    refId: plain.refId || '',
    refType: plain.refType || 'Manual',
    sheetId: plain.sheetId || null,
    url: plain.url || '',
    estimatedMinutes: plain.estimatedMinutes ?? 0,
    status: plain.status,
    source: plain.source || 'generated',
    revisionInterval: plain.revisionInterval ?? null,
    revisionOf: plain.revisionOf ?? null,
    overloaded: Boolean(plain.overloaded),
    rescheduledFrom: plain.rescheduledFrom ?? null,
    rescheduleCount: plain.rescheduleCount ?? 0,
    note: plain.note || '',
    completedAt: plain.completedAt ?? null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const PlanTask = mongoose.model('PlanTask', planTaskSchema);
export default PlanTask;
```

---

# Server — pure plan engine (new)

## `server/src/modules/plans/planEngine.js`

```js
import {
  MOCK_INTERVAL_DAYS, PLAN_LIMITS, REVISION_INTERVALS,
  TASK_SOURCES as SRC, TASK_STATUSES as ST, TASK_TYPES as T,
} from '@algonest/shared';

/**
 * Pure adaptive-plan engine. No DB, no Express, no hidden clock — every
 * function takes explicit date keys so the unit tests are deterministic.
 *
 * A "date" here is always a UTC `YYYY-MM-DD` string. That removes DST and
 * timezone drift from scheduling and makes task ids stable across reloads.
 */

const DAY_MS = 86_400_000;

export function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function dateKey(value = new Date()) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && isValidDateKey(value)) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  if (typeof value === 'number') return new Date(value).toISOString().slice(0, 10);
  throw new TypeError('Expected a Date, date key or parseable date string');
}

export function toDate(key) {
  return new Date(`${key}T00:00:00.000Z`);
}

export function addDays(key, days) {
  return new Date(toDate(key).getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

export function diffDays(from, to) {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / DAY_MS);
}

/** 0 = Sunday … 6 = Saturday, in UTC. */
export function weekdayOf(key) {
  return toDate(key).getUTCDay();
}

export function isRestDay(key, restDays = []) {
  return restDays.includes(weekdayOf(key));
}

export function workingDates(start, end, restDays = []) {
  const result = [];
  if (diffDays(start, end) < 0) return result;
  for (let cursor = start; diffDays(cursor, end) >= 0; cursor = addDays(cursor, 1)) {
    if (!isRestDay(cursor, restDays)) result.push(cursor);
  }
  return result;
}

/** First non-rest date on or after `key` (bounded to avoid infinite loops). */
export function nextWorkingDate(key, restDays = [], maxLookahead = 14) {
  let cursor = key;
  for (let index = 0; index <= maxLookahead; index += 1) {
    if (!isRestDay(cursor, restDays)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return cursor; // all seven days are rest days — the contract forbids this
}

/** Extend the working-date list past `end` when the plan overflows. */
export function extendDates(dates, restDays = [], extra = PLAN_LIMITS.MAX_OVERFLOW_DAYS) {
  const result = [...dates];
  if (!result.length) return result;
  let cursor = addDays(result[result.length - 1], 1);
  while (result.length < dates.length + extra) {
    if (!isRestDay(cursor, restDays)) result.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return result;
}

const num = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Flatten published content into schedulable units.
 * Sheets expand into their embedded problems (the actionable item); quizzes
 * and mocks stay single units.
 */
export function buildUnits({ sheets = [], quizzes = [] } = {}) {
  const units = [];
  for (const sheet of sheets) {
    const problems = [...(sheet.problems ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const problem of problems) {
      units.push({
        type: T.PROBLEM,
        title: problem.title || 'Untitled problem',
        topic: problem.topic || 'General',
        minutes: Math.ceil(num(problem.estimatedMinutes, 20)),
        refId: String(problem.id ?? problem._id),
        refType: 'Sheet',
        sheetId: String(sheet.id ?? sheet._id),
        url: problem.url || '',
        difficulty: problem.difficulty || 'medium',
      });
    }
  }
  for (const quiz of quizzes) {
    units.push({
      type: T.QUIZ,
      title: quiz.title || 'Untitled quiz',
      topic: (quiz.topics ?? [])[0] || 'General',
      minutes: Math.ceil(num(quiz.settings?.timerMinutes, 20)),
      refId: String(quiz.id ?? quiz._id),
      refType: 'Quiz',
      url: `/app/quizzes/${String(quiz.id ?? quiz._id)}`,
      difficulty: quiz.difficulty || 'medium',
    });
  }
  return units;
}

export function buildMockPool(mocks = []) {
  return mocks.map((mock) => ({
    type: T.MOCK,
    title: mock.title || 'Full-length mock',
    topic: (mock.topics ?? [])[0] || 'Mixed',
    minutes: Math.ceil(num(mock.totalDurationMinutes, 60)),
    refId: String(mock.id ?? mock._id),
    refType: 'MockTest',
    url: `/app/mocks/${String(mock.id ?? mock._id)}`,
  }));
}

const warn = (code, message, extra = {}) => ({ code, message, ...extra });

/**
 * Distribute units into daily buckets, then overlay the 14-day mock cadence
 * and the 1/7/21 revision cadence.
 *
 * @returns {{tasks:Array, warnings:Array, dailyLoad:Object, usedDates:Array}}
 */
export function distribute(units, options) {
  const {
    start, end, dailyMinutes, restDays = [], revisionEnabled = true,
    mockIntervalDays = MOCK_INTERVAL_DAYS, mockPool = [], autoMocks = false,
  } = options;
  const capacity = Math.max(1, Number(dailyMinutes) || 60);
  const warnings = [];
  const baseDates = workingDates(start, end, restDays);
  if (!baseDates.length) return { tasks: [], warnings: [warn('NO_WORKING_DAYS', 'Every day in this range is a rest day. Keep at least one working day.')], dailyLoad: {}, usedDates: [] };
  const dates = extendDates(baseDates, restDays);
  const loads = Object.fromEntries(dates.map((date) => [date, 0]));
  const tasks = [];
  let sequence = 0;

  const addTask = (date, unit, extra = {}) => {
    sequence += 1;
    const oversized = unit.minutes > capacity;
    if (oversized) warnings.push(warn('SINGLE_TASK_TOO_LONG', `"${unit.title}" needs ${unit.minutes} min but a day only has ${capacity} min.`, { date, taskTitle: unit.title }));
    const task = {
      taskKey: extra.taskKey ?? `${unit.type}:${unit.refId}:${date}:${extra.interval ?? 0}`,
      date,
      order: extra.order ?? sequence,
      type: unit.type,
      title: unit.title,
      topic: unit.topic || 'General',
      description: extra.description ?? '',
      refId: unit.refId,
      refType: unit.refType,
      sheetId: unit.sheetId ?? null,
      url: unit.url ?? '',
      estimatedMinutes: unit.minutes,
      status: ST.PENDING,
      source: extra.source ?? SRC.GENERATED,
      revisionInterval: extra.interval ?? null,
      revisionOf: extra.revisionOf ?? null,
      overloaded: oversized,
      rescheduledFrom: null,
      rescheduleCount: 0,
      note: '',
    };
    tasks.push(task);
    loads[date] = (loads[date] ?? 0) + unit.minutes;
    return task;
  };

  /* 1. Reserve the mock cadence FIRST so a long mock is never pushed off. */
  if (mockPool.length) {
    const interval = Math.max(7, Number(mockIntervalDays) || MOCK_INTERVAL_DAYS);
    for (let offset = 0, index = 0; diffDays(start, addDays(start, offset)) <= diffDays(start, end); offset += interval, index += 1) {
      const target = nextWorkingDate(addDays(start, offset), restDays);
      if (diffDays(end, target) > 0) break; // target is past the plan end
      const unit = mockPool[index % mockPool.length];
      const task = addTask(target, unit, { source: SRC.MOCK, taskKey: `mock:${unit.refId}:${target}:${index}` });
      task.description = 'Full-length timed mock. Review the analysis afterwards.';
    }
  } else if (autoMocks) {
    warnings.push(warn('NO_MOCKS_AVAILABLE', 'No published mock tests were available, so the 14-day mock cadence was skipped.'));
  }

  /* 2. Place the learning units into the first day with enough capacity. */
  const learnable = [];
  for (const unit of units) {
    let placed = false;
    for (let index = 0; index < dates.length; index += 1) {
      const date = dates[index];
      const dayTasks = tasks.filter((task) => task.date === date);
      const fits = (loads[date] ?? 0) + unit.minutes <= capacity || (loads[date] ?? 0) === 0;
      const tooMany = dayTasks.length >= PLAN_LIMITS.MAX_TASKS_PER_DAY;
      if (tooMany) continue;
      if (!fits) continue;
      if (diffDays(end, date) > 0 && warnings.every((item) => item.code !== 'OVERFLOW_PAST_END')) {
        warnings.push(warn('OVERFLOW_PAST_END', `The workload does not fit before ${end}; ${date} and later are overflow days. Consider a longer plan or fewer items.`));
      }
      const task = addTask(date, unit, { taskKey: `${unit.type}:${unit.refId}:${date}:0` });
      learnable.push(task);
      placed = true;
      break;
    }
    if (!placed) warnings.push(warn('TASK_UNSCHEDULED', `"${unit.title}" could not be scheduled within the allowed overflow.`, { taskTitle: unit.title }));
  }

  /* 3. Spaced revisions at +1 / +7 / +21 days after each learn task. */
  if (revisionEnabled) {
    for (const source of learnable) {
      for (const interval of REVISION_INTERVALS) {
        const target = nextWorkingDate(addDays(source.date, interval), restDays);
        const unit = {
          type: T.REVISION,
          title: `Revise: ${source.title}`,
          topic: source.topic,
          minutes: Math.min(PLAN_LIMITS.REVISION_MINUTES, Math.max(5, Math.ceil(source.estimatedMinutes / 3))),
          refId: source.refId,
          refType: source.refType,
          url: source.url,
          sheetId: source.sheetId,
        };
        // Search forward from the target for a day with capacity; never drop it.
        const startIndex = dates.findIndex((date) => date >= target);
        if (startIndex < 0) {
          warnings.push(warn('REVISION_SKIPPED', `A ${interval}-day revision for "${source.title}" falls outside the plan.`, { taskTitle: source.title }));
          continue;
        }
        let chosen = dates[startIndex];
        for (let index = startIndex; index < dates.length; index += 1) {
          const date = dates[index];
          if ((loads[date] ?? 0) + unit.minutes <= capacity) { chosen = date; break; }
        }
        addTask(chosen, unit, {
          source: SRC.REVISION,
          interval,
          revisionOf: source.taskKey,
          taskKey: `revision:${source.taskKey}:${interval}`,
          description: `${interval}-day spaced revision of this topic.`,
        });
      }
    }
  }

  /* 4. Flag days whose total exceeds the learner's daily budget. */
  for (const date of Object.keys(loads)) {
    if (loads[date] > capacity) {
      warnings.push(warn('DAILY_OVERLOAD', `${date} has ${loads[date]} min of work but your budget is ${capacity} min.`, { date, minutes: loads[date] }));
      for (const task of tasks) if (task.date === date) task.overloaded = true;
    }
  }

  const usedDates = [...new Set(tasks.map((task) => task.date))].sort();
  return {
    tasks: tasks.sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order),
    warnings: dedupeWarnings(warnings),
    dailyLoad: loads,
    usedDates,
  };
}

function dedupeWarnings(warnings) {
  const seen = new Set();
  return warnings.filter((item) => {
    const key = `${item.code}:${item.date ?? ''}:${item.taskTitle ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 60);
}

/**
 * Move missed tasks into the remaining capacity from `today` onward and
 * re-anchor their revisions. `existing` are already-planned (non-missed)
 * tasks whose minutes must be respected.
 */
export function reschedule(missed, existing, options) {
  const { today, end, dailyMinutes, restDays = [], revisionIntervals = REVISION_INTERVALS } = options;
  const capacity = Math.max(1, Number(dailyMinutes) || 60);
  const baseDates = workingDates(today, end, restDays);
  const dates = baseDates.length ? extendDates(baseDates, restDays, Math.min(30, PLAN_LIMITS.MAX_OVERFLOW_DAYS)) : [];
  const loads = Object.fromEntries(dates.map((date) => [date, 0]));
  for (const task of existing) {
    if (loads[task.date] !== undefined) loads[task.date] += Number(task.estimatedMinutes) || 0;
  }
  const warnings = [];
  const moves = [];
  const sorted = [...missed].sort((a, b) => a.date.localeCompare(b.date) || (a.order ?? 0) - (b.order ?? 0));

  for (const task of sorted) {
    const minutes = Number(task.estimatedMinutes) || 0;
    let chosen = null;
    for (const date of dates) {
      if ((loads[date] ?? 0) + minutes <= capacity) { chosen = date; break; }
    }
    if (!chosen) {
      chosen = dates[dates.length - 1] ?? today;
      warnings.push(warn('RESCHEDULE_OVERLOAD', `${chosen} now exceeds ${capacity} min while rescheduling "${task.title}".`, { date: chosen }));
    }
    loads[chosen] = (loads[chosen] ?? 0) + minutes;
    moves.push({
      taskKey: task.taskKey,
      date: chosen,
      rescheduledFrom: task.date,
      rescheduleCount: (Number(task.rescheduleCount) || 0) + 1,
      source: SRC.RESCHEDULED,
      status: ST.PENDING,
      overloaded: loads[chosen] > capacity,
    });
  }

  for (const date of Object.keys(loads)) {
    if (loads[date] > capacity) warnings.push(warn('DAILY_OVERLOAD', `${date} is overloaded at ${loads[date]}/${capacity} min after rescheduling.`, { date }));
  }
  return { moves, warnings: dedupeWarnings(warnings), dailyLoad: loads, intervals: revisionIntervals };
}

/**
 * Consecutive non-rest days with at least one completed task. Rest days are
 * transparent: they neither count nor break the run. If today has no
 * completion yet, the streak is still measured up to yesterday.
 */
export function computeStreak(completedDates = [], today, restDays = []) {
  const done = new Set(completedDates.filter(isValidDateKey));
  const sorted = [...done].sort();
  if (!sorted.length || !isValidDateKey(today)) return { current: 0, longest: 0, lastActiveDate: sorted[sorted.length - 1] ?? null };

  let cursor = today;
  if (!done.has(cursor)) cursor = addDays(today, -1);
  // Skip rest days at the head of the walk.
  for (let index = 0; index < 7 && isRestDay(cursor, restDays); index += 1) cursor = addDays(cursor, -1);

  let current = 0;
  const earliest = sorted[0];
  while (diffDays(earliest, cursor) >= 0) {
    if (isRestDay(cursor, restDays)) { cursor = addDays(cursor, -1); continue; }
    if (!done.has(cursor)) break;
    current += 1;
    cursor = addDays(cursor, -1);
  }

  // Longest run over the whole history.
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const date of sorted) {
    if (isRestDay(date, restDays)) continue;
    if (previous) {
      let bridge = addDays(previous, 1);
      let gapOk = true;
      while (diffDays(bridge, date) < 0) {
        if (!isRestDay(bridge, restDays)) { gapOk = false; break; }
        bridge = addDays(bridge, 1);
      }
      run = gapOk ? run + 1 : 1;
    } else run = 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  return { current, longest: Math.max(longest, current), lastActiveDate: sorted[sorted.length - 1] };
}

export function computeProgress(tasks = []) {
  const result = {
    total: tasks.length, done: 0, skipped: 0, pending: 0, inProgress: 0, missed: 0,
    minutesTotal: 0, minutesDone: 0, completionPercentage: 0,
  };
  for (const task of tasks) {
    result.minutesTotal += Number(task.estimatedMinutes) || 0;
    if (task.status === ST.DONE) { result.done += 1; result.minutesDone += Number(task.estimatedMinutes) || 0; }
    else if (task.status === ST.SKIPPED) result.skipped += 1;
    else if (task.status === ST.IN_PROGRESS) result.inProgress += 1;
    else if (task.status === ST.MISSED) result.missed += 1;
    else result.pending += 1;
  }
  const countable = result.total - result.skipped;
  result.completionPercentage = countable > 0 ? Math.round((result.done / countable) * 1000) / 10 : 0;
  return result;
}

export function dailyLoad(tasks = [], dailyMinutes = 60) {
  const map = {};
  for (const task of tasks) map[task.date] = (map[task.date] ?? 0) + (Number(task.estimatedMinutes) || 0);
  return Object.entries(map).map(([date, minutes]) => ({
    date, minutes, capacity: dailyMinutes,
    overloaded: minutes > dailyMinutes,
    ratio: dailyMinutes ? Math.round((minutes / dailyMinutes) * 100) : 0,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

/** Merge quiz + mock topic stats into one ranked weak-topic list. */
export function aggregateWeakTopics(quizStats = [], mockStats = [], limit = PLAN_LIMITS.WEAK_TOPIC_LIMIT) {
  const map = new Map();
  const add = (stat, weight) => {
    const topic = String(stat.topic ?? stat.key ?? 'General');
    const total = Number(stat.total) || 0;
    const correct = Number(stat.correct) || 0;
    const percentage = Number(stat.percentage);
    const row = map.get(topic) ?? { topic, total: 0, correct: 0, attempts: 0, weightedPercentage: 0, lostMarks: 0, sources: new Set() };
    row.total += total;
    row.correct += correct;
    row.attempts += 1;
    row.weightedPercentage += (Number.isFinite(percentage) ? percentage : total ? (correct / total) * 100 : 100) * (total || 1) * weight;
    row.lostMarks += Number(stat.lostMarks) || 0;
    row.sources.add(weight === 1.2 ? 'mock' : 'quiz');
    map.set(topic, row);
  };
  for (const stat of quizStats) add(stat, 1);
  for (const stat of mockStats) add(stat, 1.2); // full-length mocks weigh more

  return [...map.values()]
    .map((row) => ({
      topic: row.topic,
      total: row.total,
      correct: row.correct,
      attempts: row.attempts,
      percentage: Math.round((row.weightedPercentage / Math.max(1, row.total)) * 10) / 10,
      lostMarks: Math.round(row.lostMarks * 10) / 10,
      sources: [...row.sources],
      severity: row.weightedPercentage / Math.max(1, row.total) < 40 ? 'high' : row.weightedPercentage / Math.max(1, row.total) < 65 ? 'medium' : 'low',
    }))
    .sort((a, b) => a.percentage - b.percentage || b.lostMarks - a.lostMarks || a.topic.localeCompare(b.topic))
    .slice(0, limit);
}
```

---

# Server — services (new)

## `server/src/modules/plans/plan.service.js`

```js
import mongoose from 'mongoose';
import {
  PLAN_LIMITS, PLAN_STATUSES as P, TASK_STATUSES as ST, TASK_TYPES as TT,
} from '@algonest/shared';
import { Plan } from '../../models/Plan.js';
import { PlanTask } from '../../models/PlanTask.js';
import { Sheet } from '../../models/Sheet.js';
import { SheetVersion } from '../../models/SheetVersion.js';
import { Quiz } from '../../models/Quiz.js';
import { MockTest } from '../../models/MockTest.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import {
  addDays, buildMockPool, buildUnits, computeProgress, computeStreak, dailyLoad,
  dateKey, diffDays, distribute, isValidDateKey, reschedule,
} from './planEngine.js';
import { actorFrom } from '../mocks/actor.js';

const { Types } = mongoose;
const plain = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });
const idOf = (value) => String(value?._id ?? value ?? '');

function assertOwner(doc, actor) {
  if (String(doc.user) !== String(actor.id)) throw ApiError.forbidden('This plan belongs to another learner');
}

async function findPlan(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid plan id');
  const doc = await Plan.findById(id);
  if (!doc) throw ApiError.notFound('Plan not found');
  return doc;
}

function todayKey(override) {
  if (override && isValidDateKey(override)) return override;
  return dateKey(new Date());
}

/** Load only PUBLISHED, non-archived content; private visibility is excluded. */
async function loadContent(payload) {
  const sheetIds = (payload.sheetIds ?? []).map((value) => new Types.ObjectId(value));
  const quizIds = (payload.quizIds ?? []).map((value) => new Types.ObjectId(value));
  const mockIds = (payload.mockIds ?? []).map((value) => new Types.ObjectId(value));
  const [sheets, quizzes, mocks, versions] = await Promise.all([
    sheetIds.length ? Sheet.find({ _id: { $in: sheetIds }, publishedVersion: { $gt: 0 }, status: { $ne: 'archived' }, 'settings.visibility': 'public' }).lean() : [],
    quizIds.length ? Quiz.find({ _id: { $in: quizIds }, publishedVersion: { $gt: 0 }, status: { $ne: 'archived' }, 'settings.visibility': 'public' }).lean() : [],
    mockIds.length ? MockTest.find({ _id: { $in: mockIds }, publishedVersion: { $gt: 0 }, status: { $ne: 'archived' }, 'settings.visibility': 'public' }).lean() : [],
    sheetIds.length ? SheetVersion.find({ sheet: { $in: sheetIds } }).sort({ version: -1 }).lean() : [],
  ]);
  if (sheets.length !== sheetIds.length) throw ApiError.notFound('One or more selected sheets are not published');
  if (quizzes.length !== quizIds.length) throw ApiError.notFound('One or more selected quizzes are not published');
  if (mocks.length !== mockIds.length) throw ApiError.notFound('One or more selected mock tests are not published');

  const latestVersion = new Map();
  for (const version of versions) if (!latestVersion.has(String(version.sheet))) latestVersion.set(String(version.sheet), version);
  const sheetsForUnits = sheets.map((sheet) => {
    const snapshot = latestVersion.get(String(sheet._id));
    return {
      id: String(sheet._id), title: snapshot?.title ?? sheet.title,
      problems: snapshot?.problems ?? sheet.problems ?? [],
    };
  });
  const quizzesForUnits = quizzes.map((quiz) => ({
    id: String(quiz._id), title: quiz.title, topics: quiz.topics ?? [],
    settings: quiz.settings?.toObject ? quiz.settings.toObject() : (quiz.settings ?? {}),
  }));
  const mocksForUnits = mocks.map((mock) => ({
    id: String(mock._id), title: mock.title, topics: mock.topics ?? [],
    totalDurationMinutes: (mock.sections ?? []).reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0) || 60,
  }));
  return { sheets: sheetsForUnits, quizzes: quizzesForUnits, mocks: mocksForUnits };
}

/** When no mock was chosen, auto-fill from the published catalogue. */
async function autoMockPool(excludeIds = []) {
  const docs = await MockTest.find({
    publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public',
    _id: { $nin: excludeIds.map((value) => new Types.ObjectId(value)) },
  }).sort({ publishedAt: -1 }).limit(5).lean().catch(() => []);
  return buildMockPool(docs.map((mock) => ({
    id: String(mock._id), title: mock.title, topics: mock.topics ?? [],
    totalDurationMinutes: (mock.sections ?? []).reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0) || 60,
  })));
}

function toWarnings(entries = []) {
  return entries.slice(0, 60).map((entry) => ({
    code: entry.code,
    message: entry.message,
    date: entry.date ?? null,
    minutes: entry.minutes ?? null,
  }));
}

/** Persist generated tasks; duplicate keys are ignored (idempotent regeneration). */
async function persistTasks(planId, userId, tasks) {
  if (!tasks.length) return 0;
  const rows = tasks.slice(0, PLAN_LIMITS.MAX_TASKS).map((task) => ({
    user: new Types.ObjectId(userId),
    plan: new Types.ObjectId(planId),
    taskKey: task.taskKey,
    date: task.date,
    order: task.order,
    type: task.type,
    title: task.title,
    topic: task.topic || 'General',
    description: task.description || '',
    refId: task.refId || '',
    refType: task.refType || 'Manual',
    sheetId: task.sheetId || null,
    url: task.url || '',
    estimatedMinutes: Math.max(1, Number(task.estimatedMinutes) || 10),
    status: task.status ?? ST.PENDING,
    source: task.source ?? 'generated',
    revisionInterval: task.revisionInterval ?? null,
    revisionOf: task.revisionOf ?? null,
    overloaded: Boolean(task.overloaded),
    rescheduledFrom: task.rescheduledFrom ?? null,
    rescheduleCount: task.rescheduleCount ?? 0,
    note: task.note || '',
  }));
  const result = await PlanTask.insertMany(rows, { ordered: false }).catch((error) => {
    // E11000 from a concurrent regeneration is acceptable: other rows inserted.
    if (error?.code === 11000 || error?.writeErrors?.every((item) => item.code === 11000)) {
      return error?.result?.insertedCount ? rows.slice(0, error.result.insertedCount) : [];
    }
    throw error;
  });
  return result.length;
}

/** Recompute the denormalised stats snapshot from the live task rows. */
export async function refreshStats(planId) {
  const tasks = await PlanTask.find({ plan: planId }).select('status').lean();
  const progress = computeProgress(tasks);
  const overloadCount = await PlanTask.countDocuments({ plan: planId, overloaded: true });
  await Plan.updateOne({ _id: planId }, {
    $set: {
      'stats.totalTasks': progress.total,
      'stats.doneTasks': progress.done,
      'stats.missedTasks': progress.missed,
      'stats.completionPercentage': progress.completionPercentage,
      'stats.overloadCount': overloadCount,
    },
  });
  return { ...progress, overloadCount };
}

/** Idempotent: past pending/in-progress tasks become `missed` (never deleted). */
export async function markMissedTasks(plan, actor, now) {
  const result = await PlanTask.updateMany(
    { plan: plan._id, user: new Types.ObjectId(actor.id), date: { $lt: now }, status: { $in: [ST.PENDING, ST.IN_PROGRESS] } },
    { $set: { status: ST.MISSED } },
  );
  return result.modifiedCount ?? result.nModified ?? 0;
}

/* ─────────────────────────── create / read ─────────────────────────── */

export async function createPlan(payload, actor, now = dateKey(new Date())) {
  const start = payload.startDate;
  if (diffDays(now, start) < -365) throw ApiError.unprocessable('A plan cannot start more than a year in the past');
  if (diffDays(start, payload.endDate) < 0) throw ApiError.unprocessable('End date must be on or after the start date');

  const existing = await Plan.findOne({ user: new Types.ObjectId(actor.id), status: P.ACTIVE });
  if (existing) {
    if (!payload.replaceActive) throw ApiError.conflict('You already have an active plan. Archive it first or enable replacement.');
    existing.status = P.ARCHIVED;
    existing.completedAt = new Date();
    await existing.save();
  }

  const content = await loadContent(payload);
  let mockPool = buildMockPool(content.mocks);
  let autoMocks = false;
  if (!mockPool.length) { mockPool = await autoMockPool(payload.mockIds); autoMocks = true; }

  const generated = distribute(buildUnits(content), {
    start, end: payload.endDate,
    dailyMinutes: payload.dailyMinutes,
    restDays: payload.restDays,
    revisionEnabled: payload.revisionEnabled,
    mockIntervalDays: payload.mockIntervalDays,
    mockPool, autoMocks,
  });
  if (!generated.tasks.length) {
    throw ApiError.unprocessable(generated.warnings[0]?.message ?? 'Nothing could be scheduled for this plan');
  }
  if (generated.tasks.length > PLAN_LIMITS.MAX_TASKS) {
    throw ApiError.unprocessable(`This plan would create ${generated.tasks.length} tasks; reduce the selected content or lengthen the plan.`);
  }

  const plan = await Plan.create({
    user: new Types.ObjectId(actor.id),
    title: payload.title, goal: payload.goal,
    startDate: start, endDate: payload.endDate,
    dailyMinutes: payload.dailyMinutes, restDays: payload.restDays,
    sheetIds: payload.sheetIds.map((value) => new Types.ObjectId(value)),
    quizIds: payload.quizIds.map((value) => new Types.ObjectId(value)),
    mockIds: payload.mockIds.map((value) => new Types.ObjectId(value)),
    revisionEnabled: payload.revisionEnabled,
    mockIntervalDays: payload.mockIntervalDays,
    notes: payload.notes,
    status: P.ACTIVE,
    warnings: toWarnings(generated.warnings),
  });
  try {
    await persistTasks(plan._id, actor.id, generated.tasks);
  } catch (error) {
    await PlanTask.deleteMany({ plan: plan._id }).catch(() => {});
    await Plan.deleteOne({ _id: plan._id }).catch(() => {});
    throw error;
  }
  const stats = await refreshStats(plan._id);
  const fresh = await Plan.findById(plan._id);
  return {
    plan: Plan.toPublic(fresh, 'detail'),
    generated: {
      tasks: generated.tasks.length,
      mockTasks: generated.tasks.filter((task) => task.type === TT.MOCK).length,
      revisionTasks: generated.tasks.filter((task) => task.type === TT.REVISION).length,
      usedDates: generated.usedDates,
      warnings: generated.warnings,
      dailyLoad: dailyLoad(generated.tasks, payload.dailyMinutes),
      progress: stats,
    },
  };
}

export async function listPlans(query, actor) {
  const filter = { user: new Types.ObjectId(actor.id) };
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    Plan.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Plan.countDocuments(filter),
  ]);
  return { items: items.map((doc) => Plan.toPublic(doc, 'summary')), pagination: buildPagination(page, limit, total) };
}

export async function getActivePlan(actor) {
  const doc = await Plan.findOne({ user: new Types.ObjectId(actor.id), status: P.ACTIVE });
  return doc ? Plan.toPublic(doc, 'detail') : null;
}

export async function getPlan(id, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  const missed = await markMissedTasks(plan, actor, now);
  if (missed) await refreshStats(plan._id);
  const fresh = missed ? await Plan.findById(plan._id) : plan;
  const tasks = await PlanTask.find({ plan: plan._id }).sort({ date: 1, order: 1 }).lean();
  return {
    plan: Plan.toPublic(fresh, 'detail'),
    progress: computeProgress(tasks),
    dailyLoad: dailyLoad(tasks, fresh.dailyMinutes),
    missedJustNow: missed,
    streak: computeStreak(
      tasks.filter((task) => task.status === ST.DONE).map((task) => task.date),
      now, fresh.restDays,
    ),
  };
}

export async function updatePlan(id, payload, actor) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  if (plan.status === P.ARCHIVED) throw ApiError.conflict('Restore is not supported; create a new plan instead');
  if (payload.status) {
    const allowed = plan.status === P.ACTIVE ? [P.PAUSED, P.COMPLETED, P.ARCHIVED] : [P.ACTIVE, P.COMPLETED, P.ARCHIVED];
    if (!allowed.includes(payload.status)) throw ApiError.conflict(`Cannot change a ${plan.status} plan to ${payload.status}`);
    if (payload.status === P.ACTIVE) {
      const other = await Plan.findOne({ user: new Types.ObjectId(actor.id), status: P.ACTIVE, _id: { $ne: plan._id } });
      if (other) throw ApiError.conflict('Another plan is already active. Pause it first.');
    }
    plan.status = payload.status;
    if (payload.status === P.COMPLETED || payload.status === P.ARCHIVED) plan.completedAt = new Date();
  }
  for (const key of ['title', 'notes', 'dailyMinutes', 'restDays', 'revisionEnabled']) {
    if (payload[key] !== undefined) plan[key] = payload[key];
  }
  plan.markModified('restDays');
  await plan.save();
  return { plan: Plan.toPublic(plan, 'detail') };
}

/** Delete only PENDING future tasks and regenerate from `today` onward. */
export async function regeneratePlan(id, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  if (plan.status === P.ARCHIVED) throw ApiError.conflict('Cannot regenerate an archived plan');
  await markMissedTasks(plan, actor, now);
  const content = await loadContent({
    sheetIds: (plan.sheetIds ?? []).map(String),
    quizIds: (plan.quizIds ?? []).map(String),
    mockIds: (plan.mockIds ?? []).map(String),
  });
  let mockPool = buildMockPool(content.mocks);
  if (!mockPool.length) mockPool = await autoMockPool((plan.mockIds ?? []).map(String));

  const start = now > plan.startDate ? now : plan.startDate;
  const generated = distribute(buildUnits(content), {
    start, end: plan.endDate,
    dailyMinutes: plan.dailyMinutes, restDays: plan.restDays,
    revisionEnabled: plan.revisionEnabled, mockIntervalDays: plan.mockIntervalDays,
    mockPool,
  });
  const removable = await PlanTask.find({
    plan: plan._id, date: { $gte: start }, status: { $in: [ST.PENDING, ST.MISSED] },
  }).select('_id taskKey').lean();
  if (removable.length) await PlanTask.deleteMany({ _id: { $in: removable.map((item) => item._id) } });
  await persistTasks(plan._id, actor.id, generated.tasks);
  plan.warnings = toWarnings(generated.warnings);
  plan.markModified('warnings');
  await plan.save();
  const stats = await refreshStats(plan._id);
  return { plan: Plan.toPublic(plan, 'detail'), generated: { tasks: generated.tasks.length, warnings: generated.warnings, progress: stats } };
}

/* ─────────────────────────── tasks ─────────────────────────── */

export async function listTasks(id, query, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  await markMissedTasks(plan, actor, now);
  const filter = { plan: plan._id, user: new Types.ObjectId(actor.id) };
  if (query.from) filter.date = { ...(filter.date ?? {}), $gte: query.from };
  if (query.to) filter.date = { ...(filter.date ?? {}), $lte: query.to };
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(PLAN_LIMITS.MAX_TASKS_PER_DAY * 8, Math.max(1, Number(query.limit) || 200));
  const [items, total, groups] = await Promise.all([
    PlanTask.find(filter).sort({ date: 1, order: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    PlanTask.countDocuments(filter),
    PlanTask.find({ plan: plan._id, user: new Types.ObjectId(actor.id) }).select('date status estimatedMinutes').lean(),
  ]);
  const byDate = {};
  for (const task of groups) {
    const row = byDate[task.date] ?? { date: task.date, minutes: 0, done: 0, total: 0 };
    row.minutes += Number(task.estimatedMinutes) || 0;
    row.total += 1;
    if (task.status === ST.DONE) row.done += 1;
    byDate[task.date] = row;
  }
  return {
    items: items.map((doc) => PlanTask.toPublic(doc)),
    calendar: Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)),
    pagination: buildPagination(page, limit, total, PLAN_LIMITS.MAX_TASKS_PER_DAY * 8),
  };
}

const ALLOWED_TRANSITIONS = Object.freeze({
  [ST.PENDING]: [ST.IN_PROGRESS, ST.DONE, ST.SKIPPED, ST.MISSED],
  [ST.IN_PROGRESS]: [ST.PENDING, ST.DONE, ST.SKIPPED, ST.MISSED],
  [ST.DONE]: [ST.IN_PROGRESS, ST.PENDING],
  [ST.SKIPPED]: [ST.PENDING],
  [ST.MISSED]: [ST.PENDING, ST.DONE],
});

export async function updateTaskStatus(id, taskId, payload, actor) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  if (!Types.ObjectId.isValid(taskId)) throw ApiError.badRequest('Invalid task id');
  const task = await PlanTask.findOne({ _id: taskId, plan: plan._id, user: new Types.ObjectId(actor.id) });
  if (!task) throw ApiError.notFound('Task not found');
  if (!(ALLOWED_TRANSITIONS[task.status] ?? []).includes(payload.status)) {
    throw ApiError.conflict(`Cannot move a ${task.status} task to ${payload.status}`);
  }
  task.status = payload.status;
  if (payload.note !== undefined) task.note = payload.note;
  task.completedAt = payload.status === ST.DONE ? new Date() : null;
  await task.save();
  const stats = await refreshStats(plan._id);
  await syncUserStreak(actor, plan).catch(() => {});
  return { task: PlanTask.toPublic(task), progress: stats };
}

/** Keep the Phase-1 profile streak field in sync for the top bar. */
async function syncUserStreak(actor, plan) {
  const completed = await PlanTask.find({ user: new Types.ObjectId(actor.id), status: ST.DONE }).select('date').lean();
  const streak = computeStreak([...new Set(completed.map((task) => task.date))], dateKey(new Date()), plan.restDays);
  await User.updateOne({ _id: new Types.ObjectId(actor.id) }, {
    $set: {
      'streak.current': streak.current,
      'streak.longest': streak.longest,
      'streak.lastActiveDate': streak.lastActiveDate ? new Date(`${streak.lastActiveDate}T00:00:00.000Z`) : null,
    },
  });
  return streak;
}

export async function reorderTasks(id, payload, actor) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  const tasks = await PlanTask.find({ plan: plan._id, user: new Types.ObjectId(actor.id), date: payload.date }).select('_id').lean();
  const owned = new Set(tasks.map((task) => String(task._id)));
  if (payload.taskIds.some((value) => !owned.has(String(value)))) throw ApiError.unprocessable('Every task must belong to this plan and date');
  if (payload.taskIds.length !== tasks.length) throw ApiError.unprocessable('Send every task id for this date in the new order');
  await PlanTask.bulkWrite(payload.taskIds.map((taskId, index) => ({
    updateOne: { filter: { _id: new Types.ObjectId(taskId), plan: plan._id }, update: { $set: { order: index } } },
  })));
  const items = await PlanTask.find({ plan: plan._id, date: payload.date }).sort({ order: 1 }).lean();
  return { items: items.map((doc) => PlanTask.toPublic(doc)) };
}

/** Explicit, learner-triggered redistribution of missed tasks. */
export async function rescheduleMissed(id, payload, actor, { now = todayKey() } = {}) {
  const plan = await findPlan(id);
  assertOwner(plan, actor);
  await markMissedTasks(plan, actor, now);
  const filter = {
    plan: plan._id, user: new Types.ObjectId(actor.id), status: ST.MISSED,
  };
  if (payload.taskIds?.length) filter._id = { $in: payload.taskIds.map((value) => new Types.ObjectId(value)) };
  const missed = await PlanTask.find(filter).sort({ date: 1, order: 1 }).lean();
  if (!missed.length) return { moved: 0, warnings: [], progress: computeProgress([]) };
  if (missed.length > PLAN_LIMITS.MAX_RESCHEDULE) throw ApiError.unprocessable('Too many missed tasks to reschedule at once');

  const existing = await PlanTask.find({
    plan: plan._id, date: { $gte: now }, status: { $nin: [ST.SKIPPED] },
  }).select('date estimatedMinutes').lean();
  // Extend the plan when there is no room before its end date.
  const end = now > plan.endDate ? addDays(now, 14) : plan.endDate;
  const result = reschedule(missed, existing, {
    today: now, end, dailyMinutes: plan.dailyMinutes, restDays: plan.restDays,
  });
  const byKey = new Map(result.moves.map((move) => [move.taskKey, move]));
  for (const move of result.moves) {
    await PlanTask.updateOne({ plan: plan._id, taskKey: move.taskKey }, {
      $set: {
        date: move.date, status: ST.PENDING, source: move.source,
        rescheduledFrom: move.rescheduledFrom,
        rescheduleCount: move.rescheduleCount,
        overloaded: move.overloaded,
      },
    });
  }
  // Re-anchor this task's 1/7/21 revisions to the new date.
  for (const task of missed) {
    const move = byKey.get(task.taskKey);
    if (!move) continue;
    const revisions = await PlanTask.find({ plan: plan._id, revisionOf: task.taskKey, status: { $in: [ST.PENDING, ST.MISSED] } });
    for (const revision of revisions) {
      const interval = Number(revision.revisionInterval) || 1;
      revision.date = addDays(move.date, interval);
      revision.status = ST.PENDING;
      revision.taskKey = `revision:${task.taskKey}:${interval}`;
      await revision.save();
    }
  }
  plan.warnings = toWarnings([...(plan.warnings ?? []).map((entry) => ({ code: entry.code, message: entry.message, date: entry.date, minutes: entry.minutes })), ...result.warnings]);
  plan.markModified('warnings');
  await plan.save();
  const progress = await refreshStats(plan._id);
  return { moved: result.moves.length, warnings: result.warnings, dailyLoad: result.dailyLoad, progress, plan: Plan.toPublic(plan, 'detail') };
}

/** Wizard data: only published, publicly visible content, paginated per type. */
export async function getAvailableContent(actor) {
  void actor;
  const [sheets, quizzes, mocks] = await Promise.all([
    Sheet.find({ publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public' })
      .select('title difficulty topics problems.estimatedMinutes').sort({ publishedAt: -1 }).limit(30).lean(),
    Quiz.find({ publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public' })
      .select('title difficulty topics settings.timerMinutes').sort({ publishedAt: -1 }).limit(30).lean(),
    MockTest.find({ publishedVersion: { $gt: 0 }, status: 'published', 'settings.visibility': 'public' })
      .select('title difficulty topics sections.durationMinutes').sort({ publishedAt: -1 }).limit(30).lean(),
  ]);
  const shape = (doc, extra = {}) => ({
    id: String(doc._id), title: doc.title, difficulty: doc.difficulty || 'medium',
    topics: doc.topics ?? [], ...extra,
  });
  return {
    sheets: sheets.map((doc) => shape(doc, {
      problemCount: doc.problems?.length ?? 0,
      estimatedMinutes: (doc.problems ?? []).reduce((sum, problem) => sum + (Number(problem.estimatedMinutes) || 0), 0),
    })),
    quizzes: quizzes.map((doc) => shape(doc, { minutes: Number(doc.settings?.timerMinutes) || 20 })),
    mocks: mocks.map((doc) => shape(doc, {
      minutes: (doc.sections ?? []).reduce((sum, section) => sum + (Number(section.durationMinutes) || 0), 0) || 60,
    })),
  };
}

export { findPlan, actorFrom };
```

## `server/src/modules/plans/dashboard.service.js`

```js
import mongoose from 'mongoose';
import {
  PLAN_LIMITS, PLAN_STATUSES as P, TASK_STATUSES as ST, TASK_TYPES as TT,
} from '@algonest/shared';
import { Plan } from '../../models/Plan.js';
import { PlanTask } from '../../models/PlanTask.js';
import { Attempt } from '../../models/Attempt.js';
import { MockAttempt } from '../../models/MockAttempt.js';
import { UserProgress } from '../../models/UserProgress.js';
import { Quiz } from '../../models/Quiz.js';
import { MockTest } from '../../models/MockTest.js';
import { Sheet } from '../../models/Sheet.js';
import { aggregateWeakTopics, addDays, computeProgress, computeStreak, dateKey, dailyLoad } from './planEngine.js';
import { markMissedTasks } from './plan.service.js';

const { Types } = mongoose;

/**
 * "What should I do now?" — one aggregated read for the student dashboard.
 * Every query is scoped by `user`, so no cross-learner data can leak.
 */
export async function getDashboard(actor, query = {}) {
  const today = query.date ?? dateKey(new Date());
  const horizon = Math.max(1, Math.min(90, Number(query.horizon) || 30));
  const lastDay = addDays(today, horizon);
  const userId = new Types.ObjectId(actor.id);

  const plan = await Plan.findOne({ user: userId, status: P.ACTIVE });
  const restDays = plan?.restDays ?? [];
  if (plan) await markMissedTasks(plan, actor, today);
  const freshPlan = plan ? await Plan.findById(plan._id) : null;

  const taskFilter = plan ? { plan: plan._id, user: userId } : { user: userId, date: { $gte: today, $lte: lastDay } };
  const [
    todayTasks, upcomingRaw, revisionRaw, allTasks, completedDates,
    quizAttempts, mockAttempts, liveAttempts, progressRows,
  ] = await Promise.all([
    PlanTask.find({ ...taskFilter, date: today }).sort({ order: 1 }).limit(PLAN_LIMITS.DASHBOARD_TODAY_LIMIT + 1).lean(),
    PlanTask.find({
      ...taskFilter, type: TT.MOCK, date: { $gte: today, $lte: lastDay },
      status: { $nin: [ST.DONE, ST.SKIPPED] },
    }).sort({ date: 1 }).limit(5).lean(),
    PlanTask.find({
      ...taskFilter, type: TT.REVISION, date: { $gte: today, $lte: lastDay },
      status: { $nin: [ST.DONE, ST.SKIPPED] },
    }).sort({ date: 1 }).limit(10).lean(),
    plan ? PlanTask.find({ plan: plan._id, user: userId }).select('status estimatedMinutes date overloaded').lean() : [],
    PlanTask.find({ user: userId, status: ST.DONE, completedAt: { $ne: null } }).select('date').lean(),
    Attempt.find({ user: userId, status: { $in: ['submitted', 'timed_out'] } })
      .select('topicStats percentage submittedAt quiz').sort({ submittedAt: -1 }).limit(20).lean(),
    MockAttempt.find({ user: userId, status: { $in: ['submitted', 'timed_out'] } })
      .select('topicStats percentage submittedAt mock').sort({ submittedAt: -1 }).limit(20).lean(),
    Promise.all([
      Attempt.findOne({ user: userId, status: 'in_progress' }).select('_id quiz quizVersion startedAt expiresAt').sort({ createdAt: -1 }).lean(),
      MockAttempt.findOne({ user: userId, status: 'in_progress' }).select('_id mock mockVersion startedAt expiresAt title').sort({ createdAt: -1 }).lean(),
    ]),
    UserProgress.find({ user: userId, status: { $in: ['in_progress', 'revisit'] } })
      .select('sheet problemId problemTitle topic updatedAt').sort({ updatedAt: -1 }).limit(5).lean(),
  ]);

  const progress = computeProgress(allTasks);
  const streak = computeStreak([...new Set(completedDates.map((row) => row.date).filter(Boolean))], today, restDays);
  const weakTopics = aggregateWeakTopics(
    quizAttempts.flatMap((attempt) => attempt.topicStats ?? []),
    mockAttempts.flatMap((attempt) => attempt.topicStats ?? []),
  );

  const enrichedRevisions = await enrichTasks(revisionRaw);
  const enrichedUpcoming = await enrichTasks(upcomingRaw);
  const continueWith = await buildContinueCard(liveAttempts, todayTasks, progressRows);
  const recent = [...quizAttempts, ...mockAttempts]
    .map((attempt) => ({
      kind: attempt.mock ? 'mock' : 'quiz',
      percentage: attempt.percentage ?? 0,
      at: attempt.submittedAt ?? null,
      id: String(attempt._id),
    }))
    .sort((a, b) => new Date(b.at ?? 0) - new Date(a.at ?? 0))
    .slice(0, 5);

  const overloadWarnings = (freshPlan?.warnings ?? [])
    .filter((warning) => ['DAILY_OVERLOAD', 'SINGLE_TASK_TOO_LONG', 'OVERFLOW_PAST_END', 'RESCHEDULE_OVERLOAD'].includes(warning.code))
    .slice(0, 8);
  const todayMinutes = todayTasks.reduce((sum, task) => sum + (Number(task.estimatedMinutes) || 0), 0);
  const capacity = freshPlan?.dailyMinutes ?? 0;
  const overload = {
    todayMinutes, capacity,
    ratio: capacity ? Math.round((todayMinutes / capacity) * 100) : 0,
    isOverloaded: Boolean(capacity && todayMinutes > capacity),
    warnings: overloadWarnings,
  };

  return {
    date: today,
    plan: freshPlan ? Plan.toPublic(freshPlan, 'detail') : null,
    greeting: null, // the client composes a localised greeting from auth state
    today: {
      tasks: todayTasks.slice(0, PLAN_LIMITS.DASHBOARD_TODAY_LIMIT).map((doc) => PlanTask.toPublic(doc)),
      total: todayTasks.length,
      minutes: todayMinutes,
      done: todayTasks.filter((task) => task.status === ST.DONE).length,
      missed: todayTasks.filter((task) => task.status === ST.MISSED).length,
    },
    streak,
    progress,
    dailyLoad: plan ? dailyLoad(allTasks, freshPlan.dailyMinutes).slice(-14) : [],
    weakTopics,
    upcomingMock: enrichedUpcoming[0] ?? null,
    upcomingMocks: enrichedUpcoming,
    pendingRevisions: enrichedRevisions,
    pendingRevisionCount: revisionRaw.length,
    missedCount: allTasks.filter((task) => task.status === ST.MISSED).length,
    continueWith,
    overload,
    recentActivity: recent,
    nextRestDay: findNextRestDay(today, restDays),
  };
}

function findNextRestDay(today, restDays) {
  if (!restDays.length) return null;
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = addDays(today, offset);
    const weekday = new Date(`${candidate}T00:00:00.000Z`).getUTCDay();
    if (restDays.includes(weekday)) return candidate;
  }
  return null;
}

/** Add live titles/URLs for task cards without ever trusting a task's own URL alone. */
async function enrichTasks(tasks) {
  if (!tasks.length) return [];
  const quizIds = [...new Set(tasks.filter((task) => task.refType === 'Quiz').map((task) => task.refId))]
    .filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
  const mockIds = [...new Set(tasks.filter((task) => task.refType === 'MockTest').map((task) => task.refId))]
    .filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
  const [quizzes, mocks] = await Promise.all([
    quizIds.length ? Quiz.find({ _id: { $in: quizIds } }).select('title status').lean() : [],
    mockIds.length ? MockTest.find({ _id: { $in: mockIds } }).select('title status').lean() : [],
  ]);
  const quizMap = new Map(quizzes.map((quiz) => [String(quiz._id), quiz]));
  const mockMap = new Map(mocks.map((mock) => [String(mock._id), mock]));
  return tasks.map((task) => {
    const view = PlanTask.toPublic(task);
    const live = task.refType === 'Quiz' ? quizMap.get(task.refId) : task.refType === 'MockTest' ? mockMap.get(task.refId) : null;
    if (live) { view.title = live.title || view.title; view.available = live.status !== 'archived'; }
    else view.available = true;
    return view;
  });
}

async function buildContinueCard(liveAttempts, todayTasks, progressRows) {
  const [liveQuiz, liveMock] = liveAttempts;
  if (liveQuiz) {
    return {
      kind: 'quiz_attempt', title: 'Finish the quiz you started',
      description: 'Your autosaved answers are waiting. The server clock is still running.',
      href: `/app/quizzes/${String(liveQuiz.quiz)}/attempts/${String(liveQuiz._id)}`,
      expiresAt: liveQuiz.expiresAt ?? null,
    };
  }
  if (liveMock) {
    return {
      kind: 'mock_attempt', title: liveMock.title || 'Resume your mock test',
      description: 'You can reconnect at any point; time is enforced by the server.',
      href: `/app/mocks/${String(liveMock.mock)}/attempts/${String(liveMock._id)}`,
      expiresAt: liveMock.expiresAt ?? null,
    };
  }
  const next = todayTasks.find((task) => task.status === ST.IN_PROGRESS)
    ?? todayTasks.find((task) => task.status === ST.PENDING || task.status === ST.MISSED);
  if (next) {
    const view = PlanTask.toPublic(next);
    return {
      kind: 'plan_task', title: view.title,
      description: `${view.type.replace('_', ' ')} · ${view.estimatedMinutes} min · ${view.topic}`,
      href: taskHref(view),
      taskId: view.id,
    };
  }
  if (progressRows.length) {
    const row = progressRows[0];
    const sheet = await Sheet.findById(row.sheet).select('title status').lean().catch(() => null);
    if (sheet) {
      return {
        kind: 'sheet_problem', title: row.problemTitle || 'Continue a problem',
        description: `${sheet.title} · ${row.topic}`,
        href: `/app/sheets/${String(row.sheet)}`,
      };
    }
  }
  return null;
}

export function taskHref(task) {
  if (task.refType === 'Quiz' && task.refId) return `/app/quizzes/${task.refId}`;
  if (task.refType === 'MockTest' && task.refId) return `/app/mocks/${task.refId}`;
  if (task.refType === 'Sheet' && task.sheetId) return `/app/sheets/${task.sheetId}`;
  if (task.url) return task.url;
  return '/app/plans';
}
```

---

# Server — controllers + routers + mount

## `server/src/modules/plans/plan.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './plan.service.js';

const actor = (req) => actorFrom(req);

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listPlans(req.validated.query, actor(req)), 'Plans fetched');
});

export const content = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAvailableContent(actor(req)), 'Published content fetched');
});

export const active = asyncHandler(async (req, res) => {
  sendSuccess(res, { plan: await service.getActivePlan(actor(req)) }, 'Active plan fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createPlan(req.validated.body, actor(req)), 'Plan created and tasks distributed');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getPlan(req.validated.params.id, actor(req)), 'Plan fetched');
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.updatePlan(id, req.validated.body, actor(req)), 'Plan updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updatePlan(req.validated.params.id, { status: 'archived' }, actor(req)), 'Plan archived');
});

export const regenerate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.regeneratePlan(req.validated.params.id, actor(req)), 'Plan regenerated');
});

export const reschedule = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.rescheduleMissed(req.validated.params.id, req.validated.body, actor(req)), 'Missed tasks rescheduled');
});

export const tasks = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.listTasks(id, req.validated.query, actor(req)), 'Tasks fetched');
});

export const taskStatus = asyncHandler(async (req, res) => {
  const { id, taskId } = req.validated.params;
  sendSuccess(res, await service.updateTaskStatus(id, taskId, req.validated.body, actor(req)), 'Task updated');
});

export const taskOrder = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.reorderTasks(id, req.validated.body, actor(req)), 'Task order saved');
});
```

## `server/src/modules/plans/dashboard.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './dashboard.service.js';

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getDashboard(actorFrom(req), req.validated.query), 'Dashboard fetched');
});
```

## `server/src/modules/plans/plan.routes.js`

```js
import { Router } from 'express';
import {
  planCreateSchema, planListQuerySchema, planParamsSchema, planTaskParamsSchema,
  planUpdateSchema, rescheduleSchema, taskListQuerySchema, taskReorderSchema,
  taskStatusSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './plan.controller.js';

/** Mounted at /plans. Strictly per-user: no staff cross-read is exposed. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: planListQuerySchema }), controller.list);
router.post('/', validate(planCreateSchema), controller.create);
// Static paths must be registered before /:id.
router.get('/active', controller.active);
router.get('/content', controller.content);

router.get('/:id', validate({ params: planParamsSchema }), controller.get);
router.patch('/:id', validate({ params: planParamsSchema, body: planUpdateSchema }), controller.update);
router.delete('/:id', validate({ params: planParamsSchema }), controller.archive);
router.post('/:id/regenerate', validate({ params: planParamsSchema }), controller.regenerate);
router.post('/:id/reschedule', validate({ params: planParamsSchema, body: rescheduleSchema }), controller.reschedule);

router.get('/:id/tasks', validate({ params: planParamsSchema, query: taskListQuerySchema }), controller.tasks);
router.put('/:id/tasks/order', validate({ params: planParamsSchema, body: taskReorderSchema }), controller.taskOrder);
router.patch('/:id/tasks/:taskId', validate({ params: planTaskParamsSchema, body: taskStatusSchema }), controller.taskStatus);

export default router;
```

## `server/src/modules/plans/dashboard.routes.js`

```js
import { Router } from 'express';
import { dashboardQuerySchema } from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './dashboard.controller.js';

/** Mounted at /dashboard — one aggregated, strictly per-user read. */
const router = Router();
router.use(authenticate, requireOnboarded);
router.get('/', validate({ query: dashboardQuerySchema }), controller.get);

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
import planRoutes from '../modules/plans/plan.routes.js';
import dashboardRoutes from '../modules/plans/dashboard.routes.js';

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

// Phase 5 — Adaptive plans + student dashboard. Both routers enforce
// authenticate + requireOnboarded and scope every query by the token's user id.
router.use('/plans', requireDatabase, planRoutes);
router.use('/dashboard', requireDatabase, dashboardRoutes);

export default router;
```

---

# Server — tests (new)

## `server/tests/plans.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MOCK_INTERVAL_DAYS, REVISION_INTERVALS, TASK_STATUSES as ST, TASK_TYPES as TT,
  dashboardQuerySchema, dateKeySchema, planCreateSchema, planUpdateSchema,
  rescheduleSchema, taskListQuerySchema, taskStatusSchema,
} from '@algonest/shared';

const {
  addDays, aggregateWeakTopics, buildMockPool, buildUnits, computeProgress,
  computeStreak, dailyLoad, dateKey, diffDays, distribute, extendDates,
  isRestDay, isValidDateKey, nextWorkingDate, reschedule, weekdayOf, workingDates,
} = await import('../src/modules/plans/planEngine.js');

const START = '2026-11-02'; // Monday
const END = '2026-12-01';
const REST = [0]; // Sundays off

const problem = (id, minutes = 25, topic = 'Arrays') => ({
  id, title: `Problem ${id}`, topic, minutes, type: TT.PROBLEM,
  refId: id, refType: 'Sheet', url: `https://example.com/${id}`, sheetId: 'sheet1',
});
const mockPool = () => buildMockPool([
  { id: 'm1', title: 'Mock A', topics: ['Mixed'], totalDurationMinutes: 60 },
  { id: 'm2', title: 'Mock B', topics: ['Mixed'], totalDurationMinutes: 60 },
]);

describe('Phase-5 Zod contracts', () => {
  it('accepts a valid plan and applies defaults', () => {
    const parsed = planCreateSchema.parse({
      title: '  60-day interview prep  ', goal: 'interview_60_days',
      startDate: START, endDate: END, dailyMinutes: 90, restDays: [0],
      sheetIds: ['507f1f77bcf86cd799439011'],
    });
    assert.equal(parsed.title, '60-day interview prep');
    assert.deepEqual(parsed.quizIds, []);
    assert.equal(parsed.revisionEnabled, true);
    assert.equal(parsed.mockIntervalDays, MOCK_INTERVAL_DAYS);
    assert.equal(parsed.replaceActive, true);
  });

  it('rejects invalid dates, backwards ranges, all-rest weeks and empty selection', () => {
    const base = { title: 'Valid plan', goal: 'dsa_beginner', startDate: START, endDate: END, dailyMinutes: 60 };
    assert.equal(dateKeySchema.safeParse('2026-02-30').success, false);
    assert.equal(dateKeySchema.safeParse('2026-02-28').success, true);
    assert.equal(planCreateSchema.safeParse({ ...base, endDate: '2026-10-01', sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse({ ...base, restDays: [0, 1, 2, 3, 4, 5, 6], sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse({ ...base, restDays: [0, 0], sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse(base).success, false); // nothing selected
    assert.equal(planCreateSchema.safeParse({ ...base, hacker: 1, sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
    assert.equal(planCreateSchema.safeParse({ ...base, dailyMinutes: 5, sheetIds: ['507f1f77bcf86cd799439011'] }).success, false);
  });

  it('validates updates, task filters, status and reschedule payloads', () => {
    assert.throws(() => planUpdateSchema.parse({}));
    assert.equal(planUpdateSchema.parse({ dailyMinutes: 120 }).dailyMinutes, 120);
    assert.equal(taskListQuerySchema.safeParse({ from: '2026-11-10', to: '2026-11-01' }).success, false);
    assert.equal(taskListQuerySchema.parse({}).limit, 200);
    assert.equal(taskStatusSchema.parse({ status: ST.DONE }).status, ST.DONE);
    assert.equal(rescheduleSchema.parse({}).taskIds, undefined);
    assert.equal(dashboardQuerySchema.parse({}).horizon, 30);
  });
});

describe('date helpers', () => {
  it('uses UTC calendar-day keys with no DST drift', () => {
    assert.equal(dateKey(new Date('2026-11-02T23:59:59.000Z')), '2026-11-02');
    assert.equal(dateKey('2026-03-29T01:00:00+05:30'), '2026-03-28');
    assert.equal(isValidDateKey('2026-02-30'), false);
    assert.equal(addDays('2026-11-30', 1), '2026-12-01');
    assert.equal(diffDays(START, END), 29);
    assert.equal(weekdayOf(START), 1);
  });

  it('skips rest days when building working dates', () => {
    assert.equal(isRestDay('2026-11-08', REST), true);
    assert.equal(isRestDay('2026-11-09', REST), false);
    const dates = workingDates('2026-11-02', '2026-11-15', REST);
    assert.equal(dates.length, 12); // 14 days − 2 Sundays
    assert.ok(!dates.includes('2026-11-08'));
    assert.equal(nextWorkingDate('2026-11-08', REST), '2026-11-09');
    assert.equal(workingDates(END, START, REST).length, 0);
    assert.ok(extendDates(dates, REST, 5).length >= 17);
  });
});

describe('unit building', () => {
  it('expands published sheets into problem units and keeps quizzes whole', () => {
    const units = buildUnits({
      sheets: [{ id: 's1', problems: [
        { id: 'p2', title: 'Second', order: 1, estimatedMinutes: 30, topic: 'DP', url: 'u2' },
        { id: 'p1', title: 'First', order: 0, estimatedMinutes: 20, topic: 'Arrays', url: 'u1' },
      ] }],
      quizzes: [{ id: 'q1', title: 'Arrays quiz', topics: ['Arrays'], settings: { timerMinutes: 15 } }],
    });
    assert.equal(units.length, 3);
    assert.equal(units[0].title, 'First'); // sorted by order
    assert.equal(units[0].minutes, 20);
    assert.equal(units[2].type, TT.QUIZ);
    assert.equal(units[2].url, '/app/quizzes/q1');
  });

  it('builds a mock pool with a sane minimum duration', () => {
    const pool = buildMockPool([{ id: 'm', title: 'M', topics: ['Mixed'], totalDurationMinutes: 0 }]);
    assert.equal(pool[0].minutes, 60);
    assert.equal(pool[0].type, TT.MOCK);
  });
});

describe('distribution: daily budget, mock cadence, spaced revisions', () => {
  const options = { start: START, end: END, dailyMinutes: 60, restDays: REST, mockPool: mockPool() };

  it('never exceeds the daily budget on normal tasks', () => {
    const units = Array.from({ length: 12 }, (_, index) => problem(`p${index}`, 25));
    const result = distribute(units, options);
    const byDate = dailyLoad(result.tasks, 60);
    assert.ok(byDate.every((day) => day.minutes <= 60), JSON.stringify(byDate));
    assert.equal(result.tasks.filter((task) => task.type === TT.PROBLEM).length, 12);
  });

  it('inserts a mock every 14 calendar days, cycling the pool', () => {
    const result = distribute([problem('p1', 20)], options);
    const mocks = result.tasks.filter((task) => task.type === TT.MOCK).sort((a, b) => a.date.localeCompare(b.date));
    assert.equal(mocks.length, 3); // day 0, 14, 28
    assert.equal(mocks[0].date, START);
    assert.equal(mocks[1].date, addDays(START, 14));
    assert.equal(mocks[2].date, addDays(START, 28));
    assert.equal(mocks[0].refId, 'm1');
    assert.equal(mocks[1].refId, 'm2');
  });

  it('inserts 1/7/21-day revisions after each learn task', () => {
    const result = distribute([problem('p1', 20)], options);
    const revisions = result.tasks.filter((task) => task.type === TT.REVISION).sort((a, b) => a.revisionInterval - b.revisionInterval);
    assert.equal(revisions.length, 3);
    assert.deepEqual(revisions.map((task) => task.revisionInterval), REVISION_INTERVALS);
    assert.equal(revisions[0].date, addDays(result.tasks.find((task) => task.type === TT.PROBLEM).date, 1));
    assert.ok(revisions.every((task) => task.url.includes('p1')));
  });

  it('can disable revisions and warns when no mocks exist', () => {
    const result = distribute([problem('p1', 20)], { ...options, mockPool: [], revisionEnabled: false, autoMocks: true });
    assert.equal(result.tasks.filter((task) => task.type === TT.REVISION).length, 0);
    assert.ok(result.warnings.some((warning) => warning.code === 'NO_MOCKS_AVAILABLE'));
  });

  it('flags an oversized task and a day over budget instead of dropping work', () => {
    const result = distribute([problem('huge', 200)], { ...options, revisionEnabled: false });
    assert.ok(result.tasks.some((task) => task.type === TT.PROBLEM && task.overloaded));
    assert.ok(result.warnings.some((warning) => warning.code === 'SINGLE_TASK_TOO_LONG'));
    assert.ok(result.warnings.some((warning) => warning.code === 'DAILY_OVERLOAD'));
  });

  it('returns a clear warning when every day is a rest day', () => {
    const result = distribute([problem('p1', 20)], { start: START, end: START, dailyMinutes: 60, restDays: [1], mockPool: [] });
    assert.equal(result.tasks.length, 0);
    assert.equal(result.warnings[0].code, 'NO_WORKING_DAYS');
  });

  it('produces deterministic task keys so regeneration cannot duplicate rows', () => {
    const units = [problem('p1', 20)];
    const first = distribute(units, options);
    const second = distribute(units, options);
    assert.deepEqual(first.tasks.map((task) => task.taskKey), second.tasks.map((task) => task.taskKey));
    assert.equal(new Set(first.tasks.map((task) => task.taskKey)).size, first.tasks.length);
  });
});

describe('rescheduling + streak + progress', () => {
  it('moves missed tasks into remaining capacity', () => {
    const missed = [
      { taskKey: 'a', date: '2026-11-01', estimatedMinutes: 20, title: 'A' },
      { taskKey: 'b', date: '2026-11-01', estimatedMinutes: 20, title: 'B' },
    ];
    const result = reschedule(missed, [], { today: '2026-11-09', end: '2026-11-20', dailyMinutes: 60, restDays: REST });
    assert.equal(result.moves.length, 2);
    assert.ok(result.moves.every((move) => move.date >= '2026-11-09'));
    assert.equal(result.moves[0].status, ST.PENDING);
    assert.equal(result.moves[0].rescheduledFrom, '2026-11-01');
    assert.equal(result.moves[0].rescheduleCount, 1);
  });

  it('respects already-planned minutes and warns on overload', () => {
    const existing = Array.from({ length: 3 }, () => ({ date: '2026-11-09', estimatedMinutes: 25 }));
    const result = reschedule([{ taskKey: 'a', date: '2026-11-01', estimatedMinutes: 30 }], existing,
      { today: '2026-11-09', end: '2026-11-20', dailyMinutes: 60, restDays: REST });
    assert.notEqual(result.moves[0].date, '2026-11-09');
  });

  it('counts a streak across rest days without breaking it', () => {
    // Fri, Sat, (Sun rest), Mon — four completions, sun is transparent.
    const streak = computeStreak(['2026-11-06', '2026-11-07', '2026-11-09'], '2026-11-09', REST);
    assert.equal(streak.current, 3);
    assert.equal(streak.longest, 3);
    assert.equal(computeStreak([], '2026-11-09', REST).current, 0);
    // A missed working day ends the run.
    assert.equal(computeStreak(['2026-11-01', '2026-11-02', '2026-11-09'], '2026-11-09', REST).current, 1);
  });

  it('computes progress excluding skipped tasks from the denominator', () => {
    const tasks = [
      { status: ST.DONE, estimatedMinutes: 20 }, { status: ST.DONE, estimatedMinutes: 10 },
      { status: ST.PENDING, estimatedMinutes: 10 }, { status: ST.SKIPPED, estimatedMinutes: 5 },
      { status: ST.MISSED, estimatedMinutes: 5 },
    ];
    const progress = computeProgress(tasks);
    assert.equal(progress.total, 5);
    assert.equal(progress.done, 2);
    assert.equal(progress.missed, 1);
    assert.equal(progress.completionPercentage, 50); // 2 of 4 countable
    assert.equal(progress.minutesDone, 30);
  });

  it('aggregates weak topics from quiz and mock stats', () => {
    const weak = aggregateWeakTopics(
      [{ topic: 'Arrays', total: 4, correct: 3, percentage: 75, lostMarks: 0 }],
      [{ topic: 'DP', total: 5, correct: 1, percentage: 20, lostMarks: 8 }, { topic: 'Arrays', total: 2, correct: 1, percentage: 50, lostMarks: 2 }],
    );
    assert.equal(weak[0].topic, 'DP');
    assert.equal(weak[0].severity, 'high');
    assert.deepEqual(weak.find((entry) => entry.topic === 'Arrays').sources.sort(), ['mock', 'quiz']);
  });
});
```

## `server/tests/plans.service.test.js`

```js
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { PLAN_STATUSES as P, TASK_STATUSES as ST, TASK_TYPES as TT } from '@algonest/shared/constants';

const { Plan } = await import('../src/models/Plan.js');
const { PlanTask } = await import('../src/models/PlanTask.js');
const { Sheet } = await import('../src/models/Sheet.js');
const { SheetVersion } = await import('../src/models/SheetVersion.js');
const { Quiz } = await import('../src/models/Quiz.js');
const { MockTest } = await import('../src/models/MockTest.js');
const { User } = await import('../src/models/User.js');
const { Attempt } = await import('../src/models/Attempt.js');
const { MockAttempt } = await import('../src/models/MockAttempt.js');
const { UserProgress } = await import('../src/models/UserProgress.js');
const service = await import('../src/modules/plans/plan.service.js');
const dashboard = await import('../src/modules/plans/dashboard.service.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const USER_ID = oid('507f1f77bcf86cd799439001');
const OTHER_ID = oid('507f1f77bcf86cd799439002');
const PLAN_ID = oid('507f1f77bcf86cd799439010');
const TASK_ID = oid('507f1f77bcf86cd799439020');
const SHEET_ID = oid('507f1f77bcf86cd799439030');
const QUIZ_ID = oid('507f1f77bcf86cd799439040');
const MOCK_ID = oid('507f1f77bcf86cd799439050');

const actor = { id: String(USER_ID), role: 'student', permissions: [] };
const stranger = { id: String(OTHER_ID), role: 'student', permissions: [] };
const TODAY = '2026-11-09';
const START = '2026-11-09';
const END = '2026-12-08';

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

function makePlan(overrides = {}) {
  return new Plan({
    _id: PLAN_ID, user: USER_ID, title: 'Interview sprint', goal: 'interview_60_days',
    startDate: START, endDate: END, dailyMinutes: 60, restDays: [0],
    sheetIds: [SHEET_ID], quizIds: [QUIZ_ID], mockIds: [MOCK_ID],
    revisionEnabled: true, mockIntervalDays: 14, status: P.ACTIVE,
    warnings: [], notes: '',
    ...overrides,
  });
}

const content = {
  sheets: [{ _id: SHEET_ID, title: 'Sheet 1', topics: ['Arrays'], publishedVersion: 1, status: 'published', 'settings.visibility': 'public' }],
  quizzes: [{ _id: QUIZ_ID, title: 'Quiz 1', topics: ['Arrays'], settings: { timerMinutes: 20 } }],
  mocks: [{ _id: MOCK_ID, title: 'Mock 1', topics: ['Mixed'], sections: [{ durationMinutes: 20 }, { durationMinutes: 20 }] }],
  versions: [{ sheet: SHEET_ID, version: 1, title: 'Sheet 1', problems: [
    { _id: oid('507f1f77bcf86cd799439061'), title: 'Two sum', order: 0, estimatedMinutes: 25, topic: 'Arrays', url: 'https://leetcode.com/p/1' },
    { _id: oid('507f1f77bcf86cd799439062'), title: 'Valid paren', order: 1, estimatedMinutes: 30, topic: 'Stacks', url: 'https://leetcode.com/p/2' },
  ] }],
};

function stubContent(overrides = {}) {
  stub(Sheet, 'find', () => chainable(overrides.sheets ?? content.sheets));
  stub(Quiz, 'find', () => chainable(overrides.quizzes ?? content.quizzes));
  stub(MockTest, 'find', () => chainable(overrides.mocks ?? content.mocks));
  stub(SheetVersion, 'find', () => chainable(overrides.versions ?? content.versions));
}

function stubPlanCrud(plan, { insertRows = true } = {}) {
  let created = null;
  stub(Plan, 'findOne', () => chainable(null));
  // Return the freshly created document (with generated warnings) once it exists.
  stub(Plan, 'findById', () => chainable(created ?? plan));
  stub(Plan, 'updateOne', () => chainable({}));
  stub(Plan, 'deleteOne', () => chainable({}));
  stub(Plan.prototype, 'save', async function save() { return this; });
  let inserted = [];
  stub(Plan, 'create', async (payload) => {
    created = new Plan({ ...payload, _id: PLAN_ID });
    return created;
  });
  stub(PlanTask, 'insertMany', async (rows) => {
    inserted = rows;
    return insertRows ? rows : [];
  });
  stub(PlanTask, 'deleteMany', () => chainable({}));
  stub(PlanTask, 'find', () => chainable(inserted));
  stub(PlanTask, 'countDocuments', async () => 0);
  stub(User, 'updateOne', async () => ({}));
  return { getInserted: () => inserted };
}

const basePayload = () => ({
  title: 'Interview sprint', goal: 'interview_60_days',
  startDate: START, endDate: END, dailyMinutes: 60, restDays: [0],
  sheetIds: [String(SHEET_ID)], quizIds: [String(QUIZ_ID)], mockIds: [String(MOCK_ID)],
  revisionEnabled: true, mockIntervalDays: 14, replaceActive: true, notes: '',
});

describe('plan.service — creation and generation', () => {
  it('distributes tasks, mocks and 1/7/21 revisions', async () => {
    const plan = makePlan();
    const crud = stubPlanCrud(plan);
    stubContent();
    const result = await service.createPlan(basePayload(), actor, TODAY);
    const rows = crud.getInserted();
    assert.ok(rows.length > 10, 'expected a full schedule');
    assert.equal(result.plan.status, P.ACTIVE);
    assert.equal(result.generated.mockTasks, 3); // day 0, 14, 28
    assert.ok(result.generated.revisionTasks >= 9); // 3 per learn task (2 problems + 1 quiz)
    assert.ok(rows.every((row) => row.user && row.plan && row.taskKey && row.date));
    assert.ok(rows.every((row) => row.estimatedMinutes > 0));
    assert.ok(rows.some((row) => row.type === TT.REVISION && row.revisionInterval === 1));
    assert.ok(rows.some((row) => row.type === TT.REVISION && row.revisionInterval === 7));
    assert.ok(rows.some((row) => row.type === TT.REVISION && row.revisionInterval === 21));
    assert.equal(new Set(rows.map((row) => row.taskKey)).size, rows.length);
    assert.ok(rows.every((row) => !row.url.startsWith('/') || row.refType !== 'Sheet'));
  });

  it('rejects unpublished content before writing anything', async () => {
    stub(Plan, 'findOne', () => chainable(null));
    stubContent({ sheets: [] });
    await assert.rejects(
      () => service.createPlan(basePayload(), actor, TODAY),
      (error) => error.statusCode === 404 && /sheets/.test(error.message),
    );
  });

  it('keeps an existing active plan when replacement is disabled', async () => {
    const existing = makePlan();
    stub(Plan, 'findOne', () => chainable(existing));
    await assert.rejects(
      () => service.createPlan({ ...basePayload(), replaceActive: false }, actor, TODAY),
      (error) => error.statusCode === 409 && /active plan/.test(error.message),
    );
    assert.equal(existing.status, P.ACTIVE);
  });

  it('archives the previous active plan when replacement is enabled', async () => {
    const existing = makePlan();
    const plan = makePlan();
    stubPlanCrud(plan);
    stub(Plan, 'findOne', () => chainable(existing));
    stubContent();
    await service.createPlan(basePayload(), actor, TODAY);
    assert.equal(existing.status, P.ARCHIVED);
    assert.ok(existing.completedAt instanceof Date);
  });

  it('rolls back the plan and tasks when the bulk insert fails', async () => {
    const plan = makePlan();
    stubPlanCrud(plan);
    stubContent();
    let deletedPlan = false; let deletedTasks = false;
    stub(PlanTask, 'insertMany', async () => { const error = new Error('insert failed'); error.code = 1; throw error; });
    stub(PlanTask, 'deleteMany', () => { deletedTasks = true; return chainable({}); });
    stub(Plan, 'deleteOne', () => { deletedPlan = true; return chainable({}); });
    await assert.rejects(() => service.createPlan(basePayload(), actor, TODAY), /insert failed/);
    assert.equal(deletedTasks, true);
    assert.equal(deletedPlan, true);
  });

  it('raises an overload warning for an impossible daily budget', async () => {
    const plan = makePlan();
    stubPlanCrud(plan);
    stubContent({
      versions: [{ ...content.versions[0], problems: [{ _id: oid('507f1f77bcf86cd799439063'), title: 'Big', order: 0, estimatedMinutes: 400, topic: 'DP', url: 'x' }] }],
    });
    const result = await service.createPlan({ ...basePayload(), dailyMinutes: 30 }, actor, TODAY);
    assert.ok(result.generated.warnings.some((warning) => warning.code === 'SINGLE_TASK_TOO_LONG'));
    assert.ok(result.plan.warnings.some((warning) => warning.code === 'DAILY_OVERLOAD'));
  });
});

describe('plan.service — reads, ownership and missed tasks', () => {
  it('blocks another learner from reading a plan', async () => {
    stub(Plan, 'findById', () => chainable(makePlan()));
    await assert.rejects(
      () => service.getPlan(String(PLAN_ID), stranger, { now: TODAY }),
      (error) => error.statusCode === 403,
    );
  });

  it('marks stale pending tasks as missed on read', async () => {
    const plan = makePlan();
    stub(Plan, 'findById', () => chainable(plan));
    let updateFilter = null;
    stub(PlanTask, 'updateMany', (filter) => { updateFilter = filter; return chainable({ modifiedCount: 3 }); });
    stub(PlanTask, 'find', () => chainable([]));
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(Plan, 'updateOne', () => chainable({}));
    const result = await service.getPlan(String(PLAN_ID), actor, { now: TODAY });
    assert.equal(result.missedJustNow, 3);
    assert.deepEqual(updateFilter.status.$in, [ST.PENDING, ST.IN_PROGRESS]);
    assert.equal(updateFilter.date.$lt, TODAY);
  });

  it('only allows legal task status transitions', async () => {
    const plan = makePlan();
    const task = new PlanTask({
      _id: TASK_ID, user: USER_ID, plan: PLAN_ID, taskKey: 'problem:p1:2026-11-09:0',
      date: TODAY, order: 0, type: TT.PROBLEM, title: 'Two sum', estimatedMinutes: 20, status: ST.DONE,
    });
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'findOne', () => chainable(task));
    stub(PlanTask, 'find', () => chainable([]));
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(Plan.prototype, 'save', async function save() { return this; });
    stub(PlanTask.prototype, 'save', async function save() { return this; });
    stub(Plan, 'updateOne', () => chainable({}));
    stub(User, 'updateOne', async () => ({}));
    await assert.rejects(
      () => service.updateTaskStatus(String(PLAN_ID), String(TASK_ID), { status: ST.SKIPPED }, actor),
      (error) => error.statusCode === 409,
    );
    const updated = await service.updateTaskStatus(String(PLAN_ID), String(TASK_ID), { status: ST.IN_PROGRESS, note: 'Resume' }, actor);
    assert.equal(updated.task.status, ST.IN_PROGRESS);
    assert.equal(updated.task.note, 'Resume');
    assert.equal(updated.task.completedAt, null);
  });

  it('reschedules missed tasks and re-anchors their revisions', async () => {
    const plan = makePlan();
    const missed = new PlanTask({
      _id: TASK_ID, user: USER_ID, plan: PLAN_ID, taskKey: 'problem:p1:2026-11-01:0',
      date: '2026-11-01', order: 0, type: TT.PROBLEM, title: 'Two sum', estimatedMinutes: 20, status: ST.MISSED,
    });
    const revision = new PlanTask({
      _id: oid('507f1f77bcf86cd799439021'), user: USER_ID, plan: PLAN_ID,
      taskKey: 'revision:problem:p1:2026-11-01:0:7', date: '2026-11-08', order: 0,
      type: TT.REVISION, title: 'Revise: Two sum', estimatedMinutes: 10,
      status: ST.MISSED, revisionInterval: 7, revisionOf: missed.taskKey,
    });
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'updateMany', () => chainable({ modifiedCount: 0 }));
    stub(PlanTask, 'find', (filter) => {
      if (filter?.revisionOf) return chainable([revision]);
      if (filter?.status === ST.MISSED) return chainable([missed]);
      if (filter?.status === ST.DONE) return chainable([]);
      return chainable([]);
    });
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(PlanTask, 'updateOne', () => chainable({}));
    stub(PlanTask.prototype, 'save', async function save() { return this; });
    stub(Plan.prototype, 'save', async function save() { return this; });
    stub(Plan, 'updateOne', () => chainable({}));
    const result = await service.rescheduleMissed(String(PLAN_ID), {}, actor, { now: TODAY });
    assert.equal(result.moved, 1);
    assert.ok(missed.taskKey === 'problem:p1:2026-11-01:0');
    assert.ok(revision.date >= TODAY, 'revision re-anchored to the new task date');
    assert.equal(revision.status, ST.PENDING);
  });

  it('preserves completed tasks when regenerating', async () => {
    const plan = makePlan();
    const done = { _id: oid('507f1f77bcf86cd799439022'), taskKey: 'done', date: '2026-11-02', status: ST.DONE, estimatedMinutes: 20 };
    const pending = { _id: oid('507f1f77bcf86cd799439023'), taskKey: 'pending', date: '2026-11-20', status: ST.PENDING, estimatedMinutes: 20 };
    let deletedIds = [];
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'updateMany', () => chainable({ modifiedCount: 0 }));
    stub(PlanTask, 'find', (filter) => {
      if (filter?.status?.$in?.includes(ST.MISSED)) return chainable([pending]);
      return chainable([done, pending]);
    });
    stub(PlanTask, 'deleteMany', (filter) => { deletedIds = filter._id.$in.map(String); return chainable({}); });
    stub(PlanTask, 'insertMany', async (rows) => rows);
    stub(PlanTask, 'countDocuments', async () => 0);
    stub(Plan.prototype, 'save', async function save() { return this; });
    stub(Plan, 'updateOne', () => chainable({}));
    stubContent();
    const result = await service.regeneratePlan(String(PLAN_ID), actor, { now: TODAY });
    assert.deepEqual(deletedIds, [String(pending._id)]);
    assert.ok(result.generated.tasks > 0);
  });
});

describe('dashboard.service — aggregated student view', () => {
  it('assembles today, streak, weak topics, mock, revisions and continue card', async () => {
    const plan = makePlan();
    const taskRow = (overrides = {}) => ({
      _id: oid(), user: USER_ID, plan: PLAN_ID, taskKey: `k-${Math.random()}`,
      date: TODAY, order: 0, type: TT.PROBLEM, title: 'Two sum', topic: 'Arrays',
      refType: 'Sheet', refId: 'p1', sheetId: String(SHEET_ID), url: 'https://leetcode.com/p/1',
      estimatedMinutes: 25, status: ST.PENDING, source: 'generated',
      ...overrides,
    });
    stub(Plan, 'findOne', () => chainable(plan));
    stub(Plan, 'findById', () => chainable(plan));
    stub(PlanTask, 'updateMany', () => chainable({ modifiedCount: 0 }));
    stub(PlanTask, 'find', (filter = {}) => {
      if (filter.type === TT.MOCK) return chainable([taskRow({ type: TT.MOCK, refType: 'MockTest', refId: String(MOCK_ID), title: 'Full mock', date: '2026-11-16' })]);
      if (filter.type === TT.REVISION) return chainable([taskRow({ type: TT.REVISION, date: '2026-11-10', revisionInterval: 1 })]);
      if (filter.status === ST.DONE) return chainable([{ date: '2026-11-07' }, { date: '2026-11-06' }, { date: TODAY }]);
      if (filter.date === TODAY) return chainable([taskRow({ status: ST.DONE }), taskRow(), taskRow({ status: ST.MISSED })]);
      return chainable([taskRow(), taskRow({ status: ST.DONE, date: '2026-11-07' })]);
    });
    stub(Attempt, 'find', () => chainable([{ _id: oid(), quiz: QUIZ_ID, percentage: 80, submittedAt: new Date(), topicStats: [{ topic: 'Arrays', total: 5, correct: 4, percentage: 80 }] }]));
    stub(MockAttempt, 'find', () => chainable([{ _id: oid(), mock: MOCK_ID, percentage: 40, submittedAt: new Date(), topicStats: [{ topic: 'DP', total: 5, correct: 1, percentage: 20, lostMarks: 8 }] }]));
    stub(Attempt, 'findOne', () => chainable(null));
    stub(MockAttempt, 'findOne', () => chainable(null));
    stub(UserProgress, 'find', () => chainable([]));
    stub(Quiz, 'find', () => chainable([]));
    stub(MockTest, 'find', () => chainable([{ _id: MOCK_ID, title: 'Full mock', status: 'published' }]));
    stub(Sheet, 'findById', () => chainable({ _id: SHEET_ID, title: 'Sheet 1' }));

    const view = await dashboard.getDashboard(actor, { date: TODAY, horizon: 30 });
    assert.equal(view.date, TODAY);
    assert.equal(view.plan.id, String(PLAN_ID));
    assert.equal(view.today.tasks.length, 3);
    assert.equal(view.today.done, 1);
    assert.equal(view.today.missed, 1);
    assert.ok(view.streak.current >= 1);
    assert.equal(view.weakTopics[0].topic, 'DP');
    assert.equal(view.upcomingMock.title, 'Full mock');
    assert.equal(view.pendingRevisions.length, 1);
    assert.equal(view.continueWith.kind, 'plan_task');
    assert.equal(view.overload.capacity, 60);
    assert.equal(view.recentActivity.length, 2);
    assert.equal(view.nextRestDay, '2026-11-15');
  });

  it('prefers a live attempt for the continue card', async () => {
    stub(Plan, 'findOne', () => chainable(null));
    stub(PlanTask, 'find', () => chainable([]));
    stub(Attempt, 'find', () => chainable([]));
    stub(MockAttempt, 'find', () => chainable([]));
    stub(Attempt, 'findOne', () => chainable(null));
    stub(MockAttempt, 'findOne', () => chainable({
      _id: oid('507f1f77bcf86cd799439070'), mock: MOCK_ID, title: 'Resume me',
      expiresAt: new Date(Date.now() + 600_000),
    }));
    stub(UserProgress, 'find', () => chainable([]));
    stub(Quiz, 'find', () => chainable([]));
    stub(MockTest, 'find', () => chainable([]));
    const view = await dashboard.getDashboard(actor, { date: TODAY });
    assert.equal(view.plan, null);
    assert.equal(view.continueWith.kind, 'mock_attempt');
    assert.ok(view.continueWith.href.includes('/attempts/'));
  });
});
```

## `server/tests/plans.routes.test.js`

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
const PLAN = '/plans/507f1f77bcf86cd799439010';
const TASK = `${PLAN}/tasks/507f1f77bcf86cd799439020`;

describe('Phase-5 route protection', () => {
  it('rejects anonymous access to every plan route', async () => {
    const endpoints = [
      ['get', '/plans'], ['post', '/plans'], ['get', '/plans/active'], ['get', '/plans/content'],
      ['get', PLAN], ['patch', PLAN], ['delete', PLAN],
      ['post', `${PLAN}/regenerate`], ['post', `${PLAN}/reschedule`],
      ['get', `${PLAN}/tasks`], ['put', `${PLAN}/tasks/order`], ['patch', TASK],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to the dashboard and never leaks user data', async () => {
    const res = await request.get(`${base}/dashboard?date=2026-11-09`);
    assert.equal(res.status, 401);
    assert.equal(res.body.data, null);
    assert.equal(res.body.errors, null);
  });

  it('never returns validation details before authentication', async () => {
    const create = await request.post(`${base}/plans`).send({ title: 'x', bogus: true });
    assert.equal(create.status, 401);
    assert.equal(create.body.errors, null);
    const status = await request.patch(`${base}${TASK}`).send({ status: 'invalid' });
    assert.equal(status.status, 401);
    const dashboard = await request.get(`${base}/dashboard?date=not-a-date`);
    assert.equal(dashboard.status, 401);
    assert.equal(dashboard.body.errors, null);
  });

  it('keeps the health probe public and earlier phases protected', async () => {
    assert.equal((await request.get(`${base}/health`)).status, 200);
    assert.equal((await request.get(`${base}/mocks`)).status, 401);
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
  // Phase 5 — Adaptive plans + student dashboard.
  plans: {
    all: ['plans'],
    list: (params) => ['plans', 'list', params],
    active: () => ['plans', 'active'],
    content: () => ['plans', 'content'],
    detail: (id) => ['plans', 'detail', id],
    tasks: (id, params) => ['plans', 'tasks', id, params],
  },
  dashboard: {
    all: ['dashboard'],
    get: (params) => ['dashboard', 'overview', params],
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
  { label: 'Plans', to: '/app/plans', icon: 'CalendarRange', ready: true },
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

// Phase 5 — Adaptive plans. The wizard is a separate chunk so the dashboard
// and catalogue never download its form logic.
const PlansPage = lazy(() => import('../features/plans/pages/PlansPage.jsx'));
const PlanDetailPage = lazy(() => import('../features/plans/pages/PlanDetailPage.jsx'));
const PlanEditorPage = lazy(() => import('../features/plans/pages/PlanEditorPage.jsx'));

// Resources and Community keep their honest placeholder until their phase lands.
const UPCOMING_MODULES = ['resources', 'community'];

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

              <Route path="plans" element={<PlansPage />} />
              <Route path="plans/new" element={<PlanEditorPage />} />
              <Route path="plans/:id" element={<PlanDetailPage />} />
              <Route path="plans/:id/edit" element={<PlanEditorPage />} />

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
  ['PlansPage', '/src/features/plans/pages/PlansPage.jsx'],
  ['PlanDetailPage', '/src/features/plans/pages/PlanDetailPage.jsx'],
  ['PlanEditorPage', '/src/features/plans/pages/PlanEditorPage.jsx'],
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

# Client — plans api / hooks / lib (new)

## `client/src/features/plans/api/planApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Thin wrappers around /api/v1/plans. All rows are scoped to the token user. */
export const planApi = {
  list: (params) => api.get('/plans', { query: params }),
  active: () => api.get('/plans/active'),
  content: () => api.get('/plans/content'),
  get: (id) => api.get(`/plans/${id}`),
  create: (body) => api.post('/plans', body),
  update: (id, body) => api.patch(`/plans/${id}`, body),
  archive: (id) => api.delete(`/plans/${id}`),
  regenerate: (id) => api.post(`/plans/${id}/regenerate`, {}),
  reschedule: (id, body = {}) => api.post(`/plans/${id}/reschedule`, body),
  tasks: (id, params) => api.get(`/plans/${id}/tasks`, { query: params }),
  taskStatus: (id, taskId, body) => api.patch(`/plans/${id}/tasks/${taskId}`, body),
  taskOrder: (id, body) => api.put(`/plans/${id}/tasks/order`, body),
};

export default planApi;
```

## `client/src/features/plans/hooks/usePlans.js`

```js
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import planApi from '../api/planApi.js';

function useInvalidators() {
  const qc = useQueryClient();
  return {
    all: () => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    plan: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void id;
    },
  };
}

export function usePlanList(params = {}) {
  return useQuery({ queryKey: queryKeys.plans.list(params), queryFn: () => planApi.list(params), placeholderData: keepPreviousData });
}

export function useActivePlan() {
  return useQuery({ queryKey: queryKeys.plans.active(), queryFn: () => planApi.active() });
}

export function usePlanContent(enabled = true) {
  return useQuery({ queryKey: queryKeys.plans.content(), queryFn: () => planApi.content(), enabled, staleTime: 5 * 60_000 });
}

export function usePlan(id) {
  return useQuery({ queryKey: queryKeys.plans.detail(id), queryFn: () => planApi.get(id), enabled: Boolean(id) });
}

export function usePlanTasks(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.plans.tasks(id, params),
    queryFn: () => planApi.tasks(id, params),
    enabled: Boolean(id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreatePlan() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: planApi.create, onSuccess: () => invalidate.all() });
}

export function useUpdatePlan(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => planApi.update(id, body), onSuccess: () => invalidate.plan(id) });
}

export function useArchivePlan() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: planApi.archive, onSuccess: () => invalidate.all() });
}

export function useRegeneratePlan(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: () => planApi.regenerate(id), onSuccess: () => invalidate.plan(id) });
}

export function useReschedulePlan(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => planApi.reschedule(id, body), onSuccess: () => invalidate.plan(id) });
}

export function useTaskStatus(planId) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ taskId, body }) => planApi.taskStatus(planId, taskId, body),
    onSuccess: () => invalidate.plan(planId),
  });
}

export function useTaskOrder(planId) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => planApi.taskOrder(planId, body),
    onSuccess: () => invalidate.plan(planId),
  });
}

export default usePlanList;
```

## `client/src/features/plans/lib/planUtils.js`

```js
import {
  GOAL_OPTIONS, PLAN_LIMITS, PLAN_STATUS_LABELS, REVISION_INTERVALS,
  TASK_SOURCE_VALUES, TASK_STATUS_LABELS, TASK_STATUS_VALUES,
  TASK_TYPE_LABELS, TASK_TYPE_VALUES, WEEKDAYS,
} from '@algonest/shared/constants';

export const GOALS = GOAL_OPTIONS;
export const TASK_TYPE_OPTIONS = TASK_TYPE_VALUES.map((value) => ({ value, label: TASK_TYPE_LABELS[value] }));
export const TASK_STATUS_OPTIONS = TASK_STATUS_VALUES.map((value) => ({ value, label: TASK_STATUS_LABELS[value] }));
export const WEEKDAY_OPTIONS = WEEKDAYS.map((day) => ({ value: day.value, label: day.label, long: day.long }));

export const STATUS_TONE = {
  active: 'success', paused: 'warning', completed: 'accent', archived: 'neutral',
};
export const TASK_TONE = {
  pending: 'neutral', in_progress: 'warning', done: 'success', skipped: 'neutral', missed: 'danger',
};
export const TYPE_TONE = {
  problem: 'primary', quiz: 'accent', mock: 'warning', revision: 'success',
};
export const SEVERITY_TONE = { high: 'danger', medium: 'warning', low: 'accent' };

export const planStatusLabel = (value) => PLAN_STATUS_LABELS[value] ?? value;
export const taskStatusLabel = (value) => TASK_STATUS_LABELS[value] ?? value;
export const taskTypeLabel = (value) => TASK_TYPE_LABELS[value] ?? value;

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

/* ── UTC date keys, mirroring the server engine exactly ── */

export function dateKey(value = new Date()) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

export function addDays(key, days) {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function diffDays(from, to) {
  const a = new Date(`${from}T00:00:00.000Z`).getTime();
  const b = new Date(`${to}T00:00:00.000Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function weekdayOf(key) {
  return new Date(`${key}T00:00:00.000Z`).getUTCDay();
}

export function formatDate(key, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  if (!key) return '—';
  const date = new Date(`${key}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { ...options, timeZone: 'UTC' }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function formatMinutes(minutes = 0) {
  const value = Math.max(0, Math.round(Number(minutes) || 0));
  if (value < 60) return `${value} min`;
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}

export function relativeDay(key, today = dateKey()) {
  const delta = diffDays(today, key);
  if (delta === 0) return 'Today';
  if (delta === 1) return 'Tomorrow';
  if (delta === -1) return 'Yesterday';
  if (delta < 0) return `${-delta} days late`;
  return `in ${delta} days`;
}

export function buildCalendarWeeks(from, to, tasksByDate = {}) {
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  const gridStart = new Date(start);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
  const weeks = [];
  let cursor = new Date(gridStart);
  while (cursor <= end || cursor.getUTCDay() !== 0) {
    const week = [];
    for (let index = 0; index < 7; index += 1) {
      const key = cursor.toISOString().slice(0, 10);
      week.push({ key, inRange: cursor >= start && cursor <= end, day: tasksByDate[key] ?? null });
      cursor = new Date(cursor.getTime() + 86_400_000);
    }
    weeks.push(week);
    if (weeks.length > 8) break;
  }
  return weeks;
}

export function warningTone(code) {
  if (code === 'DAILY_OVERLOAD' || code === 'RESCHEDULE_OVERLOAD') return 'warning';
  if (code === 'NO_WORKING_DAYS' || code === 'TASK_UNSCHEDULED') return 'danger';
  return 'info';
}

export function warningLabel(code) {
  const labels = {
    DAILY_OVERLOAD: 'Day over capacity',
    SINGLE_TASK_TOO_LONG: 'Task longer than a day',
    OVERFLOW_PAST_END: 'Plan overruns the end date',
    NO_WORKING_DAYS: 'No working days',
    NO_MOCKS_AVAILABLE: 'No mocks available',
    TASK_UNSCHEDULED: 'Task could not fit',
    RESCHEDULE_OVERLOAD: 'Rescheduling caused overload',
    REVISION_SKIPPED: 'Revision fell outside the plan',
  };
  return labels[code] ?? code;
}

export function taskHref(task) {
  if (!task) return '/app/plans';
  if (task.refType === 'Quiz' && task.refId) return `/app/quizzes/${task.refId}`;
  if (task.refType === 'MockTest' && task.refId) return `/app/mocks/${task.refId}`;
  if (task.refType === 'Sheet' && task.sheetId) return `/app/sheets/${task.sheetId}`;
  if (task.url && /^https?:\/\//i.test(task.url)) return task.url;
  return '/app/plans';
}

export function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

export const REVISION_OPTIONS = REVISION_INTERVALS.map((value) => ({ value, label: `+${value} day${value === 1 ? '' : 's'}` }));
export const SOURCE_OPTIONS = TASK_SOURCE_VALUES.map((value) => ({ value, label: value }));
export const DEFAULT_PLAN_DRAFT = (start) => ({
  title: '', goal: '', startDate: start, endDate: addDays(start, 59),
  dailyMinutes: 90, restDays: [0], sheetIds: [], quizIds: [], mockIds: [],
  revisionEnabled: true, mockIntervalDays: 14, replaceActive: true, notes: '',
});

export function estimatedDays(payload) {
  return Math.max(0, diffDays(payload.startDate, payload.endDate) + 1);
}

export function planCapacityLabel(payload, content) {
  const minutes = [
    ...(content?.sheets ?? []).filter((item) => payload.sheetIds.includes(item.id)),
    ...(content?.quizzes ?? []).filter((item) => payload.quizIds.includes(item.id)),
  ].reduce((sum, item) => sum + (item.estimatedMinutes ?? item.minutes ?? 0), 0);
  const days = estimatedDays(payload);
  const working = Math.max(1, days - Math.floor(days / 7) * payload.restDays.length);
  return { minutes, workingDays: working, minutesPerDay: Math.round(minutes / working) };
}

export { PLAN_LIMITS };
```

---

# Client — plans components (new)

## `client/src/features/plans/components/GoalPicker.jsx`

```jsx
import { Check } from 'lucide-react';
import { GOALS } from '../lib/planUtils.js';

/** Radio group with real inputs (keyboard + screen-reader friendly). */
export default function GoalPicker({ value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? 'plan-goal-error' : undefined}>
      <legend className="mb-2 text-sm font-medium text-ink">What are you preparing for?</legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((goal) => (
          <label
            key={goal.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${value === goal.value ? 'border-primary bg-primary/10' : 'border-line bg-surface hover:border-primary/40'}`}
          >
            <input
              type="radio" name="plan-goal" value={goal.value} checked={value === goal.value}
              onChange={() => onChange(goal.value)} className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">{goal.label}{value === goal.value ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{goal.description}</span>
            </span>
          </label>
        ))}
      </div>
      {error ? <p id="plan-goal-error" role="alert" className="mt-2 text-xs text-danger">{error}</p> : null}
    </fieldset>
  );
}
```

## `client/src/features/plans/components/RestDayPicker.jsx`

```jsx
import { WEEKDAY_OPTIONS } from '../lib/planUtils.js';

/** Toggle weekday rest days. At least one working day must remain. */
export default function RestDayPicker({ value = [], onChange, error }) {
  const toggle = (day) => {
    if (value.includes(day)) onChange(value.filter((item) => item !== day));
    else if (value.length < 6) onChange([...value, day].sort((a, b) => a - b));
  };
  return (
    <fieldset aria-describedby={error ? 'rest-day-error' : undefined}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <legend className="text-sm font-medium text-ink">Rest days</legend>
        <span className="text-xs text-muted">{value.length ? WEEKDAY_OPTIONS.filter((day) => value.includes(day.value)).map((day) => day.label).join(', ') : 'No days off'}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {WEEKDAY_OPTIONS.map((day) => {
          const active = value.includes(day.value);
          return (
            <button
              key={day.value} type="button" onClick={() => toggle(day.value)}
              aria-pressed={active} aria-label={`${day.long} rest day`}
              disabled={!active && value.length >= 6}
              className={`min-w-12 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'border-accent bg-accent/15 text-accent' : 'border-line bg-surface text-muted hover:border-primary/40'}`}
            >{day.label}</button>
          );
        })}
      </div>
      <p className="mt-1.5 text-xs text-muted">Rest days never receive tasks and do not break your streak.</p>
      {error ? <p id="rest-day-error" role="alert" className="mt-1 text-xs text-danger">{error}</p> : null}
    </fieldset>
  );
}
```

## `client/src/features/plans/components/PlanBasicsForm.jsx`

```jsx
import Input from '../../../components/ui/Input.jsx';
import GoalPicker from './GoalPicker.jsx';
import RestDayPicker from './RestDayPicker.jsx';
import { addDays, diffDays, estimatedDays } from '../lib/planUtils.js';

/** Step 1 — goal, window, daily budget, rest days and cadence. */
export default function PlanBasicsForm({ value, onChange, errors = {} }) {
  const set = (key, input) => onChange({ ...value, [key]: input });
  const days = estimatedDays(value);
  return (
    <div className="space-y-5">
      <GoalPicker value={value.goal} onChange={(goal) => set('goal', goal)} error={errors.goal} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Plan title" required value={value.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Interview in 60 days" maxLength={120} />
        <Input label="Daily time budget (minutes)" type="number" min={15} max={720} required value={value.dailyMinutes} onChange={(event) => set('dailyMinutes', Number(event.target.value))} error={errors.dailyMinutes} hint="The scheduler will not exceed this without warning." />
        <Input label="Start date" type="date" required value={value.startDate} onChange={(event) => set('startDate', event.target.value)} error={errors.startDate} />
        <Input label="Target date" type="date" required value={value.endDate} onChange={(event) => set('endDate', event.target.value)} error={errors.endDate} />
        <Input label="Mock cadence (days)" type="number" min={7} max={60} value={value.mockIntervalDays} onChange={(event) => set('mockIntervalDays', Number(event.target.value))} hint="A full-length mock is inserted every N days." />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: '30 days', days: 30 }, { label: '60 days', days: 60 }, { label: '90 days', days: 90 },
        ].map((preset) => (
          <button key={preset.days} type="button" onClick={() => set('endDate', addDays(value.startDate, preset.days - 1))} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:border-primary/40 hover:text-primary">
            {preset.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted">{days > 0 ? `${days} calendar days` : 'Invalid window'}</span>
      </div>
      {diffDays(value.startDate, value.endDate) < 0 ? <p className="text-xs text-danger">The target date must be on or after the start date.</p> : null}

      <RestDayPicker value={value.restDays} onChange={(restDays) => set('restDays', restDays)} error={errors.restDays} />

      <div className="grid gap-2 sm:grid-cols-2">
        <label htmlFor="plan-revisions" className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span><span className="block text-sm font-medium text-ink">Spaced revision (1 / 7 / 21 days)</span><span className="mt-0.5 block text-xs text-muted">Auto-insert short revision blocks after every lesson.</span></span>
          <input id="plan-revisions" type="checkbox" checked={value.revisionEnabled} onChange={(event) => set('revisionEnabled', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        </label>
        <label htmlFor="plan-replace" className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span><span className="block text-sm font-medium text-ink">Replace my active plan</span><span className="mt-0.5 block text-xs text-muted">Archives the current plan and keeps its task history.</span></span>
          <input id="plan-replace" type="checkbox" checked={value.replaceActive} onChange={(event) => set('replaceActive', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        </label>
      </div>

      <Input label="Notes (optional)" value={value.notes} onChange={(event) => set('notes', event.target.value)} maxLength={500} placeholder="Focus on DP and graphs…" />
    </div>
  );
}
```

## `client/src/features/plans/components/PlanContentPicker.jsx`

```jsx
import { BookOpen, ListChecks, Timer } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { formatMinutes, planCapacityLabel } from '../lib/planUtils.js';

function Group({ title, Icon, items, selected, onToggle, minuteKey = 'minutes' }) {
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-primary" aria-hidden="true" /> {title} <Badge variant="primary">{selected.length} selected</Badge></h3>
      {!items.length ? <p className="rounded-xl border border-dashed border-line p-3 text-xs text-muted">No published {title.toLowerCase()} available yet.</p> : null}
      <div className="ag-scrollbar max-h-64 space-y-1.5 overflow-y-auto">
        {items.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-3 hover:border-primary/40">
            <input type="checkbox" checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                <span>{formatMinutes(item[minuteKey] ?? item.estimatedMinutes ?? 0)}</span>
                <span>·</span><span>{item.difficulty}</span>
                {item.problemCount ? <><span>·</span><span>{item.problemCount} problems</span></> : null}
                {(item.topics ?? []).slice(0, 2).map((topic) => <Badge key={topic} variant="neutral">{topic}</Badge>)}
              </span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

/** Step 2 — select published sheets / quizzes / mocks, with a capacity hint. */
export default function PlanContentPicker({ value, onChange, content, isLoading, isError, error, errors = {} }) {
  const toggle = (field, id) => {
    const current = value[field];
    onChange({ ...value, [field]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  };
  const capacity = planCapacityLabel(value, content);
  const over = capacity.minutesPerDay > value.dailyMinutes;

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>;
  if (isError) return <Alert variant="error">{(error && error.message) || 'Could not load published content.'}</Alert>;

  return (
    <div className="space-y-5">
      {errors.sheetIds ? <Alert variant="error">{errors.sheetIds}</Alert> : null}
      {errors._ ? <Alert variant="error">{errors._}</Alert> : null}
      <div className={`rounded-xl border p-4 ${over ? 'border-warning/40 bg-warning/8' : 'border-primary/25 bg-primary/8'}`}>
        <p className="text-sm font-semibold text-ink">Estimated workload: {formatMinutes(capacity.minutes)}</p>
        <p className="mt-1 text-xs text-muted">Spread across ~{capacity.workingDays} working days ≈ {formatMinutes(capacity.minutesPerDay)} per day (budget {formatMinutes(value.dailyMinutes)}). Revisions and mocks are added on top.</p>
        {over ? <p className="mt-2 text-xs font-semibold text-warning">Heads-up: this exceeds your daily budget. The plan will flag overloaded days and may overrun your target date.</p> : null}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Group title="Sheets" Icon={BookOpen} items={content?.sheets ?? []} selected={value.sheetIds} onToggle={(id) => toggle('sheetIds', id)} minuteKey="estimatedMinutes" />
        <Group title="Quizzes" Icon={ListChecks} items={content?.quizzes ?? []} selected={value.quizIds} onToggle={(id) => toggle('quizIds', id)} />
        <Group title="Mocks" Icon={Timer} items={content?.mocks ?? []} selected={value.mockIds} onToggle={(id) => toggle('mockIds', id)} />
      </div>
      <p className="text-xs text-muted">Sheets expand into their published problems. If you select no mock, the scheduler auto-fills from the published catalogue so the 14-day cadence is preserved.</p>
    </div>
  );
}
```

## `client/src/features/plans/components/PlanWizard.jsx`

```jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, WandSparkles } from 'lucide-react';
import { planCreateSchema } from '@algonest/shared';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import PlanBasicsForm from './PlanBasicsForm.jsx';
import PlanContentPicker from './PlanContentPicker.jsx';
import { useCreatePlan, usePlanContent } from '../hooks/usePlans.js';
import { DEFAULT_PLAN_DRAFT, apiFieldErrors, contractErrors, dateKey, errorMessage, formatMinutes, planCapacityLabel } from '../lib/planUtils.js';

const STEPS = [
  { id: 0, label: 'Goal & schedule' },
  { id: 1, label: 'Choose content' },
  { id: 2, label: 'Review & create' },
];

export default function PlanWizard({ onCancel, activePlan }) {
  const navigate = useNavigate();
  const create = useCreatePlan();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => DEFAULT_PLAN_DRAFT(dateKey()));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const contentQuery = usePlanContent(step === 1 || step === 2);

  const capacity = useMemo(() => planCapacityLabel(draft, contentQuery.data), [draft, contentQuery.data]);
  const summary = useMemo(() => [
    { label: 'Goal', value: (draft.goal || '—').replaceAll('_', ' ') },
    { label: 'Window', value: `${draft.startDate} → ${draft.endDate}` },
    { label: 'Daily budget', value: formatMinutes(draft.dailyMinutes) },
    { label: 'Rest days', value: draft.restDays.length ? draft.restDays.join(', ') : 'None' },
    { label: 'Selected', value: `${draft.sheetIds.length} sheets · ${draft.quizIds.length} quizzes · ${draft.mockIds.length} mocks` },
    { label: 'Estimated work', value: `${formatMinutes(capacity.minutes)} (~${formatMinutes(capacity.minutesPerDay)}/day)` },
    { label: 'Revisions', value: draft.revisionEnabled ? '1 / 7 / 21 days' : 'Off' },
    { label: 'Mock cadence', value: `every ${draft.mockIntervalDays} days` },
  ], [draft, capacity]);

  const validate = () => {
    const parsed = planCreateSchema.safeParse(draft);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setServerError(parsed.error.issues[0]?.message ?? 'Check the form.');
      return null;
    }
    setErrors({}); setServerError('');
    return parsed.data;
  };

  const next = () => {
    if (step === 0) {
      const partial = planCreateSchema.safeParse({ ...draft, sheetIds: draft.sheetIds.length ? draft.sheetIds : ['507f1f77bcf86cd799439011'] });
      if (!partial.success) {
        // Ignore the artificial selection when reporting step-1 errors.
        const filtered = contractErrors(partial.error);
        delete filtered.sheetIds; delete filtered._;
        if (Object.keys(filtered).length) { setErrors(filtered); setServerError(Object.values(filtered)[0]); return; }
      }
      setErrors({}); setServerError('');
    }
    setStep((value) => Math.min(2, value + 1));
  };

  const submit = () => {
    const payload = validate();
    if (!payload) return;
    create.mutate(payload, {
      onSuccess: (result) => navigate(`/app/plans/${result.plan.id}`, { replace: true, state: { generated: result.generated } }),
      onError: (error) => { setServerError(errorMessage(error)); setErrors(apiFieldErrors(error)); },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary"><WandSparkles className="h-3.5 w-3.5" aria-hidden="true" /> Adaptive plan builder</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Build your daily plan</h1>
        <p className="mt-1.5 text-sm text-muted">Tell us your goal and time budget. We distribute every problem, quiz and mock across your working days, insert spaced revisions and warn you before you overload.</p>
      </header>

      {activePlan ? <Alert variant="warning" title="You already have an active plan">Creating a new plan archives <strong>{activePlan.title}</strong>. Its task history stays available.</Alert> : null}

      <ol className="flex flex-wrap items-center gap-2" aria-label="Plan builder steps">
        {STEPS.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <button type="button" onClick={() => index < step && setStep(index)} disabled={index > step} aria-current={step === index ? 'step' : undefined}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${step === index ? 'bg-primary/12 text-primary' : index < step ? 'text-success hover:bg-success/8' : 'text-muted opacity-60'}`}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">{index < step ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}</span>
              {item.label}
            </button>
            {index < STEPS.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>

      <section className="ag-card p-5 sm:p-6">
        {step === 0 ? <PlanBasicsForm value={draft} onChange={setDraft} errors={errors} /> : null}
        {step === 1 ? <PlanContentPicker value={draft} onChange={setDraft} content={contentQuery.data} isLoading={contentQuery.isLoading} isError={contentQuery.isError} error={contentQuery.error} errors={errors} /> : null}
        {step === 2 ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm text-ink">We will generate a deterministic schedule: daily buckets within your time budget, a full-length mock every {draft.mockIntervalDays} days, and 1/7/21-day revision blocks. Missed tasks can be rescheduled with one click.</p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {summary.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5">
                  <dt className="text-xs text-muted">{row.label}</dt><dd className="text-right text-sm font-semibold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            {capacity.minutesPerDay > draft.dailyMinutes ? <Alert variant="warning">Your workload exceeds the daily budget. The plan will still be created with explicit overload warnings, and may extend past your target date.</Alert> : null}
          </div>
        ) : null}
      </section>

      {serverError ? <Alert variant="error" title="Couldn't create the plan" onDismiss={() => setServerError('')}>{serverError}</Alert> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <div className="flex gap-2">
          {step > 0 ? <Button variant="secondary" className="gap-1.5" onClick={() => setStep((value) => value - 1)}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</Button> : null}
          {step < 2 ? <Button className="gap-1.5" onClick={next}>Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            : <Button className="gap-1.5" loading={create.isPending} onClick={submit}><Check className="h-4 w-4" aria-hidden="true" /> Create plan</Button>}
        </div>
      </div>
    </div>
  );
}
```

## `client/src/features/plans/components/PlanCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarRange, CheckCircle2, Flame } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { STATUS_TONE, formatDate, formatMinutes, planStatusLabel } from '../lib/planUtils.js';

export default function PlanCard({ plan }) {
  const completion = plan.stats?.completionPercentage ?? 0;
  return (
    <Link to={`/app/plans/${plan.id}`} className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 focus-visible:border-primary">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">{plan.title}</h3>
        <Badge variant={STATUS_TONE[plan.status] ?? 'neutral'}>{planStatusLabel(plan.status)}</Badge>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted"><CalendarRange className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(plan.startDate)} → {formatDate(plan.endDate)}</p>
      <div className="mt-auto space-y-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-muted">Completion</span><span className="font-semibold text-ink">{completion}%</span></div>
          <ProgressBar value={completion} label={`${plan.title}: ${completion}%`} tone={completion >= 70 ? 'success' : 'primary'} />
        </div>
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <div className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Done</dt><dd>{plan.stats?.doneTasks ?? 0}/{plan.stats?.totalTasks ?? 0}</dd></div>
          <div className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" aria-hidden="true" /><dt className="sr-only">Daily budget</dt><dd>{formatMinutes(plan.dailyMinutes)}/day</dd></div>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-primary">Open <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </dl>
      </div>
    </Link>
  );
}
```

## `client/src/features/plans/components/PlanProgress.jsx`

```jsx
import { CheckCircle2, Clock3, Flame, ListTodo, TriangleAlert } from 'lucide-react';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { formatMinutes } from '../lib/planUtils.js';

export default function PlanProgress({ progress = {}, streak = {}, plan }) {
  const cells = [
    { Icon: ListTodo, label: 'Total tasks', value: progress.total ?? 0, tone: 'text-primary' },
    { Icon: CheckCircle2, label: 'Completed', value: progress.done ?? 0, tone: 'text-success' },
    { Icon: TriangleAlert, label: 'Missed', value: progress.missed ?? 0, tone: 'text-danger' },
    { Icon: Clock3, label: 'Time planned', value: formatMinutes(progress.minutesTotal), tone: 'text-accent' },
    { Icon: Flame, label: 'Current streak', value: `${streak.current ?? 0}d`, tone: 'text-warning' },
  ];
  return (
    <section className="ag-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-ink">Plan completion</h2>
        <span className="text-2xl font-bold tabular-nums text-ink">{progress.completionPercentage ?? 0}%</span>
      </div>
      <ProgressBar className="mt-3" value={progress.completionPercentage ?? 0} label={`Plan ${progress.completionPercentage ?? 0}% complete`} tone={(progress.completionPercentage ?? 0) >= 70 ? 'success' : 'primary'} />
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cells.map(({ Icon, label, value, tone }) => (
          <div key={label} className="rounded-xl border border-line bg-surface-2/40 p-3">
            <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" /> {label}</dt>
            <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      {plan ? <p className="mt-3 text-xs text-muted">{formatMinutes(plan.dailyMinutes)}/day · {plan.restDays.length} rest day(s) · best streak {streak.longest ?? 0} days</p> : null}
    </section>
  );
}
```

## `client/src/features/plans/components/OverloadAlert.jsx`

```jsx
import { TriangleAlert } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { formatDate, warningLabel, warningTone } from '../lib/planUtils.js';

export default function OverloadAlert({ warnings = [], todayMinutes = 0, capacity = 0, onReschedule, missedCount = 0, rescheduling = false }) {
  const overload = warnings.filter((warning) => ['DAILY_OVERLOAD', 'SINGLE_TASK_TOO_LONG', 'OVERFLOW_PAST_END', 'RESCHEDULE_OVERLOAD', 'TASK_UNSCHEDULED', 'NO_WORKING_DAYS'].includes(warning.code));
  const todayOver = capacity > 0 && todayMinutes > capacity;
  if (!overload.length && !todayOver && !missedCount) return null;
  return (
    <Alert variant={todayOver || overload.some((warning) => warningTone(warning.code) === 'danger') ? 'warning' : 'info'} title="Workload check">
      <div className="space-y-2">
        {todayOver ? <p className="flex items-center gap-1.5"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Today has {todayMinutes} min of work against a {capacity} min budget ({Math.round((todayMinutes / capacity) * 100)}%).</p> : null}
        {missedCount > 0 ? <p className="flex flex-wrap items-center gap-2">{missedCount} task(s) are marked missed. <button type="button" onClick={onReschedule} disabled={rescheduling} className="rounded-lg bg-primary/12 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-50">{rescheduling ? 'Rescheduling…' : 'Reschedule missed tasks'}</button></p> : null}
        <ul className="space-y-1.5">
          {overload.slice(0, 4).map((warning, index) => (
            <li key={`${warning.code}-${warning.date ?? index}`} className="flex flex-wrap items-start gap-2 text-xs">
              <Badge variant={warningTone(warning.code) === 'danger' ? 'danger' : 'warning'}>{warningLabel(warning.code)}</Badge>
              <span>{warning.date ? `${formatDate(warning.date)} — ` : ''}{warning.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}
```

## `client/src/features/plans/components/PlanCalendar.jsx`

```jsx
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import { WEEKDAY_OPTIONS, addDays, buildCalendarWeeks, dateKey, diffDays, formatDate } from '../lib/planUtils.js';

const monthLabel = (key) => {
  const date = new Date(`${key}T00:00:00.000Z`);
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

/** Month grid with per-day load bars. Pure presentation, no data fetching. */
export default function PlanCalendar({ plan, calendar = [], selected, onSelect }) {
  const [anchor, setAnchor] = useState(() => plan?.startDate ?? dateKey());
  const byDate = useMemo(() => Object.fromEntries(calendar.map((day) => [day.date, day])), [calendar]);
  const firstOfMonth = `${anchor.slice(0, 7)}-01`;
  const monthEnd = useMemo(() => {
    const date = new Date(`${firstOfMonth}T00:00:00.000Z`);
    date.setUTCMonth(date.getUTCMonth() + 1);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  }, [firstOfMonth]);
  const lastOfMonth = diffDays(firstOfMonth, monthEnd) >= 0 ? monthEnd : addDays(firstOfMonth, 30);
  const weeks = buildCalendarWeeks(firstOfMonth, lastOfMonth, byDate);
  const capacity = plan?.dailyMinutes ?? 60;
  const today = dateKey();
  const restDays = plan?.restDays ?? [];

  const shift = (months) => {
    const date = new Date(`${firstOfMonth}T00:00:00.000Z`);
    date.setUTCMonth(date.getUTCMonth() + months);
    setAnchor(date.toISOString().slice(0, 10));
  };

  return (
    <section className="ag-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{monthLabel(firstOfMonth)}</h2>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label="This month" onClick={() => setAnchor(today)}>·</Button>
          <Button size="icon" variant="ghost" aria-label="Next month" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
        {WEEKDAY_OPTIONS.map((day) => <span key={day.value} className="py-1">{day.label}</span>)}
      </div>
      <div className="mt-1 space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((cell) => {
              const day = cell.day;
              const isRest = restDays.includes(new Date(`${cell.key}T00:00:00.000Z`).getUTCDay());
              const isSelected = selected === cell.key;
              const ratio = day ? Math.min(100, Math.round((day.minutes / Math.max(1, capacity)) * 100)) : 0;
              return (
                <button
                  key={cell.key} type="button" onClick={() => onSelect(cell.key)}
                  aria-label={`${formatDate(cell.key)}${day ? `, ${day.total} tasks, ${day.done} done` : ', no tasks'}`}
                  aria-pressed={isSelected}
                  className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg border text-xs transition-colors ${isSelected ? 'border-primary bg-primary/10 text-ink' : 'border-transparent text-muted hover:border-line hover:bg-surface-2'} ${cell.key === today ? 'ring-1 ring-inset ring-primary/50' : ''} ${!cell.inRange ? 'opacity-45' : ''}`}
                >
                  <span className={cell.key === today ? 'font-bold text-primary' : ''}>{Number(cell.key.slice(-2))}</span>
                  {day ? <>
                    <span className="h-1 w-8 overflow-hidden rounded-full bg-line"><span className={`block h-full ${ratio > 100 ? 'bg-danger' : day.done === day.total ? 'bg-success' : 'bg-primary'}`} style={{ width: `${Math.max(8, ratio)}%` }} /></span>
                    <span className="text-[9px]">{day.done}/{day.total}</span>
                  </> : isRest ? <span className="text-[9px] text-accent">rest</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Bars show planned minutes against your {capacity} min budget. Green = every task done.</p>
    </section>
  );
}
```

## `client/src/features/plans/components/TaskItem.jsx`

```jsx
import { ExternalLink, RotateCcw } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { TASK_TONE, TYPE_TONE, formatMinutes, isExternalHref, taskHref, taskStatusLabel, taskTypeLabel } from '../lib/planUtils.js';

const NEXT = {
  pending: 'in_progress', in_progress: 'done', done: 'pending', skipped: 'pending', missed: 'pending',
};

/** One task row. The checkbox is a real button with an accessible label. */
export default function TaskItem({ task, onStatus, busy = false, showDate = false }) {
  const href = taskHref(task);
  const external = isExternalHref(href);
  const done = task.status === 'done';
  const next = NEXT[task.status] ?? 'pending';

  return (
    <li className={`rounded-xl border p-3 transition-colors ${done ? 'border-success/25 bg-success/5' : task.status === 'missed' ? 'border-danger/25 bg-danger/5' : 'border-line bg-surface'}`}>
      <div className="flex items-start gap-3">
        <button
          type="button" role="checkbox" aria-checked={done}
          aria-label={`${done ? 'Reopen' : 'Complete'} ${task.title}`}
          disabled={busy}
          onClick={() => onStatus(task, done ? 'pending' : 'done')}
          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${done ? 'border-success bg-success text-white' : 'border-line bg-surface hover:border-primary'}`}
        >{done ? '✓' : ''}</button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={TYPE_TONE[task.type] ?? 'neutral'}>{taskTypeLabel(task.type)}</Badge>
            <Badge variant={TASK_TONE[task.status] ?? 'neutral'}>{taskStatusLabel(task.status)}</Badge>
            {task.overloaded ? <Badge variant="warning">Overload</Badge> : null}
            {task.revisionInterval ? <Badge variant="accent">+{task.revisionInterval}d revision</Badge> : null}
            {task.rescheduledFrom ? <Badge variant="neutral"><RotateCcw className="mr-1 inline h-3 w-3" aria-hidden="true" /> moved</Badge> : null}
          </div>
          <p className={`mt-1.5 text-sm font-medium ${done ? 'text-muted line-through' : 'text-ink'}`}>{task.title}</p>
          <p className="mt-0.5 text-xs text-muted">
            {showDate ? `${task.date} · ` : ''}{task.topic} · {formatMinutes(task.estimatedMinutes)}
            {task.description ? ` · ${task.description}` : ''}
          </p>
          {task.note ? <p className="mt-1 text-xs italic text-muted">Note: {task.note}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {task.status !== 'done' ? <Button size="sm" variant="ghost" disabled={busy} onClick={() => onStatus(task, next)}>{next === 'done' ? 'Done' : next === 'in_progress' ? 'Start' : 'Reopen'}</Button> : null}
          <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer nofollow' : undefined} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:border-primary/40 hover:text-primary" aria-label={`Open ${task.title}`}>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </li>
  );
}
```

## `client/src/features/plans/components/TaskList.jsx`

```jsx
import { ListTodo } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import TaskItem from './TaskItem.jsx';
import { formatDate } from '../lib/planUtils.js';

export default function TaskList({ tasks = [], selectedDate, onStatus, busy = false, title = 'Tasks' }) {
  return (
    <section className="ag-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <span className="text-xs text-muted">{selectedDate ? formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' }) : `${tasks.length} tasks`} · {tasks.length} item(s)</span>
      </div>
      {!tasks.length ? <EmptyState compact icon={ListTodo} title="Nothing scheduled" description="Pick another day, or reschedule missed tasks to fill this one." /> : (
        <ul className="space-y-2">{tasks.map((task) => <TaskItem key={task.id} task={task} onStatus={onStatus} busy={busy} />)}</ul>
      )}
    </section>
  );
}
```

---

# Client — plans pages (new)

## `client/src/features/plans/pages/PlansPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Select from '../../../components/ui/Select.jsx';
import PlanCard from '../components/PlanCard.jsx';
import { useActivePlan, useArchivePlan, usePlanList } from '../hooks/usePlans.js';
import { useIsDark } from '../../../store/themeStore.js';
import { STATUS_TONE, errorMessage, formatDate, planStatusLabel } from '../lib/planUtils.js';

const STATUS_OPTIONS = [{ value: '', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'paused', label: 'Paused' }, { value: 'completed', label: 'Completed' }, { value: 'archived', label: 'Archived' }];

export default function PlansPage() {
  const isDark = useIsDark();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ page, limit: 12, ...(status ? { status } : {}) }), [page, status]);
  const { data, isLoading, isError, error } = usePlanList(params);
  const { data: activeData } = useActivePlan();
  const archive = useArchivePlan();
  const activePlan = activeData?.plan;
  const plans = data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText text="ADAPTIVE PLANS // DAILY EXECUTION" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Your plans</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">A day-by-day schedule built from your goal, time budget, rest days and chosen content. Missed days reschedule; revisions repeat on day 1, 7 and 21.</p>
        </div>
        <Link to="/app/plans/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New plan</Button></Link>
      </header>

      {activePlan ? (
        <section className="ag-card flex flex-wrap items-center justify-between gap-4 border-primary/25 bg-primary/8 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Active plan</p>
              <h2 className="mt-1 text-lg font-bold text-ink">{activePlan.title}</h2>
              <p className="mt-1 text-xs text-muted">{formatDate(activePlan.startDate)} → {formatDate(activePlan.endDate)} · {activePlan.dailyMinutes} min/day · {activePlan.stats?.completionPercentage ?? 0}% complete</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/app"><Button variant="secondary" size="sm">Today’s tasks</Button></Link>
            <Link to={`/app/plans/${activePlan.id}`}><Button size="sm">Open plan</Button></Link>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select label="Filter by status" options={STATUS_OPTIONS} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} />
        <p className="text-xs text-muted">{data?.pagination?.total ?? 0} plan(s)</p>
      </div>

      {archive.isError ? <Alert variant="error">{errorMessage(archive.error)}</Alert> : null}
      {isError ? <Alert variant="error" title="Couldn't load plans">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-52 w-full" />)}</div>
        : plans.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{plans.map((plan) => (
          <div key={plan.id} className="relative">
            <PlanCard plan={plan} />
            {plan.status === 'active' ? (
              <button type="button" onClick={() => archive.mutate(plan.id)} disabled={archive.isPending} className="absolute right-3 top-3 rounded-lg border border-line bg-surface px-2 py-1 text-[10px] font-semibold text-muted hover:text-danger" aria-label={`Archive ${plan.title}`}>
                <span className="sr-only">{planStatusLabel(plan.status)}</span>Archive
              </button>
            ) : null}
          </div>
        ))}</div>
          : <EmptyState icon={CalendarRange} title="No plans yet" description="Create your first adaptive plan and we will distribute every task for you." action={<Link to="/app/plans/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Build a plan</Button></Link>} />}

      {data?.pagination?.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Plans pagination">
          <p className="text-xs text-muted">Page {data.pagination.page} of {data.pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!data.pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button>
            <Button size="sm" variant="secondary" disabled={!data.pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
          </div>
        </nav>
      ) : null}
      <span className="sr-only">{Object.keys(STATUS_TONE).length} statuses available</span>
    </div>
  );
}
```

## `client/src/features/plans/pages/PlanDetailPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Archive, Pause, Pencil, Play, RefreshCw, Sparkles } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import PlanProgress from '../components/PlanProgress.jsx';
import PlanCalendar from '../components/PlanCalendar.jsx';
import TaskList from '../components/TaskList.jsx';
import OverloadAlert from '../components/OverloadAlert.jsx';
import { usePlan, usePlanTasks, useRegeneratePlan, useReschedulePlan, useTaskStatus, useUpdatePlan } from '../hooks/usePlans.js';
import { STATUS_TONE, errorMessage, formatDate, formatMinutes, planStatusLabel } from '../lib/planUtils.js';

export default function PlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(null);
  const { data, isLoading, isError, error } = usePlan(id);
  const taskParams = useMemo(() => {
    const params = { page: 1, limit: 300 };
    if (selectedDate) { params.from = selectedDate; params.to = selectedDate; }
    return params;
  }, [selectedDate]);
  const { data: taskData, isLoading: tasksLoading } = usePlanTasks(id, taskParams);
  const statusMutation = useTaskStatus(id);
  const reschedule = useReschedulePlan(id);
  const regenerate = useRegeneratePlan(id);
  const update = useUpdatePlan(id);

  if (isLoading) return <FullPageLoader label="Loading your plan…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this plan">{errorMessage(error)}</Alert>;
  if (!data?.plan) return <FullPageLoader label="Loading your plan…" />;
  const { plan, progress, streak, dailyLoad } = data;
  const today = new Date().toISOString().slice(0, 10);
  const todayLoad = dailyLoad.find((day) => day.date === today) ?? { minutes: 0 };
  const tasks = taskData?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/plans" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All plans</Link>
        <div className="flex flex-wrap gap-2">
          <Link to={`/app/plans/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit</Button></Link>
          <Button variant="secondary" size="sm" className="gap-1.5" loading={regenerate.isPending} disabled={plan.status === 'archived'} onClick={() => regenerate.mutate()}><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Regenerate</Button>
          {plan.status === 'active'
            ? <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => update.mutate({ status: 'paused' })}><Pause className="h-3.5 w-3.5" aria-hidden="true" /> Pause</Button>
            : plan.status === 'paused'
              ? <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => update.mutate({ status: 'active' })}><Play className="h-3.5 w-3.5" aria-hidden="true" /> Resume</Button>
              : null}
          <Button variant="danger" size="sm" className="gap-1.5" disabled={plan.status === 'archived'} onClick={() => update.mutate({ status: 'archived' }, { onSuccess: () => navigate('/app/plans') })}><Archive className="h-3.5 w-3.5" aria-hidden="true" /> Archive</Button>
        </div>
      </div>

      <header>
        <div className="flex flex-wrap items-center gap-2"><Badge variant={STATUS_TONE[plan.status] ?? 'neutral'}>{planStatusLabel(plan.status)}</Badge><Badge variant="primary">{plan.goal.replaceAll('_', ' ')}</Badge></div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{plan.title}</h1>
        <p className="mt-1.5 text-sm text-muted">{formatDate(plan.startDate)} → {formatDate(plan.endDate)} · {formatMinutes(plan.dailyMinutes)} per day · {plan.restDays.length} rest day(s) · mocks every {plan.mockIntervalDays} days</p>
        {plan.notes ? <p className="mt-1 text-xs italic text-muted">{plan.notes}</p> : null}
      </header>

      {location.state?.generated ? <Alert variant="success" className="flex items-center gap-2"><Sparkles className="h-4 w-4" aria-hidden="true" /> Generated {location.state.generated.tasks} tasks across {location.state.generated.usedDates?.length ?? 0} days, including {location.state.generated.mockTasks} mocks and {location.state.generated.revisionTasks} revision blocks.</Alert> : null}
      {reschedule.isSuccess ? <Alert variant="success">Rescheduled {reschedule.data?.moved ?? 0} missed task(s).</Alert> : null}
      {regenerate.isSuccess ? <Alert variant="success">Future pending tasks were regenerated; completed history is untouched.</Alert> : null}
      {[reschedule.error, regenerate.error, update.error, statusMutation.error].filter(Boolean).map((item, index) => <Alert key={index} variant="error">{errorMessage(item)}</Alert>)}

      <OverloadAlert
        warnings={plan.warnings} todayMinutes={todayLoad.minutes} capacity={plan.dailyMinutes}
        missedCount={progress.missed} onReschedule={() => reschedule.mutate({})} rescheduling={reschedule.isPending}
      />

      <PlanProgress progress={progress} streak={streak} plan={plan} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <TaskList
          tasks={tasks} selectedDate={selectedDate}
          title={selectedDate ? 'Tasks for this day' : 'All upcoming tasks'}
          busy={statusMutation.isPending}
          onStatus={(task, status) => statusMutation.mutate({ taskId: task.id, body: { status } })}
        />
        <div className="space-y-4">
          <PlanCalendar plan={plan} calendar={taskData?.calendar ?? []} selected={selectedDate} onSelect={(key) => setSelectedDate((previous) => previous === key ? null : key)} />
          {tasksLoading ? <p className="text-center text-xs text-muted">Loading tasks…</p> : null}
          <section className="ag-card p-4">
            <h2 className="text-sm font-semibold text-ink">Schedule rules</h2>
            <ul className="mt-2 space-y-1.5 text-xs text-muted">
              <li>• Tasks never exceed {plan.dailyMinutes} min/day without a warning.</li>
              <li>• {plan.revisionEnabled ? 'Revisions appear 1, 7 and 21 days after each lesson.' : 'Spaced revisions are disabled for this plan.'}</li>
              <li>• Past unfinished tasks become “missed” and can be rescheduled in one click.</li>
              <li>• Rest days are empty and never break your streak.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
```

## `client/src/features/plans/pages/PlanEditorPage.jsx`

```jsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { planUpdateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import RestDayPicker from '../components/RestDayPicker.jsx';
import PlanWizard from '../components/PlanWizard.jsx';
import { useActivePlan, useArchivePlan, usePlan, useUpdatePlan } from '../hooks/usePlans.js';
import { STATUS_TONE, apiFieldErrors, contractErrors, errorMessage, planStatusLabel } from '../lib/planUtils.js';

function EditPlan({ id }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = usePlan(id);
  const update = useUpdatePlan(id);
  const archive = useArchivePlan();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  if (isLoading) return <FullPageLoader label="Loading plan settings…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this plan">{errorMessage(error)}</Alert>;
  const plan = data?.plan;
  if (!plan) return <FullPageLoader label="Loading plan settings…" />;
  if (!form || form._id !== plan.id) {
    setForm({
      _id: plan.id, title: plan.title, notes: plan.notes || '',
      dailyMinutes: plan.dailyMinutes, restDays: plan.restDays,
      revisionEnabled: plan.revisionEnabled,
    });
  }
  if (!form) return null;
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const save = () => {
    const payload = {
      title: form.title.trim(), notes: form.notes.trim(),
      dailyMinutes: Number(form.dailyMinutes), restDays: form.restDays,
      revisionEnabled: form.revisionEnabled,
    };
    const parsed = planUpdateSchema.safeParse(payload);
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setActionError(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setActionError('');
    update.mutate(parsed.data, {
      onSuccess: () => setMessage('Settings saved. Regenerate the plan to apply a new budget or rest-day pattern to future tasks.'),
      onError: (err) => { setActionError(errorMessage(err)); setErrors(apiFieldErrors(err)); },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/app/plans/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to plan</Link>
          <Badge variant={STATUS_TONE[plan.status]}>{planStatusLabel(plan.status)}</Badge>
        </div>
        <Button variant="danger" size="sm" className="gap-1.5" disabled={plan.status === 'archived'} loading={archive.isPending} onClick={() => archive.mutate(id, { onSuccess: () => navigate('/app/plans'), onError: (err) => setActionError(errorMessage(err)) })}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Archive</Button>
      </div>

      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Plan settings</h1><p className="mt-1.5 text-sm text-muted">Changing the budget or rest days affects rescheduling immediately; use <strong>Regenerate</strong> on the plan page to rebuild future tasks.</p></header>

      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {message ? <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert> : null}

      <section className="ag-card space-y-4 p-5">
        <Input label="Title" value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} maxLength={120} />
        <Input label="Daily time budget (minutes)" type="number" min={15} max={720} value={form.dailyMinutes} onChange={(event) => set('dailyMinutes', Number(event.target.value))} error={errors.dailyMinutes} />
        <RestDayPicker value={form.restDays} onChange={(restDays) => set('restDays', restDays)} error={errors.restDays} />
        <label htmlFor="edit-revisions" className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span><span className="block text-sm font-medium text-ink">Spaced revisions (1 / 7 / 21 days)</span><span className="mt-0.5 block text-xs text-muted">Applies when you regenerate the plan.</span></span>
          <input id="edit-revisions" type="checkbox" checked={form.revisionEnabled} onChange={(event) => set('revisionEnabled', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        </label>
        <Input label="Notes" value={form.notes} onChange={(event) => set('notes', event.target.value)} maxLength={500} error={errors.notes} />
        <div className="flex justify-end"><Button className="gap-1.5" loading={update.isPending} onClick={save}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save settings</Button></div>
      </section>

      <section className="ag-card space-y-2 p-5">
        <h2 className="text-sm font-semibold text-ink">Content in this plan</h2>
        <p className="text-xs text-muted">{plan.sheetIds.length} sheets · {plan.quizIds.length} quizzes · {plan.mockIds.length} mocks · {plan.startDate} → {plan.endDate}</p>
        <p className="text-xs text-muted">Selected content cannot be swapped on an existing plan without losing task history. Build a new plan to change it.</p>
      </section>
    </div>
  );
}

function NewPlan() {
  const navigate = useNavigate();
  const { data } = useActivePlan();
  return <PlanWizard activePlan={data?.plan} onCancel={() => navigate('/app/plans')} />;
}

export default function PlanEditorPage() {
  const { id } = useParams();
  return id ? <EditPlan id={id} /> : <NewPlan />;
}
```

---

# Client — dashboard api / hooks (new)

## `client/src/features/dashboard/api/dashboardApi.js`

```js
import api from '../../../lib/apiClient.js';

/** One aggregated read: today, streak, progress, weak topics, mock, revisions. */
export const dashboardApi = {
  get: (params = {}) => api.get('/dashboard', { query: params }),
};

export default dashboardApi;
```

## `client/src/features/dashboard/hooks/useDashboard.js`

```js
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import dashboardApi from '../api/dashboardApi.js';

/** Refetch on window focus so a returning learner immediately sees today. */
export function useDashboard(params = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.get(params),
    queryFn: () => dashboardApi.get(params),
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });
}

export default useDashboard;
```

---

# Client — dashboard components (new)

## `client/src/features/dashboard/components/DashboardHero.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { ShinyText, SpotlightCard } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import { useCurrentUser } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import ContinueCard from './ContinueCard.jsx';
import { errorMessage, formatMinutes } from '../../plans/lib/planUtils.js';

export default function DashboardHero({ data, isError, error }) {
  const user = useCurrentUser();
  const isDark = useIsDark();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = data?.today;
  const overload = data?.overload;

  return (
    <div className="space-y-4">
      <div className="ag-rise">
        <ShinyText text="YOUR WORKSPACE // PHASE_05" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Good to see you, {firstName}.</h1>
        <p className="mt-1.5 text-sm text-muted">Here is what to do next — built from your active plan, recent quiz and mock results.</p>
      </div>

      {isError ? <div className="rounded-xl border border-danger/30 bg-danger/8 p-4 text-sm text-danger">{errorMessage(error) || 'Could not load your dashboard.'}</div> : null}

      <SpotlightCard
        theme={isDark ? 'dark' : 'light'}
        spotlightColor={isDark ? '#2dd4bf' : '#0d9488'}
        className="border border-line p-5 transition-colors hover:border-primary/40 sm:p-7"
        style={{ '--spotlight-card-surface': 'var(--ag-surface)', '--spotlight-card-border': 'var(--ag-line)', '--spotlight-card-shadow': 'none' }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> What should I do now</span>
            <h2 className="mt-4 text-xl font-bold text-ink sm:text-2xl">{today?.tasks?.length ? `You have ${today.tasks.length} task${today.tasks.length === 1 ? '' : 's'} today.` : 'Your day is clear.'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {data?.plan
                ? `${today?.done ?? 0} done · ${formatMinutes(today?.minutes ?? 0)} planned against a ${formatMinutes(overload?.capacity ?? 0)} budget. Rest days never break your streak.`
                : 'Build an adaptive plan and we will distribute every problem, quiz, revision and mock across your calendar.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to="/app/plans"><Button className="gap-2">{data?.plan ? 'Open plan' : 'Build a plan'} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-warning"><Flame className="h-4 w-4" aria-hidden="true" /> {data?.streak?.current ?? 0}-day streak</span>
            </div>
          </div>
          <div className="w-full max-w-sm"><ContinueCard item={data?.continueWith} /></div>
        </div>
      </SpotlightCard>
    </div>
  );
}
```

## `client/src/features/dashboard/components/ContinueCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, CirclePlay, ListChecks, Timer } from 'lucide-react';

const ICONS = { quiz_attempt: ListChecks, mock_attempt: Timer, plan_task: CirclePlay, sheet_problem: BookOpen };

export default function ContinueCard({ item }) {
  if (!item) return (
    <div className="rounded-2xl border border-dashed border-line bg-surface-2/40 p-5 text-sm text-muted">
      <p className="font-semibold text-ink">All caught up</p>
      <p className="mt-1 text-xs">Open a sheet, take a quiz, or create a plan to keep the streak alive.</p>
      <Link to="/app/sheets" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Browse sheets <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
    </div>
  );
  const Icon = ICONS[item.kind] ?? CirclePlay;
  return (
    <Link to={item.href} className="group block rounded-2xl border border-primary/25 bg-primary/8 p-5 transition-colors hover:border-primary/60 focus-visible:border-primary">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Continue where you left off</p>
          <p className="mt-1 truncate text-sm font-semibold text-ink group-hover:text-primary">{item.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </div>
    </Link>
  );
}
```

## `client/src/features/dashboard/components/StreakCard.jsx`

```jsx
import { Flame, Trophy } from 'lucide-react';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { formatDate } from '../../plans/lib/planUtils.js';

/** CSS ring — no SVG/animation dependency, works in light and dark. */
export default function StreakCard({ streak = {}, progress = {}, plan }) {
  const current = streak.current ?? 0;
  const longest = streak.longest ?? 0;
  const target = Math.max(7, Math.ceil((longest || 7) / 7) * 7);
  const percent = Math.min(100, Math.round((current / target) * 100));
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-ink">Streak</h2><Trophy className="h-4 w-4 text-accent" aria-hidden="true" /></div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--ag-primary) ${percent}%, var(--ag-line) 0)` }} aria-label={`${current} day streak`}>
          <div className="inline-flex h-16 w-16 flex-col items-center justify-center rounded-full bg-surface">
            <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
            <span className="text-xl font-bold leading-none text-ink">{current}</span>
            <span className="text-[9px] text-muted">days</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs text-muted">Best: <strong className="text-ink">{longest} days</strong></p>
          <p className="text-xs text-muted">Last active: <strong className="text-ink">{formatDate(streak.lastActiveDate)}</strong></p>
          <ProgressBar value={percent} label={`${percent}% of your ${target}-day goal`} tone={percent >= 70 ? 'success' : 'primary'} />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{plan ? `${plan.restDays.length} rest day(s) per week · completion ${progress.completionPercentage ?? 0}%` : 'Create a plan to track daily completion.'}</p>
    </section>
  );
}
```

## `client/src/features/dashboard/components/TodayTasks.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ListTodo } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { useTaskStatus } from '../../plans/hooks/usePlans.js';
import { formatMinutes } from '../../plans/lib/planUtils.js';
import TaskItem from '../../plans/components/TaskItem.jsx';

/** Today's checklist. Optimistic-free: each mutation invalidates the dashboard. */
export default function TodayTasks({ today = {}, planId, overload = {} }) {
  const mutation = useTaskStatus(planId);
  const tasks = today.tasks ?? [];
  const done = today.done ?? 0;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <section className="ag-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><ListTodo className="h-4 w-4 text-primary" aria-hidden="true" /> Today’s tasks</h2>
        <span className="text-xs text-muted">{done}/{tasks.length} done · {formatMinutes(today.minutes)}</span>
      </div>
      <ProgressBar className="mt-3" value={percent} label={`${percent}% of today done`} tone={percent >= 70 ? 'success' : 'primary'} />
      {overload.isOverloaded ? <p className="mt-2 rounded-lg border border-warning/30 bg-warning/8 p-2 text-xs text-warning">Overloaded: {formatMinutes(overload.todayMinutes)} planned against a {formatMinutes(overload.capacity)} budget ({overload.ratio}%).</p> : null}
      {mutation.isError ? <p className="mt-2 text-xs text-danger">{mutation.error?.message ?? 'Could not update that task.'}</p> : null}
      {!tasks.length ? <EmptyState compact icon={ListTodo} title="Nothing due today" description={planId ? 'Check your plan calendar or reschedule missed tasks.' : 'Create a plan to get a daily checklist.'} />
        : <ul className="mt-3 space-y-2">{tasks.map((task) => <TaskItem key={task.id} task={task} busy={mutation.isPending} onStatus={(item, status) => mutation.mutate({ taskId: item.id, body: { status } })} />)}</ul>}
      <div className="mt-4 flex flex-wrap gap-2">
        {planId ? <Link to={`/app/plans/${planId}`}><Button variant="secondary" size="sm">Open full plan</Button></Link> : <Link to="/app/plans/new"><Button size="sm">Build a plan</Button></Link>}
      </div>
    </section>
  );
}
```

## `client/src/features/dashboard/components/WeakTopicsCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { SEVERITY_TONE } from '../../plans/lib/planUtils.js';

export default function WeakTopicsCard({ topics = [] }) {
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Target className="h-4 w-4 text-danger" aria-hidden="true" /> Weak topics</h2><Badge variant="neutral">quiz + mock</Badge></div>
      {!topics.length ? <EmptyState compact icon={Target} title="No analytics yet" description="Attempt a quiz or mock and topic performance appears here automatically." />
        : <ul className="mt-3 space-y-3">{topics.slice(0, 5).map((topic) => (
          <li key={topic.topic}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs"><span className="font-semibold text-ink">{topic.topic}</span><Badge variant={SEVERITY_TONE[topic.severity] ?? 'neutral'}>{topic.percentage}%</Badge></div>
            <ProgressBar value={Math.max(0, topic.percentage)} label={`${topic.topic}: ${topic.percentage}%`} tone={topic.severity === 'high' ? 'warning' : 'accent'} />
            <p className="mt-1 text-[11px] text-muted">{topic.correct}/{topic.total} correct across {topic.attempts} result(s)</p>
          </li>
        ))}</ul>}
      <Link to="/app/quizzes" className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">Practise a quiz →</Link>
    </section>
  );
}
```

## `client/src/features/dashboard/components/UpcomingMockCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { CalendarClock, Timer } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { formatDate, formatMinutes, relativeDay } from '../../plans/lib/planUtils.js';

export default function UpcomingMockCard({ mock, others = [], planId }) {
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><CalendarClock className="h-4 w-4 text-warning" aria-hidden="true" /> Upcoming mock</h2><Badge variant="warning">every 14 days</Badge></div>
      {!mock ? <EmptyState compact icon={Timer} title="No mock scheduled" description="Plans insert a full-length mock roughly every two weeks." />
        : <div className="mt-3 rounded-xl border border-warning/25 bg-warning/8 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warning">{relativeDay(mock.date)} · {formatDate(mock.date, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <h3 className="mt-1.5 text-base font-bold text-ink">{mock.title}</h3>
          <p className="mt-1 text-xs text-muted">{formatMinutes(mock.estimatedMinutes)} · {mock.topic} · {mock.status === 'missed' ? 'needs rescheduling' : mock.status}</p>
          <Link to={mock.refType === 'MockTest' ? `/app/mocks/${mock.refId}` : '/app/mocks'} className="mt-3 inline-block"><Button size="sm" variant="secondary">Open mock</Button></Link>
        </div>}
      {others.length > 1 ? <p className="mt-3 text-xs text-muted">{others.length - 1} more mock(s) in the next 30 days.</p> : null}
      {planId ? <Link to={`/app/plans/${planId}`} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">View plan calendar →</Link> : null}
    </section>
  );
}
```

## `client/src/features/dashboard/components/PendingRevisions.jsx`

```jsx
import { Link } from 'react-router-dom';
import { BookmarkCheck, RotateCcw } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { formatDate, formatMinutes, relativeDay } from '../../plans/lib/planUtils.js';

export default function PendingRevisions({ items = [], planId }) {
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><RotateCcw className="h-4 w-4 text-success" aria-hidden="true" /> Pending revisions</h2><Badge variant="success">1 / 7 / 21</Badge></div>
      {!items.length ? <EmptyState compact icon={BookmarkCheck} title="No revisions due" description="Spaced revision blocks appear 1, 7 and 21 days after each lesson." />
        : <ul className="mt-3 space-y-2">{items.slice(0, 5).map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/40 p-3">
            <div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{item.title}</p><p className="mt-0.5 text-[11px] text-muted">{relativeDay(item.date)} · {formatDate(item.date)} · {formatMinutes(item.estimatedMinutes)}</p></div>
            <Badge variant="accent">+{item.revisionInterval ?? 1}d</Badge>
          </li>
        ))}</ul>}
      {planId ? <Link to={`/app/plans/${planId}`} className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">Open plan →</Link> : null}
    </section>
  );
}
```

---

# Client — student dashboard page (rewritten)

## `client/src/features/home/pages/HomePage.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Activity, CalendarClock, CheckCircle2, Goal, TriangleAlert } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { useCurrentUser } from '../../auth/store/authStore.js';
import { useDashboard } from '../../dashboard/hooks/useDashboard.js';
import DashboardHero from '../../dashboard/components/DashboardHero.jsx';
import StreakCard from '../../dashboard/components/StreakCard.jsx';
import TodayTasks from '../../dashboard/components/TodayTasks.jsx';
import WeakTopicsCard from '../../dashboard/components/WeakTopicsCard.jsx';
import UpcomingMockCard from '../../dashboard/components/UpcomingMockCard.jsx';
import PendingRevisions from '../../dashboard/components/PendingRevisions.jsx';
import { errorMessage, formatMinutes } from '../../plans/lib/planUtils.js';

/**
 * Student dashboard — "what should I do now". One aggregated API read feeds
 * every card; React Bits is confined to the hero (polish only), while all
 * data-heavy sections are plain, accessible Tailwind.
 */
export default function HomePage() {
  const user = useCurrentUser();
  const { data, isLoading, isError, error, refetch } = useDashboard({ horizon: 30 });
  const goalLabel = (data?.plan?.goal ?? user?.goal ?? 'not_set').replaceAll('_', ' ');

  if (isLoading) return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-28 w-full" /><Skeleton className="h-44 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 w-full" />)}</div>
      <div className="grid gap-4 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-64 w-full" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <DashboardHero data={data} isError={isError} error={error} />

      {data?.missedCount > 0 ? (
        <Alert variant="warning" title={`${data.missedCount} task(s) need attention`}>
          Past unfinished tasks were marked missed. <Link to={`/app/plans/${data.plan?.id ?? ''}`} className="font-semibold underline">Open your plan</Link> and reschedule them into the remaining days.
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Today', Icon: CalendarClock, value: `${data?.today?.done ?? 0}/${data?.today?.total ?? 0}`, hint: `${formatMinutes(data?.today?.minutes ?? 0)} planned`, tone: 'text-primary' },
          { label: 'Plan completion', Icon: CheckCircle2, value: `${data?.progress?.completionPercentage ?? 0}%`, hint: `${data?.progress?.done ?? 0} of ${data?.progress?.total ?? 0} tasks`, tone: 'text-success' },
          { label: 'Your goal', Icon: Goal, value: goalLabel, hint: data?.plan ? data.plan.title : 'No active plan', tone: 'text-accent' },
          { label: 'Recent activity', Icon: Activity, value: `${data?.recentActivity?.length ?? 0}`, hint: 'quiz + mock results', tone: 'text-warning' },
        ].map(({ label, Icon, value, hint, tone }, index) => (
          <div key={label} className="ag-card ag-rise p-5 transition-colors hover:border-primary/40" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-muted">{label}</p><Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" /></div>
            <p className="mt-2 truncate text-xl font-bold text-ink">{value}</p>
            <p className="mt-1 truncate text-xs text-muted">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><TodayTasks today={data?.today} planId={data?.plan?.id} overload={data?.overload} /></div>
        <StreakCard streak={data?.streak} progress={data?.progress} plan={data?.plan} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <WeakTopicsCard topics={data?.weakTopics} />
        <UpcomingMockCard mock={data?.upcomingMock} others={data?.upcomingMocks} planId={data?.plan?.id} />
        <PendingRevisions items={data?.pendingRevisions} planId={data?.plan?.id} />
      </div>

      {data?.overload?.warnings?.length ? (
        <details className="ag-card group p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ink">
            <TriangleAlert className="h-4 w-4 text-warning" aria-hidden="true" /> Workload warnings <Badge variant="warning">{data.overload.warnings.length}</Badge>
            <span className="ml-auto text-xs font-normal text-muted group-open:hidden">Show</span>
          </summary>
          <ul className="mt-3 space-y-1.5 text-xs text-muted">{data.overload.warnings.map((warning, index) => <li key={`${warning.code}-${index}`}>• {warning.date ? `${warning.date} — ` : ''}{warning.message}</li>)}</ul>
        </details>
      ) : null}

      {isError ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/8 p-4"><p className="text-sm text-danger">{errorMessage(error)}</p><Button size="sm" variant="secondary" onClick={() => refetch()}>Retry</Button></div> : null}
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

> **Status: Phase 5 complete.** Phase 1 shipped authentication, onboarding, RBAC,
> the app shell, dark/light theming and the animated React Bits landing page.
> Phase 2 added **DSA Sheets**, Phase 3 **Quizzes**, Phase 4 the **Mock test
> engine**, and Phase 5 adds **Adaptive Plans** plus the **student dashboard**:
> goal/date/time-budget-driven task distribution, rest days, 1/7/21-day spaced
> revisions, a mock every 14 days, overload warnings, missed-task rescheduling,
> and a "what should I do now" home screen with streak, completion, weak topics,
> upcoming mock, pending revisions and continue-where-you-left-off.
> See [`docs/PHASE5.md`](./docs/PHASE5.md) for the design and full API reference and
> [`docs/PHASE5-CODE.md`](./docs/PHASE5-CODE.md) for every changed file verbatim.
> Earlier: [`docs/PHASE4.md`](./docs/PHASE4.md) · [`docs/PHASE3.md`](./docs/PHASE3.md) ·
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
│   └── PHASE5-CODE.md               # complete Phase 5 source, file by file
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
│   ├── tests/                       # node:test — 197 tests, no DB required
│   │   ├── app.test.js, contracts.test.js, auth.service.test.js
│   │   ├── sheets*.test.js         # detector, workflow, Zod, service, routes
│   │   ├── quizzes*.test.js        # 7 types, grading, import, versions, attempts
│   │   ├── mocks*.test.js          # marking, server clock, sections, analysis
│   │   └── plans*.test.js          # scheduler, revisions, streak, dashboard
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
│       │   └── {Plan,PlanTask}.js
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
npm test                 # 197 node:test server tests + 25 client render smoke tests
                         # (API envelope, validation, RBAC, JWT, auth services,
                         #  platform detection, lifecycle, versioning, progress,
                         #  7 question types, grading, JSON/CSV import, attempts,
                         #  negative marking, sectional timers, palette states,
                         #  result analysis, plan scheduling, streak, dashboard,
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
performance and explanations → **Retry incorrect only**.

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
5. Admin *screens* are Phase 8; Phase 1 ships the RBAC middleware, permissions and
   two permission-guarded user-management endpoints so the pattern is real, not TODO.
6. Module routes (Sheets → Community) exist with honest "coming in a later phase"
   empty states. No fake data or stub service logic.
7. Published-content versioning and per-user progress collections now exist in
   Phase 2 (`SheetVersion`, `UserProgress`), Phase 3 (`QuizVersion`, `Attempt`)
   Phase 4 (`MockVersion`, `MockAttempt`) and Phase 5 (`Plan`, `PlanTask`).
   See `docs/PHASE2.md` §2, `docs/PHASE3.md` §2, `docs/PHASE4.md` §2 and
   `docs/PHASE5.md` §2 for the embedding, snapshot and separation decisions.
8. In production the client and API should share an origin (or use
   `COOKIE_SAME_SITE=none` + HTTPS); the Vite dev proxy reproduces that locally.

---

## 10. Next phase

**Phase 6 — Resource directory**: public YouTube/article/GitHub/PDF links with
filters, save, ratings and reports. Promote `PersonalResource` into a moderated
public catalogue, then wire the dashboard's weak-topic cards and mock-test
`recommendations` into that catalogue so suggested links become interactive.
```

## `docs/PHASE5.md`

```markdown
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
```
