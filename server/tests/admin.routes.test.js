import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import supertest from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/algonest_test';

const { createApp } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const request = supertest(createApp());
const { User } = await import('../src/models/User.js');
const { signAccessToken } = await import('../src/utils/tokens.js');
const base = `/api/${env.API_VERSION}/admin`;

describe('Phase-7 admin API protection', () => {
  it('requires authentication before validation or revealing admin data', async () => {
    const endpoints = [
      ['get', '/overview'], ['get', '/moderation?page=nope'], ['post', '/moderation/sheet/not-an-id'],
      ['get', '/users'], ['patch', '/users/not-an-id/role'], ['patch', '/users/not-an-id/status'],
      ['patch', '/users/not-an-id/creator-verification'], ['get', '/reports'],
      ['patch', '/reports/sheet/not-an-id'], ['get', '/audit-logs'],
      ['get', '/feature-flags'], ['put', '/feature-flags/invalid key'],
    ];
    for (const [method, path] of endpoints) {
      const response = await request[method](`${base}${path}`).send({ unexpected: true });
      assert.equal(response.status, 401, `${method.toUpperCase()} ${path}`);
      assert.equal(response.body.success, false);
      assert.equal(response.body.data, null);
      assert.equal(response.body.errors, null);
    }
  });

  it('enforces role permissions after authentication', async () => {
    const originalFindById = User.findById;
    let role = 'student';
    User.findById = async (id) => ({ _id: id, role, status: 'active', sessionVersion: 0 });
    const tokenForRole = (value) => signAccessToken({ _id: '507f1f77bcf86cd799439011', role: value, sessionVersion: 0 });
    try {
      const student = await request.get(`${base}/overview`).set('Authorization', `Bearer ${tokenForRole('student')}`);
      assert.equal(student.status, 403);
      assert.equal(student.body.success, false);

      role = 'support_analyst';
      const analystFlags = await request.get(`${base}/feature-flags`).set('Authorization', `Bearer ${tokenForRole(role)}`);
      assert.equal(analystFlags.status, 403);

      const analystModeration = await request.get(`${base}/moderation`).set('Authorization', `Bearer ${tokenForRole(role)}`);
      assert.equal(analystModeration.status, 403);

      role = 'content_editor';
      const editorUsers = await request.get(`${base}/users`).set('Authorization', `Bearer ${tokenForRole(role)}`);
      assert.equal(editorUsers.status, 403);
    } finally {
      User.findById = originalFindById;
    }
  });

  it('preserves the standard public health endpoint', async () => {
    const response = await request.get(`/api/${env.API_VERSION}/health`);
    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });
});
