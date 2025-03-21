import axios from 'axios';
import { getAuthToken } from './authService';
import api from './api';

// Define interface for workout preferences
export interface WorkoutPreferences {
  fitnessGoal: string;
  experienceLevel: string;
  workoutDaysPerWeek: number;
  workoutDuration: number;
  availableDays: string[];
  preferredWorkoutTypes: string[];
  equipmentAccess: string;
  limitations: string;
  additionalNotes: string;
}

const getUserId = (): string | null => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.id || null;
};

/**
 * Generate a workout plan using OpenAI
 * @param preferences User's workout preferences
 * @returns Generated workout plan
 */
export const generateWorkoutPlan = async (preferences: WorkoutPreferences): Promise<any> => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found. Please log in.");

    // Use actual API endpoint instead of mocking
    const token = getAuthToken();
    
    console.log('Sending workout generation request to API...');
    const response = await axios.post('/api/ai/workout', preferences);
    
    const workoutPlan = response.data;

    // Fire-and-forget: Call the save endpoint without awaiting the result.
    api.post('/fitnessPlan', { userId, planDetails: workoutPlan })
      .then(() => console.log('Workout plan saved successfully.'))
      .catch((saveError: any) => console.error('Error saving workout plan:', saveError));

    return response.data;


    
  } catch (error: any) {
    // Log detailed error information
    console.error('Workout generation error:', error);
    
    // Handle error cases with more specific messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The AI service might be overloaded. Please try again later.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Cannot connect to the server. Please check your internet connection and try again.');
    } else if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      const statusCode = error.response.status;
      let errorMessage = error.response.data?.message || 'An error occurred while generating the workout plan';
      
      if (statusCode === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (statusCode === 401) {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (statusCode === 500) {
        errorMessage = 'Server error. Our team has been notified. Please try again later.';
      }
      
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

/**
 * Check if the AI service is available
 * @returns Status of the AI service
 */
export const checkAIServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/api/ai/health', { timeout: 5000 });
    return response.data?.status === 'OK';
  } catch (error) {
    console.error('AI service health check failed:', error);
    return false;
  }
};
