import { QueryClient } from '@tanstack/react-query';

/** Server-state defaults. Auth/session state stays in Zustand (not the cache). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Client errors never benefit from a retry; 5xx gets two attempts.
        if (error?.status && error.status < 500 && error.status !== 408) return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: 0 },
  },
});

export default queryClient;
