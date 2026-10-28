import { useMemo, useState } from 'react';
import { Link2, Send } from 'lucide-react';
import { resourceCreateSchema } from '@algonest/shared';
import { SHEET_TOPICS } from '@algonest/shared/constants';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import DuplicateWarning from './DuplicateWarning.jsx';
import { useDuplicateCheck } from '../hooks/useResources.js';
import {
  LANGUAGE_OPTIONS, LEVEL_OPTIONS, PRICING_OPTIONS, TYPE_OPTIONS, contractErrors,
} from '../lib/resourceUtils.js';

const EMPTY = {
  title: '', url: '', description: '', type: 'article', topic: 'General',
  level: 'beginner', language: 'agnostic', pricing: 'free', tags: '', submit: false,
};

export default function ResourceSubmitForm({ initial = null, onSubmit, pending = false, error, submitLabel = 'Submit resource' }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initial ? {
      title: initial.title ?? '', url: initial.url ?? '', description: initial.description ?? '',
      type: initial.type ?? 'article', topic: initial.topic ?? 'General',
      level: initial.level ?? 'beginner', language: initial.language ?? 'agnostic',
      pricing: initial.pricing ?? 'free', tags: (initial.tags ?? []).join(', '),
    } : {}),
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const debouncedUrl = useMemo(() => form.url.trim(), [form.url]);
  const duplicate = useDuplicateCheck(debouncedUrl, /^https?:\/\/\S+\.\S+/i.test(debouncedUrl));

  const build = (submit) => ({
    title: form.title.trim(), url: form.url.trim(), description: form.description.trim(),
    type: form.type, topic: form.topic.trim() || 'General', level: form.level,
    language: form.language, pricing: form.pricing,
    tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    submit,
  });

  const validate = (submit) => resourceCreateSchema.safeParse(build(submit));

  const send = (submit) => {
    const parsed = validate(submit);
    if (!parsed.success) {
      setErrors(contractErrors(parsed.error));
      setFormError(parsed.error.issues[0]?.message ?? 'Check the form.');
      return;
    }
    if (duplicate.data?.duplicate) { setFormError('That link is already in the directory. Choose a different URL.'); return; }
    setErrors({}); setFormError('');
    onSubmit(parsed.data);
  };

  return (
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); send(true); }} noValidate>
      {formError ? <Alert variant="error" onDismiss={() => setFormError('')}>{formError}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Title" required icon={Link2} value={form.title} onChange={(event) => set('title', event.target.value)} error={errors.title} placeholder="Dynamic Programming patterns" maxLength={160} />
        <Input label="Link" required type="url" value={form.url} onChange={(event) => set('url', event.target.value)} error={errors.url} placeholder="https://…" maxLength={2000} hint="http(s) only. Tracking params are stripped automatically." />
      </div>
      <DuplicateWarning check={duplicate.data} isLoading={duplicate.isFetching} url={debouncedUrl} />
      <div>
        <label htmlFor="resource-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea id="resource-description" rows={4} maxLength={2000} value={form.description} onChange={(event) => set('description', event.target.value)} className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" placeholder="What will a learner get from this? Prerequisites, length, key topics…" />
        {errors.description ? <p role="alert" className="mt-1 text-xs text-danger">{errors.description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={(event) => set('type', event.target.value)} error={errors.type} />
        <Select label="Level" options={LEVEL_OPTIONS} value={form.level} onChange={(event) => set('level', event.target.value)} />
        <Select label="Language" options={LANGUAGE_OPTIONS} value={form.language} onChange={(event) => set('language', event.target.value)} />
        <Select label="Pricing" options={PRICING_OPTIONS} value={form.pricing} onChange={(event) => set('pricing', event.target.value)} />
        <Input label="Topic" list="resource-topic-list" value={form.topic} onChange={(event) => set('topic', event.target.value)} error={errors.topic} maxLength={60} />
        <Input label="Tags (comma separated)" value={form.tags} onChange={(event) => set('tags', event.target.value)} error={errors.tags} placeholder="dp, patterns, revision" />
      </div>
      <datalist id="resource-topic-list">{SHEET_TOPICS.map((topic) => <option key={topic} value={topic} />)}</datalist>
      {errors._ ? <Alert variant="error">{errors._}</Alert> : null}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-muted">Submissions are reviewed before they appear publicly. You can edit a draft or a rejected submission.</p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => send(false)} disabled={pending}>Save draft</Button>
          <Button type="submit" className="gap-1.5" loading={pending}><Send className="h-3.5 w-3.5" aria-hidden="true" /> {submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
