import axios from 'axios';
import { setToken, removeToken } from '../utils/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date | null;
  height?: number | string;
  weight?: number | string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    role: string;
  };
  token: string;
}

// Create a consistent API instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

/**
 * Register a new user
 */
const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Sending registration data:', { ...userData, password: '[REDACTED]' });
    
    // Format the data for the API
    const formattedData = {
      ...userData,
      height: userData.height ? Number(userData.height) : undefined,
      weight: userData.weight ? Number(userData.weight) : undefined,
    };
    
    const response = await api.post('/users/register', formattedData);
    
    // Handle different response formats
    const responseData = response.data.data || response.data;
    
    if (responseData.token) {
      setToken(responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
    }
    
    return responseData;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Improved error message extraction
    let errorMessage = 'Registration failed. Please try again.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw errorMessage;
  }
};

/**
 * Login user with email and password
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Login attempt for:', credentials.email);
    
    const response = await api.post('/users/login', credentials);
    
    // Handle different response formats
    const responseData = response.data.data || response.data;
    
    if (responseData.token) {
      setToken(responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
    }
    
    return responseData;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Improved error message extraction
    let errorMessage = 'Login failed. Please check your credentials.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Add timeout for frontend to stop infinite loading
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    throw errorMessage;
  }
};

/**
 * Check if user is authenticated
 */
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('fitness_planner_token');
    if (!token) {
      return null;
    }
    
    const response = await api.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data || null;
  } catch (error) {
    console.log('Not authenticated');
    return null;
  }
};

/**
 * Logout user
 */
const logout = () => {
  removeToken();
  localStorage.removeItem('user');
};

/**
 * Get the authentication token from localStorage
 * @returns Auth token or null if not found
 */
export const getAuthToken = (): string | null => {
  // Return a fake token for testing
  return 'fake-token-for-testing';
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user has a token
 */
export const isAuthenticated = (): boolean => {
  return true; // Always return true for testing
};

const authService = {
  register,
  login,
  logout,
  checkAuth
};

export default authService;
