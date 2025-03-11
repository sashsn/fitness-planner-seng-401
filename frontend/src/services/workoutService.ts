import api from './api';
import { formatISO } from 'date-fns';

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
  duration?: number; // Make this optional
  isCompleted: boolean;
  userId: string;
  intensity: string;
  notes?: string;
  generatedPlan?: any; // Add this property to store AI-generated workout plan
  caloriesBurned?: number; // Add caloriesBurned property
}

/**
 * Get all workouts for the current user
 * @returns Promise with array of workouts
 */
export const getUserWorkouts = async (): Promise<Workout[]> => {
  try {
    const response = await api.get('/workouts');
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts, using mock data:', error);
    
    // Return mock data including an AI Generated workout
    return [
      {
        id: 'mock-1',
        name: 'Sample AI Workout',
        description: 'This is a sample AI generated workout',
        workoutType: 'AI Generated' as WorkoutType,
        date: new Date().toISOString(),
        exercises: [],
        duration: 45,
        isCompleted: false,
        userId: 'current-user',
        intensity: 'medium',
        notes: '',
        generatedPlan: JSON.stringify({
          workoutPlan: {
            metadata: {
              name: "Sample Workout Plan",
              goal: "Weight Loss",
              fitnessLevel: "Intermediate",
              durationWeeks: 4,
              createdAt: new Date().toISOString()
            },
            overview: {
              description: "A sample workout plan for testing",
              weeklyStructure: "3 days per week",
              recommendedEquipment: ["Dumbbells", "Mat"],
              estimatedTimePerSession: "45"
            },
            schedule: [{ week: 1, days: [] }],
            nutrition: {
              generalGuidelines: "Sample nutrition guidelines",
              dailyProteinGoal: "1g per pound of body weight",
              mealTimingRecommendation: "Every 3-4 hours"
            },
            progressionPlan: { weeklyAdjustments: [] },
            additionalNotes: "Sample additional notes"
          }
        })
      },
      {
        id: 'mock-2',
        name: 'Regular Workout',
        description: 'This is a regular workout',
        workoutType: 'strength' as WorkoutType,
        date: new Date().toISOString(),
        exercises: [],
        duration: 30,
        isCompleted: false,
        userId: 'current-user',
        intensity: 'medium',
        notes: ''
      }
    ];
  }
};

/**
 * Get a specific workout by ID
 * @param id Workout ID
 * @returns Promise with workout data
 */
export const getWorkoutById = async (id: string): Promise<Workout> => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

/**
 * Create a new workout
 * @param workoutData Workout data
 * @returns Promise with created workout
 */
export const createWorkout = async (workoutData: Workout): Promise<Workout> => {
  const formattedData = {
    ...workoutData,
    date: workoutData.date instanceof Date 
      ? formatISO(workoutData.date) 
      : workoutData.date
  };
  
  const response = await api.post('/workouts', formattedData);
  return response.data;
};

/**
 * Update a workout
 * @param id Workout ID
 * @param workoutData Updated workout data
 * @returns Promise with updated workout
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
 * Delete a workout
 * @param id Workout ID
 * @returns Promise
 */
export const deleteWorkout = async (id: string): Promise<void> => {
  await api.delete(`/workouts/${id}`);
};

/**
 * Add an exercise to a workout
 * @param workoutId Workout ID
 * @param exerciseData Exercise data
 * @returns Promise with created exercise
 */
export const addExerciseToWorkout = async (workoutId: string, exerciseData: Exercise): Promise<Exercise> => {
  const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
  return response.data;
};
