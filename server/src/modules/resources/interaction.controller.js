import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './interaction.service.js';
import * as resourceService from './resource.service.js';

const actor = (req) => actorFrom(req);

export const save = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.toggleSave(id, actor(req), req.method === 'PUT'), 'Bookmark updated');
});

export const saved = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listSaved(req.validated.query, actor(req)), 'Saved resources fetched');
});

export const rate = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.rateResource(id, req.validated.body, actor(req)), 'Rating saved');
});

export const ratings = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.listRatings(id, req.validated.query, actor(req)), 'Reviews fetched');
});

export const feedback = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.setFeedback(id, req.validated.body, actor(req)), 'Feedback saved');
});

export const report = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.reportResource(id, req.validated.body, actor(req)), 'Report submitted');
});

export const reports = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listReports(req.validated.query, actor(req)), 'Reports fetched');
});

export const resolveReport = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.resolveReport(req.validated.params.reportId, req.validated.body, actor(req)), 'Report resolved');
});

export const event = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.trackEvent(id, req.validated.body.type, actor(req)), 'Event recorded');
});

/** Reuse the catalogue list with `saved: 'true'` for the Saved tab. */
export const savedCatalogue = asyncHandler(async (req, res) => {
  sendSuccess(res, await resourceService.listResources({ ...req.validated.query, saved: 'true' }, actor(req)), 'Saved catalogue fetched');
});
