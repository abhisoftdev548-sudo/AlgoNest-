import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import {
  MOCK_ATTEMPT_STATUSES as A, MOCK_STATUSES as S, MOCK_TIMER_MODES,
  PERMISSIONS, ROLES,
} from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { MockTest } = await import('../src/models/MockTest.js');
const { MockVersion } = await import('../src/models/MockVersion.js');
const { MockAttempt } = await import('../src/models/MockAttempt.js');
const { Question } = await import('../src/models/Question.js');
const { Sheet } = await import('../src/models/Sheet.js');
const { PersonalResource } = await import('../src/models/PersonalResource.js');
const testService = await import('../src/modules/mocks/mockTest.service.js');
const attemptService = await import('../src/modules/mocks/mockAttempt.service.js');
const { normaliseQuestion } = await import('../src/modules/quizzes/questionNormalizer.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const MOCK_ID = oid('507f1f77bcf86cd799439011');
const VERSION_ID = oid('507f1f77bcf86cd799439012');
const SECTION_A = oid('507f1f77bcf86cd7994390b1');
const SECTION_B = oid('507f1f77bcf86cd7994390b2');
const Q1 = oid('507f1f77bcf86cd7994390a1');
const Q2 = oid('507f1f77bcf86cd7994390a2');
const Q3 = oid('507f1f77bcf86cd7994390a3');
const Q4 = oid('507f1f77bcf86cd7994390a4');
const OWNER = oid('507f1f77bcf86cd799439001');
const OTHER = oid('507f1f77bcf86cd799439002');

const owner = { id: String(OWNER), role: ROLES.STUDENT, permissions: [] };
const stranger = { id: String(OTHER), role: ROLES.STUDENT, permissions: [] };
const moderator = {
  id: String(OTHER), role: ROLES.CONTENT_MODERATOR,
  permissions: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ],
};
const superAdmin = { id: String(OTHER), role: ROLES.SUPER_ADMIN, permissions: Object.values(PERMISSIONS) };

const stubs = [];
function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}
afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs.length = 0;
});

function chainable(value) {
  const promise = Promise.resolve(value);
  const chain = {};
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where', 'count']) chain[method] = () => chain;
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

const q = (prompt, topic, difficulty = 'easy') => normaliseQuestion({
  type: 'mcq', prompt, options: ['Queue', 'Stack', 'Tree'], answer: 'B',
  topic, difficulty, explanation: 'LIFO.', points: 1,
});

const BANK = [
  { ...q('Which structure is LIFO?', 'Arrays'), _id: Q1, author: OWNER },
  { ...q('Which one is FIFO?', 'Queues', 'hard'), _id: Q2, author: OWNER },
  { ...q('Which sort is stable?', 'Sorting'), _id: Q3, author: OWNER },
  { ...q('Which tree is balanced?', 'Trees'), _id: Q4, author: OWNER },
];

function makeMock(overrides = {}) {
  return new MockTest({
    _id: MOCK_ID,
    title: 'Placement Mock 1',
    slug: 'placement-mock-1-abc',
    author: OWNER,
    status: S.DRAFT,
    difficulty: 'medium',
    goals: [], topics: [], tags: [],
    settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60, maxAttempts: 3 },
    sections: [
      { _id: SECTION_A, title: 'Aptitude', description: '', durationMinutes: 10, correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 50, questionIds: [Q1, Q2], order: 0 },
      { _id: SECTION_B, title: 'Reasoning', description: '', durationMinutes: 10, correctMarks: 3, negativeMarks: 1, cutoffPercentage: 40, questionIds: [Q3, Q4], order: 1 },
    ],
    publishedVersion: 0,
    ...overrides,
  });
}

function makeVersion(overrides = {}) {
  return {
    _id: VERSION_ID,
    mock: MOCK_ID,
    version: 1,
    title: 'Placement Mock 1',
    description: '',
    difficulty: 'medium',
    topics: ['Arrays', 'Queues', 'Sorting', 'Trees'],
    totalDurationMinutes: 20,
    maxScore: 10,
    settings: {
      timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60, maxAttempts: 3,
      shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
      showExplanations: true, allowPaletteBack: true,
    },
    sections: [
      { _id: SECTION_A, title: 'Aptitude', description: '', durationMinutes: 10, correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 50, order: 0, questionCount: 2, maxScore: 4, questions: [{ ...BANK[0], order: 0 }, { ...BANK[1], order: 1 }] },
      { _id: SECTION_B, title: 'Reasoning', description: '', durationMinutes: 10, correctMarks: 3, negativeMarks: 1, cutoffPercentage: 40, order: 1, questionCount: 2, maxScore: 6, questions: [{ ...BANK[2], order: 0 }, { ...BANK[3], order: 1 }] },
    ],
    ...overrides,
  };
}

