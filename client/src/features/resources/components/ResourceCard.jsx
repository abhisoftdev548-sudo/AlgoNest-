import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, Eye, PlayCircle, Star, ThumbsUp } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import LinkStatusBadge from './LinkStatusBadge.jsx';
import {
  LEVEL_TONE, PRICING_TONE, STATUS_TONE, TYPE_TONE, formatNumber, levelLabel,
  pricingLabel, statusLabel, typeLabel,
} from '../lib/resourceUtils.js';

export default function ResourceCard({ resource, showStatus = false }) {
  return (
    <article className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={TYPE_TONE[resource.type] ?? 'neutral'}>{typeLabel(resource.type)}</Badge>
          <Badge variant={LEVEL_TONE[resource.level] ?? 'neutral'}>{levelLabel(resource.level)}</Badge>
          <Badge variant={PRICING_TONE[resource.pricing] ?? 'neutral'}>{pricingLabel(resource.pricing)}</Badge>
        </div>
        {showStatus ? <Badge variant={STATUS_TONE[resource.status] ?? 'neutral'}>{statusLabel(resource.status)}</Badge> : null}
      </div>
      <div className="min-h-0 flex-1">
        <Link to={`/app/resources/${resource.id}`} className="line-clamp-2 text-base font-semibold text-ink hover:text-primary focus-visible:text-primary">{resource.title}</Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{resource.description || 'No description provided.'}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge variant="primary">{resource.topic}</Badge>
        <span>{resource.platformLabel}</span>
        <span>·</span>
        <span>{resource.language === 'agnostic' ? 'Language agnostic' : resource.language}</span>
        {resource.tags?.slice(0, 2).map((tag) => <span key={tag} className="rounded-md bg-surface-2 px-1.5 py-0.5">#{tag}</span>)}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1" title="Rating"><Star className="h-3.5 w-3.5 text-warning" aria-hidden="true" /> {resource.ratingAverage || '—'} ({formatNumber(resource.ratingCount)})</span>
        <span className="inline-flex items-center gap-1" title="Helpful votes"><ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.helpfulCount)}</span>
        <span className="inline-flex items-center gap-1" title="Views"><Eye className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.viewCount)}</span>
        <span className="inline-flex items-center gap-1" title="Saves"><Bookmark className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.saveCount)}</span>
        <span className="inline-flex items-center gap-1" title="Starts"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> {formatNumber(resource.startCount)}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LinkStatusBadge status={resource.linkStatus} checkedAt={resource.linkCheckedAt} error={resource.linkCheckError} />
        <span className="flex items-center gap-2">
          <Link to={`/app/creators/${resource.author?.id ?? ''}`} className="truncate text-xs text-muted hover:text-primary">{resource.author?.name ?? 'Creator'}</Link>
          <a href={resource.url} target="_blank" rel="noopener noreferrer nofollow" aria-label={`Open ${resource.title} in a new tab`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:border-primary/40 hover:text-primary"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
        </span>
      </div>
    </article>
  );
}
