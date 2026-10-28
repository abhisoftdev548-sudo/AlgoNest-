import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAccessToken } from '../../../lib/apiClient.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import authApi from '../api/authApi.js';
import { useAuthStore } from '../store/authStore.js';

/** Everything session-related in one hook; components never touch the store directly. */
export function useAuth() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  const applySession = useCallback(
    (data) => {
      setAccessToken(data.accessToken);
      setSession(data.user);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      return data;
    },
    [queryClient, setSession],
  );

  const login = useMutation({ mutationFn: authApi.login, onSuccess: applySession });
  const register = useMutation({ mutationFn: authApi.register, onSuccess: applySession });

  const updateGoal = useMutation({
    mutationFn: authApi.updateGoal,
    onSuccess: ({ user: updated }) => {
      setUser(updated);
      queryClient.setQueryData(queryKeys.auth.me, updated);
    },
  });

  const updateProfile = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ user: updated }) => {
      setUser(updated);
      queryClient.setQueryData(queryKeys.auth.me, updated);
    },
  });

  // `onSettled` means the local session is cleared even if the network is down.
  const clearLocalSession = useCallback(() => {
    setAccessToken(null);
    clear();
    authApi.resetBootstrap();
    queryClient.clear();
  }, [clear, queryClient]);

  const logout = useMutation({ mutationFn: authApi.logout, onSettled: clearLocalSession });
  const logoutAll = useMutation({ mutationFn: authApi.logoutAll, onSettled: clearLocalSession });

  return { user, status, login, register, updateGoal, updateProfile, logout, logoutAll };
}

export default useAuth;
