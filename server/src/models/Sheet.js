import mongoose from 'mongoose';
import {
  DIFFICULTY_VALUES,
  GOAL_VALUES,
  SHEET_LIMITS,
  SHEET_STATUS_VALUES,
} from '@algonest/shared';
import { problemSchema } from './Problem.js';

const { Schema, Types } = mongoose;

/**
 * Sheet = the author's WORKING COPY. Published, immutable problem sets live in
 * SheetVersion. This lets an author edit a published sheet without changing
 * what students already solved; every attempt/progress row records the version
 * number it belongs to.
 */
const reviewEntrySchema = new Schema(
  {
    from: { type: String, enum: SHEET_STATUS_VALUES },
    to: { type: String, enum: SHEET_STATUS_VALUES, required: true },
    by: { type: Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    decision: { type: String, maxlength: 40, default: '' },
    note: { type: String, maxlength: 1000, default: '' },
  },
  { _id: false },
);

const sheetSchema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: SHEET_LIMITS.MAX_TITLE },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_DESCRIPTION, default: '' },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
    goals: { type: [{ type: String, enum: GOAL_VALUES }], default: [] },
    topics: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: SHEET_STATUS_VALUES, default: 'draft', index: true },
    problems: {
      type: [problemSchema],
      default: [],
      validate: {
        validator: (value) => value.length <= SHEET_LIMITS.MAX_PROBLEMS,
        message: `A sheet can hold at most ${SHEET_LIMITS.MAX_PROBLEMS} problems`,
      },
    },
    /** 0 = never published. Incremented on every publish. */
    publishedVersion: { type: Number, default: 0, min: 0 },
    /** Denormalised count from the latest snapshot — cheap catalogue cards. */
    publishedProblemCount: { type: Number, default: 0, min: 0 },
    ratingSummary: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    cloneOf: { type: Types.ObjectId, ref: 'Sheet', default: null },
    cloneCount: { type: Number, default: 0, min: 0 },
    submittedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    reviewedBy: { type: Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, maxlength: 1000, default: '' },
    reviewHistory: { type: [reviewEntrySchema], default: [] },
  },
  { timestamps: true, versionKey: '__v' },
);

// Text search for the catalogue; weighted so a title match outranks a tag.
sheetSchema.index({ title: 'text', description: 'text', tags: 'text', topics: 'text' }, {
  weights: { title: 8, topics: 4, tags: 3, description: 1 },
  name: 'sheet_text_search',
});
sheetSchema.index({ status: 1, publishedAt: -1 });
sheetSchema.index({ author: 1, status: 1, updatedAt: -1 });
sheetSchema.index({ topics: 1, difficulty: 1 });
sheetSchema.index({ 'ratingSummary.average': -1 });
sheetSchema.index({ cloneOf: 1 });

/** @returns plain, sorted problem list from a lean sheet/version document. */
function plainProblems(doc) {
  return [...(doc.problems ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => ({
      id: String(p._id),
      title: p.title,
      url: p.url,
      platform: p.platform,
      platformLabel: p.platformLabel,
      difficulty: p.difficulty,
      topic: p.topic,
      order: p.order,
      estimatedMinutes: p.estimatedMinutes,
      externalId: p.externalId || '',
      hint: p.hint || '',
    }));
}

/**
 * Single serialization point. `problems` is replaced by the published snapshot
 * when the viewer is not the author or staff — so editing a live sheet never
 * silently rewrites what learners see.
 */
sheetSchema.statics.toPublic = function toPublic(doc, { snapshot = null } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const author = plain.author && typeof plain.author === 'object' && plain.author.name
    ? { id: String(plain.author._id ?? plain.author.id), name: plain.author.name }
    : { id: String(plain.author ?? ''), name: 'AlgoNest creator' };

  const problems = snapshot ? plainProblems(snapshot) : plainProblems(plain);
  return {
    id: String(plain._id),
    slug: plain.slug,
    title: plain.title,
    description: plain.description || '',
    author,
    difficulty: plain.difficulty,
    goals: plain.goals ?? [],
    topics: plain.topics ?? [],
    tags: plain.tags ?? [],
    status: plain.status,
    problems,
    problemCount: problems.length,
    publishedVersion: plain.publishedVersion ?? 0,
    publishedProblemCount: plain.publishedProblemCount ?? 0,
    viewedVersion: snapshot ? snapshot.version : null,
    isPublishedSnapshot: Boolean(snapshot),
    ratingSummary: {
      average: Number((plain.ratingSummary?.average ?? 0).toFixed(2)),
      count: plain.ratingSummary?.count ?? 0,
    },
    cloneOf: plain.cloneOf ? String(plain.cloneOf) : null,
    cloneCount: plain.cloneCount ?? 0,
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

export const Sheet = mongoose.model('Sheet', sheetSchema);
export { plainProblems };
export const isValidObjectId = (id) => Types.ObjectId.isValid(id);
export default Sheet;
