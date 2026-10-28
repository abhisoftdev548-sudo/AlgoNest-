import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn.js';

/** Accessible text input with label, hint, error and optional leading icon. */
const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, trailing, className, containerClassName, id, required, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-1 text-danger" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        ) : null}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink',
            'placeholder:text-muted/70 transition-colors',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            Icon && 'pl-10',
            trailing && 'pr-12',
            error && 'border-danger focus:border-danger focus:ring-danger/25',
            className,
          )}
          {...props}
        />
        {trailing ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div> : null}
      </div>
      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : null}
    </div>
  );
});

export default Input;
