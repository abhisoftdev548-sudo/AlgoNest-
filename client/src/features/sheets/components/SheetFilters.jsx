import { GOAL_OPTIONS } from '@algonest/shared/constants';
import { PLATFORM_LABELS } from '@algonest/shared';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS } from '../lib/sheetUtils.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'popular', label: 'Most cloned' },
  { value: 'title', label: 'Title A–Z' },
];

const PLATFORM_OPTIONS = Object.entries(PLATFORM_LABELS)
  .filter(([value]) => ['leetcode', 'codeforces', 'geeksforgeeks', 'hackerrank', 'codechef', 'neetcode', 'youtube', 'generic'].includes(value))
  .map(([value, label]) => ({ value, label }));

const EMPTY = { q: '', topic: '', difficulty: '', goal: '', platform: '', sort: 'newest', bookmarked: false };

/** Controlled filter bar. Parents own the state so URLs can stay in sync. */
export default function SheetFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search"
        placeholder="Title, tag or topic…"
        value={filters.q || ''}
        onChange={(event) => set('q', event.target.value)}
        className="sm:col-span-2"
      />
      <Select
        label="Topic"
        placeholder="All topics"
        options={TOPIC_OPTIONS}
        value={filters.topic || ''}
        onChange={(event) => set('topic', event.target.value)}
      />
      <Select
        label="Difficulty"
        placeholder="Any difficulty"
        options={DIFFICULTY_OPTIONS}
        value={filters.difficulty || ''}
        onChange={(event) => set('difficulty', event.target.value)}
      />
      <Select
        label="Goal"
        placeholder="Any goal"
        options={GOAL_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
        value={filters.goal || ''}
        onChange={(event) => set('goal', event.target.value)}
      />
      <Select
        label="Platform"
        placeholder="Any platform"
        options={PLATFORM_OPTIONS}
        value={filters.platform || ''}
        onChange={(event) => set('platform', event.target.value)}
      />
      <Select
        label="Sort by"
        options={SORT_OPTIONS}
        value={filters.sort || 'newest'}
        onChange={(event) => set('sort', event.target.value)}
      />
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
        <label className="flex h-11 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={Boolean(filters.bookmarked)}
            onChange={(event) => set('bookmarked', event.target.checked)}
            className="h-4 w-4 accent-[var(--ag-primary)]"
          />
          Bookmarked only
        </label>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => onChange({ ...EMPTY })}
          title="Clear filters"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

export { EMPTY as EMPTY_SHEET_FILTERS };
