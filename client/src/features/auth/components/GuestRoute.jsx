import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useAuthStore } from '../store/authStore.js';

/** Keeps signed-in users away from /login and /register. */
export default function GuestRoute() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader />;
  if (status === 'authenticated') {
    const destination = !user?.onboardingCompleted || !user?.goal ? '/onboarding' : '/app';
    return <Navigate to={destination} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
