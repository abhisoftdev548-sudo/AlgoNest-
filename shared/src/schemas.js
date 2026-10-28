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
  REPORT_STATUS_VALUES,
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    status: z.enum(ATTEMPT_STATUS_VALUES).optional(),
  })
  .strict();

/** Editor question list + solver question list — both paginated. */
export const quizQuestionListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
    status: z.enum(PLAN_STATUS_VALUES).optional(),
  })
  .strict();

/** Calendar/task list. `from`/`to` is an inclusive UTC date-key window. */
export const taskListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(1),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
    page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
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
  page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).strict();
export const adminUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
  q: z.string().trim().max(80).optional(),
  role: z.enum(ROLE_VALUES).optional(),
  status: z.enum(USER_STATUS_VALUES).optional(),
}).strict();

export const adminModerationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(['all', 'sheet', 'quiz', 'resource']).default('all'),
}).strict();

export const adminModerateSchema = z.object({
  decision: z.enum(MODERATION_DECISION_VALUES),
  note: z.string().trim().max(1000).default(''),
}).strict().superRefine((value, ctx) => {
  if (value.decision !== 'approve' && !value.note) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['note'], message: 'A note is required for this decision' });
  }
});

export const adminTargetParamsSchema = z.object({
  type: z.enum(['sheet', 'quiz', 'resource']),
  id: mongoIdSchema,
}).strict();

export const adminReportsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(REPORT_STATUS_VALUES).default('open'),
}).strict();

export const adminReportParamsSchema = z.object({
  type: z.enum(['sheet', 'resource']),
  id: mongoIdSchema,
}).strict();

export const adminReportResolveSchema = z.object({
  status: z.enum(['resolved', 'dismissed']),
  note: z.string().trim().max(1000).default(''),
}).strict();

export const adminAuditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  action: z.string().trim().max(100).optional(),
  targetType: z.string().trim().max(60).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).strict().refine((value) => !value.from || !value.to || value.from <= value.to, { message: 'from must be before to', path: ['from'] });

export const featureFlagKeySchema = z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9._-]{1,79}$/);
export const featureFlagParamsSchema = z.object({ key: featureFlagKeySchema }).strict();
export const featureFlagsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
}).strict();
export const featureFlagUpdateSchema = z.object({
  enabled: z.boolean(),
  description: z.string().trim().max(240).optional(),
}).strict();
export const adminCreatorVerificationSchema = z.object({ verified: z.boolean() }).strict();

export const resourceSavedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(12),
  sort: z.enum(RESOURCE_SORT_OPTIONS).default('newest'),
}).strict();
export const creatorGetQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(PAGINATION.MAX_PAGE).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(50).default(12),
}).strict();
