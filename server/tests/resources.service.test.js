import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import {
  PERMISSIONS, RESOURCE_STATUSES as S, ROLES,
} from '@algonest/shared/constants';

const { Resource } = await import('../src/models/Resource.js');
const { ResourceSave } = await import('../src/models/ResourceSave.js');
const { ResourceReaction } = await import('../src/models/ResourceReaction.js');
const { ResourceReport } = await import('../src/models/ResourceReport.js');
const { ResourceEvent } = await import('../src/models/ResourceEvent.js');
const { CreatorProfile } = await import('../src/models/CreatorProfile.js');
const { User } = await import('../src/models/User.js');
const resourceService = await import('../src/modules/resources/resource.service.js');
const interaction = await import('../src/modules/resources/interaction.service.js');
const creatorService = await import('../src/modules/resources/creator.service.js');

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const USER = oid('507f1f77bcf86cd799439001');
const OTHER = oid('507f1f77bcf86cd799439002');
const RES_ID = oid('507f1f77bcf86cd799439010');
const URL = 'https://www.leetcode.com/problems/two-sum/';

const student = { id: String(USER), role: ROLES.STUDENT, permissions: [] };
const stranger = { id: String(OTHER), role: ROLES.STUDENT, permissions: [] };
const moderator = { id: String(OTHER), role: ROLES.CONTENT_MODERATOR, permissions: [PERMISSIONS.CONTENT_MODERATE, PERMISSIONS.USER_READ] };
const analyst = { id: String(OTHER), role: ROLES.SUPPORT_ANALYST, permissions: [PERMISSIONS.ANALYTICS_READ, PERMISSIONS.USER_READ] };
const superAdmin = { id: String(OTHER), role: ROLES.SUPER_ADMIN, permissions: Object.values(PERMISSIONS) };
const ownerModerator = { id: String(USER), role: ROLES.CONTENT_MODERATOR, permissions: [PERMISSIONS.CONTENT_MODERATE] };

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
  for (const method of ['sort', 'select', 'skip', 'limit', 'populate', 'lean', 'where']) chain[method] = () => chain;
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

function makeResource(overrides = {}) {
  return new Resource({
    _id: RES_ID, title: 'Two Sum explained', slug: 'two-sum-explained-abc',
    url: 'https://leetcode.com/problems/two-sum', urlKey: 'leetcode.com/problems/two-sum',
    description: 'A clear walkthrough', type: 'article', topic: 'Arrays',
    level: 'beginner', language: 'javascript', pricing: 'free', tags: ['hash'],
    platform: 'leetcode', platformLabel: 'LeetCode', host: 'leetcode.com',
    author: USER, status: S.PUBLISHED, publishedAt: new Date(),
    ...overrides,
  });
}

const payload = (overrides = {}) => ({
  title: 'Two Sum explained', url: URL, description: 'A clear walkthrough',
  type: 'article', topic: 'Arrays', level: 'beginner', language: 'javascript',
  pricing: 'free', tags: [], submit: false, ...overrides,
});

function stubBase() {
  for (const proto of [Resource.prototype, ResourceSave.prototype, ResourceReaction.prototype, ResourceReport.prototype]) {
    stub(proto, 'save', async function save() { return this; });
  }
}

