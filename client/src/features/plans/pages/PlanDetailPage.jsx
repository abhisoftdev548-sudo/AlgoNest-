import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Archive, Pause, Pencil, Play, RefreshCw, Sparkles } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import PlanProgress from '../components/PlanProgress.jsx';
import PlanCalendar from '../components/PlanCalendar.jsx';
import TaskList from '../components/TaskList.jsx';
import OverloadAlert from '../components/OverloadAlert.jsx';
import { usePlan, usePlanTasks, useRegeneratePlan, useReschedulePlan, useTaskStatus, useUpdatePlan } from '../hooks/usePlans.js';
import { STATUS_TONE, errorMessage, formatDate, formatMinutes, planStatusLabel } from '../lib/planUtils.js';

export default function PlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(null);
  const { data, isLoading, isError, error } = usePlan(id);
  const taskParams = useMemo(() => {
    const params = { page: 1, limit: 300 };
    if (selectedDate) { params.from = selectedDate; params.to = selectedDate; }
    return params;
  }, [selectedDate]);
  const { data: taskData, isLoading: tasksLoading } = usePlanTasks(id, taskParams);
  const statusMutation = useTaskStatus(id);
  const reschedule = useReschedulePlan(id);
  const regenerate = useRegeneratePlan(id);
  const update = useUpdatePlan(id);

  if (isLoading) return <FullPageLoader label="Loading your plan…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this plan">{errorMessage(error)}</Alert>;
  if (!data?.plan) return <FullPageLoader label="Loading your plan…" />;
  const { plan, progress, streak, dailyLoad } = data;
  const today = new Date().toISOString().slice(0, 10);
  const todayLoad = dailyLoad.find((day) => day.date === today) ?? { minutes: 0 };
  const tasks = taskData?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/plans" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All plans</Link>
        <div className="flex flex-wrap gap-2">
          <Link to={`/app/plans/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit</Button></Link>
          <Button variant="secondary" size="sm" className="gap-1.5" loading={regenerate.isPending} disabled={plan.status === 'archived'} onClick={() => regenerate.mutate()}><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Regenerate</Button>
          {plan.status === 'active'
            ? <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => update.mutate({ status: 'paused' })}><Pause className="h-3.5 w-3.5" aria-hidden="true" /> Pause</Button>
            : plan.status === 'paused'
              ? <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => update.mutate({ status: 'active' })}><Play className="h-3.5 w-3.5" aria-hidden="true" /> Resume</Button>
              : null}
          <Button variant="danger" size="sm" className="gap-1.5" disabled={plan.status === 'archived'} onClick={() => update.mutate({ status: 'archived' }, { onSuccess: () => navigate('/app/plans') })}><Archive className="h-3.5 w-3.5" aria-hidden="true" /> Archive</Button>
        </div>
      </div>

      <header>
        <div className="flex flex-wrap items-center gap-2"><Badge variant={STATUS_TONE[plan.status] ?? 'neutral'}>{planStatusLabel(plan.status)}</Badge><Badge variant="primary">{plan.goal.replaceAll('_', ' ')}</Badge></div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{plan.title}</h1>
        <p className="mt-1.5 text-sm text-muted">{formatDate(plan.startDate)} → {formatDate(plan.endDate)} · {formatMinutes(plan.dailyMinutes)} per day · {plan.restDays.length} rest day(s) · mocks every {plan.mockIntervalDays} days</p>
        {plan.notes ? <p className="mt-1 text-xs italic text-muted">{plan.notes}</p> : null}
      </header>

      {location.state?.generated ? <Alert variant="success" className="flex items-center gap-2"><Sparkles className="h-4 w-4" aria-hidden="true" /> Generated {location.state.generated.tasks} tasks across {location.state.generated.usedDates?.length ?? 0} days, including {location.state.generated.mockTasks} mocks and {location.state.generated.revisionTasks} revision blocks.</Alert> : null}
      {reschedule.isSuccess ? <Alert variant="success">Rescheduled {reschedule.data?.moved ?? 0} missed task(s).</Alert> : null}
      {regenerate.isSuccess ? <Alert variant="success">Future pending tasks were regenerated; completed history is untouched.</Alert> : null}
      {[reschedule.error, regenerate.error, update.error, statusMutation.error].filter(Boolean).map((item, index) => <Alert key={index} variant="error">{errorMessage(item)}</Alert>)}

      <OverloadAlert
        warnings={plan.warnings} todayMinutes={todayLoad.minutes} capacity={plan.dailyMinutes}
        missedCount={progress.missed} onReschedule={() => reschedule.mutate({})} rescheduling={reschedule.isPending}
      />

      <PlanProgress progress={progress} streak={streak} plan={plan} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <TaskList
          tasks={tasks} selectedDate={selectedDate}
          title={selectedDate ? 'Tasks for this day' : 'All upcoming tasks'}
          busy={statusMutation.isPending}
          onStatus={(task, status) => statusMutation.mutate({ taskId: task.id, body: { status } })}
        />
        <div className="space-y-4">
          <PlanCalendar plan={plan} calendar={taskData?.calendar ?? []} selected={selectedDate} onSelect={(key) => setSelectedDate((previous) => previous === key ? null : key)} />
          {tasksLoading ? <p className="text-center text-xs text-muted">Loading tasks…</p> : null}
          <section className="ag-card p-4">
            <h2 className="text-sm font-semibold text-ink">Schedule rules</h2>
            <ul className="mt-2 space-y-1.5 text-xs text-muted">
              <li>• Tasks never exceed {plan.dailyMinutes} min/day without a warning.</li>
              <li>• {plan.revisionEnabled ? 'Revisions appear 1, 7 and 21 days after each lesson.' : 'Spaced revisions are disabled for this plan.'}</li>
              <li>• Past unfinished tasks become “missed” and can be rescheduled in one click.</li>
              <li>• Rest days are empty and never break your streak.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
