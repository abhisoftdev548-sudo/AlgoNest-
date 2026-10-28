import asyncHandler from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/response.js';
import { actorFrom } from './actor.js';
import * as service from './sheet.service.js';

const actor = (req) => actorFrom(req);

/* Catalogue */
export const list = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listSheets(req.validated.query, actor(req)), 'Sheets fetched');
});

export const get = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getSheet(req.validated.params.id, actor(req)), 'Sheet fetched');
});

export const create = asyncHandler(async (req, res) => {
  const sheet = await service.createSheet(req.validated.body, actor(req));
  sendCreated(res, { sheet }, 'Draft sheet created');
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.updateSheet(req.validated.params.id, req.validated.body, actor(req)), 'Sheet updated');
});

export const archive = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.archiveSheet(req.validated.params.id, actor(req)), 'Sheet archived');
});

export const restore = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.restoreSheet(req.validated.params.id, actor(req)), 'Sheet restored to draft');
});

export const revision = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.startRevision(req.validated.params.id, actor(req)), 'New draft revision started');
});

/* Lifecycle */
export const submit = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.submitForReview(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Submitted for review');
});

export const moderate = asyncHandler(async (req, res) => {
  const { decision, note } = req.validated.body;
  sendSuccess(res, await service.moderateSheet(req.validated.params.id, decision, note, actor(req)), `Sheet ${decision}d`);
});

export const publish = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.publishSheet(req.validated.params.id, req.validated.body.changelog, actor(req)), 'Sheet published');
});

export const versions = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listVersions(req.validated.params.id, actor(req)), 'Versions fetched');
});

export const version = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getVersion(req.validated.params.id, req.validated.params.version, actor(req)), 'Version fetched');
});

/* Problems */
export const addProblems = asyncHandler(async (req, res) => {
  sendCreated(res, await service.addProblems(req.validated.params.id, req.validated.body.problems, actor(req)), 'Problems added');
});

export const importProblems = asyncHandler(async (req, res) => {
  sendCreated(res, await service.addProblems(req.validated.params.id, req.validated.body.items, actor(req)), 'Problems imported');
});

export const parseLinks = asyncHandler(async (req, res) => {
  sendSuccess(res, service.parseLinks(req.validated.body.text), 'Links parsed');
});

export const updateProblem = asyncHandler(async (req, res) => {
  const { id, problemId } = req.validated.params;
  sendSuccess(res, await service.updateProblem(id, problemId, req.validated.body, actor(req)), 'Problem updated');
});

export const removeProblem = asyncHandler(async (req, res) => {
  const { id, problemId } = req.validated.params;
  sendSuccess(res, await service.removeProblem(id, problemId, actor(req)), 'Problem removed');
});

export const reorderProblems = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.reorderProblems(req.validated.params.id, req.validated.body.orderedIds, actor(req)), 'Problems reordered');
});

export const clone = asyncHandler(async (req, res) => {
  sendCreated(res, await service.cloneSheet(req.validated.params.id, actor(req)), 'Sheet cloned to your drafts');
});

/* Ratings & reviews */
export const ratings = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  sendSuccess(res, await service.listRatings(id, req.validated.query, actor(req)), 'Reviews fetched');
});

export const rate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.upsertRating(req.validated.params.id, req.validated.body, actor(req)), 'Rating saved');
});

export const unrate = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.removeRating(req.validated.params.id, actor(req)), 'Rating removed');
});

/* Reports */
export const report = asyncHandler(async (req, res) => {
  sendCreated(res, await service.createReport(req.validated.params.id, req.validated.body, actor(req)), 'Report submitted');
});

export const reports = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.listReports(req.validated.query, actor(req)), 'Reports fetched');
});

export const resolveReport = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.resolveReport(req.validated.params.reportId, req.validated.body, actor(req)), 'Report updated');
});
