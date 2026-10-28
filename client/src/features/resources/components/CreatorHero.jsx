import { BadgeCheck, ExternalLink, Users } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import { safeExternalUrl } from '../lib/resourceUtils.js';

export default function CreatorHero({ profile }) {
  const website = safeExternalUrl(profile.website);
  return (
    <section className="ag-card flex flex-wrap items-start gap-4 p-5 sm:p-6">
      <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-2xl font-bold text-primary">{(profile.displayName || '?').charAt(0).toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-ink">{profile.displayName}{profile.verified ? <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified creator" /> : null}</h1>
        {profile.headline ? <p className="mt-1 text-sm font-medium text-primary">{profile.headline}</p> : null}
        {profile.bio ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{profile.bio}</p> : <p className="mt-2 text-sm text-muted">No bio yet.</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(profile.expertise ?? []).slice(0, 5).map((topic) => <Badge key={topic} variant="primary">{topic}</Badge>)}
          {profile.socials?.map((social) => {
            const href = safeExternalUrl(social.url);
            return href ? <a key={social.url} href={href} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-xs text-muted hover:border-primary/40 hover:text-primary">{social.label} <ExternalLink className="h-3 w-3" aria-hidden="true" /></a> : null;
          })}
          {website ? <a href={website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Website <ExternalLink className="h-3 w-3" aria-hidden="true" /></a> : null}
        </div>
      </div>
      {profile.stats ? (
        <dl className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[
            { label: 'Resources', value: profile.stats.publishedResources },
            { label: 'Views', value: profile.stats.views },
            { label: 'Saves', value: profile.stats.saves },
            { label: 'Completions', value: profile.stats.completions },
          ].map((row) => <div key={row.label} className="rounded-xl border border-line bg-surface-2/40 px-3 py-2"><dt className="flex items-center justify-center gap-1 text-[10px] text-muted"><Users className="h-3 w-3" aria-hidden="true" /> {row.label}</dt><dd className="mt-0.5 text-lg font-bold text-ink">{row.value ?? 0}</dd></div>)}
        </dl>
      ) : null}
    </section>
  );
}
