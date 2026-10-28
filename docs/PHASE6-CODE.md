# AlgoNest — Phase 6 complete source code

> Auto-generated from the working tree on 2026-10-28. Every file below exists verbatim in the repository. Files marked "modified" also contain Phase 1–5 code; Phase 6 additions are appended to the shared contracts and documented in [PHASE6.md](./PHASE6.md).

## Index

### Shared contracts (modified) (2 files)

- [`shared/src/constants.js`](#shared-src-constants-js)
- [`shared/src/schemas.js`](#shared-src-schemas-js)

### Server — pure resource engine (new) (4 files)

- [`server/src/modules/resources/resourceUrl.js`](#server-src-modules-resources-resourceurl-js)
- [`server/src/modules/resources/linkChecker.js`](#server-src-modules-resources-linkchecker-js)
- [`server/src/modules/resources/resourceWorkflow.js`](#server-src-modules-resources-resourceworkflow-js)
- [`server/src/modules/resources/analytics.js`](#server-src-modules-resources-analytics-js)

### Server — models (new) (6 files)

- [`server/src/models/Resource.js`](#server-src-models-resource-js)
- [`server/src/models/ResourceSave.js`](#server-src-models-resourcesave-js)
- [`server/src/models/ResourceReaction.js`](#server-src-models-resourcereaction-js)
- [`server/src/models/ResourceReport.js`](#server-src-models-resourcereport-js)
- [`server/src/models/ResourceEvent.js`](#server-src-models-resourceevent-js)
- [`server/src/models/CreatorProfile.js`](#server-src-models-creatorprofile-js)

### Server — services (new) (3 files)

- [`server/src/modules/resources/resource.service.js`](#server-src-modules-resources-resource-service-js)
- [`server/src/modules/resources/interaction.service.js`](#server-src-modules-resources-interaction-service-js)
- [`server/src/modules/resources/creator.service.js`](#server-src-modules-resources-creator-service-js)

### Server — controllers + routers + mount (6 files)

- [`server/src/modules/resources/resource.controller.js`](#server-src-modules-resources-resource-controller-js)
- [`server/src/modules/resources/interaction.controller.js`](#server-src-modules-resources-interaction-controller-js)
- [`server/src/modules/resources/creator.controller.js`](#server-src-modules-resources-creator-controller-js)
- [`server/src/modules/resources/resource.routes.js`](#server-src-modules-resources-resource-routes-js)
- [`server/src/modules/resources/creator.routes.js`](#server-src-modules-resources-creator-routes-js)
- [`server/src/routes/index.js`](#server-src-routes-index-js)

### Server — broken-link checker job (new) (1 files)

- [`server/scripts/checkResourceLinks.mjs`](#server-scripts-checkresourcelinks-mjs)

### Server — tests (new) (3 files)

- [`server/tests/resources.test.js`](#server-tests-resources-test-js)
- [`server/tests/resources.service.test.js`](#server-tests-resources-service-test-js)
- [`server/tests/resources.routes.test.js`](#server-tests-resources-routes-test-js)

### Phase 4/5 additive integrations (2 files)

- [`server/src/modules/mocks/mockAnalysis.service.js`](#server-src-modules-mocks-mockanalysis-service-js)
- [`client/src/features/dashboard/components/WeakTopicsCard.jsx`](#client-src-features-dashboard-components-weaktopicscard-jsx)

### Client — shared wiring (modified) (4 files)

- [`client/src/lib/queryKeys.js`](#client-src-lib-querykeys-js)
- [`client/src/lib/navigation.js`](#client-src-lib-navigation-js)
- [`client/src/app/router.jsx`](#client-src-app-router-jsx)
- [`client/scripts/smokeRender.mjs`](#client-scripts-smokerender-mjs)

### Client — resources api / hooks / lib (new) (4 files)

- [`client/src/features/resources/api/resourceApi.js`](#client-src-features-resources-api-resourceapi-js)
- [`client/src/features/resources/api/creatorApi.js`](#client-src-features-resources-api-creatorapi-js)
- [`client/src/features/resources/hooks/useResources.js`](#client-src-features-resources-hooks-useresources-js)
- [`client/src/features/resources/lib/resourceUtils.js`](#client-src-features-resources-lib-resourceutils-js)

### Client — resources components (new) (16 files)

- [`client/src/features/resources/components/ResourceFilters.jsx`](#client-src-features-resources-components-resourcefilters-jsx)
- [`client/src/features/resources/components/LinkStatusBadge.jsx`](#client-src-features-resources-components-linkstatusbadge-jsx)
- [`client/src/features/resources/components/ResourceCard.jsx`](#client-src-features-resources-components-resourcecard-jsx)
- [`client/src/features/resources/components/StarRating.jsx`](#client-src-features-resources-components-starrating-jsx)
- [`client/src/features/resources/components/HelpfulVote.jsx`](#client-src-features-resources-components-helpfulvote-jsx)
- [`client/src/features/resources/components/DuplicateWarning.jsx`](#client-src-features-resources-components-duplicatewarning-jsx)
- [`client/src/features/resources/components/ResourceSubmitForm.jsx`](#client-src-features-resources-components-resourcesubmitform-jsx)
- [`client/src/features/resources/components/ReviewList.jsx`](#client-src-features-resources-components-reviewlist-jsx)
- [`client/src/features/resources/components/ReportDialog.jsx`](#client-src-features-resources-components-reportdialog-jsx)
- [`client/src/features/resources/components/ResourceDetail.jsx`](#client-src-features-resources-components-resourcedetail-jsx)
- [`client/src/features/resources/components/ResourceModerationPanel.jsx`](#client-src-features-resources-components-resourcemoderationpanel-jsx)
- [`client/src/features/resources/components/ReportQueue.jsx`](#client-src-features-resources-components-reportqueue-jsx)
- [`client/src/features/resources/components/CreatorCard.jsx`](#client-src-features-resources-components-creatorcard-jsx)
- [`client/src/features/resources/components/CreatorProfileForm.jsx`](#client-src-features-resources-components-creatorprofileform-jsx)
- [`client/src/features/resources/components/CreatorAnalytics.jsx`](#client-src-features-resources-components-creatoranalytics-jsx)
- [`client/src/features/resources/components/CreatorHero.jsx`](#client-src-features-resources-components-creatorhero-jsx)

### Client — resources pages (new) (5 files)

- [`client/src/features/resources/pages/ResourcesPage.jsx`](#client-src-features-resources-pages-resourcespage-jsx)
- [`client/src/features/resources/pages/ResourceDetailPage.jsx`](#client-src-features-resources-pages-resourcedetailpage-jsx)
- [`client/src/features/resources/pages/ResourceEditorPage.jsx`](#client-src-features-resources-pages-resourceeditorpage-jsx)
- [`client/src/features/resources/pages/CreatorsPage.jsx`](#client-src-features-resources-pages-creatorspage-jsx)
- [`client/src/features/resources/pages/CreatorPage.jsx`](#client-src-features-resources-pages-creatorpage-jsx)

### Configuration (3 files)

- [`package.json`](#package-json)
- [`server/package.json`](#server-package-json)
- [`server/.env.example`](#server-env-example)

### Documentation (2 files)

- [`README.md`](#readme-md)
- [`docs/PHASE6.md`](#docs-phase6-md)


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

/* ─────────────────── Phase 6: Resource directory + creators ─────────────────── */

export const RESOURCE_STATUSES = SHEET_STATUSES;
export const RESOURCE_STATUS_VALUES = SHEET_STATUS_VALUES;
export const RESOURCE_STATUS_LABELS = SHEET_STATUS_LABELS;

export const RESOURCE_LEVELS = Object.freeze({
  BEGINNER: 'beginner', INTERMEDIATE: 'intermediate', ADVANCED: 'advanced',
});
export const RESOURCE_LEVEL_VALUES = Object.freeze(Object.values(RESOURCE_LEVELS));
export const RESOURCE_LEVEL_LABELS = Object.freeze({
  beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
});

/** `agnostic` covers maths, theory, system design and language-free content. */
export const RESOURCE_LANGUAGE_AGNOSTIC = 'agnostic';
export const RESOURCE_LANGUAGE_VALUES = Object.freeze([...PREFERRED_LANGUAGES, RESOURCE_LANGUAGE_AGNOSTIC]);
export const RESOURCE_LANGUAGE_LABELS = Object.freeze({
  ...PREFERRED_LANGUAGE_LABELS, agnostic: 'Language agnostic',
});

export const RESOURCE_PRICING = Object.freeze({ FREE: 'free', PAID: 'paid', FREEMIUM: 'freemium' });
export const RESOURCE_PRICING_VALUES = Object.freeze(Object.values(RESOURCE_PRICING));
export const RESOURCE_PRICING_LABELS = Object.freeze({
  free: 'Free', paid: 'Paid', freemium: 'Freemium',
});

export const RESOURCE_LINK_STATUSES = Object.freeze({
  UNCHECKED: 'unchecked', OK: 'ok', BROKEN: 'broken', UNKNOWN: 'unknown',
});
export const RESOURCE_LINK_STATUS_VALUES = Object.freeze(Object.values(RESOURCE_LINK_STATUSES));
export const RESOURCE_LINK_STATUS_LABELS = Object.freeze({
  unchecked: 'Not checked yet', ok: 'Link works', broken: 'Broken link', unknown: 'Could not verify',
});

export const RESOURCE_EVENT_TYPES = Object.freeze({
  VIEW: 'view', SAVE: 'save', START: 'start', COMPLETION: 'completion',
});
export const RESOURCE_EVENT_TYPE_VALUES = Object.freeze(Object.values(RESOURCE_EVENT_TYPES));

export const RESOURCE_SORT_OPTIONS = Object.freeze(['newest', 'oldest', 'popular', 'rating', 'title']);
export const RESOURCE_SAVED_SORTS = Object.freeze(['saved', 'newest']);

export const RESOURCE_LIMITS = Object.freeze({
  MAX_TITLE: 160,
  MAX_DESCRIPTION: 2000,
  MAX_URL: 2000,
  MAX_TAGS: 12,
  MAX_TAG_LENGTH: 32,
  MAX_REVIEW: 1000,
  MAX_REPORT_DETAILS: 1000,
  MAX_BIO: 600,
  MAX_HEADLINE: 140,
  MAX_EXPERTISE: 12,
  MAX_SOCIALS: 5,
  MAX_LINK_CHECK_BATCH: 100,
  LINK_CHECK_TIMEOUT_MS: 8_000,
  LINK_CHECK_MAX_REDIRECTS: 2,
  LINK_CHECK_MAX_BYTES: 64 * 1024,
  /** Consecutive failures before a resource is flagged broken. */
  LINK_CHECK_FAILURE_THRESHOLD: 2,
  /** Skip re-checking a healthy link more often than this (hours). */
  LINK_CHECK_INTERVAL_HOURS: 24,
  MAX_TRENDING: 8,
});

export const CREATOR_LIMITS = Object.freeze({
  MAX_DISPLAY_NAME: 60,
  MAX_WEBSITE: 300,
  MAX_SOCIAL_URL: 300,
  ANALYTICS_DAYS: 30,
  TOP_RESOURCES: 8,
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
  CREATOR_LIMITS,
  REPORT_STATUS_VALUES,
  RESOURCE_EVENT_TYPE_VALUES,
  RESOURCE_LANGUAGE_VALUES,
  RESOURCE_LEVEL_VALUES,
  RESOURCE_LIMITS,
  RESOURCE_PRICING_VALUES,
  RESOURCE_SORT_OPTIONS,
  RESOURCE_STATUS_VALUES,
  SHEET_TOPICS,
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

/* ─────────────── Phase 6: Resource directory contracts ─────────────── */

/** Strict http(s)-only URL. `resourceUrl.js` normalises it before storage. */
export const resourceUrlSchema = z
  .string()
  .trim()
  .min(8, 'Enter a full link')
  .max(RESOURCE_LIMITS.MAX_URL)
  .url('Enter a valid URL')
  .refine((value) => /^https?:\/\//i.test(value), 'Only http and https links are allowed');

const resourceTitleSchema = z.string().trim().min(4, 'Title must be at least 4 characters').max(RESOURCE_LIMITS.MAX_TITLE);
const resourceTagsSchema = z.array(z.string().trim().min(1).max(RESOURCE_LIMITS.MAX_TAG_LENGTH)).max(RESOURCE_LIMITS.MAX_TAGS);

export const resourceCreateSchema = z
  .object({
    title: resourceTitleSchema,
    url: resourceUrlSchema,
    description: z.string().trim().max(RESOURCE_LIMITS.MAX_DESCRIPTION).default(''),
    type: z.enum(RESOURCE_TYPE_VALUES).default('article'),
    topic: z.string().trim().min(1).max(60).default('General'),
    level: z.enum(RESOURCE_LEVEL_VALUES).default('beginner'),
    language: z.enum(RESOURCE_LANGUAGE_VALUES).default('agnostic'),
    pricing: z.enum(RESOURCE_PRICING_VALUES).default('free'),
    tags: resourceTagsSchema.default([]),
    /** Submit immediately for review, or keep as an editable draft. */
    submit: z.boolean().default(false),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.type === 'pdf' && !/\.pdf(\?|$)/i.test(value.url) && !/^https?:\/\//i.test(value.url)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['url'], message: 'Provide a direct PDF link' });
    }
  });

export const resourceUpdateSchema = z
  .object({
    title: resourceTitleSchema.optional(),
    url: resourceUrlSchema.optional(),
    description: z.string().trim().max(RESOURCE_LIMITS.MAX_DESCRIPTION).optional(),
    type: z.enum(RESOURCE_TYPE_VALUES).optional(),
    topic: z.string().trim().min(1).max(60).optional(),
    level: z.enum(RESOURCE_LEVEL_VALUES).optional(),
    language: z.enum(RESOURCE_LANGUAGE_VALUES).optional(),
    pricing: z.enum(RESOURCE_PRICING_VALUES).optional(),
    tags: resourceTagsSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const resourceListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    q: z.string().trim().max(100).optional(),
    topic: z.string().trim().max(60).optional(),
    level: z.enum(RESOURCE_LEVEL_VALUES).optional(),
    language: z.enum(RESOURCE_LANGUAGE_VALUES).optional(),
    type: z.enum(RESOURCE_TYPE_VALUES).optional(),
    pricing: z.enum(RESOURCE_PRICING_VALUES).optional(),
    platform: z.enum(PLATFORM_VALUES).optional(),
    linkStatus: z.enum(['ok', 'broken', 'unknown', 'unchecked']).optional(),
    status: z.enum(RESOURCE_STATUS_VALUES).optional(),
    sort: z.enum(RESOURCE_SORT_OPTIONS).default('newest'),
    mine: z.enum(['true', 'false']).optional(),
    saved: z.enum(['true', 'false']).optional(),
  })
  .strict();

export const resourceDuplicateQuerySchema = z
  .object({ url: resourceUrlSchema })
  .strict();

export const resourceRatingSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5),
    review: z.string().trim().max(RESOURCE_LIMITS.MAX_REVIEW).default(''),
  })
  .strict();

export const resourceFeedbackSchema = z
  .object({
    /** `null` withdraws the vote. */
    helpful: z.boolean().nullable(),
  })
  .strict();

export const resourceReportSchema = z
  .object({
    reason: z.enum(REPORT_REASON_VALUES),
    details: z.string().trim().min(10, 'Describe the problem in at least 10 characters').max(RESOURCE_LIMITS.MAX_REPORT_DETAILS),
  })
  .strict();

export const resourceReportParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const resourceReportListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(20),
    status: z.enum(REPORT_STATUS_VALUES).optional(),
  })
  .strict();

export const resourceReportResolveSchema = z
  .object({
    status: z.enum(['resolved', 'dismissed']),
    note: z.string().trim().max(1000).default(''),
  })
  .strict();

export const resourceEventSchema = z
  .object({
    type: z.enum(RESOURCE_EVENT_TYPE_VALUES),
  })
  .strict();

export const resourceLinkCheckQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH).default(20),
    /** Force re-check even if the link was checked recently. */
    force: z.enum(['true', 'false']).default('false'),
  })
  .strict();

export const creatorProfileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(CREATOR_LIMITS.MAX_DISPLAY_NAME),
    headline: z.string().trim().max(CREATOR_LIMITS.MAX_HEADLINE).default(''),
    bio: z.string().trim().max(CREATOR_LIMITS.MAX_BIO).default(''),
    website: z.union([z.string().trim().url().max(CREATOR_LIMITS.MAX_WEBSITE), z.literal('')]).default(''),
    expertise: z.array(z.enum(SHEET_TOPICS)).max(CREATOR_LIMITS.MAX_EXPERTISE).default([]),
    socials: z.array(z.object({
      label: z.string().trim().min(1).max(24),
      url: z.string().trim().url().max(CREATOR_LIMITS.MAX_SOCIAL_URL),
    }).strict()).max(CREATOR_LIMITS.MAX_SOCIALS).default([]),
  })
  .strict();

export const creatorParamsSchema = z.object({ id: mongoIdSchema }).strict();
export const creatorListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    q: z.string().trim().max(80).optional(),
  })
  .strict();

export const creatorAnalyticsQuerySchema = z
  .object({
    days: z.coerce.number().int().min(1).max(90).default(CREATOR_LIMITS.ANALYTICS_DAYS),
  })
  .strict();

export const resourceReportItemParamsSchema = z.object({ reportId: mongoIdSchema }).strict();
export const resourceRatingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).strict();
export const resourceSavedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
  sort: z.enum(RESOURCE_SORT_OPTIONS).default('newest'),
}).strict();
export const creatorGetQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(50).default(12),
}).strict();
```

---

# Server — pure resource engine (new)

## `server/src/modules/resources/resourceUrl.js`

```js
import { normaliseUrl, detectPlatform } from '../sheets/platformDetector.js';
import { canonicalUrlKey } from '../../utils/slug.js';

/**
 * Pure URL helpers for the public resource directory.
 *
 * SECURITY: nothing here ever fetches a link. We only parse host + pathname,
 * so duplicate detection cannot be used for SSRF or to probe the internal
 * network. `normaliseUrl` already rejects non-http(s) schemes.
 */

/** Stable identity of a link, ignoring tracking params / fragments / www / case. */
export function urlKeyFor(rawUrl) {
  const detected = detectPlatform(String(rawUrl ?? ''));
  if (!detected.valid) return '';
  // externalId preserves YouTube's ?v= so distinct videos never collapse.
  return detected.externalId || canonicalUrlKey(detected.url);
}

/** Normalised, storage-ready link plus platform metadata. */
export function normaliseForStorage(rawUrl) {
  const detected = detectPlatform(String(rawUrl ?? ''));
  if (!detected.valid) {
    const error = new Error(detected.reason || 'Invalid URL');
    error.code = 'INVALID_URL';
    throw error;
  }
  let parsed;
  try { parsed = new URL(detected.url); } catch { parsed = null; }
  return {
    url: detected.url,
    urlKey: detected.externalId || canonicalUrlKey(detected.url),
    platform: detected.platform,
    platformLabel: detected.platformLabel,
    host: parsed?.hostname?.toLowerCase().replace(/^www\./, '') ?? detected.platformHost ?? '',
  };
}

/** True when two raw links resolve to the same canonical identity. */
export function areDuplicate(rawA, rawB) {
  const a = urlKeyFor(rawA);
  const b = urlKeyFor(rawB);
  return Boolean(a && b && a === b);
}

/** Safe, human-readable display host for cards (never an executable href). */
export function displayHost(rawUrl) {
  try {
    const url = new URL(normaliseUrl(String(rawUrl)));
    return url.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Validate a URL without touching the network — used by Zod refinements. */
export function isHttpUrl(rawUrl) {
  try {
    const url = new URL(String(rawUrl).trim());
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default urlKeyFor;
```

## `server/src/modules/resources/linkChecker.js`

```js
import dns from 'node:dns/promises';
import { RESOURCE_LIMITS, RESOURCE_LINK_STATUSES as L } from '@algonest/shared';

/**
 * SSRF-safe broken-link checker.
 *
 * Submissions are untrusted input. Before any network call we:
 *   1. allow only http/https on ports 80/443 and reject credentials in the URL;
 *   2. resolve every A/AAAA record and reject loopback, private, link-local,
 *      multicast, reserved and unspecified ranges (IPv4 + IPv6);
 *   3. re-validate each redirect hop with the same rules (max 2 hops);
 *   4. abort after a short timeout and never read a response body.
 *
 * The `fetchImpl` / `lookupImpl` injections make the whole thing unit-testable
 * without a network. Default fetch uses `redirect: 'manual'` so we control hops.
 */

const ipv4Ranges = [
  [/^0\./, 'unspecified'], [/^127\./, 'loopback'], [/^10\./, 'private'],
  [/^169\.254\./, 'link-local'], [/^172\.(1[6-9]|2\d|3[01])\./, 'private'],
  [/^192\.168\./, 'private'], [/^192\.0\.0\./, 'reserved'], [/^192\.0\.2\./, 'documentation'],
  [/^198\.18\./, 'benchmark'], [/^198\.51\.100\./, 'documentation'],
  [/^203\.0\.113\./, 'documentation'], [/^224\./, 'multicast'],
  [/^(22[4-9]|23\d)\./, 'multicast'], [/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, 'cgnat'],
  [/^(24\d|25[0-5])\./, 'reserved'],
];

export function isPrivateIp(ip) {
  const value = String(ip ?? '').trim().toLowerCase();
  if (!value) return true;
  if (value === '::1' || value === '::' || value === '0:0:0:0:0:0:0:1' || value === '0:0:0:0:0:0:0:0') return true;
  if (value.startsWith('::ffff:')) return isPrivateIp(value.slice(7));
  if (value.startsWith('fc') || value.startsWith('fd')) return true; // IPv6 ULA
  if (value.startsWith('fe8') || value.startsWith('fe9') || value.startsWith('fea') || value.startsWith('feb')) return true; // link-local
  if (value.startsWith('ff')) return true; // multicast
  if (value.includes(':')) return false; // other global IPv6
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return true;
  for (const [pattern] of ipv4Ranges) if (pattern.test(value)) return true;
  const parts = value.split('.').map(Number);
  return parts.some((part) => part > 255) || parts[3] === 255 || parts[0] >= 240;
}

export function assertSafeTarget(rawUrl) {
  const url = new URL(String(rawUrl ?? ''));
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http(s) links can be checked');
  if (url.username || url.password) throw new Error('Links with credentials are not allowed');
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Only ports 80 and 443 are allowed');
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new Error('Local hostnames are not allowed');
  }
  // A literal IP in the URL still has to pass the private-range check.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':')) {
    if (isPrivateIp(host.replace(/^\[|\]$/g, ''))) throw new Error('Private network addresses are not allowed');
  }
  return url;
}

/** Resolve DNS and reject the whole target if ANY answer is a private address. */
export async function validateDns(hostname, lookupImpl = dns.lookup.bind(dns)) {
  const answers = await lookupImpl(hostname, { all: true, verbatim: true });
  const list = Array.isArray(answers) ? answers : [answers];
  if (!list.length) throw new Error('Host did not resolve');
  for (const answer of list) {
    const ip = typeof answer === 'string' ? answer : answer.address;
    if (isPrivateIp(ip)) throw new Error('Host resolves to a private address');
  }
  return list.map((answer) => (typeof answer === 'string' ? answer : answer.address));
}

function classifyHttpStatus(code) {
  if (code >= 200 && code < 300) return L.OK;
  if (code === 404 || code === 410 || code === 451) return L.BROKEN;
  return L.UNKNOWN; // 401/403/429/5xx are inconclusive, not proof of a dead link
}

/**
 * Probe one URL. Never throws for network problems — returns a result object
 * so a batch job can continue with the next resource.
 */
export async function checkLink(rawUrl, {
  fetchImpl = globalThis.fetch,
  lookupImpl = dns.lookup.bind(dns),
  timeoutMs = RESOURCE_LIMITS.LINK_CHECK_TIMEOUT_MS,
  maxRedirects = RESOURCE_LIMITS.LINK_CHECK_MAX_REDIRECTS,
  userAgent = 'AlgoNest-LinkChecker/1.0 (+https://algonest.dev)',
  now = new Date(),
} = {}) {
  const checkedAt = now instanceof Date ? now : new Date(now);
  let current = String(rawUrl ?? '');
  try {
    for (let hop = 0; hop <= maxRedirects; hop += 1) {
      const target = assertSafeTarget(current);
      await validateDns(target.hostname, lookupImpl);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let response;
      try {
        response = await fetchImpl(target.toString(), {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: {
            'User-Agent': userAgent,
            Accept: 'text/html,application/pdf,application/json;q=0.9,*/*;q=0.8',
            Range: 'bytes=0-0',
          },
        });
        // We never need the body; release the socket immediately.
        await response.body?.cancel?.().catch?.(() => {});
      } finally {
        clearTimeout(timer);
      }
      const status = Number(response.status) || 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        const location = response.headers?.get?.('location');
        if (!location) return { status: L.UNKNOWN, httpStatus: status, checkedAt, reason: 'Redirect without a Location header', hops: hop, finalUrl: current };
        if (hop >= maxRedirects) return { status: L.UNKNOWN, httpStatus: status, checkedAt, reason: 'Too many redirects', hops: hop, finalUrl: current };
        current = new URL(location, target).toString();
        continue;
      }
      return {
        status: classifyHttpStatus(status), httpStatus: status, checkedAt,
        reason: status >= 200 && status < 300 ? 'OK' : `HTTP ${status}`,
        hops: hop, finalUrl: current,
      };
    }
    return { status: L.UNKNOWN, httpStatus: 0, checkedAt, reason: 'Redirect loop', hops: maxRedirects, finalUrl: current };
  } catch (error) {
    return {
      status: L.UNKNOWN, httpStatus: 0, checkedAt,
      reason: error?.name === 'AbortError' ? 'Timed out' : (error?.message || 'Check failed'),
      hops: 0, finalUrl: current,
    };
  }
}

/**
 * Fold a fresh probe into a resource's persisted link state. Pure.
 * A single inconclusive result never marks a link broken: `threshold`
 * consecutive failures are required, so a transient 503 is harmless.
 */
export function classify(previous = {}, result, threshold = RESOURCE_LIMITS.LINK_CHECK_FAILURE_THRESHOLD) {
  const failed = result.status === L.BROKEN || result.status === L.UNKNOWN;
  const consecutiveFailures = failed ? (Number(previous.consecutiveFailures) || 0) + 1 : 0;
  const broken = failed && consecutiveFailures >= threshold;
  return {
    linkStatus: result.status === L.OK ? L.OK : broken ? L.BROKEN : L.UNKNOWN,
    linkHttpStatus: result.httpStatus ?? null,
    linkCheckedAt: result.checkedAt ?? new Date(),
    linkCheckError: failed ? (result.reason || 'Check failed') : '',
    linkCheckHops: result.hops ?? 0,
    consecutiveFailures,
    flagged: broken && previous.linkStatus !== L.BROKEN,
  };
}

/** Candidates for a batch: published links that are due for a re-check. */
export function selectCandidates(resources = [], { now = new Date(), force = false, limit = RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH } = {}) {
  const cutoff = new Date(now).getTime() - RESOURCE_LIMITS.LINK_CHECK_INTERVAL_HOURS * 3_600_000;
  return [...resources]
    .filter((resource) => resource?.url && resource.status === 'published')
    .filter((resource) => force || !resource.linkCheckedAt || new Date(resource.linkCheckedAt).getTime() <= cutoff)
    .sort((a, b) => {
      const rank = (item) => (item.linkStatus === 'broken' ? 0 : item.linkStatus === 'unknown' ? 1 : 2);
      return rank(a) - rank(b) || new Date(a.linkCheckedAt ?? 0) - new Date(b.linkCheckedAt ?? 0);
    })
    .slice(0, Math.max(1, Math.min(limit, RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH)));
}

export default checkLink;
```

## `server/src/modules/resources/resourceWorkflow.js`

```js
import { MODERATION_DECISIONS, RESOURCE_STATUSES as S } from '@algonest/shared';

/** Same lifecycle as sheets/quizzes/mocks — consistent moderation UI. */
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
  return `Cannot move a resource from "${from}" to "${to}". Allowed next states: ${(TRANSITIONS[from] ?? []).join(', ') || 'none'}.`;
}

export function isEditable(status) {
  return EDITABLE_STATUSES.includes(status);
}

export function isStaff(actor) {
  return Boolean(actor?.permissions?.length);
}

export default canTransition;
```

## `server/src/modules/resources/analytics.js`

```js
import mongoose from 'mongoose';
import { RESOURCE_EVENT_TYPES as E } from '@algonest/shared';
import { Resource } from '../../models/Resource.js';
import { ResourceEvent } from '../../models/ResourceEvent.js';

const { Types } = mongoose;

const COUNTER = {
  [E.VIEW]: 'viewCount',
  [E.SAVE]: 'saveCount',
  [E.START]: 'startCount',
  [E.COMPLETION]: 'completionCount',
};

/**
 * Write one analytics fact and bump the denormalised counter atomically.
 * `view` is deduplicated per (resource, user, day) by a partial unique index;
 * a duplicate insert is swallowed so a page refresh cannot inflate numbers.
 */
export async function recordEvent(resource, type, actor, now = new Date()) {
  const counter = COUNTER[type];
  if (!counter || !resource?._id) return { recorded: false, reason: 'unknown event' };
  const dayKey = new Date(now).toISOString().slice(0, 10);
  try {
    await ResourceEvent.create({
      resource: resource._id,
      creator: resource.author?._id ?? resource.author,
      user: actor?.id ? new Types.ObjectId(actor.id) : null,
      type,
      dayKey,
    });
  } catch (error) {
    if (error?.code === 11000 && type === E.VIEW) return { recorded: false, reason: 'duplicate view' };
    throw error;
  }
  await Resource.updateOne({ _id: resource._id }, { $inc: { [counter]: 1 } });
  return { recorded: true, type, dayKey };
}

/** Aggregate an array of raw events into totals + a daily series. Pure. */
export function summariseEvents(events = [], days = 30, now = new Date()) {
  const totals = { view: 0, save: 0, start: 0, completion: 0 };
  const perResource = new Map();
  const seriesMap = new Map();
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  for (let index = days - 1; index >= 0; index -= 1) {
    const key = new Date(start.getTime() - index * 86_400_000).toISOString().slice(0, 10);
    seriesMap.set(key, { date: key, view: 0, save: 0, start: 0, completion: 0 });
  }
  for (const event of events) {
    const type = event.type;
    if (!(type in totals)) continue;
    totals[type] += 1;
    const row = seriesMap.get(event.dayKey);
    if (row) row[type] += 1;
    const key = String(event.resource);
    const stat = perResource.get(key) ?? { resource: key, view: 0, save: 0, start: 0, completion: 0, total: 0 };
    stat[type] += 1;
    stat.total += 1;
    perResource.set(key, stat);
  }
  return {
    totals,
    series: [...seriesMap.values()],
    topResources: [...perResource.values()].sort((a, b) => b.total - a.total).slice(0, 8),
  };
}

export default recordEvent;
```

---

# Server — models (new)

## `server/src/models/Resource.js`

```js
import mongoose from 'mongoose';
import {
  PLATFORM_VALUES, RESOURCE_LANGUAGE_VALUES, RESOURCE_LEVEL_VALUES,
  RESOURCE_LINK_STATUS_VALUES, RESOURCE_PRICING_VALUES, RESOURCE_STATUS_VALUES,
  RESOURCE_TYPE_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

const reviewEntrySchema = new Schema(
  {
    from: { type: String, enum: RESOURCE_STATUS_VALUES },
    to: { type: String, enum: RESOURCE_STATUS_VALUES, required: true },
    by: { type: Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    decision: { type: String, maxlength: 40, default: '' },
    note: { type: String, maxlength: 1000, default: '' },
  },
  { _id: false, versionKey: false },
);

/**
 * PUBLIC, MODERATED resource directory entry. Deliberately separate from
 * PersonalResource (Phase 2), which stays a private, unmoderated link library.
 * `urlKey` is the canonical dedupe identity from resourceUrl.js.
 */
const resourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 180 },
    url: { type: String, required: true, trim: true, maxlength: 2000 },
    urlKey: { type: String, required: true, trim: true, lowercase: true, maxlength: 2000, index: true },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    type: { type: String, enum: RESOURCE_TYPE_VALUES, default: 'article', index: true },
    topic: { type: String, trim: true, maxlength: 60, default: 'General', index: true },
    level: { type: String, enum: RESOURCE_LEVEL_VALUES, default: 'beginner', index: true },
    language: { type: String, enum: RESOURCE_LANGUAGE_VALUES, default: 'agnostic', index: true },
    pricing: { type: String, enum: RESOURCE_PRICING_VALUES, default: 'free', index: true },
    tags: { type: [String], default: [] },
    platform: { type: String, enum: PLATFORM_VALUES, default: 'generic' },
    platformLabel: { type: String, default: 'Other' },
    host: { type: String, default: '' },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: RESOURCE_STATUS_VALUES, default: 'draft', index: true },
    submittedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    reviewedBy: { type: Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, maxlength: 1000, default: '' },
    reviewHistory: { type: [reviewEntrySchema], default: [] },

    /** Denormalised aggregates — cheap catalogue lists, recomputed on write. */
    viewCount: { type: Number, default: 0, min: 0 },
    saveCount: { type: Number, default: 0, min: 0 },
    startCount: { type: Number, default: 0, min: 0 },
    completionCount: { type: Number, default: 0, min: 0 },
    ratingCount: { type: Number, default: 0, min: 0 },
    ratingSum: { type: Number, default: 0, min: 0 },
    helpfulCount: { type: Number, default: 0, min: 0 },
    notHelpfulCount: { type: Number, default: 0, min: 0 },
    reportCount: { type: Number, default: 0, min: 0 },

    /** Broken-link checker state (Phase 6 job). */
    linkStatus: { type: String, enum: RESOURCE_LINK_STATUS_VALUES, default: 'unchecked', index: true },
    linkHttpStatus: { type: Number, default: null },
    linkCheckedAt: { type: Date, default: null },
    linkCheckError: { type: String, maxlength: 300, default: '' },
    linkCheckHops: { type: Number, default: 0 },
    consecutiveFailures: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

resourceSchema.index({ title: 'text', description: 'text', tags: 'text', topic: 'text' }, {
  weights: { title: 8, topic: 5, tags: 3, description: 1 }, name: 'resource_text_search',
});
resourceSchema.index({ status: 1, publishedAt: -1 });
resourceSchema.index({ status: 1, topic: 1, level: 1 });
resourceSchema.index({ status: 1, type: 1, pricing: 1 });
resourceSchema.index({ author: 1, status: 1, updatedAt: -1 });
resourceSchema.index({ status: 1, saveCount: -1, ratingSum: -1 });
resourceSchema.index({ status: 1, linkStatus: 1, linkCheckedAt: 1 });
// Non-unique: duplicate rejection is enforced in the service so archived
// entries can legitimately share a URL with a newer submission.
resourceSchema.index({ urlKey: 1, status: 1 });

resourceSchema.statics.toPublic = function toPublic(doc, { myReaction = null, saved = false, canManage = false } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const author = plain.author && typeof plain.author === 'object' && plain.author.name
    ? { id: String(plain.author._id ?? plain.author.id), name: plain.author.name }
    : { id: String(plain.author ?? ''), name: 'AlgoNest creator' };
  const ratingCount = plain.ratingCount ?? 0;
  const ratingSum = plain.ratingSum ?? 0;
  const helpfulCount = plain.helpfulCount ?? 0;
  const notHelpfulCount = plain.notHelpfulCount ?? 0;
  return {
    id: String(plain._id),
    slug: plain.slug,
    title: plain.title,
    url: plain.url,
    urlKey: plain.urlKey,
    description: plain.description || '',
    type: plain.type,
    topic: plain.topic,
    level: plain.level,
    language: plain.language,
    pricing: plain.pricing,
    tags: plain.tags ?? [],
    platform: plain.platform,
    platformLabel: plain.platformLabel || 'Other',
    host: plain.host || '',
    author,
    status: plain.status,
    submittedAt: plain.submittedAt ?? null,
    publishedAt: plain.publishedAt ?? null,
    ratingAverage: ratingCount ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0,
    ratingCount,
    helpfulCount,
    notHelpfulCount,
    helpfulScore: helpfulCount - notHelpfulCount,
    viewCount: plain.viewCount ?? 0,
    saveCount: plain.saveCount ?? 0,
    startCount: plain.startCount ?? 0,
    completionCount: plain.completionCount ?? 0,
    linkStatus: plain.linkStatus ?? 'unchecked',
    linkHttpStatus: plain.linkHttpStatus ?? null,
    linkCheckedAt: plain.linkCheckedAt ?? null,
    linkCheckError: plain.linkCheckError || '',
    saved: Boolean(saved),
    myRating: myReaction?.rating ?? null,
    myHelpful: myReaction?.helpful ?? null,
    myReview: myReaction?.review || '',
    ...(canManage ? {
      reviewNote: plain.reviewNote || '',
      reviewedBy: plain.reviewedBy ? String(plain.reviewedBy) : null,
      reviewHistory: (plain.reviewHistory ?? []).slice(-10).map((entry) => ({
        from: entry.from, to: entry.to, by: String(entry.by), at: entry.at,
        decision: entry.decision || '', note: entry.note || '',
      })),
      reportCount: plain.reportCount ?? 0,
      consecutiveFailures: plain.consecutiveFailures ?? 0,
    } : {}),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
```

## `server/src/models/ResourceSave.js`

```js
import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

/** Per-user bookmark of a PUBLIC resource. One row per (user, resource). */
const resourceSaveSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

resourceSaveSchema.index({ user: 1, resource: 1 }, { unique: true, name: 'uniq_user_resource_save' });
resourceSaveSchema.index({ user: 1, createdAt: -1 });
resourceSaveSchema.index({ resource: 1, createdAt: -1 });

resourceSaveSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return { id: String(plain._id), resource: String(plain.resource), savedAt: plain.createdAt };
};

export const ResourceSave = mongoose.model('ResourceSave', resourceSaveSchema);
export default ResourceSave;
```

## `server/src/models/ResourceReaction.js`

```js
import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

/**
 * One reaction row per (user, resource): a 1–5 star rating (with optional
 * review) AND an independent helpful/not-helpful vote. Both are nullable, so
 * a learner can vote without rating and vice versa.
 */
const resourceReactionSchema = new Schema(
  {
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, trim: true, maxlength: 1000, default: '' },
    helpful: { type: Boolean, default: null },
  },
  { timestamps: true, versionKey: false },
);

resourceReactionSchema.index({ resource: 1, user: 1 }, { unique: true, name: 'uniq_user_resource_reaction' });
resourceReactionSchema.index({ resource: 1, rating: -1, createdAt: -1 });

resourceReactionSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const user = plain.user && typeof plain.user === 'object' && plain.user.name
    ? { id: String(plain.user._id ?? plain.user.id), name: plain.user.name }
    : { id: String(plain.user ?? ''), name: 'Student' };
  return {
    id: String(plain._id), user, resource: String(plain.resource),
    rating: plain.rating ?? null, review: plain.review || '',
    helpful: plain.helpful ?? null, createdAt: plain.createdAt, updatedAt: plain.updatedAt,
  };
};

export const ResourceReaction = mongoose.model('ResourceReaction', resourceReactionSchema);
export default ResourceReaction;
```

## `server/src/models/ResourceReport.js`

```js
import mongoose from 'mongoose';
import { REPORT_REASON_VALUES, REPORT_STATUS_VALUES } from '@algonest/shared';

const { Schema, Types } = mongoose;

/** User-submitted report; triaged by a CONTENT_MODERATE permission holder. */
const resourceReportSchema = new Schema(
  {
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
    reporter: { type: Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: REPORT_REASON_VALUES, required: true },
    details: { type: String, trim: true, maxlength: 1000, required: true },
    status: { type: String, enum: REPORT_STATUS_VALUES, default: 'open', index: true },
    handledBy: { type: Types.ObjectId, ref: 'User', default: null },
    resolutionNote: { type: String, trim: true, maxlength: 1000, default: '' },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

resourceReportSchema.index({ status: 1, createdAt: -1 });
resourceReportSchema.index({ resource: 1, reporter: 1, status: 1 });

resourceReportSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const pick = (value, fallback = 'Student') => value && typeof value === 'object' && value.name
    ? { id: String(value._id ?? value.id), name: value.name }
    : value ? { id: String(value), name: fallback } : null;
  return {
    id: String(plain._id),
    resource: plain.resource && typeof plain.resource === 'object'
      ? { id: String(plain.resource._id), title: plain.resource.title, url: plain.resource.url }
      : String(plain.resource),
    reporter: pick(plain.reporter),
    reason: plain.reason, details: plain.details || '', status: plain.status,
    handledBy: pick(plain.handledBy, 'Moderator'),
    resolutionNote: plain.resolutionNote || '', resolvedAt: plain.resolvedAt ?? null,
    createdAt: plain.createdAt,
  };
};

export const ResourceReport = mongoose.model('ResourceReport', resourceReportSchema);
export default ResourceReport;
```

## `server/src/models/ResourceEvent.js`

```js
import mongoose from 'mongoose';
import { RESOURCE_EVENT_TYPE_VALUES } from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * Append-only analytics fact. Counters on Resource are a denormalised fast
 * path for catalogue sorting; this collection is the source of truth for the
 * creator time-series. `dayKey` is a UTC YYYY-MM-DD string (no DST drift).
 */
const resourceEventSchema = new Schema(
  {
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
    creator: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    user: { type: Types.ObjectId, ref: 'User', default: null },
    type: { type: String, enum: RESOURCE_EVENT_TYPE_VALUES, required: true, index: true },
    dayKey: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { timestamps: true, versionKey: false },
);

resourceEventSchema.index({ creator: 1, dayKey: 1, type: 1 });
resourceEventSchema.index({ resource: 1, dayKey: 1, type: 1 });
resourceEventSchema.index({ createdAt: -1 });
// At most one `view` per user per resource per UTC day — prevents refresh spam.
resourceEventSchema.index(
  { resource: 1, user: 1, type: 1, dayKey: 1 },
  { unique: true, partialFilterExpression: { type: 'view' }, name: 'uniq_daily_resource_view' },
);

export const ResourceEvent = mongoose.model('ResourceEvent', resourceEventSchema);
export default ResourceEvent;
```

## `server/src/models/CreatorProfile.js`

```js
import mongoose from 'mongoose';
import { CREATOR_LIMITS, SHEET_TOPICS } from '@algonest/shared';

const { Schema, Types } = mongoose;

const socialSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 24 },
    url: { type: String, required: true, trim: true, maxlength: CREATOR_LIMITS.MAX_SOCIAL_URL },
  },
  { _id: false, versionKey: false },
);

/** Public creator page. One per user, created lazily on first edit or read. */
const creatorProfileSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    displayName: { type: String, required: true, trim: true, maxlength: CREATOR_LIMITS.MAX_DISPLAY_NAME },
    headline: { type: String, trim: true, maxlength: CREATOR_LIMITS.MAX_HEADLINE, default: '' },
    bio: { type: String, trim: true, maxlength: CREATOR_LIMITS.MAX_BIO, default: '' },
    website: { type: String, trim: true, maxlength: CREATOR_LIMITS.MAX_WEBSITE, default: '' },
    expertise: { type: [{ type: String, enum: SHEET_TOPICS }], default: [] },
    socials: { type: [socialSchema], default: [] },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

creatorProfileSchema.index({ displayName: 'text', headline: 'text' }, { weights: { displayName: 5, headline: 2 }, name: 'creator_text_search' });

creatorProfileSchema.statics.toPublic = function toPublic(doc, { stats = null, resources = null, isOwner = false } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const user = plain.user && typeof plain.user === 'object' && plain.user.name
    ? { id: String(plain.user._id ?? plain.user.id), name: plain.user.name }
    : { id: String(plain.user ?? ''), name: plain.displayName };
  return {
    id: String(plain._id),
    user,
    displayName: plain.displayName,
    headline: plain.headline || '',
    bio: plain.bio || '',
    website: plain.website || '',
    expertise: plain.expertise ?? [],
    socials: (plain.socials ?? []).map((entry) => ({ label: entry.label, url: entry.url })),
    verified: Boolean(plain.verified),
    isOwner,
    stats,
    resources,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
```

---

# Server — services (new)

## `server/src/modules/resources/resource.service.js`

```js
import mongoose from 'mongoose';
import {
  PERMISSIONS, RESOURCE_STATUS_VALUES, RESOURCE_STATUSES as S, ROLES,
} from '@algonest/shared';
import { Resource } from '../../models/Resource.js';
import { ResourceSave } from '../../models/ResourceSave.js';
import { ResourceReaction } from '../../models/ResourceReaction.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { uniqueSlug } from '../../utils/slug.js';
import { normaliseForStorage, urlKeyFor } from './resourceUrl.js';
import { classify, checkLink, selectCandidates } from './linkChecker.js';
import { DECISION_TO_STATUS, canTransition, isEditable, isStaff, transitionError } from './resourceWorkflow.js';

const { Types } = mongoose;
const AUTHOR_FIELDS = 'name';
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isModerator = (actor) => actor.permissions?.includes(PERMISSIONS.CONTENT_MODERATE) ?? false;
const ownerOf = (doc, actor) => String(doc.author?._id ?? doc.author) === String(actor.id);
const canManage = (doc, actor) => ownerOf(doc, actor) || isModerator(actor);

function normaliseOr400(rawUrl) {
  try { return normaliseForStorage(rawUrl); }
  catch (error) { throw ApiError.unprocessable(error.message || 'Invalid URL'); }
}

function assertManage(doc, actor) {
  if (!canManage(doc, actor)) throw ApiError.forbidden('Only the author or a content moderator can change this resource');
}

async function findResource(id) {
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid resource id');
  const doc = await Resource.findById(id).populate('author', AUTHOR_FIELDS);
  if (!doc) throw ApiError.notFound('Resource not found');
  return doc;
}

function pushReview(doc, from, to, actor, decision, note) {
  doc.reviewHistory.push({
    from, to, by: new Types.ObjectId(actor.id), at: new Date(),
    decision: decision || '', note: note || '',
  });
  if (doc.reviewHistory.length > 20) doc.reviewHistory = doc.reviewHistory.slice(-20);
}

async function viewerState(resourceId, actor) {
  const userId = new Types.ObjectId(actor.id);
  const [save, reaction] = await Promise.all([
    ResourceSave.findOne({ resource: resourceId, user: userId }).lean(),
    ResourceReaction.findOne({ resource: resourceId, user: userId }).lean(),
  ]);
  return { saved: Boolean(save), myReaction: reaction };
}

/* ─────────────────────────── duplicate detection ─────────────────────────── */

/** Pure normalisation + DB lookup. Never fetches the URL. */
export async function checkDuplicate(rawUrl, actor, { excludeId = null } = {}) {
  const key = urlKeyFor(rawUrl);
  if (!key) throw ApiError.unprocessable('That link is not a valid http(s) URL');
  const filter = { urlKey: key, status: { $ne: S.ARCHIVED } };
  if (excludeId) filter._id = { $ne: new Types.ObjectId(excludeId) };
  const existing = await Resource.findOne(filter).select('title url status author publishedAt').lean();
  if (!existing) return { duplicate: false, resource: null, urlKey: key };
  // Only reveal the author's own duplicate to non-staff; staff/mod see details.
  const visible = ownerOf(existing, actor) || isModerator(actor) || existing.status === S.PUBLISHED;
  return {
    duplicate: true,
    urlKey: key,
    resource: visible
      ? { id: String(existing._id), title: existing.title, status: existing.status, url: existing.url }
      : { id: null, title: 'A submission with this link already exists', status: existing.status, url: null },
  };
}

async function assertNoDuplicate(rawUrl, actor, excludeId = null) {
  const result = await checkDuplicate(rawUrl, actor, { excludeId });
  if (result.duplicate) {
    throw ApiError.conflict(`This link is already in the directory${result.resource?.id ? ` as "${result.resource.title}"` : ''}. Submit a different URL.`);
  }
  return result.urlKey;
}

/* ─────────────────────────── list / read ─────────────────────────── */

export async function listResources(query, actor) {
  const filter = {};
  const savedIds = query.saved === 'true'
    ? (await ResourceSave.find({ user: new Types.ObjectId(actor.id) }).select('resource').lean()).map((row) => row.resource)
    : null;
  if (savedIds) {
    if (!savedIds.length) return { items: [], pagination: buildPagination(query.page, query.limit, 0) };
    filter._id = { $in: savedIds };
  }
  if (query.mine === 'true') {
    filter.author = new Types.ObjectId(actor.id);
    filter.status = query.status ?? { $ne: S.ARCHIVED };
  } else if (query.status && isModerator(actor)) {
    filter.status = query.status;
  } else {
    filter.status = S.PUBLISHED;
  }
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { tags: rx }, { topic: rx }];
  }
  for (const key of ['topic', 'level', 'language', 'type', 'pricing', 'platform', 'linkStatus']) {
    if (query[key]) filter[key] = query[key];
  }
  const sorts = {
    newest: { publishedAt: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { saveCount: -1, viewCount: -1, createdAt: -1 },
    rating: { ratingSum: -1, ratingCount: -1, createdAt: -1 },
    title: { title: 1 },
  };
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    Resource.find(filter).populate('author', AUTHOR_FIELDS).sort(sorts[query.sort] ?? sorts.newest)
      .skip((page - 1) * limit).limit(limit).lean(),
    Resource.countDocuments(filter),
  ]);
  const ids = items.map((item) => item._id);
  const [saves, reactions] = await Promise.all([
    ResourceSave.find({ user: new Types.ObjectId(actor.id), resource: { $in: ids } }).select('resource').lean().catch(() => []),
    ResourceReaction.find({ user: new Types.ObjectId(actor.id), resource: { $in: ids } }).lean().catch(() => []),
  ]);
  const savedSet = new Set(saves.map((row) => String(row.resource)));
  const reactionMap = new Map(reactions.map((row) => [String(row.resource), row]));
  return {
    items: items.map((doc) => Resource.toPublic(doc, {
      saved: savedSet.has(String(doc._id)),
      myReaction: reactionMap.get(String(doc._id)) ?? null,
      canManage: canManage(doc, actor),
    })),
    pagination: buildPagination(page, limit, total),
  };
}

/**
 * Detail + a deduplicated `view` event. Only published resources are publicly
 * readable; drafts stay with the author and moderators.
 */
export async function getResource(id, actor, { recordView = true } = {}) {
  const doc = await findResource(id);
  const manage = canManage(doc, actor);
  if (!manage && doc.status !== S.PUBLISHED) throw ApiError.notFound('Resource not found');
  const { saved, myReaction } = await viewerState(doc._id, actor);
  if (recordView && doc.status === S.PUBLISHED) {
    const { recordEvent } = await import('./analytics.js');
    await recordEvent(doc, 'view', actor).catch(() => {});
    doc.viewCount = (doc.viewCount ?? 0) + 1;
  }
  return { resource: Resource.toPublic(doc, { saved, myReaction, canManage: manage }) };
}

/* ─────────────────────────── create / update ─────────────────────────── */

export async function createResource(payload, actor) {
  const normalised = normaliseOr400(payload.url);
  await assertNoDuplicate(payload.url, actor);
  const status = payload.submit ? S.PENDING_REVIEW : S.DRAFT;
  const doc = await Resource.create({
    title: payload.title,
    slug: uniqueSlug(payload.title),
    url: normalised.url,
    urlKey: normalised.urlKey,
    description: payload.description,
    type: payload.type,
    topic: payload.topic,
    level: payload.level,
    language: payload.language,
    pricing: payload.pricing,
    tags: payload.tags,
    platform: normalised.platform,
    platformLabel: normalised.platformLabel,
    host: normalised.host,
    author: new Types.ObjectId(actor.id),
    status,
    submittedAt: status === S.PENDING_REVIEW ? new Date() : null,
  });
  const plain = doc.toObject();
  plain.author = { _id: new Types.ObjectId(actor.id), name: 'You' };
  return { resource: Resource.toPublic(plain, { canManage: true }) };
}

export async function updateResource(id, payload, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (!isEditable(doc.status) || doc.status === S.PUBLISHED) {
    throw ApiError.conflict(`A ${doc.status} resource cannot be edited. Start a revision first.`);
  }
  if (doc.status === S.ARCHIVED) throw ApiError.conflict('Restore the resource before editing it');
  if (payload.url) {
    const normalised = normaliseOr400(payload.url);
    await assertNoDuplicate(payload.url, actor, id);
    doc.url = normalised.url;
    doc.urlKey = normalised.urlKey;
    doc.platform = normalised.platform;
    doc.platformLabel = normalised.platformLabel;
    doc.host = normalised.host;
    // A changed link must be re-verified.
    doc.linkStatus = 'unchecked';
    doc.linkCheckedAt = null;
    doc.consecutiveFailures = 0;
  }
  for (const key of ['title', 'description', 'type', 'topic', 'level', 'language', 'pricing', 'tags']) {
    if (payload[key] !== undefined) doc[key] = payload[key];
  }
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

/* ─────────────────────────── lifecycle ─────────────────────────── */

export async function submitResource(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (!canTransition(doc.status, S.PENDING_REVIEW)) throw ApiError.conflict(transitionError(doc.status, S.PENDING_REVIEW));
  pushReview(doc, doc.status, S.PENDING_REVIEW, actor, 'submit', '');
  doc.status = S.PENDING_REVIEW;
  doc.submittedAt = new Date();
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function startRevision(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (doc.status !== S.PUBLISHED) throw ApiError.conflict('Only a published resource can start a revision');
  pushReview(doc, S.PUBLISHED, S.DRAFT, actor, 'revision', 'Started a new draft revision');
  doc.status = S.DRAFT;
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function moderateResource(id, decision, note, actor) {
  if (!isModerator(actor)) throw ApiError.forbidden('Moderation requires content:moderate permission');
  const doc = await findResource(id);
  if (ownerOf(doc, actor) && actor.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('You cannot moderate a resource you submitted');
  }
  if (doc.status !== S.PENDING_REVIEW) throw ApiError.conflict('Only resources in review can be moderated');
  const target = DECISION_TO_STATUS[decision];
  if (!target || !canTransition(doc.status, target)) throw ApiError.conflict(transitionError(doc.status, target));
  pushReview(doc, doc.status, target, actor, decision, note);
  doc.status = target;
  doc.reviewedBy = new Types.ObjectId(actor.id);
  doc.reviewNote = note || '';
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

/** Approve + publish are merged for resources: one click, one immutable-ish URL. */
export async function publishResource(id, actor, { autoPublish = false } = {}) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (autoPublish) {
    if (!isStaff(actor)) throw ApiError.forbidden('Direct publishing requires staff permission');
  } else if (doc.status !== S.APPROVED) {
    throw ApiError.conflict('A resource must be approved before it can be published');
  }
  if (doc.status === S.PUBLISHED) throw ApiError.conflict('Resource is already published');
  pushReview(doc, doc.status, S.PUBLISHED, actor, 'publish', '');
  doc.status = S.PUBLISHED;
  doc.publishedAt = new Date();
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function archiveResource(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (!canTransition(doc.status, S.ARCHIVED)) throw ApiError.conflict(transitionError(doc.status, S.ARCHIVED));
  pushReview(doc, doc.status, S.ARCHIVED, actor, 'archive', '');
  doc.status = S.ARCHIVED;
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

export async function restoreResource(id, actor) {
  const doc = await findResource(id);
  assertManage(doc, actor);
  if (doc.status !== S.ARCHIVED) throw ApiError.conflict('Only an archived resource can be restored');
  await assertNoDuplicate(doc.url, actor, id);
  pushReview(doc, S.ARCHIVED, S.DRAFT, actor, 'restore', '');
  doc.status = S.DRAFT;
  await doc.save();
  return { resource: Resource.toPublic(doc, { canManage: true }) };
}

/* ─────────────────────────── broken-link checks ─────────────────────────── */

async function applyCheck(doc, result) {
  const next = classify(doc, result);
  doc.linkStatus = next.linkStatus;
  doc.linkHttpStatus = next.linkHttpStatus;
  doc.linkCheckedAt = next.linkCheckedAt;
  doc.linkCheckError = next.linkCheckError;
  doc.linkCheckHops = next.linkCheckHops;
  doc.consecutiveFailures = next.consecutiveFailures;
  await doc.save();
  return { ...next, id: String(doc._id), url: doc.url };
}

/** Staff-only, on-demand single check. */
export async function checkResourceLink(id, actor) {
  if (!isModerator(actor) && !actor.permissions?.includes(PERMISSIONS.ANALYTICS_READ)) {
    throw ApiError.forbidden('Link checks require staff permission');
  }
  const doc = await findResource(id);
  const result = await checkLink(doc.url);
  return { result: await applyCheck(doc, result), resource: Resource.toPublic(doc, { canManage: true }) };
}

/** Staff-only bounded batch. The CLI job uses the same pure helpers. */
export async function runLinkCheckBatch(query, actor) {
  if (!isModerator(actor) && !actor.permissions?.includes(PERMISSIONS.ANALYTICS_READ)) {
    throw ApiError.forbidden('Link checks require staff permission');
  }
  const pool = await Resource.find({ status: S.PUBLISHED }).select('url urlKey status linkStatus linkCheckedAt consecutiveFailures').lean();
  const candidates = selectCandidates(pool, { force: query.force === 'true', limit: query.limit });
  const results = [];
  for (const candidate of candidates) {
    const doc = await Resource.findById(candidate._id);
    if (!doc) continue;
    const result = await checkLink(doc.url);
    results.push(await applyCheck(doc, result));
  }
  return {
    checked: results.length,
    broken: results.filter((item) => item.linkStatus === 'broken').length,
    flagged: results.filter((item) => item.flagged).length,
    results,
  };
}

export { findResource, canManage, ownerOf, isModerator, applyCheck };
```

## `server/src/modules/resources/interaction.service.js`

```js
import mongoose from 'mongoose';
import {
  PERMISSIONS, REPORT_STATUSES, RESOURCE_EVENT_TYPES as E,
  RESOURCE_STATUSES as S,
} from '@algonest/shared';
import { Resource } from '../../models/Resource.js';
import { ResourceSave } from '../../models/ResourceSave.js';
import { ResourceReaction } from '../../models/ResourceReaction.js';
import { ResourceReport } from '../../models/ResourceReport.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { findResource, isModerator } from './resource.service.js';
import { recordEvent } from './analytics.js';

const { Types } = mongoose;

function assertPublic(doc) {
  if (doc.status !== S.PUBLISHED) throw ApiError.forbidden('Only published resources can be rated, saved or reported');
}

function assertStaff(actor) {
  if (!isModerator(actor) && !actor.permissions?.includes(PERMISSIONS.USER_READ)) {
    throw ApiError.forbidden('Report triage requires staff permission');
  }
}

/* ─────────────────────────── save / unsave ─────────────────────────── */

export async function toggleSave(id, actor, desired = null) {
  const doc = await findResource(id);
  assertPublic(doc);
  const userId = new Types.ObjectId(actor.id);
  const existing = await ResourceSave.findOne({ resource: doc._id, user: userId });
  // `desired` makes the endpoint idempotent (PUT = save, DELETE = unsave).
  if (desired === false && !existing) return { saved: false, saveCount: doc.saveCount ?? 0 };
  if (desired === true && existing) return { saved: true, saveCount: doc.saveCount ?? 0 };
  if (existing) {
    await ResourceSave.deleteOne({ _id: existing._id });
    await Resource.updateOne({ _id: doc._id, saveCount: { $gt: 0 } }, { $inc: { saveCount: -1 } });
    return { saved: false, saveCount: Math.max(0, (doc.saveCount ?? 1) - 1) };
  }
  await ResourceSave.create({ resource: doc._id, user: userId });
  await Resource.updateOne({ _id: doc._id }, { $inc: { saveCount: 1 } });
  await recordEvent(doc, E.SAVE, actor).catch(() => {});
  return { saved: true, saveCount: (doc.saveCount ?? 0) + 1 };
}

export async function listSaved(query, actor) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const filter = { user: new Types.ObjectId(actor.id) };
  const [rows, total] = await Promise.all([
    ResourceSave.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ResourceSave.countDocuments(filter),
  ]);
  const ids = rows.map((row) => row.resource);
  const resources = await Resource.find({ _id: { $in: ids }, status: S.PUBLISHED }).populate('author', 'name').lean();
  const byId = new Map(resources.map((doc) => [String(doc._id), doc]));
  return {
    items: rows.map((row) => ({
      ...ResourceSave.toPublic(row),
      resource: byId.has(String(row.resource)) ? Resource.toPublic(byId.get(String(row.resource)), { saved: true }) : null,
    })).filter((row) => row.resource),
    pagination: buildPagination(page, limit, total),
  };
}

/* ─────────────────────────── ratings & feedback ─────────────────────────── */

async function recomputeRatings(resourceId) {
  const rows = await ResourceReaction.find({ resource: resourceId, rating: { $ne: null } }).select('rating').lean();
  await Resource.updateOne({ _id: resourceId }, {
    $set: { ratingCount: rows.length, ratingSum: rows.reduce((sum, row) => sum + (Number(row.rating) || 0), 0) },
  });
  return { ratingCount: rows.length, ratingSum: rows.reduce((sum, row) => sum + (Number(row.rating) || 0), 0) };
}

async function recomputeFeedback(resourceId) {
  const [helpful, notHelpful] = await Promise.all([
    ResourceReaction.countDocuments({ resource: resourceId, helpful: true }),
    ResourceReaction.countDocuments({ resource: resourceId, helpful: false }),
  ]);
  await Resource.updateOne({ _id: resourceId }, { $set: { helpfulCount: helpful, notHelpfulCount: notHelpful } });
  return { helpfulCount: helpful, notHelpfulCount: notHelpful };
}

/** Upsert one star rating. Only the author of a review may change it. */
export async function rateResource(id, payload, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  if (String(doc.author?._id ?? doc.author) === String(actor.id)) {
    throw ApiError.forbidden('You cannot rate your own submission');
  }
  const userId = new Types.ObjectId(actor.id);
  await ResourceReaction.findOneAndUpdate(
    { resource: doc._id, user: userId },
    { $set: { rating: payload.rating, review: payload.review || '' }, $setOnInsert: { resource: doc._id, user: userId } },
    { upsert: true, new: true, runValidators: true },
  );
  const counts = await recomputeRatings(doc._id);
  const reaction = await ResourceReaction.findOne({ resource: doc._id, user: userId }).lean();
  return {
    reaction: ResourceReaction.toPublic(reaction),
    ratingAverage: counts.ratingCount ? Math.round((counts.ratingSum / counts.ratingCount) * 10) / 10 : 0,
    ...counts,
  };
}

/** `helpful: null` withdraws the vote without touching the star rating. */
export async function setFeedback(id, payload, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  const userId = new Types.ObjectId(actor.id);
  await ResourceReaction.findOneAndUpdate(
    { resource: doc._id, user: userId },
    { $set: { helpful: payload.helpful }, $setOnInsert: { resource: doc._id, user: userId } },
    { upsert: true, new: true, runValidators: true },
  );
  const counts = await recomputeFeedback(doc._id);
  const reaction = await ResourceReaction.findOne({ resource: doc._id, user: userId }).lean();
  return { reaction: ResourceReaction.toPublic(reaction), ...counts };
}

export async function listRatings(id, query, actor) {
  const doc = await findResource(id);
  if (doc.status !== S.PUBLISHED && !isModerator(actor) && String(doc.author?._id ?? doc.author) !== String(actor.id)) {
    throw ApiError.notFound('Resource not found');
  }
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const filter = { resource: doc._id, rating: { $ne: null } };
  const [rows, total] = await Promise.all([
    ResourceReaction.find(filter).populate('user', 'name').sort({ updatedAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    ResourceReaction.countDocuments(filter),
  ]);
  return { items: rows.map((row) => ResourceReaction.toPublic(row)), pagination: buildPagination(page, limit, total) };
}

/* ─────────────────────────── reports ─────────────────────────── */

export async function reportResource(id, payload, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  const reporter = new Types.ObjectId(actor.id);
  const open = await ResourceReport.findOne({ resource: doc._id, reporter, status: REPORT_STATUSES.OPEN });
  if (open) throw ApiError.conflict('You already have an open report for this resource');
  const report = await ResourceReport.create({
    resource: doc._id, reporter, reason: payload.reason, details: payload.details,
  });
  await Resource.updateOne({ _id: doc._id }, { $inc: { reportCount: 1 } });
  // A broken-link report nudges the checker without waiting for the nightly job.
  if (payload.reason === 'broken_link') {
    await Resource.updateOne({ _id: doc._id }, { $set: { linkCheckedAt: null } });
  }
  return { report: ResourceReport.toPublic(report) };
}

export async function listReports(query, actor) {
  assertStaff(actor);
  const filter = {};
  if (query.status) filter.status = query.status;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const [rows, total] = await Promise.all([
    ResourceReport.find(filter).populate('reporter', 'name').populate('handledBy', 'name')
      .populate('resource', 'title url status')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ResourceReport.countDocuments(filter),
  ]);
  return { items: rows.map((row) => ResourceReport.toPublic(row)), pagination: buildPagination(page, limit, total) };
}

export async function resolveReport(id, payload, actor) {
  assertStaff(actor);
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid report id');
  const report = await ResourceReport.findById(id);
  if (!report) throw ApiError.notFound('Report not found');
  if (report.status !== REPORT_STATUSES.OPEN) throw ApiError.conflict('This report has already been handled');
  report.status = payload.status;
  report.resolutionNote = payload.note || '';
  report.handledBy = new Types.ObjectId(actor.id);
  report.resolvedAt = new Date();
  await report.save();
  return { report: ResourceReport.toPublic(report) };
}

/* ─────────────────────────── analytics events ─────────────────────────── */

/** `start` = learner opened the external link; `completion` = marked it done. */
export async function trackEvent(id, type, actor) {
  const doc = await findResource(id);
  assertPublic(doc);
  if (type === E.SAVE) throw ApiError.badRequest('Use the save endpoint to record a save');
  const result = await recordEvent(doc, type, actor);
  return { ...result, url: type === E.START ? doc.url : undefined };
}
```

## `server/src/modules/resources/creator.service.js`

```js
import mongoose from 'mongoose';
import { CREATOR_LIMITS, PERMISSIONS, RESOURCE_STATUSES as S } from '@algonest/shared';
import { CreatorProfile } from '../../models/CreatorProfile.js';
import { Resource } from '../../models/Resource.js';
import { ResourceEvent } from '../../models/ResourceEvent.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/pagination.js';
import { summariseEvents } from './analytics.js';

const { Types } = mongoose;

async function defaultProfile(actor) {
  const user = await User.findById(actor.id).select('name').lean();
  return {
    user: new Types.ObjectId(actor.id),
    displayName: user?.name || 'AlgoNest creator',
    headline: '', bio: '', website: '', expertise: [], socials: [], verified: false,
  };
}

/** Lazily materialise a profile so a creator page works before the first edit. */
export async function getOrCreateProfile(userId, actor) {
  if (!Types.ObjectId.isValid(userId)) throw ApiError.badRequest('Invalid creator id');
  const objectId = new Types.ObjectId(userId);
  let profile = await CreatorProfile.findOne({ user: objectId }).populate('user', 'name');
  if (!profile) {
    if (String(userId) !== String(actor.id) && !actor.permissions?.includes(PERMISSIONS.USER_READ)) {
      throw ApiError.notFound('Creator not found');
    }
    const seed = await defaultProfile({ id: userId });
    profile = await CreatorProfile.create(seed);
    profile = await CreatorProfile.findById(profile._id).populate('user', 'name');
  }
  return profile;
}

export async function getMyProfile(actor) {
  const profile = await getOrCreateProfile(actor.id, actor);
  return { profile: CreatorProfile.toPublic(profile, { isOwner: true }) };
}

export async function upsertMyProfile(payload, actor) {
  const profile = await getOrCreateProfile(actor.id, actor);
  for (const key of ['displayName', 'headline', 'bio', 'website', 'expertise', 'socials']) {
    if (payload[key] !== undefined) profile[key] = payload[key];
  }
  profile.markModified('expertise');
  profile.markModified('socials');
  await profile.save();
  return { profile: CreatorProfile.toPublic(profile, { isOwner: true }) };
}

async function aggregateFor(userId) {
  const resources = await Resource.find({ author: userId, status: S.PUBLISHED })
    .select('viewCount saveCount startCount completionCount ratingCount ratingSum').lean();
  return {
    publishedResources: resources.length,
    views: resources.reduce((sum, row) => sum + (row.viewCount ?? 0), 0),
    saves: resources.reduce((sum, row) => sum + (row.saveCount ?? 0), 0),
    starts: resources.reduce((sum, row) => sum + (row.startCount ?? 0), 0),
    completions: resources.reduce((sum, row) => sum + (row.completionCount ?? 0), 0),
    ratingCount: resources.reduce((sum, row) => sum + (row.ratingCount ?? 0), 0),
    ratingSum: resources.reduce((sum, row) => sum + (row.ratingSum ?? 0), 0),
  };
}

/** Public creator page: profile + published resources + headline aggregates. */
export async function getCreator(id, actor, query = {}) {
  const profile = await getOrCreateProfile(id, actor);
  const isOwner = String(profile.user?._id ?? profile.user) === String(actor.id);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const filter = { author: profile.user?._id ?? profile.user, status: S.PUBLISHED };
  const [items, total, stats] = await Promise.all([
    Resource.find(filter).populate('author', 'name').sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    Resource.countDocuments(filter),
    aggregateFor(profile.user?._id ?? profile.user),
  ]);
  return {
    profile: CreatorProfile.toPublic(profile, {
      isOwner,
      stats,
      resources: items.map((doc) => Resource.toPublic(doc)),
    }),
    pagination: buildPagination(page, limit, total),
  };
}

export async function listCreators(query) {
  const filter = {};
  if (query.q) {
    const rx = new RegExp(String(query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ displayName: rx }, { headline: rx }, { expertise: rx }];
  }
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const [items, total] = await Promise.all([
    CreatorProfile.find(filter).populate('user', 'name').sort({ verified: -1, createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    CreatorProfile.countDocuments(filter),
  ]);
  return { items: items.map((doc) => CreatorProfile.toPublic(doc)), pagination: buildPagination(page, limit, total) };
}

/**
 * Creator analytics. Own profile only, unless the caller has `analytics:read`.
 * Time-series comes from the append-only ResourceEvent collection; headline
 * totals come from the denormalised Resource counters (cheap and consistent).
 */
export async function getAnalytics(actor, query = {}, { creatorId = null } = {}) {
  const target = creatorId ?? actor.id;
  if (!Types.ObjectId.isValid(target)) throw ApiError.badRequest('Invalid creator id');
  const canReadAll = actor.permissions?.includes(PERMISSIONS.ANALYTICS_READ)
    || actor.permissions?.includes(PERMISSIONS.USER_READ);
  if (String(target) !== String(actor.id) && !canReadAll) {
    throw ApiError.forbidden('You can only view your own analytics');
  }
  const days = Math.min(90, Math.max(1, Number(query.days) || CREATOR_LIMITS.ANALYTICS_DAYS));
  const since = new Date(Date.now() - (days - 1) * 86_400_000);
  since.setUTCHours(0, 0, 0, 0);
  const creator = new Types.ObjectId(target);
  const [events, resources, totals] = await Promise.all([
    ResourceEvent.find({ creator, createdAt: { $gte: since } }).select('resource type dayKey').lean(),
    Resource.find({ author: creator, status: S.PUBLISHED })
      .select('title slug viewCount saveCount startCount completionCount ratingCount ratingSum publishedAt').lean(),
    aggregateFor(creator),
  ]);
  const summary = summariseEvents(events, days);
  const byId = new Map(resources.map((doc) => [String(doc._id), doc]));
  const topResources = summary.topResources.slice(0, CREATOR_LIMITS.TOP_RESOURCES).map((row) => {
    const resource = byId.get(row.resource);
    return {
      ...row,
      title: resource?.title ?? 'Removed resource',
      slug: resource?.slug ?? '',
      url: resource ? `/app/resources/${resource._id}` : null,
    };
  });
  const rate = (numerator, denominator) => denominator ? Math.round((numerator / denominator) * 1000) / 10 : 0;
  return {
    days,
    creatorId: String(creator),
    totals: {
      ...totals,
      ratingAverage: totals.ratingCount ? Math.round((totals.ratingSum / totals.ratingCount) * 10) / 10 : 0,
    },
    window: summary.totals,
    series: summary.series,
    topResources,
    conversion: {
      saveRate: rate(totals.saves, totals.views),
      startRate: rate(totals.starts, totals.views),
      completionRate: rate(totals.completions, totals.starts),
    },
  };
}
```

---

# Server — controllers + routers + mount

## `server/src/modules/resources/resource.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './resource.service.js';

const actor = (req) => actorFrom(req);

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listResources(req.validated.query, actor(req)), 'Resources fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getResource(req.validated.params.id, actor(req)), 'Resource fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createResource(req.validated.body, actor(req)), 'Resource submitted');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateResource(req.validated.params.id, req.validated.body, actor(req)), 'Resource updated');
});

export const duplicate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.checkDuplicate(req.validated.query.url, actor(req)), 'Duplicate check complete');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveResource(req.validated.params.id, actor(req)), 'Resource archived');
});

export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreResource(req.validated.params.id, actor(req)), 'Resource restored to draft');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitResource(req.validated.params.id, actor(req)), 'Submitted for review');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateResource(req.validated.params.id, decision, note, actor(req)), `Resource ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishResource(req.validated.params.id, actor(req)), 'Resource published');
});

export const checkLink = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.checkResourceLink(req.validated.params.id, actor(req)), 'Link checked');
});

export const runLinkCheckBatch = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.runLinkCheckBatch(req.validated.query, actor(req)), 'Link check batch complete');
});
```

## `server/src/modules/resources/interaction.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './interaction.service.js';
import * as resourceService from './resource.service.js';

const actor = (req) => actorFrom(req);

export const save = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.toggleSave(id, actor(req), req.method === 'PUT'), 'Bookmark updated');
});

export const saved = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listSaved(req.validated.query, actor(req)), 'Saved resources fetched');
});

export const rate = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.rateResource(id, req.validated.body, actor(req)), 'Rating saved');
});

export const ratings = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.listRatings(id, req.validated.query, actor(req)), 'Reviews fetched');
});

export const feedback = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.setFeedback(id, req.validated.body, actor(req)), 'Feedback saved');
});

export const report = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.reportResource(id, req.validated.body, actor(req)), 'Report submitted');
});

export const reports = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listReports(req.validated.query, actor(req)), 'Reports fetched');
});

export const resolveReport = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.resolveReport(req.validated.params.reportId, req.validated.body, actor(req)), 'Report resolved');
});

export const event = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.trackEvent(id, req.validated.body.type, actor(req)), 'Event recorded');
});

/** Reuse the catalogue list with `saved: 'true'` for the Saved tab. */
export const savedCatalogue = asyncHandler(async (req, res) => {
  sendSuccess(res, await resourceService.listResources({ ...req.validated.query, saved: 'true' }, actor(req)), 'Saved catalogue fetched');
});
```

## `server/src/modules/resources/creator.controller.js`

```js
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './creator.service.js';

const actor = (req) => actorFrom(req);

export const myProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getMyProfile(actor(req)), 'Creator profile fetched');
});

export const updateProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.upsertMyProfile(req.validated.body, actor(req)), 'Creator profile saved');
});

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listCreators(req.validated.query), 'Creators fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getCreator(req.validated.params.id, actor(req), req.validated.query), 'Creator fetched');
});

export const myAnalytics = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAnalytics(actor(req), req.validated.query), 'Creator analytics fetched');
});

export const analytics = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAnalytics(actor(req), req.validated.query, { creatorId: req.validated.params.id }), 'Creator analytics fetched');
});
```

## `server/src/modules/resources/resource.routes.js`

```js
import { Router } from 'express';
import {
  changelogSchema, moderationSchema, resourceCreateSchema, resourceDuplicateQuerySchema,
  resourceEventSchema, resourceFeedbackSchema, resourceLinkCheckQuerySchema,
  resourceListQuerySchema, resourceParamsSchema, resourceRatingSchema,
  resourceRatingsQuerySchema, resourceReportItemParamsSchema,
  resourceReportListQuerySchema, resourceReportResolveSchema, resourceReportSchema,
  resourceSavedQuerySchema, resourceUpdateSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as resource from './resource.controller.js';
import * as interaction from './interaction.controller.js';

/**
 * Mounted at /resources. Every route is authenticated, onboarded and
 * Zod-validated. Static paths are registered BEFORE /:id so Express never
 * mistakes "saved" or "reports" for a Mongo id.
 */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: resourceListQuerySchema }), resource.list);
