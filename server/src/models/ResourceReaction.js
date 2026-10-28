import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

/**
 * One reaction row per (user, resource): a 1–5 star rating (with optional
 * review) AND an independent helpful/not-helpful vote. Both are nullable, so
 * a learner can vote without rating and vice versa.
 */
const resourceReactionSchema = new Schema(
  {
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, trim: true, maxlength: 1000, default: '' },
    helpful: { type: Boolean, default: null },
  },
  { timestamps: true, versionKey: false },
);

resourceReactionSchema.index({ resource: 1, user: 1 }, { unique: true, name: 'uniq_user_resource_reaction' });
resourceReactionSchema.index({ resource: 1, rating: -1, createdAt: -1 });

resourceReactionSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const user = plain.user && typeof plain.user === 'object' && plain.user.name
    ? { id: String(plain.user._id ?? plain.user.id), name: plain.user.name }
    : { id: String(plain.user ?? ''), name: 'Student' };
  return {
    id: String(plain._id), user, resource: String(plain.resource),
    rating: plain.rating ?? null, review: plain.review || '',
    helpful: plain.helpful ?? null, createdAt: plain.createdAt, updatedAt: plain.updatedAt,
  };
};

export const ResourceReaction = mongoose.model('ResourceReaction', resourceReactionSchema);
export default ResourceReaction;
