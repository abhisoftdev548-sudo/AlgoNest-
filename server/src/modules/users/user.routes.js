import { Router } from 'express';
import {
  onboardingSchema,
  paginationSchema,
  updateProfileSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './user.controller.js';

const router = Router();

// Every route in this module requires a valid access token.
router.use(authenticate);

// Self-service (student + staff).
router.get('/me', controller.getMe);
router.patch('/me', validate(updateProfileSchema), controller.updateMe);
router.patch('/me/goal', validate(onboardingSchema), controller.setGoal);

// Admin-only user management — demonstrates RBAC + paginated list pattern.
router.get('/', requirePermission(PERMISSIONS.USER_READ), validate({ query: paginationSchema }), controller.list);
router.patch(
  '/:id/role',
  requirePermission(PERMISSIONS.USER_MANAGE),
  validate({ params: userParamsSchema, body: updateUserRoleSchema }),
  controller.setRole,
);
router.patch(
  '/:id/status',
  requirePermission(PERMISSIONS.USER_MANAGE),
  validate({ params: userParamsSchema, body: updateUserStatusSchema }),
  controller.setStatus,
);

export default router;
