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
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {workout.description}
        </Typography>
        
        {workoutPlan && (
          <>
            <Divider sx={{ my: 1.5 }} />
            
            {workoutPlan.metadata && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" color="primary">
                  Goal: {workoutPlan.metadata.goal}
                </Typography>
                <Typography variant="subtitle2">
                  Level: {workoutPlan.metadata.fitnessLevel}
                </Typography>
              </Box>
            )}
            
            {workoutPlan.overview && (
              <Typography variant="body2" sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {workoutPlan.overview.weeklyStructure}
              </Typography>
            )}
          </>
        )}
      </CardContent>
      
      <CardActions>
        {onView && (
          <Button 
            size="small" 
            startIcon={<VisibilityIcon />}
            onClick={onView}
          >
            View
          </Button>
        )}
        {onEdit && (
          <Button 
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
