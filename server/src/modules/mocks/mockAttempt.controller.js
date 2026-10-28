import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './mockAttempt.service.js';

const actor = (req) => actorFrom(req);

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttempt(req.validated.params.id, actor(req)), 'Attempt fetched');
});

export const questions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttemptQuestions(req.validated.params.id, req.validated.query, actor(req)), 'Questions fetched');
});

export const autosave = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.autosaveAttempt(req.validated.params.id, req.validated.body, actor(req)), 'Answers saved');
});

export const heartbeat = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.heartbeat(req.validated.params.id, req.validated.body, actor(req)), 'Clock synced');
});

export const submitSection = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.validated.params;
  sendSuccess(res, await service.submitSection(id, sectionId, req.validated.body, actor(req)), 'Section submitted');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitAttempt(req.validated.params.id, req.validated.body, actor(req)), 'Attempt submitted');
});

export const result = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getResult(req.validated.params.id, actor(req)), 'Result fetched');
});

export const reasons = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.setWrongReasons(req.validated.params.id, req.validated.body.reasons, actor(req)), 'Answer reasons saved');
});

export const abandon = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.abandonAttempt(req.validated.params.id, actor(req)), 'Attempt abandoned');
});
