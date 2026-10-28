import mongoose from 'mongoose';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Fail fast (503) instead of letting Mongoose buffer a query for 10 seconds
 * when the database is unreachable. Keeps health probes honest and gives the
 * client a deterministic error it can display.
 */
export function requireDatabase(_req, _res, next) {
  // Unit tests stub the models, so they intentionally run without a connection.
  if (env.isTest) return next();
  if (mongoose.connection.readyState !== 1) {
    return next(
      ApiError.serviceUnavailable('The database is temporarily unavailable. Please try again shortly.'),
    );
  }
  return next();
}

export default requireDatabase;
