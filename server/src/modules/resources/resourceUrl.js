import { normaliseUrl, detectPlatform } from '../sheets/platformDetector.js';
import { canonicalUrlKey } from '../../utils/slug.js';

/**
 * Pure URL helpers for the public resource directory.
 *
 * SECURITY: nothing here ever fetches a link. We only parse host + pathname,
 * so duplicate detection cannot be used for SSRF or to probe the internal
 * network. `normaliseUrl` already rejects non-http(s) schemes.
 */

/** Stable identity of a link, ignoring tracking params / fragments / www / case. */
export function urlKeyFor(rawUrl) {
  const detected = detectPlatform(String(rawUrl ?? ''));
  if (!detected.valid) return '';
  // externalId preserves YouTube's ?v= so distinct videos never collapse.
  return detected.externalId || canonicalUrlKey(detected.url);
}

/** Normalised, storage-ready link plus platform metadata. */
export function normaliseForStorage(rawUrl) {
  const detected = detectPlatform(String(rawUrl ?? ''));
  if (!detected.valid) {
    const error = new Error(detected.reason || 'Invalid URL');
    error.code = 'INVALID_URL';
    throw error;
  }
  let parsed;
  try { parsed = new URL(detected.url); } catch { parsed = null; }
  return {
    url: detected.url,
    urlKey: detected.externalId || canonicalUrlKey(detected.url),
    platform: detected.platform,
    platformLabel: detected.platformLabel,
    host: parsed?.hostname?.toLowerCase().replace(/^www\./, '') ?? detected.platformHost ?? '',
  };
}

/** True when two raw links resolve to the same canonical identity. */
export function areDuplicate(rawA, rawB) {
  const a = urlKeyFor(rawA);
  const b = urlKeyFor(rawB);
  return Boolean(a && b && a === b);
}

/** Safe, human-readable display host for cards (never an executable href). */
export function displayHost(rawUrl) {
  try {
    const url = new URL(normaliseUrl(String(rawUrl)));
    return url.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Validate a URL without touching the network — used by Zod refinements. */
export function isHttpUrl(rawUrl) {
  try {
    const url = new URL(String(rawUrl).trim());
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default urlKeyFor;
