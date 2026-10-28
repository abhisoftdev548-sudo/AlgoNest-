import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import CreatorHero from '../components/CreatorHero.jsx';
import CreatorProfileForm from '../components/CreatorProfileForm.jsx';
import CreatorAnalytics from '../components/CreatorAnalytics.jsx';
import {
  useCreator, useCreatorAnalytics, useMyCreatorProfile, useMyAnalytics,
  useUpdateCreatorProfile,
} from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { errorMessage } from '../lib/resourceUtils.js';

export default function CreatorPage() {
  const { id } = useParams();
  const { pathname } = useLocation();
  // `/creators/me` is a STATIC route, so it provides no `:id` param.
  const isMe = pathname.endsWith('/creators/me') || id === 'me';
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [days, setDays] = useState(30);
  const [message, setMessage] = useState('');

  const me = useMyCreatorProfile(isMe);
  const profileQuery = useCreator(isMe ? null : id, { page: 1, limit: 12 });
  const ownAnalytics = useMyAnalytics({ days });
  const otherAnalytics = useCreatorAnalytics(isMe ? null : id, { days }, !isMe);
  const update = useUpdateCreatorProfile();

  const profile = isMe ? me.data?.profile : profileQuery.data?.profile;
  const loading = isMe ? me.isLoading : profileQuery.isLoading;
  const error = isMe ? me.error : profileQuery.error;
  const analytics = isMe ? ownAnalytics : otherAnalytics;
  const ownerId = profile?.user?.id ?? (isMe ? currentUserId : id);
  const isOwner = String(ownerId) === String(currentUserId);

  if (loading) return <div className="space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (error) return <Alert variant="error">{errorMessage(error)}</Alert>;
  if (!profile) return <Alert variant="info">This creator profile has not been set up yet.</Alert>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/app/creators" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All creators</Link>
      {message ? <Alert variant="success">{message}</Alert> : null}
      {update.isError ? <Alert variant="error">{errorMessage(update.error)}</Alert> : null}

      <CreatorHero profile={profile} />

      {isMe ? (
        <CreatorProfileForm
          initial={profile} pending={update.isPending}
          onSubmit={(body) => update.mutate(body, { onSuccess: () => setMessage('Creator profile saved.') })}
        />
      ) : null}

      {isOwner ? (
        <section className="ag-card p-5">
          <CreatorAnalytics data={analytics.data} isLoading={analytics.isLoading} isError={analytics.isError} error={analytics.error} days={days} onDaysChange={setDays} />
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-ink">Published resources</h2>
        {profile.resources?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{profile.resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div>
        ) : <EmptyState compact title="No published resources yet" description="Once this creator publishes a resource it will appear here." />}
      </section>
    </div>
  );
}
