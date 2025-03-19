import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Directly use fetch for more control
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store token in localStorage if it exists
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }

      // Redirect to dashboard
      navigate('/dashboard'); 

    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle "Continue as Guest"
  const handleGuestLogin = () => {
    // Set guest flag in localStorage
    localStorage.setItem('guest', 'true');
    
    // Redirect to dashboard for guest user
    navigate('/dashboard');
  };
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={credentials.email}
            onChange={handleChange}
            autoFocus
          />

          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Sign Up
          </Button>

          {/* Continue as Guest button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGuestLogin} 
            sx={{ mt: 2 }}
          >
            Continue as Guest
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;