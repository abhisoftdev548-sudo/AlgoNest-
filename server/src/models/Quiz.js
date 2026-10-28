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
