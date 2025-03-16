import axios from 'axios';

// Configure global axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.maxContentLength = 50 * 1024 * 1024; // Increase to 50MB
axios.defaults.maxBodyLength = 50 * 1024 * 1024; // Increase to 50MB
axios.defaults.timeout = 1800000; // 30 minutes
axios.defaults.withCredentials = true; // Add credentials if using cookies

// CRITICAL FIX: Add custom transformResponse to ensure proper parsing
axios.defaults.transformResponse = [
  function transformResponse(data) {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        return data;
      }
    }
    return data;
  }
];

// Simple interceptors that won't cause issues if backend is not available
axios.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 [${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    // CRITICAL FIX: Add timestamp to track response receipt
    const timestamp = new Date().toISOString();
    
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 [${timestamp}] Response from ${response.config.url}: Status ${response.status}`);
    }
    
    // Log successful large responses for debugging
    const size = JSON.stringify(response.data).length;
    if (size > 100000) { // Log if > 100KB
      console.log(`📦 [${timestamp}] Large response received (${size} bytes) from ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] Axios error:`, error.message);
    
    if (error.response) {
      console.error('Response error details:', {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response received:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
