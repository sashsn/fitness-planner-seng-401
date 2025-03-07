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

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchMeals, fetchNutritionSummary } from '../../features/nutrition/nutritionSlice';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AlertMessage from '../../components/ui/AlertMessage';

// This is a placeholder component for the meals list
const MealsList: React.FC = () => {
  const { meals } = useAppSelector((state) => state.nutrition);
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1">
        Meals will be listed here. Count: {meals.length}
      </Typography>
    </Box>
  );
};

// This is a placeholder component for the nutrition summary
const NutritionSummary: React.FC = () => {
  const { nutritionSummary } = useAppSelector((state) => state.nutrition);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1">
        Nutrition summary charts and data will be displayed here.
      </Typography>
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
    dispatch(fetchNutritionSummary({}));
  }, [dispatch]);

  const handleAddMeal = () => {
    navigate('/nutrition/create');
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
            <Tab 
              icon={<AssessmentIcon />}
              iconPosition="start" 
              label="Summary" 
              id="nutrition-tab-1" 
              aria-controls="nutrition-tabpanel-1" 
            />
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
            {tabValue === 1 && <NutritionSummary />}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Nutrition;
