import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const base = `/api/${env.API_VERSION}`;
const request = supertest(createApp());

/** Auth-before-validation is a security invariant, not just a status code. */
describe('Phase-2 route protection', () => {
  it('rejects anonymous access to every sheets sub-route', async () => {
    const endpoints = [
      ['get', '/sheets'], ['post', '/sheets'], ['get', '/sheets/507f1f77bcf86cd799439011'],
      ['post', '/sheets/parse-links'], ['get', '/sheets/reports'],
      ['patch', '/sheets/507f1f77bcf86cd799439011/problems/order'],
      ['put', '/sheets/507f1f77bcf86cd799439011/progress/507f1f77bcf86cd799439012'],
      ['get', '/personal-resources'], ['post', '/personal-resources'],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path} should require a token`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const res = await request.post(`${base}/sheets`).send({ title: 'x', bogus: true });
    assert.equal(res.status, 401);
    assert.equal(res.body.errors, null);
  });

  it('keeps the health probe public', async () => {
    const res = await request.get(`${base}/health`);
    assert.equal(res.status, 200);
  });
});
