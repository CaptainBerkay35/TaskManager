import axios from 'axios';

const API_BASE_URL = 'https://localhost:44380/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - JWT Token ekle (EKLENEN KISIM!)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - 401 hatalarını yakala
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  getByTask: (taskId) => api.get(`/subtasks/task/${taskId}`),
  create: (subTask) => api.post('/subtasks', subTask),
  update: (id, subTask) => api.put(`/subtasks/${id}`, subTask),
  delete: (id) => api.delete(`/subtasks/${id}`),
  toggle: (id) => api.patch(`/subtasks/${id}/toggle`),
};

// Auth API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, email, password, fullName) => 
    api.post('/auth/register', { username, email, password, fullName }),
};

export default api;