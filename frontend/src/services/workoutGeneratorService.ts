import axios from 'axios';
import { getAuthToken } from './authService';

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

/**
 * Generate a workout plan using OpenAI
 * @param preferences User's workout preferences
 * @returns Generated workout plan
 */
export const generateWorkoutPlan = async (preferences: WorkoutPreferences): Promise<any> => {
  try {
    // Check if we should use mock data (defined in .env)
    if (process.env.REACT_APP_MOCK_API === 'true') {
      console.log('Using mock API response for workout generation');
      // This will be handled by the thunk itself
      throw new Error('MOCK_API_ENABLED');
    }

    const token = getAuthToken();
    
    // Configure timeout to prevent long-hanging requests
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000 // 30 second timeout
    };
    
    console.log('Sending workout generation request to API...');
    const response = await axios.post('/api/ai/workout', preferences, config);
    
    console.log('Received workout plan from API');
    return response.data;
  } catch (error: any) {
    // Special case for mock API
    if (error.message === 'MOCK_API_ENABLED') {
      throw error;
    }
    
    // Log detailed error information
    console.error('Workout generation error:', error);
    
    // Handle error cases with more specific messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server might be overloaded. Please try again later.');
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
