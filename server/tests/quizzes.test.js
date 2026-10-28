import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  attemptStartSchema, autosaveSchema, questionImportSchema, questionInputSchema,
  quizCreateSchema, quizReorderSchema, quizSettingsSchema, quizUpdateSchema,
  QUIZ_STATUSES as S,
} from '@algonest/shared';

const { normaliseQuestion, redactQuestion, resolveOptionIndex, expectedAnswer } =
  await import('../src/modules/quizzes/questionNormalizer.js');
const { gradeAttempt, isResponseCorrect, incorrectQuestionIds } =
  await import('../src/modules/quizzes/questionGrader.js');
const { seededShuffle, buildPresentation } =
  await import('../src/modules/quizzes/quizPresentation.js');
const { parseCsv, parseBulkQuestions, CSV_TEMPLATE, JSON_TEMPLATE } =
  await import('../src/modules/quizzes/bulkImport.js');
const { canTransition, isEditable, isAttemptable, transitionError } =
  await import('../src/modules/quizzes/quizWorkflow.js');

const ID = '507f1f77bcf86cd799439011';

const SAMPLES = {
  mcq: { type: 'mcq', prompt: 'Which structure is LIFO?', options: ['Queue', 'Stack', 'Tree'], answer: 'B', topic: 'Stacks', explanation: 'LIFO.' },
  multi: { type: 'multi', prompt: 'Pick the prime numbers', options: ['2', '3', '4', '9'], answer: [0, 1], topic: 'Math', points: 2 },
  true_false: { type: 'true_false', prompt: 'Binary search requires sorted input.', answer: 'true', topic: 'Binary Search' },
  ordering: { type: 'ordering', prompt: 'Order by complexity', items: ['O(1)', 'O(log n)', 'O(n)'], topic: 'Big-O' },
  matching: { type: 'matching', prompt: 'Match ADT to property', pairs: [['Stack', 'LIFO'], ['Queue', 'FIFO']], topic: 'Stacks' },
  output: { type: 'output', prompt: 'What does this print?', code: 'console.log(1 + 1)', options: ['1', '2', 'NaN'], answer: 1, topic: 'JavaScript' },
  fill_blank: { type: 'fill_blank', prompt: 'A ______ is FIFO.', answer: ['queue', 'queues'], topic: 'Stacks' },
};

const canonical = (key) => normaliseQuestion(SAMPLES[key]);

