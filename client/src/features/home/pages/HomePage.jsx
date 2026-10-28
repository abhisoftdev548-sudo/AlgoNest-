import { Link } from 'react-router-dom';
import { Activity, CalendarClock, CheckCircle2, Goal, TriangleAlert } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { useCurrentUser } from '../../auth/store/authStore.js';
import { useDashboard } from '../../dashboard/hooks/useDashboard.js';
import DashboardHero from '../../dashboard/components/DashboardHero.jsx';
import StreakCard from '../../dashboard/components/StreakCard.jsx';
import TodayTasks from '../../dashboard/components/TodayTasks.jsx';
import WeakTopicsCard from '../../dashboard/components/WeakTopicsCard.jsx';
import UpcomingMockCard from '../../dashboard/components/UpcomingMockCard.jsx';
import PendingRevisions from '../../dashboard/components/PendingRevisions.jsx';
import { errorMessage, formatMinutes } from '../../plans/lib/planUtils.js';

/**
 * Student dashboard — "what should I do now". One aggregated API read feeds
 * every card; React Bits is confined to the hero (polish only), while all
 * data-heavy sections are plain, accessible Tailwind.
 */
export default function HomePage() {
  const user = useCurrentUser();
  const { data, isLoading, isError, error, refetch } = useDashboard({ horizon: 30 });
  const goalLabel = (data?.plan?.goal ?? user?.goal ?? 'not_set').replaceAll('_', ' ');

  if (isLoading) return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-28 w-full" /><Skeleton className="h-44 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 w-full" />)}</div>
      <div className="grid gap-4 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-64 w-full" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <DashboardHero data={data} isError={isError} error={error} />

      {data?.missedCount > 0 ? (
        <Alert variant="warning" title={`${data.missedCount} task(s) need attention`}>
          Past unfinished tasks were marked missed. <Link to={`/app/plans/${data.plan?.id ?? ''}`} className="font-semibold underline">Open your plan</Link> and reschedule them into the remaining days.
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Today', Icon: CalendarClock, value: `${data?.today?.done ?? 0}/${data?.today?.total ?? 0}`, hint: `${formatMinutes(data?.today?.minutes ?? 0)} planned`, tone: 'text-primary' },
          { label: 'Plan completion', Icon: CheckCircle2, value: `${data?.progress?.completionPercentage ?? 0}%`, hint: `${data?.progress?.done ?? 0} of ${data?.progress?.total ?? 0} tasks`, tone: 'text-success' },
          { label: 'Your goal', Icon: Goal, value: goalLabel, hint: data?.plan ? data.plan.title : 'No active plan', tone: 'text-accent' },
          { label: 'Recent activity', Icon: Activity, value: `${data?.recentActivity?.length ?? 0}`, hint: 'quiz + mock results', tone: 'text-warning' },
        ].map(({ label, Icon, value, hint, tone }, index) => (
          <div key={label} className="ag-card ag-rise p-5 transition-colors hover:border-primary/40" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-muted">{label}</p><Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" /></div>
            <p className="mt-2 truncate text-xl font-bold text-ink">{value}</p>
            <p className="mt-1 truncate text-xs text-muted">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><TodayTasks today={data?.today} planId={data?.plan?.id} overload={data?.overload} /></div>
        <StreakCard streak={data?.streak} progress={data?.progress} plan={data?.plan} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <WeakTopicsCard topics={data?.weakTopics} />
        <UpcomingMockCard mock={data?.upcomingMock} others={data?.upcomingMocks} planId={data?.plan?.id} />
        <PendingRevisions items={data?.pendingRevisions} planId={data?.plan?.id} />
      </div>

      {data?.overload?.warnings?.length ? (
        <details className="ag-card group p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ink">
            <TriangleAlert className="h-4 w-4 text-warning" aria-hidden="true" /> Workload warnings <Badge variant="warning">{data.overload.warnings.length}</Badge>
            <span className="ml-auto text-xs font-normal text-muted group-open:hidden">Show</span>
          </summary>
          <ul className="mt-3 space-y-1.5 text-xs text-muted">{data.overload.warnings.map((warning, index) => <li key={`${warning.code}-${index}`}>• {warning.date ? `${warning.date} — ` : ''}{warning.message}</li>)}</ul>
        </details>
      ) : null}

      {isError ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/8 p-4"><p className="text-sm text-danger">{errorMessage(error)}</p><Button size="sm" variant="secondary" onClick={() => refetch()}>Retry</Button></div> : null}
    </div>
  );
}
