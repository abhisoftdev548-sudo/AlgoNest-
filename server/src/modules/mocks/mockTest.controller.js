import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './mockTest.service.js';
import * as attemptService from './mockAttempt.service.js';

const actor = (req) => actorFrom(req);

/* Catalogue */
export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listMocks(req.validated.query, actor(req)), 'Mock tests fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getMock(req.validated.params.id, actor(req)), 'Mock test fetched');
});

export const create = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createMock(req.validated.body, actor(req)), 'Draft mock created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateMock(req.validated.params.id, req.validated.body, actor(req)), 'Mock test updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveMock(req.validated.params.id, actor(req)), 'Mock test archived');
});

/* Lifecycle */
export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreMock(req.validated.params.id, actor(req)), 'Mock test restored to draft');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitForReview(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Submitted for review');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateMock(req.validated.params.id, decision, note, actor(req)), `Mock test ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishMock(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Mock test published');
});

export const versions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listVersions(req.validated.params.id, actor(req)), 'Versions fetched');
});

export const version = asyncHandler(async (req, res) => {
  const { id, version: number } = req.validated.params;
  sendSuccess(res, await service.getVersion(id, number, actor(req)), 'Version fetched');
});

/* Sections */
export const listSectionQuestions = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.validated.params;
  sendSuccess(res, await service.listSectionQuestions(id, sectionId, req.validated.query, actor(req)), 'Section questions fetched');
});

export const setSectionQuestions = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.validated.params;
  sendSuccess(res, await service.setSectionQuestions(id, sectionId, req.validated.body.questionIds, actor(req)), 'Section questions updated');
});

/* Attempts (list + start live under /mocks/:id/attempts) */
export const listAttempts = asyncHandler(async (req, res) => {
  sendSuccess(res, await attemptService.listAttempts(req.validated.params.id, req.validated.query, actor(req)), 'Attempts fetched');
});

export const startAttempt = asyncHandler(async (req, res) => {
  sendCreated(res, await attemptService.startAttempt(req.validated.params.id, actor(req)), 'Attempt started');
});
