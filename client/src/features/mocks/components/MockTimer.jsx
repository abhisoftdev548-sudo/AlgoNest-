import { Check, Clock3, LoaderCircle, TriangleAlert } from 'lucide-react';
import { formatClock } from '../lib/mockUtils.js';

/** Display-only. Every sync response from the server resets this clock. */
export default function MockTimer({ sectionSeconds = 0, attemptSeconds = 0, timerMode = 'sectional', saveState = 'saved', error = '', syncedAt }) {
  const urgent = sectionSeconds <= 60;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
      <div className={`flex items-center gap-3 ${urgent ? 'text-danger' : 'text-ink'}`}>
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{timerMode === 'sectional' ? 'Section time left' : 'Time left'}</p>
          <span className="font-mono text-lg font-bold tabular-nums" role="timer" aria-live={urgent ? 'polite' : 'off'} aria-label={`${Math.floor(sectionSeconds / 60)} minutes ${sectionSeconds % 60} seconds remaining`}>{formatClock(sectionSeconds)}</span>
        </div>
        {timerMode === 'sectional' ? (
          <div className="hidden border-l border-line pl-3 sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Total left</p>
            <span className="font-mono text-sm tabular-nums text-muted">{formatClock(attemptSeconds)}</span>
          </div>
        ) : null}
        {urgent ? <span className="flex items-center gap-1 text-xs font-semibold"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Hurry</span> : null}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
        {saveState === 'saving' ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving…</>
          : saveState === 'error' ? <><TriangleAlert className="h-3.5 w-3.5 text-danger" aria-hidden="true" /> <span className="text-danger">{error || 'Save failed'}</span></>
            : <><Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Saved{syncedAt ? ' · server clock synced' : ''}</>}
      </div>
    </div>
  );
}
