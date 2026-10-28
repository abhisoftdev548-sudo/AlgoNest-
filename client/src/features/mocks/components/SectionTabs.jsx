import { Check, Clock3, LockKeyhole } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { formatClock } from '../lib/mockUtils.js';

/** Section strip for the solver. Locked sections are visible but disabled. */
export default function SectionTabs({ sections = [], states = [], activeSectionId, onSelect, timerMode = 'sectional' }) {
  const statusOf = (id) => states.find((state) => state.sectionId === id)?.status ?? 'pending';
  return (
    <nav aria-label="Mock sections" className="ag-scrollbar flex gap-2 overflow-x-auto pb-1">
      {sections.map((section, index) => {
        const status = statusOf(section.id);
        const locked = timerMode === 'sectional' && status !== 'active';
        const active = section.id === activeSectionId;
        return (
          <button
            key={section.id}
            type="button"
            disabled={locked}
            onClick={() => onSelect(index)}
            aria-current={active ? 'true' : undefined}
            className={`flex min-w-40 shrink-0 flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left transition-colors ${active ? 'border-primary bg-primary/10' : 'border-line bg-surface'} ${locked ? 'cursor-not-allowed opacity-55' : 'hover:border-primary/40'}`}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold text-ink">{index + 1}. {section.title}</span>
              {status === 'submitted' || status === 'timed_out' ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : null}
              {status === 'active' ? <Badge variant="primary">Live</Badge> : null}
              {status === 'pending' && timerMode === 'sectional' ? <LockKeyhole className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> : null}
            </span>
            <span className="flex items-center gap-2 text-[11px] text-muted">
              <span>{section.questionCount} Q</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" aria-hidden="true" /> {formatClock(section.durationMinutes * 60)}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
