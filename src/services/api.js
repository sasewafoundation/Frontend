import axios from 'axios';

const PRODUCTION_API = 'https://backend-9rit.onrender.com/api';

// Create a configured instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || PRODUCTION_API,
});

// Request Interceptor: Attach JWT token if it exists (for Admin routes)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If local dev server (e.g. port 5000) is offline/unreachable, gracefully fall back to production API
    if (
      originalRequest &&
      !originalRequest._fallbackAttempted &&
      (!error.response || error.code === 'ERR_NETWORK') &&
      typeof originalRequest.baseURL === 'string' &&
      originalRequest.baseURL.includes('localhost:5000')
    ) {
      originalRequest._fallbackAttempted = true;
      originalRequest.baseURL = PRODUCTION_API;
      return axios(originalRequest);
    }

    const status = error.response?.status;
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization || error.config?.headers?.authorization);

    if (status === 401 && hadAuthHeader && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      sessionStorage.setItem('adminSessionMessage', 'Your admin session expired or became invalid. Please sign in again.');

      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.replace('/admin/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
