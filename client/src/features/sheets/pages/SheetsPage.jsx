import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Plus, ShieldCheck } from 'lucide-react';
import { ShinyText } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import SheetFilters, { EMPTY_SHEET_FILTERS } from '../components/SheetFilters.jsx';
import SheetCard from '../components/SheetCard.jsx';
import { useSheetList } from '../hooks/useSheets.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import { errorMessage } from '../lib/sheetUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];
const PAGE_SIZE = 12;

export default function SheetsPage() {
  const isDark = useIsDark();
  const role = useAuthStore((state) => state.user?.role);
  const isStaff = STAFF_ROLES.includes(role);
  const [tab, setTab] = useState('explore');
  const [filters, setFilters] = useState(EMPTY_SHEET_FILTERS);
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    const clean = { page, limit: PAGE_SIZE, sort: filters.sort || 'newest' };
    for (const key of ['q', 'topic', 'difficulty', 'goal', 'platform']) {
      if (filters[key]) clean[key] = filters[key];
    }
    if (filters.bookmarked) clean.bookmarked = 'true';
    if (tab === 'mine') clean.mine = 'true';
    if (tab === 'review') clean.status = 'pending_review';
    return clean;
  }, [filters, page, tab]);

  const { data, isLoading, isError, error, isFetching } = useSheetList(params);
  const sheets = data?.items ?? [];
  const pagination = data?.pagination;

  const changeFilters = (next) => { setFilters(next); setPage(1); };
  const changeTab = (next) => { setTab(next); setPage(1); };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ShinyText
            text="DSA SHEETS // CURATED PROGRESSIONS"
            speed={4}
            color={isDark ? '#94a5bd' : '#56657a'}
            shineColor={isDark ? '#2dd4bf' : '#0d9488'}
            className="text-[11px] font-bold tracking-[0.2em]"
          />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Sheets</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            Work through a structured problem list, track every solve and keep your own notes. Published sheets are versioned, so your progress never breaks.
          </p>
        </div>
        <Link to="/app/sheets/new">
          <Button className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> New sheet</Button>
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { id: 'explore', label: 'Explore' },
          { id: 'mine', label: 'My sheets' },
          ...(isStaff ? [{ id: 'review', label: 'Review queue' }] : []),
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeTab(item.id)}
            aria-pressed={tab === item.id}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`}
          >
            {item.id === 'review' ? <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" /> : null}
            {item.label}
          </button>
        ))}
        {isFetching && !isLoading ? <span className="ml-auto text-xs text-muted">Refreshing…</span> : null}
      </div>

      <SheetFilters filters={filters} onChange={changeFilters} />

      {isError ? <Alert variant="error" title="Couldn't load sheets">{errorMessage(error)}</Alert> : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-60 w-full" />)}
        </div>
      ) : sheets.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sheets.map((sheet) => <SheetCard key={sheet.id} sheet={sheet} showStatus={tab !== 'explore'} />)}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={tab === 'mine' ? 'You have no sheets yet' : tab === 'review' ? 'Review queue is clear' : 'No sheets match these filters'}
          description={tab === 'mine'
            ? 'Create a draft, add problems from your favourite judge, and submit it for review.'
            : 'Try clearing the filters, or create the first sheet for this topic.'}
          action={<Link to="/app/sheets/new"><Button variant="secondary" className="gap-2"><Plus className="h-4 w-4" aria-hidden="true" /> Create a sheet</Button></Link>}
        />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Sheets pagination">
          <p className="text-xs text-muted">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} sheet(s)
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={!pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1">
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
            </Button>
            <Button size="sm" variant="secondary" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">
              Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
