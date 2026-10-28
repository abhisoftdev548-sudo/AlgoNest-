import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { z } from 'zod';
import { emailSchema } from '@algonest/shared';
import { ROLES, USER_STATUSES } from '@algonest/shared/constants';
import { User } from '../src/models/User.js';

dotenv.config();

/**
 * Idempotent Super Admin bootstrap.
 *   node scripts/seedSuperAdmin.js                 # create or promote
 *   node scripts/seedSuperAdmin.js --reset-password  # also rotate the password
 * Credentials come ONLY from the environment — no password is hard-coded.
 */
const configSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  SEED_ADMIN_NAME: z.string().trim().min(2).max(60).default('Platform Owner'),
  SEED_ADMIN_EMAIL: emailSchema,
  SEED_ADMIN_PASSWORD: z
    .string()
    .min(12, 'SEED_ADMIN_PASSWORD must be at least 12 characters')
    .max(128),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
});

const parsed = configSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[seed] Invalid configuration (values are never printed):');
  for (const issue of parsed.error.issues) {
    // eslint-disable-next-line no-console
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

const config = parsed.data;
const resetPassword = process.argv.includes('--reset-password');

async function run() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });

  const email = config.SEED_ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email }).select('+passwordHash');
  const passwordHash = await bcrypt.hash(config.SEED_ADMIN_PASSWORD, config.BCRYPT_ROUNDS);

  if (existing) {
    existing.role = ROLES.SUPER_ADMIN;
    existing.status = USER_STATUSES.ACTIVE;
    existing.onboardingCompleted = true;
    if (resetPassword) existing.passwordHash = passwordHash;
    await existing.save();
    // eslint-disable-next-line no-console
    console.info(`[seed] promoted existing account to Super Admin: ${email} (id=${existing.id})`);
    // eslint-disable-next-line no-console
    console.info(`[seed] password ${resetPassword ? 'was reset from SEED_ADMIN_PASSWORD' : 'was left unchanged'}`);
  } else {
    const created = await User.create({
      name: config.SEED_ADMIN_NAME,
      email,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      status: USER_STATUSES.ACTIVE,
      onboardingCompleted: true,
      preferredLanguage: 'javascript',
      streak: { current: 0, longest: 0, lastActiveDate: null },
    });
    // eslint-disable-next-line no-console
    console.info(`[seed] Super Admin created: ${email} (id=${created.id})`);
  }
}

try {
  await run();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
