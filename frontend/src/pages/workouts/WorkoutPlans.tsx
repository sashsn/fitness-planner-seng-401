// src/pages/workouts/WorkoutPlans.tsx
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { formatDate } from '../../utils/format';
import { getFitnessPlans, removeFitnessPlan } from '../../features/fitnessPlans/fitnessPlanSlice';

const WorkoutPlans: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { plans, loading, error } = useAppSelector((state) => state.fitnessPlans);

  useEffect(() => {
    dispatch(getFitnessPlans());
  }, [dispatch]);

  const handleViewPlan = useCallback((id: string) => {
    navigate(`/workouts/PlanDetails/${id}`);
  }, [navigate]);

  const handleDeletePlan = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      dispatch(removeFitnessPlan(id));
    }
  }, [dispatch]);

  const handleNewPlan = useCallback(() => {
    navigate('/workouts/GenerateWorkout');
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
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
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : plans.length === 0 ? (
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
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <Card>
                <CardHeader
                  title={plan.planDetails.workoutPlan.metadata.name || 'Workout Plan'}
                  subheader={formatDate(plan.createdAt)}
                  action={
                    <IconButton onClick={() => handleDeletePlan(plan.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {plan.planDetails.workoutPlan.overview.description}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewPlan(plan.id)}
                    >
                      View Plan
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WorkoutPlans;
