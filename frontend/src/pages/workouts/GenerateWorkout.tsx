import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import for navigation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  AlertTitle, // Add this import for AlertTitle
  Snackbar
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  generateWorkout, 
  resetWorkoutGenerator, 
  setPreferences,
  saveGeneratedWorkout
} from '../../features/workoutGenerator/workoutGeneratorSlice';
import GeneratedWorkoutDisplay from '../../components/workouts/GeneratedWorkoutDisplay';
import { WorkoutPreferences } from '../../services/workoutGeneratorService';
import NetworkErrorAlert from '../../components/ui/NetworkErrorAlert';

// Define the workout types options
const workoutTypes = [
  'Strength Training',
  'Cardio',
  'HIIT',
  'Yoga',
  'Pilates',
  'Bodyweight',
  'Crossfit'
];

// Define days of the week
const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

// Add analytics tracking
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
  const navigate = useNavigate(); // Add this hook for navigation
  const dispatch = useAppDispatch();
  const { loading, workoutPlan, error, success } = useAppSelector(state => state.workoutGenerator);
  const { profile } = useAppSelector(state => state.profile);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [scrollToResults, setScrollToResults] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Use useEffect for checking workoutPlan and setting success alerts with complete dependencies
  useEffect(() => {
    if (workoutPlan && 
        workoutPlan.workoutPlan && 
        workoutPlan.workoutPlan.metadata) {
      
      console.log('📋 LLM response received:', workoutPlan.workoutPlan.metadata.name);
      setOpenSuccessAlert(true);
      setIsNetworkError(false);
      setScrollToResults(true);
    }
  }, [workoutPlan, setOpenSuccessAlert, setIsNetworkError, setScrollToResults]); // Fixed: Added all state setters to dependencies
  
  // Separate effect for error handling with proper dependencies
  useEffect(() => {
    if (error && (
      error.includes('Network error') || 
      error.includes('No response from server')
    )) {
      setIsNetworkError(true);
    }
  }, [error, setIsNetworkError]); // Fixed: Added state setter to dependencies
  
  // Clean up function in separate effect
  useEffect(() => {
    return () => {
      dispatch(resetWorkoutGenerator());
    };
  }, [dispatch]);
  
  // Separate effect for scrolling with proper dependencies
  useEffect(() => {
    if (scrollToResults && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setScrollToResults(false);
    }
  }, [scrollToResults, setScrollToResults]); // Fixed: Added state setter to dependencies

  // Properly memoize event handlers with useCallback
  const handleCloseSuccessAlert = useCallback(() => {
    setOpenSuccessAlert(false);
  }, [setOpenSuccessAlert]); // Fixed: Added state setter to dependencies

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
      setIsNetworkError(false);
      
      // Track analytics
      trackWorkoutGeneration(values);
      
      // Dispatch actions
      dispatch(setPreferences(values));
      dispatch(generateWorkout(values));
    }
  });

  // Properly memoized day toggle handler with useCallback
  const handleDayToggle = useCallback((day: string) => {
    const currentDays = [...formik.values.availableDays];
    const currentIndex = currentDays.indexOf(day);
    
    if (currentIndex === -1) {
      currentDays.push(day);
    } else {
      currentDays.splice(currentIndex, 1);
    }
    
    formik.setFieldValue('availableDays', currentDays);
  }, [formik.values.availableDays, formik.setFieldValue]); // Fixed: Properly memoized with correct dependencies

  // Properly memoized workout type toggle handler with useCallback
  const handleWorkoutTypeToggle = useCallback((type: string) => {
    const currentTypes = [...formik.values.preferredWorkoutTypes];
    const currentIndex = currentTypes.indexOf(type);
    
    if (currentIndex === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(currentIndex, 1);
    }
    
    formik.setFieldValue('preferredWorkoutTypes', currentTypes);
  }, [formik.values.preferredWorkoutTypes, formik.setFieldValue]); // Fixed: Properly memoized with correct dependencies

  // Properly memoized retry handler with useCallback
  const handleRetry = useCallback(() => {
    if (formik.values) {
      formik.handleSubmit(); // Use formik's built-in handle submit
    }
  }, [formik]); // Fixed: Added formik to dependencies

  // Memoize form validation effect dependencies
  const validateFormCallback = useCallback(() => {
    if (hasAttemptedSubmit) {
      formik.validateForm();
    }
  }, [hasAttemptedSubmit, formik.validateForm]); // Memoize the callback itself

  useEffect(() => {
    validateFormCallback();
  }, [validateFormCallback]); // Now the effect only depends on the memoized callback

  // Properly memoized save function with useCallback
  const handleSaveWorkout = useCallback((name: string, plan: any) => {
    dispatch(saveGeneratedWorkout({
      name,
      workoutPlan: { workoutPlan: plan }
    }));
  }, [dispatch]); // Fixed: Added dispatch to dependencies

  // Add a banner to notify users when profile data is missing
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

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Generate Custom Workout Plan
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          Fill out your preferences and we'll create a personalized workout plan for you
        </Typography>
      </Box>
      
      {/* Show banner for profile data */}
      {showProfileDataBanner()}
      
      {/* Success alert */}
      <Snackbar 
        open={openSuccessAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccessAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: '100%' }}>
          Workout plan generated successfully!
        </Alert>
      </Snackbar>
      
      {/* Error alerts */}
      {isNetworkError ? (
        <NetworkErrorAlert 
          message={error || "Network connection error"}
          onRetry={handleRetry} 
        />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      
      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            {/* Form fields... */}
            <Grid container spacing={3}>
              {/* Fitness Goal */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>Primary Fitness Goal</FormLabel>
                  <RadioGroup
                    name="fitnessGoal"
                    value={formik.values.fitnessGoal}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss" />
                    <FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain" />
                    <FormControlLabel value="endurance" control={<Radio />} label="Endurance" />
                    <FormControlLabel value="general" control={<Radio />} label="General Fitness" />
                  </RadioGroup>
                  {formik.touched.fitnessGoal && formik.errors.fitnessGoal && (
                    <Typography color="error">{formik.errors.fitnessGoal}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Experience Level */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>Experience Level</FormLabel>
                  <RadioGroup
                    name="experienceLevel"
                    value={formik.values.experienceLevel}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="beginner" control={<Radio />} label="Beginner" />
                    <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
                    <FormControlLabel value="advanced" control={<Radio />} label="Advanced" />
                  </RadioGroup>
                  {formik.touched.experienceLevel && formik.errors.experienceLevel && (
                    <Typography color="error">{formik.errors.experienceLevel}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Other form fields... */}
              {/* Workout Days Per Week */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Workout Days Per Week"
                  name="workoutDaysPerWeek"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 7 } }}
                  value={formik.values.workoutDaysPerWeek}
                  onChange={formik.handleChange}
                  error={formik.touched.workoutDaysPerWeek && Boolean(formik.errors.workoutDaysPerWeek)}
                  helperText={formik.touched.workoutDaysPerWeek && formik.errors.workoutDaysPerWeek}
                />
              </Grid>

              {/* Workout Duration */}
              <Grid item xs={12} md={6}>
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
              </Grid>

              {/* Available Days */}
              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset">
                  <FormLabel component="legend">Available Days</FormLabel>
                  <FormGroup row>
                    {daysOfWeek.map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={formik.values.availableDays.includes(day)}
                            onChange={() => handleDayToggle(day)}
                            name={`availableDays-${day}`}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                  {formik.touched.availableDays && formik.errors.availableDays && (
                    <Typography color="error">{formik.errors.availableDays}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Preferred Workout Types */}
              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset">
                  <FormLabel component="legend">Preferred Workout Types</FormLabel>
                  <FormGroup row>
                    {workoutTypes.map((type) => (
                      <FormControlLabel
                        key={type}
                        control={
                          <Checkbox
                            checked={formik.values.preferredWorkoutTypes.includes(type)}
                            onChange={() => handleWorkoutTypeToggle(type)}
                            name={`preferredWorkoutTypes-${type}`}
                          />
                        }
                        label={type}
                      />
                    ))}
                  </FormGroup>
                  {formik.touched.preferredWorkoutTypes && formik.errors.preferredWorkoutTypes && (
                    <Typography color="error">{formik.errors.preferredWorkoutTypes}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Equipment Access */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Equipment Access"
                    name="equipmentAccess"
                    value={formik.values.equipmentAccess}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="none">No Equipment (Bodyweight Only)</MenuItem>
                    <MenuItem value="limited">Limited (Basic Home Equipment)</MenuItem>
                    <MenuItem value="full">Full Gym Access</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              {/* Limitations or Injuries */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Limitations or Injuries (if any)"
                  name="limitations"
                  multiline
                  rows={2}
                  value={formik.values.limitations}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Additional Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes or Preferences"
                  name="additionalNotes"
                  multiline
                  rows={3}
                  value={formik.values.additionalNotes}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Workout Plan'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Display generated workout with reference */}
      {workoutPlan && (
        <Box mt={4} ref={resultRef}>
          <Typography variant="h4" component="h2" gutterBottom align="center" 
            sx={{ 
              background: 'linear-gradient(90deg, #4a90e2, #8e64c5)', 
              color: 'white',
              p: 2,
              borderRadius: 2,
              mb: 3,
              boxShadow: 3
            }}
          >
            Your Custom Workout Plan
          </Typography>
          <GeneratedWorkoutDisplay 
            workoutPlanData={workoutPlan} 
            onSave={handleSaveWorkout}
          />
        </Box>
      )}
    </Container>
  );
};

export default GenerateWorkout;
