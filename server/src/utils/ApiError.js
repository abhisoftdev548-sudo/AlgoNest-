/** Operational HTTP error. Anything not an ApiError is treated as a 500. */
export default class ApiError extends Error {
  constructor(statusCode, message, { code = null, errors = null, cause = null } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message = 'Bad request', options) {
    return new ApiError(400, message, { code: 'BAD_REQUEST', ...options });
  }

  static unauthorized(message = 'Authentication required', options) {
    return new ApiError(401, message, { code: 'UNAUTHORIZED', ...options });
  }

  static forbidden(message = 'You do not have permission to do that', options) {
    return new ApiError(403, message, { code: 'FORBIDDEN', ...options });
  }

  static notFound(message = 'Resource not found', options) {
    return new ApiError(404, message, { code: 'NOT_FOUND', ...options });
  }

  static conflict(message = 'Resource already exists', options) {
    return new ApiError(409, message, { code: 'CONFLICT', ...options });
  }

  static unprocessable(message = 'Validation failed', options) {
    return new ApiError(422, message, { code: 'VALIDATION_ERROR', ...options });
  }

  static tooManyRequests(message = 'Too many requests, please slow down', options) {
    return new ApiError(429, message, { code: 'RATE_LIMITED', ...options });
  }

  static serviceUnavailable(message = 'Service temporarily unavailable', options) {
    return new ApiError(503, message, { code: 'SERVICE_UNAVAILABLE', ...options });
  }
}
