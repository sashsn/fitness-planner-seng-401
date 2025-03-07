import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getNutritionSummary,
  Meal,
  NutritionSummary
} from '../../services/nutritionService';

interface NutritionState {
  meals: Meal[];
  currentMeal: Meal | null;
  nutritionSummary: NutritionSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: NutritionState = {
  meals: [],
  currentMeal: null,
  nutritionSummary: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMeals = createAsyncThunk(
  'nutrition/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserMeals();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meals');
    }
  }
);

export const fetchMealById = createAsyncThunk(
  'nutrition/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getMealById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meal');
    }
  }
);

export const addMeal = createAsyncThunk(
  'nutrition/add',
  async (mealData: Meal, { rejectWithValue }) => {
    try {
      const data = await createMeal(mealData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create meal');
    }
  }
);

export const editMeal = createAsyncThunk(
  'nutrition/edit',
  async ({ id, meal }: { id: string; meal: Meal }, { rejectWithValue }) => {
    try {
      const data = await updateMeal(id, meal);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meal');
    }
  }
);

export const removeMeal = createAsyncThunk(
  'nutrition/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteMeal(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meal');
    }
  }
);

export const fetchNutritionSummary = createAsyncThunk(
  'nutrition/summary',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      const data = await getNutritionSummary(startDate, endDate);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition summary');
    }
  }
);

// Nutrition slice
const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    clearNutritionErrors: (state) => {
      state.error = null;
    },
    resetCurrentMeal: (state) => {
      state.currentMeal = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all meals
    builder.addCase(fetchMeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMeals.fulfilled, (state, action) => {
      state.meals = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchMeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch meal by id
    builder.addCase(fetchMealById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMealById.fulfilled, (state, action) => {
      state.currentMeal = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchMealById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add meal
    builder.addCase(addMeal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addMeal.fulfilled, (state, action) => {
      state.meals.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addMeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit meal
    builder.addCase(editMeal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editMeal.fulfilled, (state, action) => {
      const index = state.meals.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.meals[index] = action.payload;
      }
      state.currentMeal = action.payload;
      state.loading = false;
    });
    builder.addCase(editMeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove meal
    builder.addCase(removeMeal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeMeal.fulfilled, (state, action) => {
      state.meals = state.meals.filter(m => m.id !== action.payload);
      state.loading = false;
      if (state.currentMeal && state.currentMeal.id === action.payload) {
        state.currentMeal = null;
      }
    });
    builder.addCase(removeMeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch nutrition summary
    builder.addCase(fetchNutritionSummary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNutritionSummary.fulfilled, (state, action) => {
      state.nutritionSummary = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchNutritionSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearNutritionErrors, resetCurrentMeal } = nutritionSlice.actions;
export default nutritionSlice.reducer;
