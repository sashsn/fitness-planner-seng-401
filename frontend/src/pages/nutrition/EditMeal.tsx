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
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchMealById, editMeal, clearNutritionErrors } from '../../features/nutrition/nutritionSlice';
import { mealSchema } from '../../utils/validation';
import PageHeader from '../../components/ui/PageHeader';
import AlertMessage from '../../components/ui/AlertMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditMeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentMeal, loading, error } = useAppSelector((state) => state.nutrition);

  useEffect(() => {
    if (id) {
      dispatch(fetchMealById(id));
    }

    return () => {
      dispatch(clearNutritionErrors());
    };
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      name: currentMeal?.name || '',
      date: currentMeal?.date ? new Date(currentMeal.date) : new Date(),
      mealType: currentMeal?.mealType || '',
      calories: currentMeal?.calories || '',
      protein: currentMeal?.protein || '',
      carbs: currentMeal?.carbs || '',
      fat: currentMeal?.fat || '',
      description: currentMeal?.description || '',
    },
    enableReinitialize: true,
    validationSchema: mealSchema,
    onSubmit: async (values) => {
      if (id) {
        const result = await dispatch(
          editMeal({
            id,
            meal: {
              ...values,
              mealType: values.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
              calories: values.calories ? Number(values.calories) : undefined,
              protein: values.protein ? Number(values.protein) : undefined,
              carbs: values.carbs ? Number(values.carbs) : undefined,
              fat: values.fat ? Number(values.fat) : undefined,
            }
          })
        );

        if (editMeal.fulfilled.match(result)) {
          navigate('/nutrition/Nutrition');
        }
      }
    },
  });

  if (loading && !currentMeal) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title="Edit Meal" subtitle="Update meal information" />

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearNutritionErrors())} 
        />
      )}

      <Card>
        <CardHeader title="Meal Information" />
        <Divider />
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Meal Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
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
                  error={formik.touched.mealType && Boolean(formik.errors.mealType)}
                >
                  <InputLabel id="meal-type-label">Meal Type</InputLabel>
                  <Select
                    labelId="meal-type-label"
                    id="mealType"
                    name="mealType"
                    value={formik.values.mealType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Meal Type"
                    disabled={loading}
                  >
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    <MenuItem value="lunch">Lunch</MenuItem>
                    <MenuItem value="dinner">Dinner</MenuItem>
                    <MenuItem value="snack">Snack</MenuItem>
                  </Select>
                  {formik.touched.mealType && formik.errors.mealType && (
                    <FormHelperText>{formik.errors.mealType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="calories"
                  name="calories"
                  label="Calories"
                  type="number"
                  value={formik.values.calories}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.calories && Boolean(formik.errors.calories)}
                  helperText={formik.touched.calories && formik.errors.calories}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="protein"
                  name="protein"
                  label="Protein (g)"
                  type="number"
                  value={formik.values.protein}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.protein && Boolean(formik.errors.protein)}
                  helperText={formik.touched.protein && formik.errors.protein}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="carbs"
                  name="carbs"
                  label="Carbs (g)"
                  type="number"
                  value={formik.values.carbs}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.carbs && Boolean(formik.errors.carbs)}
                  helperText={formik.touched.carbs && formik.errors.carbs}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="fat"
                  name="fat"
                  label="Fat (g)"
                  type="number"
                  value={formik.values.fat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fat && Boolean(formik.errors.fat)}
                  helperText={formik.touched.fat && formik.errors.fat}
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
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/nutrition/Nutrition')}
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

export default EditMeal;
