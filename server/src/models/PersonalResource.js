import mongoose from 'mongoose';
import { PLATFORM_VALUES, RESOURCE_TYPE_VALUES, SHEET_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * A learner's private link library. Kept out of the Phase-6 public resource
 * directory: `user` is always taken from the access token, never from the body.
 */
const personalResourceSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true, trim: true, maxlength: SHEET_LIMITS.MAX_URL },
    type: { type: String, enum: RESOURCE_TYPE_VALUES, default: 'article' },
    platform: { type: String, enum: PLATFORM_VALUES, default: 'generic' },
    topic: { type: String, trim: true, maxlength: 60, default: 'General' },
    note: { type: String, trim: true, maxlength: SHEET_LIMITS.MAX_NOTES, default: '' },
    tags: { type: [String], default: [] },
    sheetId: { type: Types.ObjectId, ref: 'Sheet', default: null },
    problemId: { type: Types.ObjectId, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true, versionKey: false },
);

personalResourceSchema.index({ user: 1, createdAt: -1 });
personalResourceSchema.index({ user: 1, topic: 1 });
personalResourceSchema.index({ user: 1, type: 1 });
personalResourceSchema.index({ user: 1, sheetId: 1 });

personalResourceSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    title: plain.title, url: plain.url, type: plain.type, platform: plain.platform,
    topic: plain.topic, note: plain.note || '', tags: plain.tags ?? [],
    sheetId: plain.sheetId ? String(plain.sheetId) : null,
    problemId: plain.problemId ? String(plain.problemId) : null,
    rating: plain.rating ?? null,
    createdAt: plain.createdAt, updatedAt: plain.updatedAt,
  };
};

export const PersonalResource = mongoose.model('PersonalResource', personalResourceSchema);
export default PersonalResource;
