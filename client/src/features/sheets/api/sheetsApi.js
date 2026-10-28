import api from '../../../lib/apiClient.js';

/**
 * Thin, typed-by-contract wrapper around the shared apiClient. Every call goes
 * through `/api/v1` with the in-memory access token and the httpOnly refresh
 * cookie; no token or user id is ever passed from a component.
 */
export const sheetsApi = {
  list: (params) => api.get('/sheets', { query: params }),
  get: (id) => api.get(`/sheets/${id}`),
  create: (body) => api.post('/sheets', body),
  update: (id, body) => api.patch(`/sheets/${id}`, body),
  archive: (id) => api.delete(`/sheets/${id}`),
  restore: (id) => api.post(`/sheets/${id}/restore`, {}),
  revision: (id) => api.post(`/sheets/${id}/revision`, {}),
  submit: (id, changelog = '') => api.post(`/sheets/${id}/submit`, { changelog }),
  moderate: (id, body) => api.post(`/sheets/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/sheets/${id}/publish`, { changelog }),
  clone: (id) => api.post(`/sheets/${id}/clone`, {}),

  versions: (id) => api.get(`/sheets/${id}/versions`),
  version: (id, version) => api.get(`/sheets/${id}/versions/${version}`),

  parseLinks: (text) => api.post('/sheets/parse-links', { text }),
  addProblems: (id, problems) => api.post(`/sheets/${id}/problems`, { problems }),
  importProblems: (id, items) => api.post(`/sheets/${id}/problems/import`, { items }),
  updateProblem: (id, problemId, body) => api.patch(`/sheets/${id}/problems/${problemId}`, body),
  removeProblem: (id, problemId) => api.delete(`/sheets/${id}/problems/${problemId}`),
  reorderProblems: (id, orderedIds) => api.patch(`/sheets/${id}/problems/order`, { orderedIds }),

  ratings: (id, params) => api.get(`/sheets/${id}/ratings`, { query: params }),
  rate: (id, body) => api.put(`/sheets/${id}/rating`, body),
  unrate: (id) => api.delete(`/sheets/${id}/rating`),
  report: (id, body) => api.post(`/sheets/${id}/report`, body),
  reports: (params) => api.get('/sheets/reports', { query: params }),
  resolveReport: (reportId, body) => api.patch(`/sheets/reports/${reportId}`, body),
};

export default sheetsApi;
