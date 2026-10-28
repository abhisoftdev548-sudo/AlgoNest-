import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const auditSchema = new Schema({
  actor: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, trim: true, maxlength: 100 },
  targetType: { type: String, required: true, trim: true, maxlength: 60 },
  targetId: { type: String, required: true, trim: true, maxlength: 80 },
  summary: { type: String, trim: true, maxlength: 500, default: '' },
  metadata: { type: Schema.Types.Mixed, default: () => ({}) },
  requestId: { type: String, maxlength: 100, default: '' },
  ip: { type: String, maxlength: 80, default: '' },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

auditSchema.index({ createdAt: -1 });
auditSchema.index({ action: 1, createdAt: -1 });
auditSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const AdminAuditLog = mongoose.model('AdminAuditLog', auditSchema);
export default AdminAuditLog;
