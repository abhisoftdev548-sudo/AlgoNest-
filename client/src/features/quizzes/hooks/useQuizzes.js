import {
  keepPreviousData, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import quizApi from '../api/quizApi.js';
import questionApi from '../api/questionApi.js';
import attemptApi from '../api/attemptApi.js';

/** One place decides which query keys a mutation dirties. */
function useInvalidators() {
  const qc = useQueryClient();
  return {
    lists: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.all });
      qc.invalidateQueries({ queryKey: queryKeys.attempts.all });
    },
    quiz: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.versions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.questions(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.attempts(id) });
      qc.invalidateQueries({ queryKey: queryKeys.quizzes.all });
    },
    bank: () => qc.invalidateQueries({ queryKey: queryKeys.questionBank.all }),
    attempt: (id) => {
      qc.invalidateQueries({ queryKey: queryKeys.attempts.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.attempts.result(id) });
      qc.invalidateQueries({ queryKey: queryKeys.attempts.all });
    },
  };
}

/* ───────────────────────────── queries ───────────────────────────── */

export function useQuizList(params) {
  return useQuery({
    queryKey: queryKeys.quizzes.list(params),
    queryFn: () => quizApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useQuiz(id) {
  return useQuery({
    queryKey: queryKeys.quizzes.detail(id),
    queryFn: () => quizApi.get(id),
    enabled: Boolean(id),
  });
}

export function useQuizVersions(id) {
  return useQuery({
    queryKey: queryKeys.quizzes.versions(id),
    queryFn: () => quizApi.versions(id),
    enabled: Boolean(id),
  });
}

export function useQuizQuestions(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.quizzes.questions(id, params),
    queryFn: () => quizApi.questions(id, params),
    enabled: Boolean(id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function useMyAttempts(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.quizzes.attempts(id, params),
    queryFn: () => quizApi.attempts(id, params),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });
}

export function useQuestionBank(params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.questionBank.list(params),
    queryFn: () => questionApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useAttempt(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attempts.detail(id),
    queryFn: () => attemptApi.get(id),
    enabled: Boolean(id) && enabled,
    // The solver owns the countdown; refetching would fight local state.
    refetchOnWindowFocus: false,
  });
}

export function useAttemptQuestions(id, params = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attempts.questions(id, params),
    queryFn: () => attemptApi.questions(id, params),
    enabled: Boolean(id) && enabled,
    staleTime: Infinity, // frozen version — never changes mid-attempt
  });
}

export function useAttemptResult(id, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attempts.result(id),
    queryFn: () => attemptApi.result(id),
    enabled: Boolean(id) && enabled,
  });
}

/* ───────────────────────── quiz mutations ───────────────────────── */

export function useCreateQuiz() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: quizApi.create, onSuccess: () => invalidate.lists() });
}

export function useUpdateQuiz(id) {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: (body) => quizApi.update(id, body), onSuccess: () => invalidate.quiz(id) });
}

export function useArchiveQuiz() {
  const invalidate = useInvalidators();
  return useMutation({ mutationFn: quizApi.archive, onSuccess: () => invalidate.lists() });
}

export function useQuizLifecycle(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.quiz(id);
  return {
    submit: useMutation({ mutationFn: (changelog) => quizApi.submit(id, changelog), onSuccess }),
    moderate: useMutation({ mutationFn: (body) => quizApi.moderate(id, body), onSuccess }),
    publish: useMutation({ mutationFn: (changelog) => quizApi.publish(id, changelog), onSuccess }),
    restore: useMutation({ mutationFn: () => quizApi.restore(id), onSuccess }),
    revision: useMutation({ mutationFn: () => quizApi.revision(id), onSuccess }),
  };
}

export function useQuizQuestionMutations(id) {
  const invalidate = useInvalidators();
  const onSuccess = () => invalidate.quiz(id);
  return {
    link: useMutation({ mutationFn: (questionIds) => quizApi.linkQuestions(id, questionIds), onSuccess: () => { onSuccess(); invalidate.bank(); } }),
    importItems: useMutation({ mutationFn: ({ items, source }) => quizApi.importQuestions(id, items, source), onSuccess: () => { onSuccess(); invalidate.bank(); } }),
    reorder: useMutation({ mutationFn: (orderedIds) => quizApi.reorderQuestions(id, orderedIds), onSuccess }),
    unlink: useMutation({ mutationFn: (questionId) => quizApi.unlinkQuestion(id, questionId), onSuccess: () => { onSuccess(); invalidate.bank(); } }),
  };
}

/* ─────────────────────── question bank mutations ─────────────────────── */

export function useQuestionMutations() {
  const invalidate = useInvalidators();
  return {
    create: useMutation({ mutationFn: questionApi.create, onSuccess: () => invalidate.bank() }),
    update: useMutation({ mutationFn: ({ id, body }) => questionApi.update(id, body), onSuccess: () => invalidate.bank() }),
    remove: useMutation({ mutationFn: questionApi.remove, onSuccess: () => invalidate.bank() }),
  };
}

export function useParseQuestionImport() {
  return useMutation({ mutationFn: ({ format, text }) => questionApi.parseImport(format, text) });
}

/* ───────────────────────── attempt mutations ───────────────────────── */

export function useStartAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: (body) => quizApi.startAttempt(id, body),
    onSuccess: () => invalidate.quiz(id),
  });
}

/** Autosave deliberately does NOT invalidate: the solver holds local state. */
export function useAutosaveAttempt() {
  return useMutation({ mutationFn: ({ id, answers }) => attemptApi.autosave(id, answers) });
}

export function useSubmitAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: ({ attemptId, answers }) => attemptApi.submit(attemptId, answers),
    onSuccess: () => { invalidate.attempt(id); invalidate.quiz(id); },
  });
}

export function useAbandonAttempt(id) {
  const invalidate = useInvalidators();
  return useMutation({
    mutationFn: attemptApi.abandon,
    onSuccess: () => { invalidate.attempt(id); invalidate.quiz(id); },
  });
}

export default useQuizList;
