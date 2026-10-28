import {
  keepPreviousData, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import sheetsApi from '../api/sheetsApi.js';
import progressApi from '../api/progressApi.js';

/** Central invalidation helpers — one place decides what a mutation dirties. */
function useInvalidators() {
  const qc = useQueryClient();
  return {
    lists: () => qc.invalidateQueries({ queryKey: queryKeys.sheets.all }),
    detail: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.sheets.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.versions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.all });
    },
    ratings: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.sheets.ratings(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.sheets.all });
    },
    progress: (id) => qc.invalidateQueries({ queryKey: queryKeys.sheets.progress(id) }),
    resources: () => qc.invalidateQueries({ queryKey: queryKeys.personalResources.all }),
    reports: () => qc.invalidateQueries({ queryKey: queryKeys.sheets.reports() }),
  };
}

/* ───────────────────────────── queries ───────────────────────────── */

export function useSheetList(params) {
  return useQuery({
    queryKey: queryKeys.sheets.list(params),
    queryFn: () => sheetsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useSheet(id) {
  return useQuery({
    queryKey: queryKeys.sheets.detail(id),
    queryFn: () => sheetsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useSheetVersions(id) {
  return useQuery({
    queryKey: queryKeys.sheets.versions(id),
    queryFn: () => sheetsApi.versions(id),
    enabled: Boolean(id),
  });
}

export function useRatings(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.sheets.ratings(id, params),
    queryFn: () => sheetsApi.ratings(id, params),
    enabled: Boolean(id),
  });
}

export function useReports(params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.sheets.reports(params),
    queryFn: () => sheetsApi.reports(params),
    enabled,
  });
}

export function useProgress(sheetId, params = {}) {
  return useQuery({
    queryKey: queryKeys.sheets.progress(sheetId, params),
    queryFn: () => progressApi.list(sheetId, params),
    enabled: Boolean(sheetId),
    placeholderData: keepPreviousData,
  });
}

export function usePersonalResources(params = {}) {
  return useQuery({
    queryKey: queryKeys.personalResources.list(params),
    queryFn: () => progressApi.resources(params),
    placeholderData: keepPreviousData,
  });
}

/* ───────────────────────────── mutations ───────────────────────────── */

export function useCreateSheet() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: sheetsApi.create,
    onSuccess: () => invalidate.lists(),
  });
}

export function useUpdateSheet(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => sheetsApi.update(id, body),
    onSuccess: () => invalidate.detail(id),
  });
}

export function useArchiveSheet() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: sheetsApi.archive,
    onSuccess: () => invalidate.lists(),
  });
}

/** Lifecycle actions (submit / moderate / publish / restore / revision). */
export function useSheetLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.detail(id);
  return {
    submit: useMutation({ mutationFn: (changelog) => sheetsApi.submit(id, changelog), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => sheetsApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: (changelog) => sheetsApi.publish(id, changelog), onSuccess }),
    restore: useMutation({ mutationFn: () => sheetsApi.restore(id), onSuccess }),
    revision: useMutation({ mutationFn: () => sheetsApi.revision(id), onSuccess }),
  };
}

export function useProblemMutations(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.detail(id);
  return {
    add: useMutation({ mutationFn: (problems) => sheetsApi.addProblems(id, problems), onSuccess }),
    importItems: useMutation({ mutationFn: (items) => sheetsApi.importProblems(id, items), onSuccess }),
    update: useMutation({ mutationFn: ({ problemId, body }) => sheetsApi.updateProblem(id, problemId, body), onSuccess }),
    remove: useMutation({ mutationFn: (problemId) => sheetsApi.removeProblem(id, problemId), onSuccess }),
    reorder: useMutation({ mutationFn: (orderedIds) => sheetsApi.reorderProblems(id, orderedIds), onSuccess }),
  };
}

export function useParseLinks() {
  return useMutation({ mutationFn: (text) => sheetsApi.parseLinks(text) });
}

export function useCloneSheet() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: sheetsApi.clone, onSuccess: () => invalidate.lists() });
}

export function useRateSheet(id) {
  const invalidate = useInvalidators();
  return {
    rate: useMutation({ mutationFn: (body) => sheetsApi.rate(id, body), onSuccess: () => invalidate.ratings(id) }),
    unrate: useMutation({ mutationFn: () => sheetsApi.unrate(id), onSuccess: () => invalidate.ratings(id) }),
  };
}

export function useReportSheet(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => sheetsApi.report(id, body),
    onSuccess: () => invalidate.reports(),
  });
}

export function useResolveReport() {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ reportId, body }) => sheetsApi.resolveReport(reportId, body),
    onSuccess: () => invalidate.reports(),
  });
}

export function useUpdateProgress(sheetId) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ problemId, body }) => progressApi.update(sheetId, problemId, body),
    onSuccess: () => invalidate.progress(sheetId),
  });
}

export function useResourceMutations() {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.resources();
  return {
    create: useMutation({ mutationFn: progressApi.createResource, onSuccess }),
    update: useMutation({ mutationFn: ({ id, body }) => progressApi.updateResource(id, body), onSuccess }),
    remove: useMutation({ mutationFn: progressApi.deleteResource, onSuccess }),
  };
}

export default useSheetList;
