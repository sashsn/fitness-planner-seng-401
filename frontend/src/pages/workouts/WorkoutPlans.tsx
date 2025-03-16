import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { fetchWorkouts } from '../../features/workouts/workoutSlice';
import WorkoutPlanDebug from '../../components/debug/WorkoutPlanDebug';
import WorkoutPlanSummary from '../../components/workouts/WorkoutPlanSummary';

const WorkoutPlans: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { workouts, loading, error } = useAppSelector(state => state.workouts);
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');
  
  // Filter AI-generated workouts
  const generatedWorkouts = useMemo(() => {
    return workouts.filter(workout => 
      workout.workoutType === 'AI Generated' || 
      (!!workout.generatedPlan && typeof workout.generatedPlan === 'string' && 
       workout.generatedPlan.length > 10)
    );
  }, [workouts]);
  
  // Fetch workouts when component mounts
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);
  
  // Handle viewing a workout plan
  const handleViewPlan = useCallback((id: string) => {
    navigate(`/workouts/${id}`);
  }, [navigate]);
  
  // Handle creating a new workout plan
  const handleNewPlan = useCallback(() => {
    navigate('/workouts/generate');
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1">
            Your Workout Plans
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<FitnessCenterIcon />}
            onClick={handleNewPlan}
          >
            Generate New Plan
          </Button>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          View and manage your AI-generated workout plans
        </Typography>
      </Box>
      
      {/* Debug toggle in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={showDebug} 
                onChange={(e) => setShowDebug(e.target.checked)}
              />
            }
            label="Show Debug Info"
          />
        </Box>
      )}
      
      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Debug display */}
      {showDebug && generatedWorkouts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Debug: Workout Plans Data</Typography>
          {generatedWorkouts.map((workout) => (
            <WorkoutPlanDebug key={workout.id || 'unknown'} workoutData={workout} />
          ))}
        </Box>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : generatedWorkouts.length > 0 ? (
        <Grid container spacing={3}>
          {generatedWorkouts.map(workout => (
            <Grid item xs={12} md={6} key={workout.id || `workout-${Math.random()}`}>
              <WorkoutPlanSummary 
                plan={workout}
                onViewDetails={workout.id ? () => handleViewPlan(workout.id as string) : undefined}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No workout plans found
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewPlan}
            sx={{ mt: 2 }}
          >
            Generate Your First Plan
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default WorkoutPlans;
