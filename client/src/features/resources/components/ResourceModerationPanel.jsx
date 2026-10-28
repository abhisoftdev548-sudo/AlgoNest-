import { useState } from 'react';
import { Check, RotateCcw, Send, ShieldCheck, X, Zap } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_TONE, errorMessage, formatDate, statusLabel } from '../lib/resourceUtils.js';
import { useResourceLifecycle } from '../hooks/useResources.js';

const CAN_SUBMIT = ['draft', 'changes_requested', 'rejected', 'approved'];

export default function ResourceModerationPanel({ resource, canModerate = false }) {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lifecycle = useResourceLifecycle(resource.id);
  const status = resource.status;

  const run = (mutation, args, successText) => {
    setMessage('');
    mutation.mutate(args, {
      onSuccess: () => { setMessage(successText); setNote(''); },
      onError: (error) => setMessage(errorMessage(error)),
    });
  };
  const anyPending = Object.values(lifecycle).some((mutation) => mutation.isPending);

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Publication &amp; link health</h2>
        <Badge variant={STATUS_TONE[status] ?? 'neutral'}>{statusLabel(status)}</Badge>
      </div>
      {message ? <Alert variant="info">{message}</Alert> : null}
      {resource.reviewNote ? <div className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-ink"><p className="font-semibold text-warning">Last reviewer note</p><p className="mt-1">{resource.reviewNote}</p></div> : null}
      <div>
        <label htmlFor="resource-review-note" className="mb-1.5 block text-sm font-medium text-ink">Changelog / review note</label>
        <textarea id="resource-review-note" rows={2} maxLength={1000} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Explain a rejection, or describe your changes…" className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
      </div>
      <div className="flex flex-wrap gap-2">
        {CAN_SUBMIT.includes(status) ? <Button size="sm" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.submit, undefined, 'Submitted for review.')}><Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit for review</Button> : null}
        {status === 'pending_review' && canModerate ? <>
          <Button size="sm" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.moderate, { decision: 'approve', note }, 'Resource approved.')}><Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve</Button>
          <Button size="sm" variant="secondary" disabled={!note.trim() || anyPending} onClick={() => run(lifecycle.moderate, { decision: 'request_changes', note }, 'Changes requested.')}>Request changes</Button>
          <Button size="sm" variant="danger" className="gap-1.5" disabled={!note.trim() || anyPending} onClick={() => run(lifecycle.moderate, { decision: 'reject', note }, 'Resource rejected.')}><X className="h-3.5 w-3.5" aria-hidden="true" /> Reject</Button>
        </> : null}
        {status === 'approved' ? <Button size="sm" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.publish, undefined, 'Published.')}><Check className="h-3.5 w-3.5" aria-hidden="true" /> Publish</Button> : null}
        {status === 'published' ? <>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.revision, undefined, 'New draft revision started.')}><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start revision</Button>
          <Button size="sm" variant="secondary" className="gap-1.5" disabled={anyPending} onClick={() => run(lifecycle.checkLink, undefined, 'Link checked.')}><Zap className="h-3.5 w-3.5" aria-hidden="true" /> Check link now</Button>
        </> : null}
        {status === 'archived' ? <Button size="sm" variant="secondary" disabled={anyPending} onClick={() => run(lifecycle.restore, undefined, 'Restored to draft.')}>Restore</Button> : null}
      </div>
      <div className="border-t border-line pt-3 text-xs text-muted">
        <p>Link: <span className="font-mono text-ink">{resource.linkStatus}</span>{resource.linkHttpStatus ? ` (HTTP ${resource.linkHttpStatus})` : ''} · checked {formatDate(resource.linkCheckedAt)}</p>
        <p className="mt-1">Canonical key: <span className="font-mono text-ink">{resource.urlKey}</span> · {resource.reportCount ?? 0} report(s)</p>
      </div>
      {resource.reviewHistory?.length ? <ol className="space-y-1 border-t border-line pt-3 text-xs text-muted">{resource.reviewHistory.slice(-4).reverse().map((entry, index) => <li key={`${entry.at}-${index}`}><span className="font-medium text-ink">{entry.decision || entry.to}</span> · {formatDate(entry.at)}{entry.note ? ` — ${entry.note}` : ''}</li>)}</ol> : null}
      {Object.values(lifecycle).find((mutation) => mutation.isError) ? <Alert variant="error">{errorMessage(Object.values(lifecycle).find((mutation) => mutation.isError).error)}</Alert> : null}
    </section>
  );
}
