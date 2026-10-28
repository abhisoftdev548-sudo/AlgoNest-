import crypto from 'node:crypto';

/** URL-safe, deterministic-ish slug plus a short random suffix for uniqueness. */
export function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'sheet';
}

export function uniqueSlug(value) {
  return `${slugify(value)}-${crypto.randomBytes(3).toString('hex')}`;
}

/** Canonical dedupe key for a problem URL (ignores tracking params + trailing /). */
export function canonicalUrlKey(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const path = url.pathname.replace(/\/+$/, '').toLowerCase();
    return `${host}${path}`;
  } catch {
    return String(rawUrl).trim().toLowerCase();
  }
}

export default slugify;
