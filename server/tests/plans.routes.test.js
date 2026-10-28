import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const base = `/api/${env.API_VERSION}`;
const request = supertest(createApp());
const PLAN = '/plans/507f1f77bcf86cd799439010';
const TASK = `${PLAN}/tasks/507f1f77bcf86cd799439020`;

describe('Phase-5 route protection', () => {
  it('rejects anonymous access to every plan route', async () => {
    const endpoints = [
      ['get', '/plans'], ['post', '/plans'], ['get', '/plans/active'], ['get', '/plans/content'],
      ['get', PLAN], ['patch', PLAN], ['delete', PLAN],
      ['post', `${PLAN}/regenerate`], ['post', `${PLAN}/reschedule`],
      ['get', `${PLAN}/tasks`], ['put', `${PLAN}/tasks/order`], ['patch', TASK],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to the dashboard and never leaks user data', async () => {
    const res = await request.get(`${base}/dashboard?date=2026-11-09`);
    assert.equal(res.status, 401);
    assert.equal(res.body.data, null);
    assert.equal(res.body.errors, null);
  });

  it('never returns validation details before authentication', async () => {
    const create = await request.post(`${base}/plans`).send({ title: 'x', bogus: true });
    assert.equal(create.status, 401);
    assert.equal(create.body.errors, null);
    const status = await request.patch(`${base}${TASK}`).send({ status: 'invalid' });
    assert.equal(status.status, 401);
    const dashboard = await request.get(`${base}/dashboard?date=not-a-date`);
    assert.equal(dashboard.status, 401);
    assert.equal(dashboard.body.errors, null);
  });

  it('keeps the health probe public and earlier phases protected', async () => {
    assert.equal((await request.get(`${base}/health`)).status, 200);
    assert.equal((await request.get(`${base}/mocks`)).status, 401);
    assert.equal((await request.get(`${base}/quizzes`)).status, 401);
    assert.equal((await request.get(`${base}/sheets`)).status, 401);
  });
});
