import { CircleHelp, Link2, Link2Off, LoaderCircle } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { LINK_TONE, formatDate, linkStatusLabel } from '../lib/resourceUtils.js';

const ICONS = { unchecked: CircleHelp, ok: Link2, broken: Link2Off, unknown: LoaderCircle };

export default function LinkStatusBadge({ status = 'unchecked', checkedAt, error, showDate = false }) {
  const Icon = ICONS[status] ?? CircleHelp;
  return (
    <span className="inline-flex items-center gap-1" title={error || linkStatusLabel(status)}>
      <Badge variant={LINK_TONE[status] ?? 'neutral'} className="gap-1"><Icon className="h-3 w-3" aria-hidden="true" /> {linkStatusLabel(status)}</Badge>
      {showDate && checkedAt ? <span className="text-[11px] text-muted">checked {formatDate(checkedAt)}</span> : null}
    </span>
  );
}
