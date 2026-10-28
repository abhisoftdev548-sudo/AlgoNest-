import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Layers3, Plus, Save, Trash2 } from 'lucide-react';
import { mockCreateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import MockSettingsForm, { DEFAULT_MOCK_SETTINGS } from '../components/MockSettingsForm.jsx';
import SectionEditor from '../components/SectionEditor.jsx';
import SectionQuestionPicker from '../components/SectionQuestionPicker.jsx';
import MockModerationPanel from '../components/MockModerationPanel.jsx';
import { useArchiveMock, useCreateMock, useMock, useSetSectionQuestions, useUpdateMock } from '../hooks/useMocks.js';
import {
  DIFFICULTY_OPTIONS, STATUS_TONE, TOPIC_OPTIONS, apiFieldErrors, contractErrors,
  errorMessage, mockStatusLabel,
} from '../lib/mockUtils.js';

const blankSection = (index = 0) => ({
  title: `Section ${index + 1}`,
  description: '',
  durationMinutes: 20,
  correctMarks: 2,
  negativeMarks: 0.5,
  cutoffPercentage: 40,
  questionIds: [],
});

function sectionsForPayload(sections) {
  return sections.map((section) => ({
    title: section.title,
    description: section.description || '',
    durationMinutes: Number(section.durationMinutes),
    correctMarks: Number(section.correctMarks),
    negativeMarks: Number(section.negativeMarks),
    cutoffPercentage: Number(section.cutoffPercentage),
    questionIds: section.questionIds ?? [],
  }));
}

/* ─────────────────────────── create ─────────────────────────── */

function MockCreatePage() {
  const navigate = useNavigate();
  const create = useCreateMock();
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'medium', topics: '', tags: '',
    settings: { ...DEFAULT_MOCK_SETTINGS }, sections: [blankSection(0)],
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(), description: form.description.trim(), difficulty: form.difficulty,
      topics: form.topics.split(',').map((value) => value.trim()).filter(Boolean),
      tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean),
      goals: [], settings: form.settings, sections: sectionsForPayload(form.sections),
    };
    const parsed = mockCreateSchema.safeParse(payload);
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setServerError(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setServerError('');
    create.mutate(parsed.data, {
      onSuccess: (data) => navigate(`/app/mocks/${data.mock.id}/edit`, { replace: true }),
      onError: (error) => { setServerError(errorMessage(error)); setErrors(apiFieldErrors(error)); },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/mocks" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All mocks</Link>
      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Create a mock test</h1><p className="mt-1.5 text-sm text-muted">Define the exam structure first. After saving, add questions to each section.</p></header>
      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError ? <Alert variant="error" title="Couldn't create the mock">{serverError}</Alert> : null}
        <section className="ag-card space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Title" required value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Placement Mock 1" />
            <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
          </div>
          <div>
            <label htmlFor="mock-new-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea id="mock-new-description" rows={3} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What does this mock simulate?" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Topics (comma separated)" list="mock-topic-list" value={form.topics} onChange={(event) => set('topics', event.target.value)} placeholder="Arrays, DP" />
            <Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} placeholder="placement, full-length" />
          </div>
          <datalist id="mock-topic-list">{TOPIC_OPTIONS.map((option) => <option key={option.value} value={option.value} />)}</datalist>
        </section>
        <section className="ag-card space-y-4 p-5"><h2 className="text-base font-semibold text-ink">Exam settings</h2><MockSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} errors={errors} /></section>
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Sections</h2>
          {errors.sections ? <Alert variant="error">{errors.sections}</Alert> : null}
          {form.sections.map((section, index) => (
            <SectionEditor key={index} section={section} index={index} total={form.sections.length}
              onChange={(next) => set('sections', form.sections.map((item, i) => (i === index ? next : item)))}
              onMove={(i, direction) => {
                const next = [...form.sections]; const target = i + direction;
                if (target < 0 || target >= next.length) return;
                [next[i], next[target]] = [next[target], next[i]]; set('sections', next);
              }}
              onRemove={(i) => set('sections', form.sections.filter((_, position) => position !== i))}
              onPickQuestions={() => setServerError('Save the mock first, then choose questions for each section.')}
            />
          ))}
          <Button type="button" variant="secondary" size="sm" className="gap-1.5" disabled={form.sections.length >= 12} onClick={() => set('sections', [...form.sections, blankSection(form.sections.length)])}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add section</Button>
        </section>
        <div className="flex justify-end gap-2"><Link to="/app/mocks"><Button type="button" variant="ghost">Cancel</Button></Link><Button type="submit" className="gap-1.5" loading={create.isPending}><Save className="h-4 w-4" aria-hidden="true" /> Create draft</Button></div>
      </form>
    </div>
  );
}

