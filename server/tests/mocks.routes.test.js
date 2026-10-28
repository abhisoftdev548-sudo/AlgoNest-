import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const base = `/api/${env.API_VERSION}`;
const request = supertest(createApp());
const MOCK = '/mocks/507f1f77bcf86cd799439011';
const SECTION = '507f1f77bcf86cd7994390b1';
const ATTEMPT = '/mock-attempts/507f1f77bcf86cd799439012';

describe('Phase-4 route protection', () => {
  it('rejects anonymous access to every mock test route', async () => {
    const endpoints = [
      ['get', '/mocks'], ['post', '/mocks'],
      ['get', MOCK], ['patch', MOCK], ['delete', MOCK],
      ['post', `${MOCK}/submit`], ['post', `${MOCK}/moderate`], ['post', `${MOCK}/publish`],
      ['post', `${MOCK}/revision`], ['post', `${MOCK}/restore`],
      ['get', `${MOCK}/versions`], ['get', `${MOCK}/versions/1`],
      ['get', `${MOCK}/sections/${SECTION}/questions`],
      ['put', `${MOCK}/sections/${SECTION}/questions`],
      ['get', `${MOCK}/attempts`], ['post', `${MOCK}/attempts`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to every mock-attempt route', async () => {
    const endpoints = [
      ['get', ATTEMPT], ['get', `${ATTEMPT}/questions`],
      ['patch', `${ATTEMPT}/answers`], ['post', `${ATTEMPT}/heartbeat`],
      ['post', `${ATTEMPT}/sections/${SECTION}/submit`],
      ['post', `${ATTEMPT}/submit`], ['get', `${ATTEMPT}/result`],
      ['put', `${ATTEMPT}/reasons`], ['post', `${ATTEMPT}/abandon`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.data, null);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const res = await request.post(`${base}/mocks`).send({ title: 'x', bogus: true });
    assert.equal(res.status, 401);
    assert.equal(res.body.errors, null);
    const autosave = await request.patch(`${base}${ATTEMPT}/answers`).send({ answers: [{ questionId: 'nope', response: 'x' }] });
    assert.equal(autosave.status, 401);
    assert.equal(autosave.body.errors, null);
  });

  it('keeps the health probe public and earlier phases unchanged', async () => {
    assert.equal((await request.get(`${base}/health`)).status, 200);
    assert.equal((await request.get(`${base}/quizzes`)).status, 401);
    assert.equal((await request.get(`${base}/sheets`)).status, 401);
  });
});