function stubMock(doc) {
  stub(MockTest, 'findById', () => chainable(doc));
  stub(MockTest, 'updateOne', () => chainable({}));
}
function stubVersion(version) {
  stub(MockVersion, 'findOne', () => chainable(version));
  stub(MockVersion, 'findById', () => chainable(version));
  stub(MockVersion, 'find', () => chainable(version ? [version] : []));
  stub(MockVersion, 'deleteOne', () => chainable({}));
}
function stubBank(docs = BANK) {
  stub(Question, 'find', () => chainable(docs));
  stub(Question, 'updateMany', async () => ({ modifiedCount: docs.length }));
}
function stubSave(...prototypes) {
  for (const proto of prototypes) stub(proto, 'save', async function save() { return this; });
}
function stubNoRecommendations() {
  stub(Sheet, 'find', () => chainable([]));
  stub(PersonalResource, 'find', () => chainable([]));
}
function stubAttemptQueries({ live = null, used = 0, attempts = [] } = {}) {
  stub(MockAttempt, 'findOne', () => chainable(live));
  stub(MockAttempt, 'countDocuments', async () => used);
  stub(MockAttempt, 'find', () => chainable(attempts));
  stub(MockAttempt, 'aggregate', async () => used ? [{ attemptsUsed: used, bestPercentage: 0 }] : []);
}

/* ───────────────────────── mock test service ───────────────────────── */

