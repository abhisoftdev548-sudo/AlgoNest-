import { Lightbulb, TrendingDown } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { SEVERITY_TONE } from '../lib/mockUtils.js';

export default function WeakTopicPanel({ topics = [], strongest, weakest }) {
  if (!topics.length) return (
    <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success/8 p-4 text-sm text-ink">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
      <p>No weak topics detected — every topic is at or above the passing bar. Keep the momentum going.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        {strongest ? <Badge variant="success">Strongest: {strongest}</Badge> : null}
        {weakest ? <Badge variant="danger">Focus first: {weakest}</Badge> : null}
      </div>
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li key={topic.topic} className="rounded-xl border border-line bg-surface-2/40 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink"><TrendingDown className="h-3.5 w-3.5 text-danger" aria-hidden="true" /> {topic.topic}</span>
              <Badge variant={SEVERITY_TONE[topic.severity] ?? 'neutral'}>{topic.severity} priority</Badge>
            </div>
            <ProgressBar value={topic.percentage} label={`${topic.topic}: ${topic.percentage}%`} tone={topic.severity === 'high' ? 'warning' : 'accent'} />
            <p className="mt-2 text-xs text-muted">{topic.incorrect} wrong · {topic.lostMarks} marks lost{topic.knowledgeGaps ? ` · ${topic.knowledgeGaps} tagged as concept gaps` : ''}. {topic.advice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
