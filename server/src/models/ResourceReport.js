import mongoose from 'mongoose';
import { REPORT_REASON_VALUES, REPORT_STATUS_VALUES } from '@algonest/shared';

const { Schema, Types } = mongoose;

/** User-submitted report; triaged by a CONTENT_MODERATE permission holder. */
const resourceReportSchema = new Schema(
  {
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
    reporter: { type: Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: REPORT_REASON_VALUES, required: true },
    details: { type: String, trim: true, maxlength: 1000, required: true },
    status: { type: String, enum: REPORT_STATUS_VALUES, default: 'open', index: true },
    handledBy: { type: Types.ObjectId, ref: 'User', default: null },
    resolutionNote: { type: String, trim: true, maxlength: 1000, default: '' },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

resourceReportSchema.index({ status: 1, createdAt: -1 });
resourceReportSchema.index({ resource: 1, reporter: 1, status: 1 });

resourceReportSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const pick = (value, fallback = 'Student') => value && typeof value === 'object' && value.name
    ? { id: String(value._id ?? value.id), name: value.name }
    : value ? { id: String(value), name: fallback } : null;
  return {
    id: String(plain._id),
    resource: plain.resource && typeof plain.resource === 'object'
      ? { id: String(plain.resource._id), title: plain.resource.title, url: plain.resource.url }
      : String(plain.resource),
    reporter: pick(plain.reporter),
    reason: plain.reason, details: plain.details || '', status: plain.status,
    handledBy: pick(plain.handledBy, 'Moderator'),
    resolutionNote: plain.resolutionNote || '', resolvedAt: plain.resolvedAt ?? null,
    createdAt: plain.createdAt,
  };
};

export const ResourceReport = mongoose.model('ResourceReport', resourceReportSchema);
export default ResourceReport;
