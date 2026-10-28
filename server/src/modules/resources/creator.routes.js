import { Router } from 'express';
import {
  creatorAnalyticsQuerySchema, creatorGetQuerySchema, creatorListQuerySchema,
  creatorParamsSchema, creatorProfileSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './creator.controller.js';

/** Mounted at /creators. `me` paths must precede /:id. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: creatorListQuerySchema }), controller.list);
router.get('/me', controller.myProfile);
router.put('/me', validate(creatorProfileSchema), controller.updateProfile);
router.get('/me/analytics', validate({ query: creatorAnalyticsQuerySchema }), controller.myAnalytics);

router.get('/:id', validate({ params: creatorParamsSchema, query: creatorGetQuerySchema }), controller.get);
router.get('/:id/analytics', validate({ params: creatorParamsSchema, query: creatorAnalyticsQuerySchema }), controller.analytics);

export default router;
