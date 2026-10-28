import api from '../../../lib/apiClient.js';

/** Reusable question bank (/question-bank). */
export const questionApi = {
  list: (params) => api.get('/question-bank', { query: params }),
  get: (id) => api.get(`/question-bank/${id}`),
  create: (body) => api.post('/question-bank', body),
  update: (id, body) => api.patch(`/question-bank/${id}`, body),
  remove: (id) => api.delete(`/question-bank/${id}`),
  /** Pure server-side preview: validates and normalises pasted JSON/CSV. */
  parseImport: (format, text) => api.post('/question-bank/parse-import', { format, text }),
};

export default questionApi;
