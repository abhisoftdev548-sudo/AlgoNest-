import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from '../mocks/actor.js';
import * as service from './resource.service.js';

const actor = (req) => actorFrom(req);

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listResources(req.validated.query, actor(req)), 'Resources fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getResource(req.validated.params.id, actor(req)), 'Resource fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createResource(req.validated.body, actor(req)), 'Resource submitted');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateResource(req.validated.params.id, req.validated.body, actor(req)), 'Resource updated');
});

export const duplicate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.checkDuplicate(req.validated.query.url, actor(req)), 'Duplicate check complete');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveResource(req.validated.params.id, actor(req)), 'Resource archived');
});

export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreResource(req.validated.params.id, actor(req)), 'Resource restored to draft');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitResource(req.validated.params.id, actor(req)), 'Submitted for review');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateResource(req.validated.params.id, decision, note, actor(req)), `Resource ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishResource(req.validated.params.id, actor(req)), 'Resource published');
});

export const checkLink = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.checkResourceLink(req.validated.params.id, actor(req)), 'Link checked');
});

export const runLinkCheckBatch = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.runLinkCheckBatch(req.validated.query, actor(req)), 'Link check batch complete');
});
