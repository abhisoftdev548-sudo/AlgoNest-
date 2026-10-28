import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

/** Per-user bookmark of a PUBLIC resource. One row per (user, resource). */
const resourceSaveSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    resource: { type: Types.ObjectId, ref: 'Resource', required: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

resourceSaveSchema.index({ user: 1, resource: 1 }, { unique: true, name: 'uniq_user_resource_save' });
resourceSaveSchema.index({ user: 1, createdAt: -1 });
resourceSaveSchema.index({ resource: 1, createdAt: -1 });

resourceSaveSchema.statics.toPublic = function toPublic(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  return { id: String(plain._id), resource: String(plain.resource), savedAt: plain.createdAt };
};

export const ResourceSave = mongoose.model('ResourceSave', resourceSaveSchema);
export default ResourceSave;
