import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchMeals, fetchNutritionSummary, removeMeal } from '../../features/nutrition/nutritionSlice';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AlertMessage from '../../components/ui/AlertMessage';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card as MUICard, CardContent as MUICardContent } from '@mui/material';

const MealsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { meals } = useAppSelector((state) => state.nutrition);
  const [deleteMealId, setDeleteMealId] = useState<string | null>(null);

  // CHANGED: Added edit and delete functionality to each meal card.
  const handleEdit = (id: string) => {
    navigate(`/nutrition/${id}/editMeal`);
  };

  const handleDelete = (id: string) => {
    setDeleteMealId(id);
  };

  const confirmDelete = async () => {
    if (deleteMealId) {
      await dispatch(removeMeal(deleteMealId));
      setDeleteMealId(null);
    }
  };

  const mealsArray = Array.isArray(meals) ? meals : [];
  
  return (
    <Box sx={{ mt: 2 }}>
      {mealsArray.length === 0 ? (
        <Typography variant="body1">No meals recorded yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {meals.map((meal) => (
            <Grid item xs={12} md={6} key={meal.id}>
              <MUICard>
                <MUICardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{meal.name}</Typography>
                    <Box>
                      <EditIcon
                        fontSize="small"
                        sx={{ cursor: 'pointer', mr: 1 }}
                        onClick={() => handleEdit(meal.id!)}
                      />
                      <DeleteIcon
                        fontSize="small"
                        sx={{ cursor: 'pointer' }}
                        color="error"
                        onClick={() => handleDelete(meal.id!)}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {meal.mealType
                      ? meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)
                      : 'N/A'} - {meal.calories} kcal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(meal.date).toLocaleDateString()}
                  </Typography>
                </MUICardContent>
              </MUICard>
            </Grid>
          ))}
        </Grid>
      )}
      {deleteMealId && (
        // NEW: Confirmation dialog before deleting a meal.
        <ConfirmDialog 
          open={!!deleteMealId}
          title="Delete Meal"
          message="Are you sure you want to delete this meal? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteMealId(null)}
          confirmColor="error"
        />
      )}
    </Box>
  );
};

const NutritionSummary: React.FC = () => {
  const { nutritionSummary } = useAppSelector((state) => state.nutrition);

  if (!nutritionSummary) {
    return <Typography variant="body1">No summary data available.</Typography>;
  }

  const { summary, dailyBreakdown } = nutritionSummary;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Overall Summary</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle2">Total Calories</Typography>
          <Typography variant="body1">{summary.totalCalories}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="subtitle2">Daily Avg Calories</Typography>
          <Typography variant="body1">{summary.dailyAverageCalories.toFixed(0)}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyBreakdown}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalCalories" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.nutrition);
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchMeals());
    // dispatch(fetchNutritionSummary({}));
  }, [dispatch]);

  const handleAddMeal = () => {
    navigate('/nutrition/CreateMeal');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader 
        title="Nutrition" 
        subtitle="Track your meals and nutrition"
        action={{
          label: 'Add Meal',
          icon: <AddIcon />,
          onClick: handleAddMeal
        }}
      />

      {error && (
        <AlertMessage message={error} severity="error" />
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="nutrition tabs"
          >
            <Tab 
              icon={<RestaurantIcon />} 
              iconPosition="start"
              label="Meals" 
              id="nutrition-tab-0" 
              aria-controls="nutrition-tabpanel-0" 
            />
            {/* <Tab 
              icon={<AssessmentIcon />}
              iconPosition="start" 
              label="Summary" 
              id="nutrition-tab-1" 
              aria-controls="nutrition-tabpanel-1" 
            /> */}
          </Tabs>
        </Box>
        <CardContent>
          <div
            role="tabpanel"
            hidden={tabValue !== 0}
            id="nutrition-tabpanel-0"
            aria-labelledby="nutrition-tab-0"
          >
            {tabValue === 0 && <MealsList />}
          </div>
          <div
            role="tabpanel"
            hidden={tabValue !== 1}
            id="nutrition-tabpanel-1"
            aria-labelledby="nutrition-tab-1"
          >
            {/* {tabValue === 1 && <NutritionSummary />} */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Nutrition;
