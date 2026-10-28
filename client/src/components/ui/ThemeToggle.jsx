import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore.js';
import { cn } from '../../lib/cn.js';

export default function ThemeToggle({ className, withLabel = false }) {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggle);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-muted transition-colors hover:text-ink',
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      {withLabel ? <span>{isDark ? 'Light' : 'Dark'}</span> : null}
    </button>
  );
}
