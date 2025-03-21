import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/profile/profileSlice';
import workoutsReducer from './features/workouts/workoutSlice';
import nutritionReducer from './features/nutrition/nutritionSlice';
import goalsReducer from './features/goals/goalSlice';
import workoutGeneratorReducer from './features/workoutGenerator/workoutGeneratorSlice';
import fitnessPlanReducer from './features/fitnessPlans/fitnessPlanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    workouts: workoutsReducer,
    nutrition: nutritionReducer,
    goals: goalsReducer,
    workoutGenerator: workoutGeneratorReducer,
    fitnessPlans: fitnessPlanReducer,
  },
  // Add middleware to log actions in development mode
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the date objects in action payloads for serialization checks
        ignoredActionPaths: ['meta.arg', 'payload.date', 'payload.dateOfBirth', 'payload.targetDate', 'payload.startDate'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
