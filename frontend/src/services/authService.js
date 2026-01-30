import axios from 'axios';
import { demoService, isDemoMode } from './demoService';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => {
    if (isDemoMode()) {
      return demoService.login(credentials);
    }
    return api.post('/auth/login', credentials);
  },

  logout: () => {
    if (isDemoMode()) {
      return Promise.resolve({ data: { message: 'Logged out successfully' } });
    }
    return api.post('/auth/logout');
  },

  getCurrentUser: () => {
    if (isDemoMode()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return Promise.resolve({ data: user });
    }
    return api.get('/auth/me');
  },

  setAuthToken: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
};

export default api;