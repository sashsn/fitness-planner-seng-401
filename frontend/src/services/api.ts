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

/**
 * Helper functions for API data formatting
 */
export const formatters = {
  /**
   * Format date object to ISO string date (YYYY-MM-DD)
   */
  formatDate: (date: Date | null | undefined): string | undefined => {
    if (!date) return undefined;
    return date instanceof Date ? date.toISOString().split('T')[0] : undefined;
  },
  
  /**
   * Ensure value is a number if provided
   */
  ensureNumber: (value: string | number | undefined | null): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    return typeof value === 'string' ? Number(value) : value;
  }
};

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
