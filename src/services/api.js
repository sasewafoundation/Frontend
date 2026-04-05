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

export default api;
