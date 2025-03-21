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
import { loginSchema } from '../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearErrors, login } from '../../features/auth/authSlice';
import AlertMessage from '../../components/ui/AlertMessage';


const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

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
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
        linear-gradient(
          to left,
          rgba(0, 0, 0, 0.7) 0%,
          rgba(0, 0, 0, 0.5) 30%,
          rgba(0, 0, 0, 0.3) 60%,
          rgba(0, 0, 0, 0) 100%
        ),
        url('/401-login.png')
      `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      
      {/* Login form container */}
      <Box
        sx={{
          background: "white",
          backdropFilter: "blur(4px)",
          pt: "120px", 
          pb: 2,
          px: 2,
          width: "100%",
          maxWidth: 400,
          mx: "auto",
          borderRadius: "8px",
          position: "relative", 
        }}
      >
        {/* Logo positioned inside the form */}
        <Box
          component="img"
          src="/logo.png"
          alt="Logo Text"
          sx={{
            position: "absolute",
            top: "10px", // adjust this to control the vertical placement of the logo
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "90%",
            height: "auto",
            zIndex: 0,
          }}
        />
        <Typography
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            display: "inline-block",  
            px: 2,                 
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)",
            background: "white",
            position: "relative",
            zIndex: 1, 
            mt: "-30px",            
            ml: "36%",              
          }}
        >
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
          disabled={isLoading}
        />
        <TextField
          margin="normal"
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
      </form>
    </Box>

    </Box>
  );
};

export default Login;
