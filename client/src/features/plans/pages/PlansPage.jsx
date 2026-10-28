import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Select from '../../../components/ui/Select.jsx';
import PlanCard from '../components/PlanCard.jsx';
import { useActivePlan, useArchivePlan, usePlanList } from '../hooks/usePlans.js';
import { useIsDark } from '../../../store/themeStore.js';
import { STATUS_TONE, errorMessage, formatDate, planStatusLabel } from '../lib/planUtils.js';

const STATUS_OPTIONS = [{ value: '', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'paused', label: 'Paused' }, { value: 'completed', label: 'Completed' }, { value: 'archived', label: 'Archived' }];

export default function PlansPage() {
  const isDark = useIsDark();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ page, limit: 12, ...(status ? { status } : {}) }), [page, status]);
  const { data, isLoading, isError, error } = usePlanList(params);
  const { data: activeData } = useActivePlan();
  const archive = useArchivePlan();
  const activePlan = activeData?.plan;
  const plans = data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText text="ADAPTIVE PLANS // DAILY EXECUTION" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Your plans</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">A day-by-day schedule built from your goal, time budget, rest days and chosen content. Missed days reschedule; revisions repeat on day 1, 7 and 21.</p>
        </div>
        <Link to="/app/plans/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New plan</Button></Link>
      </header>

      {activePlan ? (
        <section className="ag-card flex flex-wrap items-center justify-between gap-4 border-primary/25 bg-primary/8 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Active plan</p>
              <h2 className="mt-1 text-lg font-bold text-ink">{activePlan.title}</h2>
              <p className="mt-1 text-xs text-muted">{formatDate(activePlan.startDate)} → {formatDate(activePlan.endDate)} · {activePlan.dailyMinutes} min/day · {activePlan.stats?.completionPercentage ?? 0}% complete</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/app"><Button variant="secondary" size="sm">Today’s tasks</Button></Link>
            <Link to={`/app/plans/${activePlan.id}`}><Button size="sm">Open plan</Button></Link>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select label="Filter by status" options={STATUS_OPTIONS} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} />
        <p className="text-xs text-muted">{data?.pagination?.total ?? 0} plan(s)</p>
      </div>

      {archive.isError ? <Alert variant="error">{errorMessage(archive.error)}</Alert> : null}
      {isError ? <Alert variant="error" title="Couldn't load plans">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-52 w-full" />)}</div>
        : plans.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{plans.map((plan) => (
          <div key={plan.id} className="relative">
            <PlanCard plan={plan} />
            {plan.status === 'active' ? (
              <button type="button" onClick={() => archive.mutate(plan.id)} disabled={archive.isPending} className="absolute right-3 top-3 rounded-lg border border-line bg-surface px-2 py-1 text-[10px] font-semibold text-muted hover:text-danger" aria-label={`Archive ${plan.title}`}>
                <span className="sr-only">{planStatusLabel(plan.status)}</span>Archive
              </button>
            ) : null}
          </div>
        ))}</div>
          : <EmptyState icon={CalendarRange} title="No plans yet" description="Create your first adaptive plan and we will distribute every task for you." action={<Link to="/app/plans/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Build a plan</Button></Link>} />}

      {data?.pagination?.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Plans pagination">
          <p className="text-xs text-muted">Page {data.pagination.page} of {data.pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!data.pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button>
            <Button size="sm" variant="secondary" disabled={!data.pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
          </div>
        </nav>
      ) : null}
      <span className="sr-only">{Object.keys(STATUS_TONE).length} statuses available</span>
    </div>
  );
}
