import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { NAV_ITEMS } from '../lib/navigation.js';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

/** Honest Phase-2 placeholder: no fake data, no dead-end click targets. */
export default function ModulePage() {
  const { pathname } = useLocation();
  const module = NAV_ITEMS.find((item) => item.to === pathname);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Coming in a later phase</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">{module?.label ?? 'Module'}</h1>
        <p className="mt-1.5 text-sm text-muted">
          Phase 1 ships the foundation: authentication, RBAC, onboarding, theming and the app shell. This module is intentionally empty.
        </p>
      </div>

      <EmptyState
        icon={Construction}
        title={`${module?.label ?? 'This module'} isn’t wired up yet`}
        description="The route, navigation and access control are ready. The data models, services and screens arrive with their phase — no stub data is shown here."
        action={<Link to="/app"><Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard</Button></Link>}
      />
    </div>
  );
}
