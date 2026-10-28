import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ClipboardList, Plus, ShieldCheck } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import MockFilters, { EMPTY_MOCK_FILTERS } from '../components/MockFilters.jsx';
import MockCard from '../components/MockCard.jsx';
import { useMockList } from '../hooks/useMocks.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { errorMessage } from '../lib/mockUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function MocksPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(EMPTY_MOCK_FILTERS);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(filters.q, 300);

  const params = useMemo(() => {
    const clean = { page, limit: PAGE_SIZE, sort: filters.sort || 'newest' };
    if (debouncedSearch) clean.q = debouncedSearch;
    for (const key of ['topic', 'difficulty']) if (filters[key]) clean[key] = filters[key];
    if (tab === 'mine') clean.mine = 'true';
    if (tab === 'review') clean.status = 'pending_review';
    return clean;
  }, [debouncedSearch, filters, page, tab]);

  const { data, isLoading, isError, error, isFetching } = useMockList(params);
  const mocks = data?.items ?? [];
  const pagination = data?.pagination;
  const changeFilters = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText text="MOCK TESTS // FULL-LENGTH SIMULATION" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Mock tests</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">Sectional or global timers, negative marking, cut-offs and deep result analysis. The server owns the clock — disconnect and resume without losing a second.</p>
        </div>
        <Link to="/app/mocks/new"><Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New mock</Button></Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { id: 'explore', label: 'Explore' }, { id: 'mine', label: 'My mocks' },
          ...(isStaff ? [{ id: 'review', label: 'Review queue' }] : []),
        ].map((item) => (
          <button key={item.id} type="button" onClick={() => changeTab(item.id)} aria-pressed={tab === item.id} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}>
            {item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}{item.label}
          </button>
        ))}
        {isFetching && !isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      <MockFilters filters={filters} onChange={changeFilters} />
      {isError ? <Alert variant="error" title="Couldn't load mocks">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-60 w-full" />)}</div>
        : mocks.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{mocks.map((mock) => <MockCard key={mock.id} mock={mock} showStatus={tab !== 'explore'} />)}</div>
          : <EmptyState icon={ClipboardList} title={tab === 'mine' ? 'You have no mocks yet' : tab === 'review' ? 'Review queue is clear' : 'No mocks match these filters'} description={tab === 'mine' ? 'Create a draft, add timed sections with questions, then submit it for review.' : 'Try clearing the filters, or create the first mock.'} action={<Link to="/app/mocks/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Create a mock</Button></Link>} />}

      {pagination && pagination.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Mocks pagination">
          <p className="text-xs text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} mock(s)</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button>
            <Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
