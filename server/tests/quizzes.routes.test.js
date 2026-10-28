import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const base = `/api/${env.API_VERSION}`;
const request = supertest(createApp());
const QUIZ = '/quizzes/507f1f77bcf86cd799439011';
const ATTEMPT = '/attempts/507f1f77bcf86cd799439012';

/** Authentication must run before validation so error details never leak. */
describe('Phase-3 route protection', () => {
  it('rejects anonymous access to every question-bank route', async () => {
    const endpoints = [
      ['get', '/question-bank'],
      ['post', '/question-bank'],
      ['post', '/question-bank/parse-import'],
      ['get', '/question-bank/507f1f77bcf86cd799439013'],
      ['patch', '/question-bank/507f1f77bcf86cd799439013'],
      ['delete', '/question-bank/507f1f77bcf86cd799439013'],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to quiz CRUD, lifecycle and question routes', async () => {
    const endpoints = [
      ['get', '/quizzes'], ['post', '/quizzes'],
      ['get', QUIZ], ['patch', QUIZ], ['delete', QUIZ],
      ['post', `${QUIZ}/submit`], ['post', `${QUIZ}/moderate`], ['post', `${QUIZ}/publish`],
      ['get', `${QUIZ}/versions`], ['get', `${QUIZ}/versions/1`],
      ['get', `${QUIZ}/questions`], ['post', `${QUIZ}/questions`],
      ['post', `${QUIZ}/questions/import`], ['patch', `${QUIZ}/questions/order`],
      ['get', `${QUIZ}/attempts`], ['post', `${QUIZ}/attempts`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
    }
  });

  it('rejects anonymous access to attempt state and results', async () => {
    const endpoints = [
      ['get', ATTEMPT], ['get', `${ATTEMPT}/questions`],
      ['patch', `${ATTEMPT}/answers`], ['post', `${ATTEMPT}/submit`],
      ['get', `${ATTEMPT}/result`], ['post', `${ATTEMPT}/abandon`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.data, null);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const res = await request.post(`${base}/quizzes`).send({ title: 'x', bogus: true });
    assert.equal(res.status, 401);
    assert.equal(res.body.errors, null);
    const importRes = await request.post(`${base}/question-bank/parse-import`)
      .send({ format: 'csv', text: 'javascript:alert(1)' });
    assert.equal(importRes.status, 401);
  });

  it('keeps the health probe public and every other mount private', async () => {
    const health = await request.get(`${base}/health`);
    assert.equal(health.status, 200);
    const sheets = await request.get(`${base}/sheets`);
    assert.equal(sheets.status, 401, 'Phase 2 protection is unchanged');
  });
});
