import api from '../../../lib/apiClient.js';

/** Public moderated resource directory (/api/v1/resources). */
export const resourceApi = {
  list: (params) => api.get('/resources', { query: params }),
  saved: (params) => api.get('/resources/saved', { query: params }),
  get: (id) => api.get(`/resources/${id}`),
  create: (body) => api.post('/resources', body),
  update: (id, body) => api.patch(`/resources/${id}`, body),
  archive: (id) => api.delete(`/resources/${id}`),
  checkDuplicate: (url) => api.get('/resources/check-duplicate', { query: { url } }),

  submit: (id) => api.post(`/resources/${id}/submit`, {}),
  revision: (id) => api.post(`/resources/${id}/revision`, {}),
  restore: (id) => api.post(`/resources/${id}/restore`, {}),
  moderate: (id, body) => api.post(`/resources/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/resources/${id}/publish`, { changelog }),
  checkLink: (id) => api.post(`/resources/${id}/check-link`, {}),
  runLinkCheck: (params) => api.post('/resources/link-check/run', {}, { query: params }),

  save: (id) => api.put(`/resources/${id}/save`, {}),
  unsave: (id) => api.delete(`/resources/${id}/save`),
  rate: (id, body) => api.put(`/resources/${id}/rating`, body),
  ratings: (id, params) => api.get(`/resources/${id}/ratings`, { query: params }),
  feedback: (id, helpful) => api.put(`/resources/${id}/feedback`, { helpful }),
  report: (id, body) => api.post(`/resources/${id}/report`, body),
  event: (id, type) => api.post(`/resources/${id}/events`, { type }),

  reports: (params) => api.get('/resources/reports', { query: params }),
  resolveReport: (reportId, body) => api.patch(`/resources/reports/${reportId}`, body),
};

export default resourceApi;
