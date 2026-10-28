import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';

export default function HelpfulVote({ value = null, helpfulCount = 0, notHelpfulCount = 0, onChange, pending = false }) {
  const vote = (next) => onChange(value === next ? null : next);
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-ink">Was this helpful?</h2>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={value === true ? 'primary' : 'secondary'} className="gap-1.5" disabled={pending} aria-pressed={value === true} onClick={() => vote(true)}><ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> Yes · {helpfulCount}</Button>
        <Button size="sm" variant={value === false ? 'danger' : 'secondary'} className="gap-1.5" disabled={pending} aria-pressed={value === false} onClick={() => vote(false)}><ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" /> No · {notHelpfulCount}</Button>
        {value !== null ? <button type="button" onClick={() => onChange(null)} className="text-xs text-muted underline hover:text-primary">Withdraw vote</button> : null}
      </div>
      <p className="text-xs text-muted">Net score {helpfulCount - notHelpfulCount}. Withdraw by clicking your vote again.</p>
    </section>
  );
}
