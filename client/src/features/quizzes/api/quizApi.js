import api from '../../../lib/apiClient.js';

/** Thin wrappers around /api/v1/quizzes. No token or user id is ever passed. */
export const quizApi = {
  list: (params) => api.get('/quizzes', { query: params }),
  get: (id) => api.get(`/quizzes/${id}`),
  create: (body) => api.post('/quizzes', body),
  update: (id, body) => api.patch(`/quizzes/${id}`, body),
  archive: (id) => api.delete(`/quizzes/${id}`),
  restore: (id) => api.post(`/quizzes/${id}/restore`, {}),
  revision: (id) => api.post(`/quizzes/${id}/revision`, {}),
  submit: (id, changelog = '') => api.post(`/quizzes/${id}/submit`, { changelog }),
  moderate: (id, body) => api.post(`/quizzes/${id}/moderate`, body),
  publish: (id, changelog = '') => api.post(`/quizzes/${id}/publish`, { changelog }),

  versions: (id) => api.get(`/quizzes/${id}/versions`),
  version: (id, version) => api.get(`/quizzes/${id}/versions/${version}`),

  questions: (id, params) => api.get(`/quizzes/${id}/questions`, { query: params }),
  linkQuestions: (id, questionIds) => api.post(`/quizzes/${id}/questions`, { questionIds }),
  importQuestions: (id, items, source = 'json') => api.post(`/quizzes/${id}/questions/import`, { items, source }),
  reorderQuestions: (id, orderedIds) => api.patch(`/quizzes/${id}/questions/order`, { orderedIds }),
  unlinkQuestion: (id, questionId) => api.delete(`/quizzes/${id}/questions/${questionId}`),

  attempts: (id, params) => api.get(`/quizzes/${id}/attempts`, { query: params }),
  startAttempt: (id, body = {}) => api.post(`/quizzes/${id}/attempts`, body),
};

export default quizApi;
