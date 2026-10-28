import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  RESOURCE_LINK_STATUSES as L, RESOURCE_STATUSES as S,
  creatorAnalyticsQuerySchema, creatorProfileSchema, resourceCreateSchema,
  resourceDuplicateQuerySchema, resourceFeedbackSchema, resourceListQuerySchema,
  resourceRatingSchema, resourceReportSchema, resourceUpdateSchema,
} from '@algonest/shared';

const {
  areDuplicate, displayHost, isHttpUrl, normaliseForStorage, urlKeyFor,
} = await import('../src/modules/resources/resourceUrl.js');
const {
  assertSafeTarget, checkLink, classify, isPrivateIp, selectCandidates, validateDns,
} = await import('../src/modules/resources/linkChecker.js');
const { canTransition, isEditable } = await import('../src/modules/resources/resourceWorkflow.js');
const { summariseEvents } = await import('../src/modules/resources/analytics.js');

const mockFetch = (status, headers = {}) => async () => ({
  status,
  headers: { get: (key) => headers[key.toLowerCase()] ?? null },
  body: { cancel: async () => {} },
});
const publicLookup = async () => [{ address: '8.8.8.8', family: 4 }];

describe('Phase-6 Zod contracts', () => {
  it('creates a resource with defaults and strips unknown keys', () => {
    const parsed = resourceCreateSchema.parse({ title: '  DP patterns guide  ', url: 'https://example.com/dp' });
    assert.equal(parsed.title, 'DP patterns guide');
    assert.equal(parsed.level, 'beginner');
    assert.equal(parsed.language, 'agnostic');
    assert.equal(parsed.pricing, 'free');
    assert.equal(parsed.submit, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'https://x.com/a', hacker: 1 }).success, false);
  });

  it('rejects non-http schemes, short titles and invalid enums', () => {
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'javascript:alert(1)' }).success, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'file:///etc/passwd' }).success, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'abc', url: 'https://x.com' }).success, false);
    assert.equal(resourceCreateSchema.safeParse({ title: 'Valid title', url: 'https://x.com', level: 'expert' }).success, false);
    assert.equal(resourceDuplicateQuerySchema.safeParse({ url: 'javascript:alert(1)' }).success, false);
  });

  it('validates filters, updates, ratings, feedback, reports and creator input', () => {
    assert.equal(resourceListQuerySchema.parse({}).sort, 'newest');
    assert.equal(resourceListQuerySchema.safeParse({ pricing: 'expensive' }).success, false);
    assert.equal(resourceListQuerySchema.safeParse({ q: 'dp', type: 'video', pricing: 'free' }).success, true);
    assert.throws(() => resourceUpdateSchema.parse({}));
    assert.equal(resourceRatingSchema.parse({ rating: 5 }).rating, 5);
    assert.equal(resourceRatingSchema.safeParse({ rating: 6 }).success, false);
    assert.equal(resourceFeedbackSchema.parse({ helpful: null }).helpful, null);
    assert.equal(resourceReportSchema.safeParse({ reason: 'broken_link', details: 'short' }).success, false);
    assert.equal(resourceReportSchema.safeParse({ reason: 'broken_link', details: 'This 404s every time I open it.' }).success, true);
    assert.equal(creatorProfileSchema.parse({ displayName: 'Ada' }).expertise.length, 0);
    assert.equal(creatorProfileSchema.safeParse({ displayName: 'A', website: 'not-a-url' }).success, false);
    assert.equal(creatorAnalyticsQuerySchema.parse({}).days, 30);
  });
});

