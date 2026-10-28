import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Braces, LibraryBig, Link2, Plus, Save, Trash2,
} from 'lucide-react';
import { quizCreateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import QuizSettingsForm from '../components/QuizSettingsForm.jsx';
import QuestionEditor from '../components/QuestionEditor.jsx';
import QuestionList from '../components/QuestionList.jsx';
import BulkImportDialog from '../components/BulkImportDialog.jsx';
import ModerationPanel from '../components/ModerationPanel.jsx';
import {
  useCreateQuiz, useQuiz, useQuizQuestionMutations, useQuizQuestions,
  useQuestionBank, useQuestionMutations, useUpdateQuiz, useArchiveQuiz,
} from '../hooks/useQuizzes.js';
import {
  DIFFICULTY_OPTIONS, STATUS_TONE, apiFieldErrors, contractErrors,
  errorMessage, quizStatusLabel, typeLabel,
} from '../lib/quizUtils.js';

const DEFAULT_SETTINGS = Object.freeze({
  timerMinutes: 20, passPercentage: 60, maxAttempts: 3,
  shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
  showExplanations: true, allowRetryIncorrect: true,
});

/* ─────────────────────────── create a draft ─────────────────────────── */

function QuizCreatePage() {
  const navigate = useNavigate();
  const create = useCreateQuiz();
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'medium',
    topics: '', tags: '', settings: { ...DEFAULT_SETTINGS },
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      topics: form.topics.split(',').map((value) => value.trim()).filter(Boolean),
      tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean),
      settings: form.settings,
    };
    const parsed = quizCreateSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setServerError(parsed.error.issues[0]?.message ?? 'Check the form.');
      return;
    }
    setErrors({}); setServerError('');
    create.mutate(parsed.data, {
      onSuccess: (data) => navigate(`/app/quizzes/${data.quiz.id}/edit`, { replace: true }),
      onError: (error) => { setServerError(errorMessage(error)); setErrors(apiFieldErrors(error)); },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/quizzes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All quizzes
      </Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Create a quiz</h1>
        <p className="mt-1.5 text-sm text-muted">Start with the basics — you can add questions and change every setting before publishing.</p>
      </header>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError ? <Alert variant="error" title="Couldn't create the quiz">{serverError}</Alert> : null}
        <section className="ag-card space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Title" required value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Arrays & hashing warmup" />
            <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
          </div>
          <div>
            <label htmlFor="quiz-new-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea id="quiz-new-description" rows={3} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What will learners practise?" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Topics (comma separated)" value={form.topics} onChange={(event) => set('topics', event.target.value)} placeholder="Arrays, Hashing" hint="Also derived automatically from your questions." />
            <Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} placeholder="placement, warmup" />
          </div>
        </section>

        <section className="ag-card space-y-4 p-5">
          <h2 className="text-base font-semibold text-ink">Quiz settings</h2>
          <QuizSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} errors={errors} />
        </section>

        <div className="flex justify-end gap-2">
          <Link to="/app/quizzes"><Button type="button" variant="ghost">Cancel</Button></Link>
          <Button type="submit" className="gap-1.5" loading={create.isPending}><Save className="h-4 w-4" aria-hidden="true" /> Create draft</Button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────── edit an existing quiz ─────────────────────────── */

function MetadataEditor({ quiz, onSave, pending }) {
  const [form, setForm] = useState(() => ({
    title: quiz.title ?? '',
    description: quiz.description ?? '',
    difficulty: quiz.difficulty ?? 'medium',
    settings: { ...DEFAULT_SETTINGS, ...(quiz.settings ?? {}) },
  }));
  const [errors, setErrors] = useState({});
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      settings: form.settings,
    };
    const parsed = quizCreateSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      return;
    }
    setErrors({});
    onSave(parsed.data, setErrors);
  };

  return (
    <form onSubmit={submit} className="ag-card space-y-4 p-5" noValidate>
      <h2 className="text-base font-semibold text-ink">Details &amp; settings</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} />
        <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
      </div>
      <div>
        <label htmlFor="quiz-edit-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea id="quiz-edit-description" rows={2} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
      </div>
      <QuizSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} errors={errors} />
      <div className="flex justify-end">
        <Button type="submit" size="sm" className="gap-1.5" loading={pending}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save changes</Button>
      </div>
    </form>
  );
}

