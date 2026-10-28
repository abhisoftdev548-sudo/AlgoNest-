import mongoose from 'mongoose';
import {
  DIFFICULTY_VALUES, QUESTION_TYPE_VALUES, QUIZ_LIMITS,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * QUESTION BANK — reusable, author-scoped, REFERENCED by Quiz.
 *
 * A creator writes a question once and links it into several quizzes. Editing
 * a bank question therefore does NOT automatically change a live quiz: the
 * published QuizVersion holds a frozen copy. This is the deliberate split:
 *   Question (referenced) → cheap reuse while authoring
 *   QuizVersion (embedded) → immutable, answer-bearing snapshot for grading
 *
 * `QUESTION_FIELDS` is shared with QuizVersion so the two can never drift.
 */
export const QUESTION_FIELDS = Object.freeze({
  type: { type: String, enum: QUESTION_TYPE_VALUES, required: true },
  prompt: { type: String, required: true, trim: true, maxlength: QUIZ_LIMITS.MAX_PROMPT },
  topic: { type: String, trim: true, maxlength: 60, default: 'General' },
  difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
  explanation: { type: String, trim: true, maxlength: QUIZ_LIMITS.MAX_EXPLANATION, default: '' },
  points: { type: Number, min: 1, max: QUIZ_LIMITS.MAX_POINTS, default: 1 },
  tags: { type: [String], default: [] },
  code: { type: String, maxlength: QUIZ_LIMITS.MAX_CODE, default: '' },
  caseSensitive: { type: Boolean, default: false },
  options: {
    type: [{ id: { type: String, required: true }, text: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT } }],
    default: [],
  },
  items: {
    type: [{ id: { type: String, required: true }, text: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT } }],
    default: [],
  },
  pairs: {
    type: [{
      id: { type: String, required: true },
      left: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT },
      right: { type: String, required: true, maxlength: QUIZ_LIMITS.MAX_OPTION_TEXT },
    }],
    default: [],
  },
  /** Option ids (choice types), item ids (ordering) or pair ids (matching). */
  answerKey: { type: [String], default: [] },
  booleanKey: { type: Boolean, default: null },
  textAnswers: { type: [String], default: [] },
});

/** The frozen, answer-bearing question shape stored inside a QuizVersion. */
export const snapshotQuestionSchema = new Schema(
  {
    _id: { type: Types.ObjectId, required: true },
    /** Dense rank inside the published quiz — preserved from the author's order. */
    order: { type: Number, default: 0, min: 0 },
    ...QUESTION_FIELDS,
  },
  { _id: false, versionKey: false },
);

const questionSchema = new Schema(
  {
    ...QUESTION_FIELDS,
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    /** How many quizzes currently link this question (denormalised counter). */
    usageCount: { type: Number, default: 0, min: 0 },
    source: { type: String, enum: ['manual', 'json', 'csv'], default: 'manual' },
  },
  { timestamps: true, versionKey: false },
);

questionSchema.index({ author: 1, createdAt: -1 });
questionSchema.index({ type: 1, topic: 1 });
questionSchema.index({ topic: 1, difficulty: 1 });
questionSchema.index(
  { prompt: 'text', topic: 'text', tags: 'text' },
  { weights: { topic: 6, prompt: 4, tags: 2 }, name: 'question_text_search' },
);

export const Question = mongoose.model('Question', questionSchema);
export default Question;
