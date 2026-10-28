import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './question.service.js';

const actor = (req) => actorFrom(req);

export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listQuestions(req.validated.query, actor(req)), 'Questions fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getQuestion(req.validated.params.id, actor(req)), 'Question fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createQuestion(req.validated.body, actor(req)), 'Question created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateQuestion(req.validated.params.id, req.validated.body, actor(req)), 'Question updated');
});

export const remove = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.deleteQuestion(req.validated.params.id, actor(req)), 'Question deleted');
});

/** Pure preview — no DB write, so untrusted pasted text is harmless here. */
export const parseImport = asyncHandler(async (req, res) => {
  const { format, text } = req.validated.body;
  sendSuccess(res, service.parseImport(format, text), 'Import preview ready');
});
