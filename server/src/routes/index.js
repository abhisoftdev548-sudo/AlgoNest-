import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response.js';
import { requireDatabase } from '../middlewares/dbGuard.middleware.js';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import sheetRoutes from '../modules/sheets/sheet.routes.js';
import personalResourceRoutes from '../modules/sheets/resource.routes.js';
import questionRoutes from '../modules/quizzes/question.routes.js';
import quizRoutes from '../modules/quizzes/quiz.routes.js';
import attemptRoutes from '../modules/quizzes/attempt.routes.js';
import mockRoutes from '../modules/mocks/mockTest.routes.js';
import mockAttemptRoutes from '../modules/mocks/mockAttempt.routes.js';
import planRoutes from '../modules/plans/plan.routes.js';
import dashboardRoutes from '../modules/plans/dashboard.routes.js';
import resourceRoutes from '../modules/resources/resource.routes.js';
import creatorRoutes from '../modules/resources/creator.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';

const router = Router();

/**
 * Unauthenticated liveness probe only. It exposes no user data; every other
 * endpoint in this API requires a valid access token (or is an auth endpoint).
 */
router.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  sendSuccess(
    res,
    {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      database: states[mongoose.connection.readyState] ?? 'unknown',
      timestamp: new Date().toISOString(),
    },
    'OK',
  );
});

router.use('/auth', requireDatabase, authRoutes);
router.use('/users', requireDatabase, userRoutes);

// Phase 2 — DSA Sheets + per-user progress + private resources. All routes
// inside these routers call `authenticate` + `requireOnboarded` themselves.
router.use('/sheets', requireDatabase, sheetRoutes);
router.use('/personal-resources', requireDatabase, personalResourceRoutes);

// Phase 3 — Quizzes: reusable question bank, versioned quizzes and per-user
// attempts. All three routers apply authenticate + requireOnboarded internally.
router.use('/question-bank', requireDatabase, questionRoutes);
router.use('/quizzes', requireDatabase, quizRoutes);
router.use('/attempts', requireDatabase, attemptRoutes);

// Phase 4 — Mock tests: sectional/global timers, negative marking, palette,
// server-authoritative autosave and result analysis. Both routers apply
// authenticate + requireOnboarded internally.
router.use('/mocks', requireDatabase, mockRoutes);
router.use('/mock-attempts', requireDatabase, mockAttemptRoutes);

// Phase 5 — Adaptive plans + student dashboard. Both routers enforce
// authenticate + requireOnboarded and scope every query by the token's user id.
router.use('/plans', requireDatabase, planRoutes);
router.use('/dashboard', requireDatabase, dashboardRoutes);

// Phase 6 — Public moderated resource directory + creator profiles/analytics.
// Both routers enforce authenticate + requireOnboarded; moderation and link
// checks additionally require content:moderate.
router.use('/resources', requireDatabase, resourceRoutes);
router.use('/creators', requireDatabase, creatorRoutes);

// Phase 7 — unified, permission-checked admin dashboard, audit trail and flags.
router.use('/admin', requireDatabase, adminRoutes);

export default router;
