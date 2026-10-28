import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_LIMITS, MOCK_TIMER_MODES } from '@algonest/shared';
import { ChevronLeft, ChevronRight, Flag, RefreshCw, Send } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import QuestionRenderer from '../../quizzes/components/QuestionRenderer.jsx';
import SectionTabs from '../components/SectionTabs.jsx';
import MockPalette from '../components/MockPalette.jsx';
import MockTimer from '../components/MockTimer.jsx';
import {
  useMockAttempt, useMockAttemptQuestions, useMockAutosave, useMockHeartbeat,
  useMockSubmitAttempt, useMockSubmitSection,
} from '../hooks/useMocks.js';
import { errorMessage, formatClock, paletteStateOf } from '../lib/mockUtils.js';

/**
 * Mock test engine.
 *
 * The server owns every deadline. This clock is display-only and is RESET from
 * `remainingSeconds` on every autosave / heartbeat response. When it reaches
 * zero we do not decide the outcome locally — we refetch the attempt so the
 * server's syncClock() advances the section or finalises the attempt.
 */
export default function MockSolverPage() {
  const { id: mockId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useMockAttempt(attemptId);
  const attempt = data?.attempt;
  const sectionKey = attempt?.activeSectionId ?? 'all';
  const questionParams = useMemo(() => ({ page: 1, limit: MOCK_LIMITS.MAX_QUESTIONS, sectionKey }), [sectionKey]);
  const { data: questionData, isLoading: questionsLoading, isError: questionsError, error: questionsLoadError } = useMockAttemptQuestions(attemptId, questionParams);

  const autosave = useMockAutosave();
  const heartbeat = useMockHeartbeat();
  const submitSection = useMockSubmitSection(attemptId);
  const submitAttempt = useMockSubmitAttempt(attemptId);
  const autosaveMutate = autosave.mutate;
  const heartbeatMutate = heartbeat.mutate;
  const submitSectionMutate = submitSection.mutate;
  const submitAttemptMutate = submitAttempt.mutate;

  const [answers, setAnswers] = useState({});
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [sectionSeconds, setSectionSeconds] = useState(null);
  const [attemptSeconds, setAttemptSeconds] = useState(null);
  const [saveState, setSaveState] = useState('saved');
  const [saveError, setSaveError] = useState('');
  const [actionError, setActionError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sectionConfirmOpen, setSectionConfirmOpen] = useState(false);
  const [syncedAt, setSyncedAt] = useState(null);
  const dirtyRef = useRef(false);
  const busyRef = useRef(false);

  const questions = useMemo(() => questionData?.items ?? [], [questionData?.items]);
  const sections = useMemo(() => questionData?.sections ?? [], [questionData?.sections]);
  const timerMode = attempt?.settings?.timerMode ?? MOCK_TIMER_MODES.SECTIONAL;
  const isFinal = Boolean(attempt && attempt.status !== 'in_progress');
  const activeSectionId = attempt?.activeSectionId ?? null;
  const current = questions.find((question) => question.id === activeQuestionId) ?? questions[0];
  const currentIndex = current ? questions.findIndex((question) => question.id === current.id) : -1;

  /* Hydrate from the server on first load and whenever the active section changes. */
  const attemptKey = attempt?.id;
  useEffect(() => {
    if (!attempt || attempt.status !== 'in_progress') return;
    const restored = {};
    for (const answer of attempt.answers ?? []) {
      restored[answer.questionId] = {
        response: answer.response ?? null,
        marked: Boolean(answer.marked),
        visited: Boolean(answer.visited),
      };
    }
    setAnswers(restored);
    setActiveQuestionId(attempt.activeQuestionId ?? null);
    setSectionSeconds(data?.remainingSeconds ?? 0);
    setAttemptSeconds(data?.attemptRemainingSeconds ?? 0);
    setSyncedAt(new Date());
    dirtyRef.current = false;
    setSaveState('saved');
  }, [attemptKey, activeSectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Choose the first question once the section's questions arrive. */
  useEffect(() => {
    if (!questions.length) return;
    setActiveQuestionId((previous) => (previous && questions.some((question) => question.id === previous) ? previous : questions[0].id));
  }, [sectionKey, questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /* A completed attempt belongs on the result page. */
  useEffect(() => {
    if (isFinal) navigate(`/app/mocks/${mockId}/results/${attemptId}`, { replace: true });
  }, [isFinal, navigate, mockId, attemptId]);

  const answerRows = useCallback((source) => Object.entries(source)
    .filter(([questionId]) => /^[a-f\d]{24}$/i.test(questionId))
    .map(([questionId, entry]) => ({
      questionId,
      response: entry.response ?? null,
      marked: Boolean(entry.marked),
      visited: Boolean(entry.visited),
    })), []);

  const resync = useCallback((result) => {
    if (!result) return;
    if (typeof result.remainingSeconds === 'number') setSectionSeconds(result.remainingSeconds);
    if (typeof result.attemptRemainingSeconds === 'number') setAttemptSeconds(result.attemptRemainingSeconds);
    setSyncedAt(new Date());
    if (result.sectionAdvanced || result.expired) refetch();
  }, [refetch]);

  /* Debounced autosave — the payload never contains a timestamp or duration. */
  useEffect(() => {
    if (!dirtyRef.current || isFinal || !attempt) return undefined;
    setSaveState('saving');
    const payload = {
      answers: answerRows(answers),
      activeQuestionId: activeQuestionId ?? null,
      ...(activeSectionId ? { sectionId: activeSectionId } : {}),
    };
    const timer = window.setTimeout(() => {
      autosaveMutate({ id: attemptId, body: payload }, {
        onSuccess: (result) => { dirtyRef.current = false; setSaveState('saved'); setSaveError(''); resync(result); },
        onError: (err) => { setSaveState('error'); setSaveError(errorMessage(err)); refetch(); },
      });
    }, MOCK_LIMITS.AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [answers, activeQuestionId, activeSectionId, answerRows, attempt, attemptId, autosaveMutate, isFinal, refetch, resync]);

  /* Heartbeat credits focus time and re-syncs the server clock. */
  useEffect(() => {
    if (isFinal || !attempt) return undefined;
    const timer = window.setInterval(() => {
      heartbeatMutate({ id: attemptId, activeQuestionId: activeQuestionId ?? null }, {
        onSuccess: resync,
        onError: () => refetch(),
      });
    }, MOCK_LIMITS.HEARTBEAT_MS);
    return () => window.clearInterval(timer);
  }, [isFinal, attempt, attemptId, activeQuestionId, heartbeatMutate, resync, refetch]);

  /* Display-only local countdown, always overwritten by the next server sync. */
  useEffect(() => {
    if (isFinal || sectionSeconds === null) return undefined;
    const timer = window.setInterval(() => {
      setSectionSeconds((value) => (typeof value === 'number' ? Math.max(0, value - 1) : value));
      setAttemptSeconds((value) => (typeof value === 'number' ? Math.max(0, value - 1) : value));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isFinal, sectionSeconds === null]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Zero means "ask the server", never "submit locally". */
  useEffect(() => {
    if (sectionSeconds !== 0 || isFinal || !attempt || busyRef.current) return;
    busyRef.current = true;
    setSaveState('saving');
    refetch().finally(() => { busyRef.current = false; });
  }, [sectionSeconds, isFinal, attempt, refetch]);

  /* Alt + arrow navigation, without stealing arrows from text inputs. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey || !questions.length) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const index = questions.findIndex((question) => question.id === activeQuestionId);
        const next = Math.max(0, Math.min(questions.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
        setActiveQuestionId(questions[next].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [questions, activeQuestionId]);

  const selectQuestion = useCallback((questionId) => {
    setActiveQuestionId(questionId);
    setAnswers((previous) => ({
      ...previous,
      [questionId]: { response: previous[questionId]?.response ?? null, marked: previous[questionId]?.marked ?? false, visited: true },
    }));
    dirtyRef.current = true;
  }, []);

  const updateAnswer = useCallback((response) => {
    if (!current) return;
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [current.id]: { response, marked: previous[current.id]?.marked ?? false, visited: true },
    }));
  }, [current]);

  const toggleMarked = useCallback(() => {
    if (!current) return;
    dirtyRef.current = true;
    setAnswers((previous) => ({
      ...previous,
      [current.id]: { response: previous[current.id]?.response ?? null, marked: !previous[current.id]?.marked, visited: true },
    }));
  }, [current]);

  const onSelectSection = useCallback((index) => {
    const target = sections[index];
    if (!target) return;
    const first = questions.find((question) => question.sectionId === target.id);
    if (first) selectQuestion(first.id);
  }, [sections, questions, selectQuestion]);

  const doSubmitSection = () => {
    if (busyRef.current || !activeSectionId) return;
    busyRef.current = true;
    setSectionConfirmOpen(false);
    submitSectionMutate({
      attemptId, sectionId: activeSectionId,
      body: { answers: answerRows(answers), activeQuestionId: null },
    }, {
      onSuccess: (result) => {
        busyRef.current = false;
        if (result.finished) navigate(`/app/mocks/${mockId}/results/${attemptId}`, { replace: true });
        else { setAnswers({}); setActiveQuestionId(null); refetch(); }
      },
      onError: (err) => { setActionError(errorMessage(err)); busyRef.current = false; refetch(); },
    });
  };

  const doSubmitAll = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setConfirmOpen(false);
    submitAttemptMutate({ attemptId, body: { answers: answerRows(answers), activeQuestionId: null } }, {
      onSuccess: () => navigate(`/app/mocks/${mockId}/results/${attemptId}`, { replace: true }),
      onError: (err) => { setActionError(errorMessage(err)); busyRef.current = false; refetch(); },
    });
  };

  const summary = useMemo(() => {
    const result = { answered: 0, marked: 0, notVisited: 0 };
    for (const question of questions) {
      const state = paletteStateOf(answers[question.id]);
      if (state === 'answered' || state === 'answered_marked') result.answered += 1;
      if (state === 'marked' || state === 'answered_marked') result.marked += 1;
      if (state === 'not_visited') result.notVisited += 1;
    }
    return result;
  }, [answers, questions]);

  if (isLoading || questionsLoading) return <FullPageLoader label="Preparing your mock…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load this attempt">{errorMessage(error)}</Alert></div>;
  if (questionsError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the questions">{errorMessage(questionsLoadError)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Preparing your mock…" />;

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const isBusy = submitSection.isPending || submitAttempt.isPending;

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Mock attempt · version {attempt.mockVersion} · {timerMode === 'sectional' ? 'sectional timer' : 'global timer'}</p>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">{attempt.title}</h1>
          {activeSection ? <p className="mt-0.5 text-xs text-muted">{activeSection.title} · +{activeSection.correctMarks} / −{activeSection.negativeMarks} marks · cut-off {activeSection.cutoffPercentage}%</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {timerMode === MOCK_TIMER_MODES.SECTIONAL ? <Button variant="secondary" size="sm" onClick={() => setSectionConfirmOpen(true)} disabled={isBusy}>Finish section</Button> : null}
          <Button size="sm" onClick={() => setConfirmOpen(true)} className="gap-1.5" disabled={isBusy}><Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit test</Button>
        </div>
      </header>

      <MockTimer sectionSeconds={sectionSeconds ?? 0} attemptSeconds={attemptSeconds ?? 0} timerMode={timerMode} saveState={saveState} error={saveError} syncedAt={syncedAt} />
      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {data?.sectionAdvanced ? <Alert variant="info" className="flex items-center gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" /> A section timed out and the server moved you to the next one.</Alert> : null}

      <SectionTabs sections={sections} states={attempt.sectionStates} activeSectionId={activeSectionId} onSelect={onSelectSection} timerMode={timerMode} />

      <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
        <main className="ag-card min-w-0 p-5 sm:p-6">
          {current ? <>
            <QuestionRenderer
              key={current.id} question={current} number={currentIndex + 1}
              value={answers[current.id]?.response}
              onChange={updateAnswer}
              marked={Boolean(answers[current.id]?.marked)}
              onToggleMarked={toggleMarked}
              disabled={isBusy}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <Button variant="secondary" size="sm" className="gap-1.5" disabled={currentIndex <= 0} onClick={() => selectQuestion(questions[currentIndex - 1].id)}><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous</Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={toggleMarked} aria-pressed={Boolean(answers[current.id]?.marked)}><Flag className="h-3.5 w-3.5" aria-hidden="true" /> {answers[current.id]?.marked ? 'Unmark' : 'Mark for review'}</Button>
                <span className="hidden text-xs text-muted sm:inline">{currentIndex + 1}/{questions.length} · Alt + ← / →</span>
              </div>
              {currentIndex >= questions.length - 1
                ? <Button size="sm" onClick={() => setConfirmOpen(true)}>Finish <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
                : <Button size="sm" className="gap-1" onClick={() => selectQuestion(questions[currentIndex + 1].id)}>Next <ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>}
            </div>
          </> : <p className="text-sm text-muted">No questions are available in this section.</p>}
        </main>

        <aside className="ag-card h-fit p-4 lg:sticky lg:top-4">
          <MockPalette questions={questions} answers={answers} currentId={current?.id} onSelect={selectQuestion} title={activeSection?.title ?? 'Questions'} />
          <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
            <p className="flex justify-between gap-2"><span>Answered</span><strong className="text-ink">{summary.answered}/{questions.length}</strong></p>
            <p className="flex justify-between gap-2"><span>Marked</span><strong className="text-ink">{summary.marked}</strong></p>
            <p className="flex justify-between gap-2"><span>Time left (server)</span><strong className="font-mono text-ink">{formatClock(attemptSeconds ?? 0)}</strong></p>
          </div>
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-3 text-xs text-muted">
            <p className="font-semibold text-primary">Disconnected?</p>
            <p className="mt-1">Just reload. Your answers, marks and the remaining time are restored from the server — the clock never pauses.</p>
          </div>
        </aside>
      </div>

      <Modal open={sectionConfirmOpen} onClose={() => setSectionConfirmOpen(false)} title="Finish this section?" description="In sectional mode you cannot return to a submitted section."
        footer={<><Button variant="ghost" onClick={() => setSectionConfirmOpen(false)}>Keep working</Button><Button loading={submitSection.isPending} onClick={doSubmitSection}>Finish section</Button></>}>
        <div className="space-y-1.5 text-sm text-ink"><p>{summary.answered} of {questions.length} questions answered in this section.</p><p>{summary.marked} marked for review.</p>{summary.notVisited > 0 ? <Alert variant="warning" className="mt-3">{summary.notVisited} question(s) were never opened and will score zero.</Alert> : null}</div>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Submit the whole mock?" description="You cannot change your answers after submitting."
        footer={<><Button variant="ghost" onClick={() => setConfirmOpen(false)}>Keep working</Button><Button loading={submitAttempt.isPending} onClick={doSubmitAll}>Submit now</Button></>}>
        <div className="space-y-1.5 text-sm text-ink"><p>{summary.answered} of {questions.length} questions answered in the current section.</p><p>{formatClock(sectionSeconds ?? 0)} left on the server clock.</p><Alert variant="warning" className="mt-3">Unanswered and wrong answers are scored with this section's negative marking.</Alert></div>
      </Modal>
    </div>
  );
}
