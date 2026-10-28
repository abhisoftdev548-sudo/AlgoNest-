import {
  keepPreviousData, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import mockApi from '../api/mockApi.js';
import mockAttemptApi from '../api/mockAttemptApi.js';

function useInvalidators() {
  const qc = useQueryClient();
  return {
    lists: () => qc.invalidateQueries({ queryKey: queryKeys.mocks.all }),
    mock: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.mocks.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.versions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.sections(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.attempts(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mocks.all });
    },
    attempt: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.mockAttempts.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mockAttempts.result(id) });
      qc.invalidateQueries({ queryKey: queryKeys.mockAttempts.all });
    },
    bank: () => qc.invalidateQueries({ queryKey: queryKeys.questionBank.all }),
  };
}

/* Queries */
export function useMockList(params) {
  return useQuery({
    queryKey: queryKeys.mocks.list(params),
    queryFn: () => mockApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useMock(id) {
  return useQuery({ queryKey: queryKeys.mocks.detail(id), queryFn: () => mockApi.get(id), enabled: Boolean(id) });
}

export function useMockVersions(id) {
  return useQuery({ queryKey: queryKeys.mocks.versions(id), queryFn: () => mockApi.versions(id), enabled: Boolean(id) });
}

export function useMockAttempts(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.mocks.attempts(id, params),
    queryFn: () => mockApi.attempts(id, params),
    enabled: Boolean(id), placeholderData: keepPreviousData,
  });
}

export function useSectionQuestions(id, sectionId, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mocks.sections(id, sectionId, params),
    queryFn: () => mockApi.sectionQuestions(id, sectionId, params),
    enabled: Boolean(id && sectionId) && enabled,
  });
}

export function useMockAttempt(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mockAttempts.detail(id),
    queryFn: () => mockAttemptApi.get(id),
    enabled: Boolean(id) && enabled,
    refetchOnWindowFocus: true, // reconnection re-syncs the server clock
  });
}

export function useMockAttemptQuestions(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mockAttempts.questions(id, params),
    queryFn: () => mockAttemptApi.questions(id, params),
    enabled: Boolean(id) && enabled,
    staleTime: Infinity,
  });
}

export function useMockResult(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.mockAttempts.result(id),
    queryFn: () => mockAttemptApi.result(id),
    enabled: Boolean(id) && enabled,
  });
}

/* Mock CRUD + lifecycle */
export function useCreateMock() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: mockApi.create, onSuccess: () => invalidate.lists() });
}

export function useUpdateMock(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => mockApi.update(id, body), onSuccess: () => invalidate.mock(id) });
}

export function useArchiveMock() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: mockApi.archive, onSuccess: () => invalidate.lists() });
}

export function useMockLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.mock(id);
  return {
    submit: useMutation({ mutationFn: (changelog) => mockApi.submit(id, changelog), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => mockApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: (changelog) => mockApi.publish(id, changelog), onSuccess }),
    restore: useMutation({ mutationFn: () => mockApi.restore(id), onSuccess }),
    revision: useMutation({ mutationFn: () => mockApi.revision(id), onSuccess }),
  };
}

export function useSetSectionQuestions(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ sectionId, questionIds }) => mockApi.setSectionQuestions(id, sectionId, questionIds),
    onSuccess: () => { invalidate.mock(id); invalidate.bank(); },
  });
}

/* Attempt mutations. Autosave/heartbeat deliberately do NOT invalidate the
   solver query: local state is the source of truth until a section advances. */
export function useStartMockAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: () => mockApi.startAttempt(id), onSuccess: () => invalidate.mock(id) });
}

export function useMockAutosave() {
  return useMutation({ mutationFn: ({ id, body }) => mockAttemptApi.autosave(id, body) });
}

export function useMockHeartbeat() {
  return useMutation({ mutationFn: ({ id, activeQuestionId }) => mockAttemptApi.heartbeat(id, activeQuestionId) });
}

export function useMockSubmitSection(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, sectionId, body }) => mockAttemptApi.submitSection(attemptId, sectionId, body),
    onSuccess: () => invalidate.attempt(id),
  });
}

export function useMockSubmitAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, body }) => mockAttemptApi.submit(attemptId, body),
    onSuccess: () => { invalidate.attempt(id); invalidate.mock(id); },
  });
}

export function useMockReasons(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, reasons }) => mockAttemptApi.reasons(attemptId, reasons),
    onSuccess: () => invalidate.attempt(id),
  });
}

export function useMockAbandon(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId }) => mockAttemptApi.abandon(attemptId),
    onSuccess: () => { invalidate.attempt(id); invalidate.mock(id); },
  });
}

export default useMockList;
