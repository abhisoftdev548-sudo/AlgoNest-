import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ApiError from './ApiError.js';

const signOptions = (expiresIn, jwtid) => ({
  algorithm: 'HS256',
  expiresIn,
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
  jwtid,
});

const verifyOptions = {
  algorithms: ['HS256'],
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
};

/** Short-lived access token. Carries the role for fast RBAC checks. */
export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, sv: user.sessionVersion ?? 0, type: 'access' },
    env.JWT_ACCESS_SECRET,
    signOptions(env.ACCESS_TOKEN_TTL, crypto.randomUUID()),
  );
}

/** Long-lived refresh token. Stored (hashed) server-side so it can be revoked. */
export function signRefreshToken({ sub, family }) {
  return jwt.sign(
    { sub: String(sub), family, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    signOptions(`${env.REFRESH_TOKEN_TTL_DAYS}d`, crypto.randomUUID()),
  );
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, verifyOptions);
  if (payload.type !== 'access' || !payload.sub) throw new jwt.JsonWebTokenError('Wrong token type');
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, verifyOptions);
  if (payload.type !== 'refresh' || !payload.sub || !payload.family) {
    throw new jwt.JsonWebTokenError('Wrong token type');
  }
  return payload;
}

/** Refresh tokens are random JWTs; a SHA-256 digest is enough to index them. */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function newTokenFamily() {
  return crypto.randomUUID();
}

/** Normalise a raw Authorization header, returning null when malformed. */
export function extractBearerToken(header) {
  if (typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
}

/** Convert jsonwebtoken failures into safe, uniform 401 responses. */
export function toAuthError() {
  return ApiError.unauthorized('Invalid or expired credentials', { code: 'TOKEN_INVALID' });
}
