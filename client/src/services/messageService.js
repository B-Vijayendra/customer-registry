import api from './api';

export const messageService = {
  send: (payload) => api.post('/messages', payload),
  getByComplaint: (complaintId) => api.get('/messages', { params: { complaintId } }),
};
