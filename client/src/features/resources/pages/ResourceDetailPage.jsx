import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import ResourceDetail from '../components/ResourceDetail.jsx';
import ResourceModerationPanel from '../components/ResourceModerationPanel.jsx';
import {
  useFeedback, useRateResource, useReportResource, useResource,
  useResourceRatings, useSaveResource, useTrackResourceEvent,
} from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { errorMessage } from '../lib/resourceUtils.js';

const STAFF_ROLES = ['content_editor', 'content_moderator', 'super_admin'];

export default function ResourceDetailPage() {
  const { id } = useParams();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const role = useAuthStore((state) => state.user?.role);
  const { data, isLoading, isError, error } = useResource(id);
  const ratingParams = useMemo(() => ({ page: 1, limit: 10 }), []);
  const ratings = useResourceRatings(id, ratingParams, Boolean(id));
  const save = useSaveResource(id);
  const rate = useRateResource(id);
  const feedback = useFeedback(id);
  const report = useReportResource(id);
  const track = useTrackResourceEvent(id);

  if (isLoading) return <FullPageLoader label="Loading resource…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error" title="Couldn't load this resource">{errorMessage(error)}</Alert></div>;
  const resource = data?.resource;
  if (!resource) return <FullPageLoader label="Loading resource…" />;
  const isOwner = String(resource.author?.id) === String(currentUserId);
  const canManage = isOwner || STAFF_ROLES.includes(role);
  const canModerate = STAFF_ROLES.includes(role) && !isOwner;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/resources" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All resources</Link>
        {canManage ? <Link to={`/app/resources/${id}/edit`}><Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit</Button></Link> : null}
      </div>

      {[save.error, rate.error, feedback.error, report.error, track.error].filter(Boolean).map((item, index) => <Alert key={index} variant="error">{errorMessage(item)}</Alert>)}
      {report.isSuccess ? <Alert variant="success">Thanks — a moderator will review your report.</Alert> : null}

      <ResourceDetail
        resource={{ ...resource, myAuthorId: currentUserId }}
        ratings={ratings.data} ratingsLoading={ratings.isLoading} ratingsError={ratings.isError} ratingsLoadError={ratings.error}
        canManage={canManage}
        saving={save.isPending} ratingPending={rate.isPending} feedbackPending={feedback.isPending} reportPending={report.isPending}
        reportError={report.isError ? errorMessage(report.error) : ''}
        onSave={() => save.mutate(resource.saved)}
        onRate={(body) => rate.mutate(body)}
        onFeedback={(helpful) => feedback.mutate(helpful)}
        onTrack={(type) => track.mutate(type)}
        onReport={(body, done) => report.mutate(body, { onSuccess: done })}
        moderation={canManage ? <ResourceModerationPanel resource={resource} canModerate={canModerate} /> : null}
      />
    </div>
  );
}
