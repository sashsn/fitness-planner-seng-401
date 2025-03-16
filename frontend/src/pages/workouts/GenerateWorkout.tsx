import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar,
  Paper,
  Divider,
  useTheme,
  Avatar,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PoolIcon from '@mui/icons-material/Pool';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  generateWorkout, 
  resetWorkoutGenerator, 
  setPreferences,
  saveGeneratedWorkout,
  cancelWorkoutGeneration  // Add this import
} from '../../features/workoutGenerator/workoutGeneratorSlice';
import { WorkoutPreferences } from '../../services/workoutGeneratorService';

// Enhanced workout types with icons
const workoutTypes = [
  { name: 'Strength Training', icon: <FitnessCenterIcon /> },
  { name: 'Cardio', icon: <DirectionsRunIcon /> },
  { name: 'HIIT', icon: <SportsHandballIcon /> },
  { name: 'Yoga', icon: <SportsGymnasticsIcon /> },
  { name: 'Pilates', icon: <SportsGymnasticsIcon /> },
  { name: 'Bodyweight', icon: <DirectionsRunIcon /> },
  { name: 'Swimming', icon: <PoolIcon /> }
];

// Days of the week with enhanced styling
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Track analytics for workout generation
const trackWorkoutGeneration = (preferences: WorkoutPreferences) => {
  console.log('Tracking workout generation:', {
    fitnessGoal: preferences.fitnessGoal,
    experienceLevel: preferences.experienceLevel,
    workoutDaysPerWeek: preferences.workoutDaysPerWeek,
    equipmentAccess: preferences.equipmentAccess,
    timestamp: new Date().toISOString()
  });
};

