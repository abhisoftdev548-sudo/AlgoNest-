import mongoose from 'mongoose';
import { RESOURCE_EVENT_TYPE_VALUES } from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * Append-only analytics fact. Counters on Resource are a denormalised fast
 * path for catalogue sorting; this collection is the source of truth for the
 * creator time-series. `dayKey` is a UTC YYYY-MM-DD string (no DST drift).
 */
const resourceEventSchema = new Schema(
  {
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
    creator: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    user: { type: Types.ObjectId, ref: 'User', default: null },
    type: { type: String, enum: RESOURCE_EVENT_TYPE_VALUES, required: true, index: true },
    dayKey: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { timestamps: true, versionKey: false },
);

resourceEventSchema.index({ creator: 1, dayKey: 1, type: 1 });
resourceEventSchema.index({ resource: 1, dayKey: 1, type: 1 });
resourceEventSchema.index({ createdAt: -1 });
// At most one `view` per user per resource per UTC day — prevents refresh spam.
resourceEventSchema.index(
  { resource: 1, user: 1, type: 1, dayKey: 1 },
  { unique: true, partialFilterExpression: { type: 'view' }, name: 'uniq_daily_resource_view' },
);

export const ResourceEvent = mongoose.model('ResourceEvent', resourceEventSchema);
export default ResourceEvent;
