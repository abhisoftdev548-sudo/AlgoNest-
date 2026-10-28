import { useState } from 'react';
import { Check, RotateCcw, Send, ShieldCheck, X } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { STATUS_TONE, errorMessage, formatDate, statusLabel } from '../lib/sheetUtils.js';
import { useSheetLifecycle } from '../hooks/useSheets.js';

const CAN_SUBMIT = ['draft', 'changes_requested', 'rejected', 'approved'];

/** Author + moderation actions for the working copy of a sheet. */
export default function ModerationPanel({ sheetId, sheet, canModerate = false }) {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const lifecycle = useSheetLifecycle(sheetId);
  const status = sheet.status;

  const run = (mutation, args, successText) => {
    setMessage('');
    mutation.mutate(args, {
      onSuccess: () => { setMessage(successText); setNote(''); },
      onError: (error) => setMessage(errorMessage(error)),
    });
  };

  const anyPending = Object.values(lifecycle).some((item) => item.isPending);

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Publication
        </h3>
        <Badge variant={STATUS_TONE[status]}>{statusLabel(status)}</Badge>
      </div>

      {message ? <Alert variant="info">{message}</Alert> : null}
      {sheet.reviewNote ? (
        <div className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-ink">
          <p className="font-semibold text-warning">Last reviewer note</p>
          <p className="mt-1">{sheet.reviewNote}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="moderation-note" className="mb-1.5 block text-sm font-medium text-ink">Changelog / review note</label>
        <textarea
          id="moderation-note"
          rows={2}
          maxLength={1000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Describe your changes or explain a rejection…"
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CAN_SUBMIT.includes(status) ? (
          <Button size="sm" className="gap-1.5" loading={lifecycle.submit.isPending} onClick={() => run(lifecycle.submit, note, 'Submitted for review.')}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" /> Submit for review
          </Button>
        ) : null}

        {status === 'pending_review' && canModerate ? (
          <>
            <Button size="sm" variant="primary" className="gap-1.5" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'approve', note }, 'Sheet approved.')}>
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve
            </Button>
            <Button size="sm" variant="secondary" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'request_changes', note }, 'Changes requested.')}>
              Request changes
            </Button>
            <Button size="sm" variant="danger" className="gap-1.5" loading={lifecycle.moderate.isPending} onClick={() => run(lifecycle.moderate, { decision: 'reject', note }, 'Sheet rejected.')}>
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Reject
            </Button>
          </>
        ) : null}

        {status === 'approved' ? (
          <Button size="sm" className="gap-1.5" loading={lifecycle.publish.isPending} onClick={() => run(lifecycle.publish, note, 'Published — a new immutable version was created.')}>
            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Publish
          </Button>
        ) : null}

        {status === 'published' ? (
          <Button size="sm" variant="secondary" className="gap-1.5" loading={lifecycle.revision.isPending} onClick={() => run(lifecycle.revision, undefined, 'New draft revision started.')}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start new revision
          </Button>
        ) : null}

        {status === 'archived' ? (
          <Button size="sm" variant="secondary" loading={lifecycle.restore.isPending} onClick={() => run(lifecycle.restore, undefined, 'Restored to draft.')}>
            Restore
          </Button>
        ) : null}
      </div>

      {anyPending ? <p className="text-xs text-muted">Saving…</p> : null}

      {sheet.reviewHistory?.length ? (
        <details className="rounded-xl border border-line p-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted">History ({sheet.reviewHistory.length})</summary>
          <ul className="mt-2 space-y-1.5 text-[11px] text-muted">
            {[...sheet.reviewHistory].reverse().map((entry, index) => (
              <li key={`${entry.at}-${index}`}>
                {formatDate(entry.at)} · {statusLabel(entry.from)} → {statusLabel(entry.to)}
                {entry.note ? ` — ${entry.note}` : ''}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
