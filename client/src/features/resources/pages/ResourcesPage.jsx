import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FolderOpen, Plus, ShieldCheck, Users, Zap } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import { SHEET_TOPICS } from '@algonest/shared/constants';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ResourceFilters from '../components/ResourceFilters.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import CreatorCard from '../components/CreatorCard.jsx';
import ReportQueue from '../components/ReportQueue.jsx';
import {
  useCreatorList, useResourceList, useResolveReport, useResourceReports,
  useRunLinkCheck, useSavedResources,
} from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { EMPTY_FILTERS, errorMessage } from '../lib/resourceUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function ResourcesPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, topic: searchParams.get('topic') ?? '' }));
  const [page, setPage] = useState(1);
  const [reportStatus, setReportStatus] = useState('open');
  const debouncedSearch = useDebouncedValue(filters.q, 300);

  const params = useMemo(() => {
    const clean = { page, limit: PAGE_SIZE, sort: filters.sort || 'newest' };
    if (debouncedSearch) clean.q = debouncedSearch;
    for (const key of ['topic', 'level', 'language', 'type', 'pricing', 'platform']) if (filters[key]) clean[key] = filters[key];
    if (tab === 'mine') clean.mine = 'true';
    if (tab === 'review') clean.status = 'pending_review';
    return clean;
  }, [debouncedSearch, filters, page, tab]);

  const catalogue = useResourceList(params);
  const saved = useSavedResources(useMemo(() => ({ page, limit: PAGE_SIZE, sort: filters.sort }), [page, filters.sort]));
  const creators = useCreatorList(useMemo(() => ({ page, limit: PAGE_SIZE }), [page]));
  const reports = useResourceReports({ page: 1, limit: 20, status: reportStatus }, isStaff && tab === 'reports');
  const resolve = useResolveReport();
  const linkCheck = useRunLinkCheck();

  const active = tab === 'saved' ? saved : tab === 'creators' ? creators : catalogue;
  const data = active.data;
  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const change = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  const tabs = [
    { id: 'explore', label: 'Explore' },
    { id: 'saved', label: 'Saved' },
    { id: 'mine', label: 'My submissions' },
    { id: 'creators', label: 'Creators' },
    ...(isStaff ? [{ id: 'reports', label: 'Reports' }, { id: 'review', label: 'Review queue' }] : []),
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText text="RESOURCE DIRECTORY // CURATED & COMMUNITY-REVIEWED" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Resources</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">Videos, articles, GitHub repos, PDFs and courses — filtered by topic, level, language, type and price. Every submission is reviewed before it goes public, and links are checked nightly.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isStaff ? <Button variant="secondary" className="gap-1.5" loading={linkCheck.isPending} onClick={() => linkCheck.mutate({ limit: 20, force: 'false' })}><Zap className="h-4 w-4" aria-hidden="true" /> Check links</Button> : null}
          <Link to="/app/resources/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Submit resource</Button></Link>
        </div>
      </header>

      {linkCheck.isSuccess ? <Alert variant="success">Checked {linkCheck.data?.checked ?? 0} link(s) · {linkCheck.data?.broken ?? 0} broken · {linkCheck.data?.flagged ?? 0} newly flagged.</Alert> : null}
      {linkCheck.isError ? <Alert variant="error">{errorMessage(linkCheck.error)}</Alert> : null}

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => changeTab(item.id)} aria-pressed={tab === item.id} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}>
            {item.id === 'reports' || item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}{item.label}
          </button>
        ))}
        {active.isFetching && !active.isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      {tab === 'reports' && isStaff ? (
        <section className="ag-card p-5">
          <ReportQueue data={reports.data} isLoading={reports.isLoading} isError={reports.isError} error={reports.error}
            status={reportStatus} onChangeStatus={(value) => setReportStatus(value)} resolving={resolve.isPending}
            onResolve={(reportId, status) => resolve.mutate({ reportId, body: { status, note: '' } })} />
          {resolve.isError ? <Alert variant="error" className="mt-3">{errorMessage(resolve.error)}</Alert> : null}
        </section>
      ) : (
        <>
          {tab !== 'creators' ? <ResourceFilters filters={filters} onChange={change} topics={SHEET_TOPICS} showPlatform={isStaff} /> : null}
          {active.isError ? <Alert variant="error" title="Couldn't load resources">{errorMessage(active.error)}</Alert> : null}
          {active.isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 w-full" />)}</div>
            : items.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => tab === 'creators'
              ? <CreatorCard key={item.id} profile={item} />
              : <ResourceCard key={item.id} resource={item} showStatus={tab !== 'explore'} />)}</div>
              : <EmptyState icon={tab === 'creators' ? Users : FolderOpen} title={tab === 'saved' ? 'Nothing saved yet' : tab === 'mine' ? 'No submissions yet' : 'No resources match these filters'} description={tab === 'saved' ? 'Save a resource to build your personal reading list.' : 'Try clearing the filters, or submit the first resource.'} action={<Link to="/app/resources/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Submit a resource</Button></Link>} />}
          {pagination?.totalPages > 1 ? (
            <nav className="flex items-center justify-between gap-3" aria-label="Resources pagination">
              <p className="text-xs text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} item(s)</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button>
                <Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
