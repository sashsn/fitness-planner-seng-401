import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchGoals, removeGoal, clearGoalErrors } from '../../features/goals/goalSlice';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AlertMessage from '../../components/ui/AlertMessage';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatDate } from '../../utils/format';

const Goals: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { goals, loading, error } = useAppSelector((state) => state.goals);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleAddGoal = () => {
    navigate('/goals/CreateGoal');
  };

  const handleEditGoal = (id: string) => {
    navigate(`/goals/${id}/EditGoal`);
  };

  const handleDeleteGoal = (id: string) => {
    setDeleteGoalId(id);
  };

  const confirmDeleteGoal = async () => {
    if (deleteGoalId) {
      await dispatch(removeGoal(deleteGoalId));
      setDeleteGoalId(null);
    }
  };

  if (loading && goals.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader 
        title="Fitness Goals" 
        subtitle="Track your progress towards your fitness objectives"
        action={{
          label: 'Add Goal',
          icon: <AddIcon />,
          onClick: handleAddGoal
        }}
      />

      {error && (
        <AlertMessage 
          message={error} 
          severity="error" 
          onClose={() => dispatch(clearGoalErrors())} 
        />
      )}

          
    {Array.isArray(goals) && goals.length > 0 ? (
        
        <Grid container spacing={3}>
          {goals.map((goal) => {
            console.log("the goal: ", goal);
            const progress = goal.currentValue && goal.targetValue 
              ? (goal.currentValue / goal.targetValue * 100) 
              : 0;
              
            return (
              <Grid item xs={12} md={6} key={goal.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {goal.name}
                        {goal.isCompleted && (
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Completed" 
                            color="success" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditGoal(goal.id!)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteGoal(goal.id!)} 
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {goal.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Type:
                        </Typography>
                        <Typography variant="body2">
                          {goal.goalType.charAt(0).toUpperCase() + goal.goalType.slice(1)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Target Date:
                        </Typography>
                        <Typography variant="body2">
                          {goal.targetDate ? formatDate(goal.targetDate) : 'Not set'}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    
                    {!goal.isCompleted && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(progress, 100)} 
                          sx={{ mt: 1, height: 8, borderRadius: 1 }} 
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );   
          })}
        </Grid>

        ) : (
        <Card>
          <CardContent>
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No goals set yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create your first fitness goal to start tracking your progress.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteGoalId}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteGoal}
        onCancel={() => setDeleteGoalId(null)}
        confirmColor="error"
      />
    </>
  );
};

export default Goals;
