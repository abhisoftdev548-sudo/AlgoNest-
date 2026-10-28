import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const base = `/api/${env.API_VERSION}`;
const request = supertest(createApp());
const ID = '507f1f77bcf86cd799439010';
const RESOURCE = `/resources/${ID}`;
const REPORT = '/resources/reports/507f1f77bcf86cd799439077';

describe('Phase-6 route protection', () => {
  it('rejects anonymous access to every resource route', async () => {
    const endpoints = [
      ['get', '/resources'], ['post', '/resources'],
      ['get', '/resources/check-duplicate?url=https%3A%2F%2Fexample.com'],
      ['get', '/resources/saved'], ['get', '/resources/reports'],
      ['patch', REPORT], ['post', '/resources/link-check/run'],
      ['get', RESOURCE], ['patch', RESOURCE], ['delete', RESOURCE],
      ['post', `${RESOURCE}/submit`], ['post', `${RESOURCE}/revision`],
      ['post', `${RESOURCE}/restore`], ['post', `${RESOURCE}/moderate`],
      ['post', `${RESOURCE}/publish`], ['post', `${RESOURCE}/check-link`],
      ['put', `${RESOURCE}/save`], ['delete', `${RESOURCE}/save`],
      ['put', `${RESOURCE}/rating`], ['get', `${RESOURCE}/ratings`],
      ['put', `${RESOURCE}/feedback`], ['post', `${RESOURCE}/report`],
      ['post', `${RESOURCE}/events`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.success, false);
      assert.deepEqual(Object.keys(res.body).sort(), ['data', 'errors', 'message', 'success']);
    }
  });

  it('rejects anonymous access to every creator route', async () => {
    const endpoints = [
      ['get', '/creators'], ['get', '/creators/me'], ['put', '/creators/me'],
      ['get', '/creators/me/analytics'], ['get', `/creators/${ID}`],
      ['get', `/creators/${ID}/analytics`],
    ];
    for (const [method, path] of endpoints) {
      const res = await request[method](`${base}${path}`).send({});
      assert.equal(res.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(res.body.data, null);
      assert.equal(res.body.errors, null);
    }
  });

  it('never leaks validation details before authentication', async () => {
    const create = await request.post(`${base}/resources`).send({ title: 'x', url: 'javascript:alert(1)', hacker: 1 });
    assert.equal(create.status, 401);
    assert.equal(create.body.errors, null);
    const rating = await request.put(`${base}${RESOURCE}/rating`).send({ rating: 99 });
    assert.equal(rating.status, 401);
    const duplicate = await request.get(`${base}/resources/check-duplicate?url=nope`);
    assert.equal(duplicate.status, 401);
    assert.equal(duplicate.body.errors, null);
  });

  it('keeps the health probe public and earlier phases protected', async () => {
    assert.equal((await request.get(`${base}/health`)).status, 200);
    for (const path of ['/plans', '/dashboard', '/mocks', '/quizzes', '/sheets']) {
      assert.equal((await request.get(`${base}${path}`)).status, 401, path);
    }
  });
});
