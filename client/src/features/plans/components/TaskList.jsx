import { ListTodo } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import TaskItem from './TaskItem.jsx';
import { formatDate } from '../lib/planUtils.js';

export default function TaskList({ tasks = [], selectedDate, onStatus, busy = false, title = 'Tasks' }) {
  return (
    <section className="ag-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <span className="text-xs text-muted">{selectedDate ? formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' }) : `${tasks.length} tasks`} · {tasks.length} item(s)</span>
      </div>
      {!tasks.length ? <EmptyState compact icon={ListTodo} title="Nothing scheduled" description="Pick another day, or reschedule missed tasks to fill this one." /> : (
        <ul className="space-y-2">{tasks.map((task) => <TaskItem key={task.id} task={task} onStatus={onStatus} busy={busy} />)}</ul>
      )}
    </section>
  );
}
