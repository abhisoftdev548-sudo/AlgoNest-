import { Router } from 'express';
import {
  mockAttemptParamsSchema, mockAutosaveSchema, mockHeartbeatSchema,
  mockQuestionListQuerySchema, mockReasonSchema, mockSectionParamsSchema,
  mockSubmitSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './mockAttempt.controller.js';

/** Mounted at /mock-attempts — private per-user attempt state and results. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/:id', validate({ params: mockAttemptParamsSchema }), controller.get);
router.get(
  '/:id/questions',
  validate({ params: mockAttemptParamsSchema, query: mockQuestionListQuerySchema }),
  controller.questions,
);
router.patch('/:id/answers', validate({ params: mockAttemptParamsSchema, body: mockAutosaveSchema }), controller.autosave);
router.post('/:id/heartbeat', validate({ params: mockAttemptParamsSchema, body: mockHeartbeatSchema }), controller.heartbeat);
router.post(
  '/:id/sections/:sectionId/submit',
  validate({ params: mockSectionParamsSchema, body: mockSubmitSchema }),
  controller.submitSection,
);
router.post('/:id/submit', validate({ params: mockAttemptParamsSchema, body: mockSubmitSchema }), controller.submit);
router.get('/:id/result', validate({ params: mockAttemptParamsSchema }), controller.result);
router.put('/:id/reasons', validate({ params: mockAttemptParamsSchema, body: mockReasonSchema }), controller.reasons);
router.post('/:id/abandon', validate({ params: mockAttemptParamsSchema }), controller.abandon);

export default router;
