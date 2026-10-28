import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * One document per issued refresh token. We store only a SHA-256 digest, so a
 * database leak cannot be replayed against /auth/refresh. `family` groups a
 * rotation chain: presenting an already-rotated token means token theft, so we
 * revoke the whole family (refresh token reuse detection).
 */
const refreshSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    revokeReason: {
      type: String,
      enum: ['rotated', 'logout', 'logout_all', 'reuse_detected', 'admin_revoke', null],
      default: null,
    },
    createdByIp: { type: String, maxlength: 64, default: null },
    userAgent: { type: String, maxlength: 256, default: null },
  },
  { timestamps: true, versionKey: false },
);

// MongoDB removes expired sessions automatically. `expiresAt` is also checked
// in code so behaviour is correct even before the TTL monitor runs.
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshSession = mongoose.model('RefreshSession', refreshSessionSchema);