describe('resource.service — duplicates, create, lifecycle', () => {
  it('canonicalises the URL and creates a draft', async () => {
    stubBase();
    stub(Resource, 'findOne', () => chainable(null));
    let created = null;
    stub(Resource, 'create', async (doc) => { created = doc; return makeResource(doc); });
    const result = await resourceService.createResource(payload(), student);
    assert.equal(created.url, 'https://www.leetcode.com/problems/two-sum');
    assert.equal(created.urlKey, 'leetcode.com/problems/two-sum');
    assert.equal(created.platform, 'leetcode');
    assert.equal(created.status, S.DRAFT);
    assert.equal(result.resource.status, S.DRAFT);
  });

  it('submits straight to review when requested', async () => {
    stubBase();
    stub(Resource, 'findOne', () => chainable(null));
    let created = null;
    stub(Resource, 'create', async (doc) => { created = doc; return makeResource(doc); });
    await resourceService.createResource(payload({ submit: true }), student);
    assert.equal(created.status, S.PENDING_REVIEW);
    assert.ok(created.submittedAt instanceof Date);
  });

  it('rejects a duplicate URL (tracking params and case insensitive)', async () => {
    stub(Resource, 'findOne', () => chainable({
      _id: oid('507f1f77bcf86cd799439099'), title: 'Existing guide', status: S.PUBLISHED,
      url: 'https://leetcode.com/problems/two-sum', author: OTHER,
    }));
    const result = await resourceService.checkDuplicate('https://www.leetcode.com/problems/two-sum/?utm_source=x', student);
    assert.equal(result.duplicate, true);
    assert.equal(result.resource.title, 'Existing guide');
    stubBase();
    await assert.rejects(() => resourceService.createResource(payload(), student), (error) => error.statusCode === 409);
  });

  it('masks a non-public duplicate for a non-staff viewer', async () => {
    stub(Resource, 'findOne', () => chainable({
      _id: oid('507f1f77bcf86cd799439099'), title: 'Secret draft', status: S.PENDING_REVIEW,
      url: 'https://leetcode.com/problems/two-sum', author: OTHER,
    }));
    const result = await resourceService.checkDuplicate(URL, student);
    assert.equal(result.resource.id, null);
    assert.equal(result.resource.url, null);
  });

  it('blocks a stranger from editing and refuses to edit a published resource', async () => {
    stubBase();
    stub(Resource, 'findById', () => chainable(makeResource()));
    await assert.rejects(
      () => resourceService.updateResource(String(RES_ID), { title: 'Hacked resource' }, stranger),
      (error) => error.statusCode === 403,
    );
    await assert.rejects(
      () => resourceService.updateResource(String(RES_ID), { title: 'Edited resource' }, student),
      (error) => error.statusCode === 409 && /published/.test(error.message),
    );
  });

  it('re-verifies a link when the URL changes on an editable draft', async () => {
    const doc = makeResource({ status: S.DRAFT, linkStatus: 'ok', linkCheckedAt: new Date(), consecutiveFailures: 3 });
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    stub(Resource, 'findOne', () => chainable(null));
    await resourceService.updateResource(String(RES_ID), { url: 'https://example.com/dp-guide' }, student);
    assert.equal(doc.url, 'https://example.com/dp-guide');
    assert.equal(doc.linkStatus, 'unchecked');
    assert.equal(doc.consecutiveFailures, 0);
  });

  it('runs the full lifecycle and enforces moderation separation of duties', async () => {
    const doc = makeResource({ status: S.DRAFT });
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    await resourceService.submitResource(String(RES_ID), student);
    assert.equal(doc.status, S.PENDING_REVIEW);
    await assert.rejects(
      () => resourceService.moderateResource(String(RES_ID), 'approve', '', student),
      (error) => error.statusCode === 403 && /requires/i.test(error.message),
    );
    await assert.rejects(
      () => resourceService.moderateResource(String(RES_ID), 'approve', '', ownerModerator),
      (error) => error.statusCode === 403 && /cannot moderate/i.test(error.message),
    );
    await resourceService.moderateResource(String(RES_ID), 'approve', 'LGTM', superAdmin);
    assert.equal(doc.status, S.APPROVED);
    await resourceService.publishResource(String(RES_ID), student);
    assert.equal(doc.status, S.PUBLISHED);
  });

  it('lists only published resources for students and honours filters', async () => {
    let filter = null;
    stub(Resource, 'find', (value) => { filter = value; return chainable([makeResource()]); });
    stub(Resource, 'countDocuments', async () => 1);
    stub(ResourceSave, 'find', () => chainable([]));
    stub(ResourceReaction, 'find', () => chainable([]));
    const result = await resourceService.listResources({ page: 1, limit: 12, type: 'video', pricing: 'free', sort: 'rating' }, student);
    assert.equal(filter.status, S.PUBLISHED);
    assert.equal(filter.type, 'video');
    assert.equal(filter.pricing, 'free');
    assert.equal(result.items.length, 1);
    assert.equal(result.pagination.total, 1);
  });

  it('pages saved resources in MongoDB instead of loading every bookmark id', async () => {
    let pipeline = null;
    stub(Resource, 'aggregate', async (stages) => {
      pipeline = stages;
      return [{ items: [{ _id: RES_ID }], total: [{ count: 1 }] }];
    });
    stub(Resource, 'find', () => chainable([makeResource()]));
    stub(ResourceSave, 'find', () => chainable([{ resource: RES_ID }]));
    stub(ResourceReaction, 'find', () => chainable([]));
    const result = await resourceService.listResources({ saved: 'true', page: 1, limit: 12 }, student);
    assert.equal(pipeline.some((stage) => stage.$lookup?.from === ResourceSave.collection.name), true);
    assert.equal(pipeline.at(-1).$facet.items[1].$limit, 12);
    assert.equal(result.pagination.total, 1);
    assert.equal(result.items[0].saved, true);
  });

  it('restricts the link-check batch to staff', async () => {
    await assert.rejects(
      () => resourceService.runLinkCheckBatch({ limit: 5, force: 'false' }, student),
      (error) => error.statusCode === 403,
    );
  });
});