const GenerateWorkout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, success, jobProgress, jobStatus, workoutPlan, isCanceling, jobId } = useAppSelector(state => state.workoutGenerator);
  const { profile } = useAppSelector(state => state.profile);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Add step-based UI
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Info', 'Schedule', 'Equipment & Details'];
  
  // Handle successful workout generation - update to prevent UI freezing
  useEffect(() => {
    if (success) {
      setOpenSuccessAlert(true);
      // Auto redirect to plans page after a short delay
      const redirectTimeout = setTimeout(() => {
        navigate('/workouts');
      }, 2000);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [success, navigate]);
  
  // Add new effect to automatically save the generated workout when available
  const { processingPlan } = useAppSelector(state => state.workoutGenerator);

  useEffect(() => {
    // If we have a workout plan and we're processing it, save it automatically
    if (workoutPlan && processingPlan) {
      console.log('Auto-saving generated workout plan');
      
      // Use setTimeout to prevent UI freezing during plan processing
      const processingTimeout = setTimeout(() => {
        dispatch(saveGeneratedWorkout({ 
          plan: workoutPlan,
          name: workoutPlan.workoutPlan.metadata?.name || 'My Custom Workout'
        }));
      }, 100);
      
      return () => clearTimeout(processingTimeout);
    }
  }, [workoutPlan, processingPlan, dispatch]);

  // Clean up function in separate effect
  useEffect(() => {
    return () => {
      dispatch(resetWorkoutGenerator());
    };
  }, [dispatch]);

  // Handle closing the success alert
  const handleCloseSuccessAlert = useCallback(() => {
    setOpenSuccessAlert(false);
    navigate('/workouts');
  }, [navigate]);

  // Initialize form with Formik
  const formik = useFormik<WorkoutPreferences>({
    initialValues: {
      fitnessGoal: 'general',
      experienceLevel: 'beginner',
      workoutDaysPerWeek: 3,
      workoutDuration: 30,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      preferredWorkoutTypes: ['Strength Training', 'Cardio'],
      equipmentAccess: 'limited',
      limitations: '',
      additionalNotes: ''
    },
    validationSchema: Yup.object({
      fitnessGoal: Yup.string().required('Please select a fitness goal'),
      experienceLevel: Yup.string().required('Please select your experience level'),
      workoutDaysPerWeek: Yup.number().min(1).max(7).required('Please specify workout days per week'),
      workoutDuration: Yup.number().min(10).required('Please specify workout duration'),
      availableDays: Yup.array().min(1, 'Select at least one day'),
      preferredWorkoutTypes: Yup.array().min(1, 'Select at least one workout type')
    }),
    onSubmit: (values) => {
      setHasAttemptedSubmit(true);
      
      // Track analytics
      trackWorkoutGeneration(values);
      
      // Dispatch actions
      dispatch(setPreferences(values));
      dispatch(generateWorkout(values));
    }
  });

  // Handle day selection logic
  const handleDayToggle = useCallback((day: string) => {
    const currentDays = [...formik.values.availableDays];
    const currentIndex = currentDays.indexOf(day);
    
    if (currentIndex === -1) {
      currentDays.push(day);
    } else {
      currentDays.splice(currentIndex, 1);
    }
    
    formik.setFieldValue('availableDays', currentDays);
  }, [formik.values.availableDays, formik.setFieldValue]);

  // Handle workout type selection logic
  const handleWorkoutTypeToggle = useCallback((type: string) => {
    const currentTypes = [...formik.values.preferredWorkoutTypes];
    const currentIndex = currentTypes.indexOf(type);
    
    if (currentIndex === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(currentIndex, 1);
    }
    
    formik.setFieldValue('preferredWorkoutTypes', currentTypes);
  }, [formik.values.preferredWorkoutTypes, formik.setFieldValue]);

  // Effect to validate form
  useEffect(() => {
    if (hasAttemptedSubmit) {
      formik.validateForm();
    }
  }, [hasAttemptedSubmit, formik]);

  // Handler for step navigation - adding preventDefault and disabling form submission
  const handleNextStep = (e: React.MouseEvent) => {
    // Prevent form submission
    e.preventDefault();
    
    // Validate current step before proceeding
    let canProceed = true;
    
    if (activeStep === 0) {
      // Validate first step fields
      const errors: Record<string, string> = {};
      if (!formik.values.fitnessGoal) errors.fitnessGoal = 'Required';
      if (!formik.values.experienceLevel) errors.experienceLevel = 'Required';
      
      // Only set errors if we found any
      if (Object.keys(errors).length > 0) {
        formik.setErrors({...formik.errors, ...errors});
        canProceed = false;
      }
    }
    
    if (activeStep === 1) {
      // Validate second step fields
      const errors: Record<string, string> = {};
      if (!formik.values.workoutDaysPerWeek) errors.workoutDaysPerWeek = 'Required';
      if (!formik.values.workoutDuration) errors.workoutDuration = 'Required';
      if (formik.values.availableDays.length === 0) errors.availableDays = 'Select at least one day';
      
      // Only set errors if we found any
      if (Object.keys(errors).length > 0) {
        formik.setErrors({...formik.errors, ...errors});
        canProceed = false;
      }
    }
    
    // Only proceed if validation passed
    if (canProceed) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBackStep = (e: React.MouseEvent) => {
    // Prevent form submission
    e.preventDefault();
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Profile data banner
  const showProfileDataBanner = () => {
    if (!profile || (!profile.weight && !profile.height)) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>For better results</AlertTitle>
          Update your profile with your weight and height to get personalized nutrition recommendations.
          <Button 
            size="small" 
            color="primary" 
            onClick={() => navigate('/profile')}
            sx={{ ml: 1 }}
          >
            Update Profile
          </Button>
        </Alert>
      );
    }
    return null;
  };

  // Render step content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Basic Info
        return (
          <Grid container spacing={3}>
            {/* Fitness Goal */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader 
                  title="Primary Fitness Goal" 
                  titleTypographyProps={{ variant: 'h6' }}
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <FitnessCenterIcon />
                    </Avatar>
                  }
                />
                <CardContent>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="fitnessGoal"
                      value={formik.values.fitnessGoal}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel value="weightLoss" control={
                        <Radio sx={{ '&.Mui-checked': { color: '#ff5252' } }} />
                      } label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Weight Loss</Typography>
                          <Tooltip title="Focus on calorie-burning exercises and cardio">
                            <IconButton size="small">
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      } />
                      
                      <FormControlLabel value="muscleGain" control={
                        <Radio sx={{ '&.Mui-checked': { color: '#42a5f5' } }} />
                      } label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Muscle Gain</Typography>
                          <Tooltip title="Focus on resistance training and protein intake">
                            <IconButton size="small">
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      } />
                      
                      <FormControlLabel value="endurance" control={
                        <Radio sx={{ '&.Mui-checked': { color: '#66bb6a' } }} />
                      } label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Endurance</Typography>
                          <Tooltip title="Focus on stamina-building exercises">
                            <IconButton size="small">
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      } />
                      
                      <FormControlLabel value="general" control={
                        <Radio sx={{ '&.Mui-checked': { color: '#9575cd' } }} />
                      } label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>General Fitness</Typography>
                          <Tooltip title="Balanced approach to overall fitness">
                            <IconButton size="small">
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      } />
                    </RadioGroup>
                  </FormControl>
                  {formik.touched.fitnessGoal && formik.errors.fitnessGoal && (
                    <Typography color="error">{formik.errors.fitnessGoal}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Experience Level */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader 
                  title="Experience Level" 
                  titleTypographyProps={{ variant: 'h6' }}
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      <SportsHandballIcon />
                    </Avatar>
                  }
                />
                <CardContent>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="experienceLevel"
                      value={formik.values.experienceLevel}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel 
                        value="beginner" 
                        control={<Radio color="primary" />} 
                        label="Beginner"
                      />
                      <FormControlLabel 
                        value="intermediate" 
                        control={<Radio color="primary" />} 
                        label="Intermediate"
                      />
                      <FormControlLabel 
                        value="advanced" 
                        control={<Radio color="primary" />} 
                        label="Advanced"
                      />
                    </RadioGroup>
                  </FormControl>
                  {formik.touched.experienceLevel && formik.errors.experienceLevel && (
                    <Typography color="error">{formik.errors.experienceLevel}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1: // Schedule
        return (
          <Grid container spacing={3}>
            {/* Workout Days Per Week */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Workout Frequency" 
                  titleTypographyProps={{ variant: 'h6' }}
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <AccessTimeIcon />
                    </Avatar>
                  }
                />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Workouts Per Week"
                    name="workoutDaysPerWeek"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 7 } }}
                    value={formik.values.workoutDaysPerWeek}
                    onChange={formik.handleChange}
                    error={formik.touched.workoutDaysPerWeek && Boolean(formik.errors.workoutDaysPerWeek)}
                    helperText={formik.touched.workoutDaysPerWeek && formik.errors.workoutDaysPerWeek}
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Workout Duration (minutes)"
                    name="workoutDuration"
                    type="number"
                    InputProps={{ inputProps: { min: 10, max: 120 } }}
                    value={formik.values.workoutDuration}
                    onChange={formik.handleChange}
                    error={formik.touched.workoutDuration && Boolean(formik.errors.workoutDuration)}
                    helperText={formik.touched.workoutDuration && formik.errors.workoutDuration}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Available Days */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Available Days" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {daysOfWeek.map((day) => (
                      <Chip
                        key={day}
                        label={day.substring(0, 3)}
                        color={formik.values.availableDays.includes(day) ? "primary" : "default"}
                        onClick={() => handleDayToggle(day)}
                        sx={{
                          borderRadius: '16px',
                          transition: 'all 0.3s',
                          fontWeight: formik.values.availableDays.includes(day) ? 'bold' : 'normal',
                          transform: formik.values.availableDays.includes(day) ? 'scale(1.05)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </Box>
                  {formik.touched.availableDays && formik.errors.availableDays && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {formik.errors.availableDays}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2: // Equipment & Details
        return (
          <Grid container spacing={3}>
            {/* Preferred Workout Types */}
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Preferred Workout Types" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <Grid container spacing={2}>
                      {workoutTypes.map((type) => (
                        <Grid item xs={6} sm={4} key={type.name}>
                          <Paper 
                            elevation={formik.values.preferredWorkoutTypes.includes(type.name) ? 3 : 1} 
                            sx={{
                              p: 2,
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              bgcolor: formik.values.preferredWorkoutTypes.includes(type.name) 
                                ? 'primary.light' 
                                : 'background.paper',
                              color: formik.values.preferredWorkoutTypes.includes(type.name) 
                                ? 'primary.contrastText'
                                : 'text.primary',
                              transition: 'all 0.3s',
                              '&:hover': {
                                bgcolor: 'action.hover',
                              }
                            }}
                            onClick={() => handleWorkoutTypeToggle(type.name)}
                          >
                            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                              {type.icon}
                            </Box>
                            <Typography>
                              {type.name}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </FormControl>
                  {formik.touched.preferredWorkoutTypes && formik.errors.preferredWorkoutTypes && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {formik.errors.preferredWorkoutTypes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Equipment Access */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Equipment Access" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                  <TextField
                    select
                    fullWidth
                    label="Equipment Access"
                    name="equipmentAccess"
                    value={formik.values.equipmentAccess}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="none">No Equipment (Bodyweight Only)</MenuItem>
                    <MenuItem value="limited">Limited (Basic Home Equipment)</MenuItem>
                    <MenuItem value="full">Full Gym Access</MenuItem>
                  </TextField>
                </CardContent>
              </Card>
            </Grid>

            {/* Limitations & Notes */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Additional Information" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Limitations or Injuries (if any)"
                    name="limitations"
                    multiline
                    rows={2}
                    value={formik.values.limitations}
                    onChange={formik.handleChange}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Additional Notes or Preferences"
                    name="additionalNotes"
                    multiline
                    rows={3}
                    value={formik.values.additionalNotes}
                    onChange={formik.handleChange}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  // Add a loading timeout detection
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  // Add timeout warning after 20 seconds with no progress update
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loading) {
      timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
      }, 20000); // 20 seconds
    } else {
      setTimeoutWarning(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, jobProgress]);

  // Reset timeout warning if progress updates
  useEffect(() => {
    if (jobProgress > 0) {
      setTimeoutWarning(false);
    }
  }, [jobProgress]);

  // Add loading timeout detection with specific UI feedback
  const [statusMessage, setStatusMessage] = useState('');

  // Add timeout warning after 30 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let progressCheckInterval: NodeJS.Timeout;
    
    if (loading) {
      // Show first timeout warning after 30 seconds
      timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
        setStatusMessage("This is taking longer than expected. The server is still processing your request.");
      }, 30000);
      
      // Start an interval to update status messages for user engagement
      progressCheckInterval = setInterval(() => {
        if (jobProgress > 0) {
          // Update status messages based on progress
          if (jobProgress < 30) {
            setStatusMessage("Preparing your workout plan...");
          } else if (jobProgress < 60) {
            setStatusMessage("Designing exercises based on your preferences...");
          } else if (jobProgress < 90) {
            setStatusMessage("Finalizing your personalized workout plan...");
          } else {
            setStatusMessage("Almost done! Preparing to display your plan...");
          }
        }
      }, 5000);
    } else {
      setTimeoutWarning(false);
    }
    
    // Clean up timeouts and intervals
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressCheckInterval) clearInterval(progressCheckInterval);
    };
  }, [loading, jobProgress]);

  // Add a "cancel generation" option after a timeout
  const [showCancel, setShowCancel] = useState(false);
  useEffect(() => {
    let cancelTimeoutId: NodeJS.Timeout;
    
    if (timeoutWarning && loading) {
      // Show cancel button after 20 more seconds of timeout
      cancelTimeoutId = setTimeout(() => {
        setShowCancel(true);
      }, 20000);
    }
    
    return () => {
      if (cancelTimeoutId) clearTimeout(cancelTimeoutId);
    };
  }, [timeoutWarning, loading]);

  // Handle cancel workout generation
  const handleCancelGeneration = useCallback(() => {
    if (jobId) {
      // Dispatch cancel action with the job ID
      dispatch(cancelWorkoutGeneration(jobId));
    } else {
      // Just reset the state if there's no job ID
      dispatch(resetWorkoutGenerator());
    }
    navigate('/workouts');
  }, [dispatch, navigate, jobId]);

  return (
    <Container maxWidth="lg">
      <Paper sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: 2, 
        mt: 3, 
        mb: 5, 
        boxShadow: 3 
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #2196F3 30%, #673AB7 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}>
          Create Your Custom Workout Plan
        </Typography>
          
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Our AI will design a personalized workout plan based on your preferences and goals
        </Typography>
        
        {/* Show profile data banner */}
        {showProfileDataBanner()}
        
        {/* Stepper component */}
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ mb: 4, display: { xs: 'none', sm: 'flex' } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Success alert */}
        <Snackbar 
          open={openSuccessAlert} 
          autoHideDuration={2000} 
          onClose={handleCloseSuccessAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: '100%' }}>
            Workout plan generated successfully! Redirecting to your plans...
          </Alert>
        </Snackbar>
        
        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Step content */}
        <form onSubmit={formik.handleSubmit}>
          {renderStepContent()}
          
          {/* Navigation buttons - fix the onClick and type attributes */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBackStep}
              sx={{ minWidth: 100 }}
              type="button" // Change to button type to prevent form submission
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit" // Only the final button should be submit type
                  disabled={loading}
                  sx={{ 
                    minWidth: 150,
                    background: 'linear-gradient(45deg, #2196F3 30%, #673AB7 90%)'
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Workout Plan'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextStep}
                  type="button" // Change to button type to prevent form submission
                  sx={{ minWidth: 100 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Loading indicator with progress */}
      {loading && (
        <Box sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
          backdropFilter: 'blur(3px)'
        }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 500 }}>
            <CircularProgress 
              variant={jobProgress > 0 ? "determinate" : "indeterminate"} 
              value={jobProgress} 
              size={60} 
              sx={{ mb: 2 }} 
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Creating Your Personalized Plan
            </Typography>
            
            <Typography variant="body1" color="text.secondary" align="center">
              {jobProgress > 0 
                ? `Progress: ${jobProgress}%` 
                : "Our AI is designing your custom workout routine based on your preferences."}
            </Typography>
            
            {timeoutWarning && (
              <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                This is taking longer than expected. The server is still working on your request. Please be patient.
              </Alert>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              {jobStatus === 'processing' 
                ? 'Generating workout plan...'
                : 'Preparing your request...'}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Enhanced Loading indicator with progress */}
      {loading && (
        <Box sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 500 }}>
            <CircularProgress 
              variant={jobProgress > 0 ? "determinate" : "indeterminate"} 
              value={jobProgress} 
              size={60} 
              sx={{ mb: 2 }} 
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isCanceling ? "Canceling Generation..." : "Creating Your Personalized Plan"}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 1 }}>
              {isCanceling 
                ? "Please wait while we cancel your request..."
                : jobProgress > 0 
                  ? `Progress: ${jobProgress}%` 
                  : "Our AI is designing your custom workout routine based on your preferences."}
            </Typography>
            
            {statusMessage && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                {statusMessage}
              </Typography>
            )}
            
            {timeoutWarning && (
              <Alert severity="info" sx={{ mt: 2, width: '100%', mb: 2 }}>
                This is taking longer than expected. The server is still working on your request.
              </Alert>
            )}
            
            {!isCanceling && showCancel && (
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={handleCancelGeneration}
                sx={{ mt: 2 }}
                disabled={isCanceling}
              >
                Cancel and Return
              </Button>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default GenerateWorkout;
