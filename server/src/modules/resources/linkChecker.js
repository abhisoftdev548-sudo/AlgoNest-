import dns from 'node:dns/promises';
import { RESOURCE_LIMITS, RESOURCE_LINK_STATUSES as L } from '@algonest/shared';

/**
 * SSRF-safe broken-link checker.
 *
 * Submissions are untrusted input. Before any network call we:
 *   1. allow only http/https on ports 80/443 and reject credentials in the URL;
 *   2. resolve every A/AAAA record and reject loopback, private, link-local,
 *      multicast, reserved and unspecified ranges (IPv4 + IPv6);
 *   3. re-validate each redirect hop with the same rules (max 2 hops);
 *   4. abort after a short timeout and never read a response body.
 *
 * The `fetchImpl` / `lookupImpl` injections make the whole thing unit-testable
 * without a network. Default fetch uses `redirect: 'manual'` so we control hops.
 */

const ipv4Ranges = [
  [/^0\./, 'unspecified'], [/^127\./, 'loopback'], [/^10\./, 'private'],
  [/^169\.254\./, 'link-local'], [/^172\.(1[6-9]|2\d|3[01])\./, 'private'],
  [/^192\.168\./, 'private'], [/^192\.0\.0\./, 'reserved'], [/^192\.0\.2\./, 'documentation'],
  [/^198\.18\./, 'benchmark'], [/^198\.51\.100\./, 'documentation'],
  [/^203\.0\.113\./, 'documentation'], [/^224\./, 'multicast'],
  [/^(22[4-9]|23\d)\./, 'multicast'], [/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, 'cgnat'],
  [/^(24\d|25[0-5])\./, 'reserved'],
];

export function isPrivateIp(ip) {
  const value = String(ip ?? '').trim().toLowerCase();
  if (!value) return true;
  if (value === '::1' || value === '::' || value === '0:0:0:0:0:0:0:1' || value === '0:0:0:0:0:0:0:0') return true;
  if (value.startsWith('::ffff:')) return isPrivateIp(value.slice(7));
  if (value.startsWith('fc') || value.startsWith('fd')) return true; // IPv6 ULA
  if (value.startsWith('fe8') || value.startsWith('fe9') || value.startsWith('fea') || value.startsWith('feb')) return true; // link-local
  if (value.startsWith('ff')) return true; // multicast
  if (value.includes(':')) return false; // other global IPv6
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return true;
  for (const [pattern] of ipv4Ranges) if (pattern.test(value)) return true;
  const parts = value.split('.').map(Number);
  return parts.some((part) => part > 255) || parts[3] === 255 || parts[0] >= 240;
}

export function assertSafeTarget(rawUrl) {
  const url = new URL(String(rawUrl ?? ''));
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http(s) links can be checked');
  if (url.username || url.password) throw new Error('Links with credentials are not allowed');
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Only ports 80 and 443 are allowed');
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new Error('Local hostnames are not allowed');
  }
  // A literal IP in the URL still has to pass the private-range check.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':')) {
    if (isPrivateIp(host.replace(/^\[|\]$/g, ''))) throw new Error('Private network addresses are not allowed');
  }
  return url;
}

/** Resolve DNS and reject the whole target if ANY answer is a private address. */
export async function validateDns(hostname, lookupImpl = dns.lookup.bind(dns)) {
  const answers = await lookupImpl(hostname, { all: true, verbatim: true });
  const list = Array.isArray(answers) ? answers : [answers];
  if (!list.length) throw new Error('Host did not resolve');
  for (const answer of list) {
    const ip = typeof answer === 'string' ? answer : answer.address;
    if (isPrivateIp(ip)) throw new Error('Host resolves to a private address');
  }
  return list.map((answer) => (typeof answer === 'string' ? answer : answer.address));
}

function classifyHttpStatus(code) {
  if (code >= 200 && code < 300) return L.OK;
  if (code === 404 || code === 410 || code === 451) return L.BROKEN;
  return L.UNKNOWN; // 401/403/429/5xx are inconclusive, not proof of a dead link
}

/**
 * Probe one URL. Never throws for network problems — returns a result object
 * so a batch job can continue with the next resource.
 */
