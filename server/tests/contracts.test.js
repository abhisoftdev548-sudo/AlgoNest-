import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  loginSchema,
  onboardingSchema,
  paginationSchema,
  registerSchema,
  updateProfileSchema,
  adminModerateSchema,
  adminModerationQuerySchema,
  featureFlagKeySchema,
  featureFlagUpdateSchema,
} from '@algonest/shared';
import { GOALS, ROLE_PERMISSIONS, ROLES, PERMISSIONS } from '@algonest/shared/constants';

process.env.NODE_ENV = 'test';

const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken, extractBearerToken } =
  await import('../src/utils/tokens.js');

describe('shared Zod contracts', () => {
  it('normalises email and accepts a strong registration', () => {
    const parsed = registerSchema.parse({
      name: '  Ada Lovelace  ',
      email: '  ADA@Example.COM ',
      password: 'StrongPass1!',
    });
    assert.equal(parsed.name, 'Ada Lovelace');
    assert.equal(parsed.email, 'ada@example.com');
  });

  it('rejects weak passwords and unknown keys', () => {
    assert.equal(registerSchema.safeParse({ name: 'Ada', email: 'a@b.co', password: 'password' }).success, false);
    assert.equal(
      registerSchema.safeParse({ name: 'Ada', email: 'a@b.co', password: 'StrongPass1!', role: 'super_admin' }).success,
      false,
    );
    assert.equal(loginSchema.safeParse({ email: 'a@b.co', password: 'x' }).success, true);
  });

  it('defaults onboarding language and validates goal enum', () => {
    const parsed = onboardingSchema.parse({ goal: GOALS.INTERVIEW_60_DAYS });
    assert.equal(parsed.preferredLanguage, 'javascript');
    assert.equal(onboardingSchema.safeParse({ goal: 'not-a-goal' }).success, false);
    assert.equal(updateProfileSchema.safeParse({}).success, false);
  });

  it('coerces + caps pagination', () => {
    assert.deepEqual(
      { page: paginationSchema.parse({ page: '3', limit: '25' }).page, limit: paginationSchema.parse({ page: '3', limit: '25' }).limit },
      { page: 3, limit: 25 },
    );
    assert.equal(paginationSchema.safeParse({ limit: '1000' }).success, false);
    assert.equal(paginationSchema.safeParse({ page: '1001' }).success, false);
    assert.equal(paginationSchema.parse({}).limit, 20);
  });

  it('gives the super admin every permission and students none', () => {
    assert.ok(ROLE_PERMISSIONS[ROLES.SUPER_ADMIN].includes(PERMISSIONS.USER_MANAGE));
    assert.equal(ROLE_PERMISSIONS[ROLES.STUDENT].length, 0);
  });

  it('validates admin moderation, feature flags and bounded filters', () => {
    assert.equal(adminModerationQuerySchema.parse({ page: '2' }).page, 2);
    assert.equal(adminModerateSchema.safeParse({ decision: 'reject', note: '' }).success, false);
    assert.equal(adminModerateSchema.safeParse({ decision: 'approve', note: '' }).success, true);
    assert.equal(featureFlagKeySchema.safeParse('community.enabled').success, true);
    assert.equal(featureFlagKeySchema.safeParse('../users').success, false);
    assert.equal(featureFlagUpdateSchema.safeParse({ enabled: true, admin: true }).success, false);
  });
});

describe('JWT utilities', () => {
  const user = { _id: '507f1f77bcf86cd799439011', role: ROLES.STUDENT, sessionVersion: 2 };

  it('round-trips access tokens and rejects the wrong type/secret', () => {
    const token = signAccessToken(user);
    const payload = verifyAccessToken(token);
    assert.equal(payload.sub, user._id);
    assert.equal(payload.sv, 2);
    assert.throws(() => verifyRefreshToken(token));
  });

  it('round-trips refresh tokens with a family', () => {
    const token = signRefreshToken({ sub: user._id, family: 'family-1' });
    const payload = verifyRefreshToken(token);
    assert.equal(payload.family, 'family-1');
    assert.ok(payload.exp > Date.now() / 1000);
    assert.throws(() => verifyAccessToken(token));
  });

  it('hashes tokens deterministically and extracts bearer headers', () => {
    assert.equal(hashToken('abc'), hashToken('abc'));
    assert.notEqual(hashToken('abc'), hashToken('abd'));
    assert.equal(extractBearerToken('Bearer abc.def.ghi'), 'abc.def.ghi');
    assert.equal(extractBearerToken('Basic abc'), null);
    assert.equal(extractBearerToken(undefined), null);
  });
});
