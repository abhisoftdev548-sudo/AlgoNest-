import { cn } from '../../lib/cn.js';

const VARIANTS = {
  neutral: 'bg-surface-2 text-muted border-line',
  primary: 'bg-primary/12 text-primary border-primary/25',
  accent: 'bg-accent/12 text-accent border-accent/25',
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/10 text-warning border-warning/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
};

export default function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
