import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as workoutGeneratorService from '../../services/workoutGeneratorService';
import { WorkoutPreferences } from '../../services/workoutGeneratorService';

interface WorkoutGeneratorState {
  preferences: WorkoutPreferences | null;
  workoutPlan: any;
  loading: boolean;
  processingPlan: boolean;
  error: string | null;
  success: boolean;
  jobId: string | null;
  jobStatus: string | null;
  jobProgress: number;
  pollingActive: boolean;
  pollingStartTime: number | null; // Add timestamp tracking
  isCanceling: boolean;
  cancelSuccess: boolean;
}

const initialState: WorkoutGeneratorState = {
  preferences: null,
  workoutPlan: null,
  loading: false,
  processingPlan: false,
  error: null,
  success: false,
  jobId: null,
  jobStatus: null,
  jobProgress: 0,
  pollingActive: false,
  pollingStartTime: null,
  isCanceling: false,
  cancelSuccess: false
};

// Start workout generation - returns job ID
export const generateWorkout = createAsyncThunk(
  'workoutGenerator/generate',
  async (preferences: WorkoutPreferences, { dispatch, rejectWithValue }) => {
    try {
      // Start the job - this will return quickly with a job ID
      const response = await workoutGeneratorService.generateWorkoutPlan(preferences);
      
      // Start polling for job status
      if (response && response.jobId) {
        // Start polling after a short delay to ensure job has started
        setTimeout(() => {
          dispatch(startPollingJobStatus(response.jobId));
        }, 500);
      }
      
      return response;
    } catch (error: any) {
      console.error('Error generating workout:', error);
      return rejectWithValue(error.toString());
    }
  }
);

// Action to save the generated workout
export const saveGeneratedWorkout = createAsyncThunk(
  'workoutGenerator/saveWorkout',
  async (data: { plan: any, name: string }, { rejectWithValue }) => {
    try {
      const response = await workoutGeneratorService.saveWorkoutPlan(data.plan, data.name);
      return response;
    } catch (error: any) {
      console.error('Error saving workout:', error);
      return rejectWithValue(error.toString());
    }
  }
);

// New thunk to cancel a workout generation job
export const cancelWorkoutGeneration = createAsyncThunk(
  'workoutGenerator/cancel',
  async (jobId: string, { dispatch, rejectWithValue }) => {
    try {
      // First stop polling to avoid any race conditions
      dispatch(stopPollingJobStatus());
      
      // Then cancel the job on the server
      const response = await workoutGeneratorService.cancelWorkoutGeneration(jobId);
      return response;
    } catch (error: any) {
      console.error('Error canceling workout generation:', error);
      return rejectWithValue(error.toString());
    }
  }
);

// Polling thunk for job status with timeout tracking
export const pollJobStatus = createAsyncThunk(
  'workoutGenerator/pollJobStatus',
  async (jobId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      // Get current state
      const state = getState() as { workoutGenerator: WorkoutGeneratorState };
      
      // If polling is not active, don't continue
      if (!state.workoutGenerator.pollingActive) {
        return null;
      }
      
      // Add timeout tracking
      let pollingStartTime = state.workoutGenerator.pollingStartTime || Date.now();
      const currentTime = Date.now();
      const timeElapsed = currentTime - pollingStartTime;
      
      // If polling has been going for more than 5 minutes, timeout
      if (timeElapsed > 5 * 60 * 1000) {
        dispatch(stopPollingJobStatus());
        return rejectWithValue('Request timed out after 5 minutes. Please try again later.');
      }
      
      const response = await workoutGeneratorService.checkJobStatus(jobId);
      
      // If job is complete, stop polling and get the result
      if (response.status === 'completed') {
        dispatch(stopPollingJobStatus());
        try {
          const workoutPlan = await workoutGeneratorService.getJobResult(jobId);
          return { status: response.status, progress: 100, result: workoutPlan };
        } catch (resultError) {
          return rejectWithValue('Failed to retrieve workout plan. Please try again.');
        }
      }
      
      // If job failed, stop polling and report error
      if (response.status === 'failed') {
        dispatch(stopPollingJobStatus());
        return rejectWithValue(response.error || 'Job failed');
      }
      
      // Job is still in progress, continue polling
      if (response.status === 'processing') {
        // Use exponential backoff for polling intervals
        const backoffFactor = Math.min(10, Math.floor(timeElapsed / 10000) + 1);
        const delay = Math.min(10000, 1000 * backoffFactor);
        
        // Schedule next poll after delay
        setTimeout(() => {
          dispatch(pollJobStatus(jobId));
        }, delay);
        
        return { 
          status: response.status, 
          progress: response.progress || state.workoutGenerator.jobProgress 
        };
      }
      
      return response;
    } catch (error: any) {
      console.error('Error polling job status:', error);
      
      // Don't stop polling on temporary errors
      if (error.toString().includes('network') || error.toString().includes('timeout')) {
        setTimeout(() => {
          dispatch(pollJobStatus(jobId));
        }, 5000); // Longer retry on network errors
        return { status: 'error', progress: 0 };
      }
      
      dispatch(stopPollingJobStatus());
      return rejectWithValue(error.toString());
    }
  }
);