/* ─────────────────────────── edit ─────────────────────────── */

function MockEditor({ id }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMock(id);
  const update = useUpdateMock(id);
  const setQuestions = useSetSectionQuestions(id);
  const archive = useArchiveMock();

  const [pickerIndex, setPickerIndex] = useState(null);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [form, setForm] = useState(null);
  const initialised = data?.mock?.id ?? null;

  // Lazily initialise once per mock (a keyed child would also work). Keeping it
  // here avoids a useEffect that would fight optimistic query invalidations.
  if (data?.mock && (!form || form._id !== initialised)) {
    const mock = data.mock;
    setForm({
      _id: mock.id,
      title: mock.title, description: mock.description || '', difficulty: mock.difficulty,
      topics: (mock.topics ?? []).join(', '), tags: (mock.tags ?? []).join(', '),
      settings: { ...DEFAULT_MOCK_SETTINGS, ...(mock.settings ?? {}) },
      sections: (mock.sections ?? []).map((section) => ({
        id: section.id, title: section.title, description: section.description || '',
        durationMinutes: section.durationMinutes, correctMarks: section.correctMarks,
        negativeMarks: section.negativeMarks, cutoffPercentage: section.cutoffPercentage,
        questionIds: section.questionIds ?? [],
      })),
    });
  }

  if (isLoading) return <FullPageLoader label="Loading mock editor…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this mock">{errorMessage(error)}</Alert>;
  if (!data?.mock || !form) return <FullPageLoader label="Loading mock editor…" />;
  const mock = data.mock;
  const locked = ['published', 'pending_review', 'archived'].includes(mock.status);

  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const patchSection = (index, next) => set('sections', form.sections.map((item, i) => (i === index ? next : item)));
  const moveSection = (index, direction) => {
    const next = [...form.sections]; const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; set('sections', next);
  };

  const save = () => {
    const payload = {
      title: form.title.trim(), description: form.description.trim(), difficulty: form.difficulty,
      topics: form.topics.split(',').map((value) => value.trim()).filter(Boolean),
      tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean),
      settings: form.settings, sections: sectionsForPayload(form.sections),
    };
    const parsed = mockCreateSchema.safeParse({ ...payload, goals: [] });
    if (!parsed.success) { setActionError(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setActionError('');
    update.mutate(parsed.data, {
      onSuccess: () => setMessage('Mock settings saved.'),
      onError: (err) => setActionError(errorMessage(err)),
    });
  };

  const saveSectionQuestions = (questionIds) => {
    const section = form.sections[pickerIndex];
    setQuestions.mutate({ sectionId: section.id, questionIds }, {
      onSuccess: () => {
        patchSection(pickerIndex, { ...section, questionIds });
        setPickerIndex(null); setMessage(`Saved ${questionIds.length} questions for ${section.title}.`);
      },
      onError: (err) => setActionError(errorMessage(err)),
    });
  };

  const usedElsewhere = form.sections
    .filter((_, index) => index !== pickerIndex)
    .flatMap((section) => section.questionIds ?? []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/app/mocks/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to mock</Link>
          <Badge variant={STATUS_TONE[mock.status]}>{mockStatusLabel(mock.status)}</Badge>
        </div>
        <Button variant="danger" size="sm" className="gap-1.5" loading={archive.isPending} onClick={() => archive.mutate(id, { onSuccess: () => navigate('/app/mocks'), onError: (err) => setActionError(errorMessage(err)) })}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Archive</Button>
      </div>

      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Edit mock</h1><p className="mt-1.5 text-sm text-muted">{locked ? 'Structure is locked in this status. Start a new revision to edit sections.' : 'Update settings, sections and questions, then publish an immutable version.'}</p></header>
      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {message ? <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert> : null}

      <section className="ag-card space-y-4 p-5">
        <h2 className="text-base font-semibold text-ink">Details &amp; settings</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(event) => set('title', event.target.value)} />
          <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        </div>
        <div><label htmlFor="mock-edit-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label><textarea id="mock-edit-description" rows={2} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" /></div>
        <div className="grid gap-3 sm:grid-cols-2"><Input label="Topics (comma separated)" value={form.topics} onChange={(event) => set('topics', event.target.value)} /><Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} /></div>
        <MockSettingsForm value={form.settings} onChange={(settings) => set('settings', settings)} />
        <div className="flex justify-end"><Button size="sm" className="gap-1.5" loading={update.isPending} onClick={save}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save changes</Button></div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h2 className="flex items-center gap-2 text-base font-semibold text-ink"><Layers3 className="h-4 w-4 text-accent" aria-hidden="true" /> Sections <span className="text-muted">({form.sections.length})</span></h2><p className="mt-1 text-xs text-muted">Total {form.sections.reduce((sum, section) => sum + Number(section.durationMinutes || 0), 0)} min · {form.sections.reduce((sum, section) => sum + (section.questionIds?.length ?? 0), 0)} questions</p></div>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={locked || form.sections.length >= 12} onClick={() => set('sections', [...form.sections, blankSection(form.sections.length)])}><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add section</Button>
        </div>
        {form.sections.map((section, index) => (
          <SectionEditor key={section.id ?? `new-${index}`} section={section} index={index} total={form.sections.length}
            onChange={(next) => patchSection(index, next)} onMove={moveSection}
            onRemove={(i) => set('sections', form.sections.filter((_, position) => position !== i))}
            onPickQuestions={(i) => section.id ? setPickerIndex(i) : setActionError('Save the mock first to create this section, then choose questions.')}
            disabled={locked}
          />
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <MockModerationPanel mockId={id} mock={mock} canModerate={data?.canModerate} />
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <h2 className="text-sm font-semibold text-ink">Versioning &amp; exam integrity</h2>
          <p className="text-xs text-muted">Publishing freezes every section, marking scheme, question and answer key. Attempts always grade against the version they started on, so editing a bank question never changes an old result.</p>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published version</dt><dd className="mt-0.5 text-base font-bold text-ink">{mock.publishedVersion || '—'}</dd></div>
            <div className="rounded-lg bg-surface-2/50 p-2.5"><dt className="text-muted">Published questions</dt><dd className="mt-0.5 text-base font-bold text-ink">{mock.publishedQuestionCount || 0}</dd></div>
          </dl>
          <p className="text-xs text-muted">Deadlines are absolute server timestamps. A closed tab, a suspended laptop or a forged client clock cannot extend an attempt.</p>
        </section>
      </div>

      {pickerIndex !== null && form.sections[pickerIndex] ? (
        <SectionQuestionPicker
          open section={form.sections[pickerIndex]} usedElsewhere={usedElsewhere}
          onClose={() => setPickerIndex(null)} onSave={saveSectionQuestions}
          pending={setQuestions.isPending}
        />
      ) : null}
    </div>
  );
}

export default function MockEditorPage() {
  const { id } = useParams();
  return !id ? <MockCreatePage /> : <MockEditor id={id} />;
}
