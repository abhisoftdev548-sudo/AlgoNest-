import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MOCK_STATUSES as S, MOCK_TIMER_MODES, PALETTE_STATES as P, WRONG_REASONS,
  mockAutosaveSchema, mockCreateSchema, mockHeartbeatSchema, mockReasonSchema,
  mockUpdateSchema,
} from '@algonest/shared';

const { normaliseQuestion } = await import('../src/modules/quizzes/questionNormalizer.js');
const {
  analyseMock, applyWrongReasons, diagnoseWeakTopics, isAttempted, paletteState, paletteSummary,
} = await import('../src/modules/mocks/mockScoring.js');
const {
  advanceSection, creditFocusWindow, effectiveDeadline, globalDeadline,
  initialSectionStates, remainingSeconds, sectionDeadline, totalDurationSeconds,
} = await import('../src/modules/mocks/mockClock.js');
const { canTransition, isEditable, isAttemptable } = await import('../src/modules/mocks/mockWorkflow.js');

const QID = '507f1f77bcf86cd7994390a1';
const SID = '507f1f77bcf86cd7994390b1';

function question(overrides = {}) {
  return normaliseQuestion({
    type: 'mcq', prompt: 'Which structure is LIFO?',
    options: ['Queue', 'Stack', 'Tree'], answer: 'B',
    topic: 'Arrays', difficulty: 'easy', explanation: 'LIFO.', points: 1,
    ...overrides,
  });
}

function makeVersion(overrides = {}) {
  const sections = overrides.sections ?? [
    {
      _id: SID, title: 'Aptitude', durationMinutes: 20, order: 0,
      correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 50,
      questions: [
        { ...question(), _id: QID },
        { ...question({ prompt: 'Which one is FIFO?', topic: 'Queues', difficulty: 'hard' }), _id: '507f1f77bcf86cd7994390a2' },
        { ...question({ prompt: 'Which sort is stable?', topic: 'Sorting' }), _id: '507f1f77bcf86cd7994390a3' },
      ],
    },
  ];
  return {
    version: 1, title: 'Placement Mock', totalDurationMinutes: 20, maxScore: 6,
    settings: { passPercentage: 60, timerMode: MOCK_TIMER_MODES.SECTIONAL },
    sections,
    ...overrides,
  };
}

const IDS = [QID, '507f1f77bcf86cd7994390a2', '507f1f77bcf86cd7994390a3'];
const answer = (questionId, response, extra = {}) => ({
  questionId, response, marked: false, visited: true, accumulatedSeconds: 30,
  ...extra,
});

describe('Phase-4 Zod contracts', () => {
  it('creates a mock with sections and sane defaults', () => {
    const parsed = mockCreateSchema.parse({ title: '  Placement Mock 1  ', sections: [{ title: 'Quant', durationMinutes: 30 }] });
    assert.equal(parsed.title, 'Placement Mock 1');
    assert.equal(parsed.settings.timerMode, 'sectional');
    assert.equal(parsed.settings.maxAttempts, 3);
    assert.equal(parsed.sections[0].correctMarks, 2);
    assert.equal(parsed.sections[0].negativeMarks, 0.5);
  });

  it('rejects invalid section shapes and unknown keys', () => {
    assert.equal(mockCreateSchema.safeParse({ title: 'Valid title', hacker: 1 }).success, false);
    assert.equal(mockCreateSchema.safeParse({ title: 'Valid title', sections: [{ title: 'Q', durationMinutes: 0 }] }).success, false);
    assert.equal(mockCreateSchema.safeParse({ title: 'Valid title', sections: [{ title: 'Q', durationMinutes: 10, negativeMarks: -1 }] }).success, false);
  });

  it('caps total duration and questions, and rejects cross-section duplicates', () => {
    const many = Array.from({ length: 13 }, (_, index) => ({ title: `S${index}`, durationMinutes: 30 }));
    assert.equal(mockCreateSchema.safeParse({ title: 'Too long', sections: many }).success, false);
    const dup = [
      { title: 'A', durationMinutes: 10, questionIds: [QID] },
      { title: 'B', durationMinutes: 10, questionIds: [QID] },
    ];
    assert.equal(mockCreateSchema.safeParse({ title: 'Duplicate', sections: dup }).success, false);
  });

  it('merges partial settings on update', () => {
    assert.equal(mockUpdateSchema.parse({ settings: { timerMode: 'global' } }).settings.timerMode, 'global');
    assert.throws(() => mockUpdateSchema.parse({}));
  });

  it('validates autosave, heartbeat and reason payloads', () => {
    assert.equal(mockAutosaveSchema.safeParse({ answers: [], activeQuestionId: QID }).success, true);
    assert.equal(mockAutosaveSchema.safeParse({ answers: [] }).success, false);
    assert.equal(mockAutosaveSchema.safeParse({
      answers: [{ questionId: QID, response: 'o1', marked: true, visited: true }],
    }).success, true);
    assert.equal(mockAutosaveSchema.safeParse({ answers: [{ questionId: QID, response: 'o1', extra: 1 }] }).success, false);
    assert.equal(mockHeartbeatSchema.safeParse({ activeQuestionId: null }).success, true);
    assert.equal(mockReasonSchema.safeParse({ reasons: [{ questionId: QID, reason: WRONG_REASONS.CONCEPT_GAP }] }).success, true);
    assert.equal(mockReasonSchema.safeParse({ reasons: [{ questionId: QID, reason: 'nope' }] }).success, false);
  });
});

