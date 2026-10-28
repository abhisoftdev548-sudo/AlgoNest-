import { Router } from 'express';
import {
  questionImportSchema, questionInputSchema, questionListQuerySchema, questionParamsSchema,
} from '@algonest/shared';
import { authenticate, requireOnboarded } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './question.controller.js';

/** Mounted at /question-bank — reusable, author-scoped question library. */
const router = Router();
router.use(authenticate, requireOnboarded);

router.get('/', validate({ query: questionListQuerySchema }), controller.list);
router.post('/', validate(questionInputSchema), controller.create);
router.post('/parse-import', validate(questionImportSchema), controller.parseImport);
router.get('/:id', validate({ params: questionParamsSchema }), controller.get);
router.patch('/:id', validate({ params: questionParamsSchema, body: questionInputSchema }), controller.update);
router.delete('/:id', validate({ params: questionParamsSchema }), controller.remove);

export default router;
