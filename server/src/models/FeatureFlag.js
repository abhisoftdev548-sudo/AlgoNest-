import mongoose from 'mongoose';
import { Types } from 'mongoose';

const featureFlagSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[a-z][a-z0-9._-]{1,79}$/ },
  enabled: { type: Boolean, required: true, default: false },
  description: { type: String, trim: true, maxlength: 240, default: '' },
  updatedBy: { type: Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true, versionKey: false });
featureFlagSchema.index({ enabled: 1, key: 1 });

export const FeatureFlag = mongoose.model('FeatureFlag', featureFlagSchema);
export default FeatureFlag;
