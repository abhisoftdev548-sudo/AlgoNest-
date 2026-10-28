import { api, refreshSession } from '../../../lib/apiClient.js';

// A single cached boot promise prevents React StrictMode's double effect from
// firing two refreshes (the second would look like refresh-token reuse).
let bootstrapPromise = null;

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout', {}),
  logoutAll: () => api.post('/auth/logout-all', {}),
  me: () => api.get('/auth/me'),
  refresh: () => refreshSession(),
  updateGoal: (payload) => api.patch('/users/me/goal', payload),
  updateProfile: (payload) => api.patch('/users/me', payload),

  bootstrap: () => {
    if (!bootstrapPromise) bootstrapPromise = refreshSession();
    return bootstrapPromise;
  },
  resetBootstrap: () => {
    bootstrapPromise = null;
  },
};

export default authApi;
