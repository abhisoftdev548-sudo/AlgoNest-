import api from '../../../lib/apiClient.js';

/** Thin wrappers around /api/v1/mocks. No user id or clock is ever sent. */
export const mockApi = {
  list: (params) => api.get('/mocks', { query: params }),
  get: (id) => api.get(`/mocks/${id}`),
  create: (body) => api.post('/mocks', body),
  update: (id, body) => api.patch(`/mocks/${id}`, body),
  archive: (id) => api.delete(`/mocks/${id}`),
  restore: (id) => api.post(`/mocks/${id}/restore`, {}),
  revision: (id) => api.post(`/mocks/${id}/revision`, {}),
  submit: (id, changelog = '') => api.post(`/mocks/${id}/submit`, { changelog }),
  moderate: (id, body) => api.post(`/mocks/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/mocks/${id}/publish`, { changelog }),

  versions: (id) => api.get(`/mocks/${id}/versions`),
  version: (id, version) => api.get(`/mocks/${id}/versions/${version}`),

  sectionQuestions: (id, sectionId, params) => api.get(`/mocks/${id}/sections/${sectionId}/questions`, { query: params }),
  setSectionQuestions: (id, sectionId, questionIds) => api.put(`/mocks/${id}/sections/${sectionId}/questions`, { questionIds }),

  attempts: (id, params) => api.get(`/mocks/${id}/attempts`, { query: params }),
  startAttempt: (id) => api.post(`/mocks/${id}/attempts`, {}),
};

export default mockApi;
