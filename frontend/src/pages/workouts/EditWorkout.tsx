import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchWorkoutById, editWorkout, clearWorkoutErrors } from '../../features/workouts/workoutSlice';
import { workoutSchema } from '../../utils/validation';
import PageHeader from '../../components/ui/PageHeader';
import AlertMessage from '../../components/ui/AlertMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditWorkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentWorkout, loading, error } = useAppSelector((state) => state.workouts);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutById(id));
    }

    return () => {
      dispatch(clearWorkoutErrors());
    };
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      name: currentWorkout?.name || '',
      description: currentWorkout?.description || '',
      date: currentWorkout?.date ? new Date(currentWorkout.date) : new Date(),
      duration: currentWorkout?.duration || '',
      caloriesBurned: currentWorkout?.caloriesBurned || '',
      workoutType: currentWorkout?.workoutType || 'other',
      isCompleted: currentWorkout?.isCompleted || false,
    },
    enableReinitialize: true,
    validationSchema: workoutSchema,
    onSubmit: async (values) => {
      if (id) {
        const result = await dispatch(
          editWorkout({
            id,
            workout: {
              ...currentWorkout,       // Spread existing data first
              ...values,               // Then override with new values
              duration: values.duration ? Number(values.duration) : 0,
              caloriesBurned: values.caloriesBurned ? Number(values.caloriesBurned) : undefined,
              // Preserve arrays and objects from currentWorkout if not updated
              exercises: currentWorkout?.exercises || [],
              userId: currentWorkout?.userId || 'current-user',
              intensity: currentWorkout?.intensity || 'medium'
            }
          })
        );
    
        if (editWorkout.fulfilled.match(result)) {
          navigate(`/workouts/${id}`);
        }
      }
    },
  });

  if (loading && !currentWorkout) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title="Edit Workout" subtitle="Update workout details" />

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearWorkoutErrors())} 
        />
      )}

      <Card>
        <CardHeader title="Workout Information" />
        <Divider />
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Workout Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) => formik.setFieldValue('date', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date ? 
                        String(formik.errors.date) : undefined,
                      disabled: loading
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  error={formik.touched.workoutType && Boolean(formik.errors.workoutType)}
                >
                  <InputLabel id="workout-type-label">Workout Type</InputLabel>
                  <Select
                    labelId="workout-type-label"
                    id="workoutType"
                    name="workoutType"
                    value={formik.values.workoutType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Workout Type"
                    disabled={loading}
                  >
                    <MenuItem value="cardio">Cardio</MenuItem>
                    <MenuItem value="strength">Strength</MenuItem>
                    <MenuItem value="flexibility">Flexibility</MenuItem>
                    <MenuItem value="balance">Balance</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {formik.touched.workoutType && formik.errors.workoutType && (
                    <FormHelperText>{formik.errors.workoutType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="duration"
                  name="duration"
                  label="Duration (minutes)"
                  type="number"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.duration && Boolean(formik.errors.duration)}
                  helperText={formik.touched.duration && formik.errors.duration}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="caloriesBurned"
                  name="caloriesBurned"
                  label="Calories Burned"
                  type="number"
                  value={formik.values.caloriesBurned}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.caloriesBurned && Boolean(formik.errors.caloriesBurned)}
                  helperText={formik.touched.caloriesBurned && (formik.errors.caloriesBurned as string)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      id="isCompleted"
                      name="isCompleted"
                      checked={formik.values.isCompleted}
                      onChange={formik.handleChange}
                      disabled={loading}
                    />
                  }
                  label="Mark as completed"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(`/workouts/${id}`)}
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default EditWorkout;
