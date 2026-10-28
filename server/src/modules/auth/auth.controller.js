import * as authService from './auth.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from '../../utils/cookies.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body, authService.requestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendCreated(res, { user: result.user, accessToken: result.accessToken }, 'Account created');
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body, authService.requestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Signed in');
});

export const refresh = asyncHandler(async (req, res) => {
  const token = readRefreshCookie(req);
  if (!token) throw ApiError.unauthorized('No active refresh session', { code: 'NO_REFRESH' });

  try {
    const result = await authService.rotateRefreshSession(token, authService.requestContext(req));
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Session refreshed');
  } catch (error) {
    // Prevent a broken/expired cookie from causing an endless refresh loop.
    clearRefreshCookie(res);
    throw error;
  }
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(readRefreshCookie(req));
  clearRefreshCookie(res);
  sendSuccess(res, null, 'Signed out');
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user._id);
  clearRefreshCookie(res);
  sendSuccess(res, null, 'Signed out of all devices');
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: await authService.getCurrentUser(req.user._id) }, 'OK');
});
