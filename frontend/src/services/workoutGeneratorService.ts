import api from './api';

// Define the interface for workout preferences
export interface WorkoutPreferences {
  fitnessGoal: string;
  experienceLevel: string;
  workoutDaysPerWeek: number;
  workoutDuration: number;
  availableDays: string[];
  preferredWorkoutTypes: string[];
  equipmentAccess: string;
  limitations?: string;
  additionalNotes?: string;
  userProfile?: {
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    weightUnit?: string;
    heightUnit?: string;
  };
}

/**
 * Generate a workout plan based on user preferences
 * Returns a job ID that can be used to check status
 * @param preferences User workout preferences
 * @returns Job ID for tracking the workout generation
 */
export const generateWorkoutPlan = async (preferences: WorkoutPreferences): Promise<{ jobId: string }> => {
  try {
    // Set a longer timeout for this request
    const response = await api.post('/ai/workout', preferences, {
      timeout: 120000, // 2 minute timeout
    });
    
    console.log('Workout generation job started:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error generating workout plan:', error);
    throw new Error(error.message || 'Failed to generate workout plan');
  }
};

/**
 * Check the status of a workout generation job
 * @param jobId The job ID returned from generateWorkoutPlan
 * @returns Job status information
 */
export const checkJobStatus = async (jobId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}> => {
  try {
    const response = await api.get(`/ai/workout/status/${jobId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error checking job status:', error);
    throw new Error(error.message || 'Failed to check job status');
  }
};

/**
 * Get the result of a completed workout generation job
 * @param jobId The job ID
 * @returns The generated workout plan
 */
export const getJobResult = async (jobId: string): Promise<any> => {
  try {
    const response = await api.get(`/ai/workout/result/${jobId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting job result:', error);
    throw new Error(error.message || 'Failed to get workout plan result');
  }
};

/**
 * Cancel a workout generation job
 * @param jobId The job ID to cancel
 * @returns Status of the cancellation request
 */
export const cancelWorkoutGeneration = async (jobId: string): Promise<{success: boolean, message: string}> => {
  try {
    const response = await api.delete(`/ai/workout/cancel/${jobId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error canceling job:', error);
    throw new Error(error.message || 'Failed to cancel workout generation');
  }
};

/**
 * Save a generated workout plan to the user's workouts
 * @param plan The generated workout plan
 * @param name Name for the workout plan
 */
export const saveWorkoutPlan = async (plan: any, name: string): Promise<any> => {
  try {
    const workoutData = {
      name,
      description: plan.workoutPlan.overview?.description || 'AI Generated Workout Plan',
      workoutType: 'AI Generated',
      date: new Date().toISOString(),
      generatedPlan: plan
    };
    
    const response = await api.post('/workouts', workoutData);
    return response.data;
  } catch (error: any) {
    console.error('Error saving workout plan:', error);
    throw new Error(error.message || 'Failed to save workout plan');
  }
};
