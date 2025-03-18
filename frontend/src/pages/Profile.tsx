import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { profileUpdateSchema } from '../utils/validation';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchProfile, updateProfile, clearProfileErrors } from '../features/profile/profileSlice';
import { logout } from '../features/auth/authSlice';
import PageHeader from '../components/ui/PageHeader';
import AlertMessage from '../components/ui/AlertMessage';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.profile);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());

    return () => {
      dispatch(clearProfileErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("Profile Data:", profile);  // Check if profile data is updated
  }, [profile]);

  const formik = useFormik({
    initialValues: {
      username: profile?.username || '',
      email: profile?.email || '',
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      height: profile?.height || '',
      weight: profile?.weight || '',
    },
    enableReinitialize: true,
    validationSchema: profileUpdateSchema,
    onSubmit: async (values) => {
      const result = await dispatch(updateProfile({
        ...values,
        height: values.height ? Number(values.height) : undefined,
        weight: values.weight ? Number(values.weight) : undefined,
      }));
      
      if (updateProfile.fulfilled.match(result)) {
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    },
  });

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    await dispatch(logout());
    setShowDeleteDialog(false);
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="View and update your profile information" />

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearProfileErrors())} 
        />
      )}
      
      {successMessage && (
        <AlertMessage 
          message={successMessage} 
          severity="success" 
          onClose={() => setSuccessMessage(null)} 
          autoClose 
        />
      )}

<Box sx={{ p: 2, mb: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6">User Information</Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : profile ? (
          <>
            <Typography><strong>Username:</strong> {profile.username}</Typography>
            <Typography><strong>Email:</strong> {profile.email}</Typography>
            <Typography><strong>User ID:</strong> {profile.id}</Typography>
          </>
        ) : (
          <Typography color="error">Profile data not available</Typography>
        )}
      </Box>
      <Card>
        <CardHeader title="Profile Details" />
        <Divider />
        <CardContent>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <CircularProgress />
            ) : profile ? (
              <>
                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', mr: 2 }}>
                  {profile.firstName?.[0] || profile.username?.[0] || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}` 
                      : profile.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.email}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography>Profile data not available</Typography>
            )}
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
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
                  label="Last Name"
                  name="lastName"
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
                      error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
                      helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth,
                      disabled: loading
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
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
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
        confirmColor="error"
      />
    </>
  );
};

export default Profile;
