import { cn } from '../../lib/cn.js';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('ag-card shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, title, description, action }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4', className)}>
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('px-5 py-5', className)}>{children}</div>;
}

export default Card;