describe('interaction.service — save, rating, feedback, report', () => {
  it('save/unsave is idempotent and updates the counter', async () => {
    const doc = makeResource();
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    stub(ResourceEvent, 'create', async (row) => row);
    stub(Resource, 'updateOne', () => chainable({}));
    stub(ResourceSave, 'findOne', () => chainable(null));
    let created = null;
    stub(ResourceSave, 'create', async (row) => { created = row; return row; });
    const saved = await interaction.toggleSave(String(RES_ID), student, true);
    assert.equal(saved.saved, true);
    assert.equal(saved.saveCount, 1);
    assert.equal(String(created.user), String(USER));

    const again = await interaction.toggleSave(String(RES_ID), student, true);
    assert.equal(again.saved, true, 'PUT is idempotent — no double save event');
    stub(ResourceSave, 'findOne', () => chainable({ _id: oid('507f1f77bcf86cd799439088') }));
    stub(ResourceSave, 'deleteOne', () => chainable({}));
    const removed = await interaction.toggleSave(String(RES_ID), student, false);
    assert.equal(removed.saved, false);
    assert.equal(removed.saveCount, 0);
  });

  it('refuses to save a non-published resource', async () => {
    stub(Resource, 'findById', () => chainable(makeResource({ status: S.DRAFT })));
    await assert.rejects(() => interaction.toggleSave(String(RES_ID), student, true), (error) => error.statusCode === 403);
  });

  it('recomputes the rating average and forbids self-rating', async () => {
    const doc = makeResource();
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    await assert.rejects(() => interaction.rateResource(String(RES_ID), { rating: 5, review: '' }, student), (error) => error.statusCode === 403);

    const otherDoc = makeResource({ author: OTHER });
    stub(Resource, 'findById', () => chainable(otherDoc));
    let update = null;
    stub(ResourceReaction, 'findOneAndUpdate', () => chainable({}));
    stub(ResourceReaction, 'aggregate', async () => [{ ratingCount: 2, ratingSum: 8 }]);
    stub(ResourceReaction, 'findOne', () => chainable({ resource: RES_ID, user: USER, rating: 5, helpful: null, review: '' }));
    stub(Resource, 'updateOne', (_filter, value) => { update = value; return chainable({}); });
    const result = await interaction.rateResource(String(RES_ID), { rating: 5, review: 'Great' }, student);
    assert.equal(result.ratingCount, 2);
    assert.equal(result.ratingSum, 8);
    assert.equal(result.ratingAverage, 4);
    assert.equal(update.$set.ratingCount, 2);
  });

  it('withdrawing a helpful vote leaves the star rating alone', async () => {
    stub(Resource, 'findById', () => chainable(makeResource({ author: OTHER })));
    let setPayload = null;
    stub(ResourceReaction, 'findOneAndUpdate', (_filter, value) => { setPayload = value; return chainable({}); });
    stub(ResourceReaction, 'countDocuments', async (filter) => filter.helpful === true ? 1 : 0);
    stub(ResourceReaction, 'findOne', () => chainable({ resource: RES_ID, user: USER, rating: 4, helpful: null, review: '' }));
    stub(Resource, 'updateOne', () => chainable({}));
    const result = await interaction.setFeedback(String(RES_ID), { helpful: null }, student);
    assert.equal(setPayload.$set.helpful, null);
    assert.equal(result.helpfulCount, 1);
    assert.equal(result.notHelpfulCount, 0);
  });

  it('prevents duplicate open reports and nudges the link checker', async () => {
    const doc = makeResource({ author: OTHER });
    stubBase();
    stub(Resource, 'findById', () => chainable(doc));
    stub(ResourceReport, 'findOne', () => chainable(null));
    let created = null;
    stub(ResourceReport, 'create', async (row) => { created = row; return row; });
    let updates = 0;
    stub(Resource, 'updateOne', () => { updates += 1; return chainable({}); });
    await interaction.reportResource(String(RES_ID), { reason: 'broken_link', details: 'This page returns a 404 now.' }, student);
    assert.equal(created.reason, 'broken_link');
    assert.equal(updates, 2, 'counter + re-check nudge');

    stub(ResourceReport, 'findOne', () => chainable({ _id: oid('507f1f77bcf86cd799439077') }));
    await assert.rejects(
      () => interaction.reportResource(String(RES_ID), { reason: 'broken_link', details: 'Still broken after a day.' }, student),
      (error) => error.statusCode === 409,
    );
  });

  it('only staff can read or resolve the report queue', async () => {
    await assert.rejects(() => interaction.listReports({ page: 1, limit: 20 }, student), (error) => error.statusCode === 403);
    stub(ResourceReport, 'findById', async () => ({ _id: oid('507f1f77bcf86cd799439077'), status: 'open', save: async () => {} }));
    await assert.rejects(() => interaction.resolveReport(String(oid('507f1f77bcf86cd799439077')), { status: 'resolved', note: '' }, student), (error) => error.statusCode === 403);
  });
});

