import api from './api';
import { setToken, removeToken, getToken } from '../utils/auth';
import { formatISO } from 'date-fns';

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
  dateOfBirth?: string | Date | null;
  height?: number;
  weight?: number;
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

/**
 * Login user with email and password
 * @param credentials User credentials
 * @returns Promise with user data and token
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param userData User registration data
 * @returns Promise with user data and token
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    // Validate required fields on the client side
    if (!userData.username) {
      throw new Error('Username is required');
    }
    
    if (!userData.email) {
      throw new Error('Email is required');
    }
    
    if (!userData.password) {
      throw new Error('Password is required');
    }
    
    // Log the data being sent (exclude password for security)
    console.log('Sending registration data:', { 
      ...userData, 
      password: '[REDACTED]',
      hasUsername: !!userData.username
    });
    
    // Format date if it's a Date object
    const formattedData = {
      ...userData,
      dateOfBirth: userData.dateOfBirth instanceof Date 
        ? formatISO(userData.dateOfBirth) 
        : userData.dateOfBirth
    };
    
    const response = await api.post<AuthResponse>('/users/register', formattedData);
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get current user profile
 * @returns Promise with user data or null if not authenticated
 */
export const getCurrentUser = async () => {
  // First check if we even have a token
  const token = getToken();
  if (!token) {
    // If no token, don't make an API call
    console.log('No token available, skipping profile fetch');
    return null;
  }
  
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // For auth checking, don't throw - treat failed auth check as "not authenticated"
    removeToken(); // Clear invalid token
    return null;
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeToken();
};
