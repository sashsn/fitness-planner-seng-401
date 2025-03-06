import axios from 'axios';

// Only set up basic configuration without trying to access backend yet
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Simple interceptors that won't cause issues if backend is not available
axios.interceptors.request.use(
  (config) => {
    // Don't try to get tokens that might not exist yet
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Simplify response interceptor to avoid redirecting during development
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Just log errors for now without redirecting
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default axios;
