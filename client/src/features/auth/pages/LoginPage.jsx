import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { loginSchema, zodFieldErrors } from '@algonest/shared';
import AuthShell from '../components/AuthShell.jsx';
import useAuth from '../hooks/useAuth.js';
import { ApiClientError } from '../../../lib/apiClient.js';
import Alert from '../../../components/ui/Alert.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [clientErrors, setClientErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const destination = location.state?.from?.startsWith('/app') ? location.state.from : '/app';
  const serverErrors = login.error instanceof ApiClientError ? login.error.fieldErrors : {};
  const errors = { ...serverErrors, ...clientErrors };
  const generalError = login.error && Object.keys(serverErrors).length === 0 ? login.error.message : null;

  const update = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setClientErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setClientErrors({});
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setClientErrors(zodFieldErrors(parsed.error));
      return;
    }
    login.mutate(parsed.data, { onSuccess: () => navigate(destination, { replace: true }) });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up exactly where your plan left off."
      footer={<>New to AlgoNest? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {generalError ? <Alert variant="error" title="Could not sign in">{generalError}</Alert> : null}

        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@college.edu"
          icon={Mail}
          required
          value={values.email}
          onChange={update('email')}
          error={errors.email}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            icon={LockKeyhole}
            required
            value={values.password}
            onChange={update('password')}
            error={errors.password}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="rounded-lg p-1.5 text-muted hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
          {!login.isPending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </Button>

        <p className="text-center text-xs text-muted">
          Your session refreshes automatically. Accounts are locked for 15 minutes after 5 failed attempts.
        </p>
      </form>
    </AuthShell>
  );
}
