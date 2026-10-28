/**
 * Wraps async route handlers so rejected promises reach the central error
 * handler instead of crashing the process (Express 4 does not do this).
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