describe('palette states', () => {
  it('distinguishes all five states', () => {
    assert.equal(paletteState(undefined), P.NOT_VISITED);
    assert.equal(paletteState({ visited: true, response: null }), P.NOT_ANSWERED);
    assert.equal(paletteState({ visited: true, response: 'o1' }), P.ANSWERED);
    assert.equal(paletteState({ visited: true, response: null, marked: true }), P.MARKED);
    assert.equal(paletteState({ visited: true, response: ['o0'], marked: true }), P.ANSWERED_MARKED);
  });

  it('counts attempted responses across all question shapes', () => {
    assert.equal(isAttempted([]), false);
    assert.equal(isAttempted({}), false);
    assert.equal(isAttempted(false), true);
    assert.equal(isAttempted(0), true);
    assert.equal(isAttempted('o1'), true);
    assert.equal(isAttempted(['o0']), true);
    assert.equal(isAttempted({ p0: 'p0' }), true);
  });

  it('summarises a palette', () => {
    const summary = paletteSummary(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      [answer('a', 'o1'), answer('b', null, { marked: true }), { questionId: 'c', visited: true, response: null }],
    );
    assert.equal(summary[P.ANSWERED], 1);
    assert.equal(summary[P.MARKED], 1);
    assert.equal(summary[P.NOT_ANSWERED], 1);
    assert.equal(summary[P.NOT_VISITED], 1);
  });
});

