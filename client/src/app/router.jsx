import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthGate from '../features/auth/components/AuthGate.jsx';
import GuestRoute from '../features/auth/components/GuestRoute.jsx';
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import { FullPageLoader } from '../components/ui/Spinner.jsx';

/**
 * React Bits + gsap + motion are polish-only dependencies. Lazy-loading feature
 * pages keeps them out of the entry chunk, so /app screens stay fast even before
 * a visitor ever opens the animated landing page.
 */
const LandingPage = lazy(() => import('../features/landing/pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage.jsx'));
const OnboardingPage = lazy(() => import('../features/auth/pages/OnboardingPage.jsx'));
const HomePage = lazy(() => import('../features/home/pages/HomePage.jsx'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage.jsx'));
const ModulePage = lazy(() => import('../pages/ModulePage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

// Phase 2 — DSA Sheets. Loaded only when the sheets routes are visited.
const SheetsPage = lazy(() => import('../features/sheets/pages/SheetsPage.jsx'));
const SheetDetailPage = lazy(() => import('../features/sheets/pages/SheetDetailPage.jsx'));
const SheetEditorPage = lazy(() => import('../features/sheets/pages/SheetEditorPage.jsx'));

// Phase 3 — Quizzes. The solver/result pages are separate chunks so the quiz
// engine (timer + palette) is never downloaded for the catalogue.
const QuizzesPage = lazy(() => import('../features/quizzes/pages/QuizzesPage.jsx'));
const QuizDetailPage = lazy(() => import('../features/quizzes/pages/QuizDetailPage.jsx'));
const QuizEditorPage = lazy(() => import('../features/quizzes/pages/QuizEditorPage.jsx'));
const QuizSolverPage = lazy(() => import('../features/quizzes/pages/QuizSolverPage.jsx'));
const QuizResultPage = lazy(() => import('../features/quizzes/pages/QuizResultPage.jsx'));

// Phase 4 — Mock tests. The engine and analysis are separate chunks so the
// catalogue never downloads the timer/palette/result code.
const MocksPage = lazy(() => import('../features/mocks/pages/MocksPage.jsx'));
const MockDetailPage = lazy(() => import('../features/mocks/pages/MockDetailPage.jsx'));
const MockEditorPage = lazy(() => import('../features/mocks/pages/MockEditorPage.jsx'));
const MockSolverPage = lazy(() => import('../features/mocks/pages/MockSolverPage.jsx'));
const MockResultPage = lazy(() => import('../features/mocks/pages/MockResultPage.jsx'));

// Phase 5 — Adaptive plans. The wizard is a separate chunk so the dashboard
// and catalogue never download its form logic.
const PlansPage = lazy(() => import('../features/plans/pages/PlansPage.jsx'));
const PlanDetailPage = lazy(() => import('../features/plans/pages/PlanDetailPage.jsx'));
const PlanEditorPage = lazy(() => import('../features/plans/pages/PlanEditorPage.jsx'));

// Phase 6 — Resource directory + creator profiles. The submission form and
// analytics are separate chunks so the catalogue stays small.
const ResourcesPage = lazy(() => import('../features/resources/pages/ResourcesPage.jsx'));
const ResourceDetailPage = lazy(() => import('../features/resources/pages/ResourceDetailPage.jsx'));
const ResourceEditorPage = lazy(() => import('../features/resources/pages/ResourceEditorPage.jsx'));
const CreatorsPage = lazy(() => import('../features/resources/pages/CreatorsPage.jsx'));
const CreatorPage = lazy(() => import('../features/resources/pages/CreatorPage.jsx'));

// Phase 7 — permission-scoped operational dashboard.
const AdminPage = lazy(() => import('../features/admin/pages/AdminPage.jsx'));

// Community keeps its honest placeholder until its phase lands.
const UPCOMING_MODULES = ['community'];

export default function AppRouter() {
  return (
    <AuthGate>
      <Suspense fallback={<FullPageLoader label="Loading AlgoNest…" />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Guests only */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated, onboarding optional (this IS the onboarding route) */}
          <Route element={<ProtectedRoute requireOnboarding={false} />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Authenticated + onboarded app shell */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<HomePage />} />

              {/* Static segments are ranked above /:id by React Router. */}
              <Route path="sheets" element={<SheetsPage />} />
              <Route path="sheets/new" element={<SheetEditorPage />} />
              <Route path="sheets/:id" element={<SheetDetailPage />} />
              <Route path="sheets/:id/edit" element={<SheetEditorPage />} />

              {/* Static segments are ranked above /:id by React Router. */}
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="quizzes/new" element={<QuizEditorPage />} />
              <Route path="quizzes/:id" element={<QuizDetailPage />} />
              <Route path="quizzes/:id/edit" element={<QuizEditorPage />} />
              <Route path="quizzes/:id/attempts/:attemptId" element={<QuizSolverPage />} />
              <Route path="quizzes/:id/results/:attemptId" element={<QuizResultPage />} />

              <Route path="mocks" element={<MocksPage />} />
              <Route path="mocks/new" element={<MockEditorPage />} />
              <Route path="mocks/:id" element={<MockDetailPage />} />
              <Route path="mocks/:id/edit" element={<MockEditorPage />} />
              <Route path="mocks/:id/attempts/:attemptId" element={<MockSolverPage />} />
              <Route path="mocks/:id/results/:attemptId" element={<MockResultPage />} />

              <Route path="plans" element={<PlansPage />} />
              <Route path="plans/new" element={<PlanEditorPage />} />
              <Route path="plans/:id" element={<PlanDetailPage />} />
              <Route path="plans/:id/edit" element={<PlanEditorPage />} />

              <Route path="resources" element={<ResourcesPage />} />
              <Route path="resources/new" element={<ResourceEditorPage />} />
              <Route path="resources/:id" element={<ResourceDetailPage />} />
              <Route path="resources/:id/edit" element={<ResourceEditorPage />} />
              <Route path="creators" element={<CreatorsPage />} />
              <Route path="creators/me" element={<CreatorPage />} />
              <Route path="creators/:id" element={<CreatorPage />} />

              {UPCOMING_MODULES.map((module) => (
                <Route key={module} path={module} element={<ModulePage />} />
              ))}
              <Route path="admin" element={<AdminPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthGate>
  );
}
