import api from './api';
import { formatISO } from 'date-fns';

// Helper function to retrieve the current user's ID from localStorage
const getUserId = (): string => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id;
};

export interface Exercise {
  id?: string;
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  restTime?: number;
  notes?: string;
}

export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'balance' | 'other' | 'AI Generated';

export interface Workout {
  id?: string;
  name: string;
  description: string;
  workoutType: WorkoutType;
  date: string | Date;
  exercises: Exercise[];
  duration?: number;
  isCompleted: boolean;
  userId: string;
  intensity: string;
  notes?: string;
  generatedPlan?: any;
  caloriesBurned?: number;
}

/**
 * Get all workouts for the current user.
 * Now calls GET /workouts/user/:userId.
 */
export const getUserWorkouts = async (): Promise<Workout[]> => {
  try {
    const userId = getUserId();
    const response = await api.get(`/workouts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

/**
 * Get a specific workout by ID.
 * This remains unchanged.
 */
export const getWorkoutById = async (id: string): Promise<Workout> => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

/**
 * Create a new workout.
 * Now calls POST /workouts/user/:userId.
 */
export const createWorkout = async (workoutData: Workout): Promise<Workout> => {
  const formattedData = {
    ...workoutData,
    date: workoutData.date instanceof Date 
      ? formatISO(workoutData.date) 
      : workoutData.date
  };
  
  const userId = getUserId();
  const response = await api.post(`/workouts/user/${userId}`, formattedData);
  return response.data;
};

/**
 * Update a workout.
 * Remains unchanged.
 */
export const updateWorkout = async (id: string, workoutData: Workout): Promise<Workout> => {
  const formattedData = {
    ...workoutData,
    date: workoutData.date instanceof Date 
      ? formatISO(workoutData.date) 
      : workoutData.date
  };
  
  const response = await api.put(`/workouts/${id}`, formattedData);
  return response.data;
};

/**
 * Delete a workout.
 * Remains unchanged.
 */
export const deleteWorkout = async (id: string): Promise<void> => {
  await api.delete(`/workouts/${id}`);
};

/**
 * Add an exercise to a workout.
 * Remains unchanged.
 */
export const addExerciseToWorkout = async (workoutId: string, exerciseData: Exercise): Promise<Exercise> => {
  const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
  return response.data;
};
