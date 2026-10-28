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
