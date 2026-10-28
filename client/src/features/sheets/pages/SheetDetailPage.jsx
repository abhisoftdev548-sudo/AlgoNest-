import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Copy, Flag, GitBranch, Layers3, Pencil, Star,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import ProblemList from '../components/ProblemList.jsx';
import ProblemDetail from '../components/ProblemDetail.jsx';
import ProgressPanel from '../components/ProgressPanel.jsx';
import TopicProgress from '../components/TopicProgress.jsx';
import RatingSection from '../components/RatingSection.jsx';
import PersonalResources from '../components/PersonalResources.jsx';
import ModerationPanel from '../components/ModerationPanel.jsx';
import ReportDialog from '../components/ReportDialog.jsx';
import { useCloneSheet, useProgress, useSheet } from '../hooks/useSheets.js';
import {
  DIFFICULTY_TONE, STATUS_TONE, difficultyLabel, errorMessage, statusLabel,
} from '../lib/sheetUtils.js';

export default function SheetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportOpen, setReportOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const { data, isLoading, isError, error } = useSheet(id);
  const progressQuery = useProgress(id, { page: 1, limit: 300 });
  const clone = useCloneSheet();

  const sheet = data?.sheet;
  const canManage = data?.canManage;
  const problems = sheet?.problems ?? [];
  const progressById = useMemo(() => {
    const map = {};
    for (const item of progressQuery.data?.items ?? []) map[item.problemId] = item;
    return map;
  }, [progressQuery.data]);

  const selectedId = searchParams.get('p') && problems.some((p) => p.id === searchParams.get('p'))
    ? searchParams.get('p')
    : problems[0]?.id ?? null;
  const selectedProblem = problems.find((problem) => problem.id === selectedId) ?? null;
  const summary = progressQuery.data?.summary;

  const selectProblem = (problemId) => {
    const next = new URLSearchParams(searchParams);
    next.set('p', problemId);
    setSearchParams(next, { replace: true });
  };

  const handleClone = () => {
    setActionError('');
    clone.mutate(id, {
      onSuccess: (result) => navigate(`/app/sheets/${result.sheet.id}/edit`),
      onError: (cloneError) => setActionError(errorMessage(cloneError)),
    });
  };

  if (!id) return <Alert variant="error">No sheet id was provided.</Alert>;
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" /><Skeleton className="h-4 w-1/2" />
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <Skeleton className="h-96" /><Skeleton className="h-96" /><Skeleton className="h-96" />
        </div>
      </div>
    );
  }
  if (isError) return <Alert variant="error" title="Couldn't load this sheet">{errorMessage(error)}</Alert>;
  if (!sheet) return <EmptyState icon={BookOpen} title="Sheet unavailable" />;

  return (
    <div className="space-y-5">
      <Link to="/app/sheets" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All sheets
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={DIFFICULTY_TONE[sheet.difficulty]}>{difficultyLabel(sheet.difficulty)}</Badge>
              {canManage ? <Badge variant={STATUS_TONE[sheet.status]}>{statusLabel(sheet.status)}</Badge> : null}
              <Badge variant="neutral"><Layers3 className="mr-1 h-3 w-3" aria-hidden="true" />{sheet.problemCount} problems</Badge>
              {sheet.publishedVersion ? <Badge variant="accent"><GitBranch className="mr-1 h-3 w-3" aria-hidden="true" />v{sheet.publishedVersion}</Badge> : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{sheet.title}</h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">{sheet.description || 'No description provided.'}</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span>by {sheet.author?.name ?? 'AlgoNest creator'}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-warning" aria-hidden="true" />{Number(sheet.ratingSummary?.average ?? 0).toFixed(1)} ({sheet.ratingSummary?.count ?? 0})</span>
              <span aria-hidden="true">·</span>
              <span>{sheet.cloneCount ?? 0} clones</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canManage ? (
              <Link to={`/app/sheets/${sheet.id}/edit`}>
                <Button size="sm" variant="secondary" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit</Button>
              </Link>
            ) : null}
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleClone} loading={clone.isPending}>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Clone
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setReportOpen(true)}>
              <Flag className="h-3.5 w-3.5" aria-hidden="true" /> Report
            </Button>
          </div>
        </div>

        {actionError ? <Alert variant="error">{actionError}</Alert> : null}
        {sheet.isPublishedSnapshot ? (
          <Alert variant="info" title="Viewing published version">
            You are seeing the frozen published problem set. The author may be editing a newer draft; your progress stays tied to this version.
          </Alert>
        ) : null}

        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">Your progress</span>
            <span className="text-muted">{summary?.completed ?? 0}/{summary?.total ?? problems.length} · <strong className="text-primary">{summary?.percentage ?? 0}%</strong></span>
          </div>
          <ProgressBar value={summary?.percentage ?? 0} label="Overall sheet progress" />
          {summary?.dueRevisions ? (
            <p className="mt-2 text-xs text-warning">{summary.dueRevisions} problem(s) due for revision.</p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <div className="min-h-[28rem] lg:max-h-[calc(100vh-13rem)]">
          <ProblemList
            problems={problems}
            progressById={progressById}
            selectedId={selectedId}
            onSelect={selectProblem}
            loading={progressQuery.isLoading}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <ProblemDetail problem={selectedProblem} />
          <div className="rounded-2xl border border-line bg-surface p-4">
            <TopicProgress summary={summary} />
          </div>
        </div>

        <aside className="space-y-4" aria-label="Notes and progress">
          <ProgressPanel sheetId={id} problem={selectedProblem} progress={selectedProblem ? progressById[selectedProblem.id] : null} />
          <PersonalResources sheetId={id} problemId={selectedProblem?.id} />
          <RatingSection sheetId={id} />
          {canManage ? <ModerationPanel sheetId={id} sheet={sheet} canModerate={false} /> : null}
        </aside>
      </div>

      <ReportDialog sheetId={id} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
