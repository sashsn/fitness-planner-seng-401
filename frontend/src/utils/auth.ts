/**
 * Authentication utilities
 */

// Token key in local storage
const TOKEN_KEY = 'fitness_planner_token';

/**
 * Store JWT token in local storage
 * @param token JWT token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get JWT token from local storage
 * @returns JWT token or null
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Clear all auth-related data
 */
export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('user');
};

/**
 * Check if JWT token exists and is valid
 * @returns Boolean indicating if token exists
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // Very basic validation by checking if token is a non-empty string
  return token.length > 0;
};
