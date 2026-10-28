import api from '../../../lib/apiClient.js';

/** Public creator profiles + analytics (/api/v1/creators). */
export const creatorApi = {
  list: (params) => api.get('/creators', { query: params }),
  me: () => api.get('/creators/me'),
  updateMe: (body) => api.put('/creators/me', body),
  get: (id, params) => api.get(`/creators/${id}`, { query: params }),
  myAnalytics: (params) => api.get('/creators/me/analytics', { query: params }),
  analytics: (id, params) => api.get(`/creators/${id}/analytics`, { query: params }),
};

export default creatorApi;
