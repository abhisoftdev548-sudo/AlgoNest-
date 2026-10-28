import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import {
  LANGUAGE_OPTIONS, LEVEL_OPTIONS, PLATFORM_OPTIONS, PRICING_OPTIONS,
  SORT_OPTIONS, TYPE_OPTIONS,
} from '../lib/resourceUtils.js';

const withAll = (options, label) => [{ value: '', label }, ...options];

export default function ResourceFilters({ filters, onChange, topics = [], showPlatform = false }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filters</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input label="Search" type="search" placeholder="Title, tag, topic…" icon={Search} value={filters.q} onChange={(event) => set('q', event.target.value)} />
        <Select label="Topic" options={withAll(topics.map((value) => ({ value, label: value })), 'All topics')} value={filters.topic} onChange={(event) => set('topic', event.target.value)} />
        <Select label="Level" options={withAll(LEVEL_OPTIONS, 'Any level')} value={filters.level} onChange={(event) => set('level', event.target.value)} />
        <Select label="Language" options={withAll(LANGUAGE_OPTIONS, 'Any language')} value={filters.language} onChange={(event) => set('language', event.target.value)} />
        <Select label="Type" options={withAll(TYPE_OPTIONS, 'All types')} value={filters.type} onChange={(event) => set('type', event.target.value)} />
        <Select label="Pricing" options={withAll(PRICING_OPTIONS, 'Free & paid')} value={filters.pricing} onChange={(event) => set('pricing', event.target.value)} />
        {showPlatform ? <Select label="Platform" options={withAll(PLATFORM_OPTIONS, 'All platforms')} value={filters.platform} onChange={(event) => set('platform', event.target.value)} /> : null}
        <Select label="Sort by" options={SORT_OPTIONS} value={filters.sort} onChange={(event) => set('sort', event.target.value)} />
      </div>
    </div>
  );
}
