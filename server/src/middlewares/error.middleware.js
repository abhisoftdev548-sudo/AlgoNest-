import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { formatZodIssues } from '@algonest/shared';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import { sendError } from '../utils/response.js';

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} was not found`));
}

/**
 * Single place where every failure becomes the same JSON envelope. Internal
 * details (stacks, Mongoose internals, SQL-ish messages) never leave prod.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let statusCode = 500;
  let message = 'Something went wrong. Please try again later.';
  let errors = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors ?? null;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = formatZodIssues(err.issues);
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((item) => ({ field: item.path, message: item.message, code: 'invalid' }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = 'A record with those values already exists';
    errors = Object.keys(err.keyPattern ?? {}).map((field) => ({
      field,
      message: `${field} is already in use`,
      code: 'duplicate',
    }));
  } else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired credentials';
  } else if (err?.type === 'entity.parse.failed' || err?.type === 'entity.too.large') {
    statusCode = err.type === 'entity.too.large' ? 413 : 400;
    message = err.type === 'entity.too.large' ? 'Request body is too large' : 'Malformed JSON body';
  } else if (err?.status === 413 || err?.statusCode === 413) {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (typeof err?.statusCode === 'number' && err.statusCode < 500) {
    // e.g. body-parser / cors errors that already carry a safe client status.
    statusCode = err.statusCode;
    message = err.message || message;
  }

  const log = statusCode >= 500 ? console.error : console.warn;
  if (!env.isTest || statusCode >= 500) {
    // Never log query parameters: list filters and future signed URLs can contain sensitive values.
    log(`[error] ${req.id ?? '-'} ${req.method} ${req.path} -> ${statusCode}`, err);
  }

  if (res.headersSent) return;
  sendError(res, statusCode, message, errors);
}
