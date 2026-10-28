import { Flag } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { formatDate } from '../lib/resourceUtils.js';

export default function ReportQueue({ data, isLoading, isError, error, status, onChangeStatus, onResolve, resolving = false }) {
  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)}</div>;
  if (isError) return <Alert variant="error">{error?.message ?? 'Could not load reports.'}</Alert>;
  const items = data?.items ?? [];
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Flag className="h-4 w-4 text-danger" aria-hidden="true" /> Report queue</h2>
        <div className="flex gap-1">
          {['open', 'resolved', 'dismissed'].map((value) => (
            <button key={value} type="button" onClick={() => onChangeStatus(value)} aria-pressed={status === value} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${status === value ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2'}`}>{value}</button>
          ))}
        </div>
      </div>
      {!items.length ? <EmptyState compact icon={Flag} title="Queue is clear" description="No reports with this status." /> : (
        <ul className="space-y-2">{items.map((report) => (
          <li key={report.id} className="rounded-xl border border-line bg-surface p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{report.resource?.title ?? 'Removed resource'}</p>
                <p className="mt-0.5 text-xs text-muted">{report.reporter?.name ?? 'Student'} · {formatDate(report.createdAt)} · <Badge variant="warning">{report.reason.replaceAll('_', ' ')}</Badge></p>
              </div>
              {report.status === 'open' ? <div className="flex gap-1"><Button size="sm" variant="secondary" disabled={resolving} onClick={() => onResolve(report.id, 'resolved')}>Resolve</Button><Button size="sm" variant="ghost" disabled={resolving} onClick={() => onResolve(report.id, 'dismissed')}>Dismiss</Button></div> : <Badge variant="success">{report.status}</Badge>}
            </div>
            <p className="mt-2 text-xs text-muted">{report.details}</p>
          </li>
        ))}</ul>
      )}
    </section>
  );
}