router.post('/', validate(resourceCreateSchema), resource.create);

/* Static staff/catalogue paths */
router.get('/check-duplicate', validate({ query: resourceDuplicateQuerySchema }), resource.duplicate);
router.get('/saved', validate({ query: resourceSavedQuerySchema }), interaction.savedCatalogue);
router.get(
  '/reports',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ query: resourceReportListQuerySchema }),
  interaction.reports,
);
router.patch(
  '/reports/:reportId',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: resourceReportItemParamsSchema, body: resourceReportResolveSchema }),
  interaction.resolveReport,
);
router.post(
  '/link-check/run',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ query: resourceLinkCheckQuerySchema }),
  resource.runLinkCheckBatch,
);

/* Resource instance */
router.get('/:id', validate({ params: resourceParamsSchema }), resource.get);
router.patch('/:id', validate({ params: resourceParamsSchema, body: resourceUpdateSchema }), resource.update);
router.delete('/:id', validate({ params: resourceParamsSchema }), resource.archive);

router.post('/:id/submit', validate({ params: resourceParamsSchema }), resource.submit);
router.post('/:id/revision', validate({ params: resourceParamsSchema }), resource.revision);
router.post('/:id/restore', validate({ params: resourceParamsSchema }), resource.restore);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: resourceParamsSchema, body: moderationSchema }),
  resource.moderate,
);
router.post('/:id/publish', validate({ params: resourceParamsSchema, body: changelogSchema }), resource.publish);
router.post(
  '/:id/check-link',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: resourceParamsSchema }),
  resource.checkLink,
);

