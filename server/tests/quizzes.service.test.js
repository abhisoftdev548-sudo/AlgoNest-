import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { ATTEMPT_STATUSES as A, PERMISSIONS, QUIZ_STATUSES as S, ROLES } from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { Quiz } = await import('../src/models/Quiz.js');
const { QuizVersion } = await import('../src/models/QuizVersion.js');
const { Question } = await import('../src/models/Question.js');
const { Attempt } = await import('../src/models/Attempt.js');
const quizService = await import('../src/modules/quizzes/quiz.service.js');
const attemptService = await import('../src/modules/quizzes/attempt.service.js');
const { normaliseQuestion } = await import('../src/modules/quizzes/questionNormalizer.js');
const { buildPresentation } = await import('../src/modules/quizzes/quizPresentation.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const QUIZ_ID = oid('507f1f77bcf86cd799439011');
const VERSION_ID = oid('507f1f77bcf86cd799439012');
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

/** A thenable Mongoose-query double: any chain method returns itself. */
function chainable(value) {
  const promise = Promise.resolve(value);
  const chain = {};
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where', 'count']) {
    chain[method] = () => chain;
  }
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

const BANK = [
  normaliseQuestion({ type: 'mcq', prompt: 'Which structure is LIFO?', options: ['Queue', 'Stack'], answer: 'B', topic: 'Stacks', points: 1, explanation: 'LIFO' }),
  normaliseQuestion({ type: 'multi', prompt: 'Pick the prime numbers', options: ['2', '3', '4'], answer: [0, 1], topic: 'Math', points: 2, explanation: '2 and 3' }),
  normaliseQuestion({ type: 'true_false', prompt: 'Binary search needs sorted input.', answer: true, topic: 'Math', points: 1, explanation: 'Monotonic predicate' }),
];

function bankDocs() {
  return BANK.map((canonical, index) => ({
    ...canonical,
    _id: [Q1, Q2, Q3][index],
    author: OWNER,
    usageCount: 0,
    toObject() { return { ...this }; },
  }));
}

function makeQuiz(overrides = {}) {
  return new Quiz({
    _id: QUIZ_ID,
    title: 'Data structures warmup',
    slug: 'data-structures-warmup-abc',
    author: OWNER,
    status: S.DRAFT,
    difficulty: 'easy',
    goals: [], topics: [], tags: [],
    settings: { timerMinutes: 10, passPercentage: 50, maxAttempts: 3 },
    questions: BANK.map((question, index) => ({ question: [Q1, Q2, Q3][index], order: index })),
    publishedVersion: 0,
    ...overrides,
  });
}

function makeVersion(overrides = {}) {
  return {
    _id: VERSION_ID,
    quiz: QUIZ_ID,
    version: 1,
    title: 'Data structures warmup',
    description: '',
    difficulty: 'easy',
    topics: ['Stacks', 'Math'],
    settings: {
      timerMinutes: 10, passPercentage: 50, maxAttempts: 3,
      shuffleQuestions: false, shuffleOptions: false, visibility: 'public',
      showExplanations: true, allowRetryIncorrect: true,
    },
    questions: BANK.map((canonical, index) => ({ ...canonical, _id: [Q1, Q2, Q3][index], order: index })),
    questionCount: 3,
    maxScore: 4,
    publishedBy: OWNER,
    ...overrides,
  };
}

function stubQuiz(quiz) {
  stub(Quiz, 'findById', () => chainable(quiz));
}
function stubVersion(version) {
  stub(QuizVersion, 'findOne', () => chainable(version));
  stub(QuizVersion, 'findById', () => chainable(version));
  stub(QuizVersion, 'find', () => chainable(version ? [version] : []));
  stub(QuizVersion, 'deleteOne', () => chainable({ deletedCount: 1 }));
}
function stubSave(...prototypes) {
  for (const proto of prototypes) stub(proto, 'save', async function save() { return this; });
}
function stubBank(docs = bankDocs()) {
  stub(Question, 'find', () => chainable(docs));
  stub(Question, 'updateMany', async () => ({ modifiedCount: docs.length }));
  stub(Question, 'deleteMany', async () => ({ deletedCount: docs.length }));
}
function stubAttemptQueries({ live = null, used = 0, source = null, attempts = [] } = {}) {
  stub(Attempt, 'findOne', () => chainable(live ?? source));
  stub(Attempt, 'countDocuments', async () => used);
  stub(Attempt, 'find', () => chainable(attempts));
  stub(Attempt, 'aggregate', async () => used ? [{ attemptsUsed: used, bestPercentage: 0 }] : []);
  stub(Attempt, 'findById', async () => live);
  stub(Quiz, 'updateOne', () => chainable({ modifiedCount: 1 }));
}

/* ─────────────────────────── quiz service ─────────────────────────── */

describe('quiz.service — authorisation + lifecycle', () => {
  it('blocks a non-author student from editing a quiz', async () => {
    stubQuiz(makeQuiz());
    await assert.rejects(
      () => quizService.updateQuiz(String(QUIZ_ID), { title: 'Hacked quiz' }, stranger),
      (error) => error.statusCode === 403,
    );
  });

  it('lets a moderator edit but never moderate their own quiz', async () => {
    stubQuiz(makeQuiz({ status: S.PENDING_REVIEW, author: OTHER }));
    await assert.rejects(
      () => quizService.moderateQuiz(String(QUIZ_ID), 'approve', '', moderator),
      (error) => error.statusCode === 403 && /authored|own quiz/i.test(error.message),
    );
    // The super admin exemption is deliberate and tested separately.
    stubSave(Quiz.prototype);
    const result = await quizService.moderateQuiz(String(QUIZ_ID), 'approve', 'LGTM', superAdmin);
    assert.equal(result.quiz.status, S.APPROVED);
  });

  it('refuses to submit or publish an empty quiz', async () => {
    stubQuiz(makeQuiz({ questions: [] }));
    await assert.rejects(() => quizService.submitForReview(String(QUIZ_ID), '', owner), (error) => error.statusCode === 422);
    await assert.rejects(() => quizService.publishQuiz(String(QUIZ_ID), '', owner), (error) => error.statusCode === 409);
  });

  it('follows draft → pending_review → approved → published', async () => {
    const quiz = makeQuiz();
    stubQuiz(quiz);
    stubSave(Quiz.prototype);
    stubBank();

    await quizService.submitForReview(String(QUIZ_ID), 'first draft', owner);
    assert.equal(quiz.status, S.PENDING_REVIEW);
    assert.equal(quiz.reviewHistory.length, 1);

    await quizService.moderateQuiz(String(QUIZ_ID), 'approve', 'LGTM', moderator);
    assert.equal(quiz.status, S.APPROVED);

    let created = null;
    stub(QuizVersion, 'create', async (payload) => { created = payload; return { _id: VERSION_ID, ...payload }; });
    const published = await quizService.publishQuiz(String(QUIZ_ID), 'v1', owner);
    assert.equal(quiz.status, S.PUBLISHED);
    assert.equal(quiz.publishedVersion, 1);
    assert.equal(quiz.publishedQuestionCount, 3);
    assert.equal(quiz.publishedMaxScore, 4);
    assert.equal(published.version.version, 1);
    assert.equal(created.questions.length, 3);
    assert.equal(String(created.questions[0]._id), String(Q1)); // stable bank ids
    assert.equal(created.questions[1].answerKey[0], 'o0'); // answer keys frozen too
  });

  it('rolls back the orphan version when the quiz save fails', async () => {
    const quiz = makeQuiz({ status: S.APPROVED });
    stubQuiz(quiz);
    stubBank();
    let deleted = false;
    stub(QuizVersion, 'create', async (payload) => ({ _id: VERSION_ID, ...payload }));
    stub(QuizVersion, 'deleteOne', () => { deleted = true; return chainable({}); });
    stub(Quiz.prototype, 'save', async () => { throw new Error('db write failed'); });
    await assert.rejects(() => quizService.publishQuiz(String(QUIZ_ID), '', owner), /db write failed/);
    assert.equal(deleted, true);
  });

  it('keeps a published snapshot frozen when the bank question changes', async () => {
    const version = makeVersion();
    const quiz = makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 });
    stubQuiz(quiz);
    stubVersion(version);
    stubAttemptQueries({ attempts: [] });
    const before = JSON.stringify(version.questions);

    const detail = await quizService.getQuiz(String(QUIZ_ID), stranger);
    assert.equal(detail.quiz.viewedVersion, 1);
    assert.equal(detail.quiz.isPublishedSnapshot, true);
    assert.equal(detail.quiz.questionCount, 3);
    assert.equal(detail.canManage, false);
    assert.equal(detail.mySummary.activeAttemptId, null);
    assert.equal(detail.mySummary.attemptsLeft, 3);
    assert.equal(JSON.stringify(version.questions), before);
  });

  it('hides an unpublished draft from students', async () => {
    stubQuiz(makeQuiz({ status: S.DRAFT }));
    stubVersion(null);
    stubAttemptQueries({ attempts: [] });
    await assert.rejects(
      () => quizService.getQuiz(String(QUIZ_ID), stranger),
      (error) => error.statusCode === 404,
    );
  });

  it('rejects linking a foreign bank question and duplicate links', async () => {
    const quiz = makeQuiz();
    stubQuiz(quiz);
    stubSave(Quiz.prototype);
    stubBank([{ ...BANK[0], _id: Q4, author: OTHER }]);
    await assert.rejects(
      () => quizService.linkQuestions(String(QUIZ_ID), [String(Q4)], owner),
      (error) => error.statusCode === 403,
    );

    stubBank(bankDocs().slice(0, 1));
    await assert.rejects(
      () => quizService.linkQuestions(String(QUIZ_ID), [String(Q1)], owner),
      (error) => error.statusCode === 409,
    );
  });

  it('rejects a partial reorder and re-ranks on unlink', async () => {
    const quiz = makeQuiz();
    stubQuiz(quiz);
    stubSave(Quiz.prototype);
    await assert.rejects(
      () => quizService.reorderQuestions(String(QUIZ_ID), [String(Q1), String(Q2)], owner),
      (error) => error.statusCode === 422,
    );
    stubBank();
    const result = await quizService.unlinkQuestion(String(QUIZ_ID), String(Q2), owner);
    assert.equal(result.quiz.questionIds.length, 2);
    assert.deepEqual(quiz.questions.map((link) => link.order), [0, 1]);
  });
});

