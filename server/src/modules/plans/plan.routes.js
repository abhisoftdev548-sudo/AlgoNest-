import { Router } from 'express';
import {
  planCreateSchema, planListQuerySchema, planParamsSchema, planTaskParamsSchema,
  planUpdateSchema, rescheduleSchema, taskListQuerySchema, taskReorderSchema,
  taskStatusSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './plan.controller.js';

/** Mounted at /plans. Strictly per-user: no staff cross-read is exposed. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: planListQuerySchema }), controller.list);
router.post('/', validate(planCreateSchema), controller.create);
// Static paths must be registered before /:id.
router.get('/active', controller.active);
router.get('/content', controller.content);

router.get('/:id', validate({ params: planParamsSchema }), controller.get);
router.patch('/:id', validate({ params: planParamsSchema, body: planUpdateSchema }), controller.update);
router.delete('/:id', validate({ params: planParamsSchema }), controller.archive);
router.post('/:id/regenerate', validate({ params: planParamsSchema }), controller.regenerate);
router.post('/:id/reschedule', validate({ params: planParamsSchema, body: rescheduleSchema }), controller.reschedule);

router.get('/:id/tasks', validate({ params: planParamsSchema, query: taskListQuerySchema }), controller.tasks);
router.put('/:id/tasks/order', validate({ params: planParamsSchema, body: taskReorderSchema }), controller.taskOrder);
router.patch('/:id/tasks/:taskId', validate({ params: planTaskParamsSchema, body: taskStatusSchema }), controller.taskStatus);

export default router;
