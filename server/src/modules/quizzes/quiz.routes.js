import { Router } from 'express';
import {
  attemptListQuerySchema, attemptStartSchema, changelogSchema, moderationSchema,
  quizCreateSchema, quizImportSchema, quizListQuerySchema, quizParamsSchema,
  quizQuestionListQuerySchema, quizQuestionParamsSchema, quizQuestionsSchema,
  quizReorderSchema, quizUpdateSchema, versionParamsSchema,
} from '@algonest/shared';
import { PERMISSIONS } from '@algonest/shared/constants';
import { authenticate, requireOnboarded, requirePermission } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './quiz.controller.js';

/** Mounted at /quizzes. Every route is authenticated, onboarded and validated. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: quizListQuerySchema }), controller.list);
router.post('/', validate(quizCreateSchema), controller.create);

router.get('/:id', validate({ params: quizParamsSchema }), controller.get);
router.patch('/:id', validate({ params: quizParamsSchema, body: quizUpdateSchema }), controller.update);
router.delete('/:id', validate({ params: quizParamsSchema }), controller.archive);

router.post('/:id/restore', validate({ params: quizParamsSchema }), controller.restore);
router.post('/:id/revision', validate({ params: quizParamsSchema }), controller.revision);
router.post('/:id/submit', validate({ params: quizParamsSchema, body: changelogSchema }), controller.submit);
router.post(
  '/:id/moderate',
  requirePermission(PERMISSIONS.CONTENT_MODERATE),
  validate({ params: quizParamsSchema, body: moderationSchema }),
  controller.moderate,
);
router.post('/:id/publish', validate({ params: quizParamsSchema, body: changelogSchema }), controller.publish);

router.get('/:id/versions', validate({ params: quizParamsSchema }), controller.versions);
router.get('/:id/versions/:version', validate({ params: versionParamsSchema }), controller.version);

// Static sub-paths (`/import`, `/order`) precede the `/:questionId` route.
router.get('/:id/questions', validate({ params: quizParamsSchema, query: quizQuestionListQuerySchema }), controller.listQuestions);
router.post('/:id/questions', validate({ params: quizParamsSchema, body: quizQuestionsSchema }), controller.linkQuestions);
router.post('/:id/questions/import', validate({ params: quizParamsSchema, body: quizImportSchema }), controller.importQuestions);
router.patch('/:id/questions/order', validate({ params: quizParamsSchema, body: quizReorderSchema }), controller.reorderQuestions);
router.delete('/:id/questions/:questionId', validate({ params: quizQuestionParamsSchema }), controller.unlinkQuestion);

router.get('/:id/attempts', validate({ params: quizParamsSchema, query: attemptListQuerySchema }), controller.listAttempts);
router.post('/:id/attempts', validate({ params: quizParamsSchema, body: attemptStartSchema }), controller.startAttempt);

export default router;
