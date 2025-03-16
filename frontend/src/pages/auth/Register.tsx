import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { registerSchema } from '../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearErrors, register } from '../../features/auth/authSlice';
import AlertMessage from '../../components/ui/AlertMessage';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: null as Date | null,
      height: '',
      weight: '',
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      // Create a properly formatted data object
      const registerData = {
        ...values,
        // Format date properly
        dateOfBirth: values.dateOfBirth instanceof Date ? 
          values.dateOfBirth.toISOString() : values.dateOfBirth,
        // Ensure height and weight are numbers
        height: values.height ? Number(values.height) : undefined,
        weight: values.weight ? Number(values.weight) : undefined,
      };
      
      dispatch(register(registerData));
    },
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Create an Account
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              autoComplete="given-name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              autoComplete="family-name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Date of Birth"
              value={formik.values.dateOfBirth}
              onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  id: "dateOfBirth",
                  name: "dateOfBirth",
                  error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
                  helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 
                    String(formik.errors.dateOfBirth) : undefined,
                  disabled: isLoading
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="height"
              name="height"
              label="Height (cm)"
              type="number"
              value={formik.values.height}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.height && Boolean(formik.errors.height)}
              helperText={formik.touched.height && formik.errors.height}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="weight"
              name="weight"
              label="Weight (kg)"
              type="number"
              value={formik.values.weight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.weight && Boolean(formik.errors.weight)}
              helperText={formik.touched.weight && formik.errors.weight}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
