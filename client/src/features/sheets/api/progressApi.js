import api from '../../../lib/apiClient.js';

/** Per-user state: progress + private resources. Always scoped by the session. */
export const progressApi = {
  list: (sheetId, params) => api.get(`/sheets/${sheetId}/progress`, { query: params }),
  update: (sheetId, problemId, body) => api.put(`/sheets/${sheetId}/progress/${problemId}`, body),

  resources: (params) => api.get('/personal-resources', { query: params }),
  createResource: (body) => api.post('/personal-resources', body),
  updateResource: (id, body) => api.patch(`/personal-resources/${id}`, body),
  deleteResource: (id) => api.delete(`/personal-resources/${id}`),
};

export default progressApi;
