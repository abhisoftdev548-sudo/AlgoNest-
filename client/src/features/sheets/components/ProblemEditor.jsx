import { useEffect, useState } from 'react';
import { problemCreateSchema } from '@algonest/shared';
import Modal from '../../../components/ui/Modal.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS, contractErrors } from '../lib/sheetUtils.js';

const BLANK = { title: '', url: '', difficulty: 'medium', topic: 'General', estimatedMinutes: 20, hint: '' };

/** Add/edit a single embedded problem; validated with the SAME Zod contract as the API. */
export default function ProblemEditor({ open, onClose, initial = null, onSubmit, pending = false }) {
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(initial ? {
      title: initial.title ?? '',
      url: initial.url ?? '',
      difficulty: initial.difficulty ?? 'medium',
      topic: initial.topic ?? 'General',
      estimatedMinutes: initial.estimatedMinutes ?? 20,
      hint: initial.hint ?? '',
    } : BLANK);
    setErrors({});
  }, [open, initial]);

  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const parsed = problemCreateSchema.safeParse({
      ...form,
      estimatedMinutes: Number(form.estimatedMinutes) || 20,
    });
    if (!parsed.success) { setErrors(contractErrors(parsed.error)); return; }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit problem' : 'Add problem'}
      description="Paste an external problem link — the platform is detected automatically."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="problem-editor-form" loading={pending}>{initial ? 'Save changes' : 'Add problem'}</Button>
        </>
      }
    >
      <form id="problem-editor-form" onSubmit={submit} className="space-y-4">
        <Input label="Title" value={form.title} error={errors.title} onChange={(e) => set('title', e.target.value)} placeholder="Two Sum" />
        <Input label="Problem URL" value={form.url} error={errors.url} onChange={(e) => set('url', e.target.value)} placeholder="https://leetcode.com/problems/two-sum/" hint="Only http(s) links are accepted." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} error={errors.difficulty} onChange={(e) => set('difficulty', e.target.value)} />
          <Select label="Topic" options={TOPIC_OPTIONS} value={form.topic} error={errors.topic} onChange={(e) => set('topic', e.target.value)} />
        </div>
        <Input
          label="Estimated minutes"
          type="number"
          min={1}
          max={600}
          value={form.estimatedMinutes}
          error={errors.estimatedMinutes}
          onChange={(e) => set('estimatedMinutes', e.target.value)}
        />
        <div>
          <label htmlFor="problem-hint" className="mb-1.5 block text-sm font-medium text-ink">Creator hint (optional)</label>
          <textarea
            id="problem-hint"
            rows={2}
            maxLength={500}
            value={form.hint}
            onChange={(e) => set('hint', e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </form>
    </Modal>
  );
}
