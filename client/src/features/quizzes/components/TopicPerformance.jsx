import ProgressBar from '../../../components/ui/ProgressBar.jsx';

/** Weakest topics first — directly answers "what should I revise next". */
export default function TopicPerformance({ stats = [] }) {
  if (!stats.length) return <p className="text-sm text-muted">No topic data for this attempt.</p>;
  return (
    <ul className="space-y-3">
      {stats.map((stat) => (
        <li key={stat.topic}>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-ink">{stat.topic}</span>
            <span className="text-xs text-muted">{stat.correct}/{stat.total} correct · {stat.score}/{stat.maxScore} pts · <strong className={stat.percentage >= 60 ? 'text-success' : 'text-warning'}>{stat.percentage}%</strong></span>
          </div>
          <ProgressBar value={stat.percentage} label={`${stat.topic}: ${stat.percentage}%`} tone={stat.percentage >= 60 ? 'success' : 'warning'} />
        </li>
      ))}
    </ul>
  );
}