/* Per-user interactions */
router.put('/:id/save', validate({ params: resourceParamsSchema }), interaction.save);
router.delete('/:id/save', validate({ params: resourceParamsSchema }), interaction.save);
router.put('/:id/rating', validate({ params: resourceParamsSchema, body: resourceRatingSchema }), interaction.rate);
router.get('/:id/ratings', validate({ params: resourceParamsSchema, query: resourceRatingsQuerySchema }), interaction.ratings);
router.put('/:id/feedback', validate({ params: resourceParamsSchema, body: resourceFeedbackSchema }), interaction.feedback);
router.post('/:id/report', validate({ params: resourceParamsSchema, body: resourceReportSchema }), interaction.report);
router.post('/:id/events', validate({ params: resourceParamsSchema, body: resourceEventSchema }), interaction.event);

export default router;
```

## `server/src/modules/resources/creator.routes.js`

```js
import { Router } from 'express';
import {
  creatorAnalyticsQuerySchema, creatorGetQuerySchema, creatorListQuerySchema,
  creatorParamsSchema, creatorProfileSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './creator.controller.js';

/** Mounted at /creators. `me` paths must precede /:id. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: creatorListQuerySchema }), controller.list);
router.get('/me', controller.myProfile);
router.put('/me', validate(creatorProfileSchema), controller.updateProfile);
router.get('/me/analytics', validate({ query: creatorAnalyticsQuerySchema }), controller.myAnalytics);

router.get('/:id', validate({ params: creatorParamsSchema, query: creatorGetQuerySchema }), controller.get);
router.get('/:id/analytics', validate({ params: creatorParamsSchema, query: creatorAnalyticsQuerySchema }), controller.analytics);

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
import resourceRoutes from '../modules/resources/resource.routes.js';
import creatorRoutes from '../modules/resources/creator.routes.js';

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

// Phase 6 — Public moderated resource directory + creator profiles/analytics.
// Both routers enforce authenticate + requireOnboarded; moderation and link
// checks additionally require content:moderate.
router.use('/resources', requireDatabase, resourceRoutes);
router.use('/creators', requireDatabase, creatorRoutes);

export default router;
```

---

# Server — broken-link checker job (new)

## `server/scripts/checkResourceLinks.mjs`

```js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { z } from 'zod';
import { RESOURCE_LIMITS } from '@algonest/shared';
import { Resource } from '../src/models/Resource.js';
import { checkLink, classify, selectCandidates } from '../src/modules/resources/linkChecker.js';

dotenv.config();

/**
 * Nightly broken-link checker.
 *
 *   npm run check:links                 # normal incremental run
 *   LINK_CHECK_FORCE=true npm run check:links
 *   LINK_CHECK_BATCH=50 LINK_CHECK_TIMEOUT_MS=5000 npm run check:links
 *
 * Intended for cron / a scheduler container. It is a SEPARATE process from the
 * API so a slow third-party host can never tie up a request thread. Every
 * target is validated by linkChecker.js before any socket is opened.
 */
const configSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  LINK_CHECK_BATCH: z.coerce.number().int().min(1).max(RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH).default(20),
  LINK_CHECK_FORCE: z.enum(['true', 'false']).default('false'),
  LINK_CHECK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30_000).default(RESOURCE_LIMITS.LINK_CHECK_TIMEOUT_MS),
  LINK_CHECK_MAX_REDIRECTS: z.coerce.number().int().min(0).max(5).default(RESOURCE_LIMITS.LINK_CHECK_MAX_REDIRECTS),
  LINK_CHECK_USER_AGENT: z.string().trim().min(1).max(200).default('AlgoNest-LinkChecker/1.0 (+https://algonest.dev)'),
  LINK_CHECK_FAILURE_THRESHOLD: z.coerce.number().int().min(1).max(10).default(RESOURCE_LIMITS.LINK_CHECK_FAILURE_THRESHOLD),
});

