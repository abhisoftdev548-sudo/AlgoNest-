import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUIZ_LIMITS } from '@algonest/shared';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import AttemptResult from '../components/AttemptResult.jsx';
import {
  useAttemptQuestions, useAttemptResult, useStartAttempt,
} from '../hooks/useQuizzes.js';
import { errorMessage } from '../lib/quizUtils.js';

const params = Object.freeze({ page: 1, limit: QUIZ_LIMITS.MAX_QUESTIONS });

/** Result + explanations. Both datasets come from the frozen attempt version. */
export default function QuizResultPage() {
  const { id: quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useAttemptResult(attemptId);
  const { data: questionData } = useAttemptQuestions(attemptId, params);
  const start = useStartAttempt(quizId);

  const attempt = data?.attempt;
  const questions = useMemo(() => questionData?.items ?? [], [questionData?.items]);

  const retry = (payload) => {
    start.mutate(payload, {
      onSuccess: (result) => navigate(`/app/quizzes/${quizId}/attempts/${result.attempt.id}`),
    });
  };

  if (isLoading) return <FullPageLoader label="Calculating your result…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the result">{errorMessage(error)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Calculating your result…" />;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {start.isError ? <Alert variant="error">{errorMessage(start.error)}</Alert> : null}
      <AttemptResult
        attempt={attempt}
        questions={questions}
        showExplanations={attempt.settings?.showExplanations !== false && questionData?.showExplanations !== false}
        retryAllowed={Boolean(data?.retryAllowed)}
        pending={start.isPending}
        quizId={quizId}
        onRetryIncorrect={() => retry({ mode: 'incorrect', sourceAttemptId: attemptId })}
        onRetryFull={() => retry({})}
      />
    </div>
  );
}
