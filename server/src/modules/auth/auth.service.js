import bcrypt from 'bcryptjs';
import { ROLES } from '@algonest/shared';
import { env } from '../../config/env.js';
import { RefreshSession } from '../../models/RefreshSession.js';
import { User } from '../../models/User.js';
import ApiError from '../../utils/ApiError.js';
import {
  hashToken,
  newTokenFamily,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/tokens.js';
import { applyDailyStreak } from '../users/user.service.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60_000;

// Constant-work comparison for unknown emails, so user enumeration by timing
// is not trivially possible.
const DUMMY_HASH = bcrypt.hashSync('timing-attack-mitigation-placeholder', 10);

export function requestContext(req) {
  return {
    ip: String(req.ip ?? req.socket?.remoteAddress ?? '').slice(0, 64),
    userAgent: String(req.get?.('user-agent') ?? '').slice(0, 256),
  };
}

/** Create a refresh session + access token pair for a user. */
async function createSession(user, ctx, family = newTokenFamily()) {
  const refreshToken = signRefreshToken({ sub: user._id, family });
  const payload = verifyRefreshToken(refreshToken);

  await RefreshSession.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    family,
    expiresAt: new Date(payload.exp * 1000),
    createdByIp: ctx.ip || null,
    userAgent: ctx.userAgent || null,
  });

  return { accessToken: signAccessToken(user), refreshToken };
}

async function revokeFamily(family, reason) {
  if (!family) return;
  await RefreshSession.updateMany(
    { family, revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: reason } },
  );
}

export async function register(input, ctx) {
  const email = input.email.toLowerCase();
  if (await User.exists({ email })) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  let user;
  try {
    user = await User.create({
      name: input.name,
      email,
      passwordHash,
      role: ROLES.STUDENT, // role is NEVER accepted from the client
    });
  } catch (error) {
    // Handles the race between exists() and create() on a concurrent signup.
    if (error?.code === 11000) throw ApiError.conflict('An account with this email already exists');
    throw error;
  }

  const tokens = await createSession(user, ctx);
  return { user: user.toPublic(), ...tokens };
}

export async function login(input, ctx) {
  const email = input.email.toLowerCase();
  const user = await User.findByEmailWithSecrets(email);

  if (!user) {
    await bcrypt.compare(input.password, DUMMY_HASH);
    throw ApiError.unauthorized('Invalid email or password', { code: 'INVALID_CREDENTIALS' });
  }

  if (user.isLocked()) {
    throw ApiError.tooManyRequests('Account temporarily locked after too many failed attempts. Try again in 15 minutes.');
  }

  if (user.status !== 'active') {
    throw ApiError.forbidden('This account is suspended. Contact support.');
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw ApiError.unauthorized('Invalid email or password', { code: 'INVALID_CREDENTIALS' });
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.lastLoginAt = new Date();
  applyDailyStreak(user);
  await user.save();

  const tokens = await createSession(user, ctx);
  return { user: user.toPublic(), ...tokens };
}

/**
 * Refresh-token rotation with reuse detection. The old session is claimed
 * atomically (findOneAndUpdate) so two concurrent refreshes cannot both win.
 */
export async function rotateRefreshSession(rawToken, ctx) {
  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.', { code: 'REFRESH_INVALID' });
  }

  const tokenHash = hashToken(rawToken);
  const claimed = await RefreshSession.findOneAndUpdate(
    { tokenHash, family: payload.family, revokedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date(), revokeReason: 'rotated' } },
    { new: true },
  );

  if (!claimed) {
    const existing = await RefreshSession.findOne({ tokenHash });
    if (existing) {
      // A rotated/expired token was replayed: assume theft, kill the chain.
      await revokeFamily(existing.family, 'reuse_detected');
      throw ApiError.unauthorized('Session reuse detected. Please sign in again.', { code: 'REFRESH_REUSE' });
    }
    throw ApiError.unauthorized('Session not found. Please sign in again.', { code: 'REFRESH_UNKNOWN' });
  }

  const user = await User.findById(claimed.user);
  if (!user || user.status !== 'active') {
    await revokeFamily(claimed.family, 'admin_revoke');
    throw ApiError.unauthorized('Account is unavailable. Please sign in again.', { code: 'ACCOUNT_UNAVAILABLE' });
  }

  const tokens = await createSession(user, ctx, claimed.family);
  return { user: user.toPublic(), ...tokens };
}

/** Revoke only the current device. Safe to call with an invalid token. */
export async function logout(rawToken) {
  if (!rawToken) return;
  await RefreshSession.updateOne(
    { tokenHash: hashToken(rawToken), revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: 'logout' } },
  );
}

/** Revoke every session and invalidate all outstanding access tokens. */
export async function logoutAll(userId) {
  await Promise.all([
    RefreshSession.updateMany(
      { user: userId, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: 'logout_all' } },
    ),
    User.updateOne({ _id: userId }, { $inc: { sessionVersion: 1 } }),
  ]);
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toPublic();
}
