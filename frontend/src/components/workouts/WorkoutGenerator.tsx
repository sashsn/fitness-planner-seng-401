import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Step, 
  StepLabel, 
  Stepper, 
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  generateWorkout, 
  resetWorkoutGenerator, 
  setPreferences,
  saveGeneratedWorkout
} from '../../features/workoutGenerator/workoutGeneratorSlice';

const WorkoutGenerator: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Monitor loading state and add error display
  const { loading, error, workoutPlan, success } = useAppSelector(
    (state) => state.workoutGenerator
  );

  useEffect(() => {
    // Reset error state when component unmounts
    return () => {
      dispatch(resetWorkoutGenerator());
    };
  }, [dispatch]);
  
  // Add timeout handling for loading state
  const [timeoutError, setTimeoutError] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      // Set a timeout to show a message if loading takes too long
      timeoutId = setTimeout(() => {
        setTimeoutError(true);
      }, 30000); // 30 seconds
    } else {
      setTimeoutError(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);
  
  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Your Workout Plan
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Our AI will create a personalized workout plan based on your preferences
        </Typography>
        
        {/* Display errors prominently */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {timeoutError && loading && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Generation is taking longer than expected. Please be patient or try again later.
          </Alert>
        )}
        
        {/* Placeholder for the stepper implementation */}
        <Typography variant="body1">
          Workout generation form will go here.
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Generating Your Workout Plan...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This may take up to a minute.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default WorkoutGenerator;
