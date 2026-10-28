import { PAGINATION, ROLES, USER_STATUSES } from '@algonest/shared';
import { RefreshSession } from '../../models/RefreshSession.js';
import { User } from '../../models/User.js';
import { recordAdminAudit } from '../../utils/adminAudit.js';
import ApiError from '../../utils/ApiError.js';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (date) => new Date(Math.floor(new Date(date).getTime() / DAY_MS) * DAY_MS);

/**
 * Idempotent daily streak. Called on login and onboarding today; Phase 5's
 * adaptive plan will call it whenever a daily task is completed as well.
 * Assumption: calendar days are UTC (no timezone field exists on User yet).
 */
export function applyDailyStreak(user, now = new Date()) {
  const today = startOfUtcDay(now);
  const last = user.streak?.lastActiveDate ? startOfUtcDay(user.streak.lastActiveDate) : null;

  if (last && last.getTime() === today.getTime()) return user;

  const yesterday = new Date(today.getTime() - DAY_MS);
  user.streak.current = last && last.getTime() === yesterday.getTime() ? (user.streak.current ?? 0) + 1 : 1;
  user.streak.longest = Math.max(user.streak.longest ?? 0, user.streak.current);
  user.streak.lastActiveDate = today;
  return user;
}

export async function setOnboardingGoal(userId, { goal, preferredLanguage }) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  user.goal = goal;
  user.preferredLanguage = preferredLanguage;
  user.onboardingCompleted = true;
  applyDailyStreak(user);
  await user.save();
  return user.toPublic();
}

export async function updateProfile(userId, patch) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (patch.name !== undefined) user.name = patch.name;
  if (patch.preferredLanguage !== undefined) user.preferredLanguage = patch.preferredLanguage;
  await user.save();
  return user.toPublic();
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toPublic();
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** All list endpoints share this pagination contract. */
export async function listUsers({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, q, role, status }) {
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (q) {
    const safe = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: safe }, { email: safe }];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    items: users.map((user) => user.toPublic()),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function updateUserRole(userId, role, actorId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === role) return user.toPublic();

  if (String(user._id) === String(actorId) && role !== ROLES.SUPER_ADMIN) {
    throw ApiError.badRequest('You cannot remove your own Super Admin role');
  }

  if (user.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
    const otherAdmins = await User.countDocuments({
      _id: { $ne: user._id },
      role: ROLES.SUPER_ADMIN,
      status: USER_STATUSES.ACTIVE,
    });
    if (otherAdmins === 0) throw ApiError.badRequest('Cannot demote the last active Super Admin');
  }

  const previousRole = user.role;
  user.role = role;
  user.sessionVersion = (user.sessionVersion ?? 0) + 1;
  await user.save();
  await RefreshSession.updateMany(
    { user: user._id, revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: 'admin_role_change' } },
  );
  await recordAdminAudit({ actor: actorId, action: 'user.role_changed', targetType: 'user', targetId: user._id, summary: `Role changed from ${previousRole} to ${role}`, metadata: { from: previousRole, to: role } });
  return user.toPublic();
}

export async function updateUserStatus(userId, status, actorId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  if (user.status === status) return user.toPublic();

  if (String(user._id) === String(actorId) && status !== USER_STATUSES.ACTIVE) {
    throw ApiError.badRequest('You cannot disable your own account');
  }
  if (user.role === ROLES.SUPER_ADMIN && status !== USER_STATUSES.ACTIVE) {
    const otherAdmins = await User.countDocuments({ _id: { $ne: user._id }, role: ROLES.SUPER_ADMIN, status: USER_STATUSES.ACTIVE });
    if (otherAdmins === 0) throw ApiError.badRequest('Cannot disable the last active Super Admin');
  }

  const previousStatus = user.status;
  user.status = status;
  if (status !== USER_STATUSES.ACTIVE) {
    // Kick out every live session of a suspended account.
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await RefreshSession.updateMany(
      { user: user._id, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: status === USER_STATUSES.BANNED ? 'admin_ban' : 'admin_suspend' } },
    );
  }
  await user.save();
  await recordAdminAudit({ actor: actorId, action: status === USER_STATUSES.BANNED ? 'user.banned' : status === USER_STATUSES.SUSPENDED ? 'user.suspended' : 'user.reactivated', targetType: 'user', targetId: user._id, summary: `Account status changed from ${previousStatus} to ${status}`, metadata: { from: previousStatus, to: status } });
  return user.toPublic();
}
