import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const VARIANTS = {
  error: { Icon: AlertCircle, classes: 'border-danger/30 bg-danger/8 text-danger' },
  success: { Icon: CheckCircle2, classes: 'border-success/30 bg-success/8 text-success' },
  warning: { Icon: TriangleAlert, classes: 'border-warning/30 bg-warning/8 text-warning' },
  info: { Icon: Info, classes: 'border-primary/30 bg-primary/8 text-primary' },
};

export default function Alert({ variant = 'info', title, children, className, onDismiss }) {
  const { Icon, classes } = VARIANTS[variant] ?? VARIANTS.info;
  return (
    <div role="alert" className={cn('flex gap-3 rounded-xl border px-4 py-3 text-sm', classes, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn('text-ink/80', title && 'mt-1')}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} className="text-xs underline underline-offset-2" aria-label="Dismiss">
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
