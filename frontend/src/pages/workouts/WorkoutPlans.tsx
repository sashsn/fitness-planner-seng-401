import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Chip,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Paper,
  FormControlLabel,
  Switch
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { formatDate } from '../../utils/format';
import { fetchWorkouts } from '../../features/workouts/workoutSlice';
import WorkoutPlanDebug from '../../components/debug/WorkoutPlanDebug';
import WorkoutCard from '../../components/workouts/WorkoutCard';  // Fixed import path

const WorkoutPlans: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { workouts, loading } = useAppSelector(state => state.workouts);
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');
  
  // Use useMemo to prevent filtering during every render - remove test user filtering
  const generatedWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const isAIGenerated = 
        workout.workoutType === 'AI Generated' || 
        workout.workoutType?.toLowerCase().includes('ai') ||
        (!!workout.generatedPlan && typeof workout.generatedPlan === 'string' && 
         workout.generatedPlan.length > 10);
      
      // We're no longer filtering out test users or test plans
      return isAIGenerated;
    });
  }, [workouts]); // Only recompute when workouts change
  
  // Fetch workouts when component mounts
  useEffect(() => {
    dispatch(fetchWorkouts());
    console.log("📊 WorkoutPlans: Fetching workouts...");
  }, [dispatch]);
  
  // Separate debug logging from render cycle and use useEffect to avoid render issues
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 WorkoutPlans: All workouts count:', workouts.length);
      const uniqueTypes = Array.from(new Set(workouts.map(w => w.workoutType || 'undefined')));
      console.log('🏷️ WorkoutPlans: Workout types present:', uniqueTypes);
      console.log('🔢 WorkoutPlans: AI Generated workouts found:', generatedWorkouts.length);
      if (generatedWorkouts.length > 0) {
        console.log('📊 WorkoutPlans: Generated workouts details:');
        generatedWorkouts.forEach((w, idx) => {
          console.log(`  ${idx+1}. ${w.name} (${w.id})`);
          console.log(`     - Type: ${w.workoutType}`);
          console.log(`     - Has plan data: ${!!w.generatedPlan}`);
          if (w.generatedPlan) {
            console.log(`     - Plan data type: ${typeof w.generatedPlan}`);
            const size = typeof w.generatedPlan === 'string' ? w.generatedPlan.length : 'unknown';
            console.log(`     - Plan data size: ${size} bytes`);
          }
        });
      }
    }
  }, [workouts, generatedWorkouts]); // Only run when these dependencies change
  
  const handleViewPlan = useCallback((id: string) => {
    navigate(`/workouts/${id}`);
  }, [navigate]);
  
  const handleEditPlan = useCallback((id: string) => {
    navigate(`/workouts/${id}/edit`);
  }, [navigate]);
  
  const handleNewPlan = useCallback(() => {
    navigate('/workouts/generate');
  }, [navigate]);

  // Helper function to extract plan data safely - placed outside render function
  const getPlanData = (workout: any) => {
    try {
      if (typeof workout.generatedPlan === 'string') {
        return JSON.parse(workout.generatedPlan).workoutPlan;
      } else if (workout.generatedPlan?.workoutPlan) {
        return workout.generatedPlan.workoutPlan;
      }
    } catch (error) {
      console.error('Error parsing workout plan:', error);
    }
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}
        >
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
            <Grid item xs={12} md={6} lg={4} key={workout.id || `workout-${Math.random()}`}>
              <WorkoutCard 
                workout={workout}
                onView={workout.id ? () => handleViewPlan(workout.id as string) : undefined}
                onEdit={workout.id ? () => handleEditPlan(workout.id as string) : undefined}
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
