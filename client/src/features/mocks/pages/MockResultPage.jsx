import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_LIMITS } from '@algonest/shared';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import MockResult from '../components/MockResult.jsx';
import {
  useMock, useMockAttemptQuestions, useMockReasons, useMockResult, useStartMockAttempt,
} from '../hooks/useMocks.js';
import { errorMessage } from '../lib/mockUtils.js';

const params = Object.freeze({ page: 1, limit: MOCK_LIMITS.MAX_QUESTIONS, sectionKey: 'all' });

export default function MockResultPage() {
  const { id: mockId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMockResult(attemptId);
  const { data: questionData } = useMockAttemptQuestions(attemptId, params);
  const { data: mockData } = useMock(mockId);
  const reasons = useMockReasons(attemptId);
  const start = useStartMockAttempt(mockId);

  const questions = useMemo(() => questionData?.items ?? [], [questionData?.items]);
  const attempt = data?.attempt;
  const summary = mockData?.mySummary;
  const canRetry = Boolean(summary?.canStart && !summary?.activeAttemptId);

  if (isLoading) return <FullPageLoader label="Analysing your attempt…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load the analysis">{errorMessage(error)}</Alert></div>;
  if (!attempt) return <FullPageLoader label="Analysing your attempt…" />;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {reasons.isError ? <Alert variant="error">{errorMessage(reasons.error)}</Alert> : null}
      {start.isError ? <Alert variant="error">{errorMessage(start.error)}</Alert> : null}
      <MockResult
        attempt={attempt}
        questions={questions}
        mockId={mockId}
        canRetry={canRetry}
        pending={start.isPending}
        reasonsPending={reasons.isPending}
        onRetry={() => start.mutate(undefined, {
          onSuccess: (result) => navigate(`/app/mocks/${mockId}/attempts/${result.attempt.id}`),
        })}
        onReasons={(items) => reasons.mutate({ attemptId, reasons: items })}
      />
    </div>
  );
}
