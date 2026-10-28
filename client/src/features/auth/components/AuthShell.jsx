import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '../../../components/ui/Logo.jsx';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';
import { ShinyText } from '../../../components/reactbits/index.js';
import { useIsDark } from '../../../store/themeStore.js';

/** Shared chrome for login / register / onboarding (React Bits used sparingly). */
export default function AuthShell({ title, subtitle, children, footer, wide = false }) {
  const isDark = useIsDark();

  return (
    <div className="relative min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="ag-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      {/* Brand / value panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface/40 px-12 py-10 lg:flex">
        <div
          className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/12 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-52 -right-32 h-96 w-96 rounded-full bg-accent/12 blur-3xl"
          aria-hidden="true"
        />
        <Link to="/" className="relative inline-flex w-fit items-center transition-transform duration-200 hover:scale-[1.03]" aria-label="AlgoNest home">
          <Logo showWordmark size="lg" />
        </Link>

        <div className="relative max-w-md">
          <ShinyText
            text="YOUR PREP, ORGANISED"
            speed={3}
            color={isDark ? '#94a5bd' : '#56657a'}
            shineColor={isDark ? '#2dd4bf' : '#0d9488'}
            className="text-xs font-bold tracking-[0.24em]"
          />
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink">
            Stop guessing what to<br />
            <span className="text-primary">study tomorrow.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Curated DSA sheets, timed quizzes, full-length mocks and a daily plan that adapts when life gets in the way.
          </p>
          <ul className="mt-9 space-y-4 text-sm text-ink/85">
            <li className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1"><Sparkles className="h-4 w-4 text-accent" aria-hidden="true" /> One clear next task, every single day</li>
            <li className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Your notes and progress stay yours</li>
          </ul>
        </div>

        <p className="relative text-xs text-muted">© {new Date().getFullYear()} AlgoNest · Built for placements, not procrastination.</p>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="lg:hidden"><Logo showWordmark /></Link>
          <span className="hidden lg:block" />
          <ThemeToggle />
        </div>

        <div className={`mx-auto flex w-full flex-1 flex-col justify-center py-10 ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <div className="ag-rise">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p> : null}
          </div>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
