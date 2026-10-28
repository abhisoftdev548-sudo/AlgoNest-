import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { z } from 'zod';
import { RESOURCE_LIMITS } from '@algonest/shared';
import { Resource } from '../src/models/Resource.js';
import { checkLink, classify, selectCandidates } from '../src/modules/resources/linkChecker.js';

dotenv.config();

/**
 * Nightly broken-link checker.
 *
 *   npm run check:links                 # normal incremental run
 *   LINK_CHECK_FORCE=true npm run check:links
 *   LINK_CHECK_BATCH=50 LINK_CHECK_TIMEOUT_MS=5000 npm run check:links
 *
 * Intended for cron / a scheduler container. It is a SEPARATE process from the
 * API so a slow third-party host can never tie up a request thread. Every
 * target is validated by linkChecker.js before any socket is opened.
 */
const configSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  LINK_CHECK_BATCH: z.coerce.number().int().min(1).max(RESOURCE_LIMITS.MAX_LINK_CHECK_BATCH).default(20),
  LINK_CHECK_FORCE: z.enum(['true', 'false']).default('false'),
  LINK_CHECK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30_000).default(RESOURCE_LIMITS.LINK_CHECK_TIMEOUT_MS),
  LINK_CHECK_MAX_REDIRECTS: z.coerce.number().int().min(0).max(5).default(RESOURCE_LIMITS.LINK_CHECK_MAX_REDIRECTS),
  LINK_CHECK_USER_AGENT: z.string().trim().min(1).max(200).default('AlgoNest-LinkChecker/1.0 (+https://algonest.dev)'),
  LINK_CHECK_FAILURE_THRESHOLD: z.coerce.number().int().min(1).max(10).default(RESOURCE_LIMITS.LINK_CHECK_FAILURE_THRESHOLD),
});

const parsed = configSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('[link-check] Invalid configuration:');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}
const config = parsed.data;

async function main() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  const pool = await Resource.find({ status: 'published' })
    .select('url urlKey status linkStatus linkCheckedAt consecutiveFailures')
    .lean();
  const candidates = selectCandidates(pool, {
    force: config.LINK_CHECK_FORCE === 'true',
    limit: config.LINK_CHECK_BATCH,
    now: new Date(),
  });
  console.log(`[link-check] ${pool.length} published, ${candidates.length} due for a check`);

  let ok = 0; let broken = 0; let unknown = 0; let flagged = 0;
  for (const candidate of candidates) {
    const result = await checkLink(candidate.url, {
      timeoutMs: config.LINK_CHECK_TIMEOUT_MS,
      maxRedirects: config.LINK_CHECK_MAX_REDIRECTS,
      userAgent: config.LINK_CHECK_USER_AGENT,
    });
    const next = classify(candidate, result, config.LINK_CHECK_FAILURE_THRESHOLD);
    await Resource.updateOne({ _id: candidate._id }, {
      $set: {
        linkStatus: next.linkStatus,
        linkHttpStatus: next.linkHttpStatus,
        linkCheckedAt: next.linkCheckedAt,
        linkCheckError: next.linkCheckError,
        linkCheckHops: next.linkCheckHops,
        consecutiveFailures: next.consecutiveFailures,
      },
    });
    if (next.linkStatus === 'ok') ok += 1;
    else if (next.linkStatus === 'broken') broken += 1;
    else unknown += 1;
    if (next.flagged) flagged += 1;
    // Be polite to third-party hosts.
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(`[link-check] ${next.linkStatus.padEnd(7)} ${String(result.httpStatus).padEnd(4)} ${candidate.url}${next.flagged ? '  ← newly flagged' : ''}`);
  }
  console.log(`[link-check] done: ok=${ok} broken=${broken} unknown=${unknown} newlyFlagged=${flagged}`);
  return { checked: candidates.length, ok, broken, unknown, flagged };
}

main()
  .catch((error) => {
    console.error('[link-check] fatal:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
