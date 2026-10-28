import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import dashboardApi from '../api/dashboardApi.js';

/** Refetch on window focus so a returning learner immediately sees today. */
export function useDashboard(params = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.get(params),
    queryFn: () => dashboardApi.get(params),
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });
}

export default useDashboard;
