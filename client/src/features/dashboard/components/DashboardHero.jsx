import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { ShinyText, SpotlightCard } from '../../../components/reactbits/index.js';
import Button from '../../../components/ui/Button.jsx';
import { useCurrentUser } from '../../auth/store/authStore.js';
import { useIsDark } from '../../../store/themeStore.js';
import ContinueCard from './ContinueCard.jsx';
import { errorMessage, formatMinutes } from '../../plans/lib/planUtils.js';

export default function DashboardHero({ data, isError, error }) {
  const user = useCurrentUser();
  const isDark = useIsDark();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = data?.today;
  const overload = data?.overload;

  return (
    <div className="space-y-4">
      <div className="ag-rise">
        <ShinyText text="YOUR WORKSPACE // PHASE_05" speed={4} color={isDark ? '#94a5bd' : '#56657a'} shineColor={isDark ? '#2dd4bf' : '#0d9488'} className="text-[11px] font-bold tracking-[0.2em]" />
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Good to see you, {firstName}.</h1>
        <p className="mt-1.5 text-sm text-muted">Here is what to do next — built from your active plan, recent quiz and mock results.</p>
      </div>

      {isError ? <div className="rounded-xl border border-danger/30 bg-danger/8 p-4 text-sm text-danger">{errorMessage(error) || 'Could not load your dashboard.'}</div> : null}

      <SpotlightCard
        theme={isDark ? 'dark' : 'light'}
        spotlightColor={isDark ? '#2dd4bf' : '#0d9488'}
        className="border border-line p-5 transition-colors hover:border-primary/40 sm:p-7"
        style={{ '--spotlight-card-surface': 'var(--ag-surface)', '--spotlight-card-border': 'var(--ag-line)', '--spotlight-card-shadow': 'none' }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> What should I do now</span>
            <h2 className="mt-4 text-xl font-bold text-ink sm:text-2xl">{today?.tasks?.length ? `You have ${today.tasks.length} task${today.tasks.length === 1 ? '' : 's'} today.` : 'Your day is clear.'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {data?.plan
                ? `${today?.done ?? 0} done · ${formatMinutes(today?.minutes ?? 0)} planned against a ${formatMinutes(overload?.capacity ?? 0)} budget. Rest days never break your streak.`
                : 'Build an adaptive plan and we will distribute every problem, quiz, revision and mock across your calendar.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to="/app/plans"><Button className="gap-2">{data?.plan ? 'Open plan' : 'Build a plan'} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-warning"><Flame className="h-4 w-4" aria-hidden="true" /> {data?.streak?.current ?? 0}-day streak</span>
            </div>
          </div>
          <div className="w-full max-w-sm"><ContinueCard item={data?.continueWith} /></div>
        </div>
      </SpotlightCard>
    </div>
  );
}
