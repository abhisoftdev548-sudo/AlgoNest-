import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { formatMinutes } from '../lib/sheetUtils.js';

/** Topic-wise breakdown — plain Tailwind, no animation on data-heavy views. */
export default function TopicProgress({ summary }) {
  const topics = summary?.topicWise ?? [];
  if (!topics.length) return <p className="text-sm text-muted">Add problems to see topic coverage.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink">Topic-wise progress</h3>
        <span className="text-xs text-muted">{formatMinutes(summary.timeSpent)} tracked</span>
      </div>
      <ul className="space-y-2.5">
        {topics.map((topic) => (
          <li key={topic.topic}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-medium text-ink">{topic.topic}</span>
              <span className="shrink-0 text-muted">{topic.completed}/{topic.total} · {topic.percentage}%</span>
            </div>
            <ProgressBar
              value={topic.percentage}
              label={`${topic.topic}: ${topic.percentage}%`}
              tone={topic.percentage === 100 ? 'success' : 'primary'}
              className="h-1.5"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
