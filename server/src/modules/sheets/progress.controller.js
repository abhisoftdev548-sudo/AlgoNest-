import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './progress.service.js';

const actor = (req) => actorFrom(req);

/* Progress */
export const getProgress = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.getProgress(id, req.validated.query, actor(req)), 'Progress fetched');
});

export const upsertProgress = asyncHandler(async (req, res) => {
  const { id, problemId } = req.validated.params;
  sendSuccess(res, await service.upsertProgress(id, problemId, req.validated.body, actor(req)), 'Progress saved');
});

/* Personal resources */
export const listResources = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listPersonalResources(req.validated.query, actor(req)), 'Resources fetched');
});

export const createResource = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createPersonalResource(req.validated.body, actor(req)), 'Resource saved');
});

export const updateResource = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updatePersonalResource(req.validated.params.id, req.validated.body, actor(req)), 'Resource updated');
});

export const deleteResource = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.deletePersonalResource(req.validated.params.id, actor(req)), 'Resource removed');
});
