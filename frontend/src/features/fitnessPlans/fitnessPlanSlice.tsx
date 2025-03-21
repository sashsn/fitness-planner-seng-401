// src/features/fitnessPlans/fitnessPlanSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {fetchFitnessPlanById , fetchFitnessPlans, deleteFitnessPlan, FitnessPlan } from '../../services/fitnessPlanService';

// Extend your state interface to include a selected plan:
interface FitnessPlanState {
    plans: FitnessPlan[];
    selectedPlan: FitnessPlan | null;  // new field for the single plan view
    loading: boolean;
    error: string | null;
  }
  
  const initialState: FitnessPlanState = {
    plans: [],
    selectedPlan: null,  // initialize as null
    loading: false,
    error: null,
  };
  
  // Create a new async thunk to get a single plan by id
  export const getFitnessPlanById = createAsyncThunk(
    'fitnessPlans/getFitnessPlanById',
    async (planId: string, { rejectWithValue }) => {
      try {
        const plan = await fetchFitnessPlanById(planId);
        return plan;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

export const getFitnessPlans = createAsyncThunk(
  'fitnessPlans/getFitnessPlans',
  async (_, { rejectWithValue }) => {
    try {
      const plans = await fetchFitnessPlans();
      return plans;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFitnessPlan = createAsyncThunk(
  'fitnessPlans/removeFitnessPlan',
  async (planId: string, { rejectWithValue }) => {
    try {
      await deleteFitnessPlan(planId);
      return planId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const fitnessPlanSlice = createSlice({
  name: 'fitnessPlans',
  initialState,
  reducers: {
    clearSelectedPlan: (state) => {
    state.selectedPlan = null;
    },
    },
  extraReducers: (builder) => {
    builder
      // Get Plans
      .addCase(getFitnessPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFitnessPlans.fulfilled, (state, action: PayloadAction<FitnessPlan[]>) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getFitnessPlans.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Plan
      .addCase(removeFitnessPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFitnessPlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.plans = state.plans.filter(plan => plan.id !== action.payload);
      })
      .addCase(removeFitnessPlan.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFitnessPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPlan = null;
      })
      .addCase(getFitnessPlanById.fulfilled, (state, action: PayloadAction<FitnessPlan>) => {
        state.loading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(getFitnessPlanById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedPlan } = fitnessPlanSlice.actions;
export default fitnessPlanSlice.reducer;
