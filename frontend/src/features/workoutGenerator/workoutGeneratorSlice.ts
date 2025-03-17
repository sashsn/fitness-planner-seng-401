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
      
      console.log('📊 Adding user metrics to workout generation request');
      
      // Call the actual API without fallbacks to mock data
      const response = await generateWorkoutPlan(preferencesWithProfile);
      return response;
    } catch (error: any) {
      console.error('Error in generateWorkout thunk:', error);
      return rejectWithValue(error.message || 'Failed to generate workout plan');
    }
  }
);

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