const parsed = configSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('[link-check] Invalid configuration:');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}
const config = parsed.data;

async function main() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  const pool = await Resource.find({ status: 'published' })
    .select('url urlKey status linkStatus linkCheckedAt consecutiveFailures')
    .lean();
  const candidates = selectCandidates(pool, {
    force: config.LINK_CHECK_FORCE === 'true',
    limit: config.LINK_CHECK_BATCH,
    now: new Date(),
  });
  console.log(`[link-check] ${pool.length} published, ${candidates.length} due for a check`);

  let ok = 0; let broken = 0; let unknown = 0; let flagged = 0;
  for (const candidate of candidates) {
    const result = await checkLink(candidate.url, {
      timeoutMs: config.LINK_CHECK_TIMEOUT_MS,
      maxRedirects: config.LINK_CHECK_MAX_REDIRECTS,
      userAgent: config.LINK_CHECK_USER_AGENT,
    });
    const next = classify(candidate, result, config.LINK_CHECK_FAILURE_THRESHOLD);
    await Resource.updateOne({ _id: candidate._id }, {
      $set: {
        linkStatus: next.linkStatus,
        linkHttpStatus: next.linkHttpStatus,
        linkCheckedAt: next.linkCheckedAt,
        linkCheckError: next.linkCheckError,
        linkCheckHops: next.linkCheckHops,
        consecutiveFailures: next.consecutiveFailures,
      },
    });
    if (next.linkStatus === 'ok') ok += 1;
    else if (next.linkStatus === 'broken') broken += 1;
    else unknown += 1;
    if (next.flagged) flagged += 1;
    // Be polite to third-party hosts.
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(`[link-check] ${next.linkStatus.padEnd(7)} ${String(result.httpStatus).padEnd(4)} ${candidate.url}${next.flagged ? '  ← newly flagged' : ''}`);
  }
  console.log(`[link-check] done: ok=${ok} broken=${broken} unknown=${unknown} newlyFlagged=${flagged}`);
  return { checked: candidates.length, ok, broken, unknown, flagged };
}

