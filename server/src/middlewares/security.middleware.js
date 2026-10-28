import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/** Attach a correlation id to every request/response for audit logs. */
export function requestContext(req, res, next) {
  const incoming = req.get('x-request-id');
  const id = incoming && /^[\w-]{1,64}$/.test(incoming) ? incoming : crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

const rateLimitHandler = (req, _res, next, options) => {
  const minutes = Math.max(1, Math.ceil(options.windowMs / 60_000));
  next(ApiError.tooManyRequests(`Too many requests. Try again in about ${minutes} minutes.`));
};

const common = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler,
};

/** Global guard for all /api routes. */
export const apiLimiter = rateLimit({
  ...common,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.isTest ? 10_000 : env.RATE_LIMIT_MAX,
});

/**
 * Failed login/register requests are limited by client IP (using the package's
 * IPv6-aware default key generator). A per-email key can be rotated to bypass
 * protection while password-spraying many account names.
 */
export const authLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60_000,
  limit: env.isTest ? 10_000 : env.AUTH_RATE_LIMIT_MAX,
  skipSuccessfulRequests: true,
});

/** Refresh is cheap but should not be hammered by a broken client loop. */
export const refreshLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60_000,
  limit: env.isTest ? 10_000 : 60,
  skipSuccessfulRequests: true,
});
