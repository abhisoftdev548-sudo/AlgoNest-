import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { passwordSchema, registerSchema, zodFieldErrors } from '@algonest/shared';
import AuthShell from '../components/AuthShell.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

const PASSWORD_RULES = [
  { label: '10+ characters', test: (value) => value.length >= 10 },
  { label: 'Upper & lowercase', test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: 'A number', test: (value) => /[0-9]/.test(value) },
  { label: 'A symbol', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [clientErrors, setClientErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const serverErrors = register.error instanceof ApiClientError ? register.error.fieldErrors : {};
  const errors = { ...serverErrors, ...clientErrors };
  const generalError = register.error && Object.keys(serverErrors).length === 0 ? register.error.message : null;

  const update = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setClientErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    const parsed = registerSchema.safeParse({ name: values.name, email: values.email, password: values.password });
    if (!parsed.success) Object.assign(nextErrors, zodFieldErrors(parsed.error));
    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    register.mutate(parsed.data, { onSuccess: () => navigate('/onboarding', { replace: true }) });
  };

  const passwordStrength = PASSWORD_RULES.filter((rule) => rule.test(values.password)).length;
  const strengthOk = passwordSchema.safeParse(values.password).success;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. One goal, one plan, real progress."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {generalError ? <Alert variant="error" title="Could not create account">{generalError}</Alert> : null}

        <Input label="Full name" name="name" autoComplete="name" placeholder="Ada Lovelace" icon={UserRound} required value={values.name} onChange={update('name')} error={errors.name} />
        <Input label="Email address" type="email" name="email" autoComplete="email" placeholder="you@college.edu" icon={Mail} required value={values.email} onChange={update('email')} error={errors.email} />

        <div>
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            icon={LockKeyhole}
            required
            value={values.password}
            onChange={update('password')}
            error={errors.password}
            trailing={
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="rounded-lg p-1.5 text-muted hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1" aria-live="polite">
            {PASSWORD_RULES.map((rule) => {
              const passed = rule.test(values.password);
              return (
                <span key={rule.label} className={`text-[11px] ${passed ? 'text-success' : 'text-muted'}`}>
                  {passed ? '✓' : '○'} {rule.label}
                </span>
              );
            })}
            <span className="sr-only">{strengthOk ? 'Password strong enough' : `${passwordStrength} of 4 rules met`}</span>
          </div>
        </div>

        <Input
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={LockKeyhole}
          required
          value={values.confirmPassword}
          onChange={update('confirmPassword')}
          error={clientErrors.confirmPassword}
        />

        <Button type="submit" size="lg" className="w-full" loading={register.isPending}>
          {register.isPending ? 'Creating account…' : 'Create account'}
          {!register.isPending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted">
          By continuing you agree to use AlgoNest responsibly. We hash your password with bcrypt and never store it in plain text.
        </p>
      </form>
    </AuthShell>
  );
}