main()
  .catch((error) => {
    console.error('[link-check] fatal:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
```

---

# Server — tests (new)

## `server/tests/resources.test.js`

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  RESOURCE_LINK_STATUSES as L, RESOURCE_STATUSES as S,
  creatorAnalyticsQuerySchema, creatorProfileSchema, resourceCreateSchema,
  resourceDuplicateQuerySchema, resourceFeedbackSchema, resourceListQuerySchema,
  resourceRatingSchema, resourceReportSchema, resourceUpdateSchema,
} from '@algonest/shared';

const {
  areDuplicate, displayHost, isHttpUrl, normaliseForStorage, urlKeyFor,
} = await import('../src/modules/resources/resourceUrl.js');
const {
  assertSafeTarget, checkLink, classify, isPrivateIp, selectCandidates, validateDns,
} = await import('../src/modules/resources/linkChecker.js');
const { canTransition, isEditable } = await import('../src/modules/resources/resourceWorkflow.js');
const { summariseEvents } = await import('../src/modules/resources/analytics.js');

const mockFetch = (status, headers = {}) => async () => ({
  status,
  headers: { get: (key) => headers[key.toLowerCase()] ?? null },
  body: { cancel: async () => {} },
});
const publicLookup = async () => [{ address: '8.8.8.8', family: 4 }];

describe('Phase-6 Zod contracts', () => {
  it('creates a resource with defaults and strips unknown keys', () => {
    const parsed = resourceCreateSchema.parse({ title: '  DP patterns guide  ', url: 'https://example.com/dp' });
    assert.equal(parsed.title, 'DP patterns guide');
    assert.equal(parsed.level, 'beginner');
    assert.equal(parsed.language, 'agnostic');
    assert.equal(parsed.pricing, 'free');
    assert.equal(parsed.submit, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'https://x.com/a', hacker: 1 }).success, false);
  });

  it('rejects non-http schemes, short titles and invalid enums', () => {
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'javascript:alert(1)' }).success, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'file:///etc/passwd' }).success, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'abc', url: 'https://x.com' }).success, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'https://x.com', level: 'expert' }).success, false);
    assert.equal(resourceDuplicateQuerySchema.safeParse({ url: 'javascript:alert(1)' }).success, false);
  });

  it('validates filters, updates, ratings, feedback, reports and creator input', () => {
    assert.equal(resourceListQuerySchema.parse({}).sort, 'newest');
    assert.equal(resourceListQuerySchema.safeParse({ pricing: 'expensive' }).success, false);
    assert.equal(resourceListQuerySchema.safeParse({ q: 'dp', type: 'video', pricing: 'free' }).success, true);
    assert.throws(() => resourceUpdateSchema.parse({}));
    assert.equal(resourceRatingSchema.parse({ rating: 5 }).rating, 5);
    assert.equal(resourceRatingSchema.safeParse({ rating: 6 }).success, false);
    assert.equal(resourceFeedbackSchema.parse({ helpful: null }).helpful, null);
    assert.equal(resourceReportSchema.safeParse({ reason: 'broken_link', details: 'short' }).success, false);
    assert.equal(resourceReportSchema.safeParse({ reason: 'broken_link', details: 'This 404s every time I open it.' }).success, true);
    assert.equal(creatorProfileSchema.parse({ displayName: 'Ada' }).expertise.length, 0);
    assert.equal(creatorProfileSchema.safeParse({ displayName: 'A', website: 'not-a-url' }).success, false);
    assert.equal(creatorAnalyticsQuerySchema.parse({}).days, 30);
  });
});

describe('URL normalisation + duplicate detection (no network)', () => {
  it('canonicalises host, path, case, tracking params and fragments', () => {
    const a = normaliseForStorage('https://www.LeetCode.com/problems/two-sum/?utm_source=x#comments');
    assert.equal(a.url, 'https://www.leetcode.com/problems/two-sum');
    assert.equal(a.urlKey, 'leetcode.com/problems/two-sum');
    assert.equal(a.platform, 'leetcode');
    assert.equal(a.host, 'leetcode.com');
    assert.equal(urlKeyFor('https://leetcode.com/problems/two-sum'), a.urlKey);
  });

  it('detects duplicates across equivalent links', () => {
    assert.equal(areDuplicate('https://leetcode.com/problems/two-sum', 'https://www.leetcode.com/problems/two-sum/?utm_source=x'), true);
    assert.equal(areDuplicate('https://leetcode.com/problems/two-sum', 'https://leetcode.com/problems/add-two-numbers'), false);
  });

  it('keeps distinct YouTube videos separate', () => {
    const a = urlKeyFor('https://www.youtube.com/watch?v=abc123');
    const b = urlKeyFor('https://youtu.be/xyz789');
    assert.notEqual(a, b);
    assert.equal(areDuplicate('https://www.youtube.com/watch?v=abc123&t=42', 'https://youtube.com/watch?v=abc123'), true);
  });

  it('never accepts a non-http URL', () => {
    assert.throws(() => normaliseForStorage('javascript:alert(1)'), /Only http\(s\) links/);
    assert.equal(isHttpUrl('ftp://example.com/a'), false);
    assert.equal(isHttpUrl('https://example.com/a'), true);
    assert.equal(displayHost('https://WWW.Example.com/a'), 'example.com');
    assert.equal(urlKeyFor('not a url'), '');
  });
});

describe('SSRF-safe link checker', () => {
  it('rejects private, loopback, link-local and reserved IPv4/IPv6', () => {
    for (const ip of ['127.0.0.1', '10.0.0.1', '172.16.0.1', '192.168.1.1', '169.254.169.254', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1']) {
      assert.equal(isPrivateIp(ip), true, ip);
    }
    for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) assert.equal(isPrivateIp(ip), false, ip);
  });

  it('rejects local hostnames, credentials, non-http schemes and odd ports', () => {
    assert.throws(() => assertSafeTarget('http://localhost/x'), /Local hostnames/);
    assert.throws(() => assertSafeTarget('http://metadata.internal/latest'), /Local hostnames/);
    assert.throws(() => assertSafeTarget('https://user:pass@example.com/'), /credentials/);
    assert.throws(() => assertSafeTarget('http://example.com:8080/'), /ports 80/);
    assert.throws(() => assertSafeTarget('ftp://example.com/'), /Only http/);
    assert.throws(() => assertSafeTarget('http://127.0.0.1/'), /Private network/);
    assert.equal(assertSafeTarget('https://example.com/a').hostname, 'example.com');
  });

  it('rejects a host that resolves to a private address', async () => {
    await assert.rejects(
      () => validateDns('internal.example.com', async () => [{ address: '10.1.2.3', family: 4 }]),
      /private address/,
    );
    assert.deepEqual(await validateDns('example.com', async () => [{ address: '93.184.216.34', family: 4 }]), ['93.184.216.34']);
  });

  it('classifies 2xx as ok and 404/410 as broken', async () => {
    const ok = await checkLink('https://example.com/a', { fetchImpl: mockFetch(200), lookupImpl: publicLookup });
    assert.equal(ok.status, L.OK);
    assert.equal(ok.httpStatus, 200);
    const broken = await checkLink('https://example.com/missing', { fetchImpl: mockFetch(404), lookupImpl: publicLookup });
    assert.equal(broken.status, L.BROKEN);
    assert.equal(broken.reason, 'HTTP 404');
  });

  it('treats 401/403/429/5xx as inconclusive, not broken', async () => {
    for (const code of [401, 403, 429, 500]) {
      const result = await checkLink('https://example.com/a', { fetchImpl: mockFetch(code), lookupImpl: publicLookup });
      assert.equal(result.status, L.UNKNOWN, `HTTP ${code}`);
    }
  });

  it('validates each redirect hop and stops after the configured limit', async () => {
    let calls = 0;
    const redirecting = async () => {
      calls += 1;
      return { status: 302, headers: { get: () => 'https://example.com/final' }, body: { cancel: async () => {} } };
    };
    const result = await checkLink('https://example.com/start', { fetchImpl: redirecting, lookupImpl: publicLookup, maxRedirects: 2 });
    assert.equal(calls, 3);
    assert.equal(result.status, L.UNKNOWN);
    assert.match(result.reason, /Too many redirects/);
  });

  it('refuses a redirect into the private network', async () => {
    const result = await checkLink('https://example.com/start', {
      fetchImpl: mockFetch(302, { location: 'http://169.254.169.254/latest/meta-data' }),
      lookupImpl: publicLookup,
    });
    assert.equal(result.status, L.UNKNOWN);
    assert.match(result.reason, /private address|Private network/);
  });

  it('returns a safe result on timeout or DNS failure', async () => {
    const throwing = async () => { const error = new Error('boom'); error.name = 'AbortError'; throw error; };
    const result = await checkLink('https://example.com/a', { fetchImpl: throwing, lookupImpl: publicLookup });
    assert.equal(result.status, L.UNKNOWN);
    assert.equal(result.reason, 'Timed out');
  });

  it('requires two consecutive failures before flagging a link broken', () => {
    const first = classify({}, { status: L.UNKNOWN, httpStatus: 503, reason: 'HTTP 503' }, 2);
    assert.equal(first.linkStatus, L.UNKNOWN);
    assert.equal(first.consecutiveFailures, 1);
    assert.equal(first.flagged, false);
    const second = classify(first, { status: L.BROKEN, httpStatus: 404, reason: 'HTTP 404' }, 2);
    assert.equal(second.linkStatus, L.BROKEN);
    assert.equal(second.flagged, true);
    const recovered = classify(second, { status: L.OK, httpStatus: 200, reason: 'OK' }, 2);
    assert.equal(recovered.linkStatus, L.OK);
    assert.equal(recovered.consecutiveFailures, 0);
  });

  it('selects only published, due links and prioritises failing ones', () => {
    const now = new Date('2026-10-28T12:00:00.000Z');
    const candidates = selectCandidates([
      { url: 'https://a.com', status: 'published', linkStatus: 'ok', linkCheckedAt: now },
      { url: 'https://b.com', status: 'published', linkStatus: 'broken', linkCheckedAt: null },
      { url: 'https://c.com', status: 'published', linkStatus: 'unchecked', linkCheckedAt: null },
      { url: 'https://d.com', status: 'draft', linkCheckedAt: null },
    ], { now, limit: 10 });
    assert.equal(candidates.length, 2);
    assert.equal(candidates[0].url, 'https://b.com');
    assert.equal(selectCandidates([{ url: 'https://a.com', status: 'published', linkCheckedAt: now }], { now, force: true }).length, 1);
  });
});

describe('resource lifecycle + analytics summary', () => {
  it('follows the standard moderation lifecycle', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.equal(isEditable(S.PUBLISHED), false);
    assert.equal(isEditable(S.CHANGES_REQUESTED), true);
  });

  it('summarises events into totals, a daily series and top resources', () => {
    const events = [
      { resource: 'r1', type: 'view', dayKey: '2026-10-27' },
      { resource: 'r1', type: 'view', dayKey: '2026-10-28' },
      { resource: 'r1', type: 'start', dayKey: '2026-10-28' },
      { resource: 'r2', type: 'completion', dayKey: '2026-10-28' },
    ];
    const summary = summariseEvents(events, 3, new Date('2026-10-28T18:00:00.000Z'));
    assert.equal(summary.totals.view, 2);
    assert.equal(summary.totals.start, 1);
    assert.equal(summary.totals.completion, 1);
    assert.equal(summary.series.length, 3);
    assert.equal(summary.series[2].view, 1);
    assert.equal(summary.topResources[0].resource, 'r1');
    assert.equal(summary.topResources[0].total, 3);
  });
});
```

## `server/tests/resources.service.test.js`

```js
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import {
  PERMISSIONS, RESOURCE_STATUSES as S, ROLES,
} from '@algonest/shared/constants';

const { Resource } = await import('../src/models/Resource.js');
const { ResourceSave } = await import('../src/models/ResourceSave.js');
const { ResourceReaction } = await import('../src/models/ResourceReaction.js');
const { ResourceReport } = await import('../src/models/ResourceReport.js');
const { ResourceEvent } = await import('../src/models/ResourceEvent.js');
const { CreatorProfile } = await import('../src/models/CreatorProfile.js');
const { User } = await import('../src/models/User.js');
const resourceService = await import('../src/modules/resources/resource.service.js');
const interaction = await import('../src/modules/resources/interaction.service.js');
const creatorService = await import('../src/modules/resources/creator.service.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const USER = oid('507f1f77bcf86cd799439001');
const OTHER = oid('507f1f77bcf86cd799439002');
const RES_ID = oid('507f1f77bcf86cd799439010');
const URL = 'https://www.leetcode.com/problems/two-sum/';

const student = { id: String(USER), role: ROLES.STUDENT, permissions: [] };
const stranger = { id: String(OTHER), role: ROLES.STUDENT, permissions: [] };
const moderator = { id: String(OTHER), role: ROLES.CONTENT_MODERATOR, permissions: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ] };
const analyst = { id: String(OTHER), role: ROLES.SUPPORT_ANALYST, permissions: [PERMISSIONS.ANALYTICS_READ, PERMISSIONS.USER_READ] };
const superAdmin = { id: String(OTHER), role: ROLES.SUPER_ADMIN, permissions: Object.values(PERMISSIONS) };
const ownerModerator = { id: String(USER), role: ROLES.CONTENT_MODERATOR, permissions: [PERMISSIONS.CONTENT_MODERATE] };

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
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where']) chain[method] = () => chain;
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

function makeResource(overrides = {}) {
  return new Resource({
    _id: RES_ID, title: 'Two Sum explained', slug: 'two-sum-explained-abc',
    url: 'https://leetcode.com/problems/two-sum', urlKey: 'leetcode.com/problems/two-sum',
    description: 'A clear walkthrough', type: 'article', topic: 'Arrays',
    level: 'beginner', language: 'javascript', pricing: 'free', tags: ['hash'],
    platform: 'leetcode', platformLabel: 'LeetCode', host: 'leetcode.com',
    author: USER, status: S.PUBLISHED, publishedAt: new Date(),
    ...overrides,
  });
}

const payload = (overrides = {}) => ({
  title: 'Two Sum explained', url: URL, description: 'A clear walkthrough',
  type: 'article', topic: 'Arrays', level: 'beginner', language: 'javascript',
  pricing: 'free', tags: [], submit: false, ...overrides,
});

function stubBase() {
  for (const proto of [Resource.prototype, ResourceSave.prototype, ResourceReaction.prototype, ResourceReport.prototype]) {
    stub(proto, 'save', async function save() { return this; });
  }
}

describe('resource.service — duplicates, create, lifecycle', () => {
  it('canonicalises the URL and creates a draft', async () => {
    stubBase();
    stub(Resource, 'findOne', () => chainable(null));
    let created = null;
    stub(Resource, 'create', async (doc) => { created = doc; return makeResource(doc); });
    const result = await resourceService.createResource(payload(), student);
    assert.equal(created.url, 'https://www.leetcode.com/problems/two-sum');
    assert.equal(created.urlKey, 'leetcode.com/problems/two-sum');
    assert.equal(created.platform, 'leetcode');
    assert.equal(created.status, S.DRAFT);
    assert.equal(result.resource.status, S.DRAFT);
  });

  it('submits straight to review when requested', async () => {
    stubBase();
    stub(Resource, 'findOne', () => chainable(null));
    let created = null;
    stub(Resource, 'create', async (doc) => { created = doc; return makeResource(doc); });
    await resourceService.createResource(payload({ submit: true }), student);
    assert.equal(created.status, S.PENDING_REVIEW);
    assert.ok(created.submittedAt instanceof Date);
  });

  it('rejects a duplicate URL (tracking params and case insensitive)', async () => {
    stub(Resource, 'findOne', () => chainable({
      _id: oid('507f1f77bcf86cd799439099'), title: 'Existing guide', status: S.PUBLISHED,
      url: 'https://leetcode.com/problems/two-sum', author: OTHER,
    }));
    const result = await resourceService.checkDuplicate('https://www.leetcode.com/problems/two-sum/?utm_source=x', student);
    assert.equal(result.duplicate, true);
    assert.equal(result.resource.title, 'Existing guide');
    stubBase();
    await assert.rejects(() => resourceService.createResource(payload(), student), (error) => error.statusCode === 409);
  });

  it('masks a non-public duplicate for a non-staff viewer', async () => {
    stub(Resource, 'findOne', () => chainable({
      _id: oid('507f1f77bcf86cd799439099'), title: 'Secret draft', status: S.PENDING_REVIEW,
      url: 'https://leetcode.com/problems/two-sum', author: OTHER,
    }));
    const result = await resourceService.checkDuplicate(URL, student);
    assert.equal(result.resource.id, null);
    assert.equal(result.resource.url, null);
  });

  it('blocks a stranger from editing and refuses to edit a published resource', async () => {
    stubBase();
    stub(Resource, 'findById', () => chainable(makeResource()));
    await assert.rejects(
      () => resourceService.updateResource(String(RES_ID), { title: 'Hacked resource' }, stranger),
      (error) => error.statusCode === 403,
    );
    await assert.rejects(
      () => resourceService.updateResource(String(RES_ID), { title: 'Edited resource' }, student),
      (error) => error.statusCode === 409 && /published/.test(error.message),
    );
  });

  it('re-verifies a link when the URL changes on an editable draft', async () => {
    const doc = makeResource({ status: S.DRAFT, linkStatus: 'ok', linkCheckedAt: new Date(), consecutiveFailures: 3 });
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    stub(Resource, 'findOne', () => chainable(null));
    await resourceService.updateResource(String(RES_ID), { url: 'https://example.com/dp-guide' }, student);
    assert.equal(doc.url, 'https://example.com/dp-guide');
    assert.equal(doc.linkStatus, 'unchecked');
    assert.equal(doc.consecutiveFailures, 0);
  });

  it('runs the full lifecycle and enforces moderation separation of duties', async () => {
    const doc = makeResource({ status: S.DRAFT });
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    await resourceService.submitResource(String(RES_ID), student);
    assert.equal(doc.status, S.PENDING_REVIEW);
    await assert.rejects(
      () => resourceService.moderateResource(String(RES_ID), 'approve', '', student),
      (error) => error.statusCode === 403 && /requires/i.test(error.message),
    );
    await assert.rejects(
      () => resourceService.moderateResource(String(RES_ID), 'approve', '', ownerModerator),
      (error) => error.statusCode === 403 && /cannot moderate/i.test(error.message),
    );
    await resourceService.moderateResource(String(RES_ID), 'approve', 'LGTM', superAdmin);
    assert.equal(doc.status, S.APPROVED);
    await resourceService.publishResource(String(RES_ID), student);
    assert.equal(doc.status, S.PUBLISHED);
  });

  it('lists only published resources for students and honours filters', async () => {
    let filter = null;
    stub(Resource, 'find', (value) => { filter = value; return chainable([makeResource()]); });
    stub(Resource, 'countDocuments', async () => 1);
    stub(ResourceSave, 'find', () => chainable([]));
    stub(ResourceReaction, 'find', () => chainable([]));
    const result = await resourceService.listResources({ page: 1, limit: 12, type: 'video', pricing: 'free', sort: 'rating' }, student);
    assert.equal(filter.status, S.PUBLISHED);
    assert.equal(filter.type, 'video');
    assert.equal(filter.pricing, 'free');
    assert.equal(result.items.length, 1);
    assert.equal(result.pagination.total, 1);
  });

  it('restricts the link-check batch to staff', async () => {
    await assert.rejects(
      () => resourceService.runLinkCheckBatch({ limit: 5, force: 'false' }, student),
      (error) => error.statusCode === 403,
    );
  });
});

describe('interaction.service — save, rating, feedback, report', () => {
  it('save/unsave is idempotent and updates the counter', async () => {
    const doc = makeResource();
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    stub(ResourceEvent, 'create', async (row) => row);
    stub(Resource, 'updateOne', () => chainable({}));
    stub(ResourceSave, 'findOne', () => chainable(null));
    let created = null;
    stub(ResourceSave, 'create', async (row) => { created = row; return row; });
    const saved = await interaction.toggleSave(String(RES_ID), student, true);
    assert.equal(saved.saved, true);
    assert.equal(saved.saveCount, 1);
    assert.equal(String(created.user), String(USER));

    const again = await interaction.toggleSave(String(RES_ID), student, true);
    assert.equal(again.saved, true, 'PUT is idempotent — no double save event');
    stub(ResourceSave, 'findOne', () => chainable({ _id: oid('507f1f77bcf86cd799439088') }));
    stub(ResourceSave, 'deleteOne', () => chainable({}));
    const removed = await interaction.toggleSave(String(RES_ID), student, false);
    assert.equal(removed.saved, false);
    assert.equal(removed.saveCount, 0);
  });

  it('refuses to save a non-published resource', async () => {
    stub(Resource, 'findById', () => chainable(makeResource({ status: S.DRAFT })));
    await assert.rejects(() => interaction.toggleSave(String(RES_ID), student, true), (error) => error.statusCode === 403);
  });

  it('recomputes the rating average and forbids self-rating', async () => {
    const doc = makeResource();
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    await assert.rejects(() => interaction.rateResource(String(RES_ID), { rating: 5, review: '' }, student), (error) => error.statusCode === 403);

    const otherDoc = makeResource({ author: OTHER });
    stub(Resource, 'findById', () => chainable(otherDoc));
    let update = null;
    stub(ResourceReaction, 'findOneAndUpdate', () => chainable({}));
    stub(ResourceReaction, 'find', () => chainable([{ rating: 5 }, { rating: 3 }]));
    stub(ResourceReaction, 'findOne', () => chainable({ resource: RES_ID, user: USER, rating: 5, helpful: null, review: '' }));
    stub(Resource, 'updateOne', (_filter, value) => { update = value; return chainable({}); });
    const result = await interaction.rateResource(String(RES_ID), { rating: 5, review: 'Great' }, student);
    assert.equal(result.ratingCount, 2);
    assert.equal(result.ratingSum, 8);
    assert.equal(result.ratingAverage, 4);
    assert.equal(update.$set.ratingCount, 2);
  });

  it('withdrawing a helpful vote leaves the star rating alone', async () => {
    stub(Resource, 'findById', () => chainable(makeResource({ author: OTHER })));
    let setPayload = null;
    stub(ResourceReaction, 'findOneAndUpdate', (_filter, value) => { setPayload = value; return chainable({}); });
    stub(ResourceReaction, 'countDocuments', async (filter) => filter.helpful === true ? 1 : 0);
    stub(ResourceReaction, 'findOne', () => chainable({ resource: RES_ID, user: USER, rating: 4, helpful: null, review: '' }));
    stub(Resource, 'updateOne', () => chainable({}));
    const result = await interaction.setFeedback(String(RES_ID), { helpful: null }, student);
    assert.equal(setPayload.$set.helpful, null);
    assert.equal(result.helpfulCount, 1);
    assert.equal(result.notHelpfulCount, 0);
  });

  it('prevents duplicate open reports and nudges the link checker', async () => {
    const doc = makeResource({ author: OTHER });
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    stub(ResourceReport, 'findOne', () => chainable(null));
    let created = null;
    stub(ResourceReport, 'create', async (row) => { created = row; return row; });
    let updates = 0;
    stub(Resource, 'updateOne', () => { updates += 1; return chainable({}); });
    await interaction.reportResource(String(RES_ID), { reason: 'broken_link', details: 'This page returns a 404 now.' }, student);
    assert.equal(created.reason, 'broken_link');
    assert.equal(updates, 2, 'counter + re-check nudge');

    stub(ResourceReport, 'findOne', () => chainable({ _id: oid('507f1f77bcf86cd799439077') }));
    await assert.rejects(
      () => interaction.reportResource(String(RES_ID), { reason: 'broken_link', details: 'Still broken after a day.' }, student),
      (error) => error.statusCode === 409,
    );
  });

  it('only staff can read or resolve the report queue', async () => {
    await assert.rejects(() => interaction.listReports({ page: 1, limit: 20 }, student), (error) => error.statusCode === 403);
    stub(ResourceReport, 'findById', async () => ({ _id: oid('507f1f77bcf86cd799439077'), status: 'open', save: async () => {} }));
    await assert.rejects(() => interaction.resolveReport(String(oid('507f1f77bcf86cd799439077')), { status: 'resolved', note: '' }, student), (error) => error.statusCode === 403);
  });
});

describe('creator.service — profiles and analytics', () => {
  it('lazily creates a public profile and accepts an update', async () => {
    stub(User, 'findById', () => chainable({ _id: USER, name: 'Ada Lovelace' }));
    stub(CreatorProfile, 'findOne', () => chainable(null));
    let created = null;
    stub(CreatorProfile, 'create', async (doc) => { created = doc; return { _id: oid('507f1f77bcf86cd799439060'), ...doc }; });
    stub(CreatorProfile, 'findById', () => chainable(new CreatorProfile({ _id: oid('507f1f77bcf86cd799439060'), user: USER, displayName: 'Ada Lovelace' })));
    const mine = await creatorService.getMyProfile(student);
    assert.equal(mine.profile.displayName, 'Ada Lovelace');
    assert.equal(mine.profile.isOwner, true);
    assert.equal(created.verified, false);

    const doc = new CreatorProfile({ _id: oid('507f1f77bcf86cd799439060'), user: USER, displayName: 'Ada' });
    stub(CreatorProfile, 'findOne', () => chainable(doc));
    stub(CreatorProfile.prototype, 'save', async function save() { return this; });
    const updated = await creatorService.upsertMyProfile({ displayName: 'Ada L.', expertise: ['Arrays'] }, student);
    assert.equal(updated.profile.displayName, 'Ada L.');
  });

  it('only the owner (or analytics:read staff) sees analytics', async () => {
    const resourceRows = [{ viewCount: 100, saveCount: 20, startCount: 40, completionCount: 10, ratingCount: 4, ratingSum: 18 }];
    stub(Resource, 'find', () => chainable(resourceRows));
    stub(ResourceEvent, 'find', () => chainable([
      { resource: RES_ID, type: 'view', dayKey: '2026-10-28' },
      { resource: RES_ID, type: 'start', dayKey: '2026-10-28' },
    ]));
    await assert.rejects(() => creatorService.getAnalytics(stranger, {}, { creatorId: String(USER) }), (error) => error.statusCode === 403);
    const own = await creatorService.getAnalytics(student, { days: 7 });
    assert.equal(own.totals.views, 100);
    assert.equal(own.totals.publishedResources, 1);
    assert.equal(own.totals.ratingAverage, 4.5);
    assert.equal(own.conversion.startRate, 40);
    assert.equal(own.conversion.completionRate, 25);
    assert.equal(own.series.length, 7);
    const staff = await creatorService.getAnalytics(analyst, { days: 7 }, { creatorId: String(USER) });
    assert.equal(staff.totals.views, 100);
  });
});
```

## `server/tests/resources.routes.test.js`

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
const ID = '507f1f77bcf86cd799439010';
const RESOURCE = `/resources/${ID}`;
const REPORT = '/resources/reports/507f1f77bcf86cd799439077';

describe('Phase-6 route protection', () => {
  it('rejects anonymous access to every resource route', async () => {
    const endpoints = [
      ['get', '/resources'], ['post', '/resources'],
      ['get', '/resources/check-duplicate?url=https%3A%2F%2Fexample.com'],
      ['get', '/resources/saved'], ['get', '/resources/reports'],
      ['patch', REPORT], ['post', '/resources/link-check/run'],
      ['get', RESOURCE], ['patch', RESOURCE], ['delete', RESOURCE],
      ['post', `${RESOURCE}/submit`], ['post', `${RESOURCE}/revision`],
      ['post', `${RESOURCE}/restore`], ['post', `${RESOURCE}/moderate`],
      ['post', `${RESOURCE}/publish`], ['post', `${RESOURCE}/check-link`],
      ['put', `${RESOURCE}/save`], ['delete', `${RESOURCE}/save`],
      ['put', `${RESOURCE}/rating`], ['get', `${RESOURCE}/ratings`],
      ['put', `${RESOURCE}/feedback`], ['post', `${RESOURCE}/report`],
      ['post', `${RESOURCE}/events`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to every creator route', async () => {
    const endpoints = [
      ['get', '/creators'], ['get', '/creators/me'], ['put', '/creators/me'],
      ['get', '/creators/me/analytics'], ['get', `/creators/${ID}`],
      ['get', `/creators/${ID}/analytics`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.data, null);
      assert.equal(res.body.errors, null);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const create = await request.post(`${base}/resources`).send({ title: 'x', url: 'javascript:alert(1)', hacker: 1 });
    assert.equal(create.status, 401);
    assert.equal(create.body.errors, null);
    const rating = await request.put(`${base}${RESOURCE}/rating`).send({ rating: 99 });
    assert.equal(rating.status, 401);
    const duplicate = await request.get(`${base}/resources/check-duplicate?url=nope`);
    assert.equal(duplicate.status, 401);
    assert.equal(duplicate.body.errors, null);
  });

  it('keeps the health probe public and earlier phases protected', async () => {
    assert.equal((await request.get(`${base}/health`)).status, 200);
    for (const path of ['/plans', '/dashboard', '/mocks', '/quizzes', '/sheets']) {
      assert.equal((await request.get(`${base}${path}`)).status, 401, path);
    }
  });
});
```

---

# Phase 4/5 additive integrations

## `server/src/modules/mocks/mockAnalysis.service.js`

```js
import mongoose from 'mongoose';
import { MOCK_LIMITS, MOCK_STATUSES, PLATFORM_VALUES, RESOURCE_TYPE_VALUES } from '@algonest/shared';
import { Sheet } from '../../models/Sheet.js';
import { PersonalResource } from '../../models/PersonalResource.js';
import { Resource } from '../../models/Resource.js';
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

  // Phase 6 — published directory resources for the same weak topics.
  // Skip the query entirely when Mongo is disconnected so diagnostics never
  // hang on a buffering Mongoose query (also keeps DB-free tests fast).
  if (mongoose.connection.readyState === 1) {
    const directory = await Resource.find({
      status: 'published', topic: { $in: topics }, linkStatus: { $ne: 'broken' },
    }).select('title url topic type').limit(20).lean().catch(() => []);
    for (const resource of directory) {
      candidates.push({
        title: resource.title,
        url: resource.url,
        type: RESOURCE_TYPE_VALUES.includes(resource.type) ? resource.type : 'article',
        topic: resource.topic,
        source: 'directory',
        reason: `From the reviewed resource directory — ${weak.find((entry) => entry.topic === resource.topic)?.advice ?? 'practise this topic'}`,
        weight: severity.get(resource.topic) ?? 0,
      });
    }
  }

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
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to={topics.length ? `/app/resources?topic=${encodeURIComponent(topics[0].topic)}` : '/app/resources'} className="text-xs font-semibold text-primary hover:underline">Study resources →</Link>
        <Link to="/app/quizzes" className="text-xs font-semibold text-primary hover:underline">Practise a quiz →</Link>
      </div>
    </section>
  );
}
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
  // Phase 6 — Public resource directory + creators.
  resources: {
    all: ['resources'],
    list: (params) => ['resources', 'list', params],
    saved: (params) => ['resources', 'saved', params],
    detail: (id) => ['resources', 'detail', id],
    ratings: (id, params) => ['resources', 'ratings', id, params],
    reports: (params) => ['resources', 'reports', params],
    duplicate: (url) => ['resources', 'duplicate', url],
  },
  creators: {
    all: ['creators'],
    list: (params) => ['creators', 'list', params],
    me: () => ['creators', 'me'],
    detail: (id, params) => ['creators', 'detail', id, params],
    analytics: (id, params) => ['creators', 'analytics', id, params],
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
  { label: 'Resources', to: '/app/resources', icon: 'FolderOpen', ready: true },
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

// Phase 6 — Resource directory + creator profiles. The submission form and
// analytics are separate chunks so the catalogue stays small.
const ResourcesPage = lazy(() => import('../features/resources/pages/ResourcesPage.jsx'));
const ResourceDetailPage = lazy(() => import('../features/resources/pages/ResourceDetailPage.jsx'));
const ResourceEditorPage = lazy(() => import('../features/resources/pages/ResourceEditorPage.jsx'));
const CreatorsPage = lazy(() => import('../features/resources/pages/CreatorsPage.jsx'));
const CreatorPage = lazy(() => import('../features/resources/pages/CreatorPage.jsx'));

// Community keeps its honest placeholder until its phase lands.
const UPCOMING_MODULES = ['community'];

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

              <Route path="resources" element={<ResourcesPage />} />
              <Route path="resources/new" element={<ResourceEditorPage />} />
              <Route path="resources/:id" element={<ResourceDetailPage />} />
              <Route path="resources/:id/edit" element={<ResourceEditorPage />} />
              <Route path="creators" element={<CreatorsPage />} />
              <Route path="creators/me" element={<CreatorPage />} />
              <Route path="creators/:id" element={<CreatorPage />} />

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
  ['ResourcesPage', '/src/features/resources/pages/ResourcesPage.jsx'],
  ['ResourceDetailPage', '/src/features/resources/pages/ResourceDetailPage.jsx'],
  ['ResourceEditorPage', '/src/features/resources/pages/ResourceEditorPage.jsx'],
  ['CreatorsPage', '/src/features/resources/pages/CreatorsPage.jsx'],
  ['CreatorPage', '/src/features/resources/pages/CreatorPage.jsx'],
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

# Client — resources api / hooks / lib (new)

## `client/src/features/resources/api/resourceApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Public moderated resource directory (/api/v1/resources). */
export const resourceApi = {
  list: (params) => api.get('/resources', { query: params }),
  saved: (params) => api.get('/resources/saved', { query: params }),
  get: (id) => api.get(`/resources/${id}`),
  create: (body) => api.post('/resources', body),
  update: (id, body) => api.patch(`/resources/${id}`, body),
  archive: (id) => api.delete(`/resources/${id}`),
  checkDuplicate: (url) => api.get('/resources/check-duplicate', { query: { url } }),

  submit: (id) => api.post(`/resources/${id}/submit`, {}),
  revision: (id) => api.post(`/resources/${id}/revision`, {}),
  restore: (id) => api.post(`/resources/${id}/restore`, {}),
  moderate: (id, body) => api.post(`/resources/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/resources/${id}/publish`, { changelog }),
  checkLink: (id) => api.post(`/resources/${id}/check-link`, {}),
  runLinkCheck: (params) => api.post('/resources/link-check/run', {}, { query: params }),

  save: (id) => api.put(`/resources/${id}/save`, {}),
  unsave: (id) => api.delete(`/resources/${id}/save`),
  rate: (id, body) => api.put(`/resources/${id}/rating`, body),
  ratings: (id, params) => api.get(`/resources/${id}/ratings`, { query: params }),
  feedback: (id, helpful) => api.put(`/resources/${id}/feedback`, { helpful }),
  report: (id, body) => api.post(`/resources/${id}/report`, body),
  event: (id, type) => api.post(`/resources/${id}/events`, { type }),

  reports: (params) => api.get('/resources/reports', { query: params }),
  resolveReport: (reportId, body) => api.patch(`/resources/reports/${reportId}`, body),
};

export default resourceApi;
```

## `client/src/features/resources/api/creatorApi.js`

```js
import api from '../../../lib/apiClient.js';

/** Public creator profiles + analytics (/api/v1/creators). */
export const creatorApi = {
  list: (params) => api.get('/creators', { query: params }),
  me: () => api.get('/creators/me'),
  updateMe: (body) => api.put('/creators/me', body),
  get: (id, params) => api.get(`/creators/${id}`, { query: params }),
  myAnalytics: (params) => api.get('/creators/me/analytics', { query: params }),
  analytics: (id, params) => api.get(`/creators/${id}/analytics`, { query: params }),
};

export default creatorApi;
```

## `client/src/features/resources/hooks/useResources.js`

```js
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import resourceApi from '../api/resourceApi.js';
import creatorApi from '../api/creatorApi.js';

function useInvalidators() {
  const qc = useQueryClient();
  return {
    all: () => {
      qc.invalidateQueries({ queryKey: queryKeys.resources.all });
      qc.invalidateQueries({ queryKey: queryKeys.creators.all });
    },
    resource: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.resources.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.resources.ratings(id) });
      qc.invalidateQueries({ queryKey: queryKeys.resources.all });
    },
  };
}

export function useResourceList(params) {
  return useQuery({ queryKey: queryKeys.resources.list(params), queryFn: () => resourceApi.list(params), placeholderData: keepPreviousData });
}

export function useSavedResources(params) {
  return useQuery({ queryKey: queryKeys.resources.saved(params), queryFn: () => resourceApi.saved(params), placeholderData: keepPreviousData });
}

export function useResource(id) {
  return useQuery({ queryKey: queryKeys.resources.detail(id), queryFn: () => resourceApi.get(id), enabled: Boolean(id) });
}

export function useResourceRatings(id, params = {}, enabled = true) {
  return useQuery({ queryKey: queryKeys.resources.ratings(id, params), queryFn: () => resourceApi.ratings(id, params), enabled: Boolean(id) && enabled });
}

export function useDuplicateCheck(url, enabled = false) {
  return useQuery({
    queryKey: queryKeys.resources.duplicate(url),
    queryFn: () => resourceApi.checkDuplicate(url),
    enabled: Boolean(url) && enabled,
    retry: false,
  });
}

export function useResourceReports(params, enabled = true) {
  return useQuery({ queryKey: queryKeys.resources.reports(params), queryFn: () => resourceApi.reports(params), enabled });
}

export function useCreateResource() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: resourceApi.create, onSuccess: () => invalidate.all() });
}

