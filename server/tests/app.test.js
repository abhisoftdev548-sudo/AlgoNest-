import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import supertest from 'supertest';

// Must be set before importing anything that reads config.
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');

const base = `/api/${env.API_VERSION}`;

describe('API envelope + security middleware', () => {
  let request;

  before(() => {
    request = supertest(createApp());
  });

  after(() => {});

  it('serves a public health probe with the standard envelope', async () => {
    const res = await request.get(`${base}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'ok');
    assert.ok(res.headers['x-request-id']);
    assert.ok(res.headers['x-content-type-options']);
  });

  it('returns 422 with field-level errors for an invalid registration', async () => {
    const res = await request.post(`${base}/auth/register`).send({ name: 'x', email: 'nope', password: 'weak' });
    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes('email'));
    assert.ok(fields.includes('password'));
    assert.ok(fields.includes('name'));
  });

  it('strips unknown keys from a validated body (mass-assignment protection)', async () => {
    // A crafted role must be rejected by .strict() rather than silently used.
    const res = await request.post(`${base}/auth/register`).send({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'StrongPass1!',
      role: 'super_admin',
    });
    assert.equal(res.status, 422);
    assert.ok(res.body.errors.some((e) => e.field === '_' || e.message.includes('Unrecognized')));
  });

  it('blocks protected routes without an access token', async () => {
    const me = await request.get(`${base}/auth/me`);
    const users = await request.get(`${base}/users`);
    assert.equal(me.status, 401);
    assert.equal(users.status, 401);
    assert.equal(me.body.success, false);
  });

  it('rejects an invalid bearer token', async () => {
    const res = await request.get(`${base}/auth/me`).set('Authorization', 'Bearer not-a-jwt');
    assert.equal(res.status, 401);
  });

  it('requires a refresh cookie', async () => {
    const res = await request.post(`${base}/auth/refresh`).send({});
    assert.equal(res.status, 401);
  });

  it('returns a consistent 404 for unknown routes', async () => {
    const res = await request.get(`${base}/does-not-exist`);
    assert.equal(res.status, 404);
    assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    assert.equal(res.body.success, false);
  });

  it('rejects malformed JSON with a 400 envelope', async () => {
    const res = await request
      .post(`${base}/auth/login`)
      .set('Content-Type', 'application/json')
      .send('{"email":');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  it('rejects disallowed CORS origins', async () => {
    const res = await request.get(`${base}/health`).set('Origin', 'https://evil.example');
    assert.equal(res.status, 403);
  });
});
