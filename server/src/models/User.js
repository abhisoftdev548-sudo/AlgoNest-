import mongoose from 'mongoose';
import {
  GOAL_VALUES,
  PREFERRED_LANGUAGES,
  ROLES,
  ROLE_VALUES,
  USER_STATUSES,
  USER_STATUS_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

/**
 * Shared, globally unique identity. Per-user learning data (progress, notes,
 * personal resources) will live in separate collections from Phase 2 onward —
 * never embedded here — so sheet/quiz documents stay immutable per user.
 */
const streakSchema = new Schema(
  {
    current: { type: Number, default: 0, min: 0 },
    longest: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name is too short'],
      maxlength: [60, 'Name is too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email is too long'],
      // Deliberately no regex here: Zod owns validation, Mongoose is a backstop.
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: { values: ROLE_VALUES, message: 'Unknown role' },
      default: ROLES.STUDENT,
      required: true,
    },
    goal: {
      type: String,
      enum: { values: GOAL_VALUES, message: 'Unknown goal' },
      default: null,
    },
    onboardingCompleted: { type: Boolean, default: false },
    streak: { type: streakSchema, default: () => ({}) },
    preferredLanguage: {
      type: String,
      enum: { values: PREFERRED_LANGUAGES, message: 'Unknown language' },
      default: null,
    },
    status: {
      type: String,
      enum: { values: USER_STATUS_VALUES, message: 'Unknown status' },
      default: USER_STATUSES.ACTIVE,
    },
    lastLoginAt: { type: Date, default: null },
    // Basic account lockout complements the IP-level rate limiter.
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
    // Bumped by an admin/support action to invalidate every access token.
    sessionVersion: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: '__v' },
);

// Unique email is created by the `unique: true` above; these cover admin
// listings and future analytics queries.
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ status: 1 });
userSchema.index({ goal: 1 });

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.failedLoginAttempts;
    delete ret.lockUntil;
    delete ret.sessionVersion;
    return ret;
  },
});

userSchema.statics.findByEmailWithSecrets = function findByEmailWithSecrets(email) {
  return this.findOne({ email: String(email).toLowerCase() }).select(
    '+passwordHash +failedLoginAttempts +lockUntil +sessionVersion',
  );
};

userSchema.methods.toPublic = function toPublic() {
  return this.toJSON();
};

userSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const User = mongoose.model('User', userSchema);
export const isValidObjectId = (id) => Types.ObjectId.isValid(id);
