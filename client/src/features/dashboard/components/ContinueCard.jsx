import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, CirclePlay, ListChecks, Timer } from 'lucide-react';

const ICONS = { quiz_attempt: ListChecks, mock_attempt: Timer, plan_task: CirclePlay, sheet_problem: BookOpen };

export default function ContinueCard({ item }) {
  if (!item) return (
    <div className="rounded-2xl border border-dashed border-line bg-surface-2/40 p-5 text-sm text-muted">
      <p className="font-semibold text-ink">All caught up</p>
      <p className="mt-1 text-xs">Open a sheet, take a quiz, or create a plan to keep the streak alive.</p>
      <Link to="/app/sheets" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Browse sheets <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
    </div>
  );
  const Icon = ICONS[item.kind] ?? CirclePlay;
  return (
    <Link to={item.href} className="group block rounded-2xl border border-primary/25 bg-primary/8 p-5 transition-colors hover:border-primary/60 focus-visible:border-primary">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Continue where you left off</p>
          <p className="mt-1 truncate text-sm font-semibold text-ink group-hover:text-primary">{item.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </div>
    </Link>
  );
}
