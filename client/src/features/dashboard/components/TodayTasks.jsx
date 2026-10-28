import { Link } from 'react-router-dom';
import { ListTodo } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { useTaskStatus } from '../../plans/hooks/usePlans.js';
import { formatMinutes } from '../../plans/lib/planUtils.js';
import TaskItem from '../../plans/components/TaskItem.jsx';

/** Today's checklist. Optimistic-free: each mutation invalidates the dashboard. */
export default function TodayTasks({ today = {}, planId, overload = {} }) {
  const mutation = useTaskStatus(planId);
  const tasks = today.tasks ?? [];
  const done = today.done ?? 0;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <section className="ag-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><ListTodo className="h-4 w-4 text-primary" aria-hidden="true" /> Today’s tasks</h2>
        <span className="text-xs text-muted">{done}/{tasks.length} done · {formatMinutes(today.minutes)}</span>
      </div>
      <ProgressBar className="mt-3" value={percent} label={`${percent}% of today done`} tone={percent >= 70 ? 'success' : 'primary'} />
      {overload.isOverloaded ? <p className="mt-2 rounded-lg border border-warning/30 bg-warning/8 p-2 text-xs text-warning">Overloaded: {formatMinutes(overload.todayMinutes)} planned against a {formatMinutes(overload.capacity)} budget ({overload.ratio}%).</p> : null}
      {mutation.isError ? <p className="mt-2 text-xs text-danger">{mutation.error?.message ?? 'Could not update that task.'}</p> : null}
      {!tasks.length ? <EmptyState compact icon={ListTodo} title="Nothing due today" description={planId ? 'Check your plan calendar or reschedule missed tasks.' : 'Create a plan to get a daily checklist.'} />
        : <ul className="mt-3 space-y-2">{tasks.map((task) => <TaskItem key={task.id} task={task} busy={mutation.isPending} onStatus={(item, status) => mutation.mutate({ taskId: item.id, body: { status } })} />)}</ul>}
      <div className="mt-4 flex flex-wrap gap-2">
        {planId ? <Link to={`/app/plans/${planId}`}><Button variant="secondary" size="sm">Open full plan</Button></Link> : <Link to="/app/plans/new"><Button size="sm">Build a plan</Button></Link>}
      </div>
    </section>
  );
}
