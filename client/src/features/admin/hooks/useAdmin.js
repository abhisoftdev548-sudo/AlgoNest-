import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminApi from '../api/adminApi.js';

export const adminKeys = {
  all: ['admin'], overview: ['admin', 'overview'],
  moderation: (params) => ['admin', 'moderation', params],
  users: (params) => ['admin', 'users', params],
  reports: (params) => ['admin', 'reports', params],
  audit: (params) => ['admin', 'audit', params], flags: (params) => ['admin', 'flags', params],
};
const useRefreshAdmin = () => {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: adminKeys.all });
};
export const useAdminOverview = () => useQuery({ queryKey: adminKeys.overview, queryFn: adminApi.overview, staleTime: 60_000 });
export const useAdminModeration = (params) => useQuery({ queryKey: adminKeys.moderation(params), queryFn: () => adminApi.moderation(params), placeholderData: keepPreviousData });
export const useAdminUsers = (params, enabled = true) => useQuery({ queryKey: adminKeys.users(params), queryFn: () => adminApi.users(params), enabled, placeholderData: keepPreviousData });
export const useAdminReports = (params, enabled = true) => useQuery({ queryKey: adminKeys.reports(params), queryFn: () => adminApi.reports(params), enabled, placeholderData: keepPreviousData });
export const useAdminAudit = (params, enabled = true) => useQuery({ queryKey: adminKeys.audit(params), queryFn: () => adminApi.audit(params), enabled, placeholderData: keepPreviousData });
export const useAdminFlags = (params, enabled = true) => useQuery({ queryKey: adminKeys.flags(params), queryFn: () => adminApi.flags(params), enabled, placeholderData: keepPreviousData });
export const useAdminMutations = () => {
  const refresh = useRefreshAdmin();
  return {
    moderate: useMutation({ mutationFn: ({ type, id, body }) => adminApi.moderate(type, id, body), onSuccess: refresh }),
    role: useMutation({ mutationFn: ({ id, role }) => adminApi.setRole(id, role), onSuccess: refresh }),
    status: useMutation({ mutationFn: ({ id, status }) => adminApi.setStatus(id, status), onSuccess: refresh }),
    verification: useMutation({ mutationFn: ({ id, verified }) => adminApi.verifyCreator(id, verified), onSuccess: refresh }),
    report: useMutation({ mutationFn: ({ type, id, body }) => adminApi.resolveReport(type, id, body), onSuccess: refresh }),
    flag: useMutation({ mutationFn: ({ key, body }) => adminApi.updateFlag(key, body), onSuccess: refresh }),
  };
};
