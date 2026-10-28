import { ArrowUpRight, Bookmark, FileQuestion } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Badge from '../../../components/ui/Badge.jsx';

/** Real DB-backed suggestions: published sheet problems + the user's own library. */
export default function RecommendedResources({ items = [] }) {
  if (!items.length) return (
    <EmptyState compact icon={Bookmark} title="No matching resources yet" description="Save a link for a weak topic in your personal library, or publish a sheet covering it — recommendations appear here automatically." />
  );
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-primary/40 focus-visible:border-primary"
          >
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileQuestion className="h-4 w-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-ink">{item.title}</span>
                <Badge variant={item.source === 'personal' ? 'accent' : 'primary'}>{item.source === 'personal' ? 'Saved by you' : 'Curated sheet'}</Badge>
              </span>
              <span className="mt-1 block text-xs text-muted">{item.topic} · {item.reason}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
