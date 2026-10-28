import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import Logo from './Logo.jsx';

export function Spinner({ className, label = 'Loading' }) {
  return (
    <LoaderCircle className={cn('h-5 w-5 animate-spin text-primary', className)} role="status" aria-label={label} />
  );
}

export function FullPageLoader({ label = 'Preparing your workspace…' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas text-ink">
      <Logo size="lg" showWordmark />
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Spinner;
