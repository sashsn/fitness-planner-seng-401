import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutPreferences, generateWorkoutPlan } from '../../services/workoutGeneratorService';
import { addWorkout } from '../workouts/workoutSlice';

interface WorkoutPlan {
  workoutPlan: {
    metadata: {
      name: string;
      goal: string;
      fitnessLevel: string;
      durationWeeks: number;
      createdAt: string;
    };
    overview: {
      description: string;
      weeklyStructure: string;
      recommendedEquipment: string[];
      estimatedTimePerSession: string;
    };
    schedule: any[];
    nutrition: {
      generalGuidelines: string;
      dailyProteinGoal: string;
      mealTimingRecommendation: string;
    };
    progressionPlan: {
      weeklyAdjustments: any[];
    };
    additionalNotes: string;
  };
}

export interface SavedWorkout {
  id?: string;
  name: string;
  workoutPlan: WorkoutPlan;
}

interface WorkoutGeneratorState {
  workoutPlan: WorkoutPlan | null;
  preferences: WorkoutPreferences | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: WorkoutGeneratorState = {
  workoutPlan: null,
  preferences: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for generating a workout plan
export const generateWorkout = createAsyncThunk(
  'workoutGenerator/generate',
  async (preferences: WorkoutPreferences, { rejectWithValue }) => {
    try {
      // For development/testing, use a mock response
      if (process.env.REACT_APP_MOCK_API === 'true') {
        return mockGenerateWorkout(preferences);
      }
      
      // Real API call
      const response = await generateWorkoutPlan(preferences);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate workout plan');
    }
  }
);

// Mock function for development
const mockGenerateWorkout = (preferences: WorkoutPreferences): Promise<WorkoutPlan> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        workoutPlan: {
          metadata: {
            name: "Custom Fitness Plan",
            goal: preferences.fitnessGoal,
            fitnessLevel: preferences.experienceLevel,
            durationWeeks: 4,
            createdAt: new Date().toISOString()
          },
          overview: {
            description: "This is a personalized workout plan based on your preferences.",
            weeklyStructure: `${preferences.workoutDaysPerWeek} days per week, ~${preferences.workoutDuration} minutes per session`,
            recommendedEquipment: preferences.equipmentAccess === "none" ? ["Body weight"] : 
                                 preferences.equipmentAccess === "limited" ? ["Dumbbells", "Resistance bands", "Yoga mat"] :
                                 ["Barbell", "Dumbbells", "Machines", "Cardio equipment"],
            estimatedTimePerSession: `${preferences.workoutDuration} minutes`
          },
          schedule: [
            {
              week: 1,
              days: preferences.availableDays.map(day => {
                const isCardioDay = Math.random() > 0.7;
                if (isCardioDay) {
                  return {
                    dayOfWeek: day,
                    workoutType: "Cardio",
                    focus: "Endurance",
                    duration: preferences.workoutDuration,
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
                    duration: preferences.workoutDuration,
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
          additionalNotes: preferences.limitations ? 
            `Modified plan considering your limitations: ${preferences.limitations}` : 
            "Follow the plan consistently for best results"
        }
      });
    }, 1500);
  });
};

// Add a new thunk for saving workouts
export const saveGeneratedWorkout = createAsyncThunk(
  'workoutGenerator/saveWorkout',
  async (workout: SavedWorkout, { dispatch }) => {
    try {
      // Here we're just adding it to our workouts slice
      // You might want to save it to your backend as well
      dispatch(addWorkout({
        name: workout.name,
        description: workout.workoutPlan.workoutPlan.overview.description,
        workoutType: 'AI Generated',
        generatedPlan: workout.workoutPlan, // Store the full plan
        date: new Date().toISOString(),
        duration: parseInt(workout.workoutPlan.workoutPlan.overview.estimatedTimePerSession) || 0,
        isCompleted: false, // Add the required property
        userId: 'current-user', // Add a placeholder
        intensity: 'medium', // Add default value
        notes: workout.workoutPlan.workoutPlan.additionalNotes || '',
        exercises: [] // Initialize with empty array
      } as unknown as any)); // Use a safer type assertion
      
      return workout;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save workout');
    }
  }
);

const workoutGeneratorSlice = createSlice({
  name: 'workoutGenerator',
  initialState,
  reducers: {
    resetWorkoutGenerator: (state) => {
      state.workoutPlan = null;
      state.error = null;
      state.success = false;
    },
    setPreferences: (state, action: PayloadAction<WorkoutPreferences>) => {
      state.preferences = action.payload;
    },
    saveWorkout: (state, action: PayloadAction<SavedWorkout>) => {
      // You could store saved workouts in this slice if desired
      state.success = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(generateWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlan = action.payload;
        state.success = true;
      })
      .addCase(generateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(saveGeneratedWorkout.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveGeneratedWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(saveGeneratedWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save workout';
      });
  }
});

export const { resetWorkoutGenerator, setPreferences, saveWorkout } = workoutGeneratorSlice.actions;

export default workoutGeneratorSlice.reducer;
