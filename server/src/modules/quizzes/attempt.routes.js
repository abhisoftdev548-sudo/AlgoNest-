import { Router } from 'express';
import {
  attemptParamsSchema, attemptQuestionQuerySchema, autosaveSchema, submitAttemptSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './attempt.controller.js';

/** Mounted at /attempts — private per-user attempt state and results. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/:id', validate({ params: attemptParamsSchema }), controller.get);
router.get(
  '/:id/questions',
  validate({ params: attemptParamsSchema, query: attemptQuestionQuerySchema }),
  controller.questions,
);
router.patch('/:id/answers', validate({ params: attemptParamsSchema, body: autosaveSchema }), controller.autosave);
router.post('/:id/submit', validate({ params: attemptParamsSchema, body: submitAttemptSchema }), controller.submit);
router.get('/:id/result', validate({ params: attemptParamsSchema }), controller.result);
router.post('/:id/abandon', validate({ params: attemptParamsSchema }), controller.abandon);

export default router;
