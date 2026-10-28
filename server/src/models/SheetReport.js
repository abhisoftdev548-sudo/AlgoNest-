import mongoose from 'mongoose';
import { REPORT_REASON_VALUES, REPORT_STATUS_VALUES, SHEET_LIMITS } from '@algonest/shared';

const { Schema, Types } = mongoose;

/** User-submitted content report; triaged by staff with CONTENT_MODERATE. */
const sheetReportSchema = new Schema(
  {
    sheet: { type: Types.ObjectId, ref: 'Sheet', required: true, index: true },
    reporter: { type: Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: REPORT_REASON_VALUES, required: true },
    details: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: REPORT_STATUS_VALUES, default: 'open', index: true },
    handledBy: { type: Types.ObjectId, ref: 'User', default: null },
    resolutionNote: { type: String, trim: true, maxlength: 1000, default: '' },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

sheetReportSchema.index({ status: 1, createdAt: -1 });
sheetReportSchema.index({ sheet: 1, reporter: 1, status: 1 });

sheetReportSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    sheet: String(plain.sheet),
    reporter: typeof plain.reporter === 'object' && plain.reporter
      ? { id: String(plain.reporter._id), name: plain.reporter.name }
      : String(plain.reporter),
    reason: plain.reason, details: plain.details || '', status: plain.status,
    handledBy: plain.handledBy ? String(plain.handledBy) : null,
    resolutionNote: plain.resolutionNote || '', resolvedAt: plain.resolvedAt ?? null,
    createdAt: plain.createdAt,
  };
};

export const SheetReport = mongoose.model('SheetReport', sheetReportSchema);
export default SheetReport;
