import { ROLE_PERMISSIONS, USER_STATUSES } from '@algonest/shared';
import { User } from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { extractBearerToken, toAuthError, verifyAccessToken } from '../utils/tokens.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Verifies the short-lived access token and re-loads the user from MongoDB on
 * every request. That costs one indexed lookup but means a suspended account,
 * a role change, or a deleted user takes effect immediately rather than after
 * the access token expires. The DB role — not the token role — is authoritative.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req.get('authorization'));
  if (!token) throw ApiError.unauthorized('Access token is required', { code: 'NO_TOKEN' });

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw toAuthError();
  }

  const user = await User.findById(payload.sub);
  if (!user) throw toAuthError();
  // logoutAll / admin session revocation invalidates access tokens immediately.
  if ((payload.sv ?? 0) !== (user.sessionVersion ?? 0)) throw toAuthError();
  if (user.status !== USER_STATUSES.ACTIVE) {
    const message = user.status === USER_STATUSES.BANNED
      ? 'This account has been banned. Contact support if you believe this is an error.'
      : 'This account is suspended. Contact support.';
    throw ApiError.forbidden(message, { code: user.status === USER_STATUSES.BANNED ? 'ACCOUNT_BANNED' : 'ACCOUNT_SUSPENDED' });
  }

  req.user = user;
  req.auth = { tokenPayload: payload, role: user.role, permissions: ROLE_PERMISSIONS[user.role] ?? [] };
  next();
});

/** Public routes that can personalise a response but must not fail on no token. */
export const optionalAuthenticate = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req.get('authorization'));
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.status === USER_STATUSES.ACTIVE) {
      req.user = user;
      req.auth = { tokenPayload: payload, role: user.role, permissions: ROLE_PERMISSIONS[user.role] ?? [] };
    }
  } catch {
    // A malformed token on a public route is simply treated as anonymous.
  }
  return next();
});

/** Coarse role check. Prefer requirePermission for privileged routes. */
export function authorize(...allowedRoles) {
  const allowed = new Set(allowedRoles.flat());
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!allowed.has(req.user.role)) return next(ApiError.forbidden());
    return next();
  };
}

/** Permission-based RBAC: super_admin implicitly owns every permission. */
export function requirePermission(...required) {
  const needed = required.flat();
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    const granted = req.auth?.permissions ?? [];
    return needed.every((permission) => granted.includes(permission))
      ? next()
      : next(ApiError.forbidden('Your role cannot perform this action'));
  };
}

/** Blocks core product routes until goal selection is done. */
export function requireOnboarded(req, _res, next) {
  if (!req.user) return next(ApiError.unauthorized());
  if (!req.user.onboardingCompleted || !req.user.goal) {
    return next(ApiError.forbidden('Complete onboarding first', { code: 'ONBOARDING_REQUIRED' }));
  }
  return next();
}
