import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './plan.service.js';

const actor = (req) => actorFrom(req);

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listPlans(req.validated.query, actor(req)), 'Plans fetched');
});

export const content = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAvailableContent(actor(req)), 'Published content fetched');
});

export const active = asyncHandler(async (req, res) => {
  sendSuccess(res, { plan: await service.getActivePlan(actor(req)) }, 'Active plan fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createPlan(req.validated.body, actor(req)), 'Plan created and tasks distributed');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getPlan(req.validated.params.id, actor(req)), 'Plan fetched');
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.updatePlan(id, req.validated.body, actor(req)), 'Plan updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updatePlan(req.validated.params.id, { status: 'archived' }, actor(req)), 'Plan archived');
});

export const regenerate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.regeneratePlan(req.validated.params.id, actor(req)), 'Plan regenerated');
});

export const reschedule = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.rescheduleMissed(req.validated.params.id, req.validated.body, actor(req)), 'Missed tasks rescheduled');
});

export const tasks = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.listTasks(id, req.validated.query, actor(req)), 'Tasks fetched');
});

export const taskStatus = asyncHandler(async (req, res) => {
  const { id, taskId } = req.validated.params;
  sendSuccess(res, await service.updateTaskStatus(id, taskId, req.validated.body, actor(req)), 'Task updated');
});

export const taskOrder = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.reorderTasks(id, req.validated.body, actor(req)), 'Task order saved');
});
