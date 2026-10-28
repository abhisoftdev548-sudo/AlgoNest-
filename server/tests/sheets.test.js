import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  addProblemsSchema, importProblemsSchema, parseLinksSchema, personalResourceCreateSchema,
  progressUpdateSchema, ratingSchema, reorderProblemsSchema, sheetCreateSchema,
  sheetListQuerySchema, moderationSchema,
} from '@algonest/shared';
import { SHEET_STATUSES as S } from '@algonest/shared/constants';

const { detectPlatform, parsePastedLinks, normaliseUrl } = await import('../src/modules/sheets/platformDetector.js');
const { canTransition, isEditable, DECISION_TO_STATUS } = await import('../src/modules/sheets/sheetWorkflow.js');
const { canonicalUrlKey, slugify } = await import('../src/utils/slug.js');
const { buildPagination } = await import('../src/utils/pagination.js');

const VALID = 'https://leetcode.com/problems/two-sum/';

describe('platform detection (pure, no network)', () => {
  it('detects the major judge platforms and derives readable titles', () => {
    assert.equal(detectPlatform(VALID).platform, 'leetcode');
    assert.equal(detectPlatform(VALID).title, 'Two sum');
    assert.equal(detectPlatform(VALID).topic, 'Arrays');
    assert.equal(detectPlatform('https://codeforces.com/problemset/problem/1/A').title, 'Codeforces 1A');
    assert.equal(detectPlatform('https://www.geeksforgeeks.org/binary-search/').platform, 'geeksforgeeks');
    assert.equal(detectPlatform('https://www.geeksforgeeks.org/binary-search/').topic, 'Binary Search');
    assert.equal(detectPlatform('https://www.hackerrank.com/challenges/solve-me-first/').platform, 'hackerrank');
    assert.equal(detectPlatform('https://youtu.be/abc123').platform, 'youtube');
    assert.equal(detectPlatform('https://example.com/random-thing').platform, 'generic');
  });

  it('rejects non-http schemes and never fetches remote content', () => {
    for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'file:///etc/passwd', 'not a url']) {
      assert.equal(detectPlatform(bad).valid, false, bad);
    }
    assert.throws(() => normaliseUrl('ftp://example.com/x'));
  });

  it('normalises tracking params, fragments and trailing slashes', () => {
    const clean = normaliseUrl('https://leetcode.com/problems/two-sum/?utm_source=x&ref=y#desc');
    assert.equal(clean, 'https://leetcode.com/problems/two-sum');
    assert.equal(canonicalUrlKey('https://WWW.LeetCode.com/problems/Two-Sum/'), 'leetcode.com/problems/two-sum');
  });

  it('parses mixed pasted formats and dedupes links', () => {
    const pasted = [
      'Two Sum | https://leetcode.com/problems/two-sum/',
      '1. https://leetcode.com/problems/two-sum/',
      '[DP course](https://www.youtube.com/watch?v=abc)',
      'https://www.youtube.com/watch?v=xyz',
      'this line has no link',
    ].join('\n');
    const result = parsePastedLinks(pasted);
    assert.equal(result.items.length, 3);
    assert.equal(result.items[0].title, 'Two Sum');
    assert.equal(result.items[1].title, 'DP course');
    assert.equal(result.skipped.length, 2);
    assert.equal(result.skipped[0].reason, 'Duplicate link');
  });
});

describe('content lifecycle state machine', () => {
  it('follows draft → pending_review → approved → published', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(DECISION_TO_STATUS.approve, S.APPROVED);
  });

  it('forbids publishing a draft and skipping review', () => {
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.equal(canTransition(S.PENDING_REVIEW, S.PUBLISHED), false);
  });

  it('allows a published sheet to branch into a new draft revision', () => {
    assert.ok(canTransition(S.PUBLISHED, S.DRAFT));
    assert.equal(isEditable(S.PUBLISHED), false);
    assert.equal(isEditable(S.DRAFT), true);
    assert.equal(isEditable(S.CHANGES_REQUESTED), true);
  });

  it('requires a restore before editing an archived sheet', () => {
    assert.equal(canTransition(S.ARCHIVED, S.PUBLISHED), false);
    assert.ok(canTransition(S.ARCHIVED, S.DRAFT));
  });
});

describe('Phase-2 Zod contracts', () => {
  it('validates sheet creation and strips unknown keys', () => {
    const parsed = sheetCreateSchema.parse({ title: '  Arrays mastery  ' });
    assert.equal(parsed.title, 'Arrays mastery');
    assert.equal(parsed.difficulty, 'medium');
    assert.deepEqual(parsed.topics, []);
    assert.equal(sheetCreateSchema.safeParse({ title: 'abc' }).success, false);
    assert.equal(sheetCreateSchema.safeParse({ title: 'Valid title', status: 'published' }).success, false);
  });

  it('rejects unsafe URLs in problems, imports and personal resources', () => {
    assert.equal(addProblemsSchema.safeParse({ problems: [{ title: 'Two sum', url: VALID }] }).success, true);
    assert.equal(addProblemsSchema.safeParse({ problems: [{ title: 'Two sum', url: 'javascript:alert(1)' }] }).success, false);
    assert.equal(importProblemsSchema.safeParse({ items: [] }).success, false);
    assert.equal(personalResourceCreateSchema.safeParse({ title: 'Doc', url: 'file:///etc/passwd' }).success, false);
  });

  it('requires every id exactly once for reorder', () => {
    const a = '507f1f77bcf86cd799439011';
    const b = '507f1f77bcf86cd799439012';
    assert.equal(reorderProblemsSchema.safeParse({ orderedIds: [a, b] }).success, true);
    assert.equal(reorderProblemsSchema.safeParse({ orderedIds: [a, a] }).success, false);
  });

  it('requires a note when requesting changes or rejecting', () => {
    assert.equal(moderationSchema.safeParse({ decision: 'approve' }).success, true);
    assert.equal(moderationSchema.safeParse({ decision: 'reject', note: '' }).success, false);
    assert.equal(moderationSchema.safeParse({ decision: 'reject', note: 'Broken links' }).success, true);
  });

  it('validates progress patches, ratings and list pagination', () => {
    assert.equal(progressUpdateSchema.safeParse({}).success, false);
    assert.equal(progressUpdateSchema.safeParse({ notes: 'remember prefix sums' }).success, true);
    assert.equal(progressUpdateSchema.safeParse({ confidence: 6 }).success, false);
    assert.equal(ratingSchema.safeParse({ rating: 9 }).success, false);
    const list = sheetListQuerySchema.parse({ page: '2', limit: '5', sort: 'rating' });
    assert.equal(list.page, 2);
    assert.equal(list.limit, 5);
    assert.equal(sheetListQuerySchema.safeParse({ limit: '1000' }).success, false);
    assert.equal(parseLinksSchema.safeParse({ text: '' }).success, false);
  });

  it('builds a bounded pagination envelope', () => {
    assert.deepEqual(buildPagination(2, 10, 25), {
      page: 2, limit: 10, total: 25, totalPages: 3, hasNext: true, hasPrev: true,
    });
    assert.equal(buildPagination(0, 0, 0).page, 1);
    assert.equal(buildPagination(1, 999, 1).limit, 100);
  });

  it('slugifies titles safely', () => {
    assert.equal(slugify('  Binary Trees — Part 1! '), 'binary-trees-part-1');
    assert.equal(slugify('###'), 'sheet');
  });
});
