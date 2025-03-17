import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearErrors, login } from '../../features/auth/authSlice';
import AlertMessage from '../../components/ui/AlertMessage';
import { useNavigate } from 'react-router-dom'; 

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    // Removed the validation schema to allow bypassing validation
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  const handleGuestLogin = () => {
    navigate('/dashboard'); 
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Sign In
      </Typography>

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearErrors())} 
          sx={{ mb: 2 }} 
        />
      )}

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          margin="normal"
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
          disabled={isLoading}
        />
        <TextField
          margin="normal"
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
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>

        {/* Continue as Guest button */}
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGuestLogin}  // Navigate to dashboard as guest
            sx={{ mt: 2 }}
          >
            Continue as Guest
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
