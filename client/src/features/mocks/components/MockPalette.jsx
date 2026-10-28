import Badge from '../../../components/ui/Badge.jsx';
import { PALETTE_STATES as P } from '@algonest/shared';
import { PALETTE_CLASS, paletteLabel, paletteStateOf } from '../lib/mockUtils.js';

const LEGEND = [P.ANSWERED, P.NOT_ANSWERED, P.MARKED, P.ANSWERED_MARKED, P.NOT_VISITED];

/** Five-state palette. Every button is a real button with an aria-label. */
export default function MockPalette({ questions = [], answers = {}, currentId, onSelect, title = 'Questions' }) {
  const byId = new Map(Object.entries(answers));
  const counts = Object.fromEntries(LEGEND.map((state) => [state, 0]));
  for (const question of questions) counts[paletteStateOf(byId.get(question.id))] += 1;

  return (
    <nav aria-label="Question palette" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <Badge variant="primary">{counts[P.ANSWERED] + counts[P.ANSWERED_MARKED]}/{questions.length}</Badge>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-5">
        {questions.map((question, index) => {
          const state = paletteStateOf(byId.get(question.id));
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(question.id)}
              aria-current={currentId === question.id ? 'true' : undefined}
              aria-label={`Question ${index + 1}: ${paletteLabel(state)}`}
              className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${PALETTE_CLASS[state]} ${currentId === question.id ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <ul className="space-y-1 text-[11px] text-muted" aria-label="Palette legend">
        {LEGEND.map((state) => (
          <li key={state} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5"><span className={`inline-block h-2.5 w-2.5 rounded-sm border ${PALETTE_CLASS[state]}`} />{paletteLabel(state)}</span>
            <span className="font-semibold text-ink">{counts[state]}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
