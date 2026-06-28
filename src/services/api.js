import axios from 'axios';

// Create a configured instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-9rit.onrender.com/api',
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
  (error) => {
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