export function useUpdateResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => resourceApi.update(id, body), onSuccess: () => invalidate.resource(id) });
}

export function useResourceLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.resource(id);
  return {
    submit: useMutation({ mutationFn: () => resourceApi.submit(id), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => resourceApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: () => resourceApi.publish(id), onSuccess }),
    revision: useMutation({ mutationFn: () => resourceApi.revision(id), onSuccess }),
    restore: useMutation({ mutationFn: () => resourceApi.restore(id), onSuccess }),
    archive: useMutation({ mutationFn: () => resourceApi.archive(id), onSuccess }),
    checkLink: useMutation({ mutationFn: () => resourceApi.checkLink(id), onSuccess }),
  };
}

export function useRunLinkCheck() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (params) => resourceApi.runLinkCheck(params), onSuccess: () => invalidate.all() });
}

export function useSaveResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (saved) => saved ? resourceApi.unsave(id) : resourceApi.save(id), onSuccess: () => invalidate.resource(id) });
}

export function useRateResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => resourceApi.rate(id, body), onSuccess: () => invalidate.resource(id) });
}

export function useFeedback(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (helpful) => resourceApi.feedback(id, helpful), onSuccess: () => invalidate.resource(id) });
}

export function useReportResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => resourceApi.report(id, body), onSuccess: () => invalidate.resource(id) });
}

export function useTrackResourceEvent(id) {
  return useMutation({ mutationFn: (type) => resourceApi.event(id, type) });
}

export function useResolveReport() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: ({ reportId, body }) => resourceApi.resolveReport(reportId, body), onSuccess: () => invalidate.all() });
}

/* Creators */
export function useCreatorList(params) {
  return useQuery({ queryKey: queryKeys.creators.list(params), queryFn: () => creatorApi.list(params), placeholderData: keepPreviousData });
}

export function useMyCreatorProfile(enabled = true) {
  return useQuery({ queryKey: queryKeys.creators.me(), queryFn: () => creatorApi.me(), enabled });
}

export function useCreator(id, params = {}) {
  return useQuery({ queryKey: queryKeys.creators.detail(id, params), queryFn: () => creatorApi.get(id, params), enabled: Boolean(id) });
}

export function useMyAnalytics(params = {}) {
  return useQuery({ queryKey: queryKeys.creators.analytics('me', params), queryFn: () => creatorApi.myAnalytics(params) });
}

export function useCreatorAnalytics(id, params = {}, enabled = true) {
  return useQuery({ queryKey: queryKeys.creators.analytics(id, params), queryFn: () => creatorApi.analytics(id, params), enabled: Boolean(id) && enabled });
}

export function useUpdateCreatorProfile() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: creatorApi.updateMe,
    onSuccess: () => {
      invalidate.all();
      invalidate.resource('me');
    },
  });
}

export default useResourceList;
```

## `client/src/features/resources/lib/resourceUtils.js`

```js
import {
  DIFFICULTY_LABELS, PLATFORM_LABELS, PLATFORM_VALUES, REPORT_REASON_VALUES,
  RESOURCE_EVENT_TYPE_VALUES, RESOURCE_LANGUAGE_LABELS, RESOURCE_LANGUAGE_VALUES,
  RESOURCE_LEVEL_LABELS, RESOURCE_LEVEL_VALUES, RESOURCE_LINK_STATUS_LABELS,
  RESOURCE_PRICING_LABELS, RESOURCE_PRICING_VALUES, RESOURCE_SORT_OPTIONS,
  RESOURCE_STATUS_LABELS, RESOURCE_STATUS_VALUES, RESOURCE_TYPE_VALUES,
} from '@algonest/shared/constants';

export const TYPE_LABELS = Object.freeze({
  video: 'Video', article: 'Article', repository: 'GitHub repo',
  pdf: 'PDF / notes', course: 'Course', other: 'Other',
});
export const TYPE_OPTIONS = RESOURCE_TYPE_VALUES.map((value) => ({ value, label: TYPE_LABELS[value] }));
export const LEVEL_OPTIONS = RESOURCE_LEVEL_VALUES.map((value) => ({ value, label: RESOURCE_LEVEL_LABELS[value] }));
export const LANGUAGE_OPTIONS = RESOURCE_LANGUAGE_VALUES.map((value) => ({ value, label: RESOURCE_LANGUAGE_LABELS[value] ?? value }));
export const PRICING_OPTIONS = RESOURCE_PRICING_VALUES.map((value) => ({ value, label: RESOURCE_PRICING_LABELS[value] }));
export const SORT_OPTIONS = RESOURCE_SORT_OPTIONS.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
export const STATUS_OPTIONS = RESOURCE_STATUS_VALUES.map((value) => ({ value, label: RESOURCE_STATUS_LABELS[value] }));
export const PLATFORM_OPTIONS = PLATFORM_VALUES.map((value) => ({ value, label: PLATFORM_LABELS[value] ?? value }));
export const REPORT_REASON_OPTIONS = REPORT_REASON_VALUES.map((value) => ({
  value, label: ({
    broken_link: 'Broken link', wrong_content: 'Wrong or misleading content',
    duplicate: 'Duplicate entry', copyright: 'Copyright issue',
    inappropriate: 'Inappropriate content', other: 'Something else',
  })[value] ?? value,
}));
export const EVENT_LABELS = Object.freeze({
  view: 'Views', save: 'Saves', start: 'Starts', completion: 'Completions',
});
export const EVENT_TYPES = RESOURCE_EVENT_TYPE_VALUES;

export const EMPTY_FILTERS = Object.freeze({
  q: '', topic: '', level: '', language: '', type: '', pricing: '', platform: '', sort: 'newest',
});

export const STATUS_TONE = Object.freeze({
  draft: 'neutral', pending_review: 'warning', changes_requested: 'warning',
  approved: 'accent', published: 'success', rejected: 'danger', archived: 'neutral',
});
export const TYPE_TONE = Object.freeze({
  video: 'danger', article: 'primary', repository: 'accent', pdf: 'warning', course: 'success', other: 'neutral',
});
export const LEVEL_TONE = Object.freeze({ beginner: 'success', intermediate: 'warning', advanced: 'danger' });
export const PRICING_TONE = Object.freeze({ free: 'success', freemium: 'accent', paid: 'warning' });
export const LINK_TONE = Object.freeze({ unchecked: 'neutral', ok: 'success', broken: 'danger', unknown: 'warning' });

export const statusLabel = (value) => RESOURCE_STATUS_LABELS[value] ?? value;
export const levelLabel = (value) => RESOURCE_LEVEL_LABELS[value] ?? value;
export const typeLabel = (value) => TYPE_LABELS[value] ?? value;
export const pricingLabel = (value) => RESOURCE_PRICING_LABELS[value] ?? value;
export const languageLabel = (value) => RESOURCE_LANGUAGE_LABELS[value] ?? value;
export const linkStatusLabel = (value) => RESOURCE_LINK_STATUS_LABELS[value] ?? value;
export const difficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? value;

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

export function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatNumber(value = 0) {
  const number = Number(value) || 0;
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(1)}k`;
  return String(number);
}

/** Safe external link: only http(s) can be rendered as an href. */
export function safeExternalUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function resourceHref(resource) {
  return `/app/resources/${resource?.id ?? resource?._id ?? ''}`;
}

export function creatorHref(creator) {
  const id = creator?.user?.id ?? creator?.id ?? '';
  return `/app/creators/${id}`;
}

/** Compact sparkline points from a daily analytics series. Pure. */
export function sparklinePoints(series = [], key = 'view', width = 240, height = 48) {
  if (!series.length) return '';
  const values = series.map((row) => Number(row[key]) || 0);
  const max = Math.max(1, ...values);
  const step = series.length > 1 ? width / (series.length - 1) : width;
  return values.map((value, index) => `${Math.round(index * step)},${Math.round(height - (value / max) * (height - 4) - 2)}`).join(' ');
}

export default { errorMessage, formatDate };
```

---

# Client — resources components (new)

## `client/src/features/resources/components/ResourceFilters.jsx`

```jsx
import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import {
  LANGUAGE_OPTIONS, LEVEL_OPTIONS, PLATFORM_OPTIONS, PRICING_OPTIONS,
  SORT_OPTIONS, TYPE_OPTIONS,
} from '../lib/resourceUtils.js';

const withAll = (options, label) => [{ value: '', label }, ...options];

export default function ResourceFilters({ filters, onChange, topics = [], showPlatform = false }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filters</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input label="Search" type="search" placeholder="Title, tag, topic…" icon={Search} value={filters.q} onChange={(event) => set('q', event.target.value)} />
        <Select label="Topic" options={withAll(topics.map((value) => ({ value, label: value })), 'All topics')} value={filters.topic} onChange={(event) => set('topic', event.target.value)} />
        <Select label="Level" options={withAll(LEVEL_OPTIONS, 'Any level')} value={filters.level} onChange={(event) => set('level', event.target.value)} />
        <Select label="Language" options={withAll(LANGUAGE_OPTIONS, 'Any language')} value={filters.language} onChange={(event) => set('language', event.target.value)} />
        <Select label="Type" options={withAll(TYPE_OPTIONS, 'All types')} value={filters.type} onChange={(event) => set('type', event.target.value)} />
        <Select label="Pricing" options={withAll(PRICING_OPTIONS, 'Free & paid')} value={filters.pricing} onChange={(event) => set('pricing', event.target.value)} />
        {showPlatform ? <Select label="Platform" options={withAll(PLATFORM_OPTIONS, 'All platforms')} value={filters.platform} onChange={(event) => set('platform', event.target.value)} /> : null}
        <Select label="Sort by" options={SORT_OPTIONS} value={filters.sort} onChange={(event) => set('sort', event.target.value)} />
      </div>
    </div>
  );
}
```

## `client/src/features/resources/components/LinkStatusBadge.jsx`

```jsx
import { CircleHelp, Link2, Link2Off, LoaderCircle } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { LINK_TONE, formatDate, linkStatusLabel } from '../lib/resourceUtils.js';

const ICONS = { unchecked: CircleHelp, ok: Link2, broken: Link2Off, unknown: LoaderCircle };

export default function LinkStatusBadge({ status = 'unchecked', checkedAt, error, showDate = false }) {
  const Icon = ICONS[status] ?? CircleHelp;
  return (
    <span className="inline-flex items-center gap-1" title={error || linkStatusLabel(status)}>
      <Badge variant={LINK_TONE[status] ?? 'neutral'} className="gap-1"><Icon className="h-3 w-3" aria-hidden="true" /> {linkStatusLabel(status)}</Badge>
      {showDate && checkedAt ? <span className="text-[11px] text-muted">checked {formatDate(checkedAt)}</span> : null}
    </span>
  );
}
```

## `client/src/features/resources/components/ResourceCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, Eye, PlayCircle, Star, ThumbsUp } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import LinkStatusBadge from './LinkStatusBadge.jsx';
import {
  LEVEL_TONE, PRICING_TONE, STATUS_TONE, TYPE_TONE, formatNumber, levelLabel,
  pricingLabel, statusLabel, typeLabel,
} from '../lib/resourceUtils.js';