describe('URL normalisation + duplicate detection (no network)', () => {
  it('canonicalises host, path, case, tracking params and fragments', () => {
    const a = normaliseForStorage('https://www.LeetCode.com/problems/two-sum/?utm_source=x#comments');
    assert.equal(a.url, 'https://www.leetcode.com/problems/two-sum');
    assert.equal(a.urlKey, 'leetcode.com/problems/two-sum');
    assert.equal(a.platform, 'leetcode');
    assert.equal(a.host, 'leetcode.com');
    assert.equal(urlKeyFor('https://leetcode.com/problems/two-sum'), a.urlKey);
  });

  it('detects duplicates across equivalent links', () => {
    assert.equal(areDuplicate('https://leetcode.com/problems/two-sum', 'https://www.leetcode.com/problems/two-sum/?utm_source=x'), true);
    assert.equal(areDuplicate('https://leetcode.com/problems/two-sum', 'https://leetcode.com/problems/add-two-numbers'), false);
  });

  it('keeps distinct YouTube videos separate', () => {
    const a = urlKeyFor('https://www.youtube.com/watch?v=abc123');
    const b = urlKeyFor('https://youtu.be/xyz789');
    assert.notEqual(a, b);
    assert.equal(areDuplicate('https://www.youtube.com/watch?v=abc123&t=42', 'https://youtube.com/watch?v=abc123'), true);
  });

  it('never accepts a non-http URL', () => {
    assert.throws(() => normaliseForStorage('javascript:alert(1)'), /Only http\(s\) links/);
    assert.equal(isHttpUrl('ftp://example.com/a'), false);
    assert.equal(isHttpUrl('https://example.com/a'), true);
    assert.equal(displayHost('https://WWW.Example.com/a'), 'example.com');
    assert.equal(urlKeyFor('not a url'), '');
  });
});

describe('SSRF-safe link checker', () => {
  it('rejects private, loopback, link-local and reserved IPv4/IPv6', () => {
    for (const ip of ['127.0.0.1', '10.0.0.1', '172.16.0.1', '192.168.1.1', '169.254.169.254', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1']) {
      assert.equal(isPrivateIp(ip), true, ip);
    }
    for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) assert.equal(isPrivateIp(ip), false, ip);
  });

  it('rejects local hostnames, credentials, non-http schemes and odd ports', () => {
    assert.throws(() => assertSafeTarget('http://localhost/x'), /Local hostnames/);
    assert.throws(() => assertSafeTarget('http://metadata.internal/latest'), /Local hostnames/);
    assert.throws(() => assertSafeTarget('https://user:pass@example.com/'), /credentials/);
    assert.throws(() => assertSafeTarget('http://example.com:8080/'), /ports 80/);
    assert.throws(() => assertSafeTarget('ftp://example.com/'), /Only http/);
    assert.throws(() => assertSafeTarget('http://127.0.0.1/'), /Private network/);
    assert.equal(assertSafeTarget('https://example.com/a').hostname, 'example.com');
  });

  it('rejects a host that resolves to a private address', async () => {
    await assert.rejects(
      () => validateDns('internal.example.com', async () => [{ address: '10.1.2.3', family: 4 }]),
      /private address/,
    );
    assert.deepEqual(await validateDns('example.com', async () => [{ address: '93.184.216.34', family: 4 }]), ['93.184.216.34']);
  });

  it('classifies 2xx as ok and 404/410 as broken', async () => {
    const ok = await checkLink('https://example.com/a', { fetchImpl: mockFetch(200), lookupImpl: publicLookup });
    assert.equal(ok.status, L.OK);
    assert.equal(ok.httpStatus, 200);
    const broken = await checkLink('https://example.com/missing', { fetchImpl: mockFetch(404), lookupImpl: publicLookup });
    assert.equal(broken.status, L.BROKEN);
    assert.equal(broken.reason, 'HTTP 404');
  });

  it('treats 401/403/429/5xx as inconclusive, not broken', async () => {
    for (const code of [401, 403, 429, 500]) {
      const result = await checkLink('https://example.com/a', { fetchImpl: mockFetch(code), lookupImpl: publicLookup });
      assert.equal(result.status, L.UNKNOWN, `HTTP ${code}`);
    }
  });

  it('validates each redirect hop and stops after the configured limit', async () => {
    let calls = 0;
    const redirecting = async () => {
      calls += 1;
      return { status: 302, headers: { get: () => 'https://example.com/final' }, body: { cancel: async () => {} } };
    };
    const result = await checkLink('https://example.com/start', { fetchImpl: redirecting, lookupImpl: publicLookup, maxRedirects: 2 });
    assert.equal(calls, 3);
    assert.equal(result.status, L.UNKNOWN);
    assert.match(result.reason, /Too many redirects/);
  });

  it('refuses a redirect into the private network', async () => {
    const result = await checkLink('https://example.com/start', {
      fetchImpl: mockFetch(302, { location: 'http://169.254.169.254/latest/meta-data' }),
      lookupImpl: publicLookup,
    });
    assert.equal(result.status, L.UNKNOWN);
    assert.match(result.reason, /private address|Private network/);
  });

  it('returns a safe result on timeout or DNS failure', async () => {
    const throwing = async () => { const error = new Error('boom'); error.name = 'AbortError'; throw error; };
    const result = await checkLink('https://example.com/a', { fetchImpl: throwing, lookupImpl: publicLookup });
    assert.equal(result.status, L.UNKNOWN);
    assert.equal(result.reason, 'Timed out');
  });

  it('requires two consecutive failures before flagging a link broken', () => {
    const first = classify({}, { status: L.UNKNOWN, httpStatus: 503, reason: 'HTTP 503' }, 2);
    assert.equal(first.linkStatus, L.UNKNOWN);
    assert.equal(first.consecutiveFailures, 1);
    assert.equal(first.flagged, false);
    const second = classify(first, { status: L.BROKEN, httpStatus: 404, reason: 'HTTP 404' }, 2);
    assert.equal(second.linkStatus, L.BROKEN);
    assert.equal(second.flagged, true);
    const recovered = classify(second, { status: L.OK, httpStatus: 200, reason: 'OK' }, 2);
    assert.equal(recovered.linkStatus, L.OK);
    assert.equal(recovered.consecutiveFailures, 0);
  });

  it('selects only published, due links and prioritises failing ones', () => {
    const now = new Date('2026-10-28T12:00:00.000Z');
    const candidates = selectCandidates([
      { url: 'https://a.com', status: 'published', linkStatus: 'ok', linkCheckedAt: now },
      { url: 'https://b.com', status: 'published', linkStatus: 'broken', linkCheckedAt: null },
      { url: 'https://c.com', status: 'published', linkStatus: 'unchecked', linkCheckedAt: null },
      { url: 'https://d.com', status: 'draft', linkCheckedAt: null },
    ], { now, limit: 10 });
    assert.equal(candidates.length, 2);
    assert.equal(candidates[0].url, 'https://b.com');
    assert.equal(selectCandidates([{ url: 'https://a.com', status: 'published', linkCheckedAt: now }], { now, force: true }).length, 1);
  });
});

