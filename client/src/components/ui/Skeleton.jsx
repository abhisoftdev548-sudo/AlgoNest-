import { cn } from '../../lib/cn.js';

export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-2', className)} aria-hidden="true" />;
}
