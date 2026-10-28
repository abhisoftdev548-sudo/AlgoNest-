import { useEffect, useState } from 'react';
import { setUnauthorizedHandler } from '../../../lib/apiClient.js';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import { useThemeStore } from '../../../store/themeStore.js';
import authApi from '../api/authApi.js';
import { useAuthStore } from '../store/authStore.js';

/**
 * Bootstraps the session from the httpOnly refresh cookie before rendering any
 * route, and wires the apiClient's "session lost" callback to the auth store.
 */
export default function AuthGate({ children }) {
  const [ready, setReady] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    let alive = true;
    authApi
      .bootstrap()
      .then((data) => {
        if (alive) setSession(data.user);
      })
      .catch(() => {
        if (alive) clear();
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [setSession, clear]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clear();
    });
    return () => setUnauthorizedHandler(null);
  }, [clear]);

  useEffect(() => {
    useThemeStore.getState().apply();
  }, []);

  if (!ready) return <FullPageLoader />;
  return children;
}
