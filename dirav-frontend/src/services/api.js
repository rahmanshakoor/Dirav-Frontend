import axios from 'axios';
import { API_CONFIG } from '../constants/config';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage (in a real app, use secure storage like expo-secure-store)
let authToken = null;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authToken = null;
      // In a real app, redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

// Accounts API
export const accountsAPI = {
  list: () => api.get('/accounts'),
  create: (data) => api.post('/accounts', data),
  get: (id) => api.get(`/accounts/${id}`),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

// Transactions API
export const transactionsAPI = {
  list: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  get: (id) => api.get(`/transactions/${id}`),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Budgets API
export const budgetsAPI = {
  list: (params) => api.get('/budgets', { params }),
  create: (data) => api.post('/budgets', data),
  get: (id) => api.get(`/budgets/${id}`),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  getProgress: (id) => api.get(`/budgets/${id}/progress`),
};

// Savings Goals API
export const savingsAPI = {
  list: () => api.get('/savings'),
  create: (data) => api.post('/savings', data),
  get: (id) => api.get(`/savings/${id}`),
  update: (id, data) => api.put(`/savings/${id}`, data),
  delete: (id) => api.delete(`/savings/${id}`),
  contribute: (id, amount) => api.post(`/savings/${id}/contribute`, { amount }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
