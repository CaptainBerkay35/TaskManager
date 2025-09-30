import axios from 'axios';

const API_BASE_URL = 'https://localhost:44380/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tasks API
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (task) => api.post('/tasks', task),
  update: (id, task) => api.put(`/tasks/${id}`, task),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

// SubTasks API
export const subTasksAPI = {
  getByTask: (taskId) => api.get(`/subtasks/ByTask/${taskId}`),
  create: (subTask) => api.post('/subtasks', subTask),
  update: (id, subTask) => api.put(`/subtasks/${id}`, subTask),
  delete: (id) => api.delete(`/subtasks/${id}`),
};

export default api;