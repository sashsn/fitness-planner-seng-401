import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  FitnessGoal,
  GoalProgress
} from '../../services/goalService';

interface GoalState {
  goals: FitnessGoal[];
  currentGoal: FitnessGoal | null;
  loading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  currentGoal: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchGoals = createAsyncThunk(
  'goals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserGoals();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch goals');
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getGoalById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch goal');
    }
  }
);

export const addGoal = createAsyncThunk(
  'goals/add',
  async (goalData: FitnessGoal, { rejectWithValue }) => {
    try {
      const data = await createGoal(goalData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create goal');
    }
  }
);

export const editGoal = createAsyncThunk(
  'goals/edit',
  async ({ id, goal }: { id: string; goal: FitnessGoal }, { rejectWithValue }) => {
    try {
      const data = await updateGoal(id, goal);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update goal');
    }
  }
);

export const removeGoal = createAsyncThunk(
  'goals/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteGoal(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete goal');
    }
  }
);

export const trackGoalProgress = createAsyncThunk(
  'goals/trackProgress',
  async ({ id, progress }: { id: string; progress: GoalProgress }, { rejectWithValue }) => {
    try {
      const data = await updateGoalProgress(id, progress);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update goal progress');
    }
  }
);

// Goal slice
const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearGoalErrors: (state) => {
      state.error = null;
    },
    resetCurrentGoal: (state) => {
      state.currentGoal = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all goals
    builder.addCase(fetchGoals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGoals.fulfilled, (state, action) => {
      state.goals = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchGoals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch goal by id
    builder.addCase(fetchGoalById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGoalById.fulfilled, (state, action) => {
      state.currentGoal = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchGoalById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add goal
    builder.addCase(addGoal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addGoal.fulfilled, (state, action) => {
      if (!Array.isArray(state.goals)) {
        state.goals = []; // Ensure it's an array
      }
      state.goals.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addGoal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit goal
    builder.addCase(editGoal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editGoal.fulfilled, (state, action) => {
      const index = state.goals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
      state.currentGoal = action.payload;
      state.loading = false;
    });
    builder.addCase(editGoal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove goal
    builder.addCase(removeGoal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeGoal.fulfilled, (state, action) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
      state.loading = false;
      if (state.currentGoal && state.currentGoal.id === action.payload) {
        state.currentGoal = null;
      }
    });
    builder.addCase(removeGoal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Track goal progress
    builder.addCase(trackGoalProgress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(trackGoalProgress.fulfilled, (state, action) => {
      const index = state.goals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
      state.currentGoal = action.payload;
      state.loading = false;
    });
    builder.addCase(trackGoalProgress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearGoalErrors, resetCurrentGoal } = goalSlice.actions;
export default goalSlice.reducer;
