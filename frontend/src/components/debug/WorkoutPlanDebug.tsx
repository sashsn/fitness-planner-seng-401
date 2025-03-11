import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  TextField,
  Divider,
  Chip,
  Alert
} from '@mui/material';

interface WorkoutPlanDebugProps {
  workoutData: any;
}

const WorkoutPlanDebug: React.FC<WorkoutPlanDebugProps> = ({ workoutData }) => {
  const [expanded, setExpanded] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!workoutData) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#fff8e1' }}>
        <Typography color="error" fontFamily="monospace">
          No workout plan data available
        </Typography>
      </Paper>
    );
  }

  // Try to parse the generatedPlan if it's a string
  let planData;
  let planStructure = 'unknown';
  
  try {
    if (typeof workoutData.generatedPlan === 'string') {
      planData = JSON.parse(workoutData.generatedPlan);
      planStructure = 'JSON string';
    } else if (workoutData.generatedPlan === null) {
      planData = { error: 'Plan data is null' };
      planStructure = 'null';
    } else if (typeof workoutData.generatedPlan === 'object') {
      planData = workoutData.generatedPlan;
      planStructure = 'object';
    } else {
      planData = { error: `Unknown plan data type: ${typeof workoutData.generatedPlan}` };
      planStructure = typeof workoutData.generatedPlan;
    }
    setParseError(null);
  } catch (error: any) {
    console.error('Error parsing workout plan data:', error);
    planData = { error: 'Failed to parse plan data' };
    setParseError(error.message);
    planStructure = 'invalid JSON';
  }

  // Check if the plan has the expected structure
  const hasPlanStructure = !!planData?.workoutPlan;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', overflow: 'auto' }}>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Debug: Workout ID {workoutData.id}
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
        <Chip 
          label={`Type: ${workoutData.workoutType}`} 
          color={workoutData.workoutType === 'AI Generated' ? 'success' : 'default'} 
          size="small" 
        />
        <Chip 
          label={`Plan Format: ${planStructure}`} 
          color={hasPlanStructure ? 'success' : 'error'} 
          size="small" 
        />
        <Chip 
          label={`Has Plan: ${!!workoutData.generatedPlan ? 'Yes' : 'No'}`} 
          color={!!workoutData.generatedPlan ? 'success' : 'error'}
          size="small" 
        />
      </Box>
      
      <Typography variant="body2" fontFamily="monospace" mb={1}>
        Name: {workoutData.name}<br />
        Creation Date: {new Date(workoutData.date).toLocaleString()}<br />
      </Typography>

      {parseError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Parse error: {parseError}
        </Alert>
      )}
      
      {!hasPlanStructure && workoutData.generatedPlan && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          Plan data exists but doesn't have the expected structure
        </Alert>
      )}
      
      <Button 
        size="small" 
        variant="outlined" 
        onClick={() => setExpanded(!expanded)}
        sx={{ mb: 1 }}
      >
        {expanded ? 'Hide Details' : 'Show Details'}
      </Button>
      
      {expanded && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Raw Plan Data:
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={JSON.stringify(planData, null, 2)}
            InputProps={{
              readOnly: true,
              sx: { fontFamily: 'monospace', fontSize: '0.75rem' }
            }}
          />
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Raw Workout Object:
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={6}
            value={JSON.stringify({
              id: workoutData.id,
              name: workoutData.name,
              workoutType: workoutData.workoutType,
              date: workoutData.date,
              // Only show first 500 chars of generatedPlan if it's a string
              generatedPlan: typeof workoutData.generatedPlan === 'string' 
                ? workoutData.generatedPlan.substring(0, 100) + '...' 
                : workoutData.generatedPlan
            }, null, 2)}
            InputProps={{
              readOnly: true,
              sx: { fontFamily: 'monospace', fontSize: '0.75rem' }
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default WorkoutPlanDebug;
