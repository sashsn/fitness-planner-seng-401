import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { formatDate } from '../../utils/format';

interface WorkoutCardProps {
  workout: any;
  onView?: () => void;
  onEdit?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onView, onEdit }) => {
  // Safely get workout plan data if available
  const getPlanData = () => {
    try {
      if (typeof workout.generatedPlan === 'string') {
        return JSON.parse(workout.generatedPlan).workoutPlan;
      } else if (workout.generatedPlan?.workoutPlan) {
        return workout.generatedPlan.workoutPlan;
      }
    } catch (error) {
      console.error('Error parsing workout plan:', error);
    }
    return null;
  };

  const workoutPlan = getPlanData();
  
  return (
    <Card elevation={2} sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {workout.name}
          </Typography>
          <Chip 
            label={workout.workoutType} 
            color={workout.workoutType === 'AI Generated' ? 'primary' : 'default'}
            size="small"
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(workout.date)}
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {workoutPlan?.overview?.description || workout.description}
        </Typography>
        
        {workoutPlan?.metadata?.fitnessLevel && (
          <Chip
            size="small"
            label={`Level: ${workoutPlan.metadata.fitnessLevel}`}
            sx={{ mr: 1, mb: 1 }}
          />
        )}
        
        {workoutPlan?.metadata?.goal && (
          <Chip
            size="small"
            label={`Goal: ${workoutPlan.metadata.goal}`}
            sx={{ mr: 1, mb: 1 }}
          />
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions>
        {onView && (
          <Button 
            startIcon={<VisibilityIcon />}
            onClick={onView}
            size="small"
          >
            View Plan
          </Button>
        )}
        {onEdit && (
          <Button
            startIcon={<EditIcon />}
            onClick={onEdit}
            size="small"
          >
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
