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
