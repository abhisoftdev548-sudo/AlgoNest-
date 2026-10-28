import { ArrowUpRight, Clock3, ExternalLink, Lightbulb } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { DIFFICULTY_TONE, difficultyLabel, formatMinutes, platformLabel } from '../lib/sheetUtils.js';

/** Centre pane: everything about a single problem, with a safe external link. */
export default function ProblemDetail({ problem }) {
  if (!problem) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center">
        <p className="text-sm text-muted">Select a problem from the list to see its details.</p>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={DIFFICULTY_TONE[problem.difficulty]}>{difficultyLabel(problem.difficulty)}</Badge>
        <Badge variant="primary">{platformLabel(problem.platform)}</Badge>
        <Badge>{problem.topic}</Badge>
      </div>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-ink sm:text-2xl">{problem.title}</h2>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> ~{formatMinutes(problem.estimatedMinutes)}</span>
        <span className="truncate">{problem.platformLabel || platformLabel(problem.platform)}</span>
      </div>

      <p className="mt-5 break-all rounded-xl border border-line bg-surface-2/40 p-3 font-mono text-[11px] leading-relaxed text-muted">
        {problem.url}
      </p>

      {problem.hint ? (
        <div className="mt-4 flex gap-2 rounded-xl border border-accent/25 bg-accent/8 p-3 text-sm text-ink">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p><span className="font-semibold">Creator hint: </span>{problem.hint}</p>
        </div>
      ) : null}

      <div className="mt-6">
        <a href={problem.url} target="_blank" rel="noopener noreferrer nofollow">
          <Button className="gap-2">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open problem <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </a>
      </div>
    </article>
  );
}
