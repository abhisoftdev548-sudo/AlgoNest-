import { cn } from '../../lib/cn.js';

/** Original mark: a graph of connected nodes inside a rounded hexagon. */
export default function Logo({ size = 'md', showWordmark = false, className }) {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('relative inline-flex shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/30', box)}>
        <svg viewBox="0 0 40 40" className="h-3/5 w-3/5" fill="none" aria-hidden="true">
          <path
            d="M20 3.5 34 11.5v17L20 36.5 6 28.5v-17L20 3.5Z"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            strokeLinejoin="round"
          />
          <path d="M20 12v8m0 0-6 6m6-6 6 6" stroke="currentColor" strokeWidth="2" className="text-accent" strokeLinecap="round" />
          <circle cx="20" cy="11" r="2.6" className="fill-primary" />
          <circle cx="13" cy="27" r="2.6" className="fill-accent" />
          <circle cx="27" cy="27" r="2.6" className="fill-accent" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="text-lg font-bold tracking-tight text-ink">
          Algo<span className="text-primary">Nest</span>
        </span>
      ) : null}
    </span>
  );
}
