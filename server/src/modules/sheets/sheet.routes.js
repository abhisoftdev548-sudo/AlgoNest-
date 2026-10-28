import { Router } from 'express';
import {
  addProblemsSchema, changelogSchema, importProblemsSchema, moderationSchema,
  parseLinksSchema, problemParamsSchema, problemUpdateSchema, progressQuerySchema,
  progressUpdateSchema, ratingSchema, ratingsQuerySchema, reorderProblemsSchema,
  reportParamsSchema, reportSchema, reportsQuerySchema, resolveReportSchema,
  sheetCreateSchema, sheetListQuerySchema, sheetParamsSchema, sheetUpdateSchema,
  versionParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as sheet from './sheet.controller.js';
import * as progress from './progress.controller.js';

const router = Router();

/**
 * Every sheet endpoint requires a valid access token AND completed onboarding.
 * Privileged transitions additionally require CONTENT_MODERATE; the service
 * re-checks ownership/role so a route change can never bypass RBAC.
 */
router.use(authenticate, requireOnboarded);

// ── Static paths MUST come before /:id (otherwise "reports" is parsed as an id).
router.get('/', validate({ query: sheetListQuerySchema }), sheet.list);
router.post('/', validate(sheetCreateSchema), sheet.create);
router.post('/parse-links', validate(parseLinksSchema), sheet.parseLinks);

router.get(
  '/reports',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ query: reportsQuerySchema }),
  sheet.reports,
);
router.patch(
  '/reports/:reportId',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: reportParamsSchema, body: resolveReportSchema }),
  sheet.resolveReport,
);

// ── Sheet-level routes.
router.get('/:id', validate({ params: sheetParamsSchema }), sheet.get);
router.patch('/:id', validate({ params: sheetParamsSchema, body: sheetUpdateSchema }), sheet.update);
router.delete('/:id', validate({ params: sheetParamsSchema }), sheet.archive);

router.post('/:id/restore', validate({ params: sheetParamsSchema }), sheet.restore);
router.post('/:id/revision', validate({ params: sheetParamsSchema }), sheet.revision);
router.post('/:id/submit', validate({ params: sheetParamsSchema, body: changelogSchema }), sheet.submit);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: sheetParamsSchema, body: moderationSchema }),
  sheet.moderate,
);
router.post('/:id/publish', validate({ params: sheetParamsSchema, body: changelogSchema }), sheet.publish);
router.post('/:id/clone', validate({ params: sheetParamsSchema }), sheet.clone);

router.get('/:id/versions', validate({ params: sheetParamsSchema }), sheet.versions);
router.get('/:id/versions/:version', validate({ params: versionParamsSchema }), sheet.version);

// ── Problem sub-routes. `/order` and `/import` precede `/:problemId`.
router.post('/:id/problems', validate({ params: sheetParamsSchema, body: addProblemsSchema }), sheet.addProblems);
router.post('/:id/problems/import', validate({ params: sheetParamsSchema, body: importProblemsSchema }), sheet.importProblems);
router.patch('/:id/problems/order', validate({ params: sheetParamsSchema, body: reorderProblemsSchema }), sheet.reorderProblems);
router.patch(
  '/:id/problems/:problemId',
  validate({ params: problemParamsSchema, body: problemUpdateSchema }),
  sheet.updateProblem,
);
router.delete(
  '/:id/problems/:problemId',
  validate({ params: problemParamsSchema }),
  sheet.removeProblem,
);

// ── Ratings, reviews and reports.
router.get('/:id/ratings', validate({ params: sheetParamsSchema, query: ratingsQuerySchema }), sheet.ratings);
router.put('/:id/rating', validate({ params: sheetParamsSchema, body: ratingSchema }), sheet.rate);
router.delete('/:id/rating', validate({ params: sheetParamsSchema }), sheet.unrate);
router.post('/:id/report', validate({ params: sheetParamsSchema, body: reportSchema }), sheet.report);

// ── Per-user progress (never writes to the shared Sheet).
router.get('/:id/progress', validate({ params: sheetParamsSchema, query: progressQuerySchema }), progress.getProgress);
router.put(
  '/:id/progress/:problemId',
  validate({ params: problemParamsSchema, body: progressUpdateSchema }),
  progress.upsertProgress,
);

export default router;
