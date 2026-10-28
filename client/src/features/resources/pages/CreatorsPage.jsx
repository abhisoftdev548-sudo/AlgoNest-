import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Users } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import CreatorCard from '../components/CreatorCard.jsx';
import { useCreatorList, useMyCreatorProfile } from '../hooks/useResources.js';
import useDebouncedValue from '../../../hooks/useDebouncedValue.js';
import { errorMessage } from '../lib/resourceUtils.js';

export default function CreatorsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(q, 300);
  const { data, isLoading, isError, error } = useCreatorList({ page, limit: 12, ...(debounced ? { q: debounced } : {}) });
  const mine = useMyCreatorProfile();
  const profiles = data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Creators</h1><p className="mt-1.5 max-w-2xl text-sm text-muted">Meet the people behind the sheets, quizzes, mocks and resources you use. Open a profile to see their published work.</p></div>
        <Button className="gap-2" onClick={() => navigate('/app/creators/me')}>My creator page</Button>
      </header>
      <div className="max-w-sm"><Input label="Search creators" icon={Search} value={q} onChange={(event) => { setQ(event.target.value); setPage(1); }} placeholder="Name or expertise…" /></div>
      {mine.isSuccess && mine.data?.profile ? <p className="text-xs text-muted">Your profile: <Link to="/app/creators/me" className="font-semibold text-primary hover:underline">{mine.data.profile.displayName}</Link></p> : null}
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-52 w-full" />)}</div>
        : profiles.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{profiles.map((profile) => <CreatorCard key={profile.id} profile={profile} />)}</div>
          : <EmptyState icon={Users} title="No creators found" description="Try a different search, or create your own creator profile." />}
      {data?.pagination?.totalPages > 1 ? <nav className="flex items-center justify-between gap-3" aria-label="Creators pagination"><p className="text-xs text-muted">Page {data.pagination.page} of {data.pagination.totalPages}</p><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={!data.pagination.hasPrev} onClick={() => setPage((value) => Math.max(1, value - 1))} className="gap-1"><ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</Button><Button size="sm" variant="secondary" disabled={!data.pagination.hasNext} onClick={() => setPage((value) => value + 1)} className="gap-1">Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Button></div></nav> : null}
    </div>
  );
}
