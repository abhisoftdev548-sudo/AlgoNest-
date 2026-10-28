import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as userService from './user.service.js';

export const setGoal = asyncHandler(async (req, res) => {
  const user = await userService.setOnboardingGoal(req.user._id, req.validated.body);
  sendSuccess(res, { user }, 'Goal saved. Your plan is ready.');
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.validated.body);
  sendSuccess(res, { user }, 'Profile updated');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: await userService.getUserById(req.user._id) }, 'OK');
});

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await userService.listUsers(req.validated.query), 'Users fetched');
});

export const setRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.validated.params.id, req.validated.body.role, req.user._id);
  sendSuccess(res, { user }, 'Role updated');
});

export const setStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.validated.params.id, req.validated.body.status, req.user._id);
  sendSuccess(res, { user }, 'Account status updated');
});
