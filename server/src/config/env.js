import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env from the server working directory. Never commit the real file.
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * In development/test a missing secret is replaced by a per-process random
 * value (nothing secret is ever hard-coded). In production a missing secret is
 * a fatal configuration error — fail fast instead of booting insecurely.
 */
const ephemeralSecret = () => (isProduction ? undefined : crypto.randomBytes(48).toString('hex'));

const raw = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? 5000,
  API_VERSION: process.env.API_VERSION ?? 'v1',
  TRUST_PROXY: process.env.TRUST_PROXY ?? 0,
  MONGODB_URI:
    process.env.MONGODB_URI ?? (isProduction ? undefined : 'mongodb://127.0.0.1:27017/algonest'),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? '',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE ?? 'lax',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? ephemeralSecret(),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? ephemeralSecret(),
  JWT_ISSUER: process.env.JWT_ISSUER ?? 'algonest-api',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? 'algonest-web',
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? '15m',
  REFRESH_TOKEN_TTL_DAYS: process.env.REFRESH_TOKEN_TTL_DAYS ?? 7,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS ?? 12,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ?? 900_000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ?? 300,
  AUTH_RATE_LIMIT_MAX: process.env.AUTH_RATE_LIMIT_MAX ?? 10,
};

const sameSite = z.enum(['lax', 'strict', 'none']);

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number().int().min(1).max(65535),
    API_VERSION: z.string().regex(/^v\d+$/, 'API_VERSION must look like v1'),
    TRUST_PROXY: z.coerce.number().int().min(0).max(10),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    CLIENT_URL: z.string().url(),
    CORS_ORIGINS: z.string(),
    COOKIE_SAME_SITE: sameSite,
    COOKIE_DOMAIN: z.string(),
    JWT_ACCESS_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_ISSUER: z.string().min(1),
    JWT_AUDIENCE: z.string().min(1),
    ACCESS_TOKEN_TTL: z.string().regex(/^\d+[smhd]$/, 'Use e.g. 15m'),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30),
    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000),
    RATE_LIMIT_MAX: z.coerce.number().int().min(1),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(1),
  })
  .superRefine((value, ctx) => {
    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_REFRESH_SECRET'], message: 'Access and refresh secrets must differ' });
    }
    try {
      const clientOrigin = new URL(value.CLIENT_URL);
      if (clientOrigin.origin !== value.CLIENT_URL || !['http:', 'https:'].includes(clientOrigin.protocol)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['CLIENT_URL'], message: 'CLIENT_URL must be an origin only (scheme + host, no path or trailing slash)' });
      }
      if (value.NODE_ENV === 'production' && clientOrigin.protocol !== 'https:') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['CLIENT_URL'], message: 'Production client origins must use HTTPS' });
      }
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['CLIENT_URL'], message: 'CLIENT_URL must be a valid http(s) origin' });
    }
    if (value.NODE_ENV === 'production') {
      for (const [key, secret] of [['JWT_ACCESS_SECRET', value.JWT_ACCESS_SECRET], ['JWT_REFRESH_SECRET', value.JWT_REFRESH_SECRET]]) {
        if (/replace[-_ ]?with|change[-_ ]?me|example|placeholder/i.test(secret)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: 'Replace the example secret with a newly generated random secret' });
        }
      }
    }
    for (const origin of value.CORS_ORIGINS.split(',').map((item) => item.trim()).filter(Boolean)) {
      try {
        const parsedOrigin = new URL(origin);
        if (!['http:', 'https:'].includes(parsedOrigin.protocol) || parsedOrigin.origin !== origin) throw new Error('Origin only');
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['CORS_ORIGINS'], message: `Invalid origin "${origin}"; provide scheme + host only (no path or trailing slash)` });
      }
    }
  });

const parsed = envSchema.safeParse(raw);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[config] Invalid environment configuration:', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
  process.exit(1);
}

export const env = Object.freeze({
  ...parsed.data,
  isProduction,
  isTest: parsed.data.NODE_ENV === 'test',
  corsOrigins: [
    ...new Set(
      [parsed.data.CLIENT_URL, ...parsed.data.CORS_ORIGINS.split(',').map((s) => s.trim())].filter(Boolean),
    ),
  ],
});
