import { Link } from 'react-router-dom';
import { CalendarClock, Timer } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { formatDate, formatMinutes, relativeDay } from '../../plans/lib/planUtils.js';

export default function UpcomingMockCard({ mock, others = [], planId }) {
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><CalendarClock className="h-4 w-4 text-warning" aria-hidden="true" /> Upcoming mock</h2><Badge variant="warning">every 14 days</Badge></div>
      {!mock ? <EmptyState compact icon={Timer} title="No mock scheduled" description="Plans insert a full-length mock roughly every two weeks." />
        : <div className="mt-3 rounded-xl border border-warning/25 bg-warning/8 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warning">{relativeDay(mock.date)} · {formatDate(mock.date, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <h3 className="mt-1.5 text-base font-bold text-ink">{mock.title}</h3>
          <p className="mt-1 text-xs text-muted">{formatMinutes(mock.estimatedMinutes)} · {mock.topic} · {mock.status === 'missed' ? 'needs rescheduling' : mock.status}</p>
          <Link to={mock.refType === 'MockTest' ? `/app/mocks/${mock.refId}` : '/app/mocks'} className="mt-3 inline-block"><Button size="sm" variant="secondary">Open mock</Button></Link>
        </div>}
      {others.length > 1 ? <p className="mt-3 text-xs text-muted">{others.length - 1} more mock(s) in the next 30 days.</p> : null}
      {planId ? <Link to={`/app/plans/${planId}`} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">View plan calendar →</Link> : null}
    </section>
  );
}
