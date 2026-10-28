import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './attempt.service.js';

const actor = (req) => actorFrom(req);

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttempt(req.validated.params.id, actor(req)), 'Attempt fetched');
});

export const questions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getAttemptQuestions(req.validated.params.id, req.validated.query, actor(req)), 'Questions fetched');
});

export const autosave = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.autosaveAttempt(req.validated.params.id, req.validated.body.answers, actor(req)), 'Answers saved');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitAttempt(req.validated.params.id, req.validated.body.answers, actor(req)), 'Attempt submitted');
});

export const result = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getResult(req.validated.params.id, actor(req)), 'Result fetched');
});

export const abandon = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.abandonAttempt(req.validated.params.id, actor(req)), 'Attempt abandoned');
});
