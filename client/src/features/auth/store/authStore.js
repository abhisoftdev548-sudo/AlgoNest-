import { create } from 'zustand';
import { ROLES } from '@algonest/shared';

const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.CONTENT_MODERATOR,
  ROLES.CONTENT_EDITOR,
  ROLES.SUPPORT_ANALYST,
];

/**
 * Session UI state. The access token is deliberately NOT here (or in local
 * storage) — it lives in the apiClient module's memory only.
 */
export const useAuthStore = create((set) => ({
  user: null,
  status: 'loading', // 'loading' | 'authenticated' | 'guest'
  setSession: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
  clear: () => set({ user: null, status: 'guest' }),
}));

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsStaff = () => useAuthStore((state) => STAFF_ROLES.includes(state.user?.role));
export const useHasCompletedOnboarding = () =>
  useAuthStore((state) => Boolean(state.user?.onboardingCompleted && state.user?.goal));
