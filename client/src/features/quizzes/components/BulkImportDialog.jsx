import { useState } from 'react';
import { Braces, FileSpreadsheet, Upload, WandSparkles } from 'lucide-react';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { useParseQuestionImport } from '../hooks/useQuizzes.js';
import { errorMessage, typeLabel } from '../lib/quizUtils.js';

/** Paste → server-validated preview → select → import. No local CSV parser. */
export default function BulkImportDialog({ open, onClose, onImport, pending = false }) {
  const [format, setFormat] = useState('json');
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [templates, setTemplates] = useState(null);
  const [formError, setFormError] = useState('');
  const parse = useParseQuestionImport();

  const changeFormat = (next) => {
    setFormat(next); setRows([]); setErrors([]); setSkipped([]); setFormError('');
  };

  const doParse = () => {
    setFormError('');
    parse.mutate({ format, text }, {
      onSuccess: (data) => {
        setRows((data.items ?? []).map((item) => ({ ...item, selected: true })));
        setErrors(data.errors ?? []);
        setSkipped(data.skipped ?? []);
        setTemplates(data.templates ?? null);
        if (!data.items?.length) setFormError('No valid questions found. Check the row errors below.');
      },
      onError: (error) => setFormError(errorMessage(error)),
    });
  };

  const loadTemplate = () => {
    const value = templates?.[format] ?? '';
    setText(value);
    setRows([]); setErrors([]); setSkipped([]); setFormError('');
  };

  const doImport = () => {
    const chosen = rows.filter((row) => row.selected).map((row) => {
      const input = { ...row };
      delete input.selected;
      delete input.canonical;
      delete input.expected;
      return input;
    });
    if (!chosen.length) { setFormError('Select at least one question to import.'); return; }
    setFormError('');
    onImport(chosen, format);
  };

  const selectedCount = rows.filter((row) => row.selected).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Bulk import questions"
      description="Paste JSON or CSV. The server validates every row before anything is saved."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={doImport} loading={pending} disabled={!selectedCount} className="gap-1.5">
          <Upload className="h-4 w-4" aria-hidden="true" /> Import {selectedCount || ''} question{selectedCount === 1 ? '' : 's'}
        </Button>
      </>}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-line bg-surface-2 p-1" role="tablist" aria-label="Import format">
            {[
              { id: 'json', label: 'JSON', Icon: Braces },
              { id: 'csv', label: 'CSV', Icon: FileSpreadsheet },
            ].map(({ id, label, Icon }) => (
              <button
                key={id} type="button" role="tab" aria-selected={format === id}
                onClick={() => changeFormat(id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${format === id ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
          {templates ? (
            <Button size="sm" variant="secondary" onClick={loadTemplate} className="gap-1.5">
              <WandSparkles className="h-3.5 w-3.5" aria-hidden="true" /> Load {format.toUpperCase()} template
            </Button>
          ) : null}
        </div>

        <div>
          <label htmlFor="bulk-question-input" className="mb-1.5 block text-sm font-medium text-ink">
            {format === 'json' ? 'JSON array of questions' : 'CSV with a header row'}
          </label>
          <textarea
            id="bulk-question-input"
            rows={8}
            value={text}
            spellCheck={false}
            onChange={(event) => setText(event.target.value)}
            placeholder={format === 'json'
              ? '[{"type":"mcq","prompt":"...","options":["A","B"],"answer":0}]'
              : 'type,prompt,options,answer,items,pairs,code,explanation,topic,difficulty,points,tags,caseSensitive'}
            className="ag-scrollbar w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 font-mono text-xs text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
          <p className="mt-1.5 text-xs text-muted">
            Multi-value cells use <code className="rounded bg-surface-2 px-1">|</code>; matching pairs use{' '}
            <code className="rounded bg-surface-2 px-1">left::right</code>. Answers accept an index, a letter (A–H) or exact option text.
          </p>
        </div>

        <Button variant="secondary" onClick={doParse} loading={parse.isPending} disabled={!text.trim()}>Preview questions</Button>

        {formError ? <Alert variant="error">{formError}</Alert> : null}
        {parse.isError ? <Alert variant="error">{errorMessage(parse.error)}</Alert> : null}

        {errors.length ? (
          <Alert variant="warning" title={`${errors.length} row(s) need fixing`}>
            <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto text-xs">
              {errors.map((issue) => <li key={`${issue.row}-${issue.message}`}>Row {issue.row}: {issue.message}</li>)}
            </ul>
          </Alert>
        ) : null}
        {skipped.length ? <p className="text-xs text-muted">{skipped.length} duplicate row(s) skipped.</p> : null}

        {rows.length ? (
          <div className="ag-scrollbar max-h-72 space-y-2 overflow-y-auto rounded-xl border border-line p-2">
            {rows.map((row, index) => (
              <label key={`${row.type}-${index}`} className="flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-surface-2">
                <input
                  type="checkbox" checked={row.selected}
                  onChange={(event) => setRows((previous) => previous.map((item, i) => (i === index ? { ...item, selected: event.target.checked } : item)))}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{row.prompt}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="primary">{typeLabel(row.type)}</Badge>
                    <span className="text-[11px] text-muted">{row.topic} · {row.points} pt</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
