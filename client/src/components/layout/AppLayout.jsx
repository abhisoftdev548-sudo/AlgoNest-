import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import ErrorBoundary from '../common/ErrorBoundary.jsx';
import Button from '../ui/Button.jsx';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const wasMobileOpen = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      sidebarRef.current?.querySelector('button, a')?.focus();
      wasMobileOpen.current = true;
    } else if (wasMobileOpen.current) {
      menuButtonRef.current?.focus();
      wasMobileOpen.current = false;
    }
  }, [mobileOpen]);

  // Close the drawer on navigation; keep keyboard focus inside it while modal.
  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setMobileOpen(false); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...(sidebarRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <Sidebar ref={sidebarRef} mobileOpen={mobileOpen} inactive={!mobileOpen && !isDesktop} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <Topbar menuButtonRef={menuButtonRef} menuOpen={mobileOpen} onMenuClick={() => setMobileOpen((open) => !open)} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <ErrorBoundary fallback={({ retry }) => (
            <section role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
              <TriangleAlert className="h-9 w-9 text-warning" aria-hidden="true" />
              <h1 className="text-xl font-bold text-ink">This page hit a problem</h1>
              <p className="text-sm text-muted">Your navigation is still available. Try rendering this page again or choose another section.</p>
              <Button onClick={retry}>Try again</Button>
            </section>
          )}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
