import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchWorkouts } from '../features/workouts/workoutSlice';
import { fetchMeals } from '../features/nutrition/nutritionSlice';
import { fetchGoals } from '../features/goals/goalSlice';
import { fetchProfile } from '../features/profile/profileSlice';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate } from '../utils/format';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { workouts, loading: workoutsLoading } = useAppSelector((state) => state.workouts);
  const { meals, loading: mealsLoading } = useAppSelector((state) => state.nutrition);
  const { goals, loading: goalsLoading } = useAppSelector((state) => state.goals);
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(fetchMeals());
    dispatch(fetchGoals());
    dispatch(fetchProfile());
  }, [dispatch]);

  const isLoading = workoutsLoading || mealsLoading || goalsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader 
        title={`Welcome, ${user?.firstName || user?.username || 'User'}!`} 
        subtitle="Here's your fitness overview"
      />
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Workouts" avatar={<FitnessCenterIcon />} />
            <CardContent>
              <Typography variant="h3" align="center" gutterBottom>
                {workouts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Total Workouts
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/workouts/create')}
                >
                  Add Workout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Nutrition" avatar={<RestaurantIcon />} />
            <CardContent>
              <Typography variant="h3" align="center" gutterBottom>
                {meals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Meals Tracked
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/nutrition/create')}
                >
                  Add Meal
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Goals" avatar={<TrackChangesIcon />} />
            <CardContent>
              <Typography variant="h3" align="center" gutterBottom>
                {goals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Active Goals
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/goals/create')}
                >
                  Add Goal
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Workouts" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {workouts.length > 0 ? (
                  workouts.slice(0, 5).map((workout) => (
                    <ListItem 
                      key={workout.id} 
                      button 
                      onClick={() => navigate(`/workouts/${workout.id}`)}
                      divider
                    >
                      <ListItemText 
                        primary={workout.name} 
                        secondary={`${formatDate(workout.date)} • ${workout.workoutType}`} 
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No workouts yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Goal Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Goal Progress" />
            <Divider />
            <CardContent>
              {goals.length > 0 ? (
                goals.slice(0, 3).map((goal) => {
                  const progress = goal.currentValue && goal.targetValue 
                    ? (goal.currentValue / goal.targetValue * 100) 
                    : 0;
                    
                  return (
                    <Box key={goal.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{goal.name}</Typography>
                        <Typography variant="body2">
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress > 100 ? 100 : progress} 
                        sx={{ mt: 1, mb: 1 }} 
                      />
                    </Box>
                  );
                })
              ) : (
                <Typography>No goals set yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Workout Generator */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <FitnessCenterIcon fontSize="large" color="primary" />
                <Typography variant="h6" ml={1}>Workout Generator</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create a personalized workout plan based on your preferences and fitness goals.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/workouts/generate"
                fullWidth
              >
                Create Workout Plan
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
