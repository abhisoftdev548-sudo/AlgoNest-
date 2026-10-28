import api from '../../../lib/apiClient.js';

/** Thin wrappers around /api/v1/plans. All rows are scoped to the token user. */
export const planApi = {
  list: (params) => api.get('/plans', { query: params }),
  active: () => api.get('/plans/active'),
  content: () => api.get('/plans/content'),
  get: (id) => api.get(`/plans/${id}`),
  create: (body) => api.post('/plans', body),
  update: (id, body) => api.patch(`/plans/${id}`, body),
  archive: (id) => api.delete(`/plans/${id}`),
  regenerate: (id) => api.post(`/plans/${id}/regenerate`, {}),
  reschedule: (id, body = {}) => api.post(`/plans/${id}/reschedule`, body),
  tasks: (id, params) => api.get(`/plans/${id}/tasks`, { query: params }),
  taskStatus: (id, taskId, body) => api.patch(`/plans/${id}/tasks/${taskId}`, body),
  taskOrder: (id, body) => api.put(`/plans/${id}/tasks/order`, body),
};

export default planApi;
