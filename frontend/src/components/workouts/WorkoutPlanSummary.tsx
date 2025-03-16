import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  Divider, 
  Grid, 
  Typography, 
  Stack,
  Button,
  IconButton
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface WorkoutPlanSummaryProps {
  plan: any;
  onViewDetails?: () => void;
}

const WorkoutPlanSummary: React.FC<WorkoutPlanSummaryProps> = ({ plan, onViewDetails }) => {
  // Safely extract plan data
  const getPlanData = () => {
    try {
      if (typeof plan.generatedPlan === 'string') {
        return JSON.parse(plan.generatedPlan).workoutPlan;
      } else if (plan.generatedPlan?.workoutPlan) {
        return plan.generatedPlan.workoutPlan;
      }
      return null;
    } catch (error) {
      console.error('Error parsing plan data:', error);
      return null;
    }
  };

  const planData = getPlanData();

  if (!planData) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography color="error">
            Unable to display plan details. The plan data is invalid or corrupted.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      mb: 3, 
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      }
    }}>
      <CardHeader
        title={plan.name || planData.metadata?.name || 'Unnamed Workout Plan'}
        subheader={
          <Box display="flex" alignItems="center" mt={0.5}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(plan.date || planData.metadata?.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        }
        action={
          onViewDetails && (
            <IconButton onClick={onViewDetails} aria-label="View details">
              <VisibilityIcon />
            </IconButton>
          )
        }
      />
      
      <Divider />
      
      <CardContent>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip 
            icon={<FitnessCenterIcon />}
            label={`Goal: ${planData.metadata?.goal || 'General Fitness'}`} 
            color="primary" 
            size="small"
          />
          <Chip 
            label={`Level: ${planData.metadata?.fitnessLevel || 'Beginner'}`} 
            variant="outlined"
            size="small"
          />
          <Chip 
            icon={<AccessTimeIcon />} 
            label={`${planData.metadata?.durationWeeks || '4'} weeks`} 
            variant="outlined"
            size="small"
          />
        </Stack>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {planData.overview?.description || 'No description available.'}
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="primary">Weekly Structure:</Typography>
            <Typography variant="body2">
              {planData.overview?.weeklyStructure || 'Not specified'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="primary">Equipment:</Typography>
            <Typography variant="body2">
              {planData.overview?.recommendedEquipment?.join(', ') || 'None specified'}
            </Typography>
          </Grid>
        </Grid>
        
        {onViewDetails && (
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button 
              variant="outlined" 
              size="small" 
              onClick={onViewDetails}
              endIcon={<VisibilityIcon />}
            >
              View Full Plan
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutPlanSummary;
