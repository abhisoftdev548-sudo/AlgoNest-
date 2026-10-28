import mongoose from 'mongoose';
import { SHEET_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/** Rating + optional written review. One row per (user, sheet) — upserted. */
const sheetRatingSchema = new Schema(
  {
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true, index: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_REVIEW, default: '' },
  },
  { timestamps: true, versionKey: false },
);

sheetRatingSchema.index({ sheet: 1, user: 1 }, { unique: true, name: 'uniq_sheet_user_rating' });
sheetRatingSchema.index({ sheet: 1, createdAt: -1 });

sheetRatingSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const user = plain.user && typeof plain.user === 'object'
    ? { id: String(plain.user._id ?? plain.user.id), name: plain.user.name ?? 'Student' }
    : { id: String(plain.user), name: 'Student' };
  return {
    id: String(plain._id), user, rating: plain.rating,
    review: plain.review || '', createdAt: plain.createdAt, updatedAt: plain.updatedAt,
  };
};

export const SheetRating = mongoose.model('SheetRating', sheetRatingSchema);
export default SheetRating;
