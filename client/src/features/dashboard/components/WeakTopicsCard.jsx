import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import ProgressBar from '../../../components/ui/ProgressBar.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import { SEVERITY_TONE } from '../../plans/lib/planUtils.js';

export default function WeakTopicsCard({ topics = [] }) {
  return (
    <section className="ag-card p-5">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Target className="h-4 w-4 text-danger" aria-hidden="true" /> Weak topics</h2><Badge variant="neutral">quiz + mock</Badge></div>
      {!topics.length ? <EmptyState compact icon={Target} title="No analytics yet" description="Attempt a quiz or mock and topic performance appears here automatically." />
        : <ul className="mt-3 space-y-3">{topics.slice(0, 5).map((topic) => (
          <li key={topic.topic}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs"><span className="font-semibold text-ink">{topic.topic}</span><Badge variant={SEVERITY_TONE[topic.severity] ?? 'neutral'}>{topic.percentage}%</Badge></div>
            <ProgressBar value={Math.max(0, topic.percentage)} label={`${topic.topic}: ${topic.percentage}%`} tone={topic.severity === 'high' ? 'warning' : 'accent'} />
            <p className="mt-1 text-[11px] text-muted">{topic.correct}/{topic.total} correct across {topic.attempts} result(s)</p>
          </li>
        ))}</ul>}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to={topics.length ? `/app/resources?topic=${encodeURIComponent(topics[0].topic)}` : '/app/resources'} className="text-xs font-semibold text-primary hover:underline">Study resources →</Link>
        <Link to="/app/quizzes" className="text-xs font-semibold text-primary hover:underline">Practise a quiz →</Link>
      </div>
    </section>
  );
}
