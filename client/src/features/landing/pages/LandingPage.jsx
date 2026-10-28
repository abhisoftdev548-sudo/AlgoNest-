import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, CalendarClock,
  Check, CirclePlay, Layers3, LockKeyhole, Sparkles, Target, Zap,
} from 'lucide-react';
import {
  AnimatedContent, BlurText, ClickSpark, CountUp, GlareHover, GradientText,
  GridMotion, Magnet, ShinyText, SpotlightCard, StarBorder,
} from '../../../components/reactbits/index.js';
import MicroInteractions from '../components/MicroInteractions.jsx';
import Logo from '../../../components/ui/Logo.jsx';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';
import Button from '../../../components/ui/Button.jsx';
import { useIsDark } from '../../../store/themeStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const TOPICS = [
  'Arrays', 'Two Pointers', 'Binary Search', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'Greedy', 'Heaps', 'Tries', 'Recursion', 'Sorting',
  'Sliding Window', 'Backtracking', 'BFS / DFS', 'Bit Manipulation', 'Strings',
  'Stacks & Queues', 'Hashing', 'Intervals', 'Math', 'Big-O', 'Segment Trees', 'Topo Sort',
];

const FEATURES = [
  {
    icon: Layers3,
    title: 'Sheets that build on each other',
    text: 'Curated, structured progressions with external problem links, personal notes, bookmarks and ratings. Clone any sheet and make it yours.',
  },
  {
    icon: BrainCircuit,
    title: 'Seven question types',
    text: 'MCQ, multi-select, true/false, ordering, matching, code-output and fill-in-the-blank — with timers, attempts and real explanations.',
  },
  {
    icon: CalendarClock,
    title: 'A plan that forgives you',
    text: 'Daily task distribution, automatic rescheduling of missed days and overload warnings when you bite off more than you can chew.',
  },
  {
    icon: BarChart3,
    title: 'Mocks that feel like the real thing',
    text: 'Sections, negative marking, question palette, mark-for-review, autosave and auto-submit — followed by honest result analysis.',
  },
  {
    icon: BookOpenCheck,
    title: 'One trustworthy resource library',
    text: 'Vetted YouTube, article, GitHub and PDF links with filters, saving, ratings and reports. No more 40-tab chaos.',
  },
  {
    icon: LockKeyhole,
    title: 'Your data stays yours',
    text: 'Progress, notes and personal resources live separately from shared content, so the original sheet is never modified by a student.',
  },
];

const STEPS = [
  { number: '01', title: 'Pick your goal', text: 'Beginner, placements, LeetCode, competitive programming or a 60-day interview sprint.' },
  { number: '02', title: 'Follow today’s plan', text: 'One dashboard answers “what should I do now?” — tasks, streak, weak topics, next mock.' },
  { number: '03', title: 'Measure and adapt', text: 'Quizzes and mocks surface weak topics; the next day’s plan quietly rebalances.' },
];

const STATS = [
  { to: 7, suffix: '', label: 'question types' },
  { to: 60, suffix: '', label: 'day interview track' },
  { to: 100, suffix: '%', label: 'your own progress data' },
];