describe('mock scoring with negative marking', () => {
  it('awards +2 for correct, −0.5 for wrong, 0 for unattempted', () => {
    const analysis = analyseMock(makeVersion(), [
      answer(IDS[0], 'o1'),          // correct
      answer(IDS[1], 'o0'),          // wrong (o1 is correct)
      answer(IDS[2], null),          // unattempted
    ]);
    assert.equal(analysis.correctCount, 1);
    assert.equal(analysis.incorrectCount, 1);
    assert.equal(analysis.unattemptedCount, 1);
    assert.equal(analysis.score, 1.5); // 2 − 0.5
    assert.equal(analysis.maxScore, 6);
    assert.equal(analysis.percentage, 25);
    assert.equal(analysis.accuracy, 50);
    assert.equal(analysis.sections[0].score, 1.5);
  });

  it('enforces sectional cut-off even when the overall score passes', () => {
    const version = makeVersion({
      settings: { passPercentage: 10, timerMode: MOCK_TIMER_MODES.GLOBAL },
    });
    version.sections[0].cutoffPercentage = 80;
    const analysis = analyseMock(version, [answer(IDS[0], 'o1'), answer(IDS[1], 'o0'), answer(IDS[2], 'o1')]);
    // 2 − 0.5 + 2 = 3.5 / 6 = 58.3% > 10% overall but < 80% sectional
    assert.equal(analysis.percentage, 58.3);
    assert.equal(analysis.sections[0].passed, false);
    assert.equal(analysis.passed, false);
  });

  it('passes only when all cut-offs and the overall bar are met', () => {
    const version = makeVersion({ settings: { passPercentage: 50, timerMode: MOCK_TIMER_MODES.GLOBAL } });
    version.sections[0].cutoffPercentage = 50;
    const analysis = analyseMock(version, [answer(IDS[0], 'o1'), answer(IDS[1], 'o1'), answer(IDS[2], 'o1')]);
    assert.equal(analysis.score, 6);
    assert.equal(analysis.percentage, 100);
    assert.equal(analysis.passed, true);
  });

  it('aggregates multiple sections with different marking schemes', () => {
    const version = makeVersion({
      settings: { passPercentage: 0, timerMode: MOCK_TIMER_MODES.SECTIONAL },
      sections: [
        { ...makeVersion().sections[0], cutoffPercentage: 0 },
        {
          _id: '507f1f77bcf86cd7994390b2', title: 'Reasoning', durationMinutes: 10, order: 1,
          correctMarks: 3, negativeMarks: 1, cutoffPercentage: 0,
          questions: [{ ...question(), _id: '507f1f77bcf86cd7994390a4' }],
        },
      ],
    });
    const analysis = analyseMock(version, [
      answer(IDS[0], 'o1'), answer('507f1f77bcf86cd7994390a4', 'o0'),
    ]);
    assert.equal(analysis.sections.length, 2);
    assert.equal(analysis.sections[1].score, -1);
    assert.equal(analysis.score, 1); // 2 − 1
    assert.equal(analysis.maxScore, 9); // 3*2 + 3
  });

  it('builds difficulty, topic, weak-topic and time diagnostics', () => {
    const analysis = analyseMock(makeVersion(), [
      answer(IDS[0], 'o1', { accumulatedSeconds: 20 }),
      answer(IDS[1], 'o0', { accumulatedSeconds: 90 }),
      answer(IDS[2], 'o0', { accumulatedSeconds: 40 }),
    ]);
    assert.equal(analysis.difficultyStats.length, 2);
    assert.ok(analysis.difficultyStats.some((stat) => stat.difficulty === 'hard'));
    assert.equal(analysis.topicStats.length, 3);
    assert.equal(analysis.timeStats.totalSeconds, 150);
    assert.equal(analysis.timeStats.averageSeconds, 50);
    assert.equal(analysis.timeStats.slowest[0].seconds, 90);
    assert.ok(analysis.weakTopics.length >= 1);
    assert.equal(analysis.weakTopics[0].topic, 'Queues'); // hardest hit first
  });

  it('hides explanations when disabled', () => {
    const analysis = analyseMock(makeVersion(), [], { showExplanations: false });
    assert.equal('expected' in analysis.results[0], false);
    assert.equal('explanation' in analysis.results[0], false);
  });

  it('raises severity for knowledge-gap reasons', () => {
    const results = [
      { questionId: IDS[0], topic: 'Arrays', correct: false, reason: WRONG_REASONS.CONCEPT_GAP },
      { questionId: IDS[1], topic: 'Arrays', correct: false, reason: WRONG_REASONS.CONCEPT_GAP },
      { questionId: IDS[2], topic: 'Arrays', correct: true, reason: null },
    ];
    const topicStats = [{ topic: 'Arrays', percentage: 66.7, lostMarks: 5, incorrect: 2, total: 3, correct: 1, score: 2, maxScore: 6 }];
    const weak = diagnoseWeakTopics(topicStats, results);
    assert.equal(weak[0].knowledgeGaps, 2);
    assert.equal(weak[0].severity, 'high');
  });

  it('only tags wrong questions and summarises reasons', () => {
    const results = [
      { questionId: IDS[0], correct: true, topic: 'Arrays' },
      { questionId: IDS[1], correct: false, topic: 'Queues' },
      { questionId: IDS[2], correct: false, topic: 'Sorting' },
    ];
    const tagged = applyWrongReasons(results, [
      { questionId: IDS[0], reason: WRONG_REASONS.GUESSED }, // ignored: correct
      { questionId: IDS[1], reason: WRONG_REASONS.CONCEPT_GAP },
      { questionId: IDS[2], reason: WRONG_REASONS.SILLY_MISTAKE },
    ]);
    assert.equal(tagged.results[0].reason, undefined);
    assert.equal(tagged.results[1].reason, WRONG_REASONS.CONCEPT_GAP);
    assert.equal(tagged.taggedCount, 2);
    assert.equal(tagged.reasonSummary.find((item) => item.reason === WRONG_REASONS.CONCEPT_GAP).count, 1);
  });
});

