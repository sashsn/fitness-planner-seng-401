import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchWorkoutById, removeWorkout, clearWorkoutErrors } from '../../features/workouts/workoutSlice';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AlertMessage from '../../components/ui/AlertMessage';
import { formatDate, formatDuration } from '../../utils/format';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentWorkout, loading, error } = useAppSelector((state) => state.workouts);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutById(id));
    }

    return () => {
      dispatch(clearWorkoutErrors());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/workouts/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (id) {
      await dispatch(removeWorkout(id));
      navigate('/workouts');
    }
    setShowDeleteDialog(false);
  };

  const handleAddExercise = () => {
    // This would open a dialog or navigate to an add exercise page
    console.log('Add exercise clicked');
  };

  if (loading || !currentWorkout) {
    return <LoadingSpinner />;
  }

  return (
    <>
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Workout Details"
              action={
                <IconButton
                  aria-label="delete"
                  onClick={handleDelete}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    {currentWorkout.description || 'No description provided.'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2">
                    {currentWorkout.workoutType}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2">
                    {formatDuration(currentWorkout.duration)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Calories
                  </Typography>
                  <Typography variant="body2">
                    {currentWorkout.caloriesBurned || 0} cal
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={currentWorkout.isCompleted ? <CheckCircleIcon /> : undefined}
                    label={currentWorkout.isCompleted ? 'Completed' : 'In Progress'}
                    color={currentWorkout.isCompleted ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Exercises" 
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddExercise}
                  size="small"
                >
                  Add Exercise
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {currentWorkout.exercises && currentWorkout.exercises.length > 0 ? (
                  currentWorkout.exercises.map((exercise, index) => (
                    <ListItem key={exercise.id || index} divider>
                      <ListItemText
                        primary={exercise.name}
                        secondary={
                          <>
                            {exercise.sets && exercise.reps ? 
                              `${exercise.sets} sets × ${exercise.reps} reps` : ''}
                            {exercise.weight ? ` • ${exercise.weight} kg` : ''}
                            {exercise.distance ? ` • ${exercise.distance} km` : ''}
                            {exercise.duration ? ` • ${Math.round(exercise.duration / 60)} min` : ''}
                            {exercise.notes ? ` • ${exercise.notes}` : ''}
                          </>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No exercises added yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </>
  );
};

export default WorkoutDetail;
