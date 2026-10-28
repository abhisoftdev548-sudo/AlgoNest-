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
