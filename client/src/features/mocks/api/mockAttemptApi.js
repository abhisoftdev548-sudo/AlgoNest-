import api from '../../../lib/apiClient.js';

/** Per-user mock attempt state (/mock-attempts). All deadlines come from the server. */
export const mockAttemptApi = {
  get: (id) => api.get(`/mock-attempts/${id}`),
  // `sectionKey` is a React Query cache-buster only — never sent to the API.
  questions: (id, params = {}) => {
    const query = { ...params };
    delete query.sectionKey;
    return api.get(`/mock-attempts/${id}/questions`, { query });
  },
  autosave: (id, body) => api.patch(`/mock-attempts/${id}/answers`, body),
  heartbeat: (id, activeQuestionId) => api.post(`/mock-attempts/${id}/heartbeat`, { activeQuestionId }),
  submitSection: (id, sectionId, body) => api.post(`/mock-attempts/${id}/sections/${sectionId}/submit`, body),
  submit: (id, body = {}) => api.post(`/mock-attempts/${id}/submit`, body),
  result: (id) => api.get(`/mock-attempts/${id}/result`),
  reasons: (id, reasons) => api.put(`/mock-attempts/${id}/reasons`, { reasons }),
  abandon: (id) => api.post(`/mock-attempts/${id}/abandon`, {}),
};

export default mockAttemptApi;
