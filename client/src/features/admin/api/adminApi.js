import api from '../../../lib/apiClient.js';

const adminApi = {
  overview: () => api.get('/admin/overview'),
  moderation: (params) => api.get('/admin/moderation', { query: params }),
  moderate: (type, id, body) => api.post(`/admin/moderation/${type}/${id}`, body),
  users: (params) => api.get('/admin/users', { query: params }),
  setRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  setStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  verifyCreator: (id, verified) => api.patch(`/admin/users/${id}/creator-verification`, { verified }),
  reports: (params) => api.get('/admin/reports', { query: params }),
  resolveReport: (type, id, body) => api.patch(`/admin/reports/${type}/${id}`, body),
  audit: (params) => api.get('/admin/audit-logs', { query: params }),
  flags: (params) => api.get('/admin/feature-flags', { query: params }),
  updateFlag: (key, body) => api.put(`/admin/feature-flags/${encodeURIComponent(key)}`, body),
};

export default adminApi;
