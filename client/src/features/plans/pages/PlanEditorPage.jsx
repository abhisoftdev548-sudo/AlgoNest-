import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { planUpdateSchema } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { FullPageLoader } from '../../../components/ui/Spinner.jsx';
import RestDayPicker from '../components/RestDayPicker.jsx';
import PlanWizard from '../components/PlanWizard.jsx';
import { useActivePlan, useArchivePlan, usePlan, useUpdatePlan } from '../hooks/usePlans.js';
import { STATUS_TONE, apiFieldErrors, contractErrors, errorMessage, planStatusLabel } from '../lib/planUtils.js';

function EditPlan({ id }) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = usePlan(id);
  const update = useUpdatePlan(id);
  const archive = useArchivePlan();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  if (isLoading) return <FullPageLoader label="Loading plan settings…" />;
  if (isError) return <Alert variant="error" title="Couldn't load this plan">{errorMessage(error)}</Alert>;
  const plan = data?.plan;
  if (!plan) return <FullPageLoader label="Loading plan settings…" />;
  if (!form || form._id !== plan.id) {
    setForm({
      _id: plan.id, title: plan.title, notes: plan.notes || '',
      dailyMinutes: plan.dailyMinutes, restDays: plan.restDays,
      revisionEnabled: plan.revisionEnabled,
    });
  }
  if (!form) return null;
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const save = () => {
    const payload = {
      title: form.title.trim(), notes: form.notes.trim(),
      dailyMinutes: Number(form.dailyMinutes), restDays: form.restDays,
      revisionEnabled: form.revisionEnabled,
    };
    const parsed = planUpdateSchema.safeParse(payload);
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); setActionError(parsed.error.issues[0]?.message ?? 'Check the form.'); return; }
    setErrors({}); setActionError('');
    update.mutate(parsed.data, {
      onSuccess: () => setMessage('Settings saved. Regenerate the plan to apply a new budget or rest-day pattern to future tasks.'),
      onError: (err) => { setActionError(errorMessage(err)); setErrors(apiFieldErrors(err)); },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/app/plans/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to plan</Link>
          <Badge variant={STATUS_TONE[plan.status]}>{planStatusLabel(plan.status)}</Badge>
        </div>
        <Button variant="danger" size="sm" className="gap-1.5" disabled={plan.status === 'archived'} loading={archive.isPending} onClick={() => archive.mutate(id, { onSuccess: () => navigate('/app/plans'), onError: (err) => setActionError(errorMessage(err)) })}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Archive</Button>
      </div>

      <header><h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Plan settings</h1><p className="mt-1.5 text-sm text-muted">Changing the budget or rest days affects rescheduling immediately; use <strong>Regenerate</strong> on the plan page to rebuild future tasks.</p></header>

      {actionError ? <Alert variant="error" onDismiss={() => setActionError('')}>{actionError}</Alert> : null}
      {message ? <Alert variant="success" onDismiss={() => setMessage('')}>{message}</Alert> : null}

      <section className="ag-card space-y-4 p-5">
        <Input label="Title" value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} maxLength={120} />
        <Input label="Daily time budget (minutes)" type="number" min={15} max={720} value={form.dailyMinutes} onChange={(event) => set('dailyMinutes', Number(event.target.value))} error={errors.dailyMinutes} />
        <RestDayPicker value={form.restDays} onChange={(restDays) => set('restDays', restDays)} error={errors.restDays} />
        <label htmlFor="edit-revisions" className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span><span className="block text-sm font-medium text-ink">Spaced revisions (1 / 7 / 21 days)</span><span className="mt-0.5 block text-xs text-muted">Applies when you regenerate the plan.</span></span>
          <input id="edit-revisions" type="checkbox" checked={form.revisionEnabled} onChange={(event) => set('revisionEnabled', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        </label>
        <Input label="Notes" value={form.notes} onChange={(event) => set('notes', event.target.value)} maxLength={500} error={errors.notes} />
        <div className="flex justify-end"><Button className="gap-1.5" loading={update.isPending} onClick={save}><Save className="h-3.5 w-3.5" aria-hidden="true" /> Save settings</Button></div>
      </section>

      <section className="ag-card space-y-2 p-5">
        <h2 className="text-sm font-semibold text-ink">Content in this plan</h2>
        <p className="text-xs text-muted">{plan.sheetIds.length} sheets · {plan.quizIds.length} quizzes · {plan.mockIds.length} mocks · {plan.startDate} → {plan.endDate}</p>
        <p className="text-xs text-muted">Selected content cannot be swapped on an existing plan without losing task history. Build a new plan to change it.</p>
      </section>
    </div>
  );
}

function NewPlan() {
  const navigate = useNavigate();
  const { data } = useActivePlan();
  return <PlanWizard activePlan={data?.plan} onCancel={() => navigate('/app/plans')} />;
}

export default function PlanEditorPage() {
  const { id } = useParams();
  return id ? <EditPlan id={id} /> : <NewPlan />;
}