describe('Phase-3 question contracts', () => {
  it('accepts all seven question types', () => {
    for (const [key, sample] of Object.entries(SAMPLES)) {
      const parsed = questionInputSchema.safeParse(sample);
      assert.equal(parsed.success, true, `${key}: ${JSON.stringify(parsed.error?.issues)}`);
    }
  });

  it('rejects wrong shapes, unknown keys and too few options', () => {
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.mcq, hacker: 1 }).success, false);
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.mcq, options: ['only one'] }).success, false);
    assert.equal(questionInputSchema.safeParse({ type: 'mcq', prompt: 'Hi?', options: ['a', 'b'] }).success, false);
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.mcq, type: 'essay' }).success, false);
    assert.equal(questionInputSchema.safeParse({ ...SAMPLES.ordering, items: ['a', 'a'] }).success, false);
  });

  it('resolves 0-based, 1-based, letter and text answers', () => {
    const options = [{ id: 'o0', text: 'Alpha' }, { id: 'o1', text: 'Beta' }];
    assert.equal(resolveOptionIndex(0, options), 0);
    assert.equal(resolveOptionIndex(2, options), 1);
    assert.equal(resolveOptionIndex('B', options), 1);
    assert.equal(resolveOptionIndex('Alpha', options), 0);
    assert.equal(resolveOptionIndex('missing', options), -1);
    assert.equal(resolveOptionIndex(99, options), -1);
  });

  it('creates defaults and strict settings', () => {
    const quiz = quizCreateSchema.parse({ title: '  Arrays warmup  ' });
    assert.equal(quiz.title, 'Arrays warmup');
    assert.equal(quiz.settings.timerMinutes, 20);
    assert.equal(quiz.settings.passPercentage, 60);
    assert.equal(quiz.settings.maxAttempts, 3);
    assert.equal(quiz.settings.visibility, 'public');
    assert.throws(() => quizSettingsSchema.parse({ timerMinutes: 500 }));
    assert.equal(quizUpdateSchema.parse({ settings: { timerMinutes: 5 } }).settings.timerMinutes, 5);
    assert.throws(() => quizUpdateSchema.parse({}));
  });

  it('requires a source attempt for retry-incorrect-only', () => {
    assert.equal(attemptStartSchema.parse({}).mode, 'full');
    assert.equal(attemptStartSchema.safeParse({ mode: 'incorrect' }).success, false);
    assert.equal(attemptStartSchema.safeParse({ mode: 'incorrect', sourceAttemptId: ID }).success, true);
  });

  it('bounds autosave responses and rejects duplicate reorder ids', () => {
    const good = { answers: [{ questionId: ID, response: { p0: 'p0' }, marked: true }] };
    assert.equal(autosaveSchema.safeParse(good).success, true);
    assert.equal(autosaveSchema.safeParse({ answers: [] }).success, false);
    assert.equal(autosaveSchema.safeParse({ answers: [{ questionId: ID, response: 'x', extra: 1 }] }).success, false);
    assert.equal(quizReorderSchema.safeParse({ orderedIds: [ID, ID] }).success, false);
  });

  it('caps the bulk-import payload', () => {
    assert.equal(questionImportSchema.safeParse({ format: 'csv', text: 'a,b' }).success, true);
    assert.equal(questionImportSchema.safeParse({ format: 'xml', text: 'a' }).success, false);
    assert.equal(questionImportSchema.safeParse({ format: 'json', text: 'x'.repeat(300_000) }).success, false);
  });
});

describe('question normalisation + redaction', () => {
  it('normalises every type into one canonical shape with stable ids', () => {
    for (const key of Object.keys(SAMPLES)) {
      const question = canonical(key);
      assert.equal(question.type, key);
      assert.ok(Array.isArray(question.answerKey));
      assert.ok(question.points >= 1);
    }
    assert.deepEqual(canonical('mcq').answerKey, ['o1']);
    assert.deepEqual(canonical('multi').answerKey, ['o0', 'o1']);
    assert.equal(canonical('true_false').booleanKey, true);
    assert.deepEqual(canonical('ordering').answerKey, ['i0', 'i1', 'i2']);
    assert.deepEqual(canonical('matching').pairs[1], { id: 'p1', left: 'Queue', right: 'FIFO' });
    assert.deepEqual(canonical('fill_blank').textAnswers, ['queue', 'queues']);
  });

  it('rejects an answer that matches no option', () => {
    assert.throws(() => normaliseQuestion({ ...SAMPLES.mcq, answer: 'Z' }), /does not match/);
    assert.throws(() => normaliseQuestion({ type: 'mcq', prompt: 'test', options: [] }), /Unsupported|answer/i);
  });

  it('never exposes answer keys or explanations to a solver', () => {
    for (const key of Object.keys(SAMPLES)) {
      const view = redactQuestion(canonical(key), ID);
      const json = JSON.stringify(view);
      assert.ok(!json.includes('answerKey'), key);
      assert.ok(!json.includes('booleanKey'), key);
      assert.ok(!json.includes('textAnswers'), key);
      assert.ok(!json.includes('explanation'), key);
      assert.equal(view.id, ID);
    }
  });

  it('splits matching columns so adjacency cannot reveal a pair', () => {
    const view = redactQuestion(canonical('matching'), ID, { leftIds: ['p0', 'p1'], rightIds: ['p1', 'p0'] });
    assert.deepEqual(view.leftItems.map((item) => item.text), ['Stack', 'Queue']);
    assert.deepEqual(view.rightItems.map((item) => item.text), ['FIFO', 'LIFO']);
  });

  it('produces readable expected answers for the result page', () => {
    assert.equal(expectedAnswer(canonical('mcq')), 'Stack');
    assert.equal(expectedAnswer(canonical('true_false')), 'True');
    assert.equal(expectedAnswer(canonical('fill_blank')), 'queue / queues');
    assert.match(expectedAnswer(canonical('ordering')), /O\(1\) → O\(log n\)/);
  });
});