describe('creator.service — profiles and analytics', () => {
  it('lazily creates a public profile and accepts an update', async () => {
    stub(User, 'findById', () => chainable({ _id: USER, name: 'Ada Lovelace' }));
    stub(CreatorProfile, 'findOne', () => chainable(null));
    let created = null;
    stub(CreatorProfile, 'create', async (doc) => { created = doc; return { _id: oid('507f1f77bcf86cd799439060'), ...doc }; });
    stub(CreatorProfile, 'findById', () => chainable(new CreatorProfile({ _id: oid('507f1f77bcf86cd799439060'), user: USER, displayName: 'Ada Lovelace' })));
    const mine = await creatorService.getMyProfile(student);
    assert.equal(mine.profile.displayName, 'Ada Lovelace');
    assert.equal(mine.profile.isOwner, true);
    assert.equal(created.verified, false);

    const doc = new CreatorProfile({ _id: oid('507f1f77bcf86cd799439060'), user: USER, displayName: 'Ada' });
    stub(CreatorProfile, 'findOne', () => chainable(doc));
    stub(CreatorProfile.prototype, 'save', async function save() { return this; });
    const updated = await creatorService.upsertMyProfile({ displayName: 'Ada L.', expertise: ['Arrays'] }, student);
    assert.equal(updated.profile.displayName, 'Ada L.');
  });

  it('only the owner (or analytics:read staff) sees analytics', async () => {
    const resourceRows = [{ viewCount: 100, saveCount: 20, startCount: 40, completionCount: 10, ratingCount: 4, ratingSum: 18 }];
    stub(Resource, 'aggregate', async () => [{
      publishedResources: 1, views: 100, saves: 20, starts: 40,
      completions: 10, ratingCount: 4, ratingSum: 18,
    }]);
    stub(Resource, 'find', () => chainable(resourceRows));
    stub(ResourceEvent, 'aggregate', async () => [
      { resource: RES_ID, type: 'view', dayKey: '2026-10-28', count: 1 },
      { resource: RES_ID, type: 'start', dayKey: '2026-10-28', count: 1 },
    ]);
    await assert.rejects(() => creatorService.getAnalytics(stranger, {}, { creatorId: String(USER) }), (error) => error.statusCode === 403);
    const own = await creatorService.getAnalytics(student, { days: 7 });
    assert.equal(own.totals.views, 100);
    assert.equal(own.totals.publishedResources, 1);
    assert.equal(own.totals.ratingAverage, 4.5);
    assert.equal(own.conversion.startRate, 40);
    assert.equal(own.conversion.completionRate, 25);
    assert.equal(own.series.length, 7);
    const staff = await creatorService.getAnalytics(analyst, { days: 7 }, { creatorId: String(USER) });
    assert.equal(staff.totals.views, 100);
  });
});
