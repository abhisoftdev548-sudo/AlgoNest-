import { Component } from 'react';
import { TriangleAlert } from 'lucide-react';
import Button from '../ui/Button.jsx';

/**
 * Stale lazy chunks are the most common cause of a blank screen right after a
 * deploy or a Vite dependency re-optimisation: the browser still has the old
 * module graph. Mixing an old and new React chunk additionally produces
 * "Cannot read properties of null (reading 'useCallback')" from zustand.
 * Reload once (rate-limited) instead of showing an error forever.
 */
const CHUNK_ERROR = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|does not provide an export named|Failed to resolve module specifier|Outdated Optimize Dep|Failed to fetch|Invalid hook call|Cannot read properties of null \(reading 'use|dispatcher is null|resolveDispatcher/i;
const RELOAD_KEY = 'ag:last-auto-reload';
const RELOAD_WINDOW_MS = 20000;

function tryAutoReload() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    return true;
  } catch {
    return false; // private mode / storage disabled — never crash on this path
  }
}

/** Last line of defence for render-time crashes; shows a recoverable screen. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AlgoNest] render error:', error, info.componentStack);
    if (CHUNK_ERROR.test(error?.message ?? '') && tryAutoReload()) {
      window.location.reload();
    }
  }

  handleRetry = () => this.setState({ error: null });

  handleReload = () => {
    try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ }
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return typeof this.props.fallback === 'function'
        ? this.props.fallback({ error, retry: this.handleRetry, reload: this.handleReload })
        : this.props.fallback;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
        <TriangleAlert className="h-10 w-10 text-warning" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-ink">Something broke on this screen</h1>
        <p className="max-w-md text-sm text-muted">
          The rest of AlgoNest is fine. Reload this screen, or go back to the dashboard.
        </p>

        {import.meta.env.DEV ? (
          <details className="w-full max-w-xl rounded-xl border border-line bg-surface p-3 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-muted">Technical details</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-warning">
              {error.stack || error.message || String(error)}
            </pre>
          </details>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={this.handleRetry}>Try again</Button>
          <Button variant="secondary" onClick={this.handleReload}>Hard reload</Button>
          <Button variant="ghost" onClick={() => window.location.assign('/app')}>Go to dashboard</Button>
        </div>
      </div>
    );
  }
}
