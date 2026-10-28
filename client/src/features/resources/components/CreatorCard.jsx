import { Link } from 'react-router-dom';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { safeExternalUrl } from '../lib/resourceUtils.js';

export default function CreatorCard({ profile }) {
  const id = profile.user?.id ?? profile.id;
  return (
    <Link to={`/app/creators/${id}`} className="ag-card group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-base font-bold text-primary">{(profile.displayName || '?').charAt(0).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink group-hover:text-primary">{profile.displayName}{profile.verified ? <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-label="Verified creator" /> : null}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">{profile.headline || 'AlgoNest creator'}</p>
        </div>
      </div>
      <p className="line-clamp-2 min-h-[2.5rem] text-xs text-muted">{profile.bio || 'No bio yet.'}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">{(profile.expertise ?? []).slice(0, 3).map((topic) => <Badge key={topic} variant="primary">{topic}</Badge>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span>{profile.stats?.publishedResources ?? 0} resources · {profile.stats?.views ?? 0} views</span>
        {safeExternalUrl(profile.website) ? <span className="inline-flex items-center gap-1 text-primary">Website <ExternalLink className="h-3 w-3" aria-hidden="true" /></span> : null}
      </div>
    </Link>
  );
}
