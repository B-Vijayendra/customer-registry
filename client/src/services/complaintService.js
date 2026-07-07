import api from './api';

export const complaintService = {
  create: (formData) =>
    api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, payload) => api.put(`/complaints/${id}`, payload),
  remove: (id) => api.delete(`/complaints/${id}`),
};
