import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useAuthStore } from '../store/authStore.js';

/** Blocks unauthenticated users; optionally forces onboarding goal selection. */
export default function ProtectedRoute({ requireOnboarding = true }) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader />;
  if (status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (requireOnboarding && (!user?.onboardingCompleted || !user?.goal)) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}
