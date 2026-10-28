import { useState } from 'react';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import { personalResourceCreateSchema } from '@algonest/shared';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { RESOURCE_TYPE_OPTIONS, contractErrors, errorMessage, platformLabel } from '../lib/sheetUtils.js';
import { usePersonalResources, useResourceMutations } from '../hooks/useSheets.js';

const BLANK = { title: '', url: '', type: 'article', topic: '', note: '' };

/** Private link library. `sheetId` scopes the list to the current sheet. */
export default function PersonalResources({ sheetId, problemId }) {
  const params = { page: 1, limit: 20, ...(sheetId ? { sheetId } : {}) };
  const { data, isLoading, isError, error } = usePersonalResources(params);
  const { create, remove } = useResourceMutations();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const parsed = personalResourceCreateSchema.safeParse({
      ...form,
      ...(sheetId ? { sheetId } : {}),
      ...(problemId ? { problemId } : {}),
    });
    if (!parsed.success) { setFieldErrors(contractErrors(parsed.error)); return; }
    setFieldErrors({});
    create.mutate(parsed.data, { onSuccess: () => { setForm(BLANK); setOpen(false); } });
  };

  return (
    <section className="space-y-3" aria-label="My saved resources">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">My resources</h3>
        <Button size="sm" variant="ghost" onClick={() => setOpen((value) => !value)} className="gap-1">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add
        </Button>
      </div>

      {open ? (
        <form onSubmit={submit} className="space-y-2 rounded-xl border border-line bg-surface-2/40 p-3">
          <Input placeholder="Title" value={form.title} error={fieldErrors.title} onChange={(e) => set('title', e.target.value)} />
          <Input placeholder="https://…" value={form.url} error={fieldErrors.url} onChange={(e) => set('url', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Select options={RESOURCE_TYPE_OPTIONS} value={form.type} onChange={(e) => set('type', e.target.value)} />
            <Input placeholder="Topic" value={form.topic} onChange={(e) => set('topic', e.target.value)} />
          </div>
          {create.isError ? <Alert variant="error">{errorMessage(create.error)}</Alert> : null}
          <div className="flex justify-end"><Button size="sm" type="submit" loading={create.isPending}>Save link</Button></div>
        </form>
      ) : null}

      {isLoading ? <Skeleton className="h-12 w-full" /> : null}
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}

      <ul className="space-y-2">
        {(data?.items ?? []).map((item) => (
          <li key={item.id} className="group flex items-start gap-2 rounded-xl border border-line p-2.5">
            <div className="min-w-0 flex-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1 truncate text-sm font-medium text-ink hover:text-primary"
              >
                <span className="truncate">{item.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
              <p className="mt-0.5 text-[11px] text-muted">{platformLabel(item.platform)} · {item.topic}</p>
              {item.note ? <p className="mt-1 line-clamp-2 text-xs text-muted">{item.note}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => remove.mutate(item.id)}
              aria-label={`Delete ${item.title}`}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
        {data?.items?.length === 0 ? <li className="text-xs text-muted">No saved links for this sheet yet.</li> : null}
      </ul>
    </section>
  );
}