describe('pure grading engine', () => {
  const cases = [
    ['mcq', 'o1', 'o0'],
    ['multi', ['o0', 'o1'], ['o0']],
    ['true_false', true, false],
    ['ordering', ['i0', 'i1', 'i2'], ['i2', 'i1', 'i0']],
    ['matching', { p0: 'p0', p1: 'p1' }, { p0: 'p1', p1: 'p0' }],
    ['output', 'o1', 'o2'],
    ['fill_blank', '  QUEUE  ', 'stack'],
  ];
  for (const [type, right, wrong] of cases) {
    it(`scores ${type} correctly and rejects the wrong answer`, () => {
      const question = canonical(type);
      assert.equal(isResponseCorrect(question, right), true, type);
      assert.equal(isResponseCorrect(question, wrong), false, type);
      assert.equal(isResponseCorrect(question, null), false, type);
    });
  }

  it('computes score, percentage, per-topic stats and unattempted rows', () => {
    const items = [
      { id: 'q1', question: canonical('mcq') },
      { id: 'q2', question: { ...canonical('multi'), topic: 'Math' } },
      { id: 'q3', question: { ...canonical('true_false'), topic: 'Math' } },
    ];
    const graded = gradeAttempt(items, [
      { questionId: 'q1', response: 'o1' },
      { questionId: 'q2', response: ['o0'] },
    ]);
    assert.equal(graded.questionCount, 3);
    assert.equal(graded.score, 1);
    assert.equal(graded.maxScore, 4); // 1 + 2 + 1
    assert.equal(graded.percentage, 25);
    assert.equal(graded.attemptedCount, 2);
    assert.equal(graded.correctCount, 1);
    assert.equal(graded.topicStats.length, 2);
    const math = graded.topicStats.find((stat) => stat.topic === 'Math');
    assert.equal(math.maxScore, 3);
    assert.equal(math.percentage, 0);
    assert.deepEqual(incorrectQuestionIds(graded.results).sort(), ['q2', 'q3']);
  });

  it('omits explanations when the quiz disables them', () => {
    const graded = gradeAttempt([{ id: 'q1', question: canonical('mcq') }], [], { showExplanations: false });
    assert.equal('expected' in graded.results[0], false);
    assert.equal('explanation' in graded.results[0], false);
  });

  it('handles case-insensitive fill-blank and honours caseSensitive', () => {
    const loose = canonical('fill_blank');
    assert.equal(isResponseCorrect(loose, 'Queue'), true);
    const strict = normaliseQuestion({ ...SAMPLES.fill_blank, caseSensitive: true, answer: ['Queue'] });
    assert.equal(isResponseCorrect(strict, 'queue'), false);
    assert.equal(isResponseCorrect(strict, 'Queue'), true);
  });
});

