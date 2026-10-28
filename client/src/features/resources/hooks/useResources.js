import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import resourceApi from '../api/resourceApi.js';
import creatorApi from '../api/creatorApi.js';

function useInvalidators() {
  const qc = useQueryClient();
  return {
    all: () => {
      qc.invalidateQueries({ queryKey: queryKeys.resources.all });
      qc.invalidateQueries({ queryKey: queryKeys.creators.all });
    },
    resource: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.resources.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.resources.ratings(id) });
      qc.invalidateQueries({ queryKey: queryKeys.resources.all });
    },
  };
}

export function useResourceList(params) {
  return useQuery({ queryKey: queryKeys.resources.list(params), queryFn: () => resourceApi.list(params), placeholderData: keepPreviousData });
}

export function useSavedResources(params) {
  return useQuery({ queryKey: queryKeys.resources.saved(params), queryFn: () => resourceApi.saved(params), placeholderData: keepPreviousData });
}

export function useResource(id) {
  return useQuery({ queryKey: queryKeys.resources.detail(id), queryFn: () => resourceApi.get(id), enabled: Boolean(id) });
}

export function useResourceRatings(id, params = {}, enabled = true) {
  return useQuery({ queryKey: queryKeys.resources.ratings(id, params), queryFn: () => resourceApi.ratings(id, params), enabled: Boolean(id) && enabled });
}

export function useDuplicateCheck(url, enabled = false) {
  return useQuery({
    queryKey: queryKeys.resources.duplicate(url),
    queryFn: () => resourceApi.checkDuplicate(url),
    enabled: Boolean(url) && enabled,
    retry: false,
  });
}

export function useResourceReports(params, enabled = true) {
  return useQuery({ queryKey: queryKeys.resources.reports(params), queryFn: () => resourceApi.reports(params), enabled });
}

export function useCreateResource() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: resourceApi.create, onSuccess: () => invalidate.all() });
}

export function useUpdateResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => resourceApi.update(id, body), onSuccess: () => invalidate.resource(id) });
}

export function useResourceLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.resource(id);
  return {
    submit: useMutation({ mutationFn: () => resourceApi.submit(id), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => resourceApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: () => resourceApi.publish(id), onSuccess }),
    revision: useMutation({ mutationFn: () => resourceApi.revision(id), onSuccess }),
    restore: useMutation({ mutationFn: () => resourceApi.restore(id), onSuccess }),
    archive: useMutation({ mutationFn: () => resourceApi.archive(id), onSuccess }),
    checkLink: useMutation({ mutationFn: () => resourceApi.checkLink(id), onSuccess }),
  };
}

export function useRunLinkCheck() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (params) => resourceApi.runLinkCheck(params), onSuccess: () => invalidate.all() });
}

export function useSaveResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (saved) => saved ? resourceApi.unsave(id) : resourceApi.save(id), onSuccess: () => invalidate.resource(id) });
}

export function useRateResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => resourceApi.rate(id, body), onSuccess: () => invalidate.resource(id) });
}

export function useFeedback(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (helpful) => resourceApi.feedback(id, helpful), onSuccess: () => invalidate.resource(id) });
}

export function useReportResource(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => resourceApi.report(id, body), onSuccess: () => invalidate.resource(id) });
}

export function useTrackResourceEvent(id) {
  return useMutation({ mutationFn: (type) => resourceApi.event(id, type) });
}

export function useResolveReport() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: ({ reportId, body }) => resourceApi.resolveReport(reportId, body), onSuccess: () => invalidate.all() });
}

/* Creators */
export function useCreatorList(params) {
  return useQuery({ queryKey: queryKeys.creators.list(params), queryFn: () => creatorApi.list(params), placeholderData: keepPreviousData });
}

export function useMyCreatorProfile(enabled = true) {
  return useQuery({ queryKey: queryKeys.creators.me(), queryFn: () => creatorApi.me(), enabled });
}

export function useCreator(id, params = {}) {
  return useQuery({ queryKey: queryKeys.creators.detail(id, params), queryFn: () => creatorApi.get(id, params), enabled: Boolean(id) });
}

export function useMyAnalytics(params = {}) {
  return useQuery({ queryKey: queryKeys.creators.analytics('me', params), queryFn: () => creatorApi.myAnalytics(params) });
}

export function useCreatorAnalytics(id, params = {}, enabled = true) {
  return useQuery({ queryKey: queryKeys.creators.analytics(id, params), queryFn: () => creatorApi.analytics(id, params), enabled: Boolean(id) && enabled });
}

export function useUpdateCreatorProfile() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: creatorApi.updateMe,
    onSuccess: () => {
      invalidate.all();
      invalidate.resource('me');
    },
  });
}

export default useResourceList;
