import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, WandSparkles } from 'lucide-react';
import { planCreateSchema } from '@algonest/shared';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import PlanBasicsForm from './PlanBasicsForm.jsx';
import PlanContentPicker from './PlanContentPicker.jsx';
import { useCreatePlan, usePlanContent } from '../hooks/usePlans.js';
import { DEFAULT_PLAN_DRAFT, apiFieldErrors, contractErrors, dateKey, errorMessage, formatMinutes, planCapacityLabel } from '../lib/planUtils.js';

const STEPS = [
  { id: 0, label: 'Goal & schedule' },
  { id: 1, label: 'Choose content' },
  { id: 2, label: 'Review & create' },
];

export default function PlanWizard({ onCancel, activePlan }) {
  const navigate = useNavigate();
  const create = useCreatePlan();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => DEFAULT_PLAN_DRAFT(dateKey()));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const contentQuery = usePlanContent(step === 1 || step === 2);

  const capacity = useMemo(() => planCapacityLabel(draft, contentQuery.data), [draft, contentQuery.data]);
  const summary = useMemo(() => [
    { label: 'Goal', value: (draft.goal || '—').replaceAll('_', ' ') },
    { label: 'Window', value: `${draft.startDate} → ${draft.endDate}` },
    { label: 'Daily budget', value: formatMinutes(draft.dailyMinutes) },
    { label: 'Rest days', value: draft.restDays.length ? draft.restDays.join(', ') : 'None' },
    { label: 'Selected', value: `${draft.sheetIds.length} sheets · ${draft.quizIds.length} quizzes · ${draft.mockIds.length} mocks` },
    { label: 'Estimated work', value: `${formatMinutes(capacity.minutes)} (~${formatMinutes(capacity.minutesPerDay)}/day)` },
    { label: 'Revisions', value: draft.revisionEnabled ? '1 / 7 / 21 days' : 'Off' },
    { label: 'Mock cadence', value: `every ${draft.mockIntervalDays} days` },
  ], [draft, capacity]);

  const validate = () => {
    const parsed = planCreateSchema.safeParse(draft);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setServerError(parsed.error.issues[0]?.message ?? 'Check the form.');
      return null;
    }
    setErrors({}); setServerError('');
    return parsed.data;
  };

  const next = () => {
    if (step === 0) {
      const partial = planCreateSchema.safeParse({ ...draft, sheetIds: draft.sheetIds.length ? draft.sheetIds : ['507f1f77bcf86cd799439011'] });
      if (!partial.success) {
        // Ignore the artificial selection when reporting step-1 errors.
        const filtered = contractErrors(partial.error);
        delete filtered.sheetIds; delete filtered._;
        if (Object.keys(filtered).length) { setErrors(filtered); setServerError(Object.values(filtered)[0]); return; }
      }
      setErrors({}); setServerError('');
    }
    setStep((value) => Math.min(2, value + 1));
  };

  const submit = () => {
    const payload = validate();
    if (!payload) return;
    create.mutate(payload, {
      onSuccess: (result) => navigate(`/app/plans/${result.plan.id}`, { replace: true, state: { generated: result.generated } }),
      onError: (error) => { setServerError(errorMessage(error)); setErrors(apiFieldErrors(error)); },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary"><WandSparkles className="h-3.5 w-3.5" aria-hidden="true" /> Adaptive plan builder</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Build your daily plan</h1>
        <p className="mt-1.5 text-sm text-muted">Tell us your goal and time budget. We distribute every problem, quiz and mock across your working days, insert spaced revisions and warn you before you overload.</p>
      </header>

      {activePlan ? <Alert variant="warning" title="You already have an active plan">Creating a new plan archives <strong>{activePlan.title}</strong>. Its task history stays available.</Alert> : null}

      <ol className="flex flex-wrap items-center gap-2" aria-label="Plan builder steps">
        {STEPS.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <button type="button" onClick={() => index < step && setStep(index)} disabled={index > step} aria-current={step === index ? 'step' : undefined}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${step === index ? 'bg-primary/12 text-primary' : index < step ? 'text-success hover:bg-success/8' : 'text-muted opacity-60'}`}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">{index < step ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}</span>
              {item.label}
            </button>
            {index < STEPS.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>

      <section className="ag-card p-5 sm:p-6">
        {step === 0 ? <PlanBasicsForm value={draft} onChange={setDraft} errors={errors} /> : null}
        {step === 1 ? <PlanContentPicker value={draft} onChange={setDraft} content={contentQuery.data} isLoading={contentQuery.isLoading} isError={contentQuery.isError} error={contentQuery.error} errors={errors} /> : null}
        {step === 2 ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm text-ink">We will generate a deterministic schedule: daily buckets within your time budget, a full-length mock every {draft.mockIntervalDays} days, and 1/7/21-day revision blocks. Missed tasks can be rescheduled with one click.</p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {summary.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5">
                  <dt className="text-xs text-muted">{row.label}</dt><dd className="text-right text-sm font-semibold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            {capacity.minutesPerDay > draft.dailyMinutes ? <Alert variant="warning">Your workload exceeds the daily budget. The plan will still be created with explicit overload warnings, and may extend past your target date.</Alert> : null}
          </div>
        ) : null}
      </section>

      {serverError ? <Alert variant="error" title="Couldn't create the plan" onDismiss={() => setServerError('')}>{serverError}</Alert> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <div className="flex gap-2">
          {step > 0 ? <Button variant="secondary" className="gap-1.5" onClick={() => setStep((value) => value - 1)}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</Button> : null}
          {step < 2 ? <Button className="gap-1.5" onClick={next}>Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            : <Button className="gap-1.5" loading={create.isPending} onClick={submit}><Check className="h-4 w-4" aria-hidden="true" /> Create plan</Button>}
        </div>
      </div>
    </div>
  );
}
