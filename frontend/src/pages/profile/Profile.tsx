import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchProfile, updateProfile, clearProfileErrors, resetSuccess } from '../../features/profile/profileSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import PasswordChangeForm from '../../components/profile/PasswordChangeForm';
import DeleteAccountForm from '../../components/profile/DeleteAccountForm';
import PageHeader from '../../components/ui/PageHeader';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, success } = useAppSelector((state) => state.profile);
  const [tabValue, setTabValue] = useState(0);

  // Load profile data on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Basic profile validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().max(50, 'First name must be at most 50 characters'),
    lastName: Yup.string().max(50, 'Last name must be at most 50 characters'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters'),
    height: Yup.number()
      .nullable()
      .positive('Height must be a positive number')
      .typeError('Height must be a number'),
    weight: Yup.number()
      .nullable()
      .positive('Weight must be a positive number')
      .typeError('Weight must be a number'),
    dateOfBirth: Yup.date().nullable().max(new Date(), 'Date of birth cannot be in the future'),
  });

  // Profile update form
  const formik = useFormik({
    initialValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      username: profile?.username || '',
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      height: profile?.height || '',
      weight: profile?.weight || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Convert string values to numbers before submitting
      const formattedValues = {
        ...values,
        height: values.height === '' ? null : typeof values.height === 'string' ? Number(values.height) : values.height,
        weight: values.weight === '' ? null : typeof values.weight === 'string' ? Number(values.weight) : values.weight,
      };
      await dispatch(updateProfile(formattedValues));
    },
  });

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <PageHeader title="Your Profile" />

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          variant="fullWidth"
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Personal Info" 
            id="profile-tab-0" 
            aria-controls="profile-tabpanel-0" 
          />
          <Tab 
            icon={<FitnessCenterIcon />} 
            label="Fitness Data" 
            id="profile-tab-1" 
            aria-controls="profile-tabpanel-1" 
          />
          <Tab 
            icon={<LockIcon />} 
            label="Security" 
            id="profile-tab-2" 
            aria-controls="profile-tabpanel-2" 
          />
        </Tabs>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  id="email"
                  label="Email Address"
                  value={profile?.email || ''}
                  helperText="Email address cannot be changed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
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
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formik.dirty}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Fitness Data Tab */}
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
                  disabled={loading}
                  InputProps={{
                    endAdornment: <Typography variant="body2">cm</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                  disabled={loading}
                  InputProps={{
                    endAdornment: <Typography variant="body2">kg</Typography>
                  }}
                />
              </Grid>

              {profile?.bmi && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>BMI Calculation</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Your BMI</Typography>
                          <Typography variant="h4">{profile.bmi}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Category</Typography>
                          <Typography variant="h6">{profile.bmiCategory}</Typography>
                        </Grid>
                      </Grid>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        BMI is calculated based on your height and weight. It provides a rough estimate of whether you're at a healthy weight.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formik.dirty}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <PasswordChangeForm />
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
            Delete Account
          </Typography>
          <DeleteAccountForm />
        </TabPanel>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar 
        open={success} 
        autoHideDuration={3000}
        onClose={() => dispatch(resetSuccess())}
      >
        <Alert severity="success">Profile updated successfully</Alert>
      </Snackbar>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => dispatch(clearProfileErrors())}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Profile;
