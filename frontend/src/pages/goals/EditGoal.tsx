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
import { fetchGoalById, editGoal, clearGoalErrors } from '../../features/goals/goalSlice';
import { goalSchema } from '../../utils/validation';
import PageHeader from '../../components/ui/PageHeader';
import AlertMessage from '../../components/ui/AlertMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditGoal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentGoal, loading, error } = useAppSelector((state) => state.goals);

  useEffect(() => {
    if (id) {
      dispatch(fetchGoalById(id));
    }

    return () => {
      dispatch(clearGoalErrors());
    };
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      name: currentGoal?.name || '',
      description: currentGoal?.description || '',
      goalType: currentGoal?.goalType || '',
      targetValue: currentGoal?.targetValue || '',
      currentValue: currentGoal?.currentValue || '',
      unit: currentGoal?.unit || '',
      startDate: currentGoal?.startDate ? new Date(currentGoal.startDate) : new Date(),
      targetDate: currentGoal?.targetDate ? new Date(currentGoal.targetDate) : null,
      isCompleted: currentGoal?.isCompleted || false,
    },
    enableReinitialize: true,
    validationSchema: goalSchema,
    onSubmit: async (values) => {
      if (id) {
        const result = await dispatch(
          editGoal({
            id,
            goal: {
              ...values,
              goalType: values.goalType as 'weight' | 'strength' | 'endurance' | 'nutrition' | 'other',
              targetValue: Number(values.targetValue),
              currentValue: values.currentValue ? Number(values.currentValue) : undefined,
            }
          })
        );

        if (editGoal.fulfilled.match(result)) {
          navigate('/goals');
        }
      }
    },
  });

  if (loading && !currentGoal) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title="Edit Goal" subtitle="Update your fitness goal" />

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearGoalErrors())} 
        />
      )}

      <Card>
        <CardHeader title="Goal Information" />
        <Divider />
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Goal Name"
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
                <FormControl 
                  fullWidth 
                  error={formik.touched.goalType && Boolean(formik.errors.goalType)}
                >
                  <InputLabel id="goal-type-label">Goal Type</InputLabel>
                  <Select
                    labelId="goal-type-label"
                    id="goalType"
                    name="goalType"
                    value={formik.values.goalType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Goal Type"
                    disabled={loading}
                  >
                    <MenuItem value="weight">Weight</MenuItem>
                    <MenuItem value="strength">Strength</MenuItem>
                    <MenuItem value="endurance">Endurance</MenuItem>
                    <MenuItem value="nutrition">Nutrition</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {formik.touched.goalType && formik.errors.goalType && (
                    <FormHelperText>{formik.errors.goalType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="unit"
                  name="unit"
                  label="Unit (kg, steps, days, etc.)"
                  value={formik.values.unit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.unit && Boolean(formik.errors.unit)}
                  helperText={formik.touched.unit && formik.errors.unit}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="targetValue"
                  name="targetValue"
                  label="Target Value"
                  type="number"
                  value={formik.values.targetValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.targetValue && Boolean(formik.errors.targetValue)}
                  helperText={formik.touched.targetValue && formik.errors.targetValue}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="currentValue"
                  name="currentValue"
                  label="Current Value"
                  type="number"
                  value={formik.values.currentValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.currentValue && Boolean(formik.errors.currentValue)}
                  helperText={formik.touched.currentValue && formik.errors.currentValue}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.startDate}
                  onChange={(date) => formik.setFieldValue('startDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.startDate && Boolean(formik.errors.startDate),
                      helperText: formik.touched.startDate && formik.errors.startDate ? 
                        String(formik.errors.startDate) : undefined,
                      disabled: loading
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Target Date (Optional)"
                  value={formik.values.targetDate}
                  onChange={(date) => formik.setFieldValue('targetDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.targetDate && Boolean(formik.errors.targetDate),
                      helperText: formik.touched.targetDate && formik.errors.targetDate ? 
                        String(formik.errors.targetDate) : undefined,
                      disabled: loading
                    }
                  }}
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
                onClick={() => navigate('/goals')}
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

export default EditGoal;
