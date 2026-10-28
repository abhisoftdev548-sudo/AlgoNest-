import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, CalendarRange, FolderOpen, LayoutDashboard, ListChecks,
  LogOut, Settings, ShieldCheck, Timer, Users, X,
} from 'lucide-react';
import { ROLE_LABELS } from '@algonest/shared/constants';
import { NAV_ITEMS } from '../../lib/navigation.js';
import { cn } from '../../lib/cn.js';
import Logo from '../ui/Logo.jsx';
import Badge from '../ui/Badge.jsx';
import useAuth from '../../features/auth/hooks/useAuth.js';

const ICONS = { LayoutDashboard, BookOpen, ListChecks, Timer, CalendarRange, FolderOpen, Users };

export default function Sidebar({ mobileOpen, inactive, onClose, ref }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) });
  };

  return (
    <aside
      ref={ref}
      inert={inactive}
      role={mobileOpen ? 'dialog' : undefined}
      aria-modal={mobileOpen ? 'true' : undefined}
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}
      id="primary-navigation"
      aria-label="Primary navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Link to="/app" className="inline-flex items-center" aria-label="AlgoNest dashboard">
          <Logo showWordmark />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="ag-scrollbar flex-1 overflow-y-auto px-3 py-5" aria-label="Modules">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Workspace</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive ? 'bg-primary/12 text-primary' : 'text-muted hover:translate-x-0.5 hover:bg-surface-2 hover:text-ink',
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {!item.ready ? (
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>
                  ) : null}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <p className="mt-7 px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Account</p>
        <ul className="space-y-1">
          {user?.role && user.role !== 'student' ? (
            <li>
              <NavLink
                to="/app/admin"
                className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink')}
              >
                <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                Admin dashboard
              </NavLink>
            </li>
          ) : null}
          <li>
            <NavLink
              to="/app/settings"
              className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-primary/12 text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink')}
            >
              <Settings className="h-[18px] w-[18px]" aria-hidden="true" />
              Settings
            </NavLink>
          </li>
          {user?.role !== 'student' ? (
            <li className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted">
              <ShieldCheck className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
              <span className="flex-1">Staff access</span>
              <Badge variant="accent">{ROLE_LABELS[user.role] ?? user.role}</Badge>
            </li>
          ) : null}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl bg-surface-2/60 p-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary" aria-hidden="true">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.name ?? 'Student'}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-danger disabled:opacity-50"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