export default function LandingPage() {
  const isDark = useIsDark();
  const status = useAuthStore((state) => state.status);
  const isSignedIn = status === 'authenticated';
  const primaryDestination = isSignedIn ? '/app' : '/register';
  const teal = isDark ? '#2dd4bf' : '#0d9488';

  return (
    <div className="min-h-screen overflow-hidden bg-canvas text-ink">
      <a href="#main-landing" className="skip-link">Skip to content</a>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8">
          <Link to="/" aria-label="AlgoNest home" className="transition-transform duration-200 hover:scale-[1.03]">
            <Logo showWordmark />
          </Link>
          <nav className="ml-8 hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Marketing">
            <a href="#features" className="transition-colors duration-200 hover:text-primary">Features</a>
            <a href="#interactions" className="transition-colors duration-200 hover:text-primary">Interactions</a>
            <a href="#how-it-works" className="transition-colors duration-200 hover:text-primary">How it works</a>
            <a href="#trust" className="transition-colors duration-200 hover:text-primary">Why AlgoNest</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {isSignedIn ? (
              <Link to="/app" className="hidden sm:block"><Button size="sm">Dashboard</Button></Link>
            ) : (
              <Link to="/login" className="hidden sm:block"><Button variant="ghost" size="sm">Sign in</Button></Link>
            )}
            <Magnet magnetStrength={3.2} maxOffset={10} padding={24}>
              <Link to={primaryDestination}>
                <Button size="sm" className="gap-1.5 transition-transform duration-200 hover:-translate-y-0.5">
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Magnet>
          </div>
        </div>
      </header>

      <main id="main-landing">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
            <GridMotion
              items={TOPICS}
              rows={4}
              angle={-12}
              tilt={8}
              speed={22}
              gap={14}
              radius={14}
              spotlight={0.55}
              dim={0.62}
              fade={0.72}
              theme={isDark ? 'dark' : 'light'}
              tileColor={isDark ? '#121c2c' : '#eef3f9'}
              textColor={isDark ? '#94a5bd' : '#56657a'}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/85 to-canvas" aria-hidden="true" />

          <ClickSpark
            sparkColor={teal}
            sparkCount={9}
            sparkRadius={30}
            sparkSize={10}
            sparkWidth={2}
            duration={520}
            className="relative mx-auto w-full max-w-5xl px-5 py-24 text-center sm:px-8"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 transition-colors duration-300 hover:border-primary/60">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <ShinyText
                text="STRUCTURED DSA PREP, BUILT FOR PLACEMENTS"
                speed={3.5}
                color={isDark ? '#94a5bd' : '#56657a'}
                shineColor={isDark ? '#5eead4' : '#0d9488'}
                className="text-[10px] font-bold tracking-[0.18em] sm:text-xs"
              />
            </div>

            <BlurText
              text="Master DSA with a plan that actually adapts."
              animateBy="words"
              direction="top"
              delay={90}
              stepDuration={0.32}
              className="mx-auto max-w-4xl justify-center text-center text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            />

            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Curated sheets, serious quizzes, full-length mock tests and a daily plan that reshuffles itself when you miss a day.
              <GradientText colors={['#2dd4bf', '#a78bfa', '#2dd4bf']} animationSpeed={9} className="font-semibold">
                {' '}Less guessing. More solving.
              </GradientText>
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnet magnetStrength={3.2} maxOffset={14} padding={40}>
                <StarBorder
                  as={Link}
                  to={primaryDestination}
                  radius={12}
                  thickness={1.2}
                  duration={4.5}
                  glow={0.7}
                  color={isDark ? '#5eead4' : '#ffffff'}
                  backgroundColor={teal}
                  textColor={isDark ? '#04201d' : '#ffffff'}
                  borderColor="transparent"
                  className="px-7 py-3.5 text-sm font-bold"
                >
                  {isSignedIn ? 'Open my dashboard' : 'Start preparing — it’s free'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </StarBorder>
              </Magnet>
              <a href="#how-it-works" className="transition-transform duration-200 hover:-translate-y-0.5">
                <Button variant="outline" size="lg" className="gap-2">
                  <CirclePlay className="h-4 w-4" aria-hidden="true" /> See how it works
                </Button>
              </a>
            </div>

            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-line pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-xl py-2 transition-colors duration-300 hover:bg-primary/5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold text-primary sm:text-3xl">
                      <CountUp
                        to={stat.to}
                        from={0}
                        duration={1.8}
                        suffix={stat.suffix}
                        trigger="view"
                        replayOnHover
                        className="cursor-pointer"
                      />
                    </span>
                    <span className="mt-1 block text-xs text-muted sm:text-sm">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </ClickSpark>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <AnimatedContent distance={30} duration={0.7} trigger="scroll" once>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">The ecosystem</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Everything you need, <GradientText colors={['#2dd4bf', '#a78bfa']} className="font-bold">connected</GradientText>.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                No scattered spreadsheets, no 30 open tabs. One coherent path from your first array problem to your final mock interview.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={46}
            duration={0.72}
            trigger="scroll"
            stagger={0.09}
            once
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlareHover
                  key={feature.title}
                  width="100%"
                  height="100%"
                  borderRadius="16px"
                  borderColor="transparent"
                  background="transparent"
                  glareColor={teal}
                  glareOpacity={0.3}
                  glareSize={34}
                  transitionDuration={620}
                  className="rounded-2xl"
                >
                  <SpotlightCard
                    theme={isDark ? 'dark' : 'light'}
                    spotlightColor={teal}
                    className="w-full border border-line p-7 transition-colors duration-300 hover:border-primary/40"
                    style={{
                      '--spotlight-card-surface': 'var(--ag-surface)',
                      '--spotlight-card-border': 'var(--ag-line)',
                      '--spotlight-card-shadow': 'none',
                    }}
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
                  </SpotlightCard>
                </GlareHover>
              );
            })}
          </AnimatedContent>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="border-y border-line bg-surface/50">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <AnimatedContent distance={28} duration={0.7} trigger="scroll" once>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">How it works</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Three steps. Then just show up.</h2>
                </div>
                <p className="max-w-md text-sm text-muted">The platform handles the planning; you handle the problems.</p>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={40}
              direction="horizontal"
              duration={0.72}
              trigger="scroll"
              stagger={0.12}
              once
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="ag-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <span className="font-mono text-sm font-bold text-primary">{step.number}</span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              ))}
            </AnimatedContent>
          </div>
        </section>

        {/* ── React Bits hover / animation showcase ───────────────────────── */}
        <MicroInteractions />

        {/* ── Trust / CTA ─────────────────────────────────────────────────── */}
        <section id="trust" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <AnimatedContent distance={36} duration={0.75} trigger="scroll" once>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Built for the long grind, not a dopamine hit.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    Short-lived access tokens, httpOnly refresh cookies, role-based access, validated inputs and versioned published content —
                    the boring engineering that keeps your preparation data safe.
                  </p>
                  <ul className="mt-7 grid gap-3 text-sm text-ink sm:grid-cols-2">
                    {['Dark & light mode', 'Keyboard accessible', 'Mobile-first quiz UI', 'Auditable content workflow'].map((item) => (
                      <li key={item} className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                        <Check className="h-4 w-4 text-primary" aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-line bg-canvas/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <Target className="h-8 w-8 text-accent" aria-hidden="true" />
                  <p className="mt-5 text-lg font-semibold text-ink">Ready to stop collecting roadmaps?</p>
                  <p className="mt-2 text-sm text-muted">Pick a goal and get your first task in under a minute.</p>
                  <Magnet magnetStrength={3} maxOffset={10} padding={26} wrapperClassName="mt-6 block w-full" innerClassName="w-full">
                    <Link to={primaryDestination} className="block w-full">
                      <Button size="lg" className="w-full gap-2"><Zap className="h-4 w-4" aria-hidden="true" /> {isSignedIn ? 'Open dashboard' : 'Create free account'}</Button>
                    </Link>
                  </Magnet>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo showWordmark size="sm" />
          <p>© {new Date().getFullYear()} AlgoNest. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/login" className="transition-colors hover:text-primary">Sign in</Link>
            <Link to="/register" className="transition-colors hover:text-primary">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
