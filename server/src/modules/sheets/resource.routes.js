import { Router } from 'express';
import {
  personalResourceCreateSchema, personalResourceQuerySchema,
  personalResourceUpdateSchema, resourceParamsSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './progress.controller.js';

/** Mounted at /personal-resources — private per-user link library. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: personalResourceQuerySchema }), controller.listResources);
router.post('/', validate(personalResourceCreateSchema), controller.createResource);
router.patch(
  '/:id',
  validate({ params: resourceParamsSchema, body: personalResourceUpdateSchema }),
  controller.updateResource,
);
router.delete('/:id', validate({ params: resourceParamsSchema }), controller.deleteResource);

export default router;
