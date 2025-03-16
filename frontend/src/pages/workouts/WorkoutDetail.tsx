import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Fixed import path
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchWorkoutById,
  removeWorkout, // Changed from deleteWorkout to removeWorkout
  clearWorkoutErrors
} from '../../features/workouts/workoutSlice';
import { formatDate } from '../../utils/format';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AlertMessage from '../../components/ui/AlertMessage';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import GeneratedWorkoutDisplay from '../../components/workouts/GeneratedWorkoutDisplay';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentWorkout, loading, error } = useAppSelector(state => state.workouts);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutById(id));
    }
  }, [id, dispatch]);

  const handleEdit = () => {
    navigate(`/workouts/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (id) {
      const resultAction = await dispatch(removeWorkout(id)); // Changed from deleteWorkout to removeWorkout
      if (removeWorkout.fulfilled.match(resultAction)) { // Changed from deleteWorkout to removeWorkout
        navigate('/workouts');
      }
    }
    setShowDeleteDialog(false);
  };

  const handleAddExercise = () => {
    // This would open a dialog or navigate to an add exercise page
    console.log('Add exercise clicked');
  };

  // Helper function to parse the workout plan
  const getParsedWorkoutPlan = () => {
    if (!currentWorkout?.generatedPlan) return null;
    
    try {
      if (typeof currentWorkout.generatedPlan === 'string') {
        return JSON.parse(currentWorkout.generatedPlan).workoutPlan;
      } else if (currentWorkout.generatedPlan?.workoutPlan) {
        return currentWorkout.generatedPlan.workoutPlan;
      }
      return null;
    } catch (error) {
      console.error('Error parsing workout plan:', error);
      return null;
    }
  };
  
  const workoutPlan = getParsedWorkoutPlan();

  if (loading || !currentWorkout) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title={currentWorkout.name} 
        subtitle={`${formatDate(currentWorkout.date)}`}
        action={{
          label: 'Edit Workout',
          icon: <EditIcon />,
          onClick: handleEdit
        }}
      />

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearWorkoutErrors())} 
        />
      )}

      <Box mb={2}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/workouts')}
          sx={{ mb: 2 }}
        >
          Back to Workouts
        </Button>
      </Box>

      {currentWorkout.workoutType === 'AI Generated' && workoutPlan ? (
        // Display AI-generated workout plan
        <GeneratedWorkoutDisplay workoutPlanData={currentWorkout.generatedPlan} />
      ) : (
        // Display regular workout
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Type</Typography>
              <Typography variant="body1" gutterBottom>{currentWorkout.workoutType}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Duration</Typography>
              <Typography variant="body1" gutterBottom>{currentWorkout.duration} minutes</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body1" paragraph>{currentWorkout.description}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              startIcon={<DeleteIcon />} 
              color="error" 
              onClick={handleDelete}
              sx={{ ml: 2 }}
            >
              Delete Workout
            </Button>
          </Box>
        </Paper>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmColor="error"
      />
    </Container>
  );
};

export default WorkoutDetail;
