import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUIZ_LIMITS, QUESTION_TYPES as T } from '@algonest/shared';
import {
  ArrowRight, ChevronLeft, ChevronRight, Flag, Send,
} from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import QuestionPalette from '../components/QuestionPalette.jsx';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import QuizTimer from '../components/QuizTimer.jsx';
import {
  useAttempt, useAttemptQuestions, useAutosaveAttempt, useSubmitAttempt,
} from '../hooks/useQuizzes.js';
import { errorMessage } from '../lib/quizUtils.js';

const params = Object.freeze({ page: 1, limit: QUIZ_LIMITS.MAX_QUESTIONS });

/**
 * Timed quiz engine.
 * - the server owns the deadline; this clock is display-only
 * - every change is debounced-autosaved; a reload restores `attempt.answers`
 * - submit sends the full answer set, so a race with autosave cannot lose data
 */
export default function QuizSolverPage() {
  const { id: quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useAttempt(attemptId);
  const { data: questionData, isLoading: questionsLoading, isError: questionsError, error: questionsLoadError } = useAttemptQuestions(attemptId, params);
  const autosave = useAutosaveAttempt();
  const submit = useSubmitAttempt(quizId);
  // `mutate` is referentially stable even though the mutation object is not.
  // Depending on the whole object would restart the debounce on every render.
  const autosaveMutate = autosave.mutate;
  const submitMutate = submit.mutate;

  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  // null = "clock not initialised yet". Without this sentinel the first commit
  // that receives attempt data still sees 0 and would instantly auto-submit.
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [saveState, setSaveState] = useState('saved');
  const [autosaveError, setAutosaveError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dirtyRef = useRef(false);
  const submittingRef = useRef(false);

  const attempt = data?.attempt;
  const questions = questionData?.items ?? [];
  const isFinal = Boolean(attempt && attempt.status !== 'in_progress');
  const current = questions[currentIndex];

  /* Restore autosaved answers exactly once per attempt. */
  useEffect(() => {
    if (!attempt?.answers) return;
    const restored = {};
    for (const answer of attempt.answers) {
      restored[answer.questionId] = { response: answer.response ?? null, marked: Boolean(answer.marked) };
    }
    setAnswers(restored);
    setRemainingSeconds(data?.remainingSeconds ?? 0);
    dirtyRef.current = false;
    setSaveState('saved');
  }, [attempt?.id, data?.remainingSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Ordering questions display a concrete order — record it as the answer. */
  useEffect(() => {
    if (!questionData?.items) return;
    setAnswers((previous) => {
      let changed = false;
      const next = { ...previous };
      for (const question of questionData.items) {
        if (question.type === T.ORDERING && !next[question.id]) {
          next[question.id] = { response: (question.items ?? []).map((item) => item.id), marked: false };
          changed = true;
        }
      }
      return changed ? next : previous;
    });
  }, [questionData?.items]);

  /* Display-only countdown. */
  useEffect(() => {
    if (isFinal || !attempt) return undefined;
    const timer = window.setInterval(() => setRemainingSeconds((value) => Math.max(0, (value ?? 0) - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [isFinal, attempt?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const answerPayload = useCallback((source) => Object.entries(source)
    .filter(([questionId]) => /^[a-f\d]{24}$/i.test(questionId))
    .map(([questionId, entry]) => ({
      questionId,
      response: entry.response ?? null,
      marked: Boolean(entry.marked),
    })), []);

  const finalize = useCallback((timedOut = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setConfirmOpen(false);
    setSubmitError('');
    submitMutate({ attemptId, answers: answerPayload(answers) }, {
      onSuccess: () => navigate(`/app/quizzes/${quizId}/results/${attemptId}`, { replace: true, state: { timedOut } }),
      onError: (err) => { setSubmitError(errorMessage(err)); submittingRef.current = false; },
    });
  }, [answerPayload, answers, attemptId, navigate, quizId, submitMutate]);

  /* Auto-submit when the clock hits zero. */
  useEffect(() => {
    if (typeof remainingSeconds === 'number' && remainingSeconds === 0
        && attempt && !isFinal && !submittingRef.current) finalize(true);
  }, [remainingSeconds, attempt, isFinal, finalize]);

  /* Debounced autosave — only when the learner actually changed something. */
  useEffect(() => {
    if (!dirtyRef.current || isFinal || !attempt) return undefined;
    setSaveState('saving');
    const timer = window.setTimeout(() => {
      const rows = answerPayload(answers);
      if (!rows.length) { setSaveState('saved'); return; }
      autosaveMutate({ id: attemptId, answers: rows }, {
        onSuccess: (result) => {
          dirtyRef.current = false;
          setSaveState('saved');
          setAutosaveError('');
          if (result.expired) {
            submittingRef.current = true;
            navigate(`/app/quizzes/${quizId}/results/${attemptId}`, { replace: true, state: { timedOut: true } });
          }
        },
        onError: (err) => { setSaveState('error'); setAutosaveError(errorMessage(err)); },
      });
    }, QUIZ_LIMITS.AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [answers, answerPayload, attempt, attemptId, autosaveMutate, isFinal, navigate, quizId]);

  /* Alt + arrow jumps between questions without stealing text-input arrows. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); setCurrentIndex((value) => Math.max(0, value - 1)); }
      if (event.key === 'ArrowRight') { event.preventDefault(); setCurrentIndex((value) => Math.min(questions.length - 1, value + 1)); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [questions.length]);

  /* A completed attempt belongs on the result page. */
  useEffect(() => {
    if (isFinal) navigate(`/app/quizzes/${quizId}/results/${attemptId}`, { replace: true });
  }, [isFinal, navigate, quizId, attemptId]);

  const updateAnswer = useCallback((questionId, response) => {
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [questionId]: { response, marked: previous[questionId]?.marked ?? false },
    }));
  }, []);

  const toggleMarked = useCallback((questionId) => {
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [questionId]: { response: previous[questionId]?.response ?? null, marked: !previous[questionId]?.marked },
    }));
  }, []);

  const answeredCount = useMemo(() => Object.values(answers).filter((entry) => {
    const value = entry.response;
    return value !== null && value !== undefined && value !== ''
      && !(Array.isArray(value) && value.length === 0)
      && !(typeof value === 'object' && Object.keys(value).length === 0);
  }).length, [answers]);
  const markedCount = useMemo(() => Object.values(answers).filter((entry) => entry.marked).length, [answers]);

  if (isLoading || questionsLoading) return <FullPageLoader label="Preparing your attempt…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load this attempt">{errorMessage(error)}</Alert></div>;
  if (questionsError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the questions">{errorMessage(questionsLoadError)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Preparing your attempt…" />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Attempt · version {attempt.quizVersion}{attempt.mode === 'incorrect' ? ' · retry incorrect' : ''}</p>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{attempt.title}</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)} className="gap-1.5">
          <Send className="h-3.5 w-3.5" aria-hidden="true" /> Finish &amp; submit
        </Button>
      </header>

      <QuizTimer remainingSeconds={remainingSeconds ?? 0} saveState={saveState} autosaveError={autosaveError} />
      {submitError ? <Alert variant="error" title="Submit failed">{submitError}</Alert> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <main className="ag-card min-w-0 p-5 sm:p-6">
          {current ? (
            <>
              <QuestionRenderer
                key={current.id}
                question={current}
                number={currentIndex + 1}
                value={answers[current.id]?.response}
                onChange={(response) => updateAnswer(current.id, response)}
                marked={Boolean(answers[current.id]?.marked)}
                onToggleMarked={() => toggleMarked(current.id)}
                disabled={submittingRef.current}
              />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <Button variant="secondary" size="sm" className="gap-1.5" disabled={currentIndex === 0} onClick={() => setCurrentIndex((value) => value - 1)}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                </Button>
                <span className="text-xs text-muted">{currentIndex + 1} of {questions.length} · Alt + ← / → to jump</span>
                {currentIndex === questions.length - 1 ? (
                  <Button size="sm" className="gap-1.5" onClick={() => setConfirmOpen(true)}>Finish <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
                ) : (
                  <Button size="sm" className="gap-1.5" onClick={() => setCurrentIndex((value) => value + 1)}>Next <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
                )}
              </div>
            </>
          ) : <p className="text-sm text-muted">This attempt has no questions.</p>}
        </main>

        <aside className="ag-card h-fit p-4 lg:sticky lg:top-4">
          <QuestionPalette
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelect={setCurrentIndex}
          />
          <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
            <p className="flex justify-between gap-2"><span>Answered</span><strong className="text-ink">{answeredCount}/{questions.length}</strong></p>
            <p className="flex justify-between gap-2"><span>Marked</span><strong className="text-ink">{markedCount}</strong></p>
          </div>
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-3 text-xs text-muted">
            <p className="flex items-center gap-1.5 font-semibold text-primary"><Flag className="h-3.5 w-3.5" aria-hidden="true" /> Tip</p>
            <p className="mt-1">Unanswered questions count as incorrect. Use the palette to jump back before submitting.</p>
          </div>
        </aside>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Submit this attempt?"
        description="You can't change your answers after submitting."
        footer={<>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Keep working</Button>
          <Button loading={submit.isPending} onClick={() => finalize(false)} className="gap-1.5"><Send className="h-4 w-4" aria-hidden="true" /> Submit now</Button>
        </>}
      >
        <div className="space-y-2 text-sm text-ink">
          <p><strong>{answeredCount}</strong> of {questions.length} questions answered.</p>
          <p><strong>{markedCount}</strong> marked for review.</p>
          <p>{Math.floor((remainingSeconds ?? 0) / 60)}m {(remainingSeconds ?? 0) % 60}s remaining.</p>
          {answeredCount < questions.length ? (
            <Alert variant="warning" className="mt-3">{questions.length - answeredCount} question(s) are still unanswered and will be scored as incorrect.</Alert>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
