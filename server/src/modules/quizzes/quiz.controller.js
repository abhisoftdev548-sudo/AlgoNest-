import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './quiz.service.js';
import * as attemptService from './attempt.service.js';

const actor = (req) => actorFrom(req);

/* Catalogue */
export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listQuizzes(req.validated.query, actor(req)), 'Quizzes fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getQuiz(req.validated.params.id, actor(req)), 'Quiz fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createQuiz(req.validated.body, actor(req)), 'Draft quiz created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateQuiz(req.validated.params.id, req.validated.body, actor(req)), 'Quiz updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveQuiz(req.validated.params.id, actor(req)), 'Quiz archived');
});

/* Lifecycle */
export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreQuiz(req.validated.params.id, actor(req)), 'Quiz restored to draft');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitForReview(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Submitted for review');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateQuiz(req.validated.params.id, decision, note, actor(req)), `Quiz ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishQuiz(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Quiz published');
});

export const versions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listVersions(req.validated.params.id, actor(req)), 'Versions fetched');
});

export const version = asyncHandler(async (req, res) => {
  const { id, version: number } = req.validated.params;
  sendSuccess(res, await service.getVersion(id, number, actor(req)), 'Version fetched');
});

/* Questions */
export const listQuestions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listQuizQuestions(req.validated.params.id, req.validated.query, actor(req)), 'Quiz questions fetched');
});

export const linkQuestions = asyncHandler(async (req, res) => {
  sendCreated(res, await service.linkQuestions(req.validated.params.id, req.validated.body.questionIds, actor(req)), 'Questions linked');
});

export const importQuestions = asyncHandler(async (req, res) => {
  const { items, source } = req.validated.body;
  sendCreated(res, await service.importQuestions(req.validated.params.id, items, source, actor(req)), 'Questions imported');
});

export const reorderQuestions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.reorderQuestions(req.validated.params.id, req.validated.body.orderedIds, actor(req)), 'Questions reordered');
});

export const unlinkQuestion = asyncHandler(async (req, res) => {
  const { id, questionId } = req.validated.params;
  sendSuccess(res, await service.unlinkQuestion(id, questionId, actor(req)), 'Question removed');
});

/* Attempts — list + start live under /quizzes/:id/attempts */
export const listAttempts = asyncHandler(async (req, res) => {
  sendSuccess(res, await attemptService.listAttempts(req.validated.params.id, req.validated.query, actor(req)), 'Attempts fetched');
});

export const startAttempt = asyncHandler(async (req, res) => {
  sendCreated(res, await attemptService.startAttempt(req.validated.params.id, req.validated.body, actor(req)), 'Attempt started');
});
