import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { getFitnessPlanById, clearSelectedPlan } from '../../features/fitnessPlans/fitnessPlanSlice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedPlan, loading, error } = useAppSelector((state) => state.fitnessPlans);

  useEffect(() => {
    if (id) {
      dispatch(getFitnessPlanById(id));
    }
    return () => {
      dispatch(clearSelectedPlan());
    };
  }, [dispatch, id]);

  const handleDownload = async () => {
    if (!selectedPlan) return;
    
    const input = document.getElementById('plan-container');
    if (!input) return;
    
    // Temporarily remove overflow restrictions to capture full content
    const originalOverflow = input.style.overflow;
    input.style.overflow = 'visible';
    
    try {
      // Capture the entire plan container (using full scrollHeight)
      const canvas = await html2canvas(input, { scale: 2, height: input.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      
      // Create a jsPDF instance (A4 dimensions in pt)
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate scale factor so that the entire canvas fits on one page
      const scale = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const imgWidth = canvas.width * scale;
      const imgHeight = canvas.height * scale;
      
      // Calculate x and y offsets to center the image on the PDF page
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = (pageHeight - imgHeight) / 2;
      
      // Add the image to the PDF at the computed position
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      
      const planName = selectedPlan?.planDetails?.workoutPlan?.metadata?.name || 'workout-plan';
      pdf.save(`${planName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      // Restore the original overflow style
      input.style.overflow = originalOverflow;
    }
  }; 
  

  const handleBack = () => {
    navigate(-1);
  };

  if (loading || !selectedPlan) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography variant="h6">Loading plan details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={handleBack}>Back</Button>
      </Container>
    );
  }

  const { workoutPlan } = selectedPlan.planDetails;
  const { metadata, overview, schedule, nutrition, progressionPlan, additionalNotes } = workoutPlan;

  return (
    <Container maxWidth="md">
      <Box my={4} id="plan-container">
        {/* Header with Back and Download buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {metadata.name}
          </Typography>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
            Download Plan
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {metadata.goal} • {metadata.fitnessLevel} • {metadata.durationWeeks} Weeks
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Overview Section */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="Overview" />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {overview.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Weekly Structure: {overview.weeklyStructure}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated Time per Session: {overview.estimatedTimePerSession} minutes
            </Typography>
            {overview.recommendedEquipment && (
              <Typography variant="body2" color="text.secondary">
                Equipment: {overview.recommendedEquipment.join(', ')}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Schedule Section */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="Schedule" />
          <CardContent>
            {schedule.map((week: any, index: number) => (
              <Box key={index} mb={2}>
                <Typography variant="h6">Week {week.week}</Typography>
                {week.days.map((day: any, dayIndex: number) => (
                  <Box key={dayIndex} pl={2} mb={1}>
                    <Typography variant="subtitle1">
                      {day.dayOfWeek} — {day.workoutType} ({day.duration} minutes)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Focus: {day.focus}
                    </Typography>
                    {day.exercises && day.exercises.length > 0 && (
                      <Box pl={2}>
                        {day.exercises.map((exercise: any, exIndex: number) => (
                          <Typography key={exIndex} variant="body2">
                            • {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                          </Typography>
                        ))}
                      </Box>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Warmup: {day.warmup.duration} min — {day.warmup.description}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Cooldown: {day.cooldown.duration} min — {day.cooldown.description}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Nutrition Section */}
        {nutrition && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Nutrition Guidelines" />
            <CardContent>
              <Typography variant="body1">{nutrition.generalGuidelines}</Typography>
              <Typography variant="body2" color="text.secondary">
                Daily Protein Goal: {nutrition.dailyProteinGoal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meal Timing: {nutrition.mealTimingRecommendation}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Progression Section */}
        {progressionPlan && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Progression Plan" />
            <CardContent>
              {progressionPlan.weeklyAdjustments &&
                progressionPlan.weeklyAdjustments.map((adj: any, idx: number) => (
                  <Typography key={idx} variant="body2">
                    Week {adj.week}: {adj.adjustments}
                  </Typography>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {additionalNotes && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Additional Notes" />
            <CardContent>
              <Typography variant="body1">{additionalNotes}</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default PlanDetail;