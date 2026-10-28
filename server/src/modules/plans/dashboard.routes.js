import { Router } from 'express';
import { dashboardQuerySchema } from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './dashboard.controller.js';

/** Mounted at /dashboard — one aggregated, strictly per-user read. */
const router = Router();
router.use(authenticate, requireOnboarded);
router.get('/', validate({ query: dashboardQuerySchema }), controller.get);

export default router;
