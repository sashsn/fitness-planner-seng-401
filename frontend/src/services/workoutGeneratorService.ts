import axios from 'axios';
import { getAuthToken } from './authService'; // Assume this exists in your application

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
    const token = getAuthToken();
    const response = await axios.post('/api/ai/workout', preferences, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    // Handle error cases
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      throw new Error(error.response.data.message || 'Failed to generate workout plan');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};
