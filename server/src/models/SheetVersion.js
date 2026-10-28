import mongoose from 'mongoose';
import { problemSchema } from './Problem.js';

const { Schema, Types } = mongoose;

/**
 * Immutable published snapshot. Created once per publish; NEVER updated.
 * Old UserProgress rows keep a valid `problemId` + `sheetVersion` pair even
 * after the author reorders, renames or removes problems from the working copy.
 */
const sheetVersionSchema = new Schema(
  {
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    problems: { type: [problemSchema], default: [] },
    problemCount: { type: Number, default: 0 },
    // Metadata is snapshotted too, so a result page can show the original title.
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, default: '' },
    difficulty: { type: String, default: 'medium' },
    topics: { type: [String], default: [] },
    changelog: { type: String, maxlength: 500, default: '' },
    publishedBy: { type: Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

sheetVersionSchema.index({ sheet: 1, version: -1 }, { unique: true });

sheetVersionSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    sheet: String(plain.sheet),
    version: plain.version,
    problemCount: plain.problemCount ?? plain.problems?.length ?? 0,
    title: plain.title,
    description: plain.description || '',
    difficulty: plain.difficulty,
    topics: plain.topics ?? [],
    changelog: plain.changelog || '',
    publishedBy: String(plain.publishedBy),
    publishedAt: plain.publishedAt,
  };
};

export const SheetVersion = mongoose.model('SheetVersion', sheetVersionSchema);
export default SheetVersion;