function BankPicker({ open, onClose, linkedIds, onLink, pending }) {
  const [selected, setSelected] = useState([]);
  const params = useMemo(() => ({ page: 1, limit: 100, mine: 'true' }), []);
  const { data, isLoading, isError, error } = useQuestionBank(params, open);
  const available = (data?.items ?? []).filter((question) => !linkedIds.includes(question.id));

  return (
    <Modal
      open={open} onClose={onClose} size="lg"
      title="Link from your question bank"
      description="Reuse questions you already wrote. Published versions keep their own frozen copy."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button disabled={!selected.length} loading={pending} onClick={() => { onLink(selected); setSelected([]); }}>Link {selected.length || ''} question{selected.length === 1 ? '' : 's'}</Button>
      </>}
    >
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="space-y-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div> : null}
      {!isLoading && !available.length ? <p className="py-6 text-center text-sm text-muted">No other questions in your bank. Add questions manually or import a file.</p> : null}
      <div className="ag-scrollbar max-h-96 space-y-2 overflow-y-auto">
        {available.map((question) => (
          <label key={question.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 hover:border-primary/40">
            <input
              type="checkbox" checked={selected.includes(question.id)}
              onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, question.id] : previous.filter((id) => id !== question.id))}
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-ink">{question.prompt}</span>
              <span className="mt-1 flex items-center gap-2"><Badge variant="primary">{typeLabel(question.type)}</Badge><span className="text-xs text-muted">{question.topic}</span></span>
            </span>
          </label>
        ))}
      </div>
    </Modal>
  );
}

