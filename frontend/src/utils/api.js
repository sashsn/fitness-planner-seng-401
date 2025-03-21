import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',  // Using proxy from package.json
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Authentication API methods
const authAPI = {
  register: async (userData) => {
    try {
      // Log request data for debugging (without sensitive info)
      console.log('Registration request payload:', {
        ...userData,
        password: '[REDACTED]'
      });
      
      // Make the request
      const response = await api.post('/users/register', userData);
      
      // Log successful response
      console.log('Registration success:', response.data);
      
      // Handle token storage
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      // Improved error logging with full details
      console.error('Registration error details:', error);
      
      // Handle different error types
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },
  
  login: async (credentials) => {
    try {
      // Log detailed login request info
      console.log('Login attempt for:', credentials.email);
      
      // Explicitly set content type and make direct request
      const response = await axios({
        method: 'post',
        url: '/api/users/login',
        data: credentials,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Login response received:', response.status);
      
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        console.log('Token stored in localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Login failed. Please try again.';


      // More detailed error logging
      if (error.response) {
        console.error('Response error status:', error.response.status);
        console.error('Response error data:', error.response.data);
      } else if (error.request) {
        console.error('Request made but no response received');
      } else {
        console.error('Error message:', error.message);
      }
      
      throw new Error(errorMessage);

    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/users/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Add interceptors for token handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Ensure token is retrieved
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api, authAPI };