describe('deterministic presentation', () => {
  it('is stable for the same seed and different for another', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    assert.deepEqual(seededShuffle(values, 'attempt-1'), seededShuffle(values, 'attempt-1'));
    assert.notDeepEqual(seededShuffle(values, 'attempt-1'), seededShuffle(values, 'attempt-2'));
  });

  it('never returns the identity order when shuffling is enabled', () => {
    const items = Array.from({ length: 6 }, (_, index) => ({ id: `q${index}`, question: canonical('mcq') }));
    const presentation = buildPresentation(items, { shuffleQuestions: true, shuffleOptions: true }, 'seed-xyz');
    assert.equal(presentation.length, 6);
    assert.notDeepEqual(presentation.map((entry) => entry.questionId), items.map((item) => item.id));
    assert.equal(presentation[0].optionIds.length, 3);
    assert.deepEqual(
      buildPresentation(items, { shuffleQuestions: true }, 'seed-xyz'),
      buildPresentation(items, { shuffleQuestions: true }, 'seed-xyz'),
    );
  });

  it('keeps authored order when shuffle is disabled', () => {
    const items = [{ id: 'a', question: canonical('mcq') }, { id: 'b', question: canonical('mcq') }];
    assert.deepEqual(buildPresentation(items, {}, 'seed').map((entry) => entry.questionId), ['a', 'b']);
  });
});

describe('JSON / CSV bulk import', () => {
  it('parses quoted CSV with embedded commas and newlines', () => {
    const rows = parseCsv('a,b\n"one, two","line1\nline2"\n');
    assert.deepEqual(rows, [['a', 'b'], ['one, two', 'line1\nline2']]);
  });

  it('imports the shipped JSON example (all 7 types)', () => {
    const result = parseBulkQuestions('json', JSON_TEMPLATE);
    assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
    assert.equal(result.items.length, 7);
  });

  it('imports the shipped CSV template', () => {
    const result = parseBulkQuestions('csv', CSV_TEMPLATE);
    assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
    assert.equal(result.items.length, 5);
    assert.equal(result.items.find((item) => item.input.type === 'matching').canonical.pairs.length, 2);
  });

  it('reports a row-level error without failing the whole batch', () => {
    const result = parseBulkQuestions('json', JSON.stringify([
      SAMPLES.mcq,
      { ...SAMPLES.mcq, prompt: 'A different valid prompt', answer: 'Z' },
      { type: 'unknown', prompt: 'Broken row' },
      SAMPLES.true_false,
    ]));
    assert.equal(result.items.length, 2);
    assert.equal(result.errors.length, 2);
    assert.deepEqual(result.errors.map((entry) => entry.row), [2, 3]);
    assert.match(result.errors[0].message, /does not match any option/);
  });

  it('deduplicates repeated questions and reports them as skipped', () => {
    const result = parseBulkQuestions('json', JSON.stringify([SAMPLES.mcq, SAMPLES.mcq]));
    assert.equal(result.items.length, 1);
    assert.equal(result.skipped[0].reason, 'Duplicate question');
  });

  it('rejects malformed JSON and CSV without a header', () => {
    assert.match(parseBulkQuestions('json', '{oops').errors[0].message, /Invalid JSON/);
    assert.equal(parseBulkQuestions('csv', 'just,one,row').errors.length, 1);
    assert.match(parseBulkQuestions('csv', 'a,b\nx,y').errors[0].message, /missing required column/);
  });
});

describe('quiz lifecycle + availability', () => {
  it('follows draft → review → approved → published', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.ok(canTransition(S.PUBLISHED, S.DRAFT));
    assert.equal(isEditable(S.PUBLISHED), false);
  });

  it('explains invalid transitions', () => {
    assert.match(transitionError(S.DRAFT, S.PUBLISHED), /Cannot move a quiz/);
  });

  it('requires a published version and honours private visibility', () => {
    const student = { id: 'u1', permissions: [] };
    assert.equal(isAttemptable({ publishedVersion: 0 }, student), false);
    assert.equal(isAttemptable({ publishedVersion: 1, settings: { visibility: 'public' } }, student), true);
    assert.equal(isAttemptable({ publishedVersion: 1, settings: { visibility: 'private' }, author: 'u2' }, student), false);
    assert.equal(isAttemptable({ publishedVersion: 1, settings: { visibility: 'private' }, author: 'u1' }, student), true);
    assert.equal(isAttemptable({ publishedVersion: 1, status: S.ARCHIVED }, student), false);
  });
});
