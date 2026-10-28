import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, CheckCircle2, ExternalLink, Eye, Flag, PlayCircle, Star, ThumbsUp,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import LinkStatusBadge from './LinkStatusBadge.jsx';
import StarRating from './StarRating.jsx';
import HelpfulVote from './HelpfulVote.jsx';
import ReviewList from './ReviewList.jsx';
import ReportDialog from './ReportDialog.jsx';
import {
  LEVEL_TONE, PRICING_TONE, STATUS_TONE, TYPE_TONE, formatDate, formatNumber,
  languageLabel, levelLabel, linkStatusLabel, pricingLabel, safeExternalUrl,
  statusLabel, typeLabel,
} from '../lib/resourceUtils.js';

export default function ResourceDetail({
  resource, ratings, ratingsLoading, ratingsError, ratingsLoadError,
  onSave, onRate, onFeedback, onReport, onTrack,
  saving = false, ratingPending = false, feedbackPending = false, reportPending = false,
  reportError = '', canManage = false, moderation = null,
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const external = safeExternalUrl(resource.url);
  const isOwner = canManage && String(resource.author?.id) === String(resource.myAuthorId);

  const open = () => {
    onTrack?.('start');
    if (external) window.open(external, '_blank', 'noopener,noreferrer,nofollow');
  };
  const complete = () => { setCompleted(true); onTrack?.('completion'); };

  return (
    <div className="space-y-5">
      <header className="ag-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={TYPE_TONE[resource.type] ?? 'neutral'}>{typeLabel(resource.type)}</Badge>
              <Badge variant={LEVEL_TONE[resource.level] ?? 'neutral'}>{levelLabel(resource.level)}</Badge>
              <Badge variant={PRICING_TONE[resource.pricing] ?? 'neutral'}>{pricingLabel(resource.pricing)}</Badge>
              <Badge variant="primary">{resource.topic}</Badge>
              {canManage ? <Badge variant={STATUS_TONE[resource.status] ?? 'neutral'}>{statusLabel(resource.status)}</Badge> : null}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{resource.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{resource.description || 'No description provided.'}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>{resource.platformLabel} · {languageLabel(resource.language)}</span>
              <span>·</span>
              <Link to={`/app/creators/${resource.author?.id ?? ''}`} className="font-semibold text-primary hover:underline">{resource.author?.name ?? 'Creator'}</Link>
              <span>·</span><span>published {formatDate(resource.publishedAt ?? resource.createdAt)}</span>
            </p>
            {resource.tags?.length ? <div className="mt-3 flex flex-wrap gap-1.5">{resource.tags.map((tag) => <span key={tag} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">#{tag}</span>)}</div> : null}
          </div>
          <LinkStatusBadge status={resource.linkStatus} checkedAt={resource.linkCheckedAt} error={resource.linkCheckError} showDate />
        </div>

        {resource.linkStatus === 'broken' ? <Alert variant="warning" className="mt-4">This link was flagged as broken on {formatDate(resource.linkCheckedAt)}. {resource.linkCheckError || linkStatusLabel(resource.linkStatus)} — a moderator will re-check it soon.</Alert> : null}

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { Icon: Star, label: 'Rating', value: `${resource.ratingAverage || '—'} / 5`, hint: `${formatNumber(resource.ratingCount)} ratings` },
            { Icon: ThumbsUp, label: 'Helpful', value: formatNumber(resource.helpfulCount), hint: `${formatNumber(resource.notHelpfulCount)} not helpful` },
            { Icon: Eye, label: 'Views', value: formatNumber(resource.viewCount), hint: `${formatNumber(resource.startCount)} starts` },
            { Icon: Bookmark, label: 'Saves', value: formatNumber(resource.saveCount), hint: `${formatNumber(resource.completionCount)} completions` },
          ].map(({ Icon, label, value, hint }) => (
            <div key={label} className="rounded-xl border border-line bg-surface-2/40 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted"><Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> {label}</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
              <dd className="text-[11px] text-muted">{hint}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
          <Button className="gap-1.5" disabled={!external} onClick={open}><PlayCircle className="h-4 w-4" aria-hidden="true" /> Open resource</Button>
          <Button variant="secondary" className="gap-1.5" onClick={() => onSave(!resource.saved)} loading={saving} aria-pressed={resource.saved}><Bookmark className="h-4 w-4" fill={resource.saved ? 'currentColor' : 'none'} aria-hidden="true" /> {resource.saved ? 'Saved' : 'Save'}</Button>
          <Button variant="secondary" className="gap-1.5" disabled={completed} onClick={complete}><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {completed ? 'Completed' : 'Mark complete'}</Button>
          <Button variant="ghost" className="gap-1.5 text-danger" onClick={() => setReportOpen(true)}><Flag className="h-4 w-4" aria-hidden="true" /> Report</Button>
          {external ? <a href={external} target="_blank" rel="noopener noreferrer nofollow" className="ml-auto inline-flex items-center gap-1 self-center text-xs text-muted hover:text-primary">Raw link <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a> : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="ag-card p-5"><StarRating value={resource.myRating} average={resource.ratingAverage} count={resource.ratingCount} onSubmit={onRate} pending={ratingPending} disabled={isOwner} /></section>
        <section className="ag-card p-5"><HelpfulVote value={resource.myHelpful} helpfulCount={resource.helpfulCount} notHelpfulCount={resource.notHelpfulCount} onChange={onFeedback} pending={feedbackPending} /></section>
      </div>

      <section className="ag-card p-5"><h2 className="mb-3 text-sm font-semibold text-ink">Reviews</h2><ReviewList data={ratings} isLoading={ratingsLoading} isError={ratingsError} error={ratingsLoadError} /></section>
      {moderation}
      <ReportDialog
        open={reportOpen} onClose={() => setReportOpen(false)} pending={reportPending} error={reportError}
        onSubmit={(body) => onReport(body, () => setReportOpen(false))}
      />
    </div>
  );
}
