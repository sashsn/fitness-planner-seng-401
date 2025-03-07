import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Link,
  Alert,
  Grid
} from '@mui/material';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { login } from '../../features/auth/authSlice';

interface LoginFormProps {
  onError: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onError }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
          try {
            const debugResponse = await fetch('/api/debug/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });
            const debugData = await debugResponse.json();
            
            if (!debugResponse.ok) {
              setDebugInfo(`Debug login failed: ${debugData.error || debugData.message}`);
            } else {
              setDebugInfo(`Debug login succeeded: ${JSON.stringify(debugData.data.user)}`);
            }
          } catch (err) {
            console.error('Debug login error:', err);
          }
        }
        
        // Actual login
        const result = await dispatch(login(values)).unwrap();
        
        // If login was successful, navigate to dashboard
        navigate('/');
      } catch (error: any) {
        console.error('Login failed:', error);
        // Display error message
        onError(error || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Sign In
      </Typography>

      {debugInfo && process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {debugInfo}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component="button" variant="body2" onClick={() => navigate('/register')}>
          Don&apos;t have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
