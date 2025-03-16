import axios from 'axios';

// Local storage keys
const TOKEN_KEY = 'fitness_planner_token';
const USER_KEY = 'fitness_planner_user';

// Types
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
  height?: number | string;
  weight?: number | string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/**
 * Login user
 * @param credentials User credentials
 * @returns User data and token
 */
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    
    if (response.data && response.data.token) {
      // Store token and user data
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      
      // Set Authorization header for future requests
      setAuthHeader(response.data.token);
      
      return {
        user: response.data.user,
        token: response.data.token
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

/**
 * Register new user
 * @param data Registration data
 * @returns User data and token
 */
export const register = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  try {
    // Format dateOfBirth if it's a Date object
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth instanceof Date 
        ? data.dateOfBirth.toISOString().split('T')[0] 
        : data.dateOfBirth,
      // Ensure height and weight are sent as numbers if they exist
      height: data.height ? Number(data.height) : undefined,
      weight: data.weight ? Number(data.weight) : undefined
    };
    
    const response = await axios.post('/api/auth/register', formattedData);
    
    if (response.data && response.data.token) {
      // Store token and user data
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      
      // Set Authorization header for future requests
      setAuthHeader(response.data.token);
      
      return {
        user: response.data.user,
        token: response.data.token
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Registration failed');
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  // Remove token and user data
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Remove Authorization header
  removeAuthHeader();
};

/**
 * Set auth token in axios defaults
 * @param token JWT token
 */
export const setAuthHeader = (token: string): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

/**
 * Remove auth token from axios defaults
 */
export const removeAuthHeader = (): void => {
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * Get current auth token
 * @returns JWT token or null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get current user
 * @returns User object or null
 */
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if user is authenticated
 * @returns True if authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  
  // Simple check - presence of token
  // For production, you might want to check token expiration as well
  return !!token;
};

/**
 * Initialize authentication state from localStorage
 */
export const initAuth = (): void => {
  const token = getAuthToken();
  if (token) {
    setAuthHeader(token);
  }
};

/**
 * Check if current authentication is valid
 * @returns User data if authenticated, null otherwise
 */
export const checkAuth = async (): Promise<User | null> => {
  try {
    // Get the token from localStorage
    const token = getAuthToken();
    
    // If no token exists, user is not authenticated
    if (!token) {
      return null;
    }
    
    // Set the auth header with the current token
    setAuthHeader(token);
    
    // Make a request to verify the token and get user data
    const response = await axios.get('/api/auth/me');
    
    // If we get a successful response, return the user data
    if (response.data && response.data.user) {
      return response.data.user;
    }
    
    // If we get here, we have a token but couldn't get user data
    // This means the token might be invalid or expired
    return null;
  } catch (error) {
    // In case of error (e.g., invalid token), clear auth data
    logout();
    return null;
  }
};

// Initialize auth on import
initAuth();
