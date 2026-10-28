import mongoose from 'mongoose';
import {
  PLATFORM_VALUES, RESOURCE_LANGUAGE_VALUES, RESOURCE_LEVEL_VALUES,
  RESOURCE_LINK_STATUS_VALUES, RESOURCE_PRICING_VALUES, RESOURCE_STATUS_VALUES,
  RESOURCE_TYPE_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

const reviewEntrySchema = new Schema(
  {
    from: { type: String, enum: RESOURCE_STATUS_VALUES },
    to: { type: String, enum: RESOURCE_STATUS_VALUES, required: true },
    by: { type: Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    decision: { type: String, maxlength: 40, default: '' },
    note: { type: String, maxlength: 1000, default: '' },
  },
  { _id: false, versionKey: false },
);

/**
 * PUBLIC, MODERATED resource directory entry. Deliberately separate from
 * PersonalResource (Phase 2), which stays a private, unmoderated link library.
 * `urlKey` is the canonical dedupe identity from resourceUrl.js.
 */
const resourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 180 },
    url: { type: String, required: true, trim: true, maxlength: 2000 },
    urlKey: { type: String, required: true, trim: true, lowercase: true, maxlength: 2000, index: true },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    type: { type: String, enum: RESOURCE_TYPE_VALUES, default: 'article', index: true },
    topic: { type: String, trim: true, maxlength: 60, default: 'General', index: true },
    level: { type: String, enum: RESOURCE_LEVEL_VALUES, default: 'beginner', index: true },
    language: { type: String, enum: RESOURCE_LANGUAGE_VALUES, default: 'agnostic', index: true },
    pricing: { type: String, enum: RESOURCE_PRICING_VALUES, default: 'free', index: true },
    tags: { type: [String], default: [] },
    platform: { type: String, enum: PLATFORM_VALUES, default: 'generic' },
    platformLabel: { type: String, default: 'Other' },
    host: { type: String, default: '' },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: RESOURCE_STATUS_VALUES, default: 'draft', index: true },
    submittedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    reviewedBy: { type: Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, maxlength: 1000, default: '' },
    reviewHistory: { type: [reviewEntrySchema], default: [] },

    /** Denormalised aggregates — cheap catalogue lists, recomputed on write. */
    viewCount: { type: Number, default: 0, min: 0 },
    saveCount: { type: Number, default: 0, min: 0 },
    startCount: { type: Number, default: 0, min: 0 },
    completionCount: { type: Number, default: 0, min: 0 },
    ratingCount: { type: Number, default: 0, min: 0 },
    ratingSum: { type: Number, default: 0, min: 0 },
    helpfulCount: { type: Number, default: 0, min: 0 },
    notHelpfulCount: { type: Number, default: 0, min: 0 },
    reportCount: { type: Number, default: 0, min: 0 },

    /** Broken-link checker state (Phase 6 job). */
    linkStatus: { type: String, enum: RESOURCE_LINK_STATUS_VALUES, default: 'unchecked', index: true },
    linkHttpStatus: { type: Number, default: null },
    linkCheckedAt: { type: Date, default: null },
    linkCheckError: { type: String, maxlength: 300, default: '' },
    linkCheckHops: { type: Number, default: 0 },
    consecutiveFailures: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

resourceSchema.index({ title: 'text', description: 'text', tags: 'text', topic: 'text' }, {
  weights: { title: 8, topic: 5, tags: 3, description: 1 }, name: 'resource_text_search',
});
resourceSchema.index({ status: 1, publishedAt: -1 });
resourceSchema.index({ status: 1, topic: 1, level: 1 });
resourceSchema.index({ status: 1, type: 1, pricing: 1 });
resourceSchema.index({ author: 1, status: 1, updatedAt: -1 });
resourceSchema.index({ status: 1, saveCount: -1, ratingSum: -1 });
resourceSchema.index({ status: 1, linkStatus: 1, linkCheckedAt: 1 });
// Non-unique: duplicate rejection is enforced in the service so archived
// entries can legitimately share a URL with a newer submission.
resourceSchema.index({ urlKey: 1, status: 1 });

resourceSchema.statics.toPublic = function toPublic(doc, { myReaction = null, saved = false, canManage = false } = {}) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const author = plain.author && typeof plain.author === 'object' && plain.author.name
    ? { id: String(plain.author._id ?? plain.author.id), name: plain.author.name }
    : { id: String(plain.author ?? ''), name: 'AlgoNest creator' };
  const ratingCount = plain.ratingCount ?? 0;
  const ratingSum = plain.ratingSum ?? 0;
  const helpfulCount = plain.helpfulCount ?? 0;
  const notHelpfulCount = plain.notHelpfulCount ?? 0;
  return {
    id: String(plain._id),
    slug: plain.slug,
    title: plain.title,
    url: plain.url,
    urlKey: plain.urlKey,
    description: plain.description || '',
    type: plain.type,
    topic: plain.topic,
    level: plain.level,
    language: plain.language,
    pricing: plain.pricing,
    tags: plain.tags ?? [],
    platform: plain.platform,
    platformLabel: plain.platformLabel || 'Other',
    host: plain.host || '',
    author,
    status: plain.status,
    submittedAt: plain.submittedAt ?? null,
    publishedAt: plain.publishedAt ?? null,
    ratingAverage: ratingCount ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0,
    ratingCount,
    helpfulCount,
    notHelpfulCount,
    helpfulScore: helpfulCount - notHelpfulCount,
    viewCount: plain.viewCount ?? 0,
    saveCount: plain.saveCount ?? 0,
    startCount: plain.startCount ?? 0,
    completionCount: plain.completionCount ?? 0,
    linkStatus: plain.linkStatus ?? 'unchecked',
    linkHttpStatus: plain.linkHttpStatus ?? null,
    linkCheckedAt: plain.linkCheckedAt ?? null,
    linkCheckError: plain.linkCheckError || '',
    saved: Boolean(saved),
    myRating: myReaction?.rating ?? null,
    myHelpful: myReaction?.helpful ?? null,
    myReview: myReaction?.review || '',
    ...(canManage ? {
      reviewNote: plain.reviewNote || '',
      reviewedBy: plain.reviewedBy ? String(plain.reviewedBy) : null,
      reviewHistory: (plain.reviewHistory ?? []).slice(-10).map((entry) => ({
        from: entry.from, to: entry.to, by: String(entry.by), at: entry.at,
        decision: entry.decision || '', note: entry.note || '',
      })),
      reportCount: plain.reportCount ?? 0,
      consecutiveFailures: plain.consecutiveFailures ?? 0,
    } : {}),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
