import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import ResourceSubmitForm from '../components/ResourceSubmitForm.jsx';
import ResourceModerationPanel from '../components/ResourceModerationPanel.jsx';
import { useCreateResource, useResource, useUpdateResource } from '../hooks/useResources.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { errorMessage, statusLabel } from '../lib/resourceUtils.js';

function CreateResource() {
  const navigate = useNavigate();
  const create = useCreateResource();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/resources" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All resources</Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Submit a resource</h1>
        <p className="mt-1.5 text-sm text-muted">Share a video, article, repository, PDF or course. We check for duplicate links automatically; a moderator reviews every submission before it goes public.</p>
      </header>
      <section className="ag-card p-5 sm:p-6">
        <ResourceSubmitForm
          pending={create.isPending} error={create.isError ? errorMessage(create.error) : ''}
          onSubmit={(payload) => create.mutate(payload, { onSuccess: (result) => navigate(`/app/resources/${result.resource.id}`, { replace: true }) })}
        />
      </section>
      <section className="ag-card flex items-start gap-3 p-5 text-sm text-muted">
        <Plus className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>Prefer a private link that nobody else can see? Use your personal library from any sheet — those links are never moderated or published.</p>
      </section>
    </div>
  );
}

function EditResource({ id }) {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.user?.role);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data, isLoading, isError, error } = useResource(id);
  const update = useUpdateResource(id);

  if (isLoading) return <FullPageLoader label="Loading submission…" />;
  if (isError) return <div className="mx-auto max-w-xl"><Alert variant="error">{errorMessage(error)}</Alert></div>;
  const resource = data?.resource;
  if (!resource) return <FullPageLoader label="Loading submission…" />;
  const isOwner = String(resource.author?.id) === String(currentUserId);
  const canModerate = ['content_editor', 'content_moderator', 'super_admin'].includes(role) && !isOwner;
  const editable = ['draft', 'changes_requested', 'rejected', 'approved'].includes(resource.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`/app/resources/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to resource</Link>
      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Edit submission</h1><p className="mt-1.5 text-sm text-muted">Current status: <strong>{statusLabel(resource.status)}</strong>. Published resources must start a new revision before editing.</p></header>
      {!editable ? <Alert variant="warning">This submission is {statusLabel(resource.status).toLowerCase()} and cannot be edited. Start a revision from the resource page.</Alert> : (
        <section className="ag-card p-5 sm:p-6">
          <ResourceSubmitForm
            initial={resource} submitLabel="Save changes" pending={update.isPending}
            error={update.isError ? errorMessage(update.error) : ''}
            onSubmit={(payload) => {
              const { submit, ...body } = payload;
              void submit;
              update.mutate(body, { onSuccess: () => navigate(`/app/resources/${id}`) });
            }}
          />
        </section>
      )}
      <ResourceModerationPanel resource={resource} canModerate={canModerate} />
    </div>
  );
}

export default function ResourceEditorPage() {
  const { id } = useParams();
  return id ? <EditResource id={id} /> : <CreateResource />;
}
