import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { PERMISSIONS, ROLES } from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { Sheet } = await import('../src/models/Sheet.js');
const { SheetVersion } = await import('../src/models/SheetVersion.js');
const { UserProgress } = await import('../src/models/UserProgress.js');
const service = await import('../src/modules/sheets/sheet.service.js');
const progressService = await import('../src/modules/sheets/progress.service.js');

const SHEET_ID = '507f1f77bcf86cd799439011';
const OWNER_ID = '507f1f77bcf86cd799439001';
const OTHER_ID = '507f1f77bcf86cd799439002';
const PROBLEM_ID = '507f1f77bcf86cd7994390aa';

const stubs = [];
function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}
afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs.length = 0;
});

const owner = { id: OWNER_ID, role: ROLES.STUDENT, permissions: [] };
const moderator = {
  id: OTHER_ID, role: ROLES.CONTENT_MODERATOR,
  permissions: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ],
};

function makeSheet(overrides = {}) {
  return new Sheet({
    _id: new mongoose.Types.ObjectId(SHEET_ID),
    title: 'Arrays Mastery',
    slug: 'arrays-mastery-abc123',
    author: new mongoose.Types.ObjectId(OWNER_ID),
    status: 'draft',
    difficulty: 'easy',
    goals: [], topics: [], tags: [],
    problems: [{
      _id: new mongoose.Types.ObjectId(PROBLEM_ID),
      title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum',
      platform: 'leetcode', platformLabel: 'LeetCode', difficulty: 'easy',
      topic: 'Arrays', order: 0, estimatedMinutes: 20,
      externalId: 'leetcode.com/problems/two-sum', hint: '',
    }],
    ...overrides,
  });
}

function stubFind(sheet) {
  stub(Sheet, 'findById', () => ({ populate: async () => sheet }));
}
function stubSave() {
  stub(Sheet.prototype, 'save', async function save() { return this; });
}

describe('sheet.service — authorisation + lifecycle', () => {
  it('blocks a non-author student from editing', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    const stranger = { id: OTHER_ID, role: ROLES.STUDENT, permissions: [] };
    await assert.rejects(
      () => service.updateSheet(SHEET_ID, { title: 'Hacked' }, stranger),
      (error) => error.statusCode === 403,
    );
  });

  it('allows a moderator to edit but not to moderate their own sheet', async () => {
    const sheet = makeSheet({ status: 'pending_review', author: new mongoose.Types.ObjectId(OTHER_ID) });
    stubFind(sheet);
    await assert.rejects(
      () => service.moderateSheet(SHEET_ID, 'approve', '', moderator),
      (error) => error.statusCode === 403 && /authored|own sheet/i.test(error.message),
    );
  });

  it('refuses to submit an empty sheet', async () => {
    const sheet = makeSheet({ problems: [] });
    stubFind(sheet);
    await assert.rejects(
      () => service.submitForReview(SHEET_ID, '', owner),
      (error) => error.statusCode === 422,
    );
  });

  it('follows draft → pending_review → approved', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    stubSave();
    await service.submitForReview(SHEET_ID, 'first draft', owner);
    assert.equal(sheet.status, 'pending_review');
    assert.equal(sheet.reviewHistory.length, 1);

    await service.moderateSheet(SHEET_ID, 'approve', 'LGTM', moderator);
    assert.equal(sheet.status, 'approved');
    assert.equal(sheet.reviewNote, 'LGTM');
  });

  it('rejects a change-request decision without a note', async () => {
    const { moderationSchema } = await import('@algonest/shared');
    assert.equal(moderationSchema.safeParse({ decision: 'request_changes', note: '' }).success, false);
  });

  it('cannot publish before approval', async () => {
    const sheet = makeSheet({ status: 'draft' });
    stubFind(sheet);
    await assert.rejects(
      () => service.publishSheet(SHEET_ID, '', owner),
      (error) => error.statusCode === 409,
    );
  });
});