// Start polling
export const startPollingJobStatus = createAsyncThunk(
  'workoutGenerator/startPolling',
  async (jobId: string, { dispatch }) => {
    // Start polling immediately
    dispatch(setPollingActive(true));
    dispatch(pollJobStatus(jobId));
    return jobId;
  }
);

// Stop polling (used internally)
export const stopPollingJobStatus = () => (dispatch: any) => {
  dispatch(setPollingActive(false));
};

const workoutGeneratorSlice = createSlice({
  name: 'workoutGenerator',
  initialState,
  reducers: {
    setPreferences(state, action: PayloadAction<WorkoutPreferences>) {
      state.preferences = action.payload;
    },
    resetWorkoutGenerator(state) {
      state.workoutPlan = null;
      state.error = null;
      state.success = false;
      state.loading = false;
      state.jobId = null;
      state.jobStatus = null;
      state.jobProgress = 0;
      state.processingPlan = false;
      state.isCanceling = false;
      state.cancelSuccess = false;
      // Don't reset preferences
    },
    setPollingActive(state, action: PayloadAction<boolean>) {
      state.pollingActive = action.payload;
      if (action.payload) {
        state.pollingStartTime = Date.now();
      } else {
        state.pollingStartTime = null;
      }
    }
  },
  extraReducers: (builder) => {
    // Generate workout
    builder
      .addCase(generateWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.jobStatus = 'pending';
        state.jobProgress = 0;
        state.cancelSuccess = false;
      })
      .addCase(generateWorkout.fulfilled, (state, action) => {
        state.jobId = action.payload.jobId;
        // Don't set loading to false yet - we're still waiting for the job to complete
        // state.loading will be set to false when the job completes
      })
      .addCase(generateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.jobStatus = 'failed';
      });

    // Poll job status
    builder
      .addCase(pollJobStatus.pending, (state) => {
        // Don't change loading state here
      })
      .addCase(pollJobStatus.fulfilled, (state, action) => {
        if (!action.payload) return; // Skip if null (polling stopped)
        
        // Fix the destructuring pattern to handle missing result property
        const { status, progress } = action.payload;
        // Use type guard to check if result property exists
        const result = 'result' in action.payload ? action.payload.result : undefined;
        
        state.jobStatus = status;
        state.jobProgress = progress || state.jobProgress;
        
        // If job completed with result
        if (status === 'completed' && result) {
          state.loading = false;
          state.workoutPlan = result;
          state.processingPlan = true;
          state.success = true;
        }
      })
      .addCase(pollJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.jobStatus = 'failed';
      });

    // Start polling  
    builder
      .addCase(startPollingJobStatus.fulfilled, (state, action) => {
        state.pollingActive = true;
        state.jobId = action.payload;
      });

    // Cancel workout generation
    builder
      .addCase(cancelWorkoutGeneration.pending, (state) => {
        state.isCanceling = true;
      })
      .addCase(cancelWorkoutGeneration.fulfilled, (state) => {
        state.isCanceling = false;
        state.cancelSuccess = true;
        state.loading = false;
        state.jobStatus = 'canceled';
        state.jobProgress = 0;
      })
      .addCase(cancelWorkoutGeneration.rejected, (state, action) => {
        state.isCanceling = false;
        state.error = action.payload as string;
      });

    // Save workout
    builder
      .addCase(saveGeneratedWorkout.pending, (state) => {
        state.processingPlan = true;
      })
      .addCase(saveGeneratedWorkout.fulfilled, (state) => {
        state.processingPlan = false;
        state.success = true;
      })
      .addCase(saveGeneratedWorkout.rejected, (state, action) => {
        state.processingPlan = false;
        state.error = action.payload as string;
      });
  }
});

export const { setPreferences, resetWorkoutGenerator, setPollingActive } = workoutGeneratorSlice.actions;

export default workoutGeneratorSlice.reducer;
