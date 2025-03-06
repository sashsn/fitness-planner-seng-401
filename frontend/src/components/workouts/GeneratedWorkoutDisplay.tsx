import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface GeneratedWorkoutDisplayProps {
  workoutPlanData: any;
}

const GeneratedWorkoutDisplay: React.FC<GeneratedWorkoutDisplayProps> = ({ workoutPlanData }) => {
  // Check if workoutPlanData is a string (JSON string) and parse it
  const workoutPlan = typeof workoutPlanData === 'string' 
    ? JSON.parse(workoutPlanData).workoutPlan 
    : workoutPlanData.workoutPlan;

  if (!workoutPlan) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography color="error">
          Invalid workout plan format. Please try again.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {workoutPlan.metadata.name}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Chip 
          label={`Goal: ${workoutPlan.metadata.goal}`} 
          color="primary" 
          sx={{ mr: 1, mb: 1 }}
        />
        <Chip 
          label={`Level: ${workoutPlan.metadata.fitnessLevel}`} 
          color="secondary" 
          sx={{ mr: 1, mb: 1 }}
        />
        <Chip 
          label={`${workoutPlan.metadata.durationWeeks} Weeks`} 
          variant="outlined" 
          sx={{ mb: 1 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>Overview</Typography>
      <Typography paragraph>{workoutPlan.overview.description}</Typography>
      
      <Typography variant="subtitle1" gutterBottom>Weekly Structure</Typography>
      <Typography paragraph>{workoutPlan.overview.weeklyStructure}</Typography>
      
      <Typography variant="subtitle1" gutterBottom>Equipment Needed</Typography>
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {workoutPlan.overview.recommendedEquipment.map((item: string, index: number) => (
          <Chip key={index} label={item} variant="outlined" size="small" />
        ))}
      </Box>
      
      <Typography variant="h6" gutterBottom>Workout Schedule</Typography>
      
      {workoutPlan.schedule.map((week: any) => (
        <Accordion key={week.week}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Week {week.week}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {week.days.map((day: any, dayIndex: number) => (
              <Box key={dayIndex} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {day.dayOfWeek}
                </Typography>
                
                {day.isRestDay ? (
                  <Typography>Rest Day - {day.recommendations}</Typography>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label={day.workoutType} color="primary" />
                      <Chip size="small" label={`Focus: ${day.focus}`} />
                      <Chip size="small" label={`${day.duration} minutes`} variant="outlined" />
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>Exercises:</Typography>
                    <List dense>
                      {day.exercises.map((exercise: any, exIndex: number) => (
                        <React.Fragment key={exIndex}>
                          <ListItem>
                            <ListItemText
                              primary={exercise.name}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {exercise.sets} sets × {exercise.reps} reps
                                    {exercise.weight && ` • ${exercise.weight}`}
                                  </Typography>
                                  {exercise.notes && (
                                    <Typography component="span" variant="body2" display="block">
                                      Note: {exercise.notes}
                                    </Typography>
                                  )}
                                </>
                              }
                            />
                          </ListItem>
                          {exIndex < day.exercises.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Warmup: {day.warmup.duration} min - {day.warmup.description}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Cooldown: {day.cooldown.duration} min - {day.cooldown.description}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Nutrition Guidelines</Typography>
        <Typography paragraph>{workoutPlan.nutrition.generalGuidelines}</Typography>
        <Typography><strong>Daily Protein Goal:</strong> {workoutPlan.nutrition.dailyProteinGoal}</Typography>
        <Typography><strong>Meal Timing:</strong> {workoutPlan.nutrition.mealTimingRecommendation}</Typography>
      </Box>
      
      {workoutPlan.additionalNotes && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Additional Notes</Typography>
          <Typography paragraph>{workoutPlan.additionalNotes}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GeneratedWorkoutDisplay;
