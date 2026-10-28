import api from '../../../lib/apiClient.js';

/** Per-user attempt state (/attempts). All rows are scoped by the access token. */
export const attemptApi = {
  get: (id) => api.get(`/attempts/${id}`),
  questions: (id, params = {}) => api.get(`/attempts/${id}/questions`, { query: params }),
  autosave: (id, answers) => api.patch(`/attempts/${id}/answers`, { answers }),
  submit: (id, answers = []) => api.post(`/attempts/${id}/submit`, { answers }),
  result: (id) => api.get(`/attempts/${id}/result`),
  abandon: (id) => api.post(`/attempts/${id}/abandon`, {}),
};

export default attemptApi;
