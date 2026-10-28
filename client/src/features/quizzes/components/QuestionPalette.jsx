import Badge from '../../../components/ui/Badge.jsx';

const stateClass = {
  current: 'bg-primary text-primary-ink border-primary',
  answered: 'bg-success/12 text-success border-success/40',
  marked: 'bg-warning/15 text-warning border-warning/40',
  empty: 'bg-surface-2 text-muted border-line hover:border-primary/40',
};

/** Keyboard-accessible jump list. Every button is reachable with Tab. */
export default function QuestionPalette({ questions = [], answers = {}, currentIndex = 0, onSelect }) {
  return (
    <nav aria-label="Question palette" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Questions</h2>
        <Badge variant="primary">{Object.keys(answers).length}/{questions.length}</Badge>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-5">
        {questions.map((question, index) => {
          const key = question.id ?? index;
          const entry = answers[key];
          const response = entry && typeof entry === 'object' && !Array.isArray(entry) && 'response' in entry
            ? entry.response : entry;
          const answered = response !== undefined && response !== null && response !== ''
            && !(Array.isArray(response) && response.length === 0)
            && !(typeof response === 'object' && Object.keys(response).length === 0);
          const marked = Boolean(entry?.marked);
          const state = index === currentIndex ? 'current' : marked ? 'marked' : answered ? 'answered' : 'empty';
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(index)}
              aria-current={index === currentIndex ? 'true' : undefined}
              aria-label={`Question ${index + 1}${marked ? ', marked for review' : answered ? ', answered' : ', not answered'}`}
              className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${stateClass[state]}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <ul className="space-y-1 text-[11px] text-muted" aria-label="Palette legend">
        <li><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-success/60" />Answered</li>
        <li><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-warning/60" />Marked for review</li>
        <li><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-surface-2" />Not answered</li>
      </ul>
    </nav>
  );
}
