import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { generateWorkoutPlan } from '../../services/workoutGeneratorService';
import GeneratedWorkoutDisplay from '../../components/workouts/GeneratedWorkoutDisplay';

// Define interface for form values
interface WorkoutPreferencesForm {
  fitnessGoal: string;
  experienceLevel: string;
  workoutDaysPerWeek: number;
  workoutDuration: number;
  availableDays: string[];
  preferredWorkoutTypes: string[];
  equipmentAccess: string;
  limitations: string;
  additionalNotes: string;
}

// Define the workout types options
const workoutTypes = [
  'Strength Training',
  'Cardio',
  'HIIT',
  'Yoga',
  'Pilates',
  'Bodyweight',
  'Crossfit'
];

// Define days of the week
const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const GenerateWorkout: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add a temporary mock implementation of the API call for testing
  const handleGenerateWorkout = async (values: WorkoutPreferencesForm) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock API call for testing - using setTimeout to simulate network delay
      setTimeout(() => {
        // Example response structure matching our expected JSON format
        const mockResponse = {
          workoutPlan: {
            metadata: {
              name: "Custom Fitness Plan",
              goal: values.fitnessGoal,
              fitnessLevel: values.experienceLevel,
              durationWeeks: 4,
              createdAt: new Date().toISOString()
            },
            overview: {
              description: "This is a personalized workout plan based on your preferences.",
              weeklyStructure: `${values.workoutDaysPerWeek} days per week, ~${values.workoutDuration} minutes per session`,
              recommendedEquipment: values.equipmentAccess === "none" ? ["Body weight"] : 
                                   values.equipmentAccess === "limited" ? ["Dumbbells", "Resistance bands", "Yoga mat"] :
                                   ["Barbell", "Dumbbells", "Machines", "Cardio equipment"],
              estimatedTimePerSession: `${values.workoutDuration} minutes`
            },
            schedule: [
              {
                week: 1,
                days: values.availableDays.map(day => {
                  const isCardioDay = Math.random() > 0.7;
                  if (isCardioDay) {
                    return {
                      dayOfWeek: day,
                      workoutType: "Cardio",
                      focus: "Endurance",
                      duration: values.workoutDuration,
                      exercises: [
                        {
                          name: "Running",
                          category: "Cardio",
                          targetMuscles: ["Legs", "Cardiovascular system"],
                          sets: 1,
                          reps: 1,
                          weight: "N/A",
                          restBetweenSets: 0,
                          notes: "Maintain steady pace",
                          alternatives: ["Cycling", "Elliptical"]
                        }
                      ],
                      warmup: {
                        duration: 5,
                        description: "Light jogging and dynamic stretches"
                      },
                      cooldown: {
                        duration: 5,
                        description: "Walking and static stretches"
                      }
                    };
                  } else {
                    return {
                      dayOfWeek: day,
                      workoutType: "Strength",
                      focus: "Full Body",
                      duration: values.workoutDuration,
                      exercises: [
                        {
                          name: "Push-ups",
                          category: "Strength",
                          targetMuscles: ["Chest", "Triceps", "Shoulders"],
                          sets: 3,
                          reps: 10,
                          weight: "Body weight",
                          restBetweenSets: 60,
                          notes: "Focus on form",
                          alternatives: ["Bench press", "Chest press machine"]
                        },
                        {
                          name: "Squats",
                          category: "Strength",
                          targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
                          sets: 3,
                          reps: 12,
                          weight: "Body weight",
                          restBetweenSets: 60,
                          notes: "Keep knees behind toes",
                          alternatives: ["Leg press", "Goblet squats"]
                        }
                      ],
                      warmup: {
                        duration: 5,
                        description: "Light cardio and dynamic stretches"
                      },
                      cooldown: {
                        duration: 5,
                        description: "Static stretches focusing on worked muscles"
                      }
                    };
                  }
                })
              }
            ],
            nutrition: {
              generalGuidelines: "Focus on protein intake and hydration",
              dailyProteinGoal: "1g per pound of body weight",
              mealTimingRecommendation: "Eat within 2 hours after workout"
            },
            progressionPlan: {
              weeklyAdjustments: [
                {
                  week: 2,
                  adjustments: "Increase weight or reps by 5-10%"
                }
              ]
            },
            additionalNotes: values.limitations ? 
              `Modified plan considering your limitations: ${values.limitations}` : 
              "Follow the plan consistently for best results"
          }
        };
        
        setGeneratedWorkout(JSON.stringify(mockResponse, null, 2));
        setIsLoading(false);
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  // Replace the formik onSubmit with our new function
  const formik = useFormik<WorkoutPreferencesForm>({
    initialValues: {
      fitnessGoal: 'general',
      experienceLevel: 'beginner',
      workoutDaysPerWeek: 3,
      workoutDuration: 30,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      preferredWorkoutTypes: ['Strength Training', 'Cardio'],
      equipmentAccess: 'limited',
      limitations: '',
      additionalNotes: ''
    },
    validationSchema: Yup.object({
      fitnessGoal: Yup.string().required('Please select a fitness goal'),
      experienceLevel: Yup.string().required('Please select your experience level'),
      workoutDaysPerWeek: Yup.number().min(1).max(7).required('Please specify workout days per week'),
      workoutDuration: Yup.number().min(10).required('Please specify workout duration'),
      availableDays: Yup.array().min(1, 'Select at least one day'),
      preferredWorkoutTypes: Yup.array().min(1, 'Select at least one workout type')
    }),
    onSubmit: handleGenerateWorkout
  });

  const handleDayToggle = (day: string) => {
    const currentDays = [...formik.values.availableDays];
    const currentIndex = currentDays.indexOf(day);
    
    if (currentIndex === -1) {
      currentDays.push(day);
    } else {
      currentDays.splice(currentIndex, 1);
    }
    
    formik.setFieldValue('availableDays', currentDays);
  };

  const handleWorkoutTypeToggle = (type: string) => {
    const currentTypes = [...formik.values.preferredWorkoutTypes];
    const currentIndex = currentTypes.indexOf(type);
    
    if (currentIndex === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(currentIndex, 1);
    }
    
    formik.setFieldValue('preferredWorkoutTypes', currentTypes);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Generate Custom Workout Plan
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          Fill out your preferences and we'll create a personalized workout plan for you
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Fitness Goal */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>Primary Fitness Goal</FormLabel>
                  <RadioGroup
                    name="fitnessGoal"
                    value={formik.values.fitnessGoal}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss" />
                    <FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain" />
                    <FormControlLabel value="endurance" control={<Radio />} label="Endurance" />
                    <FormControlLabel value="general" control={<Radio />} label="General Fitness" />
                  </RadioGroup>
                  {formik.touched.fitnessGoal && formik.errors.fitnessGoal && (
                    <Typography color="error">{formik.errors.fitnessGoal}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Experience Level */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel>Experience Level</FormLabel>
                  <RadioGroup
                    name="experienceLevel"
                    value={formik.values.experienceLevel}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value="beginner" control={<Radio />} label="Beginner" />
                    <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
                    <FormControlLabel value="advanced" control={<Radio />} label="Advanced" />
                  </RadioGroup>
                  {formik.touched.experienceLevel && formik.errors.experienceLevel && (
                    <Typography color="error">{formik.errors.experienceLevel}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Workout Days Per Week */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Workout Days Per Week"
                  name="workoutDaysPerWeek"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 7 } }}
                  value={formik.values.workoutDaysPerWeek}
                  onChange={formik.handleChange}
                  error={formik.touched.workoutDaysPerWeek && Boolean(formik.errors.workoutDaysPerWeek)}
                  helperText={formik.touched.workoutDaysPerWeek && formik.errors.workoutDaysPerWeek}
                />
              </Grid>

              {/* Workout Duration */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Workout Duration (minutes)"
                  name="workoutDuration"
                  type="number"
                  InputProps={{ inputProps: { min: 10, max: 120 } }}
                  value={formik.values.workoutDuration}
                  onChange={formik.handleChange}
                  error={formik.touched.workoutDuration && Boolean(formik.errors.workoutDuration)}
                  helperText={formik.touched.workoutDuration && formik.errors.workoutDuration}
                />
              </Grid>

              {/* Available Days */}
              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset">
                  <FormLabel component="legend">Available Days</FormLabel>
                  <FormGroup row>
                    {daysOfWeek.map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={formik.values.availableDays.includes(day)}
                            onChange={() => handleDayToggle(day)}
                            name={`availableDays-${day}`}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                  {formik.touched.availableDays && formik.errors.availableDays && (
                    <Typography color="error">{formik.errors.availableDays}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Preferred Workout Types */}
              <Grid item xs={12}>
                <FormControl fullWidth component="fieldset">
                  <FormLabel component="legend">Preferred Workout Types</FormLabel>
                  <FormGroup row>
                    {workoutTypes.map((type) => (
                      <FormControlLabel
                        key={type}
                        control={
                          <Checkbox
                            checked={formik.values.preferredWorkoutTypes.includes(type)}
                            onChange={() => handleWorkoutTypeToggle(type)}
                            name={`preferredWorkoutTypes-${type}`}
                          />
                        }
                        label={type}
                      />
                    ))}
                  </FormGroup>
                  {formik.touched.preferredWorkoutTypes && formik.errors.preferredWorkoutTypes && (
                    <Typography color="error">{formik.errors.preferredWorkoutTypes}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Equipment Access */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Equipment Access"
                    name="equipmentAccess"
                    value={formik.values.equipmentAccess}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="none">No Equipment (Bodyweight Only)</MenuItem>
                    <MenuItem value="limited">Limited (Basic Home Equipment)</MenuItem>
                    <MenuItem value="full">Full Gym Access</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              {/* Limitations or Injuries */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Limitations or Injuries (if any)"
                  name="limitations"
                  multiline
                  rows={2}
                  value={formik.values.limitations}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Additional Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes or Preferences"
                  name="additionalNotes"
                  multiline
                  rows={3}
                  value={formik.values.additionalNotes}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Generate Workout Plan'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Display generated workout or error */}
      {generatedWorkout && !error && (
        <Box mt={4}>
          <GeneratedWorkoutDisplay workoutPlanData={generatedWorkout} />
        </Box>
      )}

      {error && (
        <Box mt={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#fdeded' }}>
            <Typography color="error">Error: {error}</Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default GenerateWorkout;
