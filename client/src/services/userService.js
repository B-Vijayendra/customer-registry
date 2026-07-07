import api from './api';

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  createUser: (payload) => api.post('/users', payload),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getAnalytics: () => api.get('/users/analytics'),
  getCustomers: (params) => api.get('/customers', { params }),
  getAgents: () => api.get('/agents'),
  updateAgent: (id, payload) => api.put(`/agents/${id}`, payload),
  getCategories: () => api.get('/categories'),
  createCategory: (payload) => api.post('/categories', payload),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};
