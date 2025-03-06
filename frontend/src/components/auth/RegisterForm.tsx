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
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { register } from '../../features/auth/authSlice';

interface RegisterFormProps {
  onError: (error: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onError }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

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
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      firstName: Yup.string(),
      lastName: Yup.string(),
      dateOfBirth: Yup.date().nullable().max(new Date(), "Date of birth cannot be in the future"),
      height: Yup.number().positive('Height must be positive').typeError('Height must be a number').nullable(),
      weight: Yup.number().positive('Weight must be positive').typeError('Weight must be a number').nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        // First send to debug route to verify data
        if (process.env.NODE_ENV === 'development') {
          try {
            const debugResponse = await fetch('/api/debug/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                dateOfBirth: values.dateOfBirth,
              })
            });
            const debugResult = await debugResponse.json();
            setDebugMessage(`Debug info: ${JSON.stringify(debugResult.fieldPresence)}`);
          } catch (err) {
            console.error('Debug route error:', err);
          }
        }
        
        // Explicitly construct the registration data object
        const registerData = {
          username: values.username,  // Make sure username is explicitly included
          email: values.email,
          password: values.password,
          firstName: values.firstName || undefined,
          lastName: values.lastName || undefined,
          dateOfBirth: values.dateOfBirth,
          height: values.height ? Number(values.height) : undefined,
          weight: values.weight ? Number(values.weight) : undefined,
        };
        
        console.log('Submitting registration data:', { ...registerData, password: '[REDACTED]' });
        
        const result = await dispatch(register(registerData)).unwrap();
        console.log('Registration successful:', result);
        
        // If registration was successful, navigate to dashboard
        navigate('/');
      } catch (error: any) {
        console.error('Registration failed:', error);
        // Display error message
        onError(error || 'Registration failed. Please try again.');
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
        maxWidth: '600px',
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create Account
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="firstName"
            label="First Name"
            id="firstName"
            autoComplete="given-name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="lastName"
            label="Last Name"
            id="lastName"
            autoComplete="family-name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            disabled={loading}
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
                disabled: loading
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="height"
            label="Height (cm)"
            type="number"
            id="height"
            value={formik.values.height}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.height && Boolean(formik.errors.height)}
            helperText={formik.touched.height && formik.errors.height}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="weight"
            label="Weight (kg)"
            type="number"
            id="weight"
            value={formik.values.weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.weight && Boolean(formik.errors.weight)}
            helperText={formik.touched.weight && formik.errors.weight}
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
        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
      </Button>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component="button" variant="body2" onClick={() => navigate('/login')}>
          Already have an account? Sign In
        </Link>
      </Box>
      
      {/* Debug info snackbar */}
      <Snackbar 
        open={!!debugMessage} 
        autoHideDuration={6000} 
        onClose={() => setDebugMessage(null)}
      >
        <Alert onClose={() => setDebugMessage(null)} severity="info">
          {debugMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterForm;
