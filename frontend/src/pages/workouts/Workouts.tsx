import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchWorkouts } from '../../features/workouts/workoutSlice';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// This is a placeholder for the Workouts page
// The actual implementation would include functionality to list workouts,
// filter them, and navigate to details or create new workouts

const Workouts: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workouts, loading, error } = useAppSelector((state) => state.workouts);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  const handleAddWorkout = () => {
    navigate('/workouts/create');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader 
        title="Workouts" 
        subtitle="Manage your workout routines"
        action={{
          label: 'Add Workout',
          icon: <AddIcon />,
          onClick: handleAddWorkout
        }}
      />

      {/* Workouts list would be rendered here */}
      <Box>
        {/* Placeholder for workout list component */}
        <div>Workouts will be listed here. Count: {workouts.length}</div>
        {error && <div>Error: {error}</div>}
      </Box>
    </Box>
  );
};

export default Workouts;
