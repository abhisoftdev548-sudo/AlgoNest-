import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI state: theme. Persisted so the choice survives reloads; the inline script
 * in index.html applies it before React mounts (no flash of the wrong theme).
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        if (theme !== 'dark' && theme !== 'light') return;
        set({ theme });
        get().apply(theme);
      },
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        get().apply(next);
      },
      apply: (theme = get().theme) => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', theme === 'dark' ? '#070b14' : '#f6f8fb');
      },
    }),
    {
      name: 'algonest-theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => state?.apply(),
    },
  ),
);

export const useIsDark = () => useThemeStore((state) => state.theme === 'dark');