export default function ResourceCard({ resource, showStatus = false }) {
  return (
    <article className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={TYPE_TONE[resource.type] ?? 'neutral'}>{typeLabel(resource.type)}</Badge>
          <Badge variant={LEVEL_TONE[resource.level] ?? 'neutral'}>{levelLabel(resource.level)}</Badge>
          <Badge variant={PRICING_TONE[resource.pricing] ?? 'neutral'}>{pricingLabel(resource.pricing)}</Badge>
        </div>
        {showStatus ? <Badge variant={STATUS_TONE[resource.status] ?? 'neutral'}>{statusLabel(resource.status)}</Badge> : null}
      </div>
      <div className="min-h-0 flex-1">
        <Link to={`/app/resources/${resource.id}`} className="line-clamp-2 text-base font-semibold text-ink hover:text-primary focus-visible:text-primary">{resource.title}</Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{resource.description || 'No description provided.'}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge variant="primary">{resource.topic}</Badge>
        <span>{resource.platformLabel}</span>
        <span>·</span>
        <span>{resource.language === 'agnostic' ? 'Language agnostic' : resource.language}</span>
        {resource.tags?.slice(0, 2).map((tag) => <span key={tag} className="rounded-md bg-surface-2 px-1.5 py-0.5">#{tag}</span>)}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1" title="Rating"><Star className="h-3.5 w-3.5 text-warning" aria-hidden="true" /> {resource.ratingAverage || '—'} ({formatNumber(resource.ratingCount)})</span>
        <span className="inline-flex items-center gap-1" title="Helpful votes"><ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.helpfulCount)}</span>
        <span className="inline-flex items-center gap-1" title="Views"><Eye className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.viewCount)}</span>
        <span className="inline-flex items-center gap-1" title="Saves"><Bookmark className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.saveCount)}</span>
        <span className="inline-flex items-center gap-1" title="Starts"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.startCount)}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LinkStatusBadge status={resource.linkStatus} checkedAt={resource.linkCheckedAt} error={resource.linkCheckError} />
        <span className="flex items-center gap-2">
          <Link to={`/app/creators/${resource.author?.id ?? ''}`} className="truncate text-xs text-muted hover:text-primary">{resource.author?.name ?? 'Creator'}</Link>
          <a href={resource.url} target="_blank" rel="noopener noreferrer nofollow" aria-label={`Open ${resource.title} in a new tab`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:border-primary/40 hover:text-primary"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
        </span>
      </div>
    </article>
  );
}
```

## `client/src/features/resources/components/StarRating.jsx`

```jsx
import { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

/** Accessible 1–5 star input. Uses radio semantics, not a hover-only widget. */
export default function StarRating({ value = null, average = 0, count = 0, onSubmit, pending = false, disabled = false }) {
  const [rating, setRating] = useState(value ?? 0);
  const [review, setReview] = useState('');
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Rate this resource</h2>
        <span className="text-xs text-muted">Average {average || '—'} / 5 · {count} rating(s)</span>
      </div>
      {disabled ? <p className="text-xs text-muted">You cannot rate your own submission.</p> : (
        <>
          <fieldset disabled={pending}>
            <legend className="sr-only">Your rating from 1 to 5 stars</legend>
            <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star} type="button" role="radio" aria-checked={rating === star}
                  aria-label={`${star} star${star === 1 ? '' : 's'}`}
                  onClick={() => setRating(star)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${rating >= star ? 'border-warning bg-warning/15 text-warning' : 'border-line text-muted hover:border-warning/40'}`}
                ><Star className="h-4 w-4" fill={rating >= star ? 'currentColor' : 'none'} aria-hidden="true" /></button>
              ))}
            </div>
          </fieldset>
          <Input label="Review (optional)" value={review} onChange={(event) => setReview(event.target.value)} maxLength={1000} placeholder="What was useful? What was missing?" />
          <Button size="sm" disabled={!rating || pending} loading={pending} onClick={() => onSubmit({ rating, review: review.trim() })}>Save rating</Button>
        </>
      )}
    </section>
  );
}
```

## `client/src/features/resources/components/HelpfulVote.jsx`

```jsx
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';

export default function HelpfulVote({ value = null, helpfulCount = 0, notHelpfulCount = 0, onChange, pending = false }) {
  const vote = (next) => onChange(value === next ? null : next);
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-ink">Was this helpful?</h2>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={value === true ? 'primary' : 'secondary'} className="gap-1.5" disabled={pending} aria-pressed={value === true} onClick={() => vote(true)}><ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> Yes · {helpfulCount}</Button>
        <Button size="sm" variant={value === false ? 'danger' : 'secondary'} className="gap-1.5" disabled={pending} aria-pressed={value === false} onClick={() => vote(false)}><ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" /> No · {notHelpfulCount}</Button>
        {value !== null ? <button type="button" onClick={() => onChange(null)} className="text-xs text-muted underline hover:text-primary">Withdraw vote</button> : null}
      </div>
      <p className="text-xs text-muted">Net score {helpfulCount - notHelpfulCount}. Withdraw by clicking your vote again.</p>
    </section>
  );
}
```

## `client/src/features/resources/components/DuplicateWarning.jsx`

```jsx
import { Link } from 'react-router-dom';
import { Copy } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';

export default function DuplicateWarning({ check, isLoading, url }) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  if (isLoading) return <Skeleton className="h-12 w-full" />;
  if (!check) return null;
  if (!check.duplicate) return <Alert variant="success">This link is not in the directory yet — good to submit.</Alert>;
  return (
    <Alert variant="warning" title="Possible duplicate">
      <span className="flex flex-wrap items-center gap-2">
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        {check.resource?.id
          ? <><strong>{check.resource.title}</strong> ({check.resource.status}) already uses this link. {check.resource.id ? <Link to={`/app/resources/${check.resource.id}`} className="underline">Open it instead</Link> : null}</>
          : 'A submission with this canonical link already exists. Choose a different URL or wait for review.'}
      </span>
    </Alert>
  );
}
```

## `client/src/features/resources/components/ResourceSubmitForm.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link2, Send } from 'lucide-react';
import { resourceCreateSchema } from '@algonest/shared';
import { SHEET_TOPICS } from '@algonest/shared/constants';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import DuplicateWarning from './DuplicateWarning.jsx';
import { useDuplicateCheck } from '../hooks/useResources.js';
import {
  LANGUAGE_OPTIONS, LEVEL_OPTIONS, PRICING_OPTIONS, TYPE_OPTIONS, contractErrors,
} from '../lib/resourceUtils.js';

const EMPTY = {
  title: '', url: '', description: '', type: 'article', topic: 'General',
  level: 'beginner', language: 'agnostic', pricing: 'free', tags: '', submit: false,
};

export default function ResourceSubmitForm({ initial = null, onSubmit, pending = false, error, submitLabel = 'Submit resource' }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initial ? {
      title: initial.title ?? '', url: initial.url ?? '', description: initial.description ?? '',
      type: initial.type ?? 'article', topic: initial.topic ?? 'General',
      level: initial.level ?? 'beginner', language: initial.language ?? 'agnostic',
      pricing: initial.pricing ?? 'free', tags: (initial.tags ?? []).join(', '),
    } : {}),
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const debouncedUrl = useMemo(() => form.url.trim(), [form.url]);
  const duplicate = useDuplicateCheck(debouncedUrl, /^https?:\/\/\S+\.\S+/i.test(debouncedUrl));

  const build = (submit) => ({
    title: form.title.trim(), url: form.url.trim(), description: form.description.trim(),
    type: form.type, topic: form.topic.trim() || 'General', level: form.level,
    language: form.language, pricing: form.pricing,
    tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    submit,
  });

  const validate = (submit) => resourceCreateSchema.safeParse(build(submit));

  const send = (submit) => {
    const parsed = validate(submit);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setFormError(parsed.error.issues[0]?.message ?? 'Check the form.');
      return;
    }
    if (duplicate.data?.duplicate) { setFormError('That link is already in the directory. Choose a different URL.'); return; }
    setErrors({}); setFormError('');
    onSubmit(parsed.data);
  };

  return (
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); send(true); }} noValidate>
      {formError ? <Alert variant="error" onDismiss={() => setFormError('')}>{formError}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Title" required icon={Link2} value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Dynamic Programming patterns" maxLength={160} />
        <Input label="Link" required type="url" value={form.url} onChange={(event) => set('url', event.target.value)} error={errors.url} placeholder="https://…" maxLength={2000} hint="http(s) only. Tracking params are stripped automatically." />
      </div>
      <DuplicateWarning check={duplicate.data} isLoading={duplicate.isFetching} url={debouncedUrl} />
      <div>
        <label htmlFor="resource-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea id="resource-description" rows={4} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What will a learner get from this? Prerequisites, length, key topics…" />
        {errors.description ? <p role="alert" className="mt-1 text-xs text-danger">{errors.description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={(event) => set('type', event.target.value)} error={errors.type} />
        <Select label="Level" options={LEVEL_OPTIONS} value={form.level} onChange={(event) => set('level', event.target.value)} />
        <Select label="Language" options={LANGUAGE_OPTIONS} value={form.language} onChange={(event) => set('language', event.target.value)} />
        <Select label="Pricing" options={PRICING_OPTIONS} value={form.pricing} onChange={(event) => set('pricing', event.target.value)} />
        <Input label="Topic" list="resource-topic-list" value={form.topic} onChange={(event) => set('topic', event.target.value)} error={errors.topic} maxLength={60} />
        <Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} error={errors.tags} placeholder="dp, patterns, revision" />
      </div>
      <datalist id="resource-topic-list">{SHEET_TOPICS.map((topic) => <option key={topic} value={topic} />)}</datalist>
      {errors._ ? <Alert variant="error">{errors._}</Alert> : null}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-muted">Submissions are reviewed before they appear publicly. You can edit a draft or a rejected submission.</p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => send(false)} disabled={pending}>Save draft</Button>
          <Button type="submit" className="gap-1.5" loading={pending}><Send className="h-3.5 w-3.5" aria-hidden="true" /> {submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
```

## `client/src/features/resources/components/ReviewList.jsx`

```jsx
import { Star } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { formatDate } from '../lib/resourceUtils.js';

export default function ReviewList({ data, isLoading, isError, error }) {
  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>;
  if (isError) return <p className="text-sm text-danger">{error?.message ?? 'Could not load reviews.'}</p>;
  const items = data?.items ?? [];
  if (!items.length) return <EmptyState compact icon={Star} title="No written reviews yet" description="Be the first to rate this resource." />;
  return (
    <ul className="space-y-2">
      {items.map((review) => (
        <li key={review.id} className="rounded-xl border border-line bg-surface-2/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{review.user?.name ?? 'Student'}</span>
            <span className="inline-flex items-center gap-1 text-xs text-warning">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-3 w-3" fill={star <= review.rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</span>
          </div>
          {review.review ? <p className="mt-1.5 text-sm text-muted">{review.review}</p> : null}
          <p className="mt-1 text-[11px] text-muted">{formatDate(review.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
}
```

## `client/src/features/resources/components/ReportDialog.jsx`

```jsx
import { useState } from 'react';
import { Flag } from 'lucide-react';
import { resourceReportSchema } from '@algonest/shared';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Select from '../../../components/ui/Select.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { REPORT_REASON_OPTIONS, contractErrors } from '../lib/resourceUtils.js';

export default function ReportDialog({ open, onClose, onSubmit, pending = false, error }) {
  const [reason, setReason] = useState('broken_link');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const submit = () => {
    const parsed = resourceReportSchema.safeParse({ reason, details: details.trim() });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setMessage(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setMessage('');
    onSubmit(parsed.data);
  };

  return (
    <Modal open={open} onClose={onClose} title="Report this resource" description="Reports are reviewed by a moderator. Abuse of this form can lead to account restrictions."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="danger" className="gap-1.5" loading={pending} onClick={submit}><Flag className="h-3.5 w-3.5" aria-hidden="true" /> Send report</Button></>}>
      <div className="space-y-3">
        {message ? <Alert variant="error">{message}</Alert> : null}
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Select label="Reason" options={REPORT_REASON_OPTIONS} value={reason} onChange={(event) => setReason(event.target.value)} error={errors.reason} />
        <div>
          <label htmlFor="report-details" className="mb-1.5 block text-sm font-medium text-ink">Details</label>
          <textarea id="report-details" rows={4} maxLength={1000} value={details} onChange={(event) => setDetails(event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What exactly is wrong? Include enough detail for a moderator to verify." />
          {errors.details ? <p role="alert" className="mt-1 text-xs text-danger">{errors.details}</p> : null}
        </div>
      </div>
    </Modal>
  );
}
```

## `client/src/features/resources/components/ResourceDetail.jsx`

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, CheckCircle2, ExternalLink, Eye, Flag, PlayCircle, Star, ThumbsUp,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import LinkStatusBadge from './LinkStatusBadge.jsx';
import StarRating from './StarRating.jsx';
import HelpfulVote from './HelpfulVote.jsx';
import ReviewList from './ReviewList.jsx';
import ReportDialog from './ReportDialog.jsx';
import {
  LEVEL_TONE, PRICING_TONE, STATUS_TONE, TYPE_TONE, formatDate, formatNumber,
  languageLabel, levelLabel, linkStatusLabel, pricingLabel, safeExternalUrl,
  statusLabel, typeLabel,
} from '../lib/resourceUtils.js';

export default function ResourceDetail({
  resource, ratings, ratingsLoading, ratingsError, ratingsLoadError,
  onSave, onRate, onFeedback, onReport, onTrack,
  saving = false, ratingPending = false, feedbackPending = false, reportPending = false,
  reportError = '', canManage = false, moderation = null,
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const external = safeExternalUrl(resource.url);
  const isOwner = canManage && String(resource.author?.id) === String(resource.myAuthorId);

  const open = () => {
    onTrack?.('start');
    if (external) window.open(external, '_blank', 'noopener,noreferrer,nofollow');
  };
  const complete = () => { setCompleted(true); onTrack?.('completion'); };

  return (
    <div className="space-y-5">
      <header className="ag-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={TYPE_TONE[resource.type] ?? 'neutral'}>{typeLabel(resource.type)}</Badge>
              <Badge variant={LEVEL_TONE[resource.level] ?? 'neutral'}>{levelLabel(resource.level)}</Badge>
              <Badge variant={PRICING_TONE[resource.pricing] ?? 'neutral'}>{pricingLabel(resource.pricing)}</Badge>
              <Badge variant="primary">{resource.topic}</Badge>
              {canManage ? <Badge variant={STATUS_TONE[resource.status] ?? 'neutral'}>{statusLabel(resource.status)}</Badge> : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{resource.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{resource.description || 'No description provided.'}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>{resource.platformLabel} · {languageLabel(resource.language)}</span>
              <span>·</span>
              <Link to={`/app/creators/${resource.author?.id ?? ''}`} className="font-semibold text-primary hover:underline">{resource.author?.name ?? 'Creator'}</Link>
              <span>·</span><span>published {formatDate(resource.publishedAt ?? resource.createdAt)}</span>
            </p>
            {resource.tags?.length ? <div className="mt-3 flex flex-wrap gap-1.5">{resource.tags.map((tag) => <span key={tag} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">#{tag}</span>)}</div> : null}
          </div>
          <LinkStatusBadge status={resource.linkStatus} checkedAt={resource.linkCheckedAt} error={resource.linkCheckError} showDate />
        </div>

        {resource.linkStatus === 'broken' ? <Alert variant="warning" className="mt-4">This link was flagged as broken on {formatDate(resource.linkCheckedAt)}. {resource.linkCheckError || linkStatusLabel(resource.linkStatus)} — a moderator will re-check it soon.</Alert> : null}

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { Icon: Star, label: 'Rating', value: `${resource.ratingAverage || '—'} / 5`, hint: `${formatNumber(resource.ratingCount)} ratings` },
            { Icon: ThumbsUp, label: 'Helpful', value: formatNumber(resource.helpfulCount), hint: `${formatNumber(resource.notHelpfulCount)} not helpful` },
            { Icon: Eye, label: 'Views', value: formatNumber(resource.viewCount), hint: `${formatNumber(resource.startCount)} starts` },
            { Icon: Bookmark, label: 'Saves', value: formatNumber(resource.saveCount), hint: `${formatNumber(resource.completionCount)} completions` },
          ].map(({ Icon, label, value, hint }) => (
            <div key={label} className="rounded-xl border border-line bg-surface-2/40 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {label}</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
              <dd className="text-[11px] text-muted">{hint}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
          <Button className="gap-1.5" disabled={!external} onClick={open}><PlayCircle className="h-4 w-4" aria-hidden="true" /> Open resource</Button>
          <Button variant="secondary" className="gap-1.5" onClick={() => onSave(!resource.saved)} loading={saving} aria-pressed={resource.saved}><Bookmark className="h-4 w-4" fill={resource.saved ? 'currentColor' : 'none'} aria-hidden="true" /> {resource.saved ? 'Saved' : 'Save'}</Button>
          <Button variant="secondary" className="gap-1.5" disabled={completed} onClick={complete}><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {completed ? 'Completed' : 'Mark complete'}</Button>
          <Button variant="ghost" className="gap-1.5 text-danger" onClick={() => setReportOpen(true)}><Flag className="h-4 w-4" aria-hidden="true" /> Report</Button>
          {external ? <a href={external} target="_blank" rel="noopener noreferrer nofollow" className="ml-auto inline-flex items-center gap-1 self-center text-xs text-muted hover:text-primary">Raw link <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a> : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="ag-card p-5"><StarRating value={resource.myRating} average={resource.ratingAverage} count={resource.ratingCount} onSubmit={onRate} pending={ratingPending} disabled={isOwner} /></section>
        <section className="ag-card p-5"><HelpfulVote value={resource.myHelpful} helpfulCount={resource.helpfulCount} notHelpfulCount={resource.notHelpfulCount} onChange={onFeedback} pending={feedbackPending} /></section>
      </div>

      <section className="ag-card p-5"><h2 className="mb-3 text-sm font-semibold text-ink">Reviews</h2><ReviewList data={ratings} isLoading={ratingsLoading} isError={ratingsError} error={ratingsLoadError} /></section>
      {moderation}
      <ReportDialog
        open={reportOpen} onClose={() => setReportOpen(false)} pending={reportPending} error={reportError}
        onSubmit={(body) => onReport(body, () => setReportOpen(false))}
      />
    </div>
  );
}
```

## `client/src/features/resources/components/ResourceModerationPanel.jsx`

```jsx
import { useState } from 'react';
import { Check, RotateCcw, Send, ShieldCheck, X, Zap } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_TONE, errorMessage, formatDate, statusLabel } from '../lib/resourceUtils.js';
import { useResourceLifecycle } from '../hooks/useResources.js';

const CAN_SUBMIT = ['draft', 'changes_requested', 'rejected', 'approved'];

export default function ResourceModerationPanel({ resource, canModerate = false }) {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lifecycle = useResourceLifecycle(resource.id);
  const status = resource.status;

  const run = (mutation, args, successText) => {
    setMessage('');
    mutation.mutate(args, {
      onSuccess: () => { setMessage(successText); setNote(''); },
      onError: (error) => setMessage(errorMessage(error)),
    });
  };
  const anyPending = Object.values(lifecycle).some((mutation) => mutation.isPending);

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Publication &amp; link health</h2>
        <Badge variant={STATUS_TONE[status] ?? 'neutral'}>{statusLabel(status)}</Badge>
      </div>
      {message ? <Alert variant="info">{message}</Alert> : null}
      {resource.reviewNote ? <div className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-ink"><p className="font-semibold text-warning">Last reviewer note</p><p className="mt-1">{resource.reviewNote}</p></div> : null}
      <div>
        <label htmlFor="resource-review-note" className="mb-1.5 block text-sm font-medium text-ink">Changelog / review note</label>
        <textarea id="resource-review-note" rows={2} maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Explain a rejection, or describe your changes…" className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
      </div>
      <div className="flex flex-wrap gap-2">
        {CAN_SUBMIT.includes(status) ? <Button size="sm" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.submit, undefined, 'Submitted for review.')}><Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit for review</Button> : null}
        {status === 'pending_review' && canModerate ? <>
          <Button size="sm" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.moderate, { decision: 'approve', note }, 'Resource approved.')}><Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve</Button>
          <Button size="sm" variant="secondary" disabled={!note.trim() || anyPending} onClick={() => run(lifecycle.moderate, { decision: 'request_changes', note }, 'Changes requested.')}>Request changes</Button>
          <Button size="sm" variant="danger" className="gap-1.5" disabled={!note.trim() || anyPending} onClick={() => run(lifecycle.moderate, { decision: 'reject', note }, 'Resource rejected.')}><X className="h-3.5 w-3.5" aria-hidden="true" /> Reject</Button>
        </> : null}
        {status === 'approved' ? <Button size="sm" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.publish, undefined, 'Published.')}><Check className="h-3.5 w-3.5" aria-hidden="true" /> Publish</Button> : null}
        {status === 'published' ? <>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.revision, undefined, 'New draft revision started.')}><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start revision</Button>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.checkLink, undefined, 'Link checked.')}><Zap className="h-3.5 w-3.5" aria-hidden="true" /> Check link now</Button>
        </> : null}
        {status === 'archived' ? <Button size="sm" variant="secondary" disabled={anyPending} onClick={() => run(lifecycle.restore, undefined, 'Restored to draft.')}>Restore</Button> : null}
      </div>
      <div className="border-t border-line pt-3 text-xs text-muted">
        <p>Link: <span className="font-mono text-ink">{resource.linkStatus}</span>{resource.linkHttpStatus ? ` (HTTP ${resource.linkHttpStatus})` : ''} · checked {formatDate(resource.linkCheckedAt)}</p>
        <p className="mt-1">Canonical key: <span className="font-mono text-ink">{resource.urlKey}</span> · {resource.reportCount ?? 0} report(s)</p>
      </div>
      {resource.reviewHistory?.length ? <ol className="space-y-1 border-t border-line pt-3 text-xs text-muted">{resource.reviewHistory.slice(-4).reverse().map((entry, index) => <li key={`${entry.at}-${index}`}><span className="font-medium text-ink">{entry.decision || entry.to}</span> · {formatDate(entry.at)}{entry.note ? ` — ${entry.note}` : ''}</li>)}</ol> : null}
      {Object.values(lifecycle).find((mutation) => mutation.isError) ? <Alert variant="error">{errorMessage(Object.values(lifecycle).find((mutation) => mutation.isError).error)}</Alert> : null}
    </section>
  );
}
```

## `client/src/features/resources/components/ReportQueue.jsx`

```jsx
import { Flag } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { formatDate } from '../lib/resourceUtils.js';

export default function ReportQueue({ data, isLoading, isError, error, status, onChangeStatus, onResolve, resolving = false }) {
  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)}</div>;
  if (isError) return <Alert variant="error">{error?.message ?? 'Could not load reports.'}</Alert>;
  const items = data?.items ?? [];
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Flag className="h-4 w-4 text-danger" aria-hidden="true" /> Report queue</h2>
        <div className="flex gap-1">
          {['open', 'resolved', 'dismissed'].map((value) => (
            <button key={value} type="button" onClick={() => onChangeStatus(value)} aria-pressed={status === value} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${status === value ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2'}`}>{value}</button>
          ))}
        </div>
      </div>
      {!items.length ? <EmptyState compact icon={Flag} title="Queue is clear" description="No reports with this status." /> : (
        <ul className="space-y-2">{items.map((report) => (
          <li key={report.id} className="rounded-xl border border-line bg-surface p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{report.resource?.title ?? 'Removed resource'}</p>
                <p className="mt-0.5 text-xs text-muted">{report.reporter?.name ?? 'Student'} · {formatDate(report.createdAt)} · <Badge variant="warning">{report.reason.replaceAll('_', ' ')}</Badge></p>
              </div>
              {report.status === 'open' ? <div className="flex gap-1"><Button size="sm" variant="secondary" disabled={resolving} onClick={() => onResolve(report.id, 'resolved')}>Resolve</Button><Button size="sm" variant="ghost" disabled={resolving} onClick={() => onResolve(report.id, 'dismissed')}>Dismiss</Button></div> : <Badge variant="success">{report.status}</Badge>}
            </div>
            <p className="mt-2 text-xs text-muted">{report.details}</p>
          </li>
        ))}</ul>
      )}
    </section>
  );
}
```

## `client/src/features/resources/components/CreatorCard.jsx`

```jsx
import { Link } from 'react-router-dom';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { safeExternalUrl } from '../lib/resourceUtils.js';

export default function CreatorCard({ profile }) {
  const id = profile.user?.id ?? profile.id;
  return (
    <Link to={`/app/creators/${id}`} className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-base font-bold text-primary">{(profile.displayName || '?').charAt(0).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink group-hover:text-primary">{profile.displayName}{profile.verified ? <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-label="Verified creator" /> : null}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">{profile.headline || 'AlgoNest creator'}</p>
        </div>
      </div>
      <p className="line-clamp-2 min-h-[2.5rem] text-xs text-muted">{profile.bio || 'No bio yet.'}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">{(profile.expertise ?? []).slice(0, 3).map((topic) => <Badge key={topic} variant="primary">{topic}</Badge>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span>{profile.stats?.publishedResources ?? 0} resources · {profile.stats?.views ?? 0} views</span>
        {safeExternalUrl(profile.website) ? <span className="inline-flex items-center gap-1 text-primary">Website <ExternalLink className="h-3 w-3" aria-hidden="true" /></span> : null}
      </div>
    </Link>
  );
}
```

## `client/src/features/resources/components/CreatorProfileForm.jsx`

```jsx
import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { creatorProfileSchema } from '@algonest/shared';
import { SHEET_TOPICS } from '@algonest/shared/constants';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { contractErrors } from '../lib/resourceUtils.js';

function blankSocial() { return { label: '', url: '' }; }

export default function CreatorProfileForm({ initial, onSubmit, pending = false, error }) {
  const [form, setForm] = useState(() => ({
    displayName: initial?.displayName ?? '',
    headline: initial?.headline ?? '',
    bio: initial?.bio ?? '',
    website: initial?.website ?? '',
    expertise: initial?.expertise ?? [],
    socials: initial?.socials?.length ? initial.socials : [],
  }));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const toggleExpertise = (topic) => set('expertise', form.expertise.includes(topic)
    ? form.expertise.filter((item) => item !== topic)
    : [...form.expertise, topic].slice(0, 12));

  const save = () => {
    const parsed = creatorProfileSchema.safeParse({
      ...form,
      socials: form.socials.filter((social) => social.label && social.url),
    });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setMessage(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setMessage('');
    onSubmit(parsed.data);
  };

  return (
    <section className="ag-card space-y-4 p-5">
      <h2 className="text-base font-semibold text-ink">Edit creator profile</h2>
      {message ? <Alert variant="error">{message}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Display name" required value={form.displayName} onChange={(event) => set('displayName', event.target.value)} error={errors.displayName} maxLength={60} />
        <Input label="Website" type="url" value={form.website} onChange={(event) => set('website', event.target.value)} error={errors.website} placeholder="https://…" />
      </div>
      <Input label="Headline" value={form.headline} onChange={(event) => set('headline', event.target.value)} maxLength={140} placeholder="DSA educator · 200k learners" />
      <div>
        <label htmlFor="creator-bio" className="mb-1.5 block text-sm font-medium text-ink">Bio</label>
        <textarea id="creator-bio" rows={3} maxLength={600} value={form.bio} onChange={(event) => set('bio', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What do you teach?" />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Expertise ({form.expertise.length}/12)</legend>
        <div className="flex flex-wrap gap-1.5">
          {SHEET_TOPICS.map((topic) => (
            <button key={topic} type="button" aria-pressed={form.expertise.includes(topic)} onClick={() => toggleExpertise(topic)} className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${form.expertise.includes(topic) ? 'border-primary bg-primary/12 text-primary' : 'border-line text-muted hover:border-primary/40'}`}>{topic}</button>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-medium text-ink">Social links</h3><Button size="sm" variant="ghost" disabled={form.socials.length >= 5} onClick={() => set('socials', [...form.socials, blankSocial()])}>+ Add</Button></div>
        {form.socials.map((social, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2">
            <Input label="Label" value={social.label} onChange={(event) => set('socials', form.socials.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} placeholder="GitHub" />
            <Input label="URL" type="url" value={social.url} onChange={(event) => set('socials', form.socials.map((item, i) => i === index ? { ...item, url: event.target.value } : item))} placeholder="https://…" />
            <Button size="icon" variant="ghost" aria-label={`Remove social link ${index + 1}`} onClick={() => set('socials', form.socials.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4 text-danger" /></Button>
          </div>
        ))}
        {errors.socials ? <p className="text-xs text-danger">{errors.socials}</p> : null}
      </div>
      <div className="flex justify-end border-t border-line pt-4"><Button className="gap-1.5" loading={pending} onClick={save}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save profile</Button></div>
    </section>
  );
}
```

## `client/src/features/resources/components/CreatorAnalytics.jsx`

```jsx
import { Activity, Bookmark, CheckCircle2, Eye, PlayCircle, TrendingUp } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { EVENT_LABELS, errorMessage, formatNumber, sparklinePoints } from '../lib/resourceUtils.js';

const CARDS = [
  { key: 'views', label: 'Views', Icon: Eye, tone: 'text-primary' },
  { key: 'saves', label: 'Saves', Icon: Bookmark, tone: 'text-accent' },
  { key: 'starts', label: 'Starts', Icon: PlayCircle, tone: 'text-warning' },
  { key: 'completions', label: 'Completions', Icon: CheckCircle2, tone: 'text-success' },
];

export default function CreatorAnalytics({ data, isLoading, isError, error, days = 30, onDaysChange }) {
  if (isLoading) return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24 w-full" />)}</div>;
  if (isError) return <Alert variant="error">{errorMessage(error) || 'Could not load analytics.'}</Alert>;
  if (!data) return <EmptyState compact icon={Activity} title="No analytics yet" description="Publish a resource and views, saves, starts and completions will appear here." />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink"><TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" /> Creator analytics</h2>
        <div className="flex gap-1">{[7, 14, 30].map((value) => (
          <button key={value} type="button" onClick={() => onDaysChange?.(value)} aria-pressed={days === value} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${days === value ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2'}`}>{value}d</button>
        ))}</div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ key, label, Icon, tone }) => (
          <div key={key} className="ag-card p-4">
            <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" /> {label}</dt>
            <dd className="mt-1.5 text-2xl font-bold text-ink">{formatNumber(data.totals?.[key])}</dd>
            <dd className="text-[11px] text-muted">{formatNumber(data.window?.[key.replace(/s$/, '')] ?? 0)} in the last {days} days</dd>
          </div>
        ))}
      </dl>

      <section className="ag-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">Daily views ({days} days)</h3>
        <svg viewBox="0 0 240 48" preserveAspectRatio="none" className="h-16 w-full" role="img" aria-label={`Daily views over the last ${days} days`}>
          <polyline points={sparklinePoints(data.series, 'view')} fill="none" stroke="var(--ag-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <polyline points={sparklinePoints(data.series, 'completion')} fill="none" stroke="var(--ag-accent, #a78bfa)" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="mt-1 text-[11px] text-muted">Solid = views · dashed = completions. {EVENT_LABELS.view} are deduplicated per learner per day.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="ag-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Conversion funnel</h3>
          <ul className="space-y-3">
            {[
              { label: 'Save rate', value: data.conversion?.saveRate, hint: 'saves ÷ views' },
              { label: 'Start rate', value: data.conversion?.startRate, hint: 'starts ÷ views' },
              { label: 'Completion rate', value: data.conversion?.completionRate, hint: 'completions ÷ starts' },
            ].map((row) => (
              <li key={row.label}>
                <div className="mb-1 flex items-center justify-between text-xs"><span className="text-ink">{row.label} <span className="text-muted">({row.hint})</span></span><strong className="text-ink">{row.value ?? 0}%</strong></div>
                <ProgressBar value={row.value ?? 0} label={`${row.label}: ${row.value ?? 0}%`} tone={(row.value ?? 0) >= 30 ? 'success' : 'primary'} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{data.totals?.publishedResources ?? 0} published resources · average rating {data.totals?.ratingAverage || '—'} from {data.totals?.ratingCount ?? 0} ratings.</p>
        </section>
        <section className="ag-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Top resources</h3>
          {!data.topResources?.length ? <EmptyState compact icon={Activity} title="No activity yet" description="Share your resources to start collecting events." /> : (
            <ol className="space-y-2">{data.topResources.slice(0, 6).map((row, index) => (
              <li key={row.resource} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface-2/40 p-2.5 text-xs">
                <span className="min-w-0 truncate text-ink">{index + 1}. {row.title}</span>
                <span className="shrink-0 text-muted">{formatNumber(row.view)} views · {formatNumber(row.completion)} done</span>
              </li>
            ))}</ol>
          )}
        </section>
      </div>
    </div>
  );
}
```

## `client/src/features/resources/components/CreatorHero.jsx`

```jsx
import { BadgeCheck, ExternalLink, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { safeExternalUrl } from '../lib/resourceUtils.js';

export default function CreatorHero({ profile }) {
  const website = safeExternalUrl(profile.website);
  return (
    <section className="ag-card flex flex-wrap items-start gap-4 p-5 sm:p-6">
      <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-2xl font-bold text-primary">{(profile.displayName || '?').charAt(0).toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-ink">{profile.displayName}{profile.verified ? <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified creator" /> : null}</h1>
        {profile.headline ? <p className="mt-1 text-sm font-medium text-primary">{profile.headline}</p> : null}
        {profile.bio ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{profile.bio}</p> : <p className="mt-2 text-sm text-muted">No bio yet.</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(profile.expertise ?? []).slice(0, 5).map((topic) => <Badge key={topic} variant="primary">{topic}</Badge>)}
          {profile.socials?.map((social) => {
            const href = safeExternalUrl(social.url);
            return href ? <a key={social.url} href={href} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-xs text-muted hover:border-primary/40 hover:text-primary">{social.label} <ExternalLink className="h-3 w-3" aria-hidden="true" /></a> : null;
          })}
          {website ? <a href={website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Website <ExternalLink className="h-3 w-3" aria-hidden="true" /></a> : null}
        </div>
      </div>
      {profile.stats ? (
        <dl className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[
            { label: 'Resources', value: profile.stats.publishedResources },
            { label: 'Views', value: profile.stats.views },
            { label: 'Saves', value: profile.stats.saves },
            { label: 'Completions', value: profile.stats.completions },
          ].map((row) => <div key={row.label} className="rounded-xl border border-line bg-surface-2/40 px-3 py-2"><dt className="flex items-center justify-center gap-1 text-[10px] text-muted"><Users className="h-3 w-3" aria-hidden="true" /> {row.label}</dt><dd className="mt-0.5 text-lg font-bold text-ink">{row.value ?? 0}</dd></div>)}
        </dl>
      ) : null}
    </section>
  );
}
```

---

# Client — resources pages (new)

## `client/src/features/resources/pages/ResourcesPage.jsx`

```jsx
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FolderOpen, Plus, ShieldCheck, Users, Zap } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import { SHEET_TOPICS } from '@algonest/shared/constants';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ResourceFilters from '../components/ResourceFilters.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import CreatorCard from '../components/CreatorCard.jsx';
import ReportQueue from '../components/ReportQueue.jsx';
import {
  useCreatorList, useResourceList, useResolveReport, useResourceReports,
  useRunLinkCheck, useSavedResources,
} from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { EMPTY_FILTERS, errorMessage } from '../lib/resourceUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function ResourcesPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, topic: searchParams.get('topic') ?? '' }));
  const [page, setPage] = useState(1);
  const [reportStatus, setReportStatus] = useState('open');
  const debouncedSearch = useDebouncedValue(filters.q, 300);

  const params = useMemo(() => {
    const clean = { page, limit: PAGE_SIZE, sort: filters.sort || 'newest' };
    if (debouncedSearch) clean.q = debouncedSearch;
    for (const key of ['topic', 'level', 'language', 'type', 'pricing', 'platform']) if (filters[key]) clean[key] = filters[key];
    if (tab === 'mine') clean.mine = 'true';
    if (tab === 'review') clean.status = 'pending_review';
    return clean;
  }, [debouncedSearch, filters, page, tab]);

  const catalogue = useResourceList(params);
  const saved = useSavedResources(useMemo(() => ({ page, limit: PAGE_SIZE, sort: filters.sort }), [page, filters.sort]));
  const creators = useCreatorList(useMemo(() => ({ page, limit: PAGE_SIZE }), [page]));
  const reports = useResourceReports({ page: 1, limit: 20, status: reportStatus }, isStaff && tab === 'reports');
  const resolve = useResolveReport();
  const linkCheck = useRunLinkCheck();

  const active = tab === 'saved' ? saved : tab === 'creators' ? creators : catalogue;
  const data = active.data;
  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const change = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  const tabs = [
    { id: 'explore', label: 'Explore' },
    { id: 'saved', label: 'Saved' },
    { id: 'mine', label: 'My submissions' },
    { id: 'creators', label: 'Creators' },
    ...(isStaff ? [{ id: 'reports', label: 'Reports' }, { id: 'review', label: 'Review queue' }] : []),
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText text="RESOURCE DIRECTORY // CURATED & COMMUNITY-REVIEWED" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Resources</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">Videos, articles, GitHub repos, PDFs and courses — filtered by topic, level, language, type and price. Every submission is reviewed before it goes public, and links are checked nightly.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isStaff ? <Button variant="secondary" className="gap-1.5" loading={linkCheck.isPending} onClick={() => linkCheck.mutate({ limit: 20, force: 'false' })}><Zap className="h-4 w-4" aria-hidden="true" /> Check links</Button> : null}
          <Link to="/app/resources/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Submit resource</Button></Link>
        </div>
      </header>

      {linkCheck.isSuccess ? <Alert variant="success">Checked {linkCheck.data?.checked ?? 0} link(s) · {linkCheck.data?.broken ?? 0} broken · {linkCheck.data?.flagged ?? 0} newly flagged.</Alert> : null}
      {linkCheck.isError ? <Alert variant="error">{errorMessage(linkCheck.error)}</Alert> : null}

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => changeTab(item.id)} aria-pressed={tab === item.id} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}>
            {item.id === 'reports' || item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}{item.label}
          </button>
        ))}
        {active.isFetching && !active.isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      {tab === 'reports' && isStaff ? (
        <section className="ag-card p-5">
          <ReportQueue data={reports.data} isLoading={reports.isLoading} isError={reports.isError} error={reports.error}
            status={reportStatus} onChangeStatus={(value) => setReportStatus(value)} resolving={resolve.isPending}
            onResolve={(reportId, status) => resolve.mutate({ reportId, body: { status, note: '' } })} />
          {resolve.isError ? <Alert variant="error" className="mt-3">{errorMessage(resolve.error)}</Alert> : null}
        </section>
      ) : (
        <>
          {tab !== 'creators' ? <ResourceFilters filters={filters} onChange={change} topics={SHEET_TOPICS} showPlatform={isStaff} /> : null}
          {active.isError ? <Alert variant="error" title="Couldn't load resources">{errorMessage(active.error)}</Alert> : null}
          {active.isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 w-full" />)}</div>
            : items.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => tab === 'creators'
              ? <CreatorCard key={item.id} profile={item} />
              : <ResourceCard key={item.id} resource={item} showStatus={tab !== 'explore'} />)}</div>
              : <EmptyState icon={tab === 'creators' ? Users : FolderOpen} title={tab === 'saved' ? 'Nothing saved yet' : tab === 'mine' ? 'No submissions yet' : 'No resources match these filters'} description={tab === 'saved' ? 'Save a resource to build your personal reading list.' : 'Try clearing the filters, or submit the first resource.'} action={<Link to="/app/resources/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Submit a resource</Button></Link>} />}
          {pagination?.totalPages > 1 ? (
            <nav className="flex items-center justify-between gap-3" aria-label="Resources pagination">
              <p className="text-xs text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} item(s)</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button>
                <Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
```

## `client/src/features/resources/pages/ResourceDetailPage.jsx`

```jsx
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import ResourceDetail from '../components/ResourceDetail.jsx';
import ResourceModerationPanel from '../components/ResourceModerationPanel.jsx';
import {
  useFeedback, useRateResource, useReportResource, useResource,
  useResourceRatings, useSaveResource, useTrackResourceEvent,
} from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { errorMessage } from '../lib/resourceUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];

export default function ResourceDetailPage() {
  const { id } = useParams();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const role = useAuthStore((state) => state.user?.role);
  const { data, isLoading, isError, error } = useResource(id);
  const ratingParams = useMemo(() => ({ page: 1, limit: 10 }), []);
  const ratings = useResourceRatings(id, ratingParams, Boolean(id));
  const save = useSaveResource(id);
  const rate = useRateResource(id);
  const feedback = useFeedback(id);
  const report = useReportResource(id);
  const track = useTrackResourceEvent(id);

  if (isLoading) return <FullPageLoader label="Loading resource…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load this resource">{errorMessage(error)}</Alert></div>;
  const resource = data?.resource;
  if (!resource) return <FullPageLoader label="Loading resource…" />;
  const isOwner = String(resource.author?.id) === String(currentUserId);
  const canManage = isOwner || STAFF_ROLES.includes(role);
  const canModerate = STAFF_ROLES.includes(role) && !isOwner;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/resources" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All resources</Link>
        {canManage ? <Link to={`/app/resources/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit</Button></Link> : null}
      </div>

      {[save.error, rate.error, feedback.error, report.error, track.error].filter(Boolean).map((item, index) => <Alert key={index} variant="error">{errorMessage(item)}</Alert>)}
      {report.isSuccess ? <Alert variant="success">Thanks — a moderator will review your report.</Alert> : null}

      <ResourceDetail
        resource={{ ...resource, myAuthorId: currentUserId }}
        ratings={ratings.data} ratingsLoading={ratings.isLoading} ratingsError={ratings.isError} ratingsLoadError={ratings.error}
        canManage={canManage}
        saving={save.isPending} ratingPending={rate.isPending} feedbackPending={feedback.isPending} reportPending={report.isPending}
        reportError={report.isError ? errorMessage(report.error) : ''}
        onSave={() => save.mutate(resource.saved)}
        onRate={(body) => rate.mutate(body)}
        onFeedback={(helpful) => feedback.mutate(helpful)}
        onTrack={(type) => track.mutate(type)}
        onReport={(body, done) => report.mutate(body, { onSuccess: done })}
        moderation={canManage ? <ResourceModerationPanel resource={resource} canModerate={canModerate} /> : null}
      />
    </div>
  );
}
```

## `client/src/features/resources/pages/ResourceEditorPage.jsx`

```jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import ResourceSubmitForm from '../components/ResourceSubmitForm.jsx';
import ResourceModerationPanel from '../components/ResourceModerationPanel.jsx';
import { useCreateResource, useResource, useUpdateResource } from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { errorMessage, statusLabel } from '../lib/resourceUtils.js';

function CreateResource() {
  const navigate = useNavigate();
  const create = useCreateResource();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/resources" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All resources</Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Submit a resource</h1>
        <p className="mt-1.5 text-sm text-muted">Share a video, article, repository, PDF or course. We check for duplicate links automatically; a moderator reviews every submission before it goes public.</p>
      </header>
      <section className="ag-card p-5 sm:p-6">
        <ResourceSubmitForm
          pending={create.isPending} error={create.isError ? errorMessage(create.error) : ''}
          onSubmit={(payload) => create.mutate(payload, { onSuccess: (result) => navigate(`/app/resources/${result.resource.id}`, { replace: true }) })}
        />
      </section>
      <section className="ag-card flex items-start gap-3 p-5 text-sm text-muted">
        <Plus className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>Prefer a private link that nobody else can see? Use your personal library from any sheet — those links are never moderated or published.</p>
      </section>
    </div>
  );
}

function EditResource({ id }) {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.user?.role);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data, isLoading, isError, error } = useResource(id);
  const update = useUpdateResource(id);

  if (isLoading) return <FullPageLoader label="Loading submission…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error">{errorMessage(error)}</Alert></div>;
  const resource = data?.resource;
  if (!resource) return <FullPageLoader label="Loading submission…" />;
  const isOwner = String(resource.author?.id) === String(currentUserId);
  const canModerate = ['content_editor', 'content_moderator', 'super_admin'].includes(role) && !isOwner;
  const editable = ['draft', 'changes_requested', 'rejected', 'approved'].includes(resource.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`/app/resources/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to resource</Link>
      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Edit submission</h1><p className="mt-1.5 text-sm text-muted">Current status: <strong>{statusLabel(resource.status)}</strong>. Published resources must start a new revision before editing.</p></header>
      {!editable ? <Alert variant="warning">This submission is {statusLabel(resource.status).toLowerCase()} and cannot be edited. Start a revision from the resource page.</Alert> : (
        <section className="ag-card p-5 sm:p-6">
          <ResourceSubmitForm
            initial={resource} submitLabel="Save changes" pending={update.isPending}
            error={update.isError ? errorMessage(update.error) : ''}
            onSubmit={(payload) => {
              const { submit, ...body } = payload;
              void submit;
              update.mutate(body, { onSuccess: () => navigate(`/app/resources/${id}`) });
            }}
          />
        </section>
      )}
      <ResourceModerationPanel resource={resource} canModerate={canModerate} />
    </div>
  );
}

export default function ResourceEditorPage() {
  const { id } = useParams();
  return id ? <EditResource id={id} /> : <CreateResource />;
}
```

## `client/src/features/resources/pages/CreatorsPage.jsx`

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Users } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import CreatorCard from '../components/CreatorCard.jsx';
import { useCreatorList, useMyCreatorProfile } from '../hooks/useResources.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { errorMessage } from '../lib/resourceUtils.js';

export default function CreatorsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(q, 300);
  const { data, isLoading, isError, error } = useCreatorList({ page, limit: 12, ...(debounced ? { q: debounced } : {}) });
  const mine = useMyCreatorProfile();
  const profiles = data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Creators</h1><p className="mt-1.5 max-w-2xl text-sm text-muted">Meet the people behind the sheets, quizzes, mocks and resources you use. Open a profile to see their published work.</p></div>
        <Button className="gap-2" onClick={() => navigate('/app/creators/me')}>My creator page</Button>
      </header>
      <div className="max-w-sm"><Input label="Search creators" icon={Search} value={q} onChange={(event) => { setQ(event.target.value); setPage(1); }} placeholder="Name or expertise…" /></div>
      {mine.isSuccess && mine.data?.profile ? <p className="text-xs text-muted">Your profile: <Link to="/app/creators/me" className="font-semibold text-primary hover:underline">{mine.data.profile.displayName}</Link></p> : null}
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-52 w-full" />)}</div>
        : profiles.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{profiles.map((profile) => <CreatorCard key={profile.id} profile={profile} />)}</div>
          : <EmptyState icon={Users} title="No creators found" description="Try a different search, or create your own creator profile." />}
      {data?.pagination?.totalPages > 1 ? <nav className="flex items-center justify-between gap-3" aria-label="Creators pagination"><p className="text-xs text-muted">Page {data.pagination.page} of {data.pagination.totalPages}</p><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={!data.pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button><Button size="sm" variant="secondary" disabled={!data.pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button></div></nav> : null}
    </div>
  );
}
```

## `client/src/features/resources/pages/CreatorPage.jsx`

```jsx
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import CreatorHero from '../components/CreatorHero.jsx';
import CreatorProfileForm from '../components/CreatorProfileForm.jsx';
import CreatorAnalytics from '../components/CreatorAnalytics.jsx';
import {
  useCreator, useCreatorAnalytics, useMyCreatorProfile, useMyAnalytics,
  useUpdateCreatorProfile,
} from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { errorMessage } from '../lib/resourceUtils.js';

export default function CreatorPage() {
  const { id } = useParams();
  const { pathname } = useLocation();
  // `/creators/me` is a STATIC route, so it provides no `:id` param.
  const isMe = pathname.endsWith('/creators/me') || id === 'me';
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [days, setDays] = useState(30);
  const [message, setMessage] = useState('');

  const me = useMyCreatorProfile(isMe);
  const profileQuery = useCreator(isMe ? null : id, { page: 1, limit: 12 });
  const ownAnalytics = useMyAnalytics({ days });
  const otherAnalytics = useCreatorAnalytics(isMe ? null : id, { days }, !isMe);
  const update = useUpdateCreatorProfile();

  const profile = isMe ? me.data?.profile : profileQuery.data?.profile;
  const loading = isMe ? me.isLoading : profileQuery.isLoading;
  const error = isMe ? me.error : profileQuery.error;
  const analytics = isMe ? ownAnalytics : otherAnalytics;
  const ownerId = profile?.user?.id ?? (isMe ? currentUserId : id);
  const isOwner = String(ownerId) === String(currentUserId);

  if (loading) return <div className="space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (error) return <Alert variant="error">{errorMessage(error)}</Alert>;
  if (!profile) return <Alert variant="info">This creator profile has not been set up yet.</Alert>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/app/creators" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All creators</Link>
      {message ? <Alert variant="success">{message}</Alert> : null}
      {update.isError ? <Alert variant="error">{errorMessage(update.error)}</Alert> : null}

      <CreatorHero profile={profile} />

      {isMe ? (
        <CreatorProfileForm
          initial={profile} pending={update.isPending}
          onSubmit={(body) => update.mutate(body, { onSuccess: () => setMessage('Creator profile saved.') })}
        />
      ) : null}

      {isOwner ? (
        <section className="ag-card p-5">
          <CreatorAnalytics data={analytics.data} isLoading={analytics.isLoading} isError={analytics.isError} error={analytics.error} days={days} onDaysChange={setDays} />
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-ink">Published resources</h2>
        {profile.resources?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{profile.resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div>
        ) : <EmptyState compact title="No published resources yet" description="Once this creator publishes a resource it will appear here." />}
      </section>
    </div>
  );
}
```

---

# Configuration

## `package.json`

```json
{
  "name": "algonest",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "AlgoNest \u2014 production-grade DSA preparation platform (MERN monorepo)",
  "workspaces": [
    "shared",
    "server",
    "client"
  ],
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
    "db:down": "docker compose down",
    "check:links": "npm run check:links -w @algonest/server"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
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
    "lint": "node scripts/checkSyntax.js",
    "check:links": "node scripts/checkResourceLinks.mjs"
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

# ── Broken-link checker job (Phase 6, npm run check:links) ─────────────────
# Run from cron, e.g.  17 3 * * * cd /app && npm run check:links
LINK_CHECK_BATCH=20
LINK_CHECK_FORCE=false
LINK_CHECK_TIMEOUT_MS=8000
LINK_CHECK_MAX_REDIRECTS=2
LINK_CHECK_FAILURE_THRESHOLD=2
LINK_CHECK_USER_AGENT=AlgoNest-LinkChecker/1.0 (+https://algonest.dev)
```

---

# Documentation

## `README.md`

```markdown
# AlgoNest — DSA Preparation Platform (MERN monorepo)

A production-grade, phase-by-phase build of a DSA preparation platform: curated sheets,
quizzes, mock tests, adaptive plans, a resource directory and an RBAC admin area.

> **Status: Phase 6 complete.** Phase 1 shipped authentication, onboarding, RBAC,
> the app shell, dark/light theming and the animated React Bits landing page.
> Phase 2 added **DSA Sheets**, Phase 3 **Quizzes**, Phase 4 the **Mock test
> engine**, Phase 5 **Adaptive Plans** + the student dashboard, and Phase 6 adds
> the **Resource directory**: a moderated public catalogue with a submission
> form, full filters (topic, level, language, type, free/paid), save, ratings,
> helpful/not-helpful votes, reports, canonical duplicate-URL detection and an
> SSRF-safe broken-link checker job — plus **creator profiles** with
> view/save/start/completion analytics.
> See [`docs/PHASE6.md`](./docs/PHASE6.md) for the design and full API reference and
> [`docs/PHASE6-CODE.md`](./docs/PHASE6-CODE.md) for every changed file verbatim.
> Earlier: [`docs/PHASE5.md`](./docs/PHASE5.md) · [`docs/PHASE4.md`](./docs/PHASE4.md) ·
> [`docs/PHASE3.md`](./docs/PHASE3.md) · [`docs/PHASE2.md`](./docs/PHASE2.md) ·
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
│   ├── PHASE4-CODE.md               # complete Phase 4 source, file by file
│   ├── PHASE5.md                    # Phase 5 design + API reference
│   ├── PHASE5-CODE.md               # complete Phase 5 source, file by file
│   ├── PHASE6.md                    # Phase 6 design + API reference
│   └── PHASE6-CODE.md               # complete Phase 6 source, file by file
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
│   ├── tests/                       # node:test — 237 tests, no DB required
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
│       │   └── {Resource,ResourceSave,ResourceReaction,ResourceReport,
│                ResourceEvent,CreatorProfile}.js
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
5. Admin *screens* are Phase 8; Phase 1 ships the RBAC middleware, permissions and
   two permission-guarded user-management endpoints so the pattern is real, not TODO.
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

**Phase 7 — Notifications + dashboard v2**: real-time notifications for review
decisions, missed-task reminders and broken-link reports, a notification bell in
the top bar, and cross-module "continue learning" deep links. Then **Phase 8 —
Admin dashboard**: a unified moderation queue across every content type, user
management, platform analytics, audit logs and a scheduled-jobs UI.
```

## `docs/PHASE6.md`

```markdown
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
```
