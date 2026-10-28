import assert from 'node:assert/strict';
import { afterEach, before, describe, it } from 'node:test';
import bcrypt from 'bcryptjs';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { User } = await import('../src/models/User.js');
const { RefreshSession } = await import('../src/models/RefreshSession.js');
const service = await import('../src/modules/auth/auth.service.js');
const { verifyAccessToken, verifyRefreshToken, hashToken } = await import('../src/utils/tokens.js');

const ctx = { ip: '127.0.0.1', userAgent: 'node:test' };
const PASSWORD = 'StrongPass1!';
let passwordHash;
let stubs = [];

function stub(target, key, implementation) {
  stubs.push([target, key, target[key]]);
  target[key] = implementation;
}

const makeUser = (overrides = {}) =>
  new User({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash,
    role: 'student',
    ...overrides,
  });

before(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 4);
});

afterEach(() => {
  for (const [target, key, original] of stubs.reverse()) target[key] = original;
  stubs = [];
});

describe('auth.service — register', () => {
  it('rejects a duplicate email with a 409', async () => {
    stub(User, 'exists', async () => true);
    await assert.rejects(
      () => service.register({ name: 'Ada Lovelace', email: 'ada@example.com', password: PASSWORD }, ctx),
      (error) => error.statusCode === 409,
    );
  });

  it('always creates a student and returns a verifiable token pair', async () => {
    let createdSession = null;
    stub(User, 'exists', async () => false);
    stub(User, 'create', async (doc) => new User(doc));
    stub(RefreshSession, 'create', async (doc) => {
      createdSession = doc;
      return doc;
    });

    const result = await service.register(
      { name: 'Ada Lovelace', email: 'ADA@example.com', password: PASSWORD, role: 'super_admin' },
      ctx,
    );

    assert.equal(result.user.role, 'student');
    assert.equal(result.user.email, 'ada@example.com');
    assert.equal(result.user.passwordHash, undefined, 'password hash must never be serialised');
    assert.equal(verifyAccessToken(result.accessToken).sub, result.user.id);
    assert.equal(verifyRefreshToken(result.refreshToken).type, 'refresh');
    assert.equal(createdSession.tokenHash, hashToken(result.refreshToken));
  });
});

describe('auth.service — login', () => {
  it('uses a generic error and counts failed attempts', async () => {
    const user = makeUser();
    stub(User, 'findByEmailWithSecrets', async () => user);
    stub(User.prototype, 'save', async function save() { return this; });

    await assert.rejects(
      () => service.login({ email: 'ada@example.com', password: 'WrongPass1!' }, ctx),
      (error) => error.statusCode === 401 && error.message === 'Invalid email or password',
    );
    assert.equal(user.failedLoginAttempts, 1);
  });

  it('resets lockout state, starts a streak and issues tokens on success', async () => {
    const user = makeUser({ failedLoginAttempts: 3, lockUntil: new Date(Date.now() - 1000) });
    stub(User, 'findByEmailWithSecrets', async () => user);
    stub(User.prototype, 'save', async function save() { return this; });
    stub(RefreshSession, 'create', async (doc) => doc);

    const result = await service.login({ email: 'ada@example.com', password: PASSWORD }, ctx);

    assert.equal(result.user.streak.current, 1);
    assert.equal(user.failedLoginAttempts, 0);
    assert.equal(user.lockUntil, null);
    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
  });

  it('refuses a locked account before checking the password', async () => {
    const user = makeUser({ lockUntil: new Date(Date.now() + 60_000) });
    stub(User, 'findByEmailWithSecrets', async () => user);
    await assert.rejects(
      () => service.login({ email: 'ada@example.com', password: PASSWORD }, ctx),
      (error) => error.statusCode === 429,
    );
  });
});

describe('auth.service — refresh rotation', () => {
  it('rotates a valid session atomically into the same family', async () => {
    const user = makeUser();
    const seed = await (async () => {
      let captured = null;
      stub(User, 'exists', async () => false);
      stub(User, 'create', async (doc) => new User(doc));
      stub(RefreshSession, 'create', async (doc) => {
        captured = doc;
        return doc;
      });
      const result = await service.register({ name: 'Ada', email: 'ada@example.com', password: PASSWORD }, ctx);
      return { refreshToken: result.refreshToken, session: captured, user };
    })();

    let created = null;
    stub(RefreshSession, 'findOneAndUpdate', async () => ({ user: seed.user._id, family: seed.session.family }));
    stub(RefreshSession, 'create', async (doc) => {
      created = doc;
      return doc;
    });
    stub(User, 'findById', async () => seed.user);

    const rotated = await service.rotateRefreshSession(seed.refreshToken, ctx);
    assert.equal(created.family, seed.session.family, 'rotation must stay in the same token family');
    assert.notEqual(created.tokenHash, seed.session.tokenHash);
    assert.equal(verifyAccessToken(rotated.accessToken).sub, String(seed.user._id));
  });

  it('revokes the whole family when a rotated token is replayed', async () => {
    const user = makeUser();
    let captured = null;
    stub(User, 'exists', async () => false);
    stub(User, 'create', async (doc) => new User(doc));
    stub(RefreshSession, 'create', async (doc) => {
      captured = doc;
      return doc;
    });
    const { refreshToken } = await service.register({ name: 'Ada', email: 'ada@example.com', password: PASSWORD }, ctx);

    let revokedFilter = null;
    stub(RefreshSession, 'findOneAndUpdate', async () => null);
    stub(RefreshSession, 'findOne', async () => ({ family: captured.family }));
    stub(RefreshSession, 'updateMany', async (filter) => {
      revokedFilter = filter;
      return { modifiedCount: 2 };
    });

    await assert.rejects(
      () => service.rotateRefreshSession(refreshToken, ctx),
      (error) => error.statusCode === 401 && error.code === 'REFRESH_REUSE',
    );
    assert.equal(revokedFilter.family, captured.family);
    assert.equal(revokedFilter.revokedAt, null);
  });
});

describe('auth.service — logout everywhere', () => {
  it('revokes sessions and bumps the session version', async () => {
    let filter = null;
    let update = null;
    stub(RefreshSession, 'updateMany', async (arg) => {
      filter = arg;
      return {};
    });
    stub(User, 'updateOne', async (_filter, arg) => {
      update = arg;
      return {};
    });

    await service.logoutAll('507f1f77bcf86cd799439011');
    assert.ok(filter.user);
    assert.deepEqual(update, { $inc: { sessionVersion: 1 } });
  });
});
