/**
 * Fetch wrapper for the AlgoNest API.
 *
 * - access token lives ONLY in memory (never localStorage) — XSS-safe by design
 * - refresh token is an httpOnly cookie, sent with `credentials: 'include'`
 * - a single-flight refresh prevents token-rotation races (React StrictMode,
 *   parallel queries, etc.)
 * - every response is unwrapped from { success, data, message, errors }
 */
const BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 15_000;

let accessToken = null;
let onUnauthorized = null;
let refreshPromise = null;

export class ApiClientError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }

  /** Map for form-level display: { email: 'Enter a valid email address' }. */
  get fieldErrors() {
    const result = {};
    for (const issue of this.errors ?? []) {
      if (issue?.field && !result[issue.field]) result[issue.field] = issue.message;
    }
    return result;
  }
}

export function setAccessToken(token) {
  accessToken = token ?? null;
}

export function getAccessToken() {
  return accessToken;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

function buildUrl(path, query) {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${suffix}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((item) => params.append(key, String(item)));
    else params.append(key, String(value));
  }
  const search = params.toString();
  return search ? `${url}?${search}` : url;
}

async function parseBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function rawRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    signal,
    timeout = DEFAULT_TIMEOUT_MS,
    auth = true,
  } = options;

  const requestSignal = signal ?? AbortSignal.timeout(timeout);
  const response = await fetch(buildUrl(path, query), {
    method,
    credentials: 'include',
    signal: requestSignal,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await parseBody(response);

  if (!response.ok || payload?.success === false) {
    throw new ApiClientError(
      payload?.message || `Request failed (${response.status})`,
      response.status,
      payload?.errors ?? null,
    );
  }

  return payload?.data ?? payload;
}

/** Public helper used by AuthGate on boot and by the 401 interceptor. */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', { method: 'POST', body: {}, auth: false })
      .then((data) => {
        if (!data?.accessToken || !data?.user) {
          throw new ApiClientError('Invalid refresh response', 401);
        }
        setAccessToken(data.accessToken);
        return data;
      })
      .catch((error) => {
        setAccessToken(null);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, options = {}) {
  const { retryOnUnauthorized = true, ...rest } = options;
  const isAuthCall = path.startsWith('/auth/login') || path.startsWith('/auth/register') || path.startsWith('/auth/refresh');

  try {
    return await rawRequest(path, rest);
  } catch (error) {
    if (!(error instanceof ApiClientError) || error.status !== 401 || !retryOnUnauthorized || isAuthCall) {
      throw error;
    }
    try {
      await refreshSession();
    } catch (refreshError) {
      onUnauthorized?.();
      throw refreshError;
    }
    return rawRequest(path, rest);
  }
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { request, BASE_URL };
export default api;
