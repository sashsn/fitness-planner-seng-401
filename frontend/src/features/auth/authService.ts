import api from '../../services/api';

// Register user
const register = async (userData: any) => {
  try {
    console.log("Sending registration data:", { ...userData, password: '[REDACTED]' });
    const response = await api.post('/users/register', userData);
    
    if (response.data && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    } else if (response.data) {
      return response.data;  
    }
    
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user
const login = async (userData: any) => {
  try {
    const response = await api.post('/users/login', userData);
    
    if (response.data && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    } else if (response.data) {
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Check if user is authenticated
const checkAuth = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data.data;
  } catch (error) {
    console.log('Not authenticated');
    return null;
  }
};

// Logout user
const logout = async () => {
  try {
    await api.post('/users/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const authService = {
  register,
  login,
  logout,
  checkAuth
};

export default authService;
