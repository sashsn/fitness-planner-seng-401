import React, { useState } from 'react';
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
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

interface GeneratedWorkoutDisplayProps {
  workoutPlanData: any;
  onSave?: (name: string, plan: any) => void;
}

const GeneratedWorkoutDisplay: React.FC<GeneratedWorkoutDisplayProps> = ({ 
  workoutPlanData, 
  onSave 
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleSaveDialogOpen = () => {
    setWorkoutName(workoutPlan.metadata.name || '');
    setSaveDialogOpen(true);
    setSaveSuccess(false);
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
  };

  const handleSaveWorkout = () => {
    if (onSave) {
      onSave(workoutName, workoutPlan);
      setSaveSuccess(true);
      // Close dialog after a short delay
      setTimeout(() => {
        setSaveDialogOpen(false);
      }, 1500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    // Create a simplified text version of the workout plan
    const planText = `
${workoutPlan.metadata.name}
Goal: ${workoutPlan.metadata.goal}
Level: ${workoutPlan.metadata.fitnessLevel}

${workoutPlan.overview.description}

Weekly Structure: ${workoutPlan.overview.weeklyStructure}
Equipment: ${workoutPlan.overview.recommendedEquipment.join(', ')}

SCHEDULE:
${workoutPlan.schedule.map((week: any) => `
WEEK ${week.week}:
${week.days.map((day: any) => `
${day.dayOfWeek}: ${day.isRestDay ? 'Rest Day' : `${day.workoutType} - ${day.focus} (${day.duration} min)
  Exercises:
${day.exercises.map((ex: any) => `  - ${ex.name}: ${ex.sets} sets × ${ex.reps} reps`).join('\n')}`}`).join('\n')}
`).join('\n')}

Nutrition Guidelines:
${workoutPlan.nutrition.generalGuidelines}
Daily Protein Goal: ${workoutPlan.nutrition.dailyProteinGoal}

${workoutPlan.additionalNotes}
    `;

    navigator.clipboard.writeText(planText)
      .then(() => {
        alert('Workout plan copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      // Use dynamic imports with type assertions
      const jsPDFModule = await import('jspdf');
      const html2CanvasModule = await import('html2canvas');
      
      const jsPDF = jsPDFModule.default;
      const html2canvas = html2CanvasModule.default;
      
      // Get the workout plan container
      const element = document.getElementById('workout-plan-container');
      if (!element) {
        alert('Could not find workout plan element');
        setIsGeneratingPDF(false);
        return;
      }
      
      // Create canvas from the DOM element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if needed
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`${workoutName || 'workout-plan'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again later.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Paper id="workout-plan-container" elevation={3} sx={{ 
      p: 3, 
      position: 'relative',
      '@media print': {
        boxShadow: 'none',
        padding: '0',
      }
    }}>
      {/* Action buttons */}
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16,
          '@media print': {
            display: 'none',
          }
        }}
      >
        <Tooltip title="Save Workout">
          <IconButton color="primary" onClick={handleSaveDialogOpen}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Print Workout">
          <IconButton color="primary" onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy to Clipboard">
          <IconButton color="primary" onClick={handleCopyToClipboard}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download PDF">
          <IconButton color="primary" onClick={handleDownloadPDF}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Stack>

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

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={handleSaveDialogClose}>
        <DialogTitle>Save Workout Plan</DialogTitle>
        <DialogContent>
          {saveSuccess ? (
            <DialogContentText color="success.main">
              Workout plan saved successfully!
            </DialogContentText>
          ) : (
            <>
              <DialogContentText>
                Enter a name for this workout plan to save it to your workouts.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Workout Plan Name"
                type="text"
                fullWidth
                variant="outlined"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveWorkout} 
            color="primary"
            disabled={!workoutName.trim() || saveSuccess}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add loading indicator for PDF generation */}
      {isGeneratingPDF && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(255,255,255,0.7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 10
        }}>
          <Typography>Generating PDF...</Typography>
          <CircularProgress sx={{ ml: 2 }} />
        </Box>
      )}
    </Paper>
  );
};

export default GeneratedWorkoutDisplay;
