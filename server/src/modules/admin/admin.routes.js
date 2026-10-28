import { Router } from 'express';
import {
  adminAuditQuerySchema, adminCreatorVerificationSchema, adminModerateSchema, adminModerationQuerySchema,
  adminReportParamsSchema, adminReportResolveSchema, adminReportsQuerySchema,
  adminTargetParamsSchema, adminUsersQuerySchema, featureFlagParamsSchema,
  featureFlagUpdateSchema, featureFlagsQuerySchema, updateUserRoleSchema,
  updateUserStatusSchema, userParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import ApiError from '../../utils/ApiError.js';
import * as controller from './admin.controller.js';

const router = Router();
router.use(authenticate, requireOnboarded);

function requireAnyPermission(...permissions) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    const granted = req.auth?.permissions ?? [];
    return permissions.some((permission) => granted.includes(permission)) ? next() : next(ApiError.forbidden());
  };
}

router.get('/overview', requireAnyPermission(PERMISSIONS.ANALYTICS_READ, PERMISSIONS.USER_READ, PERMISSIONS.CONTENT_MODERATE), controller.overview);
router.get('/moderation', requirePermission(PERMISSIONS.CONTENT_MODERATE), validate({ query: adminModerationQuerySchema }), controller.moderationQueue);
router.post('/moderation/:type/:id', requirePermission(PERMISSIONS.CONTENT_MODERATE), validate({ params: adminTargetParamsSchema, body: adminModerateSchema }), controller.moderate);

router.get('/users', requirePermission(PERMISSIONS.USER_READ), validate({ query: adminUsersQuerySchema }), controller.users);
router.patch('/users/:id/role', requirePermission(PERMISSIONS.USER_MANAGE), validate({ params: userParamsSchema, body: updateUserRoleSchema }), controller.setRole);
router.patch('/users/:id/status', requirePermission(PERMISSIONS.USER_MANAGE), validate({ params: userParamsSchema, body: updateUserStatusSchema }), controller.setStatus);
router.patch('/users/:id/creator-verification', requirePermission(PERMISSIONS.USER_MANAGE), validate({ params: userParamsSchema, body: adminCreatorVerificationSchema }), controller.verifyCreator);

router.get('/reports', requirePermission(PERMISSIONS.CONTENT_MODERATE), validate({ query: adminReportsQuerySchema }), controller.reports);
router.patch('/reports/:type/:id', requirePermission(PERMISSIONS.CONTENT_MODERATE), validate({ params: adminReportParamsSchema, body: adminReportResolveSchema }), controller.resolveReport);
router.get('/audit-logs', requirePermission(PERMISSIONS.AUDIT_READ), validate({ query: adminAuditQuerySchema }), controller.audit);
router.get('/feature-flags', requirePermission(PERMISSIONS.USER_MANAGE), validate({ query: featureFlagsQuerySchema }), controller.flags);
router.put('/feature-flags/:key', requirePermission(PERMISSIONS.USER_MANAGE), validate({ params: featureFlagParamsSchema, body: featureFlagUpdateSchema }), controller.updateFlag);

export default router;
