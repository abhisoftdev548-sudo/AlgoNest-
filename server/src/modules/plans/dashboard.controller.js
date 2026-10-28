import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './dashboard.service.js';

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getDashboard(actorFrom(req), req.validated.query), 'Dashboard fetched');
});
