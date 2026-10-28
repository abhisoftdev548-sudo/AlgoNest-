import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as service from './admin.service.js';

export const overview = asyncHandler(async (req, res) => sendSuccess(res, await service.getOverview(req.auth?.permissions ?? []), 'Admin overview loaded'));
export const moderationQueue = asyncHandler(async (req, res) => sendSuccess(res, await service.listModeration(req.validated.query), 'Moderation queue loaded'));
export const moderate = asyncHandler(async (req, res) => {
  const result = await service.moderate({ ...req.validated.params, ...req.validated.body }, req.user);
  sendSuccess(res, result, `Content ${req.validated.body.decision}d`);
});
export const users = asyncHandler(async (req, res) => sendSuccess(res, await service.listUsers(req.validated.query), 'Users loaded'));
export const setRole = asyncHandler(async (req, res) => sendSuccess(res, { user: await service.setRole(req.validated.params.id, req.validated.body.role, req.user) }, 'Role updated'));
export const setStatus = asyncHandler(async (req, res) => sendSuccess(res, { user: await service.setStatus(req.validated.params.id, req.validated.body.status, req.user) }, 'Account status updated'));
export const verifyCreator = asyncHandler(async (req, res) => sendSuccess(res, await service.verifyCreator(req.validated.params.id, req.validated.body.verified, req.user), 'Creator verification updated'));
export const reports = asyncHandler(async (req, res) => sendSuccess(res, await service.listReports(req.validated.query), 'Reports loaded'));
export const resolveReport = asyncHandler(async (req, res) => sendSuccess(res, await service.resolveReport({ ...req.validated.params, ...req.validated.body }, req.user), 'Report handled'));
export const audit = asyncHandler(async (req, res) => sendSuccess(res, await service.listAudit(req.validated.query), 'Audit log loaded'));
export const flags = asyncHandler(async (req, res) => sendSuccess(res, await service.listFlags(req.validated.query), 'Feature flags loaded'));
export const updateFlag = asyncHandler(async (req, res) => sendSuccess(res, await service.upsertFlag(req.validated.params.key, req.validated.body, req.user, req), 'Feature flag updated'));
