import { Check, Clock3, LoaderCircle, TriangleAlert } from 'lucide-react';
import { formatClock } from '../lib/quizUtils.js';

/** Display-only countdown. `expiresAt` on the server is authoritative. */
export default function QuizTimer({ remainingSeconds = 0, saveState = 'saved', autosaveError = '' }) {
  const urgent = remainingSeconds <= 60;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
      <div className={`flex items-center gap-2 ${urgent ? 'text-danger' : 'text-ink'}`}>
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono text-lg font-bold tabular-nums" role="timer" aria-live={urgent ? 'polite' : 'off'} aria-label={`${Math.floor(remainingSeconds / 60)} minutes ${remainingSeconds % 60} seconds remaining`}>
          {formatClock(remainingSeconds)}
        </span>
        {urgent ? <span className="flex items-center gap-1 text-xs font-semibold"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Hurry</span> : null}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
        {saveState === 'saving' ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving…</>
          : saveState === 'error' ? <><TriangleAlert className="h-3.5 w-3.5 text-danger" aria-hidden="true" /> <span className="text-danger">{autosaveError || 'Save failed'}</span></>
            : <><Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Answers saved</>}
      </div>
    </div>
  );
}
