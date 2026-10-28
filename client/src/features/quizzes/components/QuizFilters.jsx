import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import { DIFFICULTY_OPTIONS, SORT_OPTIONS, TOPIC_OPTIONS } from '../lib/quizUtils.js';

export const EMPTY_QUIZ_FILTERS = Object.freeze({ q: '', topic: '', difficulty: '', sort: 'newest' });

/** Debounced search lives in the page; this component is purely controlled. */
export default function QuizFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filters
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Search"
          type="search"
          placeholder="Title, topic, tag…"
          icon={Search}
          value={filters.q}
          onChange={(event) => set('q', event.target.value)}
        />
        <Select label="Topic" placeholder="All topics" options={TOPIC_OPTIONS} value={filters.topic} onChange={(event) => set('topic', event.target.value)} />
        <Select label="Difficulty" placeholder="Any difficulty" options={DIFFICULTY_OPTIONS} value={filters.difficulty} onChange={(event) => set('difficulty', event.target.value)} />
        <Select label="Sort by" options={SORT_OPTIONS} value={filters.sort} onChange={(event) => set('sort', event.target.value)} />
      </div>
    </div>
  );
}