describe('resource lifecycle + analytics summary', () => {
  it('follows the standard moderation lifecycle', () => {
    assert.ok(canTransition(S.DRAFT, S.PENDING_REVIEW));
    assert.ok(canTransition(S.PENDING_REVIEW, S.APPROVED));
    assert.ok(canTransition(S.APPROVED, S.PUBLISHED));
    assert.equal(canTransition(S.DRAFT, S.PUBLISHED), false);
    assert.equal(isEditable(S.PUBLISHED), false);
    assert.equal(isEditable(S.CHANGES_REQUESTED), true);
  });

  it('summarises events into totals, a daily series and top resources', () => {
    const events = [
      { resource: 'r1', type: 'view', dayKey: '2026-10-27' },
      { resource: 'r1', type: 'view', dayKey: '2026-10-28' },
      { resource: 'r1', type: 'start', dayKey: '2026-10-28' },
      { resource: 'r2', type: 'completion', dayKey: '2026-10-28' },
    ];
    const summary = summariseEvents(events, 3, new Date('2026-10-28T18:00:00.000Z'));
    assert.equal(summary.totals.view, 2);
    assert.equal(summary.totals.start, 1);
    assert.equal(summary.totals.completion, 1);
    assert.equal(summary.series.length, 3);
    assert.equal(summary.series[2].view, 1);
    assert.equal(summary.topResources[0].resource, 'r1');
    assert.equal(summary.topResources[0].total, 3);

    // MongoDB analytics now groups rows; preserve totals when consuming grouped counts.
    const grouped = summariseEvents([
      { resource: 'r3', type: 'view', dayKey: '2026-10-28', count: 4 },
    ], 3, new Date('2026-10-28T18:00:00.000Z'));
    assert.equal(grouped.totals.view, 4);
    assert.equal(grouped.topResources[0].total, 4);
  });
});
