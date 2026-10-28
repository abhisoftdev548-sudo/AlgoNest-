import { useState } from 'react';
import { Check, Link2, WandSparkles } from 'lucide-react';
import { problemCreateSchema } from '@algonest/shared';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Select from '../../../components/ui/Select.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import { DIFFICULTY_OPTIONS, TOPIC_OPTIONS, errorMessage } from '../lib/sheetUtils.js';
import { useParseLinks } from '../hooks/useSheets.js';

/**
 * Paste → preview → edit → import. The server re-detects every platform, so
 * the preview is a convenience, never a trust boundary.
 */
export default function BulkImportDialog({ open, onClose, onImport, pending = false }) {
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [formError, setFormError] = useState('');
  const parse = useParseLinks();

  const doParse = () => {
    setFormError('');
    parse.mutate(text, {
      onSuccess: (data) => {
        setRows(data.items.map((item) => ({
          ...item,
          selected: true,
          difficulty: item.difficulty || 'medium',
          topic: item.topic || 'General',
          estimatedMinutes: 20,
        })));
        setSkipped(data.skipped ?? []);
      },
    });
  };

  const patchRow = (index, key, value) => {
    setRows((previous) => previous.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const doImport = () => {
    const chosen = rows.filter((row) => row.selected);
    if (!chosen.length) { setFormError('Select at least one problem.'); return; }
    const items = [];
    for (const row of chosen) {
      const parsed = problemCreateSchema.safeParse({
        title: row.title,
        url: row.url,
        difficulty: row.difficulty,
        topic: row.topic,
        estimatedMinutes: Number(row.estimatedMinutes) || 20,
      });
      if (!parsed.success) {
        setFormError(`"${row.title}": ${parsed.error.issues[0]?.message ?? 'invalid'}`);
        return;
      }
      items.push(parsed.data);
    }
    setFormError('');
    onImport(items);
  };

  const selectedCount = rows.filter((row) => row.selected).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Bulk import from links"
      description="One link per line. Also accepts “Title | URL”, numbered lists and markdown links."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={doImport} disabled={!rows.length || !selectedCount} loading={pending} className="gap-1.5">
            <Check className="h-4 w-4" aria-hidden="true" /> Import {selectedCount || ''} problem{selectedCount === 1 ? '' : 's'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <label htmlFor="bulk-links" className="block text-sm font-medium text-ink">Pasted links</label>
        <textarea
          id="bulk-links"
          rows={5}
          value={text}
          maxLength={20000}
          onChange={(event) => setText(event.target.value)}
          placeholder={'https://leetcode.com/problems/two-sum/\nValid Parentheses | https://leetcode.com/problems/valid-parentheses/\nhttps://www.geeksforgeeks.org/binary-search/'}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 font-mono text-xs text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">{skipped.length ? `${skipped.length} line(s) skipped` : 'Duplicates and invalid links are removed automatically.'}</p>
          <Button size="sm" variant="secondary" onClick={doParse} loading={parse.isPending} className="gap-1.5">
            <WandSparkles className="h-3.5 w-3.5" aria-hidden="true" /> Parse links
          </Button>
        </div>

        {parse.isError ? <Alert variant="error">{errorMessage(parse.error)}</Alert> : null}
        {formError ? <Alert variant="error">{formError}</Alert> : null}

        {skipped.length ? (
          <ul className="rounded-xl border border-warning/30 bg-warning/8 p-3 text-xs text-warning">
            {skipped.slice(0, 5).map((item, index) => (
              <li key={`${item.line}-${index}`} className="truncate">• {item.line} — {item.reason}</li>
            ))}
          </ul>
        ) : null}

        {rows.length ? (
          <div className="ag-scrollbar max-h-72 space-y-2 overflow-y-auto rounded-xl border border-line p-2">
            {rows.map((row, index) => (
              <div key={`${row.externalId}-${index}`} className="rounded-xl border border-line bg-surface-2/40 p-2.5">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={(event) => patchRow(index, 'selected', event.target.checked)}
                    aria-label={`Select ${row.title}`}
                    className="mt-3 h-4 w-4 accent-[var(--ag-primary)]"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <input
                      value={row.title}
                      onChange={(event) => patchRow(index, 'title', event.target.value)}
                      aria-label="Problem title"
                      className="h-9 w-full rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-primary focus:outline-none"
                    />
                    <p className="flex items-center gap-1 truncate text-[11px] text-muted">
                      <Link2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{row.url}</span>
                      <span className="shrink-0 rounded bg-primary/12 px-1.5 py-0.5 font-semibold text-primary">{row.platformLabel}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Select options={TOPIC_OPTIONS} value={row.topic} onChange={(event) => patchRow(index, 'topic', event.target.value)} className="h-9" />
                      <Select options={DIFFICULTY_OPTIONS} value={row.difficulty} onChange={(event) => patchRow(index, 'difficulty', event.target.value)} className="h-9" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
