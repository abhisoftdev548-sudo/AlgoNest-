import { Router } from 'express';
import { loginSchema, registerSchema } from '@algonest/shared';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authLimiter, refreshLimiter } from '../../middlewares/security.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './auth.controller.js';

const router = Router();

// Public, but rate limited and Zod-validated.
router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', refreshLimiter, controller.refresh);
router.post('/logout', controller.logout);

// Authenticated.
router.post('/logout-all', authenticate, controller.logoutAll);
router.get('/me', authenticate, controller.me);

export default router;
