import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import { DIFFICULTY_TONE, difficultyLabel, signed } from '../lib/mockUtils.js';
import Badge from '../../../components/ui/Badge.jsx';

/** Score and accuracy split by easy/medium/hard. */
export default function DifficultyBreakdown({ stats = [] }) {
  if (!stats.length) return <p className="text-sm text-muted">No difficulty data for this attempt.</p>;
  return (
    <ul className="space-y-3">
      {stats.map((stat) => (
        <li key={stat.difficulty}>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
            <Badge variant={DIFFICULTY_TONE[stat.difficulty] ?? 'neutral'}>{difficultyLabel(stat.difficulty)}</Badge>
            <span className="text-xs text-muted">{stat.correct}/{stat.total} correct · <strong className="text-ink">{signed(stat.score)}/{stat.maxScore}</strong> pts</span>
          </div>
          <ProgressBar value={Math.max(0, stat.percentage)} label={`${stat.difficulty}: ${stat.percentage}%`} tone={stat.percentage >= 60 ? 'success' : 'warning'} />
        </li>
      ))}
    </ul>
  );
}
