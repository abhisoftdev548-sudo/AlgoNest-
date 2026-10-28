import { cn } from '../../lib/cn.js';

/** Deterministic, accessible progress meter (no animation dependency). */
export default function ProgressBar({ value = 0, max = 100, label, className, tone = 'primary' }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  const TONES = { primary: 'bg-primary', accent: 'bg-accent', success: 'bg-success', warning: 'bg-warning' };
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `${percent}% complete`}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-2', className)}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-500', TONES[tone] ?? TONES.primary)} style={{ width: `${percent}%` }} />
    </div>
  );
}
