import axios, { AxiosError } from 'axios';
import { getToken, clearTokens } from '../utils/auth';

// Use the environment variable for the API URL, or fall back to the proxy
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define a type for API error responses
interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Token expired or invalid
      clearTokens();
      // Don't redirect during authentication check
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Format error for consistent handling
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unknown error occurred';
      
    return Promise.reject(errorMessage);
  }
);

export default api;
