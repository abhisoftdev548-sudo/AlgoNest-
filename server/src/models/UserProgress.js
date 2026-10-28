import mongoose from 'mongoose';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  PROBLEM_STATUS_VALUES,
  SHEET_LIMITS,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * PER-USER DATA, FULLY SEPARATE FROM THE SHARED SHEET.
 *
 * One document per (user, sheet, problemId). A student can never modify the
 * Sheet document — all notes, bookmarks, confidence and time live here.
 * `topic`, `problemTitle` and `sheetVersion` are deliberate denormalised
 * snapshots: topic-wise progress needs no join, and progress on version 1
 * still renders correctly after version 2 is published.
 */
const userProgressSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true },
    problemId: { type: Types.ObjectId, required: true },
    /** Version of the published snapshot this row refers to (0 = unpublished). */
    sheetVersion: { type: Number, default: 0, min: 0 },
    problemTitle: { type: String, trim: true, maxlength: 200, default: '' },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    status: { type: String, enum: PROBLEM_STATUS_VALUES, default: 'not_started' },
    notes: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_NOTES, default: '' },
    bookmark: { type: Boolean, default: false },
    confidence: { type: Number, min: CONFIDENCE_MIN, max: CONFIDENCE_MAX, default: null },
    /** Cumulative minutes spent by this user on this problem. */
    timeSpent: { type: Number, min: 0, max: SHEET_LIMITS.MAX_TIME_SPENT, default: 0 },
    revisionDate: { type: Date, default: null },
    lastReviewedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

userProgressSchema.index({ user: 1, sheet: 1, problemId: 1 }, { unique: true, name: 'uniq_user_sheet_problem' });
userProgressSchema.index({ user: 1, sheet: 1, status: 1 });
userProgressSchema.index({ user: 1, sheet: 1, topic: 1 });
userProgressSchema.index({ user: 1, bookmark: 1, updatedAt: -1 });
userProgressSchema.index({ user: 1, revisionDate: 1 });

userProgressSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    problemId: String(plain.problemId),
    sheetVersion: plain.sheetVersion ?? 0,
    problemTitle: plain.problemTitle || '',
    topic: plain.topic || 'General',
    status: plain.status,
    notes: plain.notes || '',
    bookmark: Boolean(plain.bookmark),
    confidence: plain.confidence ?? null,
    timeSpent: plain.timeSpent ?? 0,
    revisionDate: plain.revisionDate ?? null,
    lastReviewedAt: plain.lastReviewedAt ?? null,
    updatedAt: plain.updatedAt,
  };
};

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
