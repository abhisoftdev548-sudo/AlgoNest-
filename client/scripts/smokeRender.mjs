/**
 * Render smoke test: catches render-time crashes (undefined components, bad
 * props, broken React Bits imports) that `vite build` and ESLint cannot see.
 * Effects do not run under renderToString — this is deliberately a render
 * check, not a browser interaction test.
 *
 * react-router-dom v7 ships a CJS `node` export, so SSR aliases it to its ESM
 * build to keep a single RouterContext instance across all modules.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';

const here = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(here, '..');
const require = createRequire(import.meta.url);
const routerPackage = require.resolve('react-router-dom/package.json');
const esmRouter = path.join(path.dirname(routerPackage), 'dist/index.mjs');

const PAGES = [
  ['LandingPage', '/src/features/landing/pages/LandingPage.jsx'],
  ['HomePage', '/src/features/home/pages/HomePage.jsx'],
  ['NotFoundPage', '/src/pages/NotFoundPage.jsx'],
  ['LoginPage', '/src/features/auth/pages/LoginPage.jsx'],
  ['RegisterPage', '/src/features/auth/pages/RegisterPage.jsx'],
  ['OnboardingPage', '/src/features/auth/pages/OnboardingPage.jsx'],
  ['SettingsPage', '/src/features/settings/pages/SettingsPage.jsx'],
  ['ModulePage', '/src/pages/ModulePage.jsx'],
  ['MicroInteractions', '/src/features/landing/components/MicroInteractions.jsx'],
  ['SheetsPage', '/src/features/sheets/pages/SheetsPage.jsx'],
  ['SheetDetailPage', '/src/features/sheets/pages/SheetDetailPage.jsx'],
  ['SheetEditorPage', '/src/features/sheets/pages/SheetEditorPage.jsx'],
  ['QuizzesPage', '/src/features/quizzes/pages/QuizzesPage.jsx'],
  ['QuizDetailPage', '/src/features/quizzes/pages/QuizDetailPage.jsx'],
  ['QuizEditorPage', '/src/features/quizzes/pages/QuizEditorPage.jsx'],
  ['QuizSolverPage', '/src/features/quizzes/pages/QuizSolverPage.jsx'],
  ['QuizResultPage', '/src/features/quizzes/pages/QuizResultPage.jsx'],
  ['MocksPage', '/src/features/mocks/pages/MocksPage.jsx'],
  ['MockDetailPage', '/src/features/mocks/pages/MockDetailPage.jsx'],
  ['MockEditorPage', '/src/features/mocks/pages/MockEditorPage.jsx'],
  ['MockSolverPage', '/src/features/mocks/pages/MockSolverPage.jsx'],
  ['MockResultPage', '/src/features/mocks/pages/MockResultPage.jsx'],
  ['PlansPage', '/src/features/plans/pages/PlansPage.jsx'],
  ['PlanDetailPage', '/src/features/plans/pages/PlanDetailPage.jsx'],
  ['PlanEditorPage', '/src/features/plans/pages/PlanEditorPage.jsx'],
  ['ResourcesPage', '/src/features/resources/pages/ResourcesPage.jsx'],
  ['ResourceDetailPage', '/src/features/resources/pages/ResourceDetailPage.jsx'],
  ['ResourceEditorPage', '/src/features/resources/pages/ResourceEditorPage.jsx'],
  ['CreatorsPage', '/src/features/resources/pages/CreatorsPage.jsx'],
  ['CreatorPage', '/src/features/resources/pages/CreatorPage.jsx'],
  ['AdminPage', '/src/features/admin/pages/AdminPage.jsx'],
];

const vite = await createServer({
  root: clientRoot,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
  optimizeDeps: { noDiscovery: true, include: [] },
  resolve: { alias: { 'react-router-dom': esmRouter } },
  ssr: { noExternal: ['react-router-dom', 'react-router'] },
});

let failed = 0;
try {
  const { wrap } = await vite.ssrLoadModule('/scripts/RenderHarness.jsx');
  for (const [name, modulePath] of PAGES) {
    try {
      const module = await vite.ssrLoadModule(modulePath);
      const html = renderToString(wrap(module.default));
      if (!html || html.length < 50) throw new Error('suspiciously short render output');
      console.info(`  ok  ${name.padEnd(20)} ${html.length} chars`);
    } catch (error) {
      failed += 1;
      console.error(`  FAIL ${name}: ${String(error.message).slice(0, 500)}`);
    }
  }
} finally {
  await vite.close();
}

console.info(`[render] ${PAGES.length - failed}/${PAGES.length} pages rendered`);
process.exit(failed > 0 ? 1 : 0);
