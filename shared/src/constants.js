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
  AUDIT_READ: 'audit:read',
});

export const PERMISSION_VALUES = Object.freeze(Object.values(PERMISSIONS));

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.STUDENT]: [],
  [ROLES.CONTENT_EDITOR]: [PERMISSIONS.CONTENT_MODERATE],
  [ROLES.CONTENT_MODERATOR]: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ, PERMISSIONS.AUDIT_READ],
  [ROLES.SUPPORT_ANALYST]: [PERMISSIONS.USER_READ, PERMISSIONS.ANALYTICS_READ, PERMISSIONS.AUDIT_READ],
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
  BANNED: 'banned',
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
  // Bound offset pagination to avoid unbounded skip() work from malformed URLs.
  MAX_PAGE: 1_000,
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