function QuizEditor({ id }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuiz(id);
  const questionParams = useMemo(() => ({ page: 1, limit: 200 }), []);
  const { data: questionData, isLoading: questionsLoading } = useQuizQuestions(id, questionParams);
  const update = useUpdateQuiz(id);
  const archive = useArchiveQuiz();
  const qMutations = useQuizQuestionMutations(id);
  const questionMutations = useQuestionMutations();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const quiz = data?.quiz;
  const questions = questionData?.items ?? [];
  const linkedIds = quiz?.questionIds ?? [];
  const busy = qMutations.link.isPending || qMutations.importItems.isPending || qMutations.reorder.isPending
    || qMutations.unlink.isPending || questionMutations.create.isPending || questionMutations.update.isPending;

  const flash = (text) => { setMessage(text); setActionError(''); };
  const fail = (err) => { setActionError(errorMessage(err)); setMessage(''); };

  const saveMetadata = (body, setErrors) => {
    update.mutate(body, {
      onSuccess: () => flash('Quiz settings saved.'),
      onError: (err) => { setErrors(apiFieldErrors(err)); fail(err); },
    });
  };

  const saveQuestion = async (payload) => {
    try {
      if (editing) {
        await questionMutations.update.mutateAsync({ id: editing.id, body: payload });
        await qMutations.reorder.mutateAsync(linkedIds);
        flash('Question updated.');
      } else {
        const created = await questionMutations.create.mutateAsync(payload);
        await qMutations.link.mutateAsync([created.question.id]);
        flash('Question added to the quiz.');
      }
      setEditorOpen(false); setEditing(null);
    } catch (err) { fail(err); }
  };

  const doImport = async (items, source) => {
    try {
      const result = await qMutations.importItems.mutateAsync({ items, source });
      flash(`${result.imported} question(s) imported.`);
      setImportOpen(false);
    } catch (err) { fail(err); }
  };

  const doLink = async (ids) => {
    try {
      await qMutations.link.mutateAsync(ids);
      flash(`${ids.length} question(s) linked.`);
      setBankOpen(false);
    } catch (err) { fail(err); }
  };

  const doReorder = (ids) => qMutations.reorder.mutate(ids, { onError: fail });
  const doUnlink = (questionId) => qMutations.unlink.mutate(questionId, { onSuccess: () => flash('Question removed.'), onError: fail });
  const doArchive = () => archive.mutate(id, { onSuccess: () => navigate('/app/quizzes'), onError: fail });

  if (isLoading) return <FullPageLoader label="Loading quiz editor…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this quiz">{errorMessage(error)}</Alert>;
  if (!quiz) return <FullPageLoader label="Loading quiz editor…" />;

  const locked = quiz.status === 'published' || quiz.status === 'pending_review';

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/app/quizzes/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to quiz
          </Link>
          <Badge variant={STATUS_TONE[quiz.status]}>{quizStatusLabel(quiz.status)}</Badge>
        </div>
        <Button variant="danger" size="sm" className="gap-1.5" loading={archive.isPending} onClick={doArchive}>
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Archive
        </Button>
      </div>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Edit quiz</h1>
        <p className="mt-1.5 text-sm text-muted">
          {locked ? 'Questions are locked in this status. Start a new revision to edit them.' : 'Add questions, tune the settings and publish an immutable version when ready.'}
        </p>
      </header>

      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {message ? <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert> : null}

      <MetadataEditor key={quiz.id} quiz={quiz} onSave={saveMetadata} pending={update.isPending} />

      <section className="ag-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Questions <span className="text-muted">({questions.length})</span></h2>
            <p className="mt-1 text-xs text-muted">Max 200 per quiz. Drag rows or use the arrow buttons to reorder.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setBankOpen(true)}><LibraryBig className="h-3.5 w-3.5" aria-hidden="true" /> From bank</Button>
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setImportOpen(true)}><Braces className="h-3.5 w-3.5" aria-hidden="true" /> Bulk import</Button>
            <Button size="sm" className="gap-1.5" onClick={() => { setEditing(null); setEditorOpen(true); }}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add question</Button>
          </div>
        </div>
        {questionsLoading ? (
          <div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>
        ) : (
          <QuestionList
            questions={questions}
            busy={busy || locked}
            onReorder={doReorder}
            onEdit={(question) => { setEditing(question); setEditorOpen(true); }}
            onUnlink={doUnlink}
          />
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ModerationPanel quizId={id} quiz={quiz} canModerate={data?.canModerate} />
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Link2 className="h-4 w-4 text-accent" aria-hidden="true" /> Versioning</h2>
          <p className="text-xs text-muted">
            Publishing freezes the settings and every question (including answer keys) into an immutable version. Existing attempts keep grading against the version they started on.
          </p>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published version</dt><dd className="mt-0.5 text-base font-bold text-ink">{quiz.publishedVersion || '—'}</dd></div>
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published questions</dt><dd className="mt-0.5 text-base font-bold text-ink">{quiz.publishedQuestionCount || 0}</dd></div>
          </dl>
        </section>
      </div>

      <Modal open={editorOpen} onClose={() => { setEditorOpen(false); setEditing(null); }} size="lg" title={editing ? 'Edit question' : 'Add a question'}>
        <QuestionEditor
          initial={editing}
          title={editing ? 'Edit question' : 'Add a question'}
          pending={busy}
          onSave={saveQuestion}
          onCancel={() => { setEditorOpen(false); setEditing(null); }}
        />
      </Modal>
      <BulkImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={doImport} pending={qMutations.importItems.isPending} />
      <BankPicker open={bankOpen} onClose={() => setBankOpen(false)} linkedIds={linkedIds} onLink={doLink} pending={qMutations.link.isPending} />
    </div>
  );
}

export default function QuizEditorPage() {
  const { id } = useParams();
  return !id ? <QuizCreatePage /> : <QuizEditor id={id} />;
}
