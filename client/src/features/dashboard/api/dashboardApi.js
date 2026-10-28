import api from '../../../lib/apiClient.js';

/** One aggregated read: today, streak, progress, weak topics, mock, revisions. */
export const dashboardApi = {
  get: (params = {}) => api.get('/dashboard', { query: params }),
};

export default dashboardApi;
