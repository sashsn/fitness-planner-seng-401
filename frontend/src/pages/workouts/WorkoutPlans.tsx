import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Stack,
  CardHeader,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { formatDate } from '../../utils/format';
import { fetchWorkouts } from '../../features/workouts/workoutSlice';

// Add types for cleaner code
interface EquipmentItem {
  name: string;
}

const WorkoutPlans: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { workouts, loading } = useAppSelector(state => state.workouts);
  
  // Filter for AI generated workouts only - use type guard approach
  const generatedWorkouts = workouts.filter(workout => 
    workout.workoutType === 'AI Generated' as any
  );
  
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);
  
  const handleViewPlan = (id: string) => {
    navigate(`/workouts/${id}`);
  };
  
  const handleEditPlan = (id: string) => {
    navigate(`/workouts/${id}/edit`);
  };
  
  const handleNewPlan = () => {
    navigate('/workouts/generate');
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant="h4" component="h1">
            Your Workout Plans
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<FitnessCenterIcon />}
            onClick={handleNewPlan}
          >
            Generate New Plan
          </Button>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          View and manage your AI-generated workout plans
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : generatedWorkouts.length > 0 ? (
        <Grid container spacing={3}>
          {generatedWorkouts.map(workout => {
            // Extract data from the generated plan with type safety
            const plan = (workout as any).generatedPlan?.workoutPlan;
            const goal = plan?.metadata?.goal || '';
            const level = plan?.metadata?.fitnessLevel || '';
            const duration = plan?.metadata?.durationWeeks || 4;
            const equipment: any[] = plan?.overview?.recommendedEquipment || [];
            
            return (
              <Grid item xs={12} md={6} key={workout.id}>
                <Card 
                  elevation={2} 
                  sx={{
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {workout.name.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={workout.name}
                    subheader={`Created: ${formatDate(workout.date)}`}
                    action={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Plan">
                          <IconButton 
                            onClick={() => handleViewPlan(workout.id as string)}
                            color="primary"
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Plan">
                          <IconButton 
                            onClick={() => handleEditPlan(workout.id as string)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  />
                  
                  <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                      {workout.description}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                      {goal && (
                        <Chip 
                          label={`Goal: ${goal}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      )}
                      
                      {level && (
                        <Chip 
                          label={`Level: ${level}`} 
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      )}
                      
                      <Chip 
                        label={`${duration} Weeks`} 
                        size="small"
                        icon={<CalendarTodayIcon />}
                        sx={{ mb: 1 }}
                      />
                    </Stack>
                    
                    {equipment.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Equipment:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {equipment.slice(0, 3).map((item: string, idx: number) => (
                            <Chip key={idx} label={item} size="small" variant="outlined" />
                          ))}
                          {equipment.length > 3 && (
                            <Chip label={`+${equipment.length - 3} more`} size="small" />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  
                  <Divider />
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewPlan(workout.id as string)}
                    >
                      View Details
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton 
                      edge="end" 
                      color="error" 
                      aria-label="delete"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 6, 
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <FitnessCenterIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" paragraph>
            No workout plans yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Generate your first AI workout plan to get started
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<FitnessCenterIcon />}
            onClick={handleNewPlan}
          >
            Generate Workout Plan
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default WorkoutPlans;
