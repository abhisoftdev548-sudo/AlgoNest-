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
