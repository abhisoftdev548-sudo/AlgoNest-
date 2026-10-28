import { Router } from 'express';
import {
  changelogSchema, mockAttemptListQuerySchema, mockAttemptStartSchema, mockCreateSchema,
  mockListQuerySchema, mockParamsSchema, mockQuestionListQuerySchema,
  mockSectionParamsSchema, mockSectionQuestionsSchema, mockUpdateSchema,
  moderationSchema, versionParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './mockTest.controller.js';

/** Mounted at /mocks. Every route is authenticated, onboarded and validated. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: mockListQuerySchema }), controller.list);
router.post('/', validate(mockCreateSchema), controller.create);

router.get('/:id', validate({ params: mockParamsSchema }), controller.get);
router.patch('/:id', validate({ params: mockParamsSchema, body: mockUpdateSchema }), controller.update);
router.delete('/:id', validate({ params: mockParamsSchema }), controller.archive);

router.post('/:id/restore', validate({ params: mockParamsSchema }), controller.restore);
router.post('/:id/revision', validate({ params: mockParamsSchema }), controller.revision);
router.post('/:id/submit', validate({ params: mockParamsSchema, body: changelogSchema }), controller.submit);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: mockParamsSchema, body: moderationSchema }),
  controller.moderate,
);
router.post('/:id/publish', validate({ params: mockParamsSchema, body: changelogSchema }), controller.publish);

router.get('/:id/versions', validate({ params: mockParamsSchema }), controller.versions);
router.get('/:id/versions/:version', validate({ params: versionParamsSchema }), controller.version);

router.get(
  '/:id/sections/:sectionId/questions',
  validate({ params: mockSectionParamsSchema, query: mockQuestionListQuerySchema }),
  controller.listSectionQuestions,
);
router.put(
  '/:id/sections/:sectionId/questions',
  validate({ params: mockSectionParamsSchema, body: mockSectionQuestionsSchema }),
  controller.setSectionQuestions,
);

router.get(
  '/:id/attempts',
  validate({ params: mockParamsSchema, query: mockAttemptListQuerySchema }),
  controller.listAttempts,
);
router.post(
  '/:id/attempts',
  validate({ params: mockParamsSchema, body: mockAttemptStartSchema }),
  controller.startAttempt,
);

export default router;
