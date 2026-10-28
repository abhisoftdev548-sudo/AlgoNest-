import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './creator.service.js';

const actor = (req) => actorFrom(req);

export const myProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getMyProfile(actor(req)), 'Creator profile fetched');
});

export const updateProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.upsertMyProfile(req.validated.body, actor(req)), 'Creator profile saved');
});

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listCreators(req.validated.query), 'Creators fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getCreator(req.validated.params.id, actor(req), req.validated.query), 'Creator fetched');
});

export const myAnalytics = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAnalytics(actor(req), req.validated.query), 'Creator analytics fetched');
});

export const analytics = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAnalytics(actor(req), req.validated.query, { creatorId: req.validated.params.id }), 'Creator analytics fetched');
});
