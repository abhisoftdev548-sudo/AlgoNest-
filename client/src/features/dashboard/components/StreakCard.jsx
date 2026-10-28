import { Flame, Trophy } from 'lucide-react';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { formatDate } from '../../plans/lib/planUtils.js';

/** CSS ring — no SVG/animation dependency, works in light and dark. */
export default function StreakCard({ streak = {}, progress = {}, plan }) {
  const current = streak.current ?? 0;
  const longest = streak.longest ?? 0;
  const target = Math.max(7, Math.ceil((longest || 7) / 7) * 7);
  const percent = Math.min(100, Math.round((current / target) * 100));
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-ink">Streak</h2><Trophy className="h-4 w-4 text-accent" aria-hidden="true" /></div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--ag-primary) ${percent}%, var(--ag-line) 0)` }} aria-label={`${current} day streak`}>
          <div className="inline-flex h-16 w-16 flex-col items-center justify-center rounded-full bg-surface">
            <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
            <span className="text-xl font-bold leading-none text-ink">{current}</span>
            <span className="text-[9px] text-muted">days</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs text-muted">Best: <strong className="text-ink">{longest} days</strong></p>
          <p className="text-xs text-muted">Last active: <strong className="text-ink">{formatDate(streak.lastActiveDate)}</strong></p>
          <ProgressBar value={percent} label={`${percent}% of your ${target}-day goal`} tone={percent >= 70 ? 'success' : 'primary'} />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{plan ? `${plan.restDays.length} rest day(s) per week · completion ${progress.completionPercentage ?? 0}%` : 'Create a plan to track daily completion.'}</p>
    </section>
  );
}
