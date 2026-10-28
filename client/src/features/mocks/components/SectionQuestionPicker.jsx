import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import Alert from '../../../components/ui/Alert.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';
import { useQuestionBank } from '../../quizzes/hooks/useQuizzes.js';
import { errorMessage } from '../lib/mockUtils.js';
import { typeLabel } from '../../quizzes/lib/quizUtils.js';

/** Pick reusable bank questions for one section. */
export default function SectionQuestionPicker({ open, onClose, section, usedElsewhere = [], onSave, pending = false }) {
  const [selected, setSelected] = useState(() => (section?.questionIds ?? []).map(String));
  // Depend on a primitive key: the array identity changes on every parent render.
  const idsKey = (section?.questionIds ?? []).join(',');
  useEffect(() => {
    if (open) setSelected(idsKey ? idsKey.split(',') : []);
  }, [open, section?.id, idsKey]);
  const params = useMemo(() => ({ page: 1, limit: 100, mine: 'true' }), []);
  const { data, isLoading, isError, error } = useQuestionBank(params, open);
  const blocked = new Set(usedElsewhere.map(String));
  const available = (data?.items ?? []).filter((question) => !blocked.has(question.id));

  return (
    <Modal
      open={open} onClose={onClose} size="lg"
      title={`Questions for ${section?.title ?? 'section'}`}
      description="Reuse questions from your bank. Published versions keep their own frozen copy."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button loading={pending} onClick={() => onSave(selected)}>Save {selected.length} question{selected.length === 1 ? '' : 's'}</Button>
      </>}
    >
      {isError ? <Alert variant="error">{errorMessage(error)}</Alert> : null}
      {isLoading ? <div className="space-y-2">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div> : null}
      {!isLoading && !available.length ? <p className="py-6 text-center text-sm text-muted">Your bank has no available questions. Add some in the Quizzes creator first.</p> : null}
      <div className="ag-scrollbar max-h-96 space-y-2 overflow-y-auto">
        {available.map((question) => (
          <label key={question.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 hover:border-primary/40">
            <input
              type="checkbox" checked={selected.includes(question.id)}
              onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, question.id] : previous.filter((id) => id !== question.id))}
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-ink">{question.prompt}</span>
              <span className="mt-1 flex flex-wrap items-center gap-2"><Badge variant="primary">{typeLabel(question.type)}</Badge><span className="text-xs text-muted">{question.topic} · {question.difficulty}</span></span>
            </span>
          </label>
        ))}
      </div>
    </Modal>
  );
}
