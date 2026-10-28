import { Router } from 'express';
import {
  changelogSchema, moderationSchema, resourceCreateSchema, resourceDuplicateQuerySchema,
  resourceEventSchema, resourceFeedbackSchema, resourceLinkCheckQuerySchema,
  resourceListQuerySchema, resourceParamsSchema, resourceRatingSchema,
  resourceRatingsQuerySchema, resourceReportItemParamsSchema,
  resourceReportListQuerySchema, resourceReportResolveSchema, resourceReportSchema,
  resourceSavedQuerySchema, resourceUpdateSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as resource from './resource.controller.js';
import * as interaction from './interaction.controller.js';

/**
 * Mounted at /resources. Every route is authenticated, onboarded and
 * Zod-validated. Static paths are registered BEFORE /:id so Express never
 * mistakes "saved" or "reports" for a Mongo id.
 */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: resourceListQuerySchema }), resource.list);
router.post('/', validate(resourceCreateSchema), resource.create);

/* Static staff/catalogue paths */
router.get('/check-duplicate', validate({ query: resourceDuplicateQuerySchema }), resource.duplicate);
router.get('/saved', validate({ query: resourceSavedQuerySchema }), interaction.savedCatalogue);
router.get(
  '/reports',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ query: resourceReportListQuerySchema }),
  interaction.reports,
);
router.patch(
  '/reports/:reportId',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: resourceReportItemParamsSchema, body: resourceReportResolveSchema }),
  interaction.resolveReport,
);
router.post(
  '/link-check/run',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ query: resourceLinkCheckQuerySchema }),
  resource.runLinkCheckBatch,
);

/* Resource instance */
router.get('/:id', validate({ params: resourceParamsSchema }), resource.get);
router.patch('/:id', validate({ params: resourceParamsSchema, body: resourceUpdateSchema }), resource.update);
router.delete('/:id', validate({ params: resourceParamsSchema }), resource.archive);

router.post('/:id/submit', validate({ params: resourceParamsSchema }), resource.submit);
router.post('/:id/revision', validate({ params: resourceParamsSchema }), resource.revision);
router.post('/:id/restore', validate({ params: resourceParamsSchema }), resource.restore);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: resourceParamsSchema, body: moderationSchema }),
  resource.moderate,
);
router.post('/:id/publish', validate({ params: resourceParamsSchema, body: changelogSchema }), resource.publish);
router.post(
  '/:id/check-link',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: resourceParamsSchema }),
  resource.checkLink,
);

/* Per-user interactions */
router.put('/:id/save', validate({ params: resourceParamsSchema }), interaction.save);
router.delete('/:id/save', validate({ params: resourceParamsSchema }), interaction.save);
router.put('/:id/rating', validate({ params: resourceParamsSchema, body: resourceRatingSchema }), interaction.rate);
router.get('/:id/ratings', validate({ params: resourceParamsSchema, query: resourceRatingsQuerySchema }), interaction.ratings);
router.put('/:id/feedback', validate({ params: resourceParamsSchema, body: resourceFeedbackSchema }), interaction.feedback);
router.post('/:id/report', validate({ params: resourceParamsSchema, body: resourceReportSchema }), interaction.report);
router.post('/:id/events', validate({ params: resourceParamsSchema, body: resourceEventSchema }), interaction.event);

export default router;
