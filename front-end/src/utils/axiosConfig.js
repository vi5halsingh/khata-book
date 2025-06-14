import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('authToken');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      delete axios.defaults.headers.common['Authorization'];
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 