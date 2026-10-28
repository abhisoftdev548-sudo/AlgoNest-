import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, ShieldCheck, UserRound } from 'lucide-react';
import { GOAL_OPTIONS, PREFERRED_LANGUAGE_LABELS, ROLE_LABELS } from '@algonest/shared/constants';
import { onboardingSchema, updateProfileSchema, zodFieldErrors } from '@algonest/shared';
import useAuth from '../../auth/hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';

const LANGUAGE_OPTIONS = Object.entries(PREFERRED_LANGUAGE_LABELS).map(([value, label]) => ({ value, label }));
const GOAL_SELECT_OPTIONS = GOAL_OPTIONS.map((option) => ({ value: option.value, label: option.label }));

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateGoal, logout, logoutAll } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name ?? '', preferredLanguage: user?.preferredLanguage ?? 'javascript' });
  const [goal, setGoal] = useState(user?.goal ?? '');
  const [profileErrors, setProfileErrors] = useState({});
  const [goalErrors, setGoalErrors] = useState({});
  const [saved, setSaved] = useState(null);

  const serverProfileErrors = updateProfile.error instanceof ApiClientError ? updateProfile.error.fieldErrors : {};
  const serverGoalErrors = updateGoal.error instanceof ApiClientError ? updateGoal.error.fieldErrors : {};

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setSaved(null);
    const parsed = updateProfileSchema.safeParse(profile);
    if (!parsed.success) {
      setProfileErrors(zodFieldErrors(parsed.error));
      return;
    }
    setProfileErrors({});
    updateProfile.mutate(parsed.data, { onSuccess: () => setSaved('Profile saved.') });
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    setSaved(null);
    const parsed = onboardingSchema.safeParse({ goal, preferredLanguage: profile.preferredLanguage });
    if (!parsed.success) {
      setGoalErrors(zodFieldErrors(parsed.error));
      return;
    }
    setGoalErrors({});
    updateGoal.mutate(parsed.data, { onSuccess: () => setSaved('Goal updated. Your plan will use it from now on.') });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1.5 text-sm text-muted">Manage your profile, preparation goal, appearance and sessions.</p>
      </div>

      {saved ? <Alert variant="success" onDismiss={() => setSaved(null)}>{saved}</Alert> : null}
      {updateProfile.error && Object.keys(serverProfileErrors).length === 0 ? (
        <Alert variant="error">{updateProfile.error.message}</Alert>
      ) : null}
      {updateGoal.error && Object.keys(serverGoalErrors).length === 0 ? (
        <Alert variant="error">{updateGoal.error.message}</Alert>
      ) : null}

      <Card>
        <CardHeader title="Profile" description="How you appear across AlgoNest." action={<UserRound className="h-5 w-5 text-muted" aria-hidden="true" />} />
        <CardBody>
          <form onSubmit={handleProfileSubmit} noValidate className="space-y-4">
            <Input
              label="Full name"
              value={profile.name}
              onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))}
              error={profileErrors.name || serverProfileErrors.name}
              autoComplete="name"
              required
            />
            <Input label="Email address" value={user?.email ?? ''} readOnly disabled hint="Email changes require support in this phase." />
            <Select
              label="Preferred coding language"
              value={profile.preferredLanguage}
              onChange={(event) => setProfile((previous) => ({ ...previous, preferredLanguage: event.target.value }))}
              options={LANGUAGE_OPTIONS}
              error={profileErrors.preferredLanguage || serverProfileErrors.preferredLanguage}
            />
            <Button type="submit" loading={updateProfile.isPending} className="gap-2">
              <Save className="h-4 w-4" aria-hidden="true" /> Save profile
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Preparation goal" description="Changing this re-targets your daily plan." />
        <CardBody>
          <form onSubmit={handleGoalSubmit} noValidate className="space-y-4">
            <Select
              label="Primary goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              options={GOAL_SELECT_OPTIONS}
              placeholder="Choose a goal"
              error={goalErrors.goal || serverGoalErrors.goal}
            />
            <Button type="submit" variant="secondary" loading={updateGoal.isPending}>Update goal</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Appearance" description="Applies instantly and is remembered on this device." />
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Theme</p>
              <p className="mt-1 text-xs text-muted">Dark navy by default; light mode has the same contrast guarantees.</p>
            </div>
            <ThemeToggle withLabel />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Account & sessions" description="Role and session controls." action={<ShieldCheck className="h-5 w-5 text-muted" aria-hidden="true" />} />
        <CardBody className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="accent">{ROLE_LABELS[user?.role] ?? 'Student'}</Badge>
            <span className="text-muted">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'today'}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2" disabled={logout.isPending} onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </Button>
            <Button variant="danger" disabled={logoutAll.isPending} onClick={() => logoutAll.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })}>
              {logoutAll.isPending ? 'Signing out…' : 'Sign out of all devices'}
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Access tokens last 15 minutes. Refresh tokens are httpOnly cookies, rotated on every use and revoked when reuse is detected.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
