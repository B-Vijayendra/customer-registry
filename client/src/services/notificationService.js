import api from './api';

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}`),
  markAllRead: () => api.put('/notifications/all'),
};
