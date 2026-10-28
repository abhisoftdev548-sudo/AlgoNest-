import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Kill every cached dep response: stale `?v=` chunks cause duplicate React. */
function preventStaleModules() {
  return {
    name: 'algonest-no-stale-modules',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
      });
    },
  };
}

/**
 * The browser always talks to `/api/...` (relative URLs). In dev Vite proxies
 * that to the Express server, so auth cookies stay same-origin and work behind
 * the Arena preview host as well as on localhost.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET || 'http://localhost:5000';
  const proxy = {
    '/api': { target, changeOrigin: true, secure: false },
  };

  return {
    plugins: [react(), tailwindcss(), preventStaleModules()],

    /**
     * A single React instance is non-negotiable. If two optimized chunks each
     * bundle their own React copy, the hooks dispatcher is null and zustand
     * dies with "Cannot read properties of null (reading 'useCallback')".
     */
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },

    /**
     * Pre-bundle everything up front. If Vite discovers gsap / motion only when
     * a lazy landing chunk loads, it re-optimises mid-session and the browser
     * mixes old `?v=` URLs with new ones → two React copies → blank screen.
     */
    optimizeDeps: {
      force: true,
      include: [
        'react', 'react-dom', 'react-dom/client',
        'react/jsx-runtime', 'react/jsx-dev-runtime',
        'react-router-dom', '@tanstack/react-query', 'zustand', 'lucide-react',
        'gsap', 'gsap/ScrollTrigger', 'motion/react',
      ],
    },

    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      allowedHosts: true, // preview hosts like https://5173-xxxx.e2b.app
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
      proxy,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      allowedHosts: true,
      proxy,
    },
    build: {
      outDir: 'dist',
      target: 'es2022',
      sourcemap: true,
      chunkSizeWarningLimit: 900,
    },
  };
});