describe('mockTest.service — authorisation + lifecycle', () => {
  it('blocks a non-author student from editing', async () => {
    stubMock(makeMock());
    await assert.rejects(
      () => testService.updateMock(String(MOCK_ID), { title: 'Hacked mock' }, stranger),
      (error) => error.statusCode === 403,
    );
  });

  it('lets a moderator edit but never moderate their own mock', async () => {
    stubMock(makeMock({ status: S.PENDING_REVIEW, author: OTHER }));
    await assert.rejects(
      () => testService.moderateMock(String(MOCK_ID), 'approve', '', moderator),
      (error) => error.statusCode === 403 && /authored|own mock/i.test(error.message),
    );
    stubSave(MockTest.prototype);
    const result = await testService.moderateMock(String(MOCK_ID), 'approve', 'LGTM', superAdmin);
    assert.equal(result.mock.status, S.APPROVED);
  });

  it('refuses to submit a mock with an empty section', async () => {
    stubMock(makeMock({ sections: [{ _id: SECTION_A, title: 'Empty', durationMinutes: 10, correctMarks: 2, negativeMarks: 0.5, cutoffPercentage: 0, questionIds: [], order: 0 }] }));
    await assert.rejects(
      () => testService.submitForReview(String(MOCK_ID), '', owner),
      (error) => error.statusCode === 422,
    );
  });

  it('follows draft → review → approved → published with an immutable version', async () => {
    const mock = makeMock();
    stubMock(mock);
    stubSave(MockTest.prototype);
    stubBank();

    await testService.submitForReview(String(MOCK_ID), 'first draft', owner);
    assert.equal(mock.status, S.PENDING_REVIEW);
    await testService.moderateMock(String(MOCK_ID), 'approve', 'LGTM', moderator);
    assert.equal(mock.status, S.APPROVED);

    let created = null;
    stub(MockVersion, 'create', async (payload) => { created = payload; return { _id: VERSION_ID, ...payload }; });
    const result = await testService.publishMock(String(MOCK_ID), 'v1', owner);
    assert.equal(mock.status, S.PUBLISHED);
    assert.equal(mock.publishedVersion, 1);
    assert.equal(mock.publishedQuestionCount, 4);
    assert.equal(result.version.maxScore, 10);
    assert.equal(created.sections.length, 2);
    assert.equal(String(created.sections[0].questions[0]._id), String(Q1));
    assert.equal(created.sections[1].correctMarks, 3);
    assert.equal(created.sections[1].negativeMarks, 1);
    assert.deepEqual(created.sections[0].questions[0].answerKey, ['o1']);
  });

  it('rolls back the orphan version when the mock save fails', async () => {
    stubMock(makeMock({ status: S.APPROVED }));
    stubBank();
    let deleted = false;
    stub(MockVersion, 'create', async (payload) => ({ _id: VERSION_ID, ...payload }));
    stub(MockVersion, 'deleteOne', () => { deleted = true; return chainable({}); });
    stub(MockTest.prototype, 'save', async () => { throw new Error('db write failed'); });
    await assert.rejects(() => testService.publishMock(String(MOCK_ID), '', owner), /db write failed/);
    assert.equal(deleted, true);
  });

  it('serves students the frozen published snapshot, never the draft', async () => {
    const version = makeVersion();
    stubMock(makeMock({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(version);
    stubAttemptQueries({ attempts: [] });
    const detail = await testService.getMock(String(MOCK_ID), stranger);
    assert.equal(detail.mock.viewedVersion, 1);
    assert.equal(detail.mock.isPublishedSnapshot, true);
    assert.equal(detail.mock.sectionCount, 2);
    assert.equal(detail.mock.questionCount, 4);
    assert.equal(detail.canManage, false);
    assert.equal(detail.mySummary.attemptsLeft, 3);
  });

  it('rejects a duplicate question across sections and a foreign bank question', async () => {
    const mock = makeMock();
    stubMock(mock);
    stubSave(MockTest.prototype);
    stubBank();
    await assert.rejects(
      () => testService.setSectionQuestions(String(MOCK_ID), String(SECTION_B), [String(Q1), String(Q3)], owner),
      (error) => error.statusCode === 409,
    );
    stubBank([{ ...BANK[0], _id: '507f1f77bcf86cd7994390ff', author: OTHER }]);
    await assert.rejects(
      () => testService.setSectionQuestions(String(MOCK_ID), String(SECTION_A), ['507f1f77bcf86cd7994390ff'], owner),
      (error) => error.statusCode === 403,
    );
  });
});

/* ───────────────────────── attempt service ───────────────────────── */

async function newStartedAttempt(overrides = {}) {
  const version = makeVersion(overrides.version);
  stubMock(makeMock({ status: S.PUBLISHED, publishedVersion: 1 }));
  stubVersion(version);
  stubBank();
  stubSave(MockAttempt.prototype);
  stubAttemptQueries({ live: null, used: overrides.used ?? 0, attempts: [] });
  stubNoRecommendations();
  return attemptService.startAttempt(String(MOCK_ID), owner);
}

describe('mockAttempt.service — server clock, resume, grading', () => {
  it('starts with an absolute server deadline and one active section', async () => {
    const before = Date.now();
    const { attempt, remainingSeconds, mock } = await newStartedAttempt();
    assert.equal(attempt.status, A.IN_PROGRESS);
    assert.equal(attempt.questionCount, 4);
    assert.equal(attempt.sectionStates[0].status, 'active');
    assert.equal(attempt.sectionStates[1].status, 'pending');
    assert.equal(mock.maxScore, 10);
    // First section is 10 minutes; the hard backstop is 21 minutes.
    assert.ok(remainingSeconds <= 600 && remainingSeconds >= 599);
    assert.ok(new Date(attempt.expiresAt).getTime() >= before + 1_259_000);
  });

  it('refuses to start an unpublished mock and enforces maxAttempts', async () => {
    stubMock(makeMock({ status: S.DRAFT }));
    stubVersion(makeVersion());
    await assert.rejects(
      () => attemptService.startAttempt(String(MOCK_ID), owner),
      (error) => error.statusCode === 403,
    );

    stubMock(makeMock({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubAttemptQueries({ used: 3 });
    await assert.rejects(
      () => attemptService.startAttempt(String(MOCK_ID), owner),
      (error) => error.statusCode === 409 && /all 3 attempts/.test(error.message),
    );
  });

  it('never sends answer keys to the solver and only exposes the active section', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      expiresAt: new Date(Date.now() + 1_260_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    const data = await attemptService.getAttemptQuestions(attempt.id, { page: 1, limit: 300 }, owner);
    assert.equal(data.items.length, 2, 'only the active section is visible');
    assert.equal(data.pagination.total, 2);
    const json = JSON.stringify(data.items);
    for (const secret of ['answerKey', 'booleanKey', 'textAnswers', 'explanation', 'expected']) {
      assert.equal(json.includes(secret), false, `leaked ${secret}`);
    }
  });

  it('rejects autosave by another user and ignores locked-section answers', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      expiresAt: new Date(Date.now() + 1_260_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    await assert.rejects(
      () => attemptService.autosaveAttempt(attempt.id, { answers: [{ questionId: String(Q1), response: 'o1', marked: false, visited: true }], activeQuestionId: String(Q1) }, stranger),
      (error) => error.statusCode === 403,
    );
    const saved = await attemptService.autosaveAttempt(attempt.id, {
      answers: [
        { questionId: String(Q1), response: 'o1', marked: false, visited: true },
        { questionId: String(Q3), response: 'o0', marked: false, visited: true }, // locked section
      ],
      activeQuestionId: String(Q1),
    }, owner);
    assert.equal(saved.ignored, 1);
    assert.equal(saved.attempt.answers.length, 1);
    assert.equal(saved.attempt.answers[0].response, 'o1');
  });

  it('credits focus time from server timestamps, never from the client payload', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      expiresAt: new Date(Date.now() + 1_260_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    // Strict Zod rejects a client-supplied duration before the service sees it.
    // The service itself only ever credits time from `new Date()` on its side.
    const first = await attemptService.autosaveAttempt(attempt.id, { answers: [], activeQuestionId: String(Q1) }, owner);
    assert.equal(first.attempt.answers.length, 1);
    assert.equal(first.attempt.answers[0].visited, true);
    assert.equal(first.attempt.answers[0].accumulatedSeconds, 0);
    assert.equal(first.attempt.answers[0].response, null);
  });

  it('auto-advances on section timeout and auto-finalises on the hard deadline', async () => {
    const { attempt } = await newStartedAttempt();
    const expiredSection = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates.map((state, index) => ({
        ...state,
        expiresAt: new Date(Date.now() - 1000),
        sectionId: oid(state.sectionId),
      })),
      startedAt: new Date(Date.now() - 1_300_000),
      expiresAt: new Date(Date.now() + 60_000),
      answers: [{ questionId: Q1, sectionId: SECTION_A, response: 'o1', marked: false, visited: true, accumulatedSeconds: 30 }],
    });
    stub(MockAttempt, 'findById', async () => expiredSection);
    stubSave(MockAttempt.prototype);
    stubNoRecommendations();
    const resumed = await attemptService.getAttempt(attempt.id, owner);
    assert.equal(resumed.sectionAdvanced, true);
    assert.equal(resumed.attempt.status, A.IN_PROGRESS);
    assert.equal(resumed.attempt.sectionStates[0].status, 'timed_out');
    assert.equal(resumed.attempt.sectionStates[1].status, 'active');
    assert.ok(resumed.attempt.answers.length >= 1, 'resume restores autosaved answers');

    // Now force the hard deadline back.
    expiredSection.expiresAt = new Date(Date.now() - 1000);
    const final = await attemptService.getAttempt(attempt.id, owner);
    assert.equal(final.expired, true);
    assert.equal(final.attempt.status, A.TIMED_OUT);
  });

  it('grades with negative marking and builds difficulty/topic/time diagnostics', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.GLOBAL, passPercentage: 60, showExplanations: true },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates.map((state) => ({ ...state, status: 'active', expiresAt: new Date(Date.now() + 600_000) })),
      startedAt: new Date(Date.now() - 120_000),
      expiresAt: new Date(Date.now() + 600_000),
      answers: [
        { questionId: Q1, sectionId: SECTION_A, response: 'o1', marked: false, visited: true, accumulatedSeconds: 20 },
        { questionId: Q2, sectionId: SECTION_A, response: 'o0', marked: true, visited: true, accumulatedSeconds: 90 },
        { questionId: Q3, sectionId: SECTION_B, response: null, marked: false, visited: true, accumulatedSeconds: 40 },
      ],
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    stubNoRecommendations();

    const result = await attemptService.submitAttempt(attempt.id, { answers: [] }, owner);
    assert.equal(result.attempt.status, A.SUBMITTED);
    // Q1 +2, Q2 −0.5, Q3 unattempted 0, Q4 not visited 0 → 1.5 / 10
    assert.equal(result.attempt.score, 1.5);
    assert.equal(result.attempt.maxScore, 10);
    assert.equal(result.attempt.percentage, 15);
    assert.equal(result.attempt.accuracy, 50);
    assert.equal(result.attempt.correctCount, 1);
    assert.equal(result.attempt.incorrectCount, 1);
    assert.equal(result.attempt.unattemptedCount, 2);
    assert.equal(result.attempt.sections.length, 2);
    assert.ok(result.attempt.difficultyStats.length >= 2);
    assert.ok(result.attempt.topicStats.length >= 3);
    assert.ok(result.attempt.timeStats.totalSeconds >= 150);
  });

  it('submitSection flushes final answers, advances, then finalises on the last section', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.IN_PROGRESS,
      settings: { timerMode: MOCK_TIMER_MODES.SECTIONAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: attempt.sectionStates,
      startedAt: new Date(Date.now() - 60_000),
      expiresAt: new Date(Date.now() + 1_200_000),
    });
    stub(MockAttempt, 'findById', async () => live);
    stubSave(MockAttempt.prototype);
    stubNoRecommendations();

    const first = await attemptService.submitSection(String(attempt.id), String(SECTION_A), {
      answers: [{ questionId: String(Q1), response: 'o1', marked: false, visited: true }],
    }, owner);
    assert.equal(first.finished, false);
    assert.equal(first.sectionAdvanced, true);
    assert.equal(first.attempt.answers.length, 1);

    const second = await attemptService.submitSection(String(attempt.id), String(SECTION_B), {
      answers: [{ questionId: String(Q3), response: 'o1', marked: false, visited: true }],
    }, owner);
    assert.equal(second.finished, true);
    assert.equal(second.attempt.status, A.SUBMITTED);
    assert.equal(second.attempt.score, 5); // 2 + 3
  });

  it('tags only wrong answers and refreshes weak topics + recommendations', async () => {
    const { attempt } = await newStartedAttempt();
    const finished = new MockAttempt({
      _id: attempt.id, user: OWNER, mock: MOCK_ID, mockVersion: 1, versionId: VERSION_ID,
      status: A.SUBMITTED,
      settings: { timerMode: MOCK_TIMER_MODES.GLOBAL, passPercentage: 60 },
      title: 'Placement Mock 1', questionIds: attempt.questionIds.map(oid),
      sectionStates: [], expiresAt: new Date(Date.now() + 600_000),
      results: [
        { questionId: Q1, sectionId: SECTION_A, type: 'mcq', topic: 'Arrays', correct: true },
        { questionId: Q2, sectionId: SECTION_A, type: 'mcq', topic: 'Queues', correct: false },
      ],
      topicStats: [{ key: 'Queues', topic: 'Queues', total: 1, correct: 0, incorrect: 1, score: -0.5, maxScore: 2, percentage: 0, lostMarks: 2.5 }],
    });
    stub(MockAttempt, 'findById', async () => finished);
    stubSave(MockAttempt.prototype);
    stub(Sheet, 'find', () => chainable([{
      title: 'Queue fundamentals', topics: ['Queues'],
      problems: [{ title: 'Implement Queue using Stacks', url: 'https://leetcode.com/problems/implement-queue-using-stacks/', topic: 'Queues' }],
    }]));
    stub(PersonalResource, 'find', () => chainable([{
      title: 'Queues explained', url: 'https://example.com/queues', topic: 'Queues', type: 'video',
    }]));

    await assert.rejects(
      () => attemptService.setWrongReasons(String(attempt.id), [{ questionId: String(Q1), reason: 'concept_gap' }], owner),
      (error) => error.statusCode === 422,
    );
    const tagged = await attemptService.setWrongReasons(String(attempt.id), [{ questionId: String(Q2), reason: 'concept_gap' }], owner);
    assert.equal(tagged.reasonSummary.find((item) => item.reason === 'concept_gap').count, 1);
    assert.ok(tagged.weakTopics.some((entry) => entry.topic === 'Queues'));
    assert.equal(tagged.recommendations.length, 2);
    assert.ok(tagged.recommendations.some((item) => item.url.includes('leetcode.com')));
    assert.ok(tagged.recommendations.some((item) => item.source === 'personal'));
  });
});
