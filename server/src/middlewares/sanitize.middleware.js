/**
 * Input hardening, layered on top of express-mongo-sanitize:
 *  - mongo-sanitize removes `$`-prefixed keys / dots (NoSQL injection).
 *  - this middleware removes NUL/control characters and trims free text.
 *  - password-like fields are never trimmed (spaces can be intentional).
 *  - recursion is bounded to keep a deeply nested payload from being a DoS.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const UNTRIMMED_KEYS = new Set(['password', 'passwordHash', 'newPassword', 'confirmPassword', 'token']);
const MAX_DEPTH = 8;
const MAX_ARRAY_ITEMS = 200;

function cleanValue(value, key = '', depth = 0) {
  if (depth > MAX_DEPTH) return undefined;

  if (typeof value === 'string') {
    const stripped = value.replace(CONTROL_CHARS, '');
    return UNTRIMMED_KEYS.has(key) ? stripped : stripped.trim();
  }

  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => cleanValue(item, key, depth + 1));
  }

  if (value && typeof value === 'object' && !Buffer.isBuffer(value)) {
    const output = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      // Drop prototype-pollution style keys that survived mongo-sanitize.
      if (childKey === '__proto__' || childKey === 'constructor' || childKey === 'prototype') continue;
      output[childKey] = cleanValue(childValue, childKey, depth + 1);
    }
    return output;
  }

  return value;
}

export function sanitizeInput(req, _res, next) {
  for (const source of ['body', 'query', 'params']) {
    const value = req[source];
    if (value && typeof value === 'object') {
      const cleaned = cleanValue(value, source, 0) ?? {};
      if (source === 'query') {
        // Express defines req.query as a configurable getter (no setter);
        // redefine it rather than assigning in strict-mode ESM.
        Object.defineProperty(req, 'query', {
          value: cleaned,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        req[source] = cleaned;
      }
    }
  }
  next();
}

export default sanitizeInput;
