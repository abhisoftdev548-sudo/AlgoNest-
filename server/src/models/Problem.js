import mongoose from 'mongoose';
import { DIFFICULTY_VALUES, PLATFORM_VALUES, SHEET_LIMITS } from '@algonest/shared';

const { Schema } = mongoose;

/**
 * EMBEDDED, NOT REFERENCED — deliberate design decision.
 *
 * A problem is meaningless without its sheet, is always read together with the
 * sheet (never queried independently), and is part of an ordered progression.
 * Embedding gives us:
 *   - one atomic document write for add / edit / reorder (no transaction);
 *   - stable subdocument `_id`s that UserProgress can point to;
 *   - a cheap, exact snapshot for SheetVersion on publish.
 *
 * The array is capped at SHEET_LIMITS.MAX_PROBLEMS (300), so the parent stays
 * far below MongoDB's 16 MB document limit. Problems are NOT shared between
 * sheets; cloning deep-copies them with fresh ids.
 */
export const problemSchema = new Schema(
  {
    title: { type: String, required: [true, 'Problem title is required'], trim: true, maxlength: 200 },
    url: { type: String, required: [true, 'Problem URL is required'], trim: true, maxlength: SHEET_LIMITS.MAX_URL },
    /** Normalised host-level platform key (see platformDetector). */
    platform: { type: String, enum: PLATFORM_VALUES, default: 'generic' },
    /** Display label, denormalised so a snapshot never needs a lookup. */
    platformLabel: { type: String, trim: true, maxlength: 60, default: 'Other' },
    difficulty: { type: String, enum: DIFFICULTY_VALUES, default: 'medium' },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    /** Dense 0-based rank inside the sheet; maintained by reorderProblems. */
    order: { type: Number, required: true, min: 0 },
    estimatedMinutes: { type: Number, min: 1, max: SHEET_LIMITS.MAX_ESTIMATED_MINUTES, default: 20 },
    /** Lowercased canonical URL slug — used to dedupe bulk imports. */
    externalId: { type: String, trim: true, maxlength: 300, default: '' },
    /** Optional creator hint about the problem (NOT the student's private note). */
    hint: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { _id: true, timestamps: false, versionKey: false },
);

/** Plain-object projection shared by Sheet and SheetVersion responses. */
export function problemToPlain(problem) {
  const doc = problem?.toObject ? problem.toObject() : { ...problem };
  return {
    id: String(doc._id),
    title: doc.title,
    url: doc.url,
    platform: doc.platform,
    platformLabel: doc.platformLabel,
    difficulty: doc.difficulty,
    topic: doc.topic,
    order: doc.order,
    estimatedMinutes: doc.estimatedMinutes,
    externalId: doc.externalId || '',
    hint: doc.hint || '',
  };
}

export default problemSchema;
