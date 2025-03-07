import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'; // Import axios
import {
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  Workout,
  Exercise
} from '../../services/workoutService';

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  workouts: [],
  currentWorkout: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserWorkouts();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workouts');
    }
  }
);

export const fetchWorkoutById = createAsyncThunk(
  'workouts/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getWorkoutById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout');
    }
  }
);

export const addWorkout = createAsyncThunk(
  'workouts/add',
  async (workoutData: Workout, { rejectWithValue }) => {
    try {
      const data = await createWorkout(workoutData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workout');
    }
  }
);

export const editWorkout = createAsyncThunk(
  'workouts/edit',
  async ({ id, workout }: { id: string; workout: Workout }, { rejectWithValue }) => {
    try {
      const data = await updateWorkout(id, workout);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workout');
    }
  }
);

export const removeWorkout = createAsyncThunk(
  'workouts/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteWorkout(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workout');
    }
  }
);

export const addExercise = createAsyncThunk(
  'workouts/addExercise',
  async ({ workoutId, exercise }: { workoutId: string; exercise: Exercise }, { rejectWithValue }) => {
    try {
      const data = await addExerciseToWorkout(workoutId, exercise);
      return { workoutId, exercise: data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add exercise');
    }
  }
);

// Add this function if you need to add generated workouts to your existing workouts
export const addGeneratedWorkout = createAsyncThunk(
  'workouts/addGeneratedWorkout',
  async (workout: any, { rejectWithValue }) => {
    try {
      // Format the workout data for your API
      // First cast to unknown to avoid type errors when converting to Workout
      const workoutData = {
        name: workout.name,
        description: workout.description,
        workoutType: 'AI Generated',
        date: new Date().toISOString(),
        exercises: [], // You might extract exercises from the generated plan
        duration: workout.duration,
        generatedPlan: workout.generatedPlan, // Store the full AI-generated plan
        isCompleted: false, // Add the required property that was missing
        userId: 'current-user', // Add a placeholder or get from current user
        intensity: 'medium', // Add a default value
        notes: workout.additionalNotes || '' // Add any other required fields
      } as unknown as Workout; // Cast to unknown first, then to Workout
      
      // Call your API with axios instead of api
      const response = await axios.post('/api/workouts', workoutData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Workout slice
const workoutSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    clearWorkoutErrors: (state) => {
      state.error = null;
    },
    resetCurrentWorkout: (state) => {
      state.currentWorkout = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all workouts
    builder.addCase(fetchWorkouts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkouts.fulfilled, (state, action) => {
      state.workouts = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchWorkouts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch workout by id
    builder.addCase(fetchWorkoutById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkoutById.fulfilled, (state, action) => {
      state.currentWorkout = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchWorkoutById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add workout
    builder.addCase(addWorkout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addWorkout.fulfilled, (state, action) => {
      state.workouts.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addWorkout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit workout
    builder.addCase(editWorkout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editWorkout.fulfilled, (state, action) => {
      const index = state.workouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workouts[index] = action.payload;
      }
      state.currentWorkout = action.payload;
      state.loading = false;
    });
    builder.addCase(editWorkout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove workout
    builder.addCase(removeWorkout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeWorkout.fulfilled, (state, action) => {
      state.workouts = state.workouts.filter(w => w.id !== action.payload);
      state.loading = false;
      if (state.currentWorkout && state.currentWorkout.id === action.payload) {
        state.currentWorkout = null;
      }
    });
    builder.addCase(removeWorkout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add exercise
    builder.addCase(addExercise.fulfilled, (state, action) => {
      if (state.currentWorkout && state.currentWorkout.id === action.payload.workoutId) {
        if (!state.currentWorkout.exercises) {
          state.currentWorkout.exercises = [];
        }
        state.currentWorkout.exercises.push(action.payload.exercise);
      }
    });

    // Add generated workout
    builder.addCase(addGeneratedWorkout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addGeneratedWorkout.fulfilled, (state, action) => {
      state.workouts.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addGeneratedWorkout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearWorkoutErrors, resetCurrentWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;
