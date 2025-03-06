/**
 * Debug utilities
 */

/**
 * Print application state for debugging purposes
 * @param store Redux store
 */
export const debugState = (store: any) => {
  const state = store.getState();
  console.group('Application State Debug');
  console.log('Auth State:', {
    isAuthenticated: state.auth.isAuthenticated,
    checkingAuth: state.auth.checkingAuth,
    user: state.auth.user,
    error: state.auth.error
  });
  console.log('Token exists:', !!localStorage.getItem('fitness_planner_token'));
  
  // Check if API is reachable
  console.log('Testing API connection...');
  fetch('/api/health-check')
    .then(response => response.json())
    .then(data => console.log('API Health Check:', data))
    .catch(error => console.error('API Connection Error:', error));
  
  console.groupEnd();
};

/**
 * Manually reset authentication state
 */
export const resetAuth = () => {
  console.log('Manually resetting authentication state');
  localStorage.removeItem('fitness_planner_token');
  window.location.href = '/login';
};
