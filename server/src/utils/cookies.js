import { env } from '../config/env.js';

export const REFRESH_COOKIE_NAME = 'ag_refresh';
export const REFRESH_COOKIE_PATH = `/api/${env.API_VERSION}/auth`;

/** Build cookie options once so set and clear always match (path/domain matter). */
export function refreshCookieOptions() {
  const options = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.COOKIE_SAME_SITE,
    path: REFRESH_COOKIE_PATH,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
  if (env.COOKIE_DOMAIN) options.domain = env.COOKIE_DOMAIN;
  return options;
}

export function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions());
}

export function clearRefreshCookie(res) {
  const { maxAge, ...options } = refreshCookieOptions();
  res.clearCookie(REFRESH_COOKIE_NAME, { ...options, expires: new Date(0) });
}

export function readRefreshCookie(req) {
  const value = req.cookies?.[REFRESH_COOKIE_NAME];
  return typeof value === 'string' && value.length > 0 ? value : null;
}
