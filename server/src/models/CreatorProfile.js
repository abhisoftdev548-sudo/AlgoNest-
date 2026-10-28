import mongoose from 'mongoose';
import { CREATOR_LIMITS, SHEET_TOPICS } from '@algonest/shared';

const { Schema, Types } = mongoose;

const socialSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 24 },
    url: { type: String, required: true, trim: true, maxlength: CREATOR_LIMITS.MAX_SOCIAL_URL },
  },
  { _id: false, versionKey: false },
);

/** Public creator page. One per user, created lazily on first edit or read. */
const creatorProfileSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    displayName: { type: String, required: true, trim: true, maxlength: CREATOR_LIMITS.MAX_DISPLAY_NAME },
    headline: { type: String, trim: true, maxlength: CREATOR_LIMITS.MAX_HEADLINE, default: '' },
    bio: { type: String, trim: true, maxlength: CREATOR_LIMITS.MAX_BIO, default: '' },
    website: { type: String, trim: true, maxlength: CREATOR_LIMITS.MAX_WEBSITE, default: '' },
    expertise: { type: [{ type: String, enum: SHEET_TOPICS }], default: [] },
    socials: { type: [socialSchema], default: [] },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

creatorProfileSchema.index({ displayName: 'text', headline: 'text', expertise: 'text' }, { weights: { displayName: 5, headline: 2, expertise: 1 }, name: 'creator_text_search' });

creatorProfileSchema.statics.toPublic = function toPublic(doc, { stats = null, resources = null, isOwner = false } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const user = plain.user && typeof plain.user === 'object' && plain.user.name
    ? { id: String(plain.user._id ?? plain.user.id), name: plain.user.name }
    : { id: String(plain.user ?? ''), name: plain.displayName };
  return {
    id: String(plain._id),
    user,
    displayName: plain.displayName,
    headline: plain.headline || '',
    bio: plain.bio || '',
    website: plain.website || '',
    expertise: plain.expertise ?? [],
    socials: (plain.socials ?? []).map((entry) => ({ label: entry.label, url: entry.url })),
    verified: Boolean(plain.verified),
    isOwner,
    stats,
    resources,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
