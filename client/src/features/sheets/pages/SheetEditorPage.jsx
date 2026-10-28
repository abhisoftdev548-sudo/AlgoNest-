import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Archive, FilePlus2, Link2, ListPlus, Plus, Save,
} from 'lucide-react';
import { GOAL_OPTIONS } from '@algonest/shared/constants';
import { sheetCreateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import ProblemList from '../components/ProblemList.jsx';
import ProblemEditor from '../components/ProblemEditor.jsx';
import BulkImportDialog from '../components/BulkImportDialog.jsx';
import ModerationPanel from '../components/ModerationPanel.jsx';
import { DIFFICULTY_OPTIONS, STATUS_TONE, contractErrors, errorMessage, statusLabel } from '../lib/sheetUtils.js';
import {
  useArchiveSheet, useCreateSheet, useProblemMutations, useSheet, useUpdateSheet,
} from '../hooks/useSheets.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const MODERATOR_ROLES = ['content_editor', 'content_moderator', 'super_admin'];

const BLANK = { title: '', description: '', difficulty: 'medium', goals: [], tags: '', topics: '' };

function fromSheet(sheet) {
  return {
    title: sheet.title ?? '',
    description: sheet.description ?? '',
    difficulty: sheet.difficulty ?? 'medium',
    goals: sheet.goals ?? [],
    tags: (sheet.tags ?? []).join(', '),
    topics: (sheet.topics ?? []).join(', '),
  };
}

/** Shared metadata form for both "create" and "edit". */
function MetadataFields({ form, setForm, errors }) {
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const toggleGoal = (value) => set('goals', form.goals.includes(value)
    ? form.goals.filter((goal) => goal !== value)
    : [...form.goals, value]);

  return (
    <div className="space-y-4">
      <Input label="Title" value={form.title} error={errors.title} onChange={(e) => set('title', e.target.value)} placeholder="Striver A2Z — Arrays" />
      <div>
        <label htmlFor="sheet-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea
          id="sheet-description"
          rows={4}
          maxLength={2000}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What does this sheet cover, and who is it for?"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        {errors.description ? <p role="alert" className="mt-1 text-xs text-danger">{errors.description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} error={errors.difficulty} onChange={(e) => set('difficulty', e.target.value)} />
        <Input label="Tags (comma separated)" value={form.tags} error={errors.tags} onChange={(e) => set('tags', e.target.value)} placeholder="interview, patterns" />
      </div>
      <Input label="Topics (comma separated)" value={form.topics} error={errors.topics} onChange={(e) => set('topics', e.target.value)} placeholder="Arrays, Two Pointers" hint="Problem topics are added automatically on import." />
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Relevant goals</legend>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <label
              key={goal.value}
              className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${form.goals.includes(goal.value) ? 'border-primary bg-primary/12 text-primary' : 'border-line text-muted hover:border-primary/40'}`}
            >
              <input type="checkbox" checked={form.goals.includes(goal.value)} onChange={() => toggleGoal(goal.value)} className="sr-only" />
              {goal.label}
            </label>
          ))}
        </div>
        {errors.goals ? <p role="alert" className="mt-1 text-xs text-danger">{errors.goals}</p> : null}
      </fieldset>
    </div>
  );
}

export default function SheetEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState({ open: false, initial: null });
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const role = useAuthStore((state) => state.user?.role);
  const isModerator = MODERATOR_ROLES.includes(role);

  const sheetQuery = useSheet(id);
  const create = useCreateSheet();
  const update = useUpdateSheet(id);
  const archive = useArchiveSheet();
  const mutations = useProblemMutations(id);
  const sheet = sheetQuery.data?.sheet;
  const canManage = sheetQuery.data?.canManage;

  useEffect(() => { if (sheet) { setForm(fromSheet(sheet)); setErrors({}); } }, [sheet]);

  const problems = useMemo(() => sheet?.problems ?? [], [sheet]);
  const selectedProblem = problems.find((problem) => problem.id === selectedId) ?? null;

  const validatedPayload = () => {
    const parsed = sheetCreateSchema.safeParse({
      title: form.title, description: form.description, difficulty: form.difficulty,
      goals: form.goals,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      topics: form.topics.split(',').map((topic) => topic.trim()).filter(Boolean),
    });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); return null; }
    setErrors({});
    return parsed.data;
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const payload = validatedPayload();
    if (!payload) return;
    create.mutate(payload, {
      onSuccess: (result) => navigate(`/app/sheets/${result.sheet.id}/edit`, { replace: true }),
      onError: (error) => setNotice(errorMessage(error)),
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    const payload = validatedPayload();
    if (!payload) return;
    update.mutate(payload, {
      onSuccess: () => setNotice('Draft saved.'),
      onError: (error) => setNotice(errorMessage(error)),
    });
  };

  const handleProblemSubmit = (payload) => {
    if (editor.initial) {
      mutations.update.mutate(
        { problemId: editor.initial.id, body: payload },
        { onSuccess: () => setEditor({ open: false, initial: null }) },
      );
    } else {
      mutations.add.mutate([payload], {
        onSuccess: () => setEditor({ open: false, initial: null }),
      });
    }
  };

  const handleReorder = (orderedIds) => {
    setNotice('');
    mutations.reorder.mutate(orderedIds, { onError: (error) => setNotice(errorMessage(error)) });
  };

  const handleDelete = (problem) => {
    if (!window.confirm(`Remove "${problem.title}" from this sheet?`)) return;
    mutations.remove.mutate(problem.id, { onError: (error) => setNotice(errorMessage(error)) });
  };

  const handleArchive = () => {
    if (!window.confirm('Archive this sheet? It will disappear from the catalogue.')) return;
    archive.mutate(id, { onSuccess: () => navigate('/app/sheets') });
  };

  if (!isNew && sheetQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-72 w-full" /></div>;
  }
  if (!isNew && sheetQuery.isError) {
    return <Alert variant="error" title="Couldn't load this sheet">{errorMessage(sheetQuery.error)}</Alert>;
  }
  if (!isNew && sheet && !canManage) {
    return <Alert variant="warning" title="No edit access">Only the author or a content moderator can edit this sheet.</Alert>;
  }

  return (
    <div className="space-y-6">
      <Link to={isNew ? '/app/sheets' : `/app/sheets/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {isNew ? 'All sheets' : 'Back to sheet'}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{isNew ? 'Create a sheet' : 'Edit sheet'}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted">
            {isNew
              ? 'Start with a draft. Add problems manually or paste a list of links, then submit it for review.'
              : 'Changes are saved to your working copy. Publishing creates a new immutable version.'}
          </p>
        </div>
        {sheet ? <Badge variant={STATUS_TONE[sheet.status]}>{statusLabel(sheet.status)}</Badge> : null}
      </header>

      {notice ? <Alert variant="info" onDismiss={() => setNotice('')}>{notice}</Alert> : null}
      {create.isError ? <Alert variant="error">{errorMessage(create.error)}</Alert> : null}
      {update.isError ? <Alert variant="error">{errorMessage(update.error)}</Alert> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form id="sheet-metadata-form" onSubmit={isNew ? handleCreate : handleSave} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-base font-semibold text-ink">Sheet details</h2>
          <MetadataFields form={form} setForm={setForm} errors={errors} />
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <Button type="submit" className="gap-1.5" loading={isNew ? create.isPending : update.isPending}>
              <Save className="h-4 w-4" aria-hidden="true" /> {isNew ? 'Create draft' : 'Save details'}
            </Button>
            {!isNew ? (
              <Link to={`/app/sheets/${id}`}><Button type="button" variant="secondary">View sheet</Button></Link>
            ) : null}
          </div>
        </form>

        {isNew ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-6">
            <h2 className="text-sm font-semibold text-ink">Next steps</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>1. Create the draft.</li>
              <li>2. Add problems one by one, or bulk-import pasted links.</li>
              <li>3. Drag to reorder, then submit for review.</li>
              <li>4. A moderator approves it; publishing freezes version 1.</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            <ModerationPanel sheetId={id} sheet={sheet} canModerate={isModerator} />
            <div className="rounded-2xl border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold text-ink">Versions</h2>
              <p className="mt-1 text-xs text-muted">
                Published version {sheet?.publishedVersion ?? 0}. Each publish freezes the problem list so existing progress stays valid.
              </p>
            </div>
            <Button variant="danger" className="w-full gap-1.5" onClick={handleArchive} loading={archive.isPending}>
              <Archive className="h-4 w-4" aria-hidden="true" /> Archive sheet
            </Button>
          </div>
        )}
      </div>

      {!isNew ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Problems ({problems.length})</h2>
              <p className="text-xs text-muted">Drag rows or use the arrow buttons to reorder. Platforms are detected from the URL.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setBulkOpen(true)}>
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Paste links
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => setEditor({ open: true, initial: null })}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add problem
              </Button>
            </div>
          </div>

          {mutations.add.isError || mutations.update.isError || mutations.remove.isError || mutations.reorder.isError
            ? <Alert variant="error">A problem operation failed. Check that the link is a valid http(s) URL and not a duplicate.</Alert>
            : null}

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="h-[28rem]">
              <ProblemList
                problems={problems}
                selectedId={selectedId}
                onSelect={setSelectedId}
                reorderable
                onReorder={handleReorder}
                onEdit={(problem) => setEditor({ open: true, initial: problem })}
                onDelete={handleDelete}
              />
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              {selectedProblem ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted"><ListPlus className="h-4 w-4" aria-hidden="true" /> Selected problem</div>
                  <p className="text-base font-semibold text-ink">{selectedProblem.title}</p>
                  <p className="break-all font-mono text-[11px] text-muted">{selectedProblem.url}</p>
                  <p className="text-xs text-muted">{selectedProblem.topic} · {selectedProblem.platformLabel} · {selectedProblem.difficulty}</p>
                  <Button size="sm" variant="secondary" onClick={() => setEditor({ open: true, initial: selectedProblem })}>Edit problem</Button>
                </div>
              ) : (
                <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 text-center text-sm text-muted">
                  <FilePlus2 className="h-8 w-8 text-primary" aria-hidden="true" />
                  <p>Select a problem to edit, or paste a batch of links to get started.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <ProblemEditor
        open={editor.open}
        onClose={() => setEditor({ open: false, initial: null })}
        initial={editor.initial}
        onSubmit={handleProblemSubmit}
        pending={mutations.add.isPending || mutations.update.isPending}
      />
      <BulkImportDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImport={(items) => mutations.importItems.mutate(items, { onSuccess: () => setBulkOpen(false) })}
        pending={mutations.importItems.isPending}
      />
    </div>
  );
}
