import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Try to get token from different possible keys
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const userToken = typeof window !== 'undefined' ? localStorage.getItem('banaya-token') : null;
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set Content-Type to application/json for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('banaya-token');
        localStorage.removeItem('banaya-user');
        // Redirect based on current path
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const buildImageUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  const trimmed = path.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // Use backend server URL for images
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const baseUrl = backendUrl.replace('/api', ''); // Remove /api from the end
  
  if (trimmed.startsWith('/')) {
    return `${baseUrl}${trimmed}`;
  }
  return `${baseUrl}/${trimmed}`;
};

export default api;
