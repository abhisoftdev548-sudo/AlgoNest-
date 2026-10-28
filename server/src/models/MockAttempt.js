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
