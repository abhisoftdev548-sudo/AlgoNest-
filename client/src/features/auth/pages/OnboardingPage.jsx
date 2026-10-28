import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, CalendarRange, Code2, Sprout, Trophy } from 'lucide-react';
import { GOAL_OPTIONS, PREFERRED_LANGUAGE_LABELS, onboardingSchema, zodFieldErrors } from '@algonest/shared';
import AuthShell from '../components/AuthShell.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Select from '../../../components/ui/Select.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { cn } from '../../../lib/cn.js';

const GOAL_ICONS = {
  sprout: Sprout,
  briefcase: Briefcase,
  code: Code2,
  trophy: Trophy,
  calendar: CalendarRange,
};

const LANGUAGE_OPTIONS = Object.entries(PREFERRED_LANGUAGE_LABELS).map(([value, label]) => ({ value, label }));

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateGoal } = useAuth();
  const [goal, setGoal] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('javascript');
  const [clientErrors, setClientErrors] = useState({});

  if (user?.onboardingCompleted && user?.goal) return <Navigate to="/app" replace />;

  const serverErrors = updateGoal.error instanceof ApiClientError ? updateGoal.error.fieldErrors : {};
  const generalError = updateGoal.error && Object.keys(serverErrors).length === 0 ? updateGoal.error.message : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsed = onboardingSchema.safeParse({ goal, preferredLanguage });
    if (!parsed.success) {
      setClientErrors(zodFieldErrors(parsed.error));
      return;
    }
    setClientErrors({});
    updateGoal.mutate(parsed.data, { onSuccess: () => navigate('/app', { replace: true }) });
  };

  return (
    <AuthShell
      wide
      title="What are you preparing for?"
      subtitle="Pick the closest goal. It shapes your daily plan, recommended sheets and mock tests — you can change it later in Settings."
      footer={<Badge variant="primary">Step 1 of 1 · Takes 10 seconds</Badge>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {generalError ? <Alert variant="error" title="Could not save your goal">{generalError}</Alert> : null}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ink">Your primary goal</legend>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Primary goal">
            {GOAL_OPTIONS.map((option) => {
              const Icon = GOAL_ICONS[option.icon] ?? Sprout;
              const selected = goal === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-all',
                    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary',
                    selected ? 'border-primary bg-primary/8 ag-ring' : 'border-line bg-surface hover:border-primary/50',
                  )}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={option.value}
                    checked={selected}
                    onChange={() => {
                      setGoal(option.value);
                      setClientErrors((previous) => ({ ...previous, goal: undefined }));
                    }}
                    className="sr-only"
                  />
                  <span className={cn('mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', selected ? 'bg-primary text-primary-ink' : 'bg-surface-2 text-muted')}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{option.description}</span>
                  </span>
                  {selected ? <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> : null}
                </label>
              );
            })}
          </div>
          {clientErrors.goal || serverErrors.goal ? (
            <p role="alert" className="mt-2 text-xs font-medium text-danger">{clientErrors.goal || serverErrors.goal}</p>
          ) : null}
        </fieldset>

        <Select
          label="Preferred coding language"
          value={preferredLanguage}
          onChange={(event) => setPreferredLanguage(event.target.value)}
          options={LANGUAGE_OPTIONS}
          hint="Used for code snippets and solution explanations."
          error={clientErrors.preferredLanguage || serverErrors.preferredLanguage}
        />

        <Button type="submit" size="lg" className="w-full" loading={updateGoal.isPending}>
          {updateGoal.isPending ? 'Building your plan…' : 'Save goal and continue'}
          {!updateGoal.isPending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </Button>
      </form>
    </AuthShell>
  );
}