describe('server-authoritative clock', () => {
  const start = new Date('2026-01-01T10:00:00.000Z');
  const twoSections = [
    { _id: 's1', title: 'A', durationMinutes: 10 },
    { _id: 's2', title: 'B', durationMinutes: 20 },
  ];

  it('computes total duration and a global hard deadline', () => {
    assert.equal(totalDurationSeconds(twoSections), 1800);
    const deadline = globalDeadline(start, twoSections, MOCK_TIMER_MODES.GLOBAL);
    assert.equal(deadline, start.getTime() + 1800_000);
    assert.equal(remainingSeconds(deadline, start.getTime()), 1800);
  });

  it('adds a bounded transition grace only in sectional mode', () => {
    const sectional = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    assert.equal(sectional, start.getTime() + 1860_000);
  });

  it('never lets a section deadline exceed the hard backstop', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    const entered = new Date(hard - 60_000);
    assert.equal(sectionDeadline(entered, 20, hard), hard);
  });

  it('credits focus windows using server timestamps with a cap', () => {
    const t0 = Date.parse('2026-01-01T10:00:00Z');
    const opened = creditFocusWindow(null, t0, { open: true });
    assert.equal(opened.accumulatedSeconds, 0);
    assert.equal(opened.lastSeenAt.getTime(), t0);

    const beat = creditFocusWindow(opened, t0 + 20_000, { open: true });
    assert.equal(beat.accumulatedSeconds, 20);

    const closed = creditFocusWindow(beat, t0 + 35_000, { open: false });
    assert.equal(closed.accumulatedSeconds, 35);
    assert.equal(closed.lastSeenAt, null);

    // A disconnected tab cannot credit more than the cap in one window.
    const capped = creditFocusWindow(opened, t0 + 3_600_000, { open: true });
    assert.equal(capped.accumulatedSeconds, 300);
  });

  it('creates correct initial section states for both timer modes', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    const sectional = initialSectionStates(twoSections, start, MOCK_TIMER_MODES.SECTIONAL, hard);
    assert.equal(sectional[0].status, 'active');
    assert.equal(sectional[1].status, 'pending');
    assert.equal(sectional[0].expiresAt.getTime(), start.getTime() + 600_000);

    const global = initialSectionStates(twoSections, start, MOCK_TIMER_MODES.GLOBAL, hard);
    assert.ok(global.every((state) => state.status === 'active'));
    assert.ok(global.every((state) => state.expiresAt.getTime() === hard));
  });

  it('advances to the next section with a fresh deadline, then finishes', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    let states = initialSectionStates(twoSections, start, MOCK_TIMER_MODES.SECTIONAL, hard);
    const now = start.getTime() + 600_000;
    const first = advanceSection(states, now, hard, 'timed_out');
    states = first.states;
    assert.equal(first.finished, false);
    assert.equal(states[0].status, 'timed_out');
    assert.equal(states[1].status, 'active');
    assert.equal(states[1].expiresAt.getTime(), now + 1200_000);

    const second = advanceSection(states, now + 1200_000, hard, 'submitted');
    assert.equal(second.finished, true);
    assert.equal(second.states[1].status, 'submitted');
  });

  it('effectiveDeadline is the earlier of section and attempt deadlines', () => {
    const hard = globalDeadline(start, twoSections, MOCK_TIMER_MODES.SECTIONAL);
    const attempt = {
      expiresAt: new Date(hard),
      sectionStates: initialSectionStates(twoSections, start, MOCK_TIMER_MODES.SECTIONAL, hard),
    };
    assert.equal(effectiveDeadline(attempt, start.getTime()), start.getTime() + 600_000);
  });
});

describe('mock lifecycle + availability', () => {
  it('follows the standard content lifecycle', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.equal(isEditable(S.PUBLISHED), false);
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
