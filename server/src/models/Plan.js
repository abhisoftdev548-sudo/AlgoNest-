import mongoose from 'mongoose';
import {
  GOAL_VALUES, MOCK_INTERVAL_DAYS, PLAN_LIMITS, PLAN_STATUS_VALUES,
} from '@algonest/shared';

const { Schema, Types } = mongoose;

const warningSchema = new Schema(
  {
    code: { type: String, required: true, maxlength: 40 },
    message: { type: String, required: true, maxlength: 300 },
    date: { type: String, default: null },
    minutes: { type: Number, default: null },
  },
  { _id: false, versionKey: false },
);

/**
 * PER-USER adaptive plan. Content is never copied — only IDs of published
 * sheets/quizzes/mocks are referenced, so a plan follows published versions
 * while generated PlanTask rows keep a frozen title/URL/topic snapshot for
 * the day (a deleted resource must not erase someone's history).
 */
const planSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: PLAN_LIMITS.MAX_TITLE },
    goal: { type: String, enum: GOAL_VALUES, required: true },
    /** UTC calendar-day keys, never Date objects. */
    startDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    endDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    dailyMinutes: { type: Number, required: true, min: PLAN_LIMITS.MIN_DAILY_MINUTES, max: PLAN_LIMITS.MAX_DAILY_MINUTES },
    restDays: { type: [Number], default: [] },
    sheetIds: { type: [{ type: Types.ObjectId, ref: 'Sheet' }], default: [] },
    quizIds: { type: [{ type: Types.ObjectId, ref: 'Quiz' }], default: [] },
    mockIds: { type: [{ type: Types.ObjectId, ref: 'MockTest' }], default: [] },
    revisionEnabled: { type: Boolean, default: true },
    mockIntervalDays: { type: Number, min: 7, max: 60, default: MOCK_INTERVAL_DAYS },
    status: { type: String, enum: PLAN_STATUS_VALUES, default: 'active', index: true },
    notes: { type: String, trim: true, maxlength: PLAN_LIMITS.MAX_NOTES, default: '' },
    /** Snapshot refreshed whenever tasks change; never the source of truth. */
    stats: {
      totalTasks: { type: Number, default: 0 },
      doneTasks: { type: Number, default: 0 },
      missedTasks: { type: Number, default: 0 },
      completionPercentage: { type: Number, default: 0 },
      overloadCount: { type: Number, default: 0 },
    },
    warnings: { type: [warningSchema], default: [] },
    activatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

// At most one ACTIVE plan per learner. A new plan archives the old one first.
planSchema.index(
  { user: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' }, name: 'uniq_active_plan_per_user' },
);
planSchema.index({ user: 1, createdAt: -1 });
planSchema.index({ user: 1, status: 1, endDate: -1 });

planSchema.methods.isEditable = function isEditable() {
  return this.status === 'active' || this.status === 'paused';
};

planSchema.statics.toPublic = function toPublic(doc, view = 'summary') {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  const ids = (values) => (values ?? []).map(String);
  const base = {
    id: String(plain._id),
    title: plain.title,
    goal: plain.goal,
    startDate: plain.startDate,
    endDate: plain.endDate,
    dailyMinutes: plain.dailyMinutes,
    restDays: plain.restDays ?? [],
    sheetIds: ids(plain.sheetIds),
    quizIds: ids(plain.quizIds),
    mockIds: ids(plain.mockIds),
    revisionEnabled: plain.revisionEnabled !== false,
    mockIntervalDays: plain.mockIntervalDays ?? MOCK_INTERVAL_DAYS,
    status: plain.status,
    notes: plain.notes || '',
    stats: {
      totalTasks: plain.stats?.totalTasks ?? 0,
      doneTasks: plain.stats?.doneTasks ?? 0,
      missedTasks: plain.stats?.missedTasks ?? 0,
      completionPercentage: plain.stats?.completionPercentage ?? 0,
      overloadCount: plain.stats?.overloadCount ?? 0,
    },
    activatedAt: plain.activatedAt ?? null,
    completedAt: plain.completedAt ?? null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
  if (view === 'summary') return base;
  return {
    ...base,
    warnings: (plain.warnings ?? []).map((entry) => ({
      code: entry.code, message: entry.message, date: entry.date ?? null, minutes: entry.minutes ?? null,
    })),
  };
};

export const Plan = mongoose.model('Plan', planSchema);
export default Plan;