describe('sheet.service — versioning', () => {
  it('publishes an immutable snapshot with stable problem ids', async () => {
    const sheet = makeSheet({ status: 'approved', publishedVersion: 0 });
    stubFind(sheet);
    stubSave();

    let snapshot = null;
    stub(SheetVersion, 'create', async (doc) => {
      snapshot = doc;
      return { ...doc, _id: new mongoose.Types.ObjectId(), toObject() { return { ...this }; } };
    });

    const result = await service.publishSheet(SHEET_ID, 'v1', owner);
    assert.equal(sheet.status, 'published');
    assert.equal(sheet.publishedVersion, 1);
    assert.equal(sheet.publishedProblemCount, 1);
    assert.equal(snapshot.version, 1);
    assert.equal(snapshot.problemCount, 1);
    // The SAME id is copied, otherwise historical progress rows would orphan.
    assert.equal(String(snapshot.problems[0]._id), String(PROBLEM_ID));
    assert.equal(result.sheet.status, 'published');
  });

  it('rolls back the snapshot when the sheet save fails', async () => {
    const sheet = makeSheet({ status: 'approved' });
    stubFind(sheet);
    stub(Sheet.prototype, 'save', async () => { throw new Error('write failed'); });
    let deleted = 0;
    stub(SheetVersion, 'create', async (doc) => ({ ...doc, _id: new mongoose.Types.ObjectId(), toObject() { return { ...this }; } }));
    stub(SheetVersion, 'deleteOne', async () => { deleted += 1; return { deletedCount: 1 }; });

    await assert.rejects(() => service.publishSheet(SHEET_ID, '', owner), /write failed/);
    assert.equal(deleted, 1);
  });

  it('forces a new revision before editing a published sheet', async () => {
    const sheet = makeSheet({ status: 'published', publishedVersion: 1 });
    stubFind(sheet);
    await assert.rejects(
      () => service.addProblems(SHEET_ID, [{ title: 'New', url: 'https://leetcode.com/problems/new', difficulty: 'easy', topic: 'Arrays', estimatedMinutes: 10 }], owner),
      (error) => error.statusCode === 409 && /revision/i.test(error.message),
    );
  });
});

describe('sheet.service — problems + bulk import', () => {
  it('re-detects the platform server-side and dedupes by canonical URL', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    stubSave();

    const result = await service.addProblems(SHEET_ID, [
      { title: 'Two Sum duplicate', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'hard', topic: 'Arrays', estimatedMinutes: 15 },
      { title: 'Binary Search', url: 'https://www.geeksforgeeks.org/binary-search/', difficulty: 'medium', topic: '', estimatedMinutes: 20 },
    ], owner);

    assert.equal(result.added, 1, 'duplicate leetcode link must be skipped');
    assert.equal(result.skipped.length, 1);
    const added = sheet.problems[1];
    assert.equal(added.platform, 'geeksforgeeks', 'platform comes from the URL, not the client');
    assert.equal(added.topic, 'Binary Search');
    assert.equal(added.order, 1);
    assert.ok(sheet.topics.includes('Binary Search'), 'topics are derived from problems');
  });

  it('rejects a full reorder list with unknown or missing ids', async () => {
    const sheet = makeSheet();
    stubFind(sheet);
    await assert.rejects(
      () => service.reorderProblems(SHEET_ID, [PROBLEM_ID, '507f1f77bcf86cd7994390bb'], owner),
      (error) => error.statusCode === 422,
    );
  });
});

describe('progress.service — per-user state', () => {
  it('computes percentage and topic-wise progress from the visible version', async () => {
    const sheet = makeSheet({ status: 'published', publishedVersion: 1 });
    stubFind(sheet);
    stub(UserProgress, 'find', () => ({ lean: async () => [{
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(OWNER_ID),
      sheet: new mongoose.Types.ObjectId(SHEET_ID),
      problemId: new mongoose.Types.ObjectId(PROBLEM_ID),
      sheetVersion: 1, problemTitle: 'Two Sum', topic: 'Arrays',
      status: 'solved', notes: 'hash map', bookmark: true, confidence: 4,
      timeSpent: 20, revisionDate: null, lastReviewedAt: null,
      updatedAt: new Date(),
    }] }));

    const result = await progressService.getProgress(SHEET_ID, { page: 1, limit: 300 }, owner);
    assert.equal(result.summary.total, 1);
    assert.equal(result.summary.completed, 1);
    assert.equal(result.summary.percentage, 100);
    assert.equal(result.summary.bookmarks, 1);
    assert.equal(result.summary.topicWise[0].topic, 'Arrays');
    assert.equal(result.items[0].notes, 'hash map');
  });

  it('rejects progress for a problem that is not in the visible version', async () => {
    const sheet = makeSheet({ status: 'published', publishedVersion: 1 });
    stubFind(sheet);
    await assert.rejects(
      () => progressService.upsertProgress(SHEET_ID, '507f1f77bcf86cd7994390cc', { status: 'solved' }, owner),
      (error) => error.statusCode === 404,
    );
  });
});
