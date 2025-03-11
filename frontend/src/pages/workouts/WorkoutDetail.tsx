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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
                    {currentWorkout.caloriesBurned !== undefined ? currentWorkout.caloriesBurned : 0} cal
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

        {/* Add AI Generated Plan Details if available */}
        {currentWorkout.workoutType === 'AI Generated' && workoutPlan && (
          <Grid item xs={12}>
            <Card sx={{ mt: 3 }}>
              <CardHeader title="AI-Generated Workout Plan" />
              <Divider />
              <CardContent>
                {/* Metadata */}
                <Box mb={3}>
                  <Typography variant="h6">Plan Overview</Typography>
                  <Typography variant="body2" paragraph>{workoutPlan.overview.description}</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">Goal</Typography>
                      <Typography variant="body2">{workoutPlan.metadata.goal}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">Level</Typography>
                      <Typography variant="body2">{workoutPlan.metadata.fitnessLevel}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                      <Typography variant="body2">{workoutPlan.metadata.durationWeeks} weeks</Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Weekly Schedule */}
                <Typography variant="h6" gutterBottom>Weekly Schedule</Typography>
                {workoutPlan.schedule.map((week: any) => (
                  <Accordion key={week.week}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Week {week.week}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {week.days.map((day: any, idx: number) => (
                          <Grid item xs={12} key={idx}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {day.dayOfWeek}
                            </Typography>
                            {day.isRestDay ? (
                              <Typography variant="body2">Rest Day</Typography>
                            ) : (
                              <>
                                <Typography variant="body2">
                                  {day.workoutType} - {day.focus} ({day.duration} min)
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Exercises: {day.exercises.map((ex: any) => ex.name).join(', ')}
                                </Typography>
                              </>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
                
                {/* Nutrition Guidelines */}
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>Nutrition Guidelines</Typography>
                  <Typography variant="body2" paragraph>{workoutPlan.nutrition.generalGuidelines}</Typography>
                  <Typography variant="body2">
                    <strong>Daily Protein Goal:</strong> {workoutPlan.nutrition.dailyProteinGoal}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
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