/* ─────────────────────────── attempt service ─────────────────────────── */

async function newStartedAttempt(overrides = {}) {
  const version = makeVersion(overrides.version);
  const quiz = makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 });
  stubQuiz(quiz);
  stubVersion(version);
  stubBank();
  stubSave(Attempt.prototype);
  stubAttemptQueries({ live: null, used: overrides.used ?? 0, attempts: [] });
  return attemptService.startAttempt(String(QUIZ_ID), overrides.payload ?? {}, owner);
}

describe('attempt.service — start, autosave, grading, expiry', () => {
  it('starts against the frozen version with a server-side deadline', async () => {
    const before = Date.now();
    const { attempt, remainingSeconds, quiz } = await newStartedAttempt();
    assert.equal(attempt.status, A.IN_PROGRESS);
    assert.equal(attempt.quizVersion, 1);
    assert.equal(attempt.questionCount, 3);
    assert.equal(quiz.maxScore, 4);
    assert.ok(remainingSeconds <= 600 && remainingSeconds >= 599);
    assert.ok(new Date(attempt.expiresAt).getTime() >= before + 599_000);
    assert.equal(attempt.answers.length, 0);
  });

  it('refuses to start an unpublished quiz', async () => {
    stubQuiz(makeQuiz({ status: S.DRAFT }));
    stubVersion(makeVersion());
    await assert.rejects(
      () => attemptService.startAttempt(String(QUIZ_ID), {}, owner),
      (error) => error.statusCode === 403,
    );
  });

  it('enforces maxAttempts server-side', async () => {
    stubQuiz(makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(makeVersion());
    stubAttemptQueries({ used: 3 });
    await assert.rejects(
      () => attemptService.startAttempt(String(QUIZ_ID), {}, owner),
      (error) => error.statusCode === 409 && /all 3 attempts/.test(error.message),
    );
  });

  it('stores a deterministic, seeded presentation order', async () => {
    const { attempt } = await newStartedAttempt({
      version: { settings: { ...makeVersion().settings, shuffleQuestions: true, shuffleOptions: true } },
    });
    assert.equal(attempt.presentation.length, 3);
    const expected = buildPresentation(
      makeVersion().questions.map((question) => ({ id: String(question._id), question })),
      { shuffleQuestions: true, shuffleOptions: true },
      attempt.id,
    );
    assert.deepEqual(attempt.questionIds, expected.map((entry) => entry.questionId));
  });

  it('never sends answer keys or explanations to the solver', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50 },
      title: 'Data structures warmup',
      questionIds: attempt.questionIds.map(oid),
      presentation: attempt.presentation,
      expiresAt: new Date(Date.now() + 600_000),
    });
    stub(Attempt, 'findById', async () => live);
    const data = await attemptService.getAttemptQuestions(attempt.id, { page: 1, limit: 200 }, owner);
    assert.equal(data.items.length, 3);
    const json = JSON.stringify(data.items);
    for (const secret of ['answerKey', 'booleanKey', 'textAnswers', 'explanation', 'expected']) {
      assert.equal(json.includes(secret), false, `leaked ${secret}`);
    }
    assert.equal(data.pagination.total, 3);
    assert.equal(data.items[0].options?.[0]?.text, 'Queue');
  });

  it('blocks autosave by another user and ignores stale question ids', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50 },
      title: 'Q', questionIds: attempt.questionIds.map(oid),
      expiresAt: new Date(Date.now() + 600_000),
    });
    stub(Attempt, 'findById', async () => live);
    stubSave(Attempt.prototype);
    await assert.rejects(
      () => attemptService.autosaveAttempt(attempt.id, [{ questionId: String(Q1), response: 'o1' }], stranger),
      (error) => error.statusCode === 403,
    );
    const saved = await attemptService.autosaveAttempt(attempt.id, [
      { questionId: String(Q1), response: 'o1', marked: true },
      { questionId: '507f1f77bcf86cd7994390ff', response: 'o0' },
    ], owner);
    assert.equal(saved.attempt.answers.length, 1);
    assert.equal(saved.attempt.answers[0].marked, true);
  });

  it('grades a submitted attempt with topic stats and pass flag', async () => {
    const { attempt } = await newStartedAttempt();
    const live = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50, showExplanations: true },
      title: 'Q', questionIds: attempt.questionIds.map(oid),
      startedAt: new Date(Date.now() - 30_000),
      expiresAt: new Date(Date.now() + 570_000),
    });
    stub(Attempt, 'findById', async () => live);
    stubSave(Attempt.prototype);
    stub(Quiz, 'updateOne', () => chainable({}));

    const result = await attemptService.submitAttempt(attempt.id, [
      { questionId: String(Q1), response: 'o1' },                 // correct, 1 point
      { questionId: String(Q2), response: ['o0', 'o1'], marked: true }, // correct, 2 points
      { questionId: String(Q3), response: false },                // wrong
    ], owner);

    assert.equal(result.attempt.status, A.SUBMITTED);
    assert.equal(result.attempt.score, 3);
    assert.equal(result.attempt.maxScore, 4);
    assert.equal(result.attempt.percentage, 75);
    assert.equal(result.attempt.passed, true);
    assert.equal(result.attempt.correctCount, 2);
    assert.equal(result.attempt.topicStats.length, 2);
    assert.equal(result.attempt.results.length, 3);
    assert.ok(result.attempt.results[0].explanation.length > 0);
    assert.ok(result.attempt.durationSeconds >= 29);
  });

  it('is idempotent: a second submit returns the same score', async () => {
    const submitted = new Attempt({
      _id: oid('507f1f77bcf86cd7994390c1'), user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.SUBMITTED,
      settings: { timerMinutes: 10, passPercentage: 50 }, title: 'Q',
      questionIds: [Q1], expiresAt: new Date(Date.now() + 600_000),
      score: 1, maxScore: 1, percentage: 100, results: [], topicStats: [],
    });
    stub(Attempt, 'findById', async () => submitted);
    const result = await attemptService.submitAttempt(String(submitted._id), [{ questionId: String(Q1), response: 'o0' }], owner);
    assert.equal(result.attempt.score, 1);
    assert.equal(result.attempt.status, A.SUBMITTED);
  });

  it('auto-finalises an expired attempt as timed_out on read', async () => {
    const { attempt } = await newStartedAttempt();
    const expired = new Attempt({
      _id: attempt.id, user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.IN_PROGRESS,
      settings: { timerMinutes: 10, passPercentage: 50, showExplanations: true },
      title: 'Q', questionIds: attempt.questionIds.map(oid),
      startedAt: new Date(Date.now() - 700_000),
      expiresAt: new Date(Date.now() - 100_000),
      answers: [{ questionId: Q1, response: 'o1', marked: false }],
    });
    stub(Attempt, 'findById', async () => expired);
    stubSave(Attempt.prototype);
    stub(Quiz, 'updateOne', () => chainable({}));
    const data = await attemptService.getAttempt(attempt.id, owner);
    assert.equal(data.expired, true);
    assert.equal(data.attempt.status, A.TIMED_OUT);
    assert.equal(data.attempt.score, 1);
    assert.equal(data.attempt.durationSeconds, 600); // capped at the timer
  });

  it('builds a retry-incorrect-only subset from a previous attempt', async () => {
    const source = {
      _id: oid('507f1f77bcf86cd7994390c2'), user: OWNER, quiz: QUIZ_ID,
      status: A.SUBMITTED,
      results: [
        { questionId: Q1, correct: true }, { questionId: Q2, correct: false }, { questionId: Q3, correct: false },
      ],
    };
    const version = makeVersion();
    stubQuiz(makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(version);
    stubBank();
    stubSave(Attempt.prototype);
    let calls = 0;
    stub(Attempt, 'findOne', () => { calls += 1; return chainable(calls === 1 ? null : source); });
    stub(Attempt, 'countDocuments', async () => 1);
    stub(Attempt, 'find', () => chainable([]));
    stub(Quiz, 'updateOne', () => chainable({}));

    const data = await attemptService.startAttempt(String(QUIZ_ID), {
      mode: 'incorrect', sourceAttemptId: String(source._id),
    }, owner);
    assert.equal(data.attempt.mode, 'incorrect');
    assert.equal(data.attempt.questionCount, 2);
    assert.equal(data.quiz.maxScore, 3); // 2 + 1
  });

  it('rejects retry-incorrect from someone else’s attempt', async () => {
    stubQuiz(makeQuiz({ status: S.PUBLISHED, publishedVersion: 1 }));
    stubVersion(makeVersion());
    stubBank();
    let calls = 0;
    stub(Attempt, 'findOne', () => { calls += 1; return chainable(null); });
    stub(Attempt, 'countDocuments', async () => 1);
    await assert.rejects(
      () => attemptService.startAttempt(String(QUIZ_ID), {
        mode: 'incorrect', sourceAttemptId: '507f1f77bcf86cd7994390c2',
      }, owner),
      (error) => error.statusCode === 404,
    );
    assert.equal(calls, 2);
  });

  it('hides explanations on the result when the quiz disables them', async () => {
    const done = new Attempt({
      _id: oid('507f1f77bcf86cd7994390c3'), user: OWNER, quiz: QUIZ_ID, quizVersion: 1,
      versionId: VERSION_ID, status: A.SUBMITTED,
      settings: { timerMinutes: 10, passPercentage: 50, showExplanations: false },
      title: 'Q', questionIds: [Q1], expiresAt: new Date(Date.now() + 600_000),
      results: [{ questionId: Q1, type: 'mcq', topic: 'Stacks', correct: true, expected: 'Stack', explanation: 'LIFO' }],
      topicStats: [], score: 1, maxScore: 1, percentage: 100,
    });
    stub(Attempt, 'findById', async () => done);
    stub(QuizVersion, 'findById', () => chainable({ settings: { allowRetryIncorrect: false } }));
    stub(Attempt, 'countDocuments', async () => 1);
    stub(Quiz, 'findById', () => chainable(makeQuiz()));
    const data = await attemptService.getResult(String(done._id), owner);
    assert.equal('expected' in data.attempt.results[0], false);
    assert.equal('explanation' in data.attempt.results[0], false);
    assert.equal(data.retryAllowed, false);
  });
});
