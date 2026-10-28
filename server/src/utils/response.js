/**
 * Every API response has exactly this shape:
 *   { success: boolean, data: any|null, message: string, errors: array|null }
 * Pagination lives in `data.pagination` so no extra top-level keys are needed.
 */
export function sendSuccess(res, data = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message, errors: null });
}

export function sendCreated(res, data = null, message = 'Created') {
  return sendSuccess(res, data, message, 201);
}

export function sendError(res, statusCode, message, errors = null) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors,
  });
}
