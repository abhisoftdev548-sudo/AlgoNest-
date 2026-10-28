import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-line bg-surface px-3.5 pr-10 text-sm text-ink',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            error && 'border-danger',
            className,
          )}
          {...props}
        >
          {placeholder ? <option value="" disabled>{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
      {hint && !error ? <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
});

export default Select;
