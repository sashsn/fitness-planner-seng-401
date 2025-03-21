import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SelectChangeEvent } from '@mui/material/Select'; // CHANGED: Use correct type for Select event
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchWorkouts } from '../../features/workouts/workoutSlice';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AlertMessage from '../../components/ui/AlertMessage';

const Workouts: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workouts, loading, error } = useAppSelector((state) => state.workouts);

  //  Ensure  workouts is an array, even if the API or state is bad.
  const workoutsArray = Array.isArray(workouts) ? workouts : [];

  // Local state for filtering workouts
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // NEW: Filter workouts based on search term and workout type using the safe array
  const filteredWorkouts = useMemo(() => {
    return workoutsArray.filter((workout) => {
      const name = workout.name || '';
      const type = workout.workoutType || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [workoutsArray, searchTerm, filterType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setFilterType(event.target.value);
  };

  // Navigate to workout detail page
  const handleViewWorkout = (id: string) => {
    navigate(`/workouts/${id}`);
  };

  // Navigate to create workout page
  const handleAddWorkout = () => {
    navigate('/workouts/CreateWorkout');
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

      {error && <AlertMessage message={error} severity="error" />}

      {/* Filtering Controls */}
      <Box sx={{ my: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField 
          label="Search Workouts" 
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel id="workout-type-filter-label">Workout Type</InputLabel>
          <Select
            labelId="workout-type-filter-label"
            value={filterType}
            onChange={handleTypeChange}
            label="Workout Type"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="cardio">Cardio</MenuItem>
            <MenuItem value="strength">Strength</MenuItem>
            <MenuItem value="flexibility">Flexibility</MenuItem>
            <MenuItem value="balance">Balance</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredWorkouts.length > 0 ? (
        <Grid container spacing={3}>
          {filteredWorkouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout.id ?? Math.random().toString()}>
              <Card 
                sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
                onClick={() => workout.id ? handleViewWorkout(workout.id as string) : null}
              >
                <CardHeader 
                  title={workout.name || 'Unnamed Workout'} // Fallback for missing name
                  subheader={workout.date ? new Date(workout.date).toLocaleDateString() : 'No Date'}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Type: {workout.workoutType || 'N/A'} {/* Fallback for missing workoutType */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {workout.duration ?? '0'} min
                  </Typography>
                  {workout.caloriesBurned !== undefined && (
                    <Typography variant="body2" color="text.secondary">
                      Calories Burned: {workout.caloriesBurned} cal
                    </Typography>
                  )}
                  {workout.isCompleted && (
                    <Typography variant="body2" color="success.main">
                      Completed
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No workouts found.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddWorkout}
            sx={{ mt: 2 }}
          >
            Add Your First Workout
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Workouts;