export async function checkLink(rawUrl, {
  fetchImpl = globalThis.fetch,
  lookupImpl = dns.lookup.bind(dns),
  timeoutMs = RESOURCE_LIMITS.LINK_CHECK_TIMEOUT_MS,
  maxRedirects = RESOURCE_LIMITS.LINK_CHECK_MAX_REDIRECTS,
  userAgent = 'AlgoNest-LinkChecker/1.0 (+https://algonest.dev)',
  now = new Date(),
} = {}) {
  const checkedAt = now instanceof Date ? now : new Date(now);
  let current = String(rawUrl ?? '');
  try {
    for (let hop = 0; hop <= maxRedirects; hop += 1) {
      const target = assertSafeTarget(current);
      await validateDns(target.hostname, lookupImpl);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let response;
      try {
        response = await fetchImpl(target.toString(), {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: {
            'User-Agent': userAgent,
            Accept: 'text/html,application/pdf,application/json;q=0.9,*/*;q=0.8',
            Range: 'bytes=0-0',
          },
        });
        // We never need the body; release the socket immediately.
        await response.body?.cancel?.().catch?.(() => {});
      } finally {
        clearTimeout(timer);
      }
      const status = Number(response.status) || 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        const location = response.headers?.get?.('location');
        if (!location) return { status: L.UNKNOWN, httpStatus: status, checkedAt, reason: 'Redirect without a Location header', hops: hop, finalUrl: current };
        if (hop >= maxRedirects) return { status: L.UNKNOWN, httpStatus: status, checkedAt, reason: 'Too many redirects', hops: hop, finalUrl: current };
        current = new URL(location, target).toString();
        continue;
      }
      return {
        status: classifyHttpStatus(status), httpStatus: status, checkedAt,
        reason: status >= 200 && status < 300 ? 'OK' : `HTTP ${status}`,
        hops: hop, finalUrl: current,
      };
    }
    return { status: L.UNKNOWN, httpStatus: 0, checkedAt, reason: 'Redirect loop', hops: maxRedirects, finalUrl: current };
  } catch (error) {
    return {
      status: L.UNKNOWN, httpStatus: 0, checkedAt,
      reason: error?.name === 'AbortError' ? 'Timed out' : (error?.message || 'Check failed'),
      hops: 0, finalUrl: current,
    };
  }
}

/**
 * Fold a fresh probe into a resource's persisted link state. Pure.
 * A single inconclusive result never marks a link broken: `threshold`
 * consecutive failures are required, so a transient 503 is harmless.
 */
export function classify(previous = {}, result, threshold = RESOURCE_LIMITS.LINK_CHECK_FAILURE_THRESHOLD) {
  const failed = result.status === L.BROKEN || result.status === L.UNKNOWN;
  const consecutiveFailures = failed ? (Number(previous.consecutiveFailures) || 0) + 1 : 0;
  const broken = failed && consecutiveFailures >= threshold;
  return {
    linkStatus: result.status === L.OK ? L.OK : broken ? L.BROKEN : L.UNKNOWN,
    linkHttpStatus: result.httpStatus ?? null,
    linkCheckedAt: result.checkedAt ?? new Date(),
    linkCheckError: failed ? (result.reason || 'Check failed') : '',
    linkCheckHops: result.hops ?? 0,
    consecutiveFailures,
    flagged: broken && previous.linkStatus !== L.BROKEN,
  };
}

/** Candidates for a batch: published links that are due for a re-check. */
export function selectCandidates(resources = [], { now = new Date(), force = false, limit = RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH } = {}) {
  const cutoff = new Date(now).getTime() - RESOURCE_LIMITS.LINK_CHECK_INTERVAL_HOURS * 3_600_000;
  return [...resources]
    .filter((resource) => resource?.url && resource.status === 'published')
    .filter((resource) => force || !resource.linkCheckedAt || new Date(resource.linkCheckedAt).getTime() <= cutoff)
    .sort((a, b) => {
      const rank = (item) => (item.linkStatus === 'broken' ? 0 : item.linkStatus === 'unknown' ? 1 : 2);
      return rank(a) - rank(b) || new Date(a.linkCheckedAt ?? 0) - new Date(b.linkCheckedAt ?? 0);
    })
    .slice(0, Math.max(1, Math.min(limit, RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH)));
}

export default checkLink;
