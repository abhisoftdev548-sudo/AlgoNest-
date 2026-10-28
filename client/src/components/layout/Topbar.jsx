import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Flame, LogOut, Menu, Search, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { ROLE_LABELS } from '@algonest/shared/constants';
import { NAV_ITEMS } from '../../lib/navigation.js';
import { cn } from '../../lib/cn.js';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import Badge from '../ui/Badge.jsx';
import useAuth from '../../features/auth/hooks/useAuth.js';

export default function Topbar({ onMenuClick, menuButtonRef, menuOpen }) {
  const navigate = useNavigate();
  const { user, logout, logoutAll } = useAuth();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(searchRef, () => setSearchOpen(false), searchOpen);
  useClickOutside(notificationsRef, () => setNotificationsOpen(false), notificationsOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(term));
  }, [query]);

  const goToResult = (item) => {
    if (!item) return;
    navigate(item.to);
    setSearchOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      goToResult(results[activeIndex]);
    }
  };

  const initials = (user?.name ?? '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const streak = user?.streak?.current ?? 0;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl sm:px-6">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onMenuClick}
        className="rounded-xl border border-line bg-surface p-2 text-muted hover:text-ink lg:hidden"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Local, fully functional module search — no fake backend call. */}
      <div ref={searchRef} className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Jump to a module…"
          aria-label="Search modules"
          role="combobox"
          aria-expanded={searchOpen}
          aria-controls="global-search-results"
          aria-autocomplete="list"
          aria-activedescendant={searchOpen && results[activeIndex] ? `search-option-${activeIndex}` : undefined}
          className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchOpen ? (
          <div id="global-search-results" role="listbox" aria-label="Modules" className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-xl">
            {results.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted">No module matches “{query}”.</p>
            ) : (
              results.map((item, index) => (
                <button
                  key={item.to}
                  id={`search-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToResult(item)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm',
                    index === activeIndex ? 'bg-primary/12 text-primary' : 'text-ink hover:bg-surface-2',
                  )}
                >
                  <span>{item.label}</span>
                  {!item.ready ? <span className="text-[10px] uppercase tracking-wide text-muted">Phase 2</span> : null}
                </button>
              ))
            )}
            <p className="border-t border-line px-3 pb-1 pt-2 text-[11px] text-muted">↑ ↓ to navigate · Enter to open · Esc to close</p>
          </div>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="hidden items-center gap-1.5 rounded-xl border border-warning/25 bg-warning/8 px-3 py-2 text-sm font-semibold text-warning sm:inline-flex"
          title={`Longest streak: ${user?.streak?.longest ?? 0} days`}
          aria-label={`${streak} day streak. Longest streak ${user?.streak?.longest ?? 0} days.`}
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          {streak} <span className="hidden font-medium md:inline">day streak</span>
        </div>

        <ThemeToggle className="hidden sm:inline-flex" />

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative rounded-xl border border-line bg-surface p-2.5 text-muted transition-colors hover:text-ink"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="dialog"
          >
            <Bell className="h-4 w-4" />
          </button>
          {notificationsOpen ? (
            <div role="dialog" aria-label="Notifications" className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-line bg-surface p-4 shadow-xl">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              <div className="mt-4 rounded-xl border border-dashed border-line px-4 py-8 text-center">
                <Bell className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium text-ink">You’re all caught up</p>
                <p className="mt-1 text-xs text-muted">Mock reminders and plan nudges will show up here.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface py-1.5 pl-1.5 pr-2.5 text-sm transition-colors hover:border-primary/40"
            aria-label="Account menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">{initials}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          </button>
          {profileOpen ? (
            <div role="menu" className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-line bg-surface p-2 shadow-xl">
              <div className="border-b border-line px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <Badge variant="accent">{ROLE_LABELS[user?.role] ?? 'Student'}</Badge>
                </div>
              </div>
              <Link to="/app/settings" role="menuitem" onClick={() => setProfileOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-2">
                <Settings className="h-4 w-4 text-muted" aria-hidden="true" /> Settings
              </Link>
              <Link to="/" role="menuitem" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-2">
                <UserRound className="h-4 w-4 text-muted" aria-hidden="true" /> View landing page
              </Link>
              <div className="my-1 border-t border-line" />
              <button type="button" role="menuitem" disabled={logout.isPending} onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface-2 disabled:opacity-50">
                <LogOut className="h-4 w-4 text-muted" aria-hidden="true" /> Sign out
              </button>
              <button type="button" role="menuitem" disabled={logoutAll.isPending} onClick={() => logoutAll.mutate(undefined, { onSettled: () => navigate('/login', { replace: true }) })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-muted hover:bg-surface-2 disabled:opacity-50">
                Sign out of all devices
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
