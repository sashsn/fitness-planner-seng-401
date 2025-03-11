import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutPreferences, generateWorkoutPlan } from '../../services/workoutGeneratorService';
import { addWorkout } from '../workouts/workoutSlice';
import { Workout, WorkoutType } from '../../services/workoutService';

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
      calculatedDailyProtein?: number | null; // Add this property as optional
      dailyCalorieGoal?: string | null; // Add this property as optional
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
  async (preferences: WorkoutPreferences, { rejectWithValue, getState }) => {
    try {
      // Get user profile from state
      const state: any = getState();
      const userProfile = state.profile?.profile || {};
      
      // Add user profile data to preferences for personalized calculations
      const preferencesWithProfile = {
        ...preferences,
        userProfile: {
          weight: userProfile.weight || null,
          height: userProfile.height || null,
          age: userProfile.age || null,
          gender: userProfile.gender || null,
          weightUnit: userProfile.weightUnit || 'kg',
          heightUnit: userProfile.heightUnit || 'cm',
        }
      };
      
      console.log('📊 Adding user metrics to workout generation request:', 
        preferencesWithProfile.userProfile.weight ? 
        `Weight: ${preferencesWithProfile.userProfile.weight}${preferencesWithProfile.userProfile.weightUnit}` : 
        'No weight data');
      
      // Try to get from API 
      try {
        const response = await generateWorkoutPlan(preferencesWithProfile);
        return response;
      } catch (error: any) {
        // If error is specifically because mock API is enabled, use mock data
        if (error.message === 'MOCK_API_ENABLED' || 
            error.message.includes('Network error') || 
            error.message.includes('No response from server')) {
          console.log('Using mock workout generation due to API unavailability');
          return mockGenerateWorkout(preferencesWithProfile);
        }
        // Otherwise rethrow the error to be caught by the outer catch
        throw error;
      }
    } catch (error: any) {
      console.error('Error in generateWorkout thunk:', error);
      return rejectWithValue(error.message || 'Failed to generate workout plan');
    }
  }
);

// Mock function for development
const mockGenerateWorkout = (preferences: WorkoutPreferences & { userProfile?: any }): Promise<WorkoutPlan> => {
  console.log('Generating mock workout plan with preferences:', preferences);
  
  return new Promise((resolve) => {
    // Show a loading state for a more realistic experience
    setTimeout(() => {
      console.log('Mock workout plan generated successfully');
      
      // Calculate personalized values based on user profile data
      const userProfile = preferences.userProfile || {};
      let dailyProtein = 'Approximately 1g per pound of body weight';
      let calculatedProtein = null;
      let dailyCalories = null;
      
      if (userProfile.weight) {
        // Calculate protein based on weight
        const weightInLbs = userProfile.weightUnit === 'kg' ? 
          userProfile.weight * 2.20462 : userProfile.weight;
        calculatedProtein = Math.round(weightInLbs);
        dailyProtein = `${calculatedProtein}g (1g per pound of body weight)`;
        
        // Calculate calories if height and weight available
        if (userProfile.height) {
          const bmr = userProfile.gender === 'female' ? 
            655 + (9.6 * userProfile.weight) + (1.8 * userProfile.height) - (4.7 * (userProfile.age || 30)) :
            66 + (13.7 * userProfile.weight) + (5 * userProfile.height) - (6.8 * (userProfile.age || 30));
          
          const activityFactor = preferences.workoutDaysPerWeek >= 5 ? 1.725 : 
            preferences.workoutDaysPerWeek >= 3 ? 1.55 : 1.375;
            
          const tdee = Math.round(bmr * activityFactor);
          
          // Adjust calories based on goal
          const goalAdjustment = preferences.fitnessGoal === 'weightLoss' ? -500 :
            preferences.fitnessGoal === 'muscleGain' ? 300 : 0;
            
          dailyCalories = `${tdee + goalAdjustment} calories`;
        }
      }
      
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
            generalGuidelines: "Focus on protein intake and hydration. Ensure balanced meals with plenty of vegetables.",
            dailyProteinGoal: dailyProtein,
            calculatedDailyProtein: calculatedProtein, // Now allowed by interface
            dailyCalorieGoal: dailyCalories, // Now allowed by interface
            mealTimingRecommendation: "Eat within 2 hours after workout for optimal recovery. Space meals 3-4 hours apart throughout the day."
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
    }, 1500); // Add a delay to simulate API call
  });
};

// Add a new thunk for saving workouts
export const saveGeneratedWorkout = createAsyncThunk(
  'workoutGenerator/saveWorkout',
  async (workout: SavedWorkout, { dispatch }) => {
    try {
      console.log('📝 Workout Generator: Preparing to save workout plan:', workout.name);
      
      // Create a proper workout object with all required fields
      const workoutToSave = {
        name: workout.name,
        description: workout.workoutPlan.workoutPlan.overview.description,
        workoutType: 'AI Generated' as WorkoutType, // Ensure this exact string matches what's expected in the filter
        generatedPlan: JSON.stringify(workout.workoutPlan), // Stringify the plan for storage
        date: new Date().toISOString(),
        duration: parseInt(workout.workoutPlan.workoutPlan.overview.estimatedTimePerSession) || 0,
        isCompleted: false,
        userId: 'current-user', // Will be replaced by the backend with actual user ID
        intensity: 'medium',
        notes: workout.workoutPlan.workoutPlan.additionalNotes || '',
        exercises: [], // Initialize with empty array
        caloriesBurned: undefined
      };
      
      console.log('✅ Workout Generator: workoutToSave object created');
      console.log('🏷️ Workout Type:', workoutToSave.workoutType);
      console.log('📊 Plan size (bytes):', workoutToSave.generatedPlan.length);
      
      // Dispatch to add workout
      console.log('🚀 Workout Generator: Dispatching addWorkout action');
      const result = await dispatch(addWorkout(workoutToSave as Workout));
      
      if (addWorkout.rejected.match(result)) {
        console.error('❌ Workout Generator: Failed to save workout', result.payload);
        throw new Error(result.payload as string || 'Failed to save workout');
      } else {
        console.log('✅ Workout Generator: Workout saved successfully', result.payload);
      }
      
      return workout;
    } catch (error: any) {
      console.error('❌ Error in saveGeneratedWorkout:', error);
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
        // Log success for debugging
        console.log('Workout plan generated successfully and stored in state');
      })
      .addCase(generateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        // Log error for debugging
        console.error('Workout generation rejected with error:', state.error);
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
