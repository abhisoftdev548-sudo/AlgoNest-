import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import planApi from '../api/planApi.js';

function useInvalidators() {
  const qc = useQueryClient();
  return {
    all: () => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    plan: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void id;
    },
  };
}

export function usePlanList(params = {}) {
  return useQuery({ queryKey: queryKeys.plans.list(params), queryFn: () => planApi.list(params), placeholderData: keepPreviousData });
}

export function useActivePlan() {
  return useQuery({ queryKey: queryKeys.plans.active(), queryFn: () => planApi.active() });
}

export function usePlanContent(enabled = true) {
  return useQuery({ queryKey: queryKeys.plans.content(), queryFn: () => planApi.content(), enabled, staleTime: 5 * 60_000 });
}

export function usePlan(id) {
  return useQuery({ queryKey: queryKeys.plans.detail(id), queryFn: () => planApi.get(id), enabled: Boolean(id) });
}

export function usePlanTasks(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.plans.tasks(id, params),
    queryFn: () => planApi.tasks(id, params),
    enabled: Boolean(id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreatePlan() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: planApi.create, onSuccess: () => invalidate.all() });
}

export function useUpdatePlan(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => planApi.update(id, body), onSuccess: () => invalidate.plan(id) });
}

export function useArchivePlan() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: planApi.archive, onSuccess: () => invalidate.all() });
}

export function useRegeneratePlan(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: () => planApi.regenerate(id), onSuccess: () => invalidate.plan(id) });
}

export function useReschedulePlan(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => planApi.reschedule(id, body), onSuccess: () => invalidate.plan(id) });
}

export function useTaskStatus(planId) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ taskId, body }) => planApi.taskStatus(planId, taskId, body),
    onSuccess: () => invalidate.plan(planId),
  });
}

export function useTaskOrder(planId) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => planApi.taskOrder(planId, body),
    onSuccess: () => invalidate.plan(planId),
  });
}

export default usePlanList;
